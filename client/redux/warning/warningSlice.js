import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isWarningVisible: false,
  commentIdtoDelete: null,
};

const warningSlice = createSlice({
  name: "warning",
  initialState,
  reducers: {
    showWarning: (state, action) => {
      state.isWarningVisible = true;
      state.commentIdtoDelete = action.payload;
    },
    hideWarning: (state) => {
      state.isWarningVisible = false;
      state.commentIdtoDelete = null;
    },
  },
});

export const { showWarning, hideWarning } = warningSlice.actions;
export default warningSlice.reducer;
