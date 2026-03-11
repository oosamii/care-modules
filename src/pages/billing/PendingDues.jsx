import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const mockData = [
  {
    id: 1,
    patient: "Rahul Sharma",
    uhid: "490122",
    invoice: "INV-09822",
    balance: 12400,
    age: 45,
    lastReminder: "12 Oct 2023",
    status: "Overdue",
    billingOwner: "Asha Nair · Billing Desk 1",
    totalBilled: 25400,
    payments: [
      { date: "15 Sep", amount: 8000, method: "UPI" },
      { date: "20 Sep", amount: 5000, method: "Cash" },
    ],
    notes:
      "Patient requested extension until next week. Promised to settle via bank transfer by Friday.",
  },
  {
    id: 2,
    patient: "Anjali Desai",
    uhid: "490250",
    invoice: "INV-10045",
    balance: 4500,
    age: 12,
    lastReminder: "-",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Vikram Singh",
    uhid: "489912",
    invoice: "INV-08810",
    balance: 28000,
    age: 68,
    lastReminder: "18 Oct 2023",
    status: "Overdue",
  },
];

const PendingDues = () => {
  const [data] = useState(mockData);
  const [expandedRow, setExpandedRow] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = data.filter(
    (item) =>
      item.patient.toLowerCase().includes(search.toLowerCase()) ||
      item.invoice.toLowerCase().includes(search.toLowerCase()) ||
      item.uhid.includes(search)
  );

  const totalOutstanding = filtered.reduce((acc, item) => acc + item.balance, 0);

  const aging = {
    "0-7": 150000,
    "8-30": 120000,
    "31-60": 85000,
    "60+": 65000,
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const badgeColor = (status) => {
    if (status === "Overdue")
      return "bg-red-100 text-red-600";
    if (status === "Pending")
      return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pending Dues</h1>
        <p className="text-gray-500">
          Track outstanding balances, patient follow-ups, and account aging
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-wrap gap-4 items-center">

        <div className="flex items-center border rounded-lg px-3 py-2 w-full md:w-96">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            placeholder="Search patient / UHID / invoice..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="border rounded-lg px-3 py-2">
          <option>Age: All</option>
          <option>0-18</option>
          <option>18-40</option>
          <option>40+</option>
        </select>

        <select className="border rounded-lg px-3 py-2">
          <option>Type: Self-Pay</option>
          <option>Insurance</option>
        </select>

        <input
          type="date"
          className="border rounded-lg px-3 py-2"
        />

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
          Apply
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm overflow-hidden">

          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">
              Accounts Receivable
            </h2>
            <p className="text-sm text-gray-500">
              Patients with outstanding self-pay balances
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="text-left p-3">Patient</th>
                  <th className="text-left p-3">Invoice</th>
                  <th className="text-left p-3">Balance</th>
                  <th className="text-left p-3">Age</th>
                  <th className="text-left p-3">Last Reminder</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>

              <tbody>

                {filtered.map((row) => (
                  <React.Fragment key={row.id}>
                    <tr className="border-b hover:bg-gray-50">

                      <td className="p-3">
                        <div className="font-medium">
                          {row.patient}
                        </div>
                        <div className="text-gray-500 text-xs">
                          UHID: {row.uhid}
                        </div>
                      </td>

                      <td className="p-3 text-blue-600 cursor-pointer">
                        {row.invoice}
                      </td>

                      <td className="p-3 font-semibold">
                        ₹{row.balance.toLocaleString()}
                      </td>

                      <td className="p-3">
                        {row.age} days
                      </td>

                      <td className="p-3">
                        {row.lastReminder}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${badgeColor(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>

                      <td className="p-3 flex items-center gap-2">

                        <button
                          onClick={() => toggleRow(row.id)}
                          className="text-blue-600"
                        >
                          Open
                        </button>

                        {expandedRow === row.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </td>
                    </tr>

                    {expandedRow === row.id && row.payments && (
                      <tr className="bg-blue-50">
                        <td colSpan="7" className="p-4">

                          <div className="grid md:grid-cols-3 gap-6">

                            <div>
                              <h4 className="text-sm font-semibold mb-2">
                                PAYMENT HISTORY
                              </h4>

                              {row.payments.map((p, i) => (
                                <div key={i} className="text-sm text-gray-700">
                                  {p.date}: ₹{p.amount} ({p.method})
                                </div>
                              ))}
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold mb-2">
                                NOTES
                              </h4>

                              <p className="text-sm text-gray-700">
                                {row.notes}
                              </p>

                              <div className="mt-4 text-sm text-gray-500">
                                Billing Owner
                                <div className="font-medium">
                                  {row.billingOwner}
                                </div>
                              </div>

                              <div className="text-sm text-gray-500 mt-2">
                                Total Billed
                                <div className="font-medium">
                                  ₹{row.totalBilled?.toLocaleString()}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3">

                              <button className="bg-blue-600 text-white py-2 rounded-lg">
                                Send Reminder
                              </button>

                              <button className="border py-2 rounded-lg">
                                Collect Payment
                              </button>

                              <button className="border py-2 rounded-lg">
                                Add Note
                              </button>

                            </div>

                          </div>

                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}

              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="bg-white rounded-lg border shadow-sm p-5">

          <h3 className="font-semibold text-lg mb-1">
            Collections Summary
          </h3>

          <p className="text-sm text-gray-500 mb-4">
            Self-pay outstanding overview
          </p>

          <div className="bg-gray-100 rounded-lg p-5 text-center mb-6">
            <p className="text-gray-500 text-sm">
              TOTAL OUTSTANDING
            </p>
            <p className="text-3xl font-bold text-red-500">
              ₹{(totalOutstanding / 100000).toFixed(1)}L
            </p>
          </div>

          <h4 className="font-semibold mb-3">
            Aging Distribution
          </h4>

          {Object.entries(aging).map(([range, value]) => (
            <div key={range} className="mb-3">

              <div className="flex justify-between text-sm mb-1">
                <span>{range} Days</span>
                <span>₹{(value / 1000).toFixed(0)}K</span>
              </div>

              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-green-500 rounded"
                  style={{
                    width: `${Math.min(value / 2000, 100)}%`,
                  }}
                />
              </div>

            </div>
          ))}

          <h4 className="font-semibold mt-6 mb-3">
            Top Dues by Amount
          </h4>

          {filtered
            .sort((a, b) => b.balance - a.balance)
            .slice(0, 3)
            .map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b py-2"
              >
                <div>
                  <p className="font-medium">{item.patient}</p>
                  <p className="text-xs text-gray-500">
                    UHID: {item.uhid}
                  </p>
                </div>

                <p className="font-semibold">
                  ₹{item.balance.toLocaleString()}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PendingDues;