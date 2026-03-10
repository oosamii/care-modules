import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../constants";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
    return regex.test(pwd);
  };
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // Commented out API call for now
      /*
    const { data } = await axios.post(`${BASE_URL}/user/reset-password`, {
      email,
      newPassword: password,
    });

    if (data.success) {
      toast.success(data?.message);
    }
    */

      // Directly navigate to next page
      setTimeout(() => navigate("/reset-complete"), 500);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* LEFT SIDE - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white p-16 flex-col justify-between">
        <div className="flex items-center gap-3 text-2xl font-semibold">
          🏥 Orbit Care
        </div>

        <div>
          <h1 className="text-5xl font-bold mb-6">
            Healthcare Management Platform
          </h1>

          <p className="text-lg text-blue-100 leading-relaxed">
            Secure access for doctors, nurses, front desk staff, and billing
            teams to manage patients, appointments, and hospital workflows.
          </p>
        </div>

        <div className="text-blue-200 text-sm">
          © {new Date().getFullYear()} Orbit Care
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="flex flex-1 justify-center items-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Reset Password
          </h2>
          <p className="text-center text-gray-500 text-sm mt-2">
            {email ? `for ${email}` : "Enter your new password below"}
          </p>

          <form onSubmit={handleReset} className="mt-8 space-y-6">
            {/* New Password */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border rounded-lg pl-3 pr-10 py-2 mt-1 text-sm focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full border rounded-lg pl-3 pr-10 py-2 mt-1 text-sm focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            {/* Reset Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>

            {/* Back to Login */}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-xs text-gray-500 hover:text-blue-600 transition"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
