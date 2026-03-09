import { useAuth } from "./AuthContext";

const usePermission = () => {
  const { permissions } = useAuth();

  const can = (module, action) => {
    if (!module) return true;

    return permissions?.[module]?.[action] === true;
  };

  const canAccess = (item) => {
    if (!item?.permission) return true;

    return can(item.permission.module, item.permission.action);
  };

  return { can, canAccess };
};

export default usePermission;