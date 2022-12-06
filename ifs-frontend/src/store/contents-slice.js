import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contents: [],
};

const contentsSlice = createSlice({
  name: "contents",
  initialState,
  reducers: {
    getContents(state, action) {
      state.contents = [];
    },
    AddContent(state, action) {
      state.contents.push(action.payload);
    },
  },
});

export const contentsActions = contentsSlice.actions;

export default contentsSlice;
