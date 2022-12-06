import Templates from "../pages/Templates";
import NotFound from "../pages/NotFound";
import UsersPage from "../pages/UsersPage";
import Interviews from "../pages/Interview/Interviews";
import CreateInterviews from "../pages/Interview/CreateInterview";
import Meetings from "../pages/Meeting/Meeting";
import History from "../pages/History/History";
import Insights from "../pages/Insights/Insights";
import Reviews from "../pages/Review/Reviews";
import UpcomingMeetings from "../components/Meeting/UpcomingMeetings";
import ResheduleReq from "../components/Review/ResheduleReq";
import LoginPage from "../pages/Login";
import UseRoles from "../helpers/Roles";
import Settings from "../components/Settings/Settings";
import ChangePassword from "../pages/Password/ChangePassword";
import Notifications from "../pages/Notifications";

const Routes = () => {
  const { isInterviewer, isHr, isSuperAdmin, isAdmin } = UseRoles();

  const routes = [
    {
      path: "/",
      component: LoginPage,
      title: "login",
      access: true,
    },
    {
      path: "/login",
      component: LoginPage,
      title: "LoginPage",
      access: true,
    },
    {
      path: "/updatepassword",
      component: ChangePassword,
      title: "Change Password",
      access: true,
    },
    {
      path: "/home",
      component: Interviews,
      access: [isHr, isInterviewer, isAdmin, isSuperAdmin].some((x) => x),
    },
    {
      path: "/create-interview",
      component: CreateInterviews,
      access: [isHr].some((x) => x),
    },
    {
      path: "/create-interview/:id/reshedule",
      component: CreateInterviews,
      title: "reshedule interview",
      access: [isHr].some((x) => x),
    },
    {
      path: "/create-interview/:id/shedule",
      component: CreateInterviews,
      title: "shedule interview",
      access: [isHr].some((x) => x),
    },
    {
      path: "/create-interview/:id/request-reshedule",
      component: ResheduleReq,
      access: [isHr].some((x) => x),
    },
    {
      path: "/meeting/:id",
      component: Meetings,
      access: [isInterviewer, isHr].some((x) => x),
    },
    {
      path: "/review",
      component: Reviews,
      access: [isHr].some((x) => x),
    },
    {
      path: "/history",
      component: History,
      access: [isHr].some((x) => x),
    },
    {
      path: "/history/:id",
      component: History,
      access: [isInterviewer].some((x) => x),
    },
    {
      path: "/insights",
      component: Insights,
      access: [isHr, isSuperAdmin, isAdmin].some((x) => x),
    },
    {
      path: "/upcoming-meetings",
      component: UpcomingMeetings,
      access: [isHr, isInterviewer].some((x) => x),
    },
    {
      path: "/setting",
      component: Settings,
      access: [isSuperAdmin, isAdmin].some((x) => x),
    },
    {
      path: "/notifications",
      component: Notifications,
      access: [isInterviewer, isHr].some((x) => x),
    },
    {
      path: "*",
      component: NotFound,
      title: "Not Found",
      access: true,
    },
  ];

  return { routes };
};
export default Routes;
