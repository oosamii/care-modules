import { X } from "lucide-react";
import { useState } from "react";

const SettlementConfigModal = ({ onClose }) => {
  const [readyForBill, setReadyForBill] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">
            Edit Settlement Configuration
          </h2>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Payer Type */}
          <div>
            <label className="text-sm font-medium">Payer Type</label>

            <select className="w-full border rounded-lg p-3 mt-1">
              <option>Insurance / TPA</option>
              <option>Self Pay</option>
              <option>Corporate</option>
            </select>
          </div>

          {/* Insurance Provider + Policy */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Insurance Provider</label>

              <select className="w-full border rounded-lg p-3 mt-1">
                <option>Star Health Allied Insurance</option>
                <option>ICICI Lombard</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Policy Number</label>

              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="SH-2099-102948-AB"
              />
            </div>
          </div>

          {/* Pre Auth + Co Pay */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Approved Pre-auth Amount
              </label>

              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="₹ 1,00,000"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Expected Co-pay / Deductible
              </label>

              <input
                className="w-full border rounded-lg p-3 mt-1"
                defaultValue="₹ 10,000"
              />
            </div>
          </div>

          {/* Toggle */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Discharge Status Indicator</p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setReadyForBill(!readyForBill)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  readyForBill ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    readyForBill ? "translate-x-6" : ""
                  }`}
                />
              </button>

              <span className="text-sm">Ready for Final Bill Generation</span>
            </div>

            <p className="text-xs text-gray-500">
              Toggle this when all ward and service charges are verified and
              posted.
            </p>
          </div>

          {/* Settlement Note */}
          <div>
            <label className="text-sm font-medium">Settlement Note</label>

            <textarea
              rows="4"
              className="w-full border rounded-lg p-3 mt-1"
              defaultValue="Pre-auth approved for 1L. Patient will bear the remaining consumables and non-medical items as per policy exclusions."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettlementConfigModal;
