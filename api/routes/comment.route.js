import express from "express";
import { verifyToken } from "../utils/verifytoken.js";
import {
  createComment,
  editComment,
  deleteComment,
  getComments,
  likeComment,
  replyToComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.put("/edit/:commentId", verifyToken, editComment);
router.delete("/delete/:commentId", verifyToken, deleteComment);
router.get("/getComments", getComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.post("/reply/:commentId", verifyToken, replyToComment);

export default router;
