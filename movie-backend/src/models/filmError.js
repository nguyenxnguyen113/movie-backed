const mongoose = require('mongoose')

const filmErrorSchema = new mongoose.Schema({
    filmId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
    }
})

module.exports = mongoose.model('FilmError',filmErrorSchema)