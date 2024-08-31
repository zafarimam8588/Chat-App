import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db";
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cookieParser = require("cookie-parser");

dotenv.config();
connectToDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messageRoutes", messageRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
