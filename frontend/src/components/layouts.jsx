import { useEffect, useState } from "react";
import { Activity, LogIn, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { portalNavigation } from "../config/navigation";
import { Button } from "./common";
import "./layouts.css";

const publicLinks = [
  ["Home","/"],["About","/about"],["Services","/services"],["Departments","/departments"],["Doctors","/doctors"],["Contact","/contact"],
];

export function Header() {
  const [open,setOpen] = useState(false);
  const { user,isAuthenticated,logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);
  const dashboard = user ? `/${user.role}/dashboard` : "/login";
  return <header className="site-header">
    <div className="container site-header__inner">
      <Link className="brand" to="/"><span className="brand__mark"><Activity/></span><strong>NovaCare</strong></Link>
      <nav className="desktop-nav">{publicLinks.map(([label,to])=><NavLink key={to} to={to} className={({isActive})=>isActive?"active":""}>{label}</NavLink>)}</nav>
      <div className="desktop-actions">
        {isAuthenticated ? <>
          <Button variant="secondary" onClick={()=>navigate(dashboard)}>Dashboard</Button>
          <Button variant="ghost" onClick={()=>{logout();navigate("/")}}>Logout</Button>
        </> : <>
          <Button variant="ghost" onClick={()=>navigate("/login")}><LogIn size={17}/>Login</Button>
          <Button onClick={()=>navigate("/register")}>Book Care</Button>
        </>}
      </div>
      <button className="menu-button" aria-label="Toggle navigation" onClick={()=>setOpen(v=>!v)}>{open?<X/>:<Menu/>}</button>
    </div>
    <AnimatePresence>{open && <motion.div className="mobile-nav" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
      {publicLinks.map(([label,to])=><NavLink key={to} to={to} onClick={()=>setOpen(false)}>{label}</NavLink>)}
      <div className="mobile-nav__actions">
        {isAuthenticated ? <>
          <Button onClick={()=>{setOpen(false);navigate(dashboard)}}>Dashboard</Button>
          <Button variant="secondary" onClick={()=>{logout();setOpen(false);navigate("/")}}>Logout</Button>
        </> : <>
          <Button variant="secondary" onClick={()=>{setOpen(false);navigate("/login")}}>Login</Button>
          <Button onClick={()=>{setOpen(false);navigate("/register")}}>Create Patient Account</Button>
        </>}
      </div>
    </motion.div>}</AnimatePresence>
  </header>;
}

export function Footer() {
  return <footer className="footer">
    <div className="container footer__grid">
      <div><div className="brand footer__brand"><span className="brand__mark"><Activity/></span><strong>NovaCare</strong></div><p>Modern healthcare access, thoughtful appointments and role-secured hospital workspaces.</p></div>
      <div><h4>Explore</h4><Link to="/about">About</Link><Link to="/services">Services</Link><Link to="/departments">Departments</Link><Link to="/doctors">Doctors</Link></div>
      <div><h4>Support</h4><Link to="/faq">FAQ</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/contact">Contact</Link></div>
      <div><h4>Hospital</h4><span>25 Wellness Avenue, Colombo</span><span>+94 11 234 5678</span><span>hello@novacare.lk</span><span>24/7 Emergency Support</span></div>
    </div>
    <div className="container footer__bottom">© {new Date().getFullYear()} NovaCare Hospital · Frontend demonstration</div>
  </footer>;
}

export function PublicLayout() {
  return <><Header/><main><Outlet/></main><Footer/></>;
}

export function DashboardLayout() {
  const [open,setOpen] = useState(false);
  const { user,logout } = useAuth();
  const navigate = useNavigate();
  const items = portalNavigation[user?.role] || [];
  return <div className="dashboard-shell">
    <aside className={`sidebar ${open?"open":""}`}>
      <div className="sidebar__brand"><span className="brand__mark"><Activity/></span><strong>NovaCare</strong><button onClick={()=>setOpen(false)}><X/></button></div>
      <div className="sidebar__user"><span>{user?.fullName?.[0] || "U"}</span><div><strong>{user?.fullName || "User"}</strong><small>{user?.role}</small></div></div>
      <nav>{items.map(({label,to,icon:Icon})=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>isActive?"active":""}><Icon size={18}/>{label}</NavLink>)}</nav>
      <button className="sidebar__logout" onClick={()=>{logout();navigate("/")}}><LogOut size={18}/>Logout</button>
    </aside>
    <div className="dashboard-main">
      <header className="dashboard-topbar">
        <button className="dashboard-menu" onClick={()=>setOpen(true)}><Menu/></button>
        <div><small>Healthcare workspace</small><strong>{user?.role?.[0]?.toUpperCase()+user?.role?.slice(1)} Portal</strong></div>
        <Button size="sm" variant="secondary" onClick={()=>navigate("/")}>Public Site</Button>
      </header>
      <main className="dashboard-content"><Outlet/></main>
    </div>
    {open && <button className="sidebar-backdrop" aria-label="Close sidebar" onClick={()=>setOpen(false)}/>}
  </div>;
}

export function PageHeading({ title, description, actions }) {
  return <div className="dashboard-heading"><div><h1>{title}</h1><p>{description}</p></div>{actions && <div className="action-row">{actions}</div>}</div>;
}
