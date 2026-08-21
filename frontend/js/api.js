const API_BASE = '/api';

function getToken() { return localStorage.getItem('ts_token'); }
function setToken(t) { localStorage.setItem('ts_token', t); }
function clearToken() { localStorage.removeItem('ts_token'); }

async function api(path, { method = 'GET', body = null, isForm = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isForm && body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : (body ? JSON.stringify(body) : undefined)
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    if (res.status === 401) clearToken();
    const raw = (data && data.error) ? data.error : null;
    const message = raw
      ? (typeof tError === 'function' ? tError(raw) : raw)
      : (typeof t === 'function' ? t('common.requestFailed', { status: res.status }) : `Request failed (${res.status})`);
    throw new Error(message);
  }
  return data;
}
