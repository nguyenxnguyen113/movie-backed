const express = require('express')

const { requireSignin, adminMiddleware } = require('../common-middleware')
const { addActor, getActor } = require('../controller/actor')


const router = express.Router()

router.post('/actor/create',requireSignin, adminMiddleware, addActor )
router.get('/actor/getActor', getActor)

module.exports = router;