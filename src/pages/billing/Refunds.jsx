import React, { useState } from "react";
import { Search, RotateCcw, Clock, ShieldAlert } from "lucide-react";
import StatCard from "../../components/StatCard";

const Refunds = () => {
  const [search, setSearch] = useState("");
  const [selectedRefund, setSelectedRefund] = useState(null);

  const stats = [
    {
      title: "Refund Requests",
      value: "42",
      icon: <RotateCcw className="text-blue-500" />,
    },
    {
      title: "Approved Value",
      value: "₹1.84L",
      icon: <RotateCcw className="text-indigo-500" />,
    },
    {
      title: "Pending Payouts",
      value: "11",
      icon: <Clock className="text-orange-500" />,
    },
    {
      title: "Rejected / Held",
      value: "6",
      icon: <ShieldAlert className="text-red-500" />,
    },
  ];

  const refunds = [
    {
      id: "RF-2048",
      date: "24 Oct, 12:10",
      invoice: "INV-10203",
      patient: "Maria Garcia",
      uhid: "490199",
      amount: 600,
      method: "UPI",
      status: "Pending",
      owner: "R. Menon",
      reason:
        "Duplicate charge reversal requested after same-day UPI retry.",
      requestedBy: "Asha Nair",
    },
  ];

  const filteredRefunds = refunds.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.invoice.toLowerCase().includes(search.toLowerCase()) ||
      r.patient.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Refunds</h1>
          <p className="text-gray-500 text-sm">
            Track approved refunds, payout status, and invoice references
          </p>
        </div>

        <select className="border rounded-lg px-4 py-2 text-sm">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <StatCard
            key={i}
            title={s.title}
            value={s.value}
            icon={s.icon}
          />
        ))}
      </div>

      {/* FILTERS */}
      <div className="bg-white border rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3 items-center">

        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search refund no / invoice / patient / receipt"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
          />
        </div>

        <select className="border rounded-lg px-3 py-2 text-sm">
          <option>Status: All</option>
        </select>

        <select className="border rounded-lg px-3 py-2 text-sm">
          <option>Method: All</option>
        </select>

        <select className="border rounded-lg px-3 py-2 text-sm">
          <option>Owner: All</option>
        </select>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm">
          Apply
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* REFUND QUEUE */}
        <div className="lg:col-span-2 bg-white border rounded-xl">

          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Refund Queue</h2>
            <p className="text-sm text-gray-500">
              Requests with invoice linkage, approval status, and payout tracking
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left p-3">Refund No</th>
                  <th className="text-left p-3">Requested On</th>
                  <th className="text-left p-3">Invoice Ref</th>
                  <th className="text-left p-3">Patient</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Method</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Owner</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredRefunds.map((r) => (
                  <React.Fragment key={r.id}>

                    <tr className="border-t">

                      <td className="p-3 font-medium">{r.id}</td>
                      <td className="p-3">{r.date}</td>
                      <td className="p-3 text-blue-600">{r.invoice}</td>

                      <td className="p-3">
                        {r.patient}
                        <div className="text-xs text-gray-500">
                          UHID: {r.uhid}
                        </div>
                      </td>

                      <td className="p-3 font-medium">₹{r.amount}</td>
                      <td className="p-3">{r.method}</td>

                      <td className="p-3">
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                          {r.status}
                        </span>
                      </td>

                      <td className="p-3">{r.owner}</td>

                      <td className="p-3">
                        <button
                          className="text-blue-600"
                          onClick={() =>
                            setSelectedRefund(
                              selectedRefund === r.id ? null : r.id
                            )
                          }
                        >
                          Open
                        </button>
                      </td>

                    </tr>

                    {selectedRefund === r.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="9" className="p-4">

                          <div className="grid md:grid-cols-3 gap-6">

                            <div>
                              <p className="text-xs text-gray-500">Reason</p>
                              <p className="text-sm">{r.reason}</p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500">Requested By</p>
                              <p className="text-sm">{r.requestedBy}</p>
                            </div>

                            <div className="flex gap-3 items-center">

                              <button className="border px-4 py-2 rounded-lg text-sm">
                                Open Refund
                              </button>

                              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                                Send to Approval
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

        {/* INITIATE REFUND PANEL */}

        <div className="bg-white border rounded-xl p-4 h-fit">

          <h2 className="font-semibold text-lg mb-3">Initiate Refund</h2>
          <p className="text-sm text-gray-500 mb-4">
            Inline action panel, no popup flow
          </p>

          <div className="border rounded-lg p-3 mb-4 bg-gray-50">
            <p className="font-medium">Maria Garcia</p>
            <p className="text-xs text-gray-500">
              UHID 490199 · Invoice INV-10203 · Receipt RCP-99013
            </p>
          </div>

          <label className="text-sm">Refund against</label>
          <select className="w-full border rounded-lg px-3 py-2 mb-3">
            <option>Original payment · UPI</option>
          </select>

          <label className="text-sm">Refund amount</label>
          <input
            className="w-full border rounded-lg px-3 py-2 mb-3"
            value="₹600.00"
            readOnly
          />

          <label className="text-sm">Reason</label>
          <select className="w-full border rounded-lg px-3 py-2 mb-4">
            <option>Duplicate payment</option>
          </select>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Initiate Refund
          </button>

        </div>

      </div>
    </div>
  );
};

export default Refunds;