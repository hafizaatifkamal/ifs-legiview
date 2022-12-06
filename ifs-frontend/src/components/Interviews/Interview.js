import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Card,
  CardContent,
  Slider,
  Button,
  Typography,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import Ratings from "./Rating";
import InterviewRoundDetail from "./InterviewRoundDetail";
import Resume from "../Resume/Resume";
import {
  getCandidate,
  getTodayInterviewByInterviewerID,
} from "../../store/candidate-action";
import { useSelector, useDispatch } from "react-redux";
import Menus from "./Menu";
import { Link } from "react-router-dom";
import RequestReschedule from "./RequestReschedule";
import moment from "moment";

const Interview = () => {
  const dispatch = useDispatch();
  const [sliderstate, setSliderstate] = useState(0);
  const [click, setClick] = useState(0);
  const [openCard, setOpenCard] = useState();
  const [showCv, setShowCv] = useState(false);
  const [viewResorces, setViewResorces] = useState(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const { candidate } = useSelector((state) => state.candidate);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      if (user.role === "hr") {
        dispatch(getCandidate());
      } else if (user.role === "interviewer") {
        dispatch(getTodayInterviewByInterviewerID(user.id));
      }
    }
    // eslint-disable-next-line
  }, [user]);
  useEffect(() => {
    if (user) {
      if (user.role === "interviewer") {
        dispatch(getTodayInterviewByInterviewerID(user.id));
      }
    }
    // eslint-disable-next-line
  }, [showReschedule]);

  const handleSlider = (elem, e) => {
    if (elem) {
      setOpenCard(elem);
    }
    setClick(sliderstate);
    setSliderstate(e.target.value);
  };

  const handleonClink = (event) => {
    if (click === sliderstate) {
      setSliderstate(0);
    }
  };

  const handleRequestReschedule = (show) => {
    setShowReschedule(show);
  };

  const sliderHover = (value, elem) => {
    return (
      <>
        {value > 0 ? (
          <div>
            Level : {value}
            <br />
            Interview Date :{" "}
            {moment(elem.rounds[value - 1].interviewDate).format("DD-MM-YYYY")}
            <br />
            Interview Time :{" "}
            {moment(elem.rounds[value - 1].starttime, "HH:mm").format(
              "hh:mm A"
            )}
            -{moment(elem.rounds[value - 1].endtime, "HH:mm").format("hh:mm A")}
            <br />
            {/* //Interviewer : {"yusuf"} */}
            Interviewer : {elem.rounds[value - 1].interviewer.name}
          </div>
        ) : (
          "0"
        )}
      </>
    );
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <h1>Interview</h1>
        </Grid>
        <Grid item xs={8}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
            }}
          >
            {user.role === "hr" && (
              <Button
                component={Link}
                to="/create-interview"
                variant="contained"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "500",
                  backgroundColor: "#1AAE9F",
                  ":hover": {
                    background: "#1AAE9F",
                    color: "white",
                  },
                }}
              >
                Create Interview
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
      <Card>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
          }}
        >
          {candidate &&
            candidate.map((elem, index) => {
              return (
                <CardContent key={index}>
                  <ListItem sx={{ flexWrap: "wrap" }}>
                    <ListItemAvatar sx={{ fontSize: "30px" }}>
                      <Avatar
                        sx={{
                          backgroundColor: "orange",
                          height: "50px",
                          width: "50px",
                          fontSize: "27px",
                        }}
                      >
                        {elem.candidateName.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <Box sx={{ pr: 3, textTransform: "capitalize" }}>
                      <ListItemText
                        sx={{ fontSize: "25px" }}
                        primary={elem.candidateName}
                        // secondary="hr"
                        secondary={elem.role.role}
                      />
                    </Box>
                    <Box sx={{ flex: "1" }}>
                      <Ratings fontSize={"30px"} rating={elem.ratings} />
                    </Box>
                    {elem.rounds[elem.rounds.length - 1].resheduleRequested ===
                      "requested" && (
                      <Box>
                        <Stack>
                          <Chip
                            label="Reshedule Requested"
                            // color="error"
                            variant="outlined"
                            sx={{ color: "orange" }}
                          />
                        </Stack>
                      </Box>
                    )}
                    <Box sx={{ mx: 5 }}>
                      <Menus
                        elem={elem}
                        setShowCv={setShowCv}
                        setViewResorces={setViewResorces}
                        handleRequestReschedule={handleRequestReschedule}
                        level={sliderstate}
                      />
                    </Box>
                  </ListItem>
                  <Box sx={{ px: 8 }}>
                    <Slider
                      min={0}
                      max={3}
                      name="slider"
                      onClick={(e) => handleonClink(e)}
                      marks
                      value={
                        elem.rounds[elem.rounds.length - 1]
                          .MeetingDetailsExist === "Exist"
                          ? elem.rounds.length
                          : elem.rounds.length - 1
                      }
                      onChange={(e) => handleSlider(elem, e)}
                      valueLabelDisplay="auto"
                      style={{ width: "100%" }}
                      valueLabelFormat={(value) => sliderHover(value, elem)}
                    />
                  </Box>
                  {sliderstate !== 0 &&
                    elem.candidateName === openCard.candidateName && (
                      <InterviewRoundDetail
                        elem={openCard}
                        sliderState={sliderstate}
                      />
                    )}
                  {showReschedule && (
                    <RequestReschedule
                      candidateName={elem.candidateName}
                      candidateId={elem._id}
                      showReschdule={showReschedule}
                      handleRequestReschedule={handleRequestReschedule}
                    />
                  )}
                </CardContent>
              );
            })}
        </List>
      </Card>
      {viewResorces && (
        <Resume
          showCv={showCv}
          setShowCv={setShowCv}
          viewResorces={viewResorces}
        />
      )}
    </>
  );
};

export default Interview;
