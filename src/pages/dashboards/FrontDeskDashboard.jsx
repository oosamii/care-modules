import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Activity,
  Users,
  AlertCircle,
  Info,
} from "lucide-react";

import StatCard from "../../components/StatCard";
import axiosInstance from "../../constants/axiosInstance";

const FrontDeskDashboard = () => {
  const [appointmentFilter, setAppointmentFilter] = useState("Today");
  const [appointments, setAppointments] = useState([]);

  /* ---------------- TODAY RANGE ---------------- */

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

  /* ---------------- FETCH TODAY VISITS ---------------- */

  const fetchTodayAppointments = async () => {
    try {
      const { from, to } = getTodayRange();

      const res = await axiosInstance.get("/opd/visits/findAll", {
        params: {
          page: 1,
          limit: 50,
          from_date: from,
          to_date: to,
        },
      });

      if (res.data.success) {
        const visits = res.data.data.data;

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
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  /* ---------------- STATS ---------------- */

  const todayDate = new Date().toISOString().split("T")[0];

  const stats = useMemo(() => {
    return {
      today: appointments.length,
      scheduled: appointments.filter((a) => a.status === "open").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    };
  }, [appointments]);

  /* ---------------- UI ---------------- */

  const getStatusColor = (status) => {
    if (status === "completed")
      return "bg-blue-100 text-blue-600";
    if (status === "cancelled")
      return "bg-red-100 text-red-600";
    return "bg-orange-100 text-orange-600";
  };

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

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
       <StatCard
  title="Appointments"
  value={12} // static for now
  icon={<Calendar size={24} className="text-blue-500" />}
  filters={["Today", "Week", "Month"]}
  selectedFilter={appointmentFilter}
  onFilterChange={setAppointmentFilter}
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
          <h2 className="text-lg font-semibold mb-4">
            Today's Appointments
          </h2>

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
                          a.status
                        )}`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="py-4 text-center text-gray-400"
                  >
                    No appointments today
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ALERTS (UNCHANGED) */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">
            System Alerts
          </h2>

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