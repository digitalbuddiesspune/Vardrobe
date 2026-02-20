import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthFailure() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate('/signin', { replace: true }), 1500);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-rose-600 font-semibold mb-2">Google sign-in failed</div>
        <div className="text-gray-600">Redirecting to Sign In…</div>
      </div>
    </div>
  );
}
