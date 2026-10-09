import type { ModuleType } from '@/types';

/**
 * Reglas comerciales del plan AGAE Integral 360+.
 * Calculadora de huella de carbono (con informe PDF de emisiones):
 *  - Incluida sin costo con ISO 14001, o con Gestión Ambiental + al menos otro módulo.
 *  - También se vende sola, como producto independiente (módulo HUELLA_CARBONO).
 */

/** Precio mensual de la calculadora de huella de carbono como producto independiente (COP). Ajústalo aquí. */
export const HUELLA_CARBONO_PRECIO_MES = 180000;

export const MODULE_LABELS: Record<ModuleType, string> = {
  SST: 'SG-SST',
  ENVIRONMENTAL: 'Gestión Ambiental',
  PESV: 'Seguridad Vial (PESV)',
  ISO_9001: 'ISO 9001',
  ISO_14001: 'ISO 14001',
  ISO_45001: 'ISO 45001',
  HUELLA_CARBONO: 'Calculadora de Huella de Carbono',
  TRANSVERSAL: 'Transversal',
};

/** Modules that count towards the plan size (the standalone calculator is not a management module). */
const countBillableModules = (modules: ModuleType[]) =>
  modules.filter(m => m !== 'TRANSVERSAL' && m !== 'HUELLA_CARBONO').length;

export interface HuellaEnPlan {
  /** La calculadora queda habilitada en la plataforma. */
  habilitada: boolean;
  /** Incluida sin costo por las reglas del plan (no se cobra aparte). */
  incluidaSinCosto: boolean;
  motivo: string;
}

export function huellaCarbonoEnPlan(modules: ModuleType[]): HuellaEnPlan {
  if (modules.includes('ISO_14001')) {
    return { habilitada: true, incluidaSinCosto: true, motivo: 'Incluida sin costo con ISO 14001.' };
  }
  if (modules.includes('ENVIRONMENTAL') && countBillableModules(modules) >= 2) {
    return { habilitada: true, incluidaSinCosto: true, motivo: 'Incluida sin costo por contratar Gestión Ambiental junto con otro módulo.' };
  }
  if (modules.includes('HUELLA_CARBONO')) {
    return { habilitada: true, incluidaSinCosto: false, motivo: 'Contratada como producto independiente, con informe PDF de emisiones.' };
  }
  return {
    habilitada: false,
    incluidaSinCosto: false,
    motivo: 'No incluida. Se incluye sin costo con Gestión Ambiental + otro módulo o con ISO 14001, y también se puede contratar sola.',
  };
}

/** Modules that are actually charged: the standalone calculator is free when the plan already includes it. */
export const chargeableModules = (modules: ModuleType[]) =>
  huellaCarbonoEnPlan(modules.filter(m => m !== 'HUELLA_CARBONO')).incluidaSinCosto
    ? modules.filter(m => m !== 'HUELLA_CARBONO')
    : modules;

/** Plan gives access to waste, aspects and the rest of the environmental module (not only the calculator). */
export const hasEnvironmentalCore = (modules: ModuleType[]) =>
  modules.includes('ENVIRONMENTAL') || modules.includes('ISO_14001');

/** Módulo(s) del plan que dan acceso a cada sección de la plataforma. */
const TAB_MODULES: Record<string, ModuleType[]> = {
  sst: ['SST'],
  environmental: ['ENVIRONMENTAL', 'ISO_14001', 'HUELLA_CARBONO'],
  pesv: ['PESV'],
  iso: ['ISO_9001', 'ISO_14001', 'ISO_45001'],
};

export const tabModuleLabel = (tab: string) =>
  ({ sst: 'SG-SST', environmental: 'Gestión Ambiental', pesv: 'Seguridad Vial (PESV)', iso: 'Sistemas ISO' } as Record<string, string>)[tab];

/** true when the section belongs to a module the organization did not contract. */
export const isTabOutsidePlan = (tab: string, activeModules: ModuleType[]) => {
  const required = TAB_MODULES[tab];
  return !!required && !required.some(m => activeModules.includes(m));
};

/** Nombre del plan contratado para mostrar, p. ej. "plan SG-SST" o "plan SG-SST + PESV". */
export const planName = (activeModules: ModuleType[]) => {
  const names = activeModules.filter(m => m !== 'TRANSVERSAL').map(m => MODULE_LABELS[m]);
  return names.length ? `plan ${names.join(' + ')}` : 'plan actual';
};
