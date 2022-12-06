import { configureStore } from "@reduxjs/toolkit";

import contentsSlice from "./contents-slice";
import uiSlice from "./ui-slice";
import userSlice from "./user-slice";
import candidateSlice from "./candidate-slice";
import InterviewerSlice from "./interviewer-slice";
import reviewSlice from "./review-slice";
import CompanySlice from "./company-slice";
import InsightsSlice from "./insights-slice";
export default configureStore({
  reducer: {
    contents: contentsSlice.reducer,
    ui: uiSlice.reducer,
    user: userSlice.reducer,
    candidate: candidateSlice.reducer,
    interviewer: InterviewerSlice.reducer,
    review: reviewSlice.reducer,
    company: CompanySlice.reducer,
    insights: InsightsSlice.reducer,
  },
});
