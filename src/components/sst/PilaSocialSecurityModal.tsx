'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { PilaPayrollRecord, PilaPayrollType, PilaOperator } from '@/types/social-security';
import {
  X,
  Upload,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  AlertTriangle,
  Users,
  Search,
  Filter,
  Shield,
  Download,
  Eye,
  Trash2,
  FileCheck,
  Building,
  UserCheck,
  Check,
  Flame,
  Info
} from 'lucide-react';

interface PilaSocialSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPayrollType?: PilaPayrollType;
}

export const PilaSocialSecurityModal: React.FC<PilaSocialSecurityModalProps> = ({
  isOpen,
  onClose,
  defaultPayrollType = 'GENERAL'
}) => {
  const {
    workers,
    pilaRecords,
    addPilaRecord,
    deletePilaRecord,
    showNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<'RECORDS' | 'UPLOAD' | 'ALTO_RIESGO'>('RECORDS');

  // Filtros en pestaña de registros
  const [selectedWorkerFilter, setSelectedWorkerFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | PilaPayrollType>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Formulario de carga de nueva planilla
  const [payrollType, setPayrollType] = useState<PilaPayrollType>(defaultPayrollType);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [period, setPeriod] = useState<string>(() => {
    const d = new Date();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  });
  const [pinNumber, setPinNumber] = useState<string>('');
  const [operator, setOperator] = useState<PilaOperator>('SOI');
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Archivo real cargado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');

  // Trabajadores seleccionados para la planilla
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>(() => 
    workers.filter(w => w.status === 'ACTIVO').map(w => w.id)
  );
  const [workerSearchTerm, setWorkerSearchTerm] = useState<string>('');

  // Manejador de selección de archivo real con FileReader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFileName(file.name);
    const sizeInKb = (file.size / 1024).toFixed(1);
    setFileSize(file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKb} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Selector masivo de trabajadores
  const handleSelectAllWorkers = () => {
    setSelectedWorkerIds(workers.filter(w => w.status === 'ACTIVO').map(w => w.id));
  };

  const handleDeselectAllWorkers = () => {
    setSelectedWorkerIds([]);
  };

  const toggleWorkerSelection = (id: string) => {
    setSelectedWorkerIds(prev =>
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  // Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentDate) {
      showNotification('Por favor ingrese la fecha del pago de la planilla', 'warning');
      return;
    }
    if (!pinNumber.trim()) {
      showNotification('Por favor ingrese el número de planilla o PIN de liquidación', 'warning');
      return;
    }
    if (selectedWorkerIds.length === 0) {
      showNotification('Debe seleccionar al menos un trabajador cubierto por la planilla', 'warning');
      return;
    }

    const finalFileName = fileName || `Planilla_PILA_${period.replace(/\s+/g, '_')}_PIN_${pinNumber}.pdf`;
    const finalFileSize = fileSize || '1.8 MB';

    addPilaRecord({
      paymentDate,
      period,
      pinNumber: pinNumber.trim(),
      payrollType,
      operator,
      totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
      coveredWorkerIds: selectedWorkerIds,
      fileName: finalFileName,
      fileSize: finalFileSize,
      fileType: selectedFile?.type || 'application/pdf',
      fileBase64: fileBase64,
      fileUrl: fileBase64 || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      uploadedBy: 'Responsable SG-SST',
      notes: notes.trim()
    });

    // Resetear formulario
    setSelectedFile(null);
    setFileBase64(undefined);
    setFileName('');
    setFileSize('');
    setPinNumber('');
    setTotalAmount('');
    setNotes('');
    setActiveTab('RECORDS');
  };

  // Filtrado de planillas registradas
  const filteredRecords = useMemo(() => {
    return pilaRecords.filter(rec => {
      // Filtro por tipo
      if (typeFilter !== 'ALL' && rec.payrollType !== typeFilter) return false;
      
      // Filtro por trabajador específico
      if (selectedWorkerFilter !== 'ALL' && !rec.coveredWorkerIds.includes(selectedWorkerFilter)) {
        return false;
      }

      // Filtro por texto (PIN, periodo, notas)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPin = rec.pinNumber.toLowerCase().includes(q);
        const matchesPeriod = rec.period.toLowerCase().includes(q);
        const matchesOperator = rec.operator.toLowerCase().includes(q);
        const matchesWorkers = rec.coveredWorkerIds.some(wId => {
          const w = workers.find(wrk => wrk.id === wId);
          return w ? `${w.firstName} ${w.lastName} ${w.docNumber}`.toLowerCase().includes(q) : false;
        });
        if (!matchesPin && !matchesPeriod && !matchesOperator && !matchesWorkers) return false;
      }

      return true;
    });
  }, [pilaRecords, typeFilter, selectedWorkerFilter, searchQuery, workers]);

  // Trabajador actualmente seleccionado para visualización detallada
  const activeWorkerObj = useMemo(() => {
    if (selectedWorkerFilter === 'ALL') return null;
    return workers.find(w => w.id === selectedWorkerFilter) || null;
  }, [selectedWorkerFilter, workers]);

  // Trabajadores filtrados para selector del formulario
  const filteredWorkersForForm = useMemo(() => {
    if (!workerSearchTerm.trim()) return workers;
    const term = workerSearchTerm.toLowerCase();
    return workers.filter(w =>
      `${w.firstName} ${w.lastName} ${w.docNumber} ${w.position}`.toLowerCase().includes(term)
    );
  }, [workers, workerSearchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-50 border border-slate-300 rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-white/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Estándar 1.1.4 & 1.1.5 • Dec. 1072 / Res. 0312
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {pilaRecords.length} planillas en custodia
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                Afiliación y Pago de Planillas de Seguridad Social (PILA)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 border-b border-slate-200 bg-white flex items-center gap-2 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('RECORDS')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'RECORDS'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Historial & Filtros por Trabajador</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {filteredRecords.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('UPLOAD')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'UPLOAD'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Cargar Planilla PILA (Soporte Digital)</span>
          </button>

          <button
            onClick={() => setActiveTab('ALTO_RIESGO')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'ALTO_RIESGO'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Pensión Especial Alto Riesgo (Estándar 1.1.5)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          
          {/* ============================================================== */}
          {/* TAB 1: HISTORIAL Y FILTROS POR TRABAJADOR */}
          {/* ============================================================== */}
          {activeTab === 'RECORDS' && (
            <div className="space-y-4">
              
              {/* Filter controls */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Selector / Filtro por trabajador */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      Filtrar por Trabajador Específico:
                    </label>
                    <select
                      value={selectedWorkerFilter}
                      onChange={(e) => setSelectedWorkerFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
                    >
                      <option value="ALL">-- Ver todos los trabajadores --</option>
                      {workers.map(w => (
                        <option key={w.id} value={w.id}>
                          {w.firstName} {w.lastName} ({w.docType} {w.docNumber}) - {w.position}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por tipo de planilla */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-teal-600" />
                      Tipo de Planilla:
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
                    >
                      <option value="ALL">Todas las Planillas (General y Alto Riesgo)</option>
                      <option value="GENERAL">Estándar 1.1.4: General (Salud, Pensión, ARL, CCF)</option>
                      <option value="ALTO_RIESGO">Estándar 1.1.5: Alto Riesgo (Dec. 2090/2003)</option>
                    </select>
                  </div>

                  {/* Buscador de texto */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Search className="w-3.5 h-3.5 text-slate-500" />
                      Buscar por PIN, Periodo u Operador:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: PIN-984, Febrero, SOI..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Banner de trabajador filtrado si hay uno seleccionado */}
                {activeWorkerObj && (
                  <div className="mt-2 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-3">
                      {activeWorkerObj.photoUrl ? (
                        <img
                          src={activeWorkerObj.photoUrl}
                          alt={activeWorkerObj.firstName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-sm">
                          {activeWorkerObj.firstName[0]}{activeWorkerObj.lastName[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                          {activeWorkerObj.firstName} {activeWorkerObj.lastName}
                          <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-emerald-200 text-emerald-800">
                            {activeWorkerObj.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {activeWorkerObj.docType} {activeWorkerObj.docNumber} • {activeWorkerObj.position} • {activeWorkerObj.area}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Cobertura PILA</div>
                        <div className="font-bold text-emerald-700 flex items-center gap-1 justify-end">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{filteredRecords.length} planillas encontradas</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedWorkerFilter('ALL')}
                        className="text-xs px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold transition-colors"
                      >
                        Quitar filtro
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Records List / Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    Planillas de Liquidación Registradas ({filteredRecords.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('UPLOAD')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>+ Cargar otra planilla</span>
                  </button>
                </div>

                {filteredRecords.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {filteredRecords.map((record) => {
                      const coveredCount = record.coveredWorkerIds.length;
                      const isHighRisk = record.payrollType === 'ALTO_RIESGO';

                      return (
                        <div key={record.id} className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          {/* Info principal */}
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                isHighRisk 
                                  ? 'bg-amber-50 text-amber-800 border-amber-300 flex items-center gap-1' 
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 flex items-center gap-1'
                              }`}>
                                {isHighRisk && <Flame className="w-3 h-3 text-amber-600" />}
                                {isHighRisk ? 'Pensión Especial Alto Riesgo (1.1.5)' : 'PILA General (1.1.4)'}
                              </span>

                              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {record.pinNumber}
                              </span>

                              <span className="text-[11px] font-bold text-slate-700">
                                Periodo: {record.period}
                              </span>

                              <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                Operador: {record.operator}
                              </span>
                            </div>

                            {/* Fecha de pago de la planilla resaltada */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-0.5">
                              <div className="flex items-center gap-1.5 font-semibold text-slate-800 bg-emerald-50/60 px-2 py-0.5 rounded border border-emerald-100">
                                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Fecha de Pago: <strong>{record.paymentDate}</strong></span>
                              </div>

                              {record.totalAmount && (
                                <div className="flex items-center gap-1 font-semibold text-slate-700">
                                  <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Total Pagado: ${record.totalAmount.toLocaleString('es-CO')}</span>
                                </div>
                              )}

                              <div className="text-[11px] text-slate-500">
                                Soporte: <span className="font-medium text-slate-700">{record.fileName}</span> ({record.fileSize})
                              </div>
                            </div>

                            {/* Trabajadores cubiertos */}
                            <div className="pt-1 flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                <Users className="w-3 h-3 text-emerald-600" />
                                Cubre ({coveredCount} trabajadores):
                              </span>
                              
                              <div className="flex flex-wrap gap-1 max-w-xl">
                                {record.coveredWorkerIds.slice(0, 5).map(wId => {
                                  const wrk = workers.find(w => w.id === wId);
                                  if (!wrk) return null;
                                  const isSelectedInFilter = selectedWorkerFilter === wId;
                                  return (
                                    <span
                                      key={wId}
                                      onClick={() => setSelectedWorkerFilter(wId)}
                                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium cursor-pointer transition-colors ${
                                        isSelectedInFilter
                                          ? 'bg-emerald-600 text-white font-bold'
                                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                      }`}
                                      title={`Click para filtrar solo ${wrk.firstName} ${wrk.lastName}`}
                                    >
                                      {wrk.firstName} {wrk.lastName.split(' ')[0]}
                                    </span>
                                  );
                                })}

                                {coveredCount > 5 && (
                                  <span className="text-[10px] text-slate-500 font-semibold self-center">
                                    +{coveredCount - 5} más
                                  </span>
                                )}
                              </div>
                            </div>

                            {record.notes && (
                              <p className="text-[11px] text-slate-600 italic pt-0.5">
                                "{record.notes}"
                              </p>
                            )}
                          </div>

                          {/* Acciones del soporte */}
                          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                            {record.fileUrl && (
                              <a
                                href={record.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Ver Soporte</span>
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`¿Eliminar el registro de planilla PIN ${record.pinNumber}?`)) {
                                  deletePilaRecord(record.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">
                      No se encontraron planillas con los criterios de filtro actuales
                    </p>
                    <p className="text-xs text-slate-500">
                      Intente cambiar el trabajador seleccionado o cargue una nueva planilla de aportes.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedWorkerFilter('ALL');
                        setTypeFilter('ALL');
                        setSearchQuery('');
                      }}
                      className="mt-2 px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: CARGAR NUEVA PLANILLA PILA (SOPORTE DIGITAL REAL) */}
          {/* ============================================================== */}
          {activeTab === 'UPLOAD' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    Datos de Liquidación y Pago de la Planilla
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ingrese la información oficial del comprobante bancario y la planilla integrada de liquidación de aportes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  
                  {/* Tipo de Planilla */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tipo de Planilla *
                    </label>
                    <select
                      value={payrollType}
                      onChange={(e) => setPayrollType(e.target.value as PilaPayrollType)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="GENERAL">PILA General (Estándar 1.1.4)</option>
                      <option value="ALTO_RIESGO">Pensión Especial Alto Riesgo (Estándar 1.1.5)</option>
                    </select>
                  </div>

                  {/* Fecha de Pago de la Planilla (REQUERIDO) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      Fecha del Pago de la Planilla *
                    </label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      required
                      className="w-full bg-emerald-50/40 border border-emerald-300 rounded-lg p-2 font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Periodo Cotizado */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Periodo Cotizado *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Febrero 2026 o 2026-02"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Número de Planilla o PIN */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      No. de Planilla / PIN *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: PIN-94819201"
                      value={pinNumber}
                      onChange={(e) => setPinNumber(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Operador de Información */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Operador de Información *
                    </label>
                    <select
                      value={operator}
                      onChange={(e) => setOperator(e.target.value as PilaOperator)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="SOI">SOI (Servicio Operativo de Información)</option>
                      <option value="APORTES_EN_LINEA">Aportes en Línea</option>
                      <option value="COMPENSAR">Compensar PILA</option>
                      <option value="SIMPLE">Simple S.A.</option>
                      <option value="MI_PLANILLA">MiPlanilla (Compensar/Cajasan)</option>
                      <option value="ASOPAGOS">Asopagos</option>
                      <option value="OTRO">Otro Operador Autorizado</option>
                    </select>
                  </div>

                  {/* Monto Total Pagado */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Monto Total Pagado ($ COP)
                    </label>
                    <input
                      type="number"
                      placeholder="Ej: 9480000"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Notas */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Notas u Observaciones del Pago
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Pago realizado vía PSE Banco Davivienda, incluye cotización de 5 trabajadores."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Subida real de archivo (Drag & Drop) */}
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    Cargar Soporte Digital (PDF o Planilla de Liquidación):
                  </label>
                  
                  <div className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-emerald-50/20 rounded-xl p-4 text-center transition-colors">
                    <input
                      type="file"
                      id="pila-file-upload"
                      accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="pila-file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-1.5"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        {fileName ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1 justify-center">
                            <Check className="w-3.5 h-3.5" /> Archivo seleccionado: {fileName} ({fileSize})
                          </span>
                        ) : (
                          'Haga clic aquí para seleccionar el archivo PDF o Excel desde su computador'
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Formatos soportados: PDF, Excel (.xlsx, .xls) o Imagen comprobante de pago bancario (Máx 25 MB)
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Selección de trabajadores de la Base Maestra */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      Trabajadores Cubiertos en esta Planilla ({selectedWorkerIds.length} seleccionados)
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Al registrar la planilla, se agregará automáticamente el comprobante de seguridad social al expediente digital de cada trabajador seleccionado.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleSelectAllWorkers}
                      className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 transition-colors"
                    >
                      Seleccionar Todos los Activos
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllWorkers}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold border border-slate-200 transition-colors"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>

                {/* Buscador interno de trabajadores */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filtrar trabajadores por nombre, cédula o cargo..."
                    value={workerSearchTerm}
                    onChange={(e) => setWorkerSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Grid con checkboxes de trabajadores */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1">
                  {filteredWorkersForForm.map(worker => {
                    const isSelected = selectedWorkerIds.includes(worker.id);
                    return (
                      <div
                        key={worker.id}
                        onClick={() => toggleWorkerSelection(worker.id)}
                        className={`p-2.5 rounded-lg border flex items-center gap-2.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50 opacity-70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Controlled via parent onClick
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                        />

                        {worker.photoUrl ? (
                          <img
                            src={worker.photoUrl}
                            alt={worker.firstName}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {worker.firstName[0]}{worker.lastName[0]}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-900 text-xs truncate">
                            {worker.firstName} {worker.lastName}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {worker.docType} {worker.docNumber} • {worker.position}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('RECORDS')}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Guardar y Custodiar Planilla PILA</span>
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 3: ALTO RIESGO (ESTÁNDAR 1.1.5 - DECRETO 2090/2003) */}
          {/* ============================================================== */}
          {activeTab === 'ALTO_RIESGO' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Estándar 1.1.5: Pensión Especial para Actividades de Alto Riesgo (Decreto 2090 de 2003)</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  Conforme a la normativa colombiana, los empleadores que tengan trabajadores dedicados de forma permanente a labores de alto riesgo deben cotizar <strong>10 puntos adicionales a pensión</strong>. Aplica para: trabajos en minería subterránea, exposición a altas temperaturas, radiaciones ionizantes, sustancias cancerígenas comprobadas y personal de custodia en centros penitenciarios.
                </p>
                <div className="p-3 bg-white/80 rounded-lg border border-amber-200 text-[11px] text-slate-700">
                  <strong>Estado en la Organización:</strong> Si la empresa no realiza actividades de alto riesgo en pensiones, el estándar se califica legalmente como <strong>"NO APLICA JUSTIFICADO"</strong> con certificación escrita. Si realiza actividades de alto riesgo, debe presentar las planillas PILA con la cotización especial adicional.
                </div>
              </div>

              {/* Botón rápido para cargar planilla de alto riesgo */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 text-xs">¿Tiene personal expuesto a actividades de alto riesgo?</div>
                  <div className="text-[11px] text-slate-500">
                    Cargue aquí el soporte de la planilla de alto riesgo con el pago especial de pensiones.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPayrollType('ALTO_RIESGO');
                    setActiveTab('UPLOAD');
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>+ Cargar Planilla Alto Riesgo (1.1.5)</span>
                </button>
              </div>

              {/* Planillas registradas de alto riesgo */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Planillas de Alto Riesgo en Custodia ({pilaRecords.filter(r => r.payrollType === 'ALTO_RIESGO').length})</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {pilaRecords.filter(r => r.payrollType === 'ALTO_RIESGO').map(record => (
                    <div key={record.id} className="p-3 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{record.pinNumber} • {record.period}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                            Pagado: {record.paymentDate}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {record.fileName} • {record.operator} • Cubre {record.coveredWorkerIds.length} trabajador(es)
                        </div>
                      </div>

                      {record.fileUrl && (
                        <a
                          href={record.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 border border-slate-300"
                        >
                          <Eye className="w-3 h-3" /> Ver
                        </a>
                      )}
                    </div>
                  ))}

                  {pilaRecords.filter(r => r.payrollType === 'ALTO_RIESGO').length === 0 && (
                    <div className="p-5 text-center text-xs text-slate-500">
                      No hay planillas de alto riesgo registradas aún.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white/80 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600 text-[11px]">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            <span>Los pagos se sincronizan en tiempo real con el expediente de cada trabajador en la Base Maestra.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
