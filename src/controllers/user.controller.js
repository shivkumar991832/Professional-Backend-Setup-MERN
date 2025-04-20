import { asyncHandler } from "../utils1/asyncHandler.js";
//asyncHandler is HOF which takes function as a argument


// creating methods that register user
const registerUser = asyncHandler(async (req, res) =>{
    res.status(200).json({
    message : "ok"
   })
})


export {registerUser}

