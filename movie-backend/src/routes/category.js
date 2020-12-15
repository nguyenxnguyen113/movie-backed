const express = require('express')
const Category = require('../models/category')

const { addCategory, getCategory, deleteCategoryById, getCategoryById, updateCategoryById } = require('../controller/category')
const { requireSignin, adminMiddleware } = require('../common-middleware')


const router = express.Router()

router.post('/category/create', requireSignin, adminMiddleware, addCategory)
router.get('/category/getcategory', getCategory)
router.delete('/category/deleteCategory', requireSignin, adminMiddleware, deleteCategoryById)
router.post("/category/updateCategoryById/:id", requireSignin, adminMiddleware, updateCategoryById);
router.get("/category/getCategoryById/:id", requireSignin, adminMiddleware, getCategoryById);
module.exports = router;