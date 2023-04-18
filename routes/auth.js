import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/UserModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  const user = await userModel.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }
  console.log(password);
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({ username, password: hashedPassword, email });

  await newUser.save();
  res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "secret");
  console.log(user.isAdmin);
  res.json({
    token,
    userID: user._id,
    isAdmin: user.isAdmin,
    profilePic: user.profilePic,
  });
});

export { router as authRouter };
