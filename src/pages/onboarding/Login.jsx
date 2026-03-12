import React, { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, Hospital } from "lucide-react";
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

        // Permission based routing
        if (formattedPermissions?.opd?.view) {
          navigate("/opdDashboard");
        } else if (formattedPermissions?.ward?.view) {
          navigate("/ipdDashboard");
        } else if (formattedPermissions?.pharmacy?.view) {
          navigate("/pharmacyDashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Unable to login");
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
    <div className="min-h-screen flex bg-slate-100">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white p-16 flex-col justify-between">
        <div className="flex items-center gap-3 text-2xl font-semibold">
          🏥 Orbit Care
        </div>

        <div>
          <h1 className="text-5xl font-bold mb-6">
            Healthcare Management Platform
          </h1>

          <p className="text-lg text-blue-100 leading-relaxed">
            Secure access for doctors, nurses, front desk staff and billing
            teams to manage patients, appointments and hospital workflows.
          </p>
        </div>

        <div className="text-blue-200 text-sm">
          © {new Date().getFullYear()} Orbit Care
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 justify-center items-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Staff Login
          </h2>

          <p className="text-center text-gray-500 text-sm mt-2">
            Access your hospital workspace
          </p>

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleLookup} className="mt-8 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Work Email
                </label>

                <div className="relative mt-1">
                  <Mail
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-400"
                    placeholder="doctor@hospital.com"
                  />
                </div>

                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium"
              >
                {loading ? "Checking hospitals..." : "Continue"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              {/* Hospital Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Select Hospital
                </label>

                <div className="relative mt-1">
                  <Hospital
                    size={18}
                    className="absolute left-3 top-3 text-gray-400 pointer-events-none"
                  />

                  <select
                    name="hospital_identifier"
                    value={form.hospital_identifier}
                    onChange={handleChange}
                    className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-400 bg-white"
                  >
                    <option value="">Choose hospital</option>

                    {hospitals.map((hospital) => (
                      <option
                        key={hospital.hospital_slug}
                        value={hospital.hospital_slug}
                      >
                        {hospital.hospital_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="relative mt-1">
                  <Lock
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-400 hover:text-blue-600 transition"
                >
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/forgotPassword", {
                      state: {
                        email: form.email,
                        hospital_identifier: form.hospital_identifier,
                      },
                    })
                  }
                  className="text-xs text-gray-400 hover:text-blue-600 transition"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Sign In */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium w-full"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
