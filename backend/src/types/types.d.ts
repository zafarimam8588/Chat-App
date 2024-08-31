import { Request } from "express";

export interface userInterface extends Request {
  user?: JwtPayload | string;
}

export interface generateTokenInterface {
  id: string;
  email: string;
}
