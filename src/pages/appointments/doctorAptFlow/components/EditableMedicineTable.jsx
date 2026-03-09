import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash } from "lucide-react";
import toast from "react-hot-toast";
// import axiosInstance from "../../../../utils/axiosInstance"; // ❌ COMMENTED
// import axios from "axios"; // ❌ COMMENTED

const defaultRow = () => ({
  name: "",
  reason: "",
  dosage: "",
  frequency: { morning: false, afternoon: false, night: false },
  duration: "",
  notes: "",
});

const EditableMedicineTable = ({
  existingPrescription = [],
  onEditedChange,
  isToday,
}) => {
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEdited, setIsEdited] = useState(false);

  const inputRefs = useRef([]);

  // Notify parent when edited
  useEffect(() => {
    if (onEditedChange) onEditedChange(isEdited);
  }, [isEdited]);

  // Load existing data OR default rows
  useEffect(() => {
    if (Array.isArray(existingPrescription) && existingPrescription.length > 0) {
      setRows(existingPrescription);
    } else {
      setRows(Array.from({ length: 3 }, defaultRow));
    }
  }, [existingPrescription]);

  // =========================
  // 🔹 STATIC CHANGE HANDLERS
  // =========================

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
    setIsEdited(true);
  };

  const handleFrequencyChange = (index, freq, checked) => {
    const updated = [...rows];
    updated[index].frequency[freq] = checked;
    setRows(updated);
    setIsEdited(true);
  };

  const addRow = () => {
    setRows([...rows, defaultRow()]);
    setIsEdited(true);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
    setIsEdited(true);
  };

  // =========================
  // 🔹 VALIDATION
  // =========================

  const validateRows = () => {
    const newErrors = {};

    rows.forEach((row, index) => {
      const isEmpty =
        !row.name &&
        !row.dosage &&
        !row.duration &&
        !Object.values(row.frequency).some(Boolean);

      if (isEmpty) return;

      let rowErrors = {};

      if (!row.name) rowErrors.name = "Medicine name required";
      if (!row.dosage) rowErrors.dosage = "Dosage required";
      if (!Object.values(row.frequency).some(Boolean))
        rowErrors.frequency = "Select at least one";
      if (!row.duration) rowErrors.duration = "Duration required";

      if (Object.keys(rowErrors).length > 0) {
        newErrors[index] = rowErrors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // 🔹 STATIC SAVE
  // =========================

  const handleDone = () => {
    if (!validateRows()) {
      toast.error("Please fix validation errors.");
      return;
    }

    toast.success("Static Mode: Prescription Saved Locally");
    setIsEdited(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Prescribe Medicine</h2>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Medicine</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Dosage</th>
              <th className="p-3">Frequency</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Notes</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t">
                {/* Name */}
                <td className="p-2">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                    placeholder="Medicine name"
                    className="w-full border p-1 rounded"
                  />
                  {errors[index]?.name && (
                    <p className="text-red-500 text-xs">
                      {errors[index].name}
                    </p>
                  )}
                </td>

                {/* Reason */}
                <td className="p-2">
                  <input
                    type="text"
                    value={row.reason}
                    onChange={(e) =>
                      handleChange(index, "reason", e.target.value)
                    }
                    className="w-full border p-1 rounded"
                  />
                </td>

                {/* Dosage */}
                <td className="p-2">
                  <input
                    type="text"
                    value={row.dosage}
                    onChange={(e) =>
                      handleChange(index, "dosage", e.target.value)
                    }
                    className="w-full border p-1 rounded"
                  />
                  {errors[index]?.dosage && (
                    <p className="text-red-500 text-xs">
                      {errors[index].dosage}
                    </p>
                  )}
                </td>

                {/* Frequency */}
                <td className="p-2">
                  {["morning", "afternoon", "night"].map((freq) => (
                    <label key={freq} className="mr-2 text-xs">
                      <input
                        type="checkbox"
                        checked={row.frequency[freq]}
                        onChange={(e) =>
                          handleFrequencyChange(
                            index,
                            freq,
                            e.target.checked
                          )
                        }
                      />
                      {freq}
                    </label>
                  ))}
                </td>

                {/* Duration */}
                <td className="p-2">
                  <input
                    type="text"
                    value={row.duration}
                    onChange={(e) =>
                      handleChange(index, "duration", e.target.value)
                    }
                    className="w-full border p-1 rounded"
                  />
                </td>

                {/* Notes */}
                <td className="p-2">
                  <input
                    type="text"
                    value={row.notes}
                    onChange={(e) =>
                      handleChange(index, "notes", e.target.value)
                    }
                    className="w-full border p-1 rounded"
                  />
                </td>

                {/* Delete */}
                <td className="p-2 text-center">
                  <button
                    onClick={() => removeRow(index)}
                    className="text-red-500"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      {isToday && (
        <div className="flex justify-between">
          <button
            onClick={addRow}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded"
          >
            <Plus size={18} />
            Add Row
          </button>

          {isEdited && (
            <button
              onClick={handleDone}
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Save Prescription
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableMedicineTable;