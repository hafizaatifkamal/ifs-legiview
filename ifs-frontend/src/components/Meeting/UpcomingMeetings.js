import { Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMonthlyInterviewsByInterviewerID } from "../../store/candidate-action";
import moment from "moment";

function UpcomingMeetings() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { meetings } = useSelector((state) => state.candidate);

  const { candidate } = useSelector((state) => state.candidate);
  useEffect(() => {
    if (user.id) {
      if (user.role === "interviewer") {
        dispatch(getMonthlyInterviewsByInterviewerID(user.id));
      }
      if (user.role === "hr") {
        dispatch(getMonthlyInterviewsByInterviewerID());
      }
    }
  }, [user]);

  let meetingId = 0;
  let url;
  const openMeeting = (meeting) => {
    url = meeting.rounds[meeting.rounds.length - 1].meetingLink;
    if (url.startsWith("https://")) {
      window.open(url);
    } else {
      url = "https://" + url;
      window.open(url);
    }
  };

  const [testtime, setTesttime] = useState("");
  const test = () => {
    setTesttime(moment().format("HH:mm"));
  };
  setInterval(() => {
    test();
  }, 1000);
  console.log(testtime);

  let d = moment().format("YYYY-MM-DD");
  return (
    <div className="meeting-container">
      <h1 style={{ padding: "10px" }}>Upcoming Meetings</h1>
      <div
        style={{
          backgroundColor: "#D3CECE",
          width: "100%",
          height: "2px",
          marginBottom: "10px",
        }}
      />
      <ul style={{ overflowY: "auto", height: "68vh", marginBottom: "10px" }}>
        {!!meetings.length &&
          meetings.map((meeting) => (
            <div
              key={meeting._id}
              style={{
                display: "flex",
                flexDirection: "row",
                // marginLeft: "20px",
              }}
            >
              <div>
                <Typography variant="h6">
                  Meeting {(meetingId = meetingId + 1)}
                </Typography>
                <Typography style={{ color: "#A7A8AB" }} variant="h6">
                  {meeting.rounds[meeting.rounds.length - 1].interviewDate}{" "}
                  {meeting.rounds[meeting.rounds.length - 1].starttime}
                </Typography>
              </div>

              {d === meeting.rounds[meeting.rounds.length - 1].interviewDate &&
                moment(testtime, "HH:mm").isSameOrAfter(
                  moment(
                    meeting.rounds[meeting.rounds.length - 1].starttime,
                    "HH:mm"
                  ).subtract(30, "m")
                ) &&
                moment(testtime, "HH:mm").isSameOrBefore(
                  moment(
                    meeting.rounds[meeting.rounds.length - 1].endtime,
                    "HH:mm"
                  )
                ) && (
                  <div style={{ marginLeft: "10px" }}>
                    <Button
                      color="success"
                      variant="contained"
                      style={{ marginTop: "10px", marginleft: "10px" }}
                      onClick={() => openMeeting(meeting)}
                    >
                      {console.log(
                        meeting.rounds[meeting.rounds.length - 1].endtime
                      )}
                      Join
                    </Button>
                  </div>
                )}
            </div>
          ))}
        {/* {candidate.length > 6 && (
        <div style={{ marginLeft: "12px" }}>
          <Button
            sx={{ color: "#4A59A4", textTransform: "capitalize" }}
            variant="text"
          >
            Show more
          </Button>
        </div>
      )} */}
      </ul>
    </div>
  );
}

export default UpcomingMeetings;
