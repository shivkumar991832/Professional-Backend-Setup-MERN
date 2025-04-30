import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refresAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from './../middlewares/auth.middleware.js';


const router = Router()

//handeling file or image,video 
//jab bhi /register path par request aaye to middelware se mil kar jana
//creating routes for register
router.route("/register").post(
    upload.fields([
    //    lets we want avatar img and cover img
        {
            name : "avatar", //imp 
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)

// creating routes for login
router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
// here not required (verifyJWT)
// making end point of Refresh Token
router.route("/refresh-token").post(refresAccessToken)
router.route("/change-password").post( verifyJWT, changeCurrentPassword )
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)



// in case of params -- the rule is --
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watch-history").get(verifyJWT, getWatchHistory)
export default router
 