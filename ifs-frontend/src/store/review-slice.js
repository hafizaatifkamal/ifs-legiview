import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  review: [],
  reviewDetail: {},
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setreview(state, action) {
      state.review = action.payload;
    },
    setreviewDetail(state, action) {
      state.reviewDetail = action.payload;
    },
  },
});

export const reviewAction = reviewSlice.actions;

export default reviewSlice;
