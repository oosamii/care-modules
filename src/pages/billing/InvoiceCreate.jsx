import React, { useState } from "react";
import { Trash2, Pencil, CheckCircle, AlertTriangle } from "lucide-react";

const InvoiceCreate = () => {
  const [invoiceType, setInvoiceType] = useState("OPD");
  const [payer, setPayer] = useState("Self");

  const [items, setItems] = useState([
    {
      id: 1,
      name: "Consultation - General Physician",
      code: "SRV-1001",
      qty: 1,
      price: 500,
      tax: 0,
      discount: 0,
    },
    {
      id: 2,
      name: "Complete Blood Count (CBC)",
      code: "LAB-2041",
      qty: 1,
      price: 350,
      tax: 0,
      discount: 0,
    },
  ]);

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: Number(value) } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateNet = (item) => {
    const subtotal = item.qty * item.price;
    return subtotal + item.tax - item.discount;
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const totalTax = items.reduce((acc, item) => acc + item.tax, 0);

  const totalDiscount = items.reduce((acc, item) => acc + item.discount, 0);

  const grandTotal = subtotal + totalTax - totalDiscount;

  return (
    <div className=" bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">Create Invoice</h1>

      {/* PATIENT + ENCOUNTER */}
      <div className="bg-white border rounded-xl p-4 flex flex-col lg:flex-row justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt=""
            className="w-12 h-12 rounded-full"
          />

          <div>
            <p className="font-semibold">James Cooper</p>
            <p className="text-sm text-gray-500">
              UHID: 490211 • Male, 42y • Ph: +1 555 9021
            </p>
          </div>
        </div>

        <div className="w-full lg:w-72">
          <label className="text-xs text-gray-500">Encounter</label>
          <select className="w-full border rounded-lg px-3 py-2">
            <option>OPD Visit - 24 Oct (Dr. Smith)</option>
          </select>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* INVOICE DETAILS */}
          <div className="bg-white border rounded-xl">

            <div className="border-b p-4 font-semibold">
              Invoice Details
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

              <div>
                <label className="text-sm text-gray-500">
                  Invoice Type
                </label>
                <select
                  value={invoiceType}
                  onChange={(e) => setInvoiceType(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option>OPD</option>
                  <option>IPD</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500">Payer</label>
                <select
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option>Self</option>
                  <option>Insurance</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Billing Date
                </label>
                <input
                  type="datetime-local"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

            </div>

          </div>

          {/* LINE ITEMS */}
          <div className="bg-white border rounded-xl">

            <div className="border-b p-4 font-semibold">
              Line Items
            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">Qty</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Tax</th>
                    <th className="p-3 text-left">Discount</th>
                    <th className="p-3 text-left">Net</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>

                  {items.map((item) => (
                    <tr key={item.id} className="border-t">

                      <td className="p-3">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.code}
                        </p>
                      </td>

                      <td className="p-3">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(item.id, "qty", e.target.value)
                          }
                          className="border rounded px-2 py-1 w-16"
                        />
                      </td>

                      <td className="p-3">₹{item.price}</td>

                      <td className="p-3">₹{item.tax}</td>

                      <td className="p-3">
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) =>
                            updateItem(item.id, "discount", e.target.value)
                          }
                          className="border rounded px-2 py-1 w-20"
                        />
                      </td>

                      <td className="p-3 font-semibold">
                        ₹{calculateNet(item)}
                      </td>

                      <td className="p-3 flex gap-2">
                        <button className="text-gray-500">
                          <Pencil size={16} />
                        </button>

                        <button
                          className="text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

            {/* TOTALS */}
            <div className="border-t p-4 flex flex-col items-end gap-1 text-sm">

              <p>Subtotal: ₹{subtotal}</p>
              <p>Tax: ₹{totalTax}</p>
              <p>Discount: ₹{totalDiscount}</p>

              <p className="font-bold text-lg">
                Total: ₹{grandTotal}
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="bg-white border rounded-xl h-fit">

          <div className="border-b p-4 font-semibold">
            Rule Checks
          </div>

          <div className="p-4 space-y-4">

            <div className="flex gap-3">
              <CheckCircle className="text-green-500" />
              <div>
                <p className="font-medium">Discount Approval</p>
                <p className="text-sm text-gray-500">
                  No discount applied. Approval not required.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="text-green-500" />
              <div>
                <p className="font-medium">Price Overrides</p>
                <p className="text-sm text-gray-500">
                  Standard base prices are used.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <AlertTriangle className="text-yellow-500" />
              <div>
                <p className="font-medium">Missing Information</p>
                <p className="text-sm text-gray-500">
                  Referring doctor missing for radiology items.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default InvoiceCreate;