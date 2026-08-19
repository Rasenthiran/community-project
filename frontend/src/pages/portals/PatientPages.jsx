import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { CalendarCheck2, CalendarClock, CalendarDays, Search } from "lucide-react";
import { toast } from "sonner";
import { AppointmentCard, DoctorCard, StatCard } from "../../components/cards";
import { Badge, Button, EmptyState, Input, LoadingState, Pagination, Select, Textarea } from "../../components/common";
import { PageHeading } from "../../components/layouts";
import { appointmentSchema, passwordSchema, profileSchema } from "../../schemas";
import { doctorService, patientAppointmentService, userService } from "../../services";
import { getErrorMessage } from "../../utils/errorHandler";
import { formatDate, formatMoney } from "../../utils/format";
import { useAuth } from "../../hooks/useAuth";
import { useDebounce } from "../../hooks/useDebounce";

export function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const q = useQuery({ queryKey:["patient-appointments","dashboard"], queryFn:()=>patientAppointmentService.list({page:1,limit:8}) });
  const items = q.data?.items || [];
  const count = s => items.filter(a=>a.status===s).length;
  return <>
    <PageHeading title={`Welcome, ${user?.fullName?.split(" ")[0] || "Patient"}`} description="Manage your appointments and find the right doctor." actions={<Button onClick={()=>navigate("/patient/doctors")}><Search size={17}/>Find Doctor</Button>}/>
    <div className="stat-grid">
      <StatCard icon={CalendarDays} label="Loaded appointments" value={items.length}/>
      <StatCard icon={CalendarClock} label="Pending" value={count("pending")}/>
      <StatCard icon={CalendarCheck2} label="Confirmed" value={count("confirmed")}/>
      <StatCard icon={CalendarCheck2} label="Completed" value={count("completed")}/>
    </div>
    <section className="panel"><div className="panel-heading"><h2>Recent appointments</h2><Button size="sm" variant="secondary" onClick={()=>navigate("/patient/appointments")}>View all</Button></div>
      {q.isLoading ? <LoadingState/> : <div className="appointment-list">{items.slice(0,5).map(a=><AppointmentCard key={a.id} appointment={a} personLabel={a.doctor?.specialization || "Doctor appointment"}/>)}</div>}
    </section>
  </>;
}

export function PatientDoctors() {
  const [search,setSearch] = useState("");
  const debounced = useDebounce(search);
  const q = useQuery({ queryKey:["patient-doctors",debounced], queryFn:()=>doctorService.list({page:1,limit:50,search:debounced||undefined}) });
  return <>
    <PageHeading title="Find doctors" description="Search active doctors from the real backend directory."/>
    <div className="panel mb-24"><Input label="Search" placeholder="Name, specialty or department" value={search} onChange={e=>setSearch(e.target.value)}/></div>
    {q.isLoading ? <LoadingState/> : !q.data?.items?.length ? <EmptyState title="No doctors found"/> : <div className="doctor-grid">{q.data.items.map(d=><DoctorCard key={d.id} doctor={d} detailsPath={x=>`/patient/doctors/${x.id}`} bookingPath={x=>`/patient/appointments/book/${x.id}`}/>)}</div>}
  </>;
}

export function PatientDoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const q = useQuery({ queryKey:["patient-doctor",id], queryFn:()=>doctorService.get(id) });
  if (q.isLoading) return <LoadingState/>;
  const d = q.data;
  return <>
    <PageHeading title={d.fullName} description={`${d.specialization} · ${d.department}`} actions={<Button onClick={()=>navigate(`/patient/appointments/book/${d.id}`)}>Book Appointment</Button>}/>
    <div className="grid grid-2">
      <div className="panel"><h2>Professional profile</h2><div className="detail-list">
        <div className="detail-item"><small>Experience</small><strong>{d.yearsOfExperience} years</strong></div>
        <div className="detail-item"><small>Fee</small><strong>{formatMoney(d.consultationFee)}</strong></div>
        <div className="detail-item"><small>Languages</small><strong>{d.languages.join(", ") || "—"}</strong></div>
        <div className="detail-item"><small>Duration</small><strong>{d.slotDurationMinutes} minutes</strong></div>
      </div></div>
      <div className="panel"><h2>Availability</h2><p>{d.availableDays.join(", ") || "Availability not configured"}</p><p><strong>{d.workingHours?.startTime || "—"} – {d.workingHours?.endTime || "—"}</strong></p></div>
    </div>
  </>;
}

