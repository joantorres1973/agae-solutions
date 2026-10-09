import { HUELLA_CARBONO_PRECIO_MES } from './plan-rules';
import { evaluarAltura, formatoAltura } from './alturas';
import {
  CompanyCharacterization,
  StructuredVariablesRecord,
  ApplicabilityStatus,
  ModuleRecommendationTier,
  RequirementEvaluation,
  ModuleEvaluation,
  CommercialProposal,
  CharacterizationVersion
} from '@/types/characterization';
import { ModuleType, PesvLevel, SstStandardCount } from '@/types';

// ==============================================================
// 1. CONVERTIDOR DE CARACTERIZACIÓN A VARIABLES ESTRUCTURADAS
// ==============================================================
export function extractStructuredVariables(c: CompanyCharacterization): StructuredVariablesRecord {
  const { identification, size, operational, highRisk, environmental, pesv, iso, sst } = c;

  const totalVehicles = pesv.utilizaVehiculosParaActividades && pesv.detallesPesv 
    ? pesv.detallesPesv.numeroVehiculosTotal 
    : 0;
  
  const totalDrivers = pesv.utilizaVehiculosParaActividades && pesv.detallesPesv
    ? pesv.detallesPesv.numeroConductoresTotal
    : 0;

  const heavyVehicles = pesv.utilizaVehiculosParaActividades && pesv.detallesPesv
    ? pesv.detallesPesv.tiposFlota.vehiculosPesados
    : 0;

  const motorcycles = pesv.utilizaVehiculosParaActividades && pesv.detallesPesv
    ? pesv.detallesPesv.tiposFlota.motocicletas
    : 0;

  const isTransportMission = pesv.utilizaVehiculosParaActividades && pesv.detallesPesv
    ? pesv.detallesPesv.misionOrganizacional === 'TRANSPORTE_BIENES_PERSONAS'
    : false;

  const respelKg = environmental.generaResiduosPeligrosos && environmental.detallesRespel
    ? environmental.detallesRespel.volumenKgMes
    : 0;

  // Composite label of operations
  const operationsArray: string[] = [];
  if (operational.actividadesAdministrativas) operationsArray.push('Administrativa');
  if (operational.actividadesOperativas) operationsArray.push('Operativa');
  if (operational.actividadesProductivas) operationsArray.push('Productiva');
  if (operational.actividadesLogisticas) operationsArray.push('Logística');
  if (operational.transporte) operationsArray.push('Transporte');
  if (operational.trabajoEnCampo) operationsArray.push('Campo');

  return {
    numero_trabajadores: size.totalTrabajadores,
    numero_trabajadores_directos: size.trabajadoresDirectos,
    numero_contratistas: size.contratistas,
    numero_sedes: size.numeroSedes,
    codigo_ciiu: identification.codigoCiiu,
    clase_riesgo_arl: sst.claseRiesgoArl,
    sector_economico: identification.sectorEconomico,
    
    tiene_turnos: size.tieneTurnos,
    tiene_trabajo_nocturno: size.tieneTrabajoNocturno,
    tiene_trabajadores_remotos: size.tieneTrabajadoresRemotos,
    tiene_trabajadores_campo: size.tieneTrabajadoresEnCampo,
    tiene_contratistas: size.contratistas > 0,
    
    trabajo_alturas: highRisk.trabajoAlturas,
    altura_maxima_metros: highRisk.detallesAlturas?.alturaMaximaMetros ?? 0,
    trabajo_caliente: !!highRisk.trabajoCaliente,
    espacios_confinados: highRisk.espaciosConfinados,
    manejo_sustancias_quimicas: highRisk.manejoSustanciasQuimicas,
    manejo_maquinaria_pesada: highRisk.manejoMaquinaria,
    trabajo_via_publica: operational.trabajoViaPublica,
    
    genera_residuos_ordinarios: environmental.generaResiduosOrdinarios,
    genera_residuos_aprovechables: environmental.generaResiduosAprovechables,
    genera_respel: environmental.generaResiduosPeligrosos,
    respel_kg_mes: respelKg,
    genera_raee: environmental.generaRaee,
    maneja_baterias: environmental.generaManejaBaterias,
    genera_aceites_usados: environmental.generaAceitesUsados,
    utiliza_combustibles: environmental.utilizaCombustibles,
    consume_agua: environmental.consumeAgua,
    tiene_vertimientos: environmental.generaVertimientos,
    tipo_vertimiento: environmental.generaVertimientos && environmental.detallesVertimientos 
      ? environmental.detallesVertimientos.tipoVertimiento 
      : 'NO_APLICA',
    tiene_emisiones_atmosfericas: environmental.generaEmisionesAtmosfericas,
    tiene_permisos_ambientales: environmental.tienePermisosAmbientales,
    tiene_licencias_ambientales: environmental.tieneLicenciasAmbientales,
    tiene_reportes_rua: environmental.tieneRegistrosReportesAmbientales,
    
    tiene_vehiculos: pesv.utilizaVehiculosParaActividades,
    mision_transporte: isTransportMission,
    total_vehiculos: totalVehicles,
    total_conductores: totalDrivers,
    vehiculos_pesados: heavyVehicles,
    motocicletas: motorcycles,
    transporte_mercancias: pesv.utilizaVehiculosParaActividades && !!pesv.detallesPesv?.operaciones.transporteMercancias,
    transporte_pasajeros: pesv.utilizaVehiculosParaActividades && !!pesv.detallesPesv?.operaciones.transportePasajeros,
    transporte_quimicos_peligrosos: pesv.utilizaVehiculosParaActividades && !!pesv.detallesPesv?.operaciones.transporteSustanciasPeligrosas,
    
    tiene_iso_9001: iso.tieneIso9001,
    tiene_iso_14001: iso.tieneIso14001,
    tiene_iso_45001: iso.tieneIso45001,
    sistema_integrado: iso.tieneSistemaIntegrado,
    desea_certificarse: iso.deseaCertificarse,
    
    tipo_operacion: operationsArray.join(' + ') || 'Administrativa'
  };
}

