"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/courses", label: "Courses", icon: "📚" },
  { href: "/admin/batches", label: "Batches", icon: "👥" },
  { href: "/admin/contacts", label: "Contacts", icon: "👥" },
  { href: "/admin/reservations", label: "Reservations", icon: "📝" },
  { href: "/admin/invoices", label: "Invoices", icon: "💰" },
  { href: "/admin/vacancies", label: "Vacancies", icon: "💼" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-birch">
      <div className="glass rounded-[3rem] p-12 w-full max-w-md shadow-2xl shadow-evergreen/10 border border-evergreen/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-berry/5 rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 rounded-full bg-evergreen flex items-center justify-center font-serif font-bold text-3xl mx-auto mb-6 text-white shadow-xl">M</div>
          <h1 className="text-3xl font-serif font-bold text-evergreen italic">Maruti <span className="text-berry">Admin</span></h1>
          <p className="text-evergreen/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Secure Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {error && <div className="bg-berry/10 border border-berry/20 text-berry text-xs font-bold rounded-xl px-4 py-3">{error}</div>}
          
          <div>
            <label className="admin-label">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full" placeholder="Admin username" />
          </div>
          
          <div>
            <label className="admin-label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full" placeholder="••••••••" />
          </div>
          
          <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-lg mt-4">
            {loading ? "Authenticating…" : "Sign In to Console"}
          </button>
        </form>

        <div className="text-center mt-10 relative z-10">
          <Link href="/" className="text-evergreen/40 hover:text-berry text-[10px] font-bold uppercase tracking-widest transition-all">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-birch">
        <div className="w-12 h-12 border-4 border-evergreen/10 border-t-berry rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginForm />;

  return (
    <div className="min-h-screen flex bg-birch-dark/30">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-evergreen/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 glass border-r border-evergreen/5 flex flex-col transition-transform duration-500 shadow-2xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-8 py-10">
          <Link href="/" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-evergreen flex items-center justify-center font-serif font-bold text-2xl text-white shadow-lg">M</div>
            <div>
               <span className="text-2xl font-serif font-bold text-evergreen block leading-none">Maruti</span>
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-berry line-clamp-1 mt-1">Admin Suite</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2 pb-8">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={() => setSidebarOpen(false)} 
                className={`
                  flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all
                  ${active 
                    ? "bg-evergreen text-white shadow-xl shadow-evergreen/10 translate-x-2" 
                    : "text-evergreen/60 hover:text-evergreen hover:bg-white/40"
                  }
                `}
              >
                <span className="text-2xl opacity-80">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="glass rounded-3xl p-6 border border-evergreen/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-berry flex items-center justify-center text-white font-bold text-sm shadow-inner">{user.full_name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-serif font-bold text-evergreen truncate italic leading-none">{user.full_name}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-evergreen/40 mt-1">{user.role}</p>
              </div>
            </div>
            <button onClick={logout} className="w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-berry hover:bg-berry/5 transition-all border border-berry/10">
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen flex flex-col">
        {/* Top bar for mobile */}
        <div className="lg:hidden sticky top-0 z-30 glass border-b border-evergreen/5 px-6 py-4 flex items-center justify-between">
           <Link href="/" className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-evergreen flex items-center justify-center font-serif font-bold text-lg text-white">M</div>
             <span className="font-serif font-bold text-evergreen italic">Admin CMS</span>
           </Link>
           <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl bg-evergreen/5 text-evergreen">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
           </button>
        </div>
        <div className="p-6 lg:p-12 overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
