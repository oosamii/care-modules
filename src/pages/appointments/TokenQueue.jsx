import React, { useEffect, useState } from "react";
import { Mic, Volume2, FileText } from "lucide-react";
import axiosInstance from "../../constants/axiosInstance";
import toast from "react-hot-toast";
import { formatDate } from "../../constants";

const TokenQueue = () => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queueDate, setQueueDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dropdownDoctors, setDropdownDoctors] = useState([]);
  const [formData, setFormData] = useState({
    department_id: "",
    doctor_id: "",
  });

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get("/departments/findAll", {
        params: { page: 1, limit: 50 },
      });
      const activeDepartments = (res?.data?.data || []).filter(
        (d) => d.is_active,
      );
      setDepartments(activeDepartments);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  const fetchDoctors = async () => {
    if (!formData.department_id) {
      setDropdownDoctors([]);
      return;
    }
    try {
      const roleId = "10c1a68c-e644-4f9c-bbe4-05d0f83a79c0";
      const res = await axiosInstance.get(
        `/hospital/users/by-role/${roleId}/by-department/${formData.department_id}`,
      );
      setDropdownDoctors(res?.data?.data?.data || []);
    } catch (error) {
      console.log(error);
      setDropdownDoctors([]);
      toast.error("Failed to fetch doctors");
    }
  };

  const fetchQueue = async () => {
    try {
      setLoading(true);

      const useListAPI = !!formData.doctor_id; // only use list API if doctor is selected

      if (useListAPI) {
        // /opd/queue/list when doctor is selected
        const params = {
          queue_type: "doctor",
          queue_ref_id: formData.doctor_id, // doctor selected
          ...(queueDate && { queue_date: queueDate }),
          ...(searchText && { search: searchText }),
        };
        const res = await axiosInstance.get("/opd/queue/list", { params });
        setTokens(res?.data?.data?.tokens || []);
      } else {
        // /opd/queue/by-doctor when only date or token is selected
        const params = {};
        if (queueDate) params.queue_date = queueDate;
        if (searchText) params.search = searchText;

        const res = await axiosInstance.get("/opd/queue/by-doctor", { params });
        const doctorsData = res?.data?.data?.doctors || [];
        const allTokens = doctorsData.flatMap((doc) =>
          (doc.tokens || []).map((t) => ({
            ...t,
            doctor_name: doc.doctor_name,
          })),
        );
        setTokens(allTokens);
        setDoctors(doctorsData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch queue");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department_id" && { doctor_id: "" }),
    }));
  };

  const handleResetFilters = () => {
    setFormData({ department_id: "", doctor_id: "" });
    setQueueDate("");
    setSearchText("");
    fetchQueue();
  };

  const getWaitTime = (time) => {
    if (!time) return "-";
    const diff = Math.floor((new Date() - new Date(time)) / 60000);
    return `${diff} mins`;
  };

  useEffect(() => {
    fetchDepartments();
    fetchQueue();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [formData.department_id]);

  useEffect(() => {
    fetchQueue();
  }, [formData.doctor_id, queueDate, searchText]);

  const statusStyles = {
    waiting: "bg-yellow-100 text-yellow-700",
    in_progress: "bg-blue-100 text-blue-700",
    called: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Token Queue</h1>

      {selectedToken && (
        <div className="border rounded-lg p-4 bg-white flex items-center justify-between mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Mic className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                Selected Doctor: <b>{selectedToken.doctor_name}</b>
              </p>
              <p className="text-sm font-semibold mt-2">
                Token: {selectedToken.token_code} —{" "}
                {selectedToken.patient?.first_name}{" "}
                {selectedToken.patient?.last_name}
                <span className="text-gray-500 text-sm ml-2">
                  (Waiting {getWaitTime(selectedToken.createdAt)})
                </span>
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-xs rounded-md hover:bg-blue-700">
            <Volume2 size={18} /> Confirm & Call Next
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-wrap gap-3 text-xs">
        <input
          placeholder="Search token"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value.toUpperCase())}
          className="border px-3 py-2 rounded-md w-60"
        />
        <input
          type="date"
          value={queueDate}
          onChange={(e) => setQueueDate(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />
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
        <select
          name="doctor_id"
          value={formData.doctor_id}
          onChange={handleChange}
          disabled={!formData.department_id}
          className="border px-3 py-2 rounded-md"
        >
          <option value="">Select Doctor</option>
          {dropdownDoctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.full_name}
            </option>
          ))}
        </select>

        <button
          onClick={fetchQueue}
          className="bg-blue-600 text-white px-4 rounded-md"
        >
          Apply
        </button>
        <button
          onClick={handleResetFilters}
          className="bg-gray-200 text-gray-700 px-4 rounded-md hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left p-3">TOKEN</th>
              <th className="text-left p-3">PATIENT</th>
              <th className="text-left p-3">VISIT TIME</th>
              <th className="text-left p-3">DOCTOR</th>
              <th className="text-left p-3">STATUS</th>
              <th className="text-left p-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-6">
                  Loading queue...
                </td>
              </tr>
            ) : tokens.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-400">
                  No tokens in queue
                </td>
              </tr>
            ) : (
              tokens.map((t) => (
                <React.Fragment key={t.id}>
                  <tr
                    className="border-t text-xs cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      setSelectedToken(selectedToken?.id === t.id ? null : t)
                    }
                  >
                    <td className="p-3 font-semibold">{t.token_code}</td>
                    <td className="p-3">
                      {t.patient?.first_name} {t.patient?.last_name}
                      <span className="ml-2 text-gray-500 text-xs">
                        ({t.patient?.gender})
                      </span>
                    </td>
                    <td className="p-3">
                      {t.visit
                        ? new Date(t.visit.visit_date).toLocaleString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "short",
                          })
                        : "-"}
                    </td>
                    <td className="p-3">{t.doctor_name}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[t.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {t.status === "in_progress" ? "In Progress" : t.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-4 text-blue-600">
                      {t.status === "waiting" && (
                        <button className="flex items-center gap-1 hover:underline">
                          <Volume2 size={16} /> Call
                        </button>
                      )}
                      {t.status === "completed" && (
                        <button className="flex items-center gap-1 hover:underline">
                          <FileText size={16} /> Prescription
                        </button>
                      )}
                    </td>
                  </tr>
                  {selectedToken?.id === t.id && t.visit && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="p-3 text-xs text-gray-700">
                        <p>
                          <b>Visit Date:</b> {formatDate(t.visit.visit_date)}
                        </p>
                        <p>
                          <b>Service:</b> {t.visit.service_code}
                        </p>
                        {t.visit.chief_complaint && (
                          <p>
                            <b>Chief Complaint:</b> {t.visit.chief_complaint}
                          </p>
                        )}
                        {t.visit.diagnosis && (
                          <p>
                            <b>Diagnosis:</b> {t.visit.diagnosis}
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenQueue;
