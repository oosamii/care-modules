import AddVitalsModal from "../patients/components/AddVitalsModal";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Activity,
  Users,
  AlertCircle,
  Info,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import StatCard from "../../components/StatCard";
import axiosInstance from "../../constants/axiosInstance";
import { useAuth } from "../../utils/AuthContext";
import toast from "react-hot-toast";

const NurseDashboard = () => {
  const { user } = useAuth();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddVitalsModal, setShowAddVitalsModal] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);

  const [appointmentCount, setAppointmentCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [pendingLabs, setPendingLabs] = useState(0);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [appointmentFilter, setAppointmentFilter] = useState("today");
  const [statsData, setStatsData] = useState({
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });

  const today = new Date().toISOString().split("T")[0];

  const handleAddVitals = (apt) => {
    setSelectedPatient(apt);
    setShowAddVitalsModal(true);
  };

  const getDateRange = (filter) => {
    const now = new Date();
    let from = new Date();
    let to = new Date();

    if (filter === "Today") {
      from = now;
      to = new Date(now);
    }

    if (filter === "Week") {
      const day = now.getDay();
      from.setDate(now.getDate() - day);
      to = new Date(from);
      to.setDate(from.getDate() + 6);
    }

    if (filter === "Month") {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    to.setDate(to.getDate() + 1);

    return {
      from_date: from.toISOString().split("T")[0],
      to_date: to.toISOString().split("T")[0],
    };
  };

  const fetchAppointments = async () => {
    try {
      const range = getDateRange(appointmentFilter);

      const res = await axiosInstance.get("/opd/visits/findAll", {
        params: {
          page,
          limit,
          ...range,
        },
      });

      const visits = res?.data?.data?.data || [];
      const total = res?.data?.data?.total || visits.length;

      const mapped = visits.map((visit) => {
        const dateObj = new Date(visit.visit_date);
        const dob = new Date(visit?.patient?.dob);
        const age = new Date().getFullYear() - dob.getFullYear();

        return {
          id: visit.id,
          time: dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: dateObj.toISOString().split("T")[0],
          patient: `${visit?.patient?.first_name} ${visit?.patient?.last_name}`,
          phone: visit?.patient?.phone,
          age,
          gender: visit?.patient?.gender,
          status: visit.status,
          vitals: visit?.vitals || null,
        };
      });

      setAppointments(mapped);
      setAppointmentCount(total);
      setTotalPages(Math.ceil(total / limit));

      const todayQueue = mapped.filter(
        (a) => a.date === today && a.status !== "completed",
      );

      setQueue(todayQueue);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load appointments");
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axiosInstance.get("/patients/with-opd-visits", {
        params: {
          doctor_id: user?.id,
          page: 1,
          limit: 50,
        },
      });

      setPatientCount(res?.data?.data?.length || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch patients");
    }
  };

  const fetchLabResults = async () => {
    setPendingLabs(0);
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchAppointments();
  }, [appointmentFilter, page, user?.id]);

  useEffect(() => {
    fetchPatients();
    fetchLabResults();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-blue-100 text-blue-600";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "ongoing":
        return "bg-green-100 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

   const stats = useMemo(() => {
      return {
        today: appointments.filter((a) => a.date === today).length,
        scheduled: appointments.filter((a) => a.status === "open").length,
        completed: appointments.filter((a) => a.status === "completed").length,
        cancelled: appointments.filter((a) => a.status === "cancelled").length,
      };
    }, [appointments, today]);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Nurse Dashboard
        </h1>
        <p className="text-gray-500 text-xs">
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
          filters={["today", "week", "month", "quarter"]}
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

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Appointments</h2>

          <table className="w-full text-xs">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">Time</th>
                <th>Patient</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="py-3">{a.time}</td>

                  <td>{a.patient}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(
                        a.status,
                      )}`}
                    >
                      {a.status}
                    </span>
                  </td>

                  <td>
                    {a.vitals ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        Vitals Added
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddVitals(a)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-1"
                      >
                        <HeartPulse size={14} />
                        Add Vitals
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-end items-center mt-5 gap-4">
            <button
              className="border rounded-lg disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft />
            </button>

            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            <button
              className="border rounded-lg disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">System Alerts</h2>

          <div className="space-y-4">
            {pendingLabs > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="text-red-500" size={18} />
                  <div>
                    <p className="font-semibold">Lab Results Pending</p>
                    <p className="text-xs text-gray-500">
                      {pendingLabs} lab reports awaiting review
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex gap-2 items-start">
                <Info className="text-blue-500" size={18} />
                <div>
                  <p className="font-semibold">Appointments Today</p>
                  <p className="text-xs text-gray-500">
                    {appointments.filter((a) => a.date === today).length}{" "}
                    scheduled
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showAddVitalsModal && (
          <AddVitalsModal
            isOpen={showAddVitalsModal}
            onClose={() => setShowAddVitalsModal(false)}
            apt={selectedPatient}
            onUpdated={fetchAppointments}
          />
        )}
      </div>
    </div>
  );
};

export default NurseDashboard;
