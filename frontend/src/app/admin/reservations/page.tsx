"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import BatchGrid from "@/components/BatchGrid";

interface Reservation {
  id: number; contact_name: string; phone: string; course_id: number; preferred_timing: string | null; message: string | null; status: string; created_at: string; course_name: string | null;
}

interface Batch {
  id: number; name: string; timing: string; course_name: string; max_contacts: number;
}

interface Contact {
  id: number; name: string; seat_number: number | null; phone: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  contacted: "bg-blue-500/10 text-blue-600",
  converted: "bg-green-500/10 text-green-600",
  rejected: "bg-red-500/10 text-red-600",
};

function ReservationsContent() {
  const searchParams = useSearchParams();
  const initialBatchId = searchParams.get("batch_id");

  const [activeTab, setActiveTab] = useState(initialBatchId ? "seats" : "list");
  const [items, setItems] = useState<Reservation[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<number | null>(initialBatchId ? Number(initialBatchId) : null);
  const [batchContacts, setBatchContacts] = useState<Contact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [unassignedSearch, setUnassignedSearch] = useState("");
  
  const [showAssignModal, setShowAssignModal] = useState<{seat: number} | null>(null);

  const loadReservations = () => api.get("/api/reservations").then(setItems).catch(console.error);
  const loadBatches = () => api.get("/api/batches").then(setBatches).catch(console.error);
  const loadAllContacts = () => api.get("/api/contacts").then(setAllContacts).catch(console.error);

  useEffect(() => {
    loadReservations();
    loadBatches();
    loadAllContacts();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      const batch = batches.find(b => b.id === selectedBatch);
      if (batch) {
        api.get(`/api/contacts?timing=${encodeURIComponent(batch.timing)}`).then(setBatchContacts).catch(console.error);
      } else {
        api.get(`/api/contacts?batch_id=${selectedBatch}`).then(setBatchContacts).catch(console.error);
      }
    } else {
      setBatchContacts([]);
    }
  }, [selectedBatch, batches]);

  const updateStatus = async (id: number, status: string) => {
    await api.put(`/api/reservations/${id}/status?status=${status}`, {});
    loadReservations();
  };

  const assignContactToSeat = async (contactId: number, seatNumber: number) => {
    if (!selectedBatch) return;
    await api.put(`/api/contacts/${contactId}`, { 
      batch_id: selectedBatch, 
      seat_number: seatNumber 
    });
    setShowAssignModal(null);
    // Refresh using shared timing logic
    const batch = batches.find(b => b.id === selectedBatch);
    if (batch) {
      api.get(`/api/contacts?timing=${encodeURIComponent(batch.timing)}`).then(setBatchContacts).catch(console.error);
    } else {
      api.get(`/api/contacts?batch_id=${selectedBatch}`).then(setBatchContacts).catch(console.error);
    }
    loadAllContacts();
  };

  const unassignSeat = async (contactId: number) => {
    await api.put(`/api/contacts/${contactId}`, { 
      batch_id: null, 
      seat_number: null 
    });
    if (selectedBatch) {
      const batch = batches.find(b => b.id === selectedBatch);
      if (batch) {
        api.get(`/api/contacts?timing=${encodeURIComponent(batch.timing)}`).then(setBatchContacts).catch(console.error);
      } else {
        api.get(`/api/contacts?batch_id=${selectedBatch}`).then(setBatchContacts).catch(console.error);
      }
    }
    loadAllContacts();
  };

  const filteredReservations = items.filter(r => {
    const matchesSearch = r.contact_name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search);
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const unassignedContacts = allContacts.filter(s => 
    !s.seat_number && 
    (s.name.toLowerCase().includes(unassignedSearch.toLowerCase()) || s.phone.includes(unassignedSearch))
  );

  const occupiedSeatsMap = new Map(batchContacts.map(s => [s.seat_number, s]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-evergreen tracking-tight">Lead Registry & Lab Management</h1>
          <p className="text-evergreen/40 font-medium text-sm italic">Orchestrate contact inquiries and computer lab assignments</p>
        </div>
        
        <div className="flex bg-evergreen/5 p-1 rounded-xl border border-evergreen/10 self-start">
          <button onClick={() => setActiveTab("list")} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "list" ? "bg-white text-evergreen shadow-sm" : "text-evergreen/40 hover:text-evergreen/60"}`}>Inquiry Leads</button>
          <button onClick={() => setActiveTab("seats")} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "seats" ? "bg-white text-evergreen shadow-sm" : "text-evergreen/40 hover:text-evergreen/60"}`}>Lab Layout</button>
        </div>
      </div>

      {activeTab === "list" ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex gap-2">
            <input type="text" placeholder="Search inquiry list…" value={search} onChange={e => setSearch(e.target.value)} className="px-4 py-2 rounded-xl bg-white/50 border border-evergreen/10 text-sm focus:outline-none focus:border-berry transition w-full sm:w-64" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 rounded-xl bg-white/50 border border-evergreen/10 text-sm focus:outline-none focus:border-berry transition">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="glass rounded-2xl overflow-hidden border border-evergreen/10 shadow-xl shadow-evergreen/5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-evergreen/10 text-evergreen/60 bg-evergreen/5">
                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Contact Candidate</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Inquiry Context</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Follow-up Status</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider">Receipt Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-evergreen/5 text-[13px]">
                  {filteredReservations.map(r => (
                    <tr key={r.id} className="hover:bg-evergreen/5 transition group">
                      <td className="px-6 py-4 text-evergreen font-bold">
                        <div>{r.contact_name}</div>
                        <div className="text-[10px] text-evergreen/40 font-medium tracking-tight mt-0.5">{r.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-berry uppercase tracking-wide">{r.course_name || "General Program"}</div>
                        <div className="text-[10px] text-evergreen/60 italic mt-0.5 opacity-60">🕒 {r.preferred_timing || "Any time slot"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border-0 cursor-pointer ${statusColors[r.status] || "bg-gray-500/10 text-gray-500"}`}>
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-bold text-evergreen/30 uppercase">
                        {new Date(r.created_at).toLocaleDateString("en-IN", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4 bg-white/50 p-3 rounded-2xl border border-evergreen/10">
              <span className="text-xs font-bold uppercase tracking-widest text-evergreen/40 ml-2">Active Batch:</span>
              <select value={selectedBatch || ""} onChange={e => setSelectedBatch(e.target.value ? Number(e.target.value) : null)} className="flex-1 px-4 py-2 rounded-xl bg-white border-none focus:ring-0 outline-none transition font-bold text-evergreen">
                <option value="">Select a training slot to view lab layout...</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.name} — {b.timing}</option>)}
              </select>
            </div>

            {selectedBatch ? (
              <div className="relative">
                <BatchGrid 
                  isAdmin={true}
                  occupiedSeats={Array.from(occupiedSeatsMap.keys()) as number[]} 
                  onSelect={(seat) => {
                    const contact = occupiedSeatsMap.get(seat);
                    if (contact) {
                      if (confirm(`Remove ${contact.name} from seat ${seat}?`)) unassignSeat(contact.id);
                    } else {
                      setShowAssignModal({ seat });
                    }
                  }}
                />
                <div className="mt-6 flex justify-center gap-8 px-6 py-3 rounded-2xl bg-evergreen/5 border border-evergreen/10">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-evergreen/40">
                    <div className="w-3 h-3 rounded-sm bg-white border border-evergreen/10" /> Vacant
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-evergreen/40">
                    <div className="w-3 h-3 rounded-sm bg-moss" /> Assigned
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-evergreen/40">
                    <div className="w-3 h-3 rounded-sm bg-berry" /> Active
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[450px] glass rounded-[3rem] flex flex-col items-center justify-center text-center p-12 border border-evergreen/5 shadow-2xl shadow-evergreen/5">
                <div className="text-5xl mb-6 opacity-20">🖥️</div>
                <h3 className="text-xl font-bold font-serif text-evergreen mb-3">Live Laboratory View</h3>
                <p className="text-evergreen/40 text-sm max-w-xs leading-relaxed italic">Synchronize contact enrollments with computer hardware in real-time. Please select a batch slot above to begin.</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-berry">Registry Waiting List</h3>
              <span className="text-[10px] font-bold text-evergreen/40 bg-evergreen/5 px-2 py-0.5 rounded-md">{unassignedContacts.length} Contacts</span>
            </div>
            <div className="glass rounded-3xl h-[600px] overflow-hidden flex flex-col border border-evergreen/10 shadow-2xl shadow-evergreen/5 bg-white/40 backdrop-blur-xl">
              <div className="p-3 border-b border-evergreen/5">
                <input type="text" placeholder="Filter waiting list…" value={unassignedSearch} onChange={e => setUnassignedSearch(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white border border-evergreen/10 text-xs focus:outline-none focus:border-berry transition placeholder:text-evergreen/20" />
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {unassignedContacts.map(s => (
                  <div key={s.id} className="p-4 rounded-2xl bg-white hover:bg-evergreen group transition-all duration-300 border border-evergreen/5 cursor-pointer shadow-sm active:scale-95" onClick={() => setShowAssignModal(showAssignModal ? { ...showAssignModal } : null)}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-xs group-hover:text-white transition-colors">{s.name}</div>
                        <div className="text-[10px] text-evergreen/40 group-hover:text-white/60 font-medium uppercase tracking-tighter mt-1">{s.phone}</div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold uppercase tracking-widest">Assign →</div>
                    </div>
                  </div>
                ))}
                {unassignedContacts.length === 0 && (
                  <div className="text-center py-20 text-[10px] font-bold text-evergreen/20 uppercase tracking-[0.2em] px-8">
                    No candidates awaiting assignment
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-evergreen/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="glass rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold font-serif text-evergreen mb-2">Assign Station {showAssignModal.seat}</h3>
            <p className="text-evergreen/40 text-xs mb-6 font-medium italic">Select a contact from the registry to occupy this station.</p>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto mb-8 pr-2 custom-scrollbar">
              {unassignedContacts.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => assignContactToSeat(s.id, showAssignModal.seat)}
                  className="w-full text-left p-4 rounded-2xl bg-evergreen/5 hover:bg-berry hover:text-white transition-all duration-200 group flex justify-between items-center"
                >
                  <span className="font-bold text-sm">{s.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">Select</span>
                </button>
              ))}
              {unassignedContacts.length === 0 && (
                <p className="text-center py-8 text-xs font-bold text-evergreen/20 uppercase">No unassigned contacts</p>
              )}
            </div>

            <button onClick={() => setShowAssignModal(null)} className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-evergreen/40 hover:text-evergreen hover:bg-evergreen/5 transition-all">
              Cancel Assignment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReservationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-serif text-evergreen/40 animate-pulse">Loading records...</div>}>
      <ReservationsContent />
    </Suspense>
  );
}

