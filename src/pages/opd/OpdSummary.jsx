import BillingHandoffStatus from "./opd_components/opdsummary/BillingHandoffStatus";
import ClinicalSummary from "./opd_components/opdsummary/ClinicalSummary";
import FollowUpCard from "./opd_components/opdsummary/FollowUpCard";
import OrdersInvestigations from "./opd_components/opdsummary/OrdersInvestigations";
import PatientHeader from "./opd_components/opdsummary/PatientHeader";
import PrescriptionCard from "./opd_components/opdsummary/PrescriptionCard";

const OpdSummary = () => {
  const patient = {
    name: "Michael Ross",
    uhid: "P-98234",
    age: 45,
    gender: "Male",
    allergy: "Penicillin",
    vitals: "BP 120/80 • HR 72 • Temp 98.6°F",
    doctor: "Dr. Sarah Smith",
    dept: "Internal Medicine",
    visitId: "VS-20231012-04",
    date: "12 Oct 2023, 10:30 AM",
  };

  const diagnosis = {
    primary: "Acute Bronchitis (J20.9)",
    secondary: "Essential Hypertension (I10)",
  };

  const notes =
    "Patient presented with a persistent cough for the last 5 days, accompanied by mild fever and shortness of breath. Chest auscultation reveals bilateral rhonchi. BP is slightly elevated today. Advised rest and prescribed antibiotics. Advised to monitor BP readings at home.";

  const orders = [
    { name: "Chest X-Ray", type: "Radiology", status: "Ordered" },
    { name: "CBC", type: "Lab Test", status: "Collected" },
    { name: "Blood Sugar (Fasting)", type: "Lab Test", status: "Pending" },
  ];

  const prescription = [
    { drug: "Amoxicillin 500mg Tab", dosage: "1-1-1 (TID)" },
    { drug: "Paracetamol 650mg Tab", dosage: "1-0-1 (BID)" },
    { drug: "Ambroxol Syrup 5ml", dosage: "1-0-1 (BID)" },
  ];

  const followup = {
    date: "19 Oct 2023",
    text: "Please come with fasting blood sugar reports and pending results. Monitor fever daily.",
  };

  const billing = {
    consultation: "Completed",
    investigations: "Pending",
    pharmacy: "Not Billed",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Visit Summary</h1>

      <PatientHeader patient={patient} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-7 space-y-6">
          <ClinicalSummary diagnosis={diagnosis} notes={notes} />
          <OrdersInvestigations orders={orders} />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 space-y-6">
          <PrescriptionCard prescription={prescription} />
          <FollowUpCard followup={followup} />
          <BillingHandoffStatus billing={billing} />
        </div>
      </div>
    </div>
  );
};

export default OpdSummary;
