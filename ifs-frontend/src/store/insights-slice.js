import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  insights: {},
  roleGroupInsights: {},
  insightsByRole: {},
};

const InsightsSlice = createSlice({
  name: "insights",
  initialState,
  reducers: {
    setInsights(state, action) {
      state.insights = action.payload;
    },
    setRoleGroupInsights(state, action) {
      state.roleGroupInsights = action.payload;
    },
    setInsightsByRole(state, action) {
      state.insightsByRole = action.payload;
    },
  },
});

export const InsightsAction = InsightsSlice.actions;

export default InsightsSlice;
