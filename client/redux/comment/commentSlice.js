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
  "comments/AddComment",
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

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
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
        state.comments.unshift(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(editComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(editComment.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default commentSlice.reducer;
