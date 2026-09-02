import { useState } from "react";
import { motion } from "motion/react";
import {
  Bell,
  CalendarDays,
  Clock3,
  Droplet,
  Eye,
  HeartPulse,
  MapPin,
  Megaphone,
  Users,
} from "lucide-react";
import { Button } from "../../components/common";
import "../public/public.css";
import "./Announcements.css";

/*
  Assumed import paths (adjust to match your project structure):
  - "../../components/common"  -> exports the shared <Button /> component
  - "./public.css"             -> shared public-page styles already used by Home.jsx
  - "./Announcements.css"      -> page-specific styles for this page

  This page reuses the existing <Header /> and <Footer /> via the
  <PublicLayout /> route wrapper (see layouts.jsx), so they are not
  imported directly here. If your router does not already wrap public
  routes in <PublicLayout />, import { Header, Footer } from the layouts
  file and render them around the content below.
*/

const categories = [
  { key: "all", label: "All" },
  { key: "blood", label: "Blood Donation" },
  { key: "health", label: "Health Campaigns" },
  { key: "events", label: "Events" },
  { key: "community", label: "Community Programs" },
  { key: "notices", label: "Hospital Notices" },
];

const announcements = [
  {
    id: 1,
    category: "blood",
    categoryLabel: "Blood Donation",
    icon: Droplet,
    title: "Blood Donation Campaign",
    date: "August 30, 2026",
    description:
      "Join our hospital blood donation campaign and help save lives in our community.",
  },
  {
    id: 2,
    category: "health",
    categoryLabel: "Health Campaign",
    icon: HeartPulse,
    title: "Free Diabetes Screening",
    date: "September 2, 2026",
    description:
      "Free blood glucose screening for members of the community, open to all age groups.",
  },
  {
    id: 3,
    category: "community",
    categoryLabel: "Community Program",
    icon: Users,
    title: "Dengue Prevention Awareness Program",
    date: "August 25, 2026",
    description:
      "Educational awareness campaign about dengue prevention and household mosquito control.",
  },
  {
    id: 4,
    category: "events",
    categoryLabel: "Event",
    icon: HeartPulse,
    title: "Children's Health Camp",
    date: "September 12, 2026",
    description:
      "Community health camp focusing on children's health, growth monitoring and wellness.",
  },
  {
    id: 5,
    category: "health",
    categoryLabel: "Health Campaign",
    icon: Eye,
    title: "Free Eye Screening Program",
    date: "September 5, 2026",
    description:
      "Free basic eye examination and awareness program for early detection of vision issues.",
  },
  {
    id: 6,
    category: "notices",
    categoryLabel: "Hospital Notice",
    icon: Bell,
    title: "Updated OPD Opening Hours",
    date: "Effective September 1, 2026",
    description:
      "Information about changes to hospital OPD operating hours across all departments.",
  },
];

const upcomingActivities = [
  { date: "August 25", label: "Dengue Awareness Program" },
  { date: "August 30", label: "Blood Donation Campaign" },
  { date: "September 05", label: "Free Eye Screening" },
  { date: "September 12", label: "Children's Health Camp" },
];

export default function Announcements() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredAnnouncements =
    activeCategory === "all"
      ? announcements
      : announcements.filter((item) => item.category === activeCategory);

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="hero__eyebrow">
            <Megaphone size={15} />
            Hospital Announcements
          </span>
          <h1 className="section-title" style={{ fontSize: "clamp(2.2rem,4.5vw,3.2rem)" }}>
            Hospital Announcements
          </h1>
          <p>
            Stay informed about upcoming health campaigns, blood donation
            drives, hospital events, community programs, and important
            hospital notices.
          </p>
        </div>
      </section>

      <section className="page-section announcements-filter-section">
        <div className="container">
          <div className="announcements-filter" role="group" aria-label="Filter announcements by category">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={`filter-chip ${activeCategory === cat.key ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.key)}
                aria-pressed={activeCategory === cat.key}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <motion.article
            className="featured-announcement"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="featured-announcement__icon">
              <Droplet size={30} />
            </div>
            <div className="featured-announcement__body">
              <span className="badge">Featured Announcement</span>
              <h2>Blood Donation Campaign 2026</h2>
              <div className="featured-announcement__meta">
                <span>
                  <CalendarDays size={16} /> August 30, 2026
                </span>
                <span>
                  <Clock3 size={16} /> 9:00 AM – 3:00 PM
                </span>
                <span>
                  <MapPin size={16} /> Hospital Main Auditorium
                </span>
              </div>
              <p>
                Join our hospital blood donation campaign and help save lives
                in our community. Every donation directly supports patients
                who need urgent transfusions across our departments.
              </p>
              <div className="featured-announcement__actions">
                <Button href="#">View Details</Button>
                <Button variant="secondary" href="#">
                  Contact Hospital
                </Button>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      <section className="page-section soft-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">Latest updates</span>
            <h2 className="section-title">Announcements &amp; Notices</h2>
            <p>
              Browse current campaigns, screenings, and community programs
              organized by our hospital.
            </p>
          </div>

          <div className="grid grid-3 announcement-grid">
            {filteredAnnouncements.map(({ id, icon: Icon, categoryLabel, title, date, description }) => (
              <article className="announcement-card" key={id}>
                <div className="announcement-card__image" aria-hidden="true">
                  <Icon size={34} />
                </div>
                <div className="announcement-card__body">
                  <span className="badge badge--muted">{categoryLabel}</span>
                  <h3>{title}</h3>
                  <span className="announcement-card__date">
                    <CalendarDays size={14} /> {date}
                  </span>
                  <p>{description}</p>
                  <a className="text-link" href="#">
                    View Details →
                  </a>
                </div>
              </article>
            ))}
            {filteredAnnouncements.length === 0 && (
              <p>No announcements found for this category right now.</p>
            )}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">Plan ahead</span>
            <h2 className="section-title">Upcoming Hospital Activities</h2>
          </div>
          <ul className="activity-timeline">
            {upcomingActivities.map((item) => (
              <li key={item.label}>
                <span className="activity-timeline__date">{item.date}</span>
                <span className="activity-timeline__label">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="home-cta">
            <div>
              <span className="section-kicker">Stay connected</span>
              <h2>Need More Information?</h2>
              <p>
                For additional information regarding hospital campaigns,
                events, or public programs, please contact our hospital
                administration.
              </p>
            </div>
            <div className="hero__actions">
              <Button size="lg" href="#">
                Contact Hospital
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
