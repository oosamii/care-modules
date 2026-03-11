import React, { useState, useEffect } from "react";

const VitalsCapture = () => {
  const [patients] = useState([
    {
      token: "T-104",
      name: "Michael Ross",
      age: 45,
      gender: "M",
      doctor: "Dr. S. Gupta",
      status: "pending",
    },
    {
      token: "T-105",
      name: "Linda Ray",
      age: 58,
      gender: "F",
      doctor: "Dr. S. Gupta",
      status: "pending",
    },
    {
      token: "T-106",
      name: "David Chen",
      age: 28,
      gender: "M",
      doctor: "Dr. S. Gupta",
      status: "pending",
    },
    {
      token: "T-102",
      name: "Robert Wilson",
      age: 62,
      gender: "M",
      doctor: "Dr. S. Gupta",
      status: "done",
    },
  ]);

  const [selectedPatient, setSelectedPatient] = useState(patients[0]);

  const [vitals, setVitals] = useState({
    height: 175,
    weight: 78,
    bmi: "",
    temp: 98.6,
    pulse: 72,
    bp: "120/80",
    spo2: 98,
    resp: 16,
    complaint: "",
  });

  const history = [
    {
      date: "12 Oct 2023",
      temp: "98.4 °F",
      pulse: "74 bpm",
      bp: "122/80",
      spo2: "99%",
      weight: "78 kg",
      recorded: "Nurse A. Smith",
    },
    {
      date: "10 Jan 2023",
      temp: "98.6 °F",
      pulse: "72 bpm",
      bp: "118/78",
      spo2: "99%",
      weight: "76 kg",
      recorded: "Nurse A. Smith",
    },
  ];

  useEffect(() => {
    const h = vitals.height / 100;
    if (vitals.height && vitals.weight) {
      const bmi = (vitals.weight / (h * h)).toFixed(1);
      setVitals((prev) => ({ ...prev, bmi }));
    }
  }, [vitals.height, vitals.weight]);

  const handleChange = (field, value) => {
    setVitals({ ...vitals, [field]: value });
  };

  const clearForm = () => {
    setVitals({
      height: "",
      weight: "",
      bmi: "",
      temp: "",
      pulse: "",
      bp: "",
      spo2: "",
      resp: "",
      complaint: "",
    });
  };

  const bmiStatus = () => {
    if (!vitals.bmi) return "";

    if (vitals.bmi < 18.5) return "Underweight";
    if (vitals.bmi < 25) return "Normal";
    if (vitals.bmi < 30) return "Overweight";
    return "Obese";
  };

  const badgeColor = (status) => {
    if (status === "pending")
      return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Vitals Capture</h1>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT SIDEBAR */}
        <div className="bg-white rounded-xl border shadow-sm">

          <div className="p-4 border-b flex justify-between">
            <h2 className="font-semibold">Today's Patients</h2>
            <span className="text-blue-600 text-sm">12 Pending</span>
          </div>

          <div className="p-3">
            <input
              placeholder="Search token or patient..."
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>

            {patients.map((p, i) => (
              <div
                key={i}
                onClick={() => setSelectedPatient(p)}
                className={`p-4 border-t cursor-pointer ${
                  selectedPatient.token === p.token
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : ""
                }`}
              >

                <div className="flex items-center gap-3">

                  <div className="bg-gray-100 px-3 py-2 rounded">
                    {p.token}
                  </div>

                  <div>
                    <p className="font-medium">{p.name}</p>

                    <p className="text-sm text-gray-500">
                      {p.age} Y / {p.gender} • {p.doctor}
                    </p>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${badgeColor(
                        p.status
                      )}`}
                    >
                      {p.status === "pending"
                        ? "Vitals Pending"
                        : "Done"}
                    </span>
                  </div>
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* VITAL FORM */}
          <div className="bg-white rounded-xl border shadow-sm">

            <div className="p-4 border-b flex justify-between">

              <div>
                <h2 className="font-semibold text-lg">
                  {selectedPatient.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedPatient.age} Yrs • {selectedPatient.gender} • Token:{" "}
                  {selectedPatient.token}
                </p>
              </div>

              <div className="text-right text-sm">
                <p className="font-medium">
                  {selectedPatient.doctor}
                </p>
                <p className="text-gray-500">
                  General Medicine
                </p>
              </div>

            </div>

            <div className="p-5 space-y-4">

              {/* Height Weight BMI */}
              <div className="grid md:grid-cols-3 gap-4">

                <div>
                  <label className="text-sm text-gray-500">
                    Height (cm)
                  </label>

                  <input
                    value={vitals.height}
                    onChange={(e) =>
                      handleChange("height", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    Weight (kg)
                  </label>

                  <input
                    value={vitals.weight}
                    onChange={(e) =>
                      handleChange("weight", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    BMI
                  </label>

                  <div className="flex gap-2">
                    <input
                      value={vitals.bmi}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                    />

                    <span className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm">
                      {bmiStatus()}
                    </span>
                  </div>
                </div>

              </div>

              {/* Vitals Row */}
              <div className="grid md:grid-cols-5 gap-4">

                <div>
                  <label className="text-sm text-gray-500">
                    Temp (°F)
                  </label>
                  <input
                    value={vitals.temp}
                    onChange={(e) =>
                      handleChange("temp", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    Pulse
                  </label>
                  <input
                    value={vitals.pulse}
                    onChange={(e) =>
                      handleChange("pulse", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    BP
                  </label>
                  <input
                    value={vitals.bp}
                    onChange={(e) =>
                      handleChange("bp", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    SPO2
                  </label>
                  <input
                    value={vitals.spo2}
                    onChange={(e) =>
                      handleChange("spo2", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    Resp
                  </label>
                  <input
                    value={vitals.resp}
                    onChange={(e) =>
                      handleChange("resp", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

              </div>

              {/* Complaint */}
              <div>
                <label className="text-sm text-gray-500">
                  Chief Complaint (short)
                </label>

                <textarea
                  rows="3"
                  value={vitals.complaint}
                  onChange={(e) =>
                    handleChange("complaint", e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="E.g., Fever and mild cough since 2 days..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t">

                <button
                  onClick={clearForm}
                  className="px-4 py-2 border rounded-lg"
                >
                  Clear
                </button>

                <button className="px-4 py-2 bg-gray-200 rounded-lg">
                  Save Draft
                </button>

                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg">
                  Save & Mark Completed
                </button>

              </div>

            </div>

          </div>

          {/* HISTORY */}
          <div className="bg-white rounded-xl border shadow-sm">

            <div className="p-4 border-b">
              <h2 className="font-semibold">
                Vitals History
              </h2>
              <p className="text-sm text-gray-500">
                Last 5 visits
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Temp</th>
                    <th className="p-3 text-left">Pulse</th>
                    <th className="p-3 text-left">BP</th>
                    <th className="p-3 text-left">SPO2</th>
                    <th className="p-3 text-left">Weight</th>
                    <th className="p-3 text-left">Recorded By</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3">{h.date}</td>
                      <td className="p-3">{h.temp}</td>
                      <td className="p-3">{h.pulse}</td>
                      <td className="p-3">{h.bp}</td>
                      <td className="p-3">{h.spo2}</td>
                      <td className="p-3">{h.weight}</td>
                      <td className="p-3">{h.recorded}</td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default VitalsCapture;