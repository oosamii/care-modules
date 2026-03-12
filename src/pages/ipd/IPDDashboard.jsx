import React from "react";
import Breadcrumb from "./components/Breadcrumb";
import StatCard from "../../components/StatCard";
import { Calendar, ChevronDown } from "lucide-react";

const IPDDashboard = () => {
  const stats = [
    { title: "Active Admissions", value: 142 },
    { title: "Discharges Today", value: 28 },
    { title: "Running Bills Pending", value: 85 },
    { title: "Deposits Balance", value: "₹12.5M" },
    { title: "Pending Settlements", value: 12 },
    { title: "Package Overruns", value: 4, highlight: true },
  ];

  const wards = [
    { ward: "ICU", ipd: 18, avg: "₹1,20,000", pending: "₹45,000" },
    { ward: "General Male", ipd: 45, avg: "₹15,000", pending: "₹8,000" },
    { ward: "General Female", ipd: 40, avg: "₹16,500", pending: "₹9,500" },
    { ward: "Private Deluxe", ipd: 12, avg: "₹85,000", pending: "₹22,000" },
    { ward: "Maternity", ipd: 27, avg: "₹45,000", pending: "₹12,000" },
  ];

  const risks = [
    {
      type: "Missing deposit",
      color: "bg-red-500",
      ipd: "IPD-2301",
      amount: "₹25,000",
      owner: "Billing Desk 1",
    },
    {
      type: "Package Overrun",
      color: "bg-yellow-400",
      ipd: "IPD-2290",
      amount: "₹12,500",
      owner: "Dr. Sharma",
    },
    {
      type: "Unposted charges",
      color: "bg-red-500",
      ipd: "IPD-2315",
      amount: "₹8,000",
      owner: "Pharmacy",
    },
    {
      type: "Discharge pending",
      color: "bg-yellow-400",
      ipd: "IPD-2180",
      amount: "-",
      owner: "Nursing Stn B",
    },
    {
      type: "Missing deposit",
      color: "bg-red-500",
      ipd: "IPD-2342",
      amount: "₹50,000",
      owner: "Billing Desk 2",
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Breadcrumb items={[{ name: "IPD Billing" }, { name: "Dashboard" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          IPD Dashboard
        </h1>

        <button className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 w-fit">
          <Calendar className="w-4 h-4" />
          Today
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            valueClass={stat.highlight ? "text-red-500" : ""}
          />
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Ward Billing */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 font-semibold text-lg">
            Ward-wise Billing Snapshot
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Ward</th>
                  <th className="p-3">Active IPD</th>
                  <th className="p-3">Avg Bill</th>
                  <th className="p-3">Pending Charges</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {wards.map((w, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{w.ward}</td>
                    <td className="p-3 text-center">{w.ipd}</td>
                    <td className="p-3 text-center">{w.avg}</td>
                    <td className="p-3 text-center">{w.pending}</td>
                    <td className="p-3 text-blue-600 font-medium cursor-pointer">
                      Open
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Exceptions */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 font-semibold text-lg">Exceptions & Risks</div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3">IPD No</th>
                  <th className="p-3">Amount Impact</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {risks.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <span
                        className={`${r.color} text-white px-3 py-1 rounded-full text-xs whitespace-nowrap`}
                      >
                        {r.type}
                      </span>
                    </td>
                    <td className="p-3 text-center">{r.ipd}</td>
                    <td className="p-3 text-center">{r.amount}</td>
                    <td className="p-3 text-center text-gray-600">{r.owner}</td>
                    <td className="p-3 text-blue-600 font-medium cursor-pointer">
                      Open
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 font-semibold text-lg">Recent IPD Activities</div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Time</th>
                <th className="p-3">IPD No</th>
                <th className="p-3 text-left">Patient</th>
                <th className="p-3">Event</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {[
                {
                  time: "10:45 AM",
                  ipd: "IPD-2350",
                  patient: "Ramesh Kumar",
                  event: "Deposit",
                  eventColor: "bg-blue-100 text-blue-700",
                  amount: "₹50,000",
                },
                {
                  time: "10:30 AM",
                  ipd: "IPD-2285",
                  patient: "Sunita Rao",
                  event: "Settlement",
                  eventColor: "bg-green-500 text-white",
                  amount: "₹1,25,000",
                },
                {
                  time: "10:15 AM",
                  ipd: "IPD-2341",
                  patient: "Amit Singh",
                  event: "Charge",
                  eventColor: "bg-blue-100 text-blue-700",
                  amount: "₹12,500",
                },
                {
                  time: "09:50 AM",
                  ipd: "IPD-2310",
                  patient: "Kavita Devi",
                  event: "Settlement",
                  eventColor: "bg-green-500 text-white",
                  amount: "₹85,000",
                },
                {
                  time: "09:20 AM",
                  ipd: "IPD-2365",
                  patient: "Md. Ali",
                  event: "Deposit",
                  eventColor: "bg-blue-100 text-blue-700",
                  amount: "₹25,000",
                },
              ].map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-600">{item.time}</td>

                  <td className="p-3 text-center font-mono">{item.ipd}</td>

                  <td className="p-3 font-medium">{item.patient}</td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${item.eventColor}`}
                    >
                      {item.event}
                    </span>
                  </td>

                  <td className="p-3 text-center font-medium">{item.amount}</td>

                  <td className="p-3 text-blue-600 font-medium cursor-pointer">
                    Open
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IPDDashboard;
