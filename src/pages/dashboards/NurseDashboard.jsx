import AddVitalsModal from "../patients/components/AddVitalsModal";
import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Activity,
  Users,
  AlertCircle,
  Info,
  HeartPulse
} from "lucide-react";

import StatCard from "../../components/StatCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../constants/axiosInstance";
import { useAuth } from "../../utils/AuthContext";
import toast from "react-hot-toast";

const NurseDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddVitalsModal, setShowAddVitalsModal] = useState(false);

  const [appointmentFilter, setAppointmentFilter] = useState("Today");
  const [patientFilter, setPatientFilter] = useState("Today");

  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);

  const [appointmentCount, setAppointmentCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [pendingLabs, setPendingLabs] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  const handleAddVitals = (patient) => {
    setSelectedPatient(patient);
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

    // 🔹 Add one day to `to` to include full day
    to.setDate(to.getDate() + 1);

    return {
      from_date: from.toISOString().split("T")[0],
      to_date: to.toISOString().split("T")[0],
    };
  };

  // ---------------- FETCH APPOINTMENTS ----------------
  const fetchAppointments = async () => {
    try {
      const range = getDateRange(appointmentFilter);
      const res = await axiosInstance.get("/opd/visits/findAll", {
        params: {
          page: 1,
          limit: 50,
          ...range,
        },
      });

      const visits = res?.data?.data?.data || [];
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
        };
      });

      setAppointments(mapped);
      setAppointmentCount(visits.length);

      // Update queue for patients waiting today
      const todayQueue = mapped.filter(
        (a) => a.date === today && a.status !== "completed",
      );
      setQueue(todayQueue);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load appointments");
    }
  };

  // ---------------- FETCH PATIENTS ----------------
  const fetchPatients = async () => {
    try {
      const range = getDateRange(patientFilter);
      const res = await axiosInstance.get("/patients/with-opd-visits", {
        params: {
          doctor_id: user?.id,
          page: 1,
          limit: 50,
          ...range,
        },
      });
      setPatientCount(res?.data?.data?.length || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch patients");
    }
  };

  // ---------------- FETCH LAB RESULTS ----------------
  const fetchLabResults = async () => {
    try {
      setPendingLabs(0);
    } catch {
      setPendingLabs(0);
    }
  };

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    if (!user?.id) return;
    fetchAppointments();
  }, [appointmentFilter, user?.id]);

  useEffect(() => {
    fetchPatients();
    fetchLabResults();
  }, [patientFilter]);

  // ---------------- FILTERED APPOINTMENTS ----------------
  const filteredAppointments = appointments.filter((a) => {
    if (appointmentFilter === "Today") return a.date === today;
    if (appointmentFilter === "Week") {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const aDate = new Date(a.date);
      return aDate >= start && aDate <= end;
    }
    if (appointmentFilter === "Month") {
      const aDate = new Date(a.date);
      return (
        aDate.getMonth() === new Date().getMonth() &&
        aDate.getFullYear() === new Date().getFullYear()
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Nurse Dashboard
        </h1>
        <p className="text-gray-500 text-xs">
          Welcome back, manage your patients and appointments
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Appointments"
          value={appointmentCount}
          icon={<Calendar size={24} className="text-blue-500" />}
          filters={["Today", "Week", "Month"]}
          selectedFilter={appointmentFilter}
          onFilterChange={setAppointmentFilter}
        />
        <StatCard
          title="Patient Queue"
          value={queue.length}
          icon={<Clock size={24} className="text-orange-500" />}
        />
        <StatCard
          title="Lab Results Pending"
          value={pendingLabs}
          icon={<Activity size={24} className="text-purple-500" />}
        />
        <StatCard
          title="Total Patients"
          value={patientCount}
          icon={<Users size={24} className="text-green-500" />}
          // filters={["Today", "Week", "Month"]}
          // selectedFilter={patientFilter}
          // onFilterChange={setPatientFilter}
        />
      </div>

      {/* APPOINTMENTS TABLE & ALERTS */}
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
              {filteredAppointments.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="py-3">{a.time}</td>
                  <td>{a.patient}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        a.status === "completed"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleAddVitals(a)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-1"
                    >
                      <HeartPulse size={14} />
                      Add Vitals
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SYSTEM ALERTS */}
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
          patient={selectedPatient}
          onUpdated={fetchAppointments}
        />
      )}
      </div>
    </div>
  );
};

export default NurseDashboard;
