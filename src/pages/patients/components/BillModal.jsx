import React from "react";

const BillModal = ({ setShowBillsModal, bills, billsLoading }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[700px] max-h-[80vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Patient Bills</h2>

          <button
            onClick={() => setShowBillsModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 pb-6 flex-1">

          {billsLoading ? (
            <p className="text-center py-6">Loading bills...</p>
          ) : bills.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No bills found</p>
          ) : (
            <table className="min-w-full text-sm border mt-4">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left">Invoice</th>
                  <th className="px-3 py-2 text-left">Amount</th>
                  <th className="px-3 py-2 text-left">Paid</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id} className="border-t">
                    <td className="px-3 py-2">
                      {bill.invoice_number || "-"}
                    </td>

                    <td className="px-3 py-2">
                      ₹{bill.total_amount}
                    </td>

                    <td className="px-3 py-2">
                      ₹{bill.paid_amount}
                    </td>

                    <td className="px-3 py-2 capitalize">
                      {bill.status}
                    </td>

                    <td className="px-3 py-2">
                      {new Date(bill.issued_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
};

export default BillModal;