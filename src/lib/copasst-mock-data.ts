import { CopasstGlobalState } from '@/types/copasst';

export const initialCopasstGlobalState: CopasstGlobalState = {
  mechanismType: 'COPASST', // Inicialmente COPASST dado el tamaño de la empresa demo (48 trabajadores), pero el motor lo ajusta dinámicamente si cambia
  ruleExplanation: 'Empresa con entre 10 y 49 trabajadores según Decreto 1072/2015 Art. 2.2.4.6.8 Parágrafo 2 y Resolución 2013 de 1986 Art. 2. Corresponde conformar un COPASST con un (1) representante principal y un (1) suplente por cada una de las partes (Total: 4 integrantes). Periodo legal: 2 años.',
  periodYears: 2,
  periodStart: '2025-03-01',
  periodEnd: '2027-02-28',
  status: 'CUMPLE',

  // Configuración de Vigía SST (para cuando la empresa tenga < 10 trabajadores o se configure)
  vigiaProfile: {
    workerId: 'wrk-001',
    appointmentDate: '2025-03-01',
    termYears: 2,
    termEndDate: '2027-02-28',
    employerName: 'Lic. Fernando Ortiz Salazar',
    employerDoc: 'CC 79.482.910',
    employerSignatureDate: '2025-03-01 09:00:00',
    vigiaSignatureDate: '2025-03-01 10:15:00',
    isSigned: true,
    functionsAccepted: true,
    notes: 'Designación oficial como Vigía de Seguridad y Salud en el Trabajo conforme al Parágrafo 2 del Art. 2.2.4.6.8 del Decreto 1072 de 2015.',
    documentActaId: 'ACTA-VIGIA-2025-01'
  },
  vigiaActuations: [
    {
      id: 'act-vig-001',
      date: '2026-02-15',
      type: 'INSPECCION',
      description: 'Inspección de orden y aseo en área de almacenamiento y muelles de carga. Se identificó obstrucción de extintor multipropósito por estibas vacías.',
      evidenceFileName: 'Registro_Inspeccion_Vigia_Muelles_Feb2026.pdf',
      findingAssociated: 'Obstrucción de equipo de control de incendios en bahía 2.',
      status: 'CERRADO',
      closedDate: '2026-02-16',
      sentToAcpm: true,
      linkedAcpmId: 'acpm-001',
      registeredBy: 'Vigía de SST'
    },
    {
      id: 'act-vig-002',
      date: '2026-03-02',
      type: 'CONDICION_INSEGURA',
      description: 'Reporte de cableado eléctrico expuesto cerca de la estación de empaque en bodega principal.',
      findingAssociated: 'Riesgo eléctrico por canaleta deteriorada en zona de empaque.',
      status: 'EN_PROCESO',
      sentToAcpm: true,
      registeredBy: 'Vigía de SST'
    }
  ],

  // Proceso Electoral COPASST
  election: {
    periodStart: '2025-03-01',
    periodEnd: '2027-02-28',
    convocationDate: '2025-02-10',
    candidatesPublicationDate: '2025-02-18',
    votingStartDate: '2025-02-24',
    votingEndDate: '2025-02-26',
    isVotingOpen: false,
    isClosed: true,
    closedAt: '2025-02-26 17:00:00',
    closedBy: 'Comité Electoral / Talento Humano',
    totalEligibleVoters: 48,
    voterAuditLog: [
      { voterDocNumber: '1.020.784.952', votedAt: '2025-02-24 09:12:00', ipAddress: '192.168.1.45' },
      { voterDocNumber: '79.654.120', votedAt: '2025-02-24 10:05:00', ipAddress: '192.168.1.80' },
      { voterDocNumber: '52.984.712', votedAt: '2025-02-24 11:30:00', ipAddress: '192.168.1.12' },
      { voterDocNumber: '80.123.456', votedAt: '2025-02-24 14:20:00', ipAddress: '192.168.1.33' }
    ],
    candidates: [
      {
        id: 'cand-001',
        workerId: 'wrk-002', // Carlos Mario Mendoza
        registrationDate: '2025-02-12',
        proposalBrief: 'Fomentar la ergonomía en cabinas de transporte y rutas seguras de descanso.',
        status: 'ACEPTADO',
        votesCount: 28,
        isElected: true,
        electedRole: 'PRINCIPAL'
      },
      {
        id: 'cand-002',
        workerId: 'wrk-003', // Sandra Milena Gómez
        registrationDate: '2025-02-14',
        proposalBrief: 'Mejorar los tiempos de pausas activas e iluminación en el área de bodega y almacenamiento.',
        status: 'ACEPTADO',
        votesCount: 16,
        isElected: true,
        electedRole: 'SUPLENTE'
      }
    ],
    resultsPublished: true,
    publicVotingUrlToken: 'token-elecciones-copasst-2025-andina'
  },

  // Integrantes Activos del COPASST
  members: [
    {
      id: 'mem-001',
      workerId: 'wrk-001', // Marcela Rincón Ortiz
      role: 'PRESIDENTE',
      party: 'EMPLEADOR',
      appointmentDate: '2025-03-01',
      isActive: true,
      signatureDate: '2025-03-01 10:00:00',
      signatureToken: 'SIG-PRES-MRINCON-2025'
    },
    {
      id: 'mem-002',
      workerId: 'wrk-004', // Lic. Fernando Ortiz Salazar
      role: 'SUPLENTE',
      party: 'EMPLEADOR',
      appointmentDate: '2025-03-01',
      isActive: true,
      signatureDate: '2025-03-01 10:05:00',
      signatureToken: 'SIG-SUPL-FORTIZ-2025'
    },
    {
      id: 'mem-003',
      workerId: 'wrk-002', // Carlos Mario Mendoza
      role: 'PRINCIPAL',
      party: 'TRABAJADORES',
      appointmentDate: '2025-03-01',
      isActive: true,
      signatureDate: '2025-03-01 10:10:00',
      signatureToken: 'SIG-PRIN-CMENDOZA-2025'
    },
    {
      id: 'mem-004',
      workerId: 'wrk-003', // Sandra Milena Gómez
      role: 'SECRETARIO',
      party: 'TRABAJADORES',
      appointmentDate: '2025-03-01',
      isActive: true,
      signatureDate: '2025-03-01 10:15:00',
      signatureToken: 'SIG-SECR-SGOMEZ-2025'
    }
  ],
  presidentWorkerId: 'wrk-001',
  secretaryWorkerId: 'wrk-003',
  conformationActDate: '2025-03-01',
  conformationActNumber: 'ACTA-CONF-COP-2025-01',
  installationActDate: '2025-03-02',

  // Reuniones Ordinarias Mensuales
  meetings: [
    {
      id: 'mtg-001',
      meetingNumber: 1,
      actaCode: 'ACTA-COP-2026-01',
      date: '2026-01-16',
      modality: 'PRESENCIAL',
      locationOrLink: 'Sala de Juntas Principal Fontibón',
      attendeesWorkerIds: ['wrk-001', 'wrk-002', 'wrk-003'],
      absenteesWorkerIds: ['wrk-004'],
      agendaTopics: [
        '1. Verificación del quórum reglamentario',
        '2. Revisión de estadísticas de accidentalidad y ausentismo de Diciembre 2025',
        '3. Programación de inspecciones de seguridad del primer trimestre',
        '4. Proposiciones y varios'
      ],
      discussionSummary: 'Se instaló la primera reunión ordinaria de 2026. Se constató que durante el mes de Diciembre 2025 no se presentaron accidentes con incapacidad ni eventos graves. El comité programó la primera ronda de inspección de extintores y botiquines para Febrero.',
      recommendations: [
        'Realizar jornada de reinducción en normas de seguridad vial a conductores tercerizados.',
        'Solicitar a la ARL acompañamiento en capacitación de investigación de incidentes.'
      ],
      decisions: [
        'Aprobar el cronograma trimestral de reuniones ordinarias (tercer viernes de cada mes).',
        'Fijar la fecha de la próxima sesión para el 20 de febrero de 2026.'
      ],
      commitments: [
        {
          id: 'com-001',
          meetingId: 'mtg-001',
          description: 'Elaborar lista de chequeo para inspección de botiquines y estaciones lavaojos.',
          responsibleWorkerId: 'wrk-003',
          responsibleName: 'Sandra Milena Gómez (Secretaria)',
          dueDate: '2026-01-30',
          status: 'CUMPLIDO',
          evidenceFileName: 'Formato_Inspeccion_Botiquines_V1.xlsx',
          verifiedAt: '2026-01-29'
        },
        {
          id: 'com-002',
          meetingId: 'mtg-001',
          description: 'Gestionar con ARL Sura el taller de investigación de accidentes para los integrantes del comité.',
          responsibleWorkerId: 'wrk-001',
          responsibleName: 'Marcela Rincón Ortiz (Presidente)',
          dueDate: '2026-02-10',
          status: 'CUMPLIDO',
          evidenceFileName: 'Correo_Confirmacion_Capacitacion_ARL.pdf',
          verifiedAt: '2026-02-08'
        }
      ],
      signedByPresident: true,
      signedBySecretary: true,
      membersSignatures: [
        {
          workerId: 'wrk-001',
          memberName: 'Marcela Rincón Ortiz',
          role: 'Presidente del COPASST',
          party: 'EMPLEADOR',
          docNumber: 'CC 52.984.712',
          signed: true,
          signedAt: '2026-01-16 11:30:00',
          signatureToken: 'SIG-COP-52984712-20260116-A1B2'
        },
        {
          workerId: 'wrk-004',
          memberName: 'Lic. Fernando Ortiz Salazar',
          role: 'Suplente Empleador',
          party: 'EMPLEADOR',
          docNumber: 'CC 79.482.910',
          signed: true,
          signedAt: '2026-01-16 11:45:00',
          signatureToken: 'SIG-COP-79482910-20260116-C3D4'
        },
        {
          workerId: 'wrk-002',
          memberName: 'Carlos Mario Mendoza',
          role: 'Principal Trabajadores',
          party: 'TRABAJADORES',
          docNumber: 'CC 1.020.784.952',
          signed: true,
          signedAt: '2026-01-16 11:35:00',
          signatureToken: 'SIG-COP-10207849-20260116-E5F6'
        },
        {
          workerId: 'wrk-003',
          memberName: 'Sandra Milena Gómez',
          role: 'Secretaria del COPASST',
          party: 'TRABAJADORES',
          docNumber: 'CC 80.123.456',
          signed: true,
          signedAt: '2026-01-16 11:40:00',
          signatureToken: 'SIG-COP-80123456-20260116-G7H8'
        }
      ],
      scannedSignedActFileName: 'Acta_COPASST_01_Enero2026_Firmada_Escaneada.pdf',
      scannedSignedActFileSize: '1.8 MB',
      scannedSignedActUploadedAt: '2026-01-17 09:15:00',
      customObservations: 'Se acordó dar prioridad a la inspección de áreas críticas de almacenamiento durante el primer trimestre.',
      isClosed: true,
      evidenceIds: ['evi-acta-cop-01']
    },
    {
      id: 'mtg-002',
      meetingNumber: 2,
      actaCode: 'ACTA-COP-2026-02',
      date: '2026-02-20',
      modality: 'HIBRIDA',
      locationOrLink: 'Sala de Capacitación y Microsoft Teams',
      attendeesWorkerIds: ['wrk-001', 'wrk-002', 'wrk-003', 'wrk-004'],
      absenteesWorkerIds: [],
      agendaTopics: [
        '1. Llamado a lista y quórum',
        '2. Seguimiento a compromisos del Acta 01',
        '3. Revisión del reporte de investigación del incidente INC-2025-08',
        '4. Revisión del presupuesto SST 2026 en rubros paritarios',
        '5. Varios y compromisos'
      ],
      discussionSummary: 'Se revisó y aprobó el informe de compromisos anteriores, todos ejecutados a cabalidad. Se analizó el informe del incidente en muelle 3 y se recomendó demarcar claramente la zona peatonal frente a la rampa hidráulica.',
      recommendations: [
        'Instalar topes de seguridad en el final de los muelles de cargue 2 y 3.',
        'Reforzar la divulgación del procedimiento seguro de enganche de remolques.'
      ],
      decisions: [
        'Emitir concepto favorable sobre el rubro de capacitación paritaria del presupuesto SST 2026.',
        'Programar recorrido conjunto de inspección locativa para el 10 de marzo.'
      ],
      commitments: [
        {
          id: 'com-003',
          meetingId: 'mtg-002',
          description: 'Coordinar con mantenimiento la demarcación amarilla reflectiva en el muelle de cargue 3.',
          responsibleWorkerId: 'wrk-002',
          responsibleName: 'Carlos Mario Mendoza (Principal Trabajadores)',
          dueDate: '2026-03-05',
          status: 'CUMPLIDO',
          evidenceFileName: 'Fotos_Demarcacion_Muelle3.pdf',
          verifiedAt: '2026-03-04'
        },
        {
          id: 'com-004',
          meetingId: 'mtg-002',
          description: 'Hacer entrega a gerencia del informe de recomendaciones para instalación de topes en muelles.',
          responsibleWorkerId: 'wrk-001',
          responsibleName: 'Marcela Rincón Ortiz (Presidente)',
          dueDate: '2026-03-12',
          status: 'CUMPLIDO',
          verifiedAt: '2026-03-11'
        }
      ],
      signedByPresident: true,
      signedBySecretary: true,
      membersSignatures: [
        {
          workerId: 'wrk-001',
          memberName: 'Marcela Rincón Ortiz',
          role: 'Presidente del COPASST',
          party: 'EMPLEADOR',
          docNumber: 'CC 52.984.712',
          signed: true,
          signedAt: '2026-02-20 12:05:00',
          signatureToken: 'SIG-COP-52984712-20260220-B9C0'
        },
        {
          workerId: 'wrk-004',
          memberName: 'Lic. Fernando Ortiz Salazar',
          role: 'Suplente Empleador',
          party: 'EMPLEADOR',
          docNumber: 'CC 79.482.910',
          signed: true,
          signedAt: '2026-02-20 12:15:00',
          signatureToken: 'SIG-COP-79482910-20260220-D1E2'
        },
        {
          workerId: 'wrk-002',
          memberName: 'Carlos Mario Mendoza',
          role: 'Principal Trabajadores',
          party: 'TRABAJADORES',
          docNumber: 'CC 1.020.784.952',
          signed: true,
          signedAt: '2026-02-20 12:10:00',
          signatureToken: 'SIG-COP-10207849-20260220-F3G4'
        },
        {
          workerId: 'wrk-003',
          memberName: 'Sandra Milena Gómez',
          role: 'Secretaria del COPASST',
          party: 'TRABAJADORES',
          docNumber: 'CC 80.123.456',
          signed: true,
          signedAt: '2026-02-20 12:12:00',
          signatureToken: 'SIG-COP-80123456-20260220-H5I6'
        }
      ],
      scannedSignedActFileName: 'Acta_COPASST_02_Febrero2026_Firmada.pdf',
      scannedSignedActFileSize: '2.1 MB',
      scannedSignedActUploadedAt: '2026-02-21 14:20:00',
      customObservations: 'Se constató asistencia completa presencial y remota con registro biométrico.',
      isClosed: true,
      evidenceIds: ['evi-acta-cop-02']
    },
    {
      id: 'mtg-003',
      meetingNumber: 3,
      actaCode: 'ACTA-COP-2026-03',
      date: '2026-03-20',
      modality: 'PRESENCIAL',
      locationOrLink: 'Sala de Juntas Principal Fontibón',
      attendeesWorkerIds: ['wrk-001', 'wrk-002', 'wrk-003'],
      absenteesWorkerIds: ['wrk-004'],
      agendaTopics: [
        '1. Verificación de quórum',
        '2. Lectura y aprobación del acta anterior No. 02',
        '3. Resultados de la inspección locativa del 10 de marzo',
        '4. Análisis de condiciones de iluminación en bodega nocturna',
        '5. Asignación de nuevos compromisos y cierre'
      ],
      discussionSummary: 'Durante el recorrido locativo se detectaron dos luminarias LED fundidas en el pasillo central de la bodega de almacenamiento, lo cual disminuye los niveles recomendados por el RETILAP para tránsito seguro.',
      recommendations: [
        'Reemplazo inmediato de las dos luminarias fundidas en pasillo C.',
        'Evaluar la necesidad de dotar de linternas frontales recargables al personal del turno noche.'
      ],
      decisions: [
        'Generar un hallazgo formal hacia la Matriz ACPM para el reemplazo de luminarias y revisión del circuito eléctrico.',
        'Fijar la reunión ordinaria del mes de Abril para el 17 de abril de 2026.'
      ],
      commitments: [
        {
          id: 'com-005',
          meetingId: 'mtg-003',
          description: 'Pasar requerimiento de compra de luminarias LED de 150W para bodega C a Dirección Administrativa.',
          responsibleWorkerId: 'wrk-003',
          responsibleName: 'Sandra Milena Gómez (Secretaria)',
          dueDate: '2026-03-27',
          status: 'EN_PROCESO'
        },
        {
          id: 'com-006',
          meetingId: 'mtg-003',
          description: 'Hacer medición de niveles de luxes una vez instaladas las nuevas luminarias para verificar cumplimiento.',
          responsibleWorkerId: 'wrk-001',
          responsibleName: 'Marcela Rincón Ortiz (Presidente)',
          dueDate: '2026-04-10',
          status: 'PENDIENTE'
        }
      ],
      signedByPresident: true,
      signedBySecretary: false, // Pendiente firma
      membersSignatures: [
        {
          workerId: 'wrk-001',
          memberName: 'Marcela Rincón Ortiz',
          role: 'Presidente del COPASST',
          party: 'EMPLEADOR',
          docNumber: 'CC 52.984.712',
          signed: true,
          signedAt: '2026-03-20 16:30:00',
          signatureToken: 'SIG-COP-52984712-20260320-J7K8'
        },
        {
          workerId: 'wrk-004',
          memberName: 'Lic. Fernando Ortiz Salazar',
          role: 'Suplente Empleador',
          party: 'EMPLEADOR',
          docNumber: 'CC 79.482.910',
          signed: false
        },
        {
          workerId: 'wrk-002',
          memberName: 'Carlos Mario Mendoza',
          role: 'Principal Trabajadores',
          party: 'TRABAJADORES',
          docNumber: 'CC 1.020.784.952',
          signed: true,
          signedAt: '2026-03-20 16:35:00',
          signatureToken: 'SIG-COP-10207849-20260320-L9M0'
        },
        {
          workerId: 'wrk-003',
          memberName: 'Sandra Milena Gómez',
          role: 'Secretaria del COPASST',
          party: 'TRABAJADORES',
          docNumber: 'CC 80.123.456',
          signed: false
        }
      ],
      customObservations: 'Pendiente firma final de la Secretaria y del Suplente para cierre de custodia legal.',
      isClosed: false,
      evidenceIds: []
    }
  ],

  // Compromisos acumulados
  commitments: [
    {
      id: 'com-001',
      meetingId: 'mtg-001',
      description: 'Elaborar lista de chequeo para inspección de botiquines y estaciones lavaojos.',
      responsibleWorkerId: 'wrk-003',
      responsibleName: 'Sandra Milena Gómez (Secretaria)',
      dueDate: '2026-01-30',
      status: 'CUMPLIDO',
      evidenceFileName: 'Formato_Inspeccion_Botiquines_V1.xlsx',
      verifiedAt: '2026-01-29'
    },
    {
      id: 'com-002',
      meetingId: 'mtg-001',
      description: 'Gestionar con ARL Sura el taller de investigación de accidentes para los integrantes del comité.',
      responsibleWorkerId: 'wrk-001',
      responsibleName: 'Marcela Rincón Ortiz (Presidente)',
      dueDate: '2026-02-10',
      status: 'CUMPLIDO',
      evidenceFileName: 'Correo_Confirmacion_Capacitacion_ARL.pdf',
      verifiedAt: '2026-02-08'
    },
    {
      id: 'com-003',
      meetingId: 'mtg-002',
      description: 'Coordinar con mantenimiento la demarcación amarilla reflectiva en el muelle de cargue 3.',
      responsibleWorkerId: 'wrk-002',
      responsibleName: 'Carlos Mario Mendoza (Principal Trabajadores)',
      dueDate: '2026-03-05',
      status: 'CUMPLIDO',
      evidenceFileName: 'Fotos_Demarcacion_Muelle3.pdf',
      verifiedAt: '2026-03-04'
    },
    {
      id: 'com-004',
      meetingId: 'mtg-002',
      description: 'Hacer entrega a gerencia del informe de recomendaciones para instalación de topes en muelles.',
      responsibleWorkerId: 'wrk-001',
      responsibleName: 'Marcela Rincón Ortiz (Presidente)',
      dueDate: '2026-03-12',
      status: 'CUMPLIDO',
      verifiedAt: '2026-03-11'
    },
    {
      id: 'com-005',
      meetingId: 'mtg-003',
      description: 'Pasar requerimiento de compra de luminarias LED de 150W para bodega C a Dirección Administrativa.',
      responsibleWorkerId: 'wrk-003',
      responsibleName: 'Sandra Milena Gómez (Secretaria)',
      dueDate: '2026-03-27',
      status: 'EN_PROCESO'
    },
    {
      id: 'com-006',
      meetingId: 'mtg-003',
      description: 'Hacer medición de niveles de luxes una vez instaladas las nuevas luminarias para verificar cumplimiento.',
      responsibleWorkerId: 'wrk-001',
      responsibleName: 'Marcela Rincón Ortiz (Presidente)',
      dueDate: '2026-04-10',
      status: 'PENDIENTE'
    }
  ],

  // Hallazgos detectados por el COPASST
  findings: [
    {
      id: 'cop-find-001',
      sourceType: 'COPASST_REUNION',
      sourceRef: 'Acta No. 03 (20 de Marzo de 2026)',
      date: '2026-03-20',
      classification: 'CONDICION_INSEGURA',
      description: 'Deterioro en la iluminación artificial del pasillo central de almacenamiento en bodega Fontibón, lo que incrementa el riesgo de colisión de montacargas y caídas a nivel.',
      processName: 'Almacenamiento y Logística',
      areaName: 'Bodega Central Fontibón',
      relatedWorkerName: 'Carlos Mario Mendoza',
      legalRequirementRef: 'Resolución 2400 de 1979 Título III Art. 79 y Decreto 1072 Art. 2.2.4.6.15',
      hazardRiskRef: 'Físico / Iluminación deficiente',
      proposedAction: 'Reemplazo de 2 luminarias industriales de 150W y verificación luxométrica.',
      evidenceFileName: 'Registro_Fotografico_Pasillo_Oscuro.pdf',
      sentToAcpm: true,
      linkedAcpmId: 'acpm-003',
      status: 'EN_ACPM'
    },
    {
      id: 'cop-find-002',
      sourceType: 'INSPECCION_SEGURIDAD',
      sourceRef: 'Inspección de Equipos Contra Incendio (Febrero 2026)',
      date: '2026-02-12',
      classification: 'NO_CONFORMIDAD',
      description: 'Extintor No. 14 de 20 lbs en bahía de cargue bloqueado transitoriamente con mercancía en espera de despacho.',
      processName: 'Despachos y Distribución',
      areaName: 'Bahía de Cargue Fontibón',
      legalRequirementRef: 'Decreto 1072 Art. 2.2.4.6.25 Prevención ante emergencias',
      hazardRiskRef: 'Fenómenos naturales / Incendio',
      proposedAction: 'Despejar área de 1 metro alrededor del equipo y socializar con auxiliares de bodega.',
      sentToAcpm: false,
      status: 'RESUELTO'
    }
  ],

  // Capacitaciones del COPASST (Estándar 1.1.7)
  trainings: [
    {
      id: 'trn-cop-001',
      topic: 'Rol, Funciones y Responsabilidades Legales del COPASST y Vigía de SST (Res. 2013/1986 y Dec. 1072/2015)',
      entityOrTrainer: 'ARL Sura Consultoría Especializada',
      date: '2025-03-15',
      durationHours: 4,
      attendedWorkerIds: ['wrk-001', 'wrk-002', 'wrk-003', 'wrk-004'],
      certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&auto=format&fit=crop&q=80',
      evidenceFileName: 'Certificado_Capacitacion_Rol_COPASST_2025.pdf',
      status: 'EJECUTADA'
    },
    {
      id: 'trn-cop-002',
      topic: 'Metodología de Investigación de Incidentes y Accidentes de Trabajo (Resolución 1401 de 2007)',
      entityOrTrainer: 'Ing. Especialista en SST - ARL Sura',
      date: '2025-09-20',
      durationHours: 8,
      attendedWorkerIds: ['wrk-001', 'wrk-002', 'wrk-003'],
      certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&auto=format&fit=crop&q=80',
      evidenceFileName: 'Certificado_Investigacion_AT_COPASST_2025.pdf',
      status: 'EJECUTADA'
    },
    {
      id: 'trn-cop-003',
      topic: 'Técnicas de Inspecciones Planeadas de Seguridad y Reporte de Condiciones Inseguras',
      entityOrTrainer: 'Líder HSEQ Marcela Rincón',
      date: '2026-02-12',
      durationHours: 4,
      attendedWorkerIds: ['wrk-001', 'wrk-002', 'wrk-003', 'wrk-004'],
      evidenceFileName: 'Lista_Asistencia_Inspecciones_Feb2026.pdf',
      status: 'EJECUTADA'
    }
  ],

  // Notas y observaciones editables oficiales
  conformationActNotes: 'Acta formalizada con presencia de delegados de gerencia y trabajadores. Se deja constancia de la asignación obligatoria de cuatro (4) horas semanales dentro de la jornada laboral para el funcionamiento del comité según el Decreto 1072/2015 Art. 2.2.4.6.8 Parágrafo 2.',
  installationActNotes: 'Sesión de instalación donde se designó formalmente a la Secretaria del comité por consenso y se aprobó el cronograma de reuniones ordinarias del periodo 2025-2027.',
  electionActNotes: 'Proceso de votación democrática y escrutinio transparente llevado a cabo conforme a la Resolución 2013 de 1986. Padrón electoral verificado al 100%.',
  vigiaDesignationNotes: 'Designación oficial efectuada por la Gerencia General en cumplimiento del Parágrafo 2 del Artículo 2.2.4.6.8 del Decreto 1072 de 2015.'
};
