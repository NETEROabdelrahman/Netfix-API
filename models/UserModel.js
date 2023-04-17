import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" },
    isAdmin: { type: Boolean, default: false },
  },
    { timestamps: true }
);
  


const userModel = mongoose.model('userModel', UserSchema)


export default userModel