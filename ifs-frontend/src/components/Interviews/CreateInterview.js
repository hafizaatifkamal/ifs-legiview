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
import {
  createInterview,
  getCandidateById,
  resheduleInterview,
  shedulenextRoundInterview,
  getstates,
} from "../../store/candidate-action";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getInterviewer, getRoles } from "../../store/interviewer-action";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { candidateAction } from "../../store/candidate-slice";
import { isEmpty } from "lodash";
import moment from "moment";
import AttachFileIcon from "@mui/icons-material/AttachFile";

// import AdapterDateFns from "@mui/lab/AdapterDateFns";

const initState = {
  initialValue: {
    email: "",
    candidateName: "",
    resume: "",
    role: "",
    level: 1,
    interviewer: "",
    interviewDate: "",
    starttime: "",
    endtime: "",
    link: "",
    candidateLocations: "",
  },
};

const CreateInterview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [interviewerName, setInterviewerName] = useState("");
  const [candidateLocation, setCandidateLocation] = useState("");
  const [path, setPath] = useState("");
  const [rolesDetail, setRolesDetail] = useState("");
  const [focus, setFocus] = useState(true);
  const { interviewerDetails, roles } = useSelector(
    (state) => state.interviewer
  );
  const { candidateByID, states } = useSelector((state) => state.candidate);
  const { user } = useSelector((state) => state.user);

  //  console.log(user.id,"who created")

  const [state, setState] = useState(initState);

  useEffect(() => {
    if (id) {
      if (location.pathname.split("/")[3] === "reshedule") {
        setPath("Reshedule");
      }
      if (location.pathname.split("/")[3] === "shedule") {
        setPath("Shedule");
      }
      if (location.pathname.split("/")[3] === "request-reshedule") {
        setPath("request-reshedule");
      }
      dispatch(getCandidateById(id));
    }
    dispatch(getstates());
    return () => {
      dispatch(candidateAction.resetState());
    };
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (!isEmpty(candidateByID)) {
      setState({
        ...state,
        initialValue: {
          ...state.initialValue,
          email: candidateByID.email,
          level: candidateByID.rounds.length + 1,
        },
      });
      if (path === "Reshedule") {
        setInterviewerName(
          candidateByID.rounds[candidateByID.rounds.length - 1].interviewer.name
        );
        setState({
          ...state,
          initialValue: {
            ...state.initialValue,
            email: candidateByID.email,
            link: candidateByID.rounds[candidateByID.rounds.length - 1]
              .meetingLink,
            endtime:
              candidateByID.rounds[candidateByID.rounds.length - 1].endtime,
            starttime:
              candidateByID.rounds[candidateByID.rounds.length - 1].starttime,
            interviewDate:
              candidateByID.rounds[candidateByID.rounds.length - 1]
                .interviewDate,
            interviewer:
              candidateByID.rounds[candidateByID.rounds.length - 1].interviewer
                ._id,
            level: candidateByID.rounds.length,
          },
        });
      }
    }
    // eslint-disable-next-line
  }, [candidateByID]);

  // console.log(candidateByID,"cbid")

  const [open, setOpen] = useState(false);
  const [openRoles, setOpenRoles] = useState(false);
  const {
    email,
    candidateName,
    role,
    endtime,
    starttime,
    interviewDate,
    interviewer,
    link,
    candidateLocations,
  } = state.initialValue;

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
        whoCreated: user.name,
        candidateName: candidateByID.candidateName,
      };
      if (path === "Shedule") {
        dispatch(shedulenextRoundInterview(id, reqbodyData)).then((res) => {
          if (res) {
            navigate("/home");
            dispatch(
              uiActions.showNotification({
                status: "success",
                message: `${candidateByID.candidateName} Level ${reqbodyData.level} Sheduled`,
              })
            );
          }
        });
        // console.log(state.initialValue, reqbodyData, "shedule");
      } else if (path === "Reshedule") {
        dispatch(resheduleInterview(id, reqbodyData)).then((res) => {
          if (res) {
            navigate("/home");
            dispatch(
              uiActions.showNotification({
                status: "success",
                message: `${candidateByID.candidateName} Level ${reqbodyData.level} Resheduled`,
              })
            );
          }
        });
        // console.log(state.initialValue, reqbodyData, "reschedule");
      } else {
        // console.log(state.initialValue, "=========");
        const formData = new FormData();
        formData.append("candidateName", state.initialValue.candidateName);
        formData.append("resume", state.initialValue.resume);
        formData.append("role", state.initialValue.role);
        formData.append("email", state.initialValue.email);
        formData.append("starttime", state.initialValue.starttime);
        formData.append("interviewDate", state.initialValue.interviewDate);
        formData.append("interviewer", state.initialValue.interviewer);
        formData.append("endtime", state.initialValue.endtime);
        formData.append("level", state.initialValue.level);
        formData.append("link", state.initialValue.link);
        formData.append("whoCreated", user.name);
        formData.append(
          "candidateLocations",
          state.initialValue.candidateLocations
        );
        dispatch(createInterview(formData)).then((res) => {
          if (res) {
            navigate("/home");
            dispatch(
              uiActions.showNotification({
                status: "success",
                message: "Interview Scheduled Succeffully",
              })
            );
          }
        });
      }
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

  const handlePdf = (event) => {
    state.initialValue.resume = event.target.files[0];
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

  const handleCandidateLocationClick = (event, value) => {
    if (value) {
      console.log(value, "======");
      state.initialValue.candidateLocations = value.name;
      setCandidateLocation(value.name);
    } else {
      setCandidateLocation("");
    }
  };

  const handleRolesClick = (event, value) => {
    if (value) {
      state.initialValue.role = value._id;
      setOpenRoles(false);
    }
    setRolesDetail("");
  };

  const handleInterviewerName = (event, value) => {
    if (event) {
      setInterviewerName(event.target.value);

      setOpen(false);
      if (event.target.value && event.target.value.length > 0) {
        if (Object.keys(candidateByID).length !== 0) {
          if (candidateByID.rounds.length + 1 === 3) {
            dispatch(getInterviewer(event.target.value, "hr"));
          } else {
            dispatch(getInterviewer(event.target.value, "interviewer"));
          }
        } else {
          dispatch(getInterviewer(event.target.value, "interviewer"));
        }

        setOpen(true);
      }
    }
  };

  const handleRolesName = (event, value) => {
    if (event) {
      setRolesDetail(event.target.value);

      setOpenRoles(false);
      if (event.target.value && event.target.value.length > 0) {
        dispatch(getRoles(event.target.value));
        setOpenRoles(true);
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
        <h1 style={{ padding: "5px 0px" }}>
          {id
            ? path === "Shedule"
              ? `Schedule (Level${
                  path === "Shedule" &&
                  candidateByID.rounds &&
                  candidateByID.rounds.length + 1
                })`
              : `Reshedule Calender`
            : `Schedule Calender`}
        </h1>
        <Card sx={{ p: 3 }}>
          {id && (
            <ListItemText
              sx={{ textTransform: "capitilize" }}
              secondary={
                candidateByID.role
                  ? path === "Reshedule"
                    ? `${candidateByID.role.role}  (Level ${candidateByID.rounds.length})`
                    : `${candidateByID.role.role}`
                  : ""
              }
            >
              <h3 style={{ textTransform: "capitalize" }}>
                {candidateByID.candidateName || ""}
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
              disabled={candidateByID.email ? true : false}
              sx={{
                backgroundColor: candidateByID.email ? "#D9D9D9" : "white",
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
          {!id && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 10%",
              }}
            >
              <label style={{ width: "150px" }}>Candidate Name</label>
              <TextField
                fullWidth
                required
                size="small"
                placeholder="Enter Candidate Name"
                margin="normal"
                id="candidateName"
                name="candidateName"
                onChange={handleEvent}
                value={candidateName}
                variant="outlined"
                autoComplete="none"
              />
            </Box>
          )}
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
          {!id && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 10%",
              }}
            >
              <label style={{ width: "150px" }}>Location</label>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={states}
                getOptionLabel={(option) => option.name}
                onChange={handleCandidateLocationClick}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Enter Location"
                    margin="normal"
                    required
                    size="small"
                  />
                )}
              />
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 10%",
            }}
          >
            <label style={{ width: "150px", marginTop: "20px" }}>
              Meeting Link
            </label>
            <Box sx={{ display: "flex", width: "100%" }}>
              <TextField
                fullWidth
                required
                size="small"
                // type="date"
                margin="normal"
                id="link"
                name="link"
                placeholder="Enter Google Meet Link"
                onChange={handleEvent}
                value={link}
                variant="outlined"
                autoComplete="none"
              />
              <AddLinkIcon
                style={{ width: "30px", marginTop: "20px" }}
                onClick={createCall}
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
                justifyContent: "center",
                width: "100%",
                // margin: "0 10%",
              }}
            >
              <label style={{ width: "150px" }}>start Time</label>
              <TextField
                fullWidth
                required
                size="small"
                type="time"
                // placeholder="Input Date / Time"
                margin="normal"
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
                // margin: "0 10%",
              }}
            >
              <label style={{ width: "150px", marginLeft: "10px" }}>
                End Time
              </label>
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
          {!id && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 10%",
              }}
            >
              <label style={{ width: "150px" }}>Upload Resume</label>
              <TextField
                fullWidth
                required
                size="small"
                type="file"
                margin="normal"
                id="resume"
                name="resume"
                accept="application/pdf"
                onChange={handlePdf}
                variant="outlined"
                autoComplete="none"
              />
              {/* <AttachFileIcon type="file" /> */}
            </Box>
          )}
          {!id && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 10%",
              }}
            >
              <label style={{ width: "150px" }}>Role</label>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={roles}
                onInputChange={handleRolesName}
                getOptionLabel={(option) => option.role}
                onChange={handleRolesClick}
                open={openRoles}
                onBlur={() => setOpenRoles(false)}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={rolesDetail}
                    placeholder="Enter role"
                    margin="normal"
                    required
                    size="small"
                    id="role"
                    name="role"
                  />
                )}
              />
            </Box>
          )}
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

export default CreateInterview;
