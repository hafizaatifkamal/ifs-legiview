import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import { uiActions } from "../../store/ui-slice";
import { useDispatch, useSelector } from "react-redux";
// import { setUserPassword } from "./../../store/userAccount-action";
import { ChangePassword } from "../../store/user-actions";
import { useNavigate } from "react-router-dom";

const UpdateUserPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user } = useSelector((state) => state.user);
  const handleSubmit = (pass) => {
    const password = { password: pass };
    dispatch(ChangePassword(user.id, password)).then((res) => {
      navigate("/home");
      dispatch(
        uiActions.showNotification({
          status: "success",
          message: "Password changes successfully",
        })
      );
    });
  };

  const validatePassword = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("password");
    const confirmPassword = data.get("confirm_password");
    if (password === confirmPassword) {
      handleSubmit(password);
    } else {
      dispatch(
        uiActions.showNotification({
          status: "error",
          message: "Password and confirm password does not match",
        })
      );
    }
  };

  return (
    <form onSubmit={validatePassword}>
      <Typography
        variant="h5"
        sx={{ margin: "0 10%", padding: "5px 0px", fontWeight: "bold" }}
      >
        Password
      </Typography>
      <Card sx={{ margin: "0 10%", p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h5" sx={{ p: 0.5 }}>
              Change Password
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            required
            label="Password"
            margin="normal"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
            variant="outlined"
          />
          <TextField
            fullWidth
            required
            label="Confirm password"
            margin="normal"
            id="confirm_password"
            name="confirm_password"
            onChange={(event) => setConfirmPassword(event.target.value)}
            value={confirmPassword}
            variant="outlined"
            autoComplete="none"
          />
        </CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            pt: 1,
          }}
        >
          <Button type="submit" color="primary" variant="contained">
            Update
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default UpdateUserPassword;
