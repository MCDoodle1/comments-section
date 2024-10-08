import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "all fields are required"));
  }

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const avatarFilename = req.file ? req.file.filename : null;

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: avatarFilename,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = newUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(201)
      .json({ ...rest, avatar: avatarFilename });
  } catch (error) {
    if (error.code === 11000) {
      // duplicate error code
      next(errorHandler(409, "User or Email already exists"));
    } else {
      next(errorHandler(500, "Internal server error"));
    }
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ ...rest, avatar: validUser.avatar });
  } catch (error) {
    next(errorHandler(500, "Internal server error"));
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "Successfully signed out" });
  } catch (error) {
    next(errorHandler(500, "Internal server error"));
  }
};
