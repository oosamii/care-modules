import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FlaskConical,
  CreditCard,
  Building2,
  IndianRupee,
  CalendarDays,
  Settings,
} from "lucide-react";

export const sidebarItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "OPD",
    icon: Stethoscope,
    permission: { module: "opd", action: "view" },
    children: [
      {
        label: "Appointments",
        path: "/opd/appointments",
        icon: CalendarDays,
        permission: { module: "opd", action: "view" },
      },
      {
        label: "Patients",
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
    ],
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
    label: "Bills",
    path: "/billing",
    icon: CreditCard,
    permission: { module: "billing", action: "view" },
  },

  {
    label: "Pricings",
    path: "/pricing",
    icon: IndianRupee,
    permission: { module: "pricing", action: "view" },
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
