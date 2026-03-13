import { Pill } from "lucide-react";

const PrescriptionCard = ({ prescription }) => {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b font-semibold text-gray-800">
        <Pill size={16} className="text-gray-500" />
        Prescription
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        {/* Column headers */}
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Drug</th>
            <th className="px-4 py-3 text-right font-medium">Dosage</th>
          </tr>
        </thead>

        {/* Rows */}
        <tbody>
          {prescription?.map((p, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-3 font-medium text-gray-800">{p.drug}</td>

              <td className="px-4 py-3 text-right text-gray-700">{p.dosage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrescriptionCard;
