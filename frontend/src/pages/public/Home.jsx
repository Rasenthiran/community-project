import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Activity, ArrowRight, CalendarCheck2, CheckCircle2, Clock3, HeartPulse, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { Button, LoadingState } from "../../components/common";
import { DoctorCard } from "../../components/cards";
import { doctorService } from "../../services";
import { departments, faqs, services } from "../../data/content";
import "./public.css";

export default function Home() {
  const navigate = useNavigate();
  const doctors = useQuery({ queryKey:["featured-doctors"], queryFn:()=>doctorService.list({page:1,limit:3}) });

  return <>
    <section className="hero">
      <div className="hero__blob one"/><div className="hero__blob two"/>
      <div className="container hero__grid">
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.55}}>
          <span className="hero__eyebrow"><ShieldCheck/>Trusted care. Human connection.</span>
          <h1>Compassionate care.<br/><span>Advanced medicine.</span><br/>Better health.</h1>
          <p className="hero__lead">Find the right doctor, book appointments confidently, and manage your healthcare journey through one calm, secure digital experience.</p>
          <div className="hero__actions">
            <Button size="lg" onClick={()=>navigate("/doctors")}>Find a Doctor <ArrowRight size={18}/></Button>
            <Button size="lg" variant="secondary" onClick={()=>navigate("/register")}>Create Patient Account</Button>
          </div>
          <div className="hero__trust">
            <span><CheckCircle2/>Verified doctors</span><span><CheckCircle2/>Simple booking</span><span><CheckCircle2/>Role-secured portals</span>
          </div>
        </motion.div>

        <motion.div className="hero-visual" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{delay:.12,duration:.65}}>
          <div className="hero-visual__core"><div className="hero-symbol"><HeartPulse/></div><small>Care that moves with you</small><strong>Nanattan General Hospital</strong></div>
          <div className="floating-card top float-soft"><CalendarCheck2/><div><small>Appointment access</small><strong>Simple & secure</strong></div></div>
          <div className="floating-card bottom"><Activity/><div><small>Hospital support</small><strong>24/7 Care</strong></div></div>
          <div className="pulse-ring r1"/><div className="pulse-ring r2"/>
        </motion.div>
      </div>
    </section>

    <section className="trust-strip"><div className="container trust-grid">
      <div><strong>15+</strong><span>Specialist areas</span></div><div><strong>24/7</strong><span>Emergency support</span></div><div><strong>3</strong><span>Secure role portals</span></div><div><strong>1</strong><span>Connected journey</span></div>
    </div></section>

    <section className="page-section"><div className="container">
      <div className="section-heading"><span className="section-kicker">Care services</span><h2 className="section-title">Healthcare designed around people</h2><p>Backend-powered workflows are kept separate from static hospital information so the interface never pretends an API exists when it does not.</p></div>
      <div className="grid grid-3">{services.map(({title,description,icon:Icon,staticOnly})=><motion.article className="service-card" key={title} whileHover={{y:-5}}><span><Icon/></span><div><h3>{title}</h3><p>{description}</p>{staticOnly&&<small>Information only</small>}</div></motion.article>)}</div>
    </div></section>

    <section className="page-section soft-section"><div className="container">
      <div className="section-heading left"><span className="section-kicker">Departments</span><h2 className="section-title">Specialized care, thoughtfully organized</h2></div>
      <div className="department-list">{departments.map((d,i)=><Link key={d.name} to="/departments"><span>{String(i+1).padStart(2,"0")}</span><div><strong>{d.name}</strong><p>{d.description}</p></div><ArrowRight/></Link>)}</div>
    </div></section>

    <section className="page-section"><div className="container">
      <div className="section-heading"><span className="section-kicker">Featured doctors</span><h2 className="section-title">Expertise you can feel confident in</h2><p>Doctors below come from the real public backend endpoint.</p></div>
      {doctors.isLoading ? <LoadingState rows={3}/> : doctors.isError ? <div className="content-card text-center"><p>Doctors could not be loaded from the backend.</p><Button onClick={()=>doctors.refetch()}>Retry</Button></div> : <div className="doctor-grid">{doctors.data?.items?.map(d=><DoctorCard key={d.id} doctor={d}/>)}</div>}
      <div className="text-center mt-32"><Button variant="secondary" onClick={()=>navigate("/doctors")}>View All Doctors</Button></div>
    </div></section>

    <section className="page-section dark-section"><div className="container why-grid">
      <div><span className="section-kicker">Why Nanattan General Hospital</span><h2 className="section-title">A calmer digital front door to healthcare.</h2><p>Clear navigation, accessible interfaces, secure role-based access and backend-aware design keep the experience focused.</p></div>
      <div className="why-list">
        <div><Clock3/><span><strong>Faster appointment access</strong><small>Search, review and book without unnecessary steps.</small></span></div>
        <div><Stethoscope/><span><strong>Doctor-focused profiles</strong><small>See specialty, department, fees, languages and availability.</small></span></div>
        <div><Users/><span><strong>Role-specific workspaces</strong><small>Patients, doctors and admins each see the tools they need.</small></span></div>
      </div>
    </div></section>

    <section className="page-section"><div className="container">
      <div className="section-heading"><span className="section-kicker">Simple booking</span><h2 className="section-title">From search to appointment in four steps</h2></div>
      <div className="steps">{[["01","Find your doctor"],["02","Review availability"],["03","Choose date & time"],["04","Track your appointment"]].map(([n,t])=><div key={n}><span>{n}</span><strong>{t}</strong></div>)}</div>
    </div></section>

    <section className="page-section soft-section"><div className="container">
      <div className="section-heading"><span className="section-kicker">Common questions</span><h2 className="section-title">Helpful answers before you begin</h2></div>
      <div className="faq-list">{faqs.slice(0,3).map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      <div className="text-center mt-32"><Button variant="secondary" onClick={()=>navigate("/faq")}>See All FAQs</Button></div>
    </div></section>

    <section className="page-section"><div className="container"><div className="home-cta">
      <div><span className="section-kicker">Start your care journey</span><h2>Ready to find the right doctor?</h2><p>Create a patient account or browse available doctors now.</p></div>
      <div className="hero__actions"><Button size="lg" onClick={()=>navigate("/doctors")}>Browse Doctors</Button><Button size="lg" variant="secondary" onClick={()=>navigate("/register")}>Register</Button></div>
    </div></div></section>
  </>;
}
