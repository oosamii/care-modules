import React, { useState } from "react";
import { X } from "lucide-react";
import axiosInstance from "../../../constants/axiosInstance";
import toast from "react-hot-toast";

const AddVitalsModal = ({ isOpen, onClose, patient, onUpdated }) => {
  const [formData, setFormData] = useState({
    diagnosis: "",
    status: "ongoing",
    notes: "",
    bp: "",
    pulse: "",
    temperature_c: "",
    spo2: "",
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.diagnosis.trim())
      newErrors.diagnosis = "Diagnosis is required";

    if (!formData.bp.trim())
      newErrors.bp = "Blood Pressure is required";

    if (!formData.pulse)
      newErrors.pulse = "Pulse is required";

    if (!formData.temperature_c)
      newErrors.temperature_c = "Temperature is required";

    if (!formData.spo2)
      newErrors.spo2 = "SpO2 is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload = {
        diagnosis: formData.diagnosis,
        status: formData.status,
        notes: formData.notes,
        vitals: {
          bp: formData.bp,
          pulse: Number(formData.pulse),
          temperature_c: Number(formData.temperature_c),
          spo2: Number(formData.spo2),
        },
      };

      await axiosInstance.put(
        `/opd/visits/update/${patient.id}`,
        payload
      );

      toast.success("Visit updated successfully");
      onUpdated();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update visit");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Update Visit</h2>
          <X
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Diagnosis */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Diagnosis *</label>
            <input
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 text-xs"
            />
            {errors.diagnosis && (
              <p className="text-xs text-red-500">{errors.diagnosis}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 text-xs"
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* BP */}
          <div>
            <label className="text-sm text-gray-600">Blood Pressure *</label>
            <input
              name="bp"
              placeholder="120/80"
              value={formData.bp}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 text-xs"
            />
            {errors.bp && (
              <p className="text-xs text-red-500">{errors.bp}</p>
            )}
          </div>

          {/* Pulse */}
          <div>
            <label className="text-sm text-gray-600">Pulse *</label>
            <input
              type="number"
              name="pulse"
              value={formData.pulse}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 text-xs"
            />
            {errors.pulse && (
              <p className="text-xs text-red-500">{errors.pulse}</p>
            )}
          </div>

          {/* Temperature */}
          <div>
            <label className="text-sm text-gray-600">
              Temperature (°C) *
            </label>
            <input
              type="number"
              step="0.1"
              name="temperature_c"
              value={formData.temperature_c}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 text-xs"
            />
            {errors.temperature_c && (
              <p className="text-xs text-red-500">
                {errors.temperature_c}
              </p>
            )}
          </div>

          {/* SpO2 */}
          <div>
            <label className="text-sm text-gray-600">SpO2 (%) *</label>
            <input
              type="number"
              name="spo2"
              value={formData.spo2}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 text-xs"
            />
            {errors.spo2 && (
              <p className="text-xs text-red-500">{errors.spo2}</p>
            )}
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Notes</label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 text-xs"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVitalsModal;