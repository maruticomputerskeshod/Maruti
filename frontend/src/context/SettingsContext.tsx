"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Settings {
  institute_name: string;
  institute_tagline: string;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  address: string;
  office_hours: string;
  footer_copyright: string;
  map_embed_url: string;
}

const defaultSettings: Settings = {
  institute_name: "Maruti Computer",
  institute_tagline: "Academy of Computer Education",
  phone_primary: "+91 94262 44093",
  phone_secondary: "+91 94266 44093",
  email: "maruticomputerkeshod@gmail.com",
  address: "Opposite Sarasvati Market, Ambavadi main road, Keshod, Gujarat - 362220",
  office_hours: "Monday – Saturday: 8:00 AM – 7:00 PM",
  footer_copyright: "© 2026 Maruti Computer Education Academy.",
  map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.364491740941!2d70.13328567504246!3d21.316379580404313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395801912a768f5b%3A0x7d06587c65ef4dbb!2sMaruti%20Computer%20Education!5e0!3m2!1sen!2sin!4v1711964234567!5m2!1sen!2sin",
};

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await api.get("/api/settings");
      // Merge with default settings to ensure all keys exist
      setSettings((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
