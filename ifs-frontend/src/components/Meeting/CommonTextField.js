import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
export default function CommonTextFiled({
  labelText,
  placeholderText,
  onChangeText,
  textValue,
}) {
  const handleChange = (event) => {
    onChangeText(event.target.value);
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { marginBottom: "10px", width: "100%" },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Typography variant="h5">{labelText}</Typography>
        </div>
        <TextField
          id="outlined-textarea"
          placeholder={placeholderText}
          multiline
          value={textValue}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </Box>
  );
}
