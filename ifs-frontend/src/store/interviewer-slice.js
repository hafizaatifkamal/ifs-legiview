import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  interviewerDetails: [],
  roles: [],
};

const InterviewerSlice = createSlice({
  name: "interviewer",
  initialState,
  reducers: {
    setInterviewer(state, action) {
      state.interviewerDetails = action.payload;
    },
    setRoles(state, action) {
      state.roles = action.payload;
    },
  },
});

export const InterviewerAction = InterviewerSlice.actions;

export default InterviewerSlice;
