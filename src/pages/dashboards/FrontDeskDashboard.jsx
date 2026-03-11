import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Activity,
  Users,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import StatCard from "../../components/StatCard";
import axiosInstance from "../../constants/axiosInstance";

const FrontDeskDashboard = () => {
  const [appointmentFilter, setAppointmentFilter] = useState("today");
  const [appointments, setAppointments] = useState([]);
  const [statsData, setStatsData] = useState({
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const getTodayRange = () => {
    const now = new Date();

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    return {
      from: start.toISOString(),
      to: end.toISOString(),
    };
  };

  const fetchTodayAppointments = async () => {
    try {
      const { from, to } = getTodayRange();

      const res = await axiosInstance.get("/opd/visits/findAll", {
        params: {
          page,
          limit,
          from_date: from,
          to_date: to,
        },
      });

      if (res.data.success) {
        const visits = res.data.data.data;
        const totalCount = res.data.data.total || visits.length;

        const formatted = visits.map((visit) => {
          const dateObj = new Date(visit.visit_date);

          return {
            id: visit.id,
            patient: visit.patient
              ? `${visit.patient.first_name} ${visit.patient.last_name}`
              : "Unknown Patient",
            time: dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: visit.status,
            date: dateObj.toISOString().split("T")[0],
          };
        });

        setAppointments(formatted);
        setTotal(totalCount);
        setTotalPages(Math.ceil(totalCount / limit));
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  const fetchStatsData = async (period = "today") => {
    try {
      const { data } = await axiosInstance.get("/opd/visits/stats", {
        params: { period },
      });

      if (data.success) {
        setStatsData({
          scheduled: data.data.counts.scheduled,
          completed: data.data.counts.completed,
          cancelled: data.data.counts.cancelled,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchTodayAppointments();
  }, [page]);

  useEffect(() => {
    fetchStatsData(appointmentFilter);
  }, [appointmentFilter]);

  /* ---------------- STATS ---------------- */

  const stats = useMemo(
    () => ({
      today: total,
      scheduled: statsData.scheduled,
      completed: statsData.completed,
      cancelled: statsData.cancelled,
    }),
    [statsData, total],
  );

  /* ---------------- STATUS COLOR ---------------- */

  const getStatusColor = (status) => {
    if (status === "completed") return "bg-blue-100 text-blue-600";
    if (status === "cancelled") return "bg-red-100 text-red-600";
    return "bg-orange-100 text-orange-600";
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Front Desk Dashboard
        </h1>
        <p className="text-gray-500">
          Welcome back, manage your patients and appointments
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Appointments"
          value={
            statsData.scheduled + statsData.completed + statsData.cancelled
          }
          icon={<Calendar size={24} className="text-blue-500" />}
          filters={["today", "week", "month"]}
          selectedFilter={appointmentFilter}
          onFilterChange={(period) =>
            setAppointmentFilter(period.toLowerCase())
          }
        />

        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          icon={<Clock size={24} className="text-orange-500" />}
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<Activity size={24} className="text-green-500" />}
        />

        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={<Users size={24} className="text-red-500" />}
        />
      </div>

      {/* TODAY APPOINTMENTS TABLE */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Today's Appointments</h2>

          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">Time</th>
                <th>Patient</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length > 0 ? (
                appointments.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="py-3">{a.time}</td>
                    <td>{a.patient}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                          a.status,
                        )}`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-400">
                    No appointments today
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-end items-center mt-5 gap-4">
            <button
              className="border rounded-lg p-1 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            <button
              className="border rounded-lg p-1 disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ALERTS */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">System Alerts</h2>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex gap-2 items-start">
              <Info className="text-blue-500" size={18} />
              <div>
                <p className="font-semibold">Dashboard Active</p>
                <p className="text-sm text-gray-500">
                  System is running correctly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontDeskDashboard;
