'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
  SstHazardItem,
  ModuleType,
  AuditChecklistStatus,
  AcpmStatus
} from '@/types';
import {
  initialOrganization,
  initialSharedAssets,
  initialFindings,
  initialAcpmActions,
  initialEvidences,
  initialTasks,
  initialAudits,
  initialGhgRecords,
  initialPesvVehicles,
  initialPesvDrivers,
  initialPgirsRecords,
  initialSstHazards
} from './mock-data';

interface AppContextType {
  // Organization
  organization: Organization;
  updateOrganization: (org: Partial<Organization>) => void;
  toggleModule: (module: ModuleType) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Shared Assets (Principio: Un dato -> Múltiples usos)
  assets: SharedAsset[];
  addAsset: (asset: Omit<SharedAsset, 'id'>) => void;

  // Findings (Motor Central de Hallazgos)
  findings: Finding[];
  addFinding: (finding: Omit<Finding, 'id' | 'code' | 'createdAt'>, sendDirectToAcpm?: boolean) => string;

  // ACPM (Matriz Central ACPM)
  acpmActions: AcpmAction[];
  updateAcpmStatus: (id: string, newStatus: AcpmStatus, comment?: string) => void;
  addAcpmRootCause: (id: string, method: '5_WHY' | 'ISHIKAWA' | 'ARBOL_CAUSAS', causes: string[]) => void;
  attachEvidenceToAcpm: (acpmId: string, evidenceId: string) => void;
  verifyAcpmEfficacy: (acpmId: string, result: 'EFICAZ' | 'NO_EFICAZ', notes: string, verifierName: string) => void;
  createManualAcpm: (action: Omit<AcpmAction, 'id' | 'code' | 'history'>) => void;

  // Evidences (Motor Polimórfico Central)
  evidences: Evidence[];
  addEvidence: (evidence: Omit<Evidence, 'id' | 'uploadedAt' | 'linkedEntityCount'>) => Evidence;

  // Tasks (Centro "¿Qué tengo pendiente?")
  tasks: Task[];
  toggleTaskStatus: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;

  // Audits (Auditoría Inteligente Transversal)
  audits: Audit[];
  updateAuditChecklistItem: (auditId: string, itemId: string, status: AuditChecklistStatus, notes: string) => void;
  generateFindingFromAuditItem: (auditId: string, itemId: string, findingData: Partial<Finding>) => void;

  // Environmental & Huella de Carbono
  ghgRecords: GhgEmissionRecord[];
  addGhgRecord: (record: Omit<GhgEmissionRecord, 'id' | 'totalKgCO2eq'>) => void;
  pgirsRecords: PgirsRecord[];
  addPgirsRecord: (record: Omit<PgirsRecord, 'id'>) => void;

  // PESV
  pesvVehicles: PesvVehicle[];
  pesvDrivers: PesvDriver[];
  addPesvVehicle: (vehicle: Omit<PesvVehicle, 'id'>) => void;
  addPesvDriver: (driver: Omit<PesvDriver, 'id'>) => void;

  // SST
  sstHazards: SstHazardItem[];
  addSstHazard: (hazard: Omit<SstHazardItem, 'id'>) => void;

  // Global search & filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Notifications
  notification: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [organization, setOrganization] = useState<Organization>(initialOrganization);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [assets, setAssets] = useState<SharedAsset[]>(initialSharedAssets);
  const [findings, setFindings] = useState<Finding[]>(initialFindings);
  const [acpmActions, setAcpmActions] = useState<AcpmAction[]>(initialAcpmActions);
  const [evidences, setEvidences] = useState<Evidence[]>(initialEvidences);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [audits, setAudits] = useState<Audit[]>(initialAudits);
  const [ghgRecords, setGhgRecords] = useState<GhgEmissionRecord[]>(initialGhgRecords);
  const [pesvVehicles, setPesvVehicles] = useState<PesvVehicle[]>(initialPesvVehicles);
  const [pesvDrivers, setPesvDrivers] = useState<PesvDriver[]>(initialPesvDrivers);
  const [pgirsRecords, setPgirsRecords] = useState<PgirsRecord[]>(initialPgirsRecords);
  const [sstHazards, setSstHazards] = useState<SstHazardItem[]>(initialSstHazards);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const updateOrganization = (newValues: Partial<Organization>) => {
    setOrganization(prev => ({ ...prev, ...newValues }));
    showNotification('Caracterización empresarial actualizada satisfactoriamente');
  };

  const toggleModule = (module: ModuleType) => {
    setOrganization(prev => {
      const exists = prev.activeModules.includes(module);
      const updated = exists 
        ? prev.activeModules.filter(m => m !== module)
        : [...prev.activeModules, module];
      return { ...prev, activeModules: updated };
    });
    showNotification(`Módulo ${module} ${organization.activeModules.includes(module) ? 'desactivado' : 'activado'}`);
  };

