import express from "express";
const router = express.Router();
import { allMessages, sendMessage } from "../controllers/messageController";

router.get("/:chatId", allMessages);
router.post("/", sendMessage);

module.exports = router;
