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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.allUsers = void 0;
const User = require("../models/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(params) {
    const { id, email } = params;
    jsonwebtoken_1.default.sign({ id, email }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}
const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchParam = req.query.search;
    let keyword;
    if (searchParam) {
        keyword = {
            $or: [
                { name: { $regex: searchParam, $options: "i" } },
                { email: { $regex: searchParam, $options: "i" } },
            ],
        };
    }
    else {
        keyword = {};
    }
    const users = yield User.find(Object.assign(Object.assign({}, keyword), { _id: { $ne: req.user._id } }));
    res.send(users);
});
exports.allUsers = allUsers;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);
        if (!name || !email || !password) {
            res.status(400);
            throw new Error("Please Enter all the Feilds");
        }
        const userExists = yield User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield User.create({
            name,
            email,
            password: hashedPassword,
        });
        res
            .cookie("token", generateToken({ id: user._id.toString(), email: user.email }))
            .json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    }
    catch (error) {
        res.status(400);
        console.log(error);
        throw new Error("User not found");
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "No user found with this email",
        });
    }
    try {
        let token;
        if (yield bcrypt_1.default.compare(password, user.password)) {
            token = generateToken({ id: user._id.toString(), email: user.email });
            user.token = token;
            user.password = null;
            res.cookie("token", token).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: token,
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot login.Please try again",
        });
    }
});
exports.loginUser = loginUser;