// ==============================================================
// 2. CÁLCULO DE ESTÁNDARES SST (Resolución 0312 de 2019)
// ==============================================================
export function calculateSstStandardsCount(workers: number, risk: 1 | 2 | 3 | 4 | 5): SstStandardCount {
  // Regla estricta Resolución 0312 de 2019:
  // Si la empresa tiene Riesgo IV o V, OBLIGATORIAMENTE le aplican los 60 Estándares, sin importar cuántos trabajadores tenga!
  if (risk >= 4) {
    return 60;
  }
  // Si Riesgo es I, II o III:
  if (workers <= 10) {
    return 7;
  }
  if (workers <= 50) {
    return 21;
  }
  return 60;
}

/** Explicación legal del grupo de estándares que aplica (Res. 0312 de 2019). */
export function explainSstStandards(workers: number, risk: number): { count: SstStandardCount; article: string; reason: string } {
  const riesgo = ['I', 'II', 'III', 'IV', 'V'][risk - 1] ?? String(risk);
  if (risk >= 4) {
    return {
      count: 60,
      article: 'Res. 0312 de 2019, Art. 16',
      reason: `Clase de riesgo ${riesgo}: las empresas con riesgo IV o V deben cumplir los 60 estándares sin importar su número de trabajadores.`,
    };
  }
  if (workers <= 10) {
    return {
      count: 7,
      article: 'Res. 0312 de 2019, Art. 3',
      reason: `${workers} trabajador(es) y clase de riesgo ${riesgo}: empresas de 10 o menos trabajadores con riesgo I, II o III.`,
    };
  }
  if (workers <= 50) {
    return {
      count: 21,
      article: 'Res. 0312 de 2019, Art. 9',
      reason: `${workers} trabajadores y clase de riesgo ${riesgo}: empresas de 11 a 50 trabajadores con riesgo I, II o III.`,
    };
  }
  return {
    count: 60,
    article: 'Res. 0312 de 2019, Art. 16',
    reason: `${workers} trabajadores: las empresas de más de 50 trabajadores deben cumplir los 60 estándares, cualquiera sea su clase de riesgo.`,
  };
}

/** Recalcula los valores derivados (estándares SST, nivel PESV, variables) después de cualquier cambio. */
export function withDerivedValues(c: CompanyCharacterization): CompanyCharacterization {
  return {
    ...c,
    structuredVariables: extractStructuredVariables(c),
    calculatedSstStandards: calculateSstStandardsCount(c.size.totalTrabajadores, c.sst.claseRiesgoArl),
    calculatedPesvLevel: calculatePesvLevel(
      c.pesv.utilizaVehiculosParaActividades,
      c.pesv.detallesPesv?.misionOrganizacional === 'TRANSPORTE_BIENES_PERSONAS',
      c.pesv.detallesPesv?.numeroVehiculosTotal || 0,
      c.pesv.detallesPesv?.numeroConductoresTotal || 0
    ) as CompanyCharacterization['calculatedPesvLevel'],
  };
}

// ==============================================================
// 3. CÁLCULO DE NIVEL PESV (Resolución 40595 de 2022)
// ==============================================================
/** Pasos de la metodología PESV que implementa cada nivel. */
export const PESV_STEPS: Record<PesvLevel, number> = { BASICO: 12, ESTANDAR: 20, AVANZADO: 24 };

/**
 * Tabla de clasificación de la Res. 40595 de 2022 (MinTransporte), según la misionalidad:
 *  - Misionalidad 1: organizaciones cuya actividad es el transporte (servicio de transporte de pasajeros o carga).
 *  - Misionalidad 2: organizaciones de otra actividad que usan vehículos o conductores para cumplir sus fines.
 * Si no se alcanza el mínimo del nivel básico (más de 10 vehículos o 2 o más conductores), no está obligada a un PESV.
 */
export const PESV_TIERS = {
  mision1: [
    { level: 'BASICO' as PesvLevel, vehicles: '11 a 19', drivers: '2 a 19' },
    { level: 'ESTANDAR' as PesvLevel, vehicles: '20 a 50', drivers: '20 a 50' },
    { level: 'AVANZADO' as PesvLevel, vehicles: 'Más de 50', drivers: 'Más de 50' },
  ],
  mision2: [
    { level: 'BASICO' as PesvLevel, vehicles: '11 a 49', drivers: '2 a 49' },
    { level: 'ESTANDAR' as PesvLevel, vehicles: '50 a 100', drivers: '50 a 100' },
    { level: 'AVANZADO' as PesvLevel, vehicles: 'Más de 100', drivers: 'Más de 100' },
  ],
};

export function calculatePesvLevel(
  hasVehicles: boolean,
  isMissionTransport: boolean,
  vehiclesCount: number,
  driversCount: number
): PesvLevel | 'NO_APLICA' {
  if (!hasVehicles) return 'NO_APLICA';
  const v = vehiclesCount || 0;
  const d = driversCount || 0;
  // The level is set by whichever criterion (vehicles or drivers) is higher.
  const [estandar, avanzado] = isMissionTransport ? [20, 51] : [50, 101];
  if (v >= avanzado || d >= avanzado) return 'AVANZADO';
  if (v >= estandar || d >= estandar) return 'ESTANDAR';
  if (v >= 11 || d >= 2) return 'BASICO';
  return 'NO_APLICA';
}

/** Explicación legal del nivel PESV calculado. */
export function explainPesvLevel(hasVehicles: boolean, isMissionTransport: boolean, vehicles: number, drivers: number) {
  const level = calculatePesvLevel(hasVehicles, isMissionTransport, vehicles, drivers);
  const mision = isMissionTransport ? 'misionalidad 1 (transporte)' : 'misionalidad 2 (otra actividad que usa vehículos)';
  const datos = `${vehicles || 0} vehículo(s) y ${drivers || 0} conductor(es)`;
  if (!hasVehicles) {
    return { level, reason: 'La organización no utiliza vehículos ni conductores para sus actividades: no está obligada a implementar un PESV.' };
  }
  if (level === 'NO_APLICA') {
    return {
      level,
      reason: `Con ${datos} no se alcanza el mínimo de la Res. 40595 (más de 10 vehículos o 2 o más conductores): no está obligada a implementar un PESV. El riesgo vial se gestiona dentro del SG-SST (matriz de peligros).`,
    };
  }
  return {
    level,
    reason: `Con ${datos} y ${mision}, corresponde el nivel ${level === 'BASICO' ? 'básico' : level === 'ESTANDAR' ? 'estándar' : 'avanzado'} (${PESV_STEPS[level]} pasos). El nivel lo define el mayor entre vehículos y conductores.`,
  };
}