export function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const doctor = useQuery({ queryKey:["doctor-booking",doctorId], queryFn:()=>doctorService.get(doctorId) });
  const { register,handleSubmit,formState:{errors} } = useForm({ resolver:zodResolver(appointmentSchema) });
  const mutation = useMutation({
    mutationFn: values => patientAppointmentService.create({doctorId,...values}),
    onSuccess:()=>{ toast.success("Appointment booked successfully."); qc.invalidateQueries({queryKey:["patient-appointments"]}); navigate("/patient/appointments"); },
    onError:e=>toast.error(getErrorMessage(e,"Unable to book this appointment.")),
  });
  if (doctor.isLoading) return <LoadingState/>;
  const d = doctor.data;
  return <>
    <PageHeading title="Book appointment" description={`Schedule your consultation with ${d.fullName}.`}/>
    <div className="grid grid-2">
      <div className="panel"><h2>{d.fullName}</h2><p>{d.specialization} · {d.department}</p><div className="detail-list">
        <div className="detail-item"><small>Fee</small><strong>{formatMoney(d.consultationFee)}</strong></div>
        <div className="detail-item"><small>Duration</small><strong>{d.slotDurationMinutes} min</strong></div>
        <div className="detail-item full-span"><small>Available days</small><strong>{d.availableDays.join(", ") || "Not configured"}</strong></div>
        <div className="detail-item full-span"><small>Working hours</small><strong>{d.workingHours?.startTime || "—"} – {d.workingHours?.endTime || "—"}</strong></div>
      </div></div>
      <form className="panel form-stack" onSubmit={handleSubmit(v=>mutation.mutate(v))}>
        <h2>Appointment details</h2>
        <Input label="Date" type="date" error={errors.appointmentDate?.message} {...register("appointmentDate")}/>
        <Input label="Start time" type="time" error={errors.appointmentStartTime?.message} {...register("appointmentStartTime")}/>
        <Textarea label="Reason (optional)" maxLength={500} error={errors.reason?.message} {...register("reason")}/>
        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending?"Booking...":"Confirm Appointment"}</Button>
      </form>
    </div>
  </>;
}

export function PatientAppointments() {
  const [page,setPage] = useState(1);
  const [status,setStatus] = useState("");
  const q = useQuery({ queryKey:["patient-appointments",page,status], queryFn:()=>patientAppointmentService.list({page,limit:10,status:status||undefined}) });
  return <>
    <PageHeading title="My appointments" description="Review upcoming and previous appointments."/>
    <div className="panel mb-24"><Select label="Status" value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}><option value="">All statuses</option>{["pending","confirmed","completed","cancelled","rejected"].map(s=><option key={s}>{s}</option>)}</Select></div>
    {q.isLoading ? <LoadingState/> : !q.data?.items?.length ? <EmptyState title="No appointments found" message="Book a doctor to begin your appointment history."/> : <>
      <div className="appointment-list">{q.data.items.map(a=><AppointmentCard key={a.id} appointment={a} personLabel={a.doctor?.specialization || "Doctor appointment"} actions={<Link to={`/patient/appointments/${a.id}`}><Button size="sm" variant="secondary">Details</Button></Link>}/>)}</div>
      <Pagination pagination={q.data.pagination} page={page} onPage={setPage}/>
    </>}
  </>;
}

