'use client';

import React, { useState, useMemo } from 'react';
import { MasterWorker, WorkerDigitalDocument } from '@/types/worker';
import { useApp } from '@/lib/store';
import {
  X,
  User,
  Briefcase,
  GraduationCap,
  FileText,
  HardHat,
  ShieldCheck,
  History,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  HeartPulse,
  Eye,
  FileCheck,
  Calendar,
  Building,
  Phone,
  Mail,
  MapPin,
  Flame,
  Shield,
  Edit,
  AlertOctagon,
  Users
} from 'lucide-react';
import { LaborChangeModal, EppDeliveryModal, DocumentUploadModal } from './WorkerActionModals';

interface WorkerDigitalDossierModalProps {
  workerId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEditWorker: (worker: MasterWorker) => void;
}

export const WorkerDigitalDossierModal: React.FC<WorkerDigitalDossierModalProps> = ({
  workerId,
  isOpen,
  onClose,
  onEditWorker
}) => {
  const { workers, assignWorkerAsSstResponsible, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState<
    'SUMMARY' | 'PERSONAL' | 'LABOR' | 'ACADEMIC' | 'DOCS' | 'SST' | 'AUDIT'
  >('SUMMARY');

  // Submodals
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [isEppModalOpen, setIsEppModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docModalType, setDocModalType] = useState<WorkerDigitalDocument['type'] | undefined>(undefined);

  const handleOpenDocModal = (type?: WorkerDigitalDocument['type']) => {
    setDocModalType(type);
    setIsDocModalOpen(true);
  };

  const worker = useMemo(() => {
    if (!workerId) return null;
    return workers.find(w => w.id === workerId) || null;
  }, [workerId, workers]);

  // Alertas automáticas de vencimiento de documentos y certificaciones
  const alerts = useMemo(() => {
    if (!worker) return [];
    const list: { title: string; type: 'DANGER' | 'WARNING'; message: string; daysLeft?: number }[] = [];
    const now = new Date().getTime();

    // Revisar documentos
    worker.digitalDocuments.forEach(doc => {
      if (doc.expiryDate) {
        const exp = new Date(doc.expiryDate).getTime();
        const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
        if (days < 0) {
          list.push({
            title: `Documento Vencido: ${doc.title}`,
            type: 'DANGER',
            message: `Venció hace ${Math.abs(days)} días (${doc.expiryDate})`,
            daysLeft: days
          });
        } else if (days <= 30) {
          list.push({
            title: `Documento Próximo a Vencer: ${doc.title}`,
            type: 'WARNING',
            message: `Vence en ${days} días (${doc.expiryDate})`,
            daysLeft: days
          });
        }
      }
    });

    // Revisar certificaciones (ej. Alturas)
    worker.certifications.forEach(cert => {
      if (cert.expiryDate) {
        const exp = new Date(cert.expiryDate).getTime();
        const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
        if (days < 0) {
          list.push({
            title: `Certificación Vencida: ${cert.title}`,
            type: 'DANGER',
            message: `Venció el ${cert.expiryDate}. Requiere recertificación.`,
            daysLeft: days
          });
        } else if (days <= 30) {
          list.push({
            title: `Certificación por Vencer: ${cert.title}`,
            type: 'WARNING',
            message: `Vence en ${days} días (${cert.expiryDate})`,
            daysLeft: days
          });
        }
      }
    });

    // Revisar exámenes ocupacionales
    worker.occupationalExams.forEach(exam => {
      if (exam.nextExamDate) {
        const exp = new Date(exam.nextExamDate).getTime();
        const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
        if (days < 0) {
          list.push({
            title: `Examen Médico Ocupacional Periódico Vencido`,
            type: 'DANGER',
            message: `Debió realizarse el ${exam.nextExamDate}`,
            daysLeft: days
          });
        } else if (days <= 30) {
          list.push({
            title: `Examen Médico Ocupacional por Realizar`,
            type: 'WARNING',
            message: `Programado para ${exam.nextExamDate} (en ${days} días)`,
            daysLeft: days
          });
        }
      }
    });

    return list;
  }, [worker]);

  // Completitud del expediente digital (%)
  const completeness = useMemo(() => {
    if (!worker) return 0;
    let score = 0;
    if (worker.firstName && worker.lastName && worker.docNumber) score += 20;
    if (worker.email && worker.phone) score += 15;
    if (worker.position && worker.area) score += 15;
    if (worker.digitalDocuments.length > 0) score += 15;
    if (worker.inductions.length > 0) score += 15;
    if (worker.eppDeliveries.length > 0) score += 10;
    if (worker.occupationalExams.length > 0) score += 10;
    return Math.min(100, score);
  }, [worker]);

  if (!isOpen || !worker) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-slate-50 border border-slate-300 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[92vh] max-h-[900px]">
          {/* Header del Expediente Digital */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-white via-white to-emerald-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {worker.photoUrl ? (
                  <img
                    src={worker.photoUrl}
                    alt={worker.firstName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-200 shadow-lg shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-lg font-bold text-emerald-700 shadow-lg shrink-0">
                    {worker.firstName[0]}
                    {worker.lastName[0]}
                  </div>
                )}
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                    worker.status === 'ACTIVO' ? 'bg-emerald-500' : 'bg-slate-500'
                  }`}
                  title={`Estado: ${worker.status}`}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    {worker.firstName} {worker.lastName}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300 font-mono">
                    {worker.docType} {worker.docNumber}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      worker.status === 'ACTIVO'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-300'
                    }`}
                  >
                    {worker.status}
                  </span>
                </div>

                <div className="text-xs text-slate-700 mt-1 flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-emerald-700">{worker.position}</span>
                  <span className="text-slate-600">•</span>
                  <span>{worker.area}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-600">{worker.siteName}</span>
                </div>
              </div>
            </div>

            {/* Actions & Health Gauge */}
            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <div className="hidden md:flex flex-col items-end mr-2 text-right">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
                  Expediente Digital
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        completeness === 100
                          ? 'bg-emerald-400'
                          : completeness >= 70
                          ? 'bg-teal-400'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-emerald-700">{completeness}%</span>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors text-xs font-medium flex items-center gap-1.5 border border-slate-300"
                title="Imprimir Ficha Completa del Trabajador"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>

              <button
                onClick={() => onEditWorker(worker)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-emerald-700 hover:text-emerald-700 transition-colors text-xs font-semibold flex items-center gap-1.5 border border-slate-300"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>

              <button
                onClick={onClose}
                className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Subtabs */}
          <div className="flex border-b border-slate-200 bg-white/80 px-4 text-xs font-semibold overflow-x-auto select-none no-scrollbar">
            <button
              onClick={() => setActiveTab('SUMMARY')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'SUMMARY'
                  ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Resumen 360°</span>
              {alerts.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-700 border border-amber-200">
                  {alerts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('PERSONAL')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'PERSONAL'
                  ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Datos Personales</span>
            </button>

            <button
              onClick={() => setActiveTab('LABOR')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'LABOR'
                  ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Laboral & Historial</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                {worker.laborHistory.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ACADEMIC')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'ACADEMIC'
                  ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Académico & Licencias</span>
            </button>

            <button
              onClick={() => setActiveTab('DOCS')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'DOCS'
                  ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Hoja de Vida Digital</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                {worker.digitalDocuments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('SST')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'SST'
                  ? 'border-orange-500 text-orange-700 bg-orange-50'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>Expediente SG-SST</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-50 text-orange-700 border border-orange-200">
                Auto
              </span>
            </button>

            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'AUDIT'
                  ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Trazabilidad</span>
            </button>
          </div>

          {/* Dossier Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* ============================================================ */}
            {/* PESTAÑA: RESUMEN 360° */}
            {/* ============================================================ */}
            {activeTab === 'SUMMARY' && (
              <div className="space-y-5">
                {/* Alertas Automáticas */}
                {alerts.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                    <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Alertas Automáticas del Trabajador ({alerts.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {alerts.map((al, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg border text-[11px] flex items-start gap-2 ${
                            al.type === 'DANGER'
                              ? 'bg-rose-50 border-rose-200 text-rose-700'
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                          }`}
                        >
                          <span className="mt-0.5">🔔</span>
                          <div>
                            <div className="font-semibold">{al.title}</div>
                            <div className="text-[10px] opacity-80">{al.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Métricas Resumen */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold">Tiempo en Empresa</span>
                    <div className="text-base font-bold text-slate-900 mt-1">
                      {Math.max(
                        0,
                        Math.floor(
                          (new Date().getTime() - new Date(worker.hireDate).getTime()) /
                            (1000 * 60 * 60 * 24 * 30)
                        )
                      )}{' '}
                      meses
                    </div>
                    <span className="text-[10px] text-slate-600">Desde {worker.hireDate}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold">Dotaciones EPP</span>
                    <div className="text-base font-bold text-orange-700 mt-1">
                      {worker.eppDeliveries.length} entregas
                    </div>
                    <span className="text-[10px] text-slate-600">
                      Última: {worker.eppDeliveries[0]?.date || 'Sin registro'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold">Capacitaciones SST</span>
                    <div className="text-base font-bold text-emerald-700 mt-1">
                      {worker.trainings.filter(t => t.approved).length} aprobadas
                    </div>
                    <span className="text-[10px] text-slate-600">
                      {worker.trainings.reduce((acc, t) => acc + t.hours, 0)} horas totales
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold">Examen Médico</span>
                    <div className="text-base font-bold text-blue-700 mt-1">
                      {worker.occupationalExams[0]?.concept.replace(/_/g, ' ') || 'Sin examen'}
                    </div>
                    <span className="text-[10px] text-slate-600">
                      {worker.occupationalExams[0]?.date || 'Pendiente'}
                    </span>
                  </div>
                </div>

                {/* Accesos directos para alimentar el perfil */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Alimentación Automática del Expediente</h4>
                      <p className="text-[11px] text-slate-600">
                        Cada acción que registres nutre directamente el perfil integral sin duplicar información.
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Un Dato → Múltiples Usos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      onClick={() => setIsLaborModalOpen(true)}
                      className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-left transition-all group flex items-start gap-2.5"
                    >
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-100">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-700">
                          + Registrar Movimiento
                        </div>
                        <div className="text-[10px] text-slate-600">Ascenso o cambio con historial</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setIsEppModalOpen(true)}
                      className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-left transition-all group flex items-start gap-2.5"
                    >
                      <div className="p-2 rounded-lg bg-orange-100 text-orange-700 group-hover:bg-orange-100">
                        <HardHat className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-orange-700">
                          + Entregar EPP
                        </div>
                        <div className="text-[10px] text-slate-600">Dotación periódica o inicial</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleOpenDocModal()}
                      className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-left transition-all group flex items-start gap-2.5"
                    >
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-100">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-blue-700">
                          + Adjuntar Documento
                        </div>
                        <div className="text-[10px] text-slate-600">HV, diploma, soporte o licencia</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Sincronización con Estándar 1.1.1 si aplica */}
                {worker.licenses.some(l => l.type === 'LICENCIA_SST') && (
                  <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-purple-800">
                          Candidato a Responsable SG-SST (Estándar 1.1.1)
                        </h4>
                        <p className="text-[11px] text-purple-700">
                          Este trabajador cuenta con Licencia SST registrada (
                          {worker.licenses.find(l => l.type === 'LICENCIA_SST')?.number}). Puedes sincronizar su perfil directamente con la Resolución 0312.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => assignWorkerAsSstResponsible(worker.id)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shrink-0 transition-colors shadow-sm"
                    >
                      Sincronizar con Estándar 1.1.1
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* PESTAÑA: DATOS PERSONALES & CONTACTO */}
            {/* ============================================================ */}
            {activeTab === 'PERSONAL' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/80 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-2">
                    Identificación del Trabajador
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-slate-600">Nombres Completos:</span>
                      <p className="font-semibold text-slate-900">{worker.firstName} {worker.lastName}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Documento de Identidad:</span>
                      <p className="font-semibold text-slate-900 font-mono">{worker.docType} {worker.docNumber}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Fecha de Nacimiento:</span>
                      <p className="font-semibold text-slate-900">{worker.birthDate || 'No registrada'}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Estado en la Plataforma:</span>
                      <p className="font-semibold text-emerald-700">{worker.status}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Fecha de Ingreso:</span>
                      <p className="font-semibold text-slate-900">{worker.hireDate}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Fecha de Retiro:</span>
                      <p className="font-semibold text-slate-900">{worker.terminationDate || 'Vigente (Sin retiro)'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/80 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-2">
                    Datos de Contacto y Ubicación
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-slate-600">Correo Electrónico:</span>
                      <p className="font-semibold text-slate-900">{worker.email}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Teléfono / Celular:</span>
                      <p className="font-semibold text-slate-900">{worker.phone}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Dirección:</span>
                      <p className="font-semibold text-slate-900">{worker.address || 'No registrada'}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Ciudad / Municipio:</span>
                      <p className="font-semibold text-slate-900">{worker.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* PESTAÑA: INFORMACIÓN LABORAL E HISTORIAL */}
            {/* ============================================================ */}
            {activeTab === 'LABOR' && (
              <div className="space-y-4">
                {/* Cargo Actual */}
                <div className="p-4 rounded-xl bg-white/80 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-slate-900 text-xs">Condición Laboral Actual</h4>
                    <button
                      onClick={() => setIsLaborModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center gap-1.5 transition-colors"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Registrar Movimiento / Ascenso</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-slate-600">Cargo Actual:</span>
                      <p className="font-bold text-emerald-700">{worker.position}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Área:</span>
                      <p className="font-semibold text-slate-900">{worker.area}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Proceso:</span>
                      <p className="font-semibold text-slate-900">{worker.processName}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Centro de Trabajo / Sede:</span>
                      <p className="font-semibold text-slate-900">{worker.siteName}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Jefe Inmediato:</span>
                      <p className="font-semibold text-slate-900">{worker.immediateBoss || 'No asignado'}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Tipo de Vinculación:</span>
                      <p className="font-semibold text-slate-900">{worker.contractType.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Modalidad de Trabajo:</span>
                      <p className="font-semibold text-slate-900">{worker.workModality}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Jornada Laboral:</span>
                      <p className="font-semibold text-slate-900">{worker.workShift.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                </div>

                {/* Línea de Tiempo del Historial Laboral */}
                <div className="p-4 rounded-xl bg-white/80 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        Línea de Tiempo del Historial Laboral
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Conserva todos los cargos, promociones y traslados sin sobrescribir información histórica.
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono">
                      {worker.laborHistory.length} registros
                    </span>
                  </div>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {worker.laborHistory.map((item, idx) => (
                      <div key={item.id || idx} className="relative group">
                        <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-slate-50 border-2 border-emerald-500 group-hover:scale-125 transition-transform" />
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900 text-xs">{item.newPosition}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                              {item.reason}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-2">
                            <span>📅 {item.changeDate}</span>
                            <span>•</span>
                            <span>Área: {item.newArea}</span>
                            {item.newSalary && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-700">
                                  ${item.newSalary.toLocaleString()} COP
                                </span>
                              </>
                            )}
                          </div>
                          {item.previousPosition && (
                            <div className="text-[10px] text-slate-600 mt-1">
                              Cargo previo: {item.previousPosition}
                            </div>
                          )}
                          {item.notes && (
                            <p className="text-[11px] text-slate-700 mt-1.5 italic bg-white/80 p-1.5 rounded">
                              "{item.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* PESTAÑA: PERFIL ACADÉMICO & LICENCIAS */}
            {/* ============================================================ */}
            {activeTab === 'ACADEMIC' && (
              <div className="space-y-4">
                {/* Títulos & Nivel Educativo */}
                <div className="p-4 rounded-xl bg-white/80 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Formación Académica Formal</h4>
                      <span className="text-[10px] text-emerald-700 font-semibold uppercase">
                        Nivel Declarado: {worker.educationLevel}
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenDocModal('DIPLOMA')}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Cargar Diploma / Acta de Grado</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {worker.academicRecords.length === 0 ? (
                      <p className="text-slate-600 text-xs italic">No hay títulos académicos registrados.</p>
                    ) : (
                      worker.academicRecords.map(acad => (
                        <div key={acad.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <div className="font-semibold text-slate-900">{acad.degreeTitle}</div>
                          <div className="text-[11px] text-slate-600 mt-0.5">{acad.institution}</div>
                          <div className="text-[10px] text-slate-600 mt-1">
                            Graduado: {acad.graduationDate} • Estado: {acad.status}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Diplomas y Actas de Grado Digitalizadas y Adjuntas */}
                  {(() => {
                    const diplomas = worker.digitalDocuments.filter(d => d.type === 'DIPLOMA');
                    return (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                            <span>Soportes Digitales de Diplomas & Actas ({diplomas.length})</span>
                          </h5>
                          {diplomas.length > 0 && (
                            <span className="text-[10px] text-emerald-700 font-semibold">
                              ✓ Soportes Verificados en Expediente
                            </span>
                          )}
                        </div>

                        {diplomas.length === 0 ? (
                          <div className="p-3 rounded-xl bg-blue-50/50 border border-dashed border-blue-200 text-center flex flex-col items-center justify-center gap-1.5">
                            <p className="text-slate-600 text-[11px]">
                              Aún no has adjuntado el archivo digital del diploma para este trabajador.
                            </p>
                            <button
                              onClick={() => handleOpenDocModal('DIPLOMA')}
                              className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 underline underline-offset-2"
                            >
                              <Plus className="w-3.5 h-3.5" /> Subir archivo del diploma ahora (PDF / Imagen)
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {diplomas.map(dip => (
                              <div
                                key={dip.id}
                                className="p-2.5 rounded-xl bg-white border border-blue-200 shadow-sm flex items-center justify-between gap-2.5 hover:border-blue-400 transition-colors"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                    <FileCheck className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 text-xs truncate">{dip.title}</p>
                                    <p className="text-[10px] text-slate-500 truncate">
                                      {dip.fileName} {dip.fileSize ? `• ${dip.fileSize}` : ''}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  {dip.url ? (
                                    <>
                                      <a
                                        href={dip.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold flex items-center gap-1 border border-blue-200 transition-colors"
                                        title="Ver diploma"
                                      >
                                        <Eye className="w-3 h-3" />
                                        <span>Ver</span>
                                      </a>
                                      <a
                                        href={dip.url}
                                        download={dip.fileName || `${dip.title}.pdf`}
                                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
                                        title="Descargar diploma"
                                      >
                                        <Download className="w-3 h-3" />
                                      </a>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => showNotification(`Descargando ${dip.fileName}`)}
                                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
                                    >
                                      <Download className="w-3 h-3" />
                                      <span>Descargar</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Licencias Profesionales (SST, Tarjeta, COPNIA) */}
                <div className="p-4 rounded-xl bg-white/80 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Licencias y Tarjetas Profesionales</h4>
                      <span className="text-[10px] text-slate-600 font-normal">
                        Vigencia legal verificada
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenDocModal('LICENCIA_SST')}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition-colors border border-slate-300"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Adjuntar Licencia / Tarjeta</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {worker.licenses.length === 0 ? (
                      <p className="text-slate-600 text-xs italic">No registra licencias profesionales obligatorias.</p>
                    ) : (
                      worker.licenses.map(lic => (
                        <div key={lic.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{lic.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                              {lic.status}
                            </span>
                          </div>
                          <p className="text-slate-700 font-mono text-[11px]">No. {lic.number}</p>
                          {lic.resolutionNumber && (
                            <p className="text-[11px] text-slate-600">{lic.resolutionNumber}</p>
                          )}
                          <div className="text-[10px] text-slate-600 flex justify-between pt-1">
                            <span>Expide: {lic.issuingEntity}</span>
                            {lic.expiryDate && <span>Vence: {lic.expiryDate}</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Certificaciones Técnicas (Alturas, 50H, etc.) */}
                <div className="p-4 rounded-xl bg-white/80 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-2">
                    <h4 className="font-bold text-slate-900 text-xs">
                      Certificaciones y Cursos de Ley (SST / PESV / Ambiental)
                    </h4>
                    <button
                      onClick={() => handleOpenDocModal('CERTIFICADO_ALTURAS')}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition-colors border border-slate-300"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Adjuntar Certificación</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {worker.certifications.length === 0 ? (
                      <p className="text-slate-600 text-xs italic">Sin certificaciones técnicas registradas.</p>
                    ) : (
                      worker.certifications.map(cert => (
                        <div
                          key={cert.id}
                          className={`p-3 rounded-lg border space-y-1 ${
                            cert.status === 'VENCIDO'
                              ? 'bg-rose-50 border-rose-200'
                              : cert.status === 'POR_VENCER'
                              ? 'bg-amber-50 border-amber-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-slate-900">{cert.title}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                cert.status === 'VENCIDO'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : cert.status === 'POR_VENCER'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {cert.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600">Entidad: {cert.entity}</div>
                          <div className="text-[10px] text-slate-600 flex justify-between pt-1">
                            <span>Expedido: {cert.issueDate}</span>
                            {cert.expiryDate && (
                              <span className="font-semibold text-amber-700">Vence: {cert.expiryDate}</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* PESTAÑA: HOJA DE VIDA DIGITAL & DOCUMENTOS */}
            {/* ============================================================ */}
            {activeTab === 'DOCS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Repositorio Digital de Documentos</h4>
                    <p className="text-[11px] text-slate-600">
                      Expediente documental con control de vigencia y alertas automáticas.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenDocModal()}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adjuntar Documento</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-200 rounded-xl bg-white/80 border border-slate-200 overflow-hidden">
                  {worker.digitalDocuments.length === 0 ? (
                    <div className="p-8 text-center text-slate-600 text-xs">
                      No hay documentos cargados en el expediente de este trabajador.
                    </div>
                  ) : (
                    worker.digitalDocuments.map(doc => (
                      <div
                        key={doc.id}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 text-xs">{doc.title}</span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                  doc.status === 'VENCIDO'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : doc.status === 'POR_VENCER'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {doc.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono">{doc.fileName}</span>
                              {doc.fileSize && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono">
                                  {doc.fileSize}
                                </span>
                              )}
                              <span>• Tipo: {doc.type.replace(/_/g, ' ')}</span>
                            </div>
                            {doc.expiryDate && (
                              <div className="text-[10px] text-amber-700 mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Vence el: {doc.expiryDate}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          {doc.url ? (
                            <>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs flex items-center gap-1 transition-colors font-medium"
                                title="Abrir / Previsualizar archivo"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Ver</span>
                              </a>
                              <a
                                href={doc.url}
                                download={doc.fileName || `${doc.title}.pdf`}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 transition-colors font-medium"
                                title="Descargar archivo en tu equipo"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Descargar</span>
                              </a>
                            </>
                          ) : (
                            <button
                              onClick={() =>
                                showNotification(`Descargando documento digital: ${doc.fileName}`)
                              }
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Descargar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* PESTAÑA: EXPEDIENTE SG-SST (ALIMENTACIÓN AUTOMÁTICA) */}
            {/* ============================================================ */}
            {activeTab === 'SST' && (
              <div className="space-y-4">
                {/* Inducciones & Reinducciones */}
                <div className="p-4 rounded-xl bg-white/80 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Inducción y Reinducción en SG-SST</span>
                    </h4>
                    <span className="text-[10px] text-slate-600">
                      {worker.inductions.length} registros
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {worker.inductions.length === 0 ? (
                      <p className="text-slate-600 text-xs italic">Sin registros de inducción.</p>
                    ) : (
                      worker.inductions.map(ind => (
                        <div key={ind.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                          <div className="flex justify-between font-semibold text-slate-900">
                            <span>{ind.type}</span>
                            <span className="text-emerald-700 font-bold">
                              {ind.evaluationScore ? `${ind.evaluationScore} pts` : 'Aprobada'}
                            </span>
                          </div>
                          <div className="text-slate-600 text-[10px] mt-0.5">
                            Fecha: {ind.date} • Formador: {ind.trainerName}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Formación y Capacitación (Alimentado automáticamente desde Programa Anual y Aula Virtual AGAE) */}
                <div className="p-4 rounded-xl bg-white/80 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-700" />
                      <span>Formación y Capacitación (Programa Anual & Aula Virtual AGAE)</span>
                    </h4>
                    <span className="text-[10px] text-slate-600 font-mono">
                      {worker.trainings.filter(t => t.approved).length} aprobadas • {worker.trainings.reduce((acc, t) => acc + t.hours, 0)} hrs
                    </span>
                  </div>

                  <div className="space-y-2">
                    {worker.trainings.length === 0 ? (
                      <p className="text-slate-600 text-xs italic py-2 text-center">
                        No registra capacitaciones completadas aún. Las asistencias registradas en el Programa Anual o el Aula Virtual se sincronizan aquí de forma automática.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden bg-slate-50/60 text-xs">
                        {worker.trainings.map((trn, idx) => (
                          <div key={trn.id || idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900 block">{trn.trainingTitle}</span>
                              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                                <span>Fecha: {trn.date}</span>
                                <span>•</span>
                                <span>Duración: {trn.hours} hrs</span>
                                <span>•</span>
                                <span>Facilitador: {trn.trainerName}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {trn.score !== undefined && (
                                <span className="font-mono text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                                  Nota: {trn.score}%
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                trn.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {trn.approved ? 'APROBADO' : 'NO APROBADO'}
                              </span>
                              {trn.certificateFileName && (
                                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                  {trn.certificateFileName}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dotaciones de EPP */}
                <div className="p-4 rounded-xl bg-white/80 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <HardHat className="w-4 h-4 text-orange-700" />
                      <span>Historial de Entrega de EPP (Dotaciones)</span>
                    </h4>
                    <button
                      onClick={() => setIsEppModalOpen(true)}
                      className="px-2 py-1 rounded bg-orange-600 hover:bg-orange-500 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Entregar EPP</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {worker.eppDeliveries.length === 0 ? (
                      <p className="text-slate-600 text-xs italic">No hay entregas registradas.</p>
                    ) : (
                      worker.eppDeliveries.map(epp => (
                        <div key={epp.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                          <div className="font-semibold text-slate-900 flex justify-between">
                            <span>{epp.elementName}</span>
                            <span className="text-orange-700 font-mono">x{epp.quantity}</span>
                          </div>
                          <div className="text-slate-600 text-[10px] mt-0.5 flex justify-between">
                            <span>Fecha: {epp.date} ({epp.deliveryReason})</span>
                            <span className="text-emerald-700">Firma: {epp.signedReceipt ? '✓' : 'Pendiente'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Comités y Designaciones (COPASST, Vigía, Convivencia, Brigada) */}
                <div className="p-4 rounded-xl bg-white/80 border border-slate-200 space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-700" />
                    <span>Participación en Comités de Ley y Brigadas</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {worker.committeeParticipations.length === 0 ? (
                      <p className="text-slate-600 text-xs italic">El trabajador no integra comités actualmente.</p>
                    ) : (
                      worker.committeeParticipations.map(com => (
                        <div key={com.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                          <div className="flex justify-between font-semibold text-slate-900">
                            <span>{com.committeeType.replace(/_/g, ' ')}</span>
                            <span className="text-blue-700 uppercase font-bold">{com.role}</span>
                          </div>
                          <div className="text-slate-600 text-[10px] mt-0.5">
                            Periodo: {com.periodStart} al {com.periodEnd} • Representa: {com.representedParty}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Exámenes Médicos Ocupacionales (Privacidad & Aptitud) */}
                <div className="p-4 rounded-xl bg-white/80 border border-slate-200 space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-2 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-700" />
                    <span>Evaluaciones Médicas Ocupacionales (Control de Confidencialidad)</span>
                  </h4>

                  <div className="space-y-2">
                    {worker.occupationalExams.length === 0 ? (
                      <p className="text-slate-600 text-xs italic">Sin evaluaciones médicas ocupacionales cargadas.</p>
                    ) : (
                      worker.occupationalExams.map(med => (
                        <div key={med.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">Examen {med.type}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                med.concept === 'APTO'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {med.concept.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Fecha: {med.date} • IPS: {med.medicalIps}
                          </div>
                          {med.recommendations && (
                            <p className="text-[11px] text-slate-700 bg-white/80 p-2 rounded border border-slate-200">
                              🔒 <strong>Recomendaciones Médicas:</strong> {med.recommendations}
                            </p>
                          )}
                          {med.nextExamDate && (
                            <div className="text-[10px] text-slate-600 text-right">
                              Próximo examen sugerido: {med.nextExamDate}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* PESTAÑA: TRAZABILIDAD & AUDITORÍA */}
            {/* ============================================================ */}
            {activeTab === 'AUDIT' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Bitácora Inmutable de Auditoría</h4>
                    <p className="text-[11px] text-slate-600">
                      Trazabilidad legal de cada modificación realizada en el expediente digital.
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                    {worker.auditTrail.length} eventos
                  </span>
                </div>

                <div className="divide-y divide-slate-200 rounded-xl bg-white/80 border border-slate-200 overflow-hidden">
                  {worker.auditTrail.map(audit => (
                    <div key={audit.id} className="p-3 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{audit.action}</span>
                        <span className="text-[10px] text-slate-600 font-mono">{audit.timestamp}</span>
                      </div>
                      <div className="text-slate-600">
                        Usuario: <span className="text-slate-800">{audit.userName}</span>
                      </div>
                      {audit.reason && (
                        <div className="text-slate-700 italic">Motivo: {audit.reason}</div>
                      )}
                      {audit.previousValue && (
                        <div className="text-[10px] text-slate-600">
                          Cambio: de "{audit.previousValue}" ➔ "{audit.newValue}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-modales de acción directa */}
      <LaborChangeModal
        worker={worker}
        isOpen={isLaborModalOpen}
        onClose={() => setIsLaborModalOpen(false)}
      />
      <EppDeliveryModal
        worker={worker}
        isOpen={isEppModalOpen}
        onClose={() => setIsEppModalOpen(false)}
      />
      <DocumentUploadModal
        worker={worker}
        isOpen={isDocModalOpen}
        initialDocType={docModalType}
        onClose={() => {
          setIsDocModalOpen(false);
          setDocModalType(undefined);
        }}
      />
    </>
  );
};
