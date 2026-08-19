import { CalendarDays, Clock3, KeyRound, LayoutDashboard, Search, ShieldCheck, Stethoscope, UserRound, Users } from "lucide-react";

export const portalNavigation = {
  patient: [
    { label: "Dashboard", to: "/patient/dashboard", icon: LayoutDashboard },
    { label: "Find Doctors", to: "/patient/doctors", icon: Search },
    { label: "Appointments", to: "/patient/appointments", icon: CalendarDays },
    { label: "Profile", to: "/patient/profile", icon: UserRound },
    { label: "Change Password", to: "/patient/change-password", icon: KeyRound },
  ],
  doctor: [
    { label: "Dashboard", to: "/doctor/dashboard", icon: LayoutDashboard },
    { label: "Appointments", to: "/doctor/appointments", icon: CalendarDays },
    { label: "Professional Profile", to: "/doctor/profile", icon: Stethoscope },
    { label: "Availability", to: "/doctor/availability", icon: Clock3 },
    { label: "Account", to: "/doctor/account", icon: UserRound },
    { label: "Change Password", to: "/doctor/change-password", icon: KeyRound },
  ],
  admin: [
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", to: "/admin/users", icon: Users },
    { label: "Doctors", to: "/admin/doctors", icon: Stethoscope },
    { label: "Appointments", to: "/admin/appointments", icon: CalendarDays },
    { label: "Profile", to: "/admin/profile", icon: ShieldCheck },
    { label: "Change Password", to: "/admin/change-password", icon: KeyRound },
  ],
};
