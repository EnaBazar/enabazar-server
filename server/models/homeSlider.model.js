import mongoose from 'mongoose';

// স্কিমার তৈরি
const homeSliderSchema = mongoose.Schema({
  images: {
    type: [String],  // অ্যারে আকারে স্ট্রিং
    required: true,  // ইমেজ ফিল্ডটি প্রয়োজনীয়
  },

  dateCreated: {
    type: Date,
    default: Date.now,  // ডিফল্ট তারিখ
  },
}, {timestamps: true});

// মডেল তৈরি
const homeSlidermodel = mongoose.model("HomeSlider", homeSliderSchema);

export default homeSlidermodel;
