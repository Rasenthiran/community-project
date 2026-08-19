import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { DashboardLayout, PublicLayout } from "../components/layouts";
import { LoadingState } from "../components/common";
import { useAuth } from "../hooks/useAuth";

const lazyNamed = (loader, exportName) =>
  lazy(() => loader().then((module) => ({ default: module[exportName] })));

const Home = lazy(() => import("../pages/public/Home"));
const About = lazyNamed(() => import("../pages/public/PublicPages"), "About");
const Services = lazyNamed(() => import("../pages/public/PublicPages"), "Services");
const Departments = lazyNamed(() => import("../pages/public/PublicPages"), "Departments");
const Doctors = lazyNamed(() => import("../pages/public/PublicPages"), "Doctors");
const DoctorDetails = lazyNamed(() => import("../pages/public/PublicPages"), "DoctorDetails");
const Contact = lazyNamed(() => import("../pages/public/PublicPages"), "Contact");
const FAQ = lazyNamed(() => import("../pages/public/PublicPages"), "FAQ");
const Privacy = lazyNamed(() => import("../pages/public/PublicPages"), "Privacy");
const Terms = lazyNamed(() => import("../pages/public/PublicPages"), "Terms");

const Login = lazyNamed(() => import("../pages/auth/AuthPages"), "Login");
const Register = lazyNamed(() => import("../pages/auth/AuthPages"), "Register");

const PatientDashboard = lazyNamed(() => import("../pages/portals/PatientPages"), "PatientDashboard");
const PatientDoctors = lazyNamed(() => import("../pages/portals/PatientPages"), "PatientDoctors");
const PatientDoctorDetails = lazyNamed(() => import("../pages/portals/PatientPages"), "PatientDoctorDetails");
const BookAppointment = lazyNamed(() => import("../pages/portals/PatientPages"), "BookAppointment");
const PatientAppointments = lazyNamed(() => import("../pages/portals/PatientPages"), "PatientAppointments");
const PatientAppointmentDetails = lazyNamed(() => import("../pages/portals/PatientPages"), "PatientAppointmentDetails");
const PatientProfile = lazyNamed(() => import("../pages/portals/PatientPages"), "PatientProfile");
const PatientPassword = lazyNamed(() => import("../pages/portals/PatientPages"), "PatientPassword");

const DoctorDashboard = lazyNamed(() => import("../pages/portals/DoctorPages"), "DoctorDashboard");
const DoctorAppointments = lazyNamed(() => import("../pages/portals/DoctorPages"), "DoctorAppointments");
const DoctorAppointmentDetails = lazyNamed(() => import("../pages/portals/DoctorPages"), "DoctorAppointmentDetails");
const DoctorProfile = lazyNamed(() => import("../pages/portals/DoctorPages"), "DoctorProfile");
const DoctorAvailability = lazyNamed(() => import("../pages/portals/DoctorPages"), "DoctorAvailability");
const DoctorAccount = lazyNamed(() => import("../pages/portals/DoctorPages"), "DoctorAccount");
const DoctorPassword = lazyNamed(() => import("../pages/portals/DoctorPages"), "DoctorPassword");

const AdminDashboard = lazyNamed(() => import("../pages/portals/AdminPages"), "AdminDashboard");
const AdminUsers = lazyNamed(() => import("../pages/portals/AdminPages"), "AdminUsers");
const AdminUserDetails = lazyNamed(() => import("../pages/portals/AdminPages"), "AdminUserDetails");
const AdminDoctors = lazyNamed(() => import("../pages/portals/AdminPages"), "AdminDoctors");
const AdminDoctorForm = lazyNamed(() => import("../pages/portals/AdminPages"), "AdminDoctorForm");
const AdminDoctorDetails = lazyNamed(() => import("../pages/portals/AdminPages"), "AdminDoctorDetails");
const AdminAppointments = lazyNamed(() => import("../pages/portals/AdminPages"), "AdminAppointments");
const AdminAppointmentDetails = lazyNamed(() => import("../pages/portals/AdminPages"), "AdminAppointmentDetails");
const AdminProfile = lazyNamed(() => import("../pages/portals/AdminPages"), "AdminProfile");
const AdminPassword = lazyNamed(() => import("../pages/portals/AdminPages"), "AdminPassword");

const Unauthorized = lazyNamed(() => import("../pages/system/SystemPages"), "Unauthorized");
const NotFound = lazyNamed(() => import("../pages/system/SystemPages"), "NotFound");

function Protected({ children }) {
  const { isAuthenticated, isBooting } = useAuth();
  const location = useLocation();
  if (isBooting) return <div className="container page-section"><LoadingState /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

function Role({ role, children }) {
  const { user } = useAuth();
  return user?.role === role ? children : <Navigate to="/403" replace />;
}

function Guard({ role, children }) {
  return <Protected><Role role={role}>{children}</Role></Protected>;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="container page-section"><LoadingState rows={5} /></div>}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="departments" element={<Departments />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/:id" element={<DoctorDetails />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<Guard role="patient"><DashboardLayout /></Guard>}>
          <Route path="patient/dashboard" element={<PatientDashboard />} />
          <Route path="patient/doctors" element={<PatientDoctors />} />
          <Route path="patient/doctors/:id" element={<PatientDoctorDetails />} />
          <Route path="patient/appointments/book/:doctorId" element={<BookAppointment />} />
          <Route path="patient/appointments" element={<PatientAppointments />} />
          <Route path="patient/appointments/:id" element={<PatientAppointmentDetails />} />
          <Route path="patient/profile" element={<PatientProfile />} />
          <Route path="patient/change-password" element={<PatientPassword />} />
        </Route>

        <Route element={<Guard role="doctor"><DashboardLayout /></Guard>}>
          <Route path="doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="doctor/appointments" element={<DoctorAppointments />} />
          <Route path="doctor/appointments/:id" element={<DoctorAppointmentDetails />} />
          <Route path="doctor/profile" element={<DoctorProfile />} />
          <Route path="doctor/availability" element={<DoctorAvailability />} />
          <Route path="doctor/account" element={<DoctorAccount />} />
          <Route path="doctor/change-password" element={<DoctorPassword />} />
        </Route>

        <Route element={<Guard role="admin"><DashboardLayout /></Guard>}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/users/:id" element={<AdminUserDetails />} />
          <Route path="admin/doctors" element={<AdminDoctors />} />
          <Route path="admin/doctors/new" element={<AdminDoctorForm />} />
          <Route path="admin/doctors/:id" element={<AdminDoctorDetails />} />
          <Route path="admin/doctors/:id/edit" element={<AdminDoctorForm />} />
          <Route path="admin/appointments" element={<AdminAppointments />} />
          <Route path="admin/appointments/:id" element={<AdminAppointmentDetails />} />
          <Route path="admin/profile" element={<AdminProfile />} />
          <Route path="admin/change-password" element={<AdminPassword />} />
        </Route>

        <Route path="/403" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
