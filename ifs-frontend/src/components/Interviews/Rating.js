import React, { useState } from "react";
import Rating from "@mui/material/Rating";

const Ratings = (props) => {
  const { fontSize, rating } = props;
  const [value, setValue] = useState(0);
  return (
    <>
      <Rating
        name="simple-controlled"
        value={rating || value}
        sx={{ fontSize: { fontSize }, color: "#1976D2" }}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
    </>
  );
};

export default Ratings;
