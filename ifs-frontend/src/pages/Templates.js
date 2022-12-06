import { useEffect } from "react";
import { useDispatch } from "react-redux";

import TemplateList from "../components/templates/TemplateList";
import { getUserDetails } from "../store/user-actions";

const Templates = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  return <TemplateList />;
};

export default Templates;
