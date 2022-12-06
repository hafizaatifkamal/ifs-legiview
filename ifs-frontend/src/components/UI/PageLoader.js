import loaderImg from "../../assets/images/loader.gif";
import classes from "./PageLoader.module.css";

const PageLoader = () => {
  return (
    <div className={classes.loadingContainer}>
      <div className={classes.loading}>
        <img src={loaderImg} alt="common-loader"></img>
      </div>
    </div>
  );
};

export default PageLoader;