export function PatientAppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const q = useQuery({ queryKey:["patient-appointment",id], queryFn:()=>patientAppointmentService.get(id) });
  const doctor = useQuery({ queryKey:["appointment-doctor",q.data?.doctorId], queryFn:()=>doctorService.get(q.data.doctorId), enabled:Boolean(q.data?.doctorId) });
  const cancel = useMutation({
    mutationFn:()=>patientAppointmentService.cancel(id,"Cancelled by patient from portal"),
    onSuccess:()=>{ toast.success("Appointment cancelled."); q.refetch(); qc.invalidateQueries({queryKey:["patient-appointments"]}); },
    onError:e=>toast.error(getErrorMessage(e)),
  });
  if (q.isLoading) return <LoadingState/>;
  const a = q.data;
  return <>
    <PageHeading title="Appointment details" description="Related doctor information is fetched separately because this backend detail endpoint returns raw IDs." actions={<Button variant="secondary" onClick={()=>navigate("/patient/appointments")}>Back</Button>}/>
    <div className="panel">
      <div className="panel-heading"><h2>{doctor.data?.fullName || doctor.data?.specialization || "Doctor appointment"}</h2><Badge>{a.status}</Badge></div>
      <div className="detail-list">
        <div className="detail-item"><small>Date</small><strong>{formatDate(a.appointmentDate)}</strong></div>
        <div className="detail-item"><small>Time</small><strong>{a.appointmentStartTime || "—"}</strong></div>
        <div className="detail-item"><small>Department</small><strong>{doctor.data?.department || "—"}</strong></div>
        <div className="detail-item"><small>Specialization</small><strong>{doctor.data?.specialization || "—"}</strong></div>
        <div className="detail-item full-span"><small>Reason</small><strong>{a.reason || "No reason supplied"}</strong></div>
      </div>
      {["pending","confirmed"].includes(a.status) && <Button className="mt-24" variant="danger" onClick={()=>cancel.mutate()} disabled={cancel.isPending}>Cancel Appointment</Button>}
    </div>
  </>;
}

function ProfileForm() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey:["me"], queryFn:userService.me });
  const { register,handleSubmit,reset,formState:{errors} } = useForm({ resolver:zodResolver(profileSchema) });
  useEffect(()=>{ if(q.data) reset(q.data); },[q.data,reset]);
  const m = useMutation({ mutationFn:userService.update, onSuccess:d=>{qc.setQueryData(["me"],d);toast.success("Profile updated successfully.");}, onError:e=>toast.error(getErrorMessage(e)) });
  if (q.isLoading) return <LoadingState/>;
  return <form className="panel form-stack" onSubmit={handleSubmit(v=>m.mutate(v))}>
    <div className="form-grid">
      <Input label="Full name" error={errors.fullName?.message} {...register("fullName")}/>
      <Input label="Phone number" error={errors.phoneNumber?.message} {...register("phoneNumber")}/>
      <Input label="Address" error={errors.address?.message} {...register("address")}/>
      <Input label="City" error={errors.city?.message} {...register("city")}/>
      <Input label="Emergency contact name" {...register("emergencyContactName")}/>
      <Input label="Emergency contact phone" {...register("emergencyContactPhone")}/>
    </div>
    <div className="detail-list"><div className="detail-item"><small>Email (read only)</small><strong>{q.data?.email || "—"}</strong></div><div className="detail-item"><small>Role (read only)</small><strong>{q.data?.role || "—"}</strong></div></div>
    <Button type="submit" disabled={m.isPending}>{m.isPending?"Saving...":"Save Changes"}</Button>
  </form>;
}

function PasswordForm() {
  const { register,handleSubmit,reset,formState:{errors} } = useForm({ resolver:zodResolver(passwordSchema) });
  const m = useMutation({ mutationFn:userService.changePassword, onSuccess:()=>{toast.success("Password changed successfully.");reset();}, onError:e=>toast.error(getErrorMessage(e)) });
  return <form className="panel form-stack" onSubmit={handleSubmit(v=>m.mutate(v))}>
    <Input label="Current password" type="password" error={errors.currentPassword?.message} {...register("currentPassword")}/>
    <Input label="New password" type="password" error={errors.newPassword?.message} {...register("newPassword")}/>
    <Input label="Confirm new password" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")}/>
    <Button type="submit" disabled={m.isPending}>{m.isPending?"Updating...":"Update Password"}</Button>
  </form>;
}

export function PatientProfile() { return <><PageHeading title="My profile" description="Update fields supported by the backend. Email and role remain read-only."/><ProfileForm/></>; }
export function PatientPassword() { return <><PageHeading title="Change password" description="Use your current password to secure your account with a new one."/><PasswordForm/></>; }
export { ProfileForm, PasswordForm };
