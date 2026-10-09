import React from 'react';
import Link from 'next/link';
import {
  ArrowRight, Bot, CalendarCheck, ChartColumn, ChevronRight, Eye, FileChartColumn, FileSearch, FileText,
  FolderOpen, GraduationCap, HardHat, Home, LayoutDashboard, Leaf, ListChecks, Play, Rocket, Settings,
  TrafficCone, Users, type LucideIcon,
} from 'lucide-react';
import { solutionHref } from '@/lib/solutions';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { ProfessionalDisclaimer } from './ProfessionalDisclaimer';

/* Contenido de la página de AGAE Integral 360+ (edítalo aquí). */

const modules: { title: string; description: string; icon: LucideIcon; gradient: string; href?: string }[] = [
  { title: 'SST', description: 'Seguridad y Salud en el Trabajo', icon: HardHat, gradient: 'from-[#22b8d1] to-[#0b6f8f]', href: solutionHref('seguridad-salud-trabajo') },
  { title: 'Ambiental', description: 'Gestión Ambiental', icon: Leaf, gradient: 'from-[#8fd14f] to-[#3f9a2a]', href: solutionHref('gestion-ambiental') },
  { title: 'Vial', description: 'Seguridad Vial PESV', icon: TrafficCone, gradient: 'from-[#ff9a5c] to-[#e2582a]', href: solutionHref('seguridad-vial') },
  { title: 'Auditorías', description: 'Diagnóstico, cumplimiento y mejora', icon: FileSearch, gradient: 'from-[#b07cf0] to-[#6a3fc4]' },
  { title: 'Sistemas de gestión ISO', description: 'Calidad | Ambiente | SST y sistemas integrados', icon: Settings, gradient: 'from-[#4f8df7] to-[#1d4fbf]', href: solutionHref('sistemas-iso') },
];

const features: { title: string; description: string; icon: LucideIcon }[] = [
  { title: 'Tu gestión en un solo lugar', description: 'Un panel de inicio con el estado de todos tus sistemas y módulos.', icon: LayoutDashboard },
  { title: 'Tareas pendientes', description: 'Actividades, responsables y fechas para que nada se quede atrás.', icon: ListChecks },
  { title: 'Indicadores', description: 'Seguimiento del cumplimiento y del desempeño de cada sistema.', icon: ChartColumn },
  { title: 'Documentos', description: 'Procedimientos, registros y evidencias organizados y disponibles.', icon: FolderOpen },
  { title: 'Capacitaciones', description: 'Programación y seguimiento de la formación de tu equipo.', icon: GraduationCap },
  { title: 'Reportes', description: 'Informes listos para la gerencia, auditorías y entes de control.', icon: FileChartColumn },
];

const launchBenefits: { label: React.ReactNode; icon: LucideIcon }[] = [
  { label: 'Acompañamiento profesional especializado', icon: Users },
  { label: 'Gestión integral y centralizada de tus sistemas', icon: FileText },
  { label: <>Acceso anticipado a <strong>AGAE INTEGRAL 360+</strong></>, icon: LayoutDashboard },
  { label: 'Demo exclusiva de la plataforma en construcción', icon: Eye },
  { label: <><strong>1 mes de prueba</strong> de la plataforma <strong>sin costo*</strong></>, icon: CalendarCheck },
];

const INFO_HREF = '/?vista=wizard';

const SectionTitle: React.FC<{ light: string; bold: string }> = ({ light, bold }) => (
  <div className="flex items-center gap-4 sm:gap-6">
    <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#16245c]/40" />
    <h2 className="font-display text-xl sm:text-3xl text-center">
      <span className="font-light tracking-[0.3em] text-[#16245c]">{light}</span>{' '}
      <span className="font-bold tracking-wide bg-gradient-to-r from-[#0f3b6b] to-[#16788a] bg-clip-text text-transparent">{bold}</span>
    </h2>
    <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#16245c]/40" />
  </div>
);

const InfoButton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Link
    href={INFO_HREF}
    className={`group inline-flex items-center justify-center gap-4 whitespace-nowrap pl-8 pr-2 py-2 rounded-full bg-gradient-to-r from-[#22d3ee] via-[#2dd4bf] to-[#a3e635] text-[#062033] font-display font-bold tracking-wide shadow-[0_10px_30px_-8px_rgba(34,211,238,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-8px_rgba(34,211,238,0.75)] ${className}`}
  >
    <span>QUIERO MÁS INFORMACIÓN</span>
    <span className="w-10 h-10 rounded-full bg-[#062033] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
      <ArrowRight className="w-5 h-5" />
    </span>
  </Link>
);

