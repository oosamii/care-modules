import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import StatCard from "../../components/StatCard";
import axiosInstance from "../../constants/axiosInstance";

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedBills, setSelectedBills] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [status, setStatus] = useState("final");
  const [module, setModule] = useState("");
  const [search, setSearch] = useState("");

  const fetchBills = async () => {
    try {
      const params = {
        page,
        limit,
      };

      if (status) params.status = status;
      if (module) params.module = module;
      if (search) params.search = search;

      const { data } = await axiosInstance.get("/billing/bills/findAll", {
        params,
      });

      setBills(data?.data?.data || []);
      setTotalPages(data?.data?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch bills", err);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [page, status, module, search]);

  const totalRevenue = bills.reduce(
    (sum, bill) => sum + Number(bill.total_amount),
    0,
  );

  const pendingBills = bills.filter(
    (bill) => bill.status === "pending",
  ).length;

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const toggleSelect = (id) => {
    setSelectedBills((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedBills.length === bills.length) {
      setSelectedBills([]);
    } else {
      setSelectedBills(bills.map((bill) => bill.id));
    }
  };

  const downloadBill = async (bill) => {
    try {
      const response = await axiosInstance.get(
        `/billing/bills/${bill.id}/pdf`,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `${bill.invoice_number || "bill"}-${bill.id}.pdf`,
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download bill", err);
    }
  };

  const downloadSelected = () => {
    console.log("Downloading bills:", selectedBills);
  };

  const resetFilters = () => {
    setStatus("final");
    setModule("");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Billing</h1>
          <p className="text-sm text-gray-500">View Hospital Billing</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          {selectedBills.length > 1 && (
            <button
              onClick={downloadSelected}
              className="flex gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              <Download size={16} />
              Download Selected
            </button>
          )}

          {/* STATUS FILTER */}
          <select
            className="border px-3 py-2 rounded-lg text-sm"
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

          {/* MODULE FILTER */}
          <select
            className="border px-3 py-2 rounded-lg text-sm"
            value={module}
            onChange={(e) => {
              setPage(1);
              setModule(e.target.value);
            }}
          >
            <option value="">All Modules</option>
            <option value="opd">OPD</option>
            <option value="ipd">IPD</option>
            {/* <option value="lab">Lab</option>
            <option value="pharmacy">Pharmacy</option> */}
          </select>

          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />

            <input
              type="text"
              placeholder="Search invoice / patient..."
              className="pl-9 pr-3 py-2 border rounded-lg text-sm"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-100"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹ ${totalRevenue.toFixed(2)}`}
          icon={<CreditCard size={24} className="text-green-500" />}
        />

        <StatCard
          title="Pending Bills"
          value={pendingBills}
          icon={<Clock size={24} className="text-blue-500" />}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              {/* <th className="p-4">
                <input
                  type="checkbox"
                  checked={selectedBills.length === bills.length}
                  onChange={toggleSelectAll}
                />
              </th> */}
              <th className="p-4">Invoice</th>
              <th className="p-4">Patient ID</th>
              <th className="p-4">Total</th>
              <th className="p-4">Paid</th>
              <th className="p-4">Outstanding</th>
              <th className="p-4">Status</th>
              <th className="p-4">Issued</th>
              <th className="p-4">Download</th>
            </tr>
          </thead>

          <tbody>
            {bills?.map((bill) => {
              const outstanding =
                Number(bill.total_amount) - Number(bill.paid_amount);

              return (
                <React.Fragment key={bill.id}>
                  <tr
                    className="border-t hover:bg-gray-50 text-xs cursor-pointer"
                    onClick={() => toggleRow(bill.id)}
                  >
                    {/* <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedBills.includes(bill.id)}
                        onChange={() => toggleSelect(bill.id)}
                      />
                    </td> */}

                    <td className="p-4 font-medium">
                      {bill?.invoice_number || "Draft"}
                    </td>

                    <td className="p-4">{bill.patient_id}</td>

                    <td className="p-4">
                      ₹ {Number(bill.total_amount).toFixed(2)}
                    </td>

                    <td className="p-4">
                      ₹ {Number(bill.paid_amount).toFixed(2)}
                    </td>

                    <td className="p-4 text-red-500">
                      ₹ {outstanding.toFixed(2)}
                    </td>

                    <td className="p-4">{bill.status}</td>

                    <td className="p-4">
                      {new Date(bill.issued_at).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      {bill.invoice_number ? (
                        <button
                          onClick={() => downloadBill(bill)}
                          className="text-blue-600"
                        >
                          <Download size={16} />
                        </button>
                      ): " - "}
                    </td>
                  </tr>

                  {expandedRow === bill.id && (
                    <tr className="bg-gray-50 border-t">
                      <td colSpan="10" className="p-5">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Visit ID</p>
                            <p>{bill.visit_id}</p>
                          </div>

                          <div>
                            <p className="text-gray-500">Payment Mode</p>
                            <p>{bill.payment_mode || "Not Paid"}</p>
                          </div>

                          <div>
                            <p className="text-gray-500">Module</p>
                            <p>{bill.metadata?.module}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-end items-center p-4 border-t gap-4">
          <button
            className="border rounded disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft />
          </button>

          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <button
            className="border rounded disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billing;
