'use client';

import React, { useState, useRef } from 'react';
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
  X,
  FileCheck,
  Calendar,
  Users,
  Award,
  HeartHandshake,
  FolderLock,
  GraduationCap,
  Target,
  ClipboardCheck,
  FolderArchive
} from 'lucide-react';
import { SstStandardDefinition, SstStandardStatus } from '@/types/sst';
import { PilaSocialSecurityModal } from './PilaSocialSecurityModal';

interface SstStandardDetailModalProps {
  standard: SstStandardDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenResponsibleModal?: () => void;
  onOpenBudgetModal?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenCopasst?: (tab?: 'CONFORMATION' | 'TRAININGS') => void;
  onOpenCcl?: (tab?: string) => void;
  onOpenTraining?: () => void;
  onOpenPolicy?: (tab?: 'POLICY' | 'OBJECTIVES') => void;
  onOpenEvaluation?: (tab?: 'CHECKLIST' | 'DASHBOARD' | 'ACTIONS' | 'VALIDATION' | 'REPORT') => void;
  onOpenDocumentation?: (tab?: 'REPOSITORY' | 'PROCEDURE' | 'CODING' | 'RETENTION') => void;
}

export const SstStandardDetailModal: React.FC<SstStandardDetailModalProps> = ({
  standard,
  isOpen,
  onClose,
  onOpenResponsibleModal,
  onOpenBudgetModal,
  onNavigateToTab,
  onOpenCopasst,
  onOpenCcl,
  onOpenTraining,
  onOpenPolicy,
  onOpenEvaluation,
  onOpenDocumentation
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
  const [isPilaModalOpen, setIsPilaModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !standard) return null;

  const isPilaStandard = standard.code === '1.1.4' || standard.code === '1.1.5';
  const isCopasstStandard = standard.code === '1.1.6' || standard.code === '1.1.7';
  const isCclStandard = standard.code === '1.1.8';
  const isTrainingStandard = standard.code === '1.2.1' || standard.code === '1.2.2';
  const isCourse50Standard = standard.code === '1.2.3';
  const isPolicyStandard = standard.code === '2.1.1';
  const isObjectivesStandard = standard.code === '2.1.2';
  const isEvaluationStandard = standard.code === '2.1.3' || standard.actionType === 'INITIAL_EVALUATION';
  const isDocumentationStandard = standard.code === '2.2.1' || standard.actionType === 'DOCUMENTATION';

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

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRealFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKb} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const newEvidence = addEvidence({
        title: `Soporte Digital para ${standard.code} - ${standard.title}`,
        fileType: 'DOCUMENT',
        fileName: file.name,
        fileSize: sizeStr,
        uploadedBy: 'Responsable SG-SST',
        url: base64 || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80',
        tags: ['SST', `ESTANDAR_${standard.code}`, 'DEC_1072', 'SOPORTE_REAL']
      });

      attachEvidenceToStandard(standard.id, newEvidence.id);
      showNotification(`Soporte "${file.name}" cargado y vinculado exitosamente al Estándar ${standard.code}`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const attachedEvidences = evidences.filter(e => standard.evidenceIds.includes(e.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-50 border border-slate-300 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white/80 shrink-0">
          <div className="flex items-center gap-3">
            <span className={`w-10 h-10 rounded-xl font-bold font-mono text-sm flex items-center justify-center border ${
              standard.cycle === 'PLANEAR' ? 'bg-teal-50 text-teal-700 border-teal-200' :
              standard.cycle === 'HACER' ? 'bg-orange-50 text-orange-700 border-orange-200' :
              standard.cycle === 'VERIFICAR' ? 'bg-purple-50 text-purple-700 border-purple-200' :
              'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {standard.code}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {standard.cycle} • {standard.numeralGroup}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-100 text-slate-700">
                  Ponderación: {standard.weight}%
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                {standard.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* Decreto 1072 de 2015 Articulado cotejado */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Cotejo con el Decreto 1072 de 2015 (Libro 2, Parte 2, Título 4, Capítulo 6)
              </span>
              <span className="font-mono text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {standard.decreto1072Article}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 text-xs">{standard.decreto1072Title}</h3>
            <p className="text-slate-700 text-[11px] leading-relaxed italic bg-slate-50 p-2.5 rounded border border-slate-200">
              "{standard.decreto1072Excerpt}"
            </p>
          </div>

          {/* Criterio y Modo de Verificación Resolución 0312 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="glass-card p-3.5 rounded-xl border border-slate-300 space-y-1">
              <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block">
                Criterio Resolución 0312 de 2019
              </span>
              <p className="text-slate-800 text-xs leading-relaxed">{standard.criterion}</p>
            </div>

            <div className="glass-card p-3.5 rounded-xl border border-slate-300 space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Modo de Verificación del Auditor / MinTrabajo
              </span>
              <p className="text-slate-700 text-xs leading-relaxed">{standard.modeOfVerification}</p>
            </div>
          </div>

          {/* Quick Action Trigger if standard has specialized tool */}
          {(standard.actionType || isPilaStandard || isCopasstStandard || isCclStandard || isTrainingStandard || isCourse50Standard || isPolicyStandard || isObjectivesStandard || isEvaluationStandard || isDocumentationStandard) && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-50 via-white to-slate-50 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900 block">Herramienta Integrada Disponible</span>
                <span className="text-[11px] text-slate-600">
                  {isPilaStandard ? 'Gestione la carga de planillas PILA con fecha de pago, PIN y filtros por trabajador.' :
                   isCopasstStandard ? 'Gestione el flujo integral del COPASST o Vigía: elecciones, actas, compromisos y ACPM.' :
                   isCclStandard ? 'Gestione casos confidenciales, actas, compromisos y mediación conforme a la Res. 3461 de 2025.' :
                   isTrainingStandard ? 'Gestione el Programa Anual de Capacitación (Excel + Calendario), Inducciones y Aula Virtual AGAE.' :
                   isCourse50Standard ? 'El curso virtual de 50h/20h se gestiona y certifica de manera articulada en el expediente del Responsable (1.1.1).' :
                   isPolicyStandard ? 'Gestione la formulación de la política, compromisos mínimos Dec. 1072, revisión anual y firma digital del Representante Legal.' :
                   isObjectivesStandard ? 'Gestione los objetivos del SG-SST, metas, indicadores asociados, seguimiento periódico y derivación directa a matriz ACPM.' :
                   isEvaluationStandard ? 'Diagnóstico integral según los 10 componentes del Art. 2.2.4.6.16 del Decreto 1072 de 2015, trazabilidad con módulos, brechas e informe PDF.' :
                   isDocumentationStandard ? 'Gestione el Procedimiento de Control Documental editable (PR-SGSST-GEN-001), la codificación por serie, el repositorio centralizado transversal y la matriz de retención legal de 20 años (Art. 2.2.4.6.13).' :
                   standard.actionType === 'RESPONSIBLE' ? 'Gestione la hoja de vida, licencia y la Carta de Asignación formal generada en vivo.' :
                   standard.actionType === 'BUDGET' ? 'Configure el presupuesto integrado SST + Vial PESV con aprobación de gerencia.' :
                   standard.actionType === 'HAZARDS' ? 'Identifique peligros y valore riesgos según la matriz GTC 45.' :
                   standard.actionType === 'INSPECTION' ? 'Ejecute inspecciones de campo con conexión automática a ACPM.' :
                   'Gestione acciones correctivas en la matriz central ACPM.'}
                </span>
              </div>

              {isPilaStandard && (
                <button
                  type="button"
                  onClick={() => setIsPilaModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shrink-0"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Planillas PILA & Filtros</span>
                </button>
              )}

              {isTrainingStandard && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenTraining) {
                      onOpenTraining();
                    } else if (onNavigateToTab) {
                      onNavigateToTab('sst');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Ir a Capacitación & Aula Virtual (1.2)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {isCopasstStandard && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenCopasst) {
                      onOpenCopasst(standard.code === '1.1.7' ? 'TRAININGS' : 'CONFORMATION');
                    } else if (onNavigateToTab) {
                      onNavigateToTab('sst');
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-bold transition-all shrink-0 ${
                    standard.code === '1.1.7'
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-teal-600 hover:bg-teal-500'
                  }`}
                >
                  {standard.code === '1.1.7' ? (
                    <>
                      <Award className="w-3.5 h-3.5" />
                      <span>Ir a Capacitaciones COPASST (1.1.7)</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-3.5 h-3.5" />
                      <span>Ir a Gestión COPASST (1.1.6)</span>
                    </>
                  )}
                </button>
              )}

              {isCclStandard && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenCcl) {
                      onOpenCcl('DASHBOARD');
                    } else if (onNavigateToTab) {
                      onNavigateToTab('sst');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shrink-0"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Gestión CCL (Res. 3461 de 2025)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

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

              {isCourse50Standard && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenResponsibleModal) onOpenResponsibleModal();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Gestionar en Responsable (1.1.1)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {isPolicyStandard && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenPolicy) onOpenPolicy('POLICY');
                    else if (onNavigateToTab) onNavigateToTab('sst');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ir a Política SST (2.1.1)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {isObjectivesStandard && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenPolicy) onOpenPolicy('OBJECTIVES');
                    else if (onNavigateToTab) onNavigateToTab('sst');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Ir a Objetivos SG-SST (2.1.2)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {isEvaluationStandard && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenEvaluation) onOpenEvaluation('CHECKLIST');
                    else if (onNavigateToTab) onNavigateToTab('sst');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>Ir a Evaluación Inicial (Dec. 1072)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {isDocumentationStandard && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenDocumentation) onOpenDocumentation('REPOSITORY');
                    else if (onNavigateToTab) onNavigateToTab('sst');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
                >
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>Ir a Archivo & Retención (2.2.1)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Compliance Status and Auditor Notes */}
          <div className="glass-card p-4 rounded-xl border border-slate-300 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Calificación del Estándar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Estado de Cumplimiento</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SstStandardStatus)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 font-semibold focus:outline-none focus:border-teal-500"
                >
                  <option value="CUMPLE">✓ CUMPLE TOTALMENTE (Puntaje Completo)</option>
                  <option value="EN_PROCESO">⏳ EN PROCESO DE IMPLEMENTACIÓN (50%)</option>
                  <option value="NO_CUMPLE">✕ NO CUMPLE (0%)</option>
                  <option value="NO_APLICA_JUSTIFICADO">⊘ NO APLICA JUSTIFICADO (Puntaje Completo)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notas del Auditor / Justificación Legal</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Justificación del cumplimiento o motivo de no aplicación..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Attached Evidences Section */}
          <div className="glass-card p-4 rounded-xl border border-slate-300 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5 text-blue-700" />
                Evidencias Digitales Vinculadas ({attachedEvidences.length})
              </h3>
              
              {/* Input oculto para carga real de archivos */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleRealFileUpload}
                accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
              />

              <button
                type="button"
                onClick={handleTriggerUpload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>+ Cargar Soporte Digital Real</span>
              </button>
            </div>

            {/* Banner especializado para Estándar 1.1.4 y 1.1.5 */}
            {isPilaStandard && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Gestión Especializada de Planillas PILA & Filtros por Trabajador</span>
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    Registre la fecha exacta del pago, PIN de liquidación, monto de aportes y filtre las coberturas por trabajador individual.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPilaModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Abrir Gestor PILA & Fechas</span>
                </button>
              </div>
            )}

            {/* Banner especializado para Estándar 1.1.8 CCL (Resolución 3461 de 2025) */}
            {isCclStandard && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-teal-900 text-xs flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-teal-600" />
                    <span>Comité de Convivencia Laboral - Sistema Activo de Casos (Res. 3461 de 2025)</span>
                  </div>
                  <div className="text-[11px] text-teal-800">
                    Gestione la conformación paritaria, cartas de confidencialidad, votación secreta, matriz de quejas con control de plazos y actas oficiales.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenCcl) {
                      onOpenCcl('DASHBOARD');
                    } else if (onNavigateToTab) {
                      onNavigateToTab('sst');
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <FolderLock className="w-3.5 h-3.5" />
                  <span>Abrir Módulo CCL</span>
                </button>
              </div>
            )}

            {attachedEvidences.length > 0 ? (
              <div className="space-y-2">
                {attachedEvidences.map(ev => (
                  <div key={ev.id} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-700 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">{ev.title}</div>
                        <div className="text-[10px] text-slate-600">
                          {ev.fileName} • {ev.fileSize} • Subido por {ev.uploadedBy}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      En Custodia
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-white/80 border border-dashed border-slate-200 text-center text-slate-600 text-xs">
                No hay archivos adjuntos directamente a este estándar. Puede cargar un archivo real o vincular una evidencia existente.
              </div>
            )}

            {/* Link existing evidence dropdown */}
            <div className="flex items-center gap-2 pt-1">
              <select
                value={selectedExistingEvidence}
                onChange={(e) => setSelectedExistingEvidence(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
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
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold disabled:opacity-50 transition-colors"
              >
                Vincular
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-white/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-600">
            Aplica en: {standard.applicableIn7 ? '7 estándares' : standard.applicableIn21 ? '21 estándares' : '60 estándares'}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition-all"
            >
              Guardar Calificación
            </button>
          </div>
        </div>

        {/* Modal de Seguridad Social PILA */}
        {isPilaStandard && (
          <PilaSocialSecurityModal
            isOpen={isPilaModalOpen}
            onClose={() => setIsPilaModalOpen(false)}
            defaultPayrollType={standard.code === '1.1.5' ? 'ALTO_RIESGO' : 'GENERAL'}
          />
        )}
      </div>
    </div>
  );
};
