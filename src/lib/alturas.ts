/**
 * Trabajo en alturas según la Resolución 4272 de 2021 (MinTrabajo):
 * aplica a toda labor con riesgo de caída de 2,0 m o más sobre un nivel inferior.
 * En ese caso el empleador debe designar un coordinador de trabajo en alturas.
 */
export const ALTURA_MINIMA_RES_4272 = 2.0;

export type EvaluacionAltura =
  | { estado: 'SIN_DATO' }
  | { estado: 'NO_APLICA'; altura: number }
  | { estado: 'APLICA'; altura: number };

/** Acepta "8,5" o "8.5". */
export const parseAltura = (valor: string): number => {
  const n = Number(valor.replace(',', '.').trim());
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export function evaluarAltura(alturaMetros: number | undefined): EvaluacionAltura {
  if (!alturaMetros || alturaMetros <= 0) return { estado: 'SIN_DATO' };
  return alturaMetros >= ALTURA_MINIMA_RES_4272
    ? { estado: 'APLICA', altura: alturaMetros }
    : { estado: 'NO_APLICA', altura: alturaMetros };
}

export const formatoAltura = (m: number) => `${m.toLocaleString('es-CO', { maximumFractionDigits: 2 })} m`;
