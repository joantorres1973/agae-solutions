'use client';

import React, { useState } from 'react';
import { MasterWorker, WorkerLaborHistoryEntry, WorkerEppDeliveryRecord, WorkerDigitalDocument, WorkerOccupationalExam, WorkerCommitteeParticipation } from '@/types/worker';
import { useApp } from '@/lib/store';
import { X, TrendingUp, HardHat, FileText, HeartPulse, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';

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
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Registrar Movimiento / Ascenso Laboral</h3>
              <p className="text-[11px] text-slate-400">
                {worker.firstName} {worker.lastName} • Cargo actual: <span className="text-emerald-400">{worker.position}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300">
            <strong>Trazabilidad Garantizada:</strong> El cargo anterior (<span className="font-semibold">{worker.position}</span>) se archivará en la línea de tiempo histórica del trabajador y nunca se sobrescribirá.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Fecha de Cambio *</label>
              <input
                type="date"
                required
                value={changeDate}
                onChange={e => setChangeDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Motivo del Cambio *</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
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
            <label className="block text-slate-300 font-medium mb-1">Nuevo Cargo *</label>
            <input
              type="text"
              required
              placeholder="Ej. Coordinador de Operaciones, Profesional HSEQ..."
              value={newPosition}
              onChange={e => setNewPosition(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nueva Área / Departamento *</label>
              <input
                type="text"
                required
                value={newArea}
                onChange={e => setNewArea(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nuevo Salario Mensual (COP)</label>
              <input
                type="number"
                placeholder="Opcional"
                value={newSalary}
                onChange={e => setNewSalary(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Observaciones / Justificación</label>
            <textarea
              rows={2}
              placeholder="Motivo del ascenso, cumplimiento de metas, nueva escala..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-medium"
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
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <HardHat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Registrar Entrega de EPP</h3>
              <p className="text-[11px] text-slate-400">
                Trabajador: <span className="text-white font-medium">{worker.firstName} {worker.lastName}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Elemento de Protección Personal *</label>
            <input
              type="text"
              required
              placeholder="Ej. Casco Tipo II con Barbuquejo, Botas Dieléctricas..."
              value={elementName}
              onChange={e => setElementName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Categoría *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
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
              <label className="block text-slate-300 font-medium mb-1">Cantidad *</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Fecha de Entrega *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Motivo de Entrega *</label>
              <select
                value={deliveryReason}
                onChange={e => setDeliveryReason(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="PERIODICA">Dotación Periódica de Ley</option>
                <option value="DOTACION_INICIAL">Dotación Inicial de Ingreso</option>
                <option value="DETERIORO">Reposición por Deterioro / Daño</option>
                <option value="EXTRAORDINARIA">Dotación Extraordinaria por Tarea Crítica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Entregado Por (Responsable / Almacén) *</label>
            <input
              type="text"
              required
              value={deliveredBy}
              onChange={e => setDeliveredBy(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
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
            <label htmlFor="signedReceipt" className="text-slate-300 cursor-pointer">
              Constancia firmada por el trabajador adjunta o registrada digitalmente
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-medium"
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
// 3. MODAL: CARGAR DOCUMENTO A LA HOJA DE VIDA DIGITAL
// =========================================================================
interface DocumentUploadModalProps {
  worker: MasterWorker;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ worker, isOpen, onClose }) => {
  const { addWorkerDocument } = useApp();
  const [docType, setDocType] = useState<WorkerDigitalDocument['type']>('HOJA_DE_VIDA');
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().substring(0, 10));
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addWorkerDocument(worker.id, {
      type: docType,
      title: title.trim(),
      fileName: fileName.trim() || `${docType}_${worker.lastName.replace(/\s+/g, '_')}_2026.pdf`,
      fileSize: '1.2 MB',
      issueDate,
      expiryDate: hasExpiry && expiryDate ? expiryDate : undefined,
      uploadedBy: 'Talento Humano / HSEQ',
      notes: notes.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Adjuntar Documento al Expediente</h3>
              <p className="text-[11px] text-slate-400">
                {worker.firstName} {worker.lastName} • {worker.docType} {worker.docNumber}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Tipo de Documento *</label>
            <select
              value={docType}
              onChange={e => {
                const t = e.target.value as any;
                setDocType(t);
                if (['CERTIFICADO_ALTURAS', 'LICENCIA_SST', 'CONCEPTO_MEDICO', 'CERTIFICADO_CURSO_20H'].includes(t)) {
                  setHasExpiry(true);
                }
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="HOJA_DE_VIDA">Hoja de Vida</option>
              <option value="DOCUMENTO_IDENTIDAD">Documento de Identidad (Cédula / CE)</option>
              <option value="DIPLOMA">Diploma o Acta de Grado</option>
              <option value="CERTIFICADO_LABORAL">Certificado Laboral / Experiencia</option>
              <option value="LICENCIA_SST">Licencia Profesional en SST</option>
              <option value="TARJETA_PROFESIONAL">Tarjeta Profesional (COPNIA, CONALPE, etc.)</option>
              <option value="CERTIFICADO_CURSO_50H">Certificado Curso 50 Horas SST</option>
              <option value="CERTIFICADO_CURSO_20H">Certificado Actualización 20 Horas SST</option>
              <option value="CERTIFICADO_ALTURAS">Certificado Trabajo Seguro en Alturas</option>
              <option value="CONCEPTO_MEDICO">Concepto Médico Ocupacional</option>
              <option value="CONTRATO_LABORAL">Contrato Laboral / Otrosí</option>
              <option value="AFILIACION_SEGURIDAD_SOCIAL">Afiliación EPS / ARL / AFP / Caja</option>
              <option value="OTRO">Otro Documento Configurable</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Título Descriptivo *</label>
            <input
              type="text"
              required
              placeholder="Ej. Certificado Alturas Coordinador 2026, Diploma Ingeniería..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Fecha de Expedición</label>
              <input
                type="date"
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">¿Tiene Vencimiento?</label>
                <input
                  type="checkbox"
                  checked={hasExpiry}
                  onChange={e => setHasExpiry(e.target.checked)}
                  className="w-3.5 h-3.5 accent-blue-500"
                />
              </div>
              <input
                type="date"
                disabled={!hasExpiry}
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                className={`w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border text-white focus:outline-none focus:border-blue-500 ${
                  hasExpiry ? 'border-amber-500/60' : 'border-slate-800 opacity-40'
                }`}
              />
            </div>
          </div>

          {hasExpiry && (
            <p className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-800/40">
              🔔 <strong>Alerta Automática:</strong> El sistema calculará la vigencia en tiempo real y disparará alertas visuales cuando resten menos de 30 días para su vencimiento.
            </p>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Nombre del Archivo Digital (Soporte)</label>
            <input
              type="text"
              placeholder="Ej. Certificado_Alturas_2026.pdf"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors font-semibold shadow-sm"
            >
              Archivar Documento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
