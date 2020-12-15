const express = require('express')

const { requireSignin, adminMiddleware } = require('../common-middleware')
const { addCountry, getCountry, deleteCountryById, updateCountryById, getCountryById } = require('../controller/country')


const router = express.Router()

router.post('/country/create',requireSignin, adminMiddleware, addCountry )
router.get('/country/getCountry', getCountry)
router.delete("/country/deleteCountryById", requireSignin, adminMiddleware, deleteCountryById);
router.post("/country/editCountryById/:id", requireSignin, adminMiddleware, updateCountryById);
router.get("/country/getCountryById/:id", requireSignin, adminMiddleware, getCountryById);
module.exports = router;