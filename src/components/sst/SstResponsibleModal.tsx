'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  UserCheck,
  FileText,
  Upload,
  CheckCircle2,
  Printer,
  Shield,
  Award,
  Calendar,
  X,
  Building,
  Check,
  Paperclip,
  Users
} from 'lucide-react';
import { SstResponsibleProfile } from '@/types/sst';
import { MasterWorker } from '@/types/worker';
import { WorkerSelector } from '@/components/workers/WorkerSelector';

interface SstResponsibleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SstResponsibleModal: React.FC<SstResponsibleModalProps> = ({ isOpen, onClose }) => {
  const {
    organization,
    sstResponsible,
    updateSstResponsible,
    addEvidence,
    updateStandardStatus,
    showNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'LETTER'>('PROFILE');
  const [formData, setFormData] = useState<SstResponsibleProfile>({ ...sstResponsible });
  const [isSigning, setIsSigning] = useState(false);

  const handleSelectMasterWorker = (w: MasterWorker | null) => {
    if (!w) return;
    const sstLic = w.licenses.find(l => l.type === 'LICENCIA_SST');
    const c50 = w.certifications.find(c => c.title.includes('50 Horas'));
    const c20 = w.certifications.find(c => c.title.includes('20 Horas'));
    setFormData(prev => ({
      ...prev,
      fullName: `${w.firstName} ${w.lastName}`,
      docType: w.docType === 'PASAPORTE' ? 'PASAPORTE' : w.docType === 'CE' ? 'CE' : 'CC',
      docNumber: w.docNumber,
      profession: w.academicRecords[0]?.degreeTitle || w.position,
      licenseNumber: sstLic?.number || prev.licenseNumber,
      licenseExpDate: sstLic?.expiryDate || prev.licenseExpDate,
      course50hDate: c50?.issueDate || prev.course50hDate,
      course20hDate: c20?.issueDate || prev.course20hDate
    }));
    showNotification(`Datos de ${w.firstName} ${w.lastName} vinculados desde la Base Maestra`, 'success');
  };

  if (!isOpen) return null;

  const handleInputChange = (field: keyof SstResponsibleProfile, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSstResponsible(formData);
    showNotification('Información del Responsable del SG-SST actualizada exitosamente');
  };

  const handleSimulateFileUpload = (type: 'HV' | 'LICENCIA' | 'CURSO50') => {
    const titles = {
      HV: `Hoja de Vida Actualizada - ${formData.fullName}`,
      LICENCIA: `Licencia de SST ${formData.licenseNumber} - ${formData.fullName}`,
      CURSO50: `Certificado Curso 50 Horas / 20 Horas SST - ${formData.fullName}`
    };

    const filenames = {
      HV: `HV_${formData.fullName.replace(/\s+/g, '_')}_2026.pdf`,
      LICENCIA: `Licencia_SST_${formData.licenseNumber}.pdf`,
      CURSO50: `Certificado_50h_${formData.docNumber}.pdf`
    };

    const newEvidence = addEvidence({
      title: titles[type],
      fileType: 'CERTIFICATE',
      fileName: filenames[type],
      fileSize: '1.8 MB',
      uploadedBy: formData.fullName,
      url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
      tags: ['SST', 'ESTANDAR_1.1.1', 'RESPONSABLE', type]
    });

    const fieldMap: Record<'HV' | 'LICENCIA' | 'CURSO50', keyof SstResponsibleProfile> = {
      HV: 'hvEvidenceId',
      LICENCIA: 'licenseEvidenceId',
      CURSO50: 'courseEvidenceId'
    };

    const updated = { ...formData, [fieldMap[type]]: newEvidence.id };
    setFormData(updated);
    updateSstResponsible(updated);

    if (type === 'CURSO50') {
      updateStandardStatus('std-1.2.3', 'CUMPLE', `Certificado Curso 50h/20h cargado por el Líder SST (${formData.fullName}). Articulado con Estándar 1.1.1.`);
    }

    showNotification(`Soporte de ${type} cargado y registrado en el Motor de Evidencias.`);
  };

  const handleSignLetter = () => {
    setIsSigning(true);
    setTimeout(() => {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const updated: SstResponsibleProfile = {
        ...formData,
        signedByManager: true,
        signedByResponsible: true,
        letterSignedAt: now,
        isFormallyAssigned: true
      };
      setFormData(updated);
      updateSstResponsible(updated);

      // Register official letter as an approved Evidence
      addEvidence({
        title: `Carta Oficial de Asignación Responsable SG-SST - ${formData.fullName}`,
        fileType: 'DOCUMENT',
        fileName: `Carta_Asignacion_SST_${organization.nit.replace(/[^0-9]/g, '')}_2026.pdf`,
        fileSize: '1.2 MB',
        uploadedBy: formData.managerName,
        url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        tags: ['SST', 'ESTANDAR_1.1.1', 'DEC_1072', 'ASIGNACION', 'LEGAL']
      });

      // Update Standard 1.1.1 status to CUMPLE
      updateStandardStatus('std-1.1.1', 'CUMPLE', `Carta de asignación formal firmada electrónicamente el ${now}`);

      setIsSigning(false);
      showNotification('¡Carta firmada exitosamente! Se registró como evidencia oficial del SG-SST y el Estándar 1.1.1 quedó en CUMPLE.');
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-50 border border-slate-300 rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 border border-orange-200 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Estándar 1.1.1 (Res. 0312)
                </span>
                <span className="text-[10px] font-semibold text-slate-600">
                  Decreto 1072 de 2015 Art. 2.2.4.6.8 Par. 1 y Art. 2.2.4.6.35
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Asignación del Responsable del SG-SST & Carta Oficial
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-50 rounded-lg p-0.5 border border-slate-300">
              <button
                type="button"
                onClick={() => setActiveTab('PROFILE')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeTab === 'PROFILE' ? 'bg-orange-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Perfil y Documentos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('LETTER')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'LETTER' ? 'bg-orange-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Carta de Asignación Formal</span>
                {formData.signedByManager && (
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'PROFILE' ? (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              {/* Legal Reference Alert */}
              <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-800 flex items-start gap-3">
                <Shield className="w-4 h-4 text-orange-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-orange-700">Criterio Legal Resolución 0312 de 2019:</strong>
                  La persona designada debe contar con licencia vigente en Seguridad y Salud en el Trabajo y acreditar el curso de capacitación virtual de 50 horas de SST (o actualización de 20 horas). La asignación debe formalizarse por escrito con funciones y responsabilidades claras.
                </div>
              </div>

              {/* Personal and Professional Identification */}
              <div className="glass-card p-4 rounded-xl border border-slate-300 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-teal-700" />
                    1. Datos del Profesional Asignado
                  </h3>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>Conexión Base Maestra</span>
                  </span>
                </div>

                {/* Selección rápida desde la Base Maestra */}
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <label className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                    <span>⚡ Vincular trabajador desde la Base Maestra Central:</span>
                  </label>
                  <WorkerSelector
                    onChange={handleSelectMasterWorker}
                    placeholder="Buscar y seleccionar trabajador de la Base Maestra..."
                  />
                  <p className="text-[10px] text-emerald-800">
                    Al seleccionar un trabajador, se autocompletan su nombre, documento, licencia SST y cursos de 50h/20h sin doble digitación.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Nombre Completo del Responsable *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tipo de Documento</label>
                    <select
                      value={formData.docType}
                      onChange={(e) => handleInputChange('docType', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      <option value="CC">Cédula de Ciudadanía (C.C.)</option>
                      <option value="CE">Cédula de Extranjería (C.E.)</option>
                      <option value="PASAPORTE">Pasaporte</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Número de Identificación *</label>
                    <input
                      type="text"
                      required
                      value={formData.docNumber}
                      onChange={(e) => handleInputChange('docNumber', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nivel Profesional SST *</label>
                    <select
                      value={formData.professionalRole}
                      onChange={(e) => handleInputChange('professionalRole', e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      <option value="TECNICO">Técnico en SST</option>
                      <option value="TECNOLOGO">Tecnólogo en SST</option>
                      <option value="PROFESIONAL">Profesional Universitario en SST</option>
                      <option value="ESPECIALISTA">Especialista o Magíster en SST</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Título / Profesión de Base</label>
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={(e) => handleInputChange('profession', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* License and 50h Course Credentials */}
              <div className="glass-card p-4 rounded-xl border border-slate-300 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700" />
                  2. Licencia de SST y Certificación de Capacitación
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Número de Licencia de SST *</label>
                    <input
                      type="text"
                      required
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      placeholder="Ej: LIC-SST-2023-08941"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Vencimiento de Licencia *</label>
                    <input
                      type="date"
                      required
                      value={formData.licenseExpDate}
                      onChange={(e) => handleInputChange('licenseExpDate', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Fecha Curso 50 Horas SST *</label>
                    <input
                      type="date"
                      required
                      value={formData.course50hDate}
                      onChange={(e) => handleInputChange('course50hDate', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Fecha Curso Actualización 20h</label>
                    <input
                      type="date"
                      value={formData.course20hDate}
                      onChange={(e) => handleInputChange('course20hDate', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Entidad Certificadora del Curso</label>
                    <input
                      type="text"
                      value={formData.courseEntity}
                      onChange={(e) => handleInputChange('courseEntity', e.target.value)}
                      placeholder="Ej: SENA / ARL Sura / Ministerio del Trabajo"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Evidence Upload Section: HV, License, Course */}
              <div className="glass-card p-4 rounded-xl border border-slate-300 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-purple-700" />
                  3. Cargue de Documentos, Idoneidad y Curso 50h/20h (Articulación 1.1.1 & 1.2.3)
                </h3>

                {/* Banner de Articulación Normativa con Estándar 1.2.3 */}
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 text-xs flex items-start gap-2.5">
                  <Award className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-purple-950">Articulación Normativa Unificada (Estándares 1.1.1 y 1.2.3 - Res. 0312 / Dec. 1072):</strong>
                    <span className="text-[11px] text-purple-800 leading-relaxed block mt-0.5">
                      La documentación requerida para el responsable del SG-SST (Hoja de vida, Licencia de SST y Certificación del curso virtual de 50 horas o actualización de 20 horas) se gestiona de manera centralizada en este módulo. Al vincular el certificado a continuación, el <strong>Estándar 1.2.3</strong> se certifica y audita automáticamente sin duplicar trámites.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Hoja de Vida */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                        Hoja de Vida
                      </span>
                      <p className="text-xs font-semibold text-slate-900 mt-1">
                        HV del Responsable
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Con soportes de experiencia y formación académica.
                      </p>
                    </div>

                    {formData.hvEvidenceId ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span className="truncate">Cargada satisfactoriamente</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSimulateFileUpload('HV')}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold border border-slate-300 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-teal-700" />
                        <span>Cargar Hoja de Vida</span>
                      </button>
                    )}
                  </div>

                  {/* Fotocopia Licencia */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                        Licencia SST
                      </span>
                      <p className="text-xs font-semibold text-slate-900 mt-1">
                        Fotocopia de Licencia Vigente
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Resolución emitida por la Seccional de Salud.
                      </p>
                    </div>

                    {formData.licenseEvidenceId ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span className="truncate">Cargada ({formData.licenseNumber})</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSimulateFileUpload('LICENCIA')}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold border border-slate-300 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Cargar Licencia SST</span>
                      </button>
                    )}
                  </div>

                  {/* Certificado Curso 50h */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                        Capacitación Virtual
                      </span>
                      <p className="text-xs font-semibold text-slate-900 mt-1">
                        Certificado 50h / 20h
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Resolución 4927 de 2016 del Ministerio del Trabajo.
                      </p>
                    </div>

                    {formData.courseEvidenceId ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span className="truncate">Certificado Vinculado</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSimulateFileUpload('CURSO50')}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold border border-slate-300 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-purple-700" />
                        <span>Cargar Certificado 50h</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Employer / Manager Details */}
              <div className="glass-card p-4 rounded-xl border border-slate-300 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Building className="w-4 h-4 text-sky-700" />
                  4. Datos del Representante Legal que Otorga la Asignación
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nombre del Representante Legal *</label>
                    <input
                      type="text"
                      required
                      value={formData.managerName}
                      onChange={(e) => handleInputChange('managerName', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Cédula y Lugar de Expedición *</label>
                    <input
                      type="text"
                      required
                      value={formData.managerDocNumber}
                      onChange={(e) => handleInputChange('managerDocNumber', e.target.value)}
                      placeholder="Ej: 79.845.120 de Bogotá D.C."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('LETTER')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-orange-700" />
                  <span>Generar Vista Previa de la Carta</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/30 transition-all"
                  >
                    Guardar Cambios del Perfil
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* LETTER TAB: Live Official Assignment Letter Generator */
            <div className="space-y-4">
              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200">
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Documento Legal Vigente:</span>
                  <span className="text-slate-600 text-[11px]">
                    {formData.letterSignedAt
                      ? `Firmado digitalmente el ${formData.letterSignedAt}`
                      : 'Borrador generado automáticamente con datos empresariales'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir / PDF</span>
                  </button>

                  {!formData.signedByManager || !formData.signedByResponsible ? (
                    <button
                      type="button"
                      disabled={isSigning}
                      onClick={handleSignLetter}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSigning ? 'Firmando y Guardando...' : 'Firmar Electrónicamente & Guardar en Evidencias'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Carta Firmada y en Custodia</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Printable Official Formal Letter Document Paper */}
              <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl font-serif text-sm leading-relaxed border border-slate-300 print:shadow-none print:border-none print:p-0">
                
                {/* Header */}
                <div className="border-b-2 border-slate-200 pb-4 mb-6 flex justify-between items-start">
                  <div>
                    <h1 className="text-lg font-black tracking-tight uppercase text-slate-950">
                      {organization.name}
                    </h1>
                    <p className="text-xs font-mono text-slate-600 mt-0.5">
                      NIT: {organization.nit} • Actividad Económica: {organization.ciiu}
                    </p>
                    <p className="text-xs text-slate-600">
                      Sede Principal: {organization.sites[0]?.address || 'Calle 17 # 96-45'}, {organization.sites[0]?.city || 'Bogotá D.C.'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-300 rounded font-sans text-[10px] font-bold tracking-wider">
                      CÓDIGO: FT-SST-001
                    </span>
                    <span className="block text-[10px] font-sans text-slate-600 mt-1">Versión 03 — 2026</span>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center my-6 space-y-1">
                  <h2 className="text-base font-bold tracking-wide uppercase text-slate-950 font-sans">
                    CARTA OFICIAL DE ASIGNACIÓN DE RESPONSABILIDADES Y DESIGNACIÓN DEL RESPONSABLE DEL SISTEMA DE GESTIÓN DE LA SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST)
                  </h2>
                  <p className="text-xs text-slate-600 font-sans italic">
                    En cumplimiento del Decreto 1072 de 2015 (Libro 2, Parte 2, Título 4, Capítulo 6, Artículos 2.2.4.6.8 y 2.2.4.6.12) y de la Resolución 0312 de 2019 (Estándar 1.1.1)
                  </p>
                </div>

                {/* Body Content */}
                <div className="space-y-4 text-justify font-sans text-xs leading-normal text-slate-800">
                  <p>
                    En la ciudad de <strong>{organization.sites[0]?.city || 'Bogotá D.C.'}</strong>, a los <strong>15 días del mes de enero de 2026</strong>, la empresa <strong>{organization.name}</strong>, identificada con NIT <strong>{organization.nit}</strong>, a través de su Representante Legal, <strong>{formData.managerName}</strong>, identificado con cédula de ciudadanía No. <strong>{formData.managerDocNumber}</strong>:
                  </p>

                  <h3 className="font-bold uppercase text-slate-950 text-center tracking-wider pt-1">
                    HACE CONSTAR:
                  </h3>

                  <p>
                    Que en virtud de las obligaciones legales asignadas al empleador en el <strong>Artículo 2.2.4.6.8 del Decreto 1072 de 2015</strong>, se procede a formalizar la designación y asignación del responsable del diseño, implementación, administración y mejora continua del <strong>Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST)</strong> a:
                  </p>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 font-mono text-xs">
                    <p><strong>Nombres y Apellidos:</strong> {formData.fullName}</p>
                    <p><strong>Documento de Identidad:</strong> {formData.docType} No. {formData.docNumber}</p>
                    <p><strong>Formación Académica:</strong> {formData.profession}</p>
                    <p><strong>Licencia de SST No.:</strong> {formData.licenseNumber} (Vigencia hasta: {formData.licenseExpDate})</p>
                    <p><strong>Certificación Curso Virtual:</strong> Curso 50 Horas SST ({formData.course50hDate}) / Actualización 20 Horas ({formData.course20hDate || 'Vigente'}) expedido por {formData.courseEntity}</p>
                  </div>

                  <p>
                    El designado contará con la debida autonomía técnica y los recursos asignados por la gerencia para liderar el SG-SST y tendrá entre sus funciones y responsabilidades fundamentales las siguientes:
                  </p>

                  <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-slate-700">
                    <li>Planificar, organizar, dirigir, desarrollar y aplicar el Sistema de Gestión de la Seguridad y Salud en el Trabajo SG-SST, y evaluar anualmente su cumplimiento bajo la Resolución 0312 de 2019.</li>
                    <li>Informar a la alta dirección sobre el funcionamiento y los resultados del SG-SST mediante la rendición de cuentas anual (Art. 2.2.4.6.8 Numeral 3).</li>
                    <li>Promover la participación de todos los miembros de la empresa en la implementación del SG-SST y coordinar las actividades con el COPASST y el Comité de Convivencia Laboral.</li>
                    <li>Liderar la identificación sistemática de peligros, evaluación y valoración de riesgos (GTC 45) y proponer la jerarquía de controles frente a la gerencia.</li>
                    <li>Coordinar las evaluaciones médicas ocupacionales reglamentarias y velar por el acatamiento de las restricciones y recomendaciones médicas.</li>
                    <li>Investigar los accidentes e incidentes de trabajo en conjunto con el COPASST conforme a la Resolución 1401 de 2007.</li>
                    <li>Elaborar y ejecutar el Plan Anual de Trabajo y el Programa de Capacitación Anual en SST.</li>
                    <li><strong>Facultad y Autoridad Expresa:</strong> Se delega expresamente la autoridad para ordenar la suspensión provisional o definitiva de cualquier trabajo o actividad en campo que represente un peligro inminente para la vida o la salud de los trabajadores.</li>
                  </ol>

                  <p className="pt-2">
                    Para constancia de lo anterior, se suscribe el presente documento formal por las partes interesadas, manifestando el designado su aceptación libre y voluntaria de las responsabilidades asignadas.
                  </p>
                </div>

                {/* Signatures Block */}
                <div className="grid grid-cols-2 gap-8 pt-12 mt-8 border-t border-slate-300 font-sans text-xs">
                  {/* Employer Signature */}
                  <div className="space-y-2">
                    <div className="border-b border-slate-200 pb-1">
                      {formData.signedByManager ? (
                        <div className="font-mono text-emerald-800 font-bold text-xs">
                          ✓ FIRMADO DIGITALMENTE POR EMPLEADOR<br />
                          <span className="text-[10px] text-slate-600 font-sans">Huella criptográfica SHA-256 validada</span>
                        </div>
                      ) : (
                        <div className="h-8 flex items-end text-slate-600 italic">Pendiente de firma</div>
                      )}
                    </div>
                    <p className="font-bold text-slate-900 leading-tight">{formData.managerName}</p>
                    <p className="text-[11px] text-slate-600">Representante Legal</p>
                    <p className="text-[10px] text-slate-600 font-mono">C.C. {formData.managerDocNumber}</p>
                    <p className="text-[10px] text-slate-600">{organization.name}</p>
                  </div>

                  {/* Responsible Signature */}
                  <div className="space-y-2">
                    <div className="border-b border-slate-200 pb-1">
                      {formData.signedByResponsible ? (
                        <div className="font-mono text-emerald-800 font-bold text-xs">
                          ✓ ACEPTADO Y FIRMADO DIGITALMENTE<br />
                          <span className="text-[10px] text-slate-600 font-sans">Aceptación de funciones y responsabilidades</span>
                        </div>
                      ) : (
                        <div className="h-8 flex items-end text-slate-600 italic">Pendiente de aceptación</div>
                      )}
                    </div>
                    <p className="font-bold text-slate-900 leading-tight">{formData.fullName}</p>
                    <p className="text-[11px] text-slate-600">Responsable Asignado del SG-SST</p>
                    <p className="text-[10px] text-slate-600 font-mono">{formData.docType} No. {formData.docNumber}</p>
                    <p className="text-[10px] text-slate-600 font-mono">Licencia SST: {formData.licenseNumber}</p>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="mt-8 pt-3 border-t border-slate-200 text-[10px] text-slate-600 flex justify-between font-sans">
                  <span>Documento soporte de cumplimiento Estándar 1.1.1 Resolución 0312 de 2019</span>
                  <span>Custodia digital: Archivo central 20 años (Dec. 1072 Art. 2.2.4.6.13)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
