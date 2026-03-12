import Patients from "../pages/patients/Patients";
import Appointments from "../pages/appointments/Appointments";
import EMR from "../pages/emr/EMR";
import Pharmacy from "../pages/pharmacy/Pharmacy";
import Lab from "../pages/lab/Lab";
import Billing from "../pages/billing/Billing";
import Settings from "../pages/usersettings/Settings";
import OPD from "../pages/opd/OPD";
import Departments from "../pages/departments/Departments";
import Pricing from "../pages/pricing/Pricing";
import DashboardRouter from "../pages/dashboards/DashboardRouter";
import DocAppointmentDetails from "../pages/appointments/doctorAptFlow/DocAppointmentDetails";
import OpdPatients from "../pages/patients/OpdPatients";
import TokenQueue from "../pages/appointments/TokenQueue";
import Refunds from "../pages/billing/Refunds";
import InvoiceCreate from "../pages/billing/InvoiceCreate";
import PendingDues from "../pages/billing/PendingDues";
import BillingReports from "../pages/billing/BillingReports";
import OpdDashboard from "../pages/opd/OpdDashboard";
import VitalsCapture from "../pages/opd/VitalsCapture";
import OpdEncounter from "../pages/opd/OpdEncounter";
import OpdOrders from "../pages/opd/OpdOrders";
import Prescription from "../pages/opd/Prescription";
import OpdDocuments from "../pages/opd/OpdDocuments";
import OpdSummary from "../pages/opd/OpdSummary";
import OPDReports from "../pages/opd/OPDReports";
import IPDDashboard from "../pages/ipd/IPDDashboard";
import IpdAdmissions from "../pages/ipd/IpdAdmissions";
import PackageVariance from "../pages/ipd/PackageVariance";
import IpdRegister from "../pages/ipd/IpdRegister";
import IpdReports from "../pages/ipd/IpdReports";

export const AllRoutes = [
  {
    path: "/dashboard",
    element: <DashboardRouter />,
    // permission: { module: "dashboard", action: "view" },
  },
  {
    path: "/opdDashboard",
    element: <OpdDashboard />,
    permission: { module: "opd", action: "view" },
  },
  {
    path: "/ipdDashboard",
    element: <IPDDashboard />,
    permission: { module: "ward", action: "view" },
  },
  {
    path: "/patients",
    element: <Patients />,
    permission: { module: "patients", action: "view" },
  },
  {
    path: "/opd/patients",
    element: <OpdPatients />,
    permission: { module: "opd", action: "view" },
  },
  {
    path: "/opd/appointments",
    element: <Appointments />,
    permission: { module: "opd", action: "view" },
  },
  {
    path: "/opd/tokenQueue",
    element: <TokenQueue />,
    permission: { module: "opd", action: "view" },
  },
  {
    path: "/opd/vital",
    element: <VitalsCapture />,
    permission: { module: "opd", action: "view" },
  },
  {
    path: "/opd/encounter",
    element: <OpdEncounter />,
    permission: { module: "opd", action: "view" },
  },
  {
    path: "/opd/order",
    element: <OpdOrders />,
    permission: { module: "opd", action: "view" },
  },
  {
    path: "/prescription",
    element: <Prescription />,
    permission: { module: "opd", action: "view" },
  },
  {
    path: "/opd/docs",
    element: <OpdDocuments />,
    permission: { module: "opd", action: "view" },
  },
  {
    path: "/opd/summary",
    element: <OpdSummary />,
    permission: { module: "opd", action: "view" },
  },
  {
    path: "/opd/reports",
    element: <OPDReports />,
    permission: { module: "opd", action: "view" },
  },
  {
    path: "/aptDetails/:aptId",
    element: <DocAppointmentDetails />,
    permission: { module: "opd", action: "view" },
  },
  {
    path: "/emr",
    element: <EMR />,
    permission: { module: "emr", action: "view" },
  },


{
    path: "/ipdAdmissions",
    element: <IpdAdmissions />,
    permission: { module: "ward", action: "view" },
  },
  {
    path: "/packageVariance",
    element: <PackageVariance />,
    permission: { module: "ward", action: "view" },
  },
   {
    path: "/ipdRegister",
    element: <IpdRegister />,
    permission: { module: "ward", action: "view" },
  },
   {
    path: "/ipdReports",
    element: <IpdReports />,
    permission: { module: "ward", action: "view" },
  },




  {
    path: "/pharmacyDashboard",
    element: <Pharmacy />,
    permission: { module: "pharmacy", action: "view" },
  },
  {
    path: "/lab",
    element: <Lab />,
    permission: { module: "lab", action: "view" },
  },
  {
    path: "/billing",
    element: <Billing />,
    permission: { module: "billing", action: "view" },
  },
  {
    path: "/createInvoice",
    element: <InvoiceCreate />,
    permission: { module: "billing", action: "view" },
  },
  {
    path: "/refund",
    element: <Refunds />,
    permission: { module: "billing", action: "view" },
  },
  {
    path: "/dues",
    element: <PendingDues />,
    permission: { module: "billing", action: "view" },
  },
  {
    path: "/billingReports",
    element: <BillingReports />,
    permission: { module: "billing", action: "view" },
  },
  {
    path: "/settings",
    element: <Settings />,
    // permission: { module: "settings", action: "view" },
  },
  {
    path: "/opd",
    element: <OPD />,
    permission: { module: "opd", action: "view" },
  },
  {
    path: "/departments",
    element: <Departments />,
    permission: { module: "departments", action: "view" },
  },
  {
    path: "/pricing",
    element: <Pricing />,
    permission: { module: "pricing", action: "view" },
  },
];

export default AllRoutes;
