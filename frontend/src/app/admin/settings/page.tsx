"use client";
import { useState, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import { api } from "@/lib/api";

export default function AdminSettingsPage() {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await api.patch("/api/settings", { settings: formData });
      await refreshSettings();
      setMessage("Settings updated successfully!");
    } catch (err) {
      console.error("Failed to update settings:", err);
      setMessage("Update failed. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-bold font-serif text-evergreen tracking-tight">Website Configuration</h1>
        <p className="text-evergreen/40 font-medium text-sm italic">Institutional details, contact info, and site-wide branding</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        {message && (
          <div className={`p-4 rounded-2xl font-bold text-sm ${message.includes("success") ? "bg-green-500/10 text-green-600" : "bg-berry/10 text-berry"}`}>
            {message}
          </div>
        )}

        <div className="glass rounded-[2.5rem] p-10 border border-evergreen/5 space-y-8 bg-white/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="admin-label">Institute Name</label>
              <input name="institute_name" value={formData.institute_name} onChange={handleChange} className="w-full" />
            </div>
            <div>
              <label className="admin-label">Logo / Tagline</label>
              <input name="institute_tagline" value={formData.institute_tagline} onChange={handleChange} className="w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="admin-label">Primary Phone</label>
              <input name="phone_primary" value={formData.phone_primary} onChange={handleChange} className="w-full" />
            </div>
            <div>
              <label className="admin-label">Secondary Phone</label>
              <input name="phone_secondary" value={formData.phone_secondary} onChange={handleChange} className="w-full" />
            </div>
          </div>

          <div>
            <label className="admin-label">Business Email</label>
            <input name="email" value={formData.email} onChange={handleChange} className="w-full" />
          </div>

          <div>
            <label className="admin-label">Physical Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} className="w-full" rows={3} />
          </div>

          <div>
              <label className="admin-label">Google Maps Embed URL</label>
              <p className="text-[10px] text-evergreen/30 italic mb-2">Paste the {'src'} value from Google Maps {'>'} Share {'>'} Embed map</p>
              <textarea name="map_embed_url" value={formData.map_embed_url} onChange={handleChange} className="w-full font-mono text-xs" rows={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="admin-label">Office Hours</label>
              <input name="office_hours" value={formData.office_hours} onChange={handleChange} className="w-full" />
            </div>
            <div>
              <label className="admin-label">Footer Copyright</label>
              <input name="footer_copyright" value={formData.footer_copyright} onChange={handleChange} className="w-full" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary px-12 py-5 text-lg shadow-2xl">
            {saving ? "Synchronizing..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}
