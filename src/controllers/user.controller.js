import { asyncHandler } from "../utils1/asyncHandler.js";
//asyncHandler is HOF which takes function as a argument
import { ApiError } from "../utils1/ApiError.js";
import { ApiResponse } from "../utils1/ApiResponse.js";
import { uploadOnCloudinary } from "../utils1/cloudinary.js";
import { User } from "../models/user.model.js"


// creating methods that register user
const registerUser = asyncHandler(async (req, res) =>{
    // Logic Building
// step-1 : get user details from frontend(postman)
// step-2 : apply validation - not should be empty
// step-3 : check if user already exist - username or email
// step-4 : check for images , check for avatar(required)
// step-5 : upload them to cloudninary, check avatar 
// step-6 : create user object- create entry in db(db call)
// step-7 : remove password and refresh token field from response
// step-8 : check for user creation (response aaya ki nhi)
// step-9 : return response


//req.body is a object that store form data

const {fullName, email, username, password}= req.body

console.log(req.body)


//console.log("email is ", email)

// if (fullName === "") {
//     throw new ApiError(400, "full name is required")
// }
  
// checking validation 
if (
    [fullName, email , username, password].some((field)=> field?.trim() === "") //condition
) {
    //statement
    throw new ApiError(400, "full name is required")

}
//check if user already exist - username or email
const existedUser = await User.findOne({
    // using operator(imp)
    $or : [{ username }, { email }]
})
 if (existedUser) {
    throw new ApiError(409, "User with email or username already axists !! Please Login")
 }
  
 //check for images , check for avatar(required)

//  req.body provide by express
//  req.files provide by multer and its giving file access may be or not
//  path is properties of multer


// console.log(req.files)

const avatarLocalPath = req.files?.avatar[0]?.path;
//const coverImageLocalPath = req.files?.coverImage[0]?.path;



// solving "can't read properties of undefined"(famous error) error
// classic if-else method
let coverImageLocalPath ; // globally decleared 
//if ("req.files aaya ki nhi " && "array aaya hai ki nhi" && "array ke andar koi element hai ki nhi(arr.length > 0") {}
// coverImage is an array(should be : coverImage.length > 0) 

if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
     coverImageLocalPath = req.files.coverImage[0].path
}
if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
}

// upload them to cloudninary, check avatar 

//uploading files is taking time(like yt video)
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if (!avatar) {
    throw new ApiError(402, "Avatar file is required")
}

//create user object- makes entry in db(db call)

//User(model) is used to perform CRUD operation in database
const user = await User.create({
    fullName,
    avatar: avatar.url, //100%
    coverImage : coverImage?.url || "",
    email, 
    password,
    username : username.toLowerCase()
})


// remove password and refresh token field from response
//select() : by default its select all so select those only to remove
const createdUser = await User.findById(user._id).select(
     "-password -refreshToken"
)
  
//  check for user creation (response aaya ki nhi)

if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
}


// return response

return res.status(201).json(
    // creating new class object
   new ApiResponse(200, createdUser, "User Registered Successfully")
)


})


export {registerUser}


