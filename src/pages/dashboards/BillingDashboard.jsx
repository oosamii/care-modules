import React, { useEffect, useState, useMemo } from "react";
import {
  CreditCard,
  Clock,
  Activity,
  AlertCircle,
  Info,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Legend } from "recharts";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

import StatCard from "../../components/StatCard";
import axiosInstance from "../../constants/axiosInstance";

const revenueTrendData = [
  { time: "9 AM", billed: 12000, collected: 9000 },
  { time: "10 AM", billed: 18000, collected: 15000 },
  { time: "11 AM", billed: 25000, collected: 21000 },
  { time: "12 PM", billed: 20000, collected: 17000 },
  { time: "1 PM", billed: 30000, collected: 26000 },
  { time: "2 PM", billed: 35000, collected: 32000 },
  { time: "3 PM", billed: 28000, collected: 24000 },
];

const paymentMixData = [
  { name: "Cash", value: 45, color: "bg-blue-500" },
  { name: "Card", value: 28, color: "bg-blue-700" },
  { name: "UPI", value: 19, color: "bg-orange-400" },
  { name: "Bank", value: 8, color: "bg-gray-400" },
];

const BillingDashboard = () => {
  const [bills, setBills] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [status, setStatus] = useState("final");
  const [module, setModule] = useState("");
  const [dateFilter, setDateFilter] = useState("Today");
  const [totalPages, setTotalPages] = useState(1);

  /* Fetch Bills */
  const fetchBills = async () => {
    try {
      const params = { page, limit, period: dateFilter };

      if (status) params.status = status;
      if (module) params.module = module;

      const res = await axiosInstance.get("/billing/bills/findAll", { params });

      if (res.data.success) {
        setBills(res.data.data.data);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Billing dashboard error:", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [page, status, module, dateFilter]);

  const resetFilters = () => {
    setStatus("final");
    setModule("");
    setDateFilter("Today");
    setPage(1);
  };

  /* ---------------------- STATS ---------------------- */

  const stats = useMemo(() => {
    const totalRevenue = bills.reduce(
      (sum, bill) => sum + Number(bill.total_amount),
      0,
    );

    const paidRevenue = bills.reduce(
      (sum, bill) => sum + Number(bill.paid_amount),
      0,
    );

    const outstanding = totalRevenue - paidRevenue;

    return {
      totalBills: bills.length,
      totalRevenue,
      paidRevenue,
      outstanding,
      pending: bills.filter((b) => b.status === "pending").length,
      paid: bills.filter((b) => b.status === "paid" || b.status === "final")
        .length,
    };
  }, [bills]);

  /* ---------------------- TABLE ---------------------- */

  const formattedBills = bills.slice(0, 6).map((bill) => ({
    id: bill.id,
    invoice: bill.invoice_number || "Draft",
    patient: bill.patient_id,
    total: Number(bill.total_amount).toFixed(2),
    paid: Number(bill.paid_amount).toFixed(2),
    status: bill.status,
    date: new Date(bill.issued_at).toLocaleDateString(),
  }));

  const getStatusColor = (status) => {
    if (status === "paid" || status === "final")
      return "bg-green-100 text-green-600";

    if (status === "pending") return "bg-orange-100 text-orange-600";

    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Billing Dashboard
        </h1>
        <p className="text-gray-500">
          Revenue, collections and billing visibility
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 items-center">
        <select
          className="border rounded-lg px-3 py-2"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="final">Final</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2"
          value={module}
          onChange={(e) => {
            setPage(1);
            setModule(e.target.value);
          }}
        >
          <option value="">All Modules</option>
          <option value="opd">OPD</option>
          <option value="ipd">IPD</option>
          <option value="lab">Lab</option>
          <option value="pharmacy">Pharmacy</option>
        </select>

        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Bills" value={stats.totalBills} />
        <StatCard title="Total Billed" value={`₹ ${stats.totalRevenue}`} />
        <StatCard title="Collected" value={`₹ ${stats.paidRevenue}`} />
        <StatCard title="Outstanding" value={`₹ ${stats.outstanding}`} />
        <StatCard title="Pending Bills" value={stats.pending} />
        <StatCard title="Paid Bills" value={stats.paid} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="xl:col-span-2 bg-white border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Revenue Trend</h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueTrendData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="billed"
                stroke="#1e40af"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="collected"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Mix */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold mb-1">Payment Mix</h2>
          <p className="text-sm text-gray-500 mb-4">
            Collection split by payment method
          </p>

          {/* Stacked Bar */}
          <div className="flex w-full h-3 rounded-full overflow-hidden mb-6">
            {paymentMixData.map((item, index) => (
              <div
                key={index}
                className={item.color}
                style={{ width: `${item.value}%` }}
              />
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {paymentMixData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>

                <span className="text-sm font-semibold text-gray-700">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE + ALERTS */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Bills */}
        <div className="col-span-2 bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Recent Bills</h2>

          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">Invoice</th>
                <th>Patient</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {formattedBills.map((bill) => (
                <tr key={bill.id} className="border-t">
                  <td className="py-3">{bill.invoice}</td>
                  <td>{bill.patient}</td>
                  <td>₹ {bill.total}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                        bill.status,
                      )}`}
                    >
                      {bill.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-end items-center mt-5 gap-4">
            <button
              className="border rounded-lg disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft />
            </button>

            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            <button
              className="border rounded-lg disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* ALERTS */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Billing Alerts</h2>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex gap-2">
              <Info className="text-blue-500" size={18} />
              <div>
                <p className="font-semibold">Billing System Active</p>
                <p className="text-sm text-gray-500">
                  All billing services running normally
                </p>
              </div>
            </div>
          </div>

          {stats.pending > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-4">
              <div className="flex gap-2">
                <AlertCircle className="text-yellow-500" size={18} />
                <div>
                  <p className="font-semibold">Pending Payments</p>
                  <p className="text-sm text-gray-500">
                    {stats.pending} bills awaiting payment
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;
