import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";


export const metadata: Metadata = {
  title: "Maruti Academy – Premiere Vocational Institute",
  description: "Maruti Academy of Computer Education – Empowering Keshod since 2005. Learn CCC, Tally, Graphic Design, and more. Reserve your seat today!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <SettingsProvider>
          <AuthProvider>{children}</AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
