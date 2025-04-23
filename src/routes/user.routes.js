import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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


export default router
 