"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ContactForm from "@/components/admin/ContactForm";
import Link from "next/link";

export default function EditContactPage() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      api.get(`/api/contacts/${params.id}`)
        .then(setContact)
        .catch(err => {
          console.error(err);
          alert("Contact record not found");
          router.push("/admin/contacts");
        })
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-12 text-center font-serif text-evergreen/40 animate-pulse">
        <span className="text-4xl mb-4 block">📁</span>
        Retrieving contact records...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/contacts" className="p-2 rounded-lg bg-evergreen/5 text-evergreen hover:bg-evergreen/10 transition">
          <span className="text-xl">←</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-serif text-evergreen tracking-tight">Edit Profile: {contact?.name}</h1>
          <p className="text-evergreen/40 font-medium text-sm italic">Update academic records and personal details</p>
        </div>
      </div>

      <div className="glass rounded-3xl p-8 border border-evergreen/10 shadow-2xl shadow-evergreen/5">
        <ContactForm initialData={contact} contactId={contact?.id} />
      </div>
    </div>
  );
}
