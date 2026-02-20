import User from '../models/User.js';

export default async function adminOnly(req, res, next) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId).select('isAdmin');
    if (!user || !user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
    next();
  } catch (e) {
    return res.status(500).json({ message: 'Authorization failed' });
  }
}
