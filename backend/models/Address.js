import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  pincode: { type: String, required: true },
  locality: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  landmark: { type: String },
  alternatePhone: { type: String },
  addressType: { type: String, enum: ['Home', 'Work'], default: 'Home' },
  createdAt: { type: Date, default: Date.now }
});

export const Address = mongoose.model('Address', addressSchema);
