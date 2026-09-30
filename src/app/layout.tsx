import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0b1120] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
