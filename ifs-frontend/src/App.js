import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
// import "semantic-ui-css/semantic.min.css";
import RRoutes from "./routes/index";
import Layout from "./components/layout/Layout";
import Notification from "./components/UI/Notification";
import PageLoader from "./components/UI/PageLoader";
import { useDispatch, useSelector } from "react-redux";
import { Fragment } from "react";
import Cookies from "js-cookie";
import { refreshToken, logoutUser } from "./store/user-actions";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const notification = useSelector((state) => state.ui.notification);
  const loader = useSelector((state) => state.ui.loading);
  const { user } = useSelector((state) => state.user);
  const { routes } = RRoutes();

  console.log("interview feedback portal");
  useEffect(() => {
    if (Cookies.get("refresh")) {
      dispatch(refreshToken()).then((res) => {
        if (res) {
          location.pathname === "/" && navigate("/home");
        }
        if (!res) {
          dispatch(logoutUser());
          navigate("/");
        }
      });
    } else {
      navigate("/");
    }
  }, []);
  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      {loader && <PageLoader />}
      <Layout>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                route.access ? (
                  <route.component />
                ) : (
                  <Stack spacing={2} sx={{ width: "100%" }}>
                    <Alert severity="error">
                      {user.name
                        ? "Unauthorized Entry!"
                        : "Please Log In to access this page!"}
                    </Alert>
                  </Stack>
                )
              }
              // element={<route.component />}
              // exact
              // render={(props) => <route.component {...props} />}
            ></Route>
          ))}
        </Routes>
      </Layout>
    </Fragment>
  );
}

export default App;
