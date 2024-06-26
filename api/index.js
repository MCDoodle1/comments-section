import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import commentRouter from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import multer from "multer";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Multer setup
const storage = multer.diskStorage({});
const upload = multer({ storage: storage });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", upload.single("avatar"), authRouter);
app.use("/api/comment", commentRouter);

// Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
