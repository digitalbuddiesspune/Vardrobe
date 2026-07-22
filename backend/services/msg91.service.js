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
  const authKey = (process.env.MSG91_AUTH_KEY || '').trim();
  const templateId = (process.env.MSG91_TEMPLATE_ID || '').trim();
  if (!authKey) {
    throw new Error('MSG91_AUTH_KEY is not configured');
  }
  if (!templateId) {
    throw new Error('MSG91_TEMPLATE_ID is not configured');
  }
  return {
    authKey,
    templateId,
    senderId: (process.env.MSG91_SENDER_ID || '').trim(),
    useSender: process.env.MSG91_USE_SENDER === 'true',
    brandName: (process.env.MSG91_BRAND_NAME || 'VARDROBE').trim(),
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
 * Send OTP via MSG91 v5 — template_id MUST be in query string.
 * Also put template_id in JSON body as a safeguard.
 */
export async function sendOtp(mobile) {
  const { authKey, templateId, senderId, useSender, brandName } = requireConfig();
  const msgMobile = toMsg91Mobile(mobile);
  const { send: sendUrl } = getUrls();

  const params = new URLSearchParams({
    template_id: templateId,
    mobile: msgMobile,
    otp_length: '6',
    otp_expiry: '5',
  });
  if (useSender && senderId) {
    params.set('sender', senderId);
  }

  // Body also carries template_id (some MSG91 setups read it from body)
  const body = {
    template_id: templateId,
    mobile: msgMobile,
  };
  if (useSender && senderId) {
    body.sender = senderId;
  }

  const url = `${sendUrl}?${params.toString()}`;

  console.log('[MSG91] SEND using template_id=', templateId, 'mobile=', msgMobile, 'sender=', senderId || '-');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      authkey: authKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  console.log('[MSG91] SEND response:', JSON.stringify(data));

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
    templateId,
  };
}

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
  console.log('[MSG91] VERIFY response:', JSON.stringify(data));

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
 * Always do a fresh SEND (not MSG91 retry).
 * Retry reuses the previous OTP session/template — can keep sending AAKDA text.
 */
export async function retryOtp(mobile) {
  return sendOtp(mobile);
}
