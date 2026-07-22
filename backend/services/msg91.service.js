const SEND_URL = 'https://control.msg91.com/api/v5/otp';
const VERIFY_URL = 'https://control.msg91.com/api/v5/otp/verify';
const RETRY_URL = 'https://control.msg91.com/api/v5/otp/retry';

function requireConfig() {
  const authKey = process.env.MSG91_AUTH_KEY || '';
  const templateId = process.env.MSG91_TEMPLATE_ID || '';
  if (!authKey) {
    throw new Error('MSG91_AUTH_KEY is not configured');
  }
  if (!templateId) {
    throw new Error('MSG91_TEMPLATE_ID is not configured');
  }
  return { authKey, templateId };
}

export function toMsg91Mobile(mobile) {
  const digits = String(mobile || '').replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  throw new Error('Invalid mobile number');
}

export function isValidIndianMobile(mobile) {
  return /^[6-9]\d{9}$/.test(String(mobile || '').replace(/\D/g, '').slice(-10));
}

export function normalizeMobile(mobile) {
  return String(mobile || '').replace(/\D/g, '').slice(-10);
}

/**
 * Send OTP via MSG91 v5 API
 * Docs: https://docs.msg91.com/otp
 */
export async function sendOtp(mobile) {
  const { authKey, templateId } = requireConfig();
  const msgMobile = toMsg91Mobile(mobile);

  const res = await fetch(SEND_URL, {
    method: 'POST',
    headers: {
      authkey: authKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template_id: templateId,
      mobile: msgMobile,
      otp_length: 6,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (process.env.MSG91_DEBUG === 'true') {
    console.log('[MSG91] send OTP response:', JSON.stringify(data));
  }
  const ok =
    res.ok &&
    (data.type === 'success' ||
      String(data.message || '').toLowerCase().includes('otp sent'));

  if (!ok) {
    const msg = data.message || data.error || 'MSG91 failed to send OTP';
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  return {
    success: true,
    requestId: data.request_id || data.requestId || null,
    message: data.message || 'OTP sent successfully',
  };
}

/**
 * Verify OTP via MSG91 v5 API
 */
export async function verifyOtp(mobile, otp) {
  const { authKey } = requireConfig();
  const msgMobile = toMsg91Mobile(mobile);
  const url = `${VERIFY_URL}?otp=${encodeURIComponent(otp)}&mobile=${encodeURIComponent(msgMobile)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { authkey: authKey },
  });

  const data = await res.json().catch(() => ({}));
  if (process.env.MSG91_DEBUG === 'true') {
    console.log('[MSG91] verify OTP response:', JSON.stringify(data));
  }
  const ok =
    data.type === 'success' ||
    String(data.message || '').toLowerCase().includes('verified');

  return {
    success: ok,
    message: data.message || (ok ? 'OTP verified' : 'Invalid OTP'),
    raw: data,
  };
}

/**
 * Resend OTP via MSG91 v5 retry API
 */
export async function retryOtp(mobile, retryType = 'text') {
  const { authKey } = requireConfig();
  const msgMobile = toMsg91Mobile(mobile);

  const res = await fetch(RETRY_URL, {
    method: 'POST',
    headers: {
      authkey: authKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mobile: msgMobile,
      retrytype: retryType,
    }),
  });

  const data = await res.json().catch(() => ({}));
  const ok =
    res.ok &&
    (data.type === 'success' ||
      String(data.message || '').toLowerCase().includes('otp'));

  if (!ok) {
    throw new Error(data.message || 'Failed to resend OTP');
  }

  return { success: true, message: data.message || 'OTP resent successfully' };
}
