import { Search, X } from "lucide-react";
import React, { useState } from "react";

const MedicineModal = ({
  isOpen,
  onClose,
  onConfirm,
  formData,
  onChange,
  handleFrequencyChange,
}) => {
  const [errors, setErrors] = useState({});
  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Medicine name is required.";
    if (!formData.reason) newErrors.reason = "Reason is required.";
    if (!formData.dosage) newErrors.dosage = "Dosage is required.";
    if (!Object.values(formData.frequency).some(Boolean))
      newErrors.frequency = "Select at least one frequency.";
    if (!formData.duration) newErrors.duration = "Duration is required.";
    if (!formData.notes) newErrors.notes = "Notes are required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-sm space-y-3">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-lg">Add Medicine</h2>
          <X strokeWidth={1.25} onClick={onClose} className="cursor-pointer" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm">Name of Medicine</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter medicine name"
                className="px-4 py-2 w-full placeholder:text-xs text-sm border border-[#C8CED8] rounded-md pr-10 outline-none"
              />
              <Search
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm">Reason</label>
            <div className="relative">
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={onChange}
                placeholder="Enter reason for this medicine"
                className="px-4 py-2 w-full placeholder:text-xs text-sm border border-[#C8CED8] rounded-md pr-10 outline-none"
              />
              <Search
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            {errors.reason && (
              <p className="text-xs text-red-500">{errors.reason}</p>
            )}
          </div>

          {/* Dosage */}
          <div className="space-y-1">
            <label className="text-sm">Dosage</label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={onChange}
              placeholder="e.g., 500mg"
              className="px-4 py-2 w-full border border-[#C8CED8] rounded-md placeholder:text-xs text-sm outline-none"
            />
            {errors.dosage && (
              <p className="text-xs text-red-500">{errors.dosage}</p>
            )}
          </div>

          {/* Frequency */}
          <div className="space-y-1">
            <label className="text-sm">Frequency</label>
            <div className="flex gap-3 text-sm">
              {["morning", "afternoon", "night"].map((freq) => (
                <label key={freq} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.frequency[freq]}
                    onChange={(e) =>
                      handleFrequencyChange(freq, e.target.checked)
                    }
                  />
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </label>
              ))}
            </div>
            {errors.frequency && (
              <p className="text-xs text-red-500">{errors.frequency}</p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <label className="text-sm">
              Duration <span className="text-gray-400 text-xs">(Days)</span>
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={onChange}
              placeholder="e.g., 5 days"
              className="px-4 py-2 w-full border border-[#C8CED8] rounded-md placeholder:text-xs text-sm outline-none"
            />
            {errors.duration && (
              <p className="text-xs text-red-500">{errors.duration}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-sm">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={onChange}
              placeholder="Optional instructions..."
              className="w-full px-4 py-2 border border-[#C8CED8] rounded-md placeholder:text-xs text-sm outline-none"
            />
            {errors.notes && (
              <p className="text-xs text-red-500">{errors.notes}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm w-full hover:bg-primary/80"
            >
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineModal;
