import { useState } from "react";
import AddTemplateModal from "./opd_components/prescription/AddTemplateModal";

export default function Prescription() {
  const [openTemplateModal, setOpenTemplateModal] = useState(false);
  const [medicines, setMedicines] = useState([
    {
      name: "Amoxicillin",
      strength: "500mg • Tablet",
      frequency: "1-1-1 (TID)",
      duration: "5 Days",
      instruction: "After meals",
      allergy: true,
    },
    {
      name: "Paracetamol",
      strength: "650mg • Tablet",
      frequency: "1-0-1 (BID)",
      duration: "3 Days",
      instruction: "SOS for fever",
      allergy: false,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-semibold">E-Prescription</h1>

      {/* PATIENT HEADER */}
      <div className="bg-white border rounded-lg p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
            MR
          </div>

          <div>
            <div className="font-semibold">Michael Ross</div>
            <div className="text-xs text-gray-500">
              UHID: P-98234 • 45 yrs • Male
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-8 text-sm">
          <div>
            <div className="text-gray-500 text-xs">ALLERGIES</div>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
              Penicillin
            </span>
          </div>

          <div>
            <div className="text-gray-500 text-xs">VITALS SNAPSHOT</div>
            <div>BP 120/80 • HR 72 • Temp 98.6°F</div>
          </div>

          <div>
            <div className="text-gray-500 text-xs">LAST VISIT</div>
            <div>12 Oct 2023</div>
          </div>
        </div>
      </div>

      {/* PRESCRIPTION TABLE */}
      <div className="bg-white border rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b gap-3">
          <h3 className="font-semibold">Prescription Details</h3>

          <button
            onClick={() => setOpenTemplateModal(true)}
            className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm"
          >
            + Add Template
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 border-b text-left sticky top-0">
              <tr>
                <th className="p-3">Drug Name</th>
                <th className="p-3">Strength / Form</th>
                <th className="p-3">Frequency</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Instructions</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {medicines.map((med, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {med.name}

                    {med.allergy && (
                      <div className="text-xs text-red-500">
                        ⚠ Allergy Conflict
                      </div>
                    )}
                  </td>

                  <td className="p-3">{med.strength}</td>
                  <td className="p-3">{med.frequency}</td>
                  <td className="p-3">{med.duration}</td>
                  <td className="p-3">{med.instruction}</td>

                  <td className="p-3">
                    <button className="text-gray-400 hover:text-red-500">
                      🗑
                    </button>
                  </td>
                </tr>
              ))}

              {/* ADD MEDICINE ROW */}

              <tr className="bg-gray-50">
                <td className="p-3">
                  <input
                    placeholder="Search drug..."
                    className="border rounded px-2 py-1 w-full text-sm"
                  />
                </td>

                <td className="p-3">
                  <input
                    placeholder="e.g. 500mg Tab"
                    className="border rounded px-2 py-1 w-full text-sm"
                  />
                </td>

                <td className="p-3">
                  <select className="border rounded px-2 py-1 w-full text-sm">
                    <option>Select...</option>
                  </select>
                </td>

                <td className="p-3">
                  <input
                    placeholder="Qty / Days"
                    className="border rounded px-2 py-1 w-full text-sm"
                  />
                </td>

                <td className="p-3">
                  <input
                    placeholder="e.g. After meals"
                    className="border rounded px-2 py-1 w-full text-sm"
                  />
                </td>

                <td className="p-3">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SAFETY WARNING */}

      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm">
          <strong>Safety Warnings Detected</strong>
          <div>
            Allergy Conflict: Patient has a known allergy to Penicillin.
            Amoxicillin belongs to the Penicillin class.
          </div>
          <div>
            Interaction Warning: No severe drug-drug interactions detected.
          </div>
        </div>

        <button className="border border-red-300 px-3 py-1 rounded text-sm">
          Override
        </button>
      </div>

      {/* FOOTER ACTIONS */}

      <div className="flex flex-wrap gap-3">
        <button className="border px-4 py-2 rounded text-sm w-full sm:w-auto">
          Print
        </button>

        <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded text-sm w-full sm:w-auto">
          Send to Pharmacy
        </button>

        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto">
          Save Prescription
        </button>
      </div>

      <AddTemplateModal
        open={openTemplateModal}
        onClose={() => setOpenTemplateModal(false)}
      />
    </div>
  );
}
