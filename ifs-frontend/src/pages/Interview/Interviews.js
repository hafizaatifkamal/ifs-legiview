import { Box } from "@mui/material";
import React from "react";
import Interview from "../../components/Interviews/Interview";
import UpcomingMeetings from "../../components/Meeting/UpcomingMeetings";
import Insights from "../../components/Insights/Insight";
import { useSelector } from "react-redux";
const Interviews = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <>
      {user.role === "super-admin" || user.role === "admin" ? (
        <Insights />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ flex: "2" }}>
            <Interview />
          </Box>
          <Box sx={{ ml: 1 }}>
            <UpcomingMeetings />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Interviews;
