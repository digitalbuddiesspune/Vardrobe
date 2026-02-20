import { configDotenv } from 'dotenv';
import connectDB from '../config/DataBaseConnection.js';
import Order from '../models/Order.js';
import { Address } from '../models/Address.js';

async function main() {
  try {
    configDotenv();
    await connectDB(process.env.MONGODB_URI || '');

    const orders = await Order.find({ $or: [ { shippingAddress: { $exists: false } }, { shippingAddress: null } ] }).limit(1000);
    let updated = 0;
    for (const o of orders) {
      try {
        const addr = await Address.findOne({ userId: o.user });
        if (!addr) continue;
        const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
        o.shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
        await o.save();
        updated++;
      } catch {}
    }
    console.log(`Backfilled ${updated} orders with shipping addresses`);
    process.exit(0);
  } catch (e) {
    console.error('Backfill failed:', e?.message || e);
    process.exit(1);
  }
}

main();
