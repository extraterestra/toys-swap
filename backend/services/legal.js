const { configuredAdminEmails } = require('./adminEmails');

const LEGAL_PACK_VERSION = '2026-08-21.2';

const LEGAL_DOCUMENTS = [
  { id: 'privacy', route: 'privacy' },
  { id: 'terms', route: 'terms' },
  { id: 'safety', route: 'safety' },
  { id: 'rules', route: 'rules' }
];

const REPORT_REASONS = [
  'unsafe_item',
  'child_in_photo',
  'prohibited',
  'hygiene',
  'harassment',
  'other'
];

const SUBJECT_TYPES = ['listing', 'exchange', 'message', 'family'];

function isAccepted(value) {
  return value === true || value === 'true' || value === 'on' || value === '1';
}

function supportContact() {
  const email = String(process.env.SUPPORT_EMAIL || configuredAdminEmails()[0] || '').trim();
  const hours = parseInt(process.env.SUPPORT_RESPONSE_HOURS || '48', 10);
  return {
    email: email || null,
    response_hours: Number.isFinite(hours) && hours > 0 ? hours : 48,
    emergency: '112'
  };
}

function legalMeta() {
  return {
    policy_version: LEGAL_PACK_VERSION,
    legal_pack_version: LEGAL_PACK_VERSION,
    documents: LEGAL_DOCUMENTS.map((doc) => ({
      ...doc,
      version: LEGAL_PACK_VERSION
    })),
    support: supportContact(),
    report_reasons: REPORT_REASONS
  };
}

const AGREEMENTS_TEXT = {
  pl: `Akceptuję wymagane dokumenty ToySwap (Prywatność, Regulamin, Bezpieczeństwo rodziny, Zasady społeczności) w wersji ${LEGAL_PACK_VERSION}. Zgoda nie obejmuje marketingu — ToySwap nie wysyła ofert marketingowych.`,
  en: `I accept ToySwap’s required documents (Privacy, Terms, Family Safety, Community Rules) version ${LEGAL_PACK_VERSION}. This is not marketing consent — ToySwap does not send marketing.`
};

module.exports = {
  LEGAL_PACK_VERSION,
  LEGAL_DOCUMENTS,
  REPORT_REASONS,
  SUBJECT_TYPES,
  isAccepted,
  supportContact,
  legalMeta,
  AGREEMENTS_TEXT
};
