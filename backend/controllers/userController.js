const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const cookieParser = require("cookie-parser");
const { auth } = require("../middleware/auth");
const expressAsyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email, password, confirmPassword } =
    req.body;
  console.log("args", req.body);
  // validate

  if (password !== confirmPassword) {
    res.status(400).json({ message: "Passwords do not match" });
    // throw new Error("Passwords do not match");
  }
  if (
    !firstName ||
    !lastName ||
    !username ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    res.status(400);
    //throw new Error("Please include all fields");
  }

  // Find if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    //  throw new Error("User already exists");
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const token = jwt.sign({ id: user._id }, "YOUR_SECRET_KEY");
  console.log("MYTOKEN", token);
  return (
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      // .cookie("access_token", token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      // })
      .status(200)
      .json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      })
  );
});
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   const token = jwt.sign({ id: user._id }, "YOUR_SECRET_KEY");
//   console.log("MYTOKEN", token);
//   return (
//     res
//       .cookie("token", token, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "none",
//       })
//       // .cookie("access_token", token, {
//       //   httpOnly: true,
//       //   secure: process.env.NODE_ENV === "production",
//       // })
//       .status(200)
//       .json({
//         _id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         username: user.username,
//       })
//   );
// });

// router.post("/logout", auth, (req, res) => {
//   return res
//     .clearCookie("token")
//     .status(200)
//     .json({ message: "Successfully logged out 😏 🍀" });
// });
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { registerUser, loginUser };
