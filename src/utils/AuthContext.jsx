import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedPermissions = sessionStorage.getItem("permissions");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedPermissions)
      setPermissions(JSON.parse(storedPermissions));

    setLoading(false);
  }, []);

  const login = (userData, permissionData) => {
    setUser(userData);
    setPermissions(permissionData);

    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem(
      "permissions",
      JSON.stringify(permissionData)
    );
  };

  const logout = () => {
    setUser(null);
    setPermissions({});
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{ user, permissions, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);