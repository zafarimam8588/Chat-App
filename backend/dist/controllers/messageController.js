"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.allMessages = void 0;
const messageModel_1 = require("../models/messageModel");
const chatModel_1 = require("../models/chatModel");
const allMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    try {
        const messages = yield messageModel_1.Message.find({ chat: chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
exports.allMessages = allMessages;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, chatId } = req.body;
        if (!content || !chatId) {
            console.log("Invalid data passed into request");
            return res.sendStatus(400);
        }
        const newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId,
        };
        let message = yield messageModel_1.Message.create(newMessage);
        const updatedMessages = yield messageModel_1.Message.findById(message._id)
            .populate("sender", "name pic")
            .populate({
            path: "chat",
            populate: {
                path: "users",
                select: "name pic email",
            },
        });
        yield chatModel_1.Chat.findByIdAndUpdate({
            chatId,
        }, {
            latestMessage: updatedMessages,
        });
        res.status(200).json(updatedMessages);
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.sendMessage = sendMessage;
