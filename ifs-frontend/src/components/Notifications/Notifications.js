import * as React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import { getInterviewerNotifications } from "../../store/user-actions";
import { getHrNotifications } from "../../store/user-actions";

const initialNotifications = [{ name: "", title: "" }];

export default function Notifications() {
  const dispatch = useDispatch();

  const [notifications, setNotifications] =
    React.useState(initialNotifications);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user.role === "hr") {
      dispatch(getHrNotifications());
    }
    if (user.role === "interviewer") {
      dispatch(getInterviewerNotifications(user.id));
    }
  }, []);

  const { hrNotifications } = useSelector((state) => state.user);
  const { interviewerNotifications } = useSelector((state) => state.user);

  useEffect(() => {
    if (!!interviewerNotifications) {
      let data = [...interviewerNotifications].reverse();
      setNotifications(data);
    }
  }, [interviewerNotifications]);

  useEffect(() => {
    if (!!hrNotifications) {
      let data = [...hrNotifications].reverse();
      setNotifications(data);
    }
  }, [hrNotifications]);

  // console.log(notifications,"NotificationsStateinterviewerNotifications")
  // console.log(notifications,"NotificationsStatehrNotifications")

  return notifications.length ? (
    notifications.map((notification) => (
      <Card
        key={notification.id}
        sx={{
          maxWidth: "100vw",
          marginBottom: "15px",
          backgroundColor: "#E8E3EA",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: red[500], textTransform: "capitalize" }}
              aria-label="recipe"
            >
              {notification.name[0]}
            </Avatar>
          }
          title={notification.name}
          subheader={notification.title}
        />
      </Card>
    ))
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
      }}
    >
      <p>your notifications are empty!!</p>
    </div>
  );
}
