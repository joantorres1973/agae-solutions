'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  Leaf,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  Play,
  Users,
  Lightbulb,
  Laptop,
  Handshake,
  HeartHandshake,
  Sprout
} from 'lucide-react';
import Link from 'next/link';
import { solutions, solutionHref } from '@/lib/solutions';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { ContactSection } from './ContactSection';

// Logos de empresas cliente (public/clientes/). Agrega aquí nuevas empresas.
const clients = [
  { name: 'Starking Group SAS', logo: '/clientes/starking.png', size: 'max-h-16 sm:max-h-[72px]' },
  { name: 'ViveMed Ecografías', logo: '/clientes/vivemed.png', size: 'max-h-24 sm:max-h-28' },
  { name: 'Horizonta — Gestión & Seguridad Residencial', logo: '/clientes/horizonta.png', size: 'max-h-11 sm:max-h-[52px]' },
];

const values = [
  { label: 'Soluciones personalizadas', icon: Users },
  { label: 'Equipo especializado', icon: Lightbulb },
  { label: 'Plataforma tecnológica', icon: Laptop },
  { label: 'Acompañamiento continuo', icon: TrendingUp },
  { label: 'Resultados reales y medibles', icon: Leaf },
];

const companyValues = [
  {
    number: '01', title: 'Compromiso', subtitle: 'Real', icon: Handshake,
    description: 'Nos involucramos de verdad con las necesidades, retos y objetivos de cada organización.',
    gradient: 'from-[#22a6b8] to-[#0b5f7a]', text: 'text-[#0e7c8f]', bar: 'bg-[#1592a5]', ring: 'border-[#1592a5]/40', dot: 'bg-[#1592a5]',
  },
  {
    number: '02', title: 'Innovación', icon: Lightbulb,
    description: 'Integramos nuevas ideas, tecnología e inteligencia artificial para generar soluciones prácticas y efectivas.',
    gradient: 'from-[#9ccf52] to-[#4c9a2a]', text: 'text-[#4c9a2a]', bar: 'bg-[#4c9a2a]', ring: 'border-[#6cb33f]/40', dot: 'bg-[#6cb33f]',
  },
  {
    number: '03', title: 'Pasión', subtitle: 'Por lo que hacemos', icon: HeartHandshake,
    description: 'Nos mueve nuestro trabajo, el aprendizaje continuo y la satisfacción de convertir los retos de nuestros clientes en soluciones.',
    gradient: 'from-[#ff8a5c] to-[#e8502e]', text: 'text-[#e8582e]', bar: 'bg-[#ee6a3a]', ring: 'border-[#ee6a3a]/40', dot: 'bg-[#ee6a3a]',
  },
  {
    number: '04', title: 'Excelencia', icon: Award,
    description: 'Cuidamos cada detalle y buscamos que nuestro trabajo sea técnico, práctico, oportuno y que realmente genere resultados.',
    gradient: 'from-[#3b82f6] to-[#1d4ed8]', text: 'text-[#1d5fd6]', bar: 'bg-[#2563eb]', ring: 'border-[#2563eb]/40', dot: 'bg-[#2563eb]',
  },
  {
    number: '05', title: 'Visión', subtitle: 'Transformadora', icon: Sprout,
    description: 'Vemos la gestión como una oportunidad para construir empresas más fuertes, eficientes y sostenibles.',
    gradient: 'from-[#9b6fe0] to-[#5b30b0]', text: 'text-[#6a3fc4]', bar: 'bg-[#7c4ad6]', ring: 'border-[#7c4ad6]/40', dot: 'bg-[#7c4ad6]',
  },
];

const SectionDivider: React.FC<{ light: string; bold: string }> = ({ light, bold }) => (
  <div className="flex items-center gap-4 sm:gap-6">
    <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#16245c]/40" />
    <h2 className="font-display text-xl sm:text-3xl text-center whitespace-nowrap">
      <span className="font-light tracking-[0.3em] text-[#16245c]">{light}</span>{' '}
      <span className="font-bold tracking-wide bg-gradient-to-r from-[#0f3b6b] to-[#16788a] bg-clip-text text-transparent">{bold}</span>
    </h2>
    <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#16245c]/40" />
  </div>
);

