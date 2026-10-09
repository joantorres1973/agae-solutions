'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MasterWorker, WorkerLaborHistoryEntry, WorkerEppDeliveryRecord, WorkerDigitalDocument, WorkerOccupationalExam, WorkerCommitteeParticipation } from '@/types/worker';
import { useApp } from '@/lib/store';
import {
  X,
  TrendingUp,
  HardHat,
  FileText,
  HeartPulse,
  Users,
  ShieldAlert,
  CheckCircle2,
  UploadCloud,
  Paperclip,
  Trash2,
  GraduationCap,
  Eye,
  Calendar,
  AlertCircle
} from 'lucide-react';

// =========================================================================
// 1. MODAL: REGISTRAR CAMBIO O ASCENSO LABORAL (CONSERVA HISTORIAL)
// =========================================================================
interface LaborChangeModalProps {
  worker: MasterWorker;
  isOpen: boolean;
  onClose: () => void;
}

export const LaborChangeModal: React.FC<LaborChangeModalProps> = ({ worker, isOpen, onClose }) => {
  const { recordLaborChange, organization } = useApp();
  const [newPosition, setNewPosition] = useState('');
  const [newArea, setNewArea] = useState(worker.area);
  const [changeDate, setChangeDate] = useState(new Date().toISOString().substring(0, 10));
  const [reason, setReason] = useState<WorkerLaborHistoryEntry['reason']>('PROMOCION');
  const [newSalary, setNewSalary] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosition.trim()) return;

    recordLaborChange(worker.id, {
      changeDate,
      previousPosition: worker.position,
      newPosition: newPosition.trim(),
      previousArea: worker.area,
      newArea: newArea.trim(),
      reason,
      newSalary: newSalary ? Number(newSalary) : undefined,
      notes: notes.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-50 border border-slate-300 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Registrar Movimiento / Ascenso Laboral</h3>
              <p className="text-[11px] text-slate-600">
                {worker.firstName} {worker.lastName} • Cargo actual: <span className="text-emerald-700">{worker.position}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-700">
            <strong>Trazabilidad Garantizada:</strong> El cargo anterior (<span className="font-semibold">{worker.position}</span>) se archivará en la línea de tiempo histórica del trabajador y nunca se sobrescribirá.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Fecha de Cambio *</label>
              <input
                type="date"
                required
                value={changeDate}
                onChange={e => setChangeDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Motivo del Cambio *</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                <option value="PROMOCION">Promoción / Ascenso</option>
                <option value="TRASLADO">Traslado de Área / Sede</option>
                <option value="REESTRUCTURACION">Reestructuración Organizacional</option>
                <option value="CAMBIO_SALARIAL">Ajuste Salarial / Funciones</option>
                <option value="RETIRO">Retiro del Cargo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Nuevo Cargo *</label>
            <input
              type="text"
              required
              placeholder="Ej. Coordinador de Operaciones, Profesional HSEQ..."
              value={newPosition}
              onChange={e => setNewPosition(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Nueva Área / Departamento *</label>
              <input
                type="text"
                required
                value={newArea}
                onChange={e => setNewArea(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Nuevo Salario Mensual (COP)</label>
              <input
                type="number"
                placeholder="Opcional"
                value={newSalary}
                onChange={e => setNewSalary(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Observaciones / Justificación</label>
            <textarea
              rows={2}
              placeholder="Motivo del ascenso, cumplimiento de metas, nueva escala..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors font-semibold shadow-sm"
            >
              Guardar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 2. MODAL: REGISTRAR ENTREGA DE EPP (DOTACIÓN)
// =========================================================================
interface EppDeliveryModalProps {
  worker: MasterWorker;
  isOpen: boolean;
  onClose: () => void;
}

export const EppDeliveryModal: React.FC<EppDeliveryModalProps> = ({ worker, isOpen, onClose }) => {
  const { recordEppDelivery } = useApp();
  const [elementName, setElementName] = useState('');
  const [category, setCategory] = useState<WorkerEppDeliveryRecord['category']>('PROTECCION_CABEZA');
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [deliveryReason, setDeliveryReason] = useState<WorkerEppDeliveryRecord['deliveryReason']>('PERIODICA');
  const [signedReceipt, setSignedReceipt] = useState(true);
  const [deliveredBy, setDeliveredBy] = useState('Almacén Central HSEQ');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!elementName.trim()) return;

    recordEppDelivery(worker.id, {
      date,
      elementName: elementName.trim(),
      category,
      quantity: Number(quantity) || 1,
      deliveryReason,
      signedReceipt,
      deliveredBy: deliveredBy.trim(),
      evidenceFileName: `Ficha_Entrega_EPP_${worker.lastName.replace(/\s+/g, '_')}_${date}.pdf`,
      notes: notes.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-50 border border-slate-300 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700">
              <HardHat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Registrar Entrega de EPP</h3>
              <p className="text-[11px] text-slate-600">
                Trabajador: <span className="text-slate-900 font-medium">{worker.firstName} {worker.lastName}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Elemento de Protección Personal *</label>
            <input
              type="text"
              required
              placeholder="Ej. Casco Tipo II con Barbuquejo, Botas Dieléctricas..."
              value={elementName}
              onChange={e => setElementName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Categoría *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-orange-500"
              >
                <option value="PROTECCION_CABEZA">Protección Cabeza</option>
                <option value="PROTECCION_VISUAL">Protección Visual / Facial</option>
                <option value="PROTECCION_AUDITIVA">Protección Auditiva</option>
                <option value="PROTECCION_RESPIRATORIA">Protección Respiratoria</option>
                <option value="PROTECCION_MANOS">Protección Manos</option>
                <option value="PROTECCION_PIES">Protección Pies / Calzado</option>
                <option value="TRABAJO_ALTURAS">Protección Contra Caídas (Alturas)</option>
                <option value="INDUMENTARIA">Indumentaria / Ropa de Trabajo</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Cantidad *</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Fecha de Entrega *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Motivo de Entrega *</label>
              <select
                value={deliveryReason}
                onChange={e => setDeliveryReason(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-orange-500"
              >
                <option value="PERIODICA">Dotación Periódica de Ley</option>
                <option value="DOTACION_INICIAL">Dotación Inicial de Ingreso</option>
                <option value="DETERIORO">Reposición por Deterioro / Daño</option>
                <option value="EXTRAORDINARIA">Dotación Extraordinaria por Tarea Crítica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Entregado Por (Responsable / Almacén) *</label>
            <input
              type="text"
              required
              value={deliveredBy}
              onChange={e => setDeliveredBy(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="signedReceipt"
              checked={signedReceipt}
              onChange={e => setSignedReceipt(e.target.checked)}
              className="w-4 h-4 accent-orange-500 rounded"
            />
            <label htmlFor="signedReceipt" className="text-slate-700 cursor-pointer">
              Constancia firmada por el trabajador adjunta o registrada digitalmente
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-colors font-semibold shadow-sm"
            >
              Registrar Entrega
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// 3. MODAL: CARGAR DOCUMENTO A LA HOJA DE VIDA DIGITAL (CON SUBIDA REAL DE ARCHIVO)
// =========================================================================
interface DocumentUploadModalProps {
  worker: MasterWorker;
  isOpen: boolean;
  onClose: () => void;
  initialDocType?: WorkerDigitalDocument['type'];
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  worker,
  isOpen,
  onClose,
  initialDocType
}) => {
  const { addWorkerDocument, showNotification } = useApp();
  const [docType, setDocType] = useState<WorkerDigitalDocument['type']>(initialDocType || 'HOJA_DE_VIDA');
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().substring(0, 10));
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar tipo inicial cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      const type = initialDocType || 'HOJA_DE_VIDA';
      setDocType(type);
      if (['CERTIFICADO_ALTURAS', 'LICENCIA_SST', 'CONCEPTO_MEDICO', 'CERTIFICADO_CURSO_20H'].includes(type)) {
        setHasExpiry(true);
      } else {
        setHasExpiry(false);
      }
    }
  }, [isOpen, initialDocType]);

  if (!isOpen) return null;

  const handleSelectFile = (file: File) => {
    setSelectedFile(file);
    setFileName(file.name);

    // Calcular tamaño legible
    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;
    setFileSize(sizeStr);

    // Si el título está vacío, inferir un título legible a partir del nombre del archivo
    if (!title.trim()) {
      const rawName = file.name.replace(/\.[^/.]+$/, '');
      const cleaned = rawName.replace(/[-_]+/g, ' ').trim();
      const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      setTitle(capitalized);
    }

    // Leer como Base64 Data URL para visualización y descarga local
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileDataUrl(null);
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || fileName.trim() || `${docType.replace(/_/g, ' ')}`;
    if (!finalTitle) return;

    addWorkerDocument(worker.id, {
      type: docType,
      title: finalTitle,
      fileName: fileName.trim() || selectedFile?.name || `${docType}_${worker.lastName.replace(/\s+/g, '_')}_2026.pdf`,
      fileSize: fileSize || '1.2 MB',
      url: fileDataUrl || undefined,
      fileBase64: fileDataUrl || undefined,
      issueDate,
      expiryDate: hasExpiry && expiryDate ? expiryDate : undefined,
      uploadedBy: 'Talento Humano / HSEQ',
      notes: notes.trim() || undefined
    });

    showNotification(
      `Documento "${finalTitle}" adjuntado con éxito al expediente digital de ${worker.firstName} ${worker.lastName}`,
      'success'
    );
    handleRemoveFile();
    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-50 border border-slate-300 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Adjuntar Documento al Expediente</h3>
              <p className="text-[11px] text-slate-600">
                {worker.firstName} {worker.lastName} • {worker.docType} {worker.docNumber}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto">
          {/* 1. Selector / Drag and Drop para Archivo Real */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-semibold text-xs flex items-center justify-between">
              <span>Cargar Archivo del Documento (Soporte Digital) *</span>
              <span className="text-[10px] text-blue-600 font-normal">
                PDF, JPG, PNG, DOCX (Máx. 25 MB)
              </span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx"
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files.length > 0) {
                  handleSelectFile(e.target.files[0]);
                }
              }}
            />

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
                  isDragging
                    ? 'border-blue-500 bg-blue-100/70 scale-[1.01]'
                    : 'border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/80'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Haz clic aquí para seleccionar el archivo o arrástralo y suéltalo
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Sube el diploma escaneado, acta de grado, cédula, certificación técnica o contrato
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Explorar Archivo en el Equipo</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl border-2 border-blue-200 bg-white shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {fileDataUrl && selectedFile.type.startsWith('image/') ? (
                    <img
                      src={fileDataUrl}
                      alt="Vista previa"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex flex-col items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                      <span className="text-[9px] font-black uppercase tracking-wider">
                        {selectedFile.name.split('.').pop() || 'PDF'}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">{selectedFile.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">{fileSize}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Archivo cargado en memoria
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                  >
                    Cambiar
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Eliminar archivo seleccionado"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Tipo de Documento */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">Tipo de Documento *</label>
            <select
              value={docType}
              onChange={e => {
                const t = e.target.value as any;
                setDocType(t);
                if (['CERTIFICADO_ALTURAS', 'LICENCIA_SST', 'CONCEPTO_MEDICO', 'CERTIFICADO_CURSO_20H'].includes(t)) {
                  setHasExpiry(true);
                } else {
                  setHasExpiry(false);
                }
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="DIPLOMA">🎓 Diploma o Acta de Grado</option>
              <option value="HOJA_DE_VIDA">📄 Hoja de Vida</option>
              <option value="DOCUMENTO_IDENTIDAD">🪪 Documento de Identidad (Cédula / CE)</option>
              <option value="CERTIFICADO_LABORAL">💼 Certificado Laboral / Experiencia</option>
              <option value="LICENCIA_SST">🛡️ Licencia Profesional en SST</option>
              <option value="TARJETA_PROFESIONAL">💳 Tarjeta Profesional (COPNIA, CONALPE, etc.)</option>
              <option value="CERTIFICADO_CURSO_50H">⏱️ Certificado Curso 50 Horas SST</option>
              <option value="CERTIFICADO_CURSO_20H">🔄 Certificado Actualización 20 Horas SST</option>
              <option value="CERTIFICADO_ALTURAS">🧗 Certificado Trabajo Seguro en Alturas</option>
              <option value="CONCEPTO_MEDICO">🩺 Concepto Médico Ocupacional</option>
              <option value="CONTRATO_LABORAL">📝 Contrato Laboral / Otrosí</option>
              <option value="AFILIACION_SEGURIDAD_SOCIAL">🏥 Afiliación EPS / ARL / AFP / Caja</option>
              <option value="OTRO">📁 Otro Documento Configurable</option>
            </select>
          </div>

          {/* 3. Título Descriptivo */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">Título Descriptivo *</label>
            <input
              type="text"
              required
              placeholder="Ej. Diploma Ingeniería Mecánica - Universidad Nacional, Certificado Alturas 2026..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 4. Fechas y Vigencia */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Fecha de Expedición</label>
              <input
                type="date"
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-medium">¿Tiene Vencimiento?</label>
                <input
                  type="checkbox"
                  checked={hasExpiry}
                  onChange={e => setHasExpiry(e.target.checked)}
                  className="w-3.5 h-3.5 accent-blue-500 cursor-pointer"
                />
              </div>
              <input
                type="date"
                disabled={!hasExpiry}
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                className={`w-full px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none focus:border-blue-500 transition-colors ${
                  hasExpiry
                    ? 'bg-white border-amber-300 text-slate-900 shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                }`}
              />
            </div>
          </div>

          {hasExpiry && (
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Alerta Automática de Vigencia:</strong> El sistema calculará los días restantes en tiempo real y disparará alarmas visuales cuando falten menos de 30 días o cuando haya vencido.
              </span>
            </p>
          )}

          {/* 5. Nombre del Archivo en el Repositorio */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Nombre de Identificación del Archivo Digital (Soporte)
            </label>
            <input
              type="text"
              placeholder="Ej. Diploma_Ingenieria_2024.pdf"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 6. Observaciones */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">Observaciones o Notas (Opcional)</label>
            <input
              type="text"
              placeholder="Ej. Acta de grado libro 12 folio 34..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors font-semibold shadow-sm flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Archivar Documento en Expediente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
