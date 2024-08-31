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
exports.addToGroup = exports.removeFromGroup = exports.renameGroup = exports.createGroupChat = exports.accessChat = exports.fetchChats = void 0;
const chatModel_1 = require("../models/chatModel");
const fetchChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        if (!userId) {
            console.log("UserId is not sent with request");
            return res.sendStatus(400);
        }
        const isChat = yield chatModel_1.Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: userId } } },
                { users: { $elemMatch: { $eq: req.user._id } } },
            ],
        })
            .populate("users", "-password")
            .populate({
            path: "latestMessage",
            populate: {
                path: "sender",
                select: "name email pic",
            },
        });
        if (isChat.length > 0) {
            res.json(isChat[0]);
        }
        else {
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };
            const chat = yield chatModel_1.Chat.create(chatData);
            const chatInfo = yield chatModel_1.Chat.findById({ _id: chat._id }).populate("users", "-password");
            res.status(200).json(chatInfo);
        }
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
exports.fetchChats = fetchChats;
const accessChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allChats = yield chatModel_1.Chat.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("users")
            .populate("groupAdmin")
            .populate({
            path: "latestMessage",
            populate: {
                path: "sender",
                select: "name email pic",
            },
        });
        res.status(200).send(allChats);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
exports.accessChat = accessChat;
const createGroupChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }
    const users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }
    users.push(req.user);
    try {
        const groupChat = yield chatModel_1.Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        const fullGroupChat = yield chatModel_1.Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
exports.createGroupChat = createGroupChat;
const renameGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, chatName } = req.body;
        const updatedChat = yield chatModel_1.Chat.findByIdAndUpdate(chatId, {
            chatName: chatName,
        }, {
            new: true,
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.json(updatedChat);
    }
    catch (error) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    res.status(404);
    throw new Error("Chat Not Found");
});
exports.renameGroup = renameGroup;
const removeFromGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, userId } = req.body;
        // check if the requester is admin
        const removed = yield chatModel_1.Chat.findByIdAndUpdate(chatId, {
            $pull: { users: userId },
        }, {
            new: true,
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.json(removed);
    }
    catch (error) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
});
exports.removeFromGroup = removeFromGroup;
const addToGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, userId } = req.body;
        // check if the requester is admin
        const added = yield chatModel_1.Chat.findByIdAndUpdate(chatId, {
            $push: { users: userId },
        }, {
            new: true,
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.json(added);
    }
    catch (error) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
});
exports.addToGroup = addToGroup;
