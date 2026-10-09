import type { EconomicSector } from '@/types/characterization';

/** Sectores disponibles en la caracterización (orden en que se muestran). */
export const ECONOMIC_SECTORS: { value: EconomicSector; label: string }[] = [
  { value: 'AGROPECUARIO', label: 'Agropecuario, Forestal y Pesca' },
  { value: 'MINERIA_ENERGIA', label: 'Minería, Hidrocarburos y Energía' },
  { value: 'MANUFACTURA', label: 'Industria Manufacturera' },
  { value: 'SERVICIOS_PUBLICOS', label: 'Agua, Saneamiento y Gestión de Residuos' },
  { value: 'CONSTRUCCION', label: 'Construcción y Obras Civiles' },
  { value: 'COMERCIO', label: 'Comercio Mayorista / Minorista' },
  { value: 'TRANSPORTE', label: 'Transporte y Almacenamiento' },
  { value: 'LOGISTICA', label: 'Logística y Distribución' },
  { value: 'ALOJAMIENTO_ALIMENTACION', label: 'Alojamiento y Servicios de Comida' },
  { value: 'TECNOLOGIA', label: 'Tecnología y Comunicaciones' },
  { value: 'FINANCIERO', label: 'Financiero, Seguros e Inmobiliario' },
  { value: 'SERVICIOS', label: 'Servicios Profesionales y Consultoría' },
  { value: 'ADMINISTRACION_PUBLICA', label: 'Administración Pública y Defensa' },
  { value: 'EDUCACION', label: 'Educación' },
  { value: 'SALUD', label: 'Salud y Atención Médica' },
  { value: 'ARTE_RECREACION', label: 'Arte, Entretenimiento y Recreación' },
  { value: 'OTRO', label: 'Otro (especificar)' },
];

export const sectorLabel = (sector: EconomicSector, otro?: string) =>
  sector === 'OTRO' && otro ? otro : ECONOMIC_SECTORS.find(s => s.value === sector)?.label ?? sector;

/** Secciones de la CIIU Rev. 4 A.C. (DANE, Colombia) por rango de división (2 primeros dígitos). */
const CIIU_SECTIONS: { section: string; name: string; from: number; to: number; sector: EconomicSector }[] = [
  { section: 'A', name: 'Agricultura, ganadería, caza, silvicultura y pesca', from: 1, to: 3, sector: 'AGROPECUARIO' },
  { section: 'B', name: 'Explotación de minas y canteras', from: 5, to: 9, sector: 'MINERIA_ENERGIA' },
  { section: 'C', name: 'Industrias manufactureras', from: 10, to: 33, sector: 'MANUFACTURA' },
  { section: 'D', name: 'Suministro de electricidad, gas, vapor y aire acondicionado', from: 35, to: 35, sector: 'MINERIA_ENERGIA' },
  { section: 'E', name: 'Distribución de agua; evacuación y tratamiento de aguas residuales, gestión de desechos', from: 36, to: 39, sector: 'SERVICIOS_PUBLICOS' },
  { section: 'F', name: 'Construcción', from: 41, to: 43, sector: 'CONSTRUCCION' },
  { section: 'G', name: 'Comercio al por mayor y al por menor; reparación de vehículos', from: 45, to: 47, sector: 'COMERCIO' },
  { section: 'H', name: 'Transporte y almacenamiento', from: 49, to: 53, sector: 'TRANSPORTE' },
  { section: 'I', name: 'Alojamiento y servicios de comida', from: 55, to: 56, sector: 'ALOJAMIENTO_ALIMENTACION' },
  { section: 'J', name: 'Información y comunicaciones', from: 58, to: 63, sector: 'TECNOLOGIA' },
  { section: 'K', name: 'Actividades financieras y de seguros', from: 64, to: 66, sector: 'FINANCIERO' },
  { section: 'L', name: 'Actividades inmobiliarias', from: 68, to: 68, sector: 'FINANCIERO' },
  { section: 'M', name: 'Actividades profesionales, científicas y técnicas', from: 69, to: 75, sector: 'SERVICIOS' },
  { section: 'N', name: 'Actividades de servicios administrativos y de apoyo', from: 77, to: 82, sector: 'SERVICIOS' },
  { section: 'O', name: 'Administración pública y defensa; seguridad social obligatoria', from: 84, to: 84, sector: 'ADMINISTRACION_PUBLICA' },
  { section: 'P', name: 'Educación', from: 85, to: 85, sector: 'EDUCACION' },
  { section: 'Q', name: 'Actividades de atención de la salud humana y de asistencia social', from: 86, to: 88, sector: 'SALUD' },
  { section: 'R', name: 'Actividades artísticas, de entretenimiento y recreación', from: 90, to: 93, sector: 'ARTE_RECREACION' },
  { section: 'S', name: 'Otras actividades de servicios', from: 94, to: 96, sector: 'SERVICIOS' },
  { section: 'T', name: 'Actividades de los hogares como empleadores', from: 97, to: 98, sector: 'OTRO' },
  { section: 'U', name: 'Actividades de organizaciones y entidades extraterritoriales', from: 99, to: 99, sector: 'OTRO' },
];

export interface CiiuMatch {
  section: string;
  name: string;
  sector: EconomicSector;
}

/** Sección y sector que corresponden a un código CIIU (p. ej. "4923" → H, Transporte). */
export function classifyCiiu(code: string): CiiuMatch | null {
  const digits = code.replace(/\D/g, '');
  if (digits.length < 2) return null;
  const division = Number(digits.slice(0, 2));
  const match = CIIU_SECTIONS.find(s => division >= s.from && division <= s.to);
  return match ? { section: match.section, name: match.name, sector: match.sector } : null;
}
