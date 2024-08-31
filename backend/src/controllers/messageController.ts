import { Request, Response } from "express";
import { Message } from "../models/messageModel";
import { userInterface } from "../types/types";
import { Chat } from "../models/chatModel";

export const allMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error as string);
  }
};
export const sendMessage = async (req: userInterface, res: Response) => {
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

    let message = await Message.create(newMessage);
    const updatedMessages = await Message.findById(message._id)
      .populate("sender", "name pic")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "name pic email",
        },
      });

    await Chat.findByIdAndUpdate(
      {
        chatId,
      },
      {
        latestMessage: updatedMessages,
      }
    );

    res.status(200).json(updatedMessages);
  } catch (error) {
    throw new Error(error as string);
  }
};
