const mongoose = require('mongoose')
const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('country', countrySchema)