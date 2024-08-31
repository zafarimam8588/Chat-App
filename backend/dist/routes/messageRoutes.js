"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const messageController_1 = require("../controllers/messageController");
router.get("/:chatId", messageController_1.allMessages);
router.post("/", messageController_1.sendMessage);
module.exports = router;
