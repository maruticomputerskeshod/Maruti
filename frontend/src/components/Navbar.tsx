"use client";
import Link from "next/link";
import { useState } from "react";
import { useSettings } from "@/context/SettingsContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/vacancies", label: "Vacancies" },
  { href: "/reserve", label: "Reserve Seat" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <nav className="glass sticky top-0 z-50 border-b border-evergreen/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-evergreen flex items-center justify-center font-serif font-bold text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
              {settings.institute_name.charAt(0)}
            </div>
            <div className="hidden sm:block">
               <span className="text-2xl font-serif font-bold text-evergreen block leading-none">{settings.institute_name}</span>
               <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-berry opacity-60">{settings.institute_tagline}</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-evergreen/60 hover:text-evergreen hover:bg-evergreen/5 transition-all">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-xl bg-evergreen/5 text-evergreen">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-evergreen/5 animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-4 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-evergreen/60 hover:text-evergreen hover:bg-evergreen/5 transition-all">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
