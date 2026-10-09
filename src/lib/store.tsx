'use client';

import { useAuth } from './auth';
import { clearDraft, loadDraft, saveDraft } from './characterization-draft';
import { hasEnvironmentalCore, huellaCarbonoEnPlan, isTabOutsidePlan, MODULE_LABELS, planName, tabModuleLabel } from './plan-rules';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  AcpmStatus,
  SstStandardDefinition,
  SstStandardStatus,
  SstResponsibleProfile,
  SstBudgetItem,
  SstBudgetState,
  SimulatedRole,
  DigitalSignatureInfo,
  CopasstBudgetReview,
  CompanyCharacterization,
  ValidationDecision,
  CharacterizationVersion,
  ModuleEvaluation,
  RequirementEvaluation,
  CommercialProposal,
  ApplicabilityStatus,
  PortalView,
  ActivationEmailData,
  MasterWorker,
  WorkerLaborHistoryEntry,
  WorkerDigitalDocument,
  WorkerEppDeliveryRecord,
  WorkerTrainingRecord,
  WorkerCommitteeParticipation,
  WorkerOccupationalExam,
  WorkerAuditEntry,
  PilaPayrollRecord,
  CopasstGlobalState,
  VigiaProfile,
  VigiaActuation,
  CopasstMember,
  CopasstCandidate,
  CopasstMeeting,
  CopasstMeetingCommitment,
  CopasstFindingItem,
  CopasstTrainingCourse,
  CopasstMechanismType,
  CclGlobalState,
  CclComplaintCase,
  CclComplaintStatus,
  CclCommitmentItem,
  CclHearingRecord,
  CclFollowUpRecord,
  CclMeeting,
  CclEvidenceAttachment
} from '@/types';
import { initialPilaRecords } from './mock-pila-data';
import { initialCopasstGlobalState } from './copasst-mock-data';
import { initialCclGlobalState } from './ccl-mock-data';
import { initialMasterWorkers } from './worker-mock-data';
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
import {
  master60Standards,
  initialSstResponsible,
  initialSstBudgetItems,
  initialSstBudgetState
} from './sst-standards-data';
import {
  defaultCompanyCharacterization,
  characterizationArchetypes,
  initialValidationDecisions,
  initialCharacterizationHistory
} from './characterization-mock';
import {
  extractStructuredVariables,
  calculateSstStandardsCount,
  withDerivedValues,
  calculatePesvLevel,
  evaluateApplicability,
  detectCharacterizationDiffs
} from './applicability-engine';

interface AppContextType {
  // Caracterización Inteligente & Motor de Aplicabilidad
  characterization: CompanyCharacterization;
  applicabilityProfile: {
    evaluations: ModuleEvaluation[];
    allRequirements: RequirementEvaluation[];
    proposal: CommercialProposal;
  };
  validationDecisions: ValidationDecision[];
  characterizationHistory: CharacterizationVersion[];
  updateCharacterization: (newValues: Partial<CompanyCharacterization>, author?: string, reason?: string) => void;
  applyCharacterizationToPlatform: (selectedModules: ModuleType[]) => void;
  addValidationDecision: (decision: Omit<ValidationDecision, 'id' | 'timestamp'>) => void;
  loadCharacterizationArchetype: (archetypeId: string) => void;
  isCharacterizationWizardOpen: boolean;
  setIsCharacterizationWizardOpen: (open: boolean) => void;
  activeWizardStep: number;
  setActiveWizardStep: (step: number) => void;

  // Borrador de la caracterización (guardado automático en el navegador)
  draftSavedAt: string | null;
  /** Cambia cuando se restaura o reinicia el borrador, para que el cuestionario se resincronice. */
  draftVersion: number;
  restoredDraftStep: number | null;
  saveWizardModules: (modules: ModuleType[]) => void;
  resetCharacterizationDraft: () => void;

  // Portal View (Página Principal / Landing / Wizard / Demo / App)
  portalView: PortalView;
  setPortalView: (view: PortalView) => void;

  // Checkout & Correo de Activación con Credenciales
  lastActivationEmail: ActivationEmailData | null;
  sendActivationEmail: (data: ActivationEmailData) => void;
  isEmailModalOpen: boolean;
  setIsEmailModalOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;

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

  // SST (Resolución 0312 / Decreto 1072 - 60 Estándares)
  sstHazards: SstHazardItem[];
  addSstHazard: (hazard: Omit<SstHazardItem, 'id'>) => void;
  sstStandards: SstStandardDefinition[];
  updateStandardStatus: (standardId: string, status: SstStandardStatus, notes?: string) => void;
  attachEvidenceToStandard: (standardId: string, evidenceId: string) => void;
  sstResponsible: SstResponsibleProfile;
  updateSstResponsible: (profile: Partial<SstResponsibleProfile>) => void;
  sstBudgetItems: SstBudgetItem[];
  addSstBudgetItem: (item: Omit<SstBudgetItem, 'id'>) => void;
  updateSstBudgetItem: (id: string, item: Partial<SstBudgetItem>) => void;
  deleteSstBudgetItem: (id: string) => void;
  sstBudgetState: SstBudgetState;
  updateSstBudgetApproval: (status: SstBudgetState['status'], comment?: string, role?: SimulatedRole, userName?: string) => void;
  flagBudgetItemObservation: (itemId: string, comment: string) => void;
  resolveBudgetItemObservation: (itemId: string) => void;
  signBudgetParty: (party: 'manager' | 'financial' | 'sstLeader', signerData: DigitalSignatureInfo) => void;
  addCopasstBudgetReview: (review: Omit<CopasstBudgetReview, 'id' | 'timestamp'>) => void;
  updateFinancialOfficerConfig: (title: string, name: string, doc: string) => void;
  currentSimulatedRole: SimulatedRole;
  setCurrentSimulatedRole: (role: SimulatedRole) => void;

  // Base Maestra de Trabajadores (Expediente Digital Transversal 360°)
  workers: MasterWorker[];
  addWorker: (
    workerData: Omit<MasterWorker, 'id' | 'createdAt' | 'updatedAt' | 'auditTrail' | 'laborHistory'> & { initialLaborNotes?: string },
    userName?: string
  ) => MasterWorker;
  updateWorker: (id: string, updates: Partial<MasterWorker>, reason?: string, userName?: string) => void;
  recordLaborChange: (
    workerId: string,
    entry: Omit<WorkerLaborHistoryEntry, 'id' | 'registeredBy'>,
    userName?: string
  ) => void;
  addWorkerDocument: (
    workerId: string,
    doc: Omit<WorkerDigitalDocument, 'id' | 'uploadedAt' | 'status'>,
    userName?: string
  ) => void;
  recordEppDelivery: (
    workerId: string,
    delivery: Omit<WorkerEppDeliveryRecord, 'id'>,
    userName?: string
  ) => void;
  recordTrainingAttendance: (
    workerId: string,
    training: Omit<WorkerTrainingRecord, 'id'>,
    userName?: string
  ) => void;
  recordCommitteeAssignment: (
    workerId: string,
    committee: Omit<WorkerCommitteeParticipation, 'id'>,
    userName?: string
  ) => void;
  recordOccupationalExam: (
    workerId: string,
    exam: Omit<WorkerOccupationalExam, 'id'>,
    userName?: string
  ) => void;
  deleteWorker: (id: string, reason?: string, userName?: string) => void;
  getWorkerById: (id: string) => MasterWorker | undefined;
  getWorkerByDoc: (docNumber: string) => MasterWorker | undefined;
  assignWorkerAsSstResponsible: (workerId: string) => void;

  // Seguridad Social & Planillas PILA (Estándares 1.1.4 y 1.1.5)
  pilaRecords: PilaPayrollRecord[];
  addPilaRecord: (record: Omit<PilaPayrollRecord, 'id' | 'uploadedAt'>) => PilaPayrollRecord;
  deletePilaRecord: (id: string) => void;

  // COPASST / Vigía de SST (Estándares 1.1.6 y 1.1.7 - Dec. 1072 / Res. 0312 / Res. 2013)
  copasstState: CopasstGlobalState;
  setCopasstMechanism: (mechanism: CopasstMechanismType) => void;
  updateVigiaProfile: (profile: Partial<VigiaProfile>) => void;
  addVigiaActuation: (actuation: Omit<VigiaActuation, 'id' | 'registeredBy'>) => void;
  registerCopasstCandidate: (workerId: string, proposalBrief?: string) => void;
  castCopasstVote: (voterDocNumber: string, candidateId: string) => { success: boolean; message: string };
  closeCopasstElection: () => void;
  setEmployerRepresentatives: (principalWorkerId: string, suplenteWorkerId?: string) => void;
  saveCopasstConformationAct: (actNumber: string, actDate: string) => void;
  saveCopasstInstallationAct: (presidentWorkerId: string, secretaryWorkerId: string, date: string) => void;
  addCopasstMeeting: (meeting: Omit<CopasstMeeting, 'id' | 'actaCode'>) => CopasstMeeting;
  updateCopasstMeeting: (meetingId: string, updatedData: Partial<CopasstMeeting>) => void;
  signMeetingMember: (meetingId: string, workerId: string) => void;
  signMeetingAllMembers: (meetingId: string) => void;
  uploadScannedMeetingAct: (meetingId: string, fileData: { fileName: string; fileBase64: string; fileSize: string }) => void;
  updateCopasstDocumentNotes: (docType: 'CONFORMATION' | 'INSTALLATION' | 'ELECTION' | 'VIGIA', notes: string) => void;
  toggleCopasstCommitmentStatus: (commitmentId: string, newStatus: CopasstMeetingCommitment['status']) => void;
  createCopasstFinding: (finding: Omit<CopasstFindingItem, 'id' | 'status' | 'sentToAcpm'>, sendDirectToAcpm?: boolean) => void;
  addCopasstTraining: (training: Omit<CopasstTrainingCourse, 'id'>) => void;

  // Comité de Convivencia Laboral - CCL (Estándar 1.1.8 - Resolución 3461 de 2025)
  cclState: CclGlobalState;
  registerCclComplaint: (complaintData: {
    channel: CclComplaintCase['channel'];
    complainantWorkerId: string;
    respondentWorkerId: string;
    witnessesText?: string;
    incidentDates: string;
    incidentLocation: string;
    factsDescription: string;
    evidences?: CclEvidenceAttachment[];
  }) => CclComplaintCase;
  updateCclComplaintStage: (caseId: string, newStage: CclComplaintStatus, notes?: string, nextDueDate?: string) => void;
  recordCclHearing: (caseId: string, party: 'complainant' | 'respondent', hearingData: CclHearingRecord) => void;
  recordCclDialogueSession: (caseId: string, sessionData: { date: string; attendees: string[]; summary: string; agreementReached: boolean; actCode?: string }) => void;
  addCclCommitment: (caseId: string, commitment: Omit<CclCommitmentItem, 'id' | 'status'>) => void;
  toggleCclCommitmentStatus: (caseId: string, commitmentId: string, newStatus: CclCommitmentItem['status']) => void;
  addCclFollowUp: (caseId: string, followUp: Omit<CclFollowUpRecord, 'id'>) => void;
  closeCclComplaint: (caseId: string, closureData: { reason: NonNullable<CclComplaintCase['closure']>['closureReason']; summary: string; generateAcpmAction?: boolean; acpmDescription?: string }) => void;
  registerCclCandidate: (workerId: string, proposalBrief?: string) => { success: boolean; message: string };
  castCclVote: (voterDocNumber: string, candidateId: string) => { success: boolean; message: string };
  closeCclElection: () => void;
  setEmployerCclRepresentatives: (principalWorkerId: string, alternateWorkerId: string) => void;
  signCclConfidentiality: (workerId: string) => void;
  signCclMeetingMember: (meetingId: string, workerId: string) => void;
  signCclMeetingAllMembers: (meetingId: string) => void;
  uploadScannedCclMeetingAct: (meetingId: string, fileData: { fileName: string; fileBase64: string; fileSize: string }) => void;
  addCclMeeting: (meeting: Omit<CclMeeting, 'id' | 'actaCode' | 'membersSignatures' | 'isClosed'>) => CclMeeting;
  updateCclMeeting: (meetingId: string, updatedData: Partial<CclMeeting>) => void;
  updateCclRegulation: (newText: string) => void;
  updateCclDocumentNotes: (docType: string, notes: string) => void;

