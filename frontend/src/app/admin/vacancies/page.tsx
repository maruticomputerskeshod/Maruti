"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Vacancy {
  id: number; title: string; description: string | null; content: string | null; eligibility: string | null; deadline: string | null; location: string | null; is_active: boolean; created_at: string;
}

const empty = { title: "", description: "", content: "", eligibility: "", deadline: "", location: "", is_active: true };

export default function VacanciesPage() {
  const [items, setItems] = useState<Vacancy[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => api.get("/api/vacancies?active_only=false").then(setItems).catch(console.error);
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ ...empty }); setEditId(null); setShowModal(true); };
  const openEdit = (v: Vacancy) => { 
    setForm({ 
      title: v.title, 
      description: v.description || "", 
      content: v.content || "",
      eligibility: v.eligibility || "", 
      deadline: v.deadline || "", 
      location: v.location || "", 
      is_active: v.is_active 
    }); 
    setEditId(v.id); 
    setShowModal(true); 
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, deadline: (form.deadline as string) || null };
    if (editId) await api.put(`/api/vacancies/${editId}`, payload);
    else await api.post("/api/vacancies", payload);
    setShowModal(false); load();
  };

  const remove = async (id: number) => { if (!confirm("Delete this vacancy?")) return; await api.delete(`/api/vacancies/${id}`); load(); };

  const filtered = items.filter(v => v.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evergreen">Regional Vacancies</h1>
          <p className="text-evergreen/40 text-xs font-bold uppercase tracking-widest mt-1">Manage job announcements & recruitment</p>
        </div>
        <div className="flex gap-3">
          <input type="text" placeholder="Search vacancies…" value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
          <button onClick={openNew} className="btn-primary py-2 text-sm">+ Post Vacancy</button>
        </div>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden border-evergreen/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-evergreen/5 text-evergreen/40 text-left">
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Announcement</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Location</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Deadline</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Status</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-evergreen/5">{filtered.map(v => (
              <tr key={v.id} className="hover:bg-evergreen/5 transition-colors group">
                <td className="px-6 py-5 font-bold text-evergreen">{v.title}</td>
                <td className="px-6 py-5 text-evergreen/60">{v.location || "—"}</td>
                <td className="px-6 py-5 text-evergreen/60 font-medium">{v.deadline ? new Date(v.deadline).toLocaleDateString("en-IN") : "—"}</td>
                <td className="px-6 py-5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${v.is_active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>{v.is_active ? "Active" : "Hidden"}</span></td>
                <td className="px-6 py-5 flex gap-4">
                  <button onClick={() => openEdit(v)} className="text-berry font-bold text-xs uppercase tracking-widest hover:underline">Edit</button>
                  <button onClick={() => remove(v.id)} className="text-evergreen/30 hover:text-red-500 transition-colors font-bold text-xs uppercase tracking-widest">Delete</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length === 0 && <p className="text-center text-evergreen/30 py-12 italic">No vacancies found matching your search.</p>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-evergreen/60 backdrop-blur-sm px-4">
          <form onSubmit={save} className="admin-modal max-h-[90vh] overflow-y-auto space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-evergreen italic">{editId ? "Update Vacancy" : "Post New Vacancy"}</h2>
              <p className="text-evergreen/40 text-[10px] font-bold uppercase tracking-widest mt-1">Detailed recruitment information</p>
            </div>
            
            <div className="space-y-4">
              <div><label className="admin-label">Title</label><input required value={form.title as string} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full" placeholder="e.g. Junior Accountant" /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">Short Description</label><textarea value={form.description as string} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full" rows={2} placeholder="Brief summary..." /></div>
                <div><label className="admin-label">Eligibility / Req.</label><textarea value={form.eligibility as string} onChange={e => setForm({ ...form, eligibility: e.target.value })} className="w-full" rows={2} placeholder="e.g. B.Com, CCC..." /></div>
              </div>

              <div>
                <label className="admin-label">Markdown Content (Blog Style Details)</label>
                <textarea value={form.content as string} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full font-mono text-xs" rows={8} placeholder="## Job Responsibilities\n1. ...\n\n## Requirements\n- ..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">Last Date to Apply</label><input type="date" value={form.deadline as string} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full" /></div>
                <div><label className="admin-label">Job Location</label><input value={form.location as string} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full" placeholder="City / Region" /></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-evergreen/10">
              <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-evergreen cursor-pointer">
                <input type="checkbox" checked={form.is_active as boolean} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded-md border-evergreen/10 text-berry focus:ring-berry" />
                Visible to Public
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary py-2 px-6 text-sm border-evergreen/20">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-8 text-sm">Save Announcement</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
