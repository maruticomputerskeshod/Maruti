"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

interface Course { id: number; name: string; }
interface Batch {
  id: number; name: string; course_id: number | null; timing: string; start_date: string | null; max_contacts: number; is_active: boolean; created_at: string; course_name: string | null; contact_count: number;
}

const empty = { name: "", timing: "", start_date: "", max_contacts: 30, is_active: true };

export default function BatchesPage() {
  const [items, setItems] = useState<Batch[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => {
    api.get("/api/batches?active_only=false").then(setItems).catch(console.error);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ ...empty }); setEditId(null); setShowModal(true); };
  const openEdit = (b: Batch) => { setForm({ name: b.name, timing: b.timing, start_date: b.start_date?.split("T")[0] || "", max_contacts: b.max_contacts, is_active: b.is_active }); setEditId(b.id); setShowModal(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, start_date: (form.start_date as string) || null };
    if (editId) await api.put(`/api/batches/${editId}`, payload);
    else await api.post("/api/batches", payload);
    setShowModal(false); load();
  };

  const remove = async (id: number) => { if (!confirm("Delete this batch?")) return; await api.delete(`/api/batches/${id}`); load(); };

  const filtered = items.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.timing.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evergreen tracking-tight">Training Batches</h1>
          <p className="text-evergreen/40 text-[10px] font-bold uppercase tracking-widest mt-1">Manage slots and contact distribution</p>
        </div>
        <div className="flex gap-3">
          <input type="text" placeholder="Search slots…" value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
          <button onClick={openNew} className="btn-primary py-2 text-sm">+ Create Batch</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(b => (
          <div key={b.id} className="glass rounded-[2rem] p-8 border border-evergreen/5 shadow-2xl shadow-evergreen/5 group hover:border-berry/20 transition-all flex flex-col h-full bg-white/40">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold font-serif text-evergreen italic">{b.name}</h3>
                <p className="text-[10px] font-bold text-berry uppercase tracking-[0.2em] mt-1">{b.timing}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${b.is_active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                {b.is_active ? "Live" : "Ended"}
              </span>
            </div>

            <div className="space-y-3 mb-8 flex-1">
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-evergreen/40">
                <span>Enrollment</span>
                <span>{b.contact_count} / {b.max_contacts}</span>
              </div>
              <div className="w-full bg-evergreen/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-evergreen to-berry h-full transition-all duration-700" style={{ width: `${Math.min(100, (b.contact_count / b.max_contacts) * 100)}%` }} />
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-evergreen/5">
              <Link href={`/admin/reservations?batch_id=${b.id}`} className="flex-1 btn-secondary text-[10px] py-2 border-evergreen/10 hover:bg-evergreen hover:text-white">
                View Layout
              </Link>
              <button onClick={() => openEdit(b)} className="p-2 btn-secondary border-evergreen/10 hover:border-berry/20">⚙️</button>
              <button onClick={() => remove(b.id)} className="p-2 btn-secondary border-evergreen/10 text-red-400 hover:bg-red-500/10 hover:text-red-600">🗑</button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-32 font-serif font-bold text-evergreen/10 italic text-2xl">
          No training batches found.
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-evergreen/60 backdrop-blur-sm px-4">
          <form onSubmit={save} className="admin-modal space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-evergreen italic">{editId ? "Update Batch" : "New Training Slot"}</h2>
              <p className="text-evergreen/40 text-[10px] font-bold uppercase tracking-widest mt-1">Configure timing and capacity</p>
            </div>

            <div className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Timing Slot (Name Auto-syncs)</label>
                  <input
                    required
                    value={form.timing as string}
                    onChange={e => setForm({ ...form, timing: e.target.value, name: e.target.value })}
                    className="w-full"
                    placeholder="e.g. 09:00 AM – 11:00 AM"
                  />
                </div>
                <div>
                  <label className="admin-label">Capacity (Seats)</label>
                  <input required type="number" value={form.max_contacts as number} onChange={e => setForm({ ...form, max_contacts: Number(e.target.value) })} className="w-full" />
                </div>
              </div>

              <div>
                <label className="admin-label">Batch Launch Date</label>
                <input type="date" value={form.start_date as string} onChange={e => setForm({ ...form, start_date: e.target.value })} className="w-full" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-evergreen/10">
              <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-evergreen cursor-pointer">
                <input type="checkbox" checked={form.is_active as boolean} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded-md border-evergreen/10 text-berry focus:ring-berry" />
                Active Registry
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary py-2 px-6 text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-8 text-sm">Save Changes</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
