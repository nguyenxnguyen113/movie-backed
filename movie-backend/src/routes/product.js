const express = require("express");
const axios = require('axios')
// const {  } = require('../controller/category')
const { requireSignin, adminMiddleware } = require("../common-middleware");
const { createProduct, getProduct, deleteProductById, getProductById, updateProductById, getProductByQuery, vote,createComment,getComment, searchFilm } = require("../controller/product");
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
router.get('/product/getProduct', getProduct)
router.delete("/product/deleteProductById", requireSignin, adminMiddleware, deleteProductById);
router.get("/product/getProductById", getProductById);
router.post("/product/editProductById/:id", requireSignin, adminMiddleware, updateProductById);
router.get("/product/getProductByQuery/", getProductByQuery);
router.post("/product/vote", vote);
router.post("/product/comment",requireSignin,createComment)
router.get("/product/comment",getComment)
router.post("/product/searchFilm",searchFilm)
router.post("/product/streamTape/getTicket",(req,res)=>{
  const {key} = req.body
  console.log(key);
  axios.get(`https://api.streamtape.com/file/dlticket?file=${key}&login=d78dd8c9336754386cf7&key=8OqW6PzL7Vio7ad`).then((response)=>{
    console.log(response.data);
    setTimeout(()=>{
      console.log(response.data);
      res.status(200).json(response.data)
    },5000)
  })

})
router.post('/product/streamTape/getlink', (req, res) => {
  const { ticket, key } = req.body
  console.log(ticket);
  axios.get(`https://api.streamtape.com/file/dl?file=${key}&ticket=${ticket}`).then((response) => {
    res.status(200).json(response.data)
  })
})
module.exports = router;
