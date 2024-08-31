import express from "express";
import {
  allUsers,
  registerUser,
  loginUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/", allUsers);
router.post("/signup", registerUser);
router.post("/login", loginUser);

module.exports = router;
