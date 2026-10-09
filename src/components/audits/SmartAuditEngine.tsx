'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Sparkles,
  ClipboardCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileDown,
  Plus,
  Send,
  X,
  Bot,
  RefreshCw,
  Search,
  Printer
} from 'lucide-react';
import { AuditChecklistItem, AuditChecklistStatus, FindingSeverity } from '@/types';

export const SmartAuditEngine: React.FC = () => {
  const {
    audits,
    updateAuditChecklistItem,
    generateFindingFromAuditItem,
    organization,
    showNotification
  } = useApp();

  const [selectedAuditId, setSelectedAuditId] = useState<string>(audits[0]?.id || '');
  const [selectedItemForFinding, setSelectedItemForFinding] = useState<AuditChecklistItem | null>(null);

  // AI Assistant states
  const [aiCondition, setAiCondition] = useState('');
  const [aiEvidence, setAiEvidence] = useState('');
  const [aiSeverity, setAiSeverity] = useState<FindingSeverity>('MAYOR');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiResultText, setAiResultText] = useState('');

  // Report Modal states
  const [showReportModal, setShowReportModal] = useState(false);

  const currentAudit = audits.find(a => a.id === selectedAuditId) || audits[0];

  const getStatusBadge = (status: AuditChecklistStatus) => {
    switch (status) {
      case 'CONFORME':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">CONFORME</span>;
      case 'NO_CONFORME':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-50 text-rose-700 border border-rose-200">NO CONFORME</span>;
      case 'OPORTUNIDAD_MEJORA':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-200">OPORTUNIDAD MEJORA</span>;
      case 'OBSERVACION':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-sky-50 text-sky-700 border border-sky-200">OBSERVACIÓN</span>;
      case 'NO_APLICA':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-500 border border-slate-300">NO APLICA</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-300">SIN EVALUAR</span>;
    }
  };

  // Asistente de IA: Redacción estructurada profesional (Condición, Criterio, Causa, Efecto)
  const handleGenerateAiRedaction = () => {
    if (!selectedItemForFinding) return;
    setIsGeneratingAi(true);

    setTimeout(() => {
      const generated = `Durante la evaluación del requisito "${selectedItemForFinding.requirementCode} (${selectedItemForFinding.standard})", se evidenció que: ${
        aiCondition || 'no se cuenta con el soporte documental correspondiente actualizado para la totalidad de la muestra seleccionada'
      }. Esta situación se constató objetivamente mediante: ${
        aiEvidence || 'revisión documental en campo y entrevistas operativas'
      }. Lo anterior incumple lo preceptuado en la norma aplicable y genera un riesgo potencial de desviación operacional y sanciones legales. Se clasifica formalmente como No Conformidad ${aiSeverity}.`;

      setAiResultText(generated);
      setIsGeneratingAi(false);
    }, 1100);
  };

  const handleConfirmFinding = () => {
    if (!selectedItemForFinding || !currentAudit) return;

    generateFindingFromAuditItem(currentAudit.id, selectedItemForFinding.id, {
      title: `No Conformidad: ${selectedItemForFinding.requirementTitle}`,
      description: aiResultText || selectedItemForFinding.auditorNotes,
      severity: aiSeverity
    });

    setSelectedItemForFinding(null);
    setAiResultText('');
    setAiCondition('');
    setAiEvidence('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card p-4 rounded-xl border border-slate-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700 border border-purple-200">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Auditoría Inteligente & Asistente IA
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ejecución de auditorías transversales (SST, Ambiental, PESV e ISO) con generación inteligente de hallazgos y emisión inmediata del informe final.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Generar Informe Oficial
          </button>
        </div>
      </div>

      {/* Audit Meta Bar */}
      {currentAudit && (
        <div className="glass-card p-4 rounded-xl border border-slate-300 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block font-semibold">CÓDIGO DE AUDITORÍA</span>
            <span className="font-mono font-bold text-teal-700 text-sm">{currentAudit.code}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-semibold">ALCANCE Y PROCESOS</span>
            <span className="text-slate-800 font-medium line-clamp-1">{currentAudit.scope}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-semibold">AUDITOR LÍDER</span>
            <span className="text-slate-800 font-medium">{currentAudit.leadAuditor}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-semibold">ESTADO / HALLAZGOS</span>
            <span className="text-amber-700 font-bold">{currentAudit.status} • {currentAudit.findingsGeneratedCount} Hallazgos generados</span>
          </div>
        </div>
      )}

      {/* Checklist Table */}
      {currentAudit && (
        <div className="glass-card rounded-xl border border-slate-300 overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-teal-700" />
              Checklist de Requisitos y Evaluación en Tiempo Real
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">
              {currentAudit.checklist.length} Criterios Auditados
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {currentAudit.checklist.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-100 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-teal-700">{item.requirementCode}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                        {item.standard}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-800">{item.requirementTitle}</h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={item.status}
                      onChange={(e) => updateAuditChecklistItem(currentAudit.id, item.id, e.target.value as AuditChecklistStatus, item.auditorNotes)}
                      className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-teal-500 font-semibold"
                    >
                      <option value="CONFORME">Conforme</option>
                      <option value="NO_CONFORME">No Conforme</option>
                      <option value="OPORTUNIDAD_MEJORA">Oportunidad de Mejora</option>
                      <option value="OBSERVACION">Observación</option>
                      <option value="NO_APLICA">No Aplica</option>
                      <option value="SIN_EVALUAR">Sin Evaluar</option>
                    </select>

                    {item.status === 'NO_CONFORME' && (
                      <button
                        onClick={() => {
                          setSelectedItemForFinding(item);
                          setAiCondition(item.auditorNotes || '');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        + Generar Hallazgo con IA
                      </button>
                    )}
                  </div>
                </div>

                {/* Notes & Evidence */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                      Notas del Auditor y Hallazgo Fáctico:
                    </label>
                    <textarea
                      rows={2}
                      value={item.auditorNotes}
                      onChange={(e) => updateAuditChecklistItem(currentAudit.id, item.id, item.status, e.target.value)}
                      placeholder="Describa la observación en campo..."
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                      Evidencias Objetivas / Documentos Auditados:
                    </label>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 min-h-[58px] flex items-center justify-between">
                      <span className="italic">{item.evidenceNotes || 'Sin evidencias anexas'}</span>
                      {item.findingGeneratedId && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Hallazgo Emitido ({item.findingGeneratedId})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Asistente de IA para Redacción Profesional de Hallazgos */}
      {selectedItemForFinding && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-50 border border-purple-200 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700 border border-purple-200">
                  <Bot className="w-5 h-5" />
                </span>
                <h2 className="text-sm font-bold text-slate-900">
                  Asistente IA: Redacción Profesional de Hallazgo
                </h2>
              </div>
              <button
                onClick={() => setSelectedItemForFinding(null)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs">
              <span className="text-purple-700 font-bold block mb-1">Criterio Normativo Auditado:</span>
              <p className="text-slate-800">
                <strong>{selectedItemForFinding.requirementCode}</strong>: {selectedItemForFinding.requirementTitle} ({selectedItemForFinding.standard})
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  1. Condición Encontrada (¿Qué situación fáctica detectó?)
                </label>
                <textarea
                  rows={2}
                  value={aiCondition}
                  onChange={(e) => setAiCondition(e.target.value)}
                  placeholder="Ej: Se identificó que 2 de 5 extintores no contaban con tarjeta de inspección actualizada..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  2. Evidencia Objetiva (Muestra, registro o foto)
                </label>
                <input
                  type="text"
                  value={aiEvidence}
                  onChange={(e) => setAiEvidence(e.target.value)}
                  placeholder="Ej: Muestreo de equipos en bodega 1 y foto de manómetro descargado"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Severidad:</span>
                  <select
                    value={aiSeverity}
                    onChange={(e) => setAiSeverity(e.target.value as FindingSeverity)}
                    className="bg-white border border-slate-300 text-slate-800 rounded px-2 py-1 text-xs"
                  >
                    <option value="CRITICA">No Conformidad Crítica</option>
                    <option value="MAYOR">No Conformidad Mayor</option>
                    <option value="MENOR">No Conformidad Menor</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAiRedaction}
                  disabled={isGeneratingAi}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow"
                >
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Redactando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Redactar con IA
                    </>
                  )}
                </button>
              </div>

              {aiResultText && (
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Propuesta de Redacción Técnica IA
                    </span>
                    <span className="text-[9px] text-purple-700">Revisar y Aprobar</span>
                  </div>
                  <textarea
                    rows={4}
                    value={aiResultText}
                    onChange={(e) => setAiResultText(e.target.value)}
                    className="w-full bg-white border border-purple-200 rounded p-2 text-xs text-slate-800 leading-relaxed focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 italic">
                    * La IA apoya la redacción formal (Criterio, Condición, Causa y Consecuencia). El auditor conserva la potestad técnica de aprobación.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedItemForFinding(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmFinding}
                disabled={!aiResultText}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  aiResultText
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
                    : 'bg-slate-100 text-slate-500 cursor-not-allowed'
                }`}
              >
                Aprobar y Emitir a Matriz ACPM →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Informe Oficial de Auditoría (Instantáneo sin doble digitación) */}
      {showReportModal && currentAudit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-50 border border-slate-300 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Informe Oficial de Auditoría Interna — AGAE SOLUTIONS
                </h2>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Header */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{organization.name}</h3>
                <p className="text-xs text-slate-500">NIT: {organization.nit} • CIIU {organization.ciiu}</p>
                <p className="text-xs text-slate-500 mt-1">
                  <strong>Informe:</strong> {currentAudit.code} — {currentAudit.title}
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div>Fecha: <strong>{currentAudit.auditDate}</strong></div>
                <div>Auditor Líder: <strong>{currentAudit.leadAuditor}</strong></div>
                <div className="text-emerald-700 font-semibold mt-1">Estado: Aprobado para emisión</div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2 text-xs text-slate-700">
              <h4 className="font-bold text-teal-700 uppercase tracking-wider">1. Objetivo y Alcance</h4>
              <p className="leading-relaxed bg-white/80 p-3 rounded border border-slate-200">
                Evaluar el grado de conformidad e implementación de los sistemas integrados de gestión HSEQ (SG-SST Decreto 1072/15, PESV Resolución 40595/22 y Tri-Norma ISO 9001/14001/45001) para la sede principal Fontibón y Hub Medellín.
              </p>

              <h4 className="font-bold text-teal-700 uppercase tracking-wider pt-2">2. Resultados Cuantitativos</h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-emerald-50 border border-emerald-200 p-2 rounded">
                  <span className="text-lg font-bold text-emerald-700">
                    {currentAudit.checklist.filter(i => i.status === 'CONFORME').length}
                  </span>
                  <span className="text-[10px] block text-slate-500">Conformidades</span>
                </div>
                <div className="bg-rose-50 border border-rose-200 p-2 rounded">
                  <span className="text-lg font-bold text-rose-700">
                    {currentAudit.checklist.filter(i => i.status === 'NO_CONFORME').length}
                  </span>
                  <span className="text-[10px] block text-slate-500">No Conformidades</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-2 rounded">
                  <span className="text-lg font-bold text-amber-700">
                    {currentAudit.checklist.filter(i => i.status === 'OPORTUNIDAD_MEJORA').length}
                  </span>
                  <span className="text-[10px] block text-slate-500">Oportunidades</span>
                </div>
                <div className="bg-sky-50 border border-sky-200 p-2 rounded">
                  <span className="text-lg font-bold text-sky-700">
                    {currentAudit.checklist.filter(i => i.status === 'OBSERVACION').length}
                  </span>
                  <span className="text-[10px] block text-slate-500">Observaciones</span>
                </div>
              </div>

              <h4 className="font-bold text-teal-700 uppercase tracking-wider pt-2">3. Detalle de No Conformidades Trasladadas a ACPM</h4>
              <div className="space-y-2">
                {currentAudit.checklist.filter(i => i.status === 'NO_CONFORME').map(nc => (
                  <div key={nc.id} className="p-3 rounded bg-white border border-rose-200 text-xs">
                    <div className="font-bold text-rose-700 flex items-center justify-between">
                      <span>{nc.requirementCode}: {nc.requirementTitle}</span>
                      <span className="text-[10px] bg-rose-50 px-2 py-0.5 rounded text-rose-700 font-mono">
                        ACPM Conectada
                      </span>
                    </div>
                    <p className="text-slate-700 mt-1">{nc.auditorNotes}</p>
                  </div>
                ))}
              </div>

              <h4 className="font-bold text-teal-700 uppercase tracking-wider pt-2">4. Conclusión del Equipo Auditor</h4>
              <p className="leading-relaxed bg-white/80 p-3 rounded border border-slate-200">
                La organización demuestra un sólido compromiso con el ciclo PHVA. Los hallazgos identificados cuentan con apertura automática en la Matriz ACPM para el análisis de causa y seguimiento de eficacia según los plazos acordados.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Generado automáticamente sin doble digitación por AGAE SOLUTIONS
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showNotification('Informe de auditoría descargado en formato oficial');
                    setShowReportModal(false);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Descargar PDF Oficial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
