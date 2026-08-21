function configuredAdminEmails() {
  return `${process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || ''}`
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isConfiguredAdminEmail(email) {
  return configuredAdminEmails().includes(String(email || '').trim().toLowerCase());
}

module.exports = { configuredAdminEmails, isConfiguredAdminEmail };
