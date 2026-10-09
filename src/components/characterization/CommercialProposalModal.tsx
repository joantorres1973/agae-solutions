'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  FileText,
  X,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Building,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  DollarSign
} from 'lucide-react';

interface CommercialProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToSetup?: () => void;
}

export const CommercialProposalModal: React.FC<CommercialProposalModalProps> = ({
  isOpen,
  onClose,
  onProceedToSetup
}) => {
  const { characterization, applicabilityProfile } = useApp();
  const { proposal } = applicabilityProfile;

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-50 border border-slate-300 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">Propuesta Comercial & Diagnóstico Personalizado</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {proposal.id}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Solución modular generada por el Motor de Caracterización de AGAE SOLUTIONS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-700 print:text-black print:bg-white text-xs">
          {/* Executive Header Card */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-white via-white to-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                Cliente & Organización Evaluada
              </span>
              <h3 className="text-base font-black text-slate-900">{proposal.clientName}</h3>
              <p className="text-slate-600 mt-0.5">NIT: {proposal.clientNit}</p>
              <p className="text-slate-600">
                {characterization.identification.ciudad}, {characterization.identification.departamento} • CIIU {characterization.identification.codigoCiiu}
              </p>
              <p className="text-slate-600 mt-1">
                Contacto: {characterization.identification.representanteLegal} ({characterization.identification.emailContacto})
              </p>
            </div>

            <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-600 block text-[10px]">Complejidad</span>
                  <span className={`font-bold ${
                    proposal.complexityTier === 'ALTA' || proposal.complexityTier === 'MUY_ALTA' 
                      ? 'text-rose-700' 
                      : proposal.complexityTier === 'MEDIA' 
                      ? 'text-amber-700' 
                      : 'text-emerald-700'
                  }`}>
                    Nivel {proposal.complexityTier} ({proposal.complexityScore}/100)
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-600 block text-[10px]">Trabajadores / Sedes</span>
                  <span className="font-bold text-slate-900">
                    {characterization.size.totalTrabajadores} Colab. • {characterization.size.numeroSedes} Sede(s)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2">
                <span>Fecha: <strong className="text-slate-800">{proposal.createdAt}</strong></span>
                <span>Válida hasta: <strong className="text-slate-800">{proposal.validUntil}</strong></span>
              </div>
            </div>
          </div>

          {/* Diagnostic Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              1. Resumen Diagnóstico de Necesidades y Aplicabilidad
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-orange-700 font-bold block">SG-SST (Dec. 1072 & Res. 0312)</span>
                <p className="text-sm font-black text-slate-900 mt-1">
                  {characterization.calculatedSstStandards} Estándares Mínimos
                </p>
                <p className="text-[10px] text-slate-600 mt-1">
                  Riesgo ARL {characterization.sst.claseRiesgoArl} con {characterization.highRisk.trabajoAlturas ? 'Alturas' : 'Sin alturas'} y {characterization.highRisk.manejoSustanciasQuimicas ? 'Químicos SGA' : 'Sin químicos'}.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-sky-700 font-bold block">Seguridad Vial (PESV Res. 40595)</span>
                <p className="text-sm font-black text-slate-900 mt-1">
                  {characterization.calculatedPesvLevel === 'NO_APLICA' ? 'NO APLICA' : `Nivel ${characterization.calculatedPesvLevel}`}
                </p>
                <p className="text-[10px] text-slate-600 mt-1">
                  {characterization.pesv.utilizaVehiculosParaActividades 
                    ? `Flota de ${characterization.pesv.detallesPesv?.numeroVehiculosTotal || 0} vehículos y ${characterization.pesv.detallesPesv?.numeroConductoresTotal || 0} conductores.`
                    : 'Sin vehículos en operación.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-emerald-700 font-bold block">Gestión Ambiental (Dec. 1076)</span>
                <p className="text-sm font-black text-slate-900 mt-1">
                  {characterization.environmental.generaResiduosPeligrosos ? 'RESPEL + PGIRS' : 'PGIRS Ordinarios'}
                </p>
                <p className="text-[10px] text-slate-600 mt-1">
                  {characterization.environmental.generaResiduosPeligrosos 
                    ? `Generación de ${characterization.environmental.detallesRespel?.volumenKgMes || 0} kg/mes de RESPEL con reporte RUA.`
                    : 'Sin residuos peligrosos.'}
                </p>
              </div>
            </div>
          </div>

          {/* Module Breakdown Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              2. Módulos Recomendados y Cotización
            </h4>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-slate-600 border-b border-slate-200 text-[10px] uppercase font-bold">
                    <th className="p-3">Módulo AGAE</th>
                    <th className="p-3">Clasificación</th>
                    <th className="p-3">Justificación de Aplicabilidad</th>
                    <th className="p-3 text-right">Inversión Mensual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-slate-50">
                  {proposal.allEvaluations.map(mod => {
                    const isSelected = proposal.selectedModules.includes(mod.module);
                    return (
                      <tr key={mod.module} className={isSelected ? 'bg-emerald-50' : 'opacity-60'}>
                        <td className="p-3 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            {isSelected ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                            )}
                            <div>
                              <span>{mod.moduleName}</span>
                              <span className="block text-[10px] text-slate-600 font-normal">{mod.legalBasis}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            mod.tier === 'NECESARIO'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : mod.tier === 'RECOMENDADO'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : mod.tier === 'OPCIONAL'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {mod.tier}
                          </span>
                        </td>
                        <td className="p-3 max-w-sm text-[11px] text-slate-700">
                          {mod.justification}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                          {isSelected ? `$${mod.monthlyPriceCop.toLocaleString('es-CO')} COP` : 'No seleccionado'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-xl bg-white border border-emerald-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                Resumen Económico de la Propuesta
              </span>
              <p className="text-[11px] text-slate-600">
                Incluye licenciamiento multi-usuario en la nube, servidores redundantes, copias de seguridad automáticas y soporte técnico especializado.
              </p>
              {proposal.pricingBreakdown.multiModuleDiscountPercentage > 0 && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                  <Zap className="w-3 h-3" />
                  Descuento por Paquete Multi-Módulo: {proposal.pricingBreakdown.multiModuleDiscountPercentage}% OFF
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-right font-mono">
              <div className="flex justify-between text-slate-600 text-xs">
                <span>Subtotal Módulos / Mes:</span>
                <span>${proposal.pricingBreakdown.subtotalModulesCop.toLocaleString('es-CO')} COP</span>
              </div>
              {proposal.pricingBreakdown.discountCop > 0 && (
                <div className="flex justify-between text-emerald-700 text-xs font-semibold">
                  <span>Descuento Aplicado:</span>
                  <span>-${proposal.pricingBreakdown.discountCop.toLocaleString('es-CO')} COP</span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 text-sm font-black border-t border-slate-200 pt-1.5">
                <span>Inversión Mensual Neta:</span>
                <span className="text-emerald-700">${proposal.pricingBreakdown.totalMonthlyCop.toLocaleString('es-CO')} COP/mes</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Configuración Inicial & Onboarding:</span>
                <span>${(proposal.pricingBreakdown.platformSetupCop + proposal.pricingBreakdown.trainingAndOnboardingCop).toLocaleString('es-CO')} COP (Pago Único)</span>
              </div>
            </div>
          </div>

          {/* Implementation Roadmap */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Entregables y Tiempo Estimado de Puesta en Marcha ({proposal.implementationRoadmapWeeks} Semanas)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {proposal.keyDeliverables.map((del, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white/80 border border-slate-200 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="text-slate-700">{del}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600 hidden sm:block">
            Al adquirir AGAE, esta caracterización se convertirá automáticamente en su configuración operativa.
          </p>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cerrar
            </button>
            {onProceedToSetup && (
              <button
                onClick={() => {
                  onClose();
                  onProceedToSetup();
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>Proceder a Habilitación & Configuración</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
