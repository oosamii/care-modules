import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./utils/AuthContext";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/onboarding/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import PermissionRoute from "./components/PermissionRoute";
import ForgotPassword from "./pages/onboarding/ForgotPassword";
import ResetPassword from "./pages/onboarding/ResetPassword";
import ResetComplete from "./pages/onboarding/ResetComplete";
import AllRoutes from "./components/AllRoutes";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/verifyPassword" element={<ResetPassword />} />
        <Route path="/reset-complete" element={<ResetComplete />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {AllRoutes.map(({ path, element, permission }) => (
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
