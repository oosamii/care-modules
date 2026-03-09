import React, { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../../../constants/axiosInstance";

const PrescribeTests = ({
  id,
  isToday,
  fetchPrescriptionById,
  prescribedTests,
  fetchAppointment,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockTests = [
    { text: "Complete Blood Count", loinc: "57021-8" },
    { text: "Liver Function Test", loinc: "24323-8" },
    { text: "Thyroid Panel", loinc: "24362-6" },
  ];

  const fetchSuggestions = async (value) => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://clinicaltables.nlm.nih.gov/api/loinc_items/v3/search?terms=${value}&df=text,LOINC_NUM`,
      );

      const data = await res.json();

      setSuggestions(mockTests);
    } catch (err) {
      console.error("Error fetching LOINC data:", err);
      setSuggestions(mockTests);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = () => {
    if (selectedTest) {
      setTests((prev) => {
        const exists = prev.some((t) => t.loinc === selectedTest.loinc);
        if (exists) {
          toast.error("Test already added");
          return prev;
        }
        return [...prev, selectedTest];
      });
      setSelectedTest(null);
      setQuery("");
      setSuggestions([]);
    }
  };

  const handleSave = async () => {
    if (tests.length === 0) {
      toast.error("Select atleast one test");
      return;
    }

    // Existing tests from backend
    const existing =
      prescribedTests?.map((t) => ({
        name: t.name,
        code: t.code,
      })) || [];

    // Newly added tests
    const newTests = tests.map((t) => ({
      name: t.text,
      code: t.loinc,
    }));

    // Merge + remove duplicates
    const merged = [...existing, ...newTests].filter(
      (test, index, self) =>
        index === self.findIndex((t) => t.code === test.code),
    );

    try {
      const { data } = await axiosInstance.put(`/opd/visits/update/${id}`, {
        medical_tests: merged,
      });

      if (data.success) {
        toast.success("Tests saved successfully");

        setTests([]);
        setQuery("");
        setSelectedTest(null);

        fetchPrescriptionById?.();
        fetchAppointment();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save tests");
    }
  };

  const handleRemovePrescribed = async (code) => {
    try {
      const { data } = await axiosInstance.patch(
        `/opd/visits/remove-test/${id}`,
        {
          test_code: code,
        },
      );

      if (data.success) {
        toast.success("Test removed");

        fetchPrescriptionById?.();
        fetchAppointment();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove test");
    }
  };

  const handleRemoveLocal = (index) => {
    setTests((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-10">
      {prescribedTests?.length > 0 && (
        <div>
          <h2 className="font-semibold text-primary">Prescribed Tests</h2>

          {prescribedTests?.map((test, index) => (
            <li key={index} className="flex gap-4 items-center text-sm">
              <span>{test.name}</span>

              {isToday && (
                <button
                  onClick={() => handleRemovePrescribed(test.code)}
                  className="text-red-500 text-xs hover:text-red-700"
                >
                  X
                </button>
              )}
            </li>
          ))}
        </div>
      )}

      {/* Only show for today */}
      {isToday && (
        <div className="space-y-3">
          <h2 className="font-semibold">Prescribe Tests</h2>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            placeholder="Search Test"
            className="border rounded-md px-2 py-2 w-full text-xs"
          />

          {loading && <p className="text-xs text-gray-400">Loading...</p>}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <ul className="border rounded-md shadow-md max-h-40 overflow-y-auto">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedTest(item);
                    setQuery(item.text);
                    setSuggestions([]);
                  }}
                  className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {item.text} ({item.loinc})
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleAddTest}
            disabled={!selectedTest}
            className="bg-blue-500 text-white px-3 py-1 rounded-md disabled:opacity-50"
          >
            Add Test
          </button>

          {/* Local Tests */}
          {tests.length > 0 && (
            <ul>
              {tests.map((t, i) => (
                <li key={i} className="flex gap-4 items-center">
                  {t.text} ({t.loinc})
                  <button
                    onClick={() => handleRemoveLocal(i)}
                    className="text-red-500 text-xs"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          )}

          {tests.length > 0 && (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Save (Static)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PrescribeTests;
