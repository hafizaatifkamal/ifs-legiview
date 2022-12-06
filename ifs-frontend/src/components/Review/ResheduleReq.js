import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  TextField,
  Autocomplete,
  ListItemText,
} from "@mui/material";
import { uiActions } from "../../store/ui-slice";
import { useDispatch, useSelector } from "react-redux";
import { resheduleInterview } from "../../store/candidate-action";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getInterviewer } from "../../store/interviewer-action";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { isEmpty } from "lodash";
import moment from "moment";
import { getReviewsByid } from "../../store/review-action";

// import AdapterDateFns from "@mui/lab/AdapterDateFns";

const initState = {
  initialValue: {
    email: "",
    level: 1,
    interviewer: "",
    interviewDate: "",
    starttime: "",
    endtime: "",
    link: "",
  },
};

const ResheduleReq = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [interviewerName, setInterviewerName] = useState("");
  const [focus, setFocus] = useState(true);
  const { interviewerDetails, roles } = useSelector(
    (state) => state.interviewer
  );
  const { reviewDetail } = useSelector((state) => state.review);

  const [state, setState] = useState(initState);

  useEffect(() => {
    if (id) {
      dispatch(getReviewsByid(id));
    }
    // eslint-disable-next-line
  }, []);
  console.log(reviewDetail);

  useEffect(() => {
    if (!isEmpty(reviewDetail)) {
      setInterviewerName(reviewDetail.interviewer.name);
      setState({
        ...state,
        initialValue: {
          ...state.initialValue,
          email: reviewDetail.candidate.email,
          endtime: reviewDetail.endtime,
          starttime: reviewDetail.starttime,
          interviewDate: reviewDetail.interviewDate,
          interviewer: reviewDetail.interviewer._id,
          level: reviewDetail.candidate.rounds.length,
        },
      });
    }
    // eslint-disable-next-line
  }, [reviewDetail]);

  const [open, setOpen] = useState(false);
  const { email, endtime, starttime, interviewDate, interviewer, link } =
    state.initialValue;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.initialValue.starttime > state.initialValue.endtime) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "end time can not be less than the start time",
        })
      );
    } else if (
      state.initialValue.interviewDate < moment().format("YYYY-MM-DD")
    ) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Inteview Date cannot be in past",
        })
      );
    } else {
      const reqbodyData = {
        level: state.initialValue.level,
        endtime: state.initialValue.endtime,
        meetingLink: state.initialValue.link,
        starttime: state.initialValue.starttime,
        interviewDate: state.initialValue.interviewDate,
        interviewer: state.initialValue.interviewer,
      };
      //   console.log(reqbodyData);
      dispatch(
        resheduleInterview(reviewDetail.candidate._id, reqbodyData)
      ).then((res) => {
        if (res) {
          navigate("/home");
          dispatch(
            uiActions.showNotification({
              status: "success",
              message: `${reviewDetail.candidate.candidateName} Level ${reqbodyData.level} Sheduled`,
            })
          );
        }
        // console.log(state.initialValue, reqbodyData, "shedule");
      });
    }
  };

  const handleEvent = (e) => {
    if (e) {
      setState({
        ...state,
        initialValue: {
          ...state.initialValue,
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  const handleCancel = () => {
    setState(initState);
    navigate("/home");
  };

  const handleInterviewerClick = (event, value) => {
    if (value) {
      state.initialValue.interviewer = value._id;
      setInterviewerName(value.name);
      setOpen(false);
      setFocus(false);
    } else {
      setInterviewerName("");
    }
  };

  const handleInterviewerName = (event, value) => {
    if (event) {
      setInterviewerName(event.target.value);

      setOpen(false);
      if (event.target.value && event.target.value.length > 0) {
        dispatch(getInterviewer(event.target.value));
        setOpen(true);
      }
    }
  };

  const createCall = () => {
    window.open("https://calendar.google.com");
  };
  // console.log(candidateByID);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 style={{ padding: "5px 0px" }}>{id && ` Reshedule Calender`}</h2>
        <Card sx={{ p: 3 }}>
          {id && (
            <ListItemText
              sx={{ textTransform: "uppercase" }}
              secondary={`(Level ${
                reviewDetail.candidate && reviewDetail.candidate.rounds.length
              })`}
            >
              <h3 style={{ textTransform: "capitalize" }}>
                {reviewDetail.candidate && reviewDetail.candidate.candidateName}
              </h3>
            </ListItemText>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 10%",
            }}
          >
            <label style={{ width: "150px" }}>Email</label>

            <TextField
              disabled={true}
              sx={{
                backgroundColor: "#D9D9D9",
              }}
              fullWidth
              size="small"
              required
              type="email"
              placeholder="Enter Email"
              margin="normal"
              id="email"
              name="email"
              onChange={handleEvent}
              value={email}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 10%",
            }}
          >
            <label style={{ width: "150px" }}>Interviewer</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={interviewerDetails}
              onInputChange={handleInterviewerName}
              getOptionLabel={(option) => option.name}
              onChange={handleInterviewerClick}
              inputValue={interviewerName}
              open={open}
              onBlur={() => {
                setOpen(false);
                focus && setInterviewerName("");
                setFocus(true);
              }}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  // value={interviewerName}
                  placeholder="Enter Interviwer Name"
                  margin="normal"
                  required
                  size="small"
                  id="interviewer"
                  name="interviewer"
                />
              )}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 10%",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "row", width: "100%" }}
            >
              <label style={{ width: "150px", marginTop: "20px" }}>
                Meeting Link
              </label>
              <AddLinkIcon
                style={{ width: "30px", marginTop: "20px" }}
                onClick={createCall}
              />
              <TextField
                fullWidth
                required
                size="small"
                margin="normal"
                id="link"
                name="link"
                placeholder="Enter Google Meet Link"
                onChange={handleEvent}
                value={link}
                variant="outlined"
                autoComplete="none"
              />
            </div>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 10%",
            }}
          >
            <label style={{ width: "150px" }}>Date </label>
            <TextField
              fullWidth
              required
              size="small"
              type="date"
              margin="normal"
              id="interviewDate"
              name="interviewDate"
              onChange={handleEvent}
              value={interviewDate}
              variant="outlined"
              autoComplete="none"
            />
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "0 10%",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <label style={{ width: "150px" }}>start Time</label>
              <TextField
                fullWidth
                required
                size="small"
                type="time"
                placeholder="Input Date / Time"
                // margin="normal"
                id="starttime"
                name="starttime"
                onChange={handleEvent}
                value={starttime}
                variant="outlined"
                step="00:15"
                style={{ width: "85%" }}
                // autoComplete="none"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <label style={{ width: "150px" }}>End Time</label>
              {/* <DatePicker
                selected={endtime}
                onChange={handleEvent}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="LLL"
              /> */}
              <TextField
                fullWidth
                required
                size="small"
                type="time"
                placeholder="Input Date / Time"
                margin="normal"
                id="endtime"
                name="endtime"
                onChange={handleEvent}
                value={endtime}
                variant="outlined"
                autoComplete="none"
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 10%",
            }}
          >
            <Button
              color="error"
              variant="contained"
              sx={{ px: 4, my: 3 }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="success"
              variant="contained"
              sx={{ px: 4, mx: 4 }}
            >
              Submit
            </Button>
          </Box>
        </Card>
      </form>
    </>
  );
};

export default ResheduleReq;
