import { Ambulance, Brain, HeartPulse, Microscope, Pill, Stethoscope } from "lucide-react";

export const services = [
  { title:"Emergency Care", description:"Rapid assessment and coordinated emergency support around the clock.", icon:Ambulance },
  { title:"General Medicine", description:"Primary and internal medicine consultations for everyday health needs.", icon:Stethoscope },
  { title:"Cardiac Care", description:"Preventive heart-health guidance and specialist cardiovascular consultations.", icon:HeartPulse },
  { title:"Neurology", description:"Specialist neurological assessment and ongoing consultation pathways.", icon:Brain },
  { title:"Laboratory Services", description:"Diagnostic-service information only. Lab requests and results are not backend-connected yet.", icon:Microscope, staticOnly:true },
  { title:"Pharmacy Support", description:"Hospital pharmacy information only. Inventory and prescriptions are not backend-connected yet.", icon:Pill, staticOnly:true },
];

export const departments = [
  { name:"General Medicine", description:"Comprehensive first-contact care and health evaluation." },
  { name:"Cardiology", description:"Heart and cardiovascular specialist services." },
  { name:"Pediatrics", description:"Child-focused consultation and wellness guidance." },
  { name:"Dermatology", description:"Assessment of skin, hair and nail conditions." },
  { name:"Neurology", description:"Care pathways for brain, nerve and neurological concerns." },
  { name:"Orthopedics", description:"Musculoskeletal and mobility-focused specialist care." },
];

export const faqs = [
  ["How do I book an appointment?","Create a patient account, sign in, choose a doctor, and enter an available date and time."],
  ["Can I cancel an appointment?","Yes. Patients can cancel their own appointments from the patient portal, subject to backend rules."],
  ["Can I register as a doctor online?","No. Public registration creates patient accounts only. Doctor accounts are created by an administrator."],
  ["Do you support online payments?","Not currently. The uploaded backend has no billing or payment endpoints."],
  ["Where are my medical records?","Medical records are not implemented by the uploaded backend, so the frontend does not fabricate that module."],
];
