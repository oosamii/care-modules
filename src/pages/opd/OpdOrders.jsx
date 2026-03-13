import { useState } from "react";
import {
  OrdersHeader,
  OrdersFilterBar,
  OrdersTable,
  CriticalResults,
  QuickOrderSets,
  NewOrderModal,
} from "./opd_components/OrdersComponents";

export default function OpdOrders() {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
  });

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="space-y-4">
      <OrdersHeader onNewOrder={() => setOpenModal(true)} />

      <OrdersFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <OrdersTable filters={filters} />
        </div>

        <div className="lg:col-span-4 space-y-4">
          <CriticalResults />
          <QuickOrderSets />
        </div>
      </div>

      <NewOrderModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
