// ============================================================================
// Datos y Métodos del Módulo de Archivo y Retención Documental (Estándar 2.2.1)
// Decreto 1072 de 2015 Art. 2.2.4.6.12 y 2.2.4.6.13 • Resolución 0312 de 2019
// ============================================================================

import {
  DocumentTypeCatalogItem,
  DocumentProcessCatalogItem,
  DocumentRetentionRule,
  ControlledDocument,
  DocumentControlProcedure,
  DocumentMasterMetrics,
  DocumentManagementState,
  ManagementSystemType
} from '@/types/document-management';

// ----------------------------------------------------------------------------
// 1. CATÁLOGO INICIAL DE TIPOS DOCUMENTALES (Configurable por la empresa)
// ----------------------------------------------------------------------------
export const DEFAULT_DOCUMENT_TYPES: DocumentTypeCatalogItem[] = [
  { code: 'AC', name: 'Acta', description: 'Actas de reunión, conformación, designación y comités', isDefault: true },
  { code: 'PR', name: 'Procedimiento', description: 'Documentos que especifican la forma de llevar a cabo una actividad o proceso', isDefault: true },
  { code: 'FT', name: 'Formato', description: 'Plantillas y formularios estandarizados para captura de datos', isDefault: true },
  { code: 'RG', name: 'Registro', description: 'Documentos que presentan resultados obtenidos o proporcionan evidencia de actividades desempeñadas', isDefault: true },
  { code: 'PG', name: 'Programa', description: 'Conjunto estructurado de actividades de gestión con objetivos, metas y recursos', isDefault: true },
  { code: 'PL', name: 'Plan', description: 'Documentos que establecen la planificación operativa, anual o estratégica', isDefault: true },
  { code: 'MT', name: 'Matriz', description: 'Herramientas tabulares de identificación, evaluación y valoración técnica', isDefault: true },
  { code: 'IF', name: 'Informe', description: 'Reportes técnicos, diagnósticos, resultados de auditoría y evaluaciones', isDefault: true },
  { code: 'IN', name: 'Instructivo', description: 'Guías paso a paso de ejecución de tareas operativas específicas', isDefault: true },
  { code: 'MN', name: 'Manual', description: 'Compendios normativos, reglamentos internos y directrices del sistema', isDefault: true },
  { code: 'PO', name: 'Política', description: 'Directrices formales y compromisos de la alta dirección', isDefault: true },
  { code: 'LC', name: 'Lista de Chequeo', description: 'Listas de verificación estructuradas para inspecciones y control', isDefault: true }
];

// ----------------------------------------------------------------------------
// 2. CATÁLOGO INICIAL DE PROCESOS (Configurable por la empresa)
// ----------------------------------------------------------------------------
export const DEFAULT_DOCUMENT_PROCESSES: DocumentProcessCatalogItem[] = [
  { code: 'GEN', name: 'General', description: 'Gestión general, transversal y de dirección', isDefault: true },
  { code: 'COP', name: 'COPASST', description: 'Comité Paritario de Seguridad y Salud en el Trabajo', isDefault: true },
  { code: 'CCL', name: 'Convivencia', description: 'Comité de Convivencia Laboral y prevención de acoso (Res. 3461)', isDefault: true },
  { code: 'CAP', name: 'Capacitación', description: 'Formación, inducción, entrenamiento y aula virtual', isDefault: true },
  { code: 'INS', name: 'Inspecciones', description: 'Inspecciones de seguridad, instalaciones y equipos', isDefault: true },
  { code: 'EME', name: 'Emergencias', description: 'Prevención, preparación y respuesta ante emergencias', isDefault: true },
  { code: 'PEL', name: 'Peligros y Riesgos', description: 'Identificación de peligros y valoración GTC 45', isDefault: true },
  { code: 'LEG', name: 'Requisitos Legales', description: 'Identificación y evaluación de cumplimiento normativo', isDefault: true },
  { code: 'PVE', name: 'Vigilancia Epidemiológica', description: 'Programas de salud y vigilancia médica en el trabajo', isDefault: true },
  { code: 'EPP', name: 'Elementos de Protección', description: 'Suministro, dotación y uso de EPP', isDefault: true },
  { code: 'ACC', name: 'Accidentes e Incidentes', description: 'Reporte e investigación de eventos ATEL', isDefault: true },
  { code: 'AUD', name: 'Auditorías', description: 'Auditorías internas, externas y revisión por la dirección', isDefault: true },
  { code: 'IND', name: 'Indicadores', description: 'Medición de indicadores de estructura, proceso y resultado', isDefault: true },
  { code: 'PLA', name: 'Planificación', description: 'Plan de trabajo anual, asignación de recursos y presupuestos', isDefault: true },
  { code: 'MED', name: 'Medicina del Trabajo', description: 'Evaluaciones médicas ocupacionales y custodia médica', isDefault: true }
];

