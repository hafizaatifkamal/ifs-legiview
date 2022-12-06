import React, { useEffect } from "react";
import { Box, Card, Typography, ListItemText, Divider } from "@mui/material";
import Ratings from "./Rating";
import { useSelector, useDispatch } from "react-redux";
import { getLevelDetails } from "../../store/candidate-action";

const InterviewRoundDetail = (props) => {
  const { elem, sliderState } = props;
  const dispatch = useDispatch();

  const { levelDetails } = useSelector((state) => state.candidate);

  useEffect(() => {
    dispatch(getLevelDetails(elem._id, sliderState));
    // eslint-disable-next-line
  }, [sliderState]);

  return (
    <>
      {Object.keys(levelDetails).length !== 0 ? (
        <Box>
          <Card sx={{ mx: 7, px: 3, height: "300px", overflow: "auto" }}>
            <Typography variant="h5">Meeting Notes : </Typography>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flex: 2 }}>
                <ListItemText
                  secondary={
                    elem.rounds[sliderState - 1]
                      ? elem.rounds[sliderState - 1].interviewDate +
                        " " +
                        elem.rounds[sliderState - 1].starttime +
                        " " +
                        elem.rounds[sliderState - 1].endtime
                      : ""
                  }
                >
                  Level {sliderState} [
                  {elem.rounds[sliderState - 1]
                    ? " " + elem.rounds[sliderState - 1].interviewer.name + " "
                    : ""}
                  ]
                </ListItemText>
              </Box>
              <Box sx={{ flex: 5 }}>
                <Ratings fontSize={"25px"} rating={levelDetails.rating} />
              </Box>
            </Box>
            <Typography sx={{ pl: 1 }}>
              {levelDetails.meetingfeedback}{" "}
            </Typography>
            <Divider />
            {levelDetails.data.map((e, index) => {
              return (
                <Box key={index} sx={{ mt: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box>
                      <h5 style={{ display: "inline", padding: 0, margin: 0 }}>
                        question {index + 1}:{" "}
                      </h5>
                      <Box sx={{ px: 3 }}>
                        <p>{e.question}</p>
                      </Box>
                    </Box>
                    <Box>
                      <h5 style={{ display: "inline" }}>
                        Answer {index + 1}:{" "}
                      </h5>
                      <Box sx={{ px: 3 }}>
                        <p>{e.answer}</p>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Ratings fontSize={"20px"} rating={e.rating} />
                  </Box>
                </Box>
              );
            })}
          </Card>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <h5>NO MEETING DETAILS FOUND</h5>
        </Box>
      )}
    </>
  );
};

export default InterviewRoundDetail;
