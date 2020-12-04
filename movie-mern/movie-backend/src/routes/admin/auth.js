const express = require('express')
const { requireSignin } = require('../../common-middleware')
const {signup, signin, signout} = require('../../controller/admin/auth')
const router = express.Router()

router.post("/admin/signup", signup)

router.post("/admin/signin", signin)

router.post("/admin/signout", requireSignin, signout)
router.post("/profile", requireSignin,(req, res) => {
    res.status(200).json({user: 'profile'})
})
module.exports = router