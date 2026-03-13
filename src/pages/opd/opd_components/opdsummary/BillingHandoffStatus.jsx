import { BadgeDollarSign, CheckCircle, ExternalLink } from "lucide-react";

const BillingHandoffStatus = ({ billing }) => {
  return (
    <div className="bg-white border rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b font-semibold text-gray-800">
        <BadgeDollarSign size={18} className="text-gray-500" />
        Billing Handoff Status
      </div>

      {/* Status */}
      <div className="p-5 flex items-start gap-4">
        {/* Green Icon */}
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircle size={20} className="text-green-600" />
        </div>

        {/* Text */}
        <div>
          <div className="font-semibold text-gray-800">Sent to Billing</div>

          <div className="text-gray-500 text-sm">
            Invoice #{billing.invoice}
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="p-4 pt-0">
        <button className="w-full flex items-center justify-center gap-2 border rounded-lg py-2 text-sm font-medium hover:bg-gray-50">
          <ExternalLink size={16} />
          View Invoice Details
        </button>
      </div>
    </div>
  );
};

export default BillingHandoffStatus;
