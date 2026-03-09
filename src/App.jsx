import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./utils/AuthContext";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/onboarding/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import { appRoutes } from "./components/AppRoutes";
import PermissionRoute from "./components/PermissionRoute";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {appRoutes.map(({ path, element, permission }) => (
            <Route
              key={path}
              path={path}
              element={
                <PermissionRoute permission={permission}>
                  {element}
                </PermissionRoute>
              }
            />
          ))}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;