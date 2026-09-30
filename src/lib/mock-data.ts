import {
  Organization,
  SharedAsset,
  Finding,
  AcpmAction,
  Evidence,
  Task,
  Audit,
  GhgEmissionRecord,
  PesvVehicle,
  PesvDriver,
  PgirsRecord,
  SstHazardItem
} from '@/types';

export const initialOrganization: Organization = {
  id: 'org-andina-01',
  name: 'Logística & Manufactura Andina S.A.S.',
  nit: '901.458.923-4',
  ciiu: '4923 - Transporte de carga por carretera y almacenamiento',
  economicActivity: 'Transporte terrestre de carga pesada, almacenamiento y distribución logística de mercancías',
  riskLevelArl: 4,
  employeeCount: 142,
  contractorCount: 38,
  pesvLevel: 'AVANZADO',
  sstStandardCount: 60,
  activeModules: ['SST', 'ENVIRONMENTAL', 'PESV', 'ISO_9001', 'ISO_14001', 'ISO_45001'],
  sites: [
    {
      id: 'site-bogota',
      name: 'Centro de Distribución Fontibón (Sede Principal)',
      city: 'Bogotá D.C.',
      address: 'Calle 17 # 96-45',
      workerCount: 95
    },
    {
      id: 'site-medellin',
      name: 'Hub Regional Guayabal',
      city: 'Medellín',
      address: 'Cra 52 # 14-88',
      workerCount: 47
    }
  ],
  processes: [
    { id: 'proc-ops', code: 'PR-OPS', name: 'Operaciones Logísticas y Transporte', type: 'MISIONAL', leader: 'Ing. Carlos Mendoza' },
    { id: 'proc-maint', code: 'PR-MNT', name: 'Mantenimiento de Flota e Instalaciones', type: 'APOYO', leader: 'Téc. Andrés Velasco' },
    { id: 'proc-hseq', code: 'PR-HSQ', name: 'Gestión Integral HSEQ y PESV', type: 'APOYO', leader: 'Dra. Marcela Rincón' },
    { id: 'proc-ger', code: 'PR-DIR', name: 'Direccionamiento Estratégico', type: 'ESTRATEGICO', leader: 'Lic. Fernando Ortiz' }
  ]
};

export const initialSharedAssets: SharedAsset[] = [
  {
    id: 'asset-ext-01',
    code: 'EXT-BOG-04',
    name: 'Extintor Multipropósito ABC 20 lbs',
    category: 'EXTINGUISHER',
    siteId: 'site-bogota',
    siteName: 'Fontibón (Principal)',
    processId: 'proc-ops',
    processName: 'Operaciones Logísticas',
    locationDetails: 'Bahía de Cargue 02 - Pasillo Principal',
    status: 'OPERATIVO',
    lastInspectionDate: '2026-03-15',
    nextInspectionDate: '2026-04-15',
    meta: { capacidad: '20 Lbs', agente: 'Polvo Químico Seco', recargaAno: 2026 }
  },
  {
    id: 'asset-veh-01',
    code: 'VEH-NPR-01',
    name: 'Camión NPR Furgón 5 Ton - WLM-452',
    category: 'VEHICLE',
    siteId: 'site-bogota',
    siteName: 'Fontibón (Principal)',
    processId: 'proc-ops',
    processName: 'Operaciones Logísticas',
    locationDetails: 'Flota Primaria Bogotá - Medellín',
    status: 'OPERATIVO',
    lastInspectionDate: '2026-03-29',
    nextInspectionDate: '2026-04-05',
    meta: { placa: 'WLM-452', combustible: 'Diesel B10', kilometraje: 148520 }
  },
  {
    id: 'asset-kit-01',
    code: 'BOT-MED-02',
    name: 'Botiquín Tipo B Industrial de Pared',
    category: 'FIRST_AID',
    siteId: 'site-medellin',
    siteName: 'Guayabal (Medellín)',
    processId: 'proc-maint',
    processName: 'Mantenimiento de Flota',
    locationDetails: 'Taller Mecánico - Muro Norte',
    status: 'REVISION_PENDIENTE',
    lastInspectionDate: '2026-02-28',
    nextInspectionDate: '2026-03-30',
    meta: { tipo: 'Tipo B Regulado Res 0705', dotacionCompleta: false }
  }
];

