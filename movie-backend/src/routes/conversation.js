const router = require("express").Router();
const {postConversation, getAllConversation} = require('../controller/conversation')




router.post('/conversation',postConversation)
router.get('/conversation',getAllConversation)

module.exports = router