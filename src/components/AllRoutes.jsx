import Patients from "../pages/patients/Patients";
import Appointments from "../pages/appointments/Appointments";
import EMR from "../pages/emr/EMR";
import Pharmacy from "../pages/pharmacy/Pharmacy";
import Lab from "../pages/lab/Lab";
import Billing from "../pages/billing/Billing";
import Reports from "../pages/reports/Reports";
import Staff from "../pages/staff/Staff";
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

export const AllRoutes = [
  {
    path: "/dashboard",
    element: <DashboardRouter />,
    // permission: { module: "dashboard", action: "view" },
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
    path: "/pharmacy",
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
    path: "/reports",
    element: <Reports />,
    permission: { module: "reports", action: "view" },
  },
  {
    path: "/staff",
    element: <Staff />,
    permission: { module: "staff", action: "view" },
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

export default AllRoutes
