import { useState } from "react";

export default function OpdDocuments() {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
  });

  const documents = [
    {
      date: "12 Oct 2023 10:30 AM",
      type: "Lab Report",
      patient: "Michael Ross",
      uhid: "P-98234",
      uploadedBy: "System (Auto)",
      status: "Verified",
    },
    {
      date: "10 Oct 2023 09:15 AM",
      type: "Radiology Report",
      patient: "Michael Ross",
      uhid: "P-98234",
      uploadedBy: "Dr. Sarah Jenkins",
      status: "Verified",
    },
    {
      date: "08 Oct 2023 02:00 PM",
      type: "External Prescription",
      patient: "Jane Doe",
      uhid: "P-77412",
      uploadedBy: "Front Desk",
      status: "Pending Review",
    },
  ];

  const consents = [
    {
      date: "12 Oct 2023 10:45 AM",
      form: "General OPD Consent",
      patient: "Michael Ross",
      uhid: "P-98234",
      method: "OTP Capture",
      status: "Signed",
    },
    {
      date: "12 Oct 2023 10:40 AM",
      form: "Teleconsultation Consent",
      patient: "Jane Doe",
      uhid: "P-77412",
      method: "E-Sign",
      status: "Pending",
    },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const searchMatch =
      doc.patient.toLowerCase().includes(filters.search.toLowerCase()) ||
      doc.uhid.toLowerCase().includes(filters.search.toLowerCase());

    const typeMatch = !filters.type || doc.type === filters.type;

    return searchMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Documents & Consents</h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 bg-white border rounded-lg p-3 items-center">
        <input
          placeholder="Search patient..."
          className="border rounded px-3 py-2 text-sm w-full sm:w-72"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Document Types</option>
          <option value="Lab Report">Lab Report</option>
          <option value="Radiology Report">Radiology Report</option>
          <option value="External Prescription">External Prescription</option>
        </select>

        <select className="border rounded px-3 py-2 text-sm w-full sm:w-auto">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>Last 90 Days</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm w-full sm:w-auto">
          Apply
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-8 space-y-6">
          {/* DOCUMENT TABLE */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-sm">
                <thead className="bg-gray-50 border-b text-left">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Uploaded By</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDocuments.map((doc, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-3">{doc.date}</td>

                      <td className="p-3">{doc.type}</td>

                      <td className="p-3">
                        <div>{doc.patient}</div>
                        <div className="text-xs text-gray-500">{doc.uhid}</div>
                      </td>

                      <td className="p-3">{doc.uploadedBy}</td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            doc.status === "Verified"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>

                      <td className="p-3 flex gap-2 text-gray-500">
                        <button>👁</button>
                        <button>⬇</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CONSENT HISTORY */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-4 border-b font-semibold">Consent History</div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-gray-50 border-b text-left">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Consent Form</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {consents.map((c, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-3">{c.date}</td>

                      <td className="p-3">{c.form}</td>

                      <td className="p-3">
                        <div>{c.patient}</div>
                        <div className="text-xs text-gray-500">{c.uhid}</div>
                      </td>

                      <td className="p-3">{c.method}</td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            c.status === "Signed"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="p-3 text-gray-500">↗</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-4 space-y-6">
          {/* UPLOAD DOCUMENT */}
          <div className="bg-white border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Upload Document</h3>

            <div className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-gray-500">
              Click to upload or drag & drop
              <div className="text-xs">PDF, JPG, PNG (Max 5MB)</div>
            </div>

            <div>
              <label className="text-sm">Document Type</label>
              <select className="w-full border rounded px-3 py-2 text-sm mt-1">
                <option>Select type...</option>
              </select>
            </div>

            <div>
              <label className="text-sm">Notes (Optional)</label>
              <textarea
                rows="3"
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                placeholder="Add any relevant notes..."
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded text-sm">
              Upload Document
            </button>
          </div>

          {/* CAPTURE CONSENT */}
          <div className="bg-white border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Capture Consent</h3>

            <div className="space-y-2 text-sm">
              <label className="flex gap-2 items-center">
                <input type="checkbox" defaultChecked />
                General OPD Consent
              </label>

              <label className="flex gap-2 items-center">
                <input type="checkbox" />
                Teleconsultation Consent
              </label>

              <label className="flex gap-2 items-center">
                <input type="checkbox" />
                Minor Procedure Consent
              </label>
            </div>

            <div className="flex gap-4 text-sm">
              <label className="flex gap-1 items-center">
                <input type="radio" name="method" defaultChecked />
                OTP
              </label>

              <label className="flex gap-1 items-center">
                <input type="radio" name="method" />
                E-Sign
              </label>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded text-sm">
              Initiate Capture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
