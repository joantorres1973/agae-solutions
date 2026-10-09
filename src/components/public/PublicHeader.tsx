'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Menu, MonitorSmartphone, UserRound, X } from 'lucide-react';
import { solutions, solutionHref } from '@/lib/solutions';

export type PortalTarget = 'wizard' | 'demo' | 'app';

interface PublicHeaderProps {
  active: 'inicio' | 'soluciones' | 'plataforma';
  /** Inside the home portal, switch views in place. Elsewhere, fall back to `/?vista=`. */
  onNavigate?: (target: PortalTarget) => void;
  /** Slug of the solution page currently open, to highlight it in the menu. */
  currentSlug?: string;
}

const INTEGRAL_HREF = '/integral-360/';

const activeUnderline = (
  <span className="absolute left-0 right-0 -bottom-1 h-[3px] rounded-full bg-gradient-to-r from-sky-500 to-lime-500" />
);

export const PublicHeader: React.FC<PublicHeaderProps> = ({ active, onNavigate, currentSlug }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const go = (target: PortalTarget) => {
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(target);
    else router.push(`/?vista=${target}`);
  };
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-[0_4px_24px_-12px_rgba(15,40,90,0.15)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo & Tagline */}
        <Link href="/" className="flex items-center gap-4 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-agae-light.png" alt="AGAE SOLUTIONS" className="h-12 lg:h-14 w-auto" />
          <span className="hidden sm:block h-11 w-px bg-[#16245c]/30" />
          <span className="hidden sm:flex flex-col text-left text-[9px] lg:text-[10px] font-medium tracking-[0.25em] leading-[1.6] text-[#16245c]/80">
            <span>GESTIÓN</span>
            <span>INNOVACIÓN</span>
            <span>RESULTADOS</span>
          </span>
        </Link>

        {/* Main Nav */}
        <nav className="hidden xl:flex items-center gap-7 text-[15px] font-medium text-[#16245c]">
          <Link href="/" className={`relative pb-1 ${active === 'inicio' ? 'font-semibold' : 'hover:text-emerald-600 transition-colors'}`}>
            Inicio
            {active === 'inicio' && activeUnderline}
          </Link>
          <Link href="/#valores" className="hover:text-emerald-600 transition-colors">Nosotros</Link>
          <div className="relative group">
            <button className={`relative flex items-center gap-1 py-2 transition-colors ${active === 'soluciones' ? 'font-semibold' : 'hover:text-emerald-600'}`}>
              Soluciones <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              {active === 'soluciones' && activeUnderline}
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="w-72 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-900/10 p-2">
                {solutions.map(sol => (
                  <Link
                    key={sol.slug}
                    href={solutionHref(sol.slug)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-slate-50 ${sol.slug === currentSlug ? 'bg-slate-50 font-semibold' : ''}`}
                  >
                    <span className={`shrink-0 w-7 h-7 rounded-full bg-gradient-to-br ${sol.gradient} text-white flex items-center justify-center`}>
                      <sol.icon className="w-3.5 h-3.5" />
                    </span>
                    <span>{sol.title}</span>
                  </Link>
                ))}
                <div className="my-1.5 mx-3 h-px bg-slate-100" />
                <Link
                  href={INTEGRAL_HREF}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm bg-gradient-to-r from-cyan-50 to-lime-50 hover:from-cyan-100 hover:to-lime-100 ${active === 'plataforma' ? 'font-semibold' : ''}`}
                >
                  <span className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#22d3ee] to-[#0e6f86] text-white flex items-center justify-center">
                    <MonitorSmartphone className="w-3.5 h-3.5" />
                  </span>
                  <span className="flex-1 font-semibold">AGAE Integral 360+</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0e6f86]">Plataforma</span>
                </Link>
              </div>
            </div>
          </div>
          <Link href={INTEGRAL_HREF} className={`relative pb-1 ${active === 'plataforma' ? 'font-semibold' : 'hover:text-emerald-600 transition-colors'}`}>
            Plataforma
            {active === 'plataforma' && activeUnderline}
          </Link>
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors py-2">
              Recursos <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="w-64 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-900/10 p-2 text-sm">
                <button onClick={() => go('wizard')} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">Caracterización gratuita</button>
                <Link href="/#pasos" className="block px-3 py-2 rounded-xl hover:bg-slate-50">Cómo funciona en 4 pasos</Link>
                <button onClick={() => go('demo')} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">Demo interactivo</button>
              </div>
            </div>
          </div>
          <Link href="/#contacto" className="hover:text-emerald-600 transition-colors">Contacto</Link>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => go('app')}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0f3b5f] hover:bg-[#0c3150] text-white text-sm font-medium shadow-md shadow-[#0f3b5f]/25 transition-all"
          >
            <UserRound className="w-4 h-4" />
            <span>Portal Clientes</span>
          </button>
          <button
            onClick={() => go('wizard')}
            className="hidden sm:flex items-center gap-3 pl-6 pr-4 py-2.5 rounded-full bg-gradient-to-r from-[#7cb342] to-[#4caf50] hover:from-[#72a83a] hover:to-[#43a047] text-white text-sm font-semibold shadow-lg shadow-lime-600/25 transition-all hover:-translate-y-0.5"
          >
            <span>Solicita una cotización</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            className="xl:hidden p-2 rounded-xl text-[#16245c] hover:bg-slate-100"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="xl:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col text-[15px] font-medium text-[#16245c]">
          <Link href="/" onClick={closeMenu} className="py-2.5">Inicio</Link>
          <Link href="/#valores" onClick={closeMenu} className="py-2.5">Nosotros</Link>
          <span className="pt-2.5 pb-1 text-xs uppercase tracking-wider text-slate-400">Soluciones</span>
          {solutions.map(sol => (
            <Link key={sol.slug} href={solutionHref(sol.slug)} onClick={closeMenu} className="py-2 pl-3 flex items-center gap-2.5">
              <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${sol.gradient} text-white flex items-center justify-center`}>
                <sol.icon className="w-3 h-3" />
              </span>
              {sol.title}
            </Link>
          ))}
          <Link href={INTEGRAL_HREF} onClick={closeMenu} className="py-2 pl-3 flex items-center gap-2.5 font-semibold">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#22d3ee] to-[#0e6f86] text-white flex items-center justify-center">
              <MonitorSmartphone className="w-3 h-3" />
            </span>
            AGAE Integral 360+
          </Link>
          <Link href={INTEGRAL_HREF} onClick={closeMenu} className="py-2.5">Plataforma</Link>
          <Link href="/#pasos" onClick={closeMenu} className="py-2.5">Recursos</Link>
          <Link href="/#contacto" onClick={closeMenu} className="py-2.5">Contacto</Link>
          <div className="flex flex-col sm:flex-row gap-2 pt-3">
            <button onClick={() => go('app')} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0f3b5f] text-white text-sm">
              <UserRound className="w-4 h-4" /> Portal Clientes
            </button>
            <button onClick={() => go('wizard')} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#7cb342] to-[#4caf50] text-white text-sm font-semibold">
              Solicita una cotización <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