  // Global search & filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Notifications
  notification: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Demo accounts (Portal Clientes): a few actions and some locked sections, then an invitation to hire AGAE.
  const { isDemo, consumeDemoAction, isTabLocked, openUpsell } = useAuth();
  // Also blocks changes inside modules that are not part of the contracted plan (they are shown as a preview).
  const blockedByDemo = () => {
    if (isTabOutsidePlan(activeTab, organization.activeModules)) {
      openUpsell(`El módulo ${tabModuleLabel(activeTab)} no está incluido en tu ${planName(organization.activeModules)}. Puedes explorarlo como demostración.`);
      return true;
    }
    return isDemo && !consumeDemoAction();
  };
  const guardedSetActiveTab = (tab: string) => {
    if (isTabLocked(tab)) openUpsell('Esta sección está disponible para clientes de AGAE SOLUTIONS.');
    else setActiveTab(tab);
  };

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
  const [workers, setWorkers] = useState<MasterWorker[]>(initialMasterWorkers);
  const [pgirsRecords, setPgirsRecords] = useState<PgirsRecord[]>(initialPgirsRecords);
  const [sstHazards, setSstHazards] = useState<SstHazardItem[]>(initialSstHazards);
  const [sstStandards, setSstStandards] = useState<SstStandardDefinition[]>(master60Standards);
  const [sstResponsible, setSstResponsible] = useState<SstResponsibleProfile>(initialSstResponsible);
  const [sstBudgetItems, setSstBudgetItems] = useState<SstBudgetItem[]>(initialSstBudgetItems);
  const [sstBudgetState, setSstBudgetState] = useState<SstBudgetState>(initialSstBudgetState);
  const [currentSimulatedRole, setCurrentSimulatedRole] = useState<SimulatedRole>('LIDER_SST');
  
  // Seguridad Social & Planillas PILA (Estándares 1.1.4 y 1.1.5)
  const [pilaRecords, setPilaRecords] = useState<PilaPayrollRecord[]>(initialPilaRecords);

  // COPASST o Vigía de SST (Estándares 1.1.6 y 1.1.7)
  const [copasstState, setCopasstState] = useState<CopasstGlobalState>(initialCopasstGlobalState);

  // Comité de Convivencia Laboral - CCL (Estándar 1.1.8 - Resolución 3461 de 2025)
  const [cclState, setCclState] = useState<CclGlobalState>(initialCclGlobalState);
  // Caracterización Inteligente & Motor de Aplicabilidad
  // Saved draft (browser only). The public landing does not render characterization data, so there is no hydration mismatch.
  const [initialDraft] = useState(() => (typeof window === 'undefined' ? null : loadDraft()));
  const [characterization, setCharacterization] = useState<CompanyCharacterization>(() =>
    initialDraft ? withDerivedValues({ ...defaultCompanyCharacterization, ...initialDraft.characterization }) : defaultCompanyCharacterization
  );
  const [applicabilityProfile, setApplicabilityProfile] = useState(() => evaluateApplicability(characterization));
  const [validationDecisions, setValidationDecisions] = useState<ValidationDecision[]>(initialValidationDecisions);
  const [characterizationHistory, setCharacterizationHistory] = useState<CharacterizationVersion[]>(initialCharacterizationHistory);
  const [isCharacterizationWizardOpen, setIsCharacterizationWizardOpen] = useState(false);
  const [activeWizardStep, setActiveWizardStep] = useState(initialDraft?.step || 1);

  // --- Characterization draft: autosave every change ---
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(initialDraft?.savedAt ?? null);
  const [draftVersion, setDraftVersion] = useState(0);
  const [restoredDraftStep, setRestoredDraftStep] = useState<number | null>(initialDraft ? initialDraft.step || 1 : null);
  const draftReady = useRef(typeof window !== 'undefined');

  useEffect(() => {
    if (!draftReady.current) return;
    const t = setTimeout(() => {
      const savedAt = saveDraft({ characterization, step: activeWizardStep });
      if (savedAt) setDraftSavedAt(savedAt);
    }, 400);
    return () => clearTimeout(t);
  }, [characterization, activeWizardStep]);

  const saveWizardModules = (modules: ModuleType[]) => {
    if (draftReady.current) saveDraft({ characterization, step: activeWizardStep, selectedModules: modules });
  };

  const resetCharacterizationDraft = () => {
    clearDraft();
    setCharacterization(defaultCompanyCharacterization);
    setApplicabilityProfile(evaluateApplicability(defaultCompanyCharacterization));
    setActiveWizardStep(1);
    setRestoredDraftStep(null);
    setDraftSavedAt(null);
    setDraftVersion(v => v + 1);
  };

