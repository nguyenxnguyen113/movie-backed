const mongoose = require('mongoose')
const conversationSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    isImg:{
        type:Boolean,
        required:true
    },
    content: {
        type: String,
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('conversation', conversationSchema)