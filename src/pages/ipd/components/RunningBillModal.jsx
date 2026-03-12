import { X, Receipt, Calendar, User } from "lucide-react";

const RunningBillModal = ({ onClose }) => {
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
          {/* Deposit Reference */}
          <div>
            <label className="text-sm font-medium">Deposit Reference</label>

            <select className="w-full border rounded-lg p-3 mt-1">
              <option>DEP-10492</option>
              <option>DEP-10493</option>
            </select>
          </div>

          {/* Method + Utilized */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Method of Payment</label>

              <select className="w-full border rounded-lg p-3 mt-1">
                <option>Credit Card</option>
                <option>UPI</option>
                <option>Cash</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Utilized</label>

              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="₹ 10,000"
              />
            </div>
          </div>

          {/* Amount + Balance */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Amount</label>

              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="₹ 15,000"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Balance</label>

              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="₹ 5,000"
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-6 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                <span>
                  Receipt Link:{" "}
                  <span className="text-blue-600 cursor-pointer">RCP-8832</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Received: 10 Oct 2023, 09:15 AM</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Collected by: Asha Nair</span>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-3 text-sm">
              <span className="font-medium">Adjustment Notes:</span> ₹12,000
              adjusted against interim bill INV-9901 on 11 Oct 2023.
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

export default RunningBillModal;
