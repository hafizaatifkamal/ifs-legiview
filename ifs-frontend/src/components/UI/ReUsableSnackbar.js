import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ReUsableSnackbar({
  vertical,
  horizontal,
  isOpen,
  handleSnackbar,
  type,
  message,
}) {
  const onCIoseSnackbar = (event, reason) => {
    handleSnackbar(event, reason);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={isOpen}
      autoHideDuration={6000}
      onClose={onCIoseSnackbar}
    >
      <Alert onClose={handleSnackbar} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default ReUsableSnackbar;
