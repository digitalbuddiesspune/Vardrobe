function getBaseUrl() {
  return String(process.env.MSG91_BASE_URL || 'https://control.msg91.com/api/v5').replace(/\/$/, '');
}

function getUrls() {
  const base = getBaseUrl();
  return {
    send: `${base}/otp`,
    verify: `${base}/otp/verify`,
    retry: `${base}/otp/retry`,
  };
}

function requireConfig() {
  const authKey = process.env.MSG91_AUTH_KEY || '';
  const templateId = process.env.MSG91_TEMPLATE_ID || '';
  if (!authKey) {
    throw new Error('MSG91_AUTH_KEY is not configured');
  }
  if (!templateId) {
    throw new Error('MSG91_TEMPLATE_ID is not configured');
  }
  return {
    authKey,
    templateId,
    senderId: process.env.MSG91_SENDER_ID || '',
    useSender: process.env.MSG91_USE_SENDER === 'true',
  };
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
  const { authKey, templateId, senderId, useSender } = requireConfig();
  const msgMobile = toMsg91Mobile(mobile);
  const { send: sendUrl } = getUrls();

  const payload = {
    template_id: templateId,
    mobile: msgMobile,
    otp_length: 6,
  };
  if (useSender && senderId) {
    payload.sender = senderId;
  }

  const res = await fetch(sendUrl, {
    method: 'POST',
    headers: {
      authkey: authKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (process.env.MSG91_DEBUG === 'true') {
    console.log('[MSG91] send OTP →', sendUrl, JSON.stringify(data));
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
  const { verify: verifyUrl } = getUrls();
  const url = `${verifyUrl}?otp=${encodeURIComponent(otp)}&mobile=${encodeURIComponent(msgMobile)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { authkey: authKey },
  });

  const data = await res.json().catch(() => ({}));
  if (process.env.MSG91_DEBUG === 'true') {
    console.log('[MSG91] verify OTP →', verifyUrl, JSON.stringify(data));
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
  const { retry: retryUrl } = getUrls();

  const res = await fetch(retryUrl, {
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
  if (process.env.MSG91_DEBUG === 'true') {
    console.log('[MSG91] retry OTP →', retryUrl, JSON.stringify(data));
  }
  const ok =
    res.ok &&
    (data.type === 'success' ||
      String(data.message || '').toLowerCase().includes('otp'));

  if (!ok) {
    throw new Error(data.message || 'Failed to resend OTP');
  }

  return { success: true, message: data.message || 'OTP resent successfully' };
}
