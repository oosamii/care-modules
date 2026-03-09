import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../../../constants/axiosInstance";
import axios from "axios";

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
  id,
  fetchAppointment
}) => {
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEdited, setIsEdited] = useState(false);
  const [suggestions, setSuggestions] = useState({});
  const [loading, setLoading] = useState({});
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);

  const inputRefs = useRef([]);

  const handleChangeName = async (index, value) => {
    handleChange(index, "name", value);

    if (value.length > 2) {
      setLoading((prev) => ({ ...prev, [index]: true }));
      setActiveDropdownIndex(index);

      try {
        const { data } = await axios.get(
          "https://medicine.uur.co.in:4036/api/v1/medicines",
          { params: { q: value, limit: 20 } },
        );

        if (data.success) {
          setSuggestions((prev) => ({
            ...prev,
            [index]: data.data,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading((prev) => {
          const newLoad = { ...prev };
          delete newLoad[index];
          return newLoad;
        });
      }
    } else {
      setSuggestions((prev) => {
        const newSugg = { ...prev };
        delete newSugg[index];
        return newSugg;
      });
      setActiveDropdownIndex(null);
    }
  };

  const closeDropdown = () => {
    setActiveDropdownIndex(null);
    setSuggestions({});
  };

  useEffect(() => {
    if (onEditedChange) onEditedChange(isEdited);
  }, [isEdited]);

  useEffect(() => {
    inputRefs.current = rows.map(
      (_, i) => inputRefs.current[i] || React.createRef(),
    );
  }, [rows]);

  useEffect(() => {
    if (
      Array.isArray(existingPrescription) &&
      existingPrescription.length > 0
    ) {
      const formatted = existingPrescription.map((med) => {
        let freq = { morning: false, afternoon: false, night: false };

        if (med.dose) {
          const [m, a, n] = med.dose.split("-").map(Number);
          freq = {
            morning: m === 1,
            afternoon: a === 1,
            night: n === 1,
          };
        }

        return {
          name: med.name || "",
          duration: med.duration_days || "",
          frequency: freq,
          reason: "",
          dosage: "",
          notes: "",
        };
      });

      setRows(formatted);
    } else {
      setRows([defaultRow()]);
    }
  }, [existingPrescription]);

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
      if (!Object.values(row.frequency).some(Boolean))
        rowErrors.frequency = "Select at least one";
      if (!row.duration) rowErrors.duration = "Duration required";

      if (Object.keys(rowErrors).length > 0) newErrors[index] = rowErrors;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getDose = (frequency) => {
    const m = frequency.morning ? 1 : 0;
    const a = frequency.afternoon ? 1 : 0;
    const n = frequency.night ? 1 : 0;
    return `${m}-${a}-${n}`;
  };

  const handleDone = async () => {
    if (!validateRows()) {
      toast.error("Please fix validation errors.");
      return;
    }

    const prescription = rows
      .filter((row) => row.name)
      .map((row) => ({
        name: row.name,
        dose: getDose(row.frequency),
        duration_days: parseInt(row.duration) || 1,
      }));

    try {
      const { data } = await axiosInstance.put(`/opd/visits/update/${id}`, {
        prescription,
      });

      if (data.success) {
        toast.success("Prescription updated");
        setIsEdited(false);
        fetchAppointment()
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save prescription");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Prescription</h2>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 font-medium">Medicine</th>
              <th className="p-3 font-medium">Frequency</th>
              <th className="p-3 font-medium w-32">Duration</th>
              <th className="p-3 text-center font-medium w-16">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 transition">
                {/* Medicine */}

                <td className="p-3 relative">
                  <input
                    ref={inputRefs.current[index]}
                    type="text"
                    value={row.name}
                    onChange={(e) => handleChangeName(index, e.target.value)}
                    onBlur={() => setTimeout(closeDropdown, 200)}
                    placeholder="Search medicine..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {errors[index]?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[index].name}
                    </p>
                  )}

                  {activeDropdownIndex === index && (
                    <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-full max-h-56 overflow-y-auto z-50">
                      {loading[index] ? (
                        <div className="p-3 text-sm text-gray-500">
                          Loading...
                        </div>
                      ) : suggestions[index]?.length > 0 ? (
                        suggestions[index].map((med) => (
                          <div
                            key={med._id}
                            onClick={() => {
                              handleChange(index, "name", med.officialName);
                              closeDropdown();
                            }}
                            className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                          >
                            {med.officialName}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-500">
                          No medicines
                        </div>
                      )}
                    </div>
                  )}
                </td>

                {/* Frequency */}

                <td className="p-3">
                  <div className="flex gap-2 flex-wrap justify-center">
                    {[
                      { key: "morning", label: "Morning" },
                      { key: "afternoon", label: "Afternoon" },
                      { key: "night", label: "Night" },
                    ].map((freq) => (
                      <button
                        key={freq.key}
                        type="button"
                        onClick={() =>
                          handleFrequencyChange(
                            index,
                            freq.key,
                            !row.frequency[freq.key],
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
                          ${
                            row.frequency[freq.key]
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                          }
                        `}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>

                  {errors[index]?.frequency && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[index].frequency}
                    </p>
                  )}
                </td>

                {/* Duration */}

                <td className="p-3">
                  <input
                    type="number"
                    value={row.duration}
                    onChange={(e) =>
                      handleChange(index, "duration", e.target.value)
                    }
                    placeholder="Days"
                    className="w-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {errors[index]?.duration && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[index].duration}
                    </p>
                  )}
                </td>

                {/* Delete */}

                <td className="p-3 text-center">
                  <button
                    onClick={() => removeRow(index)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isToday && (
        <div className="flex justify-between pt-2">
          <button
            onClick={addRow}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm shadow"
          >
            <Plus size={18} />
            Add Medicine
          </button>

          {isEdited && (
            <button
              onClick={handleDone}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm shadow"
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
