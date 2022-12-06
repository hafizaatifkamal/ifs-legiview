import { useSelector } from "react-redux";

export default function UseRoles() {
  const { user } = useSelector((state) => state.user);
  const isInterviewer = user.role === "interviewer";
  const isHr = user.role === "hr";
  const isSuperAdmin = user.role === "super-admin";
  const isAdmin = user.role === "admin";

  return {
    isInterviewer,
    isHr,
    isSuperAdmin,
    isAdmin,
  };
}
