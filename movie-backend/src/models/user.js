const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        lowercase:true,
        index: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique:true,
        lowercase:true,
    },
    hash_password: {
        type: String,
        required:true,
    },
    role: {
        type:String,
        role: ['admin', 'user'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/react-upload-image-d14cb.appspot.com/o/images%2Ficon-user.svg?alt=media&token=a31c548c-bc91-4cee-b861-80ecf0128d58"
    },
    watchList: [{ type : mongoose.Schema.Types.ObjectId, ref: 'film' }],
    contactNumber: {type: String},
    profilePicture: {type: String}
}, {timestamps: true})

userSchema.virtual('password').set(function (password) {
    this.hash_password = bcrypt.hashSync(password,10)
})

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`
})

userSchema.methods = {
    authenticate: function (password) {
        return bcrypt.compareSync(password, this.hash_password)
    }
}
module.exports = mongoose.model('User', userSchema)