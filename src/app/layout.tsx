import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGAE SOLUTIONS — Plataforma SaaS HSEQ & ISO Integrada",
  description: "Sistema Digital Integrado de Gestión, Seguimiento, Automatización y Mejora Continua. SG-SST (Dec 1072, Res 0312), Gestión Ambiental, Huella de Carbono, PESV (Res 40595) e ISO 9001/14001/45001.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f4f8f6] text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
