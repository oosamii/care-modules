import React, { useState } from "react";
import StatCard from "../../components/StatCard";

const OpdDashboard = () => {

  const stats = [
    { title: "Registrations Today", value: 45 },
    { title: "Appointments Today", value: 120 },
    { title: "Checked-in", value: 82 },
    { title: "Waiting", value: 15, color: "text-orange-500" },
    { title: "In Consultation", value: 8, color: "text-blue-600" },
    { title: "Completed", value: 59, color: "text-green-600" },
  ];

  const [queue] = useState([
    {
      token: "T-102",
      patient: "Emily Chang",
      doctor: "Dr. P. Sharma",
      wait: "10 mins",
      status: "Checked-in",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    {
      token: "T-103",
      patient: "Michael Ross",
      doctor: "Dr. S. Gupta",
      wait: "45 mins",
      status: "Waiting",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    {
      token: "T-104",
      patient: "Linda Ray",
      doctor: "Dr. A. Miller",
      wait: "2 mins",
      status: "In Consultation",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
    {
      token: "T-105",
      patient: "David Chen",
      doctor: "Dr. P. Sharma",
      wait: "20 mins",
      status: "Waiting",
      avatar: "https://i.pravatar.cc/40?img=4",
    },
    {
      token: "T-106",
      patient: "Robert Wilson",
      doctor: "Dr. K. Lee",
      wait: "5 mins",
      status: "Checked-in",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
  ]);

  const [doctors] = useState([
    {
      name: "Dr. P. Sharma",
      dept: "Cardiology",
      slots: "12/15",
      status: "Available",
      avatar: "https://i.pravatar.cc/40?img=10",
    },
    {
      name: "Dr. S. Gupta",
      dept: "Orthopedics",
      slots: "18/20",
      status: "Busy",
      avatar: "https://i.pravatar.cc/40?img=11",
    },
    {
      name: "Dr. A. Miller",
      dept: "Gen Med",
      slots: "8/25",
      status: "Available",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
    {
      name: "Dr. K. Lee",
      dept: "Neurology",
      slots: "0/10",
      status: "Offline",
      avatar: "https://i.pravatar.cc/40?img=13",
    },
  ]);

  const badgeColor = (status) => {
    switch (status) {
      case "Checked-in":
        return "bg-green-100 text-green-700";
      case "Waiting":
        return "bg-yellow-100 text-yellow-700";
      case "In Consultation":
        return "bg-blue-100 text-blue-700";
      case "Available":
        return "bg-green-100 text-green-700";
      case "Busy":
        return "bg-red-100 text-red-600";
      case "Offline":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className=" bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">OPD Dashboard</h1>

        <select className="border rounded-lg px-3 py-2">
          <option>Today</option>
          <option>This Week</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((s, index) => (
          <StatCard
            key={index}
            title={s.title}
            value={
              <span className={s.color || "text-gray-800"}>
                {s.value}
              </span>
            }
          />
        ))}
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* Queue Snapshot */}
        <div className="bg-white rounded-xl border shadow-sm">

          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold">Today's Queue Snapshot</h2>
            <button className="text-blue-600 text-sm">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Token</th>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-left">Wait Time</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left"></th>
                </tr>
              </thead>

              <tbody>
                {queue.map((q, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">{q.token}</td>

                    <td className="p-3 flex items-center gap-2">
                      <img
                        src={q.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      {q.patient}
                    </td>

                    <td className="p-3">{q.doctor}</td>

                    <td
                      className={`p-3 ${
                        q.wait.includes("45")
                          ? "text-red-500"
                          : ""
                      }`}
                    >
                      {q.wait}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor(
                          q.status
                        )}`}
                      >
                        {q.status}
                      </span>
                    </td>

                    <td className="p-3">
                      <button className="text-blue-600 text-sm">
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </div>

        {/* Doctor Availability */}
        <div className="bg-white rounded-xl border shadow-sm">

          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold">Doctor Availability</h2>
            <button className="text-blue-600 text-sm">
              View Schedule
            </button>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-left">Dept</th>
                  <th className="p-3 text-left">Slot Util.</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>

                {doctors.map((doc, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 flex items-center gap-2">
                      <img
                        src={doc.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      {doc.name}
                    </td>

                    <td className="p-3">{doc.dept}</td>

                    <td className="p-3">{doc.slots}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor(
                          doc.status
                        )}`}
                      >
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-xl border shadow-sm">

        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">Alerts & Exceptions</h2>

          <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
            4 Active Alerts
          </span>
        </div>

        <div className="p-5 flex justify-between items-center">

          <div>
            <h3 className="font-medium">
              Long wait times detected (&gt; 45 mins)
            </h3>

            <p className="text-gray-500 text-sm">
              Patients are experiencing delays in Orthopedics department.
            </p>
          </div>

          <div className="flex items-center gap-6">

            <p className="font-semibold">8 Patients</p>

            <button className="text-blue-600">
              View Queue
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OpdDashboard;