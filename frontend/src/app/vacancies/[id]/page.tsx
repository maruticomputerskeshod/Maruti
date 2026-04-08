"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Vacancy {
  id: number;
  title: string;
  description: string;
  content: string | null;
  eligibility: string | null;
  deadline: string | null;
  location: string | null;
  created_at: string;
}

export default function VacancyDetailPage() {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/api/vacancies/${id}`).then(setVacancy).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-birch flex items-center justify-center font-bold uppercase tracking-[0.3em] text-evergreen/20 animate-pulse">Loading...</div>
      <Footer />
    </>
  );

  if (!vacancy) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-birch flex items-center justify-center font-serif text-2xl text-evergreen italic">Vacancy not found.</div>
      <Footer />
    </>
  );

  const formattedDate = vacancy.deadline ? new Date(vacancy.deadline).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric"
  }) : "Open Until Filled";

  return (
    <>
      <Navbar />
      <main className="bg-birch min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-evergreen/40 mb-12">
            <Link href="/" className="hover:text-berry">Home</Link>
            <span>/</span>
            <Link href="/vacancies" className="hover:text-berry">Vacancies</Link>
            <span>/</span>
            <span className="text-evergreen">{vacancy.title}</span>
          </div>

          <article className="glass rounded-[3rem] p-8 md:p-16 border-evergreen/5 bg-white/40 shadow-2xl shadow-evergreen/5">
            <header className="mb-12 border-b border-evergreen/5 pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-berry/10 text-berry text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Job Announcement
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-evergreen/40">
                   • {new Date(vacancy.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-evergreen mb-8 leading-tight">
                {vacancy.title}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-evergreen/30 block mb-1">Location</span>
                  <p className="text-sm font-bold text-evergreen">{vacancy.location || "Regional"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-evergreen/30 block mb-1">Deadline</span>
                  <p className="text-sm font-bold text-berry">{formattedDate}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-evergreen/30 block mb-1">Eligibility</span>
                  <p className="text-sm font-bold text-evergreen">{vacancy.eligibility || "Any Degree"}</p>
                </div>
                <div className="text-right">
                  <Link href="/contact" className="btn-primary py-3 px-6 text-xs whitespace-nowrap">Apply Now</Link>
                </div>
              </div>
            </header>

            {/* Content Section */}
            <div className="prose prose-evergreen max-w-none prose-headings:font-serif prose-headings:italic prose-a:text-berry">
              {vacancy.content ? (
                 <ReactMarkdown>{vacancy.content}</ReactMarkdown>
              ) : (
                <div className="space-y-6">
                  <p className="text-evergreen/70 text-lg leading-relaxed font-medium italic mb-8">
                    {vacancy.description}
                  </p>
                  <p className="text-evergreen/60 leading-relaxed">
                    We are looking for dedicated professionals to join our expanding team. This role offers competitive compensation, growth opportunities, and a collaborative environment.
                  </p>
                  <div className="bg-birch/50 p-8 rounded-3xl border border-evergreen/5">
                    <h4 className="text-lg font-serif font-bold text-evergreen mb-4">How to Apply</h4>
                    <p className="text-sm text-evergreen/60 leading-relaxed mb-6">
                      Interested candidates are requested to visit our administrative office with their updated resume and identity proof between 10 AM to 6 PM (Mon-Sat).
                    </p>
                    <Link href="/contact" className="text-berry font-bold text-sm underline hover:no-underline">Contact Institute Office →</Link>
                  </div>
                </div>
              )}
            </div>
          </article>

          <div className="mt-16 text-center">
            <Link href="/vacancies" className="text-[10px] font-bold uppercase tracking-[0.3em] text-evergreen/40 hover:text-berry transition-all">
               ← Back to Regional Recruitment
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
