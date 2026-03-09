import DoctorDashboard from "./DoctorDashboard";
import NurseDashboard from "./NurseDashboard";
import FrontDeskDashboard from "./FrontDeskDashboard";
import AdminDashboard from "./AdminDashboard";
import { useAuth } from "../../utils/AuthContext";
import { Navigate } from "react-router-dom";
import BillingDashboard from "./BillingDashboard";

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  const role = user.role?.toLowerCase().trim();

  if (!role) return <Navigate to="/" replace />;

  const dashboardMap = {
    admin: <AdminDashboard />,
    doctor: <DoctorDashboard />,
    nurse: <NurseDashboard />,
    front: <FrontDeskDashboard />,
    billing: <BillingDashboard />,
  };

  const matchedRole = Object.keys(dashboardMap).find((key) =>
    role.includes(key)
  );

  return matchedRole ? dashboardMap[matchedRole] : <Navigate to="/" replace />;
};

export default DashboardRouter;