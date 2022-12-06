import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import UserDetails from "../components/user/UserDetails";
import { useNavigate } from "react-router";

const UsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    Cookies.set("token", token);
    navigate("/");
  }, [dispatch, token, navigate]);

  return <UserDetails />;
};

export default UsersPage;
