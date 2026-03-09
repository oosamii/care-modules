import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Plus,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import AddAppointmentModal from "./component/AddAppointmentModal";
import axiosInstance from "../../constants/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../../utils/AuthContext";

/* ---------------- WEEK GENERATOR ---------------- */

const getCurrentWeek = () => {
  const today = new Date();
  const day = today.getDay();

  const start = new Date(today);
  start.setDate(today.getDate() - day);

  const week = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    week.push({
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.toISOString().split("T")[0],
      day: d.getDate(),
    });
  }

  return week;
};

const Appointments = () => {
  const { user, permissions } = useAuth();

  const [activeTab, setActiveTab] = useState("today");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [doctorId, setDoctorId] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const weekDays = useMemo(() => getCurrentWeek(), []);

  const role = user?.role?.toLowerCase();

  const showDoctorFilter = ["front", "nurse", "billing"].some((r) =>
    role?.includes(r),
  );

  /* ---------------- FETCH DOCTORS ---------------- */

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get("/hospital/users/findAll", {
        params: {
          page: 1,
          limit: 100,
          role_id: "10c1a68c-e644-4f9c-bbe4-05d0f83a79c0",
        },
      });

      setDoctors(res?.data?.data?.data || []);
    } catch {
      toast.error("Failed to fetch doctors");
    }
  };

  useEffect(() => {
    if (!user) return;

    if (showDoctorFilter) {
      fetchDoctors();
    }
  }, [user?.role]);

  /* ---------------- FETCH APPOINTMENTS ---------------- */

  const fetchAppointments = async () => {
    try {
      const params = { page, limit };

      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;

      if (role?.includes("doctor")) {
        params.doctor_id = user.id;
      }

      if (doctorId && !role?.includes("doctor")) {
        params.doctor_id = doctorId;
      }

      const res = await axiosInstance.get("/opd/visits/findAll", { params });

      const response = res.data.data;

      const mapped = response.data.map((visit) => {
        const dateObj = new Date(visit.visit_date);

        return {
          id: visit.id,
          patient: `${visit.patient?.first_name} ${visit.patient?.last_name}`,
          gender: visit?.patient?.gender,
          phone: visit?.patient?.phone,
          doc: visit?.doctor?.full_name,
          date: dateObj.toISOString().split("T")[0],
          time: dateObj.toTimeString().slice(0, 5),
          status: visit.status,
        };
      });

      setAppointments(mapped);
      setTotalPages(response.totalPages || 1);
    } catch {
      toast.error("Failed to fetch visits");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, doctorId, fromDate, toDate]);

  /* ---------------- STATS ---------------- */

  const stats = useMemo(() => {
    return {
      today: appointments.filter((a) => a.date === today).length,
      scheduled: appointments.filter((a) => a.status === "open").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    };
  }, [appointments, today]);

  /* ---------------- HELPERS ---------------- */

  const formatTime = (time) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formatted = hour % 12 || 12;

    return `${formatted}:${m} ${ampm}`;
  };

  const getStatusColor = (status) => {
    if (status === "completed") return "bg-blue-100 text-blue-700";
    if (status === "cancelled") return "bg-red-100 text-red-600";
    return "bg-green-100 text-green-700";
  };

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  /* ---------------- FILTER HANDLERS ---------------- */

  const handleReset = () => {
    setPage(1);
    setFromDate("");
    setToDate("");
    setDoctorId("");
  };

  const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Appointments</h1>
          <p className="text-gray-500 text-sm">
            Manage patient appointments and schedules
          </p>
        </div>

        {permissions?.opd?.create && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            New Appointment
          </button>
        )}
      </div>

      <AddAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAppointments}
      />

      {/* FILTER */}

      <div className="bg-blue-100 border rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />

        {showDoctorFilter && (
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Doctors</option>

            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.full_name} {doc.last_name}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleReset}
          className="bg-gray-100 px-4 py-2 rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Appointments Today"
          value={stats.today}
          icon={<Calendar />}
        />
        <StatCard title="Scheduled" value={stats.scheduled} icon={<Clock />} />
        <StatCard title="Completed" value={stats.completed} icon={<User />} />
        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={<Calendar />}
        />
      </div>

      {/* TABS */}

      <div className="flex gap-3 bg-gray-100 p-1 rounded-lg w-fit">
        <TabButton id="today" active={activeTab} setActive={setActiveTab}>
          Today's Schedule
        </TabButton>
        {/* <TabButton id="calendar" active={activeTab} setActive={setActiveTab}>
          Calendar View
        </TabButton> */}
        <TabButton id="list" active={activeTab} setActive={setActiveTab}>
          List View
        </TabButton>
      </div>

      {/* TODAY */}
      {activeTab === "today" && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          {appointments
            .filter((a) => a.date === today)
            .map((a) => (
              <div
                key={a.id}
                className="flex justify-between items-center border rounded-lg p-4 hover:shadow-sm transition"
              >
                {/* Left Section */}
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">{a.patient}</p>

                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>{a.gender}</span>
                    <span>{a.phone}</span>
                  </div>

                  <p className="text-xs text-gray-500">Dr. {a.doc}</p>
                </div>

                {/* Right Section */}
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    {formatTime(a.time)}
                  </p>

                  <span
                    className={`px-2 py-1 rounded-md text-xs ${getStatusColor(
                      a.status,
                    )}`}
                  >
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* LIST VIEW */}

      {activeTab === "list" && (
        <div className="bg-white border rounded-xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b text-xs uppercase">
                  <th className="pb-3">Patient</th>
                  <th>Doctor</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b text-sm hover:bg-gray-50 transition"
                  >
                    {/* Patient */}
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
                          {a.patient?.charAt(0)}
                        </div>

                        <span className="font-medium text-gray-800">
                          {a.patient}
                        </span>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="py-3 text-gray-600">Dr. {a.doc}</td>

                    {/* Phone */}
                    <td className="py-3 text-gray-600">{a.phone}</td>

                    {/* Gender */}
                    <td className="py-3 text-gray-600">{a.gender}</td>

                    {/* Date */}
                    <td className="py-3 text-gray-600">{formatDate(a.date)}</td>

                    {/* Time */}
                    <td className="py-3 text-gray-600">{formatTime(a.time)}</td>

                    {/* Status */}
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                          a.status,
                        )}`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={nextPage}
                disabled={page === totalPages}
                className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- TAB BUTTON ---------------- */

const TabButton = ({ id, active, setActive, children }) => (
  <button
    onClick={() => setActive(id)}
    className={`px-4 py-2 text-sm rounded-md ${
      active === id ? "bg-white shadow" : "text-gray-600 hover:text-black"
    }`}
  >
    {children}
  </button>
);

export default Appointments;
