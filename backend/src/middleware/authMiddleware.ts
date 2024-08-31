import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userInterface } from "../types/types";

export const auth = async (
  req: userInterface,
  res: Response,
  next: NextFunction
) => {
  // ACCESSING THE TOKEN
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    // VERIFYING THE TOKEN

    const decode = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decode;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
};
