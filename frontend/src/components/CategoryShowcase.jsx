import React from 'react';
import { Link } from 'react-router-dom';

// Reverting to the original 4 categories for a standard 1-row showcase
const categories = [
  {
    id: 1,
    name: "SHIRTS",
    image: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765270065/f41cb7e3-f91a-4dc1-8738-35f610929e62.png',
    path: '/category/formal-shirts'
  },
  {
    id: 2,
    name: "TSHIRTS",
    image: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765270201/2bc21bba-d836-46f0-81a0-6e045d2b07fd.png',
    path: '/category/tshirts'
  },
  {
    id: 6,
    name: 'Sunglasses',
    image: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765461889/43753e06bc6de0fcff2745b62424bace_jzwtyc.jpg',
    path: '/category/sunglasses'
  },
   {
    id: 8,
    name: 'SHORTS & BOXERS',
    image: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765270714/557c7404-59a5-46d4-84a9-5fa505f2e7dc.png',
    path: '/category/shorts'
  }
];

const CategoryShowcase = () => {
  return (
    <div className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-medium tracking-widest uppercase text-gray-900 text-center mb-8 sm:mb-10">
          CATEGORIES
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-10">
          {categories.map((category) => (
            <div key={category.id} className="group flex flex-col items-center text-center">
              <Link
                to={category.path}
                className="block w-full"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>

              <div className="mt-3">
                <p className="text-xs font-medium tracking-wider uppercase text-gray-800">
                  {category.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;