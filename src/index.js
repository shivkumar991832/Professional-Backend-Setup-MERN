// require('dotenv').config({path: './env'})
import dotenv from "dotenv"

import connectDB from "./db/index.js";

dotenv.config({
    path : './env'
})




connectDB()
// connectDB() is a async function
// consuming promises
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("Mongodb connection failed", error)
    
})





// import express from "express";
// const app = express()

// (async ()=>{
//     try {
//         // connecting with a db
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         // listen
//         app.on("error", (error)=>{
//             console.log("app not able to talk with db", error)
//             throw error
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`App is now listening on port ${process.env.PORT}`)
//         })



//     } catch (error) {
//         console.log("ERROR OCCURED: ", error)
//         throw error
//     }
// })()




