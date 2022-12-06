import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "../../helpers/axiosInstance";
import { styled, Box } from "@mui/system";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import { getLevelDetails } from "../../store/candidate-action";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";

const style = {
  bgcolor: "white",
  border: "2px solid #000",
  position: "absolute",
  overflowY: "auto",
  margin: "auto",
  width: "35%",
  top: "10%",
  left: 0,
  right: 0,
  bottom: "10%",
  p: 3,
};

// let initialState = {
//   level: 0,
//   rating: 0,
//   meetingfeedback: "",
//   data: [],
// };

let initialState = [{ level: 0, meetingfeedback: "", rating: 0, data: [] }];

export default function Histories() {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState([]);
  const [levelData, setLevelData] = useState(initialState);

  const { levelDetails } = useSelector((state) => state.candidate);
  const handleOpen = (id, level) => {
    console.log(id, level);

    setOpen(true);
    dispatch(getLevelDetails(id));
  };
  useEffect(() => {
    if (!isEmpty(levelDetails)) {
      const { level, rating, meetingfeedback, data } = levelDetails;
      // console.log({ level, rating, meetingfeedback, data }, "hiiiii");
      setLevelData(levelDetails.info);
    }
  }, [levelDetails]);

  // console.log(levelDetails,"levelDetails")

  const handleClose = () => setOpen(false);
  useEffect(() => {
    axios
      .get(window.location.pathname)
      .then((res) => {
        console.log(res);
        setData(res.data.data);
        console.log("Result:", data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div style={{ width: "100%" }}>
      <h1>History</h1>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          {/* Modal */}
          <Modal
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={open}
            onClose={handleClose}
          >
            <Box sx={style}>
              {!!levelData.length &&
                levelData.map((info) => (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <h4>Level : </h4>
                      <h4 style={{ marginLeft: "3px" }}>{info.level}</h4>
                    </div>
                    {!!info.data.length &&
                      info.data.map((level) => (
                        <div>
                          <p>Question : {level.question}</p>
                          <p>Answer : {level.answer}</p>
                          <Rating value={level.rating} />
                        </div>
                      ))}
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <h4>Level {info.level} Feedback :</h4>
                      <h4 style={{ marginLeft: "7px" }}>
                        {info.meetingfeedback}
                      </h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <h4>Overall Rating </h4>
                      <p style={{ marginBottom: "10px", marginLeft: "8px" }}>
                        <Rating value={info.rating} />
                      </p>
                    </div>
                  </div>
                ))}
            </Box>
          </Modal>

          <TableBody>
            {data.map((row, value) => {
              return (
                <TableRow
                  key={value}
                  sx={{ border: 1 }}
                  onClick={() =>
                    handleOpen(
                      row._id,
                      row?.rounds[row.rounds.length - 1]?.level
                    )
                  }
                >
                  <TableCell component="th" scope="row">
                    {row.candidateName ? row.candidateName : "__"} <br />
                    <label>{row?.role?.role || "__"}</label>
                  </TableCell>
                  <TableCell align="right">
                    Level {row?.rounds[row.rounds.length - 1]?.level || "__"}
                    <br />
                    <label>
                      {row?.rounds[row.rounds.length - 1]?.interviewDate ||
                        "__"}
                    </label>
                  </TableCell>
                  <TableCell align="right">
                    {row?.rounds[row.rounds.length - 1]?.interviewer?.name ||
                      "__"}
                  </TableCell>

                  <TableCell align="right">
                    <Rating value={row?.ratings || 0} />
                  </TableCell>
                  <TableCell align="right">{row?.status || "__"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