// ----------------------------------------------------------------------------
// 3. REGLAS LEGALES DE RETENCIÓN DOCUMENTAL (Decreto 1072 Art. 2.2.4.6.13)
// ----------------------------------------------------------------------------
export const DEFAULT_RETENTION_RULES: DocumentRetentionRule[] = [
  {
    id: 'ret-20-med',
    categoryName: 'Evaluaciones Médicas Ocupacionales y Perfil Sociodemográfico',
    description: 'Historias clínicas ocupacionales, conceptos de aptitud médica de ingreso, periódicos y de retiro, perfiles sociodemográficos.',
    retentionYears: 20,
    retentionStartRule: 'A partir del cese de la relación laboral del trabajador con la empresa',
    legalBasis: 'Decreto 1072 de 2015 Art. 2.2.4.6.13 Numeral 1 • Res. 2346 de 2007',
    custodianRole: 'Médico Especialista en SST / IPS Ocupacional Proveedora',
    confidentiality: 'MEDICA_RESTRINGIDA',
    mandatoryByDec1072_20Years: true,
    associatedTypes: ['RG', 'IF']
  },
  {
    id: 'ret-20-hig',
    categoryName: 'Monitoreo Ambiental y Mediciones Higiénicas',
    description: 'Resultados de mediciones y monitoreo a los ambientes de trabajo (ruido, iluminación, material particulado, gases, vibración).',
    retentionYears: 20,
    retentionStartRule: 'A partir de la fecha de realización de la medición higiénica',
    legalBasis: 'Decreto 1072 de 2015 Art. 2.2.4.6.13 Numeral 2',
    custodianRole: 'Líder SG-SST / Especialista Higienista',
    confidentiality: 'INTERNO',
    mandatoryByDec1072_20Years: true,
    associatedTypes: ['IF', 'RG']
  },
  {
    id: 'ret-20-cap',
    categoryName: 'Registros de Capacitación, Inducción y Entrenamiento en SST',
    description: 'Listados de asistencia, actas de inducción, evaluaciones de conocimientos del aula virtual y certificados expedidos.',
    retentionYears: 20,
    retentionStartRule: 'A partir del cese de la relación laboral del colaborador capacitado',
    legalBasis: 'Decreto 1072 de 2015 Art. 2.2.4.6.13 Numeral 3',
    custodianRole: 'Líder SG-SST / Gestión Humana',
    confidentiality: 'INTERNO',
    mandatoryByDec1072_20Years: true,
    associatedTypes: ['RG', 'AC', 'FT']
  },
  {
    id: 'ret-20-epp',
    categoryName: 'Registro de Suministro de Elementos de Protección Personal (EPP)',
    description: 'Actas firmadas de entrega de dotación, fichas técnicas de homologación de EPP y reposición.',
    retentionYears: 20,
    retentionStartRule: 'A partir del cese de la relación laboral del trabajador',
    legalBasis: 'Decreto 1072 de 2015 Art. 2.2.4.6.13 Numeral 4',
    custodianRole: 'Líder SG-SST / Almacén',
    confidentiality: 'INTERNO',
    mandatoryByDec1072_20Years: true,
    associatedTypes: ['RG', 'FT']
  },
  {
    id: 'ret-20-atel',
    categoryName: 'Investigación de Incidentes, Accidentes de Trabajo y Enfermedades (ATEL)',
    description: 'Formatos FURAT/FUREL, informes de investigación de accidentes graves, actas de equipo investigador y planes de acción.',
    retentionYears: 20,
    retentionStartRule: 'A partir de la fecha de ocurrencia del evento o calificación de origen',
    legalBasis: 'Decreto 1072 de 2015 Art. 2.2.4.6.13 Numeral 5 • Res. 1401 de 2007',
    custodianRole: 'Líder SG-SST / COPASST',
    confidentiality: 'CONFIDENCIAL',
    mandatoryByDec1072_20Years: true,
    associatedTypes: ['IF', 'RG', 'AC']
  },
  {
    id: 'ret-05-com',
    categoryName: 'Actas de Comités y Auditorías Internas',
    description: 'Actas mensuales del COPASST, actas del Comité de Convivencia Laboral, informes de auditorías y revisiones por la alta dirección.',
    retentionYears: 5,
    retentionStartRule: 'A partir de la fecha de aprobación del documento',
    legalBasis: 'Decreto 1072 de 2015 Art. 2.2.4.6.12 • Res. 0312 de 2019 Estándar 2.2.1',
    custodianRole: 'Presidente COPASST / Presidente CCL / Líder SST',
    confidentiality: 'INTERNO',
    mandatoryByDec1072_20Years: false,
    associatedTypes: ['AC', 'IF']
  },
  {
    id: 'ret-01-anual',
    categoryName: 'Planes Operativos, Presupuestos y Fichas Anuales',
    description: 'Plan de trabajo anual del SG-SST, presupuesto integrado, cronograma anual de capacitación e informe anual de gestión.',
    retentionYears: 1,
    retentionStartRule: 'Vigencia durante el año fiscal correspondiente + 5 años en archivo histórico',
    legalBasis: 'Decreto 1072 de 2015 Art. 2.2.4.6.8 Numeral 7 y Art. 2.2.4.6.17',
    custodianRole: 'Líder SG-SST / Gerencia General',
    confidentiality: 'INTERNO',
    mandatoryByDec1072_20Years: false,
    associatedTypes: ['PL', 'PG']
  }
];

