import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Building2, HeartHandshake, Mail, MapPin, Phone, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Button, EmptyState, ErrorState, Input, LoadingState, Pagination, Textarea } from "../../components/common";
import { DoctorCard } from "../../components/cards";
import { doctorService } from "../../services";
import { departments, faqs, services } from "../../data/content";
import { useDebounce } from "../../hooks/useDebounce";
import { formatMoney } from "../../utils/format";
import { toast } from "sonner";
import "./public.css";

export function PageBanner({ kicker, title, description }) {
  return <section className="page-banner"><motion.div className="container" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}><span className="section-kicker">{kicker}</span><h1 className="page-title">{title}</h1><p>{description}</p></motion.div></section>;
}

export function About() {
  const items = [
    [HeartHandshake,"Patient-first care","Every interaction is designed around clarity, dignity and access."],
    [ShieldCheck,"Trust & safety","Role-based experiences keep healthcare workflows appropriately separated."],
    [Sparkles,"Modern experience","Responsive design and thoughtful motion reduce friction across the care journey."],
    [Users,"Connected teams","Patients, doctors and administrators work from purpose-built portals."],
  ];
  return <><PageBanner kicker="About NovaCare" title="Healthcare feels better when the experience is human." description="A modern hospital experience where trusted clinical care meets thoughtful digital access."/><section className="page-section"><div className="container grid grid-2">{items.map(([Icon,t,d])=><article className="icon-card" key={t}><span className="icon-card__icon"><Icon/></span><h3>{t}</h3><p>{d}</p></article>)}</div></section></>;
}

export function Services() {
  return <><PageBanner kicker="Hospital services" title="Care options built around everyday and specialist needs." description="Service descriptions remain static unless the uploaded backend provides a corresponding functional module."/><section className="page-section"><div className="container grid grid-3">{services.map(({icon:Icon,title,description,staticOnly})=><article className="icon-card" key={title}><span className="icon-card__icon"><Icon/></span><h3>{title}</h3><p>{description}</p>{staticOnly&&<small className="muted">Static information — no current backend module.</small>}</article>)}</div></section></>;
}

export function Departments() {
  return <><PageBanner kicker="Departments" title="Specialist teams organized around your health needs." description="Browse core clinical departments and use the doctor directory for backend-powered specialist discovery."/><section className="page-section"><div className="container grid grid-3">{departments.map(d=><article className="icon-card" key={d.name}><span className="icon-card__icon"><Building2/></span><h3>{d.name}</h3><p>{d.description}</p></article>)}</div></section></>;
}

export function Doctors() {
  const [page,setPage] = useState(1);
  const [search,setSearch] = useState("");
  const [specialization,setSpecialization] = useState("");
  const [department,setDepartment] = useState("");
  const qSearch = useDebounce(search);
  const query = useQuery({
    queryKey:["public-doctors",page,qSearch,specialization,department],
    queryFn:()=>doctorService.list({page,limit:9,search:qSearch||undefined,specialization:specialization||undefined,department:department||undefined}),
  });
  return <><PageBanner kicker="Doctor directory" title="Find a doctor who fits your care needs." description="Search the real backend doctor directory by name, specialty or department."/><section className="page-section"><div className="container">
    <div className="doctor-toolbar">
      <Input aria-label="Search doctors" placeholder="Search doctors..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/>
      <Input aria-label="Specialization" placeholder="Specialization" value={specialization} onChange={e=>{setSpecialization(e.target.value);setPage(1)}}/>
      <Input aria-label="Department" placeholder="Department" value={department} onChange={e=>{setDepartment(e.target.value);setPage(1)}}/>
      <Button variant="secondary" onClick={()=>{setSearch("");setSpecialization("");setDepartment("");setPage(1)}}>Clear</Button>
    </div>
    {query.isLoading ? <LoadingState/> : query.isError ? <ErrorState onRetry={query.refetch}/> : !query.data?.items?.length ? <EmptyState title="No doctors found" message="Try another search or filter."/> : <>
      <div className="doctor-grid">{query.data.items.map(d=><DoctorCard key={d.id} doctor={d}/>)}</div>
      <Pagination pagination={query.data.pagination} page={page} onPage={setPage}/>
    </>}
  </div></section></>;
}

