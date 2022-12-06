import { Fragment } from "react";

import classes from "./Layout.module.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";

const Layout = (props) => {
  const { user } = useSelector((state) => state.user);
  console.log(user);
  return (
    <Fragment>
      {user.name && <Header />}
      {user.name && <Sidebar loggedIn_id={user.id} />}
      <main className={classes.main}>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
