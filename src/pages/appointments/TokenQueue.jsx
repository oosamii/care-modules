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
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    department_id: "",
    doctor_id: "",
  });

  const tokens = [
    {
      token: "T-104",
      patient: "Michael Ross",
      age: 45,
      gender: "M",
      arrived: "09:15 AM",
      wait: "24 mins",
      doctor: "Dr. S. Gupta",
      status: "Waiting",
    },
    {
      token: "T-105",
      patient: "Linda Ray",
      age: 58,
      gender: "F",
      arrived: "09:20 AM",
      wait: "19 mins",
      doctor: "Dr. S. Gupta",
      status: "Waiting",
      vip: true,
    },
  ];

  const statusStyles = {
    Waiting: "bg-yellow-100 text-yellow-700",
    "In Consult": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  /* ---------------- FETCH DEPARTMENTS ---------------- */

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get("/departments/findAll", {
        params: { page: 1, limit: 10 },
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

  /* ---------------- HANDLE CHANGE ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department_id" && { doctor_id: "" }),
    }));
  };

  /* ---------------- USE EFFECTS ---------------- */

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [formData.department_id]);

  return (
    <div className="bg-gray-50 min-h-screen">

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
              Selected Doctor: <b>Dr. S. Gupta (General Medicine)</b>
            </p>

            <p className="text-sm font-semibold mt-2">
              Next Token: T-104 — Michael Ross
              <span className="text-gray-500 text-sm ml-2">(Waiting 24 mins)</span>
            </p>
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

          {Array.isArray(doctors) &&
            doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.full_name ||
                  `${doc.first_name || ""} ${doc.last_name || ""}`}
              </option>
            ))}
        </select>

        <button className="bg-blue-600 text-white px-4 rounded-md">
          Apply
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
            {tokens.map((t, i) => (
              <tr key={i} className="border-t text-xs">

                <td className="p-3 font-semibold">{t.token}</td>

                <td className="p-3">
                  {t.patient} ({t.age} Y / {t.gender})

                  {t.vip && (
                    <span className="ml-2 text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded">
                      VIP
                    </span>
                  )}
                </td>

                <td className="p-3">{t.arrived}</td>

                <td className={`p-3 ${t.wait === "24 mins" ? "text-red-500" : ""}`}>
                  {t.wait}
                </td>

                <td className="p-3">{t.doctor}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[t.status]}`}
                  >
                    {t.status}
                  </span>
                </td>

                <td className="p-3 flex gap-4 text-blue-600">

                  {t.status === "Waiting" && (
                    <>
                      <button className="flex items-center gap-1 hover:underline">
                        <Volume2 size={16} /> Call Next
                      </button>

                      <button className="flex items-center gap-1 hover:underline">
                        <Stethoscope size={16} /> Encounter
                      </button>
                    </>
                  )}

                  {t.status === "In Consult" && (
                    <button className="flex items-center gap-1 hover:underline">
                      <ExternalLink size={16} /> Open Encounter
                    </button>
                  )}

                  {t.status === "Completed" && (
                    <button className="flex items-center gap-1 hover:underline">
                      <FileText size={16} /> Summary
                    </button>
                  )}

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default TokenQueue;