import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Download,
  Users,
  DollarSign,
  Calendar,
  Activity,
} from "lucide-react";
import StatCard from "../../components/StatCard";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [patientFilter, setPatientFilter] = useState("Monthly");

  const visitsData = [
    { month: "Jan", visits: 450 },
    { month: "Feb", visits: 520 },
    { month: "Mar", visits: 480 },
    { month: "Apr", visits: 610 },
    { month: "May", visits: 590 },
    { month: "Jun", visits: 650 },
  ];

  const departmentData = [
    { name: "Cardiology", value: 22, color: "#2563eb" },
    { name: "Emergency", value: 12, color: "#f59e0b" },
    { name: "General Medicine", value: 29, color: "#dc2626" },
    { name: "Pediatrics", value: 17, color: "#059669" },
    { name: "Orthopedics", value: 19, color: "#7c3aed" },
  ];

  const dailyVolumeData = [
    { day: "Mon", patients: 45, appointments: 38 },
    { day: "Tue", patients: 52, appointments: 44 },
    { day: "Wed", patients: 48, appointments: 40 },
    { day: "Thu", patients: 60, appointments: 50 },
    { day: "Fri", patients: 55, appointments: 47 },
    { day: "Sat", patients: 35, appointments: 28 },
    { day: "Sun", patients: 25, appointments: 20 },
  ];

  // 🥧 Appointment Status Distribution
  const appointmentStatusData = [
    { name: "Completed", value: 65, color: "#16a34a" },
    { name: "Scheduled", value: 20, color: "#2563eb" },
    { name: "Cancelled", value: 10, color: "#dc2626" },
    { name: "No Show", value: 5, color: "#f59e0b" },
  ];

  // 📈 Patient Growth Trend
const patientGrowthData = [
  { month: "Jan", patients: 1200 },
  { month: "Feb", patients: 1350 },
  { month: "Mar", patients: 1500 },
  { month: "Apr", patients: 1700 },
  { month: "May", patients: 1900 },
  { month: "Jun", patients: 2100 },
];

// 🩺 Top Diagnoses
const topDiagnoses = [
  { name: "Hypertension", percentage: 72 },
  { name: "Diabetes", percentage: 65 },
  { name: "Asthma", percentage: 48 },
  { name: "Arthritis", percentage: 39 },
];

// 📊 Demographics
const ageDistribution = [
  { label: "0-18 years", value: 18 },
  { label: "19-35 years", value: 25 },
  { label: "36-55 years", value: 32 },
  { label: "56+ years", value: 25 },
];

const genderDistribution = [
  { label: "Male", value: 48 },
  { label: "Female", value: 51 },
  { label: "Other", value: 1 },
];

const insuranceStatus = [
  { label: "Private Insurance", value: 62 },
  { label: "Medicare", value: 23 },
  { label: "Self-Pay", value: 15 },
];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen space-y-6">
      {/* 🔹 Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm">
            Generate and view system reports and analytics
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <select className="border rounded-lg px-3 py-2 text-sm bg-white">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
          </select>

          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* 🔹 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value="2,847"
          icon={<Users className="text-blue-600" />}
          filters={["Daily", "Weekly", "Monthly", "Yearly"]}
          selectedFilter={patientFilter}
          onFilterChange={setPatientFilter}
        />

        <StatCard
          title="Total Revenue"
          value="₹285K"
          icon={<DollarSign className="text-green-600" />}
          filters={["Daily", "Weekly", "Monthly", "Yearly"]}
        />

        <StatCard
          title="Appointments"
          value="1,370"
          icon={<Calendar className="text-purple-600" />}
        />

        <StatCard
          title="Patient Satisfaction"
          value="4.8/5"
          icon={<Activity className="text-orange-600" />}
        />
      </div>

      {/* 🔹 Tabs */}
      <div className="flex gap-3 flex-wrap">
        {[
          "Overview",
          "Patient Analytics",
          "Financial Reports",
          "Clinical Reports",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === tab
                ? "bg-gray-200 font-medium"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔹 Overview Charts */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          {/* 🔹 Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 📈 Line Chart */}
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="font-semibold mb-4">
                Patient Visits Trend
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="visits"
                      stroke="#2563eb"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 🥧 Department Pie */}
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="font-semibold mb-4">
                Department Visit Distribution
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 🔹 Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 📊 Bar Chart */}
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="font-semibold mb-4">
                Daily Patient & Appointment Volume
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="patients"
                      fill="#2563eb"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="appointments"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 🥧 Appointment Status Pie */}
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="font-semibold mb-4">
                Appointment Status Distribution
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appointmentStatusData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {appointmentStatusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Patient Analytics" && (
  <div className="space-y-6">

    {/* 🔹 Row 1 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* 📈 Patient Growth Trend */}
      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-semibold mb-4">Patient Growth Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={patientGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="patients"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🩺 Top Diagnoses */}
      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-semibold mb-4">Top Diagnoses</h3>

        <div className="space-y-4">
          {topDiagnoses.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.name}</span>
                <span>{item.percentage}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>

    {/* 🔹 Demographics Section */}
    <div className="bg-white rounded-2xl border p-6 space-y-8">
      <h3 className="text-lg font-semibold">
        Patient Demographics Summary
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Age Distribution */}
        <div>
          <h4 className="font-medium mb-4">Age Distribution</h4>
          <div className="space-y-3">
            {ageDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Distribution */}
        <div>
          <h4 className="font-medium mb-4">Gender Distribution</h4>
          <div className="space-y-3">
            {genderDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance Status */}
        <div>
          <h4 className="font-medium mb-4">Insurance Status</h4>
          <div className="space-y-3">
            {insuranceStatus.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>

  </div>
)}
    </div>
  );
};

export default Reports;