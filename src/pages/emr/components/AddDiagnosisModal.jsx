import React, { useState } from "react";
import { X } from "lucide-react";

const AddDiagnosisModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    condition: "",
    icdCode: "",
    severity: "",
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
    if (!formData.condition || !formData.icdCode || !formData.severity) {
      return alert("Please fill all fields");
    }

    onSave(formData);
    setFormData({
      condition: "",
      icdCode: "",
      severity: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-fadeIn">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">Add New Diagnosis</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Condition */}
          <div>
            <label className="text-sm text-gray-600">Condition</label>
            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter condition"
            />
          </div>

          {/* ICD Code */}
          <div>
            <label className="text-sm text-gray-600">ICD Code</label>
            <input
              type="text"
              name="icdCode"
              value={formData.icdCode}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter ICD code"
            />
          </div>

          {/* Severity */}
          <div>
            <label className="text-sm text-gray-600">Severity</label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select severity</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
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
            Save Diagnosis
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDiagnosisModal;