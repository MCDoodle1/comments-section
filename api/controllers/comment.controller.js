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

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate(
      "userId"
    );
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    // Ensure user is not liking their own comment
    if (comment.userId && comment.userId.toString() === req.user.id) {
      return next(errorHandler(403, "You cannot like your own comment"));
    }

    if (!comment.likes) {
      comment.likes = [];
    }

    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
