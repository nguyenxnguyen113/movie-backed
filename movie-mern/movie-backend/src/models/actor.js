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
    slug: {
        type: String,
        unique: true,
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('actor', actorSchema)