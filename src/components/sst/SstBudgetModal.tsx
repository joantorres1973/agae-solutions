'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Building,
  Car,
  HardHat,
  Plus,
  ShieldCheck,
  UserCheck,
  TrendingUp,
  FileText,
  Clock,
  Trash2,
  Edit2,
  X,
  Check,
  FileSpreadsheet,
  Printer,
  Layers,
  MessageSquare,
  Users,
  Settings,
  Send,
  AlertOctagon,
  Sparkles,
  FileCheck2
} from 'lucide-react';
import {
  SstBudgetItem,
  BudgetSystem,
  BudgetResourceCategory,
  SimulatedRole,
  DigitalSignatureInfo
} from '@/types/sst';

interface SstBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SstBudgetModal: React.FC<SstBudgetModalProps> = ({ isOpen, onClose }) => {
  const {
    organization,
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
    updateStandardStatus,
    showNotification
  } = useApp();

  const isPesvActive = organization.activeModules.includes('PESV');

  // Modal Subtabs: 'ITEMS' | 'SIGNATURES' | 'COPASST' | 'REPORT'
  const [modalTab, setModalTab] = useState<'ITEMS' | 'SIGNATURES' | 'COPASST' | 'REPORT'>('ITEMS');

  // Filter state
  const [selectedSystemFilter, setSelectedSystemFilter] = useState<'ALL' | BudgetSystem | 'TRANSVERSAL'>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SstBudgetItem | null>(null);

  // Observation dialog state
  const [observingItemId, setObservingItemId] = useState<string | null>(null);
  const [itemObservationText, setItemObservationText] = useState('');

  // General return / devolucion state for Gerencia
  const [generalDevolucionOpen, setGeneralDevolucionOpen] = useState(false);
  const [generalDevolucionComment, setGeneralDevolucionComment] = useState('');

  // Financial Config modal / toggle
  const [showFinConfig, setShowFinConfig] = useState(false);
  const [finTitle, setFinTitle] = useState(sstBudgetState.financialRoleTitle || 'Director Financiero / Contador Público');
  const [finName, setFinName] = useState(sstBudgetState.financialOfficerName || 'Lic. Carlos Mendoza Pardo');
  const [finDoc, setFinDoc] = useState(sstBudgetState.financialOfficerDoc || '79.654.321 (T.P. 18452-T)');

  // COPASST new review form state
  const [copMeetingDate, setCopMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [copActaNumber, setCopActaNumber] = useState(`Acta Ordinaria No. 0${(sstBudgetState.copasstReviews?.length || 0) + 1}`);
  const [copReviewedBy, setCopReviewedBy] = useState('Secretaria y Presidente del COPASST');
  const [copObservations, setCopObservations] = useState('');
  const [copStatus, setCopStatus] = useState<'CONFORME' | 'CON_OBSERVACIONES'>('CONFORME');

  // Add Item form state
  const [formSystem, setFormSystem] = useState<BudgetSystem>('SST');
  const [formIsAllSystems, setFormIsAllSystems] = useState(false);
  const [formCategory, setFormCategory] = useState<BudgetResourceCategory>('CAPACITACION');
  const [formConcept, setFormConcept] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDecretoRel, setFormDecretoRel] = useState('Art. 2.2.4.6.8 Numeral 4 (Definición de recursos)');
  const [formPesvRel, setFormPesvRel] = useState('Res. 40595/2022 - Paso 3: Recursos PESV');
  const [formPlanned, setFormPlanned] = useState<number>(5000000);
  const [formQuarter, setFormQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4' | 'ANUAL'>('ANUAL');
  const [formResponsible, setFormResponsible] = useState('Líder SST / HSEQ');

  if (!isOpen) return null;

  // Filter items
  const filteredItems = sstBudgetItems.filter(item => {
    if (!isPesvActive && item.system === 'PESV') return false;
    if (selectedSystemFilter === 'ALL') return true;
    if (selectedSystemFilter === 'TRANSVERSAL') return item.isAllSystems;
    return item.system === selectedSystemFilter;
  });

  // Calculate totals
  const totalPlanned = filteredItems.reduce((acc, curr) => acc + curr.plannedAmount, 0);
  const totalCommitted = filteredItems.reduce((acc, curr) => acc + curr.committedAmount, 0);
  const totalExecuted = filteredItems.reduce((acc, curr) => acc + curr.executedAmount, 0);
  const executionPercentage = totalPlanned > 0 ? (totalExecuted / totalPlanned) * 100 : 0;

  // Items with pending observations
  const observedItemsCount = sstBudgetItems.filter(i => i.hasObservation && !i.observationResolved).length;

  // Handlers
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formConcept || formPlanned <= 0) return;

    if (editingItem) {
      updateSstBudgetItem(editingItem.id, {
        system: formSystem,
        isAllSystems: formIsAllSystems,
        category: formCategory,
        concept: formConcept,
        description: formDesc,
        decreto1072Rel: formDecretoRel,
        pesvRel: formSystem === 'PESV' || formIsAllSystems ? formPesvRel : undefined,
        plannedAmount: formPlanned,
        quarter: formQuarter,
        responsible: formResponsible
      });
      setEditingItem(null);
      showNotification(`Rubro "${formConcept}" actualizado satisfactoriamente`);
    } else {
      addSstBudgetItem({
        system: formSystem,
        isAllSystems: formIsAllSystems,
        category: formCategory,
        concept: formConcept,
        description: formDesc,
        decreto1072Rel: formDecretoRel,
        pesvRel: formSystem === 'PESV' || formIsAllSystems ? formPesvRel : undefined,
        plannedAmount: formPlanned,
        committedAmount: 0,
        executedAmount: 0,
        quarter: formQuarter,
        responsible: formResponsible,
        status: 'PROGRAMADO'
      });
      setShowAddForm(false);
      showNotification(`Nuevo rubro agregado al presupuesto`);
    }

