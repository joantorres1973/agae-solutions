import { MasterWorker } from '@/types/worker';

export const initialMasterWorkers: MasterWorker[] = [
  // -------------------------------------------------------------------------
  // 1. Ing. Marcela Rincón Ortiz - Responsable SG-SST / Líder HSEQ
  // -------------------------------------------------------------------------
  {
    id: 'wrk-001',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    firstName: 'Marcela',
    lastName: 'Rincón Ortiz',
    docType: 'CC',
    docNumber: '1.020.784.952',
    birthDate: '1988-06-14',
    address: 'Carrera 58 # 134-20 Apto 402',
    city: 'Bogotá D.C.',
    email: 'marcela.rincon@andina-sas.com',
    phone: '+57 311 482 9104',
    status: 'ACTIVO',
    hireDate: '2024-02-01',
    position: 'Líder HSEQ & Coordinadora SG-SST',
    area: 'Gestión Integral HSEQ',
    processId: 'proc-hseq',
    processName: 'Gestión Integral HSEQ y PESV',
    siteId: 'site-bogota',
    siteName: 'Centro de Distribución Fontibón (Sede Principal)',
    immediateBoss: 'Lic. Fernando Ortiz Salazar',
    immediateBossId: 'wrk-004',
    contractType: 'TERMINO_INDEFINIDO',
    workModality: 'HIBRIDO',
    workShift: 'COMPLETA',

    // Historial Laboral: Conserva la trazabilidad completa
    laborHistory: [
      {
        id: 'lh-001-1',
        changeDate: '2024-02-01',
        newPosition: 'Analista de Seguridad y Salud en el Trabajo',
        newArea: 'Gestión Integral HSEQ',
        newSalary: 3800000,
        reason: 'INGRESO',
        registeredBy: 'Talento Humano',
        notes: 'Ingreso inicial a la organización con contrato a término indefinido.'
      },
      {
        id: 'lh-001-2',
        changeDate: '2025-01-15',
        previousPosition: 'Analista de Seguridad y Salud en el Trabajo',
        newPosition: 'Profesional SST',
        previousArea: 'Gestión Integral HSEQ',
        newArea: 'Gestión Integral HSEQ',
        previousSalary: 3800000,
        newSalary: 5200000,
        reason: 'PROMOCION',
        registeredBy: 'Gerencia General',
        notes: 'Promoción por cumplimiento de metas del SG-SST y culminación de especialización.'
      },
      {
        id: 'lh-001-3',
        changeDate: '2026-01-10',
        previousPosition: 'Profesional SST',
        newPosition: 'Líder HSEQ & Coordinadora SG-SST',
        previousArea: 'Gestión Integral HSEQ',
        newArea: 'Gestión Integral HSEQ',
        previousSalary: 5200000,
        newSalary: 6800000,
        reason: 'PROMOCION',
        registeredBy: 'Lic. Fernando Ortiz Salazar',
        notes: 'Asignación formal como Responsable del SG-SST (Estándar 1.1.1 Resolución 0312).'
      }
    ],

    educationLevel: 'ESPECIALIZACION',
    academicRecords: [
      {
        id: 'acad-001-1',
        level: 'PROFESIONAL',
        degreeTitle: 'Ingeniería Industrial',
        institution: 'Universidad Nacional de Colombia',
        graduationDate: '2012-11-25',
        status: 'GRADUADO',
        evidenceFileName: 'Diploma_Ingenieria_Industrial_MRincon.pdf'
      },
      {
        id: 'acad-001-2',
        level: 'ESPECIALIZACION',
        degreeTitle: 'Especialización en Seguridad y Salud en el Trabajo',
        institution: 'Universidad El Bosque',
        graduationDate: '2016-08-18',
        status: 'GRADUADO',
        evidenceFileName: 'Diploma_Especializacion_SST_MRincon.pdf'
      }
    ],

    certifications: [
      {
        id: 'cert-001-1',
        title: 'Curso de 50 Horas del SG-SST (Resolución 4927/2016)',
        entity: 'Servicio Nacional de Aprendizaje (SENA)',
        issueDate: '2023-06-10',
        status: 'VIGENTE',
        certificateNumber: 'SENA-SST-50H-98124',
        evidenceFileName: 'Certificado_Curso_50H_MRincon.pdf'
      },
      {
        id: 'cert-001-2',
        title: 'Curso de Actualización de 20 Horas del SG-SST',
        entity: 'ARL Sura / Ministerio del Trabajo',
        issueDate: '2026-02-14',
        expiryDate: '2029-02-14',
        status: 'VIGENTE',
        certificateNumber: 'ACT-20H-2026-1049',
        evidenceFileName: 'Certificado_Curso_20H_MRincon.pdf'
      },
      {
        id: 'cert-001-3',
        title: 'Auditor Interno Sistemas Integrados HSEQ (ISO 9001, 14001, 45001)',
        entity: 'Bureau Veritas Certification',
        issueDate: '2024-05-20',
        status: 'VIGENTE',
        certificateNumber: 'BV-HSEQ-AUD-4421',
        evidenceFileName: 'Auditor_Interno_HSEQ_MRincon.pdf'
      }
    ],

    licenses: [
      {
        id: 'lic-001-1',
        type: 'LICENCIA_SST',
        name: 'Licencia en Seguridad y Salud en el Trabajo',
        number: 'LIC-SST-2023-08941',
        resolutionNumber: 'Resolución No. 08941 de 2023',
        issuingEntity: 'Secretaría Distrital de Salud de Bogotá',
        issueDate: '2023-05-18',
        expiryDate: '2033-05-18',
        status: 'VIGENTE',
        evidenceFileName: 'Resolucion_Licencia_SST_MRincon.pdf'
      },
      {
        id: 'lic-001-2',
        type: 'COPNIA',
        name: 'Matrícula Profesional de Ingeniería Industrial',
        number: '25245-18920 CND',
        issuingEntity: 'Consejo Profesional Nacional de Ingeniería (COPNIA)',
        issueDate: '2013-02-10',
        status: 'VIGENTE',
        evidenceFileName: 'Tarjeta_COPNIA_MRincon.pdf'
      }
    ],

    digitalDocuments: [
      {
        id: 'doc-001-1',
        type: 'HOJA_DE_VIDA',
        title: 'Hoja de Vida en Formato Corporativo',
        fileName: 'HV_Marcela_Rincon_2026.pdf',
        fileSize: '1.4 MB',
        uploadedAt: '2026-01-12',
        status: 'VIGENTE',
        uploadedBy: 'Marcela Rincón Ortiz'
      },
      {
        id: 'doc-001-2',
        type: 'DOCUMENTO_IDENTIDAD',
        title: 'Cédula de Ciudadanía Ampliada al 150%',
        fileName: 'CC_1020784952_MarcelaRincon.pdf',
        fileSize: '820 KB',
        uploadedAt: '2024-02-01',
        status: 'NO_EXPIRA',
        uploadedBy: 'Talento Humano'
      },
      {
        id: 'doc-001-3',
        type: 'LICENCIA_SST',
        title: 'Resolución Licencia SST Secretaría de Salud',
        fileName: 'Resolucion_Licencia_SST_2023_08941.pdf',
        fileSize: '2.1 MB',
        uploadedAt: '2024-02-01',
        issueDate: '2023-05-18',
        expiryDate: '2033-05-18',
        status: 'VIGENTE',
        uploadedBy: 'Marcela Rincón Ortiz'
      },
      {
        id: 'doc-001-4',
        type: 'CONTRATO_LABORAL',
        title: 'Contrato de Trabajo a Término Indefinido y Otrosí',
        fileName: 'Contrato_Laboral_MRincon_2026.pdf',
        fileSize: '1.8 MB',
        uploadedAt: '2026-01-10',
        status: 'VIGENTE',
        uploadedBy: 'Talento Humano'
      }
    ],

    inductions: [
      {
        id: 'ind-001-1',
        type: 'INDUCCION',
        date: '2024-02-02',
        evaluationScore: 100,
        approved: true,
        trainerName: 'Talento Humano & Dirección General',
        evidenceFileName: 'Acta_Induccion_Corporativa_MRincon.pdf'
      },
      {
        id: 'ind-001-2',
        type: 'REINDUCCION',
        date: '2026-01-18',
        evaluationScore: 98,
        approved: true,
        trainerName: 'Lic. Fernando Ortiz Salazar',
        evidenceFileName: 'Acta_Reinduccion_Anual_2026_MRincon.pdf'
      }
    ],

    trainings: [
      {
        id: 'trn-001-1',
        trainingTitle: 'Actualización Normativa Resolución 0312 y Decreto 1072',
        date: '2026-02-20',
        hours: 8,
        trainingType: 'SST',
        trainerName: 'ARL Sura Consultoría Especializada',
        attendanceVerified: true,
        score: 95,
        approved: true,
        certificateFileName: 'Cert_Capacitacion_Res0312.pdf'
      },
      {
        id: 'trn-001-2',
        trainingTitle: 'Preparación y Respuesta ante Emergencias Químicas',
        date: '2025-11-14',
        hours: 4,
        trainingType: 'EMERGENCIAS',
        trainerName: 'Cuerpo de Bomberos de Fontibón',
        attendanceVerified: true,
        score: 100,
        approved: true
      }
    ],

    eppDeliveries: [
      {
        id: 'epp-001-1',
        date: '2026-01-20',
        elementName: 'Casco de Seguridad Industrial Tipo II con Barbuquejo',
        category: 'PROTECCION_CABEZA',
        quantity: 1,
        deliveryReason: 'DOTACION_INICIAL',
        signedReceipt: true,
        deliveredBy: 'Almacén Central HSEQ',
        evidenceFileName: 'Entrega_EPP_MRincon_2026.pdf',
        notes: 'Entrega para inspecciones en patio y bodega.'
      },
      {
        id: 'epp-001-2',
        date: '2026-01-20',
        elementName: 'Botas de Seguridad Dieléctricas con Puntera en Composite',
        category: 'PROTECCION_PIES',
        quantity: 1,
        deliveryReason: 'PERIODICA',
        signedReceipt: true,
        deliveredBy: 'Almacén Central HSEQ',
        evidenceFileName: 'Entrega_EPP_MRincon_2026.pdf'
      },
      {
        id: 'epp-001-3',
        date: '2026-01-20',
        elementName: 'Gafas de Seguridad con Protección UV y Antiempañante',
        category: 'PROTECCION_VISUAL',
        quantity: 1,
        deliveryReason: 'PERIODICA',
        signedReceipt: true,
        deliveredBy: 'Almacén Central HSEQ'
      }
    ],

    committeeParticipations: [
      {
        id: 'com-001-1',
        committeeType: 'COPASST',
        role: 'SECRETARIO',
        representedParty: 'EMPLEADOR',
        periodStart: '2025-06-01',
        periodEnd: '2027-05-31',
        isActive: true,
        electionActNumber: 'ACTA-COPASST-2025-01',
        evidenceFileName: 'Acta_Conformacion_COPASST_2025_2027.pdf'
      },
      {
        id: 'com-001-2',
        committeeType: 'BRIGADA_EMERGENCIAS',
        role: 'LIDER_EVACUACION',
        representedParty: 'EMPLEADOR',
        periodStart: '2025-01-01',
        periodEnd: '2026-12-31',
        isActive: true,
        electionActNumber: 'RES-BRIG-2025-04'
      }
    ],

    occupationalExams: [
      {
        id: 'med-001-1',
        type: 'INGRESO',
        date: '2024-01-25',
        medicalIps: 'Sanitas Salud Ocupacional S.A.S.',
        doctorName: 'Dra. Claudia Patricia Duque (RM 41829)',
        concept: 'APTO',
        recommendations: 'Apto para el cargo de oficina e inspecciones de campo. Mantener higiene postural y pausas activas.',
        nextExamDate: '2025-01-25',
        evidenceFileName: 'Concepto_Medico_Ingreso_MRincon.pdf'
      },
      {
        id: 'med-001-2',
        type: 'PERIODICO',
        date: '2026-01-14',
        medicalIps: 'Colsanitas Medicina del Trabajo Fontibón',
        doctorName: 'Dr. Roberto Meza (RM 29104)',
        concept: 'APTO_CON_RECOMENDACIONES',
        recommendations: 'Apto sin restricciones. Se recomienda uso de filtro antirreflejo en pantalla y seguimiento ergonómico.',
        nextExamDate: '2027-01-14',
        evidenceFileName: 'Concepto_Medico_Periodico_2026_MRincon.pdf'
      }
    ],

    incidentParticipations: [
      {
        id: 'inc-001-1',
        date: '2025-09-12',
        eventNumber: 'INC-2025-08',
        eventType: 'INCIDENTE_TRABAJO',
        participationRole: 'INVESTIGADOR_COPASST',
        descriptionBrief: 'Investigación de caída de estiba sin lesiones en Muelle 3.',
        investigationCompleted: true
      }
    ],

    inspections: [
      {
        id: 'insp-001-1',
        date: '2026-02-10',
        inspectionType: 'PUESTO_TRABAJO',
        inspectorName: 'Ergonomía ARL Sura',
        result: 'SATISFACTORIO',
        notes: 'Puesto de trabajo cumple con estándares biomecánicos recomendados.'
      }
    ],

    auditTrail: [
      {
        id: 'aud-001-1',
        timestamp: '2024-02-01 08:30:00',
        userName: 'Talento Humano',
        action: 'CREACION',
        reason: 'Creación de expediente inicial de trabajadora.'
      },
      {
        id: 'aud-001-2',
        timestamp: '2026-01-10 11:15:00',
        userName: 'Lic. Fernando Ortiz Salazar',
        action: 'CAMBIO_CARGO',
        fieldChanged: 'position',
        previousValue: 'Profesional SST',
        newValue: 'Líder HSEQ & Coordinadora SG-SST',
        reason: 'Asignación de liderazgo SG-SST y PESV.'
      }
    ],

    createdAt: '2024-02-01',
    updatedAt: '2026-02-20'
  },

  // -------------------------------------------------------------------------
  // 2. Carlos Mario Mendoza - Conductor de Carga Pesada (PESV)
  // -------------------------------------------------------------------------
  {
    id: 'wrk-002',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    firstName: 'Carlos Mario',
    lastName: 'Mendoza Beltrán',
    docType: 'CC',
    docNumber: '71.284.912',
    birthDate: '1982-10-04',
    address: 'Calle 65 Sur # 78H-12',
    city: 'Bogotá D.C.',
    email: 'carlos.mendoza@andina-sas.com',
    phone: '+57 313 779 4012',
    status: 'ACTIVO',
    hireDate: '2021-08-15',
    position: 'Conductor de Carga Pesada - Tractocamión',
    area: 'Operaciones Logísticas y Transporte',
    processId: 'proc-ops',
    processName: 'Operaciones Logísticas y Transporte',
    siteId: 'site-bogota',
    siteName: 'Centro de Distribución Fontibón (Sede Principal)',
    immediateBoss: 'Ing. Carlos Mendoza',
    immediateBossId: 'wrk-006',
    contractType: 'TERMINO_INDEFINIDO',
    workModality: 'PRESENCIAL',
    workShift: 'TURNOS_ROTATIVOS',

    laborHistory: [
      {
        id: 'lh-002-1',
        changeDate: '2021-08-15',
        newPosition: 'Conductor Camión Sencillo',
        newArea: 'Operaciones y Transporte',
        newSalary: 2200000,
        reason: 'INGRESO',
        registeredBy: 'Talento Humano',
        notes: 'Ingreso inicial para rutas locales de Bogotá.'
      },
      {
        id: 'lh-002-2',
        changeDate: '2023-04-01',
        previousPosition: 'Conductor Camión Sencillo',
        newPosition: 'Conductor de Carga Pesada - Tractocamión',
        previousArea: 'Operaciones y Transporte',
        newArea: 'Operaciones Logísticas y Transporte',
        previousSalary: 2200000,
        newSalary: 3400000,
        reason: 'PROMOCION',
        registeredBy: 'Ing. Carlos Mendoza',
        notes: 'Ascenso a tractomula nacional tras obtención de recategorización C3 y cero comparendos.'
      }
    ],

    educationLevel: 'BACHILLERATO',
    academicRecords: [
      {
        id: 'acad-002-1',
        level: 'BACHILLERATO',
        degreeTitle: 'Bachiller Académico',
        institution: 'Colegio Departamental de Funza',
        graduationDate: '2000-12-05',
        status: 'GRADUADO',
        evidenceFileName: 'Diploma_Bachiller_CMendoza.pdf'
      }
    ],

    certifications: [
      {
        id: 'cert-002-1',
        title: 'Manejo Defensivo y Seguridad Vial PESV (Resolución 40595/2022)',
        entity: 'Centro de Enseñanza Automovilística CEA Los Andes',
        issueDate: '2025-10-14',
        expiryDate: '2026-10-14',
        status: 'VIGENTE',
        certificateNumber: 'CEA-PESV-2025-881',
        evidenceFileName: 'Certificado_Manejo_Defensivo_CMendoza.pdf'
      },
      {
        id: 'cert-002-2',
        title: 'Transporte de Mercancías Peligrosas por Carretera (Decreto 1609/2002)',
        entity: 'SENA Centro de Tecnologías del Transporte',
        issueDate: '2024-09-10',
        expiryDate: '2026-09-10',
        status: 'VIGENTE',
        certificateNumber: 'SENA-MERC-PEL-4120',
        evidenceFileName: 'Certificado_Mercancias_Peligrosas_CMendoza.pdf'
      }
    ],

    licenses: [
      {
        id: 'lic-002-1',
        type: 'TARJETA_PROFESIONAL',
        name: 'Licencia de Conducción Categoría C2 y C3',
        number: 'CC71284912',
        issuingEntity: 'Ministerio de Transporte / RUNT',
        issueDate: '2023-05-18',
        expiryDate: '2028-05-18',
        status: 'VIGENTE',
        evidenceFileName: 'Licencia_Conduccion_C3_CMendoza.pdf'
      }
    ],

    digitalDocuments: [
      {
        id: 'doc-002-1',
        type: 'HOJA_DE_VIDA',
        title: 'Hoja de Vida Conductor Certificada',
        fileName: 'HV_Carlos_Mendoza_2026.pdf',
        fileSize: '950 KB',
        uploadedAt: '2026-01-08',
        status: 'VIGENTE',
        uploadedBy: 'Talento Humano'
      },
      {
        id: 'doc-002-2',
        type: 'DOCUMENTO_IDENTIDAD',
        title: 'Cédula de Ciudadanía',
        fileName: 'CC_71284912_CarlosMendoza.pdf',
        fileSize: '640 KB',
        uploadedAt: '2021-08-15',
        status: 'NO_EXPIRA',
        uploadedBy: 'Talento Humano'
      },
      {
        id: 'doc-002-3',
        type: 'CONCEPTO_MEDICO',
        title: 'Certificado de Aptitud Médica Ocupacional Énfasis Osteomuscular y Visiometría',
        fileName: 'Concepto_Medico_Vencido_CMendoza.pdf',
        fileSize: '1.1 MB',
        uploadedAt: '2025-03-10',
        issueDate: '2025-03-10',
        expiryDate: '2026-03-10', // ALERTA: Vencido recientemente
        status: 'VENCIDO',
        uploadedBy: 'Gestión SST',
        notes: 'Genera alerta automática para agendar renovación prioritaria.'
      }
    ],

    inductions: [
      {
        id: 'ind-002-1',
        type: 'REINDUCCION',
        date: '2026-01-22',
        evaluationScore: 92,
        approved: true,
        trainerName: 'Marcela Rincón Ortiz',
        evidenceFileName: 'Reinduccion_SST_PESV_CMendoza.pdf'
      }
    ],

    trainings: [
      {
        id: 'trn-002-1',
        trainingTitle: 'Inspección Preoperacional de Vehículos y Fatiga al Volante',
        date: '2026-02-18',
        hours: 4,
        trainingType: 'PESV',
        trainerName: 'Ing. Marcela Rincón',
        attendanceVerified: true,
        score: 96,
        approved: true
      }
    ],

    eppDeliveries: [
      {
        id: 'epp-002-1',
        date: '2026-01-15',
        elementName: 'Botas de Seguridad con Puntera en Acero y Suela Antideslizante',
        category: 'PROTECCION_PIES',
        quantity: 1,
        deliveryReason: 'PERIODICA',
        signedReceipt: true,
        deliveredBy: 'Almacén Fontibón',
        evidenceFileName: 'Entrega_EPP_CMendoza_2026.pdf'
      },
      {
        id: 'epp-002-2',
        date: '2026-01-15',
        elementName: 'Chaleco Reflectivo de Alta Visibilidad Norma ANSI/ISEA 107',
        category: 'INDUMENTARIA',
        quantity: 2,
        deliveryReason: 'PERIODICA',
        signedReceipt: true,
        deliveredBy: 'Almacén Fontibón'
      },
      {
        id: 'epp-002-3',
        date: '2026-01-15',
        elementName: 'Guantes de Vaqueta para Cargue y Descargue',
        category: 'PROTECCION_MANOS',
        quantity: 3,
        deliveryReason: 'PERIODICA',
        signedReceipt: true,
        deliveredBy: 'Almacén Fontibón'
      }
    ],

    committeeParticipations: [
      {
        id: 'com-002-1',
        committeeType: 'BRIGADA_EMERGENCIAS',
        role: 'BRIGADISTA',
        representedParty: 'TRABAJADORES',
        periodStart: '2025-01-01',
        periodEnd: '2026-12-31',
        isActive: true,
        electionActNumber: 'BRIG-2025-02'
      }
    ],

    occupationalExams: [
      {
        id: 'med-002-1',
        type: 'PERIODICO',
        date: '2025-03-10',
        medicalIps: 'IPS Médicos Viales del Centro',
        doctorName: 'Dr. Hernán Castro (RM 31409)',
        concept: 'APTO_CON_RECOMENDACIONES',
        recommendations: 'Apto para conducción. Realizar pausas activas cada 2 horas de manejo, uso obligatorio de lentes de corrección y control de índice de masa corporal.',
        nextExamDate: '2026-03-10',
        evidenceFileName: 'Examen_Periodico_CMendoza.pdf'
      }
    ],

    incidentParticipations: [],

    inspections: [
      {
        id: 'insp-002-1',
        date: '2026-03-25',
        inspectionType: 'SEGURIDAD_VIAL_PREOPERACIONAL',
        inspectorName: 'Supervisor de Flota Fontibón',
        result: 'SATISFACTORIO',
        notes: 'Inspección de tractocamión KTR-502 conforme a lista de chequeo PESV.'
      }
    ],

    auditTrail: [
      {
        id: 'aud-002-1',
        timestamp: '2021-08-15 09:00:00',
        userName: 'Talento Humano',
        action: 'CREACION',
        reason: 'Ingreso inicial a la empresa.'
      },
      {
        id: 'aud-002-2',
        timestamp: '2026-03-11 08:00:00',
        userName: 'Sistema Automático AGAE',
        action: 'ACTUALIZACION_DATOS',
        fieldChanged: 'digitalDocuments.status',
        previousValue: 'VIGENTE',
        newValue: 'VENCIDO',
        reason: 'Alerta automática: Examen médico periódico venció el 2026-03-10.'
      }
    ],

    createdAt: '2021-08-15',
    updatedAt: '2026-03-11'
  },

  // -------------------------------------------------------------------------
  // 3. Andrés Felipe Gómez Restrepo - Supervisor de Operaciones y Bodega
  // -------------------------------------------------------------------------
  {
    id: 'wrk-003',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    firstName: 'Andrés Felipe',
    lastName: 'Gómez Restrepo',
    docType: 'CC',
    docNumber: '1.018.993.411',
    birthDate: '1992-04-19',
    address: 'Diagonal 45 Sur # 19-30',
    city: 'Bogotá D.C.',
    email: 'andres.gomez@andina-sas.com',
    phone: '+57 320 892 1445',
    status: 'ACTIVO',
    hireDate: '2022-03-01',
    position: 'Supervisor de Operaciones y Mantenimiento de Bodega',
    area: 'Mantenimiento e Infraestructura',
    processId: 'proc-maint',
    processName: 'Mantenimiento de Flota e Instalaciones',
    siteId: 'site-bogota',
    siteName: 'Centro de Distribución Fontibón (Sede Principal)',
    immediateBoss: 'Téc. Andrés Velasco',
    immediateBossId: 'wrk-007',
    contractType: 'TERMINO_INDEFINIDO',
    workModality: 'PRESENCIAL',
    workShift: 'COMPLETA',

    laborHistory: [
      {
        id: 'lh-003-1',
        changeDate: '2022-03-01',
        newPosition: 'Técnico de Mantenimiento Locativo',
        newArea: 'Mantenimiento',
        newSalary: 1950000,
        reason: 'INGRESO',
        registeredBy: 'Talento Humano',
        notes: 'Ingreso para soporte de estanterías y bodegaje.'
      },
      {
        id: 'lh-003-2',
        changeDate: '2024-06-01',
        previousPosition: 'Técnico de Mantenimiento Locativo',
        newPosition: 'Supervisor de Operaciones y Mantenimiento de Bodega',
        previousArea: 'Mantenimiento',
        newArea: 'Mantenimiento e Infraestructura',
        previousSalary: 1950000,
        newSalary: 2850000,
        reason: 'PROMOCION',
        registeredBy: 'Téc. Andrés Velasco',
        notes: 'Promoción tras certificar nivel de Coordinador de Trabajo en Alturas.'
      }
    ],

    educationLevel: 'TECNOLOGO',
    academicRecords: [
      {
        id: 'acad-003-1',
        level: 'TECNOLOGO',
        degreeTitle: 'Tecnólogo en Mantenimiento Electromecánico Industrial',
        institution: 'SENA Regional Distrito Capital',
        graduationDate: '2015-10-20',
        status: 'GRADUADO',
        evidenceFileName: 'Diploma_Tecnologo_AGomez.pdf'
      }
    ],

    certifications: [
      {
        id: 'cert-003-1',
        title: 'Certificación Trabajo Seguro en Alturas - Nivel Coordinador (Res. 4272/2021)',
        entity: 'Centro de Entrenamiento Alturas del Centro S.A.S.',
        issueDate: '2025-04-20',
        expiryDate: '2026-04-20', // ALERTA: Por vencer en menos de 15 días
        status: 'POR_VENCER',
        certificateNumber: 'ALT-COORD-2025-9014',
        evidenceFileName: 'Certificado_Alturas_Coordinador_AGomez.pdf'
      },
      {
        id: 'cert-003-2',
        title: 'Primeros Auxilios Básicos y Soporte Vital Básico',
        entity: 'Cruz Roja Colombiana Seccional Cundinamarca',
        issueDate: '2025-08-10',
        expiryDate: '2027-08-10',
        status: 'VIGENTE',
        certificateNumber: 'CRC-PA-2025-3310',
        evidenceFileName: 'Certificado_Primeros_Auxilios_AGomez.pdf'
      }
    ],

    licenses: [],

    digitalDocuments: [
      {
        id: 'doc-003-1',
        type: 'HOJA_DE_VIDA',
        title: 'Hoja de Vida Actualizada',
        fileName: 'HV_Andres_Gomez_2026.pdf',
        fileSize: '1.2 MB',
        uploadedAt: '2026-01-15',
        status: 'VIGENTE',
        uploadedBy: 'Andrés Felipe Gómez'
      },
      {
        id: 'doc-003-2',
        type: 'CERTIFICADO_ALTURAS',
        title: 'Certificado Trabajo Seguro en Alturas - Coordinador (Res 4272/21)',
        fileName: 'Certificado_Alturas_Res4272_AGomez.pdf',
        fileSize: '1.8 MB',
        uploadedAt: '2025-04-20',
        issueDate: '2025-04-20',
        expiryDate: '2026-04-20',
        status: 'POR_VENCER',
        uploadedBy: 'Marcela Rincón Ortiz',
        notes: 'ALERTA: Vence el 2026-04-20. Requiere reentrenamiento urgente.'
      }
    ],

    inductions: [
      {
        id: 'ind-003-1',
        type: 'REINDUCCION',
        date: '2026-01-20',
        evaluationScore: 95,
        approved: true,
        trainerName: 'Marcela Rincón Ortiz',
        evidenceFileName: 'Acta_Reinduccion_AGomez.pdf'
      }
    ],

    trainings: [
      {
        id: 'trn-003-1',
        trainingTitle: 'Inspección de Arneses y Equipos de Protección Contra Caídas',
        date: '2025-11-28',
        hours: 6,
        trainingType: 'SST',
        trainerName: '3M Fall Protection Colombia',
        attendanceVerified: true,
        score: 100,
        approved: true
      }
    ],

    eppDeliveries: [
      {
        id: 'epp-003-1',
        date: '2026-01-15',
        elementName: 'Arnés de Cuerpo Entero Multipropósito 4 Argollas ANSI Z359.11',
        category: 'TRABAJO_ALTURAS',
        quantity: 1,
        deliveryReason: 'DOTACION_INICIAL',
        signedReceipt: true,
        deliveredBy: 'Almacén Central',
        evidenceFileName: 'Ficha_Entrega_Arnes_AGomez.pdf'
      },
      {
        id: 'epp-003-2',
        date: '2026-01-15',
        elementName: 'Eslinga de Detención de Caídas en Y con Absorbedor de Choque',
        category: 'TRABAJO_ALTURAS',
        quantity: 1,
        deliveryReason: 'DOTACION_INICIAL',
        signedReceipt: true,
        deliveredBy: 'Almacén Central'
      },
      {
        id: 'epp-003-3',
        date: '2026-01-15',
        elementName: 'Casco de Seguridad con Barbuquejo de 3 Puntos',
        category: 'PROTECCION_CABEZA',
        quantity: 1,
        deliveryReason: 'PERIODICA',
        signedReceipt: true,
        deliveredBy: 'Almacén Central'
      }
    ],

    committeeParticipations: [
      {
        id: 'com-003-1',
        committeeType: 'COPASST',
        role: 'PRINCIPAL',
        representedParty: 'TRABAJADORES',
        periodStart: '2025-06-01',
        periodEnd: '2027-05-31',
        isActive: true,
        electionActNumber: 'ACTA-COPASST-2025-01',
        evidenceFileName: 'Acta_Eleccion_Votacion_COPASST_2025.pdf'
      },
      {
        id: 'com-003-2',
        committeeType: 'BRIGADA_EMERGENCIAS',
        role: 'BRIGADISTA',
        representedParty: 'TRABAJADORES',
        periodStart: '2025-01-01',
        periodEnd: '2026-12-31',
        isActive: true
      }
    ],

    occupationalExams: [
      {
        id: 'med-003-1',
        type: 'PERIODICO',
        date: '2025-09-18',
        medicalIps: 'IPS Médica Laboral Fontibón',
        doctorName: 'Dr. Jaime Morales (RM 18290)',
        concept: 'APTO',
        recommendations: 'Apto para trabajo en alturas y esfuerzo físico. Sin restricciones.',
        nextExamDate: '2026-09-18',
        evidenceFileName: 'Examen_Alturas_AGomez.pdf'
      }
    ],

    incidentParticipations: [
      {
        id: 'inc-003-1',
        date: '2025-09-12',
        eventNumber: 'INC-2025-08',
        eventType: 'INCIDENTE_TRABAJO',
        participationRole: 'TESTIGO',
        descriptionBrief: 'Presenció la caída de estiba y coordinó la suspensión de maniobras.',
        investigationCompleted: true
      }
    ],

    inspections: [
      {
        id: 'insp-003-1',
        date: '2026-02-15',
        inspectionType: 'USO_EPP',
        inspectorName: 'Marcela Rincón Ortiz',
        result: 'SATISFACTORIO',
        notes: 'Uso impecable de arnés, botas y casco en inspección no programada.'
      }
    ],

    auditTrail: [
      {
        id: 'aud-003-1',
        timestamp: '2022-03-01 08:00:00',
        userName: 'Talento Humano',
        action: 'CREACION',
        reason: 'Ingreso inicial a la organización.'
      },
      {
        id: 'aud-003-2',
        timestamp: '2026-03-20 14:00:00',
        userName: 'Sistema Automático AGAE',
        action: 'ACTUALIZACION_DATOS',
        fieldChanged: 'certifications.status',
        previousValue: 'VIGENTE',
        newValue: 'POR_VENCER',
        reason: 'Alerta automática: Certificación de Alturas vencerá en 30 días.'
      }
    ],

    createdAt: '2022-03-01',
    updatedAt: '2026-03-20'
  },

  // -------------------------------------------------------------------------
  // 4. Lic. Fernando Ortiz Salazar - Gerente General / Representante Legal
  // -------------------------------------------------------------------------
  {
    id: 'wrk-004',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    firstName: 'Fernando',
    lastName: 'Ortiz Salazar',
    docType: 'CC',
    docNumber: '79.845.120',
    birthDate: '1970-07-28',
    address: 'Calle 116 # 7-15 Penthouse 2',
    city: 'Bogotá D.C.',
    email: 'gerencia@andina-sas.com',
    phone: '+57 310 220 8900',
    status: 'ACTIVO',
    hireDate: '2018-01-10',
    position: 'Gerente General & Representante Legal',
    area: 'Direccionamiento Estratégico',
    processId: 'proc-ger',
    processName: 'Direccionamiento Estratégico',
    siteId: 'site-bogota',
    siteName: 'Centro de Distribución Fontibón (Sede Principal)',
    immediateBoss: 'Junta Directiva',
    contractType: 'TERMINO_INDEFINIDO',
    workModality: 'PRESENCIAL',
    workShift: 'COMPLETA',

    laborHistory: [
      {
        id: 'lh-004-1',
        changeDate: '2018-01-10',
        newPosition: 'Gerente General & Representante Legal',
        newArea: 'Direccionamiento Estratégico',
        newSalary: 18000000,
        reason: 'INGRESO',
        registeredBy: 'Junta Directiva',
        notes: 'Nombramiento en escritura pública registrada ante Cámara de Comercio.'
      }
    ],

    educationLevel: 'MAESTRIA',
    academicRecords: [
      {
        id: 'acad-004-1',
        level: 'PROFESIONAL',
        degreeTitle: 'Administración de Empresas',
        institution: 'Colegio Mayor de Nuestra Señora del Rosario',
        graduationDate: '1995-12-01',
        status: 'GRADUADO'
      },
      {
        id: 'acad-004-2',
        level: 'MAESTRIA',
        degreeTitle: 'Master in Business Administration (MBA)',
        institution: 'Universidad de los Andes',
        graduationDate: '2004-06-15',
        status: 'GRADUADO'
      }
    ],

    certifications: [
      {
        id: 'cert-004-1',
        title: 'Liderazgo en Seguridad y Rendición de Cuentas SG-SST (Dec. 1072/15)',
        entity: 'ARL Sura / Consejo Colombiano de Seguridad',
        issueDate: '2025-02-10',
        status: 'VIGENTE'
      }
    ],

    licenses: [],

    digitalDocuments: [
      {
        id: 'doc-004-1',
        type: 'HOJA_DE_VIDA',
        title: 'Hoja de Vida Gerencia',
        fileName: 'HV_Fernando_Ortiz_2026.pdf',
        fileSize: '880 KB',
        uploadedAt: '2026-01-10',
        status: 'VIGENTE',
        uploadedBy: 'Gerencia'
      },
      {
        id: 'doc-004-2',
        type: 'DOCUMENTO_IDENTIDAD',
        title: 'Cédula de Ciudadanía',
        fileName: 'CC_79845120_FOrtiz.pdf',
        fileSize: '540 KB',
        uploadedAt: '2018-01-10',
        status: 'NO_EXPIRA',
        uploadedBy: 'Talento Humano'
      }
    ],

    inductions: [
      {
        id: 'ind-004-1',
        type: 'REINDUCCION',
        date: '2026-01-15',
        evaluationScore: 100,
        approved: true,
        trainerName: 'Marcela Rincón Ortiz',
        notes: 'Reinducción gerencial en políticas, presupuesto y rendición de cuentas SG-SST.'
      }
    ],

    trainings: [
      {
        id: 'trn-004-1',
        trainingTitle: 'Responsabilidad Civil, Penal y Administrativa en SST',
        date: '2025-10-05',
        hours: 4,
        trainingType: 'SST',
        trainerName: 'Abogados HSEQ Especializados',
        attendanceVerified: true,
        score: 100,
        approved: true
      }
    ],

    eppDeliveries: [],

    committeeParticipations: [],

    occupationalExams: [
      {
        id: 'med-004-1',
        type: 'PERIODICO',
        date: '2025-11-10',
        medicalIps: 'Colsanitas Medicina Preventiva',
        concept: 'APTO',
        recommendations: 'Apto para labor ejecutiva. Manejo de estrés y pausas activas visuales.',
        nextExamDate: '2026-11-10'
      }
    ],

    incidentParticipations: [],

    inspections: [],

    auditTrail: [
      {
        id: 'aud-004-1',
        timestamp: '2018-01-10 09:00:00',
        userName: 'Junta Directiva',
        action: 'CREACION',
        reason: 'Registro en sistema.'
      }
    ],

    createdAt: '2018-01-10',
    updatedAt: '2026-01-15'
  },

  // -------------------------------------------------------------------------
  // 5. Mariana Restrepo Morales - Analista Ambiental & Miembro Comité Convivencia
  // -------------------------------------------------------------------------
  {
    id: 'wrk-005',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    firstName: 'Mariana',
    lastName: 'Restrepo Morales',
    docType: 'CC',
    docNumber: '1.036.920.145',
    birthDate: '1995-09-12',
    address: 'Carrera 70 # 32B-45',
    city: 'Medellín',
    email: 'mariana.restrepo@andina-sas.com',
    phone: '+57 301 549 8120',
    status: 'ACTIVO',
    hireDate: '2023-05-15',
    position: 'Analista de Gestión Ambiental y Huella de Carbono',
    area: 'Gestión Ambiental y Sostenibilidad',
    processId: 'proc-hseq',
    processName: 'Gestión Integral HSEQ y PESV',
    siteId: 'site-medellin',
    siteName: 'Hub Regional Guayabal (Medellín)',
    immediateBoss: 'Marcela Rincón Ortiz',
    immediateBossId: 'wrk-001',
    contractType: 'TERMINO_INDEFINIDO',
    workModality: 'PRESENCIAL',
    workShift: 'COMPLETA',

    laborHistory: [
      {
        id: 'lh-005-1',
        changeDate: '2023-05-15',
        newPosition: 'Analista de Gestión Ambiental y Huella de Carbono',
        newArea: 'Gestión Ambiental y Sostenibilidad',
        newSalary: 3200000,
        reason: 'INGRESO',
        registeredBy: 'Talento Humano',
        notes: 'Ingreso para la gestión de residuos PGIRS y cálculo de huella de carbono Scope 1, 2 y 3.'
      }
    ],

    educationLevel: 'PROFESIONAL',
    academicRecords: [
      {
        id: 'acad-005-1',
        level: 'PROFESIONAL',
        degreeTitle: 'Ingeniería Ambiental',
        institution: 'Universidad de Antioquia',
        graduationDate: '2019-12-14',
        status: 'GRADUADO',
        evidenceFileName: 'Diploma_Ingenieria_Ambiental_MRestrepo.pdf'
      }
    ],

    certifications: [
      {
        id: 'cert-005-1',
        title: 'Cuantificación de Emisiones GEI - Norma ISO 14064-1:2018',
        entity: 'ICONTEC Internacional',
        issueDate: '2024-03-22',
        status: 'VIGENTE',
        certificateNumber: 'ICON-GEI-2024-118'
      },
      {
        id: 'cert-005-2',
        title: 'Manejo Integral de Residuos Peligrosos (RESPEL)',
        entity: 'Área Metropolitana del Valle de Aburrá',
        issueDate: '2024-08-15',
        status: 'VIGENTE'
      }
    ],

    licenses: [],

    digitalDocuments: [
      {
        id: 'doc-005-1',
        type: 'HOJA_DE_VIDA',
        title: 'Hoja de Vida Profesional',
        fileName: 'HV_Mariana_Restrepo_2026.pdf',
        fileSize: '1.1 MB',
        uploadedAt: '2026-01-18',
        status: 'VIGENTE',
        uploadedBy: 'Mariana Restrepo'
      }
    ],

    inductions: [
      {
        id: 'ind-005-1',
        type: 'REINDUCCION',
        date: '2026-01-25',
        evaluationScore: 98,
        approved: true,
        trainerName: 'Marcela Rincón Ortiz'
      }
    ],

    trainings: [
      {
        id: 'trn-005-1',
        trainingTitle: 'Separación en la Fuente y Economía Circular Empresarial',
        date: '2026-02-12',
        hours: 4,
        trainingType: 'AMBIENTAL',
        trainerName: 'Mariana Restrepo Morales',
        attendanceVerified: true,
        score: 100,
        approved: true
      }
    ],

    eppDeliveries: [
      {
        id: 'epp-005-1',
        date: '2026-01-20',
        elementName: 'Botas de Seguridad con Puntera Dieléctrica',
        category: 'PROTECCION_PIES',
        quantity: 1,
        deliveryReason: 'PERIODICA',
        signedReceipt: true,
        deliveredBy: 'Almacén Guayabal'
      },
      {
        id: 'epp-005-2',
        date: '2026-01-20',
        elementName: 'Respirador Media Cara con Filtros para Vapores Químicos',
        category: 'PROTECCION_RESPIRATORIA',
        quantity: 1,
        deliveryReason: 'PERIODICA',
        signedReceipt: true,
        deliveredBy: 'Almacén Guayabal',
        notes: 'Para inspección y acopio en cuarto RESPEL.'
      }
    ],

    committeeParticipations: [
      {
        id: 'com-005-1',
        committeeType: 'CONVIVENCIA_LABORAL',
        role: 'SECRETARIO',
        representedParty: 'TRABAJADORES',
        periodStart: '2025-04-01',
        periodEnd: '2027-03-31',
        isActive: true,
        electionActNumber: 'ACTA-CCL-2025-01'
      },
      {
        id: 'com-005-2',
        committeeType: 'BRIGADA_EMERGENCIAS',
        role: 'BRIGADISTA',
        representedParty: 'TRABAJADORES',
        periodStart: '2025-01-01',
        periodEnd: '2026-12-31',
        isActive: true
      }
    ],

    occupationalExams: [
      {
        id: 'med-005-1',
        type: 'PERIODICO',
        date: '2025-05-10',
        medicalIps: 'Laboral Antioquia S.A.S.',
        concept: 'APTO',
        recommendations: 'Apto sin restricciones. Espirometría y audiometría normales.',
        nextExamDate: '2026-05-10'
      }
    ],

    incidentParticipations: [],

    inspections: [
      {
        id: 'insp-005-1',
        date: '2026-02-28',
        inspectionType: 'PUESTO_TRABAJO',
        inspectorName: 'SST Guayabal',
        result: 'SATISFACTORIO'
      }
    ],

    auditTrail: [
      {
        id: 'aud-005-1',
        timestamp: '2023-05-15 08:30:00',
        userName: 'Talento Humano',
        action: 'CREACION',
        reason: 'Ingreso inicial a la organización.'
      }
    ],

    createdAt: '2023-05-15',
    updatedAt: '2026-02-12'
  },

  // -------------------------------------------------------------------------
  // 6. Ing. Carlos Mendoza - Líder Operaciones y Transporte
  // -------------------------------------------------------------------------
  {
    id: 'wrk-006',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    firstName: 'Carlos Alberto',
    lastName: 'Mendoza Gutiérrez',
    docType: 'CC',
    docNumber: '79.654.321',
    birthDate: '1979-11-03',
    address: 'Calle 134 # 45-19',
    city: 'Bogotá D.C.',
    email: 'carlos.mendoza.dir@andina-sas.com',
    phone: '+57 312 908 7741',
    status: 'ACTIVO',
    hireDate: '2019-04-01',
    position: 'Director de Operaciones Logísticas y Transporte',
    area: 'Operaciones Logísticas y Transporte',
    processId: 'proc-ops',
    processName: 'Operaciones Logísticas y Transporte',
    siteId: 'site-bogota',
    siteName: 'Centro de Distribución Fontibón (Sede Principal)',
    immediateBoss: 'Lic. Fernando Ortiz Salazar',
    immediateBossId: 'wrk-004',
    contractType: 'TERMINO_INDEFINIDO',
    workModality: 'PRESENCIAL',
    workShift: 'COMPLETA',

    laborHistory: [
      {
        id: 'lh-006-1',
        changeDate: '2019-04-01',
        newPosition: 'Director de Operaciones Logísticas y Transporte',
        newArea: 'Operaciones Logísticas y Transporte',
        newSalary: 8500000,
        reason: 'INGRESO',
        registeredBy: 'Gerencia General',
        notes: 'Contratación para estructurar la cadena de distribución nacional.'
      }
    ],

    educationLevel: 'PROFESIONAL',
    academicRecords: [
      {
        id: 'acad-006-1',
        level: 'PROFESIONAL',
        degreeTitle: 'Ingeniería de Transportes y Vías',
        institution: 'Universidad Pedagógica y Tecnológica de Colombia (UPTC)',
        graduationDate: '2003-08-20',
        status: 'GRADUADO'
      }
    ],

    certifications: [
      {
        id: 'cert-006-1',
        title: 'Auditor Líder ISO 39001 (Sistemas de Gestión de Seguridad Vial)',
        entity: 'SGS Colombia',
        issueDate: '2024-06-18',
        status: 'VIGENTE'
      }
    ],

    licenses: [],

    digitalDocuments: [
      {
        id: 'doc-006-1',
        type: 'HOJA_DE_VIDA',
        title: 'Hoja de Vida Director Operaciones',
        fileName: 'HV_Carlos_Mendoza_2026.pdf',
        fileSize: '1.3 MB',
        uploadedAt: '2026-01-14',
        status: 'VIGENTE',
        uploadedBy: 'Talento Humano'
      }
    ],

    inductions: [
      {
        id: 'ind-006-1',
        type: 'REINDUCCION',
        date: '2026-01-16',
        evaluationScore: 96,
        approved: true,
        trainerName: 'Marcela Rincón Ortiz'
      }
    ],

    trainings: [
      {
        id: 'trn-006-1',
        trainingTitle: 'Protocolos de Actuación ante Siniestros Viales Graves',
        date: '2026-02-05',
        hours: 4,
        trainingType: 'PESV',
        trainerName: 'Policía de Tránsito y Transporte',
        attendanceVerified: true,
        score: 100,
        approved: true
      }
    ],

    eppDeliveries: [
      {
        id: 'epp-006-1',
        date: '2026-01-20',
        elementName: 'Botas de Seguridad y Casco de Operaciones',
        category: 'PROTECCION_PIES',
        quantity: 1,
        deliveryReason: 'PERIODICA',
        signedReceipt: true,
        deliveredBy: 'Almacén Fontibón'
      }
    ],

    committeeParticipations: [
      {
        id: 'com-006-1',
        committeeType: 'COPASST',
        role: 'PRESIDENTE',
        representedParty: 'EMPLEADOR',
        periodStart: '2025-06-01',
        periodEnd: '2027-05-31',
        isActive: true,
        electionActNumber: 'ACTA-COPASST-2025-01'
      }
    ],

    occupationalExams: [
      {
        id: 'med-006-1',
        type: 'PERIODICO',
        date: '2025-07-22',
        medicalIps: 'Sanitas Ocupacional',
        concept: 'APTO',
        nextExamDate: '2026-07-22'
      }
    ],

    incidentParticipations: [],

    inspections: [],

    auditTrail: [
      {
        id: 'aud-006-1',
        timestamp: '2019-04-01 08:00:00',
        userName: 'Talento Humano',
        action: 'CREACION',
        reason: 'Ingreso a la empresa.'
      }
    ],

    createdAt: '2019-04-01',
    updatedAt: '2026-02-05'
  }
];
