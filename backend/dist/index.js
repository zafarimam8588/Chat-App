"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cookieParser = require("cookie-parser");
dotenv_1.default.config();
(0, db_1.connectToDB)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messageRoutes", messageRoutes);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
