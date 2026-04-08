"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Course {
  id: number; name: string; description: string | null; duration: string; fees: number; is_active: boolean; created_at: string;
}

const empty = { name: "", description: "", duration: "", fees: 0, is_active: true };

export default function CoursesPage() {
  const [items, setItems] = useState<Course[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => api.get("/api/courses?active_only=false").then(setItems).catch(console.error);
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ ...empty }); setEditId(null); setShowModal(true); };
  const openEdit = (c: Course) => { setForm({ name: c.name, description: c.description || "", duration: c.duration, fees: c.fees, is_active: c.is_active }); setEditId(c.id); setShowModal(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) await api.put(`/api/courses/${editId}`, form);
    else await api.post("/api/courses", form);
    setShowModal(false); load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    await api.delete(`/api/courses/${id}`); load();
  };

  const filtered = items.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evergreen">Curriculum Manager</h1>
          <p className="text-evergreen/40 text-xs font-bold uppercase tracking-widest mt-1">Manage vocational training courses</p>
        </div>
        <div className="flex gap-3">
          <input type="text" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
          <button onClick={openNew} className="btn-primary py-2 text-sm">+ Add Course</button>
        </div>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden border-evergreen/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-evergreen/5 text-evergreen/40 text-left">
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Course Name</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Duration</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Fees</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Status</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-evergreen/5">{filtered.map(c => (
              <tr key={c.id} className="hover:bg-evergreen/5 transition-colors group">
                <td className="px-6 py-5 font-bold text-evergreen">{c.name}</td>
                <td className="px-6 py-5 text-evergreen/60">{c.duration}</td>
                <td className="px-6 py-5 text-evergreen/60 font-medium">₹{Number(c.fees).toLocaleString("en-IN")}</td>
                <td className="px-6 py-5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${c.is_active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>{c.is_active ? "Active" : "Hidden"}</span></td>
                <td className="px-6 py-5 flex gap-4">
                  <button onClick={() => openEdit(c)} className="text-berry font-bold text-xs uppercase tracking-widest hover:underline">Edit</button>
                  <button onClick={() => remove(c.id)} className="text-evergreen/30 hover:text-red-500 transition-colors font-bold text-xs uppercase tracking-widest">Delete</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length === 0 && <p className="text-center text-evergreen/30 py-12 italic">No courses found matching your search.</p>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-evergreen/60 backdrop-blur-sm px-4">
          <form onSubmit={save} className="admin-modal space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-evergreen italic">{editId ? "Update Course" : "New Curriculum"}</h2>
              <p className="text-evergreen/40 text-[10px] font-bold uppercase tracking-widest mt-1">Define course details and pricing</p>
            </div>
            
            <div className="space-y-4">
              <div><label className="admin-label">Course Name</label><input required value={form.name as string} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full" placeholder="e.g. Advance Excel" /></div>
              <div><label className="admin-label">Description</label><textarea value={form.description as string} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full" rows={3} placeholder="Brief overview of the course..." /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">Duration</label><input required value={form.duration as string} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full" placeholder="e.g. 3 Months" /></div>
                <div><label className="admin-label">Fees (₹)</label><input required type="number" value={form.fees as number} onChange={e => setForm({ ...form, fees: Number(e.target.value) })} className="w-full" /></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-evergreen/10">
              <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-evergreen cursor-pointer">
                <input type="checkbox" checked={form.is_active as boolean} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded-md border-evergreen/10 text-berry focus:ring-berry" />
                Active Offering
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary py-2 px-6 text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-8 text-sm">Save Course</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
