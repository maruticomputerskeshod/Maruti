"use client";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-white text-evergreen mt-20 font-sans border-t border-evergreen/5">
      <div className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-4xl font-serif font-bold text-evergreen tracking-tight mb-6 block group">
            {settings.institute_name.toUpperCase()}<span className="text-berry">.</span>
          </Link>
          <p className="text-evergreen/60 text-sm max-w-sm leading-relaxed font-serif font-medium italic opacity-80">
            Empowering the next generation of digital professionals through vocational excellence and industry-ready skills training.
          </p>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-evergreen/40 mb-8">Navigation</h4>
          <ul className="space-y-4 text-xs font-bold text-evergreen/70">
            <li><Link href="/courses" className="hover:text-berry transition-colors">Training Programs</Link></li>
            <li><Link href="/vacancies" className="hover:text-berry transition-colors">Regional Recruitment</Link></li>
            <li><Link href="/services" className="hover:text-berry transition-colors">Institute Services</Link></li>
            <li><Link href="/gallery" className="hover:text-berry transition-colors">Facility Gallery</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-evergreen/40 mb-8">Access</h4>
          <ul className="space-y-4 text-xs font-bold text-evergreen/70">
            <li className="flex items-start gap-3">
               <span className="text-berry text-[10px]">📍</span> 
               <span className="leading-relaxed opacity-80">{settings.address}</span>
            </li>
            <li className="flex items-center gap-3">
               <span className="text-berry text-[10px]">📞</span> 
               <span className="opacity-80">{settings.phone_primary}</span>
            </li>
            <li className="flex items-center gap-3">
               <span className="text-berry text-[10px]">✉️</span> 
               <span className="opacity-80 truncate">{settings.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12 pb-16 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-evergreen/30 border-t border-evergreen/5">
        {settings.footer_copyright}
      </div>
    </footer>
  );
}
