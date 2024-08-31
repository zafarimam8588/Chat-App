import { Request, Response, json } from "express";
import { generateTokenInterface, userInterface } from "../types/types";
const User = require("../models/userModel");
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function generateToken(params: generateTokenInterface) {
  const { id, email } = params;
  jwt.sign({ id, email }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
}

export const allUsers = async (req: userInterface, res: Response) => {
  const searchParam = req.query.search;
  let keyword;
  if (searchParam) {
    keyword = {
      $or: [
        { name: { $regex: searchParam, $options: "i" } },
        { email: { $regex: searchParam, $options: "i" } },
      ],
    };
  } else {
    keyword = {};
  }

  const users = await User.find({
    ...keyword,
    _id: { $ne: req.user._id },
  });
  res.send(users);
};
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      hashedPassword,
      pic,
    });

    res
      .cookie(
        "token",
        generateToken({ id: user._id.toString(), email: user.email })
      )
      .json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
  } catch (error) {
    res.status(400);
    throw new Error("User not found");
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({
      message: "No user found with this email",
    });
  }
  try {
    let token;
    if (await bcrypt.compare(password, user.password)) {
      token = generateToken({ id: user._id.toString(), email: user.email });
      user.token = token;
      user.password = null;

      res.cookie("token", token).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot login.Please try again",
    });
  }
};
