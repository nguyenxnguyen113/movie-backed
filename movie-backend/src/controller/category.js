const Category = require("../models/category");
const slugify = require("slugify");
const shortid = require("shortid");

exports.addCategory = (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
  };

  const cat = new Category(categoryObj);
  cat.save((error, category) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (category) {
      return res.status(200).json({ category });
    }
  });
};

exports.getCategory = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (categories) {
      return res.status(200).json({ categories });
    }
  });
};
exports.deleteCategoryById = (req, res) => {
  const { categoryId } = req.body.payload;
  if (categoryId) {
    Category.deleteOne({ _id: categoryId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};