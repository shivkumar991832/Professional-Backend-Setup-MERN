import { asyncHandler } from "../utils1/asyncHandler.js";
//asyncHandler is HOF which takes function as a argument
import { ApiError } from "../utils1/ApiError.js";
import { ApiResponse } from "../utils1/ApiResponse.js";
import { uploadOnCloudinary } from "../utils1/cloudinary.js";
import { User } from "../models/user.model.js"
import  Jwt  from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config({
    path : './.env'
})




const generateAccessAndRefreshToken = async(userId)=>{
   try {
    // finding user(document) - object
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    
    // add refreshToken in object(user) or db
    user.refreshToken = refreshToken
    // saving the object data after updation(in db)
    await user.save({ validateBeforeSave : false })
    
    return {accessToken, refreshToken}


   } catch (error) {
      throw new ApiError(500, "Something went wrong while generating access and refresh token", error )
   }
}


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

if(!username && !email){
    throw new ApiError(400, "Username or email is required")
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

// creating methods that login user
const loginUser = asyncHandler( async (req, res)=>{
     //req.body -- takes data
     //access give to user on which basis - username or email
     // find the user (exist or not)
     // check the user password
     // assess and refresh token
     // send token in the form of cookies to user
     // response return (login succesfully)



     //req.body -- takes data
     const {email , username , password} = req.body

    // access give to user on which basis - username or email
     if (!(username || email)) {
         throw new ApiError(400, "username or email is required")
     }
     
     // find the user (exist or not)
     const user = await User.findOne({
        // or operator
       $or: [{username}, {email}]
       
     })

     if(!user){
        throw new ApiError(404, "User does not exist , Please Registered !! ")
     }


     //check the user password (if user resistered then his password alreaday saved in db ||can be access above decreared variable(user))
     // all users details stored in user(variable)-document
    const isPasswordValid = await user.isPasswordCorrect(password) // output in boolean formate

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid email or password")
     }
    
   

    // Generate assess and refresh token
    // destructuring
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

     // send token in the form of cookies to user


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // now sending cookies
    // making option is allow : When both[false] "by deafult modification of cookies from frontend by anyone"
    // making option is allow : When both[true] "modification of cookies from server side only"
    const options = {
        httpOnly: true,
        secure: true
    }
    // app.use(cookieParser()) help you to use .cookie its also allow to use (req.cookie or res.cookie)



    // response return (login succesfully)

    // cookie("key", value, options)
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
            user : loggedInUser,
            accessToken,
            refreshToken
        }, "User Logged In Successfully")
    )
})

// creating methods that logout user(for this we need to removes refreshToken from the database)
// we need to add "user" data in req object(auth.middleware.js)
const logoutUser = asyncHandler(async (req, res)=>{
    //  User.deleteOne(req.user.refreshToken)
   await User.findByIdAndUpdate(
        // finding user
        req.user._id,
        //what to update
        {
            $set : {
                // remove refreshToken
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    // .clearCookie is a built in methods to clear cookie(access and refresh token) when user logout
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User Logged Out Successfully")
    )
})

// making end point of Refresh Token
//before end point need to build controller
// refresAccessToken is a controller
const refresAccessToken = asyncHandler(async(req, res)=>{
   // refresh token can access from cookies
   // we already have a refresh token in db so its new refresh token name as incomingRefreshToken
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request(Token Invalid)")
  }

  try {
    // this decodedToken can make mistakes(use try catch block)
    // now we need to jwt verification
    const decodedToken = Jwt.verify( incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET )
  
  
    // talking to database(await) || decodedToken is a object
    const user = await User.findById(decodedToken?._id)
  
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token")
    }
  
    // matching both refresh Token
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used")
    }
  
    // making option for cookies
    const options = {
      httpOnly : true,
      secure : true
    }
  
    const { newAccessToken , newRefreshToken } = await generateAccessAndRefreshToken(user._id)
     
    // now sending response
    return res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken",newRefreshToken, options)
    .json(
      new ApiResponse(200, {
          // key : value
          accessToken : newAccessToken,
          refreshToken : newRefreshToken
      }, "Access Token Refreshed Succesfully")
    )
  } catch (error) {
     throw new ApiError(401, error?.message || "Invalid RefreshToken ")
  }
})

// writting controller
const changeCurrentPassword = asyncHandler(async (req, res)=>{
   const {oldPassword, newPassword} = req.body
   // if user logged in (than user must exist in req) - verify.jwt()

   const user = await User.findById(req.user?._id)
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
   
   if (!isPasswordCorrect) {
      throw new ApiError( 400, "Invalid Old Password" )
   }


   // setting new password in a object(user) || obj.key = value
   user.password = newPassword
   // now saving the password or saving the user updated data
   await user.save({validateBeforeSave : false})
    
   //now send the message
   return res
   .status(200)
   .json(
    new ApiResponse(200 , {}, "Password Changed Successfully")
   )

})

// get the current user
const getCurrentUser = asyncHandler(async (req, res)=>{
   return res
   .status(200)
   .json(
    // if user logged in (than user must exist in req) - verify.jwt()
    new ApiResponse(200 , req.user, "Current User Fetch Succesfully")
   )
})

// when your updating file(image) then must write another controller for this- used in Production Level
const updateAccountDetails = asyncHandler(async (req, res)=>{
   const {fullName, email } = req.body

   if (!fullName || !email) {
       throw new ApiError(400, "All Fields are Required")
   }

   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
        // set received a object
        $set : {
           fullName : fullName,
           email : email
           // or write email
        }
    },
    {new : true} // return info  after Update
 ).select("-password")


 return res
 .status(200)
 .json(
    new ApiResponse(200, user, "Account Details Updated Successfully")
 )




})


// now updating the files
const updateUserAvatar = asyncHandler( async(req, res)=>{
   // req.files provide by multer(but here use file not files for single file )
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    // upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(200, "Error While Uploading Avatar")
    }

    //updating files
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                avatar : avatar.url
            }
        },
        {new : true} // return info  after Update
    ).select("-password")

   return res
   .status(200)
   .json(
    new ApiResponse(200 , user, "Avatar Updated Successfully")
   )



})


// copy paste above code
const updateUserCoverImage = asyncHandler( async(req, res)=>{
    // req.files provide by multer(but here use file not files for single file )
     const coverImageLocalPath = req.file?.path
 
     if (!coverImageLocalPath) {
         throw new ApiError(400, "Cover Image file is missing")
     }
 
     // upload on cloudinary
     const coverImage = await uploadOnCloudinary(coverImageLocalPath)
 
     if (!coverImage.url) {
         throw new ApiError(200, "Error While Uploading Cover Image")
     }
 
     //updating files
     const user = await User.findByIdAndUpdate(
         req.user?._id,
         {
             $set : {
                 coverImage : coverImage.url
             }
         },
         {new : true} // return info  after Update
     ).select("-password")
 
    return res
    .status(200)
    .json(
     new ApiResponse(200 , user , "Cover Image Updated Successfully")
    )
 
 
 
 })







export {
    registerUser,
    loginUser,
    logoutUser,
    refresAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}


