import React, { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  Stethoscope,
  User,
  Clock,
} from "lucide-react";
import usePermission from "../../utils/usePermission";
import StatCard from "../../components/StatCard";

const OPD = () => {
  const { can } = usePermission();

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Today");

  const opdData = [
    {
      id: 1,
      patient: "Rahul Sharma",
      doctor: "Dr. Mehta",
      department: "Cardiology",
      date: "2026-03-04",
      time: "10:30 AM",
      status: "Completed",
    },
    {
      id: 2,
      patient: "Anjali Verma",
      doctor: "Dr. Rao",
      department: "Dermatology",
      date: "2026-03-04",
      time: "12:00 PM",
      status: "Waiting",
    },
  ];

  const filteredData = opdData.filter((item) =>
    item.patient.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "Waiting":
        return "bg-yellow-100 text-yellow-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">OPD Management</h2>
          <p className="text-sm text-gray-500">
            Manage outpatient department visits
          </p>
        </div>

        {can("opd", "create") && (
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus size={18} />
            Add OPD
          </button>
        )}
      </div>

      {/* ✅ Stats Section Using StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Visits"
          value="128"
          icon={<User className="text-blue-600" />}
          filters={["Today", "Week", "Month"]}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        <StatCard
          title="Waiting"
          value="14"
          icon={<Clock className="text-yellow-600" />}
        />

        <StatCard
          title="Completed"
          value="98"
          icon={<Stethoscope className="text-green-600" />}
        />
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Patient</th>
              <th className="px-4 py-3 text-left">Doctor</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Status</th>
              {can("opd", "update") && (
                <th className="px-4 py-3 text-right">Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.doctor}</td>
                <td className="px-4 py-3">{item.department}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <Calendar size={14} />
                  {item.date}
                </td>
                <td className="px-4 py-3">{item.time}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${statusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                {can("opd", "update") && (
                  <td className="px-4 py-3 text-right">
                    <button className="text-blue-600 hover:underline text-sm">
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No OPD records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OPD;