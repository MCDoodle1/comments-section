import express from "express";
import { verifyToken } from "../utils/verifytoken.js";
import {
  createComment,
  getComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getComments", getComments);

export default router;
