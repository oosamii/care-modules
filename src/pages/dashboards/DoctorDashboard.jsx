import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Activity,
  Users,
  AlertCircle,
  Info,
} from "lucide-react";

import StatCard from "../../components/StatCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../constants/axiosInstance";
import { useAuth } from "../../utils/AuthContext";
import toast from "react-hot-toast";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [appointmentFilter, setAppointmentFilter] = useState("Today");
  const [patientFilter, setPatientFilter] = useState("Today");

  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);

  const [appointmentCount, setAppointmentCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [pendingLabs, setPendingLabs] = useState(0);

  const today = new Date().toISOString().split("T")[0];

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
          page: 1,
          limit: 50,
          doctor_id: user?.id,
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

          age: age,
          gender: visit?.patient?.gender,

          status: visit.status,
        };
      });
      setAppointments(mapped);
      setAppointmentCount(visits.length);

      const todayVisits = mapped.filter((a) => a.date === today);
    } catch {
      toast.error("Failed to load appointments");
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axiosInstance.get("/patients/with-opd-visits", {
        params: {
          page: 1,
          limit: 1,
          doctor_id: user?.id,
        },
      });

      const total = res?.data?.data?.length || 0;

      setPatientCount(total);
    } catch {
      toast.error("Failed to fetch patients");
    }
  };

  const fetchLabResults = async () => {
    try {
      // const res = await axiosInstance.get("/lab/results/findAll", {
      //   params: {
      //     status: "pending",
      //   },
      // });
      // setPendingLabs(res?.data?.data?.total || 0);
    } catch {
      setPendingLabs(0);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    fetchAppointments();
  }, [appointmentFilter, user?.id]);

  useEffect(() => {
    fetchPatients();
    fetchLabResults();
  }, [patientFilter]);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Doctor Dashboard
        </h1>

        <p className="text-gray-500 text-xs">
          Welcome back, manage your patients and appointments
        </p>
      </div>

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
              {appointments
                // .filter((a) => a.date === today)
                .map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="py-3">{a.time}</td>
                    <td>{a.patient}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(a.status)}`}
                      >
                        {a.status}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() => navigate(`/aptDetails/${a.id}`)}
                        className="px-3 py-1 border rounded-md text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
      </div>

      {/* <div className="bg-white border rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-4">Patient Queue</h2>

        <table className="w-full text-xs">
          <thead className="text-left text-gray-500">
            <tr>
              <th className="py-2">Patient</th>
              <th>Age</th>
              <th>Condition</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {queue.map((p, i) => (
              <tr key={i} className="border-t">
                <td className="py-3">{p.name}</td>
                <td>{p.age}</td>
                <td>{p.condition}</td>

                <td>
                  <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
                    {p.status}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => navigate("/aptDetails")}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default DoctorDashboard;
