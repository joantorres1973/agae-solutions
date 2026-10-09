'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  ShieldCheck,
  Building2,
  HardHat,
  Leaf,
  Car,
  Award,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  FileText,
  Clock,
  Eye,
  Sliders,
  DollarSign
} from 'lucide-react';
import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';
import { SstModule } from '@/components/sst/SstModule';
import { EnvironmentalModule } from '@/components/environmental/EnvironmentalModule';
import { PesvModule } from '@/components/pesv/PesvModule';
import { IsoModule } from '@/components/iso/IsoModule';
import { characterizationArchetypes } from '@/lib/characterization-mock';

export const InteractiveDemoPreview: React.FC = () => {
  const {
    characterization,
    applicabilityProfile,
    setPortalView,
    setActiveWizardStep,
    setIsCheckoutModalOpen,
    loadCharacterizationArchetype
  } = useApp();

  const [activeDemoTab, setActiveDemoTab] = useState<'dashboard' | 'sst' | 'environmental' | 'pesv' | 'iso'>('dashboard');

  const { proposal, evaluations } = applicabilityProfile;
  const isPesvActive = characterization.pesv.utilizaVehiculosParaActividades;
  const isEnvRespel = characterization.environmental.generaResiduosPeligrosos;

  const handleOpenCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleEditCharacterization = () => {
    setActiveWizardStep(1);
    setPortalView('wizard');
  };

  return (
    <div className="min-h-screen bg-[#f4f8f6] text-slate-800 flex flex-col font-sans pb-24">
      {/* Top Demo Banner */}
      <header className="sticky top-0 z-40 glass-panel border-b border-emerald-200 px-4 lg:px-8 py-3 bg-white backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPortalView('landing')}
              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Volver a la Página Principal"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Demo Interactivo Personalizado
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {characterization.identification.razonSocial || 'Empresa Evaluada'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Esta es una simulación en vivo de cómo operará AGAE configurada para tus {characterization.size.totalTrabajadores} trabajadores y {characterization.sites.length} sede(s).
              </p>
            </div>
          </div>

          {/* Quick Archetype Switcher & Purchase CTA */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 mr-2">
              <span>Arquetipos:</span>
              {characterizationArchetypes.map(arc => (
                <button
                  key={arc.id}
                  onClick={() => loadCharacterizationArchetype(arc.id)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold border border-slate-300 transition-colors"
                >
                  {arc.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <button
              onClick={handleEditCharacterization}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Ajustar Caracterización</span>
            </button>

            <button
              onClick={handleOpenCheckout}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-slate-900/5 flex items-center gap-1.5 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Comprar Solución</span>
            </button>
          </div>
        </div>

        {/* Dynamic Demo Navigation Tabs */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-200 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveDemoTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeDemoTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow shadow-slate-900/5'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tablero Gerencial</span>
          </button>

          <button
            onClick={() => setActiveDemoTab('sst')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeDemoTab === 'sst'
                ? 'bg-orange-600 text-white shadow'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>SG-SST ({characterization.calculatedSstStandards} Estándares)</span>
          </button>

          <button
            onClick={() => setActiveDemoTab('environmental')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeDemoTab === 'environmental'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Gestión Ambiental ({isEnvRespel ? 'RESPEL + PGIRS' : 'PGIRS'})</span>
          </button>

          <button
            onClick={() => isPesvActive && setActiveDemoTab('pesv')}
            disabled={!isPesvActive}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 ${
              !isPesvActive
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : activeDemoTab === 'pesv'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title={!isPesvActive ? 'No aplica a esta empresa según caracterización' : ''}
          >
            <Car className="w-3.5 h-3.5" />
            <span>PESV {characterization.calculatedPesvLevel === 'NO_APLICA' ? '(No Aplica)' : `(${characterization.calculatedPesvLevel})`}</span>
          </button>

          <button
            onClick={() => setActiveDemoTab('iso')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeDemoTab === 'iso'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Tri-Norma ISO</span>
          </button>
        </div>
      </header>

      {/* Demo Workspace Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 space-y-6">
        {/* Dynamic Context Header */}
        <div className="p-4 rounded-xl bg-slate-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 text-sm block">
                {characterization.identification.razonSocial}
              </span>
              <span className="text-slate-500 text-[11px]">
                NIT {characterization.identification.nit} • Riesgo ARL {characterization.sst.claseRiesgoArl} • {characterization.size.totalTrabajadores} Trabajadores • {characterization.sites.length} Sede(s)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
              {characterization.calculatedSstStandards} Estándares Mínimos
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              characterization.calculatedPesvLevel === 'NO_APLICA'
                ? 'bg-slate-100 text-slate-500'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              PESV: {characterization.calculatedPesvLevel}
            </span>
          </div>
        </div>

        {/* Demo Active Tab Rendering */}
        <div className="animate-in fade-in duration-200">
          {activeDemoTab === 'dashboard' && <ExecutiveDashboard />}
          {activeDemoTab === 'sst' && <SstModule />}
          {activeDemoTab === 'environmental' && <EnvironmentalModule />}
          {activeDemoTab === 'pesv' && <PesvModule />}
          {activeDemoTab === 'iso' && <IsoModule />}
        </div>
      </main>

      {/* Floating Bottom Conversion Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-emerald-200 px-4 py-3 shadow-2xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                ¿Estás de acuerdo con esta solución para {characterization.identification.razonSocial}?
              </span>
              <span className="text-[11px] text-slate-500">
                Inversión mensual estimada: <strong className="text-emerald-700 font-mono">${proposal.pricingBreakdown.totalMonthlyCop.toLocaleString('es-CO')} COP/mes</strong>. Se enviarán todas las credenciales al correo institucional.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setPortalView('landing')}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Volver al Portal
            </button>

            <button
              onClick={handleOpenCheckout}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-slate-900/5 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Comprar Solución & Enviar Credenciales</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
