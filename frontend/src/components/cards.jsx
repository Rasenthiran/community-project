import { CalendarDays, Clock3, Languages, Stethoscope, UserRound } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Badge } from "./common";
import { formatDate, formatMoney } from "../utils/format";
import "./cards.css";

export function DoctorCard({ doctor, detailsPath, bookingPath }) {
  const details = detailsPath?.(doctor) || `/doctors/${doctor.id}`;
  const booking = bookingPath?.(doctor);
  const initials = doctor.fullName?.split(" ").map(x=>x[0]).slice(0,2).join("") || "DR";
  return <motion.article className="doctor-card" whileHover={{y:-5}} transition={{duration:.2}}>
    <div className="doctor-card__avatar">
      {doctor.profileImage ? <img src={doctor.profileImage} alt={doctor.fullName} loading="lazy"/> : <span>{initials}</span>}
      <i/>
    </div>
    <div className="doctor-card__body">
      <span className="doctor-card__dept"><Stethoscope size={14}/>{doctor.department}</span>
      <h3>{doctor.fullName}</h3>
      <p>{doctor.specialization}</p>
      <div className="doctor-card__meta">
        <span><Languages size={14}/>{doctor.languages?.slice(0,2).join(", ") || "English"}</span>
        <span><CalendarDays size={14}/>{doctor.availableDays?.length || 0} days/week</span>
      </div>
      <div className="doctor-card__footer">
        <strong>{formatMoney(doctor.consultationFee)}</strong>
        <div><Link to={details}>Profile</Link>{booking && <Link className="primary" to={booking}>Book</Link>}</div>
      </div>
    </div>
  </motion.article>;
}

export function AppointmentCard({ appointment, actions, personLabel }) {
  const person = appointment.patient?.fullName || appointment.doctor?.fullName || personLabel || "Appointment";
  return <article className="appointment-card">
    <div className="appointment-card__date"><CalendarDays/><strong>{formatDate(appointment.appointmentDate)}</strong></div>
    <div>
      <div className="flex justify-between gap-12"><h3>{person}</h3><Badge>{appointment.status}</Badge></div>
      <div className="appointment-card__meta">
        <span><Clock3/> {appointment.appointmentStartTime || "Time unavailable"}</span>
        <span><UserRound/> {appointment.doctor?.specialization || appointment.patient?.email || "Clinical appointment"}</span>
      </div>
      {appointment.reason && <p>{appointment.reason}</p>}
    </div>
    {actions && <div className="appointment-card__actions">{actions}</div>}
  </article>;
}

export function StatCard({ icon:Icon, label, value, help }) {
  return <div className="stat-card"><span><Icon/></span><div><small>{label}</small><strong>{value}</strong>{help && <em>{help}</em>}</div></div>;
}
