import React, { useEffect, useState } from "react";
import {
  Mic,
  Volume2,
  Stethoscope,
  FileText,
  ExternalLink,
} from "lucide-react";
import axiosInstance from "../../constants/axiosInstance";
import toast from "react-hot-toast";

const TokenQueue = () => {
  const todayDate = new Date().toISOString().split("T")[0];

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  const [queueDate, setQueueDate] = useState(todayDate);

  const [formData, setFormData] = useState({
    department_id: "",
    doctor_id: "",
  });

  const statusStyles = {
    waiting: "bg-yellow-100 text-yellow-700",
    called: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };

  /* ---------------- FETCH DEPARTMENTS ---------------- */

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get("/departments/findAll", {
        params: { page: 1, limit: 50 },
      });

      const activeDepartments =
        (res?.data?.data || []).filter((d) => d.is_active) || [];

      setDepartments(activeDepartments);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  /* ---------------- FETCH DOCTORS ---------------- */

  const fetchDoctors = async () => {
    if (!formData?.department_id) {
      setDoctors([]);
      return;
    }

    try {
      const roleId = "10c1a68c-e644-4f9c-bbe4-05d0f83a79c0";
      const deptId = formData.department_id;

      const res = await axiosInstance.get(
        `/hospital/users/by-role/${roleId}/by-department/${deptId}`
      );

      const doctorList = res?.data?.data?.data || [];

      setDoctors(Array.isArray(doctorList) ? doctorList : []);
    } catch (error) {
      console.log(error);
      setDoctors([]);
      toast.error("Failed to fetch doctors");
    }
  };

  /* ---------------- FETCH QUEUE ---------------- */

  const fetchQueue = async () => {
    if (!formData?.doctor_id) {
      setTokens([]);
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.get("/opd/queue/list", {
        params: {
          queue_type: "doctor",
          queue_ref_id: formData.doctor_id,
          queue_date: queueDate,
        },
      });

      const queueData = res?.data?.data?.data || [];

      setTokens(queueData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch queue");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HANDLE CHANGE ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department_id" && { doctor_id: "" }),
    }));
  };

  /* ---------------- RESET FILTERS ---------------- */

  const handleResetFilters = () => {
    setFormData({
      department_id: "",
      doctor_id: "",
    });

    setQueueDate(todayDate);
    setTokens([]);
  };

  /* ---------------- WAIT TIME ---------------- */

  const getWaitTime = (time) => {
    const diff = Math.floor((new Date() - new Date(time)) / 60000);
    return `${diff} mins`;
  };

  /* ---------------- USE EFFECTS ---------------- */

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [formData.department_id]);

  useEffect(() => {
    if (formData.doctor_id) fetchQueue();
  }, [formData.doctor_id, queueDate]);

  const selectedDoctor = doctors.find((d) => d.id === formData.doctor_id);

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-4">Token Queue</h1>

      {/* Next Token Card */}
      <div className="border rounded-lg p-4 bg-white flex items-center justify-between mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Mic className="text-blue-600" />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Selected Doctor: <b>{selectedDoctor?.full_name || "Select Doctor"}</b>
            </p>

            {tokens.length > 0 && (
              <p className="text-sm font-semibold mt-2">
                Next Token: {tokens[0]?.token_code} —{" "}
                {tokens[0]?.patient?.first_name} {tokens[0]?.patient?.last_name}
                <span className="text-gray-500 text-sm ml-2">
                  (Waiting {getWaitTime(tokens[0]?.createdAt)})
                </span>
              </p>
            )}
          </div>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-xs rounded-md hover:bg-blue-700">
          <Volume2 size={18} />
          Confirm & Call Next
        </button>
      </div>

      {/* Filters */}

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-wrap gap-3 text-xs">
        {/* Search */}
        <input
          placeholder="Search token or patient..."
          className="border px-3 py-2 rounded-md w-60"
        />

        {/* Date Picker */}
        <input
          type="date"
          value={queueDate}
          onChange={(e) => setQueueDate(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />

        {/* Department */}
        <select
          name="department_id"
          value={formData.department_id}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md"
        >
          <option value="">Select Department</option>

          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        {/* Doctor */}
        <select
          name="doctor_id"
          value={formData.doctor_id}
          onChange={handleChange}
          disabled={!formData.department_id}
          className="border px-3 py-2 rounded-md"
        >
          <option value="">Select Doctor</option>

          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.full_name ||
                `${doc.first_name || ""} ${doc.last_name || ""}`}
            </option>
          ))}
        </select>

        {/* Apply Button */}
        <button
          onClick={fetchQueue}
          className="bg-blue-600 text-white px-4 rounded-md"
        >
          Apply
        </button>

        {/* Reset Button */}
        <button
          onClick={handleResetFilters}
          className="bg-gray-200 text-gray-700 px-4 rounded-md hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Table */}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left p-3">TOKEN</th>
              <th className="text-left p-3">PATIENT</th>
              <th className="text-left p-3">ARRIVED AT</th>
              <th className="text-left p-3">WAIT TIME</th>
              <th className="text-left p-3">DOCTOR</th>
              <th className="text-left p-3">STATUS</th>
              <th className="text-left p-3">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-6">
                  Loading queue...
                </td>
              </tr>
            ) : tokens.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-400">
                  No tokens in queue
                </td>
              </tr>
            ) : (
              tokens.map((t) => (
                <tr key={t.id} className="border-t text-xs">
                  <td className="p-3 font-semibold">{t.token_code}</td>

                  <td className="p-3">
                    {t.patient?.first_name} {t.patient?.last_name}
                    <span className="ml-2 text-gray-500 text-xs">
                      ({t.patient?.gender})
                    </span>
                  </td>

                  <td className="p-3">
                    {new Date(t.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="p-3">{getWaitTime(t.createdAt)}</td>

                  <td className="p-3">{selectedDoctor?.full_name || ""}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyles[t.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="p-3 flex gap-4 text-blue-600">
                    {t.status === "waiting" && (
                      <>
                        <button className="flex items-center gap-1 hover:underline">
                          <Volume2 size={16} /> Call
                        </button>

                        <button className="flex items-center gap-1 hover:underline">
                          <Stethoscope size={16} /> Encounter
                        </button>
                      </>
                    )}

                    {t.status === "called" && (
                      <button className="flex items-center gap-1 hover:underline">
                        <ExternalLink size={16} /> Open Encounter
                      </button>
                    )}

                    {t.status === "completed" && (
                      <button className="flex items-center gap-1 hover:underline">
                        <FileText size={16} /> Summary
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenQueue;