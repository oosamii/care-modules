import { X, Info } from "lucide-react";

const DepositModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">Bill</h2>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Category */}
          <div>
            <label className="text-sm font-medium">Category</label>

            <select className="w-full border rounded-lg p-3 mt-1">
              <option>Room Rent</option>
              <option>Service Charges</option>
              <option>Consumables</option>
            </select>
          </div>

          {/* Quantity + Item */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Quantity</label>

              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Item</label>

              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="Daily ward visit"
              />
            </div>
          </div>

          {/* Amount + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Amount</label>

              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="₹ 500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>

              <select className="w-full border rounded-lg p-3 mt-1">
                <option>Pending</option>
                <option>Posted</option>
              </select>
            </div>
          </div>

          {/* Discharge Note */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-1" />

            <div>
              <p className="font-medium text-blue-900">Discharge Note</p>

              <p className="text-sm text-blue-800 mt-1">
                You cannot initiate discharge settlement while there are pending
                postings. Please resolve them first.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
