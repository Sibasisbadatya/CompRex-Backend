const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const Reply = mongoose.model('reply', userSchema);

module.exports = Reply;