import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const trainingServices = [
  { icon: "🎓", title: "CCC Exam Preparation", desc: "Complete coaching and practice for CCC certification, a prerequisite for many government roles." },
  { icon: "📈", title: "Tally & GST Filing", desc: "Professional accounting training with Tally Prime and real-world GST return filing scenarios." },
  { icon: "📋", title: "Computer Basics", desc: "Fundamental computer operations, Windows navigation, and MS Office proficiency for beginners." },
  { icon: "🖥️", title: "DTP & Graphic Design", desc: "Design professional marketing materials, brochures, and layouts using specialized software." },
];

const administrativeServices = [
  { icon: "📝", title: "Online Form Filling", desc: "Assistance with Government exams, GPSC, GSSSB, and various recruitment registrations." },
  { icon: "🎖️", title: "Scholarship & RTE", desc: "Dedicated guidance for Digital Gujarat scholarships and RTE admission form entries." },
  { icon: "📄", title: "Jobwork & Documentation", desc: "Professional resume writing, letterpad design, application drafting, and data entry services." },
  { icon: "🖨️", title: "Printing & Scanning", desc: "High-quality color/BW printing, document scanning, and digital archival services." },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-birch min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="text-center mb-20">
            <div className="w-12 h-1 bg-berry mx-auto mb-6" />
            <h1 className="text-5xl font-serif font-bold mb-4 tracking-tight text-evergreen uppercase italic">Our <span className="text-berry">Services</span></h1>
            <p className="text-evergreen/60 max-w-xl mx-auto font-medium text-lg leading-relaxed">Beyond world-class training, we serve as a community hub for all your digital and administrative needs.</p>
          </div>

          <div className="space-y-24 mb-32">

            {/* Training Section */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-evergreen mb-10 italic border-b border-evergreen/10 pb-4">Vocational Training Programs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {trainingServices.map((s) => (
                  <div key={s.title} className="bg-white rounded-[2rem] p-8 border border-evergreen/5 shadow-xl shadow-evergreen/5 hover:scale-105 transition-all group">
                    <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all">{s.icon}</div>
                    <h3 className="text-xl font-serif font-bold text-evergreen mb-3">{s.title}</h3>
                    <p className="text-evergreen/60 text-sm leading-relaxed font-medium">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Admin Section */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-evergreen mb-10 italic border-b border-evergreen/10 pb-4">Jobwork & Community Assistance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {administrativeServices.map((s) => (
                  <div key={s.title} className="bg-white rounded-[2rem] p-8 border border-evergreen/5 shadow-xl shadow-evergreen/5 hover:scale-105 transition-all group">
                    <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all">{s.icon}</div>
                    <h3 className="text-xl font-serif font-bold text-evergreen mb-3">{s.title}</h3>
                    <p className="text-evergreen/60 text-sm leading-relaxed font-medium">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          <div className="max-w-4xl mx-auto bg-evergreen p-12 rounded-[3rem] text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-serif font-bold mb-6 italic tracking-tight">Need urgent assistance?</h3>
              <p className="text-white/70 mb-8 max-w-md mx-auto font-medium">Whether it's an emergency form or a professional resume, our desk is open for all computer-related tasks.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/reserve" className="btn-primary bg-berry border-berry hover:scale-105">Get Started</Link>
                <div className="px-8 py-3 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest flex items-center">
                  <a href="tel:+919426244093">Call: +91 94262 44093</a>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
