import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  candidate: [],
  levelDetails: {},
  candidateByID: {},
  meetings: [],
  states: [],
};

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    setCandidate(state, action) {
      state.candidate = action.payload;
    },
    setlevelDetails(state, action) {
      state.levelDetails = action.payload;
    },
    setcandidateByID(state, action) {
      state.candidateByID = action.payload;
    },
    setMonthlyMeetings(state, action) {
      state.meetings = action.payload;
    },
    resetState(state, action) {
      state.candidateByID = initialState.candidateByID;
    },
    setStates(state, action) {
      state.states = action.payload;
    },
  },
});

export const candidateAction = candidateSlice.actions;

export default candidateSlice;
