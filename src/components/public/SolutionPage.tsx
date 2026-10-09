import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronRight, FileText, Home, Sparkles } from 'lucide-react';
import { solutions, solutionHref, type Solution } from '@/lib/solutions';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { WhatsAppIcon, whatsappLink } from './whatsapp-shared';
import { SolutionShowcase } from './SolutionShowcase';

export const SolutionPage: React.FC<{ solution: Solution }> = ({ solution }) => {
  const others = solutions.filter(s => s.slug !== solution.slug);

  return (
    <div className="relative isolate min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f4fbf7_40%,#f7fcf9_80%,#ffffff_100%)] text-slate-700 flex flex-col font-sans">
      <PublicHeader active="soluciones" currentSlug={solution.slug} />

      {solution.showcase ? (
        <SolutionShowcase solution={solution} showcase={solution.showcase} />
      ) : (
        <>
          {/* Hero */}
          <section className="relative overflow-x-clip">
            <div className={`pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br ${solution.gradient} opacity-15 blur-3xl`} />
            <div className="pointer-events-none absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-sky-100/60 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-16 lg:pb-20">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-xs text-slate-500">
                <Link href="/" className="flex items-center gap-1 hover:text-emerald-600"><Home className="w-3.5 h-3.5" /> Inicio</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Soluciones</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#16245c] font-medium">{solution.title}</span>
              </nav>

              <div className="mt-10 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
                <div className="space-y-6 max-w-3xl">
                  <span className="inline-block px-5 py-2 rounded-full bg-white/90 border border-slate-200 shadow-[0_6px_20px_-8px_rgba(15,40,90,0.25)] text-[10px] sm:text-xs font-medium tracking-[0.2em] text-[#16245c]">
                    SOLUCIONES AGAE
                  </span>
                  <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.08] tracking-tight text-[#16245c]">
                    {solution.title}
                  </h1>
                  <div className={`h-1 w-40 rounded-full ${solution.bar}`} />
                  <p className={`font-display text-xl sm:text-2xl font-medium ${solution.text}`}>{solution.headline}</p>
                  <p className="text-base sm:text-lg text-[#1f3a6e] leading-relaxed">{solution.intro}</p>
                  <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                    <Link
                      href="/?vista=wizard"
                      className="flex items-center justify-center gap-4 pl-8 pr-6 py-4 rounded-full bg-[#0f3b5f] hover:bg-[#0c3150] text-white font-semibold shadow-xl shadow-[#0f3b5f]/25 transition-all hover:-translate-y-0.5"
                    >
                      <span>Solicita una cotización</span>
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                    <a
                      href={whatsappLink(`Hola AGAE SOLUTIONS, quiero información sobre ${solution.title}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 pl-7 pr-6 py-4 rounded-full bg-white/80 hover:bg-white border-2 border-[#128c7e] text-[#0b6b5e] font-semibold transition-all hover:-translate-y-0.5"
                    >
                      <WhatsAppIcon className="w-5 h-5 text-[#25d366]" />
                      <span>Habla con un asesor</span>
                    </a>
                  </div>
                </div>

                {/* Big icon */}
                <div className="hidden lg:flex relative w-72 h-72 items-center justify-center">
                  <div className={`absolute inset-0 rounded-full border-[1.5px] border-dashed ${solution.text} opacity-30 border-current`} />
                  <div className={`absolute inset-8 rounded-full ${solution.soft}`} />
                  <span className={`relative w-40 h-40 rounded-full bg-gradient-to-br ${solution.gradient} text-white flex items-center justify-center ring-8 ring-white shadow-[0_20px_50px_-15px_rgba(15,40,90,0.45)]`}>
                    <solution.icon className="w-20 h-20" strokeWidth={1.25} />
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="relative max-w-7xl mx-auto w-full px-4 lg:px-8 pb-16">
            <SectionTitle light="¿QUÉ" bold="HACEMOS?" />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {solution.services.map((service, i) => (
                <div
                  key={service.title}
                  className="flex gap-5 rounded-3xl bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(15,40,90,0.25)] p-6"
                >
                  <span className={`shrink-0 font-display text-3xl font-bold ${solution.text}`}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[#16245c]">{service.title}</h3>
                    <span className={`block mt-2 h-1 w-10 rounded-full ${solution.bar}`} />
                    <p className="mt-3 text-sm text-[#1f3a6e]/90 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Regulations & Benefits */}
      <section className={`relative max-w-7xl mx-auto w-full px-4 lg:px-8 pb-20 grid lg:grid-cols-2 gap-6 ${solution.showcase ? 'pt-6' : ''}`}>
        <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(15,40,90,0.25)] p-7">
          <h2 className="font-display text-xl font-semibold text-[#16245c]">Normativa aplicable</h2>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {solution.regulations.map(reg => (
              <span key={reg} className={`flex items-center gap-2 px-4 py-2 rounded-full ${solution.soft} ${solution.text} text-sm font-medium`}>
                <FileText className="w-4 h-4" /> {reg}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(15,40,90,0.25)] p-7">
          <h2 className="font-display text-xl font-semibold text-[#16245c]">Beneficios para tu empresa</h2>
          <ul className="mt-5 space-y-3">
            {solution.benefits.map(benefit => (
              <li key={benefit} className="flex items-start gap-3 text-[#1f3a6e]">
                <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${solution.text}`} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-gradient-to-r from-[#0f3b6b] via-[#16788a] to-[#8bc34a]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">¿Listo para empezar?</h2>
            <p className="mt-1 text-white/85">Descubre en 3 minutos qué necesita tu empresa con nuestra caracterización gratuita.</p>
          </div>
          <Link
            href="/?vista=wizard"
            className="shrink-0 flex items-center gap-2.5 px-7 py-4 rounded-full bg-white hover:bg-emerald-50 text-[#0f3b5f] font-semibold shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Iniciar caracterización gratuita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Other solutions */}
      <section className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-16">
        <SectionTitle light="OTRAS" bold="SOLUCIONES" />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {others.map(sol => (
            <Link
              key={sol.slug}
              href={solutionHref(sol.slug)}
              className="group flex items-center gap-4 rounded-3xl bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(15,40,90,0.25)] hover:shadow-[0_20px_50px_-15px_rgba(15,40,90,0.35)] p-5 transition-all hover:-translate-y-1"
            >
              <span className={`shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${sol.gradient} text-white flex items-center justify-center ring-4 ring-white shadow-[0_8px_20px_-6px_rgba(15,40,90,0.4)]`}>
                <sol.icon className="w-6 h-6" strokeWidth={1.75} />
              </span>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-[#16245c] leading-tight">{sol.title}</h3>
                <p className="mt-1 text-sm text-[#1f3a6e]/80">{sol.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

const SectionTitle: React.FC<{ light: string; bold: string }> = ({ light, bold }) => (
  <div className="flex items-center gap-4 sm:gap-6">
    <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#16245c]/40" />
    <h2 className="font-display text-xl sm:text-3xl text-center whitespace-nowrap">
      <span className="font-light tracking-[0.3em] text-[#16245c]">{light}</span>{' '}
      <span className="font-bold tracking-wide bg-gradient-to-r from-[#0f3b6b] to-[#16788a] bg-clip-text text-transparent">{bold}</span>
    </h2>
    <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#16245c]/40" />
  </div>
);
