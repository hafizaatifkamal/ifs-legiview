import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: {
    // role: "hr",
    // id: "622af8f2d02a2206b404291e",
    // role: "interviewer",
    // id: "62308a1f56209f0880021d90",
    // id:'623812916dcc135a38df56fa'
  },
  userByName: [],
  interviewerNotifications: [],
  hrNotifications: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      Cookies.set("access", action.payload.access);
      Cookies.set("refresh", action.payload.refresh);
    },
    logout(state, action) {
      Cookies.remove("access");
      Cookies.remove("refresh");
      state.user = initialState.user;
    },
    setUserDetails(state, action) {
      state.user = action.payload;
    },
    setUserByName(state, action) {
      state.userByName = action.payload;
    },
    setInterviewerNotifications(state, action) {
      state.interviewerNotifications = action.payload;
    },
    setHrNotifications(state, action) {
      state.hrNotifications = action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
