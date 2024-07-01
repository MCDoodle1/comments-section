import express from "express";
import { verifyToken } from "../utils/verifytoken.js";
import {
  createComment,
  getComments,
  likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getComments", getComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);

export default router;
