const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: Number,
        required: true
    },
    cpassword: {
        type: Number,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

userSchema.methods.generateAuthToken = async function () {
    try {
        console.log("token");
        const token = jwt.sign({
            _id: this._id
        }, "SibasisBadatyaRealTimeChatAppForUsers");
        console.log(token);
        this.tokens = this.tokens.concat({ token: token });
        console.log("token saved");
        await this.save();
        console.log("token");
        return token;
    } catch (err) {
        console.log(err);
    }
}

module.exports = mongoose.model('user', userSchema);