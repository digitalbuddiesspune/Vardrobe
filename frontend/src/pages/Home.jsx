import { Link } from 'react-router-dom';
import MobileBottomNav from '../components/MobileBottomNav';

// Import new components you'd need to create for a full landing page
import FeaturedProducts from '../components/FeaturedProducts'; 
import CategoryShowcase from '../components/CategoryShowcase';
import TrendingNow from '../components/TrendingNow';
import CacheConsent from '../components/CacheConsent';
import summerShortsBanner from '../assets/summer-shorts-banner.webp';

const Home = () => {
  return (
    // Added a container with padding for visual balance
    <div className="min-h-screen pt-0 pb-16 md:pb-0 mt-0 bg-gray-50">
      {/* Summer Shorts Banner - Directly below the navbar */}
      <section className="w-full">
        <img 
          src={summerShortsBanner}
          alt="Modern summer shorts collection"
          className="block w-full h-auto object-cover"
        />
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* 2. Category Showcase - Quick navigation to key product lines */}
        <section className="py-12">
          {/* This component shows icons or small images for the available categories. */}
          <CategoryShowcase /> 
        </section>

        <hr className="my-8 border-gray-200" />
        
        {/* Products Section without background */}
        <section className="py-6">
          <FeaturedProducts category="" layout="grid" /> 
        </section>

        {/* Shoes Products Section */}
        <section className="py-6">
          <FeaturedProducts category="Shoes" layout="grid" /> 
          {/* Explore More Button */}
          <div className="flex justify-center mt-8 mb-4">
            <Link
              to="/category/shoes"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold text-sm md:text-base uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore more shoes
            </Link>
          </div>
        </section>

        {/* You could add more sections here like Testimonials, Instagram Feed, or Brand Story */}
        
      </main>

      {/* Trending Now Section */}
      <TrendingNow />

      {/* 5. Mobile Bottom Navigation - Kept at the bottom for mobile UX */}
      <MobileBottomNav />

      {/* Cache Consent Banner - Shows only once */}
      <CacheConsent />
    </div>
  );
};

export default Home;   