import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Plus,
  ChevronRight,
  ChevronLeft,
  Activity,
  Users,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import AddAppointmentModal from "./component/AddAppointmentModal";
import axiosInstance from "../../constants/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../../utils/AuthContext";

const Appointments = () => {
  const { user, permissions } = useAuth();
  const [loading, setLoading] = useState(false);
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
  const [selectedFilter, setSelectedFilter] = useState("Daily");
  const [appointmentFilter, setAppointmentFilter] = useState("Today");
  const [statsData, setStatsData] = useState({
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });

  const role = user?.role?.toLowerCase();

  const showDoctorFilter = ["front", "nurse", "billing"].some((r) =>
    role?.includes(r),
  );

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

  const fetchAppointments = async () => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, doctorId, fromDate, toDate]);

  const stats = useMemo(() => {
    return {
      today: appointments.filter((a) => a.date === today).length,
      scheduled: appointments.filter((a) => a.status === "open").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    };
  }, [appointments, today]);

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

  const timeSlots = useMemo(() => {
    const slots = [];

    for (let h = 9; h <= 20; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }

    return slots;
  }, []);

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
    fetchStatsData(appointmentFilter);
  }, [appointmentFilter]);

  const PageLoader = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {loading && <PageLoader />}

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
      {activeTab === "list" && (
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
      )}

      {/* STATS */}

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Appointments"
          value={
            statsData.scheduled + statsData.completed + statsData.cancelled
          }
          icon={<Calendar size={24} className="text-blue-500" />}
          filters={["Today", "Week", "Month"]}
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

      {/* TABS */}

      <div className="flex gap-3 bg-gray-100 p-1 rounded-lg w-fit">
        <TabButton id="today" active={activeTab} setActive={setActiveTab}>
          Today's Schedule
        </TabButton>
        <TabButton id="calendar" active={activeTab} setActive={setActiveTab}>
          Calendar View
        </TabButton>
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

      {activeTab === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CALENDAR */}
          <div className="lg:col-span-2 bg-white border rounded-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">Calendar View</h2>
              <span className="text-sm text-gray-500">{formatDate(today)}</span>
            </div>

            <div className="divide-y">
              {timeSlots.map((slot) => {
                const slotAppointments = appointments.filter((a) => {
                  if (a.date !== today) return false;

                  const [slotHour, slotMin] = slot.split(":");
                  const [appHour, appMin] = a.time.split(":");

                  const slotTime = Number(slotHour) * 60 + Number(slotMin);
                  const appTime = Number(appHour) * 60 + Number(appMin);

                  return appTime >= slotTime && appTime < slotTime + 30;
                });

                return (
                  <div key={slot} className="flex items-start">
                    {/* TIME */}
                    <div className="w-24 text-xs text-gray-500 p-4">
                      {formatTime(slot)}
                    </div>

                    {/* APPOINTMENTS */}
                    <div className="flex-1 p-2 space-y-2">
                      {slotAppointments.length === 0 && (
                        <div className="h-8"></div>
                      )}

                      {slotAppointments.map((a) => (
                        <div
                          key={a.id}
                          className={`rounded-lg p-3 text-sm border-l-4 ${
                            a.status === "completed"
                              ? "bg-gray-100 border-gray-400"
                              : a.status === "cancelled"
                                ? "bg-red-100 border-red-500"
                                : "bg-green-100 border-green-500"
                          }`}
                        >
                          <div className="flex justify-between">
                            <p className="font-medium">{a.patient}</p>
                            <span className="text-xs">
                              {formatTime(a.time)}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600">Dr. {a.doc}</p>

                          <p className="text-xs mt-1">{a.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">
            {/* Appointment List */}
            <div className="bg-white border rounded-xl p-4">
              <h3 className="font-semibold mb-3">Appointment List</h3>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {appointments
                  .filter((a) => a.date === today)
                  .map((a) => (
                    <div
                      key={a.id}
                      className="flex justify-between border rounded-lg p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{a.patient}</p>
                        <p className="text-xs text-gray-500">UHID</p>
                      </div>

                      <div className="text-right">
                        <p>{formatTime(a.time)}</p>

                        <span
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(
                            a.status,
                          )}`}
                        >
                          {a.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Doctor Slot Summary */}
            <div className="bg-white border rounded-xl p-4">
              <h3 className="font-semibold mb-3">Doctors List</h3>

              <div className="space-y-3 text-sm">
                {doctors.slice(0, 3).map((doc) => (
                  <div
                    key={doc.id}
                    className="flex justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{doc.full_name}</p>
                      <p className="text-xs text-gray-500">
                        {doc.department?.name}
                      </p>
                    </div>

                    {/* <div className="text-right text-xs">
                      <p className="text-green-600">Next Free</p>
                      <p>--</p>
                    </div> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
