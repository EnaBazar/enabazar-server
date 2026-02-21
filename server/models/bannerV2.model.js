import mongoose from 'mongoose';

// স্কিমার তৈরি
const bannerV2Schema = mongoose.Schema({
    
    bannerTitle:{type: String, default : '', required:true},
     catId:{type: String, default : '', required:true},
     subCatId:{type: String, default : '', required:true},
    thirdsubCatId:{type: String, default : '', required:true},
      price:{type: Number, default : '', required:true},
         bannerAlign:{type: String, default : ''},
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
const bannerV2model = mongoose.model("BannerV2", bannerV2Schema);

export default bannerV2model;
