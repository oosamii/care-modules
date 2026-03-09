import React, { useState } from "react";
import { Search, Stethoscope, Pill, Activity, Plus } from "lucide-react";
import AddDiagnosisModal from "./components/AddDiagnosisModal";
import AddPrescriptionModal from "./components/AddPrescriptionModal";

const EMR = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Electronic Medical Records
          </h1>
          <p className="text-gray-500 text-sm">
            Access and manage patient medical records
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Search patient..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Patient Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">John Doe</h2>
          <span className="px-3 py-1 text-sm bg-white rounded-full border">
            P001
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Age</p>
            <p className="font-semibold">45 years</p>
          </div>
          <div>
            <p className="text-gray-500">Gender</p>
            <p className="font-semibold">Male</p>
          </div>
          <div>
            <p className="text-gray-500">Blood Group</p>
            <p className="font-semibold">O+</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              Active
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">
            ⚠ Penicillin
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">
            ⚠ Peanuts
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
            Hypertension
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
            Type 2 Diabetes
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 flex-wrap">
        {[
          "Overview",
          "Diagnoses",
          "Prescriptions",
          "Vitals History",
          "Medical History",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === tab
                ? "bg-gray-200 text-gray-900 font-medium"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "Overview" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Diagnoses */}
            <div className="bg-white rounded-2xl border p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Stethoscope size={18} className="text-blue-600" />
                  <h3 className="font-semibold">Active Diagnoses</h3>
                </div>
                <button
                  onClick={() => setIsDiagnosisModalOpen(true)}
                  className="bg-blue-600 text-white p-2 rounded-lg"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="border rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">Hypertension</h4>
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                    moderate
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Essential hypertension, requires medication and lifestyle
                  changes
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>ICD: I10</span>
                  <span>2026-03-01</span>
                </div>
              </div>

              <div className="border rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">Type 2 Diabetes</h4>
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                    moderate
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Well controlled with medication and diet
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>ICD: E11</span>
                  <span>2025-12-15</span>
                </div>
              </div>
            </div>

            {/* Active Prescriptions */}
            <div className="bg-white rounded-2xl border p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Pill size={18} className="text-blue-600" />
                  <h3 className="font-semibold">Active Prescriptions</h3>
                </div>
                <button
                  onClick={() => setIsPrescriptionModalOpen(true)}
                  className="bg-blue-600 text-white p-2 rounded-lg"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="border rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <h4 className="font-semibold">Lisinopril</h4>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                    active
                  </span>
                </div>
                <p className="text-sm">Dosage: 10mg</p>
                <p className="text-sm">Frequency: Once daily</p>
                <p className="text-sm">Duration: 90 days</p>
                <p className="text-xs text-gray-500">
                  Prescribed on 2026-03-01 by Dr. Sarah Johnson
                </p>
              </div>

              <div className="border rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <h4 className="font-semibold">Metformin</h4>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                    active
                  </span>
                </div>
                <p className="text-sm">Dosage: 500mg</p>
                <p className="text-sm">Frequency: Twice daily</p>
                <p className="text-sm">Duration: 90 days</p>
                <p className="text-xs text-gray-500">
                  Prescribed on 2026-03-01 by Dr. Sarah Johnson
                </p>
              </div>
            </div>
          </div>

          <AddDiagnosisModal
            isOpen={isDiagnosisModalOpen}
            onClose={() => setIsDiagnosisModalOpen(false)}
            onSave={(data) => {
              console.log("Diagnosis Saved:", data);
            }}
          />

          <AddPrescriptionModal
  isOpen={isPrescriptionModalOpen}
  onClose={() => setIsPrescriptionModalOpen(false)}
  onSave={(data) => {
    console.log("Prescription Saved:", data);
  }}
/>

          {/* Recent Vitals */}
          <div className="bg-white rounded-2xl border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              <h3 className="font-semibold">Recent Vitals</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-red-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Blood Pressure</p>
                <p className="text-lg font-bold text-red-600">120/80</p>
                <p className="text-xs text-gray-500">2026-03-01</p>
              </div>

              <div className="bg-pink-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Heart Rate</p>
                <p className="text-lg font-bold text-pink-600">72 bpm</p>
                <p className="text-xs text-gray-500">2026-03-01</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Temperature</p>
                <p className="text-lg font-bold text-orange-600">98.6°F</p>
                <p className="text-xs text-gray-500">2026-03-01</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">O2 Saturation</p>
                <p className="text-lg font-bold text-blue-600">98%</p>
                <p className="text-xs text-gray-500">2026-03-01</p>
              </div>

              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Weight</p>
                <p className="text-lg font-bold text-green-600">175 lbs</p>
                <p className="text-xs text-gray-500">2026-03-01</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EMR;
