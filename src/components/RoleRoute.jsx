import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.length) return children;

  const userRole = user?.role?.toUpperCase().trim();

  const normalizedRoles = allowedRoles.map((r) =>
    r.toUpperCase().trim()
  );

  if (!normalizedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;