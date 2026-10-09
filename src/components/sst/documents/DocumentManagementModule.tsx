'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import {
  ControlledDocument,
  DocumentControlProcedure,
  ProcedureSection,
  DocumentTypeCatalogItem,
  DocumentProcessCatalogItem
} from '@/types/document-management';
import {
  FolderArchive,
  FileText,
  FileCheck2,
  Settings,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Download,
  Printer,
  ExternalLink,
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Edit3,
  RotateCcw,
  Save,
  Trash2,
  Building2,
  Users,
  Lock,
  Calendar,
  Sparkles,
  ArrowRight,
  Layers,
  FileSpreadsheet,
  FileCode,
  Tag,
  Check
} from 'lucide-react';

interface DocumentManagementModuleProps {
  initialTab?: 'REPOSITORY' | 'PROCEDURE' | 'CODING' | 'RETENTION';
  onNavigateToModule?: (targetTab: string, sstSubTab?: string) => void;
}

export const DocumentManagementModule: React.FC<DocumentManagementModuleProps> = ({
  initialTab = 'REPOSITORY',
  onNavigateToModule
}) => {
  const {
    organization,
    documentManagementState,
    updateControlProcedureSection,
    resetControlProcedureSectionToDefault,
    updateControlProcedureApproval,
    approveDocumentControlProcedure,
    addControlledDocument,
    updateControlledDocument,
    createNewDocumentVersion,
    addExternalDocument,
    addDocumentTypeCatalog,
    addDocumentProcessCatalog,
    updateDocumentTypeCatalog,
    updateDocumentProcessCatalog,
    showNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<'REPOSITORY' | 'PROCEDURE' | 'CODING' | 'RETENTION'>(initialTab);

  // Filters for Repository
  const [searchQuery, setSearchQuery] = useState('');
  const [systemFilter, setSystemFilter] = useState<string>('ALL');
  const [processFilter, setProcessFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [retentionFilter, setRetentionFilter] = useState<'ALL' | '20_YEARS' | 'OTHER'>('ALL');

  // Modals state
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<ControlledDocument | null>(null);
  const [selectedDocForNewVersion, setSelectedDocForNewVersion] = useState<ControlledDocument | null>(null);
  const [isExternalDocModalOpen, setIsExternalDocModalOpen] = useState(false);
  const [isApproveProcedureModalOpen, setIsApproveProcedureModalOpen] = useState(false);
  const [isPrintProcedureView, setIsPrintProcedureView] = useState(false);
  const [isPrintMasterListView, setIsPrintMasterListView] = useState(false);

  // New Version Form State
  const [newVersionSummary, setNewVersionSummary] = useState('');
  const [newVersionApprover, setNewVersionApprover] = useState('Lic. Fernando Ortiz Salazar (Gerente General)');

  // External Doc Form State
  const [extTitle, setExtTitle] = useState('');
  const [extDescription, setExtDescription] = useState('');
  const [extSystem, setExtSystem] = useState<ControlledDocument['system']>('SGSST');
  const [extProcessId, setExtProcessId] = useState('GEN');
  const [extTypeId, setExtTypeId] = useState('RG');
  const [extSource, setExtSource] = useState('');
  const [extIssueDate, setExtIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [extCode, setExtCode] = useState('');
  const [extResponsible, setExtResponsible] = useState('Líder SG-SST');
  const [extRetentionYears, setExtRetentionYears] = useState(5);
  const [extRetentionBasis, setExtRetentionBasis] = useState('Registro externo de cumplimiento legal y operativo');
  const [extConfidentiality, setExtConfidentiality] = useState<ControlledDocument['confidentiality']>('INTERNO');
  const [extLocation, setExtLocation] = useState('Repositorio Central AGAE (Nube Segura)');

  // Procedure Editing State
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionContent, setEditingSectionContent] = useState('');

  // Approval Form State
  const [approvalName, setApprovalName] = useState('Lic. Fernando Ortiz Salazar');
  const [approvalRole, setApprovalRole] = useState('Representante Legal / Gerente General');

  // New Type / Process catalog form states
  const [newTypePrefix, setNewTypePrefix] = useState('');
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');

  const [newProcessCode, setNewProcessCode] = useState('');
  const [newProcessName, setNewProcessName] = useState('');
  const [newProcessDesc, setNewProcessDesc] = useState('');

  // Simulator State
  const [simType, setSimType] = useState('AC');
  const [simSystem, setSimSystem] = useState<'SGSST' | 'AMBIENTAL' | 'PESV' | 'CALIDAD' | 'GENERAL'>('SGSST');
  const [simProcess, setSimProcess] = useState('COP');

  // Catalogs
  const typeCatalog = documentManagementState.typeCatalog || [];
  const processCatalog = documentManagementState.processCatalog || [];

  // Helper maps for Catalogs
  const typeMap = useMemo(() => {
    const map = new Map<string, string>();
    typeCatalog.forEach(t => map.set(t.code, t.name));
    return map;
  }, [typeCatalog]);

  const processMap = useMemo(() => {
    const map = new Map<string, string>();
    processCatalog.forEach(p => map.set(p.code, p.name));
    return map;
  }, [processCatalog]);

  // Filtered Documents
  const filteredDocuments = useMemo(() => {
    return documentManagementState.documents.filter(doc => {
      const pCode = doc.processCode || doc.processId || '';
      const tCode = doc.typeCode || doc.documentTypeId || '';
      const is20Y = doc.retentionYears >= 20 || Boolean(doc.isMandatory20Years);

      if (systemFilter !== 'ALL' && doc.system !== systemFilter) return false;
      if (processFilter !== 'ALL' && pCode !== processFilter) return false;
      if (typeFilter !== 'ALL' && tCode !== typeFilter) return false;
      if (statusFilter !== 'ALL' && doc.status !== statusFilter) return false;
      if (retentionFilter === '20_YEARS' && !is20Y) return false;
      if (retentionFilter === 'OTHER' && is20Y) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const responsible = doc.responsible || doc.responsibleRole || '';
        const matchesCode = doc.code.toLowerCase().includes(q);
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesResp = responsible.toLowerCase().includes(q);
        const matchesProc = (processMap.get(pCode) || '').toLowerCase().includes(q);
        const matchesType = (typeMap.get(tCode) || '').toLowerCase().includes(q);
        if (!matchesCode && !matchesTitle && !matchesResp && !matchesProc && !matchesType) {
          return false;
        }
      }

      return true;
    });
  }, [documentManagementState.documents, systemFilter, processFilter, typeFilter, statusFilter, retentionFilter, searchQuery, processMap, typeMap]);

  // Handlers
  const handleStartEditSection = (section: ProcedureSection) => {
    setEditingSectionId(section.id);
    setEditingSectionContent(section.content);
  };

  const handleSaveSection = (sectionId: string) => {
    updateControlProcedureSection(sectionId, editingSectionContent);
    setEditingSectionId(null);
  };

  const handleCancelEditSection = () => {
    setEditingSectionId(null);
    setEditingSectionContent('');
  };

  const handleCreateNewVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocForNewVersion) return;
    if (!newVersionSummary.trim()) {
      showNotification('Debe ingresar el motivo o resumen del cambio de versión', 'warning');
      return;
    }
    createNewDocumentVersion(selectedDocForNewVersion.id, newVersionSummary, newVersionApprover);
    setSelectedDocForNewVersion(null);
    setNewVersionSummary('');
  };

  const handleCreateExternalDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extTitle.trim()) {
      showNotification('Debe ingresar el título del documento externo', 'warning');
      return;
    }
    addExternalDocument({
      title: extTitle,
      description: extDescription,
      system: extSystem,
      processId: extProcessId,
      documentTypeId: extTypeId,
      responsible: extResponsible,
      externalSource: extSource || 'Entidad Externa / Tercero',
      externalIssueDate: extIssueDate,
      externalCode: extCode || undefined,
      retentionYears: extRetentionYears,
      retentionBasis: extRetentionBasis,
      confidentiality: extConfidentiality,
      physicalLocation: extLocation
    });
    setIsExternalDocModalOpen(false);
    setExtTitle('');
    setExtDescription('');
    setExtSource('');
    setExtCode('');
  };

  const handleApproveProcedure = () => {
    approveDocumentControlProcedure(approvalName, approvalRole);
    setIsApproveProcedureModalOpen(false);
  };

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrefix = newTypePrefix.trim().toUpperCase();
    if (!cleanPrefix || !newTypeName.trim()) return;
    addDocumentTypeCatalog({
      id: `type-${cleanPrefix}`,
      code: cleanPrefix,
      prefix: cleanPrefix,
      name: newTypeName.trim(),
      description: newTypeDesc.trim(),
      isActive: true
    });
    setNewTypePrefix('');
    setNewTypeName('');
    setNewTypeDesc('');
  };

  const handleAddProcess = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newProcessCode.trim().toUpperCase();
    if (!cleanCode || !newProcessName.trim()) return;
    addDocumentProcessCatalog({
      id: `proc-${cleanCode}`,
      code: cleanCode,
      name: newProcessName.trim(),
      description: newProcessDesc.trim(),
      isActive: true
    });
    setNewProcessCode('');
    setNewProcessName('');
    setNewProcessDesc('');
  };

  // Export CSV (Excel)
  const handleExportCSV = () => {
    const headers = [
      'Código',
      'Nombre del Documento',
      'Sistema de Gestión',
      'Proceso',
      'Tipo Documental',
      'Módulo de Origen',
      'Versión Vigente',
      'Estado',
      'Responsable Custodia',
      'Retención (Años)',
      'Regla 20 Años (Dec 1072)',
      'Fundamento de Retención',
      'Ubicación',
      'Nivel Confidencialidad',
      'Fecha Creación',
      'Fecha Aprobación',
      'Es Externo'
    ];

    const rows = filteredDocuments.map(doc => {
      const pCode = doc.processCode || doc.processId || '';
      const tCode = doc.typeCode || doc.documentTypeId || '';
      const resp = doc.responsible || doc.responsibleRole || '';
      const retBasis = doc.retentionBasis || doc.retentionLegalBasis || '';
      const loc = doc.physicalLocation || 'Archivo Central AGAE';
      const is20Y = doc.retentionYears >= 20 || Boolean(doc.isMandatory20Years);
      const isExt = Boolean(doc.isExternalDocument || doc.isExternal);

      return [
        `"${doc.code}"`,
        `"${doc.title.replace(/"/g, '""')}"`,
        `"${doc.system}"`,
        `"${processMap.get(pCode) || pCode}"`,
        `"${typeMap.get(tCode) || tCode}"`,
        `"${doc.originModule}"`,
        `"${doc.currentVersion}"`,
        `"${doc.status}"`,
        `"${resp}"`,
        `"${doc.retentionYears}"`,
        `"${is20Y ? 'SÍ (Art. 2.2.4.6.13)' : 'NO'}"`,
        `"${retBasis.replace(/"/g, '""')}"`,
        `"${loc.replace(/"/g, '""')}"`,
        `"${doc.confidentiality}"`,
        `"${doc.createdDate || doc.createdAt || ''}"`,
        `"${doc.approvedDate || doc.approvedAt || 'N/A'}"`,
        `"${isExt ? 'SÍ' : 'NO'}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Listado_Maestro_Documental_${organization.nit || 'AGAE'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Listado Maestro exportado exitosamente a formato Excel (CSV)', 'success');
  };

  const handleNavigateToOrigin = (doc: ControlledDocument) => {
    if (!onNavigateToModule) return;
    switch (doc.originModule) {
      case 'SST_POLICY':
        onNavigateToModule('sst', 'POLICY');
        break;
      case 'SST_EVALUATION':
        onNavigateToModule('sst', 'EVALUATION');
        break;
      case 'COPASST':
        onNavigateToModule('sst', 'COMMITTEES');
        break;
      case 'CCL':
        onNavigateToModule('sst', 'CCL');
        break;
      case 'CAPACITACION':
        onNavigateToModule('sst', 'TRAINING');
        break;
      case 'PRESUPUESTO':
        onNavigateToModule('sst', 'BUDGET');
        break;
      case 'MATRIZ_PELIGROS':
        onNavigateToModule('sst', 'MATRIX');
        break;
      case 'INSPECCIONES':
        onNavigateToModule('sst', 'INSPECTIONS');
        break;
      case 'TRABAJADORES':
        onNavigateToModule('workers');
        break;
      case 'ACPM':
        onNavigateToModule('acpm');
        break;
      case 'AUDITORIAS':
        onNavigateToModule('audits');
        break;
      default:
        showNotification(`El documento ${doc.code} reside y se custodia en el módulo central de Documentos`, 'info');
    }
  };

  const metrics = documentManagementState.metrics || {
    totalDocuments: documentManagementState.documents.length,
    activeDocuments: documentManagementState.documents.filter(d => d.status === 'VIGENTE').length,
    draftDocuments: documentManagementState.documents.filter(d => d.status === 'EN_ELABORACION').length,
    mandatory20YearsCount: documentManagementState.documents.filter(d => d.retentionYears >= 20 || Boolean(d.isMandatory20Years)).length,
    externalDocuments: documentManagementState.documents.filter(d => Boolean(d.isExternalDocument || d.isExternal)).length,
    obsoleteDocuments: documentManagementState.documents.filter(d => d.status === 'OBSOLETO').length
  };

  return (
    <div className="space-y-6">
      {/* HEADER PRINCIPAL DEL MÓDULO */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Estándar 2.2.1 • Decreto 1072/2015 Art. 2.2.4.6.12 y 2.2.4.6.13
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <Check className="w-3 h-3" />
                {documentManagementState.procedure.status === 'VIGENTE' ? 'Procedimiento Vigente' : 'En Elaboración'}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <FolderArchive className="w-7 h-7 text-indigo-400" />
              <span>Archivo y Retención Documental Transversal</span>
            </h1>
            <p className="text-xs text-indigo-200/90 mt-1 max-w-3xl leading-relaxed">
              Sistema integral de control documental para <strong>{organization.name}</strong>. Genera el procedimiento de control editable, codifica automáticamente series documentales, consolida todos los registros generados en la plataforma y garantiza la retención mínima obligatoria de <strong>20 años</strong> bajo el Art. 2.2.4.6.13 del Decreto 1072 de 2015.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {documentManagementState.procedure.status !== 'VIGENTE' ? (
              <button
                onClick={() => setIsApproveProcedureModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Aprobar y Formalizar Procedimiento</span>
              </button>
            ) : (
              <div className="px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Procedimiento Formalizado (PR-SGSST-GEN-001)</span>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION SUBTABS */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-indigo-900/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab('REPOSITORY')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'REPOSITORY'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-indigo-200 hover:text-white hover:bg-indigo-900/40'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>Repositorio & Listado Maestro ({documentManagementState.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PROCEDURE')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'PROCEDURE'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-indigo-200 hover:text-white hover:bg-indigo-900/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Procedimiento de Control Documental (PR-SGSST-GEN-001)</span>
          </button>

          <button
            onClick={() => setActiveTab('CODING')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'CODING'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-indigo-200 hover:text-white hover:bg-indigo-900/40'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Configuración de Codificación & Catálogos</span>
          </button>

          <button
            onClick={() => setActiveTab('RETENTION')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'RETENTION'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-indigo-200 hover:text-white hover:bg-indigo-900/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Matriz de Retención Legal (20 Años - Dec. 1072)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUBTAB 1: REPOSITORIO & LISTADO MAESTRO DOCUMENTAL */}
      {/* ============================================================== */}
      {activeTab === 'REPOSITORY' && (
        <div className="space-y-6">
          {/* KPI CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Documentos</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{metrics.totalDocuments}</div>
              <span className="text-[10px] text-slate-500">Series activas en sistema</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Vigentes</span>
              <div className="text-2xl font-black text-emerald-950 mt-1">{metrics.activeDocuments}</div>
              <span className="text-[10px] text-emerald-700 font-semibold">Uso operativo autorizado</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">En Elaboración</span>
              <div className="text-2xl font-black text-amber-950 mt-1">{metrics.draftDocuments ?? 0}</div>
              <span className="text-[10px] text-amber-700">En revisión o ajuste</span>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Retención 20 Años</span>
              <div className="text-2xl font-black text-indigo-950 mt-1">{metrics.mandatory20YearsCount ?? 0}</div>
              <span className="text-[10px] text-indigo-700 font-semibold">Art. 2.2.4.6.13 Dec 1072</span>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 shadow-sm">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Origen Externo</span>
              <div className="text-2xl font-black text-purple-950 mt-1">{metrics.externalDocuments}</div>
              <span className="text-[10px] text-purple-700">Normas, guías y ARL</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Obsoletos / Historial</span>
              <div className="text-2xl font-black text-slate-800 mt-1">{metrics.obsoleteDocuments}</div>
              <span className="text-[10px] text-slate-500">Trazabilidad inmutable</span>
            </div>
          </div>

          {/* ACTION BAR: SEARCH, FILTERS & BUTTONS */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por código (ej: AC-SGSST-COP-001), título, responsable o tipo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsExternalDocModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Incorporar Documento Externo</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Descargar Excel (CSV)</span>
                </button>

                <button
                  onClick={() => setIsPrintMasterListView(true)}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Listado Maestro PDF</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Sistema</label>
                <select
                  value={systemFilter}
                  onChange={(e) => setSystemFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
                >
                  <option value="ALL">Todos los Sistemas</option>
                  <option value="SGSST">SG-SST (Seguridad y Salud)</option>
                  <option value="AMBIENTAL">Gestión Ambiental</option>
                  <option value="PESV">Seguridad Vial (PESV)</option>
                  <option value="CALIDAD">Gestión de Calidad</option>
                  <option value="GENERAL">General Organización</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Proceso</label>
                <select
                  value={processFilter}
                  onChange={(e) => setProcessFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
                >
                  <option value="ALL">Todos los Procesos ({processCatalog.length})</option>
                  {processCatalog.map(p => (
                    <option key={p.code} value={p.code}>{p.code} - {p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tipo Documental</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
                >
                  <option value="ALL">Todos los Tipos ({typeCatalog.length})</option>
                  {typeCatalog.map(t => (
                    <option key={t.code} value={t.code}>{t.code} - {t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Estado</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
                >
                  <option value="ALL">Todos los Estados</option>
                  <option value="VIGENTE">Vigente</option>
                  <option value="EN_ELABORACION">En Elaboración</option>
                  <option value="PENDIENTE_REVISION">Pendiente Revisión</option>
                  <option value="PENDIENTE_APROBACION">Pendiente Aprobación</option>
                  <option value="OBSOLETO">Obsoleto</option>
                  <option value="ARCHIVADO">Archivado</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Criterio Retención</label>
                <select
                  value={retentionFilter}
                  onChange={(e) => setRetentionFilter(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
                >
                  <option value="ALL">Cualquier Retención</option>
                  <option value="20_YEARS">⭐ Obligatorio 20 Años (Art. 2.2.4.6.13)</option>
                  <option value="OTHER">Otras Retenciones (1 - 5 años)</option>
                </select>
              </div>
            </div>
          </div>

          {/* MASTER DOCUMENT LIST TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Listado Maestro de Documentos y Registros Controlados</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Total de registros encontrados: <strong>{filteredDocuments.length}</strong> de {documentManagementState.documents.length}
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Corte: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-3">Código Documental</th>
                    <th className="p-3">Nombre del Documento</th>
                    <th className="p-3">Sistema / Proceso</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Módulo de Origen</th>
                    <th className="p-3">Versión</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Custodia & Retención</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500">
                        No se encontraron documentos que coincidan con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredDocuments.map(doc => {
                      const pCode = doc.processCode || doc.processId || '';
                      const tCode = doc.typeCode || doc.documentTypeId || '';
                      const is20Years = doc.retentionYears >= 20 || Boolean(doc.isMandatory20Years);
                      const isExt = Boolean(doc.isExternalDocument || doc.isExternal);
                      const resp = doc.responsible || doc.responsibleRole || 'Líder SG-SST';

                      const statusColor =
                        doc.status === 'VIGENTE' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        doc.status === 'EN_ELABORACION' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        doc.status === 'OBSOLETO' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                        'bg-blue-50 text-blue-800 border-blue-200';

                      return (
                        <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                            <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-indigo-900">
                              {doc.code}
                            </span>
                            {isExt && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                Externo
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-semibold text-slate-900 max-w-xs">
                            <div className="line-clamp-2">{doc.title}</div>
                            <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                              Responsable: {resp}
                            </div>
                          </td>
                          <td className="p-3 text-slate-700 whitespace-nowrap">
                            <span className="font-semibold block text-[11px]">{doc.system}</span>
                            <span className="text-[10px] text-slate-500">{processMap.get(pCode) || pCode}</span>
                          </td>
                          <td className="p-3 text-slate-700 whitespace-nowrap">
                            <span className="font-semibold block text-[11px]">{typeMap.get(tCode) || tCode}</span>
                            <span className="text-[10px] text-slate-500 font-mono">[{tCode}]</span>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <button
                              onClick={() => handleNavigateToOrigin(doc)}
                              className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 flex items-center gap-1 transition-colors"
                              title="Abrir módulo de origen sin duplicar archivos"
                            >
                              <span>{doc.originModule}</span>
                              <ExternalLink className="w-3 h-3 text-indigo-500" />
                            </button>
                          </td>
                          <td className="p-3 whitespace-nowrap font-mono font-bold text-slate-800">
                            v{doc.currentVersion}
                            {doc.versionHistory.length > 0 && (
                              <span className="ml-1 text-[10px] text-slate-500 font-normal" title={`${doc.versionHistory.length} versiones anteriores archivadas`}>
                                ({doc.versionHistory.length} ant.)
                              </span>
                            )}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {is20Years ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 w-fit">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>20 Años (Art. 2.2.4.6.13)</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-600 font-medium">
                                {doc.retentionYears} años ({doc.confidentiality})
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedDocForDetail(doc)}
                                className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 transition-colors"
                                title="Ver Ficha y Metadatos"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedDocForNewVersion(doc);
                                  setNewVersionSummary('');
                                }}
                                className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800 transition-colors"
                                title="Generar Nueva Versión Controlada"
                              >
                                <History className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 2: PROCEDIMIENTO DE CONTROL DOCUMENTAL (PR-SGSST-GEN-001) */}
      {/* ============================================================== */}
      {activeTab === 'PROCEDURE' && (
        <div className="space-y-6">
          {/* PROCEDURE BANNER & ACTIONS */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                  {documentManagementState.procedure.code || documentManagementState.procedure.documentCode}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  Versión {documentManagementState.procedure.version}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  documentManagementState.procedure.status === 'VIGENTE'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {documentManagementState.procedure.status}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                {documentManagementState.procedure.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Emisión: {documentManagementState.procedure.issueDate} • Última actualización: {documentManagementState.procedure.lastUpdatedAt || documentManagementState.procedure.lastReviewDate}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsPrintProcedureView(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Imprimir / Descargar PDF</span>
              </button>

              {documentManagementState.procedure.status !== 'VIGENTE' && (
                <button
                  onClick={() => setIsApproveProcedureModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aprobar y Formalizar</span>
                </button>
              )}
            </div>
          </div>

          {/* BOX DE FIRMAS Y RESPONSABILIDADES DEL PROCEDIMIENTO */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Flujo de Elaboración, Revisión y Aprobación del Procedimiento</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* ELABORÓ */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Elaboró</span>
                <div className="font-bold text-slate-900 mt-1">
                  {documentManagementState.procedure.preparedBy.name}
                </div>
                <div className="text-[11px] text-slate-600">
                  {documentManagementState.procedure.preparedBy.role}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Fecha: {documentManagementState.procedure.preparedBy.date}
                </div>
                <div className="mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 p-1.5 rounded border border-emerald-200">
                  ✓ {documentManagementState.procedure.preparedBy.signatureText || 'Revisión Técnica Cumplida'}
                </div>
              </div>

              {/* REVISÓ */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Revisó</span>
                <div className="font-bold text-slate-900 mt-1">
                  {documentManagementState.procedure.reviewedBy.name}
                </div>
                <div className="text-[11px] text-slate-600">
                  {documentManagementState.procedure.reviewedBy.role}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Fecha: {documentManagementState.procedure.reviewedBy.date}
                </div>
                <div className="mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 p-1.5 rounded border border-emerald-200">
                  ✓ {documentManagementState.procedure.reviewedBy.signatureText || 'Revisión Paritaria Conforme'}
                </div>
              </div>

              {/* APROBÓ */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Aprobó</span>
                <div className="font-bold text-slate-900 mt-1">
                  {documentManagementState.procedure.approvedBy.name}
                </div>
                <div className="text-[11px] text-slate-600">
                  {documentManagementState.procedure.approvedBy.role}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Fecha: {documentManagementState.procedure.approvedBy.date}
                </div>
                <div className={`mt-2 text-[10px] font-semibold p-1.5 rounded border ${
                  documentManagementState.procedure.status === 'VIGENTE'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-amber-700 bg-amber-50 border-amber-200'
                }`}>
                  {documentManagementState.procedure.status === 'VIGENTE'
                    ? `✓ ${documentManagementState.procedure.approvedBy.signatureText || 'Aprobado Formalmente'}`
                    : 'Pendiente de Aprobación por Gerencia'}
                </div>
              </div>
            </div>
          </div>

          {/* INSTRUCTION BANNER */}
          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-700 shrink-0" />
              <span>
                <strong>Procedimiento 100% Editable y Adaptable:</strong> Cada una de las 19 secciones normativas puede ser editada por la organización para ajustar la metodología, prefijos y reglas específicas de su operación.
              </span>
            </div>
          </div>

          {/* 19 SECCIONES DEL PROCEDIMIENTO */}
          <div className="space-y-4">
            {documentManagementState.procedure.sections.map((section, idx) => {
              const isEditing = editingSectionId === section.id;
              const isCustom = section.isCustom || section.isCustomized;

              return (
                <div
                  key={section.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{section.title}</h4>
                      {isCustom && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Editado por la empresa
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => handleStartEditSection(section)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          {isCustom && (
                            <button
                              onClick={() => resetControlProcedureSectionToDefault(section.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-xs flex items-center gap-1 transition-colors"
                              title="Restablecer al texto sugerido legal"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSaveSection(section.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Guardar</span>
                          </button>
                          <button
                            onClick={handleCancelEditSection}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section Content */}
                  {isEditing ? (
                    <div className="mt-3">
                      <textarea
                        rows={8}
                        value={editingSectionContent}
                        onChange={(e) => setEditingSectionContent(e.target.value)}
                        className="w-full p-3 rounded-xl border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-xs font-mono text-slate-800 leading-relaxed bg-indigo-50/20"
                      />
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                      {section.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 3: CONFIGURACIÓN DE CODIFICACIÓN & CATÁLOGOS */}
      {/* ============================================================== */}
      {activeTab === 'CODING' && (
        <div className="space-y-6">
          {/* EXPLANATORY BANNER */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>Estructura de Codificación Automática y Configurable</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              La plataforma asigna códigos únicos inmutables bajo la regla: 
              <span className="font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded mx-1 border border-indigo-200">
                [TIPO]-[SISTEMA]-[PROCESO]-[CONSECUTIVO]
              </span>.
              Los consecutivos se incrementan automáticamente por serie documental. Los códigos históricos permanecen inalterables ante revisiones o cambios de versión.
            </p>
          </div>

          {/* SIMULADOR INTERACTIVO */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-200 shadow-sm">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
              Simulador Interactivo de Codificación
            </span>
            <h4 className="text-sm font-bold text-slate-900 mb-3">
              Pruebe cómo generará la plataforma el siguiente código
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tipo Documental</label>
                <select
                  value={simType}
                  onChange={(e) => setSimType(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                >
                  {typeCatalog.map(t => (
                    <option key={t.code} value={t.code}>{t.code} - {t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sistema de Gestión</label>
                <select
                  value={simSystem}
                  onChange={(e) => setSimSystem(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                >
                  <option value="SGSST">SGSST (Seguridad y Salud en el Trabajo)</option>
                  <option value="AMBIENTAL">AMBIENTAL (Gestión Ambiental)</option>
                  <option value="PESV">PESV (Seguridad Vial)</option>
                  <option value="CALIDAD">CALIDAD (Gestión de la Calidad)</option>
                  <option value="GENERAL">GENERAL (Empresa)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Proceso Relacionado</label>
                <select
                  value={simProcess}
                  onChange={(e) => setSimProcess(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                >
                  {processCatalog.map(p => (
                    <option key={p.code} value={p.code}>{p.code} - {p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generated Code Result */}
            <div className="p-4 rounded-xl bg-white border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Próximo Código a Asignar:</span>
                <span className="text-xl font-mono font-black text-indigo-900 tracking-wider">
                  {simType}-{simSystem}-{simProcess}-001
                </span>
              </div>
              <div className="text-[11px] text-slate-600">
                Serie identificada: <strong>{typeMap.get(simType)}</strong> en el proceso <strong>{processMap.get(simProcess)}</strong>.
              </div>
            </div>
          </div>

          {/* CATÁLOGO DE TIPOS DOCUMENTALES */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Catálogo de Tipos Documentales ({typeCatalog.length})</h4>
                <p className="text-[11px] text-slate-500">Prefijos utilizados para identificar la naturaleza del documento</p>
              </div>
            </div>

            {/* Add New Type Form */}
            <form onSubmit={handleAddType} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <input
                  type="text"
                  maxLength={4}
                  required
                  placeholder="Prefijo (ej: GU)"
                  value={newTypePrefix}
                  onChange={(e) => setNewTypePrefix(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono uppercase"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Nombre del tipo (ej: Guía Técnica)"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full h-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Tipo</span>
                </button>
              </div>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {typeCatalog.map(t => (
                <div key={t.code} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-indigo-900 bg-indigo-100/70 px-1.5 py-0.5 rounded text-[11px]">
                      {t.code}
                    </span>
                    <span className="ml-2 font-semibold text-slate-800 text-[11px]">{t.name}</span>
                  </div>
                  {t.isSystemDefault || t.isDefault ? (
                    <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-1 py-0.5 rounded">Base</span>
                  ) : (
                    <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded">Empresa</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CATÁLOGO DE PROCESOS */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Catálogo de Procesos ({processCatalog.length})</h4>
                <p className="text-[11px] text-slate-500">Acrónimos de procesos y comités vinculados a la gestión documental</p>
              </div>
            </div>

            {/* Add New Process Form */}
            <form onSubmit={handleAddProcess} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <input
                  type="text"
                  maxLength={5}
                  required
                  placeholder="Código (ej: TAL)"
                  value={newProcessCode}
                  onChange={(e) => setNewProcessCode(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono uppercase"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Nombre del proceso (ej: Talento Humano)"
                  value={newProcessName}
                  onChange={(e) => setNewProcessName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full h-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Proceso</span>
                </button>
              </div>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {processCatalog.map(p => (
                <div key={p.code} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-900 bg-slate-200 px-1.5 py-0.5 rounded text-[11px]">
                      {p.code}
                    </span>
                    <span className="ml-1.5 font-semibold text-slate-800 text-[11px] block mt-1">{p.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 4: MATRIZ DE RETENCIÓN LEGAL (20 AÑOS - DEC. 1072) */}
      {/* ============================================================== */}
      {activeTab === 'RETENTION' && (
        <div className="space-y-6">
          {/* BANNER RETENCIÓN 20 AÑOS */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white border border-amber-900/60 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Artículo 2.2.4.6.13 del Decreto 1072 de 2015
              </span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <span>Conservación Obligatoria de 20 Años vs Otras Reglas de Archivo</span>
            </h2>
            <p className="text-xs text-amber-100/90 mt-1 max-w-3xl leading-relaxed">
              La normatividad colombiana <strong>NO asigna indiscriminadamente 20 años a todos los documentos</strong>. Establece taxativamente un periodo mínimo de veinte (20) años, contados a partir del momento en que cese la relación laboral del trabajador con la empresa, exclusivamente para los cinco grupos de registros descritos a continuación:
            </p>
          </div>

          {/* 5 CATEGORÍAS OBLIGATORIAS DE 20 AÑOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500 text-white font-bold text-[9px] rounded-bl-lg uppercase tracking-wider">
                20 Años Obligatorio
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-2">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Evaluaciones Médicas Ocupacionales
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Conceptos médicos de ingreso, periódicos y retiro, pruebas complementarias y perfil sociodemográfico de la población trabajadora.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
                <strong>Base legal:</strong> Art. 2.2.4.6.13 Numeral 1 • Custodia médica confidencial.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500 text-white font-bold text-[9px] rounded-bl-lg uppercase tracking-wider">
                20 Años Obligatorio
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-2">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Monitoreos Ambientales e Higiene
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Resultados de mediciones higiénicas de ruido, iluminación, material particulado, gases y agentes químicos o biológicos en los puestos de trabajo.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
                <strong>Base legal:</strong> Art. 2.2.4.6.13 Numeral 2 • Enfoque preventivo e histórico.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500 text-white font-bold text-[9px] rounded-bl-lg uppercase tracking-wider">
                20 Años Obligatorio
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-2">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Capacitación, Formación y Entrenamiento
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Registros individuales y colectivos de asistencia, planes de capacitación anual, evaluaciones de eficacia y certificados de entrenamiento en SST.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
                <strong>Base legal:</strong> Art. 2.2.4.6.13 Numeral 3 • Trazabilidad de competencias.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500 text-white font-bold text-[9px] rounded-bl-lg uppercase tracking-wider">
                20 Años Obligatorio
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-2">
                4
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Suministro de EPP y Fichas Técnicas
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Registros de entrega firmados por trabajador con fecha, referencia, reposición periódica y fichas técnicas de los elementos de protección personal.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
                <strong>Base legal:</strong> Art. 2.2.4.6.13 Numeral 4 • Evidencia probatoria legal.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500 text-white font-bold text-[9px] rounded-bl-lg uppercase tracking-wider">
                20 Años Obligatorio
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-2">
                5
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Investigaciones de ATEL
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Investigaciones de accidentes graves y mortales, incidentes de trabajo y reportes de enfermedades laborales diagnosticadas, con planes de acción.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
                <strong>Base legal:</strong> Art. 2.2.4.6.13 Numeral 5 • Soporte ante ARL y MinTrabajo.
              </div>
            </div>

            {/* COMPARATIVA OTRAS REGLAS */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-300 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm mb-2">
                ℹ
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Otras Reglas de Retención (1 a 5 Años)
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Las actas del COPASST y CCL se conservan por <strong>5 años</strong>. Las inspecciones operativas rutinarias y listas de chequeo preoperacionales tienen retención operativa de <strong>1 año</strong>.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200 text-[10px] text-slate-500">
                <strong>Principio:</strong> Conservación proporcional según valor probatorio y técnico.
              </div>
            </div>
          </div>

          {/* TABLA DE REGLAS DE CONSERVACIÓN */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-3">
              Catálogo de Reglas y Fundamentos de Conservación Documental
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-3">Categoría Documental</th>
                    <th className="p-3">Periodo</th>
                    <th className="p-3">Cómputo</th>
                    <th className="p-3">Fundamento Normativo</th>
                    <th className="p-3">Custodia</th>
                    <th className="p-3">Confidencialidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documentManagementState.retentionRules.map(rule => (
                    <tr key={rule.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-semibold text-slate-900">{rule.categoryName || rule.category}</td>
                      <td className="p-3 font-mono font-bold whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          rule.retentionYears >= 20 ? 'bg-amber-100 text-amber-900 font-black' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {rule.retentionYears} años
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{rule.retentionStartRule || rule.computationStart}</td>
                      <td className="p-3 text-slate-700 max-w-xs">{rule.legalBasis}</td>
                      <td className="p-3 text-slate-700">{rule.custodianRole || rule.custodian}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {rule.confidentiality}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: DETALLE Y FICHA DEL DOCUMENTO CONTROLADO */}
      {/* ============================================================== */}
      {selectedDocForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-indigo-50 text-indigo-900 border border-indigo-200">
                  {selectedDocForDetail.code}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">{selectedDocForDetail.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDocForDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Sistema</span>
                <span className="font-bold text-slate-900">{selectedDocForDetail.system}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Proceso</span>
                <span className="font-bold text-slate-900">
                  {processMap.get(selectedDocForDetail.processCode || selectedDocForDetail.processId || '') || selectedDocForDetail.processCode}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Tipo Documental</span>
                <span className="font-bold text-slate-900">
                  {typeMap.get(selectedDocForDetail.typeCode || selectedDocForDetail.documentTypeId || '') || selectedDocForDetail.typeCode}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Versión Vigente</span>
                <span className="font-mono font-bold text-slate-900">v{selectedDocForDetail.currentVersion}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Estado</span>
                <span className="font-bold text-emerald-700">{selectedDocForDetail.status}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Periodo Retención</span>
                <span className="font-bold text-amber-900">{selectedDocForDetail.retentionYears} años</span>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <div>
                <span className="font-bold text-slate-700 block">Descripción y Propósito:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {selectedDocForDetail.description || selectedDocForDetail.notes || 'Documento formal de gestión de AGAE SOLUTIONS.'}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block">Fundamento Legal de Retención:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {selectedDocForDetail.retentionBasis || selectedDocForDetail.retentionLegalBasis}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-bold text-slate-700 block">Ubicación de Custodia:</span>
                  <span className="text-slate-600">{selectedDocForDetail.physicalLocation || 'Archivo Digital Central AGAE / Nube Segura'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Nivel de Confidencialidad:</span>
                  <span className="text-slate-600">{selectedDocForDetail.confidentiality}</span>
                </div>
              </div>
            </div>

            {/* Historial de versiones */}
            <div className="pt-3 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-800 block mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-600" />
                <span>Historial de Versiones Anteriores ({selectedDocForDetail.versionHistory.length})</span>
              </span>
              {selectedDocForDetail.versionHistory.length === 0 ? (
                <p className="text-[11px] text-slate-400">Esta es la versión inicial del documento (no hay versiones obsoletas).</p>
              ) : (
                <div className="space-y-1.5">
                  {selectedDocForDetail.versionHistory.map(vh => (
                    <div key={vh.version} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-slate-700">v{vh.version}</span>
                        <span className="ml-2 text-slate-600">{vh.changeSummary}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{vh.approvedDate} • {vh.approvedBy}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  const doc = selectedDocForDetail;
                  setSelectedDocForDetail(null);
                  handleNavigateToOrigin(doc);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center gap-1"
              >
                <span>Ir al Módulo de Origen</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedDocForDetail(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: CREAR NUEVA VERSIÓN DE DOCUMENTO */}
      {/* ============================================================== */}
      {selectedDocForNewVersion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateNewVersion} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase block">Control de Cambios</span>
                <h3 className="text-base font-bold text-slate-900">
                  Nueva Versión para {selectedDocForNewVersion.code}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocForNewVersion(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Versión Actual</span>
                  <span className="font-mono font-bold text-slate-900">v{selectedDocForNewVersion.currentVersion} (Pasará a Obsoleta)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Nueva Versión</span>
                  <span className="font-mono font-bold text-emerald-700">
                    v{String(parseInt(selectedDocForNewVersion.currentVersion, 10) + 1).padStart(3, '0')} (Vigente)
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Descripción o Motivo del Cambio <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={newVersionSummary}
                  onChange={(e) => setNewVersionSummary(e.target.value)}
                  placeholder="Ej: Actualización del procedimiento conforme al simulacro y revisión anual..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Aprobado Por</label>
                <input
                  type="text"
                  required
                  value={newVersionApprover}
                  onChange={(e) => setNewVersionApprover(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedDocForNewVersion(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm"
              >
                Aprobar y Emitir Nueva Versión
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: REGISTRAR DOCUMENTO EXTERNO */}
      {/* ============================================================== */}
      {isExternalDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateExternalDoc} className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase block">Entrada de Documentación</span>
                <h3 className="text-base font-bold text-slate-900">
                  Incorporar Documento o Registro de Origen Externo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsExternalDocModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nombre del Documento Externo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ficha de Seguridad del Químico Solvente X / Norma Técnica NTC 4114"
                  value={extTitle}
                  onChange={(e) => setExtTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Entidad Emisora / Fuente</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: ARL Sura / ICONTEC / Proveedor"
                    value={extSource}
                    onChange={(e) => setExtSource(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código del Emisor (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: NTC-4114 / CERT-2026-99"
                    value={extCode}
                    onChange={(e) => setExtCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sistema</label>
                  <select
                    value={extSystem}
                    onChange={(e) => setExtSystem(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    <option value="SGSST">SGSST</option>
                    <option value="AMBIENTAL">AMBIENTAL</option>
                    <option value="PESV">PESV</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Proceso</label>
                  <select
                    value={extProcessId}
                    onChange={(e) => setExtProcessId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    {processCatalog.map(p => (
                      <option key={p.code} value={p.code}>{p.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo</label>
                  <select
                    value={extTypeId}
                    onChange={(e) => setExtTypeId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    {typeCatalog.map(t => (
                      <option key={t.code} value={t.code}>{t.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Periodo de Retención (Años)</label>
                  <select
                    value={extRetentionYears}
                    onChange={(e) => setExtRetentionYears(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    <option value={1}>1 año (Operativo transitorio)</option>
                    <option value={5}>5 años (General de gestión)</option>
                    <option value={20}>20 años (Obligatorio Art. 2.2.4.6.13)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Confidencialidad</label>
                  <select
                    value={extConfidentiality}
                    onChange={(e) => setExtConfidentiality(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    <option value="PUBLICO">Público</option>
                    <option value="INTERNO">Interno</option>
                    <option value="CONFIDENCIAL">Confidencial</option>
                    <option value="MEDICA_RESTRINGIDA">Médica Restringida</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Responsable de Custodia</label>
                <input
                  type="text"
                  required
                  value={extResponsible}
                  onChange={(e) => setExtResponsible(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fundamento de Retención</label>
                <input
                  type="text"
                  value={extRetentionBasis}
                  onChange={(e) => setExtRetentionBasis(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsExternalDocModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm"
              >
                Codificar e Incorporar al Repositorio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: FORMALIZACIÓN Y APROBACIÓN DEL PROCEDIMIENTO */}
      {/* ============================================================== */}
      {isApproveProcedureModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 font-black text-xl">
                ✓
              </div>
              <h3 className="text-base font-black text-slate-900">
                Aprobar y Formalizar Procedimiento
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Al formalizar el <strong>PR-SGSST-GEN-001</strong>, pasará a estado <strong>VIGENTE</strong> y se certificará automáticamente el cumplimiento del <strong>Estándar 2.2.1</strong> del SG-SST (Decreto 1072 de 2015).
              </p>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre del Aprobador (Gerencia)</label>
                <input
                  type="text"
                  required
                  value={approvalName}
                  onChange={(e) => setApprovalName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cargo</label>
                <input
                  type="text"
                  required
                  value={approvalRole}
                  onChange={(e) => setApprovalRole(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsApproveProcedureModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApproveProcedure}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/20"
              >
                Confirmar y Emitir como Vigente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA LIMPIA PARA IMPRESIÓN DEL PROCEDIMIENTO EN PDF */}
      {/* ============================================================== */}
      {isPrintProcedureView && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto p-8 print:p-0">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-slate-500">Vista de Impresión / Descarga PDF</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Guardar como PDF</span>
                </button>
                <button
                  onClick={() => setIsPrintProcedureView(false)}
                  className="px-3 py-2 rounded-lg bg-slate-200 text-slate-800 font-bold text-xs"
                >
                  Cerrar Vista
                </button>
              </div>
            </div>

            {/* Encabezado Corporativo Oficial */}
            <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
              <div className="grid grid-cols-4 divide-x divide-slate-800 text-center">
                <div className="p-4 flex flex-col items-center justify-center font-bold text-sm">
                  <span>{organization.name}</span>
                  <span className="text-[10px] font-mono text-slate-600">NIT: {organization.nit || '800.123.456-7'}</span>
                </div>
                <div className="col-span-2 p-4 flex flex-col items-center justify-center font-black text-sm uppercase">
                  <span>SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO</span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5">{documentManagementState.procedure.title}</span>
                </div>
                <div className="p-2 text-[10px] divide-y divide-slate-800 text-left font-mono">
                  <div className="pb-1"><strong>Código:</strong> {documentManagementState.procedure.code || documentManagementState.procedure.documentCode}</div>
                  <div className="py-1"><strong>Versión:</strong> {documentManagementState.procedure.version}</div>
                  <div className="py-1"><strong>Emisión:</strong> {documentManagementState.procedure.issueDate}</div>
                  <div className="pt-1"><strong>Estado:</strong> {documentManagementState.procedure.status}</div>
                </div>
              </div>
            </div>

            {/* Contenido Completo del Procedimiento */}
            <div className="space-y-6 text-xs text-slate-800 leading-relaxed">
              {documentManagementState.procedure.sections.map((sec, i) => (
                <div key={sec.id} className="space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
                    {i + 1}. {sec.title}
                  </h4>
                  <div className="whitespace-pre-line pl-2">{sec.content}</div>
                </div>
              ))}
            </div>

            {/* Cuadro de Firmas Finales */}
            <div className="border border-slate-800 rounded-lg overflow-hidden text-xs mt-8">
              <div className="grid grid-cols-3 divide-x divide-slate-800 text-center">
                <div className="p-4 space-y-12">
                  <div className="font-bold uppercase text-[10px] text-slate-600">ELABORÓ</div>
                  <div className="border-t border-slate-400 pt-1">
                    <div className="font-bold">{documentManagementState.procedure.preparedBy.name}</div>
                    <div className="text-[10px] text-slate-600">{documentManagementState.procedure.preparedBy.role}</div>
                  </div>
                </div>
                <div className="p-4 space-y-12">
                  <div className="font-bold uppercase text-[10px] text-slate-600">REVISÓ</div>
                  <div className="border-t border-slate-400 pt-1">
                    <div className="font-bold">{documentManagementState.procedure.reviewedBy.name}</div>
                    <div className="text-[10px] text-slate-600">{documentManagementState.procedure.reviewedBy.role}</div>
                  </div>
                </div>
                <div className="p-4 space-y-12">
                  <div className="font-bold uppercase text-[10px] text-slate-600">APROBÓ</div>
                  <div className="border-t border-slate-400 pt-1">
                    <div className="font-bold">{documentManagementState.procedure.approvedBy.name}</div>
                    <div className="text-[10px] text-slate-600">{documentManagementState.procedure.approvedBy.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA LIMPIA PARA IMPRESIÓN DEL LISTADO MAESTRO EN PDF */}
      {/* ============================================================== */}
      {isPrintMasterListView && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto p-8 print:p-0">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-slate-500">Vista de Impresión del Listado Maestro</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Guardar como PDF</span>
                </button>
                <button
                  onClick={() => setIsPrintMasterListView(false)}
                  className="px-3 py-2 rounded-lg bg-slate-200 text-slate-800 font-bold text-xs"
                >
                  Cerrar Vista
                </button>
              </div>
            </div>

            {/* Header del Listado Maestro */}
            <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
              <div className="grid grid-cols-4 divide-x divide-slate-800 text-center">
                <div className="p-4 flex flex-col items-center justify-center font-bold text-sm">
                  <span>{organization.name}</span>
                  <span className="text-[10px] font-mono text-slate-600">NIT: {organization.nit || '800.123.456-7'}</span>
                </div>
                <div className="col-span-2 p-4 flex flex-col items-center justify-center font-black text-sm uppercase">
                  <span>LISTADO MAESTRO DE DOCUMENTOS Y REGISTROS</span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5">Sistema de Gestión de Seguridad y Salud en el Trabajo</span>
                </div>
                <div className="p-2 text-[10px] divide-y divide-slate-800 text-left font-mono">
                  <div className="pb-1"><strong>Código:</strong> FT-SGSST-GEN-001</div>
                  <div className="py-1"><strong>Versión:</strong> 001</div>
                  <div className="py-1"><strong>Corte:</strong> {new Date().toISOString().split('T')[0]}</div>
                  <div className="pt-1"><strong>Total Docs:</strong> {filteredDocuments.length}</div>
                </div>
              </div>
            </div>

            {/* Tabla Completa */}
            <table className="w-full text-left text-xs border border-slate-800 divide-y divide-slate-800">
              <thead className="bg-slate-100 font-bold text-[10px]">
                <tr className="divide-x divide-slate-800">
                  <th className="p-2">CÓDIGO</th>
                  <th className="p-2">TÍTULO DEL DOCUMENTO</th>
                  <th className="p-2">PROCESO</th>
                  <th className="p-2">TIPO</th>
                  <th className="p-2">VER.</th>
                  <th className="p-2">ESTADO</th>
                  <th className="p-2">RETENCIÓN</th>
                  <th className="p-2">RESPONSABLE CUSTODIA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredDocuments.map(doc => {
                  const pCode = doc.processCode || doc.processId || '';
                  const tCode = doc.typeCode || doc.documentTypeId || '';
                  const resp = doc.responsible || doc.responsibleRole || 'Líder SG-SST';
                  const is20Years = doc.retentionYears >= 20 || Boolean(doc.isMandatory20Years);

                  return (
                    <tr key={doc.id} className="divide-x divide-slate-800 text-[11px]">
                      <td className="p-2 font-mono font-bold whitespace-nowrap">{doc.code}</td>
                      <td className="p-2 font-semibold">{doc.title}</td>
                      <td className="p-2">{pCode}</td>
                      <td className="p-2">{tCode}</td>
                      <td className="p-2 font-mono text-center">v{doc.currentVersion}</td>
                      <td className="p-2">{doc.status}</td>
                      <td className="p-2 whitespace-nowrap">
                        {doc.retentionYears} años {is20Years ? '(Dec. 1072)' : ''}
                      </td>
                      <td className="p-2">{resp}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="p-3 border border-slate-800 rounded text-[10px] text-slate-700 flex justify-between">
              <span>Custodia: Dirección HSEQ / AGAE SOLUTIONS Nube Segura</span>
              <span>Generado automáticamente el {new Date().toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
