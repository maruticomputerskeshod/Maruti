"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Stats {
  total_contacts: number;
  total_courses: number;
  total_batches: number;
  pending_reservations: number;
  unpaid_invoices: number;
  active_vacancies: number;
  total_revenue: number;
}

const cards = [
  { key: "total_contacts", label: "Enrolled Contacts", icon: "👥", color: "bg-evergreen" },
  { key: "total_courses", label: "Active Courses", icon: "📚", color: "bg-moss" },
  { key: "total_batches", label: "Ongoing Batches", icon: "👥", color: "bg-berry" },
  { key: "pending_reservations", label: "Pending Requests", icon: "📝", color: "bg-evergreen" },
  { key: "unpaid_invoices", label: "Pending Invoices", icon: "💰", color: "bg-berry" },
  { key: "active_vacancies", label: "Job Vacancies", icon: "💼", color: "bg-moss" },
  { key: "total_revenue", label: "Total Revenue", icon: "₹", color: "bg-evergreen", isCurrency: true },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/api/dashboard/stats").then(setStats).catch(console.error);
  }, []);

  return (
    <div className="font-sans">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-1 bg-berry" />
        <h1 className="text-3xl font-serif font-bold text-evergreen uppercase tracking-wider">Dashboard Overview</h1>
      </div>

      {!stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="bg-birch-dark/50 rounded-3xl p-8 animate-pulse h-36 border border-evergreen/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((c) => (
            <div key={c.key} className="bg-white p-8 rounded-4xl border border-evergreen/5 hover:border-berry/20 transition-all group overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-24 h-24 ${c.color} opacity-[0.03] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500`} />
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{c.icon}</span>
                <div className={`w-8 h-8 rounded-full ${c.color} opacity-10`} />
              </div>
              <p className="text-3xl font-serif font-bold text-evergreen mb-2 tracking-tight">
                {c.isCurrency ? `₹${(stats[c.key as keyof Stats] as number).toLocaleString("en-IN")}` : stats[c.key as keyof Stats]}
              </p>
              <p className="text-xs font-bold text-evergreen/40 uppercase tracking-widest">{c.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
