import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import usePermission from "../utils/usePermission";

const PermissionRoute = ({ children, permission }) => {
  const { user, loading } = useAuth();
  const { can } = usePermission();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!permission) return children;

  if (!can(permission.module, permission.action)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PermissionRoute;