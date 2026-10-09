'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  ShieldCheck,
  Building2,
  Users,
  MapPin,
  Flame,
  HardHat,
  Leaf,
  Car,
  Award,
  Cpu,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  HelpCircle,
  Zap,
  Info,
  Sliders,
  Sparkles,
  RefreshCw,
  Play,
  Eye,
  X,
  XCircle,
  CloudCheck,
  History
} from 'lucide-react';
import {
  CharacterizationSite,
  EconomicSector,
  HighRiskActivities,
  OrganizationType,
  SiteType
} from '@/types/characterization';
import { ModuleType } from '@/types';
import { characterizationArchetypes } from '@/lib/characterization-mock';
import { classifyCiiu, ECONOMIC_SECTORS, sectorLabel } from '@/lib/ciiu';
import { evaluarAltura, formatoAltura, parseAltura } from '@/lib/alturas';
import { chargeableModules, HUELLA_CARBONO_PRECIO_MES, huellaCarbonoEnPlan, MODULE_LABELS, planName } from '@/lib/plan-rules';
import { formatSavedAt, loadDraft } from '@/lib/characterization-draft';
import { ProfessionalDisclaimer } from '@/components/public/ProfessionalDisclaimer';
import { explainPesvLevel, explainSstStandards, PESV_STEPS, PESV_TIERS, withDerivedValues } from '@/lib/applicability-engine';

type AlturasDetails = NonNullable<HighRiskActivities['detallesAlturas']>;

const HUELLA_OPTIONS: { value: 'EXIGIDA' | 'VOLUNTARIA' | 'NO' | 'NO_SABE'; label: string; hint: string }[] = [
  { value: 'EXIGIDA', label: 'Sí, nos la exigen', hint: 'Clientes, licitaciones o casa matriz' },
  { value: 'VOLUNTARIA', label: 'Sí, por iniciativa propia', hint: 'Sostenibilidad o reputación' },
  { value: 'NO', label: 'No por ahora', hint: 'No la necesitamos' },
  { value: 'NO_SABE', label: 'No estoy seguro', hint: 'Lo validamos con un asesor' },
];

const PLAN_ITEMS: { key: string; label: string; modules: ModuleType[] }[] = [
  { key: 'SST', label: 'SG-SST (Dec. 1072 / Res. 0312)', modules: ['SST'] },
  { key: 'ENV', label: 'Gestión Ambiental', modules: ['ENVIRONMENTAL', 'ISO_14001'] },
  { key: 'HUELLA', label: 'Calculadora de huella de carbono + informe PDF', modules: [] },
  { key: 'PESV', label: 'Seguridad Vial (PESV)', modules: ['PESV'] },
  { key: 'ISO', label: 'Sistemas ISO', modules: ['ISO_9001', 'ISO_14001', 'ISO_45001'] },
];

const HOT_WORK_TYPES = [
  'Soldadura eléctrica',
  'Soldadura oxiacetilénica',
  'Oxicorte / corte con soplete',
  'Esmerilado y pulido',
  'Llama abierta / calentamiento',
  'Otro',
];

const SITE_TYPES: { value: SiteType; label: string }[] = [
  { value: 'PRINCIPAL', label: 'Sede Principal' },
  { value: 'OFICINA_ADMIN', label: 'Oficina Administrativa' },
  { value: 'PLANTA', label: 'Planta de Producción' },
  { value: 'BODEGA', label: 'Bodega / Almacén' },
  { value: 'HUB_LOGISTICO', label: 'Hub Logístico / Centro de Distribución' },
  { value: 'TALLER', label: 'Taller Mecánico / Patio' },
  { value: 'PUNTO_VENTA', label: 'Punto de Venta / Atención al Público' },
  { value: 'CAMPAMENTO', label: 'Campamento / Frente de Obra' },
];

const WORK_SHIFTS: { value: string; label: string; hint: string; askHours: boolean }[] = [
  { value: 'LV_DIURNA', label: 'Lunes a viernes', hint: 'Jornada diurna', askHours: true },
  { value: 'LS_DIURNA', label: 'Lunes a sábado', hint: 'Jornada diurna', askHours: true },
  { value: 'NOCTURNA', label: 'Jornada nocturna', hint: 'Trabajo de noche', askHours: true },
  { value: 'TURNOS', label: 'Turnos rotativos', hint: '2 o 3 turnos', askHours: false },
  { value: 'CONTINUA', label: 'Operación 24/7', hint: 'Continua, incluye domingos y festivos', askHours: false },
  { value: 'FINES_SEMANA', label: 'Fines de semana', hint: 'Sábados, domingos y festivos', askHours: true },
  { value: 'FLEXIBLE', label: 'Flexible / por proyecto', hint: 'Varía según la operación', askHours: false },
  { value: 'OTRO', label: 'Otro horario', hint: 'Lo describes tú', askHours: false },
];

interface NewSiteForm {
  nombre: string;
  tipoSede: SiteType;
  trabajadores: number;
  ciudad: string;
  departamento: string;
  direccion: string;
  jornada: string;
  horaInicio: string;
  horaFin: string;
  jornadaOtra: string;
  particularidades: string;
}

const EMPTY_SITE_FORM: NewSiteForm = {
  nombre: '', tipoSede: 'BODEGA', trabajadores: 0, ciudad: '', departamento: '', direccion: '',
  jornada: '', horaInicio: '', horaFin: '', jornadaOtra: '', particularidades: '',
};

const siteInputCls =
  'w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:border-emerald-400 focus:outline-none';

interface SmartCharacterizationWizardProps {
  onClose?: () => void;
  onFinish?: () => void;
}

export const SmartCharacterizationWizard: React.FC<SmartCharacterizationWizardProps> = ({
  onClose,
  onFinish
}) => {
  const {
    characterization,
    updateCharacterization,
    applicabilityProfile,
    applyCharacterizationToPlatform,
    loadCharacterizationArchetype,
    activeWizardStep,
    setActiveWizardStep,
    setPortalView,
    setIsCheckoutModalOpen,
    draftSavedAt,
    draftVersion,
    restoredDraftStep,
    saveWizardModules,
    resetCharacterizationDraft
  } = useApp();

  const [localChar, setLocalChar] = useState(characterization);
  const [selectedModulesToBuy, setSelectedModulesToBuy] = useState<ModuleType[]>(
    () => loadDraft()?.selectedModules ?? applicabilityProfile.proposal.selectedModules
  );
  const [confirmReset, setConfirmReset] = useState(false);
  const [dismissedRestore, setDismissedRestore] = useState(false);

  const [alturaTexto, setAlturaTexto] = useState(() => {
    const h = characterization.highRisk.detallesAlturas?.alturaMaximaMetros;
    return h ? String(h).replace('.', ',') : '';
  });

  // When a saved draft is restored (or reset), resync this screen with it.
  const [syncedDraftVersion, setSyncedDraftVersion] = useState(draftVersion);
  if (syncedDraftVersion !== draftVersion) {
    setSyncedDraftVersion(draftVersion);
    setLocalChar(characterization);
    const h = characterization.highRisk.detallesAlturas?.alturaMaximaMetros;
    setAlturaTexto(h ? String(h).replace('.', ',') : '');
    setSelectedModulesToBuy(loadDraft()?.selectedModules ?? applicabilityProfile.proposal.selectedModules);
  }
  const [newSite, setNewSite] = useState<NewSiteForm>(EMPTY_SITE_FORM);
  const [newSiteError, setNewSiteError] = useState('');
  const editSite = (update: (f: NewSiteForm) => NewSiteForm) => {
    setNewSite(update);
    setNewSiteError('');
  };

  const steps = [
    { num: 1, title: 'Identificación', icon: Building2 },
    { num: 2, title: 'Tamaño & Personal', icon: Users },
    { num: 3, title: 'Sedes & Centros', icon: MapPin },
    { num: 4, title: 'Operación & Riesgos', icon: Flame },
    { num: 5, title: 'SG-SST (Dec 1072)', icon: HardHat },
    { num: 6, title: 'Gestión Ambiental', icon: Leaf },
    { num: 7, title: 'Seguridad Vial (PESV)', icon: Car },
    { num: 8, title: 'Sistemas ISO', icon: Award },
    { num: 9, title: 'Motor de Aplicabilidad', icon: Cpu },
    { num: 10, title: 'Propuesta Comercial', icon: ShoppingBag },
    { num: 11, title: 'Configuración & Gestión', icon: CheckCircle2 }
  ];

  // Helper to update local state and propagate to engine
  const handleUpdate = (updater: (prev: typeof localChar) => typeof localChar) => {
    // Recalculate derived values (SST standards, PESV level) so this screen never shows stale results.
    const updated = withDerivedValues(updater(localChar));
    setLocalChar(updated);
    updateCharacterization(updated);
  };

  // Sector suggested by the CIIU code (CIIU Rev. 4 A.C.); the user can still change it.
  const ciiuMatch = classifyCiiu(localChar.identification.codigoCiiu);
  const sectorIsAuto = !!ciiuMatch && !localChar.identification.sectorEditadoManualmente
    && localChar.identification.sectorEconomico === ciiuMatch.sector;

  // Res. 0312/2019: which group of minimum SST standards applies, and why.
  const sstExplicacion = explainSstStandards(localChar.size.totalTrabajadores, localChar.sst.claseRiesgoArl);
  const copasstRequerido = localChar.size.totalTrabajadores >= 10 ? 'COPASST' : 'VIGIA';

  // Commercial rules: carbon calculator included with Environmental + another module or ISO 14001; also sold alone.
  const huellaPlan = huellaCarbonoEnPlan(selectedModulesToBuy);
  const monthlyTotal = chargeableModules(selectedModulesToBuy).reduce((sum, m) => {
    const found = applicabilityProfile.evaluations.find(e => e.module === m);
    return sum + (found?.monthlyPriceCop || 0);
  }, 0);
  const huellaRecomendada = ['EXIGIDA', 'VOLUNTARIA'].includes(localChar.environmental.necesitaHuellaCarbono ?? '');

  // Res. 40595/2022: PESV level depends on the organization's mission and on vehicles/drivers.
  const esMision1 = (localChar.pesv.detallesPesv?.misionOrganizacional ?? 'TRANSPORTE_BIENES_PERSONAS') === 'TRANSPORTE_BIENES_PERSONAS';
  const pesvExplicacion = explainPesvLevel(
    localChar.pesv.utilizaVehiculosParaActividades,
    esMision1,
    localChar.pesv.detallesPesv?.numeroVehiculosTotal || 0,
    localChar.pesv.detallesPesv?.numeroConductoresTotal || 0
  );

  // Trabajo en alturas: Res. 4272/2021 applies from 2,0 m (requires a heights coordinator).
  const alturaEval = evaluarAltura(localChar.highRisk.detallesAlturas?.alturaMaximaMetros);
  const updateAlturas = (changes: Partial<AlturasDetails>) => handleUpdate(prev => ({
    ...prev,
    highRisk: {
      ...prev.highRisk,
      detallesAlturas: {
        frecuencia: 'SEMANAL',
        alturaMaximaMetros: 0,
        personalCertificado: false,
        sistemasProteccionCaidas: false,
        ...prev.highRisk.detallesAlturas,
        ...changes,
      }
    }
  }));

  const handleArchetypeSelect = (archetypeId: string) => {
    loadCharacterizationArchetype(archetypeId);
    const found = characterizationArchetypes.find(a => a.id === archetypeId);
    if (found?.template) {
      setLocalChar(prev => withDerivedValues({ ...prev, ...found.template } as typeof prev));
      const h = found.template.highRisk?.detallesAlturas?.alturaMaximaMetros;
      setAlturaTexto(h ? String(h).replace('.', ',') : '');
      // refresh selected modules based on necessary
      if (applicabilityProfile.evaluations) {
        const nec = applicabilityProfile.evaluations
          .filter(e => e.tier === 'NECESARIO')
          .map(e => e.module);
        setSelectedModulesToBuy(nec.length > 0 ? nec : ['SST']);
      }
    }
  };

  const handleAddSite = () => {
    const shift = WORK_SHIFTS.find(w => w.value === newSite.jornada);
    const missing = [
      !newSite.nombre.trim() && 'el nombre',
      !newSite.ciudad.trim() && 'la ciudad',
      !(newSite.trabajadores > 0) && 'el número de trabajadores',
      !shift && 'la jornada de trabajo',
      newSite.jornada === 'OTRO' && !newSite.jornadaOtra.trim() && 'la descripción del horario',
    ].filter(Boolean);
    if (missing.length) {
      setNewSiteError(`Completa ${missing.join(', ')}.`);
      return;
    }

    const shiftLabel = newSite.jornada === 'OTRO' ? newSite.jornadaOtra.trim() : shift!.label;
    const hours = shift?.askHours && newSite.horaInicio && newSite.horaFin ? ` · ${newSite.horaInicio} a ${newSite.horaFin}` : '';
    const site: CharacterizationSite = {
      id: `site-${Date.now()}`,
      nombre: newSite.nombre.trim(),
      ciudad: newSite.ciudad.trim(),
      departamento: newSite.departamento.trim(),
      ubicacion: newSite.direccion.trim(),
      tipoSede: newSite.tipoSede,
      actividadRealizada: '',
      numeroTrabajadores: newSite.trabajadores,
      horario: shiftLabel + hours,
      tipoOperacion: shiftLabel,
      caracteristicasParticulares: newSite.particularidades.trim(),
    };

    handleUpdate(prev => ({
      ...prev,
      sites: [...prev.sites, site],
      size: { ...prev.size, numeroSedes: prev.sites.length + 1 }
    }));

    setNewSite(EMPTY_SITE_FORM);
    setNewSiteError('');
  };

  const handleRemoveSite = (id: string) => {
    if (localChar.sites.length <= 1) return;
    handleUpdate(prev => ({
      ...prev,
      sites: prev.sites.filter(s => s.id !== id),
      size: { ...prev.size, numeroSedes: Math.max(1, prev.sites.length - 1) }
    }));
  };

  const toggleModuleSelection = (mod: ModuleType) => {
    const next = selectedModulesToBuy.includes(mod)
      ? selectedModulesToBuy.filter(m => m !== mod)
      : [...selectedModulesToBuy, mod];
    setSelectedModulesToBuy(next);
    saveWizardModules(next);
  };

  const handleConfirmAndActivate = () => {
    applyCharacterizationToPlatform(selectedModulesToBuy);
    if (onFinish) onFinish();
    if (onClose) onClose();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Banner & Fast Archetype Switcher */}
      <div className="rounded-2xl p-4 sm:p-5 border border-emerald-100 bg-gradient-to-r from-white via-white to-emerald-50 shadow-[0_10px_40px_-18px_rgba(15,90,60,0.25)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700 border border-emerald-200">
                Caracterización Inteligente & Dinámica
              </span>
              <span className="text-[10px] text-slate-500">
                Cuestionario Condicional Multi-Propósito (Preventa & Post-Compra)
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight mt-1">
              Perfilamiento Integral de la Organización
            </h2>
            <p className="text-xs text-slate-500">
              Las preguntas se habilitan condicionalmente según las respuestas. Los datos ingresados configurarán automáticamente la plataforma AGAE.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CloudCheck className="w-3.5 h-3.5" />
                {draftSavedAt ? `Guardado automáticamente · ${formatSavedAt(draftSavedAt)}` : 'Tu avance se guarda automáticamente'}
              </span>
              {confirmReset ? (
                <span className="inline-flex items-center gap-2 text-slate-600">
                  ¿Borrar lo diligenciado y empezar de nuevo?
                  <button type="button" onClick={() => { resetCharacterizationDraft(); setConfirmReset(false); }} className="font-bold text-rose-700 hover:underline">Sí, borrar</button>
                  <button type="button" onClick={() => setConfirmReset(false)} className="font-semibold text-slate-500 hover:underline">Cancelar</button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirmReset(true)} className="text-slate-500 hover:text-rose-700 hover:underline">
                  Comenzar de nuevo
                </button>
              )}
            </div>
          </div>

          {/* Archetype Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-slate-500 font-semibold block w-full sm:w-auto">
              Probar Arquetipo:
            </span>
            {characterizationArchetypes.map(arc => (
              <button
                key={arc.id}
                onClick={() => handleArchetypeSelect(arc.id)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 border border-slate-300 hover:border-emerald-300 text-[11px] font-semibold text-slate-800 transition-all flex items-center gap-1.5 shadow-sm"
                title={arc.description}
              >
                <Sparkles className="w-3 h-3 text-emerald-700" />
                <span>{arc.name}</span>
              </button>
            ))}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-emerald-800 ml-auto"
                title="Cerrar Asistente"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Step Navigation Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
          {steps.map(s => {
            const Icon = s.icon;
            const isCurrent = activeWizardStep === s.num;
            const isCompleted = activeWizardStep > s.num;
            return (
              <button
                key={s.num}
                onClick={() => setActiveWizardStep(s.num)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : isCompleted
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{s.title}</span>
                <span className="sm:hidden">{s.num}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dynamic Wizard Container */}
      {restoredDraftStep && !dismissedRestore && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900">
          <span className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Continuamos donde lo dejaste.</strong> Recuperamos tu caracterización
              {draftSavedAt && <> guardada el {formatSavedAt(draftSavedAt)}</>} (paso {restoredDraftStep} de 11).
            </span>
          </span>
          <button type="button" onClick={() => setDismissedRestore(true)} className="self-start sm:self-center font-semibold text-emerald-700 hover:underline">
            Entendido
          </button>
        </div>
      )}

      <div className="rounded-2xl p-5 sm:p-6 bg-white border border-emerald-100 shadow-[0_10px_40px_-18px_rgba(15,90,60,0.25)] space-y-6">
        {/* ==============================================================
            PASO 1: IDENTIFICACIÓN DE LA ORGANIZACIÓN
        ============================================================== */}
        {activeWizardStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                Paso 1: Identificación Legal y Comercial
              </h3>
              <p className="text-xs text-slate-500">
                Información corporativa y código de actividad económica que incidirá en la aplicabilidad legal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Razón Social *</label>
                <input
                  type="text"
                  value={localChar.identification.razonSocial}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    identification: { ...prev.identification, razonSocial: e.target.value }
                  }))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:border-emerald-400 focus:outline-none"
                  placeholder="Ej: Logística & Manufactura Andina S.A.S."
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  value={localChar.identification.nombreComercial}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    identification: { ...prev.identification, nombreComercial: e.target.value }
                  }))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:border-emerald-400 focus:outline-none"
                  placeholder="Ej: Andina Logistics"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">NIT *</label>
                <input
                  type="text"
                  value={localChar.identification.nit}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    identification: { ...prev.identification, nit: e.target.value }
                  }))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 font-mono focus:border-emerald-400 focus:outline-none"
                  placeholder="Ej: 901.458.923-4"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tipo de Organización</label>
                <select
                  value={localChar.identification.tipoOrganizacion}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    identification: { ...prev.identification, tipoOrganizacion: e.target.value as OrganizationType }
                  }))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="SAS">Sociedad por Acciones Simplificada (S.A.S.)</option>
                  <option value="SA">Sociedad Anónima (S.A.)</option>
                  <option value="LTDA">Sociedad Limitada (Ltda.)</option>
                  <option value="ESAL">Entidad Sin Ánimo de Lucro (ESAL / ONG)</option>
                  <option value="PERSONA_NATURAL">Persona Natural con Negocio</option>
                  <option value="SUCURSAL_EXTRANJERA">Sucursal de Sociedad Extranjera</option>
                  <option value="COOPERATIVA">Cooperativa o Empresa Asociativa</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Código CIIU Principal *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={localChar.identification.codigoCiiu}
                  onChange={(e) => {
                    const codigoCiiu = e.target.value.replace(/\D/g, '').slice(0, 4);
                    const match = classifyCiiu(codigoCiiu);
                    handleUpdate(prev => ({
                      ...prev,
                      identification: {
                        ...prev.identification,
                        codigoCiiu,
                        // The sector follows the CIIU code until the user picks one by hand.
                        ...(match && !prev.identification.sectorEditadoManualmente ? { sectorEconomico: match.sector } : {}),
                      }
                    }));
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 font-mono focus:border-emerald-400 focus:outline-none"
                  placeholder="Ej: 4923"
                />
                {ciiuMatch ? (
                  <p className="mt-1.5 text-[11px] text-emerald-700 flex items-start gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-px" />
                    <span>Sección {ciiuMatch.section} · {ciiuMatch.name}</span>
                  </p>
                ) : localChar.identification.codigoCiiu.length >= 2 ? (
                  <p className="mt-1.5 text-[11px] text-amber-700">Código no reconocido en la CIIU Rev. 4 A.C. Selecciona el sector manualmente.</p>
                ) : (
                  <p className="mt-1.5 text-[11px] text-slate-500">El sector económico se asigna automáticamente según este código.</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <label className="font-semibold text-slate-700">Sector Económico</label>
                  {sectorIsAuto ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                      <Sparkles className="w-3 h-3" /> Automático según CIIU
                    </span>
                  ) : ciiuMatch ? (
                    <button
                      type="button"
                      onClick={() => handleUpdate(prev => ({
                        ...prev,
                        identification: { ...prev.identification, sectorEconomico: ciiuMatch.sector, sectorEditadoManualmente: false }
                      }))}
                      className="text-[10px] font-bold text-emerald-700 hover:underline"
                    >
                      ↺ Usar el sugerido por el CIIU
                    </button>
                  ) : null}
                </div>
                <select
                  value={localChar.identification.sectorEconomico}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    identification: {
                      ...prev.identification,
                      sectorEconomico: e.target.value as EconomicSector,
                      sectorEditadoManualmente: e.target.value !== ciiuMatch?.sector,
                    }
                  }))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:border-emerald-400 focus:outline-none"
                >
                  {ECONOMIC_SECTORS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {localChar.identification.sectorEconomico === 'OTRO' && (
                  <input
                    type="text"
                    value={localChar.identification.sectorOtro ?? ''}
                    onChange={(e) => handleUpdate(prev => ({
                      ...prev,
                      identification: { ...prev.identification, sectorOtro: e.target.value }
                    }))}
                    className="mt-2 w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:border-emerald-400 focus:outline-none"
                    placeholder="Especifica el sector económico"
                  />
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">
                  Sectores Adicionales <span className="font-normal text-slate-500">(opcional, si la organización también opera en otros sectores)</span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {(localChar.identification.sectoresAdicionales ?? []).map(sec => (
                    <span key={sec} className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                      {sectorLabel(sec)}
                      <button
                        type="button"
                        onClick={() => handleUpdate(prev => ({
                          ...prev,
                          identification: {
                            ...prev.identification,
                            sectoresAdicionales: (prev.identification.sectoresAdicionales ?? []).filter(x => x !== sec)
                          }
                        }))}
                        className="w-5 h-5 rounded-full hover:bg-emerald-200 flex items-center justify-center"
                        aria-label={`Quitar ${sectorLabel(sec)}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <select
                    value=""
                    onChange={(e) => {
                      const sec = e.target.value as EconomicSector;
                      if (!sec) return;
                      handleUpdate(prev => ({
                        ...prev,
                        identification: {
                          ...prev.identification,
                          sectoresAdicionales: [...(prev.identification.sectoresAdicionales ?? []), sec]
                        }
                      }));
                    }}
                    className="bg-white border border-dashed border-emerald-300 rounded-full px-3 py-1.5 text-xs text-emerald-700 font-semibold focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="">+ Agregar sector</option>
                    {ECONOMIC_SECTORS.filter(s =>
                      s.value !== 'OTRO' &&
                      s.value !== localChar.identification.sectorEconomico &&
                      !(localChar.identification.sectoresAdicionales ?? []).includes(s.value)
                    ).map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Actividad Económica Principal</label>
                <input
                  type="text"
                  value={localChar.identification.actividadEconomicaPrincipal}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    identification: { ...prev.identification, actividadEconomicaPrincipal: e.target.value }
                  }))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:border-emerald-400 focus:outline-none"
                  placeholder="Ej: Transporte terrestre de carga por carretera y almacenamiento"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Representante Legal</label>
                <input
                  type="text"
                  value={localChar.identification.representanteLegal}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    identification: { ...prev.identification, representanteLegal: e.target.value }
                  }))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:border-emerald-400 focus:outline-none"
                  placeholder="Nombre y apellido"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={localChar.identification.ciudad}
                    onChange={(e) => handleUpdate(prev => ({
                      ...prev,
                      identification: { ...prev.identification, ciudad: e.target.value }
                    }))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:border-emerald-400 focus:outline-none"
                    placeholder="Bogotá"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Departamento</label>
                  <input
                    type="text"
                    value={localChar.identification.departamento}
                    onChange={(e) => handleUpdate(prev => ({
                      ...prev,
                      identification: { ...prev.identification, departamento: e.target.value }
                    }))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:border-emerald-400 focus:outline-none"
                    placeholder="Cundinamarca"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            PASO 2: TAMAÑO DE LA ORGANIZACIÓN Y FUERZA LABORAL
        ============================================================== */}
        {activeWizardStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                Paso 2: Tamaño y Modalidades de Trabajo
              </h3>
              <p className="text-xs text-slate-500">
                La cantidad de trabajadores y su modalidad de vinculación determinan la escala del SG-SST y responsabilidades legales.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <label className="font-semibold text-slate-700 block mb-1">Total Trabajadores *</label>
                <input
                  type="number"
                  min={1}
                  value={localChar.size.totalTrabajadores}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    size: { ...prev.size, totalTrabajadores: Math.max(1, Number(e.target.value)) }
                  }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-bold text-base focus:border-emerald-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Plantilla global activa</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <label className="font-semibold text-slate-700 block mb-1">Trabajadores Directos</label>
                <input
                  type="number"
                  min={0}
                  value={localChar.size.trabajadoresDirectos}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    size: { ...prev.size, trabajadoresDirectos: Number(e.target.value) }
                  }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-semibold focus:border-emerald-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Nómina directa</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <label className="font-semibold text-slate-700 block mb-1">Contratistas / Terceros</label>
                <input
                  type="number"
                  min={0}
                  value={localChar.size.contratistas}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    size: { ...prev.size, contratistas: Number(e.target.value) }
                  }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-semibold focus:border-emerald-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Prestación de servicios</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <label className="font-semibold text-slate-700 block mb-1">Aprendices / SENA</label>
                <input
                  type="number"
                  min={0}
                  value={localChar.size.aprendicesPracticantes}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    size: { ...prev.size, aprendicesPracticantes: Number(e.target.value) }
                  }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-semibold focus:border-emerald-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Practicantes formativos</span>
              </div>
            </div>

            {/* Work Modality Switches */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Características de la Jornada y Modalidades
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-emerald-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localChar.size.tieneTurnos}
                    onChange={(e) => handleUpdate(prev => ({
                      ...prev,
                      size: { ...prev.size, tieneTurnos: e.target.checked }
                    }))}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">¿Opera por Turnos?</span>
                    <span className="text-[10px] text-slate-500">Rotativos o continuos</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-emerald-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localChar.size.tieneTrabajoNocturno}
                    onChange={(e) => handleUpdate(prev => ({
                      ...prev,
                      size: { ...prev.size, tieneTrabajoNocturno: e.target.checked }
                    }))}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">¿Tiene Trabajo Nocturno?</span>
                    <span className="text-[10px] text-slate-500">Entre 21:00 y 06:00</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-emerald-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localChar.size.tieneTrabajadoresRemotos}
                    onChange={(e) => handleUpdate(prev => ({
                      ...prev,
                      size: { ...prev.size, tieneTrabajadoresRemotos: e.target.checked }
                    }))}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">¿Trabajadores Remotos?</span>
                    <span className="text-[10px] text-slate-500">Home office / Teletrabajo</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-emerald-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localChar.size.tieneTrabajadoresHibridos}
                    onChange={(e) => handleUpdate(prev => ({
                      ...prev,
                      size: { ...prev.size, tieneTrabajadoresHibridos: e.target.checked }
                    }))}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">¿Personal Híbrido?</span>
                    <span className="text-[10px] text-slate-500">Alternancia sede/casa</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-emerald-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localChar.size.tieneTrabajadoresEnCampo}
                    onChange={(e) => handleUpdate(prev => ({
                      ...prev,
                      size: { ...prev.size, tieneTrabajadoresEnCampo: e.target.checked }
                    }))}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 block">¿Personal en Campo?</span>
                    <span className="text-[10px] text-slate-500">Obras, clientes, vías</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            PASO 3: SEDES Y CENTROS DE TRABAJO (Multi-Sede Dinámica)
        ============================================================== */}
        {activeWizardStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  Paso 3: Caracterización Multi-Sede y Centros de Trabajo
                </h3>
                <p className="text-xs text-slate-500">
                  No se asume que todas las sedes tienen las mismas condiciones. Cada sede tiene características individuales.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                {localChar.sites.length} Sede(s) Activas
              </span>
            </div>

            {/* Sites List */}
            <div className="space-y-3">
              {localChar.sites.map((site, index) => (
                <div key={site.id} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-[10px] border border-emerald-200">
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-900 text-xs">{site.nombre}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {SITE_TYPES.find(t => t.value === site.tipoSede)?.label ?? site.tipoSede}
                      </span>
                    </div>
                    {localChar.sites.length > 1 && (
                      <button
                        onClick={() => handleRemoveSite(site.id)}
                        className="text-rose-700 hover:text-rose-700 p-1 rounded hover:bg-rose-50"
                        title="Eliminar sede"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-500 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Ubicación & Ciudad</span>
                      <span className="text-slate-800">
                        {[site.ubicacion, [site.ciudad, site.departamento].filter(Boolean).join(', ')].filter(Boolean).join(' • ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Trabajadores Asignados</span>
                      <span className="text-slate-800 font-bold">{site.numeroTrabajadores} Colaboradores</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Jornada & Horario</span>
                      <span className="text-slate-800">{site.horario}</span>
                    </div>
                  </div>

                  {site.caracteristicasParticulares && (
                    <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                      <span className="text-[10px] text-emerald-700 font-semibold block">Particularidades de esta sede:</span>
                      {site.caracteristicasParticulares}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Site Panel */}
            <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-4 text-xs">
              <span className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                Agregar Nueva Sede o Centro de Trabajo
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <label className="block">
                  <span className="font-semibold text-slate-700 block mb-1">Nombre de la sede *</span>
                  <input
                    type="text"
                    value={newSite.nombre}
                    onChange={(e) => editSite(f => ({ ...f, nombre: e.target.value }))}
                    className={siteInputCls}
                    placeholder="Ej: Bodega Funza"
                  />
                </label>
                <label className="block">
                  <span className="font-semibold text-slate-700 block mb-1">Tipo de sede</span>
                  <select
                    value={newSite.tipoSede}
                    onChange={(e) => editSite(f => ({ ...f, tipoSede: e.target.value as SiteType }))}
                    className={siteInputCls}
                  >
                    {SITE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="font-semibold text-slate-700 block mb-1">Número de trabajadores *</span>
                  <input
                    type="number"
                    min={1}
                    value={newSite.trabajadores || ''}
                    onChange={(e) => editSite(f => ({ ...f, trabajadores: Number(e.target.value) }))}
                    className={`${siteInputCls} font-bold`}
                    placeholder="Ej: 25"
                  />
                </label>
                <label className="block">
                  <span className="font-semibold text-slate-700 block mb-1">Ciudad / Municipio *</span>
                  <input
                    type="text"
                    value={newSite.ciudad}
                    onChange={(e) => editSite(f => ({ ...f, ciudad: e.target.value }))}
                    className={siteInputCls}
                    placeholder="Ej: Funza"
                  />
                </label>
                <label className="block">
                  <span className="font-semibold text-slate-700 block mb-1">Departamento</span>
                  <input
                    type="text"
                    value={newSite.departamento}
                    onChange={(e) => editSite(f => ({ ...f, departamento: e.target.value }))}
                    className={siteInputCls}
                    placeholder="Ej: Cundinamarca"
                  />
                </label>
                <label className="block">
                  <span className="font-semibold text-slate-700 block mb-1">Dirección</span>
                  <input
                    type="text"
                    value={newSite.direccion}
                    onChange={(e) => editSite(f => ({ ...f, direccion: e.target.value }))}
                    className={siteInputCls}
                    placeholder="Ej: Km 2 vía Siberia"
                  />
                </label>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1.5">¿En qué jornada trabaja esta sede? *</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {WORK_SHIFTS.map(w => {
                    const selected = newSite.jornada === w.value;
                    return (
                      <button
                        key={w.value}
                        type="button"
                        onClick={() => editSite(f => ({ ...f, jornada: w.value }))}
                        className={`text-left p-2.5 rounded-lg border transition-all ${
                          selected
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                        }`}
                      >
                        <span className="block font-bold">{w.label}</span>
                        <span className={`block text-[10px] mt-0.5 ${selected ? 'text-emerald-50' : 'text-slate-500'}`}>{w.hint}</span>
                      </button>
                    );
                  })}
                </div>

                {WORK_SHIFTS.find(w => w.value === newSite.jornada)?.askHours && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <span className="text-slate-600">Horario (opcional):</span>
                    <input
                      type="time"
                      value={newSite.horaInicio}
                      onChange={(e) => editSite(f => ({ ...f, horaInicio: e.target.value }))}
                      className="bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:border-emerald-400 focus:outline-none"
                    />
                    <span className="text-slate-500">a</span>
                    <input
                      type="time"
                      value={newSite.horaFin}
                      onChange={(e) => editSite(f => ({ ...f, horaFin: e.target.value }))}
                      className="bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                )}
                {newSite.jornada === 'OTRO' && (
                  <input
                    type="text"
                    value={newSite.jornadaOtra}
                    onChange={(e) => editSite(f => ({ ...f, jornadaOtra: e.target.value }))}
                    className={`${siteInputCls} mt-2.5`}
                    placeholder="Describe el horario. Ej: Martes a domingo de 10:00 a 19:00"
                  />
                )}
              </div>

              <label className="block">
                <span className="font-semibold text-slate-700 block mb-1">Particularidades de la sede (opcional)</span>
                <input
                  type="text"
                  value={newSite.particularidades}
                  onChange={(e) => editSite(f => ({ ...f, particularidades: e.target.value }))}
                  className={siteInputCls}
                  placeholder="Ej: trabajo en alturas, montacargas, almacenamiento de químicos, atención al público…"
                />
              </label>

              {newSiteError && (
                <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-rose-700">{newSiteError}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddSite}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar sede
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            PASO 4: CARACTERÍSTICAS OPERATIVAS & ACTIVIDADES CRÍTICAS
        ============================================================== */}
        {activeWizardStep === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-700" />
                Paso 4: Operación y Actividades de Alto Riesgo
              </h3>
              <p className="text-xs text-slate-500">
                Las actividades de alto riesgo habilitan preguntas y módulos complementarios de seguridad industrial.
              </p>
            </div>

            {/* Operational Types */}
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Tipos de Operación Desarrollada
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { key: 'actividadesAdministrativas', label: 'Administrativas' },
                  { key: 'actividadesOperativas', label: 'Operativas' },
                  { key: 'actividadesProductivas', label: 'Productivas / Fabriles' },
                  { key: 'actividadesLogisticas', label: 'Logística / Almacén' },
                  { key: 'actividadesMantenimiento', label: 'Mantenimiento' },
                  { key: 'trabajoEnCampo', label: 'Trabajo en Campo' },
                  { key: 'trabajoViaPublica', label: 'Trabajo en Vía Pública' },
                  { key: 'transporte', label: 'Transporte / Carga' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(localChar.operational as any)[key]}
                      onChange={(e) => handleUpdate(prev => ({
                        ...prev,
                        operational: { ...prev.operational, [key]: e.target.checked }
                      }))}
                      className="w-3.5 h-3.5 accent-emerald-600 rounded"
                    />
                    <span className="text-slate-700 font-medium text-[11px]">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* High Risk Conditional Blocks */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                Actividades Críticas / Alto Riesgo (Condicionales)
              </span>

              {/* Alturas */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="chk-alturas"
                      checked={localChar.highRisk.trabajoAlturas}
                      onChange={(e) => handleUpdate(prev => ({
                        ...prev,
                        highRisk: { ...prev.highRisk, trabajoAlturas: e.target.checked }
                      }))}
                      className="w-4 h-4 accent-rose-500 rounded"
                    />
                    <label htmlFor="chk-alturas" className="font-bold text-slate-900 text-xs cursor-pointer">
                      ¿La organización realiza Trabajo en Alturas (≥ 2.0 metros)?
                    </label>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    localChar.highRisk.trabajoAlturas && alturaEval.estado !== 'NO_APLICA' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {!localChar.highRisk.trabajoAlturas ? 'No Aplica' : alturaEval.estado === 'NO_APLICA' ? 'No aplica Res. 4272/21 (< 2,0 m)' : 'Habilita Res. 4272/21'}
                  </span>
                </div>

                {/* Conditional Alturas Form */}
                {localChar.highRisk.trabajoAlturas && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-rose-200 space-y-3 text-xs animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-500 block text-[10px]">Frecuencia de Labor</label>
                        <select
                          value={localChar.highRisk.detallesAlturas?.frecuencia || 'SEMANAL'}
                          onChange={(e) => updateAlturas({ frecuencia: e.target.value as AlturasDetails['frecuencia'] })}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800 mt-0.5"
                        >
                          <option value="DIARIA">Diaria</option>
                          <option value="SEMANAL">Semanal</option>
                          <option value="MENSUAL">Mensual</option>
                          <option value="OCASIONAL">Ocasional / Mantenimiento</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-500 block text-[10px]">Altura máxima a la que se trabaja (metros)</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={alturaTexto}
                          onChange={(e) => {
                            setAlturaTexto(e.target.value);
                            updateAlturas({ alturaMaximaMetros: parseAltura(e.target.value) });
                          }}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800 mt-0.5 font-bold"
                          placeholder="Ej: 8,5"
                        />
                      </div>
                    </div>

                    {alturaEval.estado === 'SIN_DATO' && (
                      <p className="rounded-lg bg-white border border-slate-200 px-3 py-2 text-slate-600">
                        Indica la altura máxima para validar si aplica la Resolución 4272 de 2021 y si se requiere coordinador de trabajo en alturas.
                      </p>
                    )}
                    {alturaEval.estado === 'APLICA' && (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-amber-900">
                        <p className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-amber-600" />
                          Sí requiere Coordinador de Trabajo en Alturas
                        </p>
                        <p className="mt-1">
                          La altura declarada ({formatoAltura(alturaEval.altura)}) es igual o mayor a 2,0 m, por lo que aplica la Resolución 4272 de 2021.
                          Además se requiere: trabajadores con certificado de competencia en alturas, programa de prevención y protección contra caídas,
                          permisos de trabajo e inspección periódica de equipos y puntos de anclaje.
                        </p>
                      </div>
                    )}
                    {alturaEval.estado === 'NO_APLICA' && (
                      <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-emerald-900">
                        <p className="font-bold flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-emerald-600" />
                          No requiere Coordinador de Trabajo en Alturas
                        </p>
                        <p className="mt-1">
                          La altura declarada ({formatoAltura(alturaEval.altura)}) es menor a 2,0 m: no se considera trabajo en alturas según la
                          Resolución 4272 de 2021. El riesgo de caída se gestiona en la matriz de peligros con medidas de prevención generales.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Trabajo en Caliente */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="chk-caliente"
                      checked={!!localChar.highRisk.trabajoCaliente}
                      onChange={(e) => handleUpdate(prev => ({
                        ...prev,
                        highRisk: { ...prev.highRisk, trabajoCaliente: e.target.checked }
                      }))}
                      className="w-4 h-4 accent-orange-500 rounded"
                    />
                    <label htmlFor="chk-caliente" className="font-bold text-slate-900 text-xs cursor-pointer">
                      ¿Realiza trabajos en caliente (soldadura, corte, esmerilado o llama abierta)?
                    </label>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    localChar.highRisk.trabajoCaliente ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {localChar.highRisk.trabajoCaliente ? 'Habilita Permiso de Trabajo en Caliente' : 'No Aplica'}
                  </span>
                </div>

                {localChar.highRisk.trabajoCaliente && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-orange-200 space-y-2 text-xs animate-in slide-in-from-top-2">
                    <span className="text-slate-500 block text-[10px]">¿Qué tipo de trabajos en caliente realiza? (puedes marcar varios)</span>
                    <div className="flex flex-wrap gap-2">
                      {HOT_WORK_TYPES.map(tipo => {
                        const tipos = localChar.highRisk.detallesCaliente?.tipos ?? [];
                        const selected = tipos.includes(tipo);
                        return (
                          <button
                            key={tipo}
                            type="button"
                            onClick={() => handleUpdate(prev => {
                              const actuales = prev.highRisk.detallesCaliente?.tipos ?? [];
                              return {
                                ...prev,
                                highRisk: {
                                  ...prev.highRisk,
                                  detallesCaliente: { tipos: selected ? actuales.filter(t => t !== tipo) : [...actuales, tipo] }
                                }
                              };
                            })}
                            className={`px-3 py-1.5 rounded-full border font-semibold transition-all ${
                              selected ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-300 text-slate-700 hover:border-orange-300'
                            }`}
                          >
                            {tipo}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-orange-800">
                      Requiere permiso de trabajo en caliente, vigía de fuego, retiro o protección de materiales combustibles, extintores
                      disponibles y EPP específico (careta, guantes y ropa ignífuga).
                    </p>
                  </div>
                )}
              </div>

              {/* Espacios Confinados */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="chk-confinados"
                      checked={localChar.highRisk.espaciosConfinados}
                      onChange={(e) => handleUpdate(prev => ({
                        ...prev,
                        highRisk: { ...prev.highRisk, espaciosConfinados: e.target.checked }
                      }))}
                      className="w-4 h-4 accent-rose-500 rounded"
                    />
                    <label htmlFor="chk-confinados" className="font-bold text-slate-900 text-xs cursor-pointer">
                      ¿Realiza Trabajo en Espacios Confinados (Tanques, silos, cámaras)?
                    </label>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    localChar.highRisk.espaciosConfinados ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {localChar.highRisk.espaciosConfinados ? 'Habilita Res. 0491/20' : 'No Aplica'}
                  </span>
                </div>
              </div>

              {/* Sustancias Químicas (SGA) */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="chk-quimicos"
                      checked={localChar.highRisk.manejoSustanciasQuimicas}
                      onChange={(e) => handleUpdate(prev => ({
                        ...prev,
                        highRisk: { ...prev.highRisk, manejoSustanciasQuimicas: e.target.checked }
                      }))}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <label htmlFor="chk-quimicos" className="font-bold text-slate-900 text-xs cursor-pointer">
                      ¿Manipula o almacena sustancias químicas en la operación?
                    </label>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    localChar.highRisk.manejoSustanciasQuimicas ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {localChar.highRisk.manejoSustanciasQuimicas ? 'Habilita SGA Dec. 1496' : 'No Aplica'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            PASO 5: SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)
        ============================================================== */}
        {activeWizardStep === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HardHat className="w-4 h-4 text-orange-700" />
                Paso 5: Variables de Seguridad y Salud en el Trabajo
              </h3>
              <p className="text-xs text-slate-500">
                Cruce de variables normativas según Decreto 1072 de 2015 y Resolución 0312 de 2019.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clase de Riesgo ARL Principal *</label>
                <select
                  value={localChar.sst.claseRiesgoArl}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    sst: { ...prev.sst, claseRiesgoArl: Number(e.target.value) as any }
                  }))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 font-bold focus:border-emerald-400 focus:outline-none"
                >
                  <option value={1}>Clase I (Riesgo Mínimo - Oficinas, Consultoría, Educación)</option>
                  <option value={2}>Clase II (Riesgo Bajo - Comercio, Almacenes, Confecciones)</option>
                  <option value={3}>Clase III (Riesgo Medio - Talleres, Fabricación Ligera)</option>
                  <option value={4}>Clase IV (Riesgo Alto - Transporte, Carga, Manufactura Pesada)</option>
                  <option value={5}>Clase V (Riesgo Máximo - Minería, Construcción, Fundición)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Si la empresa tiene centros de trabajo con distinta clase de riesgo, selecciona la más alta.
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Comité Paritario o Vigía SST</label>
                <select
                  value={localChar.sst.tieneCopasstOVigia}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    sst: { ...prev.sst, tieneCopasstOVigia: e.target.value as any }
                  }))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="COPASST">COPASST Conformado (10 o más trabajadores)</option>
                  <option value="VIGIA">Vigía SST Designado (menos de 10 trabajadores)</option>
                  <option value="NINGUNO">Pendiente de conformación</option>
                </select>
                <span className={`text-[10px] mt-1 block ${
                  localChar.sst.tieneCopasstOVigia !== 'NINGUNO' && localChar.sst.tieneCopasstOVigia !== copasstRequerido ? 'text-amber-700 font-semibold' : 'text-slate-500'
                }`}>
                  Con {localChar.size.totalTrabajadores} trabajadores corresponde {copasstRequerido === 'COPASST' ? 'conformar COPASST' : 'designar Vigía SST'} (Res. 2013 de 1986 · Dec. 1072 de 2015).
                </span>
              </div>

              {/* Calculated SST Standards (Res. 0312/2019) */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-emerald-50 border border-orange-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-orange-700 font-bold uppercase block">
                      Estándares Mínimos que aplican (Res. 0312 de 2019)
                    </span>
                    <div className="text-base font-black text-slate-900 mt-0.5">
                      {sstExplicacion.count} Estándares Mínimos Obligatorios
                    </div>
                    <span className="text-[11px] text-slate-600 block">{sstExplicacion.reason}</span>
                  </div>
                  <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200 whitespace-nowrap">
                    {sstExplicacion.article}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { count: 7, rule: '10 o menos trabajadores · Riesgo I, II o III', article: 'Art. 3' },
                    { count: 21, rule: '11 a 50 trabajadores · Riesgo I, II o III', article: 'Art. 9' },
                    { count: 60, rule: 'Más de 50 trabajadores, o riesgo IV o V', article: 'Art. 16' },
                  ].map(tier => {
                    const active = tier.count === sstExplicacion.count;
                    return (
                      <div
                        key={tier.count}
                        className={`p-2.5 rounded-lg border text-[11px] ${
                          active ? 'bg-white border-emerald-400 ring-2 ring-emerald-100' : 'bg-white/50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <span className={`block font-black text-sm ${active ? 'text-emerald-700' : ''}`}>
                          {tier.count} estándares {active && '✓'}
                        </span>
                        <span className={active ? 'text-slate-700' : ''}>{tier.rule}</span>
                        <span className="block text-[10px] mt-0.5">{tier.article}</span>
                      </div>
                    );
                  })}
                </div>

                {localChar.identification.sectorEconomico === 'AGROPECUARIO' && sstExplicacion.count === 7 && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                    Si la organización es una unidad de producción agropecuaria con 10 o menos trabajadores permanentes y riesgo I, II o III,
                    aplican 3 estándares mínimos (Res. 0312 de 2019, Capítulo II). Valídalo con el asesor de AGAE.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            PASO 6: CARACTERIZACIÓN AMBIENTAL (Flujo Condicional)
        ============================================================== */}
        {activeWizardStep === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-700" />
                Paso 6: Gestión Ambiental Integral (Flujo Condicional Inteligente)
              </h3>
              <p className="text-xs text-slate-500">
                Las preguntas de residuos peligrosos, vertimientos y emisiones aparecen únicamente si la empresa declara generarlos.
              </p>
            </div>

            {/* Conditional RESPEL Section */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="chk-respel"
                    checked={localChar.environmental.generaResiduosPeligrosos}
                    onChange={(e) => handleUpdate(prev => ({
                      ...prev,
                      environmental: { ...prev.environmental, generaResiduosPeligrosos: e.target.checked }
                    }))}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <label htmlFor="chk-respel" className="font-bold text-slate-900 cursor-pointer">
                    ¿La organización genera Residuos Peligrosos (RESPEL)?
                  </label>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  localChar.environmental.generaResiduosPeligrosos 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {localChar.environmental.generaResiduosPeligrosos ? 'BLOQUE HABILITADO' : 'OCULTO'}
                </span>
              </div>

              {/* Conditional Nested RESPEL Form */}
              {localChar.environmental.generaResiduosPeligrosos && (
                <div className="p-3.5 rounded-lg bg-slate-50 border border-emerald-200 space-y-3 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 block mb-1">Volumen Estimado (kg/mes) *</label>
                      <input
                        type="number"
                        min={1}
                        value={localChar.environmental.detallesRespel?.volumenKgMes || 100}
                        onChange={(e) => handleUpdate(prev => ({
                          ...prev,
                          environmental: {
                            ...prev.environmental,
                            detallesRespel: {
                              ...prev.environmental.detallesRespel!,
                              volumenKgMes: Number(e.target.value)
                            }
                          }
                        }))}
                        className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 font-bold"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {(localChar.environmental.detallesRespel?.volumenKgMes || 0) >= 100 
                          ? 'Clasifica como Mediano / Gran Generador (Reporte RUA obligatorio)' 
                          : 'Clasifica como Pequeño Generador'}
                      </span>
                    </div>

                    <div>
                      <label className="text-slate-700 block mb-1">Gestor Ambiental Autorizado</label>
                      <input
                        type="text"
                        value={localChar.environmental.detallesRespel?.gestorAutorizado || ''}
                        onChange={(e) => handleUpdate(prev => ({
                          ...prev,
                          environmental: {
                            ...prev.environmental,
                            detallesRespel: {
                              ...prev.environmental.detallesRespel!,
                              gestorAutorizado: e.target.value
                            }
                          }
                        }))}
                        className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800"
                        placeholder="Nombre del gestor con licencia"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localChar.environmental.detallesRespel?.diquesContencion}
                        onChange={(e) => handleUpdate(prev => ({
                          ...prev,
                          environmental: {
                            ...prev.environmental,
                            detallesRespel: {
                              ...prev.environmental.detallesRespel!,
                              diquesContencion: e.target.checked
                            }
                          }
                        }))}
                        className="w-3.5 h-3.5 accent-emerald-500 rounded"
                      />
                      <span>Cuenta con Diques de Contención (110%)</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localChar.environmental.detallesRespel?.cuentaConCertificadosDisposicion}
                        onChange={(e) => handleUpdate(prev => ({
                          ...prev,
                          environmental: {
                            ...prev.environmental,
                            detallesRespel: {
                              ...prev.environmental.detallesRespel!,
                              cuentaConCertificadosDisposicion: e.target.checked
                            }
                          }
                        }))}
                        className="w-3.5 h-3.5 accent-emerald-500 rounded"
                      />
                      <span>Exige Certificados de Disposición Final</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Conditional Vertimientos Section */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="chk-vertimientos"
                    checked={localChar.environmental.generaVertimientos}
                    onChange={(e) => handleUpdate(prev => ({
                      ...prev,
                      environmental: { ...prev.environmental, generaVertimientos: e.target.checked }
                    }))}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <label htmlFor="chk-vertimientos" className="font-bold text-slate-900 cursor-pointer">
                    ¿Genera Vertimientos No Domésticos / Industriales?
                  </label>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  localChar.environmental.generaVertimientos 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {localChar.environmental.generaVertimientos ? 'BLOQUE HABILITADO' : 'OCULTO'}
                </span>
              </div>

              {localChar.environmental.generaVertimientos && (
                <div className="p-3 rounded-lg bg-slate-50 border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in slide-in-from-top-2">
                  <div>
                    <label className="text-slate-500 block mb-1">Tipo de Vertimiento</label>
                    <select
                      value={localChar.environmental.detallesVertimientos?.tipoVertimiento || 'NO_DOMESTICO_INDUSTRIAL'}
                      onChange={(e) => handleUpdate(prev => ({
                        ...prev,
                        environmental: {
                          ...prev.environmental,
                          detallesVertimientos: {
                            tipoVertimiento: e.target.value as any,
                            trampaGrasasOPlanta: true,
                            requierePermisoVertimientos: true,
                            cuentaConPermisoVertimientos: true
                          }
                        }
                      }))}
                      className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800"
                    >
                      <option value="NO_DOMESTICO_INDUSTRIAL">Industrial / Lavado de Vehículos</option>
                      <option value="MIXTO">Mixto (Doméstico + Operacional)</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[11px] text-slate-700">
                      ✓ Aplica Resolución 0631 de 2015 y monitoreo periódico de vertimientos.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Other Environmental Switches */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { key: 'generaRaee', label: '¿Genera RAEE (Electrónicos)?' },
                { key: 'generaManejaBaterias', label: '¿Maneja Baterías?' },
                { key: 'generaAceitesUsados', label: '¿Aceites Lubricantes Usados?' },
                { key: 'utilizaCombustibles', label: '¿Usa Combustibles (Diesel/Gas)?' },
                { key: 'generaRuidoAmbiental', label: '¿Genera Ruido en Operación?' },
                { key: 'tieneAlmacenamientoResiduos', label: '¿Centro de Acopio de Residuos?' },
                { key: 'tieneRegistrosReportesAmbientales', label: '¿Reporte RUA ante la CAR?' },
                { key: 'tienePermisosAmbientales', label: '¿Tiene Permisos Ambientales?' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(localChar.environmental as any)[key]}
                    onChange={(e) => handleUpdate(prev => ({
                      ...prev,
                      environmental: { ...prev.environmental, [key]: e.target.checked }
                    }))}
                    className="w-3.5 h-3.5 accent-emerald-500 rounded"
                  />
                  <span className="text-slate-700 font-medium text-[11px]">{label}</span>
                </label>
              ))}
            </div>

            {/* Huella de carbono: validated with the client, not automatic */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 block">¿La organización necesita medir su huella de carbono?</span>
                <span className="text-[11px] text-slate-500">
                  No es una obligación legal general. Se mide cuando lo exigen clientes, licitaciones o casa matriz, o por compromisos de sostenibilidad.
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {HUELLA_OPTIONS.map(opt => {
                  const selected = localChar.environmental.necesitaHuellaCarbono === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleUpdate(prev => ({
                        ...prev,
                        environmental: { ...prev.environmental, necesitaHuellaCarbono: opt.value }
                      }))}
                      className={`text-left p-2.5 rounded-lg border transition-all ${
                        selected ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      <span className="block font-bold">{opt.label}</span>
                      <span className={`block text-[10px] mt-0.5 ${selected ? 'text-emerald-50' : 'text-slate-500'}`}>{opt.hint}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                La calculadora de huella de carbono (con informe PDF de emisiones) se incluye sin costo con Gestión Ambiental + otro módulo o con ISO 14001. También se puede contratar sola.
              </p>
            </div>
          </div>
        )}

        {/* ==============================================================
            PASO 7: SEGURIDAD VIAL / PESV (Gatekeeper Condicional)
        ============================================================== */}
        {activeWizardStep === 7 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-sky-700" />
                Paso 7: Caracterización de Seguridad Vial / PESV (Resolución 40595)
              </h3>
              <p className="text-xs text-slate-500">
                Pregunta compuerta: Si la empresa no utiliza vehículos, NO se muestran las preguntas de flota ni aplica PESV.
              </p>
            </div>

            {/* The Gatekeeper Toggle */}
            <div className={`p-4 rounded-xl border transition-all ${
              localChar.pesv.utilizaVehiculosParaActividades 
                ? 'bg-sky-50 border-sky-200' 
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="gatekeeper-pesv"
                    checked={localChar.pesv.utilizaVehiculosParaActividades}
                    onChange={(e) => handleUpdate(prev => ({
                      ...prev,
                      pesv: {
                        ...prev.pesv,
                        utilizaVehiculosParaActividades: e.target.checked,
                        detallesPesv: e.target.checked ? (prev.pesv.detallesPesv || {
                          misionOrganizacional: 'TRANSPORTE_BIENES_PERSONAS',
                          numeroVehiculosTotal: 10,
                          vehiculosPropios: 8,
                          vehiculosArrendados: 2,
                          vehiculosContratados: 0,
                          vehiculosTerceros: 0,
                          numeroConductoresTotal: 10,
                          conductoresDirectos: 8,
                          conductoresContratistas: 2,
                          tiposFlota: { motocicletas: 2, vehiculosLivianos: 2, vehiculosPesados: 6, maquinariaAmarilla: 0 },
                          operaciones: { transportePasajeros: false, transporteMercancias: true, distribucionUrbana: true, mensajeria: false, transporteSustanciasPeligrosas: false, desplazamientosLaborales: true },
                          frecuenciaUtilizacion: 'DIARIA',
                          areaGeograficaOperacion: 'NACIONAL'
                        }) : undefined
                      }
                    }))}
                    className="w-5 h-5 accent-sky-500 rounded"
                  />
                  <div>
                    <label htmlFor="gatekeeper-pesv" className="text-sm font-bold text-slate-900 cursor-pointer block">
                      ¿La organización utiliza vehículos para desarrollar sus actividades?
                    </label>
                    <span className="text-xs text-slate-500">
                      Incluye vehículos propios, arrendados, contratados, motocicletas o conductores directos e indirectos.
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                  localChar.pesv.utilizaVehiculosParaActividades
                    ? 'bg-sky-100 text-sky-700 border border-sky-200'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {localChar.pesv.utilizaVehiculosParaActividades ? 'SÍ UTILIZA VEHÍCULOS' : 'NO UTILIZA'}
                </span>
              </div>
            </div>

            {/* IF NO VEHICLES -> Explicit Exemption Banner */}
            {!localChar.pesv.utilizaVehiculosParaActividades ? (
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-2">
                <Info className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800 uppercase">
                  Módulo PESV No Aplicable a Esta Organización
                </h4>
                <p className="text-xs text-slate-500 max-w-lg mx-auto">
                  Al declarar que la organización NO utiliza vehículos ni contrata conductores para sus labores, el bloque de preguntas detalladas de flota se oculta y el PESV queda registrado formalmente como <strong>NO APLICA</strong> en la propuesta comercial.
                </p>
              </div>
            ) : (
              /* IF YES -> Full Fleet & Driver Details */
              <div className="space-y-4 animate-in slide-in-from-top-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-700 block mb-1 font-semibold">Misionalidad de la Empresa *</label>
                    <select
                      value={localChar.pesv.detallesPesv?.misionOrganizacional || 'TRANSPORTE_BIENES_PERSONAS'}
                      onChange={(e) => handleUpdate(prev => ({
                        ...prev,
                        pesv: {
                          ...prev.pesv,
                          detallesPesv: {
                            ...prev.pesv.detallesPesv!,
                            misionOrganizacional: e.target.value as any
                          }
                        }
                      }))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800"
                    >
                      <option value="TRANSPORTE_BIENES_PERSONAS">Misionalidad 1: Empresa de transporte (carga o pasajeros)</option>
                      <option value="APOYO_NO_TRANSPORTE">Misionalidad 2: Otra actividad que usa vehículos o conductores</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1 font-semibold">Total Vehículos Automotores + Motos *</label>
                    <input
                      type="number"
                      min={0}
                      value={localChar.pesv.detallesPesv?.numeroVehiculosTotal || 0}
                      onChange={(e) => handleUpdate(prev => ({
                        ...prev,
                        pesv: {
                          ...prev.pesv,
                          detallesPesv: {
                            ...prev.pesv.detallesPesv!,
                            numeroVehiculosTotal: Number(e.target.value)
                          }
                        }
                      }))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1 font-semibold">Total Conductores Activos *</label>
                    <input
                      type="number"
                      min={0}
                      value={localChar.pesv.detallesPesv?.numeroConductoresTotal || 0}
                      onChange={(e) => handleUpdate(prev => ({
                        ...prev,
                        pesv: {
                          ...prev.pesv,
                          detallesPesv: {
                            ...prev.pesv.detallesPesv!,
                            numeroConductoresTotal: Number(e.target.value)
                          }
                        }
                      }))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold text-sm"
                    />
                  </div>
                </div>

                {/* PESV classification (Res. 40595 de 2022) */}
                <div className={`p-4 rounded-xl border space-y-3 ${
                  pesvExplicacion.level === 'NO_APLICA' ? 'bg-slate-50 border-slate-200' : 'bg-white border-sky-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-sky-700 font-bold uppercase block">
                        Clasificación PESV (Res. 40595 de 2022)
                      </span>
                      <div className="text-base font-black text-slate-900 mt-0.5">
                        {pesvExplicacion.level === 'NO_APLICA'
                          ? 'No está obligada a implementar PESV'
                          : `Nivel ${pesvExplicacion.level === 'BASICO' ? 'Básico' : pesvExplicacion.level === 'ESTANDAR' ? 'Estándar' : 'Avanzado'} (${PESV_STEPS[pesvExplicacion.level]} pasos)`}
                      </div>
                      <span className="text-[11px] text-slate-600 block">{pesvExplicacion.reason}</span>
                    </div>
                    <span className={`self-start sm:self-center px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap border ${
                      pesvExplicacion.level === 'NO_APLICA' ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-sky-50 text-sky-700 border-sky-300'
                    }`}>
                      {pesvExplicacion.level === 'NO_APLICA' ? 'NO APLICA' : pesvExplicacion.level}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1.5">
                      Tabla para {esMision1 ? 'misionalidad 1 (empresas de transporte)' : 'misionalidad 2 (otra actividad que usa vehículos)'}:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {PESV_TIERS[esMision1 ? 'mision1' : 'mision2'].map(tier => {
                        const active = tier.level === pesvExplicacion.level;
                        return (
                          <div
                            key={tier.level}
                            className={`p-2.5 rounded-lg border text-[11px] ${
                              active ? 'bg-white border-sky-400 ring-2 ring-sky-100' : 'bg-white/50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <span className={`block font-black text-sm ${active ? 'text-sky-700' : ''}`}>
                              {tier.level === 'BASICO' ? 'Básico' : tier.level === 'ESTANDAR' ? 'Estándar' : 'Avanzado'} · {PESV_STEPS[tier.level]} pasos {active && '✓'}
                            </span>
                            <span className={active ? 'text-slate-700' : ''}>{tier.vehicles} vehículos o {tier.drivers} conductores</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==============================================================
            PASO 8: SISTEMAS ISO (9001, 14001, 45001)
        ============================================================== */}
        {activeWizardStep === 8 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-700" />
                Paso 8: Caracterización de Sistemas de Gestión ISO
              </h3>
              <p className="text-xs text-slate-500">
                Identifica si la organización requiere estructura de alto nivel (HLS) para ISO 9001, ISO 14001 o ISO 45001.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { key: 'tieneIso9001', label: 'ISO 9001 (Calidad)', desc: 'Gestión de procesos y satisfacción de clientes' },
                { key: 'tieneIso14001', label: 'ISO 14001 (Ambiental)', desc: 'Aspectos, impactos y ciclo de vida' },
                { key: 'tieneIso45001', label: 'ISO 45001 (SST)', desc: 'Estándar internacional de seguridad ocupacional' }
              ].map(({ key, label, desc }) => (
                <label key={key} className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  (localChar.iso as any)[key] ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900">{label}</span>
                    <input
                      type="checkbox"
                      checked={(localChar.iso as any)[key]}
                      onChange={(e) => handleUpdate(prev => ({
                        ...prev,
                        iso: { ...prev.iso, [key]: e.target.checked }
                      }))}
                      className="w-4 h-4 accent-indigo-500 rounded"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 block">{desc}</span>
                </label>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
              <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localChar.iso.deseaCertificarse}
                  onChange={(e) => handleUpdate(prev => ({
                    ...prev,
                    iso: { ...prev.iso, deseaCertificarse: e.target.checked }
                  }))}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <span>¿La organización planea implementar o certificarse en el próximo año?</span>
              </label>
              <p className="text-[11px] text-slate-500 pl-6">
                Permite preparar las auditorías internas integradas bajo la Estructura de Alto Nivel (HLS).
              </p>
            </div>
          </div>
        )}

        {/* ==============================================================
            PASO 9: MOTOR DE APLICABILIDAD (Resultados en Vivo)
        ============================================================== */}
        {activeWizardStep === 9 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-700" />
                  Paso 9: Motor de Aplicabilidad de AGAE (Análisis en Tiempo Real)
                </h3>
                <p className="text-xs text-slate-500">
                  Cruzamiento de variables: Características + Condiciones + Actividades = Aplicabilidad Normativa.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700">
                {applicabilityProfile.allRequirements.length} Requisitos Analizados
              </span>
            </div>

            {/* Status Breakdown Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="font-semibold text-emerald-700">APLICA</span>
                <span className="font-bold text-slate-900 text-sm">
                  {applicabilityProfile.allRequirements.filter(r => r.status === 'APLICA').length}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-500">NO APLICA</span>
                <span className="font-bold text-slate-900 text-sm">
                  {applicabilityProfile.allRequirements.filter(r => r.status === 'NO_APLICA').length}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
                <span className="font-semibold text-amber-700">REQUIERE VALIDACIÓN</span>
                <span className="font-bold text-slate-900 text-sm">
                  {applicabilityProfile.allRequirements.filter(r => r.status === 'REQUIERE_VALIDACION').length}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between">
                <span className="font-semibold text-rose-700">INF. INSUFICIENTE</span>
                <span className="font-bold text-slate-900 text-sm">
                  {applicabilityProfile.allRequirements.filter(r => r.status === 'INFORMACION_INSUFICIENTE').length}
                </span>
              </div>
            </div>

            {/* Evaluated Requirements Feed */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {applicabilityProfile.allRequirements.map(req => (
                <div key={req.id} className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{req.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.status === 'APLICA'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : req.status === 'NO_APLICA'
                        ? 'bg-slate-50 text-slate-500 border border-slate-300'
                        : req.status === 'REQUIERE_VALIDACION'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{req.reason}</p>
                  <span className="text-[10px] text-emerald-700 block font-mono">{req.legalCitation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==============================================================
            PASO 10: RECOMENDACIÓN COMERCIAL Y SELECCIÓN DE MÓDULOS
        ============================================================== */}
        {activeWizardStep === 10 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
                Paso 10: Recomendación Comercial y Selección de Compra
              </h3>
              <p className="text-xs text-slate-500">
                La recomendación no obliga al cliente a comprar todos los módulos. Seleccione los módulos a adquirir.
              </p>
            </div>

            <ProfessionalDisclaimer />

            {/* Modules Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {applicabilityProfile.evaluations.map(mod => {
                const isSelected = selectedModulesToBuy.includes(mod.module);
                return (
                  <div
                    key={mod.module}
                    onClick={() => toggleModuleSelection(mod.module)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/60 border-emerald-300 shadow-lg shadow-emerald-900/5'
                        : 'bg-white border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by parent onClick
                          className="w-4 h-4 accent-emerald-600 rounded"
                        />
                        <span className="font-bold text-slate-900 text-xs">{mod.moduleName}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mod.tier === 'NECESARIO'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : mod.tier === 'RECOMENDADO'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : mod.tier === 'OPCIONAL'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {mod.tier}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                      {mod.justification}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-mono text-[11px]">
                      <span className="text-slate-500">{mod.legalBasis}</span>
                      <span className="font-bold text-emerald-700">
                        ${mod.monthlyPriceCop.toLocaleString('es-CO')} COP/mes
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carbon footprint calculator (add-on) */}
            <div className={`p-4 rounded-xl border text-xs ${huellaPlan.incluidaSinCosto ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" /> Calculadora de Huella de Carbono (Alcances 1, 2 y 3)
                    {huellaRecomendada && !huellaPlan.habilitada && (
                      <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold uppercase">Recomendada</span>
                    )}
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">{huellaPlan.motivo}</span>
                </div>
                {huellaPlan.incluidaSinCosto ? (
                  <span className="shrink-0 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px]">Incluida sin costo</span>
                ) : huellaPlan.habilitada ? (
                  <span className="shrink-0 px-3 py-1 rounded-full bg-sky-600 text-white font-bold text-[11px]">Producto independiente</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleModuleSelection('HUELLA_CARBONO')}
                    className="shrink-0 px-3 py-1.5 rounded-full border border-emerald-400 text-emerald-700 font-bold text-[11px] hover:bg-emerald-50"
                  >
                    + Agregar calculadora (${HUELLA_CARBONO_PRECIO_MES.toLocaleString('es-CO')} COP/mes)
                  </button>
                )}
              </div>
            </div>

            {/* Selected Summary Banner */}
            <div className="p-4 rounded-xl bg-white border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] text-emerald-700 font-bold uppercase block">
                  Resumen de la Selección
                </span>
                <span className="text-sm font-bold text-slate-900">
                  Módulos: {selectedModulesToBuy.filter(m => m !== 'HUELLA_CARBONO').map(m => MODULE_LABELS[m]).join(' • ') || '—'}
                  {huellaPlan.habilitada && ` • Huella de carbono${huellaPlan.incluidaSinCosto ? ' (incluida)' : ''}`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Inversión Mensual Estimada:</span>
                <span className="text-base font-black text-emerald-700 font-mono">
                  ${monthlyTotal.toLocaleString('es-CO')} COP/mes
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPortalView('demo')}
                className="flex-1 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-700 font-bold text-xs border border-emerald-300 flex items-center justify-center gap-2 transition-all"
              >
                <Eye className="w-4 h-4 text-emerald-700" />
                <span>Explorar Demo Interactivo Personalizado</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(true)}
                className="flex-1 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Comprar Solución & Recibir Credenciales</span>
              </button>
            </div>
          </div>
        )}

        {/* ==============================================================
            PASO 11: CONFIGURACIÓN PERSONALIZADA & HABILITACIÓN (POST-COMPRA)
        ============================================================== */}
        {activeWizardStep === 11 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Paso 11: Transición & Habilitación de AGAE SOLUTIONS
              </h3>
              <p className="text-xs text-slate-500">
                La información obtenida durante la caracterización se convierte directamente en la base de configuración del sistema sin volver a diligenciar ningún dato.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border border-emerald-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    ¡Todo listo para adaptar y habilitar AGAE a {localChar.identification.razonSocial}!
                  </h4>
                  <p className="text-xs text-slate-500">
                    Se habilitarán únicamente los módulos adquiridos ({selectedModulesToBuy.map(m => MODULE_LABELS[m]).join(', ')}) adaptados a {localChar.size.numeroSedes} sede(s) y {localChar.size.totalTrabajadores} trabajadores.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Estándares SST</span>
                  <span className="font-bold text-slate-900">{localChar.calculatedSstStandards} Estándares</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Nivel PESV</span>
                  <span className="font-bold text-slate-900">{localChar.calculatedPesvLevel}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Sedes Conectadas</span>
                  <span className="font-bold text-slate-900">{localChar.sites.length} Operativas</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Módulos Activos</span>
                  <span className="font-bold text-emerald-700">{selectedModulesToBuy.length} Seleccionados</span>
                </div>
              </div>

              <ProfessionalDisclaimer variant="compact" className="text-slate-600" />

              {/* What the plan includes */}
              <div className="rounded-lg bg-white border border-slate-200 p-3 text-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-2">Qué incluye tu {planName(selectedModulesToBuy)}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {PLAN_ITEMS.map(item => {
                    const included = item.key === 'HUELLA'
                      ? huellaPlan.habilitada
                      : item.modules.some(m => selectedModulesToBuy.includes(m));
                    return (
                      <div key={item.key} className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md bg-slate-50">
                        <span className={included ? 'text-slate-800 font-semibold' : 'text-slate-400'}>{item.label}</span>
                        {included ? (
                          <span className="text-[10px] font-bold text-emerald-700">✓ Incluido</span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-500">No incluido · solo demo</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-[10px] text-slate-500">
                  Los módulos no incluidos se pueden explorar en modo demostración dentro de la plataforma, sin registrar información.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setPortalView('demo')}
                  className="flex-1 w-full py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-700 font-bold text-xs border border-emerald-300 flex items-center justify-center gap-2 transition-all"
                >
                  <Eye className="w-4 h-4 text-emerald-700" />
                  <span>Ver Demo Personalizado</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="flex-1 w-full py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Comprar & Enviar al Correo</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAndActivate}
                  className="flex-1 w-full py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs shadow-xl shadow-emerald-900/5 flex items-center justify-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  <span>Habilitar Directamente</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            disabled={activeWizardStep === 1}
            onClick={() => setActiveWizardStep(Math.max(1, activeWizardStep - 1))}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Paso Anterior</span>
          </button>

          <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
            Paso {activeWizardStep} de {steps.length}
          </span>

          {activeWizardStep < steps.length ? (
            <button
              onClick={() => setActiveWizardStep(Math.min(steps.length, activeWizardStep + 1))}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>Siguiente Paso</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleConfirmAndActivate}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Finalizar y Gestionar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
