"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BatchGrid from "@/components/BatchGrid";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Course { id: number; name: string; }

export default function ReservePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({ contact_name: "", phone: "", course_id: "", preferred_timing: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  // Mock occupied seats for preview
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);

  useEffect(() => {
    api.get("/api/courses?active_only=true").then(setCourses).catch(console.error);
  }, []);

  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  useEffect(() => {
    // Fetch occupied seats for the selected timing
    if (form.preferred_timing) {
      api.get(`/api/reservations/occupied?timing=${encodeURIComponent(form.preferred_timing)}`)
        .then(setOccupiedSeats)
        .catch(console.error);
      setSelectedSeat(null); // Reset when timing changes
    } else {
      setOccupiedSeats([]);
      setSelectedSeat(null);
    }
  }, [form.preferred_timing]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/api/reservations", { 
        ...form, 
        course_id: parseInt(form.course_id),
        seat_number: selectedSeat 
      });
      setStatus("success");
      setForm({ contact_name: "", phone: "", course_id: "", preferred_timing: "", message: "" });
      setSelectedSeat(null);
    } catch {
      setStatus("error");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-2xl bg-birch-dark/50 border border-evergreen/10 text-evergreen placeholder-evergreen/40 focus:border-berry focus:ring-1 focus:ring-berry outline-none transition-all";

  return (
    <>
      <Navbar />
      <main className="bg-birch min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left: Info & Layout Preview */}
            <div className="space-y-12">
              <div>
                <div className="w-12 h-1 bg-berry mb-6" />
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-evergreen mb-6 leading-tight">
                  Reserve Your <span className="italic text-berry">Seat</span>
                </h1>
                <p className="text-evergreen/70 text-lg max-w-md leading-relaxed">
                  Join our community of learners. Select your preferred timing and pick a specific computer station from our lab layout.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-evergreen font-medium">
                  <span className="w-8 h-8 rounded-full bg-evergreen/5 flex items-center justify-center text-berry">✓</span>
                  30 Modern Computer Stations
                </div>
                <div className="flex items-center gap-3 text-evergreen font-medium">
                  <span className="w-8 h-8 rounded-full bg-evergreen/5 flex items-center justify-center text-berry">✓</span>
                  High-Speed Internet Access
                </div>
              </div>

              {form.preferred_timing && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <p className="text-evergreen font-serif text-lg font-semibold mb-4 italic">Select Your Computer ({form.preferred_timing})</p>
                  <BatchGrid 
                    occupiedSeats={occupiedSeats} 
                    selectedSeat={selectedSeat || undefined}
                    onSelect={(seat) => setSelectedSeat(seat)}
                  />
                  <p className="mt-4 text-xs text-evergreen/40 italic font-sans font-bold uppercase tracking-widest">
                    {selectedSeat ? `✓ Station ${selectedSeat} Selected` : "* Click an available station to reserve it."}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Form */}
            <div className="bg-white p-8 md:p-12 rounded-4xl shadow-2xl shadow-evergreen/5 border border-evergreen/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-berry/5 rounded-full translate-x-1/2 -translate-y-1/2" />
              
              {status === "success" ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-6">✨</div>
                  <h2 className="text-3xl font-serif font-bold text-evergreen mb-4">Request Received</h2>
                  <p className="text-evergreen/60 mb-10 leading-relaxed">Thank you for your interest! Our team will contact you within 24 hours to confirm your seat and batch details.</p>
                  <button onClick={() => setStatus("idle")} className="btn-primary">
                    Make Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-6 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-evergreen/60 uppercase tracking-widest mb-2 ml-1">Full Name *</label>
                      <input required value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} className={inputClass} placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-evergreen/60 uppercase tracking-widest mb-2 ml-1">Phone Number *</label>
                      <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+91 9425X XXXXX" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-evergreen/60 uppercase tracking-widest mb-2 ml-1">Select Program *</label>
                    <select required value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })} className={inputClass}>
                      <option value="">Choose a training course...</option>
                      {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-evergreen/60 uppercase tracking-widest mb-2 ml-1">Preferred Batch Timing *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "07:00 AM – 09:00 AM", 
                        "09:00 AM – 11:00 AM", 
                        "11:00 AM – 01:00 PM", 
                        "01:00 PM – 03:00 PM", 
                        "03:00 PM – 05:00 PM", 
                        "05:00 PM – 07:00 PM"
                      ].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm({ ...form, preferred_timing: t })}
                          className={`
                            py-3 rounded-xl border text-sm font-medium transition-all
                            ${form.preferred_timing === t 
                              ? "bg-berry border-berry text-white shadow-lg shadow-berry/20" 
                              : "bg-birch-dark/30 border-evergreen/10 text-evergreen hover:border-berry/30"
                            }
                          `}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-evergreen/60 uppercase tracking-widest mb-2 ml-1">Notes / Goals</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className={inputClass} placeholder="Tell us about your learning goals..." />
                  </div>

                  {status === "error" && <p className="text-berry text-sm font-medium">Something went wrong. Please try again.</p>}
                  
                  <button 
                    type="submit" 
                    disabled={status === "sending" || !form.preferred_timing || !selectedSeat} 
                    className="w-full btn-primary mt-4 py-4 text-lg bg-evergreen disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                  >
                    {!form.preferred_timing ? "Select Timing First" : !selectedSeat ? "Click an Available Seat" : (status === "sending" ? "Processing..." : "Submit Reservation Request")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

