import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axiosInstance from "../../../constants/axiosInstance";
import toast from "react-hot-toast";

const AddAppointmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [patientPhone, setPatientPhone] = useState("");
  const [patientResults, setPatientResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    service_code: "",
    department_id: "",
    date: "",
    time: "",
    chief_complaint: "",
  });

  const [errors, setErrors] = useState({});

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      fetchDepartments();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && formData?.department_id) {
      fetchDoctors();
    }
  }, [formData?.department_id, isOpen]);

  const fetchDoctors = async () => {
    if (!formData?.department_id) {
      setDoctors([]);
      return;
    }

    try {
      const roleId = "10c1a68c-e644-4f9c-bbe4-05d0f83a79c0";
      const deptId = formData.department_id;

      const res = await axiosInstance.get(
        `/hospital/users/by-role/${roleId}/by-department/${deptId}`,
      );

      const doctorList = res?.data?.data?.data || [];

      setDoctors(Array.isArray(doctorList) ? doctorList : []);
    } catch (error) {
      console.log(error);
      setDoctors([]);
      toast.error("Failed to fetch doctors");
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get("/pricing/service-codes", {
        params: {
          service_category: "opd",
          is_active: true,
        },
      });

      setServices(res?.data?.data || []);
    } catch {
      toast.error("Failed to fetch services");
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get("/departments/findAll", {
        params: { page: 1, limit: 10 },
      });

      const activeDepartments =
        (res?.data?.data?.data || []).filter((d) => d.is_active) || [];

      setDepartments(activeDepartments);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  const searchPatient = async (phone) => {
    try {
      const res = await axiosInstance.get("/patients/search/phone", {
        params: { phone },
      });

      setPatientResults(res?.data?.data || []);
      setShowDropdown(true);
    } catch {
      setPatientResults([]);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (patientPhone.length >= 3) {
        searchPatient(patientPhone);
      } else {
        setPatientResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [patientPhone]);

  const handleSelectPatient = (patient) => {
    setFormData((prev) => ({
      ...prev,
      patient_id: patient.id,
    }));

    setPatientPhone(`${patient.first_name} ${patient.last_name}`);
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department_id" ? { doctor_id: "" } : {}),
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.patient_id) newErrors.patient_id = "Patient is required";

    if (!formData.doctor_id) newErrors.doctor_id = "Doctor is required";

    if (!formData.service_code) newErrors.service_code = "Service is required";

    if (!formData.department_id)
      newErrors.department_id = "Department is required";

    if (!formData.date) newErrors.date = "Date is required";

    if (!formData.time) newErrors.time = "Time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const visit_date = new Date(
        `${formData.date}T${formData.time}`,
      ).toISOString();

      const payload = {
        patient_id: formData.patient_id,
        doctor_id: formData.doctor_id,
        service_code: formData.service_code,
        department_id: formData.department_id,
        visit_date,
        chief_complaint: formData.chief_complaint,
        status: "pending",
      };

      await axiosInstance.post("/opd/visits/create", payload);

      toast.success("Appointment created");

      setFormData({
        patient_id: "",
        doctor_id: "",
        service_code: "",
        department_id: "",
        date: "",
        time: "",
        chief_complaint: "",
      });

      setPatientPhone("");
      setPatientResults([]);

      onSuccess?.();
      onClose();
    } catch {
      toast.error("Failed to create appointment");
    }
  };

  if (!isOpen) return null;

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">New Appointment</h2>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        <div className="overflow-y-auto px-6 py-4 space-y-4 text-xs">
          {/* Patient Search */}
          <div className="relative">
            <label className="text-sm">Search Patient (Phone)</label>
            <input
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Enter phone..."
            />

            {showDropdown && patientResults.length > 0 && (
              <div className="absolute z-50 bg-white border w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {patientResults.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <p className="font-medium">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{patient.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Department */}
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
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
            className="w-full border rounded-lg p-2"
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

          {/* Service */}
          <select
            name="service_code"
            value={formData.service_code}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Service</option>
            {services.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />

          {/* Time */}
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />

          {/* Chief Complaint */}
          <div>
            <label className="text-sm">Reason for Visit</label>
            <textarea
              name="chief_complaint"
              value={formData.chief_complaint}
              onChange={handleChange}
              placeholder="Enter the reason..."
              className="w-full border rounded-lg p-2 mt-1"
            />
            {errors.chief_complaint && (
              <p className="text-red-500 text-xs mt-1">
                {errors.chief_complaint}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="border px-4 py-2 rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
