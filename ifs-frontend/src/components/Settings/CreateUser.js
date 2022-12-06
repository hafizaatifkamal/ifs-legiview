import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../store/user-actions";
import { Box, Button, Card, TextField, Autocomplete } from "@mui/material";
import { uiActions } from "../../store/ui-slice";
import { getCompanies } from "../../store/company-action";
import { Navigate } from "react-router-dom";

const initState = {
  initialValue: {
    mailId: "",
    userName: "",
    companyName: "",
    role: "",
    companyId: "",
  },
};

function CreateUser() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { companies } = useSelector((state) => state.company);
  const dispatch = useDispatch();
  const [rolesDetail, setRolesDetail] = useState("");
  const [state, setState] = useState(initState);
  const [companiesDetail, setCompaniesDetail] = useState("");
  const [openCompanies, setOpenCompanies] = useState(false);

  const roleDropdown = [
    { label: "hr", id: 1 },
    { label: "interviewer", id: 2 },
    user.role === "super-admin" && { label: "admin", id: 3 },
  ];

  const handleCompaniesClick = (event, value) => {
    if (value) {
      state.initialValue.companyId = value._id;
      // console.log(value,"createuservalue")
      setOpenCompanies(false);
    }
    setCompaniesDetail("");
  };

  const handleCompaniesName = (event, value) => {
    if (event) {
      setCompaniesDetail(event.target.value);

      setOpenCompanies(false);
      if (event.target.value && event.target.value.length > 0) {
        dispatch(getCompanies(event.target.value));
        setOpenCompanies(true);
      }
    }
  };

  // console.log(user,"user")
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      name: state.initialValue.userName,
      email: state.initialValue.mailId,
      comapnyId: state.initialValue.companyId,
      role: rolesDetail,
    };
    // console.log(body, state);
    dispatch(createUser(body)).then((res) => {
      if (res) {
        console.log(res, "mainres");
        dispatch(
          uiActions.showNotification({
            status: "completed",
            title: "success",
            message: "user created successfully",
          })
        );
      }
    });
    setState(initState);
    setCompaniesDetail("");
    setRolesDetail("");
    navigate("/home");
  };

  const { mailId, companyId, companyName, userName } = state.initialValue;

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
            <TextField
              sx={{
                backgroundColor: "white",
              }}
              fullWidth
              size="small"
              required
              placeholder="enter the user name"
              margin="normal"
              id="userName"
              name="userName"
              onChange={handleEvent}
              value={userName}
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
            <label style={{ width: "150px" }}>Company Name</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={companies}
              onInputChange={handleCompaniesName}
              getOptionLabel={(option) => option.companyName}
              onChange={handleCompaniesClick}
              open={openCompanies}
              onBlur={() => setOpenCompanies(false)}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter company"
                  margin="normal"
                  required
                  size="small"
                  id="companiesDetail"
                  name="companiesDetail"
                  value={companiesDetail}
                />
              )}
            />
          </Box>
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 10%",
            }}
          >
            <label style={{ width: "150px" }}>Company ID</label>
            <TextField
              sx={{
                backgroundColor: "white",
              }}
              fullWidth
              size="small"
              required
              placeholder="VB0283"
              margin="normal"
              id="companyId"
              name="companyId"
              onChange={handleEvent}
              value={companyId}
              variant="outlined"
            />
          </Box> */}
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
              onChange={handleEvent}
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
              inputValue={rolesDetail}
              fullWidth
              disablePortal
              id="combo-box-demo"
              options={roleDropdown}
              onChange={(event, values) => {
                setRolesDetail(values.label);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="role"
                  id="role"
                  name="role"
                  margin="normal"
                  required
                  fullWidth
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
              Save
            </Button>
          </Box>
        </Card>
      </form>
    </>
  );
}

export default CreateUser;
