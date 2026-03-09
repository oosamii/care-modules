import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import axiosInstance from "../../constants/axiosInstance";
import toast from "react-hot-toast";

import { Eye, EyeOff } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(
        `/hospital/users/findOne/${user?.id}`,
      );
      setUserData(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch user");
    }
  };

  useEffect(() => {
    if (user?.id) fetchUser();
  }, [user]);

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      roles: ["Admin", "Doctor", "Front Desk"],
    },
    {
      id: "password",
      label: "Change Password",
      roles: ["Admin", "Doctor", "Front Desk"],
    },
    { id: "availability", label: "Availability", roles: ["Doctor"] },
    { id: "clinic", label: "Clinic Settings", roles: ["Admin"] },
  ];

  const visibleTabs = tabs.filter((tab) => tab.roles.includes(user?.role));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm">
          Manage your account and system settings
        </p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl text-xs shadow-sm border">
        {activeTab === "profile" && (
          <ProfileSettings userData={userData} refreshUser={fetchUser} />
        )}

        {activeTab === "password" && <PasswordSettings userId={user?.id} />}

        {activeTab === "availability" && user?.role === "Doctor" && (
          <DoctorAvailability />
        )}
      </div>
    </div>
  );
};

export default Settings;

import { Pencil } from "lucide-react";

