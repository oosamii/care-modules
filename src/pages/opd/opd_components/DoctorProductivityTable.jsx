import { Search, Download } from "lucide-react";

const doctors = [
  {
    name: "Dr. Sarah Smith",
    dept: "Internal Medicine",
    visits: 412,
    consult: "14 mins",
    followups: 185,
  },
  {
    name: "Dr. James Wilson",
    dept: "Orthopedics",
    visits: 345,
    consult: "18 mins",
    followups: 210,
  },
  {
    name: "Dr. Emily Chen",
    dept: "Pediatrics",
    visits: 520,
    consult: "12 mins",
    followups: 140,
  },
];

const DoctorProductivityTable = () => {
  return (
    <div className="bg-white border rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h3 className="font-semibold">Doctor Productivity Details</h3>
          <p className="text-sm text-gray-500">
            Performance metrics for all active doctors across departments.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center border rounded-lg px-3 py-1">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              placeholder="Search doctor..."
              className="outline-none text-sm"
            />
          </div>

          <button className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Doctor Name</th>
            <th className="p-3">Department</th>
            <th className="p-3">Total Visits</th>
            <th className="p-3">Avg Consult Time</th>
            <th className="p-3">Follow-ups</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {doctors.map((d, i) => (
            <tr key={i} className="border-t">
              <td className="p-3">{d.name}</td>
              <td className="p-3">{d.dept}</td>
              <td className="p-3">{d.visits}</td>
              <td className="p-3">{d.consult}</td>
              <td className="p-3">{d.followups}</td>
              <td className="p-3">
                <button className="text-blue-600 text-sm">Drilldown</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorProductivityTable;
