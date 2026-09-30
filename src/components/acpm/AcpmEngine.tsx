'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  Search,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  Eye,
  History,
  Check,
  X,
  UploadCloud,
  FileText,
  AlertCircle
} from 'lucide-react';
import { AcpmAction, AcpmStatus, Finding, ModuleType } from '@/types';

export const AcpmEngine: React.FC = () => {
  const {
    acpmActions,
    findings,
    evidences,
    updateAcpmStatus,
    addAcpmRootCause,
    attachEvidenceToAcpm,
    verifyAcpmEfficacy,
    createManualAcpm,
    showNotification
  } = useApp();

  const [selectedAcpm, setSelectedAcpm] = useState<AcpmAction | null>(acpmActions[0] || null);
  const [filterModule, setFilterModule] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [activeTabSub, setActiveTabSub] = useState<'ACTIONS' | 'FINDINGS'>('ACTIONS');

  // Modal states
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [verifyResult, setVerifyResult] = useState<'EFICAZ' | 'NO_EFICAZ'>('EFICAZ');

  // Modal new action
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newModule, setNewModule] = useState<ModuleType>('SST');
  const [newRequirement, setNewRequirement] = useState('');
  const [newImmediate, setNewImmediate] = useState('');
  const [newCorrective, setNewCorrective] = useState('');
  const [newResponsible, setNewResponsible] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'ALTA' | 'MEDIA' | 'BAJA'>('ALTA');

  // Filtered lists
  const filteredAcpm = acpmActions.filter(a => {
    if (filterModule !== 'ALL' && a.originModule !== filterModule) return false;
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: AcpmStatus) => {
    switch (status) {
      case 'CERRADA':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-300 border border-emerald-800">CERRADA (EFICAZ)</span>;
      case 'PENDIENTE_VERIFICACION':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-950 text-purple-300 border border-purple-800">POR VERIFICAR</span>;
      case 'EN_EJECUCION':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-sky-950 text-sky-300 border border-sky-800">EN EJECUCIÓN</span>;
      case 'EN_ANALISIS':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-950 text-amber-300 border border-amber-800">EN ANÁLISIS DE CAUSA</span>;
      case 'REABIERTA':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-950 text-rose-300 border border-rose-800">REABIERTA (NO EFICAZ)</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300 border border-slate-700">ABIERTA</span>;
    }
  };

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newResponsible) return;

    createManualAcpm({
      findingId: `find-manual-${Date.now()}`,
      findingCode: `MANUAL-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      originModule: newModule,
      associatedRequirement: newRequirement || 'Norma aplicable del Sistema de Gestión',
      causeAnalysisMethod: '5_WHY',
      rootCauses: ['Pendiente de investigación de causa raíz'],
      immediateAction: newImmediate || 'Corrección inmediata',
      correctiveAction: newCorrective || 'Acción de fondo para eliminar causa',
      responsibleName: newResponsible,
      responsibleEmail: 'responsable@andina.com.co',
      dueDate: newDueDate || '2026-04-30',
      priority: newPriority,
      status: 'ABIERTA',
      evidences: []
    });

    setShowNewModal(false);
    setNewTitle('');
    setNewRequirement('');
    setNewImmediate('');
    setNewCorrective('');
    setNewResponsible('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Title & Stats Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card p-4 rounded-xl border border-slate-700/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertOctagon className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">
              Matriz Central ACPM & Motor de Hallazgos
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestión integral de Acciones Correctivas, Preventivas y de Mejora. Trazabilidad completa desde el origen hasta el cierre verificado con evidencia.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex rounded-lg bg-slate-900/90 p-0.5 border border-slate-700">
            <button
              onClick={() => setActiveTabSub('ACTIONS')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTabSub === 'ACTIONS' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Matriz ACPM ({acpmActions.length})
            </button>
            <button
              onClick={() => setActiveTabSub('FINDINGS')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTabSub === 'FINDINGS' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hallazgos Transversales ({findings.length})
            </button>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Nueva ACPM
          </button>
        </div>
      </div>

      {activeTabSub === 'ACTIONS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Actions List & Filters */}
          <div className="lg:col-span-5 space-y-3">
            {/* Filter controls */}
            <div className="flex items-center gap-2 text-xs">
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Todos los Módulos</option>
                <option value="SST">SG-SST</option>
                <option value="ENVIRONMENTAL">Ambiental</option>
                <option value="PESV">Seguridad Vial (PESV)</option>
                <option value="ISO_9001">ISO 9001 / HLS</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="ABIERTA">Abierta</option>
                <option value="EN_EJECUCION">En Ejecución</option>
                <option value="PENDIENTE_VERIFICACION">Por Verificar</option>
                <option value="CERRADA">Cerrada (Eficaz)</option>
              </select>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
              {filteredAcpm.map((action) => {
                const isSelected = selectedAcpm?.id === action.id;
                return (
                  <div
                    key={action.id}
                    onClick={() => setSelectedAcpm(action)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500/80 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">{action.code}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {action.originModule}
                        </span>
                      </div>
                      {getStatusBadge(action.status)}
                    </div>

                    <h2 className="text-xs font-bold text-slate-100 line-clamp-1">{action.title}</h2>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{action.correctiveAction}</p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                      <span>Resp: <strong className="text-slate-300">{action.responsibleName}</strong></span>
                      <span className="flex items-center gap-1 text-amber-400 font-medium">
                        <Clock className="w-3 h-3" /> Vence: {action.dueDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Action Workspace & Efficacy Verification */}
          <div className="lg:col-span-7">
            {selectedAcpm ? (
              <div className="glass-card rounded-xl p-5 border border-slate-700/80 space-y-4">
                {/* Header detail */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-cyan-400">{selectedAcpm.code}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Origen: {selectedAcpm.findingCode}
                      </span>
                      {getStatusBadge(selectedAcpm.status)}
                    </div>
                    <h2 className="text-base font-bold text-white mt-1">{selectedAcpm.title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Requisito: <strong className="text-slate-300">{selectedAcpm.associatedRequirement}</strong>
                    </p>
                  </div>

                  {/* Verification action button */}
                  {selectedAcpm.status !== 'CERRADA' && (
                    <button
                      onClick={() => setShowVerifyModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Verificar Eficacia
                    </button>
                  )}
                </div>

                {/* Analysis of root cause */}
                <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      Análisis de Causa Raíz ({selectedAcpm.causeAnalysisMethod})
                    </span>
                    <span className="text-[10px] text-slate-400">Metodología Formal</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {selectedAcpm.rootCauses.map((cause, idx) => (
                      <li key={idx} className="leading-relaxed">{cause}</li>
                    ))}
                  </ul>
                </div>

                {/* Action plans */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      Acción Inmediata (Corrección)
                    </span>
                    <p className="text-slate-200">{selectedAcpm.immediateAction}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Acción Correctiva (Elimina Causa)
                    </span>
                    <p className="text-slate-200">{selectedAcpm.correctiveAction}</p>
                  </div>
                </div>

                {/* Evidences Attached (Principio: La acción no se cierra sin evidencia) */}
                <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-cyan-400" />
                      Evidencias de Cumplimiento Asociadas ({selectedAcpm.evidences.length})
                    </span>
                    <button
                      onClick={() => {
                        // Quick attach mock evidence for demo
                        if (evidences.length > 0) {
                          attachEvidenceToAcpm(selectedAcpm.id, evidences[0].id);
                        }
                      }}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      + Vincular Evidencia
                    </button>
                  </div>

                  {selectedAcpm.evidences.length === 0 ? (
                    <div className="p-3 text-center rounded border border-dashed border-slate-800 text-xs text-slate-400">
                      Sin evidencias vinculadas aún. No es posible cerrar formalmente esta acción sin soporte objetivo.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedAcpm.evidences.map((evi) => (
                        <div key={evi.id} className="flex items-center justify-between p-2 rounded bg-slate-800/60 border border-slate-700/60 text-xs">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-cyan-400" />
                            <div>
                              <div className="font-semibold text-slate-200">{evi.title}</div>
                              <div className="text-[10px] text-slate-400">{evi.fileName} • {evi.fileSize}</div>
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-semibold">Validado</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Verification Result Banner (if verified) */}
                {selectedAcpm.verificationResult && (
                  <div className={`p-3.5 rounded-xl border ${
                    selectedAcpm.verificationResult === 'EFICAZ'
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Resultado de Verificación de Eficacia: {selectedAcpm.verificationResult}
                      </span>
                      <span className="text-[10px] opacity-80">{selectedAcpm.verifiedAt}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{selectedAcpm.verificationNotes}</p>
                    <span className="text-[10px] font-medium block mt-1 opacity-70">
                      Verificado por: {selectedAcpm.verifiedBy}
                    </span>
                  </div>
                )}

                {/* Audit Trail / Inmutable History */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
                    <History className="w-3.5 h-3.5 text-cyan-400" />
                    Historial Trazable e Inmutable de Auditoría
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {selectedAcpm.history.map((hist) => (
                      <div key={hist.id} className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-start justify-between gap-2">
                        <div>
                          <strong className="text-white">{hist.userName}</strong>: {hist.action}
                          {hist.comment && <div className="text-slate-400 text-[10px] mt-0.5 italic">"{hist.comment}"</div>}
                        </div>
                        <span className="text-[9px] text-slate-400 shrink-0">{hist.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-xl p-10 text-center text-slate-400 text-xs">
                Seleccione una acción ACPM para ver su trazabilidad
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Findings list view */
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {findings.map((f) => (
              <div key={f.id} className="glass-card rounded-xl p-4 border border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{f.code}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      f.severity === 'CRITICA' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      f.severity === 'MAYOR' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {f.severity}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-[11px] text-slate-400 mb-2">{f.description}</p>
                  
                  {f.sharedAssetName && (
                    <div className="text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800/40 mb-2">
                      Activo Vinculado: <strong>{f.sharedAssetName}</strong>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400">
                    <div>Origen: <strong>{f.originType}</strong> ({f.originDetail})</div>
                    <div>Criterio: {f.legalCriterion}</div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{f.createdAt}</span>
                  <span className="text-emerald-400 font-semibold">{f.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Efficacy Modal */}
      {showVerifyModal && selectedAcpm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Verificación de Eficacia — {selectedAcpm.code}
              </h2>
              <button onClick={() => setShowVerifyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Según las normas ISO y el Decreto 1072, el cierre formal requiere validar en campo que la causa raíz fue efectivamente eliminada.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Calificación de la Verificación</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVerifyResult('EFICAZ')}
                  className={`p-3 rounded-lg border text-xs font-bold text-center transition-all ${
                    verifyResult === 'EFICAZ'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  ✓ EFICAZ (Cerrar Acción)
                </button>

                <button
                  type="button"
                  onClick={() => setVerifyResult('NO_EFICAZ')}
                  className={`p-3 rounded-lg border text-xs font-bold text-center transition-all ${
                    verifyResult === 'NO_EFICAZ'
                      ? 'bg-rose-950 border-rose-500 text-rose-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  ✗ NO EFICAZ (Reabrir Acción)
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Notas y Evidencia de la Verificación en Campo
              </label>
              <textarea
                rows={3}
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                placeholder="Describa la inspección realizada para constatar que la medida fue eficaz y no se han vuelto a presentar desviaciones..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  verifyAcpmEfficacy(selectedAcpm.id, verifyResult, verifyNotes || 'Verificación aprobada por la dirección HSEQ', 'Dra. Marcela Rincón');
                  setShowVerifyModal(false);
                  setVerifyNotes('');
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
              >
                Registrar Verificación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New ACPM Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateAction} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white">Nueva Acción ACPM</h2>
              <button type="button" onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Título de la Acción *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Implementación de barreras y demarcación en zona de cargue..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Módulo Origen</label>
                  <select
                    value={newModule}
                    onChange={(e) => setNewModule(e.target.value as ModuleType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="SST">SG-SST (Dec 1072)</option>
                    <option value="ENVIRONMENTAL">Gestión Ambiental</option>
                    <option value="PESV">Seguridad Vial (PESV)</option>
                    <option value="ISO_9001">ISO 9001 / Tri-Norma</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Prioridad</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as 'ALTA' | 'MEDIA' | 'BAJA')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="ALTA">Alta (Crítica)</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Requisito Legal o Normativo</label>
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Ej: Dec 1072 Art. 2.2.4.6.24 / Res 40595 Paso 8..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Acción Inmediata (Corrección provisional)</label>
                <input
                  type="text"
                  value={newImmediate}
                  onChange={(e) => setNewImmediate(e.target.value)}
                  placeholder="Ej: Despejar inmediatamente el pasillo y aislar la zona..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Acción Correctiva (Plan definitivo)</label>
                <textarea
                  rows={2}
                  value={newCorrective}
                  onChange={(e) => setNewCorrective(e.target.value)}
                  placeholder="Ej: Modificación del layout de almacenamiento y capacitación obligatoria a operadores..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Responsable de Ejecución *</label>
                  <input
                    type="text"
                    required
                    value={newResponsible}
                    onChange={(e) => setNewResponsible(e.target.value)}
                    placeholder="Ej: Carlos Mendoza (Jefe Operaciones)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Fecha Compromiso</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
              >
                Crear Acción ACPM
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
