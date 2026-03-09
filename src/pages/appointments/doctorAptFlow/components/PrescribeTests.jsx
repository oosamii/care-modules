import React, { useState } from "react";
import toast from "react-hot-toast";
// import axiosInstance from "../../../../utils/axiosInstance"; // ❌ COMMENTED

const PrescribeTests = ({
  id,
  fetchPData,
  isToday,
  doctorId,
  fetchPrescriptionById,
  prescribedTests,
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
        `https://clinicaltables.nlm.nih.gov/api/loinc_items/v3/search?terms=${value}&df=text,LOINC_NUM`
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
      setTests((prev) => [...prev, selectedTest]);
      setSelectedTest(null);
      setQuery("");
      setSuggestions([]);
    }
  };

  // ===============================
  // 🔹 SAVE (COMMENTED BACKEND)
  // ===============================

  const handleSave = async () => {
    if (tests.length === 0) {
      toast.error("Select atleast one test");
      return;
    }

    // const formattedTests = tests.map((t) => ({
    //   name: `${t.text} (${t.loinc})`,
    // }));

    // const reqBody = {
    //   appointment: id,
    //   patient: fetchPData.id,
    //   doctor: doctorId,
    //   tests: formattedTests,
    // };

    // try {
    //   const { data } = await axiosInstance.post(
    //     `/prescription/addTest`,
    //     reqBody
    //   );
    //   if (data?.success) {
    //     toast.success(data?.message);
    //     fetchPrescriptionById();
    //   }
    // } catch (error) {
    //   toast.error("Failed to save prescription");
    // }

    // 🔹 STATIC MODE
    toast.success("Test saved locally (Static Mode)");
  };

  // ===============================
  // 🔹 REMOVE (COMMENTED BACKEND)
  // ===============================

  const handleRemovePrescribed = async () => {
    // Backend delete commented

    // try {
    //   await axiosInstance.delete(`/prescription/deleteTest`, { data: {} });
    //   fetchPrescriptionById();
    // } catch (err) {
    //   toast.error("Failed to remove test");
    // }

    toast.success("Remove disabled (Static Mode)");
  };

  const handleRemoveLocal = (index) => {
    setTests((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-semibold text-primary">
          Prescribed Tests
        </h2>

        {[
          { _id: "1", name: "Complete Blood Count" },
          { _id: "2", name: "Liver Function Test" },
        ].map((test) => (
          <li key={test._id} className="flex gap-4 items-center text-sm">
            <span>{test.name}</span>
            <button
              onClick={handleRemovePrescribed}
              className="text-red-500 text-xs"
            >
              X
            </button>
          </li>
        ))}
      </div>

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

          {loading && (
            <p className="text-xs text-gray-400">Loading...</p>
          )}

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
            className="bg-primary text-white px-3 py-1 rounded-md disabled:opacity-50"
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