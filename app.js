import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/user/authRoutes.js"
import { connectDB } from "./config/database.js"
import cookieParser from "cookie-parser"
dotenv.config()

let app = express()

connectDB()

app.use(express.static("public"))
app.use(express.urlencoded({
    extended:true
}))

app.use(express.json())
app.set("view engine","ejs")

app.use(cookieParser())
app.use('/auth',authRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`SERVER STARTING PORT NUMBER ${process.env.PORT} ...`)
})