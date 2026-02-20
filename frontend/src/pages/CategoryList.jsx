import ProductList from '../components/ProductList';

// Generic wrapper for a specific category (keeps code simple and named without 'banarasi')
const CategoryList = () => {
  return <ProductList defaultCategory="Banarasi" />;
};

export default CategoryList;
