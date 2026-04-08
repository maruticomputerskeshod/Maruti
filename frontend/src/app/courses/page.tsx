"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import Link from "next/link";

interface Course {
  id: number;
  name: string;
  description: string;
  duration: string;
  fees: number;
}

const icons: Record<string, string> = {
  CCC: "💻", Tally: "📊", Photoshop: "🎨", Typing: "⌨️", "MS Office": "📁",
  Basic: "🖥️", Excel: "📈", Web: "🌐",
};

function getIcon(name: string) {
  for (const [key, icon] of Object.entries(icons)) {
    if (name.includes(key)) return icon;
  }
  return "📚";
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/courses?active_only=true").then(setCourses).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-16 min-h-[70vh]">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-evergreen tracking-tight">
            Our <span className="gradient-text italic">Courses</span>
          </h1>
          <p className="text-evergreen/60 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
            Discover our range of professional vocational programs designed to accelerate your career in the digital landscape.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-evergreen/40 py-20 animate-pulse font-bold tracking-widest uppercase text-xs">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center text-evergreen/40 py-20 font-bold uppercase tracking-widest text-xs">No courses available right now.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((c) => (
              <Link key={c.id} href={`/courses/${c.id}`} className="glass rounded-[2.5rem] p-8 card-hover flex flex-col group border-evergreen/5 hover:border-berry/20 transition-all">
                <div className="text-6xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">{getIcon(c.name)}</div>
                <h3 className="text-2xl font-serif font-bold text-evergreen mb-3">{c.name}</h3>
                <p className="text-evergreen/60 text-sm mb-8 flex-1 leading-relaxed">{c.description}</p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-evergreen/5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-evergreen/30 block mb-1">Duration</span>
                    <p className="text-sm text-evergreen font-bold">{c.duration}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-evergreen/30 block mb-1">Fee Plan</span>
                    <p className="text-lg font-bold text-berry">₹{Number(c.fees).toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-berry opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 text-center">
                  View Syllabus & Details →
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
