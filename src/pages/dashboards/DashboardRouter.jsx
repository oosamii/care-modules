import { useAuth } from "../../utils/AuthContext";
import { Navigate } from "react-router-dom";

const DashboardRouter = () => {
  const { permissions } = useAuth();

  if (!permissions) return <Navigate to="/" replace />;

  if (permissions?.opd?.view) {
    return <Navigate to="/opdDashboard" replace />;
  }

  if (permissions?.ward?.view) {
    return <Navigate to="/ipdDashboard" replace />;
  }

  return <Navigate to="/" replace />;
};

export default DashboardRouter;