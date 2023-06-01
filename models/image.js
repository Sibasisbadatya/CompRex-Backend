const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },

    photo: {
        type: String
    },

    birthdate: {
        type: String
    },
    value: {
        type: String
    }
});

const Image = mongoose.model('Image', userSchema);

module.exports = Image;