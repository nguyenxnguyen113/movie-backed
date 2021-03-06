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
    year: {
        type: Number,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    streamTapeId:{
        type:String,
        required:true,
        trim:true
    },
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'user'
            },
            comment: String
        }
    ],
    votes: {
        type:Array,
        default:[
            {
                userId:mongoose.Types.ObjectId('5fd6f9207814c42fe8b4069d'),
                vote:8

            }
        ]
    },
    categories: [{ type : mongoose.Schema.Types.ObjectId, ref: 'category' }],
    actors: [{ type : mongoose.Schema.Types.ObjectId, ref: 'actor' }],
    countries: [{ type : mongoose.Schema.Types.ObjectId, ref: 'country' }],
    img: {
        type: String
    },
    largerImg: {
        type: String
    }
}, {timestamps: true})

module.exports = mongoose.model('Product', productSchema)
// [
//     {
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             default:'12345'
//         },
//         vote : {
//             type:Number,
//             default:8
//         }
//     }
// ]