const jwt = require('jsonwebtoken');
const { one } = require('../db/db');

function signParentToken(parent) {
  return jwt.sign({ parentId: parent.id, email: parent.email }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
}

function requireParentAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing auth token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.parentId = decoded.parentId || decoded.id;
    if (!req.parentId) return res.status(401).json({ error: 'Invalid or expired token' });
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

async function requireAdmin(req, res, next) {
  try {
    if (!req.parentId) return res.status(401).json({ error: 'Missing auth token' });
    const parent = await one('SELECT id, role FROM parents WHERE id = $1', [req.parentId]);
    if (!parent) return res.status(401).json({ error: 'Account not found. Please log in again.' });
    if (parent.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.parentRole = 'admin';
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { signParentToken, requireParentAuth, requireAdmin };