  const addAsset = (assetData: Omit<SharedAsset, 'id'>) => {
    const newAsset: SharedAsset = {
      ...assetData,
      id: `asset-${Date.now()}`
    };
    setAssets(prev => [newAsset, ...prev]);
    showNotification(`Activo ${newAsset.code} registrado. Ahora está disponible en todos los módulos.`);
  };

  // Motor Central de Hallazgos -> Viaja automáticamente a ACPM si se requiere
  const addFinding = (findingData: Omit<Finding, 'id' | 'code' | 'createdAt'>, sendDirectToAcpm = true): string => {
    const findingId = `find-${Date.now()}`;
    const findingCode = `H-${findingData.originModule}-${String(findings.length + 1).padStart(3, '0')}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    let linkedAcpmId: string | undefined = undefined;

    if (sendDirectToAcpm) {
      linkedAcpmId = `acpm-${Date.now()}`;
      const newAcpm: AcpmAction = {
        id: linkedAcpmId,
        code: `ACPM-${new Date().getFullYear()}-${String(acpmActions.length + 1).padStart(3, '0')}`,
        findingId: findingId,
        findingCode: findingCode,
        title: `Gestión de acción para: ${findingData.title}`,
        originModule: findingData.originModule,
        associatedRequirement: findingData.legalCriterion || 'Requisito del Sistema Integrado',
        causeAnalysisMethod: '5_WHY',
        rootCauses: ['Pendiente de análisis por el equipo de gestión'],
        immediateAction: 'Mitigación y aseguramiento del área o proceso involucrado',
        correctiveAction: 'Definición de plan de acción para eliminar causa raíz',
        responsibleName: 'Responsable de Proceso Asignado',
        responsibleEmail: 'hseq@andina.com.co',
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        priority: findingData.severity === 'CRITICA' ? 'ALTA' : 'MEDIA',
        status: 'ABIERTA',
        evidences: [],
        history: [
          {
            id: `h-${Date.now()}`,
            timestamp,
            userName: findingData.reportedBy,
            action: `Acción ACPM generada automáticamente desde ${findingData.originType} (${findingData.originModule})`,
            newState: 'ABIERTA'
          }
        ]
      };
      setAcpmActions(prev => [newAcpm, ...prev]);

      // Agregar automáticamente tarea al centro "¿Qué tengo pendiente?"
      setTasks(prev => [
        {
          id: `task-${Date.now()}`,
          title: `Diligenciar Análisis de Causa Raíz para ${newAcpm.code}`,
          module: findingData.originModule,
          type: 'ACPM',
          dueDate: newAcpm.dueDate,
          responsible: newAcpm.responsibleName,
          priority: newAcpm.priority === 'ALTA' ? 'CRITICA' : 'ALTA',
          status: 'PENDIENTE',
          linkedId: newAcpm.id,
          siteName: findingData.siteName
        },
        ...prev
      ]);
    }

    const newFinding: Finding = {
      ...findingData,
      id: findingId,
      code: findingCode,
      createdAt: timestamp,
      status: sendDirectToAcpm ? 'EN_ACPM' : 'ABIERTO',
      linkedAcpmId
    };

    setFindings(prev => [newFinding, ...prev]);
    showNotification(`Hallazgo ${findingCode} registrado ${sendDirectToAcpm ? 'y transferido automáticamente a la Matriz ACPM' : ''}`);
    return findingId;
  };

  const updateAcpmStatus = (id: string, newStatus: AcpmStatus, comment?: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setAcpmActions(prev => prev.map(acpm => {
      if (acpm.id !== id) return acpm;
      const historyEntry = {
        id: `h-${Date.now()}`,
        timestamp,
        userName: 'Usuario Autorizado',
        action: `Cambio de estado a ${newStatus}`,
        previousState: acpm.status,
        newState: newStatus,
        comment
      };
      return {
        ...acpm,
        status: newStatus,
        history: [...acpm.history, historyEntry]
      };
    }));
    showNotification(`Estado de acción ACPM actualizado a: ${newStatus}`);
  };

  const addAcpmRootCause = (id: string, method: '5_WHY' | 'ISHIKAWA' | 'ARBOL_CAUSAS', causes: string[]) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setAcpmActions(prev => prev.map(acpm => {
      if (acpm.id !== id) return acpm;
      return {
        ...acpm,
        causeAnalysisMethod: method,
        rootCauses: causes,
        status: acpm.status === 'ABIERTA' ? 'EN_EJECUCION' : acpm.status,
        history: [
          ...acpm.history,
          {
            id: `h-${Date.now()}`,
            timestamp,
            userName: 'Equipo Investigador',
            action: `Análisis de causa raíz registrado utilizando método ${method}`,
            comment: causes.join(' | ')
          }
        ]
      };
    }));
    showNotification('Análisis de causa raíz guardado satisfactoriamente');
  };

  const attachEvidenceToAcpm = (acpmId: string, evidenceId: string) => {
    const evidence = evidences.find(e => e.id === evidenceId);
    if (!evidence) return;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setAcpmActions(prev => prev.map(acpm => {
      if (acpm.id !== acpmId) return acpm;
      const exists = acpm.evidences.some(e => e.id === evidenceId);
      if (exists) return acpm;
      return {
        ...acpm,
        evidences: [...acpm.evidences, evidence],
        status: acpm.status === 'EN_EJECUCION' || acpm.status === 'PENDIENTE_EVIDENCIA' ? 'PENDIENTE_VERIFICACION' : acpm.status,
        history: [
          ...acpm.history,
          {
            id: `h-${Date.now()}`,
            timestamp,
            userName: 'Responsable de Acción',
            action: `Evidencia vinculada: ${evidence.title}. Pasa a estado PENDIENTE DE VERIFICACIÓN.`,
            previousState: acpm.status,
            newState: 'PENDIENTE_VERIFICACION'
          }
        ]
      };
    }));
    showNotification('Evidencia asociada a la acción ACPM');
  };

  // Verificación de eficacia profesional: no se cierra solo con cambiar de estado
  const verifyAcpmEfficacy = (acpmId: string, result: 'EFICAZ' | 'NO_EFICAZ', notes: string, verifierName: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newStatus: AcpmStatus = result === 'EFICAZ' ? 'CERRADA' : 'REABIERTA';

    setAcpmActions(prev => prev.map(acpm => {
      if (acpm.id !== acpmId) return acpm;
      return {
        ...acpm,
        status: newStatus,
        verificationResult: result,
        verificationNotes: notes,
        verifiedAt: timestamp,
        verifiedBy: verifierName,
        history: [
          ...acpm.history,
          {
            id: `h-${Date.now()}`,
            timestamp,
            userName: verifierName,
            action: result === 'EFICAZ' 
              ? 'Verificación de eficacia: EFICAZ. Se certifica el cierre formal del ciclo.' 
              : 'Verificación de eficacia: NO EFICAZ. Se reabre la acción para nuevo análisis de causa.',
            previousState: acpm.status,
            newState: newStatus,
            comment: notes
          }
        ]
      };
    }));

    // Si fue eficaz, actualizar estado del hallazgo de origen
    const targetAcpm = acpmActions.find(a => a.id === acpmId);
    if (targetAcpm) {
      setFindings(prev => prev.map(f => {
        if (f.id === targetAcpm.findingId) {
          return { ...f, status: result === 'EFICAZ' ? 'RESUELTO' : 'EN_ACPM' };
        }
        return f;
      }));
    }

    showNotification(
      result === 'EFICAZ' 
        ? '¡Acción verificada como EFICAZ y formalmente CERRADA con evidencia!' 
        : 'Acción calificada como NO EFICAZ y REABIERTA para investigación.',
      result === 'EFICAZ' ? 'success' : 'warning'
    );
  };

  const createManualAcpm = (actionData: Omit<AcpmAction, 'id' | 'code' | 'history'>) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const code = `ACPM-${new Date().getFullYear()}-${String(acpmActions.length + 1).padStart(3, '0')}`;
    const newAction: AcpmAction = {
      ...actionData,
      id: `acpm-${Date.now()}`,
      code,
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp,
          userName: 'Administrador HSEQ',
          action: 'Acción preventiva/correctiva creada manualmente',
          newState: actionData.status
        }
      ]
    };
    setAcpmActions(prev => [newAction, ...prev]);
    showNotification(`Acción ${code} creada exitosamente`);
  };

  const addEvidence = (evidenceData: Omit<Evidence, 'id' | 'uploadedAt' | 'linkedEntityCount'>): Evidence => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newEvidence: Evidence = {
      ...evidenceData,
      id: `evi-${Date.now()}`,
      uploadedAt: timestamp,
      linkedEntityCount: 1
    };
    setEvidences(prev => [newEvidence, ...prev]);
    showNotification(`Evidencia "${newEvidence.title}" almacenada en el Motor Central`);
    return newEvidence;
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const nextStatus = t.status === 'COMPLETADA' ? 'PENDIENTE' : 'COMPLETADA';
      return { ...t, status: nextStatus };
    }));
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
    showNotification(`Tarea agregada al centro "¿Qué tengo pendiente?": ${newTask.title}`);
  };

  const updateAuditChecklistItem = (auditId: string, itemId: string, status: AuditChecklistStatus, notes: string) => {
    setAudits(prev => prev.map(a => {
      if (a.id !== auditId) return a;
      const updatedChecklist = a.checklist.map(item => {
        if (item.id !== itemId) return item;
        return { ...item, status, auditorNotes: notes };
      });
      return { ...a, checklist: updatedChecklist };
    }));
  };

  const generateFindingFromAuditItem = (auditId: string, itemId: string, findingData: Partial<Finding>) => {
    const audit = audits.find(a => a.id === auditId);
    const item = audit?.checklist.find(i => i.id === itemId);
    if (!audit || !item) return;

    const findingId = addFinding({
      title: findingData.title || `Desviación en ${item.requirementCode}`,
      originModule: (audit.module === 'INTEGRADO' ? 'ISO_9001' : audit.module) as ModuleType,
      originType: 'AUDIT',
      originDetail: `Auditoría ${audit.code} - ${audit.title}`,
      siteName: organization.sites[0]?.name || 'Sede Principal',
      processName: 'Gestión HSEQ',
      description: findingData.description || item.auditorNotes || 'No conformidad detectada durante la auditoría.',
      legalCriterion: item.requirementCode + ' ' + item.standard,
      severity: findingData.severity || 'MAYOR',
      status: 'EN_ACPM',
      reportedBy: audit.leadAuditor
    }, true);

    // Enlazar el ID generado de vuelta al ítem del checklist
    setAudits(prev => prev.map(a => {
      if (a.id !== auditId) return a;
      return {
        ...a,
        findingsGeneratedCount: a.findingsGeneratedCount + 1,
        checklist: a.checklist.map(i => i.id === itemId ? { ...i, findingGeneratedId: findingId, status: 'NO_CONFORME' } : i)
      };
    }));
  };

  const addGhgRecord = (recordData: Omit<GhgEmissionRecord, 'id' | 'totalKgCO2eq'>) => {
    const totalKgCO2eq = Number((recordData.consumptionValue * recordData.emissionFactor).toFixed(2));
    const newRecord: GhgEmissionRecord = {
      ...recordData,
      id: `ghg-${Date.now()}`,
      totalKgCO2eq
    };
    setGhgRecords(prev => [newRecord, ...prev]);
    showNotification(`Consumo registrado en Huella de Carbono: +${totalKgCO2eq.toLocaleString()} kg CO₂eq`);
  };

  const addPgirsRecord = (recordData: Omit<PgirsRecord, 'id'>) => {
    const newRecord: PgirsRecord = {
      ...recordData,
      id: `pg-${Date.now()}`
    };
    setPgirsRecords(prev => [newRecord, ...prev]);
    showNotification(`Pesaje de residuo ${newRecord.wasteName} registrado (+${newRecord.weightKg} kg)`);
  };

  const addPesvVehicle = (vehicleData: Omit<PesvVehicle, 'id'>) => {
    const newVehicle: PesvVehicle = {
      ...vehicleData,
      id: `v-${Date.now()}`
    };
    setPesvVehicles(prev => [newVehicle, ...prev]);
    showNotification(`Vehículo ${newVehicle.plate} registrado en la flota PESV`);
  };

  const addPesvDriver = (driverData: Omit<PesvDriver, 'id'>) => {
    const newDriver: PesvDriver = {
      ...driverData,
      id: `d-${Date.now()}`
    };
    setPesvDrivers(prev => [newDriver, ...prev]);
    showNotification(`Conductor ${newDriver.fullName} registrado en el PESV`);
  };

  const addSstHazard = (hazardData: Omit<SstHazardItem, 'id'>) => {
    const newHazard: SstHazardItem = {
      ...hazardData,
      id: `haz-${Date.now()}`
    };
    setSstHazards(prev => [newHazard, ...prev]);
    showNotification(`Peligro GTC 45 registrado para el proceso ${newHazard.process}`);
  };

  return (
    <AppContext.Provider
      value={{
        organization,
        updateOrganization,
        toggleModule,
        activeTab,
        setActiveTab,
        assets,
        addAsset,
        findings,
        addFinding,
        acpmActions,
        updateAcpmStatus,
        addAcpmRootCause,
        attachEvidenceToAcpm,
        verifyAcpmEfficacy,
        createManualAcpm,
        evidences,
        addEvidence,
        tasks,
        toggleTaskStatus,
        addTask,
        audits,
        updateAuditChecklistItem,
        generateFindingFromAuditItem,
        ghgRecords,
        addGhgRecord,
        pgirsRecords,
        addPgirsRecord,
        pesvVehicles,
        pesvDrivers,
        addPesvVehicle,
        addPesvDriver,
        sstHazards,
        addSstHazard,
        searchQuery,
        setSearchQuery,
        notification,
        showNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
