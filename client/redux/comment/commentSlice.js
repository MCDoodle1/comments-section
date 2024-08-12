import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getComments = createAsyncThunk(
  "comments/getComments",
  async () => {
    const res = await fetch("/api/comment/getComments");
    if (!res.ok) {
      throw new Error("Failed to fetch comments");
    }
    return res.json();
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ content, commentId, userId }) => {
    const res = await fetch("/api/comment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, commentId, userId }),
    });
    if (!res.ok) {
      throw new Error("Failed to add comment");
    }
    return res.json();
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ commentId, userId }) => {
    const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to delete comment");
    }
    return commentId;
  }
);

export const editComment = createAsyncThunk(
  "comments/editComment",
  async ({ commentId, content, userId }, thunkAPI) => {
    const { currentUser } = thunkAPI.getState().user;
    const res = await fetch(`/api/comment/editComment/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify({ content, userId }),
    });
    if (!res.ok) {
      throw new Error("Failed to edit comment");
    }
    return res.json();
  }
);

const findComment = (comments, commentId) => {
  for (const comment of comments) {
    if (comment._id === commentId) {
      return comment;
    }
    if (Array.isArray(comment.replies) && comment.replies.length > 0) {
      const nestedComment = findComment(comment.replies, commentId);
      if (nestedComment) {
        return nestedComment;
      }
    }
  }
  return null;
};

const updateLikesInComments = (
  comments,
  commentId,
  userId,
  numberOfLikes,
  isLike
) => {
  return comments.map((comment) => {
    if (comment._id === commentId) {
      const updatedLikes = isLike
        ? [...comment.likes, userId]
        : comment.likes.filter((id) => id !== userId);
      return { ...comment, numberOfLikes, likes: updatedLikes };
    }
    if (comment.replies) {
      return {
        ...comment,
        replies: updateLikesInComments(
          comment.replies,
          commentId,
          userId,
          numberOfLikes,
          isLike
        ),
      };
    }
    return comment;
  });
};

export const likeComment = createAsyncThunk(
  "comments/likeComment",
  async ({ commentId, userId, token }, { getState, rejectWithValue }) => {
    try {
      const { comments } = getState().comments;
      const comment = findComment(comments, commentId);

      if (!comment) {
        return rejectWithValue("Comment not found");
      }
      if (comment.likes.includes(userId)) {
        return rejectWithValue("User has already liked this comment");
      }
      const res = await fetch(`api/comment/likeComment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ increment: 1 }),
      });
      if (!res.ok) {
        throw new Error("Failed to like comment");
      }
      const data = await res.json();
      return { commentId, userId, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const unlikeComment = createAsyncThunk(
  "comments/unlikeComment",
  async ({ commentId, userId, token }, { getState, rejectWithValue }) => {
    try {
      const { comments } = getState().comments;
      const comment = findComment(comments, commentId);

      if (!comment) {
        return rejectWithValue("Comment not found");
      }
      if (!comment.likes.includes(userId) || comment.numberOfLikes === 0) {
        throw new Error(
          "User has not liked this comment or likes count is zero"
        );
      }
      const res = await fetch(`api/comment/likeComment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ increment: -1 }),
      });
      if (!res.ok) {
        throw new Error("Failed to unlike comment");
      }
      const data = await res.json();
      return { commentId, userId, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const replyToComment = createAsyncThunk(
  "comments/replyToComment",
  async (
    { content, parentCommentId, parentCommentUsername, userId, token },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `/api/comment/replyToComment/${parentCommentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content,
            userId,
            parentCommentId,
            parentCommentUsername,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to reply to comment");
      }
      const newReply = await res.json();
      return { parentCommentId, parentCommentUsername, newReply };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = [action.payload, ...state.comments];
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;

        const deleteCommentById = (comments, commentId) => {
          return comments
            .map((comment) => {
              if (comment._id === commentId) {
                return null;
              }
              if (comment.replies) {
                comment.replies = deleteCommentById(comment.replies, commentId);
              }
              return comment;
            })
            .filter((comment) => comment !== null);
        };

        state.comments = deleteCommentById(state.comments, action.payload);
      })

      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(editComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.loading = false;
        const { _id: updatedCommentId, content } = action.payload;

        const editCommentById = (comments, updatedCommentId, content) => {
          return comments.map((comment) => {
            if (comment._id === updatedCommentId) {
              return { ...comment, content };
            }
            if (comment.replies) {
              comment.replies = editCommentById(
                comment.replies,
                updatedCommentId,
                content
              );
            }
            return comment;
          });
        };

        state.comments = editCommentById(
          state.comments,
          updatedCommentId,
          content
        );
      })
      .addCase(editComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        state.loading = false;
        const {
          commentId,
          data: { numberOfLikes },
          userId,
        } = action.payload;

        state.comments = updateLikesInComments(
          state.comments,
          commentId,
          userId,
          numberOfLikes,
          true
        );
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unlikeComment.fulfilled, (state, action) => {
        state.loading = false;
        const {
          commentId,
          data: { numberOfLikes },
          userId,
        } = action.payload;

        state.comments = state.comments = updateLikesInComments(
          state.comments,
          commentId,
          userId,
          numberOfLikes,
          false
        );
      })
      .addCase(unlikeComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(replyToComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(replyToComment.fulfilled, (state, action) => {
        state.loading = false;
        const { parentCommentId, newReply, parentCommentUsername } =
          action.payload;

        const addReplyImmutable = (
          comments,
          parentCommentId,
          parentCommentUsername,
          newReply
        ) => {
          return comments.map((comment) => {
            if (comment._id === parentCommentId) {
              return {
                ...comment,
                replies: comment.replies
                  ? [...comment.replies, { ...newReply, parentCommentUsername }]
                  : [{ ...newReply, parentCommentUsername }],
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: addReplyImmutable(
                  comment.replies,
                  parentCommentId,
                  parentCommentUsername,
                  newReply
                ),
              };
            }
            return comment;
          });
        };
        state.comments = addReplyImmutable(
          state.comments,
          parentCommentId,
          parentCommentUsername,
          newReply
        );
      })
      .addCase(replyToComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default commentSlice.reducer;
