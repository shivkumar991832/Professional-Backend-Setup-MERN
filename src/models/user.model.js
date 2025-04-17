import mongoose, { Schema } from "mongoose";

import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt"


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //for enable searching
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // Cloudinary url
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
        {
          type: Schema.Types.ObjectId,
          ref: "Video",
        },
      ],
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// just data save hone se pahle ye kam karo
userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))return next()
    this.password = bcrypt.hash(this.password, 10)
    next()
} )


userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
  // bcrypt.compare("user password", encrypted password that is already saved in database)
}
// this will return boolean value

// this having fast process(avoid async/await)
userSchema.methods.generateAccessToken = function (){
    return Jwt.sign(
    {
        //  first give payload(what info should be keep)
        _id: this._id,
        email : this.eamil,
        username: this.username,
        fullName: this.fullName

    },
    // next is access token needed
    process.env.ACCESS_TOKEN_SECRET,
    {
      // for expiry token
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
   )
}
userSchema.methods.generateRefreshToken = function (){
  return Jwt.sign(
    {
        //  first give payload(what info should be keep)
        _id: this._id,

    },
    // next is access token needed
    process.env.REFRESH_TOKEN_SECRET,
    {
      // for expiry token
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
   )
}


export const User = mongoose.model("User", userSchema);

