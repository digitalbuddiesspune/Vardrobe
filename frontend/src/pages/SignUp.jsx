import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { FiPhone } from 'react-icons/fi';

const SignUp = () => {
  const [step, setStep] = useState('details'); // 'details' | 'otp'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const [loading, setLoading] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const mobileRegex = /^[6-9]\d{9}$/;

  const startTimer = () => {
    setOtpTimer(600);
    const timerInterval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateDetails = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!mobileRegex.test(formData.phone.replace(/\D/g, '').slice(-10))) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }
    return true;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateDetails()) return;

    const mobile = formData.phone.replace(/\D/g, '').slice(-10);
    setSendingOTP(true);
    try {
      const resp = await api.sendOTP({
        mobile,
        purpose: 'signup',
        email: formData.email,
      });
      setSuccess(resp.message || 'OTP sent to your mobile');
      setStep('otp');
      startTimer();
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!otp || otp.length < 4) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const mobile = formData.phone.replace(/\D/g, '').slice(-10);
      const resp = await api.verifyOTP({
        mobile,
        otp,
        purpose: 'signup',
        name,
        email: formData.email,
        password: formData.password,
      });

      if (resp?.token) localStorage.setItem('auth_token', resp.token);
      if (resp?.user?.isAdmin) {
        localStorage.setItem('auth_is_admin', 'true');
      } else {
        localStorage.removeItem('auth_is_admin');
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSendingOTP(true);
    try {
      const mobile = formData.phone.replace(/\D/g, '').slice(-10);
      const resp = await api.resendOTP({ mobile });
      setSuccess(resp.message || 'OTP resent');
      startTimer();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setSendingOTP(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      <div className="flex h-screen">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 items-center justify-center">
          <div className="text-center">
            <Link to="/" className="inline-block mb-8">
              <h1 className="text-6xl font-serif font-bold text-black">VARDROBE</h1>
            </Link>
            <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
              Create your account and explore premium fashion with exclusive offers.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-block mb-6">
                <h1 className="text-3xl font-serif font-bold text-black">VARDROBE</h1>
              </Link>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-semibold text-neutral-800 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">
                {step === 'details'
                  ? 'Fill in your details — we\'ll verify your phone with OTP'
                  : 'Enter the OTP sent to your mobile'}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100">
              {error && <div className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
              {success && <div className="mb-3 text-sm text-green-600 bg-green-50 p-3 rounded-lg">{success}</div>}

              {step === 'details' ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1">
                      <FiPhone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      maxLength="10"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                        placeholder="Create password"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                      className="h-4 w-4 text-rose-500 focus:ring-rose-400 border-neutral-300 rounded mt-0.5"
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 text-xs text-gray-600">
                      I agree to the{' '}
                      <Link to="/terms" className="text-rose-500 hover:text-rose-600">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-rose-500 hover:text-rose-600">Privacy Policy</Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={sendingOTP}
                    className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-sm disabled:opacity-60"
                  >
                    {sendingOTP ? 'Sending OTP...' : 'Send OTP & Continue'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyAndSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Mobile Number
                    </label>
                    <div className="px-3 py-2 border border-neutral-200 rounded-lg bg-gray-50 text-gray-600">
                      +91 {formData.phone.replace(/\D/g, '').slice(-10)}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('details');
                        setOtp('');
                        setError('');
                        setSuccess('');
                      }}
                      className="mt-1 text-xs text-rose-500 hover:text-rose-600"
                    >
                      Change details
                    </button>
                  </div>

                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength="6"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 text-center text-2xl tracking-widest"
                      placeholder="000000"
                    />
                    {otpTimer > 0 && (
                      <p className="mt-2 text-xs text-gray-500 text-center">
                        OTP expires in: <span className="font-semibold text-rose-600">{formatTimer(otpTimer)}</span>
                      </p>
                    )}
                    {(otpTimer === 0) && (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={sendingOTP}
                        className="mt-2 text-xs text-rose-500 hover:text-rose-600 font-medium"
                      >
                        {sendingOTP ? 'Resending...' : 'Resend OTP'}
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-sm disabled:opacity-60"
                  >
                    {loading ? 'Creating Account...' : 'Verify OTP & Create Account'}
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-rose-500 hover:text-rose-600 font-semibold">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