  // Portal View (Página Principal / Landing / Wizard / Demo / App)
  const [portalView, setPortalView] = useState<PortalView>('landing');
  const [lastActivationEmail, setLastActivationEmail] = useState<ActivationEmailData | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const sendActivationEmail = (data: ActivationEmailData) => {
    setLastActivationEmail(data);
    setIsEmailModalOpen(true);
    showNotification(`✓ Credenciales generadas y enviadas a ${data.email}`, 'success');
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Motor de actualización de Caracterización y re-evaluación
  const updateCharacterization = (
    newValues: Partial<CompanyCharacterization>,
    author = 'Marcela Rincón (Líder HSEQ)',
    reason = 'Ajuste en variables de la caracterización'
  ) => {
    if (blockedByDemo()) return;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    setCharacterization(prev => {
      const merged: CompanyCharacterization = {
        ...prev,
        ...newValues,
        identification: { ...prev.identification, ...(newValues.identification || {}) },
        size: { ...prev.size, ...(newValues.size || {}) },
        operational: { ...prev.operational, ...(newValues.operational || {}) },
        highRisk: { ...prev.highRisk, ...(newValues.highRisk || {}) },
        workforceExposure: { ...prev.workforceExposure, ...(newValues.workforceExposure || {}) },
        sst: { ...prev.sst, ...(newValues.sst || {}) },
        environmental: { ...prev.environmental, ...(newValues.environmental || {}) },
        pesv: { ...prev.pesv, ...(newValues.pesv || {}) },
        iso: { ...prev.iso, ...(newValues.iso || {}) },
        sites: newValues.sites || prev.sites,
        lastUpdatedAt: timestamp
      };

      // Recalcular variables estructuradas
      Object.assign(merged, withDerivedValues(merged));

      // Re-evaluar motor de aplicabilidad
      const newEval = evaluateApplicability(merged);
      setApplicabilityProfile(newEval);

      // Detectar diferencias con la versión anterior para historial
      const diff = detectCharacterizationDiffs(prev.structuredVariables, merged.structuredVariables);
      if (diff.reEvaluationRequired) {
        const nextVersionNumber = prev.version + 1;
        merged.version = nextVersionNumber;

        const newVersionEntry: CharacterizationVersion = {
          version: nextVersionNumber,
          timestamp,
          author,
          reason,
          variablesSnapshot: merged.structuredVariables,
          impactedModules: diff.impactedModules,
          changesSummary: diff.changesSummary
        };

        setCharacterizationHistory(hPrev => [newVersionEntry, ...hPrev]);
      }

      return merged;
    });

    showNotification('Variables analizadas por el Motor de Aplicabilidad de AGAE');
  };

  // Transición posterior a la compra: La caracterización autoconfigura la plataforma sin volver a pedir datos
  const applyCharacterizationToPlatform = (selectedModules: ModuleType[]) => {
    if (blockedByDemo()) return;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // 1. Adaptar Organization general
    setOrganization(prev => ({
      ...prev,
      name: characterization.identification.razonSocial || prev.name,
      nit: characterization.identification.nit || prev.nit,
      ciiu: `${characterization.identification.codigoCiiu} - ${characterization.identification.actividadEconomicaPrincipal}`,
      economicActivity: characterization.identification.actividadEconomicaPrincipal,
      riskLevelArl: characterization.sst.claseRiesgoArl,
      employeeCount: characterization.size.totalTrabajadores,
      contractorCount: characterization.size.contratistas,
      sstStandardCount: characterization.calculatedSstStandards,
      pesvLevel: characterization.calculatedPesvLevel === 'NO_APLICA' ? 'BASICO' : characterization.calculatedPesvLevel,
      activeModules: selectedModules,
      huellaCarbonoHabilitada: huellaCarbonoEnPlan(selectedModules).habilitada,
      sites: characterization.sites.map(s => ({
        id: s.id,
        name: s.nombre,
        city: s.ciudad,
        address: s.ubicacion,
        workerCount: s.numeroTrabajadores
      }))
    }));

    // 2. Marcar caracterización como configurada
    setCharacterization(prev => ({
      ...prev,
      isPlatformConfigured: true,
      configuredAt: timestamp
    }));

    // 3. Generar tareas iniciales de habilitación en el centro "¿Qué tengo pendiente?"
    const newTasks: Task[] = [];
    if (selectedModules.includes('SST')) {
      newTasks.push({
        id: `task-onb-sst-${Date.now()}`,
        title: `Revisar y validar autoevaluación inicial de ${characterization.calculatedSstStandards} Estándares Mínimos (Res. 0312)`,
        module: 'SST',
        type: 'INSPECCION',
        dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
        responsible: 'Líder SG-SST',
        priority: 'CRITICA',
        status: 'PENDIENTE',
        siteName: characterization.sites[0]?.nombre || 'Sede Principal'
      });
    }

    if (selectedModules.includes('PESV') && characterization.pesv.utilizaVehiculosParaActividades) {
      newTasks.push({
        id: `task-onb-pesv-${Date.now()}`,
        title: `Cargar expedientes y certificados de idoneidad para ${characterization.pesv.detallesPesv?.numeroConductoresTotal || 0} conductores`,
        module: 'PESV',
        type: 'AUDITORIA',
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        responsible: 'Coordinador PESV',
        priority: 'ALTA',
        status: 'PENDIENTE',
        siteName: characterization.sites[0]?.nombre || 'Sede Principal'
      });
    }

    if (selectedModules.includes('ENVIRONMENTAL') && characterization.environmental.generaResiduosPeligrosos) {
      newTasks.push({
        id: `task-onb-env-${Date.now()}`,
        title: 'Verificar certificados de disposición final con gestor ambiental autorizado (RESPEL)',
        module: 'ENVIRONMENTAL',
        type: 'RESIDUOS',
        dueDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
        responsible: 'Responsable Ambiental',
        priority: 'ALTA',
        status: 'PENDIENTE',
        siteName: characterization.sites[0]?.nombre || 'Sede Principal'
      });
    }

    setTasks(prev => [...newTasks, ...prev]);

    showNotification(
      `✓ Plataforma AGAE configurada y adaptada exitosamente con base en la caracterización (${selectedModules.length} módulos habilitados).`,
      'success'
    );
  };

  // Registrar decisión formal de validación / No Aplicabilidad
  const addValidationDecision = (decisionData: Omit<ValidationDecision, 'id' | 'timestamp'>) => {
    if (blockedByDemo()) return;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newDecision: ValidationDecision = {
      ...decisionData,
      id: `val-dec-${Date.now()}`,
      timestamp
    };

    setValidationDecisions(prev => [newDecision, ...prev]);

    // Actualizar estado del requisito en el perfil de aplicabilidad
    setApplicabilityProfile(prev => ({
      ...prev,
      allRequirements: prev.allRequirements.map(req => {
        if (req.id !== decisionData.requirementId) return req;
        const newStatus: ApplicabilityStatus = decisionData.finalDecision === 'NO_APLICA' 
          ? 'NO_APLICA' 
          : decisionData.finalDecision === 'REQUIERE_REVISION'
          ? 'REQUIERE_VALIDACION'
          : 'APLICA';
        return {
          ...req,
          status: newStatus,
          reason: `${decisionData.justification} (Validado por ${decisionData.userName})`
        };
      })
    }));

    showNotification(`Decisión registrada para ${decisionData.requirementCode}: ${decisionData.finalDecision}`);
  };

  // Cargar arquetipo de prueba rápida
  const loadCharacterizationArchetype = (archetypeId: string) => {
    const found = characterizationArchetypes.find(a => a.id === archetypeId);
    if (!found) return;

    const base = defaultCompanyCharacterization;
    const merged: CompanyCharacterization = {
      ...base,
      ...found.template,
      identification: { ...base.identification, ...(found.template.identification || {}) },
      size: { ...base.size, ...(found.template.size || {}) },
      operational: { ...base.operational, ...(found.template.operational || {}) },
      highRisk: { ...base.highRisk, ...(found.template.highRisk || {}) },
      workforceExposure: { ...base.workforceExposure, ...(found.template.workforceExposure || {}) },
      sst: { ...base.sst, ...(found.template.sst || {}) },
      environmental: { ...base.environmental, ...(found.template.environmental || {}) },
      pesv: { ...base.pesv, ...(found.template.pesv || {}) },
      iso: { ...base.iso, ...(found.template.iso || {}) },
      sites: found.template.sites || base.sites,
      lastUpdatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    Object.assign(merged, withDerivedValues(merged));

    setCharacterization(merged);
    setApplicabilityProfile(evaluateApplicability(merged));

    showNotification(`Arquetipo cargado: ${found.name}`);
  };

  const updateOrganization = (newValues: Partial<Organization>) => {
    if (blockedByDemo()) return;
    setOrganization(prev => ({ ...prev, ...newValues }));
    showNotification('Caracterización empresarial actualizada satisfactoriamente');
  };

  // Modules come from the contracted plan: clients cannot switch them on or off themselves.
  const toggleModule = (module: ModuleType) => {
    if (organization.activeModules.includes(module)) {
      showNotification('Para retirar un módulo de tu plan comunícate con AGAE SOLUTIONS.', 'info');
    } else {
      openUpsell(`El módulo ${MODULE_LABELS[module]} no está incluido en tu ${planName(organization.activeModules)}.`);
    }
  };

  const addAsset = (assetData: Omit<SharedAsset, 'id'>) => {
    if (blockedByDemo()) return;
    const newAsset: SharedAsset = {
      ...assetData,
      id: `asset-${Date.now()}`
    };
    setAssets(prev => [newAsset, ...prev]);
    showNotification(`Activo ${newAsset.code} registrado. Ahora está disponible en todos los módulos.`);
  };

  // Motor Central de Hallazgos -> Viaja automáticamente a ACPM si se requiere
  const addFinding = (findingData: Omit<Finding, 'id' | 'code' | 'createdAt'>, sendDirectToAcpm = true): string => {
    if (blockedByDemo()) return '';
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
    if (blockedByDemo()) return;
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
    if (blockedByDemo()) return;
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
    if (blockedByDemo()) return;
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
    if (blockedByDemo()) return;
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
    if (blockedByDemo()) return;
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
    if (blockedByDemo()) return;
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const nextStatus = t.status === 'COMPLETADA' ? 'PENDIENTE' : 'COMPLETADA';
      return { ...t, status: nextStatus };
    }));
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    if (blockedByDemo()) return;
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
    showNotification(`Tarea agregada al centro "¿Qué tengo pendiente?": ${newTask.title}`);
  };

  const updateAuditChecklistItem = (auditId: string, itemId: string, status: AuditChecklistStatus, notes: string) => {
    if (blockedByDemo()) return;
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
    if (blockedByDemo()) return;
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
    if (blockedByDemo()) return;
    if (organization.huellaCarbonoHabilitada === false) {
      openUpsell('La calculadora de huella de carbono no está incluida en tu plan. Se incluye con Gestión Ambiental + otro módulo o con ISO 14001, y también se vende sola.');
      return;
    }
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
    if (blockedByDemo()) return;
    if (!hasEnvironmentalCore(organization.activeModules)) {
      openUpsell(`La gestión de residuos (PGIRS) no está incluida en tu ${planName(organization.activeModules)}. Contrata el módulo de Gestión Ambiental.`);
      return;
    }
    const newRecord: PgirsRecord = {
      ...recordData,
      id: `pg-${Date.now()}`
    };
    setPgirsRecords(prev => [newRecord, ...prev]);
    showNotification(`Pesaje de residuo ${newRecord.wasteName} registrado (+${newRecord.weightKg} kg)`);
  };

  const addPesvVehicle = (vehicleData: Omit<PesvVehicle, 'id'>) => {
    if (blockedByDemo()) return;
    const newVehicle: PesvVehicle = {
      ...vehicleData,
      id: `v-${Date.now()}`
    };
    setPesvVehicles(prev => [newVehicle, ...prev]);
    showNotification(`Vehículo ${newVehicle.plate} registrado en la flota PESV`);
  };

  const addPesvDriver = (driverData: Omit<PesvDriver, 'id'>) => {
    if (blockedByDemo()) return;
    const newDriver: PesvDriver = {
      ...driverData,
      id: `d-${Date.now()}`
    };
    setPesvDrivers(prev => [newDriver, ...prev]);
    showNotification(`Conductor ${newDriver.fullName} registrado en el PESV`);
  };

  // -------------------------------------------------------------
  // BASE MAESTRA DE TRABAJADORES (Expediente Digital Transversal 360°)
  // -------------------------------------------------------------
  const addWorker = (
    workerData: Omit<MasterWorker, 'id' | 'createdAt' | 'updatedAt' | 'auditTrail' | 'laborHistory'> & { initialLaborNotes?: string },
    userName = 'Talento Humano / HSEQ'
  ): MasterWorker => {
    if (blockedByDemo()) throw new Error('Acción bloqueada en modo demostración');

    // Validar unicidad de documento
    const cleanDoc = workerData.docNumber.replace(/\D/g, '');
    const existing = workers.find(w => w.docNumber.replace(/\D/g, '') === cleanDoc);
    if (existing) {
      showNotification(
        `El documento ${workerData.docNumber} ya está registrado para ${existing.firstName} ${existing.lastName}. Principio: UN TRABAJADOR = UN PERFIL ÚNICO.`,
        'warning'
      );
      return existing;
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const today = now.substring(0, 10);
    const workerId = `wrk-${Date.now()}`;

    const initialHistoryEntry: WorkerLaborHistoryEntry = {
      id: `lh-${Date.now()}-1`,
      changeDate: workerData.hireDate || today,
      newPosition: workerData.position,
      newArea: workerData.area,
      reason: 'INGRESO',
      registeredBy: userName,
      notes: workerData.initialLaborNotes || 'Creación inicial del expediente del trabajador en la Base Maestra.'
    };

    const newWorker: MasterWorker = {
      ...workerData,
      id: workerId,
      laborHistory: [initialHistoryEntry],
      academicRecords: workerData.academicRecords || [],
      certifications: workerData.certifications || [],
      licenses: workerData.licenses || [],
      digitalDocuments: workerData.digitalDocuments || [],
      inductions: workerData.inductions || [],
      trainings: workerData.trainings || [],
      eppDeliveries: workerData.eppDeliveries || [],
      committeeParticipations: workerData.committeeParticipations || [],
      occupationalExams: workerData.occupationalExams || [],
      incidentParticipations: workerData.incidentParticipations || [],
      inspections: workerData.inspections || [],
      auditTrail: [
        {
          id: `aud-${Date.now()}-1`,
          timestamp: now,
          userName,
          action: 'CREACION',
          reason: 'Registro en la Base Maestra Central de AGAE SOLUTIONS.'
        }
      ],
      createdAt: today,
      updatedAt: today
    };

    setWorkers(prev => [newWorker, ...prev]);
    showNotification(
      `Trabajador(a) ${newWorker.firstName} ${newWorker.lastName} registrado(a) exitosamente en la Base Maestra`,
      'success'
    );
    return newWorker;
  };

  const updateWorker = (
    id: string,
    updates: Partial<MasterWorker>,
    reason = 'Actualización de expediente',
    userName = 'Responsable HSEQ'
  ) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const today = now.substring(0, 10);

    setWorkers(prev =>
      prev.map(w => {
        if (w.id !== id) return w;

        const auditEntries: WorkerAuditEntry[] = [
          {
            id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: now,
            userName,
            action: 'ACTUALIZACION_DATOS',
            reason
          },
          ...w.auditTrail
        ];

        return {
          ...w,
          ...updates,
          auditTrail: auditEntries,
          updatedAt: today
        };
      })
    );
    showNotification('Expediente del trabajador actualizado correctamente');
  };

  const recordLaborChange = (
    workerId: string,
    entry: Omit<WorkerLaborHistoryEntry, 'id' | 'registeredBy'>,
    userName = 'Gerencia / HSEQ'
  ) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const today = now.substring(0, 10);

    setWorkers(prev =>
      prev.map(w => {
        if (w.id !== workerId) return w;

        const historyEntry: WorkerLaborHistoryEntry = {
          ...entry,
          id: `lh-${Date.now()}`,
          previousPosition: entry.previousPosition || w.position,
          previousArea: entry.previousArea || w.area,
          registeredBy: userName
        };

        const auditEntry: WorkerAuditEntry = {
          id: `aud-${Date.now()}`,
          timestamp: now,
          userName,
          action: 'CAMBIO_CARGO',
          fieldChanged: 'position / area',
          previousValue: `${w.position} (${w.area})`,
          newValue: `${entry.newPosition} (${entry.newArea})`,
          reason: entry.notes || `Movimiento laboral por motivo: ${entry.reason}`
        };

        return {
          ...w,
          position: entry.newPosition,
          area: entry.newArea,
          laborHistory: [historyEntry, ...w.laborHistory],
          auditTrail: [auditEntry, ...w.auditTrail],
          updatedAt: today
        };
      })
    );

    showNotification(`Movimiento laboral registrado: nuevo cargo "${entry.newPosition}"`);
  };

  const addWorkerDocument = (
    workerId: string,
    doc: Omit<WorkerDigitalDocument, 'id' | 'uploadedAt' | 'status'>,
    userName = 'HSEQ / Talento Humano'
  ) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const today = now.substring(0, 10);

    let status: WorkerDigitalDocument['status'] = 'NO_EXPIRA';
    if (doc.expiryDate) {
      const exp = new Date(doc.expiryDate).getTime();
      const current = new Date().getTime();
      const diffDays = Math.ceil((exp - current) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) status = 'VENCIDO';
      else if (diffDays <= 30) status = 'POR_VENCER';
      else status = 'VIGENTE';
    } else {
      status = 'VIGENTE';
    }

    const newDoc: WorkerDigitalDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: today,
      status,
      uploadedBy: userName
    };

    setWorkers(prev =>
      prev.map(w => {
        if (w.id !== workerId) return w;
        return {
          ...w,
          digitalDocuments: [newDoc, ...w.digitalDocuments],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: now,
              userName,
              action: 'DOCUMENTO_CARGADO',
              reason: `Carga de soporte: ${doc.title} (${doc.type})`
            },
            ...w.auditTrail
          ],
          updatedAt: today
        };
      })
    );

    showNotification(`Documento "${doc.title}" archivado en la Hoja de Vida Digital`);
  };

  const recordEppDelivery = (
    workerId: string,
    delivery: Omit<WorkerEppDeliveryRecord, 'id'>,
    userName = 'Almacén Central / HSEQ'
  ) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const today = now.substring(0, 10);

    const newDelivery: WorkerEppDeliveryRecord = {
      ...delivery,
      id: `epp-${Date.now()}`
    };

    setWorkers(prev =>
      prev.map(w => {
        if (w.id !== workerId) return w;
        return {
          ...w,
          eppDeliveries: [newDelivery, ...w.eppDeliveries],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: now,
              userName,
              action: 'EPP_ENTREGADO',
              reason: `Entrega de dotación: ${delivery.quantity}x ${delivery.elementName} (${delivery.deliveryReason})`
            },
            ...w.auditTrail
          ],
          updatedAt: today
        };
      })
    );

    showNotification(`Dotación de EPP registrada automáticamente en el expediente`);
  };

  const recordTrainingAttendance = (
    workerId: string,
    training: Omit<WorkerTrainingRecord, 'id'>,
    userName = 'Capacitador / Líder SST'
  ) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const today = now.substring(0, 10);

    const newTraining: WorkerTrainingRecord = {
      ...training,
      id: `trn-${Date.now()}`
    };

    setWorkers(prev =>
      prev.map(w => {
        if (w.id !== workerId) return w;
        return {
          ...w,
          trainings: [newTraining, ...w.trainings],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: now,
              userName,
              action: 'CAPACITACION_REGISTRADA',
              reason: `Registro de asistencia a "${training.trainingTitle}" (${training.hours}h)`
            },
            ...w.auditTrail
          ],
          updatedAt: today
        };
      })
    );

    showNotification(`Capacitación registrada en el expediente del trabajador`);
  };

  const recordCommitteeAssignment = (
    workerId: string,
    committee: Omit<WorkerCommitteeParticipation, 'id'>,
    userName = 'Gerencia / Mesa Electoral'
  ) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const today = now.substring(0, 10);

    const newCommittee: WorkerCommitteeParticipation = {
      ...committee,
      id: `com-${Date.now()}`
    };

    setWorkers(prev =>
      prev.map(w => {
        if (w.id !== workerId) return w;
        return {
          ...w,
          committeeParticipations: [newCommittee, ...w.committeeParticipations],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: now,
              userName,
              action: 'COMITE_ASIGNADO',
              reason: `Designación en ${committee.committeeType} con rol ${committee.role}`
            },
            ...w.auditTrail
          ],
          updatedAt: today
        };
      })
    );

    showNotification(`Designación de comité incorporada al perfil del trabajador`);
  };

  const recordOccupationalExam = (
    workerId: string,
    exam: Omit<WorkerOccupationalExam, 'id'>,
    userName = 'Médico Laboral / SST'
  ) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const today = now.substring(0, 10);

    const newExam: WorkerOccupationalExam = {
      ...exam,
      id: `med-${Date.now()}`
    };

    setWorkers(prev =>
      prev.map(w => {
        if (w.id !== workerId) return w;
        return {
          ...w,
          occupationalExams: [newExam, ...w.occupationalExams],
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: now,
              userName,
              action: 'EXAMEN_REGISTRADO',
              reason: `Evaluación médica ocupacional ${exam.type} (${exam.concept})`
            },
            ...w.auditTrail
          ],
          updatedAt: today
        };
      })
    );

    showNotification(`Evaluación médica ocupacional registrada con reserva de confidencialidad`);
  };

  const deleteWorker = (id: string, reason = 'Retiro o desvinculación', userName = 'Talento Humano') => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const today = now.substring(0, 10);

    setWorkers(prev =>
      prev.map(w => {
        if (w.id !== id) return w;
        return {
          ...w,
          status: 'INACTIVO',
          terminationDate: today,
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: now,
              userName,
              action: 'CAMBIO_ESTADO',
              fieldChanged: 'status',
              previousValue: w.status,
              newValue: 'INACTIVO',
              reason
            },
            ...w.auditTrail
          ],
          updatedAt: today
        };
      })
    );
    showNotification('Trabajador marcado como INACTIVO en la Base Maestra');
  };

  const getWorkerById = (id: string) => workers.find(w => w.id === id);
  const getWorkerByDoc = (docNumber: string) => {
    const clean = docNumber.replace(/\D/g, '');
    return workers.find(w => w.docNumber.replace(/\D/g, '') === clean);
  };

  const assignWorkerAsSstResponsible = (workerId: string) => {
    if (blockedByDemo()) return;
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;

    const sstLic = worker.licenses.find(l => l.type === 'LICENCIA_SST');
    const c50 = worker.certifications.find(c => c.title.includes('50 Horas'));
    const c20 = worker.certifications.find(c => c.title.includes('20 Horas'));

    setSstResponsible(prev => ({
      ...prev,
      fullName: `${worker.firstName} ${worker.lastName}`,
      docType: worker.docType === 'PASAPORTE' ? 'PASAPORTE' : worker.docType === 'CE' ? 'CE' : 'CC',
      docNumber: worker.docNumber,
      profession: worker.academicRecords[0]?.degreeTitle || worker.position,
      licenseNumber: sstLic?.number || prev.licenseNumber,
      licenseExpDate: sstLic?.expiryDate || prev.licenseExpDate,
      course50hDate: c50?.issueDate || prev.course50hDate,
      course20hDate: c20?.issueDate || prev.course20hDate,
      isFormallyAssigned: true
    }));

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setWorkers(prev =>
      prev.map(w => {
        if (w.id !== workerId) return w;
        return {
          ...w,
          auditTrail: [
            {
              id: `aud-${Date.now()}`,
              timestamp: now,
              userName: 'Gerencia General',
              action: 'ACTUALIZACION_DATOS',
              reason: 'Asignado oficialmente como Responsable del SG-SST (Estándar 1.1.1 Res. 0312)'
            },
            ...w.auditTrail
          ]
        };
      })
    );

    showNotification(`Datos de ${worker.firstName} ${worker.lastName} sincronizados en el Estándar 1.1.1`);
  };

  const addSstHazard = (hazardData: Omit<SstHazardItem, 'id'>) => {
    if (blockedByDemo()) return;
    const newHazard: SstHazardItem = {
      ...hazardData,
      id: `haz-${Date.now()}`
    };
    setSstHazards(prev => [newHazard, ...prev]);
    showNotification(`Peligro GTC 45 registrado para el proceso ${newHazard.process}`);
  };

  const updateStandardStatus = (standardId: string, status: SstStandardStatus, notes?: string) => {
    if (blockedByDemo()) return;
    setSstStandards(prev => prev.map(s => {
      if (s.id !== standardId) return s;
      return { ...s, status, notes: notes !== undefined ? notes : s.notes };
    }));
    showNotification(`Estado de Estándar actualizado a: ${status}`);
  };

  const attachEvidenceToStandard = (standardId: string, evidenceId: string) => {
    if (blockedByDemo()) return;
    setSstStandards(prev => prev.map(s => {
      if (s.id !== standardId) return s;
      if (s.evidenceIds.includes(evidenceId)) return s;
      return { ...s, evidenceIds: [...s.evidenceIds, evidenceId] };
    }));
    showNotification('Evidencia vinculada exitosamente al Estándar');
  };

  const updateSstResponsible = (profileUpdate: Partial<SstResponsibleProfile>) => {
    if (blockedByDemo()) return;
    setSstResponsible(prev => ({ ...prev, ...profileUpdate }));
    showNotification('Perfil del Responsable SG-SST actualizado satisfactoriamente');
  };

  const addSstBudgetItem = (itemData: Omit<SstBudgetItem, 'id'>) => {
    if (blockedByDemo()) return;
    const newItem: SstBudgetItem = {
      ...itemData,
      id: `b-${itemData.system.toLowerCase()}-${Date.now()}`
    };
    setSstBudgetItems(prev => [newItem, ...prev]);
    showNotification(`Rubro presupuestal "${newItem.concept}" agregado exitosamente`);
  };

  const updateSstBudgetItem = (id: string, itemData: Partial<SstBudgetItem>) => {
    if (blockedByDemo()) return;
    setSstBudgetItems(prev => prev.map(i => i.id === id ? { ...i, ...itemData } : i));
    showNotification('Rubro presupuestal modificado');
  };

  const deleteSstBudgetItem = (id: string) => {
    if (blockedByDemo()) return;
    setSstBudgetItems(prev => prev.filter(i => i.id !== id));
    showNotification('Rubro presupuestal eliminado');
  };

  const updateSstBudgetApproval = (
    newStatus: SstBudgetState['status'],
    comment?: string,
    role: SimulatedRole = currentSimulatedRole,
    userName = 'Usuario Autorizado'
  ) => {
    if (blockedByDemo()) return;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setSstBudgetState(prev => {
      const historyEntry = {
        id: `bh-${Date.now()}`,
        timestamp,
        role: (role === 'GERENCIA' ? 'GERENCIA' : role === 'DIRECTOR_FINANCIERO' ? 'DIRECTOR_FINANCIERO' : 'LIDER_SST') as any,
        userName,
        action: newStatus === 'APROBADO_GERENCIA' 
          ? 'Aprobación oficial del Presupuesto Integrado por Gerencia' 
          : newStatus === 'EN_REVISION'
          ? 'Presupuesto remitido a revisión gerencial y financiera'
          : newStatus === 'RECHAZADO'
          ? 'Presupuesto devuelto con observaciones para ajuste'
          : 'Presupuesto retornado a estado borrador',
        comment
      };
      return {
        ...prev,
        status: newStatus,
        approvedBy: newStatus === 'APROBADO_GERENCIA' ? userName : prev.approvedBy,
        approvalDate: newStatus === 'APROBADO_GERENCIA' ? timestamp : prev.approvalDate,
        approvalNotes: comment || prev.approvalNotes,
        history: [historyEntry, ...prev.history]
      };
    });
    showNotification(`Estado de aprobación del Presupuesto: ${newStatus}`);
  };

  const flagBudgetItemObservation = (itemId: string, comment: string) => {
    if (blockedByDemo()) return;
    setSstBudgetItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        hasObservation: true,
        observationComment: comment,
        observationResolved: false
      };
    }));

    const item = sstBudgetItems.find(i => i.id === itemId);
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setSstBudgetState(prev => ({
      ...prev,
      status: 'RECHAZADO',
      history: [
        {
          id: `bh-${Date.now()}`,
          timestamp,
          role: 'GERENCIA',
          userName: prev.signatures.manager?.name || 'Gerencia General',
          action: `Observación registrada en rubro: "${item?.concept || itemId}"`,
          comment
        },
        ...prev.history
      ]
    }));
    showNotification(`Rubro objetado con observación gerencial. Queda resaltado para ajuste.`);
  };

  const resolveBudgetItemObservation = (itemId: string) => {
    if (blockedByDemo()) return;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setSstBudgetItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        hasObservation: false,
        observationResolved: true,
        resolvedAt: timestamp
      };
    }));

    const item = sstBudgetItems.find(i => i.id === itemId);
    setSstBudgetState(prev => ({
      ...prev,
      status: 'EN_REVISION',
      history: [
        {
          id: `bh-${Date.now()}`,
          timestamp,
          role: 'DIRECTOR_FINANCIERO',
          userName: prev.financialOfficerName,
          action: `Rubro subsanado y corregido: "${item?.concept || itemId}"`,
          comment: 'Ajuste completado por el encargado financiero. Remitido a Gerencia y Líder SST para aprobación y firma.'
        },
        ...prev.history
      ]
    }));
    showNotification(`✓ Rubro "${item?.concept || ''}" corregido y marcado como subsanado. Notificación enviada a Gerencia General y Líder SST.`);
  };

  const signBudgetParty = (party: 'manager' | 'financial' | 'sstLeader', signerData: DigitalSignatureInfo) => {
    if (blockedByDemo()) return;
    setSstBudgetState(prev => {
      const updatedSignatures = {
        ...prev.signatures,
        [party]: signerData
      };

      const allSigned = Boolean(updatedSignatures.manager && updatedSignatures.financial && updatedSignatures.sstLeader);
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const partyLabel = party === 'manager' ? 'Gerencia General' : party === 'financial' ? prev.financialRoleTitle : 'Líder SG-SST';

      const historyEntry = {
        id: `bh-sig-${Date.now()}`,
        timestamp,
        role: (party === 'manager' ? 'GERENCIA' : party === 'financial' ? 'DIRECTOR_FINANCIERO' : 'LIDER_SST') as any,
        userName: signerData.name,
        action: `Firma Digital estampada por ${partyLabel} (${signerData.token})`,
        comment: allSigned ? 'Presupuesto completamente firmado y validado por todas las partes legalmente requeridas.' : undefined
      };

      return {
        ...prev,
        signatures: updatedSignatures,
        status: allSigned ? 'APROBADO_GERENCIA' : prev.status,
        history: [historyEntry, ...prev.history]
      };
    });

    showNotification(`Firma digital de ${signerData.name} estampada con éxito`);
  };

  const addCopasstBudgetReview = (reviewData: Omit<CopasstBudgetReview, 'id' | 'timestamp'>) => {
    if (blockedByDemo()) return;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newReview: CopasstBudgetReview = {
      ...reviewData,
      id: `cop-rev-${Date.now()}`,
      timestamp
    };

    setSstBudgetState(prev => ({
      ...prev,
      copasstReviews: [newReview, ...prev.copasstReviews],
      history: [
        {
          id: `bh-cop-${Date.now()}`,
          timestamp,
          role: 'COPASST',
          userName: reviewData.reviewedBy,
          action: `Revisión mensual de presupuesto en ${reviewData.actaNumber} (Concepto: ${reviewData.status})`,
          comment: reviewData.observations
        },
        ...prev.history
      ]
    }));

    showNotification(`Constancia de revisión del COPASST registrada para ${reviewData.actaNumber}`);
  };

  const updateFinancialOfficerConfig = (title: string, name: string, doc: string) => {
    if (blockedByDemo()) return;
    setSstBudgetState(prev => ({
      ...prev,
      financialRoleTitle: title,
      financialOfficerName: name,
      financialOfficerDoc: doc
    }));
    showNotification(`Configuración del encargado de presupuesto actualizada a: ${title}`);
  };

  // =========================================================================
  // GESTIÓN DE PLANILLAS PILA Y SEGURIDAD SOCIAL (Estándares 1.1.4 y 1.1.5)
  // =========================================================================
  const addPilaRecord = (recordData: Omit<PilaPayrollRecord, 'id' | 'uploadedAt'>): PilaPayrollRecord => {
    if (blockedByDemo()) return {} as PilaPayrollRecord;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newRecordId = `pila-${Date.now()}`;
    const newRecord: PilaPayrollRecord = {
      ...recordData,
      id: newRecordId,
      uploadedAt: now
    };

    // 1. Guardar en repositorio central de evidencias
    const newEvidence = addEvidence({
      title: `Planilla PILA ${recordData.payrollType === 'ALTO_RIESGO' ? 'Alto Riesgo (Dec. 2090)' : 'General'} - Periodo ${recordData.period}`,
      fileType: 'DOCUMENT',
      fileName: recordData.fileName,
      fileSize: recordData.fileSize,
      uploadedBy: recordData.uploadedBy || 'Responsable SG-SST',
      url: recordData.fileUrl || (recordData.fileBase64 ? recordData.fileBase64 : 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'),
      tags: ['PILA', recordData.payrollType, recordData.period, 'SEGURIDAD_SOCIAL']
    });

    // 2. Asociar automáticamente al estándar correspondiente (1.1.4 o 1.1.5)
    const stdCode = recordData.payrollType === 'ALTO_RIESGO' ? '1.1.5' : '1.1.4';
    const targetStd = sstStandards.find(s => s.code === stdCode);
    if (targetStd) {
      attachEvidenceToStandard(targetStd.id, newEvidence.id);
      updateStandardStatus(
        targetStd.id,
        'CUMPLE',
        `Planilla de aportes del periodo ${recordData.period} pagada el ${recordData.paymentDate} (PIN: ${recordData.pinNumber}). Cubre ${recordData.coveredWorkerIds.length} trabajador(es).`
      );
    }

    // 3. Alimentar automáticamente el expediente digital de cada trabajador cubierto
    recordData.coveredWorkerIds.forEach(workerId => {
      addWorkerDocument(workerId, {
        type: 'AFILIACION_SEGURIDAD_SOCIAL',
        title: `Planilla PILA ${recordData.period} (${recordData.payrollType === 'ALTO_RIESGO' ? 'Alto Riesgo' : 'General'})`,
        fileName: recordData.fileName,
        fileSize: recordData.fileSize,
        issueDate: recordData.paymentDate,
        url: recordData.fileUrl,
        fileBase64: recordData.fileBase64,
        uploadedBy: recordData.uploadedBy || 'Talento Humano',
        notes: `Pago verificado el ${recordData.paymentDate} - PIN: ${recordData.pinNumber}`
      });
    });

    setPilaRecords(prev => [newRecord, ...prev]);
    showNotification(`Planilla PILA ${newRecord.pinNumber} (${recordData.period}) registrada y sincronizada`);
    return newRecord;
  };

  const deletePilaRecord = (id: string) => {
    if (blockedByDemo()) return;
    setPilaRecords(prev => prev.filter(r => r.id !== id));
    showNotification('Planilla PILA eliminada del registro');
  };

  // =========================================================================
  // GESTIÓN DE COPASST O VIGÍA DE SST (Estándares 1.1.6 y 1.1.7)
  // =========================================================================
  const setCopasstMechanism = (mechanism: CopasstMechanismType) => {
    if (blockedByDemo()) return;
    setCopasstState(prev => ({
      ...prev,
      mechanismType: mechanism,
      ruleExplanation: mechanism === 'VIGIA_SST'
        ? 'Configurado como Vigía de Seguridad y Salud en el Trabajo según Decreto 1072/2015 Art. 2.2.4.6.8 Parágrafo 2 (empresas con menos de 10 trabajadores). Designado directamente por el empleador.'
        : 'Configurado como COPASST según Resolución 2013 de 1986 y Decreto 1072 de 2015 (empresas con 10 o más trabajadores). Requiere elección democrática de representantes de trabajadores y designación paritaria del empleador.'
    }));
    showNotification(`Mecanismo de participación configurado a: ${mechanism === 'VIGIA_SST' ? 'Vigía SST' : 'COPASST'}`);
  };

  const updateVigiaProfile = (profileUpdates: Partial<VigiaProfile>) => {
    if (blockedByDemo()) return;
    setCopasstState(prev => ({
      ...prev,
      vigiaProfile: prev.vigiaProfile ? { ...prev.vigiaProfile, ...profileUpdates } : {
        workerId: 'wrk-001',
        appointmentDate: new Date().toISOString().substring(0, 10),
        termYears: 2,
        termEndDate: new Date(Date.now() + 2 * 365 * 24 * 3600 * 1000).toISOString().substring(0, 10),
        employerName: organization.name,
        employerDoc: organization.nit,
        isSigned: true,
        functionsAccepted: true,
        ...profileUpdates
      }
    }));
    showNotification('Expediente del Vigía de SST actualizado');
  };

  const addVigiaActuation = (actuationData: Omit<VigiaActuation, 'id' | 'registeredBy'>) => {
    if (blockedByDemo()) return;
    const newActuationId = `act-vig-${Date.now()}`;
    const newActuation: VigiaActuation = {
      ...actuationData,
      id: newActuationId,
      registeredBy: 'Vigía de SST'
    };

    // Si genera hallazgo y se envía a ACPM
    if (actuationData.sentToAcpm && actuationData.findingAssociated) {
      const acpmId = addFinding({
        title: actuationData.findingAssociated,
        originModule: 'SST',
        originType: actuationData.type === 'INSPECCION' ? 'INSPECTION' : 'ROUTINE',
        originDetail: `Actuación del Vigía SST (${actuationData.type})`,
        siteName: organization.sites[0]?.name || 'Sede Principal',
        processName: 'Gestión Integral HSEQ',
        description: actuationData.description,
        legalCriterion: 'Decreto 1072 de 2015 Art. 2.2.4.6.8',
        severity: 'MAYOR',
        status: 'EN_ACPM',
        reportedBy: 'Vigía de Seguridad y Salud en el Trabajo'
      }, true);
      newActuation.linkedAcpmId = acpmId;
    }

    setCopasstState(prev => ({
      ...prev,
      vigiaActuations: [newActuation, ...prev.vigiaActuations]
    }));
    showNotification('Actuación del Vigía de SST registrada');
  };

  const registerCopasstCandidate = (workerId: string, proposalBrief?: string) => {
    if (blockedByDemo()) return;
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;

    // Verificar si ya está postulado
    if (copasstState.election.candidates.some(c => c.workerId === workerId)) {
      showNotification('Este trabajador ya se encuentra postulado como candidato', 'warning');
      return;
    }

    const newCandidate: CopasstCandidate = {
      id: `cand-${Date.now()}`,
      workerId,
      registrationDate: new Date().toISOString().substring(0, 10),
      proposalBrief: proposalBrief || 'Compromiso con la seguridad, ergonomía y bienestar de los trabajadores.',
      status: 'ACEPTADO',
      votesCount: 0,
      isElected: false
    };

    setCopasstState(prev => ({
      ...prev,
      election: {
        ...prev.election,
        candidates: [...prev.election.candidates, newCandidate]
      }
    }));
    showNotification(`Trabajador ${worker.firstName} ${worker.lastName} postulado como candidato al COPASST`);
  };

  const castCopasstVote = (voterDocNumber: string, candidateId: string): { success: boolean; message: string } => {
    const cleanDoc = voterDocNumber.replace(/\D/g, '');
    if (!cleanDoc) {
      return { success: false, message: 'Ingrese un número de documento válido.' };
    }

    // 1. Control de voto único (auditoría inmutable)
    const alreadyVoted = copasstState.election.voterAuditLog.some(
      entry => entry.voterDocNumber.replace(/\D/g, '') === cleanDoc
    );
    if (alreadyVoted) {
      return { success: false, message: 'Este documento de identidad ya ejerció su voto en este proceso electoral.' };
    }

    // 2. Validar que la persona esté dentro del censo de trabajadores habilitados
    const isEligibleWorker = workers.some(
      w => w.docNumber.replace(/\D/g, '') === cleanDoc && w.status === 'ACTIVO'
    );
    if (!isEligibleWorker) {
      return { success: false, message: 'El documento no figura en el censo electoral de trabajadores activos habilitados para votar.' };
    }

    // 3. Registrar el voto: secreto garantizado (el voto se suma al candidato, la cédula se anota en el padrón de participación)
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setCopasstState(prev => ({
      ...prev,
      election: {
        ...prev.election,
        voterAuditLog: [
          ...prev.election.voterAuditLog,
          { voterDocNumber, votedAt: now, ipAddress: '127.0.0.1' }
        ],
        candidates: prev.election.candidates.map(c =>
          c.id === candidateId ? { ...c, votesCount: c.votesCount + 1 } : c
        )
      }
    }));

    return { success: true, message: '¡Voto registrado con éxito de manera secreta y segura!' };
  };

  const closeCopasstElection = () => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setCopasstState(prev => {
      // Ordenar candidatos por número de votos descendente
      const sorted = [...prev.election.candidates].sort((a, b) => b.votesCount - a.votesCount);
      const updatedCandidates = sorted.map((cand, idx) => {
        if (idx === 0) return { ...cand, isElected: true, electedRole: 'PRINCIPAL' as const };
        if (idx === 1) return { ...cand, isElected: true, electedRole: 'SUPLENTE' as const };
        return { ...cand, isElected: false };
      });

      // Crear integrantes de trabajadores a partir de los electos
      const electedMembers: CopasstMember[] = updatedCandidates
        .filter(c => c.isElected)
        .map((c, idx) => ({
          id: `mem-trk-${Date.now()}-${idx}`,
          workerId: c.workerId,
          role: c.electedRole === 'PRINCIPAL' ? 'PRINCIPAL' : 'SUPLENTE',
          party: 'TRABAJADORES',
          appointmentDate: now.substring(0, 10),
          isActive: true
        }));

      // Conservar los del empleador y reemplazar los de los trabajadores
      const employerMembers = prev.members.filter(m => m.party === 'EMPLEADOR');

      return {
        ...prev,
        election: {
          ...prev.election,
          isVotingOpen: false,
          isClosed: true,
          closedAt: now,
          closedBy: 'Comité Electoral Central',
          candidates: updatedCandidates,
          resultsPublished: true
        },
        members: [...employerMembers, ...electedMembers]
      };
    });

    showNotification('Votaciones cerradas y escrutinio electoral oficial generado exitosamente');
  };

  const setEmployerRepresentatives = (principalWorkerId: string, suplenteWorkerId?: string) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().substring(0, 10);
    const newEmployerMembers: CopasstMember[] = [
      {
        id: `mem-emp-prin-${Date.now()}`,
        workerId: principalWorkerId,
        role: 'PRESIDENTE',
        party: 'EMPLEADOR',
        appointmentDate: now,
        isActive: true,
        signatureDate: now
      }
    ];

    if (suplenteWorkerId) {
      newEmployerMembers.push({
        id: `mem-emp-supl-${Date.now()}`,
        workerId: suplenteWorkerId,
        role: 'SUPLENTE',
        party: 'EMPLEADOR',
        appointmentDate: now,
        isActive: true,
        signatureDate: now
      });
    }

    setCopasstState(prev => {
      const workerMembers = prev.members.filter(m => m.party === 'TRABAJADORES');
      return {
        ...prev,
        presidentWorkerId: principalWorkerId,
        members: [...newEmployerMembers, ...workerMembers]
      };
    });

    showNotification('Representantes del empleador designados formalmente');
  };

  const saveCopasstConformationAct = (actNumber: string, actDate: string) => {
    if (blockedByDemo()) return;
    setCopasstState(prev => ({
      ...prev,
      conformationActNumber: actNumber,
      conformationActDate: actDate,
      status: 'CUMPLE'
    }));

    // Actualizar Estándar 1.1.6
    const std116 = sstStandards.find(s => s.code === '1.1.6');
    if (std116) {
      updateStandardStatus(std116.id, 'CUMPLE', `COPASST conformado con ${actNumber} de fecha ${actDate}.`);
    }

    showNotification(`Acta de Conformación ${actNumber} legalizada y archivada`);
  };

  const saveCopasstInstallationAct = (presidentWorkerId: string, secretaryWorkerId: string, date: string) => {
    if (blockedByDemo()) return;
    setCopasstState(prev => ({
      ...prev,
      presidentWorkerId,
      secretaryWorkerId,
      installationActDate: date
    }));
    showNotification('Acta de Instalación del COPASST formalizada');
  };

  const addCopasstMeeting = (meetingData: Omit<CopasstMeeting, 'id' | 'actaCode'>): CopasstMeeting => {
    if (blockedByDemo()) return {} as CopasstMeeting;
    const meetingCount = copasstState.meetings.length + 1;
    const currentYear = new Date().getFullYear();
    const actaCode = `ACTA-COP-${currentYear}-${String(meetingCount).padStart(2, '0')}`;
    const newMeetingId = `mtg-${Date.now()}`;

    // Inicializar firmas paritarias de TODOS los integrantes activos del COPASST si no vienen provistas
    const initialSignatures = meetingData.membersSignatures && meetingData.membersSignatures.length > 0
      ? meetingData.membersSignatures
      : copasstState.members.map(member => {
          const w = workers.find(wrk => wrk.id === member.workerId);
          const isPresident = member.role === 'PRESIDENTE';
          return {
            workerId: member.workerId,
            memberName: w ? `${w.firstName} ${w.lastName}` : 'Miembro COPASST',
            role: member.role,
            party: member.party,
            docNumber: w ? `${w.docType} ${w.docNumber}` : undefined,
            signed: isPresident,
            signedAt: isPresident ? new Date().toISOString().replace('T', ' ').substring(0, 19) : undefined,
            signatureToken: isPresident ? `SIG-COP-${member.workerId.slice(-4)}-${Date.now().toString(36).toUpperCase()}` : undefined
          };
        });

    const newMeeting: CopasstMeeting = {
      ...meetingData,
      id: newMeetingId,
      actaCode,
      membersSignatures: initialSignatures,
      commitments: meetingData.commitments.map((c, idx) => ({
        ...c,
        id: `com-${Date.now()}-${idx}`,
        meetingId: newMeetingId
      }))
    };

    // Convertir compromisos automáticamente en tareas pendientes ("¿Qué tengo pendiente?")
    newMeeting.commitments.forEach(commitment => {
      addTask({
        title: `Compromiso COPASST (${actaCode}): ${commitment.description}`,
        module: 'SST',
        type: 'ACPM',
        dueDate: commitment.dueDate,
        responsible: commitment.responsibleName,
        priority: 'ALTA',
        status: 'PENDIENTE',
        siteName: organization.sites[0]?.name || 'Sede Principal'
      });
    });

    setCopasstState(prev => ({
      ...prev,
      meetings: [newMeeting, ...prev.meetings],
      commitments: [...newMeeting.commitments, ...prev.commitments]
    }));

    showNotification(`Reunión ordinaria ${actaCode} registrada con quórum y firmas habilitadas`);
    return newMeeting;
  };

  const updateCopasstMeeting = (meetingId: string, updatedData: Partial<CopasstMeeting>) => {
    if (blockedByDemo()) return;
    setCopasstState(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => m.id === meetingId ? { ...m, ...updatedData } : m)
    }));
    showNotification('Acta de reunión del COPASST actualizada exitosamente');
  };

  const signMeetingMember = (meetingId: string, workerId: string) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const token = `SIG-COP-${workerId.slice(-4)}-${Date.now().toString(36).toUpperCase()}`;

    setCopasstState(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => {
        if (m.id !== meetingId) return m;
        const currentSigs = m.membersSignatures && m.membersSignatures.length > 0
          ? m.membersSignatures
          : prev.members.map(mb => {
              const wrk = workers.find(w => w.id === mb.workerId);
              return {
                workerId: mb.workerId,
                memberName: wrk ? `${wrk.firstName} ${wrk.lastName}` : 'Miembro COPASST',
                role: mb.role,
                party: mb.party,
                docNumber: wrk ? `${wrk.docType} ${wrk.docNumber}` : undefined,
                signed: false
              };
            });

        const updatedSignatures = currentSigs.map(sig => {
          if (sig.workerId === workerId) {
            return {
              ...sig,
              signed: true,
              signedAt: now,
              signatureToken: token
            };
          }
          return sig;
        });

        const isPresSigned = updatedSignatures.some(s => s.role === 'PRESIDENTE' && s.signed);
        const isSecSigned = updatedSignatures.some(s => s.role === 'SECRETARIO' && s.signed);
        const allSigned = updatedSignatures.length > 0 && updatedSignatures.every(s => s.signed);

        return {
          ...m,
          membersSignatures: updatedSignatures,
          signedByPresident: isPresSigned,
          signedBySecretary: isSecSigned,
          isClosed: allSigned
        };
      })
    }));

    showNotification('Firma electrónica de integrante registrada con token de auditoría legal (Ley 527 de 1999)', 'success');
  };

  const signMeetingAllMembers = (meetingId: string) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setCopasstState(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => {
        if (m.id !== meetingId) return m;
        const currentSigs = m.membersSignatures && m.membersSignatures.length > 0
          ? m.membersSignatures
          : prev.members.map(mb => {
              const wrk = workers.find(w => w.id === mb.workerId);
              return {
                workerId: mb.workerId,
                memberName: wrk ? `${wrk.firstName} ${wrk.lastName}` : 'Miembro COPASST',
                role: mb.role,
                party: mb.party,
                docNumber: wrk ? `${wrk.docType} ${wrk.docNumber}` : undefined,
                signed: true,
                signedAt: now,
                signatureToken: `SIG-COP-${mb.workerId.slice(-4)}-${Date.now().toString(36).toUpperCase()}`
              };
            });

        const updatedSignatures = currentSigs.map(sig => ({
          ...sig,
          signed: true,
          signedAt: sig.signedAt || now,
          signatureToken: sig.signatureToken || `SIG-COP-${sig.workerId.slice(-4)}-${Date.now().toString(36).toUpperCase()}`
        }));

        return {
          ...m,
          membersSignatures: updatedSignatures,
          signedByPresident: true,
          signedBySecretary: true,
          isClosed: true
        };
      })
    }));

    showNotification('Todas las firmas de los integrantes del COPASST formalizadas', 'success');
  };

  const uploadScannedMeetingAct = (meetingId: string, fileData: { fileName: string; fileBase64: string; fileSize: string }) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setCopasstState(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          scannedSignedActFileName: fileData.fileName,
          scannedSignedActUrl: fileData.fileBase64,
          scannedSignedActFileSize: fileData.fileSize,
          scannedSignedActUploadedAt: now,
          isClosed: true
        };
      })
    }));

    showNotification(`Acta física escaneada "${fileData.fileName}" bajo custodia digital legal`, 'success');
  };

  const updateCopasstDocumentNotes = (docType: 'CONFORMATION' | 'INSTALLATION' | 'ELECTION' | 'VIGIA', notes: string) => {
    if (blockedByDemo()) return;
    setCopasstState(prev => ({
      ...prev,
      conformationActNotes: docType === 'CONFORMATION' ? notes : prev.conformationActNotes,
      installationActNotes: docType === 'INSTALLATION' ? notes : prev.installationActNotes,
      electionActNotes: docType === 'ELECTION' ? notes : prev.electionActNotes,
      vigiaDesignationNotes: docType === 'VIGIA' ? notes : prev.vigiaDesignationNotes
    }));
    showNotification('Cláusulas y observaciones del documento oficial guardadas', 'success');
  };

  const toggleCopasstCommitmentStatus = (commitmentId: string, newStatus: CopasstMeetingCommitment['status']) => {
    if (blockedByDemo()) return;
    setCopasstState(prev => ({
      ...prev,
      commitments: prev.commitments.map(c => c.id === commitmentId ? { ...c, status: newStatus } : c),
      meetings: prev.meetings.map(m => ({
        ...m,
        commitments: m.commitments.map(c => c.id === commitmentId ? { ...c, status: newStatus } : c)
      }))
    }));
    showNotification(`Estado de compromiso del COPASST actualizado a: ${newStatus}`);
  };

  const createCopasstFinding = (findingData: Omit<CopasstFindingItem, 'id' | 'status' | 'sentToAcpm'>, sendDirectToAcpm = true) => {
    if (blockedByDemo()) return;
    const findingId = `cop-find-${Date.now()}`;
    let linkedAcpmId: string | undefined = undefined;

    if (sendDirectToAcpm) {
      linkedAcpmId = addFinding({
        title: `[COPASST] ${findingData.description.substring(0, 60)}...`,
        originModule: 'SST',
        originType: findingData.sourceType === 'INSPECCION_SEGURIDAD' ? 'INSPECTION' : 'ROUTINE',
        originDetail: `Fuente: ${findingData.sourceRef}`,
        siteName: organization.sites[0]?.name || 'Sede Principal',
        processName: findingData.processName || 'Gestión Integral HSEQ',
        description: findingData.description,
        legalCriterion: findingData.legalRequirementRef || 'Decreto 1072 de 2015 Art. 2.2.4.6.8',
        severity: findingData.classification === 'NO_CONFORMIDAD' || findingData.classification === 'INCUMPLIMIENTO' ? 'CRITICA' : 'MAYOR',
        status: 'EN_ACPM',
        reportedBy: 'COPASST / Vigía de SST'
      }, true);
    }

    const newFinding: CopasstFindingItem = {
      ...findingData,
      id: findingId,
      sentToAcpm: sendDirectToAcpm,
      linkedAcpmId,
      status: sendDirectToAcpm ? 'EN_ACPM' : 'ABIERTO'
    };

    setCopasstState(prev => ({
      ...prev,
      findings: [newFinding, ...prev.findings]
    }));

    showNotification('Hallazgo del COPASST registrado y transferido a la Matriz ACPM');
  };

  const addCopasstTraining = (trainingData: Omit<CopasstTrainingCourse, 'id'>) => {
    if (blockedByDemo()) return;
    const newTraining: CopasstTrainingCourse = {
      ...trainingData,
      id: `trn-cop-${Date.now()}`
    };

    // Actualizar Estándar 1.1.7 si está ejecutada
    const std117 = sstStandards.find(s => s.code === '1.1.7');
    if (std117) {
      updateStandardStatus(std117.id, 'CUMPLE', `Capacitación de integrantes ejecutada: ${trainingData.topic}.`);
    }

    // Registrar en los expedientes de cada trabajador que asistió
    trainingData.attendedWorkerIds.forEach(workerId => {
      recordTrainingAttendance(workerId, {
        trainingTitle: `[COPASST/Vigía] ${trainingData.topic}`,
        date: trainingData.date,
        hours: trainingData.durationHours,
        trainingType: 'SST',
        trainerName: trainingData.entityOrTrainer,
        attendanceVerified: true,
        approved: true,
        certificateFileName: trainingData.evidenceFileName
      });
    });

    setCopasstState(prev => ({
      ...prev,
      trainings: [newTraining, ...prev.trainings]
    }));

    showNotification('Capacitación del COPASST registrada y expedientes de integrantes actualizados');
  };

  // ==============================================================
  // COMITÉ DE CONVIVENCIA LABORAL (CCL) - RESOLUCIÓN 3461 DE 2025
  // ==============================================================

  const registerCclComplaint = (data: {
    channel: CclComplaintCase['channel'];
    complainantWorkerId: string;
    respondentWorkerId: string;
    witnessesText?: string;
    incidentDates: string;
    incidentLocation: string;
    factsDescription: string;
    evidences?: CclEvidenceAttachment[];
  }): CclComplaintCase => {
    const year = new Date().getFullYear();
    const caseIndex = (cclState.complaints.length + 1).toString().padStart(4, '0');
    const caseCode = `CCL-${year}-${caseIndex}`;
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const addDays = (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    const newCase: CclComplaintCase = {
      id: caseCode,
      code: caseCode,
      filingDate: today,
      receptionDate: today,
      channel: data.channel,
      status: 'RECIBIDA',
      confidentialityLevel: 'RESERVADO_COMITE',
      complainantWorkerId: data.complainantWorkerId,
      respondentWorkerId: data.respondentWorkerId,
      witnessesText: data.witnessesText,
      incidentDates: data.incidentDates,
      incidentLocation: data.incidentLocation,
      factsDescription: data.factsDescription,
      evidences: data.evidences || [],
      examDeadline: addDays(8),
      hearingsDeadline: addDays(15),
      dialogueDeadline: addDays(25),
      resolutionDeadline: addDays(60),
      extensions: [],
      followUps: [],
      timeline: [
        {
          date: nowTime,
          action: 'Recepción y radicación formal de presunta queja de convivencia',
          responsible: 'Secretaría del CCL',
          newStatus: 'RECIBIDA',
          notes: 'Asignación de código confidencial y apertura de expediente reservado bajo amparo de la Resolución 3461 de 2025.'
        }
      ]
    };

    setTasks(prev => [
      {
        id: `tsk-ccl-${Date.now()}`,
        title: `Actuación confidencial requerida - Expediente ${caseCode}`,
        module: 'SST',
        type: 'REPORTE',
        dueDate: addDays(8),
        priority: 'ALTA',
        status: 'PENDIENTE',
        responsible: 'Secretario/a CCL',
        siteName: organization.sites[0]?.name || 'Sede Principal',
        linkedId: caseCode
      },
      ...prev
    ]);

    setCclState(prev => ({
      ...prev,
      complaints: [newCase, ...prev.complaints]
    }));

    showNotification(`Caso ${caseCode} radicado confidencialmente bajo la Resolución 3461 de 2025`, 'success');
    return newCase;
  };

  const updateCclComplaintStage = (caseId: string, newStage: CclComplaintStatus, notes?: string, nextDueDate?: string) => {
    if (blockedByDemo()) return;
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setCclState(prev => ({
      ...prev,
      complaints: prev.complaints.map(c => {
        if (c.id !== caseId) return c;
        const prevStatus = c.status;
        const updatedTimeline = [
          {
            date: nowTime,
            action: `Transición procesal a: ${newStage.replace(/_/g, ' ')}`,
            responsible: 'Comité de Convivencia Laboral',
            previousStatus: prevStatus,
            newStatus: newStage,
            notes: notes || 'Actuación reglamentaria registrada en el expediente confidencial.'
          },
          ...c.timeline
        ];

        return {
          ...c,
          status: newStage,
          timeline: updatedTimeline,
          ...(nextDueDate ? { resolutionDeadline: nextDueDate } : {})
        };
      })
    }));

    showNotification(`Etapa del caso actualizada a: ${newStage.replace(/_/g, ' ')}`, 'info');
  };

  const recordCclHearing = (caseId: string, party: 'complainant' | 'respondent', hearingData: CclHearingRecord) => {
    if (blockedByDemo()) return;
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setCclState(prev => ({
      ...prev,
      complaints: prev.complaints.map(c => {
        if (c.id !== caseId) return c;
        const currentHearings = c.hearings || {};
        const partyLabel = party === 'complainant' ? 'Parte que presenta la queja (Parte A)' : 'Parte involucrada (Parte B)';

        return {
          ...c,
          hearings: {
            ...currentHearings,
            [party]: hearingData
          },
          timeline: [
            {
              date: nowTime,
              action: `Audiencia de escucha individual: ${partyLabel}`,
              responsible: hearingData.recordedBy || 'Comité de Convivencia Laboral',
              newStatus: c.status,
              notes: 'Diligencia de escucha confidencial y separada realizada con garantía de debido proceso y no revictimización.'
            },
            ...c.timeline
          ]
        };
      })
    }));

    showNotification('Audiencia de escucha confidencial registrada en el expediente', 'success');
  };

  const recordCclDialogueSession = (caseId: string, sessionData: { date: string; attendees: string[]; summary: string; agreementReached: boolean; actCode?: string }) => {
    if (blockedByDemo()) return;
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setCclState(prev => ({
      ...prev,
      complaints: prev.complaints.map(c => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          dialogueSession: sessionData,
          status: sessionData.agreementReached ? 'PLAN_MEJORA' : 'DIALOGO_CONCERTACION',
          timeline: [
            {
              date: nowTime,
              action: 'Sesión conjunta de diálogo y concertación',
              responsible: 'Presidente y Secretaria CCL',
              newStatus: sessionData.agreementReached ? 'PLAN_MEJORA' : 'DIALOGO_CONCERTACION',
              notes: sessionData.agreementReached 
                ? 'Espacio de concertación finalizado con acuerdos y suscripción de compromisos de mejora.' 
                : 'Sesión de diálogo adelantada sin concertación total; continúa deliberación preventiva.'
            },
            ...c.timeline
          ]
        };
      })
    }));

    showNotification('Espacio de diálogo y concertación registrado en el expediente', 'success');
  };

  const addCclCommitment = (caseId: string, commitmentData: Omit<CclCommitmentItem, 'id' | 'status'>) => {
    if (blockedByDemo()) return;
    const commitmentId = `cmt-ccl-${Date.now()}`;
    const newCommitment: CclCommitmentItem = {
      ...commitmentData,
      id: commitmentId,
      status: 'PENDIENTE'
    };

    setTasks(prev => [
      {
        id: `tsk-cmt-${Date.now()}`,
        title: `Compromiso de mejora CCL - Expediente ${caseId}`,
        module: 'SST',
        type: 'ACPM',
        dueDate: commitmentData.dueDate,
        priority: 'MEDIA',
        status: 'PENDIENTE',
        responsible: commitmentData.responsibleName,
        siteName: organization.sites[0]?.name || 'Sede Principal',
        linkedId: caseId
      },
      ...prev
    ]);

    setCclState(prev => ({
      ...prev,
      complaints: prev.complaints.map(c => {
        if (c.id !== caseId) return c;
        const currentPlan = c.improvementPlan || { commitments: [], recommendationsToOrganization: [], approvedAt: new Date().toISOString().split('T')[0] };
        return {
          ...c,
          improvementPlan: {
            ...currentPlan,
            commitments: [...currentPlan.commitments, newCommitment]
          }
        };
      })
    }));

    showNotification('Compromiso de mejora agregado y vinculado al Centro de Tareas');
  };

  const toggleCclCommitmentStatus = (caseId: string, commitmentId: string, newStatus: CclCommitmentItem['status']) => {
    if (blockedByDemo()) return;
    setCclState(prev => ({
      ...prev,
      complaints: prev.complaints.map(c => {
        if (c.id !== caseId || !c.improvementPlan) return c;
        return {
          ...c,
          improvementPlan: {
            ...c.improvementPlan,
            commitments: c.improvementPlan.commitments.map(item => item.id === commitmentId ? { ...item, status: newStatus } : item)
          }
        };
      })
    }));
    showNotification(`Estado de compromiso actualizado a: ${newStatus}`);
  };

  const addCclFollowUp = (caseId: string, followUpData: Omit<CclFollowUpRecord, 'id'>) => {
    if (blockedByDemo()) return;
    const followUpId = `flw-ccl-${Date.now()}`;
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const record: CclFollowUpRecord = {
      ...followUpData,
      id: followUpId
    };

    setCclState(prev => ({
      ...prev,
      complaints: prev.complaints.map(c => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          status: 'EN_SEGUIMIENTO',
          followUps: [...c.followUps, record],
          timeline: [
            {
              date: nowTime,
              action: 'Sesión de verificación y seguimiento de compromisos',
              responsible: followUpData.conductedBy,
              newStatus: 'EN_SEGUIMIENTO',
              notes: followUpData.observations
            },
            ...c.timeline
          ]
        };
      })
    }));

    showNotification('Seguimiento periódico registrado en el expediente');
  };

  const closeCclComplaint = (
    caseId: string,
    closureData: {
      reason: NonNullable<CclComplaintCase['closure']>['closureReason'];
      summary: string;
      generateAcpmAction?: boolean;
      acpmDescription?: string;
    }
  ) => {
    if (blockedByDemo()) return;
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let linkedAcpmId: string | undefined = undefined;

    if (closureData.generateAcpmAction) {
      linkedAcpmId = addFinding({
        title: `[CCL Prevención] ${closureData.acpmDescription || 'Plan institucional de intervención psicosocial y convivencia'}`,
        originModule: 'SST',
        originType: 'ROUTINE',
        originDetail: `Recomendación preventiva institucional derivada de la gestión del CCL (Res. 3461/2025)`,
        siteName: organization.sites[0]?.name || 'Sede Principal',
        processName: 'Gestión Humana y Convivencia',
        description: closureData.acpmDescription || closureData.summary,
        legalCriterion: 'Resolución 3461 de 2025 y Decreto 1072 de 2015 Art. 2.2.4.6.8',
        severity: 'MENOR',
        status: 'EN_ACPM',
        reportedBy: 'Comité de Convivencia Laboral'
      }, true);
    }

    const finalStatus: CclComplaintStatus = 
      closureData.reason === 'REMITIDO_ALTA_DIRECCION' || closureData.reason === 'REMITIDO_MINTRABAJO' 
        ? 'REMITIDA' 
        : closureData.reason === 'ARCHIVO_BAJO_RESERVA' 
        ? 'ARCHIVADA_RESERVA' 
        : 'CERRADA';

    setCclState(prev => ({
      ...prev,
      complaints: prev.complaints.map(c => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          status: finalStatus,
          closure: {
            closedDate: today,
            closureReason: closureData.reason,
            closureSummary: closureData.summary,
            sentToAcpm: Boolean(closureData.generateAcpmAction),
            acpmActionId: linkedAcpmId
          },
          timeline: [
            {
              date: nowTime,
              action: `Cierre formal del caso: ${closureData.reason.replace(/_/g, ' ')}`,
              responsible: 'Comité de Convivencia Laboral',
              newStatus: finalStatus,
              notes: closureData.summary
            },
            ...c.timeline
          ]
        };
      })
    }));

    showNotification(`Expediente ${caseId} cerrado formalmente bajo custodia reservada`, 'success');
  };

  const registerCclCandidate = (workerId: string, proposalBrief?: string): { success: boolean; message: string } => {
    if (blockedByDemo()) return { success: false, message: 'Función en modo demostración' };
    const wrk = workers.find(w => w.id === workerId);
    if (!wrk) return { success: false, message: 'Trabajador no encontrado en la Base Maestra.' };

    const hasPendingComplaint = cclState.complaints.some(
      c => (c.complainantWorkerId === workerId || c.respondentWorkerId === workerId) && c.status !== 'ARCHIVADA_RESERVA'
    );

    if (hasPendingComplaint) {
      return {
        success: false,
        message: 'No es elegible: El trabajador presenta una causal de inhabilidad reglamentada en la Resolución 3461 de 2025 (involucrado en presunta queja de convivencia laboral en el periodo legal).'
      };
    }

    const candidateId = `cand-ccl-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const newCandidate = {
      id: candidateId,
      workerId: wrk.id,
      workerName: `${wrk.firstName} ${wrk.lastName}`,
      workerDocNumber: wrk.docNumber,
      workerPosition: wrk.position,
      workerArea: wrk.area,
      photoUrl: wrk.photoUrl,
      registrationDate: today,
      proposalBrief: proposalBrief || 'Compromiso firme con la imparcialidad, el diálogo asertivo y la sana convivencia laboral.',
      eligibilityValidated: true,
      status: 'HABILITADO' as const,
      votesCount: 0,
      isElected: false
    };

    setCclState(prev => ({
      ...prev,
      election: {
        ...prev.election,
        candidates: [...prev.election.candidates, newCandidate]
      }
    }));

    showNotification(`Postulación de ${wrk.firstName} ${wrk.lastName} admitida y habilitada`, 'success');
    return { success: true, message: 'Postulación registrada exitosamente con validación de inhabilidad aprobada.' };
  };

  const castCclVote = (voterDocNumber: string, candidateId: string): { success: boolean; message: string } => {
    if (blockedByDemo()) return { success: false, message: 'Función en modo demo' };
    if (!cclState.election.isVotingOpen || cclState.election.isClosed) {
      return { success: false, message: 'El periodo electoral no se encuentra activo o ya fue cerrado.' };
    }

    const voter = workers.find(w => w.docNumber.trim() === voterDocNumber.trim());
    if (!voter) {
      return { success: false, message: 'El número de identificación no pertenece al censo de trabajadores de la empresa.' };
    }

    const alreadyVoted = cclState.election.voterAuditLog.some(log => log.voterDocNumber.trim() === voterDocNumber.trim());
    if (alreadyVoted) {
      return { success: false, message: 'Usted ya ha ejercido su derecho al voto en esta jornada electoral.' };
    }

    const now = new Date().toISOString();
    const auditEntry = {
      voterDocNumber: voterDocNumber.trim(),
      votedAt: now,
      ipAddress: '192.168.1.xxx'
    };

    setCclState(prev => {
      const isBlank = candidateId === 'BLANCO';
      const updatedCandidates = prev.election.candidates.map(cand => {
        if (cand.id === candidateId) {
          return { ...cand, votesCount: cand.votesCount + 1 };
        }
        return cand;
      });

      return {
        ...prev,
        election: {
          ...prev.election,
          votesSubmitted: prev.election.votesSubmitted + 1,
          blankVotes: isBlank ? prev.election.blankVotes + 1 : prev.election.blankVotes,
          voterAuditLog: [...prev.election.voterAuditLog, auditEntry],
          candidates: updatedCandidates
        }
      };
    });

    return { success: true, message: 'Su voto secreto ha sido depositado y certificado legalmente.' };
  };

  const closeCclElection = () => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const sorted = [...cclState.election.candidates].sort((a, b) => b.votesCount - a.votesCount);
    const updatedCandidates = sorted.map((cand, index) => {
      if (index === 0) {
        return { ...cand, isElected: true, electedRole: 'PRINCIPAL' as const };
      } else if (index === 1) {
        return { ...cand, isElected: true, electedRole: 'SUPLENTE' as const };
      }
      return { ...cand, isElected: false };
    });

    const newMembers = [...cclState.members];
    if (updatedCandidates[0]) {
      const idx = newMembers.findIndex(m => m.party === 'TRABAJADORES' && m.isPrincipal);
      if (idx !== -1) {
        newMembers[idx] = { ...newMembers[idx], workerId: updatedCandidates[0].workerId };
      }
    }
    if (updatedCandidates[1]) {
      const idx = newMembers.findIndex(m => m.party === 'TRABAJADORES' && !m.isPrincipal);
      if (idx !== -1) {
        newMembers[idx] = { ...newMembers[idx], workerId: updatedCandidates[1].workerId };
      }
    }

    setCclState(prev => ({
      ...prev,
      members: newMembers,
      election: {
        ...prev.election,
        isVotingOpen: false,
        isClosed: true,
        closedAt: now,
        resultsPublished: true,
        candidates: updatedCandidates
      }
    }));

    showNotification('Jornada electoral del CCL cerrada. Escrutinio oficial generado e inmutable.', 'success');
  };

  const setEmployerCclRepresentatives = (principalWorkerId: string, alternateWorkerId: string) => {
    if (blockedByDemo()) return;
    const today = new Date().toISOString().split('T')[0];

    setCclState(prev => {
      const updatedMembers = prev.members.map(m => {
        if (m.party === 'EMPLEADOR' && m.isPrincipal) {
          return { ...m, workerId: principalWorkerId, appointmentDate: today };
        }
        if (m.party === 'EMPLEADOR' && !m.isPrincipal) {
          return { ...m, workerId: alternateWorkerId, appointmentDate: today };
        }
        return m;
      });

      return {
        ...prev,
        members: updatedMembers
      };
    });

    showNotification('Representantes del empleador ante el CCL designados mediante carta oficial');
  };

  const signCclConfidentiality = (workerId: string) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const token = `CONF-CCL-${workerId.slice(-4)}-${Date.now().toString(36).toUpperCase()}`;

    setCclState(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.workerId === workerId) {
          return {
            ...m,
            signedConfidentialityAgreement: true,
            confidentialitySignedAt: now,
            confidentialityToken: token
          };
        }
        return m;
      }),
      confidentialityAgreements: {
        ...prev.confidentialityAgreements,
        [workerId]: {
          signed: true,
          signedAt: now,
          token
        }
      }
    }));

    showNotification('Carta de confidencialidad y reserva procesal firmada electrónicamente con validez legal');
  };

  const addCclMeeting = (meetingData: Omit<CclMeeting, 'id' | 'actaCode' | 'membersSignatures' | 'isClosed'>): CclMeeting => {
    const year = new Date().getFullYear();
    const count = (cclState.meetings.length + 1).toString().padStart(2, '0');
    const actaCode = `ACTA-CCL-${meetingData.type === 'ORDINARIA' ? 'ORD' : 'EXT'}-${year}-${count}`;

    const newMeeting: CclMeeting = {
      ...meetingData,
      id: `mtg-ccl-${Date.now()}`,
      actaCode,
      membersSignatures: cclState.members.map(m => {
        const wrk = workers.find(w => w.id === m.workerId);
        return {
          workerId: m.workerId,
          memberName: wrk ? `${wrk.firstName} ${wrk.lastName}` : 'Integrante CCL',
          role: m.role,
          party: m.party,
          signed: false
        };
      }),
      isClosed: false
    };

    setCclState(prev => ({
      ...prev,
      meetings: [newMeeting, ...prev.meetings]
    }));

    showNotification(`Reunión ${actaCode} convocada y registrada en el cronograma trimestral`);
    return newMeeting;
  };

  const updateCclMeeting = (meetingId: string, updatedData: Partial<CclMeeting>) => {
    if (blockedByDemo()) return;
    setCclState(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => m.id === meetingId ? { ...m, ...updatedData } : m)
    }));
    showNotification('Acta del Comité de Convivencia Laboral actualizada');
  };

  const signCclMeetingMember = (meetingId: string, workerId: string) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const token = `SIG-CCL-${workerId.slice(-4)}-${Date.now().toString(36).toUpperCase()}`;

    setCclState(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => {
        if (m.id !== meetingId) return m;
        const updatedSigs = m.membersSignatures.map(sig => {
          if (sig.workerId === workerId) {
            return {
              ...sig,
              signed: true,
              signedAt: now,
              signatureToken: token
            };
          }
          return sig;
        });

        const allSigned = updatedSigs.length > 0 && updatedSigs.every(s => s.signed);
        return {
          ...m,
          membersSignatures: updatedSigs,
          isClosed: allSigned
        };
      })
    }));

    showNotification('Firma electrónica de integrante del CCL registrada legalmente', 'success');
  };

  const signCclMeetingAllMembers = (meetingId: string) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setCclState(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => {
        if (m.id !== meetingId) return m;
        const updatedSigs = m.membersSignatures.map(sig => ({
          ...sig,
          signed: true,
          signedAt: sig.signedAt || now,
          signatureToken: sig.signatureToken || `SIG-CCL-${sig.workerId.slice(-4)}-${Date.now().toString(36).toUpperCase()}`
        }));

        return {
          ...m,
          membersSignatures: updatedSigs,
          isClosed: true
        };
      })
    }));

    showNotification('Todas las firmas de los integrantes del CCL formalizadas en el acta', 'success');
  };

  const uploadScannedCclMeetingAct = (meetingId: string, fileData: { fileName: string; fileBase64: string; fileSize: string }) => {
    if (blockedByDemo()) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setCclState(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          scannedActFileName: fileData.fileName,
          scannedActUrl: fileData.fileBase64,
          scannedActUploadDate: now,
          isClosed: true
        };
      })
    }));

    showNotification(`Acta escaneada "${fileData.fileName}" custodiada digitalmente`, 'success');
  };

  const updateCclRegulation = (newText: string) => {
    if (blockedByDemo()) return;
    setCclState(prev => ({
      ...prev,
      reglamentoText: newText,
      reglamentoVersion: '02'
    }));
    showNotification('Reglamento Interno del CCL actualizado y versionado', 'success');
  };

  const updateCclDocumentNotes = (docType: string, notes: string) => {
    if (blockedByDemo()) return;
    setCclState(prev => ({
      ...prev,
      documentNotes: {
        ...prev.documentNotes,
        [docType]: notes
      }
    }));
    showNotification('Observaciones y personalización del documento guardadas', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        // Caracterización Inteligente & Motor de Aplicabilidad
        characterization,
        applicabilityProfile,
        validationDecisions,
        characterizationHistory,
        updateCharacterization,
        applyCharacterizationToPlatform,
        addValidationDecision,
        loadCharacterizationArchetype,
        isCharacterizationWizardOpen,
        setIsCharacterizationWizardOpen,
        activeWizardStep,
        setActiveWizardStep,

        draftSavedAt,
        draftVersion,
        restoredDraftStep,
        saveWizardModules,
        resetCharacterizationDraft,

        // Portal View, Checkout & Email
        portalView,
        setPortalView,
        lastActivationEmail,
        sendActivationEmail,
        isEmailModalOpen,
        setIsEmailModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,

        organization,
        updateOrganization,
        toggleModule,
        activeTab,
        setActiveTab: guardedSetActiveTab,
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

        // Base Maestra de Trabajadores
        workers,
        addWorker,
        updateWorker,
        recordLaborChange,
        addWorkerDocument,
        recordEppDelivery,
        recordTrainingAttendance,
        recordCommitteeAssignment,
        recordOccupationalExam,
        deleteWorker,
        getWorkerById,
        getWorkerByDoc,
        assignWorkerAsSstResponsible,

        sstHazards,
        addSstHazard,
        sstStandards,
        updateStandardStatus,
        attachEvidenceToStandard,
        sstResponsible,
        updateSstResponsible,
        sstBudgetItems,
        addSstBudgetItem,
        updateSstBudgetItem,
        deleteSstBudgetItem,
        sstBudgetState,
        updateSstBudgetApproval,
        flagBudgetItemObservation,
        resolveBudgetItemObservation,
        signBudgetParty,
        addCopasstBudgetReview,
        updateFinancialOfficerConfig,
        currentSimulatedRole,
        setCurrentSimulatedRole,

        // Seguridad Social & PILA
        pilaRecords,
        addPilaRecord,
        deletePilaRecord,

        // COPASST / Vigía de SST
        copasstState,
        setCopasstMechanism,
        updateVigiaProfile,
        addVigiaActuation,
        registerCopasstCandidate,
        castCopasstVote,
        closeCopasstElection,
        setEmployerRepresentatives,
        saveCopasstConformationAct,
        saveCopasstInstallationAct,
        addCopasstMeeting,
        updateCopasstMeeting,
        signMeetingMember,
        signMeetingAllMembers,
        uploadScannedMeetingAct,
        updateCopasstDocumentNotes,
        toggleCopasstCommitmentStatus,
        createCopasstFinding,
        addCopasstTraining,

        // Comité de Convivencia Laboral - CCL (Estándar 1.1.8 - Resolución 3461 de 2025)
        cclState,
        registerCclComplaint,
        updateCclComplaintStage,
        recordCclHearing,
        recordCclDialogueSession,
        addCclCommitment,
        toggleCclCommitmentStatus,
        addCclFollowUp,
        closeCclComplaint,
        registerCclCandidate,
        castCclVote,
        closeCclElection,
        setEmployerCclRepresentatives,
        signCclConfidentiality,
        signCclMeetingMember,
        signCclMeetingAllMembers,
        uploadScannedCclMeetingAct,
        addCclMeeting,
        updateCclMeeting,
        updateCclRegulation,
        updateCclDocumentNotes,

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
