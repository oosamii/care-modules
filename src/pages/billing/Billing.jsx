import React, { useEffect, useState } from "react";
import {
  Search,
  Download,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import axiosInstance from "../../constants/axiosInstance";

const StatusBadge = ({ status }) => {
  const styles = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    final: "bg-blue-100 text-blue-600",
    cancelled: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [status, setStatus] = useState("final");
  const [module, setModule] = useState("");
  const [search, setSearch] = useState("");

  const fetchBills = async () => {
    try {
      const params = { page, limit };

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

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const downloadBill = async (bill) => {
    try {
      const response = await axiosInstance.get(
        `/billing/bills/${bill.id}/pdf`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `${bill.invoice_number || "bill"}-${bill.id}.pdf`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download bill", err);
    }
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
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Billing Register
        </h1>
        <p className="text-sm text-gray-500">
          View and manage all invoices
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border rounded-xl p-4 flex flex-wrap gap-3 items-center">

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search invoice no..."
            className="pl-9 pr-3 py-2 border rounded-lg text-sm w-64"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        <select
          value={module}
          onChange={(e) => {
            setPage(1);
            setModule(e.target.value);
          }}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">Ref Type: All</option>
          <option value="opd">OPD</option>
          <option value="ipd">IPD</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">Status: All</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="final">Final</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          onClick={fetchBills}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          Apply
        </button>

        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-100"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th className="p-4">Invoice No</th>
              <th className="p-4">Date</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Collected</th>
              <th className="p-4">Balance</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>

            {bills.map((bill) => {
              const outstanding =
                Number(bill.total_amount) - Number(bill.paid_amount);

              return (
                <React.Fragment key={bill.id}>

                  <tr
                    className="border-t hover:bg-gray-50 text-sm cursor-pointer"
                    onClick={() => toggleRow(bill.id)}
                  >

                    <td className="p-4 font-medium">
                      {bill.invoice_number || "-"}
                    </td>

                    <td className="p-4">
                      {new Date(bill.issued_at).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <div className="font-medium">
                        {bill.patient_name || bill.patient_id}
                      </div>
                      <div className="text-xs text-gray-400">
                        UHID-{bill.patient_id}
                      </div>
                    </td>

                    <td className="p-4">
                      ₹{Number(bill.total_amount).toLocaleString()}
                    </td>

                    <td className="p-4">
                      ₹{Number(bill.paid_amount).toLocaleString()}
                    </td>

                    <td className="p-4">
                      ₹{outstanding.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={bill.status} />
                    </td>

                    <td
                      className="p-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {bill.invoice_number ? (
                        <button
                          onClick={() => downloadBill(bill)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Open
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>

                  </tr>

                  {/* EXPANDED ROW */}

                  {expandedRow === bill.id && (
                    <tr className="bg-blue-50 border-t">
                      <td colSpan="8" className="p-5">

                        <div className="flex justify-between">

                          <div>
                            <p className="text-xs text-gray-500 mb-2">
                              LINKED REFERENCES
                            </p>

                            <p className="text-blue-600 text-sm">
                              Receipt #{bill.invoice_number} — ₹
                              {bill.paid_amount}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 mb-2">
                              AUDIT & TRACEABILITY
                            </p>

                            <p className="text-sm">
                              Payment Mode: {bill.payment_mode || "Not Paid"}
                            </p>

                            <p className="text-sm">
                              Module: {bill.metadata?.module}
                            </p>
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

        <div className="flex justify-between items-center p-4 border-t">

          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <div className="flex gap-2">

            <button
              className="border rounded px-2 py-1 disabled:opacity-40"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              className="border rounded px-2 py-1 disabled:opacity-40"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Billing;