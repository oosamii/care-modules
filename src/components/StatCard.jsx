import React from "react";

const StatCard = ({
  title,
  value,
  icon,
  filters = [],
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 flex flex-col justify-between">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>

        <div className="text-2xl">{icon}</div>
      </div>

      {filters.length > 0 && (
        <div className="flex justify-end gap-2 mt-3">
          {filters.map((filter) => {
            const letter = filter.charAt(0).toUpperCase();

            return (
              <button
                key={filter}
                onClick={() => onFilterChange?.(filter)}
                title={filter}
                className={`text-xs font-medium transition ${
                  selectedFilter === filter
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StatCard;
