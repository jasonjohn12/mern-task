const express = require("express");
const cors = require("cors");
require("dotenv").config();
const colors = require("colors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
connectDB();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/task", require("./controllers/taskController"));
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
//module.exports = app;
