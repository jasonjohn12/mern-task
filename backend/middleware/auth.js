const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, "YOUR_SECRET_KEY");
    console.log("data", data);
    req.userId = data.id;
    //req.userRole = data.role;
    return next();
  } catch {
    return res.sendStatus(403);
  }
};
// const auth = asyncHandler(async (req, res, next) => {
//   //  console.log("middleware", req?.headers);
//   // console.log("cooke", req?.cookies?.token);
//   let token = null;
//   if (req?.headers?.authorization !== "") {
//     try {
//       // get token from header
//       token = req.headers.authorization.split(" ")[1];
//       console.log("THEHEADER", req.headers.authorization);
//       //verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       // get user from token
//       req.user = await User.findById(decoded.id).select("-password");
//       console.log("FOUND USER");
//       next();
//     } catch (error) {
//       console.log("error", error);
//       res.status(401);
//     }
//   }
//   // console.log("TOKEN", token);
//   if (!token) {
//     res.status(401);
//     throw new Error("Unauthorized");
//   }
// });

module.exports = { auth };
