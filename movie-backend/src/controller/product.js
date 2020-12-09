const Product = require("../models/product");

const shortid = require("shortid");
const { default: slugify } = require("slugify");

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