export const LandingPage: React.FC = () => {
  const { setPortalView } = useApp();

  // Opens the characterization where the visitor left it (progress is saved automatically).
  const handleStartCharacterization = () => setPortalView('wizard');


  return (
    <div className="relative isolate min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f4fbf7_30%,#ecf8f1_60%,#f7fcf9_85%,#ffffff_100%)] text-slate-700 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Soft green background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-[30%] -right-40 w-[500px] h-[500px] rounded-full bg-teal-100/60 blur-3xl" />
        <div className="absolute bottom-40 left-1/4 w-[500px] h-[400px] rounded-full bg-lime-100/50 blur-3xl" />
      </div>

      <PublicHeader
        active="inicio"
        onNavigate={target => (target === 'wizard' ? handleStartCharacterization() : setPortalView(target))}
      />

      {/* Hero Section */}
      <section id="inicio" className="relative overflow-hidden bg-gradient-to-br from-white via-[#f5f9fc] to-[#eef7f1]">
        {/* Hero image (desktop): curved panel on the right */}
        <div className="hidden lg:block absolute top-0 right-0 w-[60%] xl:w-[56%] h-[700px]">
          <div className="absolute inset-0 -left-3 [clip-path:ellipse(92%_125%_at_100%_15%)] bg-gradient-to-b from-sky-200 via-teal-200 to-lime-300" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-plataforma.jpg"
            alt="Profesional utilizando la plataforma AGAE en su portátil"
            className="absolute inset-0 w-full h-full object-cover object-right [clip-path:ellipse(92%_125%_at_100%_15%)]"
          />
        </div>

        {/* Decorative soft glows */}
        <div className="pointer-events-none absolute -left-32 top-1/3 w-80 h-80 rounded-full bg-lime-200/40 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 -top-20 w-96 h-96 rounded-full bg-sky-100/60 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-10 lg:pt-14 pb-10">
          <div className="lg:w-[48%] space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="inline-block px-5 py-2.5 rounded-full bg-white/90 border border-slate-200 shadow-[0_6px_20px_-8px_rgba(15,40,90,0.25)] text-[10px] sm:text-xs font-medium tracking-[0.2em] text-[#16245c]">
              EMPRESAS MÁS SEGURAS, EFICIENTES Y SOSTENIBLES
            </span>

            <h1 className="font-display text-4xl sm:text-5xl xl:text-[3.4rem] font-semibold leading-[1.08] tracking-tight text-[#16245c]">
              Soluciones integrales para una gestión empresarial{' '}
              <span className="bg-gradient-to-r from-[#5fa52f] to-[#8bc34a] bg-clip-text text-transparent">sin límites</span>
            </h1>

            <div className="h-1 w-48 sm:w-72 rounded-full bg-gradient-to-r from-sky-500 via-lime-500 to-orange-400" />

            <p className="text-base sm:text-lg text-[#1f3a6e] leading-relaxed max-w-xl">
              En <strong className="font-bold text-[#16245c]">AGAE SOLUTIONS</strong> integramos Seguridad y Salud en el Trabajo, Gestión Ambiental, Seguridad Vial, Calidad e innovación tecnológica para impulsar el crecimiento responsable de tu empresa.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
              <a
                href="#soluciones"
                className="flex items-center justify-center gap-4 pl-8 pr-6 py-4 rounded-full bg-[#0f3b5f] hover:bg-[#0c3150] text-white font-semibold shadow-xl shadow-[#0f3b5f]/25 transition-all hover:-translate-y-0.5"
              >
                <span>Conoce nuestras soluciones</span>
                <ChevronRight className="w-5 h-5" />
              </a>
              <button
                onClick={() => setPortalView('demo')}
                className="flex items-center justify-center gap-4 pl-8 pr-6 py-4 rounded-full bg-white/80 hover:bg-white border-2 border-[#0f3b5f] text-[#0f3b5f] font-semibold transition-all hover:-translate-y-0.5"
              >
                <span>Explora la plataforma</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hero image (mobile/tablet) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-plataforma.jpg"
            alt="Profesional utilizando la plataforma AGAE en su portátil"
            className="lg:hidden mt-10 w-full rounded-[2rem] shadow-xl shadow-slate-900/10 object-cover"
          />

          {/* Solution Cards */}
          <div id="soluciones" className="relative mt-12 lg:mt-10 scroll-mt-24">
            <div className="lg:w-[48%]">
              <SectionDivider light="NUESTRAS" bold="SOLUCIONES" />
            </div>
            <div className="relative z-10 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {solutions.map(sol => (
                <Link
                  key={sol.slug}
                  href={solutionHref(sol.slug)}
                  className="group rounded-3xl bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(15,40,90,0.25)] hover:shadow-[0_20px_50px_-15px_rgba(15,40,90,0.35)] p-5 transition-all hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <span className={`shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${sol.gradient} text-white flex items-center justify-center ring-4 ring-white shadow-[0_8px_20px_-6px_rgba(15,40,90,0.4)] transition-transform group-hover:scale-105`}>
                      <sol.icon className="w-7 h-7" strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="font-display font-semibold text-[#16245c] leading-tight">{sol.title}</h3>
                      <span className={`block mt-2 h-1 w-10 rounded-full ${sol.bar}`} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-[#1f3a6e]/90 text-center leading-snug">{sol.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Value Band */}
        <div className="relative mt-8 lg:mt-10 bg-gradient-to-r from-[#0f3b6b] via-[#16788a] to-[#8bc34a]">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-7 grid grid-cols-2 md:grid-cols-5 gap-y-6">
            {values.map((val, i) => (
              <div
                key={val.label}
                className={`flex items-center justify-center gap-3 text-white px-3 ${i > 0 ? 'md:border-l md:border-white/25' : ''}`}
              >
                <val.icon className="w-9 h-9 shrink-0" strokeWidth={1.5} />
                <span className="text-sm lg:text-[15px] leading-snug font-light">{val.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pb-16">
          {/* Our Values */}
          <div id="valores" className="relative mt-14 lg:mt-16 scroll-mt-24">
            <SectionDivider light="NUESTROS" bold="VALORES" />

            <div className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-16">
              {companyValues.map(val => (
                <div
                  key={val.number}
                  className="group relative rounded-3xl bg-white/90 border border-slate-100 shadow-[0_10px_40px_-15px_rgba(15,40,90,0.25)] hover:shadow-[0_20px_50px_-15px_rgba(15,40,90,0.35)] px-6 pt-20 pb-7 transition-all hover:-translate-y-1"
                >
                  {/* Faint leaf watermark */}
                  <Leaf className={`absolute top-4 right-4 w-16 h-16 ${val.text} opacity-[0.07] -rotate-12`} strokeWidth={1.25} />

                  {/* Icon with orbit ring */}
                  <div className="absolute -top-12 left-6">
                    <div className={`relative w-28 h-28 rounded-full border-[1.5px] ${val.ring} flex items-center justify-center`}>
                      <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${val.dot}`} />
                      <span className={`absolute bottom-6 -left-1 w-2 h-2 rounded-full ${val.dot}`} />
                      <span className={`w-[5.5rem] h-[5.5rem] rounded-full bg-gradient-to-br ${val.gradient} text-white flex items-center justify-center shadow-[0_10px_24px_-8px_rgba(15,40,90,0.45)] transition-transform group-hover:scale-105`}>
                        <val.icon className="w-10 h-10" strokeWidth={1.5} />
                      </span>
                    </div>
                  </div>

                  <span className={`font-display text-2xl font-bold ${val.text}`}>{val.number}</span>
                  <h3 className="mt-1 font-display font-bold uppercase text-[#16245c] leading-tight">
                    {val.title}
                    {val.subtitle && <span className="block text-xs tracking-wide">{val.subtitle}</span>}
                  </h3>
                  <span className={`block mt-3 h-1 w-10 rounded-full ${val.bar}`} />
                  <p className="mt-4 text-sm text-[#1f3a6e]/90 leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The Revolutionary 2-Purpose Philosophy */}
      <section id="como-funciona" className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-8 border-y border-emerald-100 bg-white/60">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Metodología Exclusiva AGAE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Una Sola Caracterización Inteligente • Dos Propósitos
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
              Eliminamos el software rígido que obliga a todas las empresas a usar la misma configuración. Nuestro sistema aprende de tu organización desde el primer contacto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Propósito 1: Pre-Compra */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-emerald-50/70 border border-emerald-200 shadow-sm space-y-4 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                1
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                Herramienta Previa a la Compra
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Diagnóstico, Recomendación & Cotización Personalizada
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                El cuestionario condicional identifica qué módulos y requisitos son necesarios o recomendables según tu número de trabajadores, sedes, clase de riesgo ARL, flota vehicular y aspectos ambientales. No te cobra por módulos que no aplican a tu operación.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-emerald-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cálculo automático de estándares SST (7, 21 o 60 estándares).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Autoclasificación de PESV (Básico, Estándar o Avanzado).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Propuesta comercial modular con descuentos automáticos.</span>
                </li>
              </ul>
            </div>

            {/* Propósito 2: Post-Compra */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-teal-50/70 border border-teal-200 shadow-sm space-y-4 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                2
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">
                Base de Configuración Post-Compra
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Cero Re-Diligenciamiento: La Preventa Autoconfigura Tu Plataforma
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cuando adquieres la solución, no tienes que volver a ingresar información. La plataforma toma la caracterización preventa, los módulos contratados y tus validaciones, y adapta el software instantáneamente con tus sedes, riesgos y tareas iniciales.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-emerald-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Habilita únicamente los componentes correspondientes a tu empresa.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Bitácora de decisiones con registro de no aplicabilidad justificada.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Historial de versiones ante cambios futuros en la organización.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact form (sends to ventas@agaesolutions.com via /contacto.php) */}
      <ContactSection />

      {/* Section 3: The 4-Step Process Flowchart */}
      <section id="pasos" className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-8 border-y border-emerald-100 bg-white/60">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Flujo Transparente y Seguro
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              De la Caracterización a la Gestión en 4 Pasos Sencillos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white/90 border border-emerald-100 shadow-sm space-y-3 text-xs relative">
              <span className="text-emerald-600 font-mono font-bold text-lg">01</span>
              <h4 className="font-bold text-slate-900 text-sm">Caracterización Inteligente</h4>
              <p className="text-slate-500 leading-relaxed">
                Respondes un cuestionario dinámico donde solo se muestran las preguntas relacionadas con tu actividad. Si no tienes vehículos, no te preguntamos por PESV.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/90 border border-emerald-100 shadow-sm space-y-3 text-xs relative">
              <span className="text-emerald-600 font-mono font-bold text-lg">02</span>
              <h4 className="font-bold text-slate-900 text-sm">Recomendación & Cotización</h4>
              <p className="text-slate-500 leading-relaxed">
                El motor analiza la normativa aplicable y te muestra los módulos obligatorios, los recomendados y la cotización transparente en COP.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300 shadow-md shadow-emerald-500/10 space-y-3 text-xs relative">
              <span className="text-emerald-700 font-mono font-bold text-lg">03</span>
              <h4 className="font-bold text-slate-900 text-sm">Explora Tu Demo Personalizado</h4>
              <p className="text-slate-600 leading-relaxed">
                Prueba en vivo la plataforma con el nombre de tu empresa, tus trabajadores, tus estándares calculados y tus sedes antes de pagar.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/90 border border-emerald-100 shadow-sm space-y-3 text-xs relative">
              <span className="text-teal-600 font-mono font-bold text-lg">04</span>
              <h4 className="font-bold text-slate-900 text-sm">Compra y Credenciales al Correo</h4>
              <p className="text-slate-500 leading-relaxed">
                Confirmas tu compra y te enviamos automáticamente a tu correo institucional todas las credenciales de acceso para entrar inmediatamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section id="clientes" className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <SectionDivider light="CONFÍAN EN" bold="NOSOTROS" />
          <p className="mt-4 text-center text-sm sm:text-base text-[#33435c]">
            Organizaciones que ya gestionan sus sistemas con AGAE SOLUTIONS.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {clients.map(client => (
              <div
                key={client.name}
                className="group h-40 rounded-3xl bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(15,40,90,0.25)] hover:shadow-[0_20px_50px_-15px_rgba(15,40,90,0.35)] px-8 flex items-center justify-center transition-all hover:-translate-y-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  className={`${client.size} max-w-full w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Giant CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 text-center space-y-6 shadow-2xl shadow-emerald-600/25 relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30 inline-block">
            Diagnóstico 100% Sin Costo
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Descubre en 3 Minutos Qué Módulos Necesita Realmente Tu Organización
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 max-w-2xl mx-auto leading-relaxed">
            Sin compromisos. Completa la caracterización y obtén el análisis normativo legal, la propuesta comercial modular y un demo personalizado listo para explorar.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartCharacterization}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 font-black text-sm shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2.5 transition-all transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Comenzar Caracterización Inteligente Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setPortalView('demo')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-700/40 hover:bg-emerald-700/60 text-white font-bold text-sm border border-white/30 flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 text-white" />
              <span>Ver Demo Inmediato</span>
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
