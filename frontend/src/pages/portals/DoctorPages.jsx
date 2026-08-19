import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { CalendarCheck2, CalendarClock, CalendarDays, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AppointmentCard, StatCard } from "../../components/cards";
import { Badge, Button, Input, LoadingState, Textarea } from "../../components/common";
import { PageHeading } from "../../components/layouts";
import { DAYS } from "../../config/constants";
import { doctorAppointmentService, doctorService } from "../../services";
import { getErrorMessage } from "../../utils/errorHandler";
import { formatDate } from "../../utils/format";
import { PasswordForm, ProfileForm } from "./PatientPages";

export function DoctorDashboard() {
  const q = useQuery({ queryKey:["doctor-appointments","dashboard"], queryFn:()=>doctorAppointmentService.list({page:1,limit:10}) });
  const items = q.data?.items || [];
  const count = s => items.filter(x=>x.status===s).length;
  return <>
    <PageHeading title="Doctor dashboard" description="Review assigned appointments and current workload."/>
    <div className="stat-grid">
      <StatCard icon={CalendarDays} label="Loaded appointments" value={items.length}/>
      <StatCard icon={CalendarClock} label="Pending" value={count("pending")}/>
      <StatCard icon={CalendarCheck2} label="Confirmed" value={count("confirmed")}/>
      <StatCard icon={CheckCircle2} label="Completed" value={count("completed")}/>
    </div>
    <div className="panel"><div className="panel-heading"><h2>Upcoming workload</h2></div>{q.isLoading?<LoadingState/>:<div className="appointment-list">{items.slice(0,6).map(a=><AppointmentCard key={a.id} appointment={a}/>)}</div>}</div>
  </>;
}

export function DoctorAppointments() {
  const q = useQuery({ queryKey:["doctor-appointments"], queryFn:()=>doctorAppointmentService.list({page:1,limit:50}) });
  return <>
    <PageHeading title="Appointments" description="Appointments assigned to your doctor profile."/>
    {q.isLoading?<LoadingState/>:<div className="appointment-list">{q.data?.items?.map(a=><AppointmentCard key={a.id} appointment={a} actions={<Link to={`/doctor/appointments/${a.id}`}><Button size="sm" variant="secondary">Manage</Button></Link>}/>)}</div>}
  </>;
}

export function DoctorAppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const q = useQuery({ queryKey:["doctor-appointment",id], queryFn:()=>doctorAppointmentService.get(id) });
  const action = useMutation({
    mutationFn:value=>doctorAppointmentService.action(id,value,`Updated by doctor: ${value}`),
    onSuccess:()=>{toast.success("Appointment status updated.");q.refetch();qc.invalidateQueries({queryKey:["doctor-appointments"]});},
    onError:e=>toast.error(getErrorMessage(e)),
  });
  if(q.isLoading) return <LoadingState/>;
  const a=q.data;
  return <>
    <PageHeading title="Appointment details" description="Manage this appointment using backend-supported doctor actions." actions={<Button variant="secondary" onClick={()=>navigate("/doctor/appointments")}>Back</Button>}/>
    <div className="panel">
      <div className="panel-heading"><h2>{a.patient?.fullName || "Patient appointment"}</h2><Badge>{a.status}</Badge></div>
      <div className="detail-list">
        <div className="detail-item"><small>Date</small><strong>{formatDate(a.appointmentDate)}</strong></div>
        <div className="detail-item"><small>Time</small><strong>{a.appointmentStartTime || "—"}</strong></div>
        <div className="detail-item"><small>Patient</small><strong>{a.patient?.fullName || "Patient is not populated by this detail endpoint"}</strong></div>
        <div className="detail-item"><small>Reason</small><strong>{a.reason || "—"}</strong></div>
      </div>
      <div className="action-row mt-24">
        {a.status==="pending" && <><Button onClick={()=>action.mutate("confirm")}>Confirm</Button><Button variant="danger" onClick={()=>action.mutate("reject")}>Reject</Button></>}
        {["pending","confirmed"].includes(a.status) && <Button variant="secondary" onClick={()=>action.mutate("cancel")}>Cancel</Button>}
        {a.status==="confirmed" && <Button onClick={()=>action.mutate("complete")}>Complete</Button>}
      </div>
    </div>
  </>;
}

