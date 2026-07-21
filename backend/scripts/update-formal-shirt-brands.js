import fs from 'fs';
import mongoose from 'mongoose';
import { Product } from '../models/product.js';

const BRAND_POOL = [
  'Vardrobe Classic',
  'Vardrobe Loom',
  'CityThread Co.',
  'MetroWeave',
  'Northline Apparel',
  'Local Stitch Works',
  'Urban Cotton House',
  'Crafted Collar Co.',
];

function getMongoUri() {
  const envPath = new URL('../.env', import.meta.url);
  const envRaw = fs.readFileSync(envPath, 'utf8');
  const line = envRaw
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.startsWith('MONGODB_URI=') || l.startsWith('MONGO_URI='));

  if (!line) throw new Error('MONGODB_URI or MONGO_URI not found in backend/.env');
  return line.split('=').slice(1).join('=').trim();
}

function pickBrand(index) {
  return BRAND_POOL[index % BRAND_POOL.length];
}

async function updateFormalShirtBrands() {
  const uri = getMongoUri();
  await mongoose.connect(uri);

  const products = await Product.find({
    $or: [
      { category: { $regex: /formal[- ]?shirts?/i } },
      {
        $and: [
          { category: { $regex: /shirts?/i } },
          { title: { $regex: /formal/i } },
        ],
      },
    ],
  }).select('_id title category product_info.brand');

  if (!products.length) {
    console.log('No formal shirt products found.');
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${products.length} formal shirt products.`);
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    const oldBrand = product.product_info?.brand || 'N/A';
    const newBrand = pickBrand(i);

    await Product.updateOne(
      { _id: product._id },
      { $set: { 'product_info.brand': newBrand } }
    );

    console.log(
      `${i + 1}. ${product.title} (${product.category}) | ${oldBrand} -> ${newBrand}`
    );
  }

  console.log('Formal shirt brands updated successfully.');
  await mongoose.disconnect();
}

updateFormalShirtBrands().catch(async (error) => {
  console.error('Failed to update brands:', error.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