// ==============================================================
// 4. MOTOR CENTRAL DE EVALUACIÓN DE APLICABILIDAD
// ==============================================================
export function evaluateApplicability(c: CompanyCharacterization): {
  evaluations: ModuleEvaluation[];
  allRequirements: RequirementEvaluation[];
  proposal: CommercialProposal;
} {
  const vars = extractStructuredVariables(c);
  const allRequirements: RequirementEvaluation[] = [];

  // -------------------------------------------------------------
  // A. EVALUACIÓN SG-SST (Dec 1072/15 & Res 0312/19)
  // -------------------------------------------------------------
  const sstReqs: RequirementEvaluation[] = [];
  const sstStandardsCount = calculateSstStandardsCount(vars.numero_trabajadores, vars.clase_riesgo_arl);

  // Verificación de completitud de datos básicos
  const sstHasMissingData = !vars.codigo_ciiu || vars.numero_trabajadores <= 0;
  const sstStatus: ApplicabilityStatus = sstHasMissingData ? 'INFORMACION_INSUFICIENTE' : 'APLICA';

  sstReqs.push({
    id: 'req-sst-res0312',
    code: 'RES-0312-2019',
    standardOrNorm: 'Resolución 0312 de 2019',
    name: `Estándares Mínimos del SG-SST (${sstStandardsCount} Estándares)`,
    category: 'SST',
    status: sstStatus,
    reason: explainSstStandards(vars.numero_trabajadores, vars.clase_riesgo_arl).reason,
    triggeringVariables: {
      numero_trabajadores: vars.numero_trabajadores,
      clase_riesgo_arl: vars.clase_riesgo_arl,
      estandares_calculados: sstStandardsCount
    },
    missingInformation: sstHasMissingData ? ['Código CIIU', 'Número de trabajadores mayor a 0'] : undefined,
    legalCitation: explainSstStandards(vars.numero_trabajadores, vars.clase_riesgo_arl).article,
    actionRequired: `Parametrizar matriz de ${sstStandardsCount} estándares y asignar responsable idóneo.`
  });

  sstReqs.push({
    id: 'req-sst-dec1072',
    code: 'DEC-1072-2015',
    standardOrNorm: 'Decreto 1072 de 2015',
    name: 'Implementación Obligatoria del SG-SST (Libro 2, Parte 2, Título 4, Cap 6)',
    category: 'SST',
    status: 'APLICA',
    reason: 'De obligatorio cumplimiento para todo empleador público o privado en territorio colombiano.',
    triggeringVariables: { total_trabajadores: vars.numero_trabajadores },
    legalCitation: 'Decreto 1072 de 2015 Art. 2.2.4.6.1 al 2.2.4.6.37',
    actionRequired: 'Diseño, ejecución, auditoría y revisión por la alta dirección del SG-SST.'
  });

  // Condicional: Trabajo en Alturas (Res. 4272/2021 aplica desde 2,0 m)
  const alturaEval = evaluarAltura(vars.altura_maxima_metros);
  if (vars.trabajo_alturas && alturaEval.estado === 'NO_APLICA') {
    sstReqs.push({
      id: 'req-sst-alturas-menor',
      code: 'RES-4272-2021',
      standardOrNorm: 'Resolución 4272 de 2021',
      name: 'Programa de Prevención y Protección contra Caídas en Alturas',
      category: 'SST',
      status: 'NO_APLICA',
      reason: `La altura máxima declarada (${formatoAltura(alturaEval.altura)}) es menor a 2,0 m: no se considera trabajo en alturas y no requiere coordinador de trabajo en alturas. Se gestiona como riesgo de caída a nivel con medidas de prevención generales.`,
      triggeringVariables: { trabajo_alturas: true, altura_maxima_metros: alturaEval.altura },
      legalCitation: 'Resolución 4272 de 2021 Ministerio del Trabajo',
      actionRequired: 'Incluir el riesgo de caída en la matriz de peligros (GTC 45) y conservar el registro de no aplicabilidad.'
    });
  } else if (vars.trabajo_alturas) {
    sstReqs.push({
      id: 'req-sst-alturas',
      code: 'RES-4272-2021',
      standardOrNorm: 'Resolución 4272 de 2021',
      name: 'Programa de Prevención y Protección contra Caídas en Alturas',
      category: 'SST',
      status: 'APLICA',
      reason: `La organización declaró labores en alturas${alturaEval.estado === 'APLICA' ? ` de hasta ${formatoAltura(alturaEval.altura)}` : ''} (>= 2,0 m). Requiere coordinador de trabajo en alturas designado, trabajadores con certificado de competencia, inventario de puntos de anclaje, inspección de equipos y permisos de trabajo.`,
      triggeringVariables: { trabajo_alturas: true, altura_maxima_metros: vars.altura_maxima_metros },
      legalCitation: 'Resolución 4272 de 2021 Ministerio del Trabajo',
      actionRequired: 'Habilitar módulo de permisos de trabajo en alturas, inspección de EPP y vigencia de certificados.'
    });
  } else {
    sstReqs.push({
      id: 'req-sst-alturas-no',
      code: 'RES-4272-2021',
      standardOrNorm: 'Resolución 4272 de 2021',
      name: 'Programa de Prevención contra Caídas en Alturas',
      category: 'SST',
      status: 'NO_APLICA',
      reason: 'La organización declaró no realizar actividades a alturas superiores a 2.00 metros.',
      triggeringVariables: { trabajo_alturas: false },
      legalCitation: 'Resolución 4272 de 2021',
      actionRequired: 'Conservar registro de no aplicabilidad justificada en la plataforma.'
    });
  }

  // Condicional: Trabajo en Caliente
  if (vars.trabajo_caliente) {
    sstReqs.push({
      id: 'req-sst-caliente',
      code: 'TRABAJO-CALIENTE',
      standardOrNorm: 'Resolución 2400 de 1979 / Decreto 1072 de 2015',
      name: 'Control de Trabajos en Caliente (Soldadura, Corte y Esmerilado)',
      category: 'SST',
      status: 'APLICA',
      reason: 'La organización realiza labores que generan calor, chispas o llama abierta. Requiere permiso de trabajo en caliente, vigía de fuego, control de materiales combustibles, extintores y EPP específico.',
      triggeringVariables: { trabajo_caliente: true },
      legalCitation: 'Resolución 2400 de 1979 (soldadura y corte de metales) · Decreto 1072 de 2015 Art. 2.2.4.6.24',
      actionRequired: 'Habilitar permisos de trabajo en caliente, inspección de equipos de soldadura y control de extintores.'
    });
  }

  // Condicional: Espacios Confinados
  if (vars.espacios_confinados) {
    sstReqs.push({
      id: 'req-sst-confinados',
      code: 'RES-0491-2020',
      standardOrNorm: 'Resolución 0491 de 2020',
      name: 'Gestión y Seguridad en Trabajos en Espacios Confinados',
      category: 'SST',
      status: 'APLICA',
      reason: 'Se realizan labores en tanques, silos, cajas o espacios con atmósfera potencialmente peligrosa. Requiere medición previa, vigía y equipos de rescate.',
      triggeringVariables: { espacios_confinados: true },
      legalCitation: 'Resolución 0491 de 2020 MinTrabajo',
      actionRequired: 'Habilitar permisos de entrada, calibración de detectores de gases y roles de rescate.'
    });
  }

  // Condicional: Manejo de Químicos (SGA)
  if (vars.manejo_sustancias_quimicas) {
    sstReqs.push({
      id: 'req-sst-quimicos-sga',
      code: 'DEC-1496-2018',
      standardOrNorm: 'Decreto 1496 de 2018',
      name: 'Sistema Globalmente Armonizado (SGA) para Sustancias Químicas',
      category: 'SST',
      status: 'APLICA',
      reason: 'Uso de sustancias químicas en la operación. Obligatoriedad de fichas FDS en 16 secciones, etiquetado y matriz de compatibilidad.',
      triggeringVariables: { manejo_sustancias_quimicas: true },
      legalCitation: 'Decreto 1496 de 2018 & Res 773 de 2021',
      actionRequired: 'Cargar inventario químico y matrices de incompatibilidad en módulo de activos.'
    });
  }

  // Condicional: Teletrabajo / Remoto
  if (vars.tiene_trabajadores_remotos) {
    sstReqs.push({
      id: 'req-sst-remoto',
      code: 'LEY-2088-2021',
      standardOrNorm: 'Ley 2088 de 2021 / Dec 1227 de 2022',
      name: 'Gestión SST para Trabajo en Casa y Teletrabajo',
      category: 'SST',
      status: 'APLICA',
      reason: 'Cuenta con personal en modalidad remota o híbrida. Requiere autoevaluación ergonómica y reporte a la ARL.',
      triggeringVariables: { tiene_trabajadores_remotos: true },
      legalCitation: 'Ley 2088 de 2021 & Decreto 1227 de 2022',
      actionRequired: 'Inspección periódica de puestos remotos y política de desconexión laboral.'
    });
  }

  // Condicional: Multi-Sedes
  if (vars.numero_sedes > 1) {
    sstReqs.push({
      id: 'req-sst-multisede',
      code: 'DEC-1072-SEDES',
      standardOrNorm: 'Decreto 1072 de 2015 Art. 2.2.4.6.8',
      name: 'Gestión Multi-Sede y Cobertura Integral de Centros de Trabajo',
      category: 'SST',
      status: 'APLICA',
      reason: `La organización cuenta con ${vars.numero_sedes} sedes operativas. Cada sede debe contar con identificación de peligros localizada y vigías o delegados de COPASST.`,
      triggeringVariables: { numero_sedes: vars.numero_sedes },
      legalCitation: 'Decreto 1072 de 2015 Art. 2.2.4.6.8 Parágrafo 1',
      actionRequired: 'Configurar inspecciones y planes de emergencia independientes por sede.'
    });
  }

  // -------------------------------------------------------------
  // B. EVALUACIÓN GESTIÓN AMBIENTAL & HUELLA CO2 (Dec 1076/15)
  // -------------------------------------------------------------
  const envReqs: RequirementEvaluation[] = [];

  // PGIRS Ordinarios y Aprovechables
  envReqs.push({
    id: 'req-amb-pgirs',
    code: 'RES-2184-2019',
    standardOrNorm: 'Resolución 2184 de 2019',
    name: 'Código de Colores y Plan de Gestión Integral de Residuos Sólidos (PGIRS)',
    category: 'ENVIRONMENTAL',
    status: 'APLICA',
    reason: 'Todo generador de residuos en Colombia debe aplicar el código unificado de colores (blanco, negro, verde) y trazabilidad.',
    triggeringVariables: { genera_ordinarios: vars.genera_residuos_ordinarios, genera_aprovechables: vars.genera_residuos_aprovechables },
    legalCitation: 'Resolución 2184 de 2019 Ministerio de Ambiente',
    actionRequired: 'Llevar bitácora mensual de pesajes y certificados con asociaciones de recicladores.'
  });

  // Condicional: RESPEL
  if (vars.genera_respel) {
    const isBigGenerator = vars.respel_kg_mes >= 100;
    envReqs.push({
      id: 'req-amb-respel',
      code: 'DEC-1076-RESPEL',
      standardOrNorm: 'Decreto 1076 de 2015 Libro 2 Parte 2 Título 6',
      name: 'Plan de Gestión Integral de Residuos Peligrosos (RESPEL)',
      category: 'ENVIRONMENTAL',
      status: 'APLICA',
      reason: `Genera ${vars.respel_kg_mes} kg/mes de residuos peligrosos. Requiere almacenamiento con contención, etiquetado, gestor autorizado y certificados de disposición final. ${isBigGenerator ? 'Debe registrarse obligatoriamente en el aplicativo RUA-RESPEL ante la autoridad ambiental.' : ''}`,
      triggeringVariables: { genera_respel: true, respel_kg_mes: vars.respel_kg_mes },
      legalCitation: 'Decreto 1076 de 2015 Arts. 2.2.6.1.1.1 al 2.2.6.1.3.1',
      actionRequired: 'Registrar bitácora mensual, certificados de disposición y manifiestos de transporte.'
    });
  } else {
    envReqs.push({
      id: 'req-amb-respel-no',
      code: 'DEC-1076-RESPEL',
      standardOrNorm: 'Decreto 1076 de 2015',
      name: 'Gestión de Residuos Peligrosos (RESPEL)',
      category: 'ENVIRONMENTAL',
      status: 'NO_APLICA',
      reason: 'La organización declaró no generar residuos con características de peligrosidad (CRETIB).',
      triggeringVariables: { genera_respel: false },
      legalCitation: 'Decreto 1076 de 2015',
      actionRequired: 'Mantener registro formal de no aplicabilidad.'
    });
  }

  // Condicional: Vertimientos
  if (vars.tiene_vertimientos) {
    envReqs.push({
      id: 'req-amb-vertimientos',
      code: 'RES-0631-2015',
      standardOrNorm: 'Resolución 0631 de 2015',
      name: 'Control y Caracterización de Vertimientos a Red o Cuerpo de Agua',
      category: 'ENVIRONMENTAL',
      status: 'APLICA',
      reason: `Genera vertimientos de tipo ${vars.tipo_vertimiento}. Requiere cumplir parámetros fisicoquímicos de la norma y trampa de grasas/pretratamiento.`,
      triggeringVariables: { tiene_vertimientos: true, tipo: vars.tipo_vertimiento },
      legalCitation: 'Decreto 1076 de 2015 Art. 2.2.3.3.5.1 & Res 0631/15',
      actionRequired: 'Monitorear muestreos periódicos y vigencia de permiso de vertimientos.'
    });
  } else {
    envReqs.push({
      id: 'req-amb-vertimientos-no',
      code: 'RES-0631-2015',
      standardOrNorm: 'Resolución 0631 de 2015',
      name: 'Permiso y Control de Vertimientos No Domésticos',
      category: 'ENVIRONMENTAL',
      status: 'NO_APLICA',
      reason: 'Solo realiza descargas domésticas estándar al alcantarillado municipal o no genera efluentes industriales.',
      triggeringVariables: { tiene_vertimientos: false },
      legalCitation: 'Decreto 1076 de 2015',
      actionRequired: 'Registro archivado en ficha técnica.'
    });
  }

  // Condicional: Emisiones
  if (vars.tiene_emisiones_atmosfericas) {
    envReqs.push({
      id: 'req-amb-emisiones',
      code: 'RES-0909-2008',
      standardOrNorm: 'Resolución 0909 de 2008',
      name: 'Control de Emisiones en Fuentes Fijas Industriales',
      category: 'ENVIRONMENTAL',
      status: 'APLICA',
      reason: 'Cuenta con calderas, hornos o grupos electrógenos. Requiere ductos normativos y evaluación isocinética.',
      triggeringVariables: { tiene_emisiones: true },
      legalCitation: 'Resolución 0909 de 2008 & Decreto 1076 de 2015',
      actionRequired: 'Registrar inventario de fuentes fijas y certificados de emisiones.'
    });
  }

  // Huella de Carbono (ISO 14064): not a general legal obligation, validated with the client.
  const huella = c.environmental.necesitaHuellaCarbono;
  if (huella !== 'NO') {
    envReqs.push({
      id: 'req-amb-ghg',
      code: 'ISO-14064-GHG',
      standardOrNorm: 'ISO 14064-1:2018 / GHG Protocol',
      name: 'Cuantificación y Gestión de Huella de Carbono (Alcances 1, 2 y 3)',
      category: 'ENVIRONMENTAL',
      status: huella === 'EXIGIDA' ? 'APLICA' : 'REQUIERE_VALIDACION',
      reason: huella === 'EXIGIDA'
        ? 'La organización indicó que clientes, licitaciones o casa matriz le exigen medir y reportar su huella de carbono.'
        : huella === 'VOLUNTARIA'
        ? 'La organización desea medir su huella de carbono por iniciativa propia. No es una obligación legal general; se valida con el cliente.'
        : 'No es una obligación legal general para las empresas. Validar con el cliente si clientes, licitaciones o casa matriz le exigen medir su huella de carbono.',
      triggeringVariables: { necesita_huella_carbono: huella ?? 'SIN_RESPUESTA', utiliza_combustibles: vars.utiliza_combustibles },
      legalCitation: 'ISO 14064-1:2018 · GHG Protocol (voluntario) · Ley 2169 de 2021 (metas nacionales)',
      actionRequired: 'Calculadora de huella: incluida con ISO 14001 o al contratar 3 o más módulos; en otros casos, servicio adicional.'
    });
  }

  // -------------------------------------------------------------
  // C. EVALUACIÓN SEGURIDAD VIAL / PESV (Res. 40595 / Dec. 1252)
  // -------------------------------------------------------------
  const pesvReqs: RequirementEvaluation[] = [];
  const pesvCalculated = calculatePesvLevel(
    vars.tiene_vehiculos,
    vars.mision_transporte,
    vars.total_vehiculos,
    vars.total_conductores
  );

  if (!vars.tiene_vehiculos) {
    pesvReqs.push({
      id: 'req-pesv-gatekeeper-no',
      code: 'RES-40595-EXCLUSION',
      standardOrNorm: 'Resolución 40595 de 2022',
      name: 'Plan Estratégico de Seguridad Vial (PESV)',
      category: 'PESV',
      status: 'NO_APLICA',
      reason: 'La organización declaró explícitamente NO utilizar vehículos automotores ni motocicletas para desarrollar sus actividades.',
      triggeringVariables: { tiene_vehiculos: false },
      legalCitation: 'Ley 2050 de 2020 Art. 1 & Res 40595 de 2022',
      actionRequired: 'Se conserva el acta de exclusión justificada sin obligatoriedad de los 24 pasos.'
    });
  } else if (pesvCalculated === 'NO_APLICA') {
    // Uses vehicles but below the Res. 40595 minimum (more than 10 vehicles or 2+ drivers)
    pesvReqs.push({
      id: 'req-pesv-menor-10',
      code: 'RES-40595-UMBRAL',
      standardOrNorm: 'Resolución 40595 de 2022',
      name: 'Plan Estratégico de Seguridad Vial - Umbral Legal',
      category: 'PESV',
      status: 'NO_APLICA',
      reason: explainPesvLevel(true, vars.mision_transporte, vars.total_vehiculos, vars.total_conductores).reason,
      triggeringVariables: {
        total_vehiculos: vars.total_vehiculos,
        total_conductores: vars.total_conductores,
        mision_transporte: vars.mision_transporte
      },
      legalCitation: 'Ley 2050 de 2020 Art. 2 · Resolución 40595 de 2022',
      actionRequired: 'Gestionar el peligro vial en la matriz de peligros del SG-SST (Dec. 1072 de 2015). La adopción voluntaria del nivel básico es opcional.'
    });
  } else {
    // PESV OBLIGATORIO: BÁSICO, ESTÁNDAR O AVANZADO
    const stepsCount = PESV_STEPS[pesvCalculated];
    pesvReqs.push({
      id: 'req-pesv-obligatorio',
      code: `PESV-RES40595-${pesvCalculated}`,
      standardOrNorm: 'Resolución 40595 de 2022',
      name: `Plan Estratégico de Seguridad Vial - Nivel ${pesvCalculated} (${stepsCount} Pasos Metodológicos)`,
      category: 'PESV',
      status: 'APLICA',
      reason: `La organización está legalmente obligada a diseñar, implementar y verificar el PESV Nivel ${pesvCalculated} por contar con ${vars.total_vehiculos} vehículos y ${vars.total_conductores} conductores bajo misionalidad ${vars.mision_transporte ? 'de transporte' : 'no transporte'}.`,
      triggeringVariables: {
        total_vehiculos: vars.total_vehiculos,
        total_conductores: vars.total_conductores,
        mision_transporte: vars.mision_transporte,
        nivel_calculado: pesvCalculated,
        pasos_metodologicos: stepsCount
      },
      legalCitation: 'Resolución 40595 de 2022 Fase 1, 2, 3 y 4 de la Metodología Nacional',
      actionRequired: `Habilitar motor PESV con los ${stepsCount} pasos: idoneidad de conductores, preoperacionales diarios, mantenimiento de flota y rutas seguras.`
    });

    if (vars.motocicletas > 0) {
      pesvReqs.push({
        id: 'req-pesv-motos',
        code: 'PESV-PASO-MOTO',
        standardOrNorm: 'Resolución 40595 de 2022 Paso 10 y 14',
        name: 'Protocolo Específico de Seguridad para Flota de Motocicletas',
        category: 'PESV',
        status: 'APLICA',
        reason: `Cuenta con ${vars.motocicletas} motocicleta(s). Requiere verificación de cascos certificados (Res. 1080/19), prendas reflectivas e inspección diaria rigurosa.`,
        triggeringVariables: { motocicletas: vars.motocicletas },
        legalCitation: 'Resolución 40595 de 2022 Paso 14',
        actionRequired: 'Implementar lista preoperacional digital para motocicletas y capacitaciones de manejo preventivo.'
      });
    }

    if (vars.transporte_quimicos_peligrosos) {
      pesvReqs.push({
        id: 'req-pesv-quimicos',
        code: 'DEC-1079-MERCANCIAS-PELIGROSAS',
        standardOrNorm: 'Decreto 1079 de 2015 Sección 8',
        name: 'Transporte Terrestre de Mercancías y Sustancias Peligrosas',
        category: 'PESV',
        status: 'APLICA',
        reason: 'Transporta sustancias peligrosas. Requiere rotulación UN, tarjeta de emergencia, kit de contingencia y conductor con curso de 60 horas del SENA/MinTransporte.',
        triggeringVariables: { transporte_quimicos_peligrosos: true },
        legalCitation: 'Decreto 1079 de 2015 Art. 2.2.1.7.8.1',
        actionRequired: 'Vincular tarjetas de emergencia y certificados de conductor de carga peligrosa.'
      });
    }
  }

  // -------------------------------------------------------------
  // D. EVALUACIÓN SISTEMAS ISO (9001, 14001, 45001)
  // -------------------------------------------------------------
  const isoReqs: RequirementEvaluation[] = [];

  const hasIsoInterest = vars.tiene_iso_9001 || vars.tiene_iso_14001 || vars.tiene_iso_45001 || vars.desea_certificarse;

  isoReqs.push({
    id: 'req-iso-hls',
    code: 'ISO-TRI-NORMA',
    standardOrNorm: 'Estructura de Alto Nivel (HLS) ISO',
    name: 'Sistemas Integrados de Gestión (ISO 9001 / ISO 14001 / ISO 45001)',
    category: 'ISO',
    status: hasIsoInterest ? 'APLICA' : 'NO_APLICA',
    reason: hasIsoInterest
      ? 'La organización cuenta con certificación, está en proceso o desea certificar sus procesos bajo la estructura común de 10 capítulos ISO.'
      : 'La organización no cuenta actualmente con sistemas de calidad ISO ni ha manifestado interés prioritario en certificación.',
    triggeringVariables: {
      tiene_iso_9001: vars.tiene_iso_9001,
      tiene_iso_14001: vars.tiene_iso_14001,
      tiene_iso_45001: vars.tiene_iso_45001,
      desea_certificarse: vars.desea_certificarse
    },
    legalCitation: 'Normas Técnicas Colombianas NTC-ISO 9001:2015, 14001:2015 y 45001:2018',
    actionRequired: hasIsoInterest 
      ? 'Habilitar módulos de Auditoría HLS, Matriz de Riesgos y Oportunidades y Contexto Organizacional.'
      : 'Mantener módulo como opcional en la propuesta comercial.'
  });

  // Consolidar todos los requisitos
  allRequirements.push(...sstReqs, ...envReqs, ...pesvReqs, ...isoReqs);

  // -------------------------------------------------------------
  // E. EVALUACIÓN POR MÓDULOS DE AGAE (NECESARIO / RECOMENDADO / OPCIONAL)
  // -------------------------------------------------------------
  const evaluations: ModuleEvaluation[] = [];

  // 1. Módulo SST
  evaluations.push({
    module: 'SST',
    moduleName: 'Seguridad y Salud en el Trabajo (SG-SST)',
    tier: 'NECESARIO',
    status: 'APLICA',
    justification: `Obligatorio por Decreto 1072 de 2015 y Resolución 0312 de 2019. Se identificó la necesidad de gestionar ${sstStandardsCount} Estándares Mínimos, con matriz de peligros GTC 45, plan de emergencias y asignación de presupuesto.`,
    legalBasis: 'Decreto 1072/15 & Resolución 0312/19',
    estimatedRequirementsCount: sstStandardsCount,
    applicableRequirements: sstReqs,
    monthlyPriceCop: sstStandardsCount === 7 ? 220000 : sstStandardsCount === 21 ? 380000 : 590000,
    implementationDifficulty: sstStandardsCount === 7 ? 'BAJA' : sstStandardsCount === 21 ? 'MEDIA' : 'ALTA'
  });

  // 2. Módulo Ambiental
  const envStatus = vars.genera_respel || vars.tiene_vertimientos || vars.utiliza_combustibles ? 'APLICA' : 'REQUIERE_VALIDACION';
  evaluations.push({
    module: 'ENVIRONMENTAL',
    moduleName: 'Gestión Ambiental Integral',
    tier: (vars.genera_respel || vars.tiene_vertimientos) ? 'NECESARIO' : 'RECOMENDADO',
    status: envStatus,
    justification: vars.genera_respel 
      ? `Aplica necesariamente por generación de ${vars.respel_kg_mes} kg/mes de residuos peligrosos (RESPEL), control de vertimientos y reporte ambiental RUA.`
      : 'Recomendado para la gestión de residuos ordinarios/reciclables (PGIRS) y control de consumos energéticos.',
    legalBasis: 'Decreto 1076 de 2015, Res. 2184/19 & Res. 0631/15',
    estimatedRequirementsCount: 18,
    applicableRequirements: envReqs,
    monthlyPriceCop: vars.genera_respel ? 420000 : 260000,
    implementationDifficulty: vars.genera_respel ? 'MEDIA' : 'BAJA'
  });

  // 2b. Calculadora de Huella de Carbono (producto independiente, con informe PDF)
  const huellaNecesidad = c.environmental.necesitaHuellaCarbono;
  evaluations.push({
    module: 'HUELLA_CARBONO',
    moduleName: 'Calculadora de Huella de Carbono + Informe PDF',
    tier: huellaNecesidad === 'EXIGIDA' ? 'RECOMENDADO' : 'OPCIONAL',
    status: huellaNecesidad === 'EXIGIDA' ? 'APLICA' : 'REQUIERE_VALIDACION',
    justification: huellaNecesidad === 'EXIGIDA'
      ? 'Clientes, licitaciones o casa matriz le exigen medir su huella de carbono. Cálculo de emisiones (alcances 1, 2 y 3) e informe PDF.'
      : 'Producto independiente: cálculo de emisiones de GEI (alcances 1, 2 y 3) con informe PDF. Incluido sin costo con Gestión Ambiental + otro módulo o con ISO 14001.',
    legalBasis: 'ISO 14064-1:2018 · GHG Protocol',
    estimatedRequirementsCount: 3,
    applicableRequirements: envReqs.filter(r => r.id === 'req-amb-ghg'),
    monthlyPriceCop: HUELLA_CARBONO_PRECIO_MES,
    implementationDifficulty: 'BAJA'
  });

  // 3. Módulo PESV
  const pesvTier: ModuleRecommendationTier = !vars.tiene_vehiculos 
    ? 'NO_APLICA' 
    : pesvCalculated === 'NO_APLICA' 
    ? 'RECOMENDADO' 
    : 'NECESARIO';

  evaluations.push({
    module: 'PESV',
    moduleName: 'Plan Estratégico de Seguridad Vial (PESV)',
    tier: pesvTier,
    status: !vars.tiene_vehiculos ? 'NO_APLICA' : pesvCalculated === 'NO_APLICA' ? 'REQUIERE_VALIDACION' : 'APLICA',
    justification: !vars.tiene_vehiculos
      ? 'No identificado como aplicable: La empresa no utiliza vehículos en sus operaciones.'
      : pesvCalculated === 'NO_APLICA'
      ? `Cuenta con ${vars.total_vehiculos} vehículos (por debajo de las 10 unidades de la Ley 2050), pero se recomienda para control preventivo de conductores.`
      : `Obligatorio por Resolución 40595 de 2022 para Nivel ${pesvCalculated} (${pesvCalculated === 'BASICO' ? '12' : pesvCalculated === 'ESTANDAR' ? '20' : '24'} pasos). Control de flota de ${vars.total_vehiculos} vehículos y ${vars.total_conductores} conductores.`,
    legalBasis: 'Ley 1503/11, Ley 2050/20, Dec. 1252/21 & Res. 40595/22',
    estimatedRequirementsCount: pesvCalculated === 'BASICO' ? 12 : pesvCalculated === 'ESTANDAR' ? 20 : pesvCalculated === 'AVANZADO' ? 24 : 0,
    applicableRequirements: pesvReqs,
    monthlyPriceCop: pesvCalculated === 'AVANZADO' ? 520000 : pesvCalculated === 'ESTANDAR' ? 390000 : pesvCalculated === 'BASICO' ? 280000 : 180000,
    implementationDifficulty: pesvCalculated === 'AVANZADO' ? 'ALTA' : 'MEDIA'
  });

  // 4. Módulo ISO (9001 / 14001 / 45001)
  evaluations.push({
    module: 'ISO_9001',
    moduleName: 'Sistemas de Calidad & Tri-Norma ISO (9001, 14001, 45001)',
    tier: hasIsoInterest ? 'RECOMENDADO' : 'OPCIONAL',
    status: hasIsoInterest ? 'APLICA' : 'NO_APLICA',
    justification: hasIsoInterest
      ? 'Recomendado para fortalecer la estructura de alto nivel (HLS), auditorías integradas, control de hallazgos y gestión del cambio.'
      : 'Opcional / No prioritario: La organización no ha declarado interés en certificaciones internacionales de calidad a corto plazo.',
    legalBasis: 'Normas ISO 9001:2015, ISO 14001:2015 e ISO 45001:2018',
    estimatedRequirementsCount: 28,
    applicableRequirements: isoReqs,
    monthlyPriceCop: 350000,
    implementationDifficulty: 'MEDIA'
  });

  // -------------------------------------------------------------
  // F. GENERACIÓN DE LA PROPUESTA COMERCIAL PERSONALIZADA
  // -------------------------------------------------------------
  // Default selected modules: all marked as NECESARIO
  const defaultSelectedModules = evaluations
    .filter(e => e.tier === 'NECESARIO')
    .map(e => e.module);

  // If none was strictly necessary (rare), select at least SST
  if (defaultSelectedModules.length === 0) {
    defaultSelectedModules.push('SST');
  }

  // Complexity score (0 to 100)
  let complexity = 10;
  if (vars.numero_trabajadores > 10) complexity += 15;
  if (vars.numero_trabajadores > 50) complexity += 20;
  if (vars.clase_riesgo_arl >= 4) complexity += 20;
  if (vars.numero_sedes > 1) complexity += 10;
  if (vars.trabajo_alturas || vars.espacios_confinados) complexity += 15;
  if (vars.genera_respel) complexity += 10;
  if (vars.total_vehiculos >= 10) complexity += 10;
  complexity = Math.min(100, complexity);

  const complexityTier = complexity <= 30 ? 'BAJA' : complexity <= 60 ? 'MEDIA' : complexity <= 85 ? 'ALTA' : 'MUY_ALTA';

  // Subtotal of selected modules
  const subtotalMonthly = evaluations
    .filter(e => defaultSelectedModules.includes(e.module))
    .reduce((sum, e) => sum + e.monthlyPriceCop, 0);

  const discountPercentage = defaultSelectedModules.length >= 3 ? 20 : defaultSelectedModules.length === 2 ? 10 : 0;
  const discountCop = Math.round(subtotalMonthly * (discountPercentage / 100));
  const finalMonthly = subtotalMonthly - discountCop;
  const platformSetup = complexity <= 40 ? 450000 : complexity <= 70 ? 850000 : 1400000;
  const trainingCop = complexity <= 40 ? 300000 : 600000;

  const proposal: CommercialProposal = {
    id: `PROP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    clientName: c.identification.razonSocial || 'Empresa Prospección',
    clientNit: c.identification.nit || 'NIT Pendiente',
    complexityScore: complexity,
    complexityTier,
    estimatedUsers: Math.max(3, Math.ceil(vars.numero_trabajadores / 15)),
    selectedModules: defaultSelectedModules,
    allEvaluations: evaluations,
    pricingBreakdown: {
      subtotalModulesCop: subtotalMonthly,
      multiModuleDiscountPercentage: discountPercentage,
      discountCop,
      platformSetupCop: platformSetup,
      trainingAndOnboardingCop: trainingCop,
      totalMonthlyCop: finalMonthly,
      totalAnnualCop: finalMonthly * 12
    },
    implementationRoadmapWeeks: complexity <= 40 ? 4 : complexity <= 70 ? 6 : 8,
    keyDeliverables: [
      `Configuración de la plataforma AGAE adaptada a ${vars.numero_sedes} sede(s) y ${vars.numero_trabajadores} trabajadores`,
      `Matriz legal y operativa con ${sstStandardsCount} estándares de SG-SST parametrizados`,
      ...(vars.tiene_vehiculos && pesvCalculated !== 'NO_APLICA' ? [`Parametrización de los pasos metodológicos del PESV Nivel ${pesvCalculated}`] : []),
      ...(vars.genera_respel ? ['Módulo de pesajes PGIRS y trazabilidad de gestores RESPEL'] : []),
      'Capacitación inicial del equipo HSEQ y administrador del sistema',
      'Soporte técnico preferencial y actualizaciones normativas automáticas'
    ]
  };

  return {
    evaluations,
    allRequirements,
    proposal
  };
}

// ==============================================================
// 5. DETECTOR DE CAMBIOS Y DIFERENCIAS EN RE-CARACTERIZACIÓN
// ==============================================================
export function detectCharacterizationDiffs(
  oldVars: StructuredVariablesRecord,
  newVars: StructuredVariablesRecord
): {
  impactedModules: ModuleType[];
  changesSummary: string[];
  reEvaluationRequired: boolean;
} {
  const changesSummary: string[] = [];
  const impactedModules: Set<ModuleType> = new Set();

  if (oldVars.numero_trabajadores !== newVars.numero_trabajadores) {
    changesSummary.push(`Número de trabajadores cambió de ${oldVars.numero_trabajadores} a ${newVars.numero_trabajadores}`);
    impactedModules.add('SST');
  }

  if (oldVars.clase_riesgo_arl !== newVars.clase_riesgo_arl) {
    changesSummary.push(`Clase de riesgo ARL varió de Riesgo ${oldVars.clase_riesgo_arl} a Riesgo ${newVars.clase_riesgo_arl}`);
    impactedModules.add('SST');
  }

  if (oldVars.numero_sedes !== newVars.numero_sedes) {
    changesSummary.push(`Número de sedes operativas cambió de ${oldVars.numero_sedes} a ${newVars.numero_sedes}`);
    impactedModules.add('SST');
    impactedModules.add('ENVIRONMENTAL');
  }

  if (oldVars.trabajo_alturas !== newVars.trabajo_alturas) {
    changesSummary.push(newVars.trabajo_alturas ? 'Se incorporaron actividades de trabajo en alturas (Res. 4272/21)' : 'Se retiraron actividades de trabajo en alturas');
    impactedModules.add('SST');
  }

  if (oldVars.tiene_vehiculos !== newVars.tiene_vehiculos || oldVars.total_vehiculos !== newVars.total_vehiculos) {
    changesSummary.push(`Operación vial modificada: Flota pasó de ${oldVars.total_vehiculos} a ${newVars.total_vehiculos} vehículos`);
    impactedModules.add('PESV');
  }

  if (oldVars.genera_respel !== newVars.genera_respel || oldVars.respel_kg_mes !== newVars.respel_kg_mes) {
    changesSummary.push(`Generación RESPEL cambió de ${oldVars.respel_kg_mes} kg a ${newVars.respel_kg_mes} kg/mes`);
    impactedModules.add('ENVIRONMENTAL');
  }

  if (oldVars.tiene_vertimientos !== newVars.tiene_vertimientos) {
    changesSummary.push(newVars.tiene_vertimientos ? 'Se identificaron nuevos vertimientos industriales' : 'Cese de vertimientos industriales');
    impactedModules.add('ENVIRONMENTAL');
  }

  return {
    impactedModules: Array.from(impactedModules),
    changesSummary,
    reEvaluationRequired: changesSummary.length > 0
  };
}
