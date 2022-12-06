import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companies: [],
};

const CompanySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompanies(state, action) {
      state.companies = action.payload;
    },
  },
});

export const CompanyAction = CompanySlice.actions;

export default CompanySlice;
