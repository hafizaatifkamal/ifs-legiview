import * as React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { rescheduleInterview } from "../../store/interviewer-action";
import { uiActions } from "../../store/ui-slice";
import { Container, Box, Button, Card, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  padding: 2,
  position: "absolute",
  overflowY: "scroll",
  margin: "auto",
  width: "50%",
  top: 20,
  left: 0,
  right: 0,
  bottom: 20,
  backgroundColor: "white",
};

const initState = {
  initialValue: {
    interviewDate: "",
    starttime: "",
    endtime: "",
  },
};

export default function RequestReschedule({
  handleRequestReschedule,
  showReschdule,
  candidateId,
  candidateName,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState(initState);
  const { user } = useSelector((state) => state.user);

  const handleClose = () => handleRequestReschedule(false);
  const { endtime, starttime, interviewDate } = state.initialValue;

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
    } else {
      const body = {
        interviewDate: state.initialValue.interviewDate,
        starttime: state.initialValue.starttime,
        endtime: state.initialValue.endtime,
        candidate: candidateId,
        candidateName: candidateName,
        interviewer: user.id,
        userName: user.name,
      };
      console.log(body, "formData");
      dispatch(rescheduleInterview(body)).then((res) => {
        if (res) {
          handleRequestReschedule(false);
          navigate("/home");
          dispatch(
            uiActions.showNotification({
              status: "success",
              message: "Reschedule Request sent Succeffully",
            })
          );
        }
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
    handleRequestReschedule(false);
  };

  return (
    <div>
      <Modal open={showReschdule}>
        <Container sx={style}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: 10,
                color: "white",
              }}
            ></div>
            <CloseIcon onClick={handleClose} style={{ marginRight: 8 }} />
          </div>
          <>
            <form onSubmit={handleSubmit}>
              <h2 style={{ padding: "5px 0px" }}>Reshedule</h2>
              <Card sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
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
                    style={{ width: "85%" }}
                    variant="outlined"
                    autoComplete="none"
                  />
                </Box>

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
                  <TextField
                    fullWidth
                    required
                    size="small"
                    type="time"
                    placeholder="Input Date / Time"
                    margin="normal"
                    id="endtime"
                    name="endtime"
                    step="15"
                    onChange={handleEvent}
                    value={endtime}
                    variant="outlined"
                    autoComplete="none"
                    style={{ width: "85%" }}
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
        </Container>
      </Modal>
    </div>
  );
}
