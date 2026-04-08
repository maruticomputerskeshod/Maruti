"use client";
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Contact { id: number; name: string; phone: string; address: string | null; contact_type: string; }
interface Course { id: number; name: string; fees: number; }
interface Invoice {
  id: number;
  invoice_number: string;
  invoice_type: string;
  contact_name: string;
  amount: number;
  status: string;
  issue_date: string;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceManagement() {
  const [view, setView] = useState<"list" | "generator">("list");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  
  // Generator State
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [invoiceType, setInvoiceType] = useState<"course" | "jobwork">("course");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<LineItem[]>([{ id: "1", description: "", quantity: 1, rate: 0 }]);
  const [notes, setNotes] = useState("Thank you for choosing Maruti Computer for your professional training.");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  
  // List State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const invoiceRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const loadData = async () => {
    try {
      const [invRes, conRes, couRes] = await Promise.all([
        api.get("/api/invoices"),
        api.get("/api/contacts"),
        api.get("/api/courses")
      ]);
      setInvoices(invRes);
      setContacts(conRes);
      setCourses(couRes);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (view === "generator") {
        setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
    }
  }, [view]);

  const deleteInvoice = async (id: number) => {
    if (confirm("Are you sure you want to delete this invoice record?")) {
      await api.delete(`/api/invoices/${id}`);
      loadData();
    }
  };

