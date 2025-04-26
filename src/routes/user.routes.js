import { Router } from "express";
import { loginUser, logoutUser, refresAccessToken, registerUser } from "../controllers/user.controller.js";
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
export default router
 