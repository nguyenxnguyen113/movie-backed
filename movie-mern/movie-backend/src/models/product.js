const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    ename: {
        type: String,
        trim: true,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User'
            },
            comment: String
        }
    ],
    categories: [
        {
            category: {
                type: mongoose.Schema.Types.ObjectId, ref: 'category',
                required: true,
            }
        }
    ],
    actors: [
        {
            actor: {
                type: mongoose.Schema.Types.ObjectId, ref: 'actor',
                required: true,
            }
        }
    ],
    countries: [
        {
            country: {
                type: mongoose.Schema.Types.ObjectId, ref: 'country',
                required: true,
            }
        }
    ],
    img: {
        type: String
    },
    largerImg: {
        type: String
    }
}, {timestamps: true})

module.exports = mongoose.model('Product', productSchema)