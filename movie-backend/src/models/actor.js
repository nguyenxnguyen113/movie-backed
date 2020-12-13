const mongoose = require('mongoose')
const actorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    avartar: {
        type: String,
        trim: true,
    },
    region: {
        type: String
    },
    age: {
        type: String
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    avatar: {
        type: String,
    }
}, {timestamps: true})

module.exports = mongoose.model('actor', actorSchema)