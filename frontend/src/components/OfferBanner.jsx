import React from 'react';

const OfferBanner = () => {
  // You can customize the offer text here - will scroll horizontally
  const offerText = "🎉 FLAT 50% OFF ON ALL PERFUMES - LIMITED TIME OFFER! 🚀 FREE SHIPPING ON ORDERS ABOVE ₹999 💎 NEW ARRIVALS: CHECK OUT OUR LATEST COLLECTION";

  return (
    <div className="bg-black text-white py-1 md:py-1.5 px-4 relative z-[75] overflow-hidden">
      <div className="relative">
        {/* Scrolling offer text */}
        <div className="flex items-center">
          <div className="animate-scroll whitespace-nowrap">
            <span className="text-xs sm:text-sm md:text-base font-medium tracking-wide inline-block px-4">
              {offerText} • {offerText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;

