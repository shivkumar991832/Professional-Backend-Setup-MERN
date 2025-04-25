import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express() 

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    // credentials : true
}))
// data coming in different formate in the backend i.e json formate, form data , body formate

app.use(express.json({limit : "16kb"}))

// data can come in the form of URl(+),
app.use(express.urlencoded({extended : true, limit: "16kb"}))
// one more final configuration that is a folder(public) that store pdf file or images
app.use(express.static("public"))
app.use(cookieParser())


// routes import
import userRouter from "./routes/user.routes.js"

// routes decleration
app.use("/api/v1/users", userRouter)


// http://localhost:8000/users/register
// http://localhost:8000/api/v1/users/login
// standard practice
// http://localhost:8000/api/v1/users/[your routes]

export default app
// export { app } 