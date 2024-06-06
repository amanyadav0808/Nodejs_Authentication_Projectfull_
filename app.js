
import express from "express"
import mongoose from "mongoose"
import path from "path"
import multer from "multer"
import { User } from "./models/user.js"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: 'dfvm9itah',
    api_key: '678713816678147',
    api_secret: 'N6cGxFqR0ji4B-etm3wvJtBkNqw'
});

const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const app = express()
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")

const upload = multer({ storage: storage })

//show register page
app.get('/register', (req, res) => {
    res.render("register.ejs")
})

//create user
app.post("/register", upload.single('file'), async (req, res) => {
    const file = req.file.path
    const { name, email, password } = req.body

    try {
        const cloudinaryRes = await cloudinary.uploader.upload(file, {
            folder: 'Nodejs_Authentication_App'
        })

        let user = await User.create({
            profileImag: cloudinaryRes.secure_url,
            name, email, password

        })
        res.redirect("/login")
        console.log(cloudinaryRes, name, email, password,);
    } catch (error) {
        res.send("Error Accure")
        console.log(error);
    }


})

//login user
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        console.log("getting user", user);
        if (!user) {
            res.render("login.ejs", { msg: "user not found" })
        }
        else if (user.password != password) {
            res.render("login.ejs", { msg: "invalid password" })

        } else {
            res.render("profile.ejs", { user })
        }
    } catch (error) {
        res.send("Error Accure")
        console.log(error);
    }
})

//all user
app.get('/user', async (req, res) => {
    let users = await User.find().sort({ createdAt: -1 })
    res.render("user.ejs", { users })
})



// show login page
app.get('/login', (req, res) => {
    res.render("login.ejs")
})
mongoose.connect("mongodb+srv://yaduvanshiaman08:admin_aman@cluster0.wkuoelp.mongodb.net/",
    {
        dbName: "nodeJS_Express_API_Series"
    })
    .then(() => console.log("mongoose.connect"))
    .catch((error) => console.log(error))
const port = 1000
app.listen(port, () => console.log(`server is running or port ${port}`))