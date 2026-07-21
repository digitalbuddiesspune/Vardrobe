import MobileBottomNav from '../components/MobileBottomNav';

// Import new components you'd need to create for a full landing page
import FeaturedProducts from '../components/FeaturedProducts'; 
import CategoryShowcase from '../components/CategoryShowcase';
import TrendingNow from '../components/TrendingNow';
import CacheConsent from '../components/CacheConsent';
import summerShortsBanner from '../assets/summer-shorts-banner.webp';
import mobileFashionSaleBanner from '../assets/mobile-fashion-sale-banner.webp';

const Home = () => {
  return (
    <div className="min-h-screen pt-0 pb-16 md:pb-0 mt-0 bg-white">
      {/* Summer Shorts Banner - Directly below the navbar */}
      <section className="w-full">
        <picture>
          <source media="(max-width: 767px)" srcSet={mobileFashionSaleBanner} />
          <img 
            src={summerShortsBanner}
            alt="Fashion sale collection"
            className="block w-full h-auto object-cover"
          />
        </picture>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Category Showcase - Quick navigation to key product lines */}
        <section className="py-6">
          <CategoryShowcase /> 
        </section>
        
        {/* Featured products */}
        <section className="py-6">
          <FeaturedProducts category="" layout="grid" /> 
        </section>
        
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