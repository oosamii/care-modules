import { ClipboardList, TestTube, Activity } from "lucide-react";

const OrdersInvestigations = ({ orders }) => {
  const total = orders.length;
  const resulted = orders.filter((o) => o.status === "Resulted").length;
  const pending = orders.filter((o) => o.status === "Pending").length;

  const getIcon = (type) => {
    if (type === "lab") return <TestTube size={16} className="text-gray-500" />;
    if (type === "scan")
      return <Activity size={16} className="text-gray-500" />;
    return <ClipboardList size={16} className="text-gray-500" />;
  };

  return (
    <div className="bg-white border rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="font-semibold flex items-center gap-2">
          <ClipboardList size={18} />
          Orders & Investigations
        </div>

        <button className="text-blue-600 text-sm font-medium border px-2 py-1 rounded">
          View All
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-gray-500 text-sm">Total Ordered</div>
        </div>

        <div className="bg-green-50 rounded-xl text-center py-4">
          <div className="text-2xl font-bold text-green-600">{resulted}</div>
          <div className="text-green-600 text-sm">Resulted</div>
        </div>

        <div className="bg-orange-50 rounded-xl text-center py-4">
          <div className="text-2xl font-bold text-orange-500">{pending}</div>
          <div className="text-orange-500 text-sm">Pending</div>
        </div>
      </div>

      {/* Orders List */}
      <div>
        {orders.map((o, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3 border-t"
          >
            <div className="flex items-center gap-2 font-medium text-gray-700">
              {getIcon(o.type)}
              {o.name}
            </div>

            <span
              className={`px-3 py-1 text-xs rounded-full font-medium
                ${
                  o.status === "Resulted"
                    ? "bg-green-100 text-green-600"
                    : "bg-orange-100 text-orange-500"
                }`}
            >
              {o.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersInvestigations;
