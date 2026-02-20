import { configDotenv } from 'dotenv';
import connectDB from '../config/DataBaseConnection.js';
import User from '../models/User.js';

async function main() {
  try {
    const email = process.argv[2];
    if (!email) {
      console.error('Usage: node scripts/make-admin.js <email>');
      process.exit(1);
    }

    configDotenv();
    await connectDB(process.env.MONGODB_URI || '');

    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found for email:', email);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log('Success: set isAdmin=true for', user.email);
    process.exit(0);
  } catch (e) {
    console.error('Error making admin:', e?.message || e);
    process.exit(1);
  }
}

main();
