import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: null,
      sparse: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    // 🔐 Mobile should be String
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    verify_mobile: {
      type: Boolean,
      default: false,
    },

    verify_email: {
      type: Boolean,
      default: false,
    },

    access_token: {
      type: String,
      default: "",
    },

    refresh_token: {
      type: String,
      default: "",
    },

    last_login_date: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    address_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "address",
      },
    ],

    orderHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "order",
      },
    ],

    shopping_cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "cartProduct",
      },
    ],

    // 🔐 OTP fields
    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    otpResendCount: {
      type: Number,
      default: 0,
    },

    otpLastSent: {
      type: Date,
      default: null,
    },

    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },

    signUpWithGoogle: {
      type: Boolean,
      default: false,
    },

    verificationCode: String,
  },
  { timestamps: true }
);

const usermodel = mongoose.model("user", userSchema);

export default usermodel;