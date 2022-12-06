import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import classes from "./Notification.module.css";

const Notification = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(uiActions.closeNotification());
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div id="snackbar" className={`${classes.snackbar} ${classes.show}`}>
      {props.message}
    </div>
  );
};

export default Notification;