export function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useQuery({ queryKey:["doctor",id], queryFn:()=>doctorService.get(id), enabled:Boolean(id) });
  if (query.isLoading) return <section className="page-section"><div className="container"><LoadingState/></div></section>;
  if (query.isError) return <section className="page-section"><div className="container"><ErrorState onRetry={query.refetch}/></div></section>;
  const d = query.data;
  return <><PageBanner kicker={d.department} title={d.fullName} description={d.biography || `${d.specialization} specialist available through the NovaCare doctor directory.`}/><section className="page-section"><div className="container grid grid-2">
    <div className="content-card"><h2>Professional profile</h2><div className="detail-list">
      <div className="detail-item"><small>Specialization</small><strong>{d.specialization}</strong></div>
      <div className="detail-item"><small>Department</small><strong>{d.department}</strong></div>
      <div className="detail-item"><small>Experience</small><strong>{d.yearsOfExperience} years</strong></div>
      <div className="detail-item"><small>Consultation fee</small><strong>{formatMoney(d.consultationFee)}</strong></div>
      <div className="detail-item"><small>Languages</small><strong>{d.languages.join(", ") || "—"}</strong></div>
      <div className="detail-item"><small>Duration</small><strong>{d.slotDurationMinutes} minutes</strong></div>
    </div></div>
    <div className="content-card"><h2>Availability</h2><p><strong>Days:</strong> {d.availableDays.join(", ") || "Not configured"}</p><p><strong>Working hours:</strong> {d.workingHours?.startTime || "—"} – {d.workingHours?.endTime || "—"}</p><Button className="mt-16" onClick={()=>navigate(`/patient/appointments/book/${d.id}`)}>Book Appointment</Button></div>
  </div></section></>;
}

export function Contact() {
  return <><PageBanner kicker="Contact" title="We’re here when you need direction." description="The backend has no contact-submission endpoint, so this form is intentionally frontend-only."/><section className="page-section"><div className="container grid grid-2">
    <div className="content-card"><h2>Hospital contact</h2><p><MapPin size={16}/> Moddaikaddai, Nanattan, Mannar</p><p><Phone size={16}/> +94 11 234 5678</p><p><Mail size={16}/> hello@ngh.lk</p></div>
    <form className="content-card form-stack" onSubmit={e=>{e.preventDefault();toast.info("Contact submission is not connected to a backend yet.")}}><Input label="Name" required/><Input label="Email" type="email" required/><Textarea label="Message" required/><Button type="submit">Prepare Message</Button></form>
  </div></section></>;
}

export function FAQ() {
  return <><PageBanner kicker="FAQ" title="Answers to common questions." description="Straightforward guidance about the currently supported hospital experience."/><section className="page-section"><div className="container faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section></>;
}

export function Privacy() {
  return <><PageBanner kicker="Privacy" title="A clear approach to privacy." description="This demo stores the JWT and basic user identity locally in the browser for authenticated navigation."/><section className="page-section"><div className="container content-card"><h2>Privacy notice</h2><p>Production deployment should replace this demonstration text with an approved privacy policy and jurisdiction-specific requirements.</p><h3>Authentication</h3><p>The JWT returned by the backend is attached as a Bearer token to protected requests.</p><h3>Clinical data</h3><p>The frontend displays only supported backend data and does not invent medical-record functionality.</p></div></section></>;
}

export function Terms() {
  return <><PageBanner kicker="Terms" title="Terms for using the hospital portal." description="Production deployment should replace this demonstration content with legally reviewed terms."/><section className="page-section"><div className="container content-card"><h2>Use of the portal</h2><p>This frontend supports appointment and account workflows exposed by the uploaded backend. Static service content is informational and is not medical advice.</p><h3>Emergency situations</h3><p>Do not rely on a web portal for urgent emergencies. Contact the appropriate emergency service or hospital emergency unit.</p></div></section></>;
}
