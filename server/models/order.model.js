import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },

  products: [
    {
      productId: { type: String },
      productTitle: { type: String },
      quantity: { type: Number },
      price: { type: Number },
      image: { type: String },
      subTotal: { type: Number },
    }
  ],

  paymentId: {
    type: String,
    default: "",
  },
  payment_status: {
    type: String,
    default: "",
  },
  order_status: {
    type: String,
    default: "pending",
  },
  delivery_address: {
    type: mongoose.Schema.ObjectId,
    ref: 'address',
  },
  subTotalAmt: { type: Number },
  delivery_charge: { type: String }, // 🔴 এখানে ref: 'address' থাকার দরকার নেই
  totalAmt: { type: Number },

  // 🔴 Notification এর জন্য নতুন field
  isRead: {
    type: Boolean,
    default: false,   // নতুন order আসলে unread থাকবে
  }

}, { timestamps: true });

const ordermodel = mongoose.model("Order", orderSchema);
export default ordermodel;
