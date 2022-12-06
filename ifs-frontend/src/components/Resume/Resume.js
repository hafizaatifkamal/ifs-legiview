import * as React from "react";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import { Container } from "@mui/material";
import { Document, Page } from "react-pdf";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const style = {
  padding: 2,
  position: "absolute",
  overflowY: "scroll",
  margin: "auto",
  width: "50%",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export default function Resume({ showCv, setShowCv, viewResorces }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const baseurl = process.env.REACT_APP_API_BASE_URL;
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const handleClose = () => setShowCv(false);
  return (
    <div>
      <Modal open={showCv}>
        <Container sx={style}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: 10,
                color: "white",
              }}
            >
              {pageNumber < numPages && (
                <ArrowForwardIcon
                  onClick={() => setPageNumber(pageNumber + 1)}
                />
              )}
              <p>
                Page {pageNumber} of {numPages}
              </p>
              {pageNumber > 1 && (
                <ArrowBackIcon onClick={() => setPageNumber(pageNumber - 1)} />
              )}
            </div>
            <CloseIcon
              onClick={handleClose}
              style={{ marginRight: 8, color: "white" }}
            />
          </div>
          {viewResorces && (
            <Document
              file={baseurl + viewResorces}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber} />
            </Document>
          )}
        </Container>
      </Modal>
    </div>
  );
}
