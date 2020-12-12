const Product = require("../models/product");
const mongoose = require('mongoose')
const shortid = require("shortid");
const { default: slugify } = require("slugify");
const { Mongoose } = require("mongoose");

exports.createProduct = (req, res) => {
  // res.status(200).json({file: req.file, body: req.body})
  const { name, ename, description, categories, actors, countries, url, img, largerImg, year } = req.body;

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
    countries
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
exports.getProductById = (req, res) => {
  const id = mongoose.Types.ObjectId(req.body.id)
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
    .then(product => res.json(product))
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
