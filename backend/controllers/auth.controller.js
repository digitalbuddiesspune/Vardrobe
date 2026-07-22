import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import {
  sendOtp as msg91SendOtp,
  verifyOtp as msg91VerifyOtp,
  retryOtp as msg91RetryOtp,
  isValidIndianMobile,
  normalizeMobile,
} from '../services/msg91.service.js';

function generateJwt(userId) {
  const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_me';
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
}

function userPayload(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email || null,
    phone: user.phone || null,
    isAdmin: !!user.isAdmin,
  };
}

export async function signup(req, res) {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    if (phone) {
      const mobile = normalizeMobile(phone);
      const phoneTaken = await User.findOne({ phone: mobile });
      if (phoneTaken) return res.status(409).json({ message: 'Phone number already registered' });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      ...(phone ? { phone: normalizeMobile(phone) } : {}),
    });

    const token = generateJwt(user.id);
    return res.status(201).json({
      message: 'Account created',
      user: userPayload(user),
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Signup failed', error: err.message });
  }
}

export async function signin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateJwt(user.id);
    return res.json({
      message: 'Signed in',
      user: userPayload(user),
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Signin failed', error: err.message });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If account exists, email sent' });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 30);
    user.resetPasswordToken = token;
    user.resetPasswordExpiresAt = expires;
    await user.save();

    return res.json({ message: 'Reset token generated', token });
  } catch (err) {
    return res.status(500).json({ message: 'Forgot password failed', error: err.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.passwordHash = await User.hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    return res.json({ message: 'Password updated' });
  } catch (err) {
    return res.status(500).json({ message: 'Reset password failed', error: err.message });
  }
}

/** Send OTP via MSG91 (signin / signup) */
export async function sendOTP(req, res) {
  try {
    const { mobile, purpose = 'signin', email } = req.body;
    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    const normalizedMobile = normalizeMobile(mobile);
    if (!isValidIndianMobile(normalizedMobile)) {
      return res.status(400).json({
        message: 'Invalid mobile number. Please enter a valid 10-digit mobile number.',
      });
    }

    if (purpose === 'signup') {
      if (email) {
        const emailExists = await User.findOne({ email: String(email).toLowerCase().trim() });
        if (emailExists) {
          return res.status(409).json({ message: 'Email already registered' });
        }
      }
      const phoneExists = await User.findOne({ phone: normalizedMobile });
      if (phoneExists) {
        return res.status(409).json({ message: 'Phone number already registered' });
      }
    }

    if (purpose === 'signin') {
      const user = await User.findOne({ phone: normalizedMobile });
      if (!user) {
        return res.status(404).json({
          message: 'No account found with this number. Please sign up first.',
        });
      }
    }

    await msg91SendOtp(normalizedMobile);

    return res.json({
      message: 'OTP sent successfully to your mobile number',
      mobile: normalizedMobile,
    });
  } catch (err) {
    console.error('Send OTP error:', err?.message || err);
    return res.status(500).json({
      message: err?.message || 'Failed to send OTP. Please try again.',
    });
  }
}

/** Resend OTP via MSG91 */
export async function resendOTP(req, res) {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ message: 'Mobile number is required' });

    const normalizedMobile = normalizeMobile(mobile);
    if (!isValidIndianMobile(normalizedMobile)) {
      return res.status(400).json({ message: 'Invalid mobile number' });
    }

    await msg91RetryOtp(normalizedMobile);
    return res.json({ message: 'OTP resent successfully' });
  } catch (err) {
    console.error('Resend OTP error:', err?.message || err);
    return res.status(500).json({ message: err?.message || 'Failed to resend OTP' });
  }
}

/** Verify MSG91 OTP — signin or signup */
export async function verifyOTP(req, res) {
  try {
    const { mobile, otp, purpose = 'signin', name, email, password } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }

    const normalizedMobile = normalizeMobile(mobile);
    if (!isValidIndianMobile(normalizedMobile)) {
      return res.status(400).json({ message: 'Invalid mobile number' });
    }

    const verified = await msg91VerifyOtp(normalizedMobile, String(otp).trim());
    if (!verified.success) {
      return res.status(400).json({ message: verified.message || 'Invalid or expired OTP' });
    }

    let user = await User.findOne({ phone: normalizedMobile });

    if (purpose === 'signup') {
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required for signup' });
      }

      const emailNorm = String(email).toLowerCase().trim();
      const emailExists = await User.findOne({ email: emailNorm });
      if (emailExists && emailExists.phone !== normalizedMobile) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const passwordHash = await User.hashPassword(password);

      if (user) {
        user.name = name;
        user.email = emailNorm;
        user.passwordHash = passwordHash;
        await user.save();
      } else {
        user = await User.create({
          name,
          email: emailNorm,
          phone: normalizedMobile,
          passwordHash,
          provider: 'local',
        });
      }

      const token = generateJwt(user.id);
      return res.status(201).json({
        message: 'Account created successfully',
        user: userPayload(user),
        token,
      });
    }

    // signin
    if (!user) {
      return res.status(404).json({
        message: 'No account found with this number. Please sign up first.',
      });
    }

    const token = generateJwt(user.id);
    return res.json({
      message: 'Login successful',
      user: userPayload(user),
      token,
    });
  } catch (err) {
    console.error('Verify OTP error:', err?.message || err);
    return res.status(500).json({ message: 'Failed to verify OTP', error: err.message });
  }
}

export default {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  sendOTP,
  resendOTP,
  verifyOTP,
};
