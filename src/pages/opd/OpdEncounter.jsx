import React, { useState } from "react";
import { Clock, FileText, ExternalLink } from "lucide-react";

const OpdEncounter = () => {
  const [activeTab, setActiveTab] = useState("soap");

  const tabs = [
    "SOAP Note",
    "Diagnosis",
    "Orders",
    "Prescription",
    "Attachments",
    "Summary",
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col gap-6">

        <h1 className="text-2xl font-bold">OPD Encounter</h1>

      {/* HEADER */}
      <div className="bg-white rounded-xl border p-5">
        <div className="flex justify-between items-start">

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">Michael Ross</h2>

              <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600">
                Penicillin Allergy
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              UHID: P-98234 • 45 Yrs / Male • Last Visit: 12 Oct 2023
            </p>

            <div className="flex gap-8 mt-3 text-sm font-medium text-gray-700">
              <p>BP <span className="font-semibold">120/80</span></p>
              <p>TEMP <span className="font-semibold">98.6°F</span></p>
              <p>SPO2 <span className="font-semibold">98%</span></p>
              <p>PULSE <span className="font-semibold">72</span></p>
            </div>
          </div>

        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-8 border-b text-sm font-medium">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="col-span-8 bg-white border rounded-xl">

          <div className="border-b p-4 font-semibold">
            SOAP Note
          </div>

          <div className="p-5 flex flex-col gap-5">

            {/* Chief Complaint */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                CHIEF COMPLAINT
              </label>

              <textarea
                rows={2}
                className="w-full mt-2 border rounded-lg p-3 text-sm"
                defaultValue="Fever and mild cough since 2 days."
              />
            </div>

            {/* HPI */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                HISTORY OF PRESENT ILLNESS (HPI)
              </label>

              <textarea
                rows={4}
                className="w-full mt-2 border rounded-lg p-3 text-sm"
              />
            </div>

            {/* Examination */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                EXAMINATION
              </label>

              <textarea
                rows={4}
                className="w-full mt-2 border rounded-lg p-3 text-sm"
                defaultValue="Chest clear, throat mildly congested. No wheezing."
              />
            </div>

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-4 flex flex-col gap-6">

          {/* Past History */}
          <div className="bg-white border rounded-xl">
            <div className="border-b p-4 font-semibold flex items-center gap-2">
              <Clock size={16} />
              Past History
            </div>

            <div className="p-4 text-sm space-y-4">

              <div>
                <p className="text-gray-500 text-xs font-semibold">
                  CHRONIC CONDITIONS
                </p>
                <p>Hypertension, Type 2 Diabetes</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs font-semibold">
                  SURGICAL HISTORY
                </p>
                <p>Appendectomy (2015)</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs font-semibold">
                  FAMILY HISTORY
                </p>
                <p>Father: CAD</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs font-semibold">
                  SOCIAL HISTORY
                </p>
                <p>Non-smoker, Social drinker</p>
              </div>

            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white border rounded-xl">
            <div className="border-b p-4 font-semibold flex items-center gap-2">
              <FileText size={16} />
              Recent Reports
            </div>

            <div className="p-4 text-sm space-y-4">

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-600 font-medium">
                    Complete Blood Count
                  </p>
                  <p className="text-gray-500 text-xs">
                    12 Oct 2023 • Lab
                  </p>
                </div>

                <ExternalLink size={16} className="text-gray-400" />
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-end gap-3 pt-4 border-t">

        <button className="px-4 py-2 rounded-lg border text-red-600 border-red-300">
          Discard
        </button>

        <button className="px-4 py-2 rounded-lg border">
          Save Draft
        </button>

        <button className="px-4 py-2 rounded-lg border text-blue-600 border-blue-400">
          Send to Billing
        </button>

        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
          Sign & Complete
        </button>

      </div>
    </div>
  );
};

export default OpdEncounter;