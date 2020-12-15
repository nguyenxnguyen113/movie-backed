const Category = require("../models/category");
const slugify = require("slugify");
const shortid = require("shortid");
const mongoose = require('mongoose')
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

exports.getCategory = async (req, res) => {
  const PAGE_SIZE = 3;
  const page = parseInt(req.query.page || "0");
  const total = await Category.countDocuments({});
  Category.find({}).limit(PAGE_SIZE).skip(PAGE_SIZE*page).exec((error, categories) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (categories) {
      return res.status(200).json({ totalPages: Math.ceil(total / PAGE_SIZE),categories });
    }
  });

  // const total = await Category.countDocuments({});
  // const posts = await Category.find({})
  //   .limit(PAGE_SIZE)
  //   .skip(PAGE_SIZE * page);
  // res.json({
  //   totalPages: Math.ceil(total / PAGE_SIZE),
  //   posts,
  // });
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

exports.updateCategoryById = (req, res) => {
  Category.findById(mongoose.Types.ObjectId(req.params.id))
    .then(category => {
      category.name = req.body.name;

      category.save()
        .then(() => res.json('country updated !'))
        .catch(err => res.status(400).json('country: ' + err));
    }).catch(err => res.status(400).json('error: ' + err));
}
exports.getCategoryById = (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id)
  Category.aggregate(
    [
      {
        $match: {
          _id: id
        },
      }
    ])
    .then(category => { res.json(category[0])})
    .catch(err => res.status(400).json('Error: ' + err));
};