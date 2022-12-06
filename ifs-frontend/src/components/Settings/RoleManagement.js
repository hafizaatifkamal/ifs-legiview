import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserByName } from "../../store/user-actions";
import {
  Box,
  Button,
  Card,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
} from "@mui/material";
import { userActions } from "../../store/user-slice";
import { updateUserById } from "../../store/user-actions";
import { uiActions } from "../../store/ui-slice";
const statusDropdown = [
  { label: "active", id: 1 },
  { label: "inactive", id: 2 },
];

const roleDropdown = [
  { label: "admin", id: 1 },
  { label: "hr", id: 2 },
  { label: "interviewer", id: 3 },
];

const prevData = { name: "", email: "", role: "", status: "" };

function RoleManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [mailId, setMailId] = useState("");
  const [status, setStatus] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [openUsers, setOpenUsers] = useState(false);
  const { roles } = useSelector((state) => state.interviewer);
  const { userByName } = useSelector((state) => state.user);
  const [previousData, setPreviousData] = useState(prevData);

  // console.log(userByName,"userByName")

  const handleMail = (e) => {
    setMailId(e.target.value);
  };

  const handleUsersClick = (event, value) => {
    if (value) {
      setUserId(value._id);
      setOpenUsers(false);
      console.log(value, "value");
      dispatch(getUserByName(value.name));
    }
    setUserName("");
  };

  const handleUserName = (event, value) => {
    if (event) {
      setUserName(event.target.value);
      setOpenUsers(false);
      if (event.target.value && event.target.value.length > 0) {
        dispatch(getUserByName(event.target.value));
        setOpenUsers(true);
      }
    }
  };
  // console.log(userByName,"username")

  let isUserExist = userByName.length === 1 ? userByName[0] : "";

  useEffect(() => {
    if (!!isUserExist) {
      const { email, role, name, status, _id } = isUserExist;
      // console.log(isUserExist,"user")
      setPreviousData({ ...prevData, email, role, name, status });
      if (!!_id) {
        setUserId(_id);
      }
      if (!!email) {
        setMailId(email);
      }
      if (!!role) {
        setRole(role);
      }
      if (!!name) {
        setUserName(name);
      }
      if (!!status) {
        setStatus(status);
      }
    }
  }, [isUserExist]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let body = {};
    let isUpdated = false;
    if (previousData.role !== role) {
      body.role = role;
      isUpdated = true;
    }
    if (previousData.status !== status) {
      body.status = status;
      isUpdated = true;
    }

    if (isUpdated) {
      dispatch(updateUserById(body, userId)).then((res) => {
        if (res) {
          dispatch(
            uiActions.showNotification({
              status: "completed",
              title: "success",
              message: "user updated successfully",
            })
          );
          navigate("/home");
        }
      });
    } else {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "!error",
          message: "please update status or role",
        })
      );
    }

    console.log(body);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 10%",
            }}
          >
            <label style={{ width: "150px" }}>User Name</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={userByName}
              onInputChange={handleUserName}
              getOptionLabel={(option) => option.name}
              onChange={handleUsersClick}
              open={openUsers}
              onBlur={() => setOpenUsers(false)}
              fullWidth
              inputValue={userName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter user name"
                  margin="normal"
                  required
                  size="small"
                  id="userName"
                  name="userName"
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
            <label style={{ width: "150px" }}>Mail ID</label>
            <TextField
              sx={{
                backgroundColor: "white",
              }}
              fullWidth
              size="small"
              required
              type="email"
              placeholder="email"
              margin="normal"
              id="mailId"
              name="mailId"
              onChange={handleMail}
              value={mailId}
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
            <label style={{ width: "150px" }}>Role</label>
            <Autocomplete
              fullWidth
              value={role}
              disablePortal
              id="combo-box-demo"
              options={roleDropdown}
              onChange={(event, values) => {
                setRole(values.label);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="role"
                  margin="normal"
                  required
                  fullWidth
                  size="small"
                  id="role"
                  name="role"
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
            <label style={{ width: "150px" }}>State</label>
            <Autocomplete
              fullWidth
              value={status}
              disablePortal
              id="combo-box-demo"
              options={statusDropdown}
              onChange={(event, values) => {
                setStatus(values.label);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="state"
                  margin="normal"
                  required
                  fullWidth
                  id="status"
                  name="status"
                  size="small"
                />
              )}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              margin: "0 7%",
            }}
          >
            <Button
              type="submit"
              color="success"
              variant="contained"
              sx={{ px: 4, mx: 4 }}
            >
              Update
            </Button>
          </Box>
        </Card>
      </form>
    </>
  );
}

export default RoleManagement;
