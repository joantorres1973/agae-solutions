import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Home } from 'lucide-react';
import type { Solution, SolutionShowcase as Showcase } from '@/lib/solutions';

const Eyebrow: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <div className="flex items-center gap-4">
    <span className="text-xs sm:text-sm font-medium tracking-[0.35em] text-[#16245c]">{children}</span>
    <span className="h-[3px] w-20 rounded-full" style={{ backgroundColor: color }} />
  </div>
);

export const SolutionShowcase: React.FC<{ solution: Solution; showcase: Showcase }> = ({ solution, showcase }) => {
  const { color, colorDark, closing } = showcase;
  const highlightsFirst = closing.layout === 'highlights-first';

  return (
    <section className="relative overflow-x-clip bg-gradient-to-b from-white via-white to-[#f3f8f9]">
      {/* Hero photo (desktop): diagonal panel on the right */}
      <div className="hidden lg:block absolute top-0 right-0 w-[50%]">
        <div
          className="absolute inset-0 [clip-path:polygon(17%_0,22%_0,2%_100%,0_100%)]"
          style={{ background: `linear-gradient(180deg, ${color}, ${colorDark})` }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={showcase.heroImage} alt={solution.title} className="relative block w-full h-auto" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="flex items-center gap-1 hover:text-emerald-600"><Home className="w-3.5 h-3.5" /> Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Soluciones</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#16245c] font-medium">{solution.title}</span>
        </nav>

        {/* Intro */}
        <div className="mt-8 lg:w-[56%] space-y-5 animate-in fade-in slide-in-from-left-4 duration-700">
          <Eyebrow color={color}>NUESTROS SERVICIOS</Eyebrow>
          <span className="block h-1 w-20 rounded-full" style={{ backgroundColor: colorDark }} />
          <h1 className="font-display font-extrabold uppercase leading-[0.95] tracking-tight text-4xl sm:text-6xl lg:text-[3.3rem] xl:text-[3.75rem] lg:[&>span]:whitespace-nowrap">
            <span className="block bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${color}, ${colorDark})` }}>
              {showcase.titleLines[0]}
            </span>
            <span className="block text-[#0f2453]">{showcase.titleLines[1]}</span>
          </h1>
          {showcase.subtitle && (
            <p className="-mt-2 font-display text-lg sm:text-xl font-semibold text-[#0f2453]">{showcase.subtitle}</p>
          )}
          <p className="font-display text-xl sm:text-2xl font-semibold text-[#0f2453]">
            {showcase.tagline[0]}
            <span style={{ color }}>{showcase.tagline[1]}</span>
          </p>
          <p className="text-base sm:text-lg text-[#33435c] leading-relaxed max-w-xl">{showcase.intro}</p>

          {showcase.standards && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-display text-xl sm:text-2xl font-bold text-[#0f2453]">
              {showcase.standards.map((std, i) => (
                <React.Fragment key={std}>
                  {i > 0 && <span className="h-7 w-px bg-[#0f2453]/30" />}
                  <span>{std}</span>
                </React.Fragment>
              ))}
            </div>
          )}

          {showcase.notice && (
            <div
              className="flex items-center gap-4 rounded-2xl px-5 py-4 max-w-xl border"
              style={{ backgroundColor: `${color}0f`, borderColor: `${color}26` }}
            >
              <showcase.notice.icon className="shrink-0 w-10 h-10" strokeWidth={1.5} style={{ color }} />
              <p className="text-sm text-[#33435c] leading-snug">
                <span className="block font-display font-bold text-base" style={{ color }}>{showcase.notice.title}</span>
                {showcase.notice.text}
              </p>
            </div>
          )}
        </div>

        {/* Hero photo (mobile/tablet) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={showcase.heroImage} alt={solution.title} className="lg:hidden mt-8 w-full max-w-xl mx-auto" />

        {/* Offerings */}
        <div className="mt-12 lg:mt-14">
          <Eyebrow color={color}>NUESTRAS SOLUCIONES</Eyebrow>
        </div>
        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {showcase.offerings.map((item, i) => (
            <Link
              key={item.title}
              href="/#contacto"
              className="group relative overflow-hidden rounded-[1.75rem] border border-white shadow-[0_12px_40px_-18px_rgba(15,40,90,0.35)] hover:shadow-[0_22px_50px_-18px_rgba(15,40,90,0.45)] min-h-[300px] sm:min-h-[410px] p-7 transition-all hover:-translate-y-1"
              style={{ backgroundColor: item.tint }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt=""
                className="pointer-events-none absolute bottom-0 right-0 w-[62%] max-w-[200px] transition-transform duration-500 group-hover:scale-105 origin-bottom-right"
              />

              <div className="relative flex items-center justify-between">
                <span className="font-display text-5xl font-bold opacity-40" style={{ color: item.color }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="w-20 h-20 rounded-full text-white flex items-center justify-center shadow-[0_10px_24px_-8px_rgba(15,40,90,0.45)]"
                  style={{ backgroundColor: item.color }}
                >
                  <item.icon className="w-9 h-9" strokeWidth={1.5} />
                </span>
              </div>

              <h3 className="relative mt-5 font-display text-xl font-bold uppercase leading-tight text-[#0f2453] max-w-[14rem]">
                {item.title}
              </h3>
              <span className="relative block mt-3 h-1 w-14 rounded-full" style={{ backgroundColor: item.color }} />
              <p className="relative mt-4 text-[15px] text-[#33435c] leading-snug max-w-[12.5rem]">{item.description}</p>

              <span
                className="absolute bottom-7 left-7 w-11 h-11 rounded-full text-white flex items-center justify-center shadow-md transition-transform group-hover:translate-x-1"
                style={{ backgroundColor: item.color }}
              >
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          ))}
        </div>

        {/* Closing statement */}
        <div className="mt-8 rounded-[1.75rem] bg-white/80 border border-slate-100 shadow-[0_10px_40px_-20px_rgba(15,40,90,0.3)] px-6 py-6 lg:px-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          <span
            className="shrink-0 w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}1a`, color: colorDark }}
          >
            <closing.icon className="w-10 h-10" strokeWidth={1.5} />
          </span>
          <span className="hidden lg:block self-stretch w-[3px] rounded-full" style={{ backgroundColor: color }} />

          {highlightsFirst ? (
            <>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-y-5 w-full">
                {closing.highlights.map((h, i) => (
                  <div key={h.label} className={`flex items-center gap-3 sm:px-5 ${i > 0 ? 'sm:border-l sm:border-slate-200' : ''}`}>
                    <h.icon className="shrink-0 w-11 h-11" strokeWidth={1.5} style={{ color: h.color ?? '#0f2453' }} />
                    <span className="leading-tight">
                      <span className="block font-display text-xl font-bold text-[#0f2453]">{h.label}</span>
                      {h.sublabel && <span className="block text-sm text-[#33435c]">{h.sublabel}</span>}
                    </span>
                  </div>
                ))}
              </div>
              <span className="hidden lg:block self-stretch w-[3px] rounded-full" style={{ backgroundColor: color }} />
              <p className="font-display text-2xl leading-tight text-[#0f2453] lg:max-w-[17rem] text-center lg:text-left">
                {closing.lead}
                <strong className="font-bold" style={{ color }}>{closing.emphasis}</strong>
                {closing.trail}
              </p>
            </>
          ) : (
            <>
              <p className="flex-1 font-display text-xl lg:text-[1.4rem] leading-snug text-center lg:text-left">
                <span className="block text-[#0f2453]">{closing.lead}</span>
                <span className="block font-bold" style={{ color }}>
                  {closing.emphasis}
                  {closing.trail}
                </span>
              </p>
              <div className="grid grid-cols-3 w-full lg:w-auto">
                {closing.highlights.map((h, i) => (
                  <div
                    key={h.label}
                    className={`flex flex-col items-center text-center gap-2 px-3 lg:px-6 text-sm text-[#33435c] ${i > 0 ? 'border-l border-slate-200' : ''}`}
                  >
                    <h.icon className="w-9 h-9" strokeWidth={1.5} style={{ color: h.color ?? '#0f2453' }} />
                    <span className="leading-tight max-w-[8rem]">{h.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
