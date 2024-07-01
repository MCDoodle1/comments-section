import errorHandler from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, commentId, userId } = req.body;
    if (userId !== req.user.id) {
      return next(errorHandler(403, "Unauthorized"));
    }
    let newComment = new Comment({
      content,
      commentId,
      userId,
    });
    newComment = await newComment.save();

    // Populate userId field before sending response
    newComment = await Comment.populate(newComment, {
      path: "userId",
      select: "username avatar",
    });

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "username avatar",
      })
      .exec();
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
