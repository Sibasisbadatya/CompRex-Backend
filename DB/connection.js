const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const db = process.env.MONGO_URI;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to mongodb");
}).catch(() => {
    console.log("not connected to mongo db");
})