export const initialEvidences: Evidence[] = [
  {
    id: 'evi-001',
    title: 'Registro Fotográfico Extintor con Manómetro y Señalización Corregida',
    fileType: 'IMAGE',
    fileName: 'evidencia_extintor_bahia2.jpg',
    fileSize: '2.4 MB',
    uploadedAt: '2026-03-22 14:30',
    uploadedBy: 'Marcela Rincón (Líder HSEQ)',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    tags: ['EXTINTOR', 'SST', 'INSPECCION', 'ACPM-001'],
    linkedEntityCount: 3
  },
  {
    id: 'evi-002',
    title: 'Certificado de Disposición Final Residuos Peligrosos (RESPEL)',
    fileType: 'CERTIFICATE',
    fileName: 'cert_respel_marzo_2026_ecopro.pdf',
    fileSize: '1.1 MB',
    uploadedAt: '2026-03-25 09:15',
    uploadedBy: 'Andrés Velasco (Jefe Mantenimiento)',
    url: '#',
    tags: ['AMBIENTAL', 'RESPEL', 'PGIRS', 'GESTOR_AUTORIZADO'],
    linkedEntityCount: 2
  },
  {
    id: 'evi-003',
    title: 'Planilla de Inspección Preoperacional Diaria Flota Fontibón',
    fileType: 'DOCUMENT',
    fileName: 'preoperacional_semana12_pesv.pdf',
    fileSize: '3.8 MB',
    uploadedAt: '2026-03-28 07:00',
    uploadedBy: 'Operador de Patio Juan Galindo',
    url: '#',
    tags: ['PESV', 'PASO_14', 'PREOPERACIONAL', 'VEHICULOS'],
    linkedEntityCount: 4
  }
];

export const initialFindings: Finding[] = [
  {
    id: 'find-001',
    code: 'H-SST-001',
    title: 'Extintor descargado y con bloqueo de acceso en zona de cargue',
    originModule: 'SST',
    originType: 'INSPECTION',
    originDetail: 'Inspección de Seguridad Mensual Áreas Operativas',
    sharedAssetId: 'asset-ext-01',
    sharedAssetName: 'Extintor ABC 20 lbs (EXT-BOG-04)',
    siteName: 'Fontibón (Principal)',
    processName: 'Operaciones Logísticas',
    description: 'Durante la ronda de inspección se evidenció que el extintor de 20 lbs se encuentra con aguja de manómetro en zona de recarga y obstruido por tres estibas de madera.',
    legalCriterion: 'Resolución 2400 de 1979 Art. 220 & Dec 1072/15 Art. 2.2.4.6.25',
    severity: 'MAYOR',
    status: 'EN_ACPM',
    reportedBy: 'Carlos Mendoza (Sup. Operaciones)',
    createdAt: '2026-03-18 10:15',
    linkedAcpmId: 'acpm-001'
  },
  {
    id: 'find-002',
    code: 'H-PESV-002',
    title: 'Conductor asignado a ruta intermunicipal con examen médico de aptitud vial vencido',
    originModule: 'PESV',
    originType: 'AUDIT',
    originDetail: 'Auditoría Interna Integrada PESV - Paso 8 Idoneidad',
    siteName: 'Guayabal (Medellín)',
    processName: 'Operaciones Logísticas',
    description: 'En el muestreo de expedientes de conductores, el colaborador Javier Gómez presenta examen de aptitud física, mental y de coordinación motriz vencido desde el 10 de marzo de 2026.',
    legalCriterion: 'Resolución 40595 de 2022 - Paso 8 Evaluación de Conductores',
    severity: 'CRITICA',
    status: 'EN_ACPM',
    reportedBy: 'Marcela Rincón (Auditora Líder)',
    createdAt: '2026-03-24 16:40',
    linkedAcpmId: 'acpm-002'
  },
  {
    id: 'find-003',
    code: 'H-AMB-003',
    title: 'Falta de dique de contención secundario en acopio de aceites lubricantes usados',
    originModule: 'ENVIRONMENTAL',
    originType: 'INSPECTION',
    originDetail: 'Inspección de Gestión Ambiental y Almacenamiento RESPEL',
    siteName: 'Fontibón (Principal)',
    processName: 'Mantenimiento de Flota',
    description: 'Los tambores de 55 galones con aceite residual de cambios de motor no cuentan con bandeja o dique de retención con capacidad del 110% del recipiente mayor.',
    legalCriterion: 'Decreto 1076 de 2015 Título 6 - Manejo de RESPEL',
    severity: 'MAYOR',
    status: 'EN_ACPM',
    reportedBy: 'Ing. Ambiental Julián Torres',
    createdAt: '2026-03-27 11:20',
    linkedAcpmId: 'acpm-003'
  }
];

