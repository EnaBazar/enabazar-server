import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  mokam: { type: mongoose.Schema.Types.ObjectId, ref: "Mokam", required: true },
  amount: { type: Number, required: true, min: 0 },
  note: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Collection", collectionSchema);
