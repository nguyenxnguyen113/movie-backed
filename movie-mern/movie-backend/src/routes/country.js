const express = require('express')

const { requireSignin, adminMiddleware } = require('../common-middleware')
const { addCountry, getCountry } = require('../controller/country')


const router = express.Router()

router.post('/country/create',requireSignin, adminMiddleware, addCountry )
router.get('/country/getCountry', getCountry)

module.exports = router;