import { X } from "lucide-react";

const ServiceCaptureModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">Service Captures</h2>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Consultant */}
          <div>
            <label className="text-sm font-medium">Consultant</label>

            <select className="w-full border rounded-lg p-3 mt-1">
              <option>Dr. Arvind Rao</option>
              <option>Dr. Sharma</option>
            </select>
          </div>

          {/* Round Date + Service */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Round Date</label>
              <input
                type="date"
                className="w-full border rounded-lg p-3 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Service</label>
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

          {/* Total */}
          <div>
            <label className="text-sm font-medium">Total Amount</label>
            <input
              className="w-full border rounded-lg p-3 mt-1"
              defaultValue="₹ 15,000"
            />
          </div>

          {/* Captured info */}
          <div className="bg-blue-50 rounded-lg p-4 text-sm space-y-2">
            <div className="flex items-center gap-4 text-gray-600">
              <span>Captured by: Dr. Sunita Sharma</span>
              <span>•</span>
              <span>12 Oct 2023, 10:45 AM</span>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <span className="font-medium">Clinical Note:</span> Patient is
              stable. Recommended continuing current medication for 2 more days.
              Follow up tomorrow.
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

export default ServiceCaptureModal;
