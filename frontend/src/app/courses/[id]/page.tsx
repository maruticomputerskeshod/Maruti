"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Course {
  id: number;
  name: string;
  description: string;
  duration: string;
  fees: number;
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/api/courses/${id}`).then(setCourse).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-birch flex items-center justify-center font-bold uppercase tracking-[0.3em] text-evergreen/20 animate-pulse">Loading...</div>
      <Footer />
    </>
  );

  if (!course) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-birch flex items-center justify-center font-serif text-2xl text-evergreen italic">Course not found.</div>
      <Footer />
    </>
  );

  const syllabus = [
    { title: "Introduction to Module", content: "Understanding the core concepts and fundamental principles of the subject matter." },
    { title: "Technical Fundamentals", content: "Deep dive into the tools, platforms, and technical frameworks used in the industry." },
    { title: "Practical Workshop", content: "Hands-on projects and real-world simulations to build professional muscle memory." },
    { title: "Advanced Optimizations", content: "Mastering the nuances that separate beginners from industry experts." },
    { title: "Final Certification", content: "Comprehensive assessment and project submission for government-recognized certification." },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-birch min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-evergreen/40 mb-12">
            <Link href="/" className="hover:text-berry">Home</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-berry">Courses</Link>
            <span>/</span>
            <span className="text-evergreen">{course.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 items-start">
            
            {/* Left Content: Course Details */}
            <div className="lg:col-span-2 space-y-16">
              <div>
                <h1 className="text-6xl md:text-7xl font-serif font-bold text-evergreen mb-8 leading-tight italic">
                  {course.name}
                </h1>
                <p className="text-evergreen/70 text-xl leading-relaxed font-medium max-w-2xl">
                  {course.description}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="glass p-6 rounded-3xl border-evergreen/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-evergreen/30 block mb-2">Duration</span>
                  <p className="text-xl font-bold text-evergreen">{course.duration}</p>
                </div>
                <div className="glass p-6 rounded-3xl border-evergreen/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-evergreen/30 block mb-2">Certification</span>
                  <p className="text-xl font-bold text-evergreen">Govt. Recognized</p>
                </div>
                <div className="glass p-6 rounded-3xl border-evergreen/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-evergreen/30 block mb-2">Difficulty</span>
                  <p className="text-xl font-bold text-evergreen">Professional</p>
                </div>
              </div>

              <section className="space-y-8">
                <h2 className="text-3xl font-serif font-bold text-evergreen italic">Syllabus Overview</h2>
                <div className="space-y-6">
                  {syllabus.map((item, idx) => (
                    <div key={idx} className="flex gap-6 group">
                      <div className="w-12 h-12 rounded-full border border-evergreen/10 flex items-center justify-center text-sm font-bold text-evergreen/30 group-hover:bg-berry group-hover:text-white group-hover:border-berry transition-all shrink-0">
                        0{idx + 1}
                      </div>
                      <div className="pt-2">
                        <h4 className="text-lg font-bold text-evergreen mb-2">{item.title}</h4>
                        <p className="text-evergreen/60 text-sm leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Content: CTA Card */}
            <div className="lg:sticky lg:top-32">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-evergreen/5 border border-evergreen/5 space-y-8 text-center">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-evergreen/30">Total Program Fee</span>
                  <p className="text-5xl font-bold text-berry">₹{Number(course.fees).toLocaleString("en-IN")}</p>
                  <p className="text-xs text-evergreen/40 font-medium">* EMI Options available at institute</p>
                </div>
                
                <div className="space-y-4 pt-4">
                  <Link href="/reserve" className="btn-primary w-full py-5 text-lg">
                    Reserve Your Seat
                  </Link>
                  <Link href="/contact" className="btn-secondary w-full py-5 text-lg">
                    Talk to Counselor
                  </Link>
                </div>

                <div className="pt-6 border-t border-evergreen/5 space-y-4">
                   <div className="flex items-center gap-3 text-left text-sm text-evergreen font-medium">
                      <span className="text-berry">✓</span> Offline Practical Classes
                   </div>
                   <div className="flex items-center gap-3 text-left text-sm text-evergreen font-medium">
                      <span className="text-berry">✓</span> Verified Certification
                   </div>
                   <div className="flex items-center gap-3 text-left text-sm text-evergreen font-medium">
                      <span className="text-berry">✓</span> Resume Support
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
