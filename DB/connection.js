const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const db = 'mongodb+srv://sibasis:pDJjEYolYncNtrpT@cluster0.coqcpo3.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to mongodb");
}).catch(() => {
    console.log("not connected to mongo db");
})
