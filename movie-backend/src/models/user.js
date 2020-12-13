const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    // firstName: {
    //     type: String,
       
    //     min:3,
    //     max:20
    // },
    // lastName: {
    //     type: String,
        
    //     min:3,
    //     max:20
    // },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique:true,
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
        default: "default"
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