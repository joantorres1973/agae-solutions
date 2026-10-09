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
        <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[92vh] max-h-[900px]">
          {/* Header del Expediente Digital */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-[#061e16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {worker.photoUrl ? (
                  <img
                    src={worker.photoUrl}
                    alt={worker.firstName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-lg shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950 border-2 border-emerald-500/60 flex items-center justify-center text-lg font-bold text-emerald-300 shadow-lg shrink-0">
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
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {worker.firstName} {worker.lastName}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {worker.docType} {worker.docNumber}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      worker.status === 'ACTIVO'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {worker.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-emerald-400">{worker.position}</span>
                  <span className="text-slate-500">•</span>
                  <span>{worker.area}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{worker.siteName}</span>
                </div>
              </div>
            </div>

            {/* Actions & Health Gauge */}
            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <div className="hidden md:flex flex-col items-end mr-2 text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Expediente Digital
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
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
                  <span className="text-xs font-bold text-emerald-400">{completeness}%</span>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium flex items-center gap-1.5 border border-slate-700"
                title="Imprimir Ficha Completa del Trabajador"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>

              <button
                onClick={() => onEditWorker(worker)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Subtabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 text-xs font-semibold overflow-x-auto select-none no-scrollbar">
            <button
              onClick={() => setActiveTab('SUMMARY')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'SUMMARY'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Resumen 360°</span>
              {alerts.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {alerts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('PERSONAL')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'PERSONAL'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Datos Personales</span>
            </button>

            <button
              onClick={() => setActiveTab('LABOR')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'LABOR'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Laboral & Historial</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                {worker.laborHistory.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ACADEMIC')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'ACADEMIC'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Académico & Licencias</span>
            </button>

            <button
              onClick={() => setActiveTab('DOCS')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'DOCS'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Hoja de Vida Digital</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                {worker.digitalDocuments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('SST')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'SST'
                  ? 'border-orange-500 text-orange-400 bg-orange-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>Expediente SG-SST</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-950 text-orange-400 border border-orange-800">
                Auto
              </span>
            </button>

            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                activeTab === 'AUDIT'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
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
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Alertas Automáticas del Trabajador ({alerts.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {alerts.map((al, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg border text-[11px] flex items-start gap-2 ${
                            al.type === 'DANGER'
                              ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                              : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
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
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Tiempo en Empresa</span>
                    <div className="text-base font-bold text-white mt-1">
                      {Math.max(
                        0,
                        Math.floor(
                          (new Date().getTime() - new Date(worker.hireDate).getTime()) /
                            (1000 * 60 * 60 * 24 * 30)
                        )
                      )}{' '}
                      meses
                    </div>
                    <span className="text-[10px] text-slate-500">Desde {worker.hireDate}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Dotaciones EPP</span>
                    <div className="text-base font-bold text-orange-400 mt-1">
                      {worker.eppDeliveries.length} entregas
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Última: {worker.eppDeliveries[0]?.date || 'Sin registro'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Capacitaciones SST</span>
                    <div className="text-base font-bold text-emerald-400 mt-1">
                      {worker.trainings.filter(t => t.approved).length} aprobadas
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {worker.trainings.reduce((acc, t) => acc + t.hours, 0)} horas totales
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Examen Médico</span>
                    <div className="text-base font-bold text-blue-400 mt-1">
                      {worker.occupationalExams[0]?.concept.replace(/_/g, ' ') || 'Sin examen'}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {worker.occupationalExams[0]?.date || 'Pendiente'}
                    </span>
                  </div>
                </div>

                {/* Accesos directos para alimentar el perfil */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">Alimentación Automática del Expediente</h4>
                      <p className="text-[11px] text-slate-400">
                        Cada acción que registres nutre directamente el perfil integral sin duplicar información.
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Un Dato → Múltiples Usos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      onClick={() => setIsLaborModalOpen(true)}
                      className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-700/80 text-left transition-all group flex items-start gap-2.5"
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-emerald-300">
                          + Registrar Movimiento
                        </div>
                        <div className="text-[10px] text-slate-400">Ascenso o cambio con historial</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setIsEppModalOpen(true)}
                      className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-700/80 text-left transition-all group flex items-start gap-2.5"
                    >
                      <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20">
                        <HardHat className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-orange-300">
                          + Entregar EPP
                        </div>
                        <div className="text-[10px] text-slate-400">Dotación periódica o inicial</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setIsDocModalOpen(true)}
                      className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-700/80 text-left transition-all group flex items-start gap-2.5"
                    >
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-blue-300">
                          + Adjuntar Documento
                        </div>
                        <div className="text-[10px] text-slate-400">HV, diploma, soporte o licencia</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Sincronización con Estándar 1.1.1 si aplica */}
                {worker.licenses.some(l => l.type === 'LICENCIA_SST') && (
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-purple-200">
                          Candidato a Responsable SG-SST (Estándar 1.1.1)
                        </h4>
                        <p className="text-[11px] text-purple-300/80">
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
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2">
                    Identificación del Trabajador
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-slate-400">Nombres Completos:</span>
                      <p className="font-semibold text-white">{worker.firstName} {worker.lastName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Documento de Identidad:</span>
                      <p className="font-semibold text-white font-mono">{worker.docType} {worker.docNumber}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Fecha de Nacimiento:</span>
                      <p className="font-semibold text-white">{worker.birthDate || 'No registrada'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Estado en la Plataforma:</span>
                      <p className="font-semibold text-emerald-400">{worker.status}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Fecha de Ingreso:</span>
                      <p className="font-semibold text-white">{worker.hireDate}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Fecha de Retiro:</span>
                      <p className="font-semibold text-white">{worker.terminationDate || 'Vigente (Sin retiro)'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2">
                    Datos de Contacto y Ubicación
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-slate-400">Correo Electrónico:</span>
                      <p className="font-semibold text-white">{worker.email}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Teléfono / Celular:</span>
                      <p className="font-semibold text-white">{worker.phone}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Dirección:</span>
                      <p className="font-semibold text-white">{worker.address || 'No registrada'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Ciudad / Municipio:</span>
                      <p className="font-semibold text-white">{worker.city}</p>
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
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-white text-xs">Condición Laboral Actual</h4>
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
                      <span className="text-slate-400">Cargo Actual:</span>
                      <p className="font-bold text-emerald-400">{worker.position}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Área:</span>
                      <p className="font-semibold text-white">{worker.area}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Proceso:</span>
                      <p className="font-semibold text-white">{worker.processName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Centro de Trabajo / Sede:</span>
                      <p className="font-semibold text-white">{worker.siteName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Jefe Inmediato:</span>
                      <p className="font-semibold text-white">{worker.immediateBoss || 'No asignado'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Tipo de Vinculación:</span>
                      <p className="font-semibold text-white">{worker.contractType.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Modalidad de Trabajo:</span>
                      <p className="font-semibold text-white">{worker.workModality}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Jornada Laboral:</span>
                      <p className="font-semibold text-white">{worker.workShift.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                </div>

                {/* Línea de Tiempo del Historial Laboral */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="font-bold text-white text-xs">
                        Línea de Tiempo del Historial Laboral
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Conserva todos los cargos, promociones y traslados sin sobrescribir información histórica.
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {worker.laborHistory.length} registros
                    </span>
                  </div>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    {worker.laborHistory.map((item, idx) => (
                      <div key={item.id || idx} className="relative group">
                        <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-emerald-500 group-hover:scale-125 transition-transform" />
                        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-white text-xs">{item.newPosition}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
                              {item.reason}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap gap-2">
                            <span>📅 {item.changeDate}</span>
                            <span>•</span>
                            <span>Área: {item.newArea}</span>
                            {item.newSalary && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-400">
                                  ${item.newSalary.toLocaleString()} COP
                                </span>
                              </>
                            )}
                          </div>
                          {item.previousPosition && (
                            <div className="text-[10px] text-slate-500 mt-1">
                              Cargo previo: {item.previousPosition}
                            </div>
                          )}
                          {item.notes && (
                            <p className="text-[11px] text-slate-300 mt-1.5 italic bg-slate-950/40 p-1.5 rounded">
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
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-white text-xs">Formación Académica Formal</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                      Nivel: {worker.educationLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {worker.academicRecords.length === 0 ? (
                      <p className="text-slate-500 text-xs italic">No hay títulos académicos registrados.</p>
                    ) : (
                      worker.academicRecords.map(acad => (
                        <div key={acad.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="font-semibold text-white">{acad.degreeTitle}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{acad.institution}</div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            Graduado: {acad.graduationDate} • Estado: {acad.status}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Licencias Profesionales (SST, Tarjeta, COPNIA) */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>Licencias y Tarjetas Profesionales</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Vigencia legal verificada
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {worker.licenses.length === 0 ? (
                      <p className="text-slate-500 text-xs italic">No registra licencias profesionales obligatorias.</p>
                    ) : (
                      worker.licenses.map(lic => (
                        <div key={lic.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{lic.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                              {lic.status}
                            </span>
                          </div>
                          <p className="text-slate-300 font-mono text-[11px]">No. {lic.number}</p>
                          {lic.resolutionNumber && (
                            <p className="text-[11px] text-slate-400">{lic.resolutionNumber}</p>
                          )}
                          <div className="text-[10px] text-slate-500 flex justify-between pt-1">
                            <span>Expide: {lic.issuingEntity}</span>
                            {lic.expiryDate && <span>Vence: {lic.expiryDate}</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Certificaciones Técnicas (Alturas, 50H, etc.) */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2">
                    Certificaciones y Cursos de Ley (SST / PESV / Ambiental)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {worker.certifications.length === 0 ? (
                      <p className="text-slate-500 text-xs italic">Sin certificaciones técnicas registradas.</p>
                    ) : (
                      worker.certifications.map(cert => (
                        <div
                          key={cert.id}
                          className={`p-3 rounded-lg border space-y-1 ${
                            cert.status === 'VENCIDO'
                              ? 'bg-rose-950/20 border-rose-800/60'
                              : cert.status === 'POR_VENCER'
                              ? 'bg-amber-950/20 border-amber-800/60'
                              : 'bg-slate-900 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-white">{cert.title}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                cert.status === 'VENCIDO'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : cert.status === 'POR_VENCER'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}
                            >
                              {cert.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">Entidad: {cert.entity}</div>
                          <div className="text-[10px] text-slate-500 flex justify-between pt-1">
                            <span>Expedido: {cert.issueDate}</span>
                            {cert.expiryDate && (
                              <span className="font-semibold text-amber-400">Vence: {cert.expiryDate}</span>
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
                    <h4 className="font-bold text-white text-xs">Repositorio Digital de Documentos</h4>
                    <p className="text-[11px] text-slate-400">
                      Expediente documental con control de vigencia y alertas automáticas.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDocModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adjuntar Documento</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-800 rounded-xl bg-slate-950/70 border border-slate-800 overflow-hidden">
                  {worker.digitalDocuments.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      No hay documentos cargados en el expediente de este trabajador.
                    </div>
                  ) : (
                    worker.digitalDocuments.map(doc => (
                      <div
                        key={doc.id}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/60 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-xs">{doc.title}</span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                  doc.status === 'VENCIDO'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                    : doc.status === 'POR_VENCER'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                }`}
                              >
                                {doc.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {doc.fileName} • Tipo: {doc.type.replace(/_/g, ' ')}
                            </div>
                            {doc.expiryDate && (
                              <div className="text-[10px] text-amber-400 mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Vence el: {doc.expiryDate}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() =>
                              showNotification(`Descargando documento digital: ${doc.fileName}`)
                            }
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Descargar</span>
                          </button>
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
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-white text-xs flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Inducción y Reinducción en SG-SST</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {worker.inductions.length} registros
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {worker.inductions.length === 0 ? (
                      <p className="text-slate-500 text-xs italic">Sin registros de inducción.</p>
                    ) : (
                      worker.inductions.map(ind => (
                        <div key={ind.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                          <div className="flex justify-between font-semibold text-white">
                            <span>{ind.type}</span>
                            <span className="text-emerald-400 font-bold">
                              {ind.evaluationScore ? `${ind.evaluationScore} pts` : 'Aprobada'}
                            </span>
                          </div>
                          <div className="text-slate-400 text-[10px] mt-0.5">
                            Fecha: {ind.date} • Formador: {ind.trainerName}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Dotaciones de EPP */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-white text-xs flex items-center gap-2">
                      <HardHat className="w-4 h-4 text-orange-400" />
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
                      <p className="text-slate-500 text-xs italic">No hay entregas registradas.</p>
                    ) : (
                      worker.eppDeliveries.map(epp => (
                        <div key={epp.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                          <div className="font-semibold text-white flex justify-between">
                            <span>{epp.elementName}</span>
                            <span className="text-orange-400 font-mono">x{epp.quantity}</span>
                          </div>
                          <div className="text-slate-400 text-[10px] mt-0.5 flex justify-between">
                            <span>Fecha: {epp.date} ({epp.deliveryReason})</span>
                            <span className="text-emerald-400">Firma: {epp.signedReceipt ? '✓' : 'Pendiente'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Comités y Designaciones (COPASST, Vigía, Convivencia, Brigada) */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                  <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Participación en Comités de Ley y Brigadas</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {worker.committeeParticipations.length === 0 ? (
                      <p className="text-slate-500 text-xs italic">El trabajador no integra comités actualmente.</p>
                    ) : (
                      worker.committeeParticipations.map(com => (
                        <div key={com.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                          <div className="flex justify-between font-semibold text-white">
                            <span>{com.committeeType.replace(/_/g, ' ')}</span>
                            <span className="text-blue-400 uppercase font-bold">{com.role}</span>
                          </div>
                          <div className="text-slate-400 text-[10px] mt-0.5">
                            Periodo: {com.periodStart} al {com.periodEnd} • Representa: {com.representedParty}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Exámenes Médicos Ocupacionales (Privacidad & Aptitud) */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                  <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    <span>Evaluaciones Médicas Ocupacionales (Control de Confidencialidad)</span>
                  </h4>

                  <div className="space-y-2">
                    {worker.occupationalExams.length === 0 ? (
                      <p className="text-slate-500 text-xs italic">Sin evaluaciones médicas ocupacionales cargadas.</p>
                    ) : (
                      worker.occupationalExams.map(med => (
                        <div key={med.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">Examen {med.type}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                med.concept === 'APTO'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}
                            >
                              {med.concept.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Fecha: {med.date} • IPS: {med.medicalIps}
                          </div>
                          {med.recommendations && (
                            <p className="text-[11px] text-slate-300 bg-slate-950/50 p-2 rounded border border-slate-800">
                              🔒 <strong>Recomendaciones Médicas:</strong> {med.recommendations}
                            </p>
                          )}
                          {med.nextExamDate && (
                            <div className="text-[10px] text-slate-500 text-right">
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
                    <h4 className="font-bold text-white text-xs">Bitácora Inmutable de Auditoría</h4>
                    <p className="text-[11px] text-slate-400">
                      Trazabilidad legal de cada modificación realizada en el expediente digital.
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {worker.auditTrail.length} eventos
                  </span>
                </div>

                <div className="divide-y divide-slate-800 rounded-xl bg-slate-950/70 border border-slate-800 overflow-hidden">
                  {worker.auditTrail.map(audit => (
                    <div key={audit.id} className="p-3 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{audit.action}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{audit.timestamp}</span>
                      </div>
                      <div className="text-slate-400">
                        Usuario: <span className="text-slate-200">{audit.userName}</span>
                      </div>
                      {audit.reason && (
                        <div className="text-slate-300 italic">Motivo: {audit.reason}</div>
                      )}
                      {audit.previousValue && (
                        <div className="text-[10px] text-slate-500">
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
        onClose={() => setIsDocModalOpen(false)}
      />
    </>
  );
};