    // Reset fields
    setFormConcept('');
    setFormDesc('');
    setFormPlanned(5000000);
    setFormIsAllSystems(false);
  };

  const handleStartEdit = (item: SstBudgetItem) => {
    setEditingItem(item);
    setFormSystem(item.system);
    setFormIsAllSystems(Boolean(item.isAllSystems));
    setFormCategory(item.category);
    setFormConcept(item.concept);
    setFormDesc(item.description);
    setFormDecretoRel(item.decreto1072Rel);
    setFormPesvRel(item.pesvRel || 'Res. 40595/2022 - Paso 3: Recursos PESV');
    setFormPlanned(item.plannedAmount);
    setFormQuarter(item.quarter);
    setFormResponsible(item.responsible);
    setShowAddForm(true);
  };

  const handleFlagObservation = (itemId: string) => {
    if (!itemObservationText.trim()) return;
    flagBudgetItemObservation(itemId, itemObservationText.trim());
    setObservingItemId(null);
    setItemObservationText('');
  };

  const handleSaveFinConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateFinancialOfficerConfig(finTitle, finName, finDoc);
    setShowFinConfig(false);
  };

  const handleSaveCopasstReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copObservations.trim()) return;

    addCopasstBudgetReview({
      meetingDate: copMeetingDate,
      actaNumber: copActaNumber,
      reviewedBy: copReviewedBy,
      observations: copObservations,
      status: copStatus
    });

    setCopObservations('');
  };

  // Sign Budget Parties
  const handleSignAsParty = (party: 'manager' | 'financial' | 'sstLeader') => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const token = `SIG-${party.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-SHA256`;

    if (party === 'manager') {
      signBudgetParty('manager', {
        name: sstBudgetState.signatures.manager?.name || 'Lic. Fernando Ortiz Salazar',
        title: 'Gerente General / Representante Legal',
        docNumber: sstBudgetState.signatures.manager?.docNumber || '79.845.120 de Bogotá D.C.',
        signedAt: now,
        token
      });
      updateStandardStatus('std-1.1.3', 'CUMPLE', 'Presupuesto integrado aprobado con firma gerencial.');
    } else if (party === 'financial') {
      signBudgetParty('financial', {
        name: sstBudgetState.financialOfficerName,
        title: sstBudgetState.financialRoleTitle,
        docNumber: sstBudgetState.financialOfficerDoc,
        signedAt: now,
        token
      });
    } else {
      signBudgetParty('sstLeader', {
        name: 'Ing. Marcela Rincón Ortiz',
        title: 'Líder del SG-SST',
        docNumber: '1.020.784.952 de Bogotá D.C.',
        licenseNumber: 'LIC-SST-2023-08941',
        signedAt: now,
        token
      });
    }
  };

  // Export to Excel (.xls HTML table format compatible with Microsoft Excel)
  const handleDownloadExcel = () => {
    const rows = filteredItems.map((item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${item.system}${item.isAllSystems ? ' (TRANSVERSAL)' : ''}</td>
        <td>${item.category}</td>
        <td>${item.concept}</td>
        <td>${item.description}</td>
        <td>${item.decreto1072Rel} ${item.pesvRel ? ' / ' + item.pesvRel : ''}</td>
        <td>${item.quarter}</td>
        <td>${item.responsible}</td>
        <td>${item.plannedAmount}</td>
        <td>${item.committedAmount}</td>
        <td>${item.executedAmount}</td>
        <td>${item.status}</td>
        <td>${item.hasObservation ? 'OBJETADO: ' + item.observationComment : item.observationResolved ? 'SUBSANADO' : 'CONFORME'}</td>
      </tr>
    `).join('');

    const copasstRows = (sstBudgetState.copasstReviews || []).map(rev => `
      <tr>
        <td>${rev.meetingDate}</td>
        <td>${rev.actaNumber}</td>
        <td>${rev.reviewedBy}</td>
        <td>${rev.status}</td>
        <td>${rev.observations}</td>
      </tr>
    `).join('');

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; font-size: 11px; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          th { background-color: #0f172a; color: #ffffff; border: 1px solid #334155; padding: 8px; text-align: left; }
          td { border: 1px solid #cbd5e1; padding: 6px; }
          .header-title { font-size: 16px; font-weight: bold; color: #0284c7; }
          .header-sub { font-size: 11px; color: #64748b; }
          .total-row { font-weight: bold; background-color: #f1f5f9; }
          .sig-box { border: 1px solid #000; padding: 10px; margin-top: 10px; background-color: #f8fafc; }
        </style>
      </head>
      <body>
        <div class="header-title">${organization.name}</div>
        <div class="header-sub">NIT: ${organization.nit} • Presupuesto Integrado SG-SST (Dec. 1072) ${isPesvActive ? '+ PESV Vial (Res. 40595)' : ''}</div>
        <div class="header-sub">Vigencia Fiscal: ${sstBudgetState.fiscalYear} • Estado: ${sstBudgetState.status}</div>
        <br />
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Sistema</th>
              <th>Categoría</th>
              <th>Concepto</th>
              <th>Descripción</th>
              <th>Marco Legal</th>
              <th>Periodo</th>
              <th>Responsable</th>
              <th>Presupuestado (COP)</th>
              <th>Comprometido (COP)</th>
              <th>Ejecutado (COP)</th>
              <th>Estado</th>
              <th>Trazabilidad / Observación</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr class="total-row">
              <td colspan="8" style="text-align: right;">TOTAL CONSOLIDADO:</td>
              <td>${totalPlanned}</td>
              <td>${totalCommitted}</td>
              <td>${totalExecuted}</td>
              <td colspan="2">${executionPercentage.toFixed(1)}% Ejecución Real</td>
            </tr>
          </tbody>
        </table>

        <br />
        <div class="header-title" style="font-size: 13px;">Trazabilidad y Revisiones Mensuales del COPASST</div>
        <table>
          <thead>
            <tr>
              <th>Fecha Reunión</th>
              <th>No. Acta</th>
              <th>Revisado Por</th>
              <th>Concepto</th>
              <th>Observaciones / Recomendaciones del COPASST</th>
            </tr>
          </thead>
          <tbody>
            ${copasstRows || '<tr><td colspan="5">No hay actas registradas</td></tr>'}
          </tbody>
        </table>

        <br />
        <div class="header-title" style="font-size: 13px;">Firmas Digitales de Autorización Legal (Decreto 1072/15)</div>
        <table>
          <tr>
            <td style="width: 33%;">
              <div class="sig-box">
                <strong>1. GERENCIA GENERAL:</strong><br />
                ${sstBudgetState.signatures.manager ? `✓ FIRMADO: ${sstBudgetState.signatures.manager.name}<br />C.C. ${sstBudgetState.signatures.manager.docNumber}<br />Fecha: ${sstBudgetState.signatures.manager.signedAt}<br />Hash: ${sstBudgetState.signatures.manager.token}` : 'Pendiente de firma'}
              </div>
            </td>
            <td style="width: 33%;">
              <div class="sig-box">
                <strong>2. ${sstBudgetState.financialRoleTitle.toUpperCase()}:</strong><br />
                ${sstBudgetState.signatures.financial ? `✓ FIRMADO: ${sstBudgetState.signatures.financial.name}<br />Doc: ${sstBudgetState.signatures.financial.docNumber}<br />Fecha: ${sstBudgetState.signatures.financial.signedAt}<br />Hash: ${sstBudgetState.signatures.financial.token}` : 'Pendiente de firma'}
              </div>
            </td>
            <td style="width: 33%;">
              <div class="sig-box">
                <strong>3. LÍDER DEL SG-SST:</strong><br />
                ${sstBudgetState.signatures.sstLeader ? `✓ FIRMADO: ${sstBudgetState.signatures.sstLeader.name}<br />Licencia: ${sstBudgetState.signatures.sstLeader.licenseNumber}<br />Fecha: ${sstBudgetState.signatures.sstLeader.signedAt}<br />Hash: ${sstBudgetState.signatures.sstLeader.token}` : 'Pendiente de firma'}
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Presupuesto_Integrado_SST_${organization.nit.replace(/[^0-9]/g, '')}_${sstBudgetState.fiscalYear}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('Archivo Excel descargado exitosamente con firmas digitales y trazabilidad.');
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 overflow-y-auto">
      <div className="bg-slate-50 border border-slate-300 rounded-2xl max-w-6xl w-full max-h-[96vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Estándar 1.1.3 (Res. 0312)
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  Decreto 1072 Art. 2.2.4.6.8 Num. 4 {isPesvActive ? '• PESV Res. 40595' : ''}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Presupuesto Integrado {isPesvActive ? 'SST + Vial PESV' : 'del SG-SST'} — Vigencia {sstBudgetState.fiscalYear}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Download Buttons */}
            <button
              type="button"
              onClick={handleDownloadExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow border border-emerald-200"
              title="Descargar presupuesto con firmas y trazabilidad en Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Descargar en Excel (.xls)</span>
            </button>

            <button
              type="button"
              onClick={() => setModalTab('REPORT')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors"
              title="Vista previa del Reporte Oficial para Imprimir / PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Reporte PDF / Firmado</span>
            </button>

            {/* Simulated Role Selector */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-[10px] text-slate-500 font-semibold uppercase hidden sm:inline">Rol:</span>
              <select
                value={currentSimulatedRole}
                onChange={(e) => setCurrentSimulatedRole(e.target.value as SimulatedRole)}
                className="bg-transparent text-teal-700 font-bold border-none text-xs focus:outline-none cursor-pointer"
              >
                <option value="GERENCIA">👔 Gerencia General (Aprobador)</option>
                <option value="DIRECTOR_FINANCIERO">💼 {sstBudgetState.financialRoleTitle} (Revisión)</option>
                <option value="LIDER_SST">👷 Líder SST (Formulador)</option>
                <option value="AUDITOR_COPASST">🛡️ Auditor / COPASST</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar inside Modal */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-slate-200 bg-white/80 shrink-0 text-xs font-semibold">
          <div className="flex gap-2">
            <button
              onClick={() => setModalTab('ITEMS')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                modalTab === 'ITEMS' ? 'bg-orange-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Rubros Presupuestales ({sstBudgetItems.length})</span>
              {observedItemsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                  {observedItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setModalTab('SIGNATURES')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                modalTab === 'SIGNATURES' ? 'bg-orange-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Firmas Digitales Tripartitas</span>
              {sstBudgetState.signatures.manager && sstBudgetState.signatures.financial && sstBudgetState.signatures.sstLeader && (
                <Check className="w-3.5 h-3.5 text-emerald-700" />
              )}
            </button>

            <button
              onClick={() => setModalTab('COPASST')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                modalTab === 'COPASST' ? 'bg-orange-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>COPASST: Trazabilidad Mensual ({sstBudgetState.copasstReviews?.length || 0})</span>
            </button>

            <button
              onClick={() => setModalTab('REPORT')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                modalTab === 'REPORT' ? 'bg-orange-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Vista Oficial Membretada</span>
            </button>
          </div>

          {/* Quick config button for Financial officer title */}
          <button
            type="button"
            onClick={() => setShowFinConfig(!showFinConfig)}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-teal-700 transition-colors"
            title="Configurar denominación del cargo financiero (Director Financiero / Contador Público)"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{sstBudgetState.financialRoleTitle}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Financial Config Dropdown Panel */}
          {showFinConfig && (
            <form onSubmit={handleSaveFinConfig} className="p-4 rounded-xl bg-white border border-teal-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" />
                  Configuración del Cargo Financiero (Adaptable a la Empresa)
                </span>
                <button type="button" onClick={() => setShowFinConfig(false)} className="text-slate-500 hover:text-slate-900">✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Denominación del Cargo *</label>
                  <select
                    value={finTitle}
                    onChange={(e) => setFinTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    <option value="Director Financiero">Director Financiero</option>
                    <option value="Contador Público">Contador Público</option>
                    <option value="Director Administrativo y Financiero">Director Administrativo y Financiero</option>
                    <option value="Jefe de Presupuesto">Jefe de Presupuesto</option>
                    <option value="Gerente Administrativo">Gerente Administrativo</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nombre del Profesional *</label>
                  <input
                    type="text"
                    required
                    value={finName}
                    onChange={(e) => setFinName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cédula / Tarjeta Profesional *</label>
                  <input
                    type="text"
                    required
                    value={finDoc}
                    onChange={(e) => setFinDoc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowFinConfig(false)}
                  className="px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
                >
                  Guardar Cargo Financiero
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 1: ITEMS / RUBROS & IN-SITU OBSERVATIONS & EDIT */}
          {/* ============================================================== */}
          {modalTab === 'ITEMS' && (
            <div className="space-y-4">
              
              {/* Alert if there are observed items */}
              {observedItemsCount > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-3 text-xs text-rose-800 animate-pulse">
                  <div className="flex items-start gap-2.5">
                    <AlertOctagon className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block text-rose-700">
                        {observedItemsCount} Rubro(s) con Observaciones de Gerencia Pendientes de Subsanar:
                      </strong>
                      Los rubros objetados se encuentran resaltados a continuación. Puede editarlos directamente in-situ y hacer clic en <strong>"Marcar como Corregido"</strong> para notificar a la Gerencia y al Líder SST.
                    </div>
                  </div>
                </div>
              )}

              {/* Financial KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="glass-card p-3.5 rounded-xl border border-slate-300">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Presupuesto Asignado
                  </span>
                  <div className="text-lg font-black text-slate-900 mt-0.5 font-mono">
                    ${totalPlanned.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">COP</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium block mt-1">
                    {filteredItems.length} rubros presupuestados
                  </span>
                </div>

                <div className="glass-card p-3.5 rounded-xl border border-slate-300">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                    Recursos Comprometidos
                  </span>
                  <div className="text-lg font-black text-slate-900 mt-0.5 font-mono">
                    ${totalCommitted.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">COP</span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-medium block mt-1">
                    {((totalCommitted / (totalPlanned || 1)) * 100).toFixed(1)}% reservado en contratos
                  </span>
                </div>

                <div className="glass-card p-3.5 rounded-xl border border-slate-300">
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                    Recursos Ejecutados
                  </span>
                  <div className="text-lg font-black text-slate-900 mt-0.5 font-mono">
                    ${totalExecuted.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">COP</span>
                  </div>
                  <span className="text-[10px] text-teal-700 font-medium block mt-1">
                    {executionPercentage.toFixed(1)}% ejecutado
                  </span>
                </div>

                <div className="glass-card p-3.5 rounded-xl border border-slate-300 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                      Estado de Aprobación
                    </span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        sstBudgetState.status === 'APROBADO_GERENCIA' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        sstBudgetState.status === 'EN_REVISION' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        sstBudgetState.status === 'RECHAZADO' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {sstBudgetState.status}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalTab('SIGNATURES')}
                    className="text-[11px] text-teal-700 hover:underline text-left mt-2"
                  >
                    Ver firmas digitales tripartitas →
                  </button>
                </div>
              </div>

              {/* ============================================================== */}
              {/* WORKFLOW ACTION BAR: FLUJO INTEGRADO DE REVISIÓN Y APROBACIÓN  */}
              {/* ============================================================== */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-white via-white to-slate-50 border border-slate-300 shadow-md">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Status description and active role context */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Flujo de Aprobación Institucional:
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                        sstBudgetState.status === 'APROBADO_GERENCIA' ? 'bg-emerald-50 text-emerald-700 border-emerald-700' :
                        sstBudgetState.status === 'EN_REVISION' ? 'bg-amber-50 text-amber-700 border-amber-700' :
                        sstBudgetState.status === 'RECHAZADO' ? 'bg-rose-50 text-rose-700 border-rose-700' :
                        'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {sstBudgetState.status === 'APROBADO_GERENCIA' ? '✓ APROBADO POR GERENCIA' :
                         sstBudgetState.status === 'EN_REVISION' ? '⏳ EN REVISIÓN EJECUTIVA' :
                         sstBudgetState.status === 'RECHAZADO' ? '⚠️ DEVUELTO CON OBSERVACIONES' :
                         '📝 BORRADOR EN FORMULACIÓN'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">
                      {currentSimulatedRole === 'LIDER_SST' && (
                        sstBudgetState.status === 'APROBADO_GERENCIA'
                          ? 'El presupuesto ya fue aprobado por la Gerencia. Pasa a la pestaña "Firmas Digitales Tripartitas" para estampar tu firma técnica.'
                          : sstBudgetState.status === 'EN_REVISION'
                          ? 'El presupuesto está en manos de Gerencia y Dirección Financiera para revisión y visto bueno.'
                          : 'Como Líder SST, formula o ajusta los rubros y remite el presupuesto a Gerencia y Finanzas para su revisión oficial.'
                      )}
                      {currentSimulatedRole === 'DIRECTOR_FINANCIERO' && (
                        sstBudgetState.status === 'APROBADO_GERENCIA'
                          ? 'El presupuesto cuenta con visto bueno de Gerencia. Procede a estampar la firma digital financiera.'
                          : 'Como responsable financiero/contable, verifica la viabilidad de las partidas y remite el presupuesto a Gerencia con tu concepto.'
                      )}
                      {currentSimulatedRole === 'GERENCIA' && (
                        sstBudgetState.status === 'APROBADO_GERENCIA'
                          ? 'Has aprobado oficialmente este presupuesto. Las partes ya pueden estampar sus firmas digitales.'
                          : 'Como Representante Legal / Gerente, evalúa los recursos asignados para emitir tu aprobación oficial o devolverlo con observaciones.'
                      )}
                      {currentSimulatedRole === 'AUDITOR_COPASST' && (
                        'Como miembro del COPASST o Auditor, verifica los rubros y registra la trazabilidad de la revisión mensual en la pestaña COPASST.'
                      )}
                    </p>
                  </div>

                  {/* Action buttons depending on currentSimulatedRole */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    
                    {/* 1. LÍDER SST BUTTONS */}
                    {currentSimulatedRole === 'LIDER_SST' && (
                      <>
                        {(sstBudgetState.status === 'BORRADOR' || sstBudgetState.status === 'RECHAZADO') && (
                          <button
                            type="button"
                            onClick={() => {
                              updateSstBudgetApproval('EN_REVISION', 'Formulación remitida a Gerencia y Finanzas para revisión', 'LIDER_SST', 'Líder SG-SST');
                              showNotification('🚀 Presupuesto remitido a Gerencia General y Dirección Financiera para revisión.', 'info');
                            }}
                            className="px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Enviar a Gerencia y Finanzas para Revisión</span>
                          </button>
                        )}

                        {sstBudgetState.status === 'EN_REVISION' && (
                          <span className="text-xs text-amber-700 font-semibold px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Enviado a Gerencia (En Espera de Visto Bueno)</span>
                          </span>
                        )}

                        {sstBudgetState.status === 'APROBADO_GERENCIA' && (
                          <button
                            type="button"
                            onClick={() => setModalTab('SIGNATURES')}
                            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Firmar como Líder SST →</span>
                          </button>
                        )}
                      </>
                    )}

                    {/* 2. DIRECTOR FINANCIERO / CONTADOR BUTTONS */}
                    {currentSimulatedRole === 'DIRECTOR_FINANCIERO' && (
                      <>
                        {sstBudgetState.status !== 'APROBADO_GERENCIA' && (
                          <button
                            type="button"
                            onClick={() => {
                              updateSstBudgetApproval(
                                'EN_REVISION',
                                `Concepto financiero favorable y partidas contables validadas por ${sstBudgetState.financialRoleTitle}`,
                                'DIRECTOR_FINANCIERO',
                                sstBudgetState.financialOfficerName
                              );
                              showNotification(`💼 Concepto financiero favorable emitido. Presupuesto remitido a Gerencia para aprobación final.`, 'info');
                            }}
                            className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Validar y Enviar a Gerencia con Concepto Financiero</span>
                          </button>
                        )}

                        {sstBudgetState.status === 'APROBADO_GERENCIA' && (
                          <button
                            type="button"
                            onClick={() => setModalTab('SIGNATURES')}
                            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Firmar como {sstBudgetState.financialRoleTitle} →</span>
                          </button>
                        )}
                      </>
                    )}

                    {/* 3. GERENCIA GENERAL BUTTONS (APROBACIÓN O DEVOLUCIÓN) */}
                    {currentSimulatedRole === 'GERENCIA' && (
                      <div className="flex items-center gap-2">
                        {sstBudgetState.status !== 'APROBADO_GERENCIA' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setGeneralDevolucionOpen(!generalDevolucionOpen)}
                              className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                              <span>Devolver con Observaciones</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                updateSstBudgetApproval(
                                  'APROBADO_GERENCIA',
                                  'Presupuesto integrado anual formalmente aprobado por Gerencia General',
                                  'GERENCIA',
                                  sstBudgetState.signatures.manager?.name || 'Gerencia General'
                                );
                                updateStandardStatus('std-1.1.3', 'CUMPLE', 'Presupuesto integrado anual aprobado por Gerencia General (Dec. 1072 Art. 2.2.4.6.8 Numeral 4).');
                                showNotification('🎉 ¡Presupuesto Anual Aprobado Oficialmente por Gerencia General!', 'success');
                              }}
                              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2 ring-2 ring-emerald-200"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>✓ Aprobar Presupuesto Oficialmente</span>
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" />
                              Aprobado por Gerencia
                            </span>
                            <button
                              type="button"
                              onClick={() => setModalTab('SIGNATURES')}
                              className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow flex items-center gap-1.5"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Gestionar Firmas Tripartitas →</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Gerencia general return form if toggled */}
                {generalDevolucionOpen && currentSimulatedRole === 'GERENCIA' && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 animate-in fade-in">
                    <label className="text-xs font-bold text-rose-700 block">
                      Observación General de Devolución para el Dir. Financiero / Contador y Líder SST:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={generalDevolucionComment}
                        onChange={(e) => setGeneralDevolucionComment(e.target.value)}
                        placeholder="Ej: Se requiere justificar el incremento de partidas o ajustar montos en capacitación..."
                        className="flex-1 bg-slate-50 border border-rose-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateSstBudgetApproval(
                            'RECHAZADO',
                            generalDevolucionComment || 'Devuelto por Gerencia General para ajustes presupuestales',
                            'GERENCIA',
                            sstBudgetState.signatures.manager?.name || 'Gerencia General'
                          );
                          setGeneralDevolucionOpen(false);
                          setGeneralDevolucionComment('');
                          showNotification('⚠️ Presupuesto devuelto a Líder SST y Dirección Financiera con observaciones.', 'warning');
                        }}
                        className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0"
                      >
                        Confirmar Devolución
                      </button>
                      <button
                        type="button"
                        onClick={() => setGeneralDevolucionOpen(false)}
                        className="px-2 py-2 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 text-xs"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Filters and Add Button */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex rounded-lg bg-white p-0.5 border border-slate-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setSelectedSystemFilter('ALL')}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      selectedSystemFilter === 'ALL' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Todos ({sstBudgetItems.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSystemFilter('SST')}
                    className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                      selectedSystemFilter === 'SST' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <HardHat className="w-3.5 h-3.5" />
                    <span>SG-SST (Dec. 1072)</span>
                  </button>

                  {isPesvActive && (
                    <button
                      type="button"
                      onClick={() => setSelectedSystemFilter('PESV')}
                      className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                        selectedSystemFilter === 'PESV' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>PESV Vial (Res. 40595)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedSystemFilter('TRANSVERSAL')}
                    className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                      selectedSystemFilter === 'TRANSVERSAL' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Transversales Multi-Sistema</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setFormConcept('');
                    setFormDesc('');
                    setFormPlanned(5000000);
                    setFormIsAllSystems(false);
                    setShowAddForm(!showAddForm);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Nuevo Rubro</span>
                </button>
              </div>

              {/* Add / Edit Form */}
              {showAddForm && (
                <form onSubmit={handleSaveItem} className="p-4 rounded-xl bg-white border border-slate-300 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {editingItem ? `Editar Rubro: "${editingItem.concept}" (Edición In-Situ)` : 'Agregar Rubro al Presupuesto Integrado'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingItem(null);
                      }}
                      className="text-slate-500 hover:text-slate-900"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Sistema Principal *</label>
                      <select
                        value={formSystem}
                        onChange={(e) => setFormSystem(e.target.value as BudgetSystem)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                      >
                        <option value="SST">SG-SST (Decreto 1072 / Res 0312)</option>
                        {isPesvActive && <option value="PESV">PESV Vial (Resolución 40595/2022)</option>}
                        <option value="AMBIENTAL">Gestión Ambiental / RESPEL</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Categoría de Recurso *</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as BudgetResourceCategory)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                      >
                        <option value="HUMANO">Recursos Humanos / Asesoría</option>
                        <option value="TECNICO">Recursos Técnicos / Mediciones</option>
                        <option value="FISICO">Recursos Físicos / Equipos</option>
                        <option value="MEDICO">Evaluaciones Médicas</option>
                        <option value="EPP">Elementos de Protección EPP</option>
                        <option value="CAPACITACION">Capacitación y Entrenamiento</option>
                        <option value="EMERGENCIAS">Plan de Emergencias / Brigada</option>
                        <option value="FINANCIERO">Financiero Directo</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Periodo / Periodicidad</label>
                      <select
                        value={formQuarter}
                        onChange={(e) => setFormQuarter(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                      >
                        <option value="ANUAL">Anual (Vigencia Completa)</option>
                        <option value="Q1">Trimestre 1 (Q1)</option>
                        <option value="Q2">Trimestre 2 (Q2)</option>
                        <option value="Q3">Trimestre 3 (Q3)</option>
                        <option value="Q4">Trimestre 4 (Q4)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Concepto del Rubro *</label>
                      <input
                        type="text"
                        required
                        value={formConcept}
                        onChange={(e) => setFormConcept(e.target.value)}
                        placeholder="Ej: Mantenimiento e inspección de frenos de camiones de carga..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Monto Presupuestado (COP) *</label>
                      <input
                        type="number"
                        required
                        min={100000}
                        step={100000}
                        value={formPlanned}
                        onChange={(e) => setFormPlanned(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Descripción y Justificación</label>
                      <input
                        type="text"
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        placeholder="Detalles sobre entregables, cotizaciones o insumos requeridos..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Líder o Responsable del Rubro</label>
                      <input
                        type="text"
                        value={formResponsible}
                        onChange={(e) => setFormResponsible(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                      />
                    </div>

                    {/* Transversal checkbox */}
                    <div className="sm:col-span-3 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <input
                          type="checkbox"
                          checked={formIsAllSystems}
                          onChange={(e) => setFormIsAllSystems(e.target.checked)}
                          className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-white border-slate-300"
                        />
                        <span className="text-xs text-purple-700 font-medium">
                          <strong>Aplicar a todos los sistemas integrados transversalmente</strong> (SST + Vial PESV + Ambiental + ISO)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingItem(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
                    >
                      {editingItem ? 'Guardar Cambios del Rubro' : 'Guardar en Presupuesto'}
                    </button>
                  </div>
                </form>
              )}

              {/* Items Table */}
              <div className="glass-card rounded-xl border border-slate-300 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-white text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3">Sistema / Categoría</th>
                        <th className="p-3">Concepto & Marco Legal</th>
                        <th className="p-3">Responsable</th>
                        <th className="p-3 text-right">Presupuestado</th>
                        <th className="p-3 text-right">Ejecutado</th>
                        <th className="p-3 text-center">Avance</th>
                        <th className="p-3 text-center">Estado</th>
                        <th className="p-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredItems.map(item => {
                        const percent = item.plannedAmount > 0 ? (item.executedAmount / item.plannedAmount) * 100 : 0;
                        const isObserved = Boolean(item.hasObservation && !item.observationResolved);
                        const isResolved = Boolean(item.observationResolved);

                        return (
                          <tr
                            key={item.id}
                            className={`transition-all ${
                              isObserved
                                ? 'bg-rose-50 border-l-4 border-rose-500 ring-1 ring-rose-200'
                                : isResolved
                                ? 'bg-emerald-50 border-l-4 border-emerald-500'
                                : 'hover:bg-slate-100'
                            }`}
                          >
                            <td className="p-3 align-top whitespace-nowrap">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                                item.isAllSystems
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : item.system === 'SST'
                                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : 'bg-teal-50 text-teal-700 border-teal-200'
                              }`}>
                                {item.isAllSystems ? 'TRANSVERSAL' : item.system} • {item.category}
                              </span>
                              <span className="block text-[10px] text-slate-500 mt-1 font-mono">
                                {item.quarter}
                              </span>
                            </td>

                            <td className="p-3 align-top max-w-sm">
                              <div className="font-semibold text-slate-900">{item.concept}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{item.description}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-1">
                                {item.decreto1072Rel}
                                {item.pesvRel && <span> • {item.pesvRel}</span>}
                              </div>

                              {/* Observation Callout if flagged */}
                              {isObserved && (
                                <div className="mt-2 p-2 rounded bg-rose-50 border border-rose-200 text-[11px] text-rose-800">
                                  <div className="font-bold flex items-center gap-1 text-rose-700">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Observación Gerencial:</span>
                                  </div>
                                  <p className="mt-0.5 italic">"{item.observationComment}"</p>
                                  
                                  <div className="mt-2 flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEdit(item)}
                                      className="px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-900 font-semibold text-[10px] border border-slate-300"
                                    >
                                      Editar Rubro
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => resolveBudgetItemObservation(item.id)}
                                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow"
                                    >
                                      ✓ Marcar como Corregido / Subsanado
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Resolved Callout */}
                              {isResolved && (
                                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>Subsanado y enviado a Gerencia ({item.resolvedAt})</span>
                                </div>
                              )}
                            </td>

                            <td className="p-3 align-top whitespace-nowrap text-[11px] text-slate-700">
                              {item.responsible}
                            </td>

                            <td className="p-3 align-top text-right whitespace-nowrap font-mono text-slate-900 font-semibold">
                              ${item.plannedAmount.toLocaleString('es-CO')}
                            </td>

                            <td className="p-3 align-top text-right whitespace-nowrap font-mono text-emerald-700 font-semibold">
                              ${item.executedAmount.toLocaleString('es-CO')}
                            </td>

                            <td className="p-3 align-top text-center whitespace-nowrap">
                              <span className="font-mono text-xs font-bold text-slate-800">{percent.toFixed(0)}%</span>
                              <div className="w-16 bg-slate-100 rounded-full h-1.5 mx-auto mt-1">
                                <div
                                  className="bg-emerald-500 h-1.5 rounded-full"
                                  style={{ width: `${Math.min(percent, 100)}%` }}
                                />
                              </div>
                            </td>

                            <td className="p-3 align-top text-center whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.status === 'EJECUTADO' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                item.status === 'EN_EJECUCION' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {item.status}
                              </span>
                            </td>

                            <td className="p-3 align-top text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                {/* Gerencia Observation button */}
                                {currentSimulatedRole === 'GERENCIA' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setObservingItemId(observingItemId === item.id ? null : item.id);
                                      setItemObservationText('');
                                    }}
                                    className="p-1.5 rounded bg-slate-100 text-amber-700 hover:bg-slate-200"
                                    title="Objetar / Devolver este rubro con observación"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                  </button>
                                )}

                                {/* In-situ Edit button */}
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(item)}
                                  className="p-1.5 rounded bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                                  title="Editar este rubro in-situ"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => deleteSstBudgetItem(item.id)}
                                  className="p-1.5 rounded bg-slate-100 text-rose-700 hover:bg-rose-50"
                                  title="Eliminar rubro"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Inline observation input box if active */}
                              {observingItemId === item.id && (
                                <div className="mt-2 text-left p-2 rounded bg-white border border-amber-200 space-y-1.5">
                                  <span className="text-[10px] font-bold text-amber-700 block">
                                    Objetar Rubro (Observación Gerencial):
                                  </span>
                                  <input
                                    type="text"
                                    autoFocus
                                    value={itemObservationText}
                                    onChange={(e) => setItemObservationText(e.target.value)}
                                    placeholder="Motivo de ajuste para el Dir. Financiero..."
                                    className="w-48 bg-slate-50 border border-slate-300 rounded p-1 text-xs text-slate-900"
                                  />
                                  <div className="flex justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setObservingItemId(null)}
                                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700"
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleFlagObservation(item.id)}
                                      className="px-2 py-0.5 rounded text-[10px] bg-amber-600 hover:bg-amber-500 text-white font-bold"
                                    >
                                      Enviar Observación
                                    </button>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: FIRMAS DIGITALES TRIPARTITAS (GERENCIA, FINANZAS, SST) */}
          {/* ============================================================== */}
          {modalTab === 'SIGNATURES' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Formalización y Legalización Digital del Presupuesto
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Decreto 1072 de 2015 Art. 2.2.4.6.8 Numeral 4
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  Para que el presupuesto adquiera validez jurídica institucional y soporte auditorías de la ARL o del Ministerio del Trabajo, se requiere la estampa de firma digital de las tres partes responsables:
                </p>
              </div>

              {/* Three Signatures Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Gerencia General */}
                <div className="glass-card p-4 rounded-xl border border-slate-300 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700">
                        1. Aprobador Legal
                      </span>
                      {sstBudgetState.signatures.manager ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          ✓ Firmado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                          Pendiente
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">Gerencia General</div>
                    <div className="text-xs text-slate-700 mt-0.5">
                      {sstBudgetState.signatures.manager?.name || 'Lic. Fernando Ortiz Salazar'}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Representante Legal • C.C. {sstBudgetState.signatures.manager?.docNumber || '79.845.120'}
                    </p>
                  </div>

                  {sstBudgetState.signatures.manager ? (
                    <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-500 space-y-0.5">
                      <div className="text-emerald-700 font-bold">Firma Digital Estampada</div>
                      <div>Fecha: {sstBudgetState.signatures.manager.signedAt}</div>
                      <div className="truncate text-slate-500">Token: {sstBudgetState.signatures.manager.token}</div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSignAsParty('manager')}
                      className="w-full py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Firmar como Gerente General</span>
                    </button>
                  )}
                </div>

                {/* 2. Director Financiero / Contador */}
                <div className="glass-card p-4 rounded-xl border border-slate-300 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                        2. Validador de Recursos
                      </span>
                      {sstBudgetState.signatures.financial ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          ✓ Firmado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                          Pendiente
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">{sstBudgetState.financialRoleTitle}</div>
                    <div className="text-xs text-slate-700 mt-0.5">
                      {sstBudgetState.financialOfficerName}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Doc: {sstBudgetState.financialOfficerDoc}
                    </p>
                  </div>

                  {sstBudgetState.signatures.financial ? (
                    <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-500 space-y-0.5">
                      <div className="text-emerald-700 font-bold">Firma Digital Estampada</div>
                      <div>Fecha: {sstBudgetState.signatures.financial.signedAt}</div>
                      <div className="truncate text-slate-500">Token: {sstBudgetState.signatures.financial.token}</div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSignAsParty('financial')}
                      className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Firmar como {sstBudgetState.financialRoleTitle}</span>
                    </button>
                  )}
                </div>

                {/* 3. Líder del SG-SST */}
                <div className="glass-card p-4 rounded-xl border border-slate-300 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                        3. Formulador Técnico
                      </span>
                      {sstBudgetState.signatures.sstLeader ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          ✓ Firmado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                          Pendiente
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">Líder del SG-SST</div>
                    <div className="text-xs text-slate-700 mt-0.5">
                      {sstBudgetState.signatures.sstLeader?.name || 'Ing. Marcela Rincón Ortiz'}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      Licencia: {sstBudgetState.signatures.sstLeader?.licenseNumber || 'LIC-SST-2023-08941'}
                    </p>
                  </div>

                  {sstBudgetState.signatures.sstLeader ? (
                    <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-500 space-y-0.5">
                      <div className="text-emerald-700 font-bold">Firma Digital Estampada</div>
                      <div>Fecha: {sstBudgetState.signatures.sstLeader.signedAt}</div>
                      <div className="truncate text-slate-500">Token: {sstBudgetState.signatures.sstLeader.token}</div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSignAsParty('sstLeader')}
                      className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Firmar como Líder SST</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: COPASST (REVISIONES EN REUNIONES MENSUALES) */}
          {/* ============================================================== */}
          {modalTab === 'COPASST' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-700" />
                    Trazabilidad de Revisión de Recursos en Reuniones Mensuales del COPASST
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold">
                    Res. 2013/86 & Dec. 1072 Art. 2.2.4.6.11
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  En cumplimiento de sus funciones de veeduría y promoción, el <strong>COPASST revisa la asignación y ejecución del presupuesto en cada una de sus reuniones mensuales ordinarias</strong>. Aquí se asienta la constancia formal de dicha revisión para el acta correspondiente.
                </p>
              </div>

              {/* Form to log monthly COPASST review */}
              <form onSubmit={handleSaveCopasstReview} className="glass-card p-4 rounded-xl border border-slate-300 space-y-3">
                <h4 className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  + Registrar Revisión de Presupuesto en Reunión Mensual del COPASST
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Fecha de la Reunión *</label>
                    <input
                      type="date"
                      required
                      value={copMeetingDate}
                      onChange={(e) => setCopMeetingDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Número de Acta *</label>
                    <input
                      type="text"
                      required
                      value={copActaNumber}
                      onChange={(e) => setCopActaNumber(e.target.value)}
                      placeholder="Ej: Acta Ordinaria No. 04"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Presentado / Revisado Por</label>
                    <input
                      type="text"
                      required
                      value={copReviewedBy}
                      onChange={(e) => setCopReviewedBy(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Concepto del COPASST</label>
                    <select
                      value={copStatus}
                      onChange={(e) => setCopStatus(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                    >
                      <option value="CONFORME">✓ Conforme y Viable</option>
                      <option value="CON_OBSERVACIONES">⚠️ Con Recomendaciones de Ajuste</option>
                    </select>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="font-semibold text-slate-700 block mb-1">
                      Observaciones y Recomendaciones del COPASST en la Reunión *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={copObservations}
                      onChange={(e) => setCopObservations(e.target.value)}
                      placeholder="Ej: El comité constató la dotación de EPP del trimestre y recomendó priorizar la capacitación en manejo defensivo para conductores..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow"
                  >
                    Asentar Constancia en Historial del COPASST
                  </button>
                </div>
              </form>

              {/* Log History of COPASST Reviews */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Historial de Revisiones del COPASST Asentadas
                </h4>

                {(sstBudgetState.copasstReviews || []).map(rev => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-teal-700 font-bold">{rev.actaNumber}</span>
                        <span className="text-slate-500">• Fecha: {rev.meetingDate}</span>
                        <span className="text-slate-700 font-medium">({rev.reviewedBy})</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rev.status === 'CONFORME'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {rev.status}
                      </span>
                    </div>

                    <p className="text-slate-700 text-xs italic bg-slate-50 p-2.5 rounded border border-slate-200">
                      "{rev.observations}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: REPORTE OFICIAL MEMBRETADO (PRINT / PDF) */}
          {/* ============================================================== */}
          {modalTab === 'REPORT' && (
            <div className="space-y-4">
              <div className="flex justify-end gap-2 pb-2">
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Guardar en PDF</span>
                </button>
              </div>

              {/* Printable Document Paper */}
              <div className="bg-white text-slate-950 rounded-2xl p-6 sm:p-10 shadow-2xl font-sans text-xs leading-relaxed border border-slate-300 print:shadow-none print:border-none print:p-0">
                {/* Header */}
                <div className="border-b-2 border-slate-200 pb-4 mb-5 flex justify-between items-start">
                  <div>
                    <h1 className="text-base font-black uppercase text-slate-900 tracking-tight">
                      {organization.name}
                    </h1>
                    <p className="text-[11px] text-slate-600 font-mono">
                      NIT: {organization.nit} • Actividad Económica: {organization.ciiu}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Sede: {organization.sites[0]?.name} ({organization.sites[0]?.city})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-900 border border-slate-300 rounded font-mono text-[10px] font-bold">
                      FORMATO: FT-SST-003
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1">Presupuesto Anual Integrado 2026</span>
                  </div>
                </div>

                <div className="text-center my-4 space-y-1">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    ACTA OFICIAL DE ASIGNACIÓN Y EJECUCIÓN DE RECURSOS PARA EL SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST) {isPesvActive ? 'Y PLAN ESTRATÉGICO DE SEGURIDAD VIAL (PESV)' : ''}
                  </h2>
                  <p className="text-[11px] text-slate-600 italic">
                    Conforme al Decreto 1072 de 2015 (Art. 2.2.4.6.8 Numeral 4) y la Resolución 0312 de 2019 (Estándar 1.1.3) {isPesvActive ? 'y la Resolución 40595 de 2022' : ''}
                  </p>
                </div>

                {/* Table in Document */}
                <div className="my-5 overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-300 text-[10px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 font-bold">
                        <th className="border border-slate-300 p-2 text-left">Sistema / Recurso</th>
                        <th className="border border-slate-300 p-2 text-left">Concepto & Marco Legal</th>
                        <th className="border border-slate-300 p-2 text-left">Periodo</th>
                        <th className="border border-slate-300 p-2 text-right">Presupuestado</th>
                        <th className="border border-slate-300 p-2 text-right">Ejecutado</th>
                        <th className="border border-slate-300 p-2 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map(item => (
                        <tr key={item.id} className="border border-slate-300">
                          <td className="border border-slate-300 p-2 font-bold">
                            {item.isAllSystems ? 'TRANSVERSAL' : item.system} • {item.category}
                          </td>
                          <td className="border border-slate-300 p-2">
                            <strong>{item.concept}</strong><br />
                            <span className="text-slate-600">{item.decreto1072Rel}</span>
                          </td>
                          <td className="border border-slate-300 p-2">{item.quarter}</td>
                          <td className="border border-slate-300 p-2 text-right font-mono font-bold">
                            ${item.plannedAmount.toLocaleString('es-CO')}
                          </td>
                          <td className="border border-slate-300 p-2 text-right font-mono">
                            ${item.executedAmount.toLocaleString('es-CO')}
                          </td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{item.status}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                        <td colSpan={3} className="p-2 text-right">TOTAL CONSOLIDADO 2026:</td>
                        <td className="p-2 text-right font-mono">${totalPlanned.toLocaleString('es-CO')} COP</td>
                        <td className="p-2 text-right font-mono">${totalExecuted.toLocaleString('es-CO')} COP</td>
                        <td className="p-2 text-center font-mono">{executionPercentage.toFixed(1)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* COPASST Review Log Section in Printable */}
                <div className="my-6 p-3 rounded border border-slate-300 bg-slate-50 text-[10px] space-y-1">
                  <strong>Constancias de Veeduría Mensual por el COPASST:</strong>
                  {(sstBudgetState.copasstReviews || []).map(r => (
                    <div key={r.id} className="border-b border-slate-200 pb-1 pt-1">
                      <strong>{r.actaNumber} ({r.meetingDate}):</strong> {r.observations} — <em>Concepto: {r.status}</em>
                    </div>
                  ))}
                </div>

                {/* Signatures 3 Columns */}
                <div className="grid grid-cols-3 gap-6 pt-10 mt-6 border-t border-slate-300 text-[10px]">
                  {/* Gerencia */}
                  <div className="space-y-1 border-t border-slate-200 pt-2">
                    <p className="font-bold text-slate-900 leading-tight">
                      {sstBudgetState.signatures.manager?.name || 'Lic. Fernando Ortiz Salazar'}
                    </p>
                    <p className="text-slate-600">Representante Legal / Gerente General</p>
                    <p className="text-slate-500 font-mono">C.C. {sstBudgetState.signatures.manager?.docNumber || '79.845.120'}</p>
                    {sstBudgetState.signatures.manager && (
                      <p className="text-emerald-700 font-mono font-bold">
                        ✓ Firmado: {sstBudgetState.signatures.manager.signedAt}<br />
                        <span className="text-[9px] text-slate-500">{sstBudgetState.signatures.manager.token}</span>
                      </p>
                    )}
                  </div>

                  {/* Finanzas */}
                  <div className="space-y-1 border-t border-slate-200 pt-2">
                    <p className="font-bold text-slate-900 leading-tight">
                      {sstBudgetState.financialOfficerName}
                    </p>
                    <p className="text-slate-600">{sstBudgetState.financialRoleTitle}</p>
                    <p className="text-slate-500 font-mono">Doc: {sstBudgetState.financialOfficerDoc}</p>
                    {sstBudgetState.signatures.financial && (
                      <p className="text-emerald-700 font-mono font-bold">
                        ✓ Firmado: {sstBudgetState.signatures.financial.signedAt}<br />
                        <span className="text-[9px] text-slate-500">{sstBudgetState.signatures.financial.token}</span>
                      </p>
                    )}
                  </div>

                  {/* SST Leader */}
                  <div className="space-y-1 border-t border-slate-200 pt-2">
                    <p className="font-bold text-slate-900 leading-tight">
                      {sstBudgetState.signatures.sstLeader?.name || 'Ing. Marcela Rincón Ortiz'}
                    </p>
                    <p className="text-slate-600">Líder del SG-SST</p>
                    <p className="text-slate-500 font-mono">Licencia: {sstBudgetState.signatures.sstLeader?.licenseNumber || 'LIC-SST-2023-08941'}</p>
                    {sstBudgetState.signatures.sstLeader && (
                      <p className="text-emerald-700 font-mono font-bold">
                        ✓ Firmado: {sstBudgetState.signatures.sstLeader.signedAt}<br />
                        <span className="text-[9px] text-slate-500">{sstBudgetState.signatures.sstLeader.token}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
