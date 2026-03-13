import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ordersData = [
  {
    id: "ORD-8901",
    patient: "Michael Ross",
    uhid: "P-98234",
    type: "Lab",
    study: "Complete Blood Count, CEE",
    doctor: "Dr. Sarah Lee",
    status: "Ordered",
    ai: "-",
    items: ["Complete Blood Count (CBC)", "C-Reactive Protein (CRP)"],
    notes:
      "Priority: Routine. Clinical Notes: Fasting not required. Check for signs of infection.",
  },
  {
    id: "ORD-8895",
    patient: "Elena Gilbert",
    uhid: "P-88120",
    type: "Radiology",
    study: "Chest X-ray",
    doctor: "Dr. Alan Grant",
    status: "Resulted",
    ai: "45m",
  },
  {
    id: "ORD-8880",
    patient: "John Doe",
    uhid: "P-10293",
    type: "Procedure",
    study: "Wound Dressing",
    doctor: "Dr. Sarah Lee",
    status: "Collected",
    ai: "-",
  },
];

export function OrdersHeader({ onNewOrder }) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-semibold">Orders</h1>

      <button
        onClick={onNewOrder}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
      >
        + New Order
      </button>
    </div>
  );
}

export function OrdersFilterBar({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-3 bg-white border rounded-lg p-3 items-center">
      {/* Search */}
      <input
        placeholder="Search patient name, UHID..."
        className="border rounded px-3 py-2 text-sm w-full sm:w-72"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      {/* Order Type */}
      <select
        className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
      >
        <option value="">All order types</option>
        <option value="Lab">Lab</option>
        <option value="Radiology">Radiology</option>
        <option value="Procedure">Procedure</option>
      </select>

      {/* Status */}
      <select
        className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">All statuses</option>
        <option value="Ordered">Ordered</option>
        <option value="Collected">Collected</option>
        <option value="Resulted">Resulted</option>
      </select>

      {/* Apply Button */}
      <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm w-full sm:w-auto">
        Apply
      </button>
    </div>
  );
}

export function OrdersTable({ filters }) {
  const [openRow, setOpenRow] = useState(null);

  const filtered = ordersData.filter((o) => {
    return (
      o.patient.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.type ? o.type === filters.type : true) &&
      (filters.status ? o.status === filters.status : true)
    );
  });

  return (
    <div className="bg-white border rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left">
              <th className="p-3">Order ID</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Type</th>
              <th className="p-3">Test/Study</th>
              <th className="p-3">Ordered By</th>
              <th className="p-3">Status</th>
              <th className="p-3">AI</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((order, i) => (
              <>
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3">{order.id}</td>

                  <td className="p-3">
                    <div>{order.patient}</div>
                    <div className="text-xs text-gray-500">{order.uhid}</div>
                  </td>

                  <td className="p-3">{order.type}</td>

                  <td className="p-3">{order.study}</td>

                  <td className="p-3">{order.doctor}</td>

                  <td className="p-3">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                      {order.status}
                    </span>
                  </td>

                  <td className="p-3">{order.ai}</td>

                  <td className="p-3">
                    <button
                      onClick={() => setOpenRow(openRow === i ? null : i)}
                    >
                      {openRow === i ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </td>
                </tr>

                {openRow === i && order.items && (
                  <tr className="bg-gray-50">
                    <td colSpan="8" className="p-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">
                            ORDER ITEMS
                          </h4>

                          <ul className="text-sm space-y-1">
                            {order.items.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-sm">
                            NOTES & DETAILS
                          </h4>

                          <p className="text-sm text-gray-600">{order.notes}</p>

                          <div className="mt-3 flex gap-3">
                            <button className="border px-3 py-1 rounded text-sm">
                              Print
                            </button>

                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                              Open Order
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CriticalResults() {
  const results = [
    {
      name: "Potassium (K+)",
      value: "6.2 mEq/L",
      patient: "James Wilson",
      order: "ORD-8840",
    },
    {
      name: "Troponin I",
      value: "1.5 ng/mL",
      patient: "Robert Chase",
      order: "ORD-8822",
    },
  ];

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Critical Results</h3>

      {results.map((r, i) => (
        <div key={i} className="border-t py-2 text-sm">
          <div className="flex justify-between font-medium">
            <span>{r.name}</span>
            <span>{r.value}</span>
          </div>

          <div className="text-xs text-gray-500">
            {r.order} • {r.patient}
          </div>

          <button className="text-blue-600 text-xs mt-1">View Result</button>
        </div>
      ))}
    </div>
  );
}

export function QuickOrderSets() {
  const sets = [
    "Basic Fever Profile",
    "Comprehensive Metabolic",
    "Pre-Op Evaluation",
    "Routine ANC",
  ];

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Quick Order Sets</h3>

      {sets.map((s, i) => (
        <div key={i} className="flex justify-between py-2 border-t text-sm">
          <span>{s}</span>
          <button className="text-blue-600">+</button>
        </div>
      ))}
    </div>
  );
}

export function NewOrderModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg w-[520px] p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">New Order</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Patient */}
          <div>
            <label className="text-sm text-gray-600">Patient</label>
            <input
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
              placeholder="Search patient..."
            />
          </div>

          {/* Order Type */}
          <div>
            <label className="text-sm text-gray-600">Order Type</label>
            <select className="w-full border rounded px-3 py-2 mt-1 text-sm">
              <option>Lab</option>
              <option>Radiology</option>
              <option>Procedure</option>
            </select>
          </div>

          {/* Test */}
          <div>
            <label className="text-sm text-gray-600">Test / Study</label>
            <input
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
              placeholder="Enter test name..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-gray-600">Notes</label>
            <textarea
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
              rows="3"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
}