export const initialAcpmActions: AcpmAction[] = [
  {
    id: 'acpm-001',
    code: 'ACPM-2026-001',
    findingId: 'find-001',
    findingCode: 'H-SST-001',
    title: 'Reemplazo inmediato, despeje y demarcación de área para extintor EXT-BOG-04',
    originModule: 'SST',
    associatedRequirement: 'Dec 1072/15 - Prevención, preparación y respuesta ante emergencias',
    causeAnalysisMethod: '5_WHY',
    rootCauses: [
      '¿Por qué estaba descargado? Hubo una pequeña fuga en válvula no detectada.',
      '¿Por qué estaba bloqueado por estibas? Operarios temporales no recibieron inducción de demarcación.',
      'Causa Raíz: Ausencia de demarcación perimetral en suelo y falta de checklist pre-turno en bahía.'
    ],
    immediateAction: 'Sustitución inmediata del extintor por equipo de reserva operativo y retiro de estibas.',
    correctiveAction: 'Demarcar franja amarilla de 1 metro libre en piso con pintura epóxica e implementar charla de 5 minutos sobre despeje de rutas de evacuación.',
    responsibleName: 'Andrés Velasco',
    responsibleEmail: 'mantenimiento@andina.com.co',
    dueDate: '2026-03-25',
    priority: 'ALTA',
    status: 'CERRADA',
    evidences: [initialEvidences[0]],
    verificationResult: 'EFICAZ',
    verificationNotes: 'Se inspeccionó físicamente la Bahía 02 el 26/03/2026. Extintor con manómetro al 100%, demarcación en piso terminada y área completamente despejada. Se cierra acción.',
    verifiedAt: '2026-03-26 15:00',
    verifiedBy: 'Dra. Marcela Rincón (HSEQ)',
    history: [
      { id: 'h1', timestamp: '2026-03-18 10:20', userName: 'Carlos Mendoza', action: 'Acción ACPM generada automáticamente desde Inspección SST', newState: 'ABIERTA' },
      { id: 'h2', timestamp: '2026-03-19 14:00', userName: 'Andrés Velasco', action: 'Análisis de causa raíz diligenciado por metodología 5 Porqués', previousState: 'ABIERTA', newState: 'EN_EJECUCION' },
      { id: 'h3', timestamp: '2026-03-22 14:35', userName: 'Andrés Velasco', action: 'Carga de evidencia fotográfica (evi-001) y solicitud de cierre', previousState: 'EN_EJECUCION', newState: 'PENDIENTE_VERIFICACION' },
      { id: 'h4', timestamp: '2026-03-26 15:00', userName: 'Marcela Rincón', action: 'Verificación en campo: EFICAZ. Se aprueba cierre formal de la acción.', previousState: 'PENDIENTE_VERIFICACION', newState: 'CERRADA' }
    ]
  },
  {
    id: 'acpm-002',
    code: 'ACPM-2026-002',
    findingId: 'find-002',
    findingCode: 'H-PESV-002',
    title: 'Actualización y agendamiento urgente de exámenes ocupacionales viales',
    originModule: 'PESV',
    associatedRequirement: 'Res 40595 de 2022 - Paso 8 Idoneidad del Conductor',
    causeAnalysisMethod: 'ISHIKAWA',
    rootCauses: [
      'Mano de obra: No hubo seguimiento al calendario de vencimientos por cambio de analista de talento humano.',
      'Método: Registro en hoja de cálculo manual desconectada del sistema de asignación de turnos.'
    ],
    immediateAction: 'Reasignar al conductor Javier Gómez a labores de patio sin conducción en vía pública.',
    correctiveAction: 'Programar cita IPS para examen psicosensométrico y conectar la alerta de vencimiento al Centro ¿Qué tengo pendiente?.',
    responsibleName: 'Clara Domínguez (Talento Humano)',
    responsibleEmail: 'th@andina.com.co',
    dueDate: '2026-04-03',
    priority: 'ALTA',
    status: 'EN_EJECUCION',
    evidences: [],
    history: [
      { id: 'h5', timestamp: '2026-03-24 16:45', userName: 'Marcela Rincón', action: 'Acción generada desde Auditoría Interna PESV', newState: 'ABIERTA' },
      { id: 'h6', timestamp: '2026-03-25 08:30', userName: 'Clara Domínguez', action: 'Cita en IPS programada para el 02 de abril', previousState: 'ABIERTA', newState: 'EN_EJECUCION' }
    ]
  },
  {
    id: 'acpm-003',
    code: 'ACPM-2026-003',
    findingId: 'find-003',
    findingCode: 'H-AMB-003',
    title: 'Instalación de estiba de contención para tambores de aceite usado en taller',
    originModule: 'ENVIRONMENTAL',
    associatedRequirement: 'Decreto 1076 de 2015 - Normativa Ambiental Integral',
    causeAnalysisMethod: '5_WHY',
    rootCauses: [
      'La estiba plástica previa se fisuró y fue desechada sin reposición inmediata por demoras en orden de compra.'
    ],
    immediateAction: 'Colocar paños oleofílicos y bandeja provisional.',
    correctiveAction: 'Adquisición de estiba antiderrame de polietileno de 4 tambores certificada.',
    responsibleName: 'Andrés Velasco',
    responsibleEmail: 'mantenimiento@andina.com.co',
    dueDate: '2026-04-08',
    priority: 'MEDIA',
    status: 'EN_ANALISIS',
    evidences: [],
    history: [
      { id: 'h7', timestamp: '2026-03-27 11:30', userName: 'Julián Torres', action: 'Acción generada desde Inspección Ambiental', newState: 'ABIERTA' }
    ]
  }
];

