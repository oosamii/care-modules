import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const CustTable = ({ columns, data, actions, page, setPage, totalPages }) => {
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="overflow-x-auto shadow-sm border border-gray-200 bg-white">
      {/* Table */}
      <table className="w-full text-xs md:text-sm text-left text-[#000000]">
        <thead className="uppercase border-b bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`p-2 text-nowrap md:px-6 md:py-4 ${
                  col.className || "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
            {actions?.length > 0 && <th className="p-2 md:px-6 md:py-4">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data?.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b last:border-none hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`p-2 md:px-6 md:py-4 text-nowrap ${col.className}`}
                  >
                    {row[col.key]}
                  </td>
                ))}
                {actions?.length > 0 && (
                  <td className="p-2 md:px-6 md:py-4 flex">
                    {actions.map((action, i) => (
                      <button
                        key={i}
                        title={action.label}
                        onClick={() => action.onClick(row)}
                        className="hover:scale-110 transition-transform"
                      >
                        {action.icon}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions?.length > 0 ? 1 : 0)}
                className="text-center py-6 text-gray-500"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 p-4 border-t">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="text-sm disabled:opacity-50"
          >
            <ChevronLeft />
          </button>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded-md text-sm border ${
                  page === i + 1
                    ? "bg-primary text-white border-primary"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="text-sm disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default CustTable;
