const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cors = require('cors');
const bcrypt = require('bcrypt');
router.use(cors());
const User = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
const Image = require('../models/image');
const Reply = require('../models/reply');

require("../DB/connection");

router.post("/register", async (req, res) => {
    const { name, email, password, cpassword } = req.body;
    console.log("yes");
    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({
                message: "Email already exist"
            });
        }
        if (name && email && password && cpassword) {
            const user = new User({ name, email, password, cpassword });
            await user.save();
            return res.json({
                message: "user registered", status: 201,
            });
        }
        else {
            return res.status(500).json({ message: "Failed to register" });
        }

    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Error occured" })
    }
})
router.post("/login", async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;
        const userLogin = await User.findOne({ email: email });
        if (!userLogin) {
            return res.json({ message: "Invalid Credenials" })
        }
        // console.log(userLogin.regdno);
        if (userLogin.password == password) {
            token = await userLogin.generateAuthToken();
            console.log("token returned", token);
            res.json({
                message: "sign in succesfully", status: 201, token: token, name: userLogin.name
            });
        }
        else {
            res.json({ message: "Invalid Credenials" })
        }
    } catch (err) {
        console.log(err);
    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});


const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });
// const upload = multer({ storage: storage });
router.route('/photo').post(upload.single('photo'), async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const birthdate = req.body.birthdate;
    const photo = req.file.filename;

    const newUserData = {
        email,
        name,
        birthdate,
        photo
    }

    const ifimage = await Image.findOne({ name: name })
    if (ifimage) {
        res.json({ msg: "This Name is Already Used" })
    }
    else {
        console.log(newUserData);
        const newUser = new Image(newUserData);
        console.log(newUser);
        newUser.save()
            .then(() => res.json('User Added'))
            .catch(err => res.status(400).json('Error: ' + err));
    }
});

router.post("/getimage", async (req, res) => {
    try {
        const email = req.body.email;
        console.log(email);
        const users = await Image.find({ email: { $ne: email } })
            .select([
                "name",
                "photo",
                "birthdate",
                "value",
                "email"
            ])
        console.log(users);
        res.json(users);
    } catch (e) {
        console.log(e);
    }

})
router.post("/getprofile", async (req, res) => {
    try {
        const email = req.body.email;
        console.log(email);
        const users = await Image.find({ email: email })
            .select([
                "name",
                "photo",
                "birthdate",
                "value",
                "email"
            ])
        // console.log(users);
        res.json(users);
    } catch (e) {
        console.log(e);
    }

})
router.post("/addreply", async (req, res) => {
    try {
        const { from, to, msg, name } = req.body;
        const reply = {
            from, to, msg, name
        }
        const added = new Reply(reply);
        await added.save().then(() => res.json('Reply Sended'))
            .catch(err => res.status(400).json('Error: ' + err));
    }
    catch (err) {
        console.log(err);
    }
})
router.post("/getreply", async (req, res) => {
    try {
        const { email } = req.body;
        const reply = await Reply.find({ to: email });
        res.json({ data:reply })
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;