export const initialTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Verificación de Eficacia ACPM-2026-002 (Examen médico vial conductor)',
    module: 'PESV',
    type: 'ACPM',
    dueDate: '2026-04-04',
    responsible: 'Marcela Rincón',
    priority: 'CRITICA',
    status: 'PENDIENTE',
    siteName: 'Guayabal (Medellín)',
    linkedId: 'acpm-002'
  },
  {
    id: 'task-002',
    title: 'Inspección Periódica Mensual de Botiquines y Duchas de Emergencia',
    module: 'SST',
    type: 'INSPECCION',
    dueDate: '2026-04-05',
    responsible: 'Brigadista Juan Galindo',
    priority: 'ALTA',
    status: 'PENDIENTE',
    siteName: 'Fontibón (Principal)'
  },
  {
    id: 'task-003',
    title: 'Consolidación de Pesajes PGIRS y Solicitud de Manifiestos de Carga',
    module: 'ENVIRONMENTAL',
    type: 'RESIDUOS',
    dueDate: '2026-04-06',
    responsible: 'Ing. Julián Torres',
    priority: 'MEDIA',
    status: 'PENDIENTE',
    siteName: 'Todas las Sedes'
  },
  {
    id: 'task-004',
    title: 'Revisión Técnica Mecánica Vehículo NPR WLM-452 (Vencimiento próximo)',
    module: 'PESV',
    type: 'MANTENIMIENTO',
    dueDate: '2026-04-12',
    responsible: 'Andrés Velasco',
    priority: 'ALTA',
    status: 'PENDIENTE',
    siteName: 'Fontibón (Principal)',
    linkedId: 'asset-veh-01'
  },
  {
    id: 'task-005',
    title: 'Auditoría Interna Cruzada Capítulos 8 y 9 ISO 9001 / 14001 / 45001',
    module: 'ISO_9001',
    type: 'AUDITORIA',
    dueDate: '2026-04-20',
    responsible: 'Auditor Externo Certificado',
    priority: 'ALTA',
    status: 'EN_PROGRESO',
    siteName: 'Fontibón (Principal)'
  }
];

