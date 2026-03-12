import { X } from "lucide-react";

const ConsumableModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">Consumable Ledger</h2>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Issue Number */}
          <div>
            <label className="text-sm font-medium">Issue Number</label>

            <select className="w-full border rounded-lg p-3 mt-1">
              <option>ISS-98421</option>
              <option>ISS-98422</option>
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

          {/* Amount + Billing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Amount</label>
              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="₹ 500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Mapped to Billing</label>
              <select className="w-full border rounded-lg p-3 mt-1">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>

          {/* Issued By + Issued To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Issued By</label>
              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="Farhan Ali"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Issued To</label>
              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="Ward 3A"
              />
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

export default ConsumableModal;
