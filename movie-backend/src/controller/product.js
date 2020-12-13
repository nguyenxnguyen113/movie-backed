const Product = require("../models/product");
const mongoose = require('mongoose')
const shortid = require("shortid");
const { default: slugify } = require("slugify");
const { Mongoose } = require("mongoose");
const actor = require("../models/actor");
const product = require("../models/product");

exports.createProduct = (req, res) => {
  // res.status(200).json({file: req.file, body: req.body})
  const { name, ename, description, categories, actors, countries, url, img, largerImg, year, vote } = req.body;

  const product = new Product({
    name: name,
    slug: slugify(name),
    ename,
    img,
    largerImg,
    description,
    url,
    year,
    categories,
    actors,
    countries,
    vote
  });

  product.save((error, product) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (product) {
      return res.status(201).json({ product });
    }
  });
};

exports.getProduct = (req, res) => {
  Product.find({}).exec((error, products) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (products) {
      return res.status(200).json({ products });
    }
  });
};
const voteAverage = (product) => {
  const newArr = []
  console.log(product[0])
  for (let i = 0; i < product.length; i++) {
    let total = 0
    for (let j = 0; j < product[i].votes.length; j++) {
      total += product[i].votes[j].vote      
    }
    let averageVote = total/product[i].votes.length
    console.log(averageVote)
    const a = product[i]
    a['averageVote']= averageVote
    newArr.push(a)
  }
  return newArr
}
exports.getProductByQuery = async (req, res) => {
  const { limit, page, actor, category, year, sort } = req.query
  const arrProduct = []
  if (sort == "date") {
    arrProduct.push({
      $sort: {
        cratedAt: -1
      }
    })
  }
  if (sort == "vote") {
    arrProduct.push({
      $sort: {
        cratedAt: -1
      }
    })
  }
  if (page && limit) {
    arrProduct.push({ $skip: limit * (page - 1) })
  }
  if (limit) {
    arrProduct.push({ $limit: parseInt(limit) })
  }
  if (actor) {
    arrProduct.push({ $match: { actors: mongoose.Types.ObjectId(actor) } })
  }
  if (category) {
    arrProduct.push({ $match: { categories: mongoose.Types.ObjectId(category) } })
  }
  if (year) {
    arrProduct.push({ $match: { year: parseInt(year) } })
  }
  console.log(arrProduct)
  await Product.aggregate(arrProduct).exec((err, products) => {
    if (err) {
      return res.status(400).json({ err: err })
    }
    if (products) {
      console.log(voteAverage(products))
      return res.status(200).json({ product: voteAverage(products) })
    }
  })
}

exports.vote = (req, res) => {
  const { idFilm, idUser, vote } = req.query
  Product.updateOne(
    { _id: idFilm },
    { $push: { votes: {userId: idUser, vote: vote} } }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({err: err})
    }
    if (result) {
      return res.status(200).json({result: result})
    }
  })
  console.log(req.query)
}

exports.getProductById = (req, res) => {
  const id = mongoose.Types.ObjectId(req.query.id)
  Product.aggregate(
    [
      {
        $match: {
          _id: id
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'lookupNameCategories'
        }
      },
      {
        $lookup: {
          from: 'actors',
          localField: 'actors',
          foreignField: '_id',
          as: 'lookupNameActors'
        }
      },
      {
        $lookup: {
          from: 'countries',
          localField: 'countries',
          foreignField: '_id',
          as: 'lookupNameCountries'
        }
      },
      {
        $addFields: {
          nameCategories: "$lookupNameCategories.name",
          nameCountries: "$lookupNameCountries.name",
          nameActors: "$lookupNameActors.name"
        }
      },
      {
        $project: {
          lookupNameActors: 0,
          lookupNameCountries: 0,
          lookupNameCategories: 0
        }
      }
    ])
    .then(product => res.json(product[0]))
    .catch(err => res.status(400).json('Error: ' + err));
};
exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.updateProductById = (req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      product.name = req.body.name;
      product.ename = req.body.ename;
      product.description = req.body.description;
      product.categories = req.body.categories;
      product.categories = req.body.categories;
      product.actors = req.body.actors;
      product.countries = req.body.countries;
      product.url = req.body.url;
      product.img = req.body.img;
      product.largerImg = req.body.largerImg;
      product.year = req.body.year;
      product.save()
        .then(() => res.json('film updated !'))
        .catch(err => res.status(400).json('Error: ' + err));
    }).catch(err => res.status(400).json('Error: ' + err));
}
