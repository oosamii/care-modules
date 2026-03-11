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
  BookCopy,
} from "lucide-react";

export const sidebarItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },

  // {
  //   label: "OPD",
  //   icon: Stethoscope,
  //   permission: { module: "opd", action: "view" },
  //   children: [
  //     {
  //       label: "Appointments",
  //       path: "/opd/appointments",
  //       icon: CalendarDays,
  //       permission: { module: "opd", action: "view" },
  //     },
  //     {
  //       label: "OPD",
  //       path: "/opd/patients",
  //       icon: Users,
  //       permission: { module: "opd", action: "view" },
  //     },
  //     {
  //       label: "Token Queue",
  //       path: "/opd/tokenQueue",
  //       icon: Users,
  //       permission: { module: "departments", action: "view" },
  //     },
  //   ],
  // },
  
  {
    label: "Appointments",
    path: "/opd/appointments",
    icon: CalendarDays,
    permission: { module: "opd", action: "view" },
  },
  {
    label: "OPD",
    path: "/opd/patients",
    icon: Users,
    permission: { module: "opd", action: "view" },
  },
  {
    label: "Token Queue",
    path: "/opd/tokenQueue",
    icon: Users,
    permission: { module: "departments", action: "view" },
  },
  {
    label: "Patients",
    path: "/patients",
    icon: Users,
    permission: { module: "patients", action: "view" },
  },

  {
    label: "Departments",
    path: "/departments",
    icon: Building2,
    permission: { module: "departments", action: "view" },
  },
  {
    label: "Charge Entry",
    path: "/pricing",
    icon: IndianRupee,
    permission: { module: "pricing", action: "view" },
  },
  {
    label: "Invoice Create",
    path: "/createInvoice",
    icon: ScrollText ,
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
    icon: BookCopy ,
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
