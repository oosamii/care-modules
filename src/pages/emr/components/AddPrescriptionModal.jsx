import React, { useState } from "react";
import { X } from "lucide-react";

const AddPrescriptionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instruction: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const { medication, dosage, frequency, duration, instruction } = formData;

    if (!medication || !dosage || !frequency || !duration) {
      return alert("Please fill all required fields");
    }

    onSave(formData);

    setFormData({
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instruction: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">Add New Prescription</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Medication */}
          <div>
            <label className="text-sm text-gray-600">Medication *</label>
            <input
              type="text"
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              placeholder="Enter medication name"
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="text-sm text-gray-600">Dosage *</label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="e.g., 500mg"
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="text-sm text-gray-600">Frequency *</label>
            <input
              type="text"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              placeholder="e.g., Twice daily"
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm text-gray-600">Duration *</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 7 days"
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Instruction */}
          <div>
            <label className="text-sm text-gray-600">Instruction</label>
            <textarea
              name="instruction"
              value={formData.instruction}
              onChange={handleChange}
              placeholder="Additional instructions..."
              rows={3}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white"
          >
            Save Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPrescriptionModal;