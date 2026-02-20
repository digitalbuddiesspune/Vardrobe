import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from '../config/passport.js';
import { signup, signin, forgotPassword, resetPassword, sendOTP, verifyOTP } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// OTP Login
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('name email isAdmin createdAt updatedAt');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ message: 'Failed to load profile' });
  }
});

// Google OAuth2
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}/auth/failure`,
    session: false
  }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = jwt.sign(
        { id: String(user._id), email: user.email, isAdmin: !!user.isAdmin },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const isProd =
        process.env.NODE_ENV === 'production' ||
        String(process.env.BACKEND_URL || '').startsWith('https://');

      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // ✅ Redirect to dynamic frontend URL
      return res.redirect(`${FRONTEND_URL}/auth/success`);
    } catch (e) {
      return res.redirect(`${FRONTEND_URL}/auth/failure`);
    }
  }
);

router.post('/logout', (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });
  // Best-effort clear for prod cookie flags too
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  return res.json({ message: 'Logged out' });
});

export default router;
