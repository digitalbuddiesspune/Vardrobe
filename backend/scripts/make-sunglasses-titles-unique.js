import fs from 'fs';
import mongoose from 'mongoose';
import { Product } from '../models/product.js';

function getMongoUri() {
  const envRaw = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
  const line = envRaw
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.startsWith('MONGODB_URI=') || l.startsWith('MONGO_URI='));
  if (!line) throw new Error('MONGODB_URI or MONGO_URI not found in backend/.env');
  return line.split('=').slice(1).join('=').trim();
}

function normalize(value) {
  return (value || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

async function makeSunglassesTitlesUnique() {
  await mongoose.connect(getMongoUri());

  const products = await Product.find({ category: { $regex: /^sunglasses$/i } })
    .sort({ createdAt: 1, _id: 1 })
    .select('_id title createdAt')
    .lean();

  const groups = new Map();
  for (const p of products) {
    const key = normalize(p.title);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }

  let updated = 0;
  for (const items of groups.values()) {
    if (items.length <= 1) continue;
    for (let i = 1; i < items.length; i += 1) {
      const item = items[i];
      const newTitle = `${item.title} (${i + 1})`;
      await Product.updateOne({ _id: item._id }, { $set: { title: newTitle } });
      updated += 1;
      console.log(`${item._id} | ${item.title} -> ${newTitle}`);
    }
  }

  console.log(`Updated ${updated} sunglasses products to unique titles.`);
  await mongoose.disconnect();
}

makeSunglassesTitlesUnique().catch(async (err) => {
  console.error('Failed to make titles unique:', err.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
