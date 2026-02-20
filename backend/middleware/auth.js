import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  let token = (req.cookies && (req.cookies.jwt || req.cookies.token)) || null;
  if (!token) {
    const header = req.headers.authorization || '';
    const parts = header.split(' ');
    token = parts.length === 2 && /^Bearer$/i.test(parts[0]) ? parts[1] : null;
  }
  if (!token) return res.status(401).json({ error: 'No token provided', message: 'No token provided' });
  try {
    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const payload = jwt.verify(token, secret);
    req.userId = payload.id || payload._id || payload.userId;
    if (!req.userId) return res.status(401).json({ error: 'Invalid token', message: 'Invalid token' });
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token', message: 'Invalid token' });
  }
}
