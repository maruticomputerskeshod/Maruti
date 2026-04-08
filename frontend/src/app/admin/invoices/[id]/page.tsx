"use client";
import { useEffect, useState, useRef, use } from "react";
import { api } from "@/lib/api";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LineItem { description: string; quantity: number; rate: number; }
interface Invoice {
  id: number;
  invoice_number: string;
  contact_name: string;
  contact_snapshot: string | null;
  amount: number;
  items: string | null;
  notes: string | null;
  issue_date: string;
}

export default function InvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get(`/api/invoices/${id}`)
      .then(setInvoice)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(invoiceRef.current, { quality: 0.95, pixelRatio: 2 });
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoice?.invoice_number}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-serif text-evergreen/40 animate-pulse">Retrieving financial record...</div>;
  if (!invoice) return <div className="p-20 text-center">Invoice not found. <Link href="/admin/invoices/history" className="text-berry underline">Return to Registry</Link></div>;

  const items: LineItem[] = invoice.items ? JSON.parse(invoice.items) : [];
  const snapshot = invoice.contact_snapshot ? JSON.parse(invoice.contact_snapshot) : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-evergreen tracking-tight">Invoice {invoice.invoice_number}</h1>
          <p className="text-evergreen/40 font-medium text-sm italic">Status: {invoice.contact_snapshot ? "Archived Snaphot" : "Active Record"}</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/invoices/history" className="px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-evergreen/60 hover:bg-evergreen/5 transition-all">← Back to History</Link>
          <button onClick={downloadPDF} disabled={downloading} className="btn-primary px-8">
            {downloading ? "Preparing..." : "Download / Print PDF"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-[2rem] border border-evergreen/5 overflow-hidden">
          <div ref={invoiceRef} className="p-16 text-evergreen bg-white" style={{ minWidth: "700px" }}>
            <div className="flex justify-between items-start mb-16">
              <div>
                <h2 className="text-5xl font-bold font-serif text-evergreen italic mb-2">MARUTI</h2>
                <p className="text-[10px] font-bold text-berry uppercase tracking-[0.4em]">Academy of Computer Education</p>
              </div>
              <div className="text-right">
                <h3 className="text-6xl font-serif text-evergreen/5 uppercase tracking-[0.2em] mb-4 font-bold">INVOICE</h3>
                <p className="text-xs font-bold text-evergreen/40 uppercase tracking-widest leading-relaxed">
                  Ref: <span className="text-evergreen">#{invoice.invoice_number}</span><br />
                  Issued: <span className="text-evergreen">{new Date(invoice.issue_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-16 mb-20">
              <div>
                <p className="text-[10px] font-bold text-evergreen/40 uppercase tracking-[0.3em] mb-4">Billed From</p>
                <div className="text-lg font-serif font-bold text-evergreen italic">Maruti Computer Education</div>
                <p className="text-sm text-evergreen/60 leading-relaxed mt-3 font-medium">
                  Opp. Sarasvati Market,<br />
                  Ambavadi Main Road, Keshod,<br />
                  maruticomputerkeshod@gmail.com
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-evergreen/40 uppercase tracking-[0.3em] mb-4">Billed To</p>
                <div className="text-lg font-serif font-bold text-evergreen italic">{snapshot?.name || invoice.contact_name}</div>
                <p className="text-sm text-evergreen/60 leading-relaxed mt-3 font-medium">
                  {snapshot?.address || "Address detail on contact file"}<br />
                  Phone: {snapshot?.phone || "—"}
                </p>
              </div>
            </div>

            <div className="mb-20">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-evergreen/10 text-[10px] font-bold uppercase tracking-[0.3em] text-evergreen/30">
                    <th className="py-4 text-left">Training Service / Program</th>
                    <th className="py-4 text-center w-24">Qty</th>
                    <th className="py-4 text-right w-32">Rate (₹)</th>
                    <th className="py-4 text-right w-32">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-evergreen/5">
                  {items.map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-8 font-serif font-bold text-xl text-evergreen italic">{item.description}</td>
                      <td className="py-8 text-center font-medium text-evergreen/60">{item.quantity}</td>
                      <td className="py-8 text-right font-medium text-evergreen/60">{Number(item.rate).toLocaleString()}</td>
                      <td className="py-8 text-right font-serif font-bold text-2xl text-evergreen italic">₹{(item.quantity * item.rate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-20 pt-10 border-t border-evergreen/5">
              <div className="w-80 space-y-5">
                <div className="flex justify-between text-evergreen/40 font-bold text-[10px] uppercase tracking-[0.3em]">
                  <span>Subtotal Amount</span>
                  <span>₹{Number(invoice.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-6 border-t-2 border-evergreen pt-6 text-evergreen font-bold text-3xl">
                  <span className="font-serif italic font-normal text-evergreen/30 text-lg">Total Received</span>
                  <span className="font-serif italic text-berry">₹{Number(invoice.amount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-16 border-t border-evergreen/10 flex gap-12">
               <div className="flex-1">
                  <p className="mb-4 font-bold text-evergreen/30 uppercase tracking-[0.3em] text-[10px]">Notes & Terms</p>
                  <p className="italic text-sm text-evergreen/50 leading-relaxed font-serif font-medium">
                    {invoice.notes || "Fees once paid are non-refundable. This is a computer-generated voucher valid for vocational training services at Maruti Computer Education."}
                  </p>
               </div>
               <div className="w-48 text-center pt-8">
                  <div className="w-full border-b border-evergreen/20 mb-3" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-evergreen/30">Authorized Seal</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
