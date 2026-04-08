import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-birch font-sans overflow-hidden">
        
        {/* --- Hero Section --- */}
        <section className="relative min-h-[90vh] flex items-center pt-20">
          <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="w-16 h-1 bg-berry mb-8" />
              <h1 className="text-6xl md:text-8xl font-serif font-bold text-evergreen mb-8 leading-[1.1] tracking-tight">
                Empowering <br />
                <span className="italic text-berry">Digital</span> Futures.
              </h1>
              <p className="text-evergreen/70 text-xl md:text-2xl mb-12 max-w-lg leading-relaxed font-medium">
                North Gujarat's premier vocational institute for computer education and professional career advancement.
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <Link href="/courses" className="btn-primary px-10 py-5 text-lg">Explore Programs</Link>
                <Link href="/reserve" className="btn-secondary px-10 py-5 text-lg">Visit Lab</Link>
              </div>
            </div>
            
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
              <div className="aspect-square relative rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl shadow-evergreen/10">
                <Image 
                  src="/images/gallery/lab.png" 
                  alt="Maruti Computer Lab" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-3xl shadow-xl border border-evergreen/5 text-center">
                <p className="text-4xl font-serif font-bold text-evergreen">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-evergreen/40 mt-1">Practical Learning</p>
              </div>
            </div>
          </div>
          
          {/* Abstract Background Element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-evergreen/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
        </section>

        {/* --- Training Preview --- */}
        <section className="py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-berry mb-4">Vocational Excellence</h2>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-evergreen leading-tight italic">Elite Training Programs for Modern Careers</h3>
              </div>
              <Link href="/courses" className="text-evergreen/40 hover:text-berry font-bold text-xs uppercase tracking-widest pb-2 border-b border-evergreen/10 hover:border-berry transition-all animate-bounce-x">
                View All Courses →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "CCC Expert", d: "3 Months", icon: "🎓" },
                { title: "Tally Prime + GST", d: "4 Months", icon: "📈" },
                { title: "Graphic Design", d: "6 Months", icon: "🎨" },
              ].map(c => (
                <div key={c.title} className="bg-birch p-10 rounded-[3rem] border border-evergreen/5 hover:scale-105 transition-all hover:shadow-2xl hover:shadow-evergreen/5 group">
                  <div className="text-5xl mb-8 grayscale group-hover:grayscale-0 transition-all">{c.icon}</div>
                  <h4 className="text-2xl font-serif font-bold text-evergreen mb-2">{c.title}</h4>
                  <p className="text-evergreen/40 font-bold text-[10px] uppercase tracking-widest mb-6">Duration: {c.d}</p>
                  <p className="text-evergreen/60 text-sm leading-relaxed mb-8">Industry-recognized curriculum designed for immediate employability.</p>
                  <Link href="/courses" className="text-berry font-bold text-xs uppercase tracking-widest hover:underline">Details</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Jobwork & Services Preview --- */}
        <section className="py-32 bg-birch">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/3] relative rounded-[3rem] overflow-hidden shadow-2xl">
                 <Image 
                  src="/images/gallery/ceremony.png" 
                  alt="Services" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-10">
              <div className="w-12 h-1 bg-berry" />
              <h3 className="text-5xl font-serif font-bold text-evergreen leading-tight italic">More than just an Institute.<br /><span className="text-berry">A Digital Utility.</span></h3>
              <p className="text-evergreen/60 text-lg leading-relaxed font-medium">
                We handle everything from scholarship forms to professional resume drafting. Our administrative desk is your one-stop solution for complex online registrations.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  "Scholarship Forms",
                  "RTE Admissions",
                  "GPSC/GSSSB Forms",
                  "Resume Drafting",
                ].map(s => (
                  <div key={s} className="flex items-center gap-3 text-evergreen font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-evergreen/5 text-berry flex items-center justify-center text-[10px]">✓</span>
                    {s}
                  </div>
                ))}
              </div>
              <Link href="/services" className="btn-primary inline-flex px-12 py-5 text-lg">Explore Services</Link>
            </div>
          </div>
        </section>

        {/* --- CTA / Banner --- */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto bg-evergreen p-16 md:p-24 rounded-[4rem] text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h3 className="text-4xl md:text-6xl font-serif font-bold mb-8 italic tracking-tight">Ready to start?</h3>
              <p className="text-white/60 text-xl max-w-2xl mx-auto mb-12 font-medium">Join over 5,000+ beneficiaries who have transformed their lives through Maruti's vocational programs.</p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link href="/reserve" className="btn-primary px-12 py-5 text-lg hover:scale-105 border-white/20">Reserve My Seat</Link>
                <Link href="/gallery" className="btn-secondary px-12 py-5 text-lg border-white/20 text-white hover:bg-white/10 hover:text-white">View Campus</Link>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-berry/5 rounded-full -translate-x-1/2 translate-y-1/2" />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
