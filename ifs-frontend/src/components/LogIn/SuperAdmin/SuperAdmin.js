// import React from "react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./SuperAdmin.css";

// const initialEmailState = {
//   email: "",
//   error: "",
// };

// function SuperAdmin() {
//   const navigate = useNavigate();

//   let emailRegex = new RegExp(
//     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//   );

//   const [emailState, setEmailState] = useState(initialEmailState);

//   const onChangeEmail = (e) => {
//     setEmailState({ ...email, email: e.target.value });
//   };

//   const submitForm = (event) => {
//     event.preventDefault();
//     if (emailRegex.test(emailState.email)) {
//       console.log(emailState, "emailState");
//       navigate("/");
//     } else {
//       setEmailState({ ...emailState, error: "please provide a valid email" });
//     }
//   };

//   const renderEmailField = () => {
//     return (
//       <>
//         <label className="input-label" htmlFor="email">
//           Email
//         </label>
//         <input
//           type="text"
//           id="email"
//           className="email-field"
//           value={emailState.email}
//           autoComplete="off"
//           onChange={onChangeEmail}
//           placeholder="Email"
//         />
//       </>
//     );
//   };

//   return (
//     <div className="login-form-container">
//       <form className="form-container" onSubmit={submitForm}>
//         <div style={{ marginBottom: "10px" }}>
//           <h3>Create Super Admin</h3>
//         </div>
//         <div className="input-container">{renderEmailField()}</div>
//         <button type="submit" className="login-button">
//           Proceed
//         </button>
//         {emailState.error && (
//           <p className="error-message">* {emailState.error}</p>
//         )}
//       </form>
//     </div>
//   );
// }

// export default SuperAdmin;
