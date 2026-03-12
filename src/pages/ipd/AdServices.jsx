import React, { useState } from "react";
import Breadcrumb from "./components/Breadcrumb";
import RoomChargeModal from "./components/RoomChargeModal";
import Section from "./components/Section";
import ServiceCaptureModal from "./components/ServiceCaptureModal";
import ConsumableModal from "./components/ConsumableModal";
import DepositModal from "./components/DepositModal";
import RunningBillModal from "./components/RunningBillModal";
import SettlementConfigModal from "./components/SettlementConfigModal";

const AdServices = () => {
  const [openRoomModal, setOpenRoomModal] = useState(false);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [openConsumableModal, setOpenConsumableModal] = useState(false);
  const [openDepositModal, setOpenDepositModal] = useState(false);
  const [openBillModal, setOpenBillModal] = useState(false);
  const [openSettlementModal, setOpenSettlementModal] = useState(false);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { name: "IPD" },
          { name: "Admission", path: "/ipdAdmissions" },
          { name: "Services" },
        ]}
      />

      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-gray-900">Services</h1>

      {/* Patient Summary */}
      <div className="bg-white border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
            RK
          </div>

          <div>
            <h3 className="font-semibold text-lg">Ramesh Kumar</h3>

            <p className="text-sm text-gray-500">
              UHID-99201 · ICU Bed 04 · Adm: 10-Oct-2023
            </p>
          </div>

          <span className="px-3 py-1 text-xs bg-green-500 text-white rounded-full">
            Active
          </span>
        </div>

        <div className="text-sm text-gray-600">
          <span className="mr-8">
            Current Total <br />
            <span className="text-lg font-semibold text-black">₹ 1,20,500</span>
          </span>
        </div>
      </div>

      {/* Bed Charges */}
      <Section
        title="Bed & Room Charges"
        button="+ Add Charge"
        onButtonClick={() => setOpenRoomModal(true)}
        columns={["Date", "Room Type", "Rate/Day", "Days", "Amount", "Status"]}
        rows={[
          ["10-Oct-2023", "ICU Bed", "₹ 15,000", "1", "₹ 15,000", "Posted"],
        ]}
      />

      {openRoomModal && (
        <RoomChargeModal onClose={() => setOpenRoomModal(false)} />
      )}

      {/* Service Captures */}
      <Section
        title="Service Captures"
        button="+ Add Service"
        onButtonClick={() => setOpenServiceModal(true)}
        columns={[
          "Date",
          "Service Category",
          "Description",
          "Qty",
          "Amount",
          "Status",
        ]}
        rows={[
          [
            "10-Oct-2023",
            "Doctor Rounds",
            "Initial Consultation (Dr. Sharma)",
            "1",
            "₹ 2,000",
            "Posted",
          ],
          [
            "11-Oct-2023",
            "Nursing",
            "Specialized Nursing Care",
            "1",
            "₹ 1,500",
            "Posted",
          ],
        ]}
      />

      {openServiceModal && (
        <ServiceCaptureModal onClose={() => setOpenServiceModal(false)} />
      )}

      {/* Consumables */}
      <Section
        title="Consumables Ledger"
        button="+ Add Consumable"
        onButtonClick={() => setOpenConsumableModal(true)}
        columns={[
          "Issue Date",
          "Item Description",
          "Issue No",
          "Qty",
          "Amount",
          "Status",
        ]}
        rows={[
          [
            "10-Oct-2023",
            "IV Set (Standard)",
            "ISS-8812",
            "2",
            "₹ 300",
            "Posted",
          ],
          [
            "11-Oct-2023",
            "Surgical Gloves Box",
            "ISS-8901",
            "1",
            "₹ 450",
            "Posted",
          ],
        ]}
      />

      {openConsumableModal && (
        <ConsumableModal onClose={() => setOpenConsumableModal(false)} />
      )}

      {/* Deposits */}
      <Section
        title="Deposits & Advances"
        button="+ Add Deposit"
        onButtonClick={() => setOpenDepositModal(true)}
        columns={[
          "Date",
          "Receipt No",
          "Method",
          "Amount",
          "Utilized",
          "Balance",
        ]}
        rows={[
          ["10-Oct-2023", "DEP-9932", "UPI", "₹ 50,000", "₹ 50,000", "₹ 0"],
        ]}
      />

      {openDepositModal && (
        <DepositModal onClose={() => setOpenDepositModal(false)} />
      )}

      {/* Running Bill */}
      <Section
        title="Running Bill Summary"
        button="Edit Bill Details"
        onButtonClick={() => setOpenBillModal(true)}
        columns={[
          "Category",
          "Total Amount",
          "Discount",
          "Net Amount",
          "Status",
        ]}
        rows={[
          ["Room/Bed Charges", "₹ 45,000", "₹ 0", "₹ 45,000", "Active"],
          ["Service Charges", "₹ 3,500", "₹ 0", "₹ 3,500", "Active"],
          ["Consumables & Pharmacy", "₹ 750", "₹ 0", "₹ 750", "Active"],
        ]}
      />

      {openBillModal && (
        <RunningBillModal onClose={() => setOpenBillModal(false)} />
      )}

      {/* Discharge Settlement */}
      <div className="bg-white border rounded-xl p-4 space-y-4">
        <h3 className="font-semibold">Discharge Settlement</h3>

        <p className="text-sm text-gray-500">
          Patient is currently admitted. Complete pending postings before
          initiating final discharge settlement.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Final Bill Status</p>
            <p className="font-semibold">Not Generated</p>
          </div>

          <div>
            <p className="text-gray-500">Pending Items</p>
            <p className="font-semibold">4 Items to Post</p>
          </div>

          <div>
            <p className="text-gray-500">Settlement Action</p>
            <p
              onClick={() => setOpenSettlementModal(true)}
              className="text-blue-600 cursor-pointer"
            >
              Edit Settlement Config
            </p>
          </div>
        </div>

        {openSettlementModal && (
          <SettlementConfigModal
            onClose={() => setOpenSettlementModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdServices;