// ----------------------------------------------------------------------------
// 4. PROCEDIMIENTO OFICIAL DE CONTROL DOCUMENTAL (19 SECCIONES EDITABLES)
// ----------------------------------------------------------------------------
export const DEFAULT_CONTROL_PROCEDURE: DocumentControlProcedure = {
  documentCode: 'PR-SGSST-GEN-001',
  code: 'PR-SGSST-GEN-001',
  title: 'Procedimiento para el Control, Conservación y Retención Documental',
  version: '001',
  issueDate: '2026-01-15',
  lastReviewDate: '2026-01-15',
  lastUpdatedAt: '2026-01-15',
  status: 'VIGENTE',
  preparedBy: {
    name: 'Ing. Laura Moreno Cárdenas',
    role: 'Líder SG-SST (Licencia SST 14589-2022)',
    date: '2026-01-10',
    signatureText: 'Revisión Técnica Cumplida'
  },
  reviewedBy: {
    name: 'Carlos Mario Mendoza Varela',
    role: 'Representante del COPASST',
    date: '2026-01-12',
    signatureText: 'Revisión Paritaria Conforme'
  },
  approvedBy: {
    name: 'Santiago Morales Gutiérrez',
    role: 'Representante Legal / Gerente General',
    date: '2026-01-15',
    signatureText: 'Aprobado Formalmente'
  },
  sections: [
    {
      id: 'sec-1',
      number: '1',
      title: 'Portada e Identificación Institucional',
      content: 'Este procedimiento establece los lineamientos obligatorios para la identificación, elaboración, revisión, aprobación, distribución, consulta, conservación y disposición final de la información documentada del Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST), así como los sistemas integrados de la organización.'
    },
    {
      id: 'sec-2',
      number: '2',
      title: 'Código Documental Oficial',
      content: 'El presente documento se encuentra identificado bajo el código controlado PR-SGSST-GEN-001, correspondiente a un Procedimiento (PR) del Sistema de Gestión de Seguridad y Salud en el Trabajo (SGSST), Proceso General (GEN), con consecutivo 001.'
    },
    {
      id: 'sec-3',
      number: '3',
      title: 'Versión y Fecha de Emisión',
      content: 'Versión Oficial: 001. Fecha de Emisión: 15 de enero de 2026. Este documento sustituye cualquier borrador o instrucción previa no controlada.'
    },
    {
      id: 'sec-4',
      number: '4',
      title: 'Objetivo',
      content: 'Establecer y mantener un sistema estructurado de control y custodia documental que asegure que todos los documentos y registros requeridos por el Decreto 1072 de 2015, la Resolución 0312 de 2019 y las normas aplicables se encuentren debidamente identificados, actualizados, legibles, protegidos contra deterioro o pérdida y conservados durante los plazos legalmente exigidos.'
    },
    {
      id: 'sec-5',
      number: '5',
      title: 'Alcance',
      content: 'Este procedimiento aplica a la totalidad de documentos internos (políticas, manuales, procedimientos, planes, programas, matrices, formatos) y registros de ejecución generados en todos los procesos, centros de trabajo y niveles de la organización, así como a los documentos de origen externo aplicables.'
    },
    {
      id: 'sec-6',
      number: '6',
      title: 'Referencias Normativas',
      content: '1. Decreto 1072 de 2015, Artículos 2.2.4.6.12 (Documentación) y 2.2.4.6.13 (Conservación de los documentos por 20 años).\n2. Resolución 0312 de 2019, Estándar 2.2.1 (Archivo y Retención Documental del SG-SST).\n3. Norma ISO 9001:2015 / ISO 45001:2018, Numeral 7.5 (Información documentada).\n4. Ley 1581 de 2012 y Decreto 1377 de 2013 (Protección de datos personales y confidencialidad médica).'
    },
    {
      id: 'sec-7',
      number: '7',
      title: 'Términos y Definiciones',
      content: '• Documento: Información y su medio de soporte.\n• Documento Controlado: Documento formal que ha superado el ciclo de revisión y aprobación, sometido a control de cambios y registrado en el Listado Maestro.\n• Registro: Documento que presenta resultados obtenidos o proporciona evidencia objetiva de actividades desempeñadas.\n• Documento Obsoleto: Documento que ha perdido vigencia debido a una modificación o reemplazo por una versión superior.\n• Retención Documental: Periodo de tiempo que un documento o registro debe ser conservado antes de su disposición final.'
    },
    {
      id: 'sec-8',
      number: '8',
      title: 'Responsabilidades y Autoridades',
      content: '• Gerencia General: Aprobar los documentos de primer nivel (políticas, manuales, presupuestos) y garantizar los recursos técnicos y físicos para la custodia documental.\n• Líder SG-SST: Administrar el Listado Maestro Documental, codificar documentos, coordinar revisiones periódicas y asegurar la integridad de los respaldos digitales y físicos.\n• COPASST y Comités: Revisar y firmar las actas y registros propios de sus funciones.\n• Colaboradores: Utilizar exclusivamente las versiones vigentes disponibles en AGAE SOLUTIONS y abstenerse de reproducir copias no controladas.'
    },
    {
      id: 'sec-9',
      number: '9',
      title: 'Estructura de Codificación Documental',
      content: 'Todos los documentos del sistema se identifican mediante una estructura estandarizada de cuatro bloques:\n[TIPO DOCUMENTAL]-[SISTEMA DE GESTIÓN]-[PROCESO]-[CONSECUTIVO]\nEjemplo: AC-SGSST-COP-001 (Acta del COPASST número 001).\nEl sistema asigna y valida los consecutivos de forma automática en la base de datos de AGAE SOLUTIONS para prevenir duplicidades o huecos en la serie.'
    },
    {
      id: 'sec-10',
      number: '10',
      title: 'Elaboración, Revisión y Aprobación de Documentos',
      content: '1. Elaboración: Realizada por el líder del proceso correspondiente o especialista técnico.\n2. Revisión: Efectuada por el Líder SG-SST o comité respectivo para validar consistencia técnica y legal.\n3. Aprobación: Ejecutada por la Alta Dirección o cargo delegado antes de la publicación oficial.\nNingún documento adquiere estado de "Vigente" sin haber completado las tres firmas del flujo.'
    },
    {
      id: 'sec-11',
      number: '11',
      title: 'Control de Versiones y Modificaciones',
      content: 'Las versiones se identifican numéricamente con tres dígitos iniciando en 001. Cuando un documento vigente sufre una actualización técnica, su código base permanece inalterable y la versión se incrementa (ej. 001 -> 002). Cada cambio debe registrarse en la tabla de historial de modificaciones indicando motivo, fecha y aprobador.'
    },
    {
      id: 'sec-12',
      number: '12',
      title: 'Distribución y Control de Acceso',
      content: 'La distribución oficial se efectúa de manera digital y centralizada a través del Repositorio Documental de AGAE SOLUTIONS. Cualquier impresión en papel tiene la consideración de "COPIA NO CONTROLADA" a menos que contenga el sello o firma original de vigencia. Los usuarios acceden conforme a sus privilegios de rol.'
    },
    {
      id: 'sec-13',
      number: '13',
      title: 'Control de Documentos de Origen Externo',
      content: 'Los documentos externos requeridos para la operación (normas técnicas ICONTEC, manuales de maquinaria de fabricantes, hojas de datos de seguridad SDS, resoluciones del Ministerio) se registran en el Listado Maestro identificando su fuente, versión, fecha de recepción y custodio interno.'
    },
    {
      id: 'sec-14',
      number: '14',
      title: 'Identificación y Retiro de Documentos Obsoletos',
      content: 'Al aprobarse una nueva versión de un documento, la versión anterior pasa automáticamente al estado "OBSOLETO". El sistema AGAE SOLUTIONS bloquea su descarga operativa y conserva el archivo en el repositorio histórico con la marca de agua de obsolescencia para fines exclusivos de auditoría y trazabilidad.'
    },
    {
      id: 'sec-15',
      number: '15',
      title: 'Organización y Almacenamiento Físico y Digital',
      content: '• Archivo Digital: Alojado en infraestructura en la nube con cifrado SSL/TLS, réplicas geográficas y control de versiones.\n• Archivo Físico: Para actas con firmas manuscritas o documentos legales en papel, se organizan en carpetas AZ rotuladas, en recinto seco, ventilado, libre de humedad y con control de acceso restringido.'
    },
    {
      id: 'sec-16',
      number: '16',
      title: 'Protección, Respaldo y Recuperación (Backups)',
      content: 'Se ejecutan copias de seguridad automáticas diarias e incrementales en la plataforma AGAE SOLUTIONS, garantizando un punto de recuperación (RPO) menor a 24 horas y una prueba periódica semestral de restauración de datos para certificar la integridad de los registros ante incidentes cibernéticos o fallas de hardware.'
    },
    {
      id: 'sec-17',
      number: '17',
      title: 'Conservación y Retención Documental (Regla de los 20 Años)',
      content: 'En cumplimiento estricto del Artículo 2.2.4.6.13 del Decreto 1072 de 2015, los siguientes registros deben conservarse de manera obligatoria durante un periodo mínimo de veinte (20) años, contados a partir del momento en que cese la relación laboral del trabajador con la empresa:\n1. Resultados de evaluaciones médicas ocupacionales y perfil sociodemográfico.\n2. Resultados de mediciones y monitoreo a los ambientes de trabajo e higiene.\n3. Registros de las actividades de capacitación, formación y entrenamiento en SST.\n4. Registro de suministro de elementos de protección personal (EPP).\n5. Investigaciones de incidentes, accidentes de trabajo y enfermedades laborales.\nLos demás documentos administrativos se conservan conforme a la tabla de retención específica (1 a 5 años).'
    },
    {
      id: 'sec-18',
      number: '18',
      title: 'Disposición Final de Documentos y Registros',
      content: 'Cumplido el periodo de retención legal y verificado que no existan litigios o requerimientos pendientes ante la ARL o el Ministerio del Trabajo, se podrá autorizar la disposición final (depuración o destrucción física certificada con acta) previo visto bueno de la Gerencia y la Asesoría Jurídica de la empresa.'
    },
    {
      id: 'sec-19',
      number: '19',
      title: 'Control de Información Confidencial y Datos Sensibles',
      content: 'Las historias clínicas ocupacionales y exámenes médicos gozan de reserva legal estricta y se encuentran bajo custodia exclusiva del médico especialista o IPS. AGAE SOLUTIONS restringe el acceso a estos registros únicamente a personal médico autorizado. Los datos de identificación y afiliación de los trabajadores se tratan conforme a la Ley de Protección de Datos Personales.'
    }
  ]
};

// ----------------------------------------------------------------------------
// 5. DOCUMENTOS CONTROLADOS INICIALES (Mapeados 1 a 1 a módulos de AGAE)
// ----------------------------------------------------------------------------
export const DEFAULT_CONTROLLED_DOCUMENTS: ControlledDocument[] = [
  {
    id: 'doc-001',
    code: 'PR-SGSST-GEN-001',
    title: 'Procedimiento para el Control, Conservación y Retención Documental',
    system: 'SGSST',
    processCode: 'GEN',
    processName: 'General',
    typeCode: 'PR',
    typeName: 'Procedimiento',
    originModule: '2.2.1 Archivo y Retención Documental',
    responsibleRole: 'Líder SG-SST',
    authorName: 'Ing. Laura Moreno Cárdenas',
    reviewerName: 'Carlos Mario Mendoza',
    approverName: 'Santiago Morales Gutiérrez',
    createdDate: '2026-01-15',
    approvedDate: '2026-01-15',
    lastUpdatedDate: '2026-01-15',
    currentVersion: '001',
    status: 'VIGENTE',
    storageSupport: 'DIGITAL_CLOUD',
    digitalPath: '/documentos/PR-SGSST-GEN-001.pdf',
    originRouteTab: 'sst',
    retentionYears: 20,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.13 e ISO 9001 Num. 7.5',
    retentionStartEvent: 'FECHA_EMISION',
    confidentiality: 'INTERNO',
    isControlledDocument: true,
    versionHistory: [
      {
        version: '001',
        approvedDate: '2026-01-15',
        approvedBy: 'Santiago Morales Gutiérrez',
        changeSummary: 'Emisión inicial del procedimiento de gestión documental',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-002',
    code: 'PO-SGSST-GEN-001',
    title: 'Política del Sistema de Gestión de Seguridad y Salud en el Trabajo',
    system: 'SGSST',
    processCode: 'GEN',
    processName: 'General',
    typeCode: 'PO',
    typeName: 'Política',
    originModule: '2.1.1 Política SG-SST',
    responsibleRole: 'Representante Legal / Gerencia General',
    authorName: 'Ing. Laura Moreno Cárdenas',
    reviewerName: 'COPASST',
    approverName: 'Santiago Morales Gutiérrez',
    createdDate: '2026-01-10',
    approvedDate: '2026-01-15',
    lastUpdatedDate: '2026-01-15',
    currentVersion: '003',
    status: 'VIGENTE',
    storageSupport: 'HIBRIDO',
    physicalLocation: 'Cartelera Sede Principal / Archivo AZ Gerencia',
    digitalPath: '/documentos/PO-SGSST-GEN-001.pdf',
    originRouteTab: 'sst',
    retentionYears: 5,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.5 y 2.2.4.6.6',
    retentionStartEvent: 'FECHA_EMISION',
    confidentiality: 'PUBLICO',
    isControlledDocument: true,
    versionHistory: [
      {
        version: '003',
        approvedDate: '2026-01-15',
        approvedBy: 'Santiago Morales Gutiérrez',
        changeSummary: 'Revisión anual obligatoria y actualización con compromisos PESV',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-003',
    code: 'PL-SGSST-IND-001',
    title: 'Ficha Técnica de Objetivos e Indicadores del SG-SST (Estructura, Proceso, Resultado)',
    system: 'SGSST',
    processCode: 'IND',
    processName: 'Indicadores',
    typeCode: 'PL',
    typeName: 'Plan',
    originModule: '2.1.2 Objetivos del SG-SST',
    responsibleRole: 'Líder SG-SST',
    authorName: 'Ing. Laura Moreno Cárdenas',
    approverName: 'Santiago Morales Gutiérrez',
    createdDate: '2026-01-18',
    approvedDate: '2026-01-20',
    lastUpdatedDate: '2026-01-20',
    currentVersion: '001',
    status: 'VIGENTE',
    storageSupport: 'DIGITAL_CLOUD',
    originRouteTab: 'sst',
    retentionYears: 5,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.19 al 2.2.4.6.22',
    retentionStartEvent: 'FECHA_EMISION',
    confidentiality: 'INTERNO',
    isControlledDocument: true,
    versionHistory: [
      {
        version: '001',
        approvedDate: '2026-01-20',
        approvedBy: 'Santiago Morales Gutiérrez',
        changeSummary: 'Aprobación de fichas técnicas de 10 indicadores de ley',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-004',
    code: 'IF-SGSST-GEN-001',
    title: 'Informe Técnico de Evaluación Inicial del SG-SST (Dec. 1072 Art. 2.2.4.6.16)',
    system: 'SGSST',
    processCode: 'GEN',
    processName: 'General',
    typeCode: 'IF',
    typeName: 'Informe',
    originModule: '2.1.3 Evaluación Inicial Dec. 1072',
    responsibleRole: 'Líder SG-SST',
    authorName: 'Ing. Laura Moreno Cárdenas',
    approverName: 'Santiago Morales Gutiérrez',
    createdDate: '2026-01-25',
    approvedDate: '2026-01-28',
    lastUpdatedDate: '2026-01-28',
    currentVersion: '001',
    status: 'VIGENTE',
    storageSupport: 'DIGITAL_CLOUD',
    originRouteTab: 'sst',
    retentionYears: 5,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.16',
    retentionStartEvent: 'FECHA_EMISION',
    confidentiality: 'INTERNO',
    isControlledDocument: true,
    versionHistory: [
      {
        version: '001',
        approvedDate: '2026-01-28',
        approvedBy: 'Santiago Morales Gutiérrez',
        changeSummary: 'Diagnóstico basal de 30 aspectos evaluados y plan de intervención',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-005',
    code: 'AC-SGSST-GEN-001',
    title: 'Carta Formal de Asignación de Responsabilidades y Designación del Líder SST',
    system: 'SGSST',
    processCode: 'GEN',
    processName: 'General',
    typeCode: 'AC',
    typeName: 'Acta',
    originModule: '1.1.1 Responsable SG-SST',
    responsibleRole: 'Gerente General / Representante Legal',
    authorName: 'Santiago Morales Gutiérrez',
    approverName: 'Santiago Morales Gutiérrez',
    createdDate: '2026-01-05',
    approvedDate: '2026-01-08',
    lastUpdatedDate: '2026-01-08',
    currentVersion: '001',
    status: 'VIGENTE',
    storageSupport: 'HIBRIDO',
    physicalLocation: 'Carpeta Contrato y HV Líder SST',
    originRouteTab: 'sst',
    retentionYears: 20,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.8 Par. 1 y Art. 2.2.4.6.35',
    retentionStartEvent: 'CESE_LABORAL',
    confidentiality: 'INTERNO',
    isControlledDocument: false,
    versionHistory: [
      {
        version: '001',
        approvedDate: '2026-01-08',
        approvedBy: 'Santiago Morales Gutiérrez',
        changeSummary: 'Carta firmada electrónicamente con verificación de curso 50h y licencia SST',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-006',
    code: 'PL-SGSST-PLA-001',
    title: 'Presupuesto Integrado Anual del SG-SST y Plan Estratégico de Seguridad Vial (PESV)',
    system: 'INTEGRADO',
    processCode: 'PLA',
    processName: 'Planificación',
    typeCode: 'PL',
    typeName: 'Plan',
    originModule: '1.1.3 Presupuesto SST',
    responsibleRole: 'Director Financiero / Gerencia General',
    authorName: 'Ing. Laura Moreno Cárdenas',
    reviewerName: 'Director Financiero',
    approverName: 'Santiago Morales Gutiérrez',
    createdDate: '2026-01-10',
    approvedDate: '2026-01-14',
    lastUpdatedDate: '2026-01-14',
    currentVersion: '001',
    status: 'VIGENTE',
    storageSupport: 'DIGITAL_CLOUD',
    originRouteTab: 'sst',
    retentionYears: 5,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.8 Numeral 4',
    retentionStartEvent: 'CIERRE_ANUAL',
    confidentiality: 'CONFIDENCIAL',
    isControlledDocument: true,
    versionHistory: [
      {
        version: '001',
        approvedDate: '2026-01-14',
        approvedBy: 'Santiago Morales Gutiérrez',
        changeSummary: 'Asignación de $48.5M COP con revisión del COPASST',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-007',
    code: 'MT-SGSST-LEG-001',
    title: 'Matriz de Identificación y Evaluación de Requisitos Legales en Riesgos Laborales',
    system: 'SGSST',
    processCode: 'LEG',
    processName: 'Requisitos Legales',
    typeCode: 'MT',
    typeName: 'Matriz',
    originModule: '2.4.1 Matriz Legal',
    responsibleRole: 'Líder SG-SST',
    authorName: 'Ing. Laura Moreno Cárdenas',
    approverName: 'Santiago Morales Gutiérrez',
    createdDate: '2026-01-20',
    approvedDate: '2026-01-22',
    lastUpdatedDate: '2026-01-22',
    currentVersion: '002',
    status: 'VIGENTE',
    storageSupport: 'DIGITAL_CLOUD',
    originRouteTab: 'sst',
    retentionYears: 5,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.12 Numeral 15',
    retentionStartEvent: 'FECHA_EMISION',
    confidentiality: 'INTERNO',
    isControlledDocument: true,
    versionHistory: [
      {
        version: '002',
        approvedDate: '2026-01-22',
        approvedBy: 'Santiago Morales Gutiérrez',
        changeSummary: 'Incorporación de Resolución 3461 de 2025 (Comités de Convivencia)',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-008',
    code: 'MT-SGSST-PEL-001',
    title: 'Matriz de Identificación de Peligros, Evaluación y Valoración de Riesgos (GTC 45:2012)',
    system: 'SGSST',
    processCode: 'PEL',
    processName: 'Peligros y Riesgos',
    typeCode: 'MT',
    typeName: 'Matriz',
    originModule: '4.1.2 Matriz GTC 45',
    responsibleRole: 'Líder SG-SST',
    authorName: 'Ing. Laura Moreno Cárdenas',
    reviewerName: 'COPASST',
    approverName: 'Santiago Morales Gutiérrez',
    createdDate: '2026-01-15',
    approvedDate: '2026-01-20',
    lastUpdatedDate: '2026-01-20',
    currentVersion: '002',
    status: 'VIGENTE',
    storageSupport: 'DIGITAL_CLOUD',
    originRouteTab: 'sst',
    retentionYears: 20,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.12 y 2.2.4.6.15',
    retentionStartEvent: 'FECHA_EMISION',
    confidentiality: 'INTERNO',
    isControlledDocument: true,
    versionHistory: [
      {
        version: '002',
        approvedDate: '2026-01-20',
        approvedBy: 'Santiago Morales Gutiérrez',
        changeSummary: 'Valoración integral de procesos de transporte, logística y taller',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-009',
    code: 'AC-SGSST-COP-001',
    title: 'Acta de Conformación, Elección y Posesión del COPASST Periodo 2026-2028',
    system: 'SGSST',
    processCode: 'COP',
    processName: 'COPASST',
    typeCode: 'AC',
    typeName: 'Acta',
    originModule: '1.1.6 Conformación COPASST',
    responsibleRole: 'Presidente y Secretario COPASST',
    authorName: 'Comisión Escrutadora',
    approverName: 'Santiago Morales Gutiérrez',
    createdDate: '2026-01-10',
    approvedDate: '2026-01-11',
    lastUpdatedDate: '2026-01-11',
    currentVersion: '001',
    status: 'VIGENTE',
    storageSupport: 'HIBRIDO',
    physicalLocation: 'Libro de Actas COPASST / Carpeta AZ No. 1',
    originRouteTab: 'sst',
    retentionYears: 5,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.12 Numeral 7 • Res. 2013 de 1986',
    retentionStartEvent: 'FECHA_EMISION',
    confidentiality: 'INTERNO',
    isControlledDocument: false,
    versionHistory: [
      {
        version: '001',
        approvedDate: '2026-01-11',
        approvedBy: 'Santiago Morales Gutiérrez',
        changeSummary: 'Acta formal de instalación con firmas de los 4 representantes principales y suplentes',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-010',
    code: 'AC-SGSST-CCL-001',
    title: 'Acta de Constitución y Elección del Comité de Convivencia Laboral (Res. 3461 de 2025)',
    system: 'SGSST',
    processCode: 'CCL',
    processName: 'Convivencia',
    typeCode: 'AC',
    typeName: 'Acta',
    originModule: '1.1.8 Convivencia (CCL)',
    responsibleRole: 'Presidente y Secretario CCL',
    authorName: 'Comisión de Elecciones',
    approverName: 'Santiago Morales Gutiérrez',
    createdDate: '2026-01-12',
    approvedDate: '2026-01-14',
    lastUpdatedDate: '2026-01-14',
    currentVersion: '001',
    status: 'VIGENTE',
    storageSupport: 'HIBRIDO',
    physicalLocation: 'Archivo Confidencial CCL',
    originRouteTab: 'sst',
    retentionYears: 5,
    retentionLegalBasis: 'Resolución 3461 de 2025 • Res. 652 de 2012',
    retentionStartEvent: 'FECHA_EMISION',
    confidentiality: 'CONFIDENCIAL',
    isControlledDocument: false,
    versionHistory: [
      {
        version: '001',
        approvedDate: '2026-01-14',
        approvedBy: 'Santiago Morales Gutiérrez',
        changeSummary: 'Constitución con firmas de confidencialidad de todos los miembros',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-011',
    code: 'PG-SGSST-CAP-001',
    title: 'Programa Anual de Capacitación, Entrenamiento, Inducción y Aula Virtual',
    system: 'SGSST',
    processCode: 'CAP',
    processName: 'Capacitación',
    typeCode: 'PG',
    typeName: 'Programa',
    originModule: '1.2 Capacitación & Aula Virtual',
    responsibleRole: 'Líder SG-SST',
    authorName: 'Ing. Laura Moreno Cárdenas',
    reviewerName: 'COPASST',
    approverName: 'Santiago Morales Gutiérrez',
    createdDate: '2026-01-08',
    approvedDate: '2026-01-12',
    lastUpdatedDate: '2026-01-12',
    currentVersion: '001',
    status: 'VIGENTE',
    storageSupport: 'DIGITAL_CLOUD',
    originRouteTab: 'sst',
    retentionYears: 20,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.11 y Art. 2.2.4.6.13 Numeral 3',
    retentionStartEvent: 'CESE_LABORAL',
    confidentiality: 'INTERNO',
    isControlledDocument: true,
    versionHistory: [
      {
        version: '001',
        approvedDate: '2026-01-12',
        approvedBy: 'Santiago Morales Gutiérrez',
        changeSummary: 'Cronograma anual de 12 actividades con aula virtual y certificados verificables',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-012',
    code: 'RG-SGSST-CAP-001',
    title: 'Registro de Certificados Digitales y Asistencias del Aula Virtual AGAE',
    system: 'SGSST',
    processCode: 'CAP',
    processName: 'Capacitación',
    typeCode: 'RG',
    typeName: 'Registro',
    originModule: '1.2 Capacitación (Aula Virtual)',
    responsibleRole: 'Líder SG-SST',
    authorName: 'Sistema Automatizado AGAE',
    approverName: 'Líder SG-SST',
    createdDate: '2026-01-20',
    approvedDate: '2026-01-20',
    lastUpdatedDate: '2026-02-19',
    currentVersion: '001',
    status: 'VIGENTE',
    storageSupport: 'DIGITAL_CLOUD',
    originRouteTab: 'sst',
    retentionYears: 20,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.13 Numeral 3 (20 años obligatorios)',
    retentionStartEvent: 'CESE_LABORAL',
    confidentiality: 'INTERNO',
    isControlledDocument: false,
    versionHistory: [
      {
        version: '001',
        approvedDate: '2026-01-20',
        approvedBy: 'Ing. Laura Moreno Cárdenas',
        changeSummary: 'Emisión continua de certificados con código QR y verificación pública',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-013',
    code: 'RG-SGSST-MED-001',
    title: 'Registro Consolidado de Evaluaciones Médicas Ocupacionales y Perfil Sociodemográfico',
    system: 'SGSST',
    processCode: 'MED',
    processName: 'Medicina del Trabajo',
    typeCode: 'RG',
    typeName: 'Registro',
    originModule: 'Expediente Digital de Trabajadores',
    responsibleRole: 'Médico Especialista SST / IPS Ocupacional',
    authorName: 'Dra. Sandra Milena Restrepo',
    approverName: 'Líder SG-SST',
    createdDate: '2026-01-15',
    approvedDate: '2026-01-18',
    lastUpdatedDate: '2026-01-18',
    currentVersion: '001',
    status: 'VIGENTE',
    storageSupport: 'DIGITAL_CLOUD',
    originRouteTab: 'workers',
    retentionYears: 20,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.13 Numeral 1 (20 años posteriores al cese)',
    retentionStartEvent: 'CESE_LABORAL',
    confidentiality: 'MEDICA_RESTRINGIDA',
    isControlledDocument: false,
    versionHistory: [
      {
        version: '001',
        approvedDate: '2026-01-18',
        approvedBy: 'Dra. Sandra Milena Restrepo',
        changeSummary: 'Conceptos de aptitud médica de ingreso y periódicos',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-014',
    code: 'RG-SGSST-EPP-001',
    title: 'Registro Digital de Entrega, Reposición y Dotación de Elementos de Protección Personal',
    system: 'SGSST',
    processCode: 'EPP',
    processName: 'Elementos de Protección',
    typeCode: 'RG',
    typeName: 'Registro',
    originModule: 'Expediente Digital de Trabajadores',
    responsibleRole: 'Líder SG-SST / Supervisor de Patio',
    authorName: 'Juan Carlos Pérez',
    approverName: 'Líder SG-SST',
    createdDate: '2026-01-20',
    approvedDate: '2026-01-20',
    lastUpdatedDate: '2026-02-15',
    currentVersion: '001',
    status: 'VIGENTE',
    storageSupport: 'DIGITAL_CLOUD',
    originRouteTab: 'workers',
    retentionYears: 20,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.13 Numeral 4 (20 años posteriores al cese)',
    retentionStartEvent: 'CESE_LABORAL',
    confidentiality: 'INTERNO',
    isControlledDocument: false,
    versionHistory: [
      {
        version: '001',
        approvedDate: '2026-01-20',
        approvedBy: 'Ing. Laura Moreno Cárdenas',
        changeSummary: 'Control de firmas electrónicas de entrega de cascos, botas y guantes',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-015',
    code: 'FT-SGSST-INS-001',
    title: 'Lista de Chequeo para Inspecciones Locativas, Vehiculares y de Equipos',
    system: 'SGSST',
    processCode: 'INS',
    processName: 'Inspecciones',
    typeCode: 'FT',
    typeName: 'Formato',
    originModule: '4.1.4 Inspecciones y Mantenimiento',
    responsibleRole: 'Líder SG-SST / COPASST',
    authorName: 'Ing. Laura Moreno Cárdenas',
    approverName: 'Santiago Morales Gutiérrez',
    createdDate: '2026-01-15',
    approvedDate: '2026-01-18',
    lastUpdatedDate: '2026-01-18',
    currentVersion: '002',
    status: 'VIGENTE',
    storageSupport: 'DIGITAL_CLOUD',
    originRouteTab: 'sst',
    retentionYears: 5,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.24',
    retentionStartEvent: 'FECHA_EMISION',
    confidentiality: 'INTERNO',
    isControlledDocument: true,
    versionHistory: [
      {
        version: '002',
        approvedDate: '2026-01-18',
        approvedBy: 'Santiago Morales Gutiérrez',
        changeSummary: 'Inclusión de verificación de extintores y botiquines',
        status: 'VIGENTE'
      }
    ]
  },
  {
    id: 'doc-016',
    code: 'PL-SGSST-EME-001',
    title: 'Plan de Prevención, Preparación y Respuesta ante Emergencias y Contingencias',
    system: 'SGSST',
    processCode: 'EME',
    processName: 'Emergencias',
    typeCode: 'PL',
    typeName: 'Plan',
    originModule: '5.1.1 Plan de Emergencias',
    responsibleRole: 'Coordinador de Brigada / Líder SST',
    authorName: 'Sgto. Andrés Felipe Salazar',
    approverName: 'Santiago Morales Gutiérrez',
    createdDate: '2026-01-10',
    approvedDate: '2026-01-15',
    lastUpdatedDate: '2026-01-15',
    currentVersion: '001',
    status: 'VIGENTE',
    storageSupport: 'HIBRIDO',
    physicalLocation: 'Punto de Encuentro / Garita Principal',
    originRouteTab: 'sst',
    retentionYears: 5,
    retentionLegalBasis: 'Dec. 1072/15 Art. 2.2.4.6.25',
    retentionStartEvent: 'FECHA_EMISION',
    confidentiality: 'INTERNO',
    isControlledDocument: true,
    versionHistory: [
      {
        version: '001',
        approvedDate: '2026-01-15',
        approvedBy: 'Santiago Morales Gutiérrez',
        changeSummary: 'Análisis de vulnerabilidad, directorio de emergencias y rutas de evacuación',
        status: 'VIGENTE'
      }
    ]
  }
];

// ----------------------------------------------------------------------------
// 6. CÁLCULO DE MÉTRICAS DEL LISTADO MAESTRO DOCUMENTAL
// ----------------------------------------------------------------------------
export const calculateDocumentMetrics = (documents: ControlledDocument[]): DocumentMasterMetrics => {
  const total = documents.length;
  const active = documents.filter(d => d.status === 'VIGENTE').length;
  const inDraft = documents.filter(d => d.status === 'EN_ELABORACION').length;
  const pending = documents.filter(d => d.status === 'PENDIENTE_REVISION' || d.status === 'PENDIENTE_APROBACION').length;
  const obsolete = documents.filter(d => d.status === 'OBSOLETO').length;
  const external = documents.filter(d => Boolean(d.isExternalDocument || d.isExternal)).length;
  const twentyYears = documents.filter(d => d.retentionYears >= 20 || Boolean(d.isMandatory20Years)).length;

  const compliancePercentage = total > 0 ? Math.round((active / total) * 100) : 0;

  return {
    totalDocuments: total,
    activeDocuments: active,
    inDraftDocuments: inDraft,
    draftDocuments: inDraft,
    pendingApprovalDocuments: pending,
    obsoleteDocuments: obsolete,
    externalDocuments: external,
    twentyYearsRetentionDocuments: twentyYears,
    mandatory20YearsCount: twentyYears,
    compliancePercentage
  };
};

// ----------------------------------------------------------------------------
// 7. GENERADOR AUTOMÁTICO DE CÓDIGOS DOCUMENTALES SEGUROS
// ----------------------------------------------------------------------------
export const generateNextDocumentCode = (
  typeCode: string,
  systemCode: ManagementSystemType,
  processCode: string,
  existingDocs: ControlledDocument[],
  customConsecutive?: number
): string => {
  const prefix = `${typeCode.toUpperCase()}-${systemCode.toUpperCase()}-${processCode.toUpperCase()}`;
  
  if (customConsecutive && customConsecutive > 0) {
    return `${prefix}-${customConsecutive.toString().padStart(3, '0')}`;
  }

  // Find all existing docs with this prefix
  const matching = existingDocs.filter(d => d.code.startsWith(prefix));
  
  let maxSeq = 0;
  matching.forEach(d => {
    const parts = d.code.split('-');
    const seqStr = parts[parts.length - 1];
    const seqNum = parseInt(seqStr, 10);
    if (!isNaN(seqNum) && seqNum > maxSeq) {
      maxSeq = seqNum;
    }
  });

  const nextSeq = (maxSeq + 1).toString().padStart(3, '0');
  return `${prefix}-${nextSeq}`;
};

// ----------------------------------------------------------------------------
// 8. ESTADO INICIAL DEL GESTOR DOCUMENTAL
// ----------------------------------------------------------------------------
export const INITIAL_DOCUMENT_MANAGEMENT_STATE: DocumentManagementState = {
  procedure: DEFAULT_CONTROL_PROCEDURE,
  documents: DEFAULT_CONTROLLED_DOCUMENTS.map(d => ({
    ...d,
    processId: d.processCode,
    documentTypeId: d.typeCode,
    responsible: d.responsibleRole,
    createdAt: d.createdDate,
    updatedAt: d.lastUpdatedDate,
    retentionBasis: d.retentionLegalBasis,
    isMandatory20Years: d.retentionYears >= 20,
    isExternal: Boolean(d.isExternalDocument)
  })),
  typeCatalog: DEFAULT_DOCUMENT_TYPES.map(t => ({ ...t, id: t.code, prefix: t.code, isActive: true })),
  typesCatalog: DEFAULT_DOCUMENT_TYPES.map(t => ({ ...t, id: t.code, prefix: t.code, isActive: true })),
  processCatalog: DEFAULT_DOCUMENT_PROCESSES.map(p => ({ ...p, id: p.code, isActive: true })),
  processesCatalog: DEFAULT_DOCUMENT_PROCESSES.map(p => ({ ...p, id: p.code, isActive: true })),
  retentionRules: DEFAULT_RETENTION_RULES.map(r => ({ ...r, category: r.categoryName, computationStart: r.retentionStartRule, custodian: r.custodianRole })),
  lastSequentialMap: {},
  status: 'APROBADO_VIGENTE',
  updatedAt: '2026-01-28',
  metrics: calculateDocumentMetrics(DEFAULT_CONTROLLED_DOCUMENTS)
};
