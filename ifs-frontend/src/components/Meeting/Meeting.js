import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  CardContent,
  MenuItem,
  Menu,
  IconButton,
  Slider,
  Typography,
  Rating,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import Resume from "../Resume/Resume";
import Ratings from "../Interviews/Rating";
import CommonTextFiled from "./CommonTextField";
import ReUsableSnackbar from "../UI/ReUsableSnackbar";
import axios from "axios";
import "./Meeting.css";
import { setMeetingDetails } from "../../store/meeting-action";
import { getLevelDetails } from "../../store/candidate-action";
import { getCandidateById } from "../../store/candidate-action";
import { uiActions } from "../../store/ui-slice";
import { candidateAction } from "../../store/candidate-slice";
import { isEmpty } from "lodash";
import StatusPopUp from "./StatusPopUp";

const initState = {
  candidateName: "",
  role: "",
  prevLevelRating: 0,
};

const Meeting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const level = parseInt(search.get("level"));
  const { id } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [sliderstate, setSliderstate] = useState(0);
  const [openCard, setOpenCard] = useState();
  const [showCv, setShowCv] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerRating, setAnswerRating] = useState(0);
  const [topRating, setTopRating] = useState(0);
  const [questionAndAnswer, setQuestionAndAnswer] = useState([]);
  const [candidate, setCandidate] = useState(initState);
  const [showStatusModal, setshowStatusModal] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "",
    message: "",
  });
  const open = Boolean(anchorEl);

  const { candidateByID, levelDetails } = useSelector(
    (state) => state.candidate
  );
  const { user } = useSelector((state) => state.user);

  //console.log(candidateByID, user,levelDetails, "candidateByID meeting notes page");
  useEffect(() => {
    dispatch(uiActions.toggleLoader());
    if (id) {
      dispatch(getCandidateById(id));
    }

    if (level > 1 && level < 3) {
      dispatch(getLevelDetails(id, level));
    }
    dispatch(uiActions.toggleLoader());

    return () => {
      dispatch(candidateAction.resetState());
    };
  }, []);

  useEffect(() => {
    dispatch(uiActions.toggleLoader());
    if (!isEmpty(candidateByID)) {
      const { candidateName, role } = candidateByID;
      setCandidate({
        ...candidate,
        candidateName,
        role: role.role,
      });
    }
    if (!isEmpty(levelDetails)) {
      setCandidate({
        ...candidate,
        prevLevelRating: levelDetails.rating ? levelDetails.rating : 0,
      });
    }
    dispatch(uiActions.toggleLoader());

    return () => {
      setCandidate(initState);
    };
  }, [candidateByID, levelDetails]);

  // console.log(candidateByID, "candidateByID");
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSlider = (candidateByID, e) => {
    if (candidateByID) setOpenCard(candidateByID);
    setSliderstate(e.target.value);
    setQuestionAndAnswer([]);
    setTextValue("");
  };

  const handleCv = (cv) => {
    setShowCv(cv);
  };

  const onChangeText = (value) => {
    setTextValue(value);
  };

  const onChangeQuestion = (value) => {
    setQuestion(value);
  };

  const onChangeStatusModal = () => {
    setshowStatusModal(false);
  };

  const onChangeStatus = (value) => {
    // setMeetingStatus(value)
    if (!!value) {
      setshowStatusModal(false);
      const data = questionAndAnswer.map((item) => ({
        question: item.question,
        answer: item.answer,
        rating: item.rating,
      }));
      let ratingSum = 0;
      for (let item of questionAndAnswer) {
        ratingSum += item.rating;
      }
      const rating = Math.round(ratingSum / questionAndAnswer.length);
      const avgRating = Math.round((rating + topRating) / 2);
      let body;
      if (level > 1) {
        body = {
          candidateId: id,
          whoCreated: user.name,
          candidateName: candidate.candidateName,
          status: value,
          level: level,
          InterviewerId: user.id,
          rating: avgRating,
          meetingfeedback: textValue,
          data: data,
        };
      } else {
        body = {
          candidateId: id,
          status: value,
          whoCreated: user.name,
          candidateName: candidate.candidateName,
          info: {
            level: 1,
            InterviewerId: user.id,
            rating: avgRating,
            meetingfeedback: textValue,
            data: data,
          },
        };
      }
      // console.log(body, "body");
      dispatch(setMeetingDetails(body)).then((res) => {
        if (res) {
          setTextValue("");
          setQuestionAndAnswer([]);
          setTopRating(0);
          setSnackbar({
            ...snackbar,
            type: "success",
            open: true,
            message: "interview Round Details added successful",
          });
        }
        navigate("/home");
      });
    }
  };

  const onChangeAnswer = (value) => {
    setAnswer(value);
  };

  const addQuestionAndAnswer = () => {
    if (!!question && !!answer && !!answerRating) {
      const questionAnswerObject = {
        id: questionAndAnswer.length + 1,
        question,
        answer,
        rating: answerRating,
      };
      setQuestionAndAnswer([...questionAndAnswer, questionAnswerObject]);
      setQuestion("");
      setAnswer("");
      setAnswerRating(0);
    } else {
      setSnackbar({
        ...snackbar,
        type: "error",
        open: true,
        message: "please add question,answer & rating",
      });
    }
  };

  const onSaveMeetingdetails = async () => {
    try {
      if (!!topRating && !!textValue) {
        if (!!level && !!questionAndAnswer.length) {
          setshowStatusModal(true);
        } else {
          setSnackbar({
            ...snackbar,
            type: "error",
            open: true,
            message: "please add question,answer & rating",
          });
        }
      } else {
        setSnackbar({
          ...snackbar,
          type: "error",
          open: true,
          message: "please add rating & feedback",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar({ ...snackbar, open: false });
  };

  // console.log(level,"level",candidate,"candidate",levelDetails,"levelDetails",candidateByID,"candidateByID")

  return (
    <div className="main-container">
      <div>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
          }}
        >
          {!!candidate && (
            <CardContent>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: "orange" }}>
                    {candidate.candidateName.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={candidate.candidateName}
                  secondary={candidate.role}
                />
                <Box sx={{ position: "absolute", left: "200px", top: "25%" }}>
                  <Rating
                    name="simple-controlled"
                    value={candidateByID.ratings ? candidateByID.ratings : 0}
                    sx={{ fontSize: "24px", color: "#1976D2" }}
                  />
                </Box>
                <IconButton
                  aria-label="actions"
                  id="actions-button"
                  aria-controls="actions"
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                  sx={{ height: "22px" }}
                  disableRipple
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="actions"
                  MenuListProps={{
                    "aria-labelledby": "actions-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      width: "16ch",
                      boxShadow:
                        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 5px 5px -10px, rgba(0, 0, 0, 0.10) 0px 4px 6px -2px",
                    },
                  }}
                >
                  <MenuItem onClick={() => handleCv(true)}>
                    <ListItemText>View Resume\CV</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemText>Schedule</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemText>Reshedule</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemText>Reject</ListItemText>
                  </MenuItem>
                </Menu>
              </ListItem>
              <Box sx={{ px: 8 }}>
                <Slider
                  min={0}
                  max={3}
                  name="slider"
                  marks
                  value={level}
                  valueLabelDisplay="auto"
                  style={{ width: "100%" }}
                />
              </Box>
            </CardContent>
          )}
        </List>
      </div>
      <Resume handleCv={handleCv} showCv={showCv} />
      <StatusPopUp
        onChangeStatus={onChangeStatus}
        showStatusModal={showStatusModal}
        onChangeStatusModal={onChangeStatusModal}
        level={level}
      />
      {level !== 0 && (
        <div className="meeting-container">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={onSaveMeetingdetails}
            >
              Save
            </Button>
          </div>
          <div>
            <h1>Meeting Notes:</h1>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h6" style={{ marginRight: "20px" }}>
                Level {level} [{candidate.candidateName}]
              </Typography>
              <Rating
                name="simple-controlled"
                value={topRating}
                sx={{ fontSize: "24px", color: "#1976D2" }}
                onChange={(event, newValue) => {
                  setTopRating(newValue);
                }}
              />
            </div>
            <p>{new Date().toLocaleString()}</p>
            <CommonTextFiled
              labelText=""
              placeholderText="please add text here!"
              textValue={textValue}
              onChangeText={onChangeText}
            />
          </div>
          <div
            style={{ backgroundColor: "#D3CECE", width: "100%", height: "2px" }}
          />
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <AddIcon
                style={{
                  border: "1px solid #D3CECE",
                  alignSelf: "flex-end",
                  height: 25,
                  width: 28,
                  marginTop: "10px",
                }}
                onClick={addQuestionAndAnswer}
              />
            </div>
            <div>
              <CommonTextFiled
                labelText="Question"
                placeholderText="please enter the question here!"
                textValue={question}
                onChangeText={onChangeQuestion}
              />
            </div>
            <div>
              <CommonTextFiled
                labelText="Answer"
                placeholderText="please enter the answer here!"
                textValue={answer}
                onChangeText={onChangeAnswer}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                marginBottom: "10px",
              }}
            >
              <Rating
                name="simple-controlled"
                value={answerRating}
                sx={{ fontSize: "24px", color: "#1976D2" }}
                onChange={(event, newValue) => {
                  setAnswerRating(newValue);
                }}
              />
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#D3CECE",
              width: "100%",
              height: "2px",
              marginBottom: "10px",
            }}
          />
          {!!questionAndAnswer.length &&
            questionAndAnswer.map((item) => (
              <div key={item.id}>
                <div>
                  <Typography variant="h5">Question {item.id} :</Typography>
                  <p>{item.question}</p>
                </div>
                <div>
                  <Typography variant="h5">Answer {item.id} :</Typography>
                  <p style={{ maxWidth: "90%" }}>{item.answer}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginBottom: "10px",
                  }}
                >
                  <Rating
                    name="simple-controlled"
                    value={item.rating}
                    sx={{ fontSize: "30px", color: "#1976D2" }}
                  />
                </div>
              </div>
            ))}
        </div>
      )}
      <ReUsableSnackbar
        isOpen={snackbar.open}
        type={snackbar.type}
        message={snackbar.message}
        handleSnackbar={handleSnackbar}
      />
    </div>
  );
};

export default Meeting;
