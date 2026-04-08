"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSettings } from "@/context/SettingsContext";

export default function ContactPage() {
  const { settings } = useSettings();

  const contactInfo = [
    { icon: "📍", label: "Address", value: settings.address },
    { icon: "📞", label: "Phone", value: `${settings.phone_primary} \n${settings.phone_secondary}` },
    { icon: "✉️", label: "Email", value: settings.email },
    { icon: "🕐", label: "Hours", value: settings.office_hours },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-birch min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-24 lg:py-32">
          
          <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-12 h-1 bg-berry mx-auto mb-8" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-evergreen mb-6 italic">Connect <span className="text-berry">With Us</span></h1>
            <p className="text-evergreen/60 text-lg max-w-xl mx-auto leading-relaxed font-medium">
              Have questions? Our administrative desk is available from morning to evening to assist with admissions and services.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left: Contact Info Info */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
              {contactInfo.map((item) => (
                <div key={item.label} className="glass rounded-[2rem] p-8 flex items-start gap-6 border border-evergreen/5 hover:border-berry/20 transition-all hover:bg-white/60 group">
                  <div className="text-4xl filter group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-evergreen/40 mb-3">{item.label}</h3>
                    <p className="text-evergreen text-lg font-serif font-semibold italic whitespace-pre-line leading-snug">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Map Banner */}
            <div className="lg:col-span-7">
               <div className="h-full min-h-[500px] glass rounded-[3rem] overflow-hidden relative group border border-evergreen/10">
                  <iframe 
                    src={settings.map_embed_url}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: "grayscale(0.5) contrast(1.1)" }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-1000 opacity-60 hover:opacity-100"
                  />
                  
                  {/* Decorative Elements Overlay */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-berry/5 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-evergreen/5 rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />
               </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
