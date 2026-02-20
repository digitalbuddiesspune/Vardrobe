const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Product = require('../models/product');

async function listProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get all products
    const products = await Product.find({}).limit(5);
    
    console.log('Sample products:');
    products.forEach((product, index) => {
      console.log(`\nProduct ${index + 1}:`);
      console.log(`- Title: ${product.title}`);
      console.log(`- Category: ${product.category ? product.category.name : 'No category'}`);
      console.log(`- ID: ${product._id}`);
    });
    
    // Check if we have any Banarasi products
    const banarasiProducts = await Product.find({ 'category.name': /banarasi/i });
    console.log(`\nFound ${banarasiProducts.length} Banarasi products`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

listProducts();
