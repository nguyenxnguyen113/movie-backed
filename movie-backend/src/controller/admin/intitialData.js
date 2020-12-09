const Category = require("../../models/category");
const Product = require("../../models/product");


function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,

    });
  }

  return categoryList;
}

exports.initialData = async (req, res) => {
  const categories = await Category.find({}).exec();
  const products = await Product.find({})
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();
  const orders = await Order.find({})
    .populate("items.productId", "name")
    .exec();
  res.status(200).json({
    categories: createCategories(categories),
    products,
  });
};