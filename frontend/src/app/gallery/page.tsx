"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

const items = [
  {
    title: "Modern Computer Lab",
    category: "Infrastructure",
    src: "/images/gallery/lab.png",
    desc: "Our state-of-the-art laboratory with 30 high-performance computer stations."
  },
  {
    title: "Vocational Graduation",
    category: "Community Success",
    src: "/images/gallery/ceremony.png",
    desc: "Proud moments from our recent vocational training certification ceremony."
  },
  {
    title: "Institute Entrance",
    category: "Campus",
    src: "/images/gallery/entrance.png",
    desc: "Welcome to Maruti Computer Education - Your gateway to digital excellence."
  },
];

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="bg-birch min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-24 lg:py-32">

          <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-12 h-1 bg-berry mx-auto mb-8" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-evergreen mb-6 italic">Visual <span className="text-berry">Campus</span></h1>
            <p className="text-evergreen/60 text-lg max-w-xl mx-auto leading-relaxed font-medium">Explore our facilities and the success stories of our trainees and partners at Maruti Computer Education.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((item, idx) => (
              <div key={idx} className="group glass rounded-[2.5rem] overflow-hidden border border-evergreen/5 hover:border-berry/20 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-evergreen/5 bg-white/40">
                <div className="aspect-[4/5] relative">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-evergreen/80 via-evergreen/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="absolute bottom-0 left-0 p-8 text-white translate-y-6 group-hover:translate-y-0 transition-transform duration-700 opacity-0 group-hover:opacity-100">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-3 text-berry">{item.category}</p>
                    <h3 className="text-3xl font-serif font-bold italic mb-3 leading-tight">{item.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner Section */}
          <div className="mt-40 mb-12">
            <div className="bg-evergreen p-16 md:p-24 rounded-[4rem] text-center text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h3 className="text-4xl md:text-6xl font-serif font-bold mb-8 italic tracking-tight">Experience it Yourself</h3>
                <p className="text-white/60 text-xl max-w-2xl mx-auto mb-12 font-medium">Walk in any time between 8 AM to 8 PM for a guided tour of our modern facilities.</p>
                <div className="flex flex-wrap justify-center gap-6">
                  <Link href="/reserve" className="btn-primary px-12 py-5 text-lg hover:scale-105 border-white/20">Reserve My Seat</Link>
                  <div className="px-10 py-5 rounded-full border border-white/20 text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap bg-white/5">
                    Keshod, Gujarat
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-berry/5 rounded-full -translate-x-1/2 translate-y-1/2" />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
