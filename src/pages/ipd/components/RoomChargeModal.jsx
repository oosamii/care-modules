import { X } from "lucide-react";

const RoomChargeModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">Room Services</h2>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium">Bed Type</label>

            <select className="w-full border rounded-lg p-3 mt-1">
              <option>General Ward</option>
              <option>ICU Bed</option>
              <option>Private Deluxe</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Rate</label>
              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="₹10,000"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Days</label>
              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Diet/Meals</label>
              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="₹500"
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

          {/* Charge Breakdown */}

          <h3 className="font-semibold pt-2">Charge Breakdown</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Room Rent</label>
              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="₹3,500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Nursing Charges</label>
              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="₹1,000"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Total Amount</label>
            <input
              className="w-full border rounded-lg p-3 mt-1"
              defaultValue="₹15,000"
            />
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

export default RoomChargeModal;