const ProfileSettings = ({ userData, refreshUser }) => {
  const [form, setForm] = useState({});
  const [editableField, setEditableField] = useState(null);

  useEffect(() => {
    if (userData) {
      const initialForm = {
        full_name: userData?.fieldValues?.full_name?.value || "",
        first_name: userData?.fieldValues?.first_name?.value || "",
        last_name: userData?.fieldValues?.last_name?.value || "",
        phone: userData?.fieldValues?.phone?.value || "",
        qualification: userData?.fieldValues?.qualification?.value || "",
        email: userData?.email || "",
      };
      setForm(initialForm);
    }
  }, [userData]);

  // Regex for validations
  const nameRegex = /^[A-Za-z\s]+$/;
  const phoneRegex = /^[6-9][0-9]{9}$/;
  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUpdate = async () => {
    // Determine which name fields to validate
    const nameField = form.full_name ? "full_name" : "first_name";

    if (
      !form[nameField] ||
      (!form.full_name && (!form.first_name || !form.last_name)) ||
      !form.phone ||
      !form.email
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.full_name && !nameRegex.test(form.full_name)) {
      toast.error("Full Name can only contain letters and spaces");
      return;
    }

    if (!form.full_name) {
      if (!nameRegex.test(form.first_name) || !nameRegex.test(form.last_name)) {
        toast.error("First and Last Name can only contain letters and spaces");
        return;
      }
    }

    if (!phoneRegex.test(form.phone)) {
      toast.error("Phone must be 10 digits and start with 6-9");
      return;
    }

    if (!validateEmailFormat(form.email)) {
      toast.error("Invalid email format");
      return;
    }

    try {
      await axiosInstance.put(`/hospital/users/update/${userData.id}`, {
        department_id: userData.department_id,
        field_values: form,
      });

      toast.success("Profile updated");
      setEditableField(null);
      refreshUser();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const renderInput = (label, key, type = "text") => (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        readOnly={editableField !== key}
        className={`border rounded-lg p-2 w-full ${
          editableField === key ? "bg-white" : "bg-gray-100"
        }`}
        onChange={(e) => {
          let value = e.target.value;

          // Validation on input
          if (key === "full_name" || key === "first_name" || key === "last_name") {
            value = value.replace(/[^A-Za-z\s]/g, "");
          }
          if (key === "phone") {
            value = value.replace(/\D/g, "");
            if (value.length === 1 && !/[6-9]/.test(value)) value = "";
            if (value.length > 10) value = value.slice(0, 10);
          }

          setForm({ ...form, [key]: value });
        }}
      />
      <button
        type="button"
        onClick={() => setEditableField(key)}
        className="absolute right-2 top-8 text-gray-500 hover:text-blue-600"
        title="Edit"
      >
        <Pencil size={16} />
      </button>
    </div>
  );

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-semibold mb-4">Profile</h2>

      <div className="space-y-4">
        {/* Dynamic name fields */}
        {form.full_name
          ? renderInput("Full Name", "full_name")
          : (
            <>
              {renderInput("First Name", "first_name")}
              {renderInput("Last Name", "last_name")}
            </>
          )
        }

        {renderInput("Phone Number", "phone", "tel")}
        {renderInput("Email", "email", "email")}
        {renderInput("Qualification", "qualification")}
      </div>

      <button
        onClick={handleUpdate}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Save Changes
      </button>
    </div>
  );
};

const DoctorAvailability = () => {
  const { user } = useAuth();

  // Today's date in YYYY-MM-DD for min attribute
  const today = new Date().toISOString().split("T")[0];

  const [filterDate, setFilterDate] = useState(today);
  const [mode, setMode] = useState("weekly");
  const [slots, setSlots] = useState([]);

  const [form, setForm] = useState({
    day_of_week: 1,
    slot_date: "",
    start_time: "",
    end_time: "",
    slot_duration_mins: 15,
  });

  const resetForm = () => {
    setForm({
      day_of_week: 1,
      slot_date: "",
      start_time: "",
      end_time: "",
      slot_duration_mins: 15,
    });
  };

  // Fetch slots for current form or filter date
  const fetchSlotsForDate = async (date) => {
    try {
      const res = await axiosInstance.get(
        `/scheduler/availability?user_id=${user?.id}&date=${date}`,
      );

      const now = new Date();
      const futureSlots = (res?.data?.data?.slots || []).filter(
        (slot) => new Date(slot.end) >= now,
      );

      setSlots(futureSlots);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreate = async () => {
    toast.dismiss();
    if (form.start_time >= form.end_time) {
      toast.error("End time must be after start time");
      return;
    }

    const payload = {
      start_time: form.start_time,
      end_time: form.end_time,
      slot_duration_mins: form.slot_duration_mins,
    };

    if (mode === "weekly") {
      payload.day_of_week = form.day_of_week;
      payload.type = "opd_availability";
    } else {
      payload.slot_date = form.slot_date;
    }

    try {
      await axiosInstance.post("/scheduler/slots/create", payload);
      toast.success("Slot created");

      resetForm();
      // Refresh slots for filterDate
      fetchSlotsForDate(filterDate);
    } catch (err) {
      toast.error("Failed to create slot");
    }
  };

  useEffect(() => {
    fetchSlotsForDate(filterDate);
  }, [filterDate]);

  const formatDateTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    });
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-lg font-semibold mb-6">Doctor Availability</h2>

      {/* Mode Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Availability Type
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setMode("weekly")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              mode === "weekly"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Weekly Schedule
          </button>
          <button
            onClick={() => setMode("date")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              mode === "date"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Specific Date
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid md:grid-cols-2 gap-4">
        {mode === "weekly" && (
          <div>
            <label className="text-sm font-medium block mb-1">
              Day of Week
            </label>
            <select
              className="border rounded-lg p-2 w-full"
              value={form.day_of_week}
              onChange={(e) =>
                setForm({ ...form, day_of_week: e.target.value })
              }
            >
              <option value={1}>Sunday</option>
              <option value={2}>Monday</option>
              <option value={3}>Tuesday</option>
              <option value={4}>Wednesday</option>
              <option value={5}>Thursday</option>
              <option value={6}>Friday</option>
              <option value={7}>Saturday</option>
            </select>
          </div>
        )}

        {mode === "date" && (
          <div>
            <label className="text-sm font-medium block mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={form.slot_date}
              min={today}
              className="border rounded-lg p-2 w-full"
              onChange={(e) => setForm({ ...form, slot_date: e.target.value })}
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium block mb-1">Start Time</label>
          <input
            type="time"
            value={form.start_time}
            className="border rounded-lg p-2 w-full"
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">End Time</label>
          <input
            type="time"
            value={form.end_time}
            className="border rounded-lg p-2 w-full"
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            Slot Duration (minutes)
          </label>
          <input
            type="number"
            min={5}
            step={5}
            value={form.slot_duration_mins}
            className="border rounded-lg p-2 w-full"
            onChange={(e) =>
              setForm({ ...form, slot_duration_mins: e.target.value })
            }
          />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-6">
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
        >
          Create Availability Slot
        </button>
      </div>

      {/* Slots Display */}
      <div className="mt-10">
        <h3 className="text-md font-semibold mb-4">Available Slots</h3>

        {/* Filter by Date */}
        <div className="mb-4">
          <label className="text-sm font-medium mr-2">Filter by Date:</label>
          <input
            type="date"
            min={today}
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded-lg p-2 text-sm"
          />
        </div>

        {slots.length === 0 ? (
          <p className="text-gray-500 text-sm">No slots available</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 text-sm bg-gray-50"
              >
                <div className="font-medium">
                  {new Date(slot.start).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  {formatDateTime(slot.start)}
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  Ends: {formatDateTime(slot.end)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PasswordSettings = ({ userId }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    password: "",
    confirm: "",
  });

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=]).{8,}$/;

  const handleReset = async () => {
    toast.dismiss();
    const { password, confirm } = form;

    if (!password || !confirm) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
      );
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axiosInstance.post(`/hospital/users/reset-password/${userId}`, {
        newPassword: password,
      });

      toast.success("Password updated successfully");
      setForm({ password: "", confirm: "" });
      setShowPassword(false);
      setShowConfirm(false);
    } catch (err) {
      toast.error("Failed to update password");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Change Password</h2>

      <div className="space-y-4 max-w-md">
        {/* New Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="border rounded-lg p-2 w-full"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2"
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="border rounded-lg p-2 w-full"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2"
          >
            {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      <button
        onClick={handleReset}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Update Password
      </button>
    </div>
  );
};
