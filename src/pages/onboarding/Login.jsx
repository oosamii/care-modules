import React, { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { useAuth } from "../../utils/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    password: "",
    hospital_identifier: "",
  });

  const [hospitals, setHospitals] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // 🔎 STEP 1 – Lookup Hospitals
  const handleLookup = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!form.email) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!emailRegex.test(form.email)) {
      setErrors({ email: "Enter a valid email address" });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(`${BASE_URL}/auth/lookup-hospitals`, {
        email: form.email,
      });

      if (data?.success) {
        toast.success(data?.message);
        setHospitals(data?.data || []);
        setStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to lookup hospitals");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!form.password) {
      setErrors({ password: "Password is required" });
      return;
    }

    if (!form.hospital_identifier) {
      toast.error("Please select a hospital");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(`${BASE_URL}/auth/login`, {
        email: form.email,
        password: form.password,
        hospital_identifier: form.hospital_identifier,
      });

      if (data?.success) {
        const { accessToken, refreshToken, user } = data.data;

        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);

        const formattedPermissions = convertPermissions(user.permissions);

        login(user, formattedPermissions);

        toast.success("Login successful 🎉");
        navigate("/dashboard");
      } else {
        toast.error(data?.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Unable to login at the moment",
      );
    } finally {
      setLoading(false);
    }
  };

  const convertPermissions = (permissionsArray = []) => {
    return permissionsArray.reduce((acc, perm) => {
      const [module, action] = perm.split(".");

      if (!acc[module]) acc[module] = {};
      acc[module][action] = true;

      return acc;
    }, {});
  };

  return (
  <div className="min-h-screen flex flex-col lg:flex-row bg-primary">
  {/* Left Panel for large screens */}
  <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white relative overflow-hidden">
    <div className="absolute top-8 left-10 flex items-center gap-3">
      <div className="bg-white text-blue-600 p-2 rounded-lg font-bold text-lg">🏥</div>
      <span className="text-xl font-semibold">Orbit Care</span>
    </div>

    <div className="flex flex-col justify-center px-16 lg:px-20">
      <h1 className="text-5xl font-bold mb-8">SuperAdmin Console</h1>
      <ul className="space-y-4 text-lg list-disc list-inside">
        <li>Manage hospitals (tenants)</li>
        <li>Control modules & access</li>
        <li>Monitor platform health & audit</li>
      </ul>
    </div>
  </div>

  {/* Right Panel / Login Form */}
  <div className="flex w-full lg:w-1/2 justify-center items-center p-6">
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>

      {/* STEP 1: Email Lookup */}
      {step === 1 && (
        <form onSubmit={handleLookup} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg transition"
          >
            {loading ? "Checking..." : "Next"}
          </button>
        </form>
      )}

      {/* STEP 2: Hospital & Password */}
      {step === 2 && (
        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Hospital
            </label>
            <select
              name="hospital_identifier"
              value={form.hospital_identifier}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">-- Select --</option>
              {hospitals?.map((hospital) => (
                <option key={hospital.hospital_slug} value={hospital.hospital_slug}>
                  {hospital.hospital_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-600"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:underline"
            >
              Change Email
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-6 rounded-lg transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      )}

      <p className="text-center text-sm text-gray-500 mt-6">
        © {new Date().getFullYear()} Orbit Care
      </p>
    </div>
  </div>
</div>
  );
};

export default Login;
