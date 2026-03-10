import React, { useEffect, useState } from "react";
import { Mail, Hospital } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../constants";

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
  if (!location.state?.email) {
    navigate("/");
  }
}, []);

  const [form, setForm] = useState({
    email: location.state?.email || "",
    hospital_identifier: location.state?.hospital_identifier || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!form.email || !form.hospital_identifier) {
      toast.error("Email and hospital are required");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${BASE_URL}/auth/forgot-password`,
        form
      );

      if (data?.success) {
        toast.success("Password reset link sent to your email 📩");
      } else {
        toast.error(data?.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 text-sm mt-2">
          Enter your email to receive a password reset link
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
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
                placeholder="Enter email"
              />
            </div>
          </div>

          {/* Hospital */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Hospital Identifier
            </label>

            <div className="relative mt-1">
              <Hospital
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                name="hospital_identifier"
                value={form.hospital_identifier}
                onChange={handleChange}
                className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-400"
                placeholder="Enter hospital identifier"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs text-gray-400 hover:text-blue-600 transition"
            >
              Back to Login
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;