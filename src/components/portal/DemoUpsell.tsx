'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, Lock, Rocket, Sparkles, X } from 'lucide-react';
import { useAuth, DEMO_ACTION_LIMIT } from '@/lib/auth';
import { useApp } from '@/lib/store';
import { isTabOutsidePlan, planName, tabModuleLabel } from '@/lib/plan-rules';

/** Takes the visitor to the contact form on the public site. */
const useGoToContact = () => {
  const { setPortalView } = useApp();
  const { closeUpsell } = useAuth();
  return () => {
    closeUpsell();
    setPortalView('landing');
    setTimeout(() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }), 150);
  };
};

/** Thin banner shown on top of the workspace while using the demo account. */
export const DemoBanner: React.FC = () => {
  const { isDemo, demoActionsLeft } = useAuth();
  const goToContact = useGoToContact();
  if (!isDemo) return null;

  return (
    <div className="bg-gradient-to-r from-[#0e6f86] via-[#16788a] to-[#4c9a2a] text-slate-900 px-4 py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
      <span className="flex items-center gap-1.5 font-semibold">
        <Sparkles className="w-3.5 h-3.5" /> Estás en el MODO DEMO de AGAE Integral 360+
      </span>
      <span className="text-white/85">
        {demoActionsLeft > 0
          ? `Te quedan ${demoActionsLeft} de ${DEMO_ACTION_LIMIT} acciones de prueba`
          : 'Ya usaste tus acciones de prueba'}
      </span>
      <button onClick={goToContact} className="px-3 py-1 rounded-full bg-white text-[#0e6f86] font-bold hover:bg-emerald-50">
        Contratar AGAE
      </button>
    </div>
  );
};

/** Modal shown when the demo user tries something outside the demo. */
export const DemoUpsellModal: React.FC = () => {
  const { upsellReason, closeUpsell } = useAuth();
  const goToContact = useGoToContact();
  if (!upsellReason) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020c16]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <button onClick={closeUpsell} className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/80 hover:bg-white/10" aria-label="Cerrar">
          <X className="w-5 h-5" />
        </button>

        <div className="relative bg-gradient-to-br from-[#04182b] via-[#082c4a] to-[#0b3d5c] px-8 pt-9 pb-8 text-slate-900 text-center">
          <div className="pointer-events-none absolute -top-20 -right-10 w-64 h-64 rounded-full bg-teal-100 blur-3xl" />
          <span className="relative mx-auto w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-teal-800" strokeWidth={1.75} />
          </span>
          <p className="relative mt-4 text-sm text-teal-800">{upsellReason}</p>
          <h2 className="relative mt-2 font-display text-2xl sm:text-3xl font-bold leading-tight">
            ¡Contrata los servicios de{' '}
            <span className="bg-gradient-to-r from-[#22d3ee] to-[#a3e635] bg-clip-text text-transparent">AGAE SOLUTIONS</span> ya!
          </h2>
        </div>

        <div className="px-8 py-7">
          <p className="text-[#33435c] text-center">Con la versión completa de AGAE Integral 360+ obtienes:</p>
          <ul className="mt-5 space-y-2.5">
            {[
              'Todos los módulos: SST, Ambiental, Vial, Auditorías y Sistemas ISO',
              'Registro ilimitado de información, evidencias y reportes',
              'Acompañamiento profesional especializado',
              'Acceso anticipado y 1 mes de prueba sin costo*',
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-[#16245c]">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" /> {item}
              </li>
            ))}
          </ul>

          <button
            onClick={goToContact}
            className="mt-7 w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-[#7cb342] to-[#4caf50] text-slate-900 font-bold shadow-lg shadow-lime-600/25 transition-all hover:-translate-y-0.5"
          >
            <Rocket className="w-4 h-4" /> Quiero contratar AGAE <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={closeUpsell} className="mt-3 w-full py-2.5 text-sm text-slate-600 hover:text-[#16245c]">
            Seguir explorando el demo
          </button>
          <p className="mt-2 text-center text-[11px] text-slate-600">*Sujeto a las condiciones del programa de lanzamiento.</p>
        </div>
      </div>
    </div>
  );
};

/** Shown on top of a module that is not part of the contracted plan (preview only). */
export const PlanPreviewBanner: React.FC = () => {
  const { activeTab, organization } = useApp();
  const { openUpsell } = useAuth();
  if (!isTabOutsidePlan(activeTab, organization.activeModules)) return null;
  const moduleName = tabModuleLabel(activeTab);

  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <Lock className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">
            Vista de demostración · {moduleName} no está incluido en tu {planName(organization.activeModules)}
          </p>
          <p className="text-xs text-amber-800">
            Puedes explorar cómo funciona este módulo, pero no registrar ni modificar información.
          </p>
        </div>
      </div>
      <button
        onClick={() => openUpsell(`Agrega ${moduleName} a tu plan para usarlo con tu información.`)}
        className="shrink-0 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-bold"
      >
        Contratar {moduleName}
      </button>
    </div>
  );
};
