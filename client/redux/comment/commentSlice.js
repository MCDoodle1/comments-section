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
      });
  },
});

export default commentSlice.reducer;