export function DoctorProfile() {
  const qc=useQueryClient();
  const q=useQuery({queryKey:["doctor-me"],queryFn:doctorService.me});
  const {register,handleSubmit,reset}=useForm();
  useEffect(()=>{if(q.data)reset({...q.data,languages:q.data.languages?.join(", ")});},[q.data,reset]);
  const m=useMutation({
    mutationFn:v=>doctorService.updateMe({...v,consultationFee:Number(v.consultationFee||0),languages:v.languages?.split(",").map(x=>x.trim()).filter(Boolean)}),
    onSuccess:()=>{toast.success("Professional profile updated.");qc.invalidateQueries({queryKey:["doctor-me"]});},
    onError:e=>toast.error(getErrorMessage(e)),
  });
  if(q.isLoading)return <LoadingState/>;
  return <>
    <PageHeading title="Professional profile" description="Update the professional fields that the backend allows doctors to manage."/>
    <form className="panel form-stack" onSubmit={handleSubmit(v=>m.mutate(v))}>
      <div className="detail-list"><div className="detail-item"><small>Specialization (admin controlled)</small><strong>{q.data?.specialization}</strong></div><div className="detail-item"><small>Department (admin controlled)</small><strong>{q.data?.department}</strong></div></div>
      <Textarea label="Biography" maxLength={2000} {...register("biography")}/>
      <Input label="Consultation fee" type="number" min="0" {...register("consultationFee")}/>
      <Input label="Languages (comma-separated)" {...register("languages")}/>
      <Input label="Profile image URL" {...register("profileImage")}/>
      <Button type="submit" disabled={m.isPending}>Save Professional Profile</Button>
    </form>
  </>;
}

export function DoctorAvailability() {
  const qc=useQueryClient();
  const q=useQuery({queryKey:["doctor-me"],queryFn:doctorService.me});
  const {register,handleSubmit,reset}=useForm();
  useEffect(()=>{if(q.data)reset({startTime:q.data.workingHours?.startTime,endTime:q.data.workingHours?.endTime,slotDurationMinutes:q.data.slotDurationMinutes,availableDays:q.data.availableDays});},[q.data,reset]);
  const m=useMutation({
    mutationFn:v=>doctorService.updateMe({workingHours:{startTime:v.startTime,endTime:v.endTime},slotDurationMinutes:Number(v.slotDurationMinutes),availableDays:v.availableDays||[]}),
    onSuccess:()=>{toast.success("Availability updated.");qc.invalidateQueries({queryKey:["doctor-me"]});},
    onError:e=>toast.error(getErrorMessage(e)),
  });
  if(q.isLoading)return <LoadingState/>;
  return <>
    <PageHeading title="Availability" description="Configure working days, hours and appointment duration."/>
    <form className="panel form-stack" onSubmit={handleSubmit(v=>m.mutate(v))}>
      <div className="form-grid"><Input label="Start time" type="time" {...register("startTime")}/><Input label="End time" type="time" {...register("endTime")}/><Input label="Slot duration (minutes)" type="number" min="5" {...register("slotDurationMinutes")}/></div>
      <div><strong>Available days</strong><div className="action-row mt-16">{DAYS.map(d=><label className="badge" key={d}><input type="checkbox" value={d} {...register("availableDays")}/> {d}</label>)}</div></div>
      <Button type="submit">Save Availability</Button>
    </form>
  </>;
}

export function DoctorAccount(){return <><PageHeading title="Account" description="Manage your user-level contact profile."/><ProfileForm/></>}
export function DoctorPassword(){return <><PageHeading title="Change password" description="Update the password for your doctor account."/><PasswordForm/></>}
