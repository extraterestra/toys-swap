const fs = require('fs');

/**
 * Evaluates a toy/book photo and returns:
 *   { score: 1-10, label: string, description: string, exchangeable: boolean }
 *
 * If ANTHROPIC_API_KEY is set in the environment, this calls the real
 * Claude vision API to assess the item from the photo. Otherwise it falls
 * back to a deterministic-ish mock so the app is fully runnable offline.
 *
 * NOTE for production: before wiring this up for real, run every uploaded
 * photo through a dedicated child-safety image moderation pass FIRST
 * (this file does not do that - see moderation_status stub on items).
 */
async function evaluateItemPhoto({ filePath, mimeType, category, title }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey && fs.existsSync(filePath)) {
    try {
      return await evaluateWithClaude({ filePath, mimeType, category, title, apiKey });
    } catch (err) {
      console.error('AI evaluation via Claude failed, falling back to mock:', err.message);
      return mockEvaluate({ category, title });
    }
  }

  return mockEvaluate({ category, title });
}

async function evaluateWithClaude({ filePath, mimeType, category, title, apiKey }) {
  const imageBuffer = fs.readFileSync(filePath);
  const base64Image = imageBuffer.toString('base64');

  const systemPrompt = `You are a friendly assistant helping assess the physical condition of a child's ${category} ("${title}") from a photo, for a kids' toy/book exchange platform.
Respond ONLY with strict JSON, no markdown fences, no preamble, in this exact shape:
{"score": <integer 1-10, 10 = like new>, "label": "<one of: Like new, Good, Fair, Worn, Not exchangeable>", "description": "<one warm, child-friendly sentence describing the item, max 25 words>", "exchangeable": <true|false>}
Mark exchangeable=false only if the item appears broken, unsafe, or missing essential parts.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mimeType || 'image/jpeg', data: base64Image } },
            { type: 'text', text: 'Assess this item and respond with the JSON only.' }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const textBlock = (data.content || []).find(b => b.type === 'text');
  if (!textBlock) throw new Error('No text content in Claude response');

  const cleaned = textBlock.text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  return {
    score: Math.max(1, Math.min(10, parseInt(parsed.score, 10) || 5)),
    label: parsed.label || 'Good',
    description: parsed.description || `A ${category} in usable condition.`,
    exchangeable: parsed.exchangeable !== false
  };
}

function mockEvaluate({ category, title }) {
  // Deterministic-ish mock so demos look reasonable without an API key.
  const score = 6 + Math.floor(Math.random() * 4); // 6-9
  const labels = { 8: 'Like new', 7: 'Good', 6: 'Fair', 9: 'Like new' };
  return {
    score,
    label: labels[score] || 'Good',
    description: `A ${category} called "${title}" in usable condition. Condition is a pilot estimate, not a professional appraisal.`,
    exchangeable: true
  };
}

module.exports = { evaluateItemPhoto };
