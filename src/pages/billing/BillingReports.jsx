import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Clock,
  Tag,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

const mockData = [
  {
    counter: "Main Counter",
    billed: 85000,
    collected: 85000,
    refunds: 0,
  },
  {
    counter: "OPD Counter 1",
    billed: 42000,
    collected: 38000,
    refunds: 1500,
  },
  {
    counter: "OPD Counter 2",
    billed: 18000,
    collected: 18000,
    refunds: 0,
  },
  {
    counter: "Pharmacy 1",
    billed: 0,
    collected: 0,
    refunds: 0,
  },
];

const BillingReports = () => {
  const [filters, setFilters] = useState({
    dateRange: "Last 30 Days",
    facility: "All Locations",
    counter: "All",
  });

  const [data] = useState(mockData);

  const summary = useMemo(() => {
    const billed = data.reduce((a, b) => a + b.billed, 0);
    const collected = data.reduce((a, b) => a + b.collected, 0);
    const refunds = data.reduce((a, b) => a + b.refunds, 0);

    return {
      revenueTrend: collected,
      refunds,
      outstanding: billed - collected,
      discounts: 12400,
      exceptions: 14,
      topMethod: "Cash / UPI",
    };
  }, [data]);

  const formatCurrency = (value) =>
    `₹${value.toLocaleString("en-IN")}`;

  const varianceColor = (value) => {
    if (value === 0) return "text-green-600";
    if (value > 0) return "text-yellow-500";
    return "text-red-500";
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    console.log("Apply filters", filters);
  };

  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
        <Icon size={20} />
      </div>

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Billing Reports</h1>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">

        <select
          className="border rounded-lg px-4 py-2"
          value={filters.dateRange}
          onChange={(e) =>
            handleFilterChange("dateRange", e.target.value)
          }
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
        </select>

        <select
          className="border rounded-lg px-4 py-2"
          value={filters.facility}
          onChange={(e) =>
            handleFilterChange("facility", e.target.value)
          }
        >
          <option>All Locations</option>
          <option>Main Hospital</option>
          <option>Branch Clinic</option>
        </select>

        <select
          className="border rounded-lg px-4 py-2"
          value={filters.counter}
          onChange={(e) =>
            handleFilterChange("counter", e.target.value)
          }
        >
          <option>All</option>
          <option>Main Counter</option>
          <option>OPD Counter 1</option>
          <option>OPD Counter 2</option>
        </select>

        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Apply
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5 mb-6">

        <StatCard
          icon={TrendingUp}
          title="Revenue Trend"
          value={formatCurrency(summary.revenueTrend)}
        />

        <StatCard
          icon={Clock}
          title="Collection by Method"
          value={summary.topMethod}
        />

        <StatCard
          icon={Tag}
          title="Discounts Summary"
          value={formatCurrency(summary.discounts)}
        />

        <StatCard
          icon={RotateCcw}
          title="Refund Summary"
          value={formatCurrency(summary.refunds)}
        />

        <StatCard
          icon={Clock}
          title="Outstanding Aging"
          value={formatCurrency(summary.outstanding)}
        />

        <StatCard
          icon={AlertCircle}
          title="Exceptions Report"
          value={`${summary.exceptions} Flags`}
        />
      </div>

      {/* Revenue Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">
            Revenue Trend Details
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left p-3">Counter</th>
                <th className="text-left p-3">Billed</th>
                <th className="text-left p-3">Collected</th>
                <th className="text-left p-3">Refunds</th>
                <th className="text-left p-3">Variance</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>

            <tbody>

              {data.map((row, index) => {
                const variance =
                  row.billed - row.collected - row.refunds;

                return (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">
                      {row.counter}
                    </td>

                    <td className="p-3">
                      {formatCurrency(row.billed)}
                    </td>

                    <td className="p-3">
                      {formatCurrency(row.collected)}
                    </td>

                    <td className="p-3">
                      {formatCurrency(row.refunds)}
                    </td>

                    <td
                      className={`p-3 font-semibold ${varianceColor(
                        variance
                      )}`}
                    >
                      {formatCurrency(variance)}
                    </td>

                    <td className="p-3">
                      <button className="text-blue-600 font-medium">
                        Drilldown
                      </button>
                    </td>
                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
};

export default BillingReports;