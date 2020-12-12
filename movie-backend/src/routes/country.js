const express = require('express')

const { requireSignin, adminMiddleware } = require('../common-middleware')
const { addCountry, getCountry, deleteCountryById } = require('../controller/country')


const router = express.Router()

router.post('/country/create',requireSignin, adminMiddleware, addCountry )
router.get('/country/getCountry', getCountry)
router.delete("/country/deleteCountryById", requireSignin, adminMiddleware, deleteCountryById);

module.exports = router;