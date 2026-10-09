'use client';

import React, { useState, useEffect } from 'react';
import { MasterWorker, WorkerDocType, WorkerStatus, WorkerContractType, WorkerWorkModality, WorkerWorkShift, WorkerEducationLevel } from '@/types/worker';
import { useApp } from '@/lib/store';
import { X, User, Briefcase, GraduationCap, MapPin, Phone, Mail, Building, AlertCircle, Camera, Trash2 } from 'lucide-react';

interface WorkerFormModalProps {
  isOpen: boolean;
  worker?: MasterWorker | null; // If provided, edit mode
  onClose: () => void;
}

export const WorkerFormModal: React.FC<WorkerFormModalProps> = ({ isOpen, worker, onClose }) => {
  const { organization, addWorker, updateWorker, workers, showNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'ID' | 'LABOR' | 'ACADEMIC'>('ID');

  // Identificación
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [docType, setDocType] = useState<WorkerDocType>('CC');
  const [docNumber, setDocNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState<WorkerStatus>('ACTIVO');
  const [hireDate, setHireDate] = useState(new Date().toISOString().substring(0, 10));

  // Contacto
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bogotá D.C.');

  // Laboral
  const [position, setPosition] = useState('');
  const [area, setArea] = useState('');
  const [siteId, setSiteId] = useState(organization.sites[0]?.id || '');
  const [processId, setProcessId] = useState(organization.processes[0]?.id || '');
  const [immediateBoss, setImmediateBoss] = useState('');
  const [contractType, setContractType] = useState<WorkerContractType>('TERMINO_INDEFINIDO');
  const [workModality, setWorkModality] = useState<WorkerWorkModality>('PRESENCIAL');
  const [workShift, setWorkShift] = useState<WorkerWorkShift>('COMPLETA');
  const [initialLaborNotes, setInitialLaborNotes] = useState('');

  // Académico inicial
  const [educationLevel, setEducationLevel] = useState<WorkerEducationLevel>('PROFESIONAL');
  const [initialDegreeTitle, setInitialDegreeTitle] = useState('');
  const [initialInstitution, setInitialInstitution] = useState('');

  useEffect(() => {
    if (worker) {
      setFirstName(worker.firstName);
      setLastName(worker.lastName);
      setDocType(worker.docType);
      setDocNumber(worker.docNumber);
      setBirthDate(worker.birthDate || '');
      setPhotoUrl(worker.photoUrl || '');
      setStatus(worker.status);
      setHireDate(worker.hireDate);
      setEmail(worker.email);
      setPhone(worker.phone);
      setAddress(worker.address || '');
      setCity(worker.city);
      setPosition(worker.position);
      setArea(worker.area);
      setSiteId(worker.siteId || organization.sites[0]?.id || '');
      setProcessId(worker.processId || organization.processes[0]?.id || '');
      setImmediateBoss(worker.immediateBoss || '');
      setContractType(worker.contractType);
      setWorkModality(worker.workModality);
      setWorkShift(worker.workShift);
      setEducationLevel(worker.educationLevel);
      setInitialDegreeTitle(worker.academicRecords[0]?.degreeTitle || '');
      setInitialInstitution(worker.academicRecords[0]?.institution || '');
    } else {
      // Reset
      setFirstName('');
      setLastName('');
      setDocType('CC');
      setDocNumber('');
      setBirthDate('');
      setPhotoUrl('');
      setStatus('ACTIVO');
      setHireDate(new Date().toISOString().substring(0, 10));
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('Bogotá D.C.');
      setPosition('');
      setArea('Operaciones Logísticas');
      setSiteId(organization.sites[0]?.id || '');
      setProcessId(organization.processes[0]?.id || '');
      setImmediateBoss('');
      setContractType('TERMINO_INDEFINIDO');
      setWorkModality('PRESENCIAL');
      setWorkShift('COMPLETA');
      setInitialLaborNotes('');
      setEducationLevel('PROFESIONAL');
      setInitialDegreeTitle('');
      setInitialInstitution('');
    }
  }, [worker, organization]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !docNumber.trim() || !position.trim()) {
      showNotification('Por favor diligencie todos los campos requeridos', 'warning');
      return;
    }

    const selectedSite = organization.sites.find(s => s.id === siteId);
    const selectedProc = organization.processes.find(p => p.id === processId);

    if (worker) {
      // Edit existing
      updateWorker(
        worker.id,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          docType,
          docNumber: docNumber.trim(),
          birthDate: birthDate || undefined,
          photoUrl: photoUrl.trim() || undefined,
          status,
          hireDate,
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim() || undefined,
          city: city.trim(),
          position: position.trim(),
          area: area.trim(),
          siteId,
          siteName: selectedSite?.name || worker.siteName,
          processId,
          processName: selectedProc?.name || worker.processName,
          immediateBoss: immediateBoss.trim() || undefined,
          contractType,
          workModality,
          workShift,
          educationLevel
        },
        'Actualización manual de datos de identificación / laborales'
      );
    } else {
      // Create new
      addWorker({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        docType,
        docNumber: docNumber.trim(),
        birthDate: birthDate || undefined,
        photoUrl: photoUrl.trim() || undefined,
        status,
        hireDate,
        email: email.trim() || `empleado.${docNumber.replace(/\D/g, '')}@empresa.com`,
        phone: phone.trim() || '+57 300 000 0000',
        address: address.trim() || undefined,
        city: city.trim() || 'Bogotá D.C.',
        position: position.trim(),
        area: area.trim(),
        siteId,
        siteName: selectedSite?.name || organization.sites[0]?.name || 'Sede Principal',
        processId,
        processName: selectedProc?.name || organization.processes[0]?.name || 'Operaciones',
        immediateBoss: immediateBoss.trim() || undefined,
        contractType,
        workModality,
        workShift,
        educationLevel,
        academicRecords: initialDegreeTitle.trim()
          ? [
              {
                id: `acad-${Date.now()}`,
                level: educationLevel,
                degreeTitle: initialDegreeTitle.trim(),
                institution: initialInstitution.trim() || 'Institución Universitaria / Técnica',
                graduationDate: '2020-01-01',
                status: 'GRADUADO'
              }
            ]
          : [],
        certifications: [],
        licenses: [],
        digitalDocuments: [],
        inductions: [],
        trainings: [],
        eppDeliveries: [],
        committeeParticipations: [],
        occupationalExams: [],
        incidentParticipations: [],
        inspections: [],
        initialLaborNotes: initialLaborNotes.trim() || undefined
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-50 border border-slate-300 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {worker ? 'Editar Perfil del Trabajador' : 'Registrar Nuevo Trabajador en la Base Maestra'}
              </h3>
              <p className="text-xs text-slate-600">
                Principio AGAE: <span className="text-emerald-700 font-semibold">UN TRABAJADOR = UN PERFIL ÚNICO</span> • Fuente central para todos los módulos
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-white/80 px-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('ID')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'ID'
                ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Identificación & Contacto</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LABOR')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'LABOR'
                ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>2. Información Laboral</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ACADEMIC')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'ACADEMIC'
                ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>3. Perfil Académico</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {activeTab === 'ID' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Mario"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mendoza Beltrán"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tipo de Documento *</label>
                  <select
                    value={docType}
                    onChange={e => setDocType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="CE">Cédula de Extranjería (CE)</option>
                    <option value="PASAPORTE">Pasaporte</option>
                    <option value="PEP">Permiso Especial (PEP)</option>
                    <option value="PPT">Permiso Protección Temporal (PPT)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Número de Documento (Único) *</label>
                  <input
                    type="text"
                    required
                    disabled={!!worker}
                    placeholder="Ej. 1.020.784.952"
                    value={docNumber}
                    onChange={e => setDocNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Estado en la Plataforma *</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo / Retirado</option>
                    <option value="SUSPENDIDO">Suspendido</option>
                    <option value="EN_VACACIONES">En Vacaciones</option>
                    <option value="INCAPACITADO">Incapacitado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Fecha de Ingreso *</label>
                  <input
                    type="date"
                    required
                    value={hireDate}
                    onChange={e => setHireDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Datos de Contacto y Ubicación</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="correo@empresa.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Teléfono / Celular *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+57 310 000 0000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Dirección de Residencia</label>
                    <input
                      type="text"
                      placeholder="Calle 123 # 45-67"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Ciudad / Municipio</label>
                    <input
                      type="text"
                      placeholder="Bogotá D.C., Medellín..."
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <label className="block text-slate-700 font-semibold mb-1.5 flex items-center justify-between">
                  <span>Fotografía del Trabajador (Avatar Oficial)</span>
                  <span className="text-[10px] text-slate-500">JPG, PNG o URL web</span>
                </label>
                <div className="flex items-center gap-3">
                  {photoUrl ? (
                    <div className="relative group shrink-0">
                      <img
                        src={photoUrl}
                        alt="Foto trabajador"
                        className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-600 text-white shadow hover:bg-rose-700 transition-colors"
                        title="Quitar foto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="file"
                        id="workerPhotoUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setPhotoUrl(reader.result);
                              }
                            };
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                      />
                      <label
                        htmlFor="workerPhotoUpload"
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Subir Foto desde tu Equipo</span>
                      </label>
                      <span className="text-[10px] text-slate-400">o ingresa enlace web:</span>
                    </div>
                    <input
                      type="url"
                      placeholder="https://... (opcional)"
                      value={photoUrl.startsWith('data:') ? '' : photoUrl}
                      onChange={e => setPhotoUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'LABOR' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Cargo Actual *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Coordinador SG-SST, Conductor Carga..."
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Área o Departamento *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Operaciones, HSEQ, Mantenimiento..."
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Sede / Centro de Trabajo *</label>
                  <select
                    value={siteId}
                    onChange={e => setSiteId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    {organization.sites.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.city})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Proceso Vinculado *</label>
                  <select
                    value={processId}
                    onChange={e => setProcessId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    {organization.processes.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.code} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tipo de Vinculación *</label>
                  <select
                    value={contractType}
                    onChange={e => setContractType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="TERMINO_INDEFINIDO">Término Indefinido</option>
                    <option value="TERMINO_FIJO">Término Fijo</option>
                    <option value="OBRA_LABOR">Obra o Labor</option>
                    <option value="PRESTACION_SERVICIOS">Prestación de Servicios</option>
                    <option value="APRENDIZAJE">Aprendizaje SENA</option>
                    <option value="TEMPORAL">Empresa Temporal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Modalidad de Trabajo *</label>
                  <select
                    value={workModality}
                    onChange={e => setWorkModality(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="HIBRIDO">Híbrido</option>
                    <option value="TELETRABAJO">Teletrabajo</option>
                    <option value="EN_CASA">Trabajo en Casa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jornada Laboral *</label>
                  <select
                    value={workShift}
                    onChange={e => setWorkShift(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="COMPLETA">Completa Ordinaria</option>
                    <option value="MEDIO_TIEMPO">Medio Tiempo</option>
                    <option value="TURNOS_ROTATIVOS">Turnos Rotativos</option>
                    <option value="NOCTURNO">Turno Nocturno</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Jefe Inmediato</label>
                <input
                  type="text"
                  placeholder="Ej. Ing. Carlos Mendoza, Lic. Fernando Ortiz..."
                  value={immediateBoss}
                  onChange={e => setImmediateBoss(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {!worker && (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Notas Iniciales de Contratación</label>
                  <textarea
                    rows={2}
                    placeholder="Detalles del cargo de ingreso..."
                    value={initialLaborNotes}
                    onChange={e => setInitialLaborNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'ACADEMIC' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Máximo Nivel Educativo Alcanzado *</label>
                <select
                  value={educationLevel}
                  onChange={e => setEducationLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="PRIMARIA">Básica Primaria</option>
                  <option value="BACHILLERATO">Bachillerato</option>
                  <option value="TECNICO">Técnico Laboral / Profesional</option>
                  <option value="TECNOLOGO">Tecnólogo</option>
                  <option value="PROFESIONAL">Profesional Universitario</option>
                  <option value="ESPECIALIZACION">Especialización</option>
                  <option value="MAESTRIA">Maestría</option>
                  <option value="DOCTORADO">Doctorado</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Título Obtenido / Carrera</label>
                  <input
                    type="text"
                    placeholder="Ej. Ingeniería Industrial, Bachiller..."
                    value={initialDegreeTitle}
                    onChange={e => setInitialDegreeTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Institución Educativa</label>
                  <input
                    type="text"
                    placeholder="Ej. SENA, Universidad Nacional..."
                    value={initialInstitution}
                    onChange={e => setInitialInstitution(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/80 border border-slate-200 text-slate-600 space-y-1">
                <p className="font-semibold text-slate-700">ℹ️ Licencias y Certificaciones Especializadas:</p>
                <p>
                  Podrás adjuntar y configurar en detalle las certificaciones de Alturas, Espacios Confinados,
                  Licencias de SST con número de resolución y fechas de vencimiento directamente desde el{' '}
                  <strong className="text-emerald-700">Expediente Digital 360°</strong> una vez creado el perfil.
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex gap-2">
              {activeTab !== 'ID' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'ACADEMIC' ? 'LABOR' : 'ID')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                >
                  Anterior
                </button>
              )}
              {activeTab !== 'ACADEMIC' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'ID' ? 'LABOR' : 'ACADEMIC')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-emerald-700 text-xs font-semibold"
                >
                  Siguiente paso
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-slate-900/5"
              >
                {worker ? 'Guardar Cambios' : 'Crear Expediente Digital'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
