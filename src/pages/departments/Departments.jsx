import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { Building2, Users, IndianRupee, Activity } from "lucide-react";
import StatCard from "../../components/StatCard";
import axiosInstance from "../../constants/axiosInstance";
import toast from "react-hot-toast";

const Departments = () => {
  const [selectedFilter, setSelectedFilter] = useState("Month");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const filters = ["Today", "Week", "Month", "Year"];

  // 🔥 Fetch Departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        "/departments/findAll?page=1&limit=10&search=&is_active=true"
      );

      setDepartments(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Since backend doesn't provide analytics yet
  const departmentStats = departments.map((dept) => ({
    name: dept.name,
    patients: 0,
    revenue: 0,
  }));

  const totalPatients = 0;
  const totalRevenue = 0;

  const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9"];

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
        <p className="text-sm text-gray-500">
          Manage and view hospital departments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Departments"
          value={departments.length}
          icon={<Building2 size={24} className="text-blue-500"/>}
          filters={filters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        <StatCard
          title="Active Departments"
          value={departments.filter(d => d.is_active).length}
          icon={<Activity size={24} className="text-green-500"/>}
        />

        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon={<Users size={24} className="text-red-500"/>}
        />

        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue}`}
          icon={<IndianRupee size={24} className="text-gray-500"/>}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Department List Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">
            Departments Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="patients" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active Status Pie */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">
            Active vs Inactive
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Active",
                    value: departments.filter(d => d.is_active).length,
                  },
                  {
                    name: "Inactive",
                    value: departments.filter(d => !d.is_active).length,
                  },
                ]}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                <Cell fill="#22C55E" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Table */}
      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">
          Department List
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Short Code</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {dept.name}
                  </td>
                  <td className="px-4 py-3">
                    {dept.short_code}
                  </td>
                  <td className="px-4 py-3">
                    {dept.description || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        dept.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {dept.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Departments;