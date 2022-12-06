import { useSelector } from "react-redux";

const UserDetails = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <div>
      <h2>User Details</h2>
      <ul>
        <li>First Name: {user && user.first_name}</li>
        <li>Last Name: {user && user.last_name}</li>
        <li>Email: {user && user.email}</li>
        <li>Role: {user && user.role}</li>
      </ul>
    </div>
  );
};

export default UserDetails;
