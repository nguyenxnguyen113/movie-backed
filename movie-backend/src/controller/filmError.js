const mongoose = require('mongoose')
const filmError = require('../models/filmError')

exports.createFilmError = (req, res) => {
    const { id } = req.body;
    const _filmError = filmError.find({
        filmId: mongoose.Types.ObjectId(id)
    }).exec((err, film) => {
        if (err) console.log(err);
        else {
            console.log(film.length);
            if (film.length <= 0) {
                const newfilmError = new filmError({
                    filmId: mongoose.Types.ObjectId(id)
                })
                newfilmError.save((err, Film) => {
                    if (err) return res.status(400).json('some thing wrong')
                    else return res.status(200).json('successful')
                })
            }
            else {
                res.status(200).json('film already has been reported')
            }
        }
    })

}

exports.getFilmError = async (req, res) => {
    const { page, limit } = req.query
    const all = await filmError.find({}).count().exec()
    console.log(all);
    if (page || limit) {
        const pipleline = []
        if (limit) {
            pipleline.push({
                $limit: parseInt(limit)
            })
        }
        if (page && limit) {
            pipleline.push({
                $skip: page * limit - limit
            })
        }
        pipleline.push(...[
            {
                $lookup: {
                    from: 'products',
                    localField: 'filmId',
                    foreignField: '_id',
                    as: 'film'
                }
            },
            {
                $project:{
                    "film":1
                }
            }
        ])
        console.log(pipleline);
        filmError.aggregate(pipleline).exec((err, film) => {
            if (err) res.status(500).json('server eror:'+err)
            else res.status(200).json({
                total: all,
                data:film
            });
        })
    }
    else {
        filmError.find({}).exec((err,films)=>{
            if(err) res.status(500).json("server error: "+err)
            else res.status(200).json({
                total:all,
                data:films
            })
        })
    }
}