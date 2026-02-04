import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String, // hashed
    required: true,
  },
});

const AdminModel = mongoose.model("Admin", adminSchema);
export default AdminModel;
