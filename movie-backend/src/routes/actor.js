const express = require('express')

const { requireSignin, adminMiddleware } = require('../common-middleware')
const { addActor, getActor, deleteActor } = require('../controller/actor')


const router = express.Router()

router.post('/actor/create',requireSignin, adminMiddleware, addActor )
router.get('/actor/getActor', getActor)
router.delete("/actor/deleteActorById", requireSignin, adminMiddleware, deleteActor);
module.exports = router;