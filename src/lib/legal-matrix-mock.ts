// =====================================================================
// DATOS MOCK Y REGLAS DE NEGOCIO: MATRIZ DE REQUISITOS LEGALES (2.4.1)
// Decreto 1072 de 2015 Art. 2.2.4.6.8 Numeral 2 y Art. 2.2.4.6.12 Numeral 15
// Resolución 0312 de 2019 Estándar 2.4.1
// AGAE SOLUTIONS
// =====================================================================

import {
  LegalRequirementItem,
  LegalRequirementsProcedure,
  LegalChangeAlert,
  LegalMatrixMetrics,
  LegalMatrixState,
  NormativeTopicCategory
} from '@/types/legal-matrix';
import { Organization } from '@/types';

export const TOPIC_LABELS: Record<NormativeTopicCategory, string> = {
  SST_GENERAL: 'SST General & Sistema de Gestión',
  MEDICINA_PREVENTIVA: 'Medicina Preventiva & Evaluaciones Ocupacionales',
  HIGIENE_INDUSTRIAL: 'Higiene Industrial (Ruido, Iluminación, Químicos SGA)',
  SEGURIDAD_INDUSTRIAL: 'Seguridad Industrial (Alturas, EPP, Confinados)',
  COMITES_SST: 'Comités (COPASST, Vigía & Convivencia CCL)',
  EMERGENCIAS_BRIGADA: 'Emergencias, Evacuación & Primeros Auxilios',
  RIESGOS_ESPECIFICOS: 'Riesgos Específicos (Batería Psicosocial, Biomecánico)',
  SEGURIDAD_VIAL_PESV: 'Seguridad Vial & PESV',
  GESTION_AMBIENTAL: 'Gestión Ambiental, PGIRS & Residuos'
};

// ---------------------------------------------------------------------
// 1. REQUISITOS LEGALES INICIALES (CATÁLOGO REAL COLOMBIANO)
// ---------------------------------------------------------------------
export const DEFAULT_LEGAL_REQUIREMENTS: LegalRequirementItem[] = [
  // 1. Decreto 1072 de 2015 (SST General)
  {
    id: 'leg-001',
    internalCode: 'LEG-SST-001',
    normType: 'DECRETO',
    normNumber: '1072',
    normYear: '2015',
    issuingAuthority: 'Ministerio del Trabajo',
    title: 'Decreto Único Reglamentario del Sector Trabajo - Libro 2, Parte 2, Título 4, Capítulo 6',
    issueDate: '2015-05-26',
    publicationDate: '2015-05-26',
    topicCategory: 'SST_GENERAL',
    system: 'SST',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Art. 2.2.4.6.1 al 2.2.4.6.37',
    specificLegalObligation: 'Diseñar, implementar, administrar y evaluar el Sistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST) basado en el ciclo PHVA, asignando responsabilidades, recursos, evaluación inicial, política, objetivos y plan anual de trabajo.',
    applicabilityExplanation: 'Aplica a todos los empleadores públicos y privados, contratantes de personal bajo modalidad de contrato civil, comercial o administrativo en Colombia.',
    juridicalStatus: 'VIGENTE_MODIFICADA',
    derogatedOrModifiedBy: 'Compiló el Decreto 1443 de 2014; modificado parcialmente por Dec. 052/2017 y Res. 0312/2019.',
    applicabilityStatus: 'APLICA',
    responsibleProcess: 'Gestión Integral HSEQ',
    responsibleRole: 'Líder HSEQ & Coordinadora SG-SST',
    requiredControlDescription: 'Implementación estructurada de los 60 estándares mínimos en la plataforma AGAE, auditoría anual y revisión por la dirección.',
    controlImplementationStatus: 'IMPLEMENTADO',
    controlFrequency: 'CONTINUO',
    requiredEvidence: 'Documentación del SG-SST, política firmada, plan anual firmado, evaluación inicial y actas de comités.',
    existingEvidenceDescription: 'SG-SST completamente parametrizado en AGAE SOLUTIONS con autoevaluación oficial en 94.5%.',
    linkedModule: 'SST',
    evidenceIds: ['evi-politica-2026', 'evi-plan-anual-2026'],
    evidenceFileNames: ['Politica_SST_Firmada_2026.pdf', 'Plan_Anual_Trabajo_2026.pdf'],
    complianceStatus: 'CUMPLE',
    findingsOrObservations: 'El SG-SST se encuentra activo con cumplimiento verificable de ciclo PHVA.',
    lastEvaluationDate: '2026-03-30',
    nextReviewDate: '2026-06-30',
    evaluatorName: 'Marcela Rincón Ortiz',
    officialSourceUrl: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=72173',
    historyLog: [
      { id: 'h-1', date: '2026-01-15', action: 'Norma incorporada a la matriz legal', author: 'Sistema AGAE' },
      { id: 'h-2', date: '2026-03-30', action: 'Evaluación de cumplimiento trimestral', author: 'Marcela Rincón Ortiz', note: 'Calificado como CUMPLE' }
    ]
  },

  // 2. Resolución 0312 de 2019 (Estándares Mínimos)
  {
    id: 'leg-002',
    internalCode: 'LEG-SST-002',
    normType: 'RESOLUCION',
    normNumber: '0312',
    normYear: '2019',
    issuingAuthority: 'Ministerio del Trabajo',
    title: 'Estándares Mínimos del Sistema de Gestión de Seguridad y Salud en el Trabajo para empleadores y contratantes',
    issueDate: '2019-02-13',
    publicationDate: '2019-02-19',
    topicCategory: 'SST_GENERAL',
    system: 'SST',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Art. 1 al 37 (Específicamente Art. 16: Tabla de los 60 Estándares Mínimos)',
    specificLegalObligation: 'Cumplir y mantener implementados los estándares mínimos aplicables según tamaño y clase de riesgo (60 estándares para empresas de más de 50 trabajadores o riesgo IV y V). Registrar autoevaluación anual en la plataforma del Ministerio.',
    applicabilityExplanation: 'La empresa cuenta con más de 50 trabajadores y operaciones con clasificación de riesgo laboral ARL.',
    juridicalStatus: 'VIGENTE',
    applicabilityStatus: 'APLICA',
    responsibleProcess: 'Gestión Integral HSEQ',
    responsibleRole: 'Líder HSEQ & Coordinadora SG-SST',
    requiredControlDescription: 'Autoevaluación periódica en el módulo de estándares de AGAE, planes de mejora y radicación anual ante MinTrabajo.',
    controlImplementationStatus: 'IMPLEMENTADO',
    controlFrequency: 'ANUAL',
    requiredEvidence: 'Tabla de autoevaluación de la Resolución 0312 firmada con plan de mejoramiento radicado.',
    existingEvidenceDescription: 'Autoevaluación Res. 0312 calificada en AGAE con soporte documental para cada ítem exigible.',
    linkedModule: 'SST',
    evidenceIds: ['evi-autoevaluacion-0312'],
    evidenceFileNames: ['Reporte_Autoevaluacion_Res0312_2026.pdf'],
    complianceStatus: 'CUMPLE',
    findingsOrObservations: 'Puntaje actual 94.5% (Nivel Aceptable). Plan de trabajo formulado.',
    lastEvaluationDate: '2026-03-30',
    nextReviewDate: '2026-06-30',
    evaluatorName: 'Marcela Rincón Ortiz',
    officialSourceUrl: 'https://www.mintrabajo.gov.co/normatividad/resoluciones-2019',
    historyLog: [
      { id: 'h-3', date: '2026-01-15', action: 'Norma incorporada a la matriz legal', author: 'Sistema AGAE' }
    ]
  },

  // 3. Resolución 2400 de 1979 (Seguridad Industrial)
  {
    id: 'leg-003',
    internalCode: 'LEG-SST-003',
    normType: 'RESOLUCION',
    normNumber: '2400',
    normYear: '1979',
    issuingAuthority: 'Ministerio de Trabajo y Seguridad Social',
    title: 'Estatuto de Higiene y Seguridad Industrial en los Lugares de Trabajo',
    issueDate: '1979-05-22',
    topicCategory: 'SEGURIDAD_INDUSTRIAL',
    system: 'SST',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Títulos II, III, IV, VI, VII y X (Instalaciones, Máquinas, EPP, Riesgo Eléctrico, Incendios)',
    specificLegalObligation: 'Garantizar condiciones seguras en los lugares de trabajo: pasillos despejados, resguardos en maquinaria, dotación y uso obligatorio de EPP certificados, control de fuentes de ignición e instalaciones eléctricas normalizadas.',
    applicabilityExplanation: 'Aplica a todos los establecimientos de trabajo donde se ejecuten actividades laborales en Colombia.',
    juridicalStatus: 'VIGENTE_MODIFICADA',
    derogatedOrModifiedBy: 'Vigente con modificaciones puntuales en materia de alturas y señalización.',
    applicabilityStatus: 'APLICA',
    responsibleProcess: 'Operaciones Logísticas y Mantenimiento',
    responsibleRole: 'Supervisor de Operaciones & Jefe de Mantenimiento',
    requiredControlDescription: 'Inspecciones periódicas de seguridad, programa de mantenimiento preventivo, entrega de EPP con registro firmado y señalización.',
    controlImplementationStatus: 'IMPLEMENTADO',
    controlFrequency: 'MENSUAL',
    requiredEvidence: 'Formatos de inspección locativa, recibos de entrega de EPP y órdenes de trabajo de mantenimiento.',
    existingEvidenceDescription: 'Inspecciones mensuales en almacén y muelles cargadas en el módulo de inspecciones; registros de EPP en Base Maestra de Trabajadores.',
    linkedModule: 'INSPECTIONS',
    evidenceIds: ['evi-insp-muelles-q1', 'evi-epp-entrega-2026'],
    evidenceFileNames: ['Inspeccion_Locativa_Marzo_2026.pdf', 'Planilla_Entrega_EPP_2026.pdf'],
    complianceStatus: 'CUMPLE',
    findingsOrObservations: 'Se mantienen resguardos en bandas transportadoras y rutas de evacuación libres de obstáculos.',
    lastEvaluationDate: '2026-03-25',
    nextReviewDate: '2026-06-25',
    evaluatorName: 'Carlos Eduardo Mendoza',
    officialSourceUrl: 'https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=5356',
    historyLog: [
      { id: 'h-4', date: '2026-01-15', action: 'Norma incorporada a la matriz legal', author: 'Sistema AGAE' }
    ]
  },

  // 4. Resolución 4272 de 2021 (Trabajo en Alturas)
  {
    id: 'leg-004',
    internalCode: 'LEG-SST-004',
    normType: 'RESOLUCION',
    normNumber: '4272',
    normYear: '2021',
    issuingAuthority: 'Ministerio del Trabajo',
    title: 'Requisitos mínimos de seguridad para el desarrollo de trabajos en alturas (Derogó la Resolución 1409 de 2012)',
    issueDate: '2021-12-27',
    topicCategory: 'SEGURIDAD_INDUSTRIAL',
    system: 'SST',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Art. 1 al 68 (Programa de Protección contra Caídas, Certificación de Personal, Permisos de Trabajo)',
    specificLegalObligation: 'Establecer el Programa de Prevención y Protección contra Caídas para labores con riesgo de caída a más de 2.0 metros; certificar trabajadores y coordinadores de alturas; inspeccionar anualmente equipos y líneas de vida por persona calificada; emitir permiso de trabajo o lista de chequeo previa.',
    applicabilityExplanation: 'En la empresa se realizan actividades de mantenimiento en techos, estanterías elevadas y racks superiores a 2.0 metros.',
    juridicalStatus: 'VIGENTE',
    derogatedOrModifiedBy: 'Derogó expresamente la Resolución 1409 de 2012 y la Resolución 3368 de 2014.',
    applicabilityStatus: 'APLICA',
    responsibleProcess: 'Mantenimiento e Infraestructura',
    responsibleRole: 'Coordinador de Trabajo Seguro en Alturas & Técnico de Mantenimiento',
    requiredControlDescription: 'Programa formal de protección contra caídas, hojas de vida de arneses y eslingas, permisos de trabajo en alturas y certificaciones vigentes.',
    controlImplementationStatus: 'IMPLEMENTADO',
    controlFrequency: 'EVENTUAL',
    requiredEvidence: 'Certificados SENA/Centro de Entrenamiento vigentes, certificados anuales de líneas de vida y permisos firmados.',
    existingEvidenceDescription: 'Técnico de mantenimiento certificado como trabajador avanzado y coordinador de alturas; inspección anual de arneses realizada en febrero 2026.',
    linkedModule: 'TRAINING',
    evidenceIds: ['evi-cert-alturas-wrk005', 'evi-insp-arneses-2026'],
    evidenceFileNames: ['Certificado_Alturas_ARamos_SENA.pdf', 'Inspeccion_Equipos_Alturas_2026.pdf'],
    complianceStatus: 'CUMPLE',
    findingsOrObservations: 'Equipos rotulados y vigentes. Prohibido trabajo en alturas sin permiso previo.',
    lastEvaluationDate: '2026-03-15',
    nextReviewDate: '2026-06-15',
    evaluatorName: 'Marcela Rincón Ortiz',
    officialSourceUrl: 'https://www.mintrabajo.gov.co/normatividad/resoluciones-2021',
    historyLog: [
      { id: 'h-5', date: '2026-01-15', action: 'Norma incorporada a la matriz legal', author: 'Sistema AGAE' }
    ]
  },

  // 5. Resolución 2013 de 1986 (COPASST)
  {
    id: 'leg-005',
    internalCode: 'LEG-SST-005',
    normType: 'RESOLUCION',
    normNumber: '2013',
    normYear: '1986',
    issuingAuthority: 'Ministerio de Trabajo y Seguridad Social',
    title: 'Reglamentación de la organización y funcionamiento de los Comités de Medicina, Higiene y Seguridad Industrial (COPASST)',
    issueDate: '1986-06-06',
    topicCategory: 'COMITES_SST',
    system: 'SST',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Art. 1 al 18',
    specificLegalObligation: 'Conformar el Comité Paritario de Seguridad y Salud en el Trabajo con representación equitativa de empleador y trabajadores; reunirse mensualmente de forma ordinaria; levantar actas; investigar incidentes y accidentes de trabajo.',
    applicabilityExplanation: 'Aplica a toda empresa pública o privada con 10 o más trabajadores.',
    juridicalStatus: 'VIGENTE',
    applicabilityStatus: 'APLICA',
    responsibleProcess: 'Comité Paritario (COPASST)',
    responsibleRole: 'Presidente y Secretaria del COPASST',
    requiredControlDescription: 'Reuniones mensuales programadas, archivo de actas debidamente foliadas y plan de acción de compromisos.',
    controlImplementationStatus: 'IMPLEMENTADO',
    controlFrequency: 'MENSUAL',
    requiredEvidence: 'Actas de elección, posesión y actas mensuales firmadas con lista de asistencia.',
    existingEvidenceDescription: 'COPASST activo en el módulo especializado de AGAE con 12 actas anuales y seguimiento a compromisos.',
    linkedModule: 'COPASST',
    evidenceIds: ['evi-actas-copasst-2026'],
    evidenceFileNames: ['Actas_COPASST_Trimestre_1_2026.pdf'],
    complianceStatus: 'CUMPLE',
    findingsOrObservations: 'Reuniones mensuales al día con participación de ambas partes.',
    lastEvaluationDate: '2026-03-31',
    nextReviewDate: '2026-06-30',
    evaluatorName: 'Carlos Eduardo Mendoza',
    officialSourceUrl: 'https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=5354',
    historyLog: [
      { id: 'h-6', date: '2026-01-15', action: 'Norma incorporada a la matriz legal', author: 'Sistema AGAE' }
    ]
  },

  // 6. Resolución 3461 de 2025 (Comité de Convivencia y Acoso Laboral - Derogó Res. 652/2012)
  {
    id: 'leg-006',
    internalCode: 'LEG-SST-006',
    normType: 'RESOLUCION',
    normNumber: '3461',
    normYear: '2025',
    issuingAuthority: 'Ministerio del Trabajo',
    title: 'Reglamentación del Comité de Convivencia Laboral y medidas de prevención, intervención y trámite confidencial del acoso laboral',
    issueDate: '2025-07-15',
    topicCategory: 'COMITES_SST',
    system: 'SST',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Art. 1 al 28',
    specificLegalObligation: 'Conformar el Comité de Convivencia Laboral; establecer procedimiento confidencial para quejas de presunto acoso laboral; sesionar trimestralmente; formular planes de mediación y rendir informe anual a gerencia garantizando reserva legal de los expedientes.',
    applicabilityExplanation: 'Aplica a todos los empleadores públicos y privados en el territorio nacional.',
    juridicalStatus: 'VIGENTE',
    derogatedOrModifiedBy: 'Derogó expresamente la Resolución 652 de 2012 y la Resolución 1356 de 2012.',
    applicabilityStatus: 'APLICA',
    responsibleProcess: 'Comité de Convivencia Laboral & Talento Humano',
    responsibleRole: 'Presidenta del CCL & Coordinadora de Talento Humano',
    requiredControlDescription: 'Protocolo formal de convivencia bajo Res. 3461/2025, buzón confidencial, actas trimestrales y talleres de prevención.',
    controlImplementationStatus: 'IMPLEMENTADO',
    controlFrequency: 'TRIMESTRAL',
    requiredEvidence: 'Acta de conformación del CCL, actas trimestrales, manual interno de convivencia y soportes de custodia bajo reserva.',
    existingEvidenceDescription: 'Módulo CCL activo en AGAE con protocolo bajo Res. 3461/2025, reunión del Q1 realizada y expedientes confidenciales.',
    linkedModule: 'CCL',
    evidenceIds: ['evi-acta-ccl-q1-2026', 'evi-protocolo-ccl-2025'],
    evidenceFileNames: ['Acta_CCL_Q1_2026.pdf', 'Protocolo_Convivencia_Res3461_2025.pdf'],
    complianceStatus: 'CUMPLE',
    findingsOrObservations: 'Actualizado conforme a la nueva reglamentación de 2025 con estricta reserva de historias.',
    lastEvaluationDate: '2026-03-31',
    nextReviewDate: '2026-06-30',
    evaluatorName: 'Diana Carolina Rojas',
    officialSourceUrl: 'https://www.mintrabajo.gov.co/normatividad/resoluciones-2025',
    historyLog: [
      { id: 'h-7', date: '2026-01-15', action: 'Norma incorporada a la matriz legal', author: 'Sistema AGAE' }
    ]
  },

  // 7. Decreto 1496 de 2018 (Sistema Globalmente Armonizado - Químicos)
  {
    id: 'leg-007',
    internalCode: 'LEG-SST-007',
    normType: 'DECRETO',
    normNumber: '1496',
    normYear: '2018',
    issuingAuthority: 'Ministerio del Trabajo',
    title: 'Adopción del Sistema Globalmente Armonizado de Clasificación y Etiquetado de Productos Químicos (SGA)',
    issueDate: '2018-08-06',
    topicCategory: 'HIGIENE_INDUSTRIAL',
    system: 'SST',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Art. 1 al 12 y Resolución reglamentaria 773 de 2021',
    specificLegalObligation: 'Clasificar, etiquetar y rotular todas las sustancias químicas y mezclas utilizadas en el lugar de trabajo bajo el SGA; disponer de las Fichas de Datos de Seguridad (FDS) en español en lugares accesibles; capacitar a los trabajadores en interpretación de pictogramas y palabras de advertencia.',
    applicabilityExplanation: 'En las áreas de mantenimiento y aseo se almacenan y manipulan solventes, desengrasantes y lubricantes industriales.',
    juridicalStatus: 'VIGENTE',
    derogatedOrModifiedBy: 'Reglamentado por la Resolución 773 de 2021 del Ministerio del Trabajo.',
    applicabilityStatus: 'APLICA',
    responsibleProcess: 'Gestión Integral HSEQ & Almacén',
    responsibleRole: 'Líder HSEQ & Encargado de Bodega',
    requiredControlDescription: 'Matriz de compatibilidad química, etiquetado de envases secundarios con pictogramas SGA, carpetas de FDS y kit antiderrame.',
    controlImplementationStatus: 'EN_PROCESO',
    controlFrequency: 'CONTINUO',
    requiredEvidence: 'Inventario de químicos, Fichas de Datos de Seguridad (FDS) de 16 secciones y registros de capacitación en SGA.',
    existingEvidenceDescription: 'Se cuenta con FDS para 8 de 12 sustancias; pendiente actualizar FDS de 4 productos químicos secundarios en taller.',
    linkedModule: 'DOCUMENTATION',
    evidenceIds: ['evi-inventario-quimicos-2026'],
    evidenceFileNames: ['Inventario_Sustancias_Quimicas_2026.xlsx'],
    complianceStatus: 'CUMPLE_PARCIAL',
    findingsOrObservations: 'Se detectaron 4 envases secundarios con rotulado manual no conforme con pictogramas del SGA.',
    linkedAcpmId: 'acpm-sga-001',
    lastEvaluationDate: '2026-03-20',
    nextReviewDate: '2026-05-20',
    evaluatorName: 'Marcela Rincón Ortiz',
    officialSourceUrl: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=87834',
    historyLog: [
      { id: 'h-8', date: '2026-01-15', action: 'Norma incorporada a la matriz legal', author: 'Sistema AGAE' },
      { id: 'h-9', date: '2026-03-20', action: 'Evaluación: Cumple Parcial por falta de rotulado secundario', author: 'Marcela Rincón Ortiz' }
    ]
  },

  // 8. Resolución 2346 de 2007 (Exámenes Médicos Ocupacionales)
  {
    id: 'leg-008',
    internalCode: 'LEG-SST-008',
    normType: 'RESOLUCION',
    normNumber: '2346',
    normYear: '2007',
    issuingAuthority: 'Ministerio de la Protección Social',
    title: 'Regulación de la práctica de evaluaciones médicas ocupacionales y el manejo y contenido de las historias clínicas ocupacionales',
    issueDate: '2007-07-11',
    topicCategory: 'MEDICINA_PREVENTIVA',
    system: 'SST',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Art. 1 al 19',
    specificLegalObligation: 'Realizar evaluaciones médicas ocupacionales de ingreso, periódicas y de egreso con base en el profesiograma; custodiar los conceptos de aptitud médica garantizando reserva ética de los diagnósticos; conservar historias clínicas por mínimo 20 años posteriores al retiro.',
    applicabilityExplanation: 'Aplica a todos los empleadores que contraten trabajadores dependientes o independientes.',
    juridicalStatus: 'VIGENTE_MODIFICADA',
    derogatedOrModifiedBy: 'Modificada parcialmente por la Resolución 1918 de 2009 (custodia de historias clínicas).',
    applicabilityStatus: 'APLICA',
    responsibleProcess: 'Medicina Preventiva y del Trabajo',
    responsibleRole: 'Médico Especialista en SST (IPS) & Líder HSEQ',
    requiredControlDescription: 'Profesiograma institucionalizado, convenios con IPS acreditada, conceptos de aptitud archivados con regla de 20 años en Repositorio.',
    controlImplementationStatus: 'IMPLEMENTADO',
    controlFrequency: 'CONTINUO',
    requiredEvidence: 'Conceptos de aptitud médica laboral, profesiograma aprobado y constancia de archivo por 20 años.',
    existingEvidenceDescription: 'Conceptos de aptitud digitalizados y custodiados bajo estricta confidencialidad médica en la Base Maestra y Repositorio.',
    linkedModule: 'DOCUMENTATION',
    evidenceIds: ['evi-examenes-medicos-2026'],
    evidenceFileNames: ['Conceptos_Aptitud_Medica_Consolidado_2026.pdf'],
    complianceStatus: 'CUMPLE',
    findingsOrObservations: 'Exámenes al 100% de trabajadores de planta. Historias custodiadas por IPS externa bajo reserva legal.',
    lastEvaluationDate: '2026-03-30',
    nextReviewDate: '2026-06-30',
    evaluatorName: 'Marcela Rincón Ortiz',
    officialSourceUrl: 'https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=25807',
    historyLog: [
      { id: 'h-10', date: '2026-01-15', action: 'Norma incorporada a la matriz legal', author: 'Sistema AGAE' }
    ]
  },

  // 9. Resolución 1792 de 1990 (Valores Límites de Ruido)
  {
    id: 'leg-009',
    internalCode: 'LEG-SST-009',
    normType: 'RESOLUCION',
    normNumber: '1792',
    normYear: '1990',
    issuingAuthority: 'Ministerios de Trabajo y de Salud',
    title: 'Valores límites permisibles para la exposición ocupacional al ruido',
    issueDate: '1990-05-03',
    topicCategory: 'HIGIENE_INDUSTRIAL',
    system: 'SST',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Art. 1',
    specificLegalObligation: 'Adoptar como valor límite permisible de exposición a ruido continuo para 8 horas diarias 85 dBA; implementar controles de ingeniería y dotación de protección auditiva certificada con factor de reducción NRR cuando se supere dicho umbral.',
    applicabilityExplanation: 'En el centro de distribución operan montacargas de combustión y zonas de empaque con ruido ambiental.',
    juridicalStatus: 'VIGENTE',
    applicabilityStatus: 'APLICA',
    responsibleProcess: 'Gestión Integral HSEQ',
    responsibleRole: 'Líder HSEQ & Coordinadora SG-SST',
    requiredControlDescription: 'Sonometría / Dosimetría de ruido ocupacional periódica, protectores auditivos tipo copa o inserción certificados.',
    controlImplementationStatus: 'EN_PROCESO',
    controlFrequency: 'ANUAL',
    requiredEvidence: 'Estudio higiénico de ruido industrial con calibración del sonómetro y entrega de protectores auditivos.',
    existingEvidenceDescription: 'Entrega de EPP auditivo realizada; medición sonométrica programada para Q2 con laboratorio higiénico.',
    linkedModule: 'DOCUMENTATION',
    evidenceIds: [],
    evidenceFileNames: [],
    complianceStatus: 'PENDIENTE_EVALUACION',
    findingsOrObservations: 'Pendiente entrega del informe de sonometría por parte de la firma externa de higiene.',
    lastEvaluationDate: '2026-01-15',
    nextReviewDate: '2026-05-30',
    evaluatorName: 'Marcela Rincón Ortiz',
    officialSourceUrl: 'https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=6349',
    historyLog: [
      { id: 'h-11', date: '2026-01-15', action: 'Norma incorporada a la matriz legal', author: 'Sistema AGAE' }
    ]
  },

  // 10. Resolución 2764 de 2022 (Batería Riesgo Psicosocial)
  {
    id: 'leg-010',
    internalCode: 'LEG-SST-010',
    normType: 'RESOLUCION',
    normNumber: '2764',
    normYear: '2022',
    issuingAuthority: 'Ministerio del Trabajo',
    title: 'Adopción de la Batería de Instrumentos para la Evaluación de Factores de Riesgo Psicosocial (Derogó la Resolución 2404 de 2019)',
    issueDate: '2022-07-18',
    topicCategory: 'RIESGOS_ESPECIFICOS',
    system: 'SST',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Art. 1 al 15',
    specificLegalObligation: 'Aplicar periódicamente la batería de riesgo psicosocial del Ministerio por psicólogo especialista en SST con licencia vigente; formular e implementar el programa de vigilancia epidemiológica psicosocial en empresas con riesgo medio, alto o muy alto.',
    applicabilityExplanation: 'Aplica a todas las empresas en Colombia con trabajadores vinculados formalmente.',
    juridicalStatus: 'VIGENTE',
    derogatedOrModifiedBy: 'Derogó expresamente la Resolución 2404 de 2019.',
    applicabilityStatus: 'APLICA',
    responsibleProcess: 'Gestión del Talento Humano & HSEQ',
    responsibleRole: 'Coordinadora de Talento Humano & Psicólogo Especialista en SST',
    requiredControlDescription: 'Aplicación anual/bienal de la batería oficial, talleres de manejo del estrés y seguimiento a casos prioritarios.',
    controlImplementationStatus: 'IMPLEMENTADO',
    controlFrequency: 'SEMESTRAL',
    requiredEvidence: 'Informe de diagnóstico de riesgo psicosocial firmado por psicólogo con licencia y plan de intervención.',
    existingEvidenceDescription: 'Batería aplicada en 2025; plan de pausas activas y talleres de comunicación asertiva en ejecución en 2026.',
    linkedModule: 'TRAINING',
    evidenceIds: ['evi-psicosocial-2025'],
    evidenceFileNames: ['Informe_Bateria_Psicosocial_2025_Licencia.pdf'],
    complianceStatus: 'CUMPLE',
    findingsOrObservations: 'Vigencia de la medición activa (aplicación bienal para nivel de riesgo medio).',
    lastEvaluationDate: '2026-02-10',
    nextReviewDate: '2026-08-10',
    evaluatorName: 'Diana Carolina Rojas',
    officialSourceUrl: 'https://www.mintrabajo.gov.co/normatividad/resoluciones-2022',
    historyLog: [
      { id: 'h-12', date: '2026-01-15', action: 'Norma incorporada a la matriz legal', author: 'Sistema AGAE' }
    ]
  },

  // 11. Ley 1523 de 2012 (Gestión del Riesgo y Emergencias)
  {
    id: 'leg-011',
    internalCode: 'LEG-SST-011',
    normType: 'LEY',
    normNumber: '1523',
    normYear: '2012',
    issuingAuthority: 'Congreso de la República',
    title: 'Política Nacional de Gestión del Riesgo de Desastres y Sistema Nacional de Gestión del Riesgo',
    issueDate: '2012-04-24',
    topicCategory: 'EMERGENCIAS_BRIGADA',
    system: 'SST',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Art. 42 (Análisis de vulnerabilidad y planes de contingencia para organizaciones privadas)',
    specificLegalObligation: 'Elaborar e implementar planes de gestión del riesgo y contingencia; conformar y capacitar brigadas de emergencia; señalizar rutas de evacuación; participar en simulacros municipales y distritales.',
    applicabilityExplanation: 'Aplica a todas las entidades públicas y privadas que puedan generar riesgos o verse afectadas por amenazas naturales o antrópicas.',
    juridicalStatus: 'VIGENTE',
    applicabilityStatus: 'APLICA',
    responsibleProcess: 'Gestión de Emergencias y Brigada',
    responsibleRole: 'Líder Brigada de Emergencias & Coordinadora SST',
    requiredControlDescription: 'Plan de Prevención, Preparación y Respuesta ante Emergencias actualizado, inspección de extintores, dotación de camillas y botiquines.',
    controlImplementationStatus: 'IMPLEMENTADO',
    controlFrequency: 'MENSUAL',
    requiredEvidence: 'Plan de Emergencias con planos de evacuación, actas de entrenamiento de brigadistas y planillas de extintores.',
    existingEvidenceDescription: 'Plan de emergencias formulado con simulacro programado para octubre; inspección de 14 extintores realizada en marzo 2026.',
    linkedModule: 'INSPECTIONS',
    evidenceIds: ['evi-plan-emergencias-2026', 'evi-insp-extintores-q1'],
    evidenceFileNames: ['Plan_Emergencias_Fontibon_2026.pdf', 'Planilla_Inspeccion_Extintores_Marzo_2026.pdf'],
    complianceStatus: 'CUMPLE',
    findingsOrObservations: 'Brigada activa con dotación básica verificada.',
    lastEvaluationDate: '2026-03-10',
    nextReviewDate: '2026-06-10',
    evaluatorName: 'Andrés Felipe Ramos',
    officialSourceUrl: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=47141',
    historyLog: [
      { id: 'h-13', date: '2026-01-15', action: 'Norma incorporada a la matriz legal', author: 'Sistema AGAE' }
    ]
  },

  // 12. Ley 1503 de 2011 & Resolución 40595 de 2022 (Seguridad Vial PESV)
  {
    id: 'leg-012',
    internalCode: 'LEG-PESV-001',
    normType: 'RESOLUCION',
    normNumber: '40595',
    normYear: '2022',
    issuingAuthority: 'Ministerio de Transporte',
    title: 'Metodología para el diseño, implementación y verificación de los Planes Estratégicos de Seguridad Vial (PESV)',
    issueDate: '2022-07-12',
    topicCategory: 'SEGURIDAD_VIAL_PESV',
    system: 'PESV',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Art. 1 al 10 y Anexo Metodológico (Pasos del 1 al 24 según nivel Estándar/Avanzado)',
    specificLegalObligation: 'Diseñar e implementar el PESV articulado con el SG-SST; conformar el Comité de Seguridad Vial; inspeccionar preoperacionalmente la flota vehicular; calificar conductores idóneos; investigar siniestros viales y monitorear indicadores.',
    applicabilityExplanation: 'La empresa opera flota de transporte y distribución con más de 10 vehículos propios y tercerizados.',
    juridicalStatus: 'VIGENTE',
    derogatedOrModifiedBy: 'Derogó la Resolución 1565 de 2014 conforme a la Ley 2050 de 2020 y Decreto 1252 de 2021.',
    applicabilityStatus: 'APLICA',
    responsibleProcess: 'Seguridad Vial & Transporte',
    responsibleRole: 'Coordinador de Seguridad Vial & Líder HSEQ',
    requiredControlDescription: 'Auditoría a los 24 pasos del PESV en el módulo vial de AGAE, control de mantenimientos y preoperacionales diarios.',
    controlImplementationStatus: 'IMPLEMENTADO',
    controlFrequency: 'CONTINUO',
    requiredEvidence: 'Documento del PESV bajo Res. 40595/2022, checklist preoperacionales de camiones, planes de mantenimiento vehicular.',
    existingEvidenceDescription: 'Módulo PESV activo con nivel Estándar (24 pasos), vehículos y conductores registrados con SOAT y RTM vigentes.',
    linkedModule: 'PESV',
    evidenceIds: ['evi-pesv-documento-2026'],
    evidenceFileNames: ['Documento_PESV_Metodologia_2026.pdf'],
    complianceStatus: 'CUMPLE',
    findingsOrObservations: 'Articulación total con el SG-SST conforme al artículo 2.2.4.6.15 del Decreto 1072.',
    lastEvaluationDate: '2026-03-28',
    nextReviewDate: '2026-06-28',
    evaluatorName: 'Marcela Rincón Ortiz',
    officialSourceUrl: 'https://www.mintransporte.gov.co/resoluciones-2022',
    historyLog: [
      { id: 'h-14', date: '2026-01-15', action: 'Norma incorporada a la matriz legal', author: 'Sistema AGAE' }
    ]
  },

  // 13. Resolución 2184 de 2019 (Código de Colores de Residuos)
  {
    id: 'leg-013',
    internalCode: 'LEG-AMB-001',
    normType: 'RESOLUCION',
    normNumber: '2184',
    normYear: '2019',
    issuingAuthority: 'Ministerio de Ambiente y Desarrollo Sostenible',
    title: 'Adopción del código de colores para la separación de residuos sólidos en la fuente (Blanco, Negro y Verde)',
    issueDate: '2019-12-26',
    topicCategory: 'GESTION_AMBIENTAL',
    system: 'AMBIENTAL',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Art. 1 al 6',
    specificLegalObligation: 'Separar los residuos sólidos en la fuente utilizando el código de colores unificado nacional: Blanco (Aprovechables), Verde (Orgánicos aprovechables) y Negro (No aprovechables); almacenar y disponer con gestores autorizados.',
    applicabilityExplanation: 'Aplica a todas las organizaciones que generen residuos sólidos en el territorio nacional.',
    juridicalStatus: 'VIGENTE',
    applicabilityStatus: 'APLICA',
    responsibleProcess: 'Gestión Ambiental y Sostenibilidad',
    responsibleRole: 'Coordinador Ambiental & Servicios Generales',
    requiredControlDescription: 'Puntos ecológicos con código de colores en todas las áreas, bitácora de generación de residuos y certificados de disposición final.',
    controlImplementationStatus: 'IMPLEMENTADO',
    controlFrequency: 'CONTINUO',
    requiredEvidence: 'Puntos ecológicos rotulados, manifiestos de recolección y certificados de aprovechamiento.',
    existingEvidenceDescription: 'Puntos ecológicos instalados en oficinas y centro de distribución; registro de residuos PGIRS al día.',
    linkedModule: 'ENVIRONMENTAL',
    evidenceIds: ['evi-residuos-cert-2026'],
    evidenceFileNames: ['Certificado_Disposicion_Residuos_Q1.pdf'],
    complianceStatus: 'CUMPLE',
    findingsOrObservations: '100% de puntos ecológicos estandarizados bajo la norma.',
    lastEvaluationDate: '2026-03-25',
    nextReviewDate: '2026-06-25',
    evaluatorName: 'Marcela Rincón Ortiz',
    officialSourceUrl: 'https://www.minambiente.gov.co/resoluciones-2019',
    historyLog: [
      { id: 'h-15', date: '2026-01-15', action: 'Norma incorporada a la matriz legal', author: 'Sistema AGAE' }
    ]
  },

  // 14. NORMA DEROGADA (Histórico para trazabilidad): Resolución 1409 de 2012
  {
    id: 'leg-014',
    internalCode: 'LEG-SST-014',
    normType: 'RESOLUCION',
    normNumber: '1409',
    normYear: '2012',
    issuingAuthority: 'Ministerio del Trabajo',
    title: 'Reglamento de Seguridad para protección contra caídas en trabajo en alturas (DEROGADA)',
    issueDate: '2012-07-23',
    topicCategory: 'SEGURIDAD_INDUSTRIAL',
    system: 'SST',
    jurisdiction: 'NACIONAL',
    applicableArticles: 'Totalidad de la norma (Derogada íntegramente)',
    specificLegalObligation: 'Reglamento anterior para trabajo en alturas a 1.50 metros.',
    applicabilityExplanation: 'Conservada en la matriz con fines de auditoría histórica y trazabilidad normativa.',
    juridicalStatus: 'DEROGADA_TOTAL',
    derogatedOrModifiedBy: 'Derogada expresamente por el Art. 68 de la Resolución 4272 del 27 de diciembre de 2021.',
    derogationDate: '2021-12-27',
    applicabilityStatus: 'NO_APLICA',
    applicabilityJustification: 'Norma derogada por la Resolución 4272 de 2021; las obligaciones fueron asumidas bajo la nueva disposición.',
    responsibleProcess: 'Gestión Integral HSEQ',
    responsibleRole: 'Líder HSEQ & Coordinadora SG-SST',
    requiredControlDescription: 'Transición completada hacia la Resolución 4272 de 2021.',
    controlImplementationStatus: 'IMPLEMENTADO',
    controlFrequency: 'EVENTUAL',
    requiredEvidence: 'Acta de actualización normativa del SG-SST 2022.',
    existingEvidenceDescription: 'Registros actualizados bajo Res. 4272 de 2021.',
    linkedModule: 'SST',
    evidenceIds: [],
    evidenceFileNames: [],
    complianceStatus: 'NO_APLICA_JUSTIFICADO',
    findingsOrObservations: 'Norma sin vigencia jurídica. Se conserva en el histórico para trazabilidad de auditorías.',
    lastEvaluationDate: '2022-01-10',
    nextReviewDate: '2026-12-31',
    evaluatorName: 'Marcela Rincón Ortiz',
    officialSourceUrl: 'https://www.mintrabajo.gov.co',
    historyLog: [
      { id: 'h-16', date: '2022-01-10', action: 'Norma marcada como DEROGADA TOTAL por expedición de Res. 4272/2021', author: 'Sistema AGAE' }
    ]
  }
];

// ---------------------------------------------------------------------
// 2. PROCEDIMIENTO EDITABLE DE REQUISITOS LEGALES (18 SECCIONES)
// Código: PR-SGSST-LEG-001 | Versión 001
// ---------------------------------------------------------------------
export const DEFAULT_LEGAL_PROCEDURE: LegalRequirementsProcedure = {
  code: 'PR-SGSST-LEG-001',
  version: '001',
  title: 'Procedimiento para la Identificación, Actualización y Evaluación de Requisitos Legales y de Otra Índole',
  reviewFrequency: 'TRIMESTRAL',
  status: 'VIGENTE',
  responsibleRole: 'Líder HSEQ & Coordinadora SG-SST',
  preparedBy: 'Marcela Rincón Ortiz',
  preparedPosition: 'Líder HSEQ & Coordinadora SG-SST',
  preparedDate: '2026-01-15',
  reviewedBy: 'Carlos Eduardo Mendoza',
  reviewedPosition: 'Presidente COPASST & Supervisor de Operaciones',
  reviewedDate: '2026-01-18',
  approvedBy: 'Lic. Fernando Ortiz Salazar',
  approvedPosition: 'Gerente General & Representante Legal',
  approvedDate: '2026-01-20',
  approvalWorkflow: {
    preparedBy: {
      name: 'Marcela Rincón Ortiz',
      role: 'Líder HSEQ & Coordinadora SG-SST',
      date: '2026-01-15',
      signatureToken: 'SIG-WRK-001-PR-LEG-001'
    },
    reviewedBy: {
      name: 'Carlos Eduardo Mendoza',
      role: 'Presidente COPASST & Supervisor de Operaciones',
      date: '2026-01-18',
      signatureToken: 'SIG-WRK-002-PR-LEG-002'
    },
    approvedBy: {
      name: 'Lic. Fernando Ortiz Salazar',
      role: 'Gerente General & Representante Legal',
      date: '2026-01-20',
      signatureToken: 'SIG-MGR-004-PR-LEG-003'
    },
    isApproved: true,
    approvedAt: '2026-01-20 10:30'
  },
  sections: [
    {
      id: 'sec-leg-01',
      sectionNumber: 1,
      title: '1. Portada y Control Documental',
      content: 'PROCEDIMIENTO DE CONTROL DE REQUISITOS LEGALES\nCódigo: PR-SGSST-LEG-001 | Versión: 001\nSistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST) y PESV.\nEste procedimiento define la directriz metodológica obligatoria para la identificación proactiva, análisis de aplicabilidad, actualización periódica y evaluación del cumplimiento de las normas colombianas aplicables a la organización.',
      defaultSuggestedContent: 'PROCEDIMIENTO DE CONTROL DE REQUISITOS LEGALES\nCódigo: PR-SGSST-LEG-001 | Versión: 001\nSistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST) y PESV.\nEste procedimiento define la directriz metodológica obligatoria para la identificación proactiva, análisis de aplicabilidad, actualización periódica y evaluación del cumplimiento de las normas colombianas aplicables a la organización.',
      isCustomized: false
    },
    {
      id: 'sec-leg-02',
      sectionNumber: 2,
      title: '2. Objetivo del Procedimiento',
      content: 'Establecer, documentar e implementar la metodología sistemática para identificar, registrar, difundir, actualizar y evaluar periódicamente los requisitos legales nacionales, departamentales, municipales y de otra índole aplicables a la organización en materia de Seguridad y Salud en el Trabajo (SST), Seguridad Vial (PESV) y Medio Ambiente, garantizando el cumplimiento normativo y la mitigación de contingencias legales.',
      defaultSuggestedContent: 'Establecer, documentar e implementar la metodología sistemática para identificar, registrar, difundir, actualizar y evaluar periódicamente los requisitos legales nacionales, departamentales, municipales y de otra índole aplicables a la organización en materia de Seguridad y Salud en el Trabajo (SST), Seguridad Vial (PESV) y Medio Ambiente, garantizando el cumplimiento normativo y la mitigación de contingencias legales.',
      isCustomized: false
    },
    {
      id: 'sec-leg-03',
      sectionNumber: 3,
      title: '3. Alcance',
      content: 'Este procedimiento aplica a todas las actividades, procesos estratégicos, misionales y de apoyo, sedes fijas, centros de distribución, personal directo, contratistas, proveedores y partes interesadas de la organización en todo el territorio colombiano.',
      defaultSuggestedContent: 'Este procedimiento aplica a todas las actividades, procesos estratégicos, misionales y de apoyo, sedes fijas, centros de distribución, personal directo, contratistas, proveedores y partes interesadas de la organización en todo el territorio colombiano.',
      isCustomized: false
    },
    {
      id: 'sec-leg-04',
      sectionNumber: 4,
      title: '4. Referencias Normativas',
      content: '• Decreto 1072 de 2015, Art. 2.2.4.6.8 Numeral 2 (Obligaciones de empleadores en requisitos normativos) y Art. 2.2.4.6.12 Numeral 15 (Matriz legal como documento obligatorio).\n• Resolución 0312 de 2019, Estándar 2.4.1 (Matriz de requisitos legales actualizada).\n• Ley 1562 de 2012 (Sistema General de Riesgos Laborales).\n• Ley 1503 de 2011 y Resolución 40595 de 2022 (Planes Estratégicos de Seguridad Vial).\n• Normas técnicas sectoriales y reglamentos específicos aplicables a las actividades de la empresa.',
      defaultSuggestedContent: '• Decreto 1072 de 2015, Art. 2.2.4.6.8 Numeral 2 (Obligaciones de empleadores en requisitos normativos) y Art. 2.2.4.6.12 Numeral 15 (Matriz legal como documento obligatorio).\n• Resolución 0312 de 2019, Estándar 2.4.1 (Matriz de requisitos legales actualizada).\n• Ley 1562 de 2012 (Sistema General de Riesgos Laborales).\n• Ley 1503 de 2011 y Resolución 40595 de 2022 (Planes Estratégicos de Seguridad Vial).\n• Normas técnicas sectoriales y reglamentos específicos aplicables a las actividades de la empresa.',
      isCustomized: false
    },
    {
      id: 'sec-leg-05',
      sectionNumber: 5,
      title: '5. Definiciones Clave',
      content: '• Matriz Legal: Compilación de los requisitos normativos exigibles a la empresa acordes con las actividades propias e inherentes de su actividad productiva.\n• Requisito Legal: Obligación jurídica contenida en leyes, decretos, resoluciones o circulares emanadas de autoridades competentes.\n• Estado Jurídico: Condición formal de vigencia de una norma (Vigente, Modificada, Derogada, Sustituida).\n• Aplicabilidad: Determinación técnica de si una disposición legal genera obligaciones directas o indirectas para la empresa.\n• Evaluación de Cumplimiento: Comparación sistemática entre la exigencia legal y las evidencias y controles reales constatados.',
      defaultSuggestedContent: '• Matriz Legal: Compilación de los requisitos normativos exigibles a la empresa acordes con las actividades propias e inherentes de su actividad productiva.\n• Requisito Legal: Obligación jurídica contenida en leyes, decretos, resoluciones o circulares emanadas de autoridades competentes.\n• Estado Jurídico: Condición formal de vigencia de una norma (Vigente, Modificada, Derogada, Sustituida).\n• Aplicabilidad: Determinación técnica de si una disposición legal genera obligaciones directas o indirectas para la empresa.\n• Evaluación de Cumplimiento: Comparación sistemática entre la exigencia legal y las evidencias y controles reales constatados.',
      isCustomized: false
    },
    {
      id: 'sec-leg-06',
      sectionNumber: 6,
      title: '6. Responsabilidades en el Control Legal',
      content: '• Alta Dirección / Representante Legal: Proveer recursos para el cumplimiento legal, suscribir las políticas y avalar el informe de evaluación anual.\n• Responsable del SG-SST (Líder HSEQ): Monitorear la legislación colombiana, mantener actualizada la matriz legal en AGAE, programar evaluaciones periódicas y derivar acciones correctivas (ACPM).\n• Líderes de Proceso y Jefes de Área: Conocer las normas de su competencia, ejecutar los controles operacionales y aportar las evidencias documentales requeridas.\n• COPASST y Comité de Convivencia: Velar por el cumplimiento de las normas de su competencia y participar en las revisiones del sistema.',
      defaultSuggestedContent: '• Alta Dirección / Representante Legal: Proveer recursos para el cumplimiento legal, suscribir las políticas y avalar el informe de evaluación anual.\n• Responsable del SG-SST (Líder HSEQ): Monitorear la legislación colombiana, mantener actualizada la matriz legal en AGAE, programar evaluaciones periódicas y derivar acciones correctivas (ACPM).\n• Líderes de Proceso y Jefes de Área: Conocer las normas de su competencia, ejecutar los controles operacionales y aportar las evidencias documentales requeridas.\n• COPASST y Comité de Convivencia: Velar por el cumplimiento de las normas de su competencia y participar en las revisiones del sistema.',
      isCustomized: false
    },
    {
      id: 'sec-leg-07',
      sectionNumber: 7,
      title: '7. Metodología para Identificar Requisitos Legales',
      content: 'La identificación de normas no se limita al código CIIU. Se fundamenta en un análisis multidimensional que contempla: actividades rutinarias y no rutinarias, peligros de la Matriz GTC 45, sustancias químicas manipuladas, maquinaria e instalaciones, flota vehicular (PESV), aspectos ambientales y directrices territoriales de las sedes operativas.',
      defaultSuggestedContent: 'La identificación de normas no se limita al código CIIU. Se fundamenta en un análisis multidimensional que contempla: actividades rutinarias y no rutinarias, peligros de la Matriz GTC 45, sustancias químicas manipuladas, maquinaria e instalaciones, flota vehicular (PESV), aspectos ambientales y directrices territoriales de las sedes operativas.',
      isCustomized: false
    },
    {
      id: 'sec-leg-08',
      sectionNumber: 8,
      title: '8. Fuentes Oficiales de Consulta Jurídica',
      content: 'Las normas se consultarán exclusivamente en fuentes oficiales reconocidas para evitar aplicar información no verificada:\n1. Sistema Único de Información Normativa (SUIN - Juriscol).\n2. Diario Oficial de la República de Colombia (Imprenta Nacional).\n3. Páginas web oficiales de los Ministerios (MinTrabajo, MinSalud, MinTransporte, MinAmbiente).\n4. Secretarías de Salud distritales y departamentales.\n5. Circulares y comunicados técnicos emitidos por la Administradora de Riesgos Laborales (ARL).',
      defaultSuggestedContent: 'Las normas se consultarán exclusivamente en fuentes oficiales reconocidas para evitar aplicar información no verificada:\n1. Sistema Único de Información Normativa (SUIN - Juriscol).\n2. Diario Oficial de la República de Colombia (Imprenta Nacional).\n3. Páginas web oficiales de los Ministerios (MinTrabajo, MinSalud, MinTransporte, MinAmbiente).\n4. Secretarías de Salud distritales y departamentales.\n5. Circulares y comunicados técnicos emitidos por la Administradora de Riesgos Laborales (ARL).',
      isCustomized: false
    },
    {
      id: 'sec-leg-09',
      sectionNumber: 9,
      title: '9. Criterios para Determinar la Aplicabilidad',
      content: 'Para cada norma identificada se evalúa si sus supuestos de hecho coinciden con las operaciones de la empresa:\n• Aplica: La norma genera obligaciones directas a la organización.\n• Aplica Parcialmente: Solo algunos artículos son exigibles (deben documentarse expresamente cuáles aplican y cuáles no con sustento técnico).\n• No Aplica: No coincide con los procesos de la empresa. Debe quedar registrada la justificación técnica objetiva. Bajo ninguna circunstancia se marcará No Aplica por falta de evidencias.',
      defaultSuggestedContent: 'Para cada norma identificada se evalúa si sus supuestos de hecho coinciden con las operaciones de la empresa:\n• Aplica: La norma genera obligaciones directas a la organización.\n• Aplica Parcialmente: Solo algunos artículos son exigibles (deben documentarse expresamente cuáles aplican y cuáles no con sustento técnico).\n• No Aplica: No coincide con los procesos de la empresa. Debe quedar registrada la justificación técnica objetiva. Bajo ninguna circunstancia se marcará No Aplica por falta de evidencias.',
      isCustomized: false
    },
    {
      id: 'sec-leg-10',
      sectionNumber: 10,
      title: '10. Metodología para Actualizar la Matriz',
      content: 'La matriz legal se actualizará en la plataforma AGAE SOLUTIONS mediante:\n1. Revisiones periódicas trimestrales programadas en el Plan Anual.\n2. Revisiones extraordinarias ante expedición de nuevas normas de alto impacto, modificaciones de procesos, apertura de sedes, ingreso de nueva maquinaria o sustancias químicas.\n3. Registro del responsable de la revisión y fecha de corte.',
      defaultSuggestedContent: 'La matriz legal se actualizará en la plataforma AGAE SOLUTIONS mediante:\n1. Revisiones periódicas trimestrales programadas en el Plan Anual.\n2. Revisiones extraordinarias ante expedición de nuevas normas de alto impacto, modificaciones de procesos, apertura de sedes, ingreso de nueva maquinaria o sustancias químicas.\n3. Registro del responsable de la revisión y fecha de corte.',
      isCustomized: false
    },
    {
      id: 'sec-leg-11',
      sectionNumber: 11,
      title: '11. Criterios para Modificaciones y Derogatorias',
      content: 'Cuando una norma sea derogada, no se eliminará del registro histórico de AGAE; se cambiará su estado a DEROGADA TOTAL o PARCIAL, registrando la fecha y la norma sustituta (ejemplo: Res. 1409/2012 derogada por Res. 4272/2021). Si una norma es modificada, se analizará si los nuevos artículos imponen controles o evidencias adicionales.',
      defaultSuggestedContent: 'Cuando una norma sea derogada, no se eliminará del registro histórico de AGAE; se cambiará su estado a DEROGADA TOTAL o PARCIAL, registrando la fecha y la norma sustituta (ejemplo: Res. 1409/2012 derogada por Res. 4272/2021). Si una norma es modificada, se analizará si los nuevos artículos imponen controles o evidencias adicionales.',
      isCustomized: false
    },
    {
      id: 'sec-leg-12',
      sectionNumber: 12,
      title: '12. Método para Definir Controles de Cumplimiento',
      content: 'Para cada obligación legal aplicable se define un control específico que responda a: ¿Qué se hace? (Procedimiento o actividad), ¿Quién lo hace? (Responsable), ¿Con qué frecuencia? (Periodicidad), ¿Cómo se comprueba? (Evidencia documental en AGAE) y ¿Qué criterio técnico valida el cumplimiento?',
      defaultSuggestedContent: 'Para cada obligación legal aplicable se define un control específico que responda a: ¿Qué se hace? (Procedimiento o actividad), ¿Quién lo hace? (Responsable), ¿Con qué frecuencia? (Periodicidad), ¿Cómo se comprueba? (Evidencia documental en AGAE) y ¿Qué criterio técnico valida el cumplimiento?',
      isCustomized: false
    },
    {
      id: 'sec-leg-13',
      sectionNumber: 13,
      title: '13. Metodología de Evaluación de Cumplimiento',
      content: 'La evaluación se realiza comparando la evidencia existente contra la exigencia legal, calificando:\n• CUMPLE: Existe control implementado con evidencia verificable al 100%.\n• CUMPLE PARCIAL: El control está formulado pero la evidencia es incompleta o la cobertura no es total.\n• NO CUMPLE: La obligación es exigible pero no existe control ni evidencia.\n• PENDIENTE DE EVALUACIÓN: No se cuenta con datos suficientes para emitir juicio técnico.\n• NO APLICA JUSTIFICADO: Obligación excluida formalmente por no coincidir con el alcance.',
      defaultSuggestedContent: 'La evaluación se realiza comparando la evidencia existente contra la exigencia legal, calificando:\n• CUMPLE: Existe control implementado con evidencia verificable al 100%.\n• CUMPLE PARCIAL: El control está formulado pero la evidencia es incompleta o la cobertura no es total.\n• NO CUMPLE: La obligación es exigible pero no existe control ni evidencia.\n• PENDIENTE DE EVALUACIÓN: No se cuenta con datos suficientes para emitir juicio técnico.\n• NO APLICA JUSTIFICADO: Obligación excluida formalmente por no coincidir con el alcance.',
      isCustomized: false
    },
    {
      id: 'sec-leg-14',
      sectionNumber: 14,
      title: '14. Periodicidad de Revisión y Evaluación',
      content: 'La frecuencia base de evaluación de cumplimiento es TRIMESTRAL, coincidiendo con los cortes de indicadores del SG-SST. Al cierre de cada vigencia anual se elaborará el Diagnóstico Consolidado de Requisitos Legales que servirá como insumo directo para la Revisión por la Dirección (Dec. 1072 Art. 2.2.4.6.31).',
      defaultSuggestedContent: 'La frecuencia base de evaluación de cumplimiento es TRIMESTRAL, coincidiendo con los cortes de indicadores del SG-SST. Al cierre de cada vigencia anual se elaborará el Diagnóstico Consolidado de Requisitos Legales que servirá como insumo directo para la Revisión por la Dirección (Dec. 1072 Art. 2.2.4.6.31).',
      isCustomized: false
    },
    {
      id: 'sec-leg-15',
      sectionNumber: 15,
      title: '15. Gestión de Incumplimientos Legales',
      content: 'Todo resultado calificado como NO CUMPLE o CUMPLE PARCIAL generará de forma inmediata una Acción Correctiva o de Mejora en el módulo ACPM de AGAE, con análisis de causas raíz (5 Porqués o Ishikawa), responsable asignado, presupuesto y fecha límite perentoria de subsanación.',
      defaultSuggestedContent: 'Todo resultado calificado como NO CUMPLE o CUMPLE PARCIAL generará de forma inmediata una Acción Correctiva o de Mejora en el módulo ACPM de AGAE, con análisis de causas raíz (5 Porqués o Ishikawa), responsable asignado, presupuesto y fecha límite perentoria de subsanación.',
      isCustomized: false
    },
    {
      id: 'sec-leg-16',
      sectionNumber: 16,
      title: '16. Generación y Seguimiento de Acciones de Mejora',
      content: 'Las acciones de mejora derivadas de la evaluación legal se monitorean mensualmente en el comité de HSEQ. No se cerrará ninguna ACPM sin que se haya aportado la evidencia documental que subsane el incumplimiento legal.',
      defaultSuggestedContent: 'Las acciones de mejora derivadas de la evaluación legal se monitorean mensualmente en el comité de HSEQ. No se cerrará ninguna ACPM sin que se haya aportado la evidencia documental que subsane el incumplimiento legal.',
      isCustomized: false
    },
    {
      id: 'sec-leg-17',
      sectionNumber: 17,
      title: '17. Registros y Evidencias Generadas',
      content: 'Constituyen registros obligatorios del SG-SST:\n1. La Matriz de Requisitos Legales actualizada (MT-SGSST-LEG-001).\n2. El presente Procedimiento de Control Legal (PR-SGSST-LEG-001).\n3. Informes Diagnósticos de Cumplimiento Legal (IF-SGSST-LEG-001).\n4. Soportes y evidencias archivadas en el Repositorio Documental Central por mínimo 20 años en los ítems contemplados en el Art. 2.2.4.6.13.',
      defaultSuggestedContent: 'Constituyen registros obligatorios del SG-SST:\n1. La Matriz de Requisitos Legales actualizada (MT-SGSST-LEG-001).\n2. El presente Procedimiento de Control Legal (PR-SGSST-LEG-001).\n3. Informes Diagnósticos de Cumplimiento Legal (IF-SGSST-LEG-001).\n4. Soportes y evidencias archivadas en el Repositorio Documental Central por mínimo 20 años en los ítems contemplados en el Art. 2.2.4.6.13.',
      isCustomized: false
    },
    {
      id: 'sec-leg-18',
      sectionNumber: 18,
      title: '18. Control de Cambios del Procedimiento',
      content: 'Versión 001 (Enero 2026): Estructuración inicial del procedimiento bajo el Decreto 1072 de 2015 y la Resolución 0312 de 2019 Estándar 2.4.1, incorporando trazabilidad de vigencia normativa, evaluación multidimensional e integración con AGAE SOLUTIONS.',
      defaultSuggestedContent: 'Versión 001 (Enero 2026): Estructuración inicial del procedimiento bajo el Decreto 1072 de 2015 y la Resolución 0312 de 2019 Estándar 2.4.1, incorporando trazabilidad de vigencia normativa, evaluación multidimensional e integración con AGAE SOLUTIONS.',
      isCustomized: false
    }
  ]
};

// ---------------------------------------------------------------------
// 3. ALERTAS DE CAMBIOS NORMATIVOS ACTIVAS
// ---------------------------------------------------------------------
export const DEFAULT_LEGAL_CHANGE_ALERTS: LegalChangeAlert[] = [
  {
    id: 'alt-001',
    normTitle: 'Reglamentación del Comité de Convivencia Laboral y Medidas contra el Acoso Laboral',
    normNumber: 'Resolución 3461 de 2025',
    affectedNorm: 'Res. 3461/2025 (Derogó Res. 652/2012)',
    issuingAuthority: 'Ministerio del Trabajo',
    publishedDate: '2025-07-20',
    changeType: 'NUEVA_NORMA',
    changeSummary: 'Expide nuevo reglamento para comités de convivencia, medidas preventivas y correctivas frente al acoso laboral, y reserva probatoria de actas y descargos.',
    impactDescription: 'Derogó la Resolución 652 de 2012 e introdujo protocolos estrictos de reserva legal, mediación confidencial y sesiones trimestrales obligatorias.',
    affectedTopics: ['COMITES_SST', 'RIESGOS_ESPECIFICOS'],
    officialSource: 'Ministerio del Trabajo - República de Colombia',
    dateDetected: '2025-07-20',
    status: 'EVALUADO_APLICA',
    reviewStatus: 'ACCION_ADOPTADA',
    actionRequired: false,
    reviewedBy: 'Marcela Rincón Ortiz',
    reviewedAt: '2026-01-15',
    actionsTaken: 'Matriz legal actualizada con LEG-SST-006 y módulo CCL ajustado con el nuevo protocolo de 2025.',
    actionsAdopted: 'Parametrización completa del módulo CCL (1.1.8) con acta de instalación conforme a Res. 3461/2025.'
  },
  {
    id: 'alt-002',
    normTitle: 'Actualización de Criterios de Evaluación y Reporte de Estándares Mínimos en Portal MinTrabajo',
    normNumber: 'Circular 0093 de 2025',
    affectedNorm: 'Circular 0093/2025 MinTrabajo',
    issuingAuthority: 'Dirección de Riesgos Laborales',
    publishedDate: '2025-11-10',
    changeType: 'PLAZO_CUMPLIMIENTO',
    changeSummary: 'Fija directrices para el reporte digital obligatorio del formulario de autoevaluación de estándares mínimos SG-SST en el Fondo de Riesgos Laborales.',
    impactDescription: 'Establece directrices para el cargue anual de la autoevaluación de estándares mínimos en el aplicativo web del Ministerio.',
    affectedTopics: ['SST_GENERAL'],
    officialSource: 'Dirección de Riesgos Laborales - MinTrabajo',
    dateDetected: '2025-11-10',
    status: 'EVALUADO_APLICA',
    reviewStatus: 'REVISADA',
    actionRequired: false,
    reviewedBy: 'Marcela Rincón Ortiz',
    reviewedAt: '2026-02-05',
    actionsTaken: 'Autoevaluación 2026 radicada satisfactoriamente con reporte descargable de AGAE.',
    actionsAdopted: 'Autoevaluación generada en AGAE y exportada para radicación en portal ministerial.'
  }
];

// ---------------------------------------------------------------------
// 4. FUNCIONES DE CÁLCULO DE MÉTRICAS Y DIAGNÓSTICO
// ---------------------------------------------------------------------

/**
 * Calcula las métricas reales y transparentes de la matriz legal:
 * - Cumplimiento = (Obligaciones Cumplidas / Obligaciones Aplicables Evaluadas) * 100
 * - Muestra explícitamente numerador, denominador y aviso si faltan datos.
 */
export function calculateLegalMatrixMetrics(
  requirements: LegalRequirementItem[]
): LegalMatrixMetrics {
  const totalNormsRegistered = requirements.length;
  const activeNormsCount = requirements.filter(
    r => r.juridicalStatus === 'VIGENTE' || r.juridicalStatus === 'VIGENTE_MODIFICADA'
  ).length;
  const modifiedNormsCount = requirements.filter(r => r.juridicalStatus === 'VIGENTE_MODIFICADA').length;
  const derogatedNormsCount = requirements.filter(
    r => r.juridicalStatus === 'DEROGADA_TOTAL' || r.juridicalStatus === 'DEROGADA_PARCIAL'
  ).length;
  const pendingVerificationCount = requirements.filter(
    r => r.juridicalStatus === 'PENDIENTE_VERIFICACION'
  ).length;

  // Obligaciones aplicables a la empresa (excluye las que no aplican o están derogadas y no aplican)
  const applicableRequirements = requirements.filter(
    r => r.applicabilityStatus === 'APLICA' || r.applicabilityStatus === 'APLICA_PARCIAL'
  );
  const totalApplicableObligations = applicableRequirements.length;

  const compliantCount = applicableRequirements.filter(r => r.complianceStatus === 'CUMPLE').length;
  const partiallyCompliantCount = applicableRequirements.filter(r => r.complianceStatus === 'CUMPLE_PARCIAL').length;
  const nonCompliantCount = applicableRequirements.filter(r => r.complianceStatus === 'NO_CUMPLE').length;
  const pendingEvaluationCount = applicableRequirements.filter(r => r.complianceStatus === 'PENDIENTE_EVALUACION').length;
  const insufficientEvidenceCount = applicableRequirements.filter(
    r => r.complianceStatus === 'CUMPLE_PARCIAL' || (r.complianceStatus === 'PENDIENTE_EVALUACION' && r.evidenceFileNames.length === 0)
  ).length;

  // Evaluadas: Aquellas que ya tienen juicio emitido (Cumple, Cumple Parcial, No Cumple)
  const evaluatedObligationsCount = compliantCount + partiallyCompliantCount + nonCompliantCount;

  let compliancePercentage: number | null = null;
  let complianceDisplay = 'Sin datos suficientes para calcular el porcentaje';

  if (evaluatedObligationsCount > 0) {
    compliancePercentage = Math.round((compliantCount / evaluatedObligationsCount) * 1000) / 10;
    complianceDisplay = `${compliantCount} / ${evaluatedObligationsCount} (${compliancePercentage.toFixed(1)}%)`;
  }

  const pendingAcpmCount = applicableRequirements.filter(r => Boolean(r.linkedAcpmId)).length;
  
  // Próximas revisiones (en los próximos 90 días o vencidas)
  const today = new Date().toISOString().substring(0, 10);
  const upcomingReviewsCount = applicableRequirements.filter(
    r => r.nextReviewDate && r.nextReviewDate <= today
  ).length;

  return {
    totalNormsRegistered,
    activeNormsCount,
    modifiedNormsCount,
    derogatedNormsCount,
    pendingVerificationCount,
    totalApplicableObligations,
    evaluatedObligationsCount,
    compliantCount,
    partiallyCompliantCount,
    nonCompliantCount,
    pendingEvaluationCount,
    insufficientEvidenceCount,
    compliancePercentage,
    complianceDisplay,
    pendingAcpmCount,
    upcomingReviewsCount
  };
}

// ---------------------------------------------------------------------
// 5. ESTADO INICIAL
// ---------------------------------------------------------------------
export const INITIAL_LEGAL_MATRIX_STATE: LegalMatrixState = {
  requirements: DEFAULT_LEGAL_REQUIREMENTS,
  procedure: DEFAULT_LEGAL_PROCEDURE,
  alerts: DEFAULT_LEGAL_CHANGE_ALERTS,
  lastFullEvaluationDate: '2026-03-30',
  metrics: calculateLegalMatrixMetrics(DEFAULT_LEGAL_REQUIREMENTS)
};
