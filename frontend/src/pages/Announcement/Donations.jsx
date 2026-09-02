import { motion } from "motion/react";
import {
  Building2,
  HandCoins,
  Mail,
  Package,
  Phone,
  Stethoscope,
  Users,
} from "lucide-react";
import { Button } from "../../components/common";
import "../public/public.css";
import "./Donations.css";

/*
  Assumed import paths (adjust to match your project structure):
  - "../../components/common"  -> exports the shared <Button /> component
  - "./public.css"             -> shared public-page styles already used by Home.jsx
  - "./Donations.css"          -> page-specific styles for this page

  This page reuses the existing <Header /> and <Footer /> via the
  <PublicLayout /> route wrapper (see layouts.jsx). If your router does
  not already wrap public routes in <PublicLayout />, import
  { Header, Footer } from the layouts file and render them around the
  content below.
*/

const supportCategories = [
  {
    icon: Building2,
    title: "Hospital Infrastructure",
    description:
      "Support hospital wards, new buildings, patient rooms, waiting areas, washrooms and rehabilitation facilities.",
  },
  {
    icon: Stethoscope,
    title: "Medical Equipment",
    description:
      "Help fund hospital beds, wheelchairs, ECG machines, patient monitors, oxygen equipment and other essential equipment.",
  },
  {
    icon: Package,
    title: "Medical Supplies",
    description:
      "Contribute masks, gloves, first-aid materials, dressing materials and other essential hospital supplies.",
  },
  {
    icon: Users,
    title: "Community Healthcare Projects",
    description:
      "Fund health camps, screening programs, awareness campaigns, and children's or elderly care initiatives.",
  },
  {
    icon: HandCoins,
    title: "Financial Contributions",
    description:
      "Individuals, companies and organizations may financially support approved hospital development projects.",
  },
];

const donationProjects = [
  {
    id: 1,
    category: "Infrastructure",
    title: "Children's Ward Expansion",
    description:
      "The hospital plans to expand its children's ward to provide additional space, beds, and improved facilities for young patients.",
    status: "Seeking Support",
  },
  {
    id: 2,
    category: "Equipment",
    title: "Medical Equipment Project",
    description:
      "Support the purchase of essential patient monitoring and diagnostic equipment for our wards.",
    status: "Seeking Support",
  },
  {
    id: 3,
    category: "Emergency Care",
    title: "Ambulance Support Project",
    description:
      "Help improve emergency patient transportation and ambulance facilities for faster response times.",
    status: "Seeking Support",
  },
  {
    id: 4,
    category: "Patient Facilities",
    title: "Patient Waiting Area Development",
    description:
      "Improve hospital waiting areas with better seating and facilities for patients and visitors.",
    status: "Seeking Support",
  },
];

const donationSteps = [
  {
    step: "01",
    title: "Choose How You Would Like to Help",
    description: "Select a project or type of donation that matters most to you.",
  },
  {
    step: "02",
    title: "Contact Hospital Administration",
    description: "Speak with the hospital management team regarding your contribution.",
  },
  {
    step: "03",
    title: "Confirm Donation Details",
    description:
      "Discuss requirements, materials, equipment, financial assistance, or construction support.",
  },
  {
    step: "04",
    title: "Complete the Donation",
    description:
      "Hospital administration will provide the necessary instructions and acknowledgement.",
  },
];

export default function Donations() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="hero__eyebrow">
            <HandCoins size={15} />
            Support Our Hospital
          </span>
          <h1 className="section-title" style={{ fontSize: "clamp(2.2rem,4.5vw,3.2rem)" }}>
            Support Our Hospital
          </h1>
          <p>
            Your contribution can help us improve patient care, hospital
            facilities, medical equipment, and community healthcare
            services.
          </p>
          <div className="hero__actions">
            <Button size="lg" href="#current-projects">
              View Donation Needs
            </Button>
            <Button size="lg" variant="secondary" href="#donation-contact">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">Ways to support</span>
            <h2 className="section-title">How You Can Help</h2>
            <p>
              There are many ways individuals, companies and organizations
              can support our hospital and community.
            </p>
          </div>
          <div className="grid grid-3">
            {supportCategories.map(({ icon: Icon, title, description }) => (
              <div className="icon-card" key={title}>
                <span className="icon-card__icon">
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section soft-section" id="current-projects">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">Active projects</span>
            <h2 className="section-title">Current Hospital Support Projects</h2>
          </div>
          <div className="grid grid-2 project-grid">
            {donationProjects.map(({ id, category, title, description, status }) => (
              <motion.article
                className="project-card"
                key={id}
                whileHover={{ y: -4 }}
              >
                <div className="project-card__image" aria-hidden="true">
                  <Building2 size={30} />
                </div>
                <div className="project-card__body">
                  <div className="project-card__top">
                    <span className="badge badge--muted">{category}</span>
                    <span className="status-badge">{status}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <div className="project-card__actions">
                    <Button variant="secondary" size="sm" href="#">
                      Learn More
                    </Button>
                    <Button size="sm" href="#donation-contact">
                      Support Project
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">Getting started</span>
            <h2 className="section-title">How Donation Works</h2>
          </div>
          <div className="donation-steps">
            {donationSteps.map(({ step, title, description }) => (
              <div className="donation-step" key={step}>
                <span className="donation-step__number">{step}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section soft-section" id="donation-contact">
        <div className="container">
          <div className="donation-contact">
            <div className="donation-contact__intro">
              <span className="section-kicker">Get in touch</span>
              <h2>Interested in Supporting Our Hospital?</h2>
              <p>
                Our hospital administration team can provide additional
                information about current projects, equipment needs,
                infrastructure developments, and other donation
                opportunities.
              </p>
              <div className="hero__actions">
                <Button size="lg" href="tel:+94XXXXXXXXX">
                  <Phone size={17} /> Call Hospital
                </Button>
                <Button size="lg" variant="secondary" href="mailto:donations@hospital.lk">
                  <Mail size={17} /> Send Email
                </Button>
              </div>
            </div>
            <div className="donation-contact__details">
              <div>
                <span className="donation-contact__label">
                  <Phone size={16} /> Telephone
                </span>
                {/* Replace with the hospital's official contact number */}
                <strong>+94 XX XXX XXXX</strong>
              </div>
              <div>
                <span className="donation-contact__label">
                  <Mail size={16} /> Email
                </span>
                {/* Replace with the hospital's official donations mailbox */}
                <strong>donations@hospital.lk</strong>
              </div>
              <div>
                <span className="donation-contact__label">
                  <Building2 size={16} /> Office
                </span>
                <strong>Hospital Administration Office</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
        Optional section for future use once official bank details are
        confirmed. All values below are PLACEHOLDERS ONLY and must be
        replaced with officially approved hospital bank details before
        this section is shown in production. No payment gateway is
        integrated on this page.
      */}
      <section className="page-section bank-transfer-section">
        <div className="container">
          <div className="bank-transfer-card">
            <h3>Bank Transfer Information</h3>
            <p className="bank-transfer-card__note">
              Placeholder details shown below — replace with officially
              approved hospital bank information before publishing.
            </p>
            <dl className="bank-transfer-card__list">
              <div>
                <dt>Account Name</dt>
                <dd>Hospital Development Committee</dd>
              </div>
              <div>
                <dt>Bank</dt>
                <dd>XXXXX Bank</dd>
              </div>
              <div>
                <dt>Branch</dt>
                <dd>XXXXX</dd>
              </div>
              <div>
                <dt>Account Number</dt>
                <dd>XXXXXXXX</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
