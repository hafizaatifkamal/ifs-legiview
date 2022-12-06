import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SuperAdmin.css";
import { loginApi } from "../../store/user-actions";
import { useDispatch } from "react-redux";
const initialEmailState = {
  email: "",
  error: "",
};

const initialPasswordState = {
  password: "",
  error: "",
};

function Login() {
  const dispatch = useDispatch();

  let emailRegex = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  const navigate = useNavigate();

  const [emailState, setEmailState] = useState(initialEmailState);
  const [passwordState, setPasswordState] = useState(initialPasswordState);

  const onChangeEmail = (event) => {
    setEmailState({ ...emailState, email: event.target.value, error: "" });
  };

  const onChangePassword = (event) => {
    setPasswordState({ ...passwordState, password: event.target.value });
  };

  const submitForm = (event) => {
    event.preventDefault();
    if (
      emailRegex.test(emailState.email) &&
      passwordState.password.length >= 2
    ) {
      const data = {
        email: emailState.email,
        password: passwordState.password,
      };
      console.log(data);
      dispatch(loginApi(data)).then((res) => {
        if (res) {
          navigate("/home");
        }
      });
    } else {
      setEmailState({
        ...emailState,
        error: "please provide valid email and password",
      });
    }
  };

  const renderPasswordField = () => {
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={passwordState.password}
          autoComplete="off"
          onChange={onChangePassword}
          placeholder="Password"
        />
      </>
    );
  };

  const renderEmailField = () => {
    return (
      <>
        <label className="input-label" htmlFor="email">
          EMAIL
        </label>
        <input
          type="text"
          id="email"
          className="email-field"
          value={emailState.email}
          onChange={onChangeEmail}
          placeholder="Email"
        />
      </>
    );
  };

  return (
    <div className="login-form-container">
      <form className="form-container" onSubmit={submitForm}>
        {emailState.error && (
          <p className="error-message">*{emailState.error}</p>
        )}
        <div className="input-container">{renderEmailField()}</div>
        <div className="input-container">{renderPasswordField()}</div>
        <button type="submit" className="login-button">
          Login
        </button>

        {/* <div style={{ marginTop: "10px" }}>
          <Link to="/super-admin">Change Password?</Link>
        </div> */}
      </form>
    </div>
  );
}

export default Login;