export const initialAudits: Audit[] = [
  {
    id: 'audit-001',
    code: 'AUD-INT-2026-01',
    title: 'Auditoría Anual Integrada HSEQ (Res. 0312, Res. 40595 & Tri-Norma ISO)',
    module: 'INTEGRADO',
    scope: 'Sede Fontibón y Hub Medellín - Procesos Operativos, Mantenimiento y HSEQ',
    leadAuditor: 'Dra. Marcela Rincón (IRCA Lead Auditor)',
    auditDate: '2026-03-24',
    status: 'EN_EJECUCION',
    findingsGeneratedCount: 3,
    checklist: [
      {
        id: 'chk-1',
        requirementCode: 'Res. 0312 E1.1.1',
        requirementTitle: 'Responsable del Sistema de Gestión SST con licencia y curso 50h',
        standard: 'Resolución 0312 de 2019',
        status: 'CONFORME',
        auditorNotes: 'Se valida licencia profesional SST vigente No. 89452 de la líder del sistema y certificación del curso virtual de 50 horas actualizado a curso de 20 horas.',
        evidenceNotes: 'Archivo adjunto en repositorio de evidencias de talento humano.'
      },
      {
        id: 'chk-2',
        requirementCode: 'PESV Paso 8',
        requirementTitle: 'Evaluación y control de idoneidad de conductores (Exámenes y SIMIT)',
        standard: 'Resolución 40595 de 2022',
        status: 'NO_CONFORME',
        auditorNotes: 'Se evidenció conductor activo en ruta intermunicipal con certificado médico ocupacional vial vencido. Se emite hallazgo H-PESV-002.',
        evidenceNotes: 'Expediente digital auditado con fecha 10 de marzo de 2026.',
        findingGeneratedId: 'find-002'
      },
      {
        id: 'chk-3',
        requirementCode: 'ISO 14001:2015 8.1',
        requirementTitle: 'Control operacional ambiental para almacenamiento de residuos peligrosos',
        standard: 'ISO 14001:2015',
        status: 'NO_CONFORME',
        auditorNotes: 'Ausencia de dique de contención secundario en acopio de aceites lubricantes usados. Se genera hallazgo H-AMB-003.',
        evidenceNotes: 'Registro fotográfico tomado en patio norte de mantenimiento.',
        findingGeneratedId: 'find-003'
      },
      {
        id: 'chk-4',
        requirementCode: 'ISO 9001:2015 9.1.2',
        requirementTitle: 'Satisfacción del cliente y trazabilidad de entregas a tiempo (OTIF)',
        standard: 'ISO 9001:2015',
        status: 'OPORTUNIDAD_MEJORA',
        auditorNotes: 'El indicador OTIF se mide mensualmente (96.4%), pero no se analiza la correlación entre novedades mecánicas y retrasos en ruta.',
        evidenceNotes: 'Dashboard de despachos Q1 2026.'
      },
      {
        id: 'chk-5',
        requirementCode: 'Dec. 1072/15 2.2.4.6.25',
        requirementTitle: 'Planes de prevención, preparación y respuesta ante emergencias',
        standard: 'Decreto 1072 de 2015',
        status: 'CONFORME',
        auditorNotes: 'Brigadas conformadas y capacitadas. Simulacro anual ejecutado satisfactoriamente con acta y plan de mejora.',
        evidenceNotes: 'Acta de simulacro de evacuación 2025.'
      }
    ]
  }
];

