const express = require("express");
// const {  } = require('../controller/category')
const { requireSignin, adminMiddleware } = require("../common-middleware");
const { createProduct, getProduct } = require("../controller/product");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  createProduct
);
router.get('/product/getproduct', getProduct)

module.exports = router;
