import React, { useState } from "react";
import { ListItemText, MenuItem, Menu, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { Link } from "react-router-dom";
import moment from "moment";

const Menus = (props) => {
  const dispatch = useDispatch();
  const { elem, setViewResorces, setShowCv, handleRequestReschedule } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user } = useSelector((state) => state.user);

  const onClickRequestReschedule = () => {
    handleRequestReschedule(true);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOnClick = () => {
    if (elem.filePDF) {
      setViewResorces(elem.filePDF);
      setShowCv(true);
    } else {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Resource not found",
        })
      );
    }
    handleClose();
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
    <>
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
            marginRight: "5px",
            // width: "16ch",
            boxShadow:
              "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 5px 5px -10px, rgba(0, 0, 0, 0.10) 0px 4px 6px -2px",
          },
        }}
      >
        <MenuItem>
          <ListItemText onClick={handleOnClick}>View Resume\CV</ListItemText>
        </MenuItem>
        {user && user.role === "hr" && elem.rounds.length < 3 && (
          <Link
            to={`/create-interview/${elem._id}/shedule`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <MenuItem>
              <ListItemText>Schedule</ListItemText>
            </MenuItem>
          </Link>
        )}
        {user && user.role === "interviewer" && (
          <MenuItem onClick={onClickRequestReschedule}>
            <ListItemText>Request Reshedule</ListItemText>
          </MenuItem>
        )}
        {user &&
          (user.role === "interviewer" ||
            (user.role === "hr" && elem.rounds.length === 3)) &&
          d === elem.rounds[elem.rounds.length - 1].interviewDate &&
          moment(testtime, "HH:mm").isSameOrAfter(
            moment(
              elem.rounds[elem.rounds.length - 1].starttime,
              "HH:mm"
            ).subtract(30, "m")
          ) &&
          moment(testtime, "HH:mm").isSameOrBefore(
            moment(elem.rounds[elem.rounds.length - 1].endtime, "HH:mm")
          ) && (
            <Link
              to={`/meeting/${elem._id}?level=${
                elem.rounds[elem.rounds.length - 1].MeetingDetailsExist ===
                "Exist"
                  ? elem.rounds.length + 1
                  : elem.rounds.length
              }`}
              // to={`/meeting/${elem._id}?level=${elem.rounds.length + 1}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <MenuItem>
                <ListItemText>Add Meeting Notes</ListItemText>
              </MenuItem>
            </Link>
          )}
        {user && user.role === "hr" && (
          <Link
            to={`/create-interview/${elem._id}/reshedule`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <MenuItem>
              <ListItemText>Reshedule</ListItemText>
            </MenuItem>
          </Link>
        )}
        {user && user.role === "hr" && (
          <MenuItem>
            <ListItemText>Reject</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Menus;
