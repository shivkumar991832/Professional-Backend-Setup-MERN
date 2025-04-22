import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

//handeling file or image,video 
//jab bhi /register path par request aaye to middelware se mil kar jana
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


export default router
 