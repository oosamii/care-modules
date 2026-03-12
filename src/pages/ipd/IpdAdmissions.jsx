import React, { use } from "react";
import { Search } from "lucide-react";
import Breadcrumb from "./components/Breadcrumb";
import { useNavigate } from "react-router-dom";

const IpdAdmissions = () => {
  const navigate = useNavigate();
  const admissions = [
    {
      ipd: "IPD-4011",
      bed: "ICU Bed 04",
      patient: "Ramesh Kumar",
      uhid: "UHID-99201",
      total: "₹ 1,20,500",
      deposit: "₹ 50,000",
      pending: "4 items",
      pendingColor: "bg-yellow-400 text-black",
    },
    {
      ipd: "IPD-3982",
      bed: "Ward 2B",
      patient: "Sunita Sharma",
      uhid: "UHID-88402",
      total: "₹ 45,000",
      deposit: "₹ 65,000",
      pending: "0 items",
      pendingColor: "bg-blue-100 text-blue-700",
    },
    {
      ipd: "IPD-4050",
      bed: "Ward 1A",
      patient: "John Doe",
      uhid: "UHID-77321",
      total: "₹ 1,98,000",
      deposit: "₹ 2,00,000",
      pending: "12 items",
      pendingColor: "bg-yellow-400 text-black",
    },
    {
      ipd: "IPD-4061",
      bed: "HDU Bed 02",
      patient: "Ahmad Raza",
      uhid: "UHID-66011",
      total: "₹ 52,200",
      deposit: "₹ 20,000",
      pending: "0 items",
      pendingColor: "bg-blue-100 text-blue-700",
    },
    {
      ipd: "IPD-4029",
      bed: "Ward 3C",
      patient: "Vikram Singh",
      uhid: "UHID-55104",
      total: "₹ 68,000",
      deposit: "₹ 50,000",
      pending: "2 items",
      pendingColor: "bg-yellow-400 text-black",
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ name: "IPD" }, { name: "Admission" }]} />

      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-900">Admissions</h1>

      {/* Card */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search IPD No / Patient"
              className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">IPD No</th>
                <th className="p-3 text-left">Patient</th>
                <th className="p-3">Current Total</th>
                <th className="p-3">Deposits</th>
                <th className="p-3">Net Payable</th>
                <th className="p-3">Pending Postings</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {admissions.map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  {/* IPD */}
                  <td className="p-4">
                    <div className="font-medium">{item.ipd}</div>
                    <div className="text-gray-500 text-xs">{item.bed}</div>
                  </td>

                  {/* Patient */}
                  <td className="p-4">
                    <div className="font-medium">{item.patient}</div>
                    <div className="text-gray-500 text-xs">{item.uhid}</div>
                  </td>

                  {/* Total */}
                  <td className="p-4 text-center">{item.total}</td>

                  {/* Deposit */}
                  <td className="p-4 text-center">{item.deposit}</td>

                  {/* Net payable placeholder */}
                  <td className="p-4 text-center">-</td>

                  {/* Pending */}
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${item.pendingColor}`}
                    >
                      {item.pending}
                    </span>
                  </td>

                  {/* Action */}
                  <td
                    onClick={() => navigate("/ipdAdServices")}
                    className="p-4 text-blue-600 font-medium cursor-pointer"
                  >
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

export default IpdAdmissions;
