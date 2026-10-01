'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  FileText,
  Shield,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Paperclip,
  Upload,
  ArrowRight,
  ExternalLink,
  X
} from 'lucide-react';
import { SstStandardDefinition, SstStandardStatus } from '@/types/sst';

interface SstStandardDetailModalProps {
  standard: SstStandardDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenResponsibleModal?: () => void;
  onOpenBudgetModal?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const SstStandardDetailModal: React.FC<SstStandardDetailModalProps> = ({
  standard,
  isOpen,
  onClose,
  onOpenResponsibleModal,
  onOpenBudgetModal,
  onNavigateToTab
}) => {
  const {
    evidences,
    addEvidence,
    updateStandardStatus,
    attachEvidenceToStandard,
    showNotification
  } = useApp();

  const [status, setStatus] = useState<SstStandardStatus>(standard?.status || 'CUMPLE');
  const [notes, setNotes] = useState(standard?.notes || '');
  const [selectedExistingEvidence, setSelectedExistingEvidence] = useState('');

  if (!isOpen || !standard) return null;

  const handleSave = () => {
    updateStandardStatus(standard.id, status, notes);
    showNotification(`Estándar ${standard.code} actualizado`);
    onClose();
  };

  const handleAttachExisting = () => {
    if (!selectedExistingEvidence) return;
    attachEvidenceToStandard(standard.id, selectedExistingEvidence);
    setSelectedExistingEvidence('');
  };

  const handleSimulateUploadEvidence = () => {
    const newEvidence = addEvidence({
      title: `Evidencia para ${standard.code} - ${standard.title}`,
      fileType: 'DOCUMENT',
      fileName: `Soporte_${standard.code.replace(/\./g, '_')}_2026.pdf`,
      fileSize: '2.1 MB',
      uploadedBy: 'Responsable SG-SST',
      url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
      tags: ['SST', `ESTANDAR_${standard.code}`, 'DEC_1072']
    });

    attachEvidenceToStandard(standard.id, newEvidence.id);
    showNotification(`Nueva evidencia cargada y vinculada al Estándar ${standard.code}`);
  };

  const attachedEvidences = evidences.filter(e => standard.evidenceIds.includes(e.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <span className={`w-10 h-10 rounded-xl font-bold font-mono text-sm flex items-center justify-center border ${
              standard.cycle === 'PLANEAR' ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800' :
              standard.cycle === 'HACER' ? 'bg-orange-950/80 text-orange-400 border-orange-800' :
              standard.cycle === 'VERIFICAR' ? 'bg-purple-950/80 text-purple-400 border-purple-800' :
              'bg-rose-950/80 text-rose-400 border-rose-800'
            }`}>
              {standard.code}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {standard.cycle} • {standard.numeralGroup}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300">
                  Ponderación: {standard.weight}%
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {standard.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* Decreto 1072 de 2015 Articulado cotejado */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Cotejo con el Decreto 1072 de 2015 (Libro 2, Parte 2, Título 4, Capítulo 6)
              </span>
              <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                {standard.decreto1072Article}
              </span>
            </div>
            <h3 className="font-semibold text-white text-xs">{standard.decreto1072Title}</h3>
            <p className="text-slate-300 text-[11px] leading-relaxed italic bg-slate-900/60 p-2.5 rounded border border-slate-800">
              "{standard.decreto1072Excerpt}"
            </p>
          </div>

          {/* Criterio y Modo de Verificación Resolución 0312 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="glass-card p-3.5 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                Criterio Resolución 0312 de 2019
              </span>
              <p className="text-slate-200 text-xs leading-relaxed">{standard.criterion}</p>
            </div>

            <div className="glass-card p-3.5 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Modo de Verificación del Auditor / MinTrabajo
              </span>
              <p className="text-slate-300 text-xs leading-relaxed">{standard.modeOfVerification}</p>
            </div>
          </div>

          {/* Quick Action Trigger if standard has specialized tool */}
          {standard.actionType && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-950 border border-orange-500/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Herramienta Integrada Disponible</span>
                <span className="text-[11px] text-slate-400">
                  {standard.actionType === 'RESPONSIBLE' ? 'Gestione la hoja de vida, licencia y la Carta de Asignación formal generada en vivo.' :
                   standard.actionType === 'BUDGET' ? 'Configure el presupuesto integrado SST + Vial PESV con aprobación de gerencia.' :
                   standard.actionType === 'HAZARDS' ? 'Identifique peligros y valore riesgos según la matriz GTC 45.' :
                   standard.actionType === 'INSPECTION' ? 'Ejecute inspecciones de campo con conexión automática a ACPM.' :
                   standard.actionType === 'COPASST' ? 'Consulte actas y funcionamiento del comité paritario.' :
                   'Gestione acciones correctivas en la matriz central ACPM.'}
                </span>
              </div>

              {standard.actionType === 'RESPONSIBLE' && onOpenResponsibleModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenResponsibleModal();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shrink-0"
                >
                  <span>Abrir Asignación & Carta</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {standard.actionType === 'BUDGET' && onOpenBudgetModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBudgetModal();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shrink-0"
                >
                  <span>Abrir Presupuesto Integrado</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {standard.actionType === 'ACPM' && onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToTab('acpm');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shrink-0"
                >
                  <span>Ir a Matriz ACPM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Compliance Status and Auditor Notes */}
          <div className="glass-card p-4 rounded-xl border border-slate-700/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Calificación del Estándar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Estado de Cumplimiento</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SstStandardStatus)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-semibold focus:outline-none focus:border-cyan-500"
                >
                  <option value="CUMPLE">✓ CUMPLE TOTALMENTE (Puntaje Completo)</option>
                  <option value="EN_PROCESO">⏳ EN PROCESO DE IMPLEMENTACIÓN (50%)</option>
                  <option value="NO_CUMPLE">✕ NO CUMPLE (0%)</option>
                  <option value="NO_APLICA_JUSTIFICADO">⊘ NO APLICA JUSTIFICADO (Puntaje Completo)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Notas del Auditor / Justificación Legal</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Justificación del cumplimiento o motivo de no aplicación..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Attached Evidences Section */}
          <div className="glass-card p-4 rounded-xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                Evidencias Digitales Vinculadas ({attachedEvidences.length})
              </h3>
              <button
                type="button"
                onClick={handleSimulateUploadEvidence}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Upload className="w-3 h-3" />
                <span>+ Cargar Soporte Digital</span>
              </button>
            </div>

            {attachedEvidences.length > 0 ? (
              <div className="space-y-2">
                {attachedEvidences.map(ev => (
                  <div key={ev.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-white">{ev.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {ev.fileName} • {ev.fileSize} • Subido por {ev.uploadedBy}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                      En Custodia
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-950/60 border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                No hay archivos adjuntos directamente a este estándar. Puede cargar un archivo o vincular una evidencia existente.
              </div>
            )}

            {/* Link existing evidence dropdown */}
            <div className="flex items-center gap-2 pt-1">
              <select
                value={selectedExistingEvidence}
                onChange={(e) => setSelectedExistingEvidence(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300"
              >
                <option value="">-- Vincular evidencia existente del Repositorio Central --</option>
                {evidences
                  .filter(e => !standard.evidenceIds.includes(e.id))
                  .map(e => (
                    <option key={e.id} value={e.id}>
                      {e.title} ({e.fileName})
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={handleAttachExisting}
                disabled={!selectedExistingEvidence}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
              >
                Vincular
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400">
            Aplica en: {standard.applicableIn7 ? '7 estándares' : standard.applicableIn21 ? '21 estándares' : '60 estándares'}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition-all"
            >
              Guardar Calificación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