export const initialGhgRecords: GhgEmissionRecord[] = [
  {
    id: 'ghg-001',
    scope: 1,
    period: '2026-Q1',
    siteId: 'site-bogota',
    siteName: 'Fontibón (Principal)',
    processName: 'Operaciones Logísticas',
    sourceCategory: 'Combustibles Fósiles Flota Propia (Diesel B10)',
    consumptionValue: 4250,
    consumptionUnit: 'Galones',
    emissionFactor: 10.21,
    factorSource: 'UPME Colombia / FECOC 2024 - Factor Oficial Diesel B10',
    factorYear: 2024,
    factorUnit: 'kg CO2eq / Galón',
    totalKgCO2eq: 43392.5,
    evidenceFileName: 'facturas_combustible_primax_q1.pdf'
  },
  {
    id: 'ghg-002',
    scope: 1,
    period: '2026-Q1',
    siteId: 'site-bogota',
    siteName: 'Fontibón (Principal)',
    processName: 'Mantenimiento de Flota',
    sourceCategory: 'Recarga y Fugas de Gas Refrigerante (R-134a)',
    consumptionValue: 12,
    consumptionUnit: 'Kilogramos',
    emissionFactor: 1430,
    factorSource: 'IPCC Sixth Assessment Report (AR6) - GWP 100 años',
    factorYear: 2023,
    factorUnit: 'kg CO2eq / kg R-134a',
    totalKgCO2eq: 17160,
    evidenceFileName: 'orden_servicio_climatizacion.pdf'
  },
  {
    id: 'ghg-003',
    scope: 2,
    period: '2026-Q1',
    siteId: 'site-bogota',
    siteName: 'Fontibón (Principal)',
    processName: 'Operaciones y Almacén',
    sourceCategory: 'Energía Eléctrica Red Interconectada Nacional (SIN)',
    consumptionValue: 28400,
    consumptionUnit: 'kWh',
    emissionFactor: 0.164,
    factorSource: 'XM Compañía de Expertos en Mercados - Factor de Emisión Red SIN 2024',
    factorYear: 2024,
    factorUnit: 'kg CO2eq / kWh',
    totalKgCO2eq: 4657.6,
    evidenceFileName: 'facturacion_enel_colombia_ene_mar.pdf'
  },
  {
    id: 'ghg-004',
    scope: 2,
    period: '2026-Q1',
    siteId: 'site-medellin',
    siteName: 'Guayabal (Medellín)',
    processName: 'Hub Regional',
    sourceCategory: 'Energía Eléctrica Red Interconectada Nacional (SIN)',
    consumptionValue: 11200,
    consumptionUnit: 'kWh',
    emissionFactor: 0.164,
    factorSource: 'XM Compañía de Expertos en Mercados - Factor SIN 2024',
    factorYear: 2024,
    factorUnit: 'kg CO2eq / kWh',
    totalKgCO2eq: 1836.8,
    evidenceFileName: 'factura_epm_q1.pdf'
  },
  {
    id: 'ghg-005',
    scope: 3,
    period: '2026-Q1',
    siteId: 'site-bogota',
    siteName: 'Fontibón (Principal)',
    processName: 'Gestión Ambiental',
    sourceCategory: 'Disposición de Residuos Ordinarios en Relleno Sanitario',
    consumptionValue: 3450,
    consumptionUnit: 'Kilogramos',
    emissionFactor: 0.58,
    factorSource: 'DEFRA / EPA Waste Model para Residuos Municipales Mixtos',
    factorYear: 2024,
    factorUnit: 'kg CO2eq / kg residuo',
    totalKgCO2eq: 2001.0,
    evidenceFileName: 'certificado_disposicion_relleno_dona_juana.pdf'
  }
];

export const initialPesvVehicles: PesvVehicle[] = [
  {
    id: 'v-01',
    plate: 'WLM-452',
    type: 'CAMION',
    brand: 'Chevrolet NPR Furgón',
    modelYear: 2021,
    soatExpiry: '2026-08-14',
    rtmExpiry: '2026-04-12',
    lastPreoperationalDate: '2026-03-30',
    assignedDriver: 'Javier Gómez (En revisión)',
    status: 'ALERTA_DOCUMENTAL'
  },
  {
    id: 'v-02',
    plate: 'SKR-890',
    type: 'CAMION',
    brand: 'Hino Dutro City',
    modelYear: 2023,
    soatExpiry: '2026-11-20',
    rtmExpiry: '2026-11-25',
    lastPreoperationalDate: '2026-03-30',
    assignedDriver: 'Mauricio Quintero',
    status: 'OPERATIVO'
  },
  {
    id: 'v-03',
    plate: 'EJK-12F',
    type: 'MOTOCICLETA',
    brand: 'Yamaha YBR 125',
    modelYear: 2022,
    soatExpiry: '2026-09-05',
    rtmExpiry: '2026-09-10',
    lastPreoperationalDate: '2026-03-30',
    assignedDriver: 'Diana Patricia Salazar',
    status: 'OPERATIVO'
  }
];

export const initialPesvDrivers: PesvDriver[] = [
  {
    id: 'd-01',
    fullName: 'Javier Gómez Restrepo',
    idNumber: '71.284.912',
    licenseNumber: 'CC71284912',
    licenseCategory: 'C2',
    licenseExpiry: '2028-05-18',
    simitPazYSalvo: true,
    medicalExamExpiry: '2026-03-10', // VENCIDO -> genera hallazgo y tarea
    defensiveDrivingTrainingDate: '2025-10-14',
    status: 'EN_OBSERVACION'
  },
  {
    id: 'd-02',
    fullName: 'Mauricio Quintero Beltrán',
    idNumber: '80.193.450',
    licenseNumber: 'CC80193450',
    licenseCategory: 'C2',
    licenseExpiry: '2027-12-01',
    simitPazYSalvo: true,
    medicalExamExpiry: '2026-09-15',
    defensiveDrivingTrainingDate: '2025-11-02',
    status: 'APTO'
  },
  {
    id: 'd-03',
    fullName: 'Diana Patricia Salazar',
    idNumber: '52.981.304',
    licenseNumber: 'CC52981304',
    licenseCategory: 'A2',
    licenseExpiry: '2029-01-20',
    simitPazYSalvo: true,
    medicalExamExpiry: '2026-11-10',
    defensiveDrivingTrainingDate: '2026-01-18',
    status: 'APTO'
  }
];

