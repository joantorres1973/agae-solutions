import type { ModuleType } from '@/types';
import type { CompanyCharacterization } from '@/types/characterization';

/**
 * Borrador de la caracterización guardado en el navegador del usuario, para que no
 * pierda lo diligenciado si cierra la página. Vive solo en ese navegador; cuando haya
 * cuentas en el servidor, el borrador se sincronizará allí.
 */
const KEY = 'agae-caracterizacion-borrador-v1';

export interface CharacterizationDraft {
  characterization: CompanyCharacterization;
  step: number;
  selectedModules?: ModuleType[];
  savedAt: string;
}

export function loadDraft(): CharacterizationDraft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as CharacterizationDraft;
    return draft?.characterization?.identification ? draft : null;
  } catch {
    return null;
  }
}

export function saveDraft(draft: Omit<CharacterizationDraft, 'savedAt'>): string | null {
  try {
    const savedAt = new Date().toISOString();
    const previous = loadDraft();
    localStorage.setItem(KEY, JSON.stringify({ ...previous, ...draft, savedAt }));
    return savedAt;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

export const formatSavedAt = (iso: string) =>
  new Date(iso).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
