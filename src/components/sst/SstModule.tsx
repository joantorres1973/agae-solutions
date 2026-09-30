'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  HardHat,
  ShieldCheck,
  AlertTriangle,
  ClipboardList,
  Users,
  HeartPulse,
  Plus,
  CheckCircle2,
  FileText,
  Flame,
  ArrowRight
} from 'lucide-react';
import { SstHazardItem } from '@/types';

export const SstModule: React.FC = () => {
  const { organization, sstHazards, addSstHazard, addFinding, assets, showNotification } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'STANDARDS' | 'MATRIX' | 'INSPECTIONS' | 'COMMITTEES'>('STANDARDS');

  // Inspection form state
  const [inspectAssetId, setInspectAssetId] = useState(assets[0]?.id || '');
  const [inspectCondition, setInspectCondition] = useState('');
  const [inspectSeverity, setInspectSeverity] = useState<'CRITICA' | 'MAYOR' | 'MENOR'>('MAYOR');
  const [inspectLegal, setInspectLegal] = useState('Resolución 2400/79 & Dec 1072/15');

  // New Hazard Form state
  const [showHazardModal, setShowHazardModal] = useState(false);
  const [hProcess, setHProcess] = useState('Operaciones Logísticas');
  const [hActivity, setHActivity] = useState('');
  const [hClass, setHClass] = useState<SstHazardItem['hazardClass']>('CONDICIONES_SEGURIDAD');
  const [hDesc, setHDesc] = useState('');
  const [hEffects, setHEffects] = useState('');
  const [hDef, setHDef] = useState(6);
  const [hExp, setHExp] = useState(3);
  const [hSev, setHSev] = useState(25);
  const [hEng, setHEng] = useState('');
  const [hAdm, setHAdm] = useState('');
  const [hEpp, setHEpp] = useState('');

  const handleCreateInspectionFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectCondition) return;

    const targetAsset = assets.find(a => a.id === inspectAssetId);

    addFinding({
      title: `Desviación en Inspección: ${targetAsset?.name || 'Área Operativa'}`,
      originModule: 'SST',
      originType: 'INSPECTION',
      originDetail: `Ronda de Inspección SST de Seguridad - Sede ${organization.sites[0]?.name}`,
      sharedAssetId: targetAsset?.id,
      sharedAssetName: targetAsset?.name,
      siteName: targetAsset?.siteName || organization.sites[0]?.name || 'Sede Principal',
      processName: targetAsset?.processName || 'Operaciones',
      description: inspectCondition,
      legalCriterion: inspectLegal,
      severity: inspectSeverity,
      status: 'EN_ACPM',
      reportedBy: 'Inspector SST en Campo'
    }, true);

    setInspectCondition('');
    showNotification('¡Inspección registrada! El hallazgo fue transferido automáticamente a la Matriz ACPM');
  };

  const handleAddHazard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hActivity || !hDesc) return;

    // Interpretación de riesgo GTC 45: NR = NP * NC = (ND * NE) * NC
    const np = hDef * hExp;
    const nr = np * hSev;
    let interp: 'I' | 'II' | 'III' | 'IV' = 'IV';
    let accept: 'NO_ACEPTABLE' | 'ACEPTABLE_CON_CONTROL' | 'ACEPTABLE' = 'ACEPTABLE';

    if (nr >= 600) {
      interp = 'I';
      accept = 'NO_ACEPTABLE';
    } else if (nr >= 150) {
      interp = 'II';
      accept = 'ACEPTABLE_CON_CONTROL';
    } else if (nr >= 40) {
      interp = 'III';
      accept = 'ACEPTABLE_CON_CONTROL';
    } else {
      interp = 'IV';
      accept = 'ACEPTABLE';
    }

    addSstHazard({
      process: hProcess,
      activity: hActivity,
      isRoutine: true,
      hazardClass: hClass,
      hazardDescription: hDesc,
      possibleEffects: hEffects || 'Lesiones osteomusculares o traumatismos',
      deficiencyLevel: hDef,
      exposureLevel: hExp,
      severityLevel: hSev,
      riskLevelInterpretation: interp,
      acceptability: accept,
      controls: {
        engineering: hEng,
        administrative: hAdm,
        epp: hEpp
      }
    });

    setShowHazardModal(false);
    setHActivity('');
    setHDesc('');
    setHEffects('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Module Title Banner */}
      <div className="glass-card p-4 rounded-xl border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <HardHat className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">
              Sistema de Gestión SST — Colombia
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestión integral de Seguridad y Salud en el Trabajo bajo <strong>Decreto 1072 de 2015</strong> y <strong>Resolución 0312 de 2019</strong> ({organization.sstStandardCount} Estándares Mínimos).
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-900/90 p-0.5 border border-slate-700 shrink-0">
          <button
            onClick={() => setActiveSubTab('STANDARDS')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'STANDARDS' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Estándares Mínimos
          </button>
          <button
            onClick={() => setActiveSubTab('MATRIX')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'MATRIX' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Matriz Peligros GTC 45 ({sstHazards.length})
          </button>
          <button
            onClick={() => setActiveSubTab('INSPECTIONS')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'INSPECTIONS' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Inspecciones Operacionales
          </button>
          <button
            onClick={() => setActiveSubTab('COMMITTEES')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'COMMITTEES' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            COPASST & Convivencia
          </button>
        </div>
      </div>

      {/* Subtab 1: Estándares Mínimos Res. 0312 */}
      {activeSubTab === 'STANDARDS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border border-slate-700/80">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                Clasificación de Empresa
              </span>
              <div className="text-sm font-bold text-white mt-1">
                {organization.sstStandardCount} Estándares Mínimos Aplicables
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Autocalculado por: <strong>{organization.employeeCount} trabajadores</strong> y <strong>Riesgo ARL Nivel {organization.riskLevelArl}</strong>.
              </p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-700/80">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Cumplimiento de Estándares
              </span>
              <div className="text-2xl font-black text-white mt-1">88.5%</div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div className="bg-emerald-500 h-1.5 rounded-full w-[88.5%]" />
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-700/80">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                Plan Anual de Trabajo 2026
              </span>
              <div className="text-sm font-bold text-white mt-1">42 / 48 Actividades en Cronograma</div>
              <span className="text-[11px] text-cyan-300 font-medium block mt-1">
                Próxima revisión por la alta dirección: Mayo 2026
              </span>
            </div>
          </div>

          <div className="glass-card rounded-xl border border-slate-700/80 p-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Ciclo PHVA de Estándares Mínimos (Resolución 0312 de 2019)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-1">I. PLANEAR (Recursos y Gestión)</span>
                <p className="text-slate-300 text-[11px]">Responsable SST asignado, afiliación a seguridad social, COPASST capacitado y Plan Anual aprobado con presupuesto asignado.</p>
                <span className="text-[10px] text-emerald-400 font-bold block mt-2">100% Conforme</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-orange-400 block mb-1">II. HACER (Gestión de la Salud y Peligros)</span>
                <p className="text-slate-300 text-[11px]">Evaluaciones médicas ocupacionales, custodia de historias clínicas, matriz de peligros GTC 45 y entrega de EPP con ficha técnica.</p>
                <span className="text-[10px] text-emerald-400 font-bold block mt-2">85.0% Conforme</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-purple-400 block mb-1">III. VERIFICAR (Seguimiento e Indicadores)</span>
                <p className="text-slate-300 text-[11px]">Auditoría anual integral, indicadores de estructura, proceso y resultado (Dec 1072) y revisión gerencial anual.</p>
                <span className="text-[10px] text-emerald-400 font-bold block mt-2">90.0% Conforme</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-rose-400 block mb-1">IV. ACTUAR (Mejora Continua & ACPM)</span>
                <p className="text-slate-300 text-[11px]">Acciones preventivas y correctivas basadas en resultados de auditorías, inspecciones e investigaciones de accidentes.</p>
                <span className="text-[10px] text-emerald-400 font-bold block mt-2">100% Conectado a ACPM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Matriz GTC 45 */}
      {activeSubTab === 'MATRIX' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">
                Identificación de Peligros, Evaluación y Valoración de Riesgos (GTC 45)
              </h2>
              <p className="text-xs text-slate-400">
                Jerarquía de controles: Eliminación, Sustitución, Ingeniería, Administrativos y EPP.
              </p>
            </div>
            <button
              onClick={() => setShowHazardModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              + Identificar Nuevo Peligro
            </button>
          </div>

          <div className="space-y-3">
            {sstHazards.map((haz) => (
              <div key={haz.id} className="glass-card rounded-xl p-4 border border-slate-700/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-800">
                      {haz.hazardClass}
                    </span>
                    <span className="text-xs font-bold text-white">{haz.process} — {haz.activity}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                      haz.riskLevelInterpretation === 'I' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      haz.riskLevelInterpretation === 'II' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      Nivel de Riesgo {haz.riskLevelInterpretation} ({haz.acceptability})
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-semibold">Descripción del Peligro y Efectos:</span>
                    <p className="mt-0.5 font-medium">{haz.hazardDescription}</p>
                    <span className="text-[10px] text-amber-400 block mt-1">Efecto: {haz.possibleEffects}</span>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-semibold">Controles Existentes e Implementados:</span>
                    <div className="space-y-0.5 mt-0.5 text-[11px]">
                      {haz.controls.elimination && <div>• <strong className="text-rose-400">Eliminación:</strong> {haz.controls.elimination}</div>}
                      {haz.controls.engineering && <div>• <strong className="text-cyan-400">Ingeniería:</strong> {haz.controls.engineering}</div>}
                      {haz.controls.administrative && <div>• <strong className="text-amber-400">Administrativo:</strong> {haz.controls.administrative}</div>}
                      {haz.controls.epp && <div>• <strong className="text-emerald-400">EPP:</strong> {haz.controls.epp}</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Inspecciones de Seguridad con flujo directo a Hallazgos/ACPM */}
      {activeSubTab === 'INSPECTIONS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 glass-card rounded-xl p-5 border border-slate-700/80">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <ClipboardList className="w-4 h-4 text-orange-400" />
              Ejecutar Inspección Operacional en Campo
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Principio: Cualquier desviación identificada en una inspección <strong>NO requiere volver a digitarse</strong>. Se envía directamente al Motor Central de Hallazgos y a la Matriz ACPM.
            </p>

            <form onSubmit={handleCreateInspectionFinding} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Activo Inspeccionado (Compartido)</label>
                <select
                  value={inspectAssetId}
                  onChange={(e) => setInspectAssetId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.code} — {a.name} ({a.siteName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Condición Subestándar o Desviación Detectada</label>
                <textarea
                  rows={3}
                  required
                  value={inspectCondition}
                  onChange={(e) => setInspectCondition(e.target.value)}
                  placeholder="Ej: Extintor con manómetro en zona de recarga, pasador forzado o sin tarjeta de inspección..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Severidad del Hallazgo</label>
                  <select
                    value={inspectSeverity}
                    onChange={(e) => setInspectSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="CRITICA">Crítica (Riesgo Inminente)</option>
                    <option value="MAYOR">Mayor</option>
                    <option value="MENOR">Menor</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Criterio / Norma</label>
                  <input
                    type="text"
                    value={inspectLegal}
                    onChange={(e) => setInspectLegal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Registrar Inspección & Enviar a ACPM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 glass-card rounded-xl p-5 border border-slate-700/80">
            <h2 className="text-sm font-bold text-white mb-2">
              Activos Registrados Disponibles para Inspección
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              Un extintor o camión registrado aquí se reutiliza en emergencias, inspecciones preoperacionales y mantenimientos preventivos.
            </p>

            <div className="space-y-2.5">
              {assets.map(asset => (
                <div key={asset.id} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400">{asset.code}</span>
                      <span className="font-semibold text-white">{asset.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {asset.locationDetails} • {asset.siteName}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                      {asset.status}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1">
                      Prox. Insp: {asset.nextInspectionDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Comités */}
      {activeSubTab === 'COMMITTEES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card rounded-xl p-5 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                COPASST (Comité Paritario de SST)
              </h2>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded font-semibold border border-emerald-800">
                Periodo 2025 - 2027
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Conformado por 4 representantes de la administración y 4 de los trabajadores con sus respectivos suplentes según la Resolución 2013 de 1986.
            </p>
            <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-300"><strong>Presidente:</strong> Carlos Mendoza (Principal Empresa)</div>
              <div className="text-slate-300"><strong>Secretaria:</strong> Marcela Rincón (Principal Trabajadores)</div>
              <div className="text-cyan-400 font-medium pt-1">Última reunión ordinaria: 18 de Marzo de 2026 (Acta No. 03)</div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                Comité de Convivencia Laboral
              </h2>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded font-semibold border border-emerald-800">
                Vigente (Res. 652/2012)
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Órgano de prevención del acoso laboral y promoción de un clima laboral armónico.
            </p>
            <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-300"><strong>Casos recibidos 2026:</strong> 0 quejas activas</div>
              <div className="text-slate-300"><strong>Capacitaciones ejecutadas:</strong> 2 talleres sobre comunicación asertiva</div>
              <div className="text-emerald-400 font-medium pt-1">Próxima sesión trimestral: Junio 2026</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Hazard */}
      {showHazardModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddHazard} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white">Identificar Nuevo Peligro (GTC 45)</h2>
              <button type="button" onClick={() => setShowHazardModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Proceso</label>
                  <input
                    type="text"
                    required
                    value={hProcess}
                    onChange={(e) => setHProcess(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Clasificación del Peligro</label>
                  <select
                    value={hClass}
                    onChange={(e) => setHClass(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="BIOMECANICO">Biomecánico</option>
                    <option value="CONDICIONES_SEGURIDAD">Condiciones de Seguridad</option>
                    <option value="FISICO">Físico (Ruido, Iluminación)</option>
                    <option value="QUIMICO">Químico</option>
                    <option value="PSICOSOCIAL">Psicosocial</option>
                    <option value="BIOLOGICO">Biológico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Actividad Específica</label>
                <input
                  type="text"
                  required
                  value={hActivity}
                  onChange={(e) => setHActivity(e.target.value)}
                  placeholder="Ej: Mantenimiento correctivo de motores diesel..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Descripción del Peligro y Fuente</label>
                <textarea
                  rows={2}
                  required
                  value={hDesc}
                  onChange={(e) => setHDesc(e.target.value)}
                  placeholder="Ej: Inhalación de vapores orgánicos y riesgo de quemadura por superficies calientes..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Deficiencia (ND)</label>
                  <select
                    value={hDef}
                    onChange={(e) => setHDef(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={2}>2 (Medio)</option>
                    <option value={6}>6 (Alto)</option>
                    <option value={10}>10 (Muy Alto)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Exposición (NE)</label>
                  <select
                    value={hExp}
                    onChange={(e) => setHExp(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={1}>1 (Esporádica)</option>
                    <option value={2}>2 (Ocasional)</option>
                    <option value={3}>3 (Frecuente)</option>
                    <option value={4}>4 (Continua)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Consecuencia (NC)</label>
                  <select
                    value={hSev}
                    onChange={(e) => setHSev(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value={10}>10 (Leve)</option>
                    <option value={25}>25 (Grave)</option>
                    <option value={60}>60 (Muy Grave)</option>
                    <option value={100}>100 (Mortal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Control de Ingeniería Propuesto</label>
                <input
                  type="text"
                  value={hEng}
                  onChange={(e) => setHEng(e.target.value)}
                  placeholder="Ej: Extractor focalizado de gases..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowHazardModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold"
              >
                Guardar en Matriz GTC 45
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
