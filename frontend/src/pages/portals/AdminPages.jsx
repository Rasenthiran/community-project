import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { CalendarDays, Stethoscope, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { AppointmentCard, DoctorCard, StatCard } from "../../components/cards";
import { Badge, Button, Input, LoadingState, Pagination, Select } from "../../components/common";
import { PageHeading } from "../../components/layouts";
import { adminService, doctorService } from "../../services";
import { getErrorMessage } from "../../utils/errorHandler";
import { formatDate, formatMoney } from "../../utils/format";
import { PasswordForm, ProfileForm } from "./PatientPages";
import { useDebounce } from "../../hooks/useDebounce";

export function AdminDashboard() {
  const users=useQuery({queryKey:["admin-users","dashboard"],queryFn:()=>adminService.users({page:1,limit:100})});
  const doctors=useQuery({queryKey:["admin-doctors","dashboard"],queryFn:()=>doctorService.list({page:1,limit:100})});
  const appointments=useQuery({queryKey:["admin-appointments","dashboard"],queryFn:()=>adminService.appointments({page:1,limit:100})});
  const loading=users.isLoading||doctors.isLoading||appointments.isLoading;
  return <>
    <PageHeading title="Admin dashboard" description="Operational overview based only on list APIs currently exposed by the backend."/>
    <div className="stat-grid">
      <StatCard icon={Users} label="Loaded users" value={users.data?.items?.length||0}/>
      <StatCard icon={Stethoscope} label="Active doctors" value={doctors.data?.items?.length||0} help="Public list API"/>
      <StatCard icon={CalendarDays} label="Loaded appointments" value={appointments.data?.items?.length||0}/>
      <StatCard icon={UserCheck} label="Active loaded users" value={users.data?.items?.filter(x=>x.isActive).length||0}/>
    </div>
    <section className="panel"><h2>Backend-aware analytics</h2>{loading?<LoadingState/>:<p>The backend has no dedicated analytics endpoints. These values are derived from currently loaded list results and are not presented as invented hospital-wide statistics.</p>}</section>
  </>;
}

export function AdminUsers() {
  const[page,setPage]=useState(1);
  const[search,setSearch]=useState("");
  const[role,setRole]=useState("");
  const debounced=useDebounce(search);
  const q=useQuery({queryKey:["admin-users",page,debounced,role],queryFn:()=>adminService.users({page,limit:15,search:debounced||undefined,role:role||undefined})});
  return <>
    <PageHeading title="Users" description="Search and manage users through the admin backend."/>
    <div className="panel mb-24 form-grid"><Input label="Search" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/><Select label="Role" value={role} onChange={e=>{setRole(e.target.value);setPage(1)}}><option value="">All roles</option><option value="patient">Patient</option><option value="doctor">Doctor</option><option value="admin">Admin</option></Select></div>
    {q.isLoading?<LoadingState/>:<><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody>{q.data?.items?.map(u=><tr key={u.id}><td>{u.fullName}</td><td>{u.email}</td><td><Badge>{u.role}</Badge></td><td><Badge tone={u.isActive?"active":"inactive"}>{u.isActive?"active":"inactive"}</Badge></td><td><Link to={`/admin/users/${u.id}`}><Button size="sm" variant="secondary">View</Button></Link></td></tr>)}</tbody></table></div><Pagination pagination={q.data?.pagination} page={page} onPage={setPage}/></>}
  </>;
}

export function AdminUserDetails() {
  const{id}=useParams();
  const navigate=useNavigate();
  const qc=useQueryClient();
  const q=useQuery({queryKey:["admin-user",id],queryFn:()=>adminService.user(id)});
  const{register,handleSubmit,reset}=useForm();
  useEffect(()=>{if(q.data)reset(q.data)},[q.data,reset]);
  const update=useMutation({mutationFn:v=>adminService.updateUser(id,v),onSuccess:()=>{toast.success("User updated.");q.refetch();qc.invalidateQueries({queryKey:["admin-users"]});},onError:e=>toast.error(getErrorMessage(e))});
  const status=useMutation({mutationFn:()=>q.data?.isActive?adminService.deactivate(id):adminService.activate(id),onSuccess:()=>{toast.success("User status updated.");q.refetch();qc.invalidateQueries({queryKey:["admin-users"]});},onError:e=>toast.error(getErrorMessage(e))});
  if(q.isLoading)return <LoadingState/>;
  return <>
    <PageHeading title={q.data?.fullName||"User details"} description="Admin account management." actions={<Button variant="secondary" onClick={()=>navigate("/admin/users")}>Back</Button>}/>
    <form className="panel form-stack" onSubmit={handleSubmit(v=>update.mutate(v))}>
      <div className="panel-heading"><h2>Profile</h2><Badge tone={q.data?.isActive?"active":"inactive"}>{q.data?.isActive?"active":"inactive"}</Badge></div>
      <div className="form-grid"><Input label="Full name" {...register("fullName")}/><Input label="Phone number" {...register("phoneNumber")}/><Input label="Address" {...register("address")}/><Input label="City" {...register("city")}/></div>
      <div className="detail-list"><div className="detail-item"><small>Email</small><strong>{q.data?.email}</strong></div><div className="detail-item"><small>Role</small><strong>{q.data?.role}</strong></div></div>
      <div className="action-row"><Button type="submit">Save User</Button><Button variant={q.data?.isActive?"danger":"secondary"} onClick={()=>status.mutate()}>{q.data?.isActive?"Deactivate":"Activate"}</Button></div>
    </form>
  </>;
}

export function AdminDoctors() {
  const navigate=useNavigate();
  const q=useQuery({queryKey:["admin-doctors"],queryFn:()=>doctorService.list({page:1,limit:100})});
  return <>
    <PageHeading title="Doctors" description="The uploaded backend doctor list returns active doctors only; deactivated doctors cannot currently be rediscovered through this list." actions={<Button onClick={()=>navigate("/admin/doctors/new")}>Add Doctor</Button>}/>
    {q.isLoading?<LoadingState/>:<div className="doctor-grid">{q.data?.items?.map(d=><DoctorCard key={d.id} doctor={d} detailsPath={x=>`/admin/doctors/${x.id}`}/>)}</div>}
  </>;
}

export function AdminDoctorForm() {
  const{id}=useParams();
  const edit=Boolean(id);
  const navigate=useNavigate();
  const qc=useQueryClient();
  const q=useQuery({queryKey:["admin-doctor",id],queryFn:()=>doctorService.get(id),enabled:edit});
  const{register,handleSubmit,reset}=useForm({defaultValues:{gender:"male"}});
  useEffect(()=>{if(q.data)reset({...q.data,qualifications:q.data.qualifications?.join(", "),languages:q.data.languages?.join(", ")})},[q.data,reset]);
  const save=useMutation({
    mutationFn:v=>{
      const professional={specialization:v.specialization,department:v.department,yearsOfExperience:Number(v.yearsOfExperience||0),consultationFee:Number(v.consultationFee||0),qualifications:v.qualifications?.split(",").map(x=>x.trim()).filter(Boolean),languages:v.languages?.split(",").map(x=>x.trim()).filter(Boolean)};
      return edit?doctorService.update(id,professional):doctorService.create({...v,...professional});
    },
    onSuccess:d=>{toast.success(edit?"Doctor updated.":"Doctor created.");qc.invalidateQueries({queryKey:["admin-doctors"]});navigate(`/admin/doctors/${d.id}`)},
    onError:e=>toast.error(getErrorMessage(e)),
  });
  if(edit&&q.isLoading)return <LoadingState/>;
  return <>
    <PageHeading title={edit?"Edit doctor":"Add doctor"} description={edit?"Update backend-supported professional fields.":"Create the user account and doctor profile together."}/>
    <form className="panel form-stack" onSubmit={handleSubmit(v=>save.mutate(v))}>
      <div className="form-grid">
        {!edit&&<><Input label="Full name" required {...register("fullName")}/><Input label="Email" type="email" required {...register("email")}/><Input label="Phone number" required {...register("phoneNumber")}/><Select label="Gender" {...register("gender")}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></Select><Input label="Date of birth" type="date" required {...register("dateOfBirth")}/><Input label="Address" required {...register("address")}/><Input label="City" required {...register("city")}/><Input label="Initial password" type="password" required {...register("password")}/><Input label="Registration number" required {...register("registrationNumber")}/></>}
        <Input label="Specialization" required {...register("specialization")}/><Input label="Department" {...register("department")}/><Input label="Years of experience" type="number" min="0" {...register("yearsOfExperience")}/><Input label="Consultation fee" type="number" min="0" {...register("consultationFee")}/><Input label="Qualifications (comma-separated)" {...register("qualifications")}/><Input label="Languages (comma-separated)" {...register("languages")}/>
      </div>
      <Button type="submit" disabled={save.isPending}>{save.isPending?"Saving...":edit?"Save Doctor":"Create Doctor"}</Button>
    </form>
  </>;
}

export function AdminDoctorDetails() {
  const{id}=useParams();
  const navigate=useNavigate();
  const qc=useQueryClient();
  const q=useQuery({queryKey:["admin-doctor",id],queryFn:()=>doctorService.get(id)});
  const status=useMutation({mutationFn:()=>doctorService.setStatus(id,!q.data?.isActive),onSuccess:()=>{toast.success("Doctor status updated.");q.refetch();qc.invalidateQueries({queryKey:["admin-doctors"]});},onError:e=>toast.error(getErrorMessage(e))});
  if(q.isLoading)return <LoadingState/>;
  const d=q.data;
  return <>
    <PageHeading title={d.fullName} description={`${d.specialization} · ${d.department}`} actions={<><Button variant="secondary" onClick={()=>navigate(`/admin/doctors/${id}/edit`)}>Edit</Button><Button variant={d.isActive?"danger":"secondary"} onClick={()=>status.mutate()}>{d.isActive?"Deactivate":"Activate"}</Button></>}/>
    <div className="panel"><div className="panel-heading"><h2>Professional details</h2><Badge tone={d.isActive?"active":"inactive"}>{d.isActive?"active":"inactive"}</Badge></div><div className="detail-list">
      <div className="detail-item"><small>Registration</small><strong>{d.registrationNumber||"—"}</strong></div>
      <div className="detail-item"><small>Consultation fee</small><strong>{formatMoney(d.consultationFee)}</strong></div>
      <div className="detail-item"><small>Experience</small><strong>{d.yearsOfExperience} years</strong></div>
      <div className="detail-item"><small>Languages</small><strong>{d.languages.join(", ")||"—"}</strong></div>
      <div className="detail-item full-span"><small>Available days</small><strong>{d.availableDays.join(", ")||"—"}</strong></div>
    </div></div>
  </>;
}

export function AdminAppointments() {
  const[page,setPage]=useState(1);
  const[status,setStatus]=useState("");
  const q=useQuery({queryKey:["admin-appointments",page,status],queryFn:()=>adminService.appointments({page,limit:15,status:status||undefined})});
  return <>
    <PageHeading title="Appointments" description="Review and manage appointment status across the hospital."/>
    <div className="panel mb-24"><Select label="Status" value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}><option value="">All statuses</option>{["pending","confirmed","completed","cancelled","rejected"].map(s=><option key={s}>{s}</option>)}</Select></div>
    {q.isLoading?<LoadingState/>:<><div className="appointment-list">{q.data?.items?.map(a=><AppointmentCard key={a.id} appointment={a} actions={<Link to={`/admin/appointments/${a.id}`}><Button size="sm" variant="secondary">Manage</Button></Link>}/>)}</div><Pagination pagination={q.data?.pagination} page={page} onPage={setPage}/></>}
  </>;
}

