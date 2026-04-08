"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Course { id: number; name: string; }
interface Batch { id: number; name: string; timing: string; }
interface ParentOrg { id: number; name: string; contact_type: string; }

interface EducationRow {
  stream: string;
  passing_year: string;
  college: string;
  enrollment_no: string;
  percentage: string;
}

interface ContactFormProps {
  initialData?: any;
  contactId?: number;
}

export default function ContactForm({ initialData, contactId }: ContactFormProps) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [parentOrgs, setParentOrgs] = useState<ParentOrg[]>([]);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.profile_photo_path || null);

  const [form, setForm] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    contact_type: initialData?.contact_type || "individual",
    contact_person: initialData?.contact_person || "",
    parent_id: initialData?.parent_id || "",
    aadhar_number: initialData?.aadhar_number || "",
    dob: initialData?.dob || "",
    current_degree: initialData?.current_degree || "",
    enrollment_number: initialData?.enrollment_number || "",
    course_id: initialData?.course_id || "",
    batch_id: initialData?.batch_id || "",
    seat_number: initialData?.seat_number || "",
    education_history: initialData?.education_history || [
      { stream: "10th", passing_year: "", college: "", enrollment_no: "", percentage: "" },
      { stream: "12th", passing_year: "", college: "", enrollment_no: "", percentage: "" }
    ] as EducationRow[]
  });

  useEffect(() => {
    api.get("/api/courses").then(setCourses).catch(console.error);
    api.get("/api/batches").then(setBatches).catch(console.error);
    api.get("/api/contacts").then((res: any[]) => {
      // Filter out only schools/colleges to act as parent organizations
      setParentOrgs(res.filter(c => ["school", "college", "company"].includes(c.contact_type)));
    }).catch(console.error);
  }, []);

  const handleEducationChange = (index: number, field: keyof EducationRow, value: string) => {
    const newHistory = [...form.education_history];
    newHistory[index][field] = value;
    setForm({ ...form, education_history: newHistory });
  };

  const addEducationRow = () => {
    setForm({
      ...form,
      education_history: [...form.education_history, { stream: "", passing_year: "", college: "", enrollment_no: "", percentage: "" }]
    });
  };

  const removeEducationRow = (index: number) => {
    const newHistory = form.education_history.filter((_: any, i: number) => i !== index);
    setForm({ ...form, education_history: newHistory });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        course_id: form.course_id ? Number(form.course_id) : null,
        batch_id: form.batch_id ? Number(form.batch_id) : null,
        seat_number: form.seat_number ? Number(form.seat_number) : null,
        parent_id: form.parent_id ? Number(form.parent_id) : null,
      };

      if (contactId) {
        await api.put(`/api/contacts/${contactId}`, payload);
      } else {
        await api.post("/api/contacts", payload);
      }
      router.push("/admin/contacts");
      router.refresh();
    } catch (error) {
      console.error("Failed to save contact:", error);
      alert("Error saving contact data");
    } finally {
      setLoading(false);
    }
  };

  const isIndividual = form.contact_type === "individual";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Header with Photo Upload */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {isIndividual && (
          <div className="w-32 h-40 bg-evergreen/5 border-2 border-dashed border-evergreen/20 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer shrink-0">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-2">
                <span className="text-2xl mb-1 block">👤</span>
                <span className="text-[10px] font-bold text-evergreen/40 uppercase">Photo</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setPhotoPreview(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
            <div className="absolute inset-0 bg-evergreen/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-xs font-bold">Upload</span>
            </div>
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <label className="block text-xs font-bold text-evergreen/60 uppercase mb-1">Contact Type</label>
            <select 
              value={form.contact_type} 
              onChange={e => setForm({...form, contact_type: e.target.value})} 
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-evergreen/10 focus:border-berry outline-none transition appearance-none"
            >
              <option value="individual">Individual / Private Contact</option>
              <option value="school">School / Institution</option>
              <option value="college">College / University</option>
              <option value="company">Company / Organization</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-evergreen/60 uppercase mb-1">Full Name / Org Name</label>
            <input 
              required 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-evergreen/10 focus:border-berry outline-none transition" 
              placeholder={isIndividual ? "e.g. Rajesh Kumar" : "e.g. KV School"}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-evergreen/60 uppercase mb-1">Phone Number</label>
            <input 
              required 
              value={form.phone} 
              onChange={e => setForm({...form, phone: e.target.value})} 
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-evergreen/10 focus:border-berry outline-none transition" 
              placeholder="10-digit mobile"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-evergreen/60 uppercase mb-1">Email (Optional)</label>
            <input 
              type="email" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-evergreen/10 focus:border-berry outline-none transition" 
              placeholder="email@example.com"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-evergreen/60 uppercase mb-1">Full Address</label>
          <textarea 
            value={form.address} 
            onChange={e => setForm({...form, address: e.target.value})} 
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-evergreen/10 focus:border-berry outline-none transition min-h-[80px]" 
            placeholder="House No, Village, City, PIN..."
          />
        </div>

        {isIndividual && (
          <div>
            <label className="block text-xs font-bold text-evergreen/60 uppercase mb-1">Parent Organization / School</label>
            <select 
              value={form.parent_id} 
              onChange={e => setForm({...form, parent_id: e.target.value})} 
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-evergreen/10 focus:border-berry outline-none transition appearance-none"
            >
              <option value="">None (Independent)</option>
              {parentOrgs.map(org => (
                <option key={org.id} value={org.id}>{org.name} ({org.contact_type})</option>
              ))}
            </select>
          </div>
        )}

        {!isIndividual && (
           <div>
            <label className="block text-xs font-bold text-evergreen/60 uppercase mb-1">Contact Person</label>
            <input 
              value={form.contact_person} 
              onChange={e => setForm({...form, contact_person: e.target.value})} 
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-evergreen/10 focus:border-berry outline-none transition" 
              placeholder="e.g. Principal Mr. Sharma"
            />
          </div>
        )}
      </div>

      {isIndividual && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-evergreen/10">
            <div>
              <label className="block text-xs font-bold text-evergreen/60 uppercase mb-1">Aadhar Number</label>
              <input 
                value={form.aadhar_number} 
                onChange={e => setForm({...form, aadhar_number: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-evergreen/10 focus:border-berry outline-none transition" 
                placeholder="12-digit number"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-evergreen/60 uppercase mb-1">Date of Birth</label>
              <input 
                type="date" 
                value={form.dob} 
                onChange={e => setForm({...form, dob: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-evergreen/10 focus:border-berry outline-none transition" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-evergreen/60 uppercase mb-1">Current Degree</label>
              <input 
                value={form.current_degree} 
                onChange={e => setForm({...form, current_degree: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-evergreen/10 focus:border-berry outline-none transition" 
                placeholder="e.g. B.Tech 3rd Year"
              />
            </div>
          </div>

          {/* Course & Batch Selection */}
          <div className="p-6 bg-evergreen/5 rounded-2xl border border-evergreen/10 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-evergreen/60 uppercase mb-2">Select Course</label>
              <select 
                value={form.course_id} 
                onChange={e => setForm({...form, course_id: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-evergreen/10 focus:border-berry outline-none transition appearance-none"
              >
                <option value="">Choose a course...</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-evergreen/60 uppercase mb-2">Assign Batch</label>
              <select 
                value={form.batch_id} 
                onChange={e => setForm({...form, batch_id: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-evergreen/10 focus:border-berry outline-none transition appearance-none"
              >
                <option value="">None / Timing only</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.timing})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-evergreen/60 uppercase mb-2">Seat No.</label>
              <input 
                type="number" 
                value={form.seat_number} 
                onChange={e => setForm({...form, seat_number: e.target.value})} 
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-evergreen/10 focus:border-berry outline-none transition" 
                placeholder="1-30"
              />
            </div>
          </div>

          {/* Education History Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-berry flex items-center gap-2">
                <span>🎓</span> Educational History
              </h3>
              <button 
                type="button" 
                onClick={addEducationRow}
                className="text-xs font-bold text-evergreen bg-evergreen/10 hover:bg-evergreen/20 px-3 py-1.5 rounded-lg transition"
              >
                + Add Degree/Stream
              </button>
            </div>
            
            <div className="overflow-x-auto border border-evergreen/10 rounded-2xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-evergreen/5 text-evergreen/60 font-bold uppercase text-[10px] tracking-widest text-left">
                    <th className="px-4 py-3">Stream</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">College/School</th>
                    <th className="px-4 py-3">Enroll. No.</th>
                    <th className="px-4 py-3">% / CGPA</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-evergreen/5">
                  {form.education_history.map((row: EducationRow, index: number) => (
                    <tr key={index}>
                      <td className="p-2"><input value={row.stream} onChange={e => handleEducationChange(index, 'stream', e.target.value)} className="w-full bg-transparent p-1 outline-none focus:bg-evergreen/5 rounded" /></td>
                      <td className="p-2"><input value={row.passing_year} onChange={e => handleEducationChange(index, 'passing_year', e.target.value)} className="w-full bg-transparent p-1 outline-none focus:bg-evergreen/5 rounded" placeholder="2024" /></td>
                      <td className="p-2"><input value={row.college} onChange={e => handleEducationChange(index, 'college', e.target.value)} className="w-full bg-transparent p-1 outline-none focus:bg-evergreen/5 rounded" /></td>
                      <td className="p-2"><input value={row.enrollment_no} onChange={e => handleEducationChange(index, 'enrollment_no', e.target.value)} className="w-full bg-transparent p-1 outline-none focus:bg-evergreen/5 rounded" /></td>
                      <td className="p-2"><input value={row.percentage} onChange={e => handleEducationChange(index, 'percentage', e.target.value)} className="w-full bg-transparent p-1 outline-none focus:bg-evergreen/5 rounded" placeholder="95%" /></td>
                      <td className="p-2 text-center">
                        <button type="button" onClick={() => removeEducationRow(index)} className="text-red-400 hover:text-red-600 font-bold px-2">×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="pt-8 border-t border-evergreen/10 flex justify-end gap-4">
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="btn-outline border-none text-evergreen/50 hover:text-evergreen"
        >
          Discard Changes
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary shadow-xl shadow-berry/30 min-w-[200px]"
        >
          {loading ? "Saving Records..." : contactId ? "Update Contact Profile" : "Register New Contact"}
        </button>
      </div>
    </form>
  );
}

