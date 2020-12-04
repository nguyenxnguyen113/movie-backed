const Product = require("../models/product");

const shortid = require("shortid");
const { default: slugify } = require("slugify");

exports.createProduct = (req, res) => {
  // res.status(200).json({file: req.file, body: req.body})
  const { name, ename, description, category, url } = req.body;
  let img = ''
  let largerImg = ''
  console.log(req.files[0])
  if (req.files.length > 0) {
    img = req.files[0].filename
    largerImg = req.files[1].filename
  }
  const product = new Product({
    name: name,
    slug: slugify(name),
    ename,
    img,
    largerImg,
    description,
    url,
    categories: [
        { category }
    ],
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
