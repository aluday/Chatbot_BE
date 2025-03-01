const express = require("express")
const messageController  = require("../controllers/MessageController.js")

const router = express.Router()

// router.get("/user", messageController.getSession)

router.post("/create", messageController.createChatSession);
router.post("/chat", messageController.sendAnswer);
router.get("/conversation/:id", messageController.getConversationList);

module.exports = router