import * as React from "react";
import Modal from "@mui/material/Modal";
import { Button, Container } from "@mui/material";

const style = {
  padding: 2,
  position: "absolute",
  margin: "auto",
  top: "40%",
  left: "20%",
  right: "20%",
  bottom: "40%",
  backgroundColor: "white",
  height: "25%",
  width: "60%",
};

export default function StatusPopUp({
  showStatusModal,
  onChangeStatusModal,
  onChangeStatus,
  level,
}) {
  console.log(level);
  let selectedOrRejected =
    level === 3 ? "Selected" : "Recommended for next level";
  const handleClose = () => onChangeStatusModal(false);
  return (
    <div>
      <Modal open={showStatusModal} onClose={handleClose}>
        <Container sx={style}>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <h3>Please mark a status for this candidate</h3>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Button
                variant="contained"
                onClick={() => onChangeStatus("Reject")}
                style={{
                  backgroundColor: "#F90B32",
                  color: "white",
                  fontSize: "15px",
                  textTransform: "capitalize",
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                onClick={() => onChangeStatus("On Hold")}
                style={{
                  backgroundColor: "#BAC205",
                  color: "black",
                  fontSize: "15px",
                  textTransform: "capitalize",
                }}
              >
                On Hold
              </Button>
              <Button
                variant="contained"
                onClick={() => onChangeStatus(selectedOrRejected)}
                style={{
                  backgroundColor: "#3660F9",
                  color: "white",
                  fontSize: "15px",
                  textTransform: "capitalize",
                }}
              >
                {selectedOrRejected}
              </Button>
            </div>
          </div>
        </Container>
      </Modal>
    </div>
  );
}
