import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, ShieldCheck, Fingerprint, Bell, Code2, Cpu } from "lucide-react";

export const Route = createFileRoute("/_site/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services — Genesys GT" },
      { name: "description", content: "CCTV, gate barriers, attendance, intercoms, software development and IT infrastructure services in Oman." },
    ],
  }),
});

const SERVICES = [
  { icon: Camera, title: "CCTV & Security Surveillance", desc: "IP cameras, NVR/DVR systems, video analytics, and remote monitoring for complete premise security.", tags: ["IP Cameras", "NVR/DVR", "Video Analytics", "Remote Monitoring"] },
  { icon: ShieldCheck, title: "Gate Barriers & Automation", desc: "Boom barriers, bollards, sliding gates, and parking management systems for vehicle access control.", tags: ["Boom Barriers", "Parking Systems", "Sliding Gates"] },
  { icon: Fingerprint, title: "Attendance & Access Control", desc: "Biometric, fingerprint and face recognition systems for workforce management and door access control.", tags: ["Biometric", "Face Recognition", "Door Access"] },
  { icon: Bell, title: "VDP & Intercom Systems", desc: "Video door phones, audio/video intercom, and visitor management solutions for secure entry points.", tags: ["Video Doorbell", "Intercom", "Visitor Mgmt"] },
  { icon: Code2, title: "Website & Software Development", desc: "Custom websites, mobile apps, POS software, ERP solutions and business automation tools built for Oman.", tags: ["Web Design", "POS", "Mobile Apps", "ERP"] },
  { icon: Cpu, title: "IT Infrastructure & Supply", desc: "Laptops, desktops, servers, networking equipment, structured cabling and complete IT hardware supply.", tags: ["Networking", "Servers", "Cabling", "Hardware"] },
];

function ServicesPage() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-[11px] tracking-[0.22em] uppercase text-accent font-medium mb-2">Our Services</div>
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-3">End-to-End IT & Security Services</h1>
        <p className="text-muted-foreground max-w-2xl mb-10">
          Comprehensive technology solutions designed for businesses across Oman — from installation to ongoing support.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ icon: Icon, title, desc, tags }) => (
            <div key={title} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-11 h-11 rounded-lg bg-accent/10 grid place-items-center mb-4 text-accent">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-primary mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t} className="text-[11px] bg-secondary border border-border rounded px-2 py-0.5 text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/contact" className="inline-block bg-accent2 hover:bg-accent2/90 text-accent2-foreground font-medium px-7 py-3 rounded-lg" style={{ boxShadow: "var(--shadow-cta)" }}>
            Request a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
