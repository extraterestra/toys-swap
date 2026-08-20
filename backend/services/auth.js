const jwt = require('jsonwebtoken');

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
    req.parentId = decoded.parentId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { signParentToken, requireParentAuth };