export const initialPgirsRecords: PgirsRecord[] = [
  {
    id: 'pg-01',
    date: '2026-03-25',
    wasteClassification: 'PELIGROSO_RESPEL',
    wasteName: 'Aceites Usados y Filtros Saturados de Motor',
    weightKg: 480,
    generatorArea: 'Taller de Mantenimiento Fontibón',
    authorizedGestor: 'EcoProcesos Ambientales S.A.S. E.S.P.',
    gestorNit: '830.123.456-1',
    certificateNumber: 'CERT-RESPEL-2026-089',
    disposalType: 'INCINERACION_TERMICA'
  },
  {
    id: 'pg-02',
    date: '2026-03-24',
    wasteClassification: 'APROVECHABLE',
    wasteName: 'Cartón Corrugado de Embalajes y Plástico Stretch Film',
    weightKg: 850,
    generatorArea: 'Bodega de Despachos y Devoluciones',
    authorizedGestor: 'Asociación de Recicladores de Fontibón (ARF)',
    gestorNit: '900.567.890-8',
    certificateNumber: 'CERT-REC-2026-142',
    disposalType: 'RECICLAJE'
  },
  {
    id: 'pg-03',
    date: '2026-03-26',
    wasteClassification: 'ORGANICO',
    wasteName: 'Restos de Alimentos Comedor de Empleados',
    weightKg: 210,
    generatorArea: 'Cafetería Central',
    authorizedGestor: 'BioCompost del Valle S.A.S.',
    gestorNit: '901.345.678-2',
    certificateNumber: 'BIO-2026-021',
    disposalType: 'COMPOSTAJE'
  }
];

export const initialSstHazards: SstHazardItem[] = [
  {
    id: 'haz-01',
    process: 'Operaciones Logísticas',
    activity: 'Cargue y descargue manual de cajas y mercancías pesadas',
    isRoutine: true,
    hazardClass: 'BIOMECANICO',
    hazardDescription: 'Manipulación manual de cargas superiores a 25 kg, posturas forzadas y movimientos repetitivos',
    possibleEffects: 'Desórdenes músculo-esqueléticos, lumbalgias agudas, hernias discales',
    deficiencyLevel: 6,
    exposureLevel: 3,
    severityLevel: 25,
    riskLevelInterpretation: 'II',
    acceptability: 'ACEPTABLE_CON_CONTROL',
    controls: {
      engineering: 'Adquisición de estibadoras eléctricas y mesas de tijera graduables',
      administrative: 'Pausas activas programadas de 8 minutos dos veces al día y rotación de puestos',
      epp: 'Faja lumbar (como recordatorio postural) y botas ergonómicas con plantilla anti-impacto'
    }
  },
  {
    id: 'haz-02',
    process: 'Operaciones Logísticas y Almacén',
    activity: 'Tránsito de montacargas y peatones en pasillos compartidos',
    isRoutine: true,
    hazardClass: 'CONDICIONES_SEGURIDAD',
    hazardDescription: 'Riesgo mecánico y locativo por atropellamiento, colisión o caída de carga estibada',
    possibleEffects: 'Traumatismos graves, fracturas, aplastamiento, fatalidad',
    deficiencyLevel: 6,
    exposureLevel: 4,
    severityLevel: 60,
    riskLevelInterpretation: 'I',
    acceptability: 'NO_ACEPTABLE',
    controls: {
      elimination: 'Segregación física total de pasillos peatonales mediante barreras antichoque de polímero',
      engineering: 'Sensores de proximidad con luz azul (blue spotlight) y radares de velocidad en montacargas a máx 10 km/h',
      administrative: 'Licencia obligatoria de operador, señalización vertical y demarcación vial interna',
      epp: 'Chaleco reflectivo clase 3 y casco de seguridad en zona de racks'
    }
  }
];
