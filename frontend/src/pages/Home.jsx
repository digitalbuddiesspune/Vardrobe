import MobileBottomNav from '../components/MobileBottomNav';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoryShowcase from '../components/CategoryShowcase';
import TrendingNow from '../components/TrendingNow';
import CacheConsent from '../components/CacheConsent';
import HeroSlider from '../components/HeroSlider';
import formalShirtsBanner from '../assets/formal-shirts-banner.png';
import tshirtsCollectionBanner from '../assets/tshirts-collection-banner.png';
import footwearBanner from '../assets/footwear-banner.png';
import mobileFashionSaleBanner from '../assets/mobile-fashion-sale-banner.webp';

const desktopSlides = [
  {
    desktop: formalShirtsBanner,
    alt: 'Formal shirts made for men — shop now',
  },
  {
    desktop: tshirtsCollectionBanner,
    alt: 'New collection premium t-shirts — shop now',
  },
  {
    desktop: footwearBanner,
    alt: 'Step up your style — footwear collection',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen pt-0 pb-16 md:pb-0 mt-0 bg-white">
      {/* Hero banners — desktop carousel; mobile single image */}
      <HeroSlider slides={desktopSlides} mobileSrc={mobileFashionSaleBanner} />

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
