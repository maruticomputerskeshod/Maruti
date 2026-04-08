"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";

interface Contact {
  id: number; 
  name: string; 
  phone: string; 
  email: string | null; 
  address: string | null; 
  course_id: number | null; 
  batch_id: number | null; 
  seat_number: number | null;
  enrollment_date: string; 
  course_name: string | null; 
  batch_name: string | null;
}

export default function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const load = () => {
    api.get("/api/contacts").then(setItems).catch(console.error);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: number) => { 
    if (!confirm("Delete this contact?")) return; 
    await api.delete(`/api/contacts/${id}`); 
    load(); 
  };

  const exportCSV = () => {
    const token = localStorage.getItem("token");
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    window.open(`${baseUrl}/api/contacts/export/csv?token=${token}`, "_blank");
  };

  const exportExcel = async () => {
    const filtered = items.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.phone.includes(search) ||
      (s.batch_name && s.batch_name.toLowerCase().includes(search.toLowerCase()))
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Contacts");

    worksheet.columns = [
      { header: "Full Name", key: "name", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Email", key: "email", width: 30 },
      { header: "Course", key: "course", width: 25 },
      { header: "Batch", key: "batch", width: 20 },
      { header: "Seat No", key: "seat", width: 10 },
      { header: "Enrollment Date", key: "date", width: 20 }
    ];

    filtered.forEach(s => {
      worksheet.addRow({
        name: s.name,
        phone: s.phone,
        email: s.email || "N/A",
        course: s.course_name || "N/A",
        batch: s.batch_name || "N/A",
        seat: s.seat_number || "N/A",
        date: new Date(s.enrollment_date).toLocaleDateString("en-IN")
      });
    });

    // Formatting
    worksheet.getRow(1).font = { bold: true };
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `Maruti_Contacts_Registry_${new Date().toISOString().split('T')[0]}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(24, 61, 49); // Evergreen
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("MARUTI COMPUTER", 14, 20);
    
    doc.setFontSize(10);
    doc.text("Contact Registry Report", 14, 30);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 160, 30);

    const filtered = items.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.phone.includes(search) ||
      (s.batch_name && s.batch_name.toLowerCase().includes(search.toLowerCase()))
    );

    const tableData = filtered.map((s, i) => [
      i + 1,
      s.name,
      s.phone,
      s.course_name || "—",
      s.batch_name || "—",
      s.seat_number ? `Slot ${s.seat_number}` : "—"
    ]);

    autoTable(doc, {
      startY: 45,
      head: [["#", "Name", "Phone", "Course", "Batch", "Seat"]],
      body: tableData,
      headStyles: { fillColor: [24, 61, 49], textColor: [255, 255, 255], fontStyle: 'bold' } as any,
      alternateRowStyles: { fillColor: [245, 247, 246] } as any,
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { left: 14, right: 14 }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount} - Maruti Computer Admin Panel`, 105, 285, { align: "center" });
    }

    doc.save(`Maruti_Contacts_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const filtered = items.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.phone.includes(search) ||
    (s.batch_name && s.batch_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evergreen tracking-tight italic">Registrar Room</h1>
          <p className="text-evergreen/40 text-[10px] font-bold uppercase tracking-widest mt-1">Global contact database & exports</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input 
            type="text" 
            placeholder="Search registry…" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full sm:w-64" 
          />
          <div className="flex gap-2">
            <button onClick={exportCSV} title="Export CSV" className="p-2 btn-secondary border-evergreen/10 hover:bg-evergreen hover:text-white transition">📄</button>
            <button onClick={exportExcel} title="Export Excel" className="p-2 btn-secondary border-evergreen/10 hover:bg-evergreen hover:text-white transition">📊</button>
            <button onClick={exportPDF} title="Export PDF" className="p-2 btn-secondary border-evergreen/10 hover:bg-evergreen hover:text-white transition">📕</button>
          </div>
          <Link href="/admin/contacts/add" className="btn-primary py-2 px-6 text-sm">
            + New Admission
          </Link>
        </div>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden border border-evergreen/5 shadow-2xl shadow-evergreen/5 bg-white/40">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-evergreen/5 text-evergreen/40 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Candidate</th>
                <th className="px-8 py-5">Contact</th>
                <th className="px-8 py-5">Assignment</th>
                <th className="px-8 py-5">Course</th>
                <th className="px-8 py-5">Joined</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-evergreen/5">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-evergreen/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="font-bold text-evergreen italic">{s.name}</div>
                    <div className="text-[10px] text-evergreen/40 font-bold uppercase tracking-widest">{s.email || "No Email Registered"}</div>
                  </td>
                  <td className="px-8 py-5 text-evergreen/60 font-medium">{s.phone}</td>
                  <td className="px-8 py-5">
                    {s.batch_name ? (
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-full bg-evergreen/10 text-evergreen text-[9px] font-bold uppercase tracking-widest">{s.batch_name}</span>
                        {s.seat_number && <span className="text-[10px] font-bold text-berry uppercase tracking-widest">Slot {s.seat_number}</span>}
                      </div>
                    ) : <span className="text-evergreen/20 italic text-[10px] font-bold uppercase tracking-widest">Awaiting Batch</span>}
                  </td>
                  <td className="px-8 py-5 text-evergreen/60">{s.course_name || "—"}</td>
                  <td className="px-8 py-5 text-evergreen/40 font-bold text-[10px] uppercase tracking-widest">{new Date(s.enrollment_date).toLocaleDateString("en-IN")}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition duration-300">
                      <Link href={`/admin/contacts/edit/${s.id}`} className="text-berry font-bold text-[10px] uppercase tracking-widest hover:underline">Edit</Link>
                      <button onClick={() => remove(s.id)} className="text-evergreen/30 hover:text-red-500 transition-colors font-bold text-[10px] uppercase tracking-widest">Discard</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-24 italic font-serif font-bold text-evergreen/10 text-2xl">
              No contacts found in registry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