  const addItem = () => setItems([...items, { id: Math.random().toString(), description: "", quantity: 1, rate: 0 }]);
  const removeItem = (id: string) => items.length > 1 && setItems(items.filter(i => i.id !== id));
  const updateItem = (id: string, field: keyof LineItem, value: any) => setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));

  const handleCourseSelect = (itemId: string, courseId: string) => {
    const course = courses.find(c => c.id === Number(courseId));
    if (course) {
      updateItem(itemId, "description", course.name);
      updateItem(itemId, "rate", Number(course.fees));
    }
  };

  const subtotal = items.reduce((acc, i) => acc + (i.quantity * i.rate), 0);

  const saveInvoice = async () => {
    setSaveStatus("saving");
    try {
      const payload = {
        invoice_type: invoiceType,
        contact_id: selectedContact?.id,
        invoice_number: invoiceNumber,
        amount: subtotal,
        items: JSON.stringify(items),
        notes: notes,
        issue_date: new Date(date).toISOString(),
      };
      await api.post("/api/invoices", payload);
      setSaveStatus("success");
      loadData();
      setTimeout(() => {
          setView("list");
          setSaveStatus("idle");
          // Reset generator
          setItems([{ id: "1", description: "", quantity: 1, rate: 0 }]);
          setSelectedContact(null);
      }, 1000);
    } catch (err) {
      setSaveStatus("error");
    }
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    setLoading(true);
    try {
      await saveInvoice();
      const dataUrl = await toPng(invoiceRef.current, { quality: 0.95, pixelRatio: 2 });
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoiceNumber}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    (inv.contact_name.toLowerCase().includes(search.toLowerCase()) || inv.invoice_number.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || inv.status === statusFilter)
  );

  const statusColors: Record<string, string> = {
    paid: "bg-green-500/10 text-green-600",
    unpaid: "bg-red-500/10 text-red-600",
    partial: "bg-yellow-500/10 text-yellow-600",
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold font-serif text-evergreen tracking-tight">
            {view === "list" ? "Financial Registry" : "Issue New Invoice"}
          </h1>
          <p className="text-evergreen/40 font-medium text-sm italic">
            {view === "list" ? "Archive of all training and services financial records" : "Generate professional billing for clients and trainees"}
          </p>
        </div>
        <div className="flex gap-3">
            {view === "list" ? (
                <button onClick={() => setView("generator")} className="btn-primary px-8 shadow-xl shadow-berry/20">
                    + Issue New Invoice
                </button>
            ) : (
                <>
                    <button onClick={() => setView("list")} className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-evergreen/40 hover:text-evergreen transition">
                        Cancel
                    </button>
                    <button 
                        onClick={downloadPDF} 
                        disabled={loading || saveStatus === "saving"}
                        className="btn-primary flex items-center gap-2 shadow-xl shadow-berry/30 px-8"
                    >
                        {loading || saveStatus === "saving" ? "Processing..." : "Save & Download PDF"}
                    </button>
                </>
            )}
        </div>
      </div>

      {view === "list" ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex gap-4 mb-6">
                <input 
                    type="text" 
                    placeholder="Search by contact name or #..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    className="flex-1 px-4 py-2 rounded-xl bg-white/50 border border-evergreen/10 text-sm focus:outline-none focus:border-berry transition"
                />
                <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-white/50 border border-evergreen/10 text-sm focus:outline-none focus:border-berry transition"
                >
                    <option value="">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="partial">Partial</option>
                </select>
            </div>

            <div className="glass rounded-3xl overflow-hidden border border-evergreen/10 shadow-xl shadow-evergreen/5 h-full bg-white/30 backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-evergreen/10 text-evergreen/60 bg-evergreen/5">
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">Invoice #</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">Contact Client</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">Issue Date</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-evergreen/5 text-[13px]">
                            {filteredInvoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-evergreen/5 transition group">
                                    <td className="px-6 py-4 font-bold text-evergreen">{inv.invoice_number}</td>
                                    <td className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-evergreen/40">
                                        {inv.invoice_type || 'course'}
                                    </td>
                                    <td className="px-6 py-4 text-evergreen font-medium">{inv.contact_name}</td>
                                    <td className="px-6 py-4 font-bold text-berry font-serif italic text-base">₹{Number(inv.amount).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColors[inv.status] || "bg-gray-100 text-gray-500"}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-evergreen/40 text-[11px] font-bold uppercase">
                                        {new Date(inv.issue_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/admin/invoices/${inv.id}`} className="text-berry font-bold text-[10px] uppercase tracking-widest hover:underline px-2 py-1">View Details</Link>
                                        <button onClick={() => deleteInvoice(inv.id)} className="text-red-400 font-bold text-[10px] uppercase tracking-widest hover:text-red-600 px-2 py-1">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center text-evergreen/20 font-bold uppercase tracking-widest italic">No financial records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
            {/* Editor Pane */}
            <div className="glass rounded-3xl p-8 border border-evergreen/10 space-y-8 h-full bg-white/40">
                <div className="flex gap-4">
                    <button 
                    onClick={() => { setInvoiceType("course"); setNotes("Thank you for choosing Maruti Computer for your professional training."); }}
                    className={`flex-1 py-3 rounded-xl border font-bold text-sm transition ${invoiceType === 'course' ? 'bg-evergreen text-white border-evergreen' : 'bg-white text-evergreen/60 border-evergreen/10 hover:border-berry'}`}
                    >
                    Course Admission
                    </button>
                    <button 
                    onClick={() => { setInvoiceType("jobwork"); setNotes("Thank you for your business. Payment is due within 7 days."); }}
                    className={`flex-1 py-3 rounded-xl border font-bold text-sm transition ${invoiceType === 'jobwork' ? 'bg-evergreen text-white border-evergreen' : 'bg-white text-evergreen/60 border-evergreen/10 hover:border-berry'}`}
                    >
                    Jobwork / Services
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                    <label className="block text-[10px] font-bold text-evergreen/40 uppercase tracking-widest mb-2">Invoice Number</label>
                    <input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-evergreen/10 outline-none focus:border-berry transition text-sm font-bold" />
                    </div>
                    <div>
                    <label className="block text-[10px] font-bold text-evergreen/40 uppercase tracking-widest mb-2">Issue Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-evergreen/10 outline-none focus:border-berry transition text-sm font-bold" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-evergreen/40 uppercase tracking-widest mb-2">Bill To (Select Contact)</label>
                    <select 
                    className="w-full px-4 py-3 rounded-xl border border-evergreen/10 outline-none focus:border-berry transition text-sm font-medium appearance-none bg-white"
                    value={selectedContact?.id || ""} 
                    onChange={e => setSelectedContact(contacts.find(c => c.id === Number(e.target.value)) || null)}
                    >
                    <option value="">Select a contact...</option>
                    {contacts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.contact_type.toUpperCase()}) - {c.phone}</option>)}
                    </select>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-bold text-evergreen/40 uppercase tracking-widest">Line items</label>
                    <button onClick={addItem} className="text-[10px] font-bold text-berry hover:underline uppercase tracking-widest">+ Add Item</button>
                    </div>
                    <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-6">
                            {invoiceType === "course" && (
                            <select 
                                onChange={e => handleCourseSelect(item.id, e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-evergreen/10 text-[11px] outline-none bg-white focus:border-berry mb-2 transition"
                            >
                                <option value="">Select a course template...</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            )}
                            <input 
                            placeholder={invoiceType === "course" ? "Course Description" : "Custom Service Description"} 
                            value={item.description} 
                            onChange={e => updateItem(item.id, "description", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-evergreen/10 text-xs outline-none focus:border-berry transition" 
                            />
                        </div>
                        <div className="col-span-2">
                            <input 
                            type="number" 
                            placeholder="Qty" 
                            value={item.quantity} 
                            onChange={e => updateItem(item.id, "quantity", Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg border border-evergreen/10 text-xs outline-none focus:border-berry transition" 
                            />
                        </div>
                        <div className="col-span-3">
                            <input 
                            type="number" 
                            placeholder="Rate" 
                            value={item.rate} 
                            onChange={e => updateItem(item.id, "rate", Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg border border-evergreen/10 text-xs outline-none focus:border-berry transition" 
                            />
                        </div>
                        <div className="col-span-1 pb-2">
                            <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-lg">×</button>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-evergreen/40 uppercase tracking-widest mb-2">Invoice Notes</label>
                    <textarea 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-evergreen/10 outline-none focus:border-berry transition text-sm min-h-[100px] bg-white" 
                    />
                </div>
            </div>

            {/* Live Preview Pane */}
            <div className="sticky top-8">
                <div className="flex items-center justify-between mb-4 px-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-evergreen/30 italic">Real-time Paper Preview</span>
                    <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                </div>
                
                <div className="bg-white shadow-2xl rounded-[1.5rem] border border-evergreen/5 overflow-hidden" style={{ minHeight: '600px' }}>
                    <div ref={invoiceRef} className="p-12 text-evergreen bg-white" style={{ minWidth: "700px" }}>
                    <div className="flex justify-between items-start mb-12">
                        <div>
                        <h2 className="text-4xl font-bold font-serif text-evergreen italic mb-1 uppercase tracking-tight">MARUTI</h2>
                        <p className="text-[10px] font-bold text-berry uppercase tracking-[0.4em]">{invoiceType === 'jobwork' ? 'Computer Services' : 'Academy of Computers'}</p>
                        </div>
                        <div className="text-right">
                        <h3 className="text-5xl font-serif text-evergreen/5 uppercase tracking-[0.2em] mb-3 font-bold">INVOICE</h3>
                        <p className="text-[10px] font-bold text-evergreen/40 uppercase tracking-widest">{invoiceNumber}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-16">
                        <div>
                        <p className="text-[10px] font-bold text-evergreen/40 uppercase tracking-[0.3em] mb-4">Billed From</p>
                        <div className="text-sm font-serif font-bold text-evergreen italic">Maruti Computer {invoiceType === 'course' ? 'Education' : 'Services'}</div>
                        <p className="text-xs text-evergreen/60 leading-relaxed mt-2 font-medium">
                            Opp. Sarasvati Market,<br />
                            Ambavadi Main Road, Keshod,<br />
                            Gujarat – 362220
                        </p>
                        </div>
                        <div className="text-right">
                        <p className="text-[10px] font-bold text-evergreen/40 uppercase tracking-[0.3em] mb-4">Billed To</p>
                        <div className="text-sm font-serif font-bold text-evergreen italic">{selectedContact?.name || "Select Contact..."}</div>
                        <p className="text-xs text-evergreen/60 leading-relaxed mt-2 font-medium">
                            {selectedContact?.address || "Address details on record"}<br />
                            Phone: {selectedContact?.phone || "—"}
                        </p>
                        </div>
                    </div>

                    <div className="mb-16">
                        <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-evergreen/10 text-[10px] font-bold uppercase tracking-[0.3em] text-evergreen/30">
                            <th className="py-3 text-left">Service / Item</th>
                            <th className="py-3 text-center w-24">Qty</th>
                            <th className="py-3 text-right w-32">Rate (₹)</th>
                            <th className="py-3 text-right w-32">Total (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-evergreen/5">
                            {items.map((item, idx) => (
                            <tr key={idx} className="group">
                                <td className="py-6 font-serif font-bold text-lg text-evergreen italic leading-tight">{item.description || "—"}</td>
                                <td className="py-6 text-center font-medium text-evergreen/60">{item.quantity}</td>
                                <td className="py-6 text-right font-medium text-evergreen/60">{item.rate.toLocaleString()}</td>
                                <td className="py-6 text-right font-serif font-bold text-xl text-evergreen italic">₹{(item.quantity * item.rate).toLocaleString()}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end mb-16 pt-6 border-t border-evergreen/5">
                        <div className="w-72 space-y-4">
                        <div className="flex justify-between text-evergreen/40 font-bold text-[10px] uppercase tracking-[0.3em]">
                            <span>Subtotal Amount</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t-2 border-evergreen pt-4 text-evergreen font-bold text-2xl items-center">
                            <span className="font-serif italic font-normal text-evergreen/30 text-base">Total Due</span>
                            <span className="text-berry font-serif italic">₹{subtotal.toLocaleString()}</span>
                        </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-evergreen/10 flex gap-8">
                        <div className="flex-1 italic text-xs text-evergreen/40 font-serif font-medium leading-relaxed">
                        <p className="mb-2 font-bold text-evergreen/30 uppercase tracking-[0.3em] not-italic text-[10px]">Notes & Terms</p>
                        <p>{notes}</p>
                        </div>
                        <div className="w-40 text-center pt-8 border-t border-evergreen/5">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-evergreen/30">Signature</p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
      )}
      {saveStatus === "success" && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10">
              <div className="bg-moss text-white px-8 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3">
                  <span className="text-xl">✨</span>
                  Invoice Record Synchronized
              </div>
          </div>
      )}
    </div>
  );
}
