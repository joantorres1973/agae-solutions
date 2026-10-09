'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Car,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Wrench,
  FileCheck2,
  Plus,
  Clock,
  ArrowRight,
  CheckCircle2,
  Check
} from 'lucide-react';
import { PesvDriver, PesvVehicle } from '@/types';

export const PesvModule: React.FC = () => {
  const {
    organization,
    pesvVehicles,
    pesvDrivers,
    addPesvVehicle,
    addPesvDriver,
    showNotification
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'STEPS' | 'VEHICLES' | 'DRIVERS'>('STEPS');

  // New vehicle form state
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vPlate, setVPlate] = useState('');
  const [vType, setVType] = useState<PesvVehicle['type']>('CAMION');
  const [vBrand, setVBrand] = useState('');
  const [vYear, setVYear] = useState(2023);
  const [vSoat, setVSoat] = useState('2026-10-15');
  const [vRtm, setVRtm] = useState('2026-10-20');
  const [vDriver, setVDriver] = useState('');

  // New driver form state
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [dName, setDName] = useState('');
  const [dId, setDId] = useState('');
  const [dLic, setDLic] = useState('');
  const [dCat, setDCat] = useState<PesvDriver['licenseCategory']>('C2');
  const [dLicExp, setDLicExp] = useState('2028-06-30');
  const [dMedExp, setDMedExp] = useState('2026-12-15');

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vPlate) return;

    addPesvVehicle({
      plate: vPlate.toUpperCase(),
      type: vType,
      brand: vBrand || 'Chevrolet',
      modelYear: vYear,
      soatExpiry: vSoat,
      rtmExpiry: vRtm,
      lastPreoperationalDate: new Date().toISOString().split('T')[0],
      assignedDriver: vDriver || 'Sin Asignar',
      status: 'OPERATIVO'
    });

    setShowVehicleModal(false);
    setVPlate('');
    setVBrand('');
  };

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dName || !dId) return;

    addPesvDriver({
      fullName: dName,
      idNumber: dId,
      licenseNumber: dLic || dId,
      licenseCategory: dCat,
      licenseExpiry: dLicExp,
      simitPazYSalvo: true,
      medicalExamExpiry: dMedExp,
      defensiveDrivingTrainingDate: new Date().toISOString().split('T')[0],
      status: 'APTO'
    });

    setShowDriverModal(false);
    setDName('');
    setDId('');
    setDLic('');
  };

  // Los 24 Pasos del PESV (Res. 40595 de 2022)
  const pesvSteps = [
    { num: 1, title: 'Líder del diseño e implementación del PESV', phase: 'Planificación', status: 'CUMPLIDO' },
    { num: 2, title: 'Comité de seguridad vial', phase: 'Planificación', status: 'CUMPLIDO' },
    { num: 3, title: 'Política de Seguridad Vial de la organización', phase: 'Planificación', status: 'CUMPLIDO' },
    { num: 4, title: 'Liderazgo, compromiso y corresponsabilidad', phase: 'Planificación', status: 'CUMPLIDO' },
    { num: 5, title: 'Diagnóstico de la gestión de la seguridad vial', phase: 'Planificación', status: 'CUMPLIDO' },
    { num: 6, title: 'Caracterización, evaluación y control de riesgos viales', phase: 'Planificación', status: 'CUMPLIDO' },
    { num: 7, title: 'Objetivos y metas del PESV', phase: 'Planificación', status: 'CUMPLIDO' },
    { num: 8, title: 'Programas de gestión de riesgos críticos y factores de desempeño', phase: 'Implementación', status: 'EN_ACPM' },
    { num: 9, title: 'Plan anual de trabajo del PESV', phase: 'Implementación', status: 'CUMPLIDO' },
    { num: 10, title: 'Competencia y plan anual de formación', phase: 'Implementación', status: 'CUMPLIDO' },
    { num: 11, title: 'Responsabilidad y comportamiento seguro', phase: 'Implementación', status: 'CUMPLIDO' },
    { num: 12, title: 'Plan de preparación y respuesta ante emergencias viales', phase: 'Implementación', status: 'CUMPLIDO' },
    { num: 13, title: 'Investigación interna de siniestros viales', phase: 'Implementación', status: 'CUMPLIDO' },
    { num: 14, title: 'Vías seguras administradas por la organización', phase: 'Implementación', status: 'CUMPLIDO' },
    { num: 15, title: 'Planificación de desplazamientos laborales (Rutas)', phase: 'Implementación', status: 'CUMPLIDO' },
    { num: 16, title: 'Inspección preoperacional diaria de vehículos', phase: 'Implementación', status: 'CUMPLIDO' },
    { num: 17, title: 'Mantenimiento y control de vehículos seguros', phase: 'Implementación', status: 'ALERTA' },
    { num: 18, title: 'Gestión del cambio y contratistas', phase: 'Implementación', status: 'CUMPLIDO' },
    { num: 19, title: 'Archivo y retención documental', phase: 'Implementación', status: 'CUMPLIDO' },
    { num: 20, title: 'Indicadores y reporte de autogestión PESV', phase: 'Seguimiento', status: 'CUMPLIDO' },
    { num: 21, title: 'Registro y análisis estadístico de siniestros', phase: 'Seguimiento', status: 'CUMPLIDO' },
    { num: 22, title: 'Auditoría anual del PESV', phase: 'Seguimiento', status: 'CUMPLIDO' },
    { num: 23, title: 'Revisión por la alta dirección', phase: 'Mejora', status: 'CUMPLIDO' },
    { num: 24, title: 'Acciones preventivas, correctivas y de mejora (ACPM)', phase: 'Mejora', status: 'CUMPLIDO' }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Module Title Banner */}
      <div className="glass-card p-4 rounded-xl border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700 border border-sky-200">
              <Car className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Plan Estratégico de Seguridad Vial (PESV)
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Metodología oficial de <strong>Resolución 40595 de 2022</strong>. Nivel aplicable: <strong className="text-sky-700">{organization.pesvLevel}</strong> (24 Pasos).
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-50 p-0.5 border border-slate-300 shrink-0">
          <button
            onClick={() => setActiveSubTab('STEPS')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'STEPS' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Los 24 Pasos PESV
          </button>
          <button
            onClick={() => setActiveSubTab('VEHICLES')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'VEHICLES' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Matriz de Vehículos ({pesvVehicles.length})
          </button>
          <button
            onClick={() => setActiveSubTab('DRIVERS')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'DRIVERS' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Matriz de Conductores ({pesvDrivers.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: LOS 24 PASOS */}
      {activeSubTab === 'STEPS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border border-slate-300">
              <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
                Nivel Aplicable Autocalculado
              </span>
              <div className="text-base font-bold text-slate-900 mt-1">
                Nivel {organization.pesvLevel} (Avanzado)
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Organización dedicada a prestación de servicios de transporte con flota superior a 50 vehículos y conductores.
              </p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-300">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Avance de Implementación
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">83.3%</div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div className="bg-sky-500 h-1.5 rounded-full w-[83.3%]" />
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-amber-200 bg-slate-50">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                Alertas Activas en el PESV
              </span>
              <div className="text-sm font-bold text-slate-900 mt-1">
                1 Examen Médico Vencido • 1 RTM Próxima
              </div>
              <span className="text-[11px] text-amber-700 block mt-1">
                Vinculado a ACPM-2026-002 y Centro de Tareas
              </span>
            </div>
          </div>

          {/* 24 Pasos Grid */}
          <div className="glass-card rounded-xl border border-slate-300 p-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Estructura Oficial de los 24 Pasos — Resolución 40595 de 2022
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {pesvSteps.map((step) => (
                <div
                  key={step.num}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-sky-200 transition-colors flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-bold text-[10px]">
                        {step.num}
                      </span>
                      <span className="text-[10px] text-slate-600 font-semibold">{step.phase}</span>
                    </div>
                    <p className="font-semibold text-slate-800 leading-snug">{step.title}</p>
                  </div>

                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded shrink-0 ${
                    step.status === 'CUMPLIDO' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    step.status === 'EN_ACPM' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {step.status === 'EN_ACPM' ? 'En ACPM' : step.status === 'ALERTA' ? 'Alerta' : 'Cumplido'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: MATRIZ DE VEHÍCULOS */}
      {activeSubTab === 'VEHICLES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Flota de Vehículos Seguros (Paso 16 y 17)</h2>
              <p className="text-xs text-slate-600">
                Control de vigencia documental SOAT, RTM, mantenimientos preventivos y preoperacionales diarios.
              </p>
            </div>
            <button
              onClick={() => setShowVehicleModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              + Registrar Vehículo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pesvVehicles.map(veh => (
              <div key={veh.id} className="glass-card rounded-xl p-4 border border-slate-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-teal-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-300">
                      {veh.plate}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{veh.brand}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    veh.status === 'OPERATIVO' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {veh.status}
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1.5 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Vigencia SOAT:</span>
                    <span className="font-semibold text-emerald-700">{veh.soatExpiry}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Vigencia RTM:</span>
                    <span className={`font-semibold ${veh.rtmExpiry.startsWith('2026-04') ? 'text-amber-700 font-bold' : 'text-emerald-700'}`}>
                      {veh.rtmExpiry} {veh.rtmExpiry.startsWith('2026-04') && '(Próximo)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Último Preoperacional:</span>
                    <span className="text-teal-700">{veh.lastPreoperationalDate}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-600">Conductor:</span>
                    <span className="font-medium text-slate-800">{veh.assignedDriver}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: MATRIZ DE CONDUCTORES */}
      {activeSubTab === 'DRIVERS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Idoneidad y Expedientes de Conductores (Paso 8 y 10)</h2>
              <p className="text-xs text-slate-600">
                Validación obligatoria de aptitud física/mental, vigencia en SIMIT, licencias de conducción y cursos viales.
              </p>
            </div>
            <button
              onClick={() => setShowDriverModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              + Registrar Conductor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pesvDrivers.map(driver => (
              <div key={driver.id} className="glass-card rounded-xl p-4 border border-slate-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-sky-700" />
                    <span className="text-xs font-bold text-slate-900">{driver.fullName}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    driver.status === 'APTO' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {driver.status === 'APTO' ? 'APTO PARA RUTA' : 'EN OBSERVACIÓN'}
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1.5 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">C.C. / Identificación:</span>
                    <span className="font-mono text-slate-800">{driver.idNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Licencia Categoría:</span>
                    <span className="font-bold text-teal-700">{driver.licenseCategory} (Exp: {driver.licenseExpiry})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Examen Médico Vial:</span>
                    <span className={`font-semibold ${driver.medicalExamExpiry < '2026-03-25' ? 'text-rose-700 font-bold' : 'text-emerald-700'}`}>
                      {driver.medicalExamExpiry} {driver.medicalExamExpiry < '2026-03-25' && '(VENCIDO)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-600">Paz y Salvo SIMIT:</span>
                    <span className="text-emerald-700 font-bold">Sin Infracciones Pendientes</span>
                  </div>
                </div>

                {driver.medicalExamExpiry < '2026-03-25' && (
                  <div className="p-2 rounded bg-rose-50 border border-rose-200 text-[11px] text-rose-700 flex items-center justify-between">
                    <span>Hallazgo activo trasladado a ACPM-002</span>
                    <span className="font-bold underline cursor-pointer">Ver ACPM →</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Vehicle */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddVehicle} className="bg-slate-50 border border-slate-300 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Registrar Vehículo en Flota PESV</h2>
              <button type="button" onClick={() => setShowVehicleModal(false)} className="text-slate-600 hover:text-slate-900">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Placa *</label>
                  <input
                    type="text"
                    required
                    value={vPlate}
                    onChange={(e) => setVPlate(e.target.value)}
                    placeholder="Ej: ABC-123"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 uppercase"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tipo de Vehículo</label>
                  <select
                    value={vType}
                    onChange={(e) => setVType(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    <option value="CAMION">Camión de Carga</option>
                    <option value="AUTOMOVIL">Automóvil Corporativo</option>
                    <option value="MOTOCICLETA">Motocicleta de Envíos</option>
                    <option value="VAN">Van / Furgón</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Marca y Línea</label>
                  <input
                    type="text"
                    value={vBrand}
                    onChange={(e) => setVBrand(e.target.value)}
                    placeholder="Ej: Chevrolet NPR Furgón"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Modelo (Año)</label>
                  <input
                    type="number"
                    value={vYear}
                    onChange={(e) => setVYear(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vencimiento SOAT</label>
                  <input
                    type="date"
                    value={vSoat}
                    onChange={(e) => setVSoat(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vencimiento RTM</label>
                  <input
                    type="date"
                    value={vRtm}
                    onChange={(e) => setVRtm(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Conductor Asignado</label>
                <input
                  type="text"
                  value={vDriver}
                  onChange={(e) => setVDriver(e.target.value)}
                  placeholder="Ej: Javier Gómez"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowVehicleModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
              >
                Guardar en Flota
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Add Driver */}
      {showDriverModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddDriver} className="bg-slate-50 border border-slate-300 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Registrar Conductor en PESV</h2>
              <button type="button" onClick={() => setShowDriverModal(false)} className="text-slate-600 hover:text-slate-900">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={dName}
                  onChange={(e) => setDName(e.target.value)}
                  placeholder="Ej: Mauricio Quintero Beltrán"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cédula de Ciudadanía *</label>
                  <input
                    type="text"
                    required
                    value={dId}
                    onChange={(e) => setDId(e.target.value)}
                    placeholder="Ej: 80.193.450"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Categoría Licencia</label>
                  <select
                    value={dCat}
                    onChange={(e) => setDCat(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    <option value="C2">C2 (Camión rígido y buseta)</option>
                    <option value="C3">C3 (Vehículos articulados / tractomula)</option>
                    <option value="C1">C1 (Automóviles y vans públicas)</option>
                    <option value="B1">B1 (Particular)</option>
                    <option value="A2">A2 (Motocicleta)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vigencia Licencia</label>
                  <input
                    type="date"
                    value={dLicExp}
                    onChange={(e) => setDLicExp(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vigencia Examen Médico</label>
                  <input
                    type="date"
                    value={dMedExp}
                    onChange={(e) => setDMedExp(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowDriverModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
              >
                Registrar Conductor
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
