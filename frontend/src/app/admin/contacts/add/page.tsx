"use client";
import ContactForm from "@/components/admin/ContactForm";
import Link from "next/link";

export default function AddContactPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/contacts" className="p-2 rounded-lg bg-evergreen/5 text-evergreen hover:bg-evergreen/10 transition">
          <span className="text-xl">←</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-serif text-evergreen tracking-tight">Register New Candidate</h1>
          <p className="text-evergreen/40 font-medium text-sm italic">Add comprehensive contact details to the institute registry</p>
        </div>
      </div>

      <div className="glass rounded-3xl p-8 border border-evergreen/10 shadow-2xl shadow-evergreen/5">
        <ContactForm />
      </div>
    </div>
  );
}
