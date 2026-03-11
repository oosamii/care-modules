import {
  LayoutDashboard,
  Users,
  ClockFading,
  FlaskConical,
  ScrollText,
  ReceiptText,
  Building2,
  IndianRupee,
  CalendarDays,
  Settings,
  Undo2,
  ArrowUp10,
  BookCopy,
  SquareActivity,
  FileUser,
  Stethoscope,
  Pill,
  FileText
} from "lucide-react";

export const sidebarItems = [
  // {
  //   label: "Dashboard",
  //   path: "/dashboard",
  //   icon: LayoutDashboard,
  // },

  {
    label: "Dashboard",
    path: "/opdDashboard",
    icon: LayoutDashboard,
    permission: { module: "opd", action: "view" },
  },
  {
    label: "Patient Directory",
    path: "/patients",
    icon: Users,
    permission: { module: "patients", action: "view" },
  },
  {
    label: "Appointments",
    path: "/opd/appointments",
    icon: CalendarDays,
    permission: { module: "opd", action: "view" },
  },
  {
    label: "Token Queue",
    path: "/opd/tokenQueue",
    icon: ArrowUp10,
    permission: { module: "opd", action: "view" },
  },
  {
    label: "Vitals",
    path: "/opd/vital",
    icon: SquareActivity,
    permission: { module: "opd", action: "view" },
  },
  {
    label: "Encounter",
    path: "/opd/encounter",
    icon: Stethoscope,
    permission: { module: "opd", action: "view" },
  },

  // this views the patients who hv appointment in hospital ---- uncomment when needed

  // {
  //   label: "OPD Patients",
  //   path: "/opd/patients",
  //   icon: Users,
  //   permission: { module: "opd", action: "view" },
  // },
  {
    label: "Orders",
    path: "/opd/order",
    icon: FileUser,
    permission: { module: "opd", action: "view" },
  },
  {
    label: "Prescription",
    path: "/prescription",
    icon: Pill,
    permission: { module: "opd", action: "view" },
  },
  {
    label: "Documents",
    path: "/opd/docs",
    icon: FileText ,
    permission: { module: "opd", action: "view" },
  },
    {
    label: "Visit Summary",
    path: "/opd/summary",
    icon: FileText ,
    permission: { module: "opd", action: "view" },
  },
    {
    label: "Reports",
    path: "/opd/reports",
    icon: FileText ,
    permission: { module: "opd", action: "view" },
  },

  // this views the departments in hospital ---- uncomment when needed

  // {
  //   label: "Departments",
  //   path: "/departments",
  //   icon: Building2,
  //   permission: { module: "departments", action: "view" },
  // },
  {
    label: "Charge Entry",
    path: "/pricing",
    icon: IndianRupee,
    permission: { module: "pricing", action: "view" },
  },
  {
    label: "Invoice Create",
    path: "/createInvoice",
    icon: ScrollText,
    permission: { module: "billing", action: "view" },
  },
  {
    label: "Refunds",
    path: "/refund",
    icon: Undo2,
    permission: { module: "billing", action: "view" },
  },
  {
    label: "Pending Dues",
    path: "/dues",
    icon: ClockFading,
    permission: { module: "billing", action: "view" },
  },
  {
    label: "Billing Register",
    path: "/billing",
    icon: ReceiptText,
    permission: { module: "billing", action: "view" },
  },
  {
    label: "Reports",
    path: "/billingReports",
    icon: BookCopy,
    permission: { module: "billing", action: "view" },
  },

  {
    label: "Lab",
    path: "/lab",
    icon: FlaskConical,
    permission: { module: "lab", action: "view" },
  },

  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
