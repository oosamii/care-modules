import React, { useState } from "react";
import { useAuth } from "../../utils/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", roles: ["Admin", "Doctor", "Front Desk"] },
    { id: "password", label: "Change Password", roles: ["Admin", "Doctor", "Front Desk"] },
    { id: "availability", label: "Availability", roles: ["Doctor"] },
    { id: "clinic", label: "Clinic Settings", roles: ["Admin"] },
  ];

  const visibleTabs = tabs.filter((tab) =>
    tab.roles.includes(user?.role)
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm">
          Manage your account and system settings
        </p>
      </div>

      {/* Tabs */}
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

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-xl text-xs shadow-sm border">
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "password" && <PasswordSettings />}
        {activeTab === "availability" && user?.role === "Doctor" && (
          <DoctorAvailability />
        )}
        {activeTab === "clinic" && user?.role === "Admin" && <ClinicSettings />}
      </div>
    </div>
  );
};

export default Settings;


const ProfileSettings = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Profile</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          placeholder="Full Name"
          className="border rounded-lg p-2"
        />

        <input
          placeholder="Email"
          className="border rounded-lg p-2"
        />

        <input
          placeholder="Phone"
          className="border rounded-lg p-2"
        />

        <input
          placeholder="Specialization"
          className="border rounded-lg p-2"
        />
      </div>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
        Save Changes
      </button>
    </div>
  );
};

const PasswordSettings = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Change Password</h2>

      <div className="space-y-3 max-w-md">
        <input
          type="password"
          placeholder="Current Password"
          className="border rounded-lg p-2 w-full"
        />

        <input
          type="password"
          placeholder="New Password"
          className="border rounded-lg p-2 w-full"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="border rounded-lg p-2 w-full"
        />
      </div>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
        Update Password
      </button>
    </div>
  );
};

const DoctorAvailability = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Doctor Availability</h2>

      <div className="grid md:grid-cols-3 gap-4">

        <select className="border rounded-lg p-2">
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
        </select>

        <input
          type="time"
          className="border rounded-lg p-2"
        />

        <input
          type="time"
          className="border rounded-lg p-2"
        />

      </div>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
        Add Slot
      </button>
    </div>
  );
};

const ClinicSettings = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Clinic Settings</h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          placeholder="Clinic Name"
          className="border rounded-lg p-2"
        />

        <input
          placeholder="Contact Number"
          className="border rounded-lg p-2"
        />

        <input
          placeholder="Email"
          className="border rounded-lg p-2"
        />

        <input
          placeholder="Address"
          className="border rounded-lg p-2"
        />

      </div>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
        Save Settings
      </button>
    </div>
  );
};