import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Policy } from '../models/Policy.js';
import { defaultPrivacyPolicy } from '../data/defaultPrivacyPolicy.js';

dotenv.config();

async function seedPrivacyPolicy() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGODB_URI or MONGO_URI is not set');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const policy = await Policy.findOneAndUpdate(
    { type: defaultPrivacyPolicy.type },
    {
      title: defaultPrivacyPolicy.title,
      content: defaultPrivacyPolicy.content,
      lastUpdated: new Date(),
    },
    { new: true, upsert: true, runValidators: true }
  );

  console.log(`Privacy policy updated: ${policy.title}`);
  await mongoose.disconnect();
}

seedPrivacyPolicy().catch((err) => {
  console.error(err);
  process.exit(1);
});
