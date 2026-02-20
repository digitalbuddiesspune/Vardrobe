const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Product = require('../models/product');

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get all unique category names
    const categories = await Product.distinct('category.name');
    console.log('Available categories:', categories);
    
    // Count products in each category
    for (const category of categories) {
      const count = await Product.countDocuments({ 'category.name': category });
      console.log(`- ${category}: ${count} products`);
    }
    
    // Show sample product
    const sampleProduct = await Product.findOne();
    console.log('\nSample product structure:');
    console.log({
      _id: sampleProduct._id,
      title: sampleProduct.title,
      category: sampleProduct.category,
      price: sampleProduct.price
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkDatabase();
