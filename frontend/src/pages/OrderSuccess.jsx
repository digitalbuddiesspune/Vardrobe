import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaArrowRight } from 'react-icons/fa';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const orderId = location.state?.orderId || null;
  const orderNumber = location.state?.orderNumber || null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/profile?tab=orders', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoToOrders = () => {
    navigate('/profile?tab=orders', { replace: true });
  };

  const handleContinueShopping = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <FaCheckCircle className="relative text-green-500 text-6xl md:text-7xl" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="text-lg text-gray-600 mb-2">
          Thank you for your order. We've received your order and will begin processing it right away.
        </p>

        {orderId && (
          <p className="text-sm text-gray-500 mb-8">
            Order ID: <span className="font-mono font-semibold">{orderId}</span>
          </p>
        )}

        {/* Order Info Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaShoppingBag className="text-amber-700 text-2xl" />
            <h2 className="text-xl font-semibold text-amber-900">Cash on Delivery</h2>
          </div>
          <p className="text-amber-800 text-sm">
            Your order will be delivered to your address. Please keep the exact cash ready for payment when the delivery arrives.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={handleGoToOrders}
            className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            View My Orders
            <FaArrowRight className="text-sm" />
          </button>
          <button
            onClick={handleContinueShopping}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Auto-redirect notice */}
        <p className="text-sm text-gray-500">
          Redirecting to orders page in <span className="font-semibold text-gray-700">{countdown}</span> seconds...
        </p>
      </div>
    </div>
  );
}


