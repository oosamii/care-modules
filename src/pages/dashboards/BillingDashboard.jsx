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

import StatCard from "../../components/StatCard";
import axiosInstance from "../../constants/axiosInstance";

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
      const params = {
        page,
        limit,
        period: dateFilter,
      };

      if (status) params.status = status;
      if (module) params.module = module;

      const res = await axiosInstance.get("/billing/bills/findAll", {
        params,
      });

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

  /* Reset Filters */
  const resetFilters = () => {
    setStatus("final");
    setModule("");
    setDateFilter("today");
    setPage(1);
  };

  /* Stats */
  const stats = useMemo(() => {
    const totalRevenue = bills.reduce(
      (sum, bill) => sum + Number(bill.total_amount),
      0
    );

    const paidRevenue = bills.reduce(
      (sum, bill) => sum + Number(bill.paid_amount),
      0
    );

    return {
      totalBills: bills.length,
      totalRevenue,
      pending: bills.filter((b) => b.status === "pending").length,
      paid: bills.filter((b) => b.status === "paid" || b.status === "final")
        .length,
      paidRevenue,
    };
  }, [bills]);

  /* Recent Bills */
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

    if (status === "pending")
      return "bg-orange-100 text-orange-600";

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
          Overview of hospital billing and payments
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

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Bills"
          value={stats.totalBills}
          icon={<CreditCard size={24} className="text-blue-500" />}
          filters={["Today", "Week", "Month", "Quarter"]}
          selectedFilter={dateFilter}
          onFilterChange={(filter) => {
            setPage(1);
            setDateFilter(filter);
          }}
        />

        <StatCard
          title="Total Revenue"
          value={`₹ ${stats.totalRevenue.toFixed(2)}`}
          icon={<Activity size={24} className="text-green-500" />}
        />

        <StatCard
          title="Pending Bills"
          value={stats.pending}
          icon={<Clock size={24} className="text-orange-500" />}
        />

        <StatCard
          title="Paid Bills"
          value={stats.paid}
          icon={<CreditCard size={24} className="text-purple-500" />}
        />
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
              {formattedBills.length > 0 ? (
                formattedBills.map((bill) => (
                  <tr key={bill.id} className="border-t">
                    <td className="py-3">{bill.invoice}</td>
                    <td>{bill.patient}</td>
                    <td>₹ {bill.total}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                          bill.status
                        )}`}
                      >
                        {bill.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-400">
                    No billing records
                  </td>
                </tr>
              )}
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
              className=" border rounded-lg disabled:opacity-50"
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
            <div className="flex gap-2 items-start">
              <Info className="text-blue-500" size={18} />

              <div>
                <p className="font-semibold">Billing System Active</p>
                <p className="text-sm text-gray-500">
                  All billing services are functioning normally
                </p>
              </div>
            </div>
          </div>

          {stats.pending > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-4">
              <div className="flex gap-2 items-start">
                <AlertCircle className="text-yellow-500" size={18} />

                <div>
                  <p className="font-semibold">Pending Payments</p>
                  <p className="text-sm text-gray-500">
                    {stats.pending} bills are awaiting payment
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