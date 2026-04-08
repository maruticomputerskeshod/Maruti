"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import Link from "next/link";

interface Vacancy {
  id: number;
  title: string;
  description: string;
  eligibility: string;
  deadline: string;
  location: string;
}

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/vacancies?active_only=true").then(setVacancies).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-16 min-h-[70vh]">
        <div className="text-center mb-16">
          <div className="w-12 h-1 bg-berry mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 italic">
            Regional <span className="gradient-text">Recruitment</span>
          </h1>
          <p className="text-evergreen/60 max-w-xl mx-auto font-medium">Curated career opportunities for computer-trained candidates in the North Gujarat region.</p>
        </div>

        {loading ? (
          <div className="text-center text-evergreen/40 py-20 animate-pulse font-bold tracking-widest uppercase text-xs">Fetching opportunities...</div>
        ) : vacancies.length === 0 ? (
          <div className="text-center text-evergreen/40 py-20 font-bold uppercase tracking-widest text-xs">No active vacancies at this moment.</div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {vacancies.map((v) => (
              <Link key={v.id} href={`/vacancies/${v.id}`} className="glass rounded-[2rem] p-8 card-hover flex flex-col md:flex-row md:items-center border-evergreen/5 hover:border-berry/20 transition-all group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                     <span className="w-2 h-2 rounded-full bg-berry animate-pulse" />
                     <h3 className="text-2xl font-serif font-bold text-evergreen group-hover:text-berry transition-colors">{v.title}</h3>
                  </div>
                  <p className="text-evergreen/60 text-sm mb-4 line-clamp-2 pr-4">{v.description}</p>
                  <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-evergreen/40">
                     {v.location && <span className="flex items-center gap-1">📍 {v.location}</span>}
                     {v.eligibility && <span className="flex items-center gap-1">🎓 {v.eligibility}</span>}
                  </div>
                </div>
                <div className="mt-6 md:mt-0 md:pl-8 md:border-l md:border-evergreen/5 text-right shrink-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-evergreen/30 mb-1">Apply Before</p>
                  <p className="text-sm font-bold text-berry mb-4">{v.deadline ? new Date(v.deadline).toLocaleDateString("en-IN") : "Ongoing"}</p>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-berry opacity-0 group-hover:opacity-100 transition-all underline">View Details</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
