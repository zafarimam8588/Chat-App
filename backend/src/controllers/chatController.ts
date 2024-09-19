import { Request, Response } from "express";
import { Chat } from "../models/chatModel";
import { userInterface } from "../types/types";
import { populate } from "dotenv";

export const fetchChats = async (req: userInterface, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId is not sent with request");
      return res.sendStatus(400);
    }
    const isChat = await Chat.find({
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
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      const chat = await Chat.create(chatData);
      const chatInfo = await Chat.findById({ _id: chat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(chatInfo);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error as string);
  }
};
export const accessChat = async (req: userInterface, res: Response) => {
  try {
    const allChats = await Chat.find({
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
  } catch (error) {
    res.status(400);
    throw new Error(error as string);
  }
};
export const createGroupChat = async (req: userInterface, res: Response) => {
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
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error as string);
  }
};
export const renameGroup = async (req: Request, res: Response) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.json(updatedChat);
  } catch (error) {
    res.status(404);
    throw new Error("Chat Not Found");
  }

  res.status(404);
  throw new Error("Chat Not Found");
};
export const removeFromGroup = async (req: Request, res: Response) => {
  try {
    const { chatId, userId } = req.body;

    // check if the requester is admin:TODO

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(removed);
  } catch (error) {
    res.status(404);
    throw new Error("Chat Not Found");
  }
};
export const addToGroup = async (req: Request, res: Response) => {
  try {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.json(added);
  } catch (error) {
    res.status(404);
    throw new Error("Chat Not Found");
  }
};
