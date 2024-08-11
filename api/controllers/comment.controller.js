import errorHandler from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, parentCommentId, parentCommentUsername, userId } =
      req.body;
    if (userId !== req.user.id) {
      return next(errorHandler(403, "Unauthorized"));
    }

    if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
      return next(errorHandler(400, "Invalid parent comment ID"));
    }

    let newComment = new Comment({
      content,
      userId,
      parentCommentId: parentCommentId || null,
      parentCommentUsername,
    });
    newComment = await newComment.save();

    // Populate userId field before sending response
    newComment = await Comment.populate(newComment, {
      path: "userId",
      select: "username avatar",
    });

    // If this is a reply, include the parentCommentUsername
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId).populate({
        path: "userId",
        select: "username",
      });
      newComment = {
        ...newComment.toObject(),
        parentCommentUsername: parentComment.userId.username,
      };
    }

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId.toString() !== req.user.id) {
      return next(errorHandler(403, "Unauthorized"));
    }
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content, userId } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId.toString() !== userId) {
      return next(errorHandler(403, "Unauthorized"));
    }
    comment.content = content;
    const updatedComment = await comment.save();

    await updatedComment.populate({
      path: "userId",
      select: "username avatar",
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const fetchReplies = async (commentId, parentCommentUsername) => {
      const replies = await Comment.find({ parentCommentId: commentId })
        .populate({
          path: "userId",
          select: "username avatar",
        })
        .exec();

      return Promise.all(
        replies.map(async (reply) => ({
          ...reply.toObject(),
          parentCommentUsername,
          replies: await fetchReplies(reply._id, reply.userId.username),
        }))
      );
    };

    const parentComments = await Comment.find({ parentCommentId: null })
      .populate({
        path: "userId",
        select: "username avatar",
      })
      .exec();

    const commentsWithReplies = await Promise.all(
      parentComments.map(async (parentComment) => ({
        ...parentComment.toObject(),
        replies: await fetchReplies(
          parentComment._id,
          parentComment.userId.username
        ),
      }))
    );

    res.status(200).json(commentsWithReplies);
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

export const replyToComment = async (req, res, next) => {
  try {
    const { content, userId, parentCommentId, parentCommentUsername } =
      req.body;

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }

    if (userId !== req.user.id) {
      return next(errorHandler(403, "Unauthorized"));
    }

    if (!parentCommentId) {
      throw new Error("parentCommentId is required");
    }

    const parentComment = await Comment.findById(parentCommentId).populate({
      path: "userId",
      select: "username",
    });

    if (!parentComment) {
      return next(errorHandler(404, "Parent comment not found"));
    }

    const reply = new Comment({
      content,
      parentCommentId,
      parentCommentUsername,
      userId,
    });

    await reply.save();

    const updatedReply = await reply.save();

    await updatedReply.populate({
      path: "userId",
      select: "username avatar",
    });

    const response = {
      ...updatedReply.toObject(),
      parentCommentUsername: parentComment.userId.username,
    };
    res.status(200).json(response);

    console.log(response);
  } catch (error) {
    next(error);
  }
};
