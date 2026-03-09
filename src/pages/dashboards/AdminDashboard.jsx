import React, { useState } from "react";
import StatCard from "../../components/StatCard";
import {
  Users,
  Activity,
  DollarSign,
  HeartPulse,
} from "lucide-react";

const AdminDashboard = () => {
  const [revenueFilter, setRevenueFilter] = useState("Monthly");

  const modules = [
    { name: "Patients", status: "Active" },
    { name: "Appointments", status: "Active" },
    { name: "EMR", status: "Active" },
    { name: "Lab", status: "Active" },
    { name: "Pharmacy", status: "Active" },
  ];

  const health = [
    { label: "Server Status", value: "Healthy", percent: 95, color: "bg-green-500" },
    { label: "Database", value: "Optimal", percent: 92, color: "bg-green-500" },
    { label: "Storage", value: "75% Used", percent: 75, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">
          System overview and management
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Staff"
          value="156"
          icon={<Users className="text-blue-500" />}
        />

        <StatCard
          title="Active Patients"
          value="1,234"
          icon={<HeartPulse className="text-green-500" />}
        />

        <StatCard
          title="Revenue (Month)"
          value="₹234K"
          icon={<DollarSign className="text-purple-500" />}
          filters={["Daily", "Weekly", "Monthly"]}
          selectedFilter={revenueFilter}
          onFilterChange={setRevenueFilter}
        />

        <StatCard
          title="System Alerts"
          value="5"
          icon={<Activity className="text-orange-500" />}
        />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Module Status */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            Module Status
          </h2>

          <div className="space-y-3">
            {modules.map((module, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg"
              >
                <span className="font-medium text-gray-700">
                  {module.name}
                </span>

                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {module.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            System Health
          </h2>

          <div className="space-y-5">
            {health.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1 text-sm font-medium">
                  <span>{item.label}</span>
                  <span
                    className={
                      item.label === "Storage"
                        ? "text-orange-500"
                        : "text-green-600"
                    }
                  >
                    {item.value}
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;