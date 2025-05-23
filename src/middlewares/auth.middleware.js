// this middleware use to verify user logged in or not with the help of Token
// making custume middleware

// app.use(cookieParser()) help you to use .cookie its also allow to use (req.cookie or res.cookie to access cookies)


// this block of code also reusable 


import { ApiError } from "../utils1/ApiError.js";
import { asyncHandler } from "../utils1/asyncHandler.js";
import  Jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config({
    path : './.env'
})
import { User } from "../models/user.model.js";

// verify Token 
// verifyJWT is used to verify the user . After user got verified it will add in req object
export const verifyJWT = asyncHandler(async (req, _, next)=>{

   try {
    
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    console.log(token)
   if (!token) {
    throw new ApiError(401, "Unauthorized Request")
   }


  // Jwt.verify("string(token)", "ACCESS_TOKEN_SECRET") || (decodedToken) is a object
   const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
   //after verify we will get decoded information


   const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
  

   if (!user) {
     
     throw new ApiError(401, "Invalid Access Token")
   }


   // important work
// req and res both are a object : adding user in req
   req.user = user;
   next()

   } 
   
   
   catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token !!!!")
   }


   //maximum times middleware used in routes


})