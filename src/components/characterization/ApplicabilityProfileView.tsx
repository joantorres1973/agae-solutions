'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Building2,
  Cpu,
  FileCheck2,
  History,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  XCircle,
  FileText,
  Sliders,
  Sparkles,
  Download,
  Calendar,
  User,
  ShieldCheck,
  MapPin,
  Car,
  HardHat,
  Leaf,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { ApplicabilityStatus, ValidationDecision } from '@/types/characterization';
import { CommercialProposalModal } from './CommercialProposalModal';
import { SmartCharacterizationWizard } from './SmartCharacterizationWizard';
import { sectorLabel } from '@/lib/ciiu';

export const ApplicabilityProfileView: React.FC = () => {
  const {
    organization,
    characterization,
    applicabilityProfile,
    validationDecisions,
    characterizationHistory,
    addValidationDecision,
    setActiveWizardStep
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'decisions' | 'history'>('matrix');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ApplicabilityStatus>('ALL');
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Modal / Form state for user overriding or recording a validation decision
  const [selectedReqForDecision, setSelectedReqForDecision] = useState<string | null>(null);
  const [decisionDecision, setDecisionDecision] = useState<'ACEPTADO' | 'MODIFICADO' | 'NO_APLICA' | 'REQUIERE_REVISION'>('NO_APLICA');
  const [decisionJustification, setDecisionJustification] = useState('');
  const [decisionEvidence, setDecisionEvidence] = useState('');
  const [decisionUserName, setDecisionUserName] = useState('Marcela Rincón');
  const [decisionUserRole, setDecisionUserRole] = useState('Directora HSEQ');

  const { allRequirements, proposal, evaluations } = applicabilityProfile;

  const filteredRequirements = allRequirements.filter(req => {
    if (statusFilter === 'ALL') return true;
    return req.status === statusFilter;
  });

  const targetReq = allRequirements.find(r => r.id === selectedReqForDecision);

  const handleSaveDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetReq) return;

    addValidationDecision({
      requirementId: targetReq.id,
      requirementCode: targetReq.code,
      requirementTitle: targetReq.name,
      initialAgaeResult: targetReq.status,
      finalDecision: decisionDecision,
      justification: decisionJustification || 'Sin justificación detallada.',
      variablesSnapshot: targetReq.triggeringVariables,
      userName: decisionUserName,
      userRole: decisionUserRole,
      evidenceNotes: decisionEvidence
    });

    setSelectedReqForDecision(null);
    setDecisionJustification('');
    setDecisionEvidence('');
  };

  const openWizardForRecaracterization = () => {
    setActiveWizardStep(1);
    setIsWizardOpen(true);
  };

  if (isWizardOpen) {
    return (
      <SmartCharacterizationWizard
        onClose={() => setIsWizardOpen(false)}
        onFinish={() => setIsWizardOpen(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Perfil de la Organización y Perfil de Aplicabilidad */}
      <div className="glass-card rounded-2xl p-5 border border-teal-200 bg-gradient-to-r from-white via-white to-teal-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-teal-100 text-teal-700 border border-teal-200">
                Perfil de Aplicabilidad & Caracterización
              </span>
              <span className="text-xs text-slate-500">
                Versión {characterization.version} • {characterization.lastUpdatedAt}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {characterization.identification.razonSocial}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              NIT {characterization.identification.nit} • CIIU {characterization.identification.codigoCiiu} • Sector {sectorLabel(characterization.identification.sectorEconomico, characterization.identification.sectorOtro)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsProposalModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 border border-slate-300 shadow transition-all"
            >
              <FileText className="w-4 h-4 text-teal-700" />
              <span>Ver Propuesta Comercial</span>
            </button>

            <button
              onClick={openWizardForRecaracterization}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-600/25 transition-all"
            >
              <Sliders className="w-4 h-4" />
              <span>Actualizar Caracterización</span>
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-200 text-xs">
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-[10px] text-orange-700 font-bold uppercase block">
              SG-SST Aplicable
            </span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">
              {characterization.calculatedSstStandards} Estándares Mínimos
            </span>
            <span className="text-[10px] text-slate-500">
              Riesgo ARL {characterization.sst.claseRiesgoArl} • Res. 0312/19
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-[10px] text-sky-700 font-bold uppercase block">
              PESV Aplicable
            </span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">
              {characterization.calculatedPesvLevel === 'NO_APLICA' ? 'NO APLICA' : `Nivel ${characterization.calculatedPesvLevel}`}
            </span>
            <span className="text-[10px] text-slate-500">
              {characterization.pesv.utilizaVehiculosParaActividades 
                ? `${characterization.pesv.detallesPesv?.numeroVehiculosTotal || 0} Vehículos • Res. 40595`
                : 'Sin operación vehicular'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-[10px] text-emerald-700 font-bold uppercase block">
              Gestión Ambiental
            </span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">
              {characterization.environmental.generaResiduosPeligrosos ? 'RESPEL + PGIRS' : 'PGIRS Ordinarios'}
            </span>
            <span className="text-[10px] text-slate-500">
              {characterization.environmental.generaResiduosPeligrosos 
                ? `${characterization.environmental.detallesRespel?.volumenKgMes || 0} kg/mes • Dec. 1076`
                : 'Sin residuos peligrosos'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-[10px] text-indigo-700 font-bold uppercase block">
              Sedes Operativas
            </span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">
              {characterization.sites.length} Sede(s) Activas
            </span>
            <span className="text-[10px] text-slate-500">
              {characterization.size.totalTrabajadores} Trabajadores Globales
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'matrix'
                ? 'bg-teal-100 text-teal-700 border border-teal-200 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-4 h-4 text-teal-700" />
            <span>Matriz de Aplicabilidad Normativa ({allRequirements.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('decisions')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'decisions'
                ? 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-amber-700" />
            <span>Bitácora de Decisiones & No Aplicabilidad ({validationDecisions.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'history'
                ? 'bg-purple-100 text-purple-700 border border-purple-200 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4 text-purple-700" />
            <span>Historial de Versiones ({characterizationHistory.length})</span>
          </button>
        </div>
      </div>

      {/* ==============================================================
          TAB 1: MATRIZ DE APLICABILIDAD NORMATIVA
      ============================================================== */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-4">
          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Filtrar por Estado:</span>
            {[
              { id: 'ALL', label: 'Todos los Requisitos' },
              { id: 'APLICA', label: 'Aplica' },
              { id: 'NO_APLICA', label: 'No Aplica' },
              { id: 'REQUIERE_VALIDACION', label: 'Requiere Validación' },
              { id: 'INFORMACION_INSUFICIENTE', label: 'Información Insuficiente' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  statusFilter === f.id
                    ? 'bg-teal-600 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Requirements List */}
          <div className="space-y-3">
            {filteredRequirements.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all text-xs space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {req.code}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs">{req.name}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                      {req.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      req.status === 'APLICA'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : req.status === 'NO_APLICA'
                        ? 'bg-slate-100 text-slate-500 border border-slate-300'
                        : req.status === 'REQUIERE_VALIDACION'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {req.status}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedReqForDecision(req.id);
                        setDecisionDecision(req.status === 'NO_APLICA' ? 'NO_APLICA' : 'MODIFICADO');
                        setDecisionJustification('');
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-semibold border border-slate-300 transition-colors"
                    >
                      Validar / Modificar
                    </button>
                  </div>
                </div>

                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {req.reason}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                  <div>
                    <span className="text-slate-500">Fundamento Legal: </span>
                    <strong className="text-slate-700 font-normal">{req.legalCitation}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Acción Requerida: </span>
                    <strong className="text-teal-700 font-normal">{req.actionRequired}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 2: BITÁCORA DE DECISIONES & REGISTRO DE NO APLICABILIDAD
      ============================================================== */}
      {activeSubTab === 'decisions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Principio de Trazabilidad: Conservación de Justificaciones de No Aplicabilidad
            </h3>
            <p className="text-[11px] text-slate-500">
              Cuando un componente o requisito es calificado como <strong>NO APLICA</strong>, la plataforma nunca lo borra. Conserva el motivo técnico, las variables que originaron la decisión, el usuario responsable, la fecha y la evidencia adjunta.
            </p>
          </div>

          <div className="space-y-3">
            {validationDecisions.map(dec => (
              <div
                key={dec.id}
                className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {dec.requirementCode}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{dec.requirementTitle}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    dec.finalDecision === 'ACEPTADO'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : dec.finalDecision === 'NO_APLICA'
                      ? 'bg-slate-100 text-slate-700 border border-slate-300'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    Decisión: {dec.finalDecision}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Justificación Técnica / Legal Registrada:
                  </span>
                  <p className="text-slate-800 leading-relaxed">{dec.justification}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-slate-500 pt-1">
                  <div>
                    <span className="text-slate-500">Resultado AGAE Inicial: </span>
                    <strong className="text-slate-700 font-normal">{dec.initialAgaeResult}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Usuario Responsable: </span>
                    <strong className="text-slate-700 font-normal">{dec.userName} ({dec.userRole})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Fecha y Hora: </span>
                    <strong className="text-slate-700 font-normal">{dec.timestamp}</strong>
                  </div>
                </div>

                {dec.evidenceNotes && (
                  <div className="text-[10px] text-slate-500 pt-1">
                    <span className="text-slate-500">Evidencia / Soporte Vinculado: </span>
                    <span className="text-teal-700">{dec.evidenceNotes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 3: HISTORIAL DE VERSIONES & RE-CARACTERIZACIÓN
      ============================================================== */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <History className="w-4 h-4 text-purple-700" />
              Control de Versiones de Caracterización (Evolución de la Organización)
            </h3>
            <p className="text-[11px] text-slate-500">
              Si la empresa adquiere nuevos vehículos, contrata más personal o inicia trabajos en alturas, AGAE detecta los cambios, evalúa el impacto y registra la versión en la bitácora histórica.
            </p>
          </div>

          <div className="space-y-4">
            {characterizationHistory.map(ver => (
              <div
                key={ver.version}
                className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                      Versión {ver.version}.0
                    </span>
                    <span className="text-slate-900 font-bold text-xs">{ver.reason}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{ver.timestamp}</span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Modificaciones y Hallazgos Detectados:
                  </span>
                  <ul className="space-y-1">
                    {ver.changesSummary.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                  <span>Autor: <strong className="text-slate-700 font-normal">{ver.author}</strong></span>
                  <div className="flex items-center gap-1.5">
                    <span>Módulos Impactados:</span>
                    {ver.impactedModules.map(m => (
                      <span key={m} className="px-1.5 py-0.2 bg-slate-100 text-teal-700 rounded font-semibold text-[9px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decision Override Modal */}
      {selectedReqForDecision && targetReq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-50 border border-slate-300 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-xs">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Validar Requisito: {targetReq.code}</h3>
                <p className="text-[11px] text-slate-500">{targetReq.name}</p>
              </div>
              <button onClick={() => setSelectedReqForDecision(null)} className="text-slate-500 hover:text-slate-900">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDecision} className="space-y-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Decisión Formal</label>
                <select
                  value={decisionDecision}
                  onChange={(e) => setDecisionDecision(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800"
                >
                  <option value="ACEPTADO">Aceptar como Aplica</option>
                  <option value="MODIFICADO">Modificar alcance / Condición especial</option>
                  <option value="NO_APLICA">Marcar como NO APLICA (Con Justificación)</option>
                  <option value="REQUIERE_REVISION">Solicitar Revisión Técnica a AGAE</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Justificación Técnica / Legal *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalle los motivos por los cuales este requisito no aplica o tiene una consideración particular según las operaciones reales de la empresa."
                  value={decisionJustification}
                  onChange={(e) => setDecisionJustification(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Soporte o Evidencia Adjunta
                </label>
                <input
                  type="text"
                  placeholder="Ej: Informe de inspección locativa / Carta de exclusión CAR"
                  value={decisionEvidence}
                  onChange={(e) => setDecisionEvidence(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 block text-[10px]">Usuario Responsable</label>
                  <input
                    type="text"
                    value={decisionUserName}
                    onChange={(e) => setDecisionUserName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px]">Cargo</label>
                  <input
                    type="text"
                    value={decisionUserRole}
                    onChange={(e) => setDecisionUserRole(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedReqForDecision(null)}
                  className="px-3 py-1.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-teal-600 hover:bg-teal-500 text-white font-bold shadow"
                >
                  Guardar Decisión en Bitácora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Commercial Proposal Modal */}
      <CommercialProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        onProceedToSetup={() => {
          setIsProposalModalOpen(false);
          setActiveWizardStep(11);
          setIsWizardOpen(true);
        }}
      />
    </div>
  );
};
