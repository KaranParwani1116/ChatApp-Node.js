const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        trim: true
    },

    userCount: {
        type: Number,
        required: true
    }
})