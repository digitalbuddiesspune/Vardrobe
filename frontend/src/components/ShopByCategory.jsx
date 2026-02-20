import React from 'react';
import { useNavigate } from 'react-router-dom';

const ShopByCategory = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: 'COLLECTION',
      path: '/category/Collection',
      image: 'https://res.cloudinary.com/doh8nqbf1/image/upload/v1764156521/faaed640-0829-4861-80a2-6c7dc3e73bf3.png',
    },
    {
      name: 'MEN',
      path: '/category/Men',
      image: 'https://res.cloudinary.com/doh8nqbf1/image/upload/v1764154213/0bf2018a-4136-4d0d-99bc-2c5755a65d2c.png',
    },
    {
      name: 'WOMEN',
      path: '/category/Women',
      image: 'https://res.cloudinary.com/doh8nqbf1/image/upload/v1764155957/b0484146-0b8f-4f41-b27f-8c1ee41a7179.png',
    },
    {
      name: 'BOYS',
      path: '/category/Boys',
      image: 'https://res.cloudinary.com/doh8nqbf1/image/upload/v1764156074/0b700582-a664-43e6-b478-39ced3c3c6db.png',
    },
    {
      name: 'GIRLS',
      path: '/category/Girls',
      image: 'https://res.cloudinary.com/doh8nqbf1/image/upload/v1764156159/1157977a-db19-4e4e-988c-51c7f8d501ae.png',
    },
    {
      name: 'SISHU',
      path: '/category/Sishu',
      image: 'https://res.cloudinary.com/doh8nqbf1/image/upload/v1764156281/6b450cec-316c-4897-9db4-c3621dfa35fa.png',
    },
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-serif text-gray-800 mb-3 tracking-wide" style={{ fontFamily: 'serif' }}>
            Shop by Category
          </h2>
          <p className="text-base md:text-lg text-gray-600 font-light">
            Explore Our Collections
          </p>
        </div>

        {/* Category Icons - Horizontal Scrollable */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-6 md:gap-8 justify-center items-start min-w-max md:min-w-0">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer group shrink-0"
                onClick={() => handleCategoryClick(category.path)}
              >
                {/* Circular Icon Container */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 overflow-hidden mb-3 transition-all duration-300 group-hover:bg-gray-300 group-hover:scale-110">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/96x96?text=Category';
                    }}
                  />
                </div>
                
                {/* Category Label */}
                <span className="text-xs md:text-sm font-medium text-gray-800 text-center whitespace-nowrap">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;