export function AdminAppointmentDetails() {
  const{id}=useParams();
  const navigate=useNavigate();
  const qc=useQueryClient();
  const q=useQuery({queryKey:["admin-appointment",id],queryFn:()=>adminService.appointment(id)});
  const update=useMutation({mutationFn:status=>adminService.setAppointmentStatus(id,status,"Updated by admin portal"),onSuccess:()=>{toast.success("Appointment status updated.");q.refetch();qc.invalidateQueries({queryKey:["admin-appointments"]});},onError:e=>toast.error(getErrorMessage(e))});
  if(q.isLoading)return <LoadingState/>;
  const a=q.data;
  return <>
    <PageHeading title="Appointment details" description="Admin-level appointment management." actions={<Button variant="secondary" onClick={()=>navigate("/admin/appointments")}>Back</Button>}/>
    <div className="panel form-stack">
      <div className="panel-heading"><h2>{a.patient?.fullName||"Patient appointment"}</h2><Badge>{a.status}</Badge></div>
      <div className="detail-list">
        <div className="detail-item"><small>Date</small><strong>{formatDate(a.appointmentDate)}</strong></div>
        <div className="detail-item"><small>Time</small><strong>{a.appointmentStartTime||"—"}</strong></div>
        <div className="detail-item"><small>Patient</small><strong>{a.patient?.fullName||"—"}</strong></div>
        <div className="detail-item"><small>Doctor specialization</small><strong>{a.doctor?.specialization||"—"}</strong></div>
        <div className="detail-item full-span"><small>Reason</small><strong>{a.reason||"—"}</strong></div>
      </div>
      <Select label="Change status" defaultValue={a.status} onChange={e=>update.mutate(e.target.value)}>{["pending","confirmed","completed","cancelled","rejected"].map(s=><option key={s}>{s}</option>)}</Select>
    </div>
  </>;
}

export function AdminProfile(){return <><PageHeading title="Admin profile" description="Manage your account contact fields."/><ProfileForm/></>}
export function AdminPassword(){return <><PageHeading title="Change password" description="Update your administrator password securely."/><PasswordForm/></>}