export const IntegralPage: React.FC = () => (
  <div className="relative isolate min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f3f8fc_45%,#f7fbfd_80%,#ffffff_100%)] text-slate-700 flex flex-col font-sans">
    <PublicHeader active="plataforma" />

    {/* Hero */}
    <section className="relative overflow-x-clip">
      <div className="pointer-events-none absolute -top-40 right-0 w-[700px] h-[600px] rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-40 w-96 h-96 rounded-full bg-lime-100/60 blur-3xl" />

      {/* Platform scene (desktop) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/integral-360/plataforma.webp"
        alt="Plataforma AGAE Integral 360+ con los módulos SST, Ambiental, Vial, Auditorías y Sistemas ISO, asistida por inteligencia artificial"
        className="hidden lg:block absolute top-6 right-0 w-[55%] max-w-[1000px] h-auto"
      />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-12">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="flex items-center gap-1 hover:text-emerald-600"><Home className="w-3.5 h-3.5" /> Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#16245c] font-medium">AGAE Integral 360+</span>
        </nav>

        <div className="mt-8 lg:w-[43%] space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
          {/* Brand lockup */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/integral-360/agae-mark.webp" alt="AGAE" className="h-24 sm:h-32 w-auto" />
            <p className="mt-1 font-display font-bold tracking-[0.14em] text-4xl sm:text-5xl leading-none">
              <span className="bg-gradient-to-r from-[#0e6f86] to-[#16245c] bg-clip-text text-transparent">INTEGRAL 360</span>
              <span className="text-[#7cc242]">+</span>
            </p>
            <span className="mt-4 block h-1 w-64 rounded-full bg-gradient-to-r from-sky-500 via-lime-500 to-orange-400" />
          </div>

          <h1 className="font-display text-3xl sm:text-[2.6rem] lg:text-[2.3rem] xl:text-[2.5rem] font-medium leading-[1.12] text-[#16245c]">
            La nueva forma de gestionar <span className="font-bold text-[#0e7c8f]">tus sistemas.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#33435c] leading-relaxed">
            Estamos construyendo una plataforma integral que conecta SST, Ambiental, Vial, Auditorías y Sistemas ISO{' '}
            <strong className="text-[#16245c]">en un solo lugar</strong>, con tecnología e inteligencia artificial como aliado de la gestión.
          </p>
          <div className="flex flex-wrap gap-3.5 pt-1">
            <InfoButton />
            <Link
              href="/?vista=demo"
              className="inline-flex items-center justify-center gap-3 whitespace-nowrap px-7 py-3.5 rounded-full bg-white/80 hover:bg-white border-2 border-[#0f3b5f] text-[#0f3b5f] font-semibold transition-all hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4" />
              <span>Ver demo de la plataforma</span>
            </Link>
          </div>
        </div>

        {/* Platform scene (mobile/tablet) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/integral-360/plataforma.webp" alt="" className="lg:hidden mt-8 w-full h-auto" />
      </div>
    </section>

    {/* Launch program */}
    <section className="relative max-w-7xl mx-auto w-full px-4 lg:px-8 pb-16">
      <div className="grid lg:grid-cols-[1.65fr_1fr] gap-6">
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#06223a] via-[#0a2e4d] to-[#062033] text-white p-7 sm:p-9 shadow-[0_24px_60px_-24px_rgba(6,32,51,0.7)]">
            <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-10 w-72 h-72 rounded-full bg-lime-400/10 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row gap-6 sm:items-center">
              <span className="shrink-0 w-20 h-20 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                <Rocket className="w-11 h-11 text-cyan-200" strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-wide">
                  PROGRAMA DE <span className="bg-gradient-to-r from-[#22d3ee] to-[#a3e635] bg-clip-text text-transparent">LANZAMIENTO</span>
                </h2>
                <p className="mt-3 text-base sm:text-lg text-slate-200 leading-relaxed">
                  Sé una de las <strong className="text-cyan-300">primeras organizaciones</strong> en contratar la{' '}
                  <strong className="text-cyan-300">tercerización de sus sistemas de gestión</strong> con AGAE y obtén{' '}
                  <strong className="text-lime-300">acceso anticipado</strong> a nuestra plataforma.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_10px_40px_-20px_rgba(15,40,90,0.3)] px-4 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-6">
              {launchBenefits.map((b, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center text-center gap-3 px-3 text-sm text-[#16245c] leading-snug ${i > 0 ? 'lg:border-l lg:border-slate-200' : ''}`}
                >
                  <span className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e6f6fb] to-[#d5edf7] text-[#0e6f86] flex items-center justify-center shadow-inner">
                    <b.icon className="w-8 h-8" strokeWidth={1.5} />
                  </span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-xs text-slate-400">*Beneficio sujeto a las condiciones del programa de lanzamiento.</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#062033] via-[#0b2f4f] to-[#06223a] text-white p-8 flex-1 flex flex-col justify-center shadow-[0_24px_60px_-24px_rgba(6,32,51,0.7)]">
            <div className="pointer-events-none absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <h2 className="relative font-display text-2xl sm:text-[1.7rem] font-bold leading-tight">
              ¿QUIERES SER PARTE DE LAS{' '}
              <span className="bg-gradient-to-r from-[#22d3ee] to-[#a3e635] bg-clip-text text-transparent">PRIMERAS ORGANIZACIONES?</span>
            </h2>
            <InfoButton className="relative mt-7 self-start" />
          </div>
          <blockquote className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_10px_40px_-20px_rgba(15,40,90,0.3)] p-8 text-center">
            <p className="font-display text-xl text-[#16245c] leading-snug">
              Tú gestionas tu empresa.
              <br />
              <span className="font-semibold">Nosotros hacemos más inteligente la gestión.</span>
            </p>
            <span className="mt-5 mx-auto block h-1 w-40 rounded-full bg-gradient-to-r from-sky-500 via-purple-500 to-orange-400" />
          </blockquote>
        </div>
      </div>
    </section>

    {/* Modules */}
    <section className="max-w-7xl mx-auto w-full px-4 lg:px-8 pb-16">
      <SectionTitle light="TODO EN UN" bold="SOLO LUGAR" />
      <p className="mt-4 text-center text-[#33435c] max-w-2xl mx-auto">
        Integral 360+ conecta los sistemas de gestión de tu organización en una sola plataforma. Un dato, múltiples usos.
      </p>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {modules.map(mod => {
          const card = (
            <>
              <span className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mod.gradient} text-white flex items-center justify-center shadow-[0_10px_24px_-8px_rgba(15,40,90,0.45)] transition-transform group-hover:scale-105`}>
                <mod.icon className="w-8 h-8" strokeWidth={1.6} />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold uppercase text-[#16245c] leading-tight">{mod.title}</h3>
              <p className="mt-1.5 text-sm text-[#33435c] leading-snug">{mod.description}</p>
              {mod.href && (
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0e7c8f]">
                  Ver solución <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </>
          );
          const cls = 'group rounded-3xl bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(15,40,90,0.25)] p-6 transition-all';
          return mod.href ? (
            <Link key={mod.title} href={mod.href} className={`${cls} hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(15,40,90,0.35)]`}>{card}</Link>
          ) : (
            <div key={mod.title} className={cls}>{card}</div>
          );
        })}
      </div>
    </section>

    {/* Scope of the platform */}
    <section className="max-w-7xl mx-auto w-full px-4 lg:px-8 pb-16">
      <ProfessionalDisclaimer />
    </section>

    {/* Features */}
    <section className="max-w-7xl mx-auto w-full px-4 lg:px-8 pb-20">
      <SectionTitle light="¿QUÉ PODRÁS" bold="HACER?" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(f => (
          <div key={f.title} className="flex gap-4 rounded-3xl bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(15,40,90,0.25)] p-6">
            <span className="shrink-0 w-12 h-12 rounded-xl bg-[#e6f6fb] text-[#0e6f86] flex items-center justify-center">
              <f.icon className="w-6 h-6" strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="font-display font-semibold text-[#16245c]">{f.title}</h3>
              <p className="mt-1 text-sm text-[#33435c] leading-relaxed">{f.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI assistant */}
      <div className="mt-6 relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#06223a] via-[#0b3a5c] to-[#0e6f86] text-white p-7 sm:p-9 flex flex-col md:flex-row items-center gap-6">
        <div className="pointer-events-none absolute -top-20 right-20 w-72 h-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <span className="relative shrink-0 w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
          <Bot className="w-11 h-11 text-cyan-200" strokeWidth={1.5} />
        </span>
        <div className="relative flex-1 text-center md:text-left">
          <h3 className="font-display text-2xl font-bold">
            Asistido por <span className="bg-gradient-to-r from-[#22d3ee] to-[#a3e635] bg-clip-text text-transparent">Inteligencia Artificial</span>
          </h3>
          <p className="mt-2 text-slate-200 leading-relaxed max-w-3xl">
            La inteligencia artificial será tu aliada para organizar la información, anticipar pendientes y apoyar la toma de decisiones en la gestión de tus sistemas.
          </p>
        </div>
        <InfoButton className="relative shrink-0" />
      </div>
    </section>

    <PublicFooter />
  </div>
);
