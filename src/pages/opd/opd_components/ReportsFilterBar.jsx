import { Calendar, Building2, Stethoscope } from "lucide-react";

const ReportsFilterBar = () => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select className="border rounded-lg px-3 py-2 text-sm bg-white">
        <option>Last 30 Days</option>
        <option>Last 60 Days</option>
      </select>

      <select className="border rounded-lg px-3 py-2 text-sm bg-white">
        <option>All Departments</option>
      </select>

      <select className="border rounded-lg px-3 py-2 text-sm bg-white">
        <option>All Doctors</option>
      </select>

      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
        Apply Filters
      </button>
    </div>
  );
};

export default ReportsFilterBar;
