import express from "express";
import { verifyToken } from "../utils/verifytoken.js";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
  likeComment,
  replyToComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);
router.put("/editComment/:commentId", verifyToken, editComment);
router.get("/getComments", getComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.post("/reply/:commentId", verifyToken, replyToComment);

export default router;
