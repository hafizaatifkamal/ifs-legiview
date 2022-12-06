import React, { useEffect } from "react";
import { getAllReviews } from "../../store/review-action";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { uiActions } from "../../store/ui-slice";

const Review = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { review } = useSelector((state) => state.review);
  useEffect(() => {
    dispatch(getAllReviews());
  }, []);

  const handleClick = (elem) => {
    if (
      elem.candidate.rounds[elem.candidate.rounds.length - 1]
        .resheduleRequested === "requested"
    ) {
      navigate(`/create-interview/${elem._id}/request-reshedule`);
    } else {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Already Resheduled",
        })
      );
    }
  };
  console.log(review);
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: "#D9D9D9" }}>
            <TableRow>
              <TableCell>S.NO</TableCell>
              <TableCell align="center">Candidate Name</TableCell>
              <TableCell align="center">Interviewer Name</TableCell>
              <TableCell align="center">Level</TableCell>
              <TableCell align="center">Reshedule Date</TableCell>
              <TableCell align="center">Reshedule Start Time</TableCell>
              <TableCell align="center">Reshedule End Time</TableCell>
              <TableCell align="center">Reshedule Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {review &&
              review.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => handleClick(row)}
                  hover="true"
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {row.candidate.candidateName || "---"}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {row.interviewer.name || "--"}
                  </TableCell>
                  <TableCell align="center">
                    {row.candidate.rounds.length || "---"}
                  </TableCell>
                  <TableCell align="center">
                    {row.interviewDate || "----"}
                  </TableCell>
                  <TableCell align="center">{row.starttime || "---"}</TableCell>
                  <TableCell align="center">{row.endtime || "---"}</TableCell>
                  {row.candidate.rounds[row.candidate.rounds.length - 1]
                    .resheduleRequested !== "requested" ? (
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "700",
                        textTransform: "capitalize",
                        color: "green",
                      }}
                    >
                      {row.candidate.rounds[row.candidate.rounds.length - 1]
                        .resheduleRequested || "---"}
                    </TableCell>
                  ) : (
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "700",
                        textTransform: "capitalize",
                        color: "red",
                      }}
                    >
                      {row.candidate.rounds[row.candidate.rounds.length - 1]
                        .resheduleRequested || "---"}
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Review;
