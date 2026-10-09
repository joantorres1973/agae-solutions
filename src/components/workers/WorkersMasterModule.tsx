'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { MasterWorker } from '@/types/worker';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  FileText,
  HardHat,
  ChevronRight,
  ExternalLink,
  Award,
  Clock,
  Download,
  Building,
  CheckCircle2,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  HeartPulse
} from 'lucide-react';
import { WorkerFormModal } from './WorkerFormModal';
import { WorkerDigitalDossierModal } from './WorkerDigitalDossierModal';

export const WorkersMasterModule: React.FC = () => {
  const { workers, organization, showNotification } = useApp();

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVO' | 'INACTIVO'>('ACTIVO');
  const [siteFilter, setSiteFilter] = useState<string>('ALL');
  const [areaFilter, setAreaFilter] = useState<string>('ALL');
  const [alertsOnly, setAlertsOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<MasterWorker | null>(null);
  const [selectedDossierWorkerId, setSelectedDossierWorkerId] = useState<string | null>(null);

  // Distinct areas
  const areas = useMemo(() => {
    return Array.from(new Set(workers.map(w => w.area))).filter(Boolean);
  }, [workers]);

  // Overall metrics
  const activeWorkersCount = useMemo(() => {
    return workers.filter(w => w.status === 'ACTIVO').length;
  }, [workers]);

  const workersWithAlerts = useMemo(() => {
    const now = new Date().getTime();
    return workers.filter(w => {
      const hasDocAlert = w.digitalDocuments.some(d => {
        if (!d.expiryDate) return false;
        const diff = Math.ceil((new Date(d.expiryDate).getTime() - now) / (1000 * 60 * 60 * 24));
        return diff <= 30;
      });
      const hasCertAlert = w.certifications.some(c => {
        if (!c.expiryDate) return false;
        const diff = Math.ceil((new Date(c.expiryDate).getTime() - now) / (1000 * 60 * 60 * 24));
        return diff <= 30;
      });
      const hasExamAlert = w.occupationalExams.some(e => {
        if (!e.nextExamDate) return false;
        const diff = Math.ceil((new Date(e.nextExamDate).getTime() - now) / (1000 * 60 * 60 * 24));
        return diff <= 30;
      });
      return hasDocAlert || hasCertAlert || hasExamAlert;
    });
  }, [workers]);

  const totalTrainingsDone = useMemo(() => {
    return workers.reduce((acc, w) => acc + w.trainings.filter(t => t.approved).length, 0);
  }, [workers]);

  const totalEppDeliveriesDone = useMemo(() => {
    return workers.reduce((acc, w) => acc + w.eppDeliveries.length, 0);
  }, [workers]);

  // Filtered workers list
  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      if (statusFilter !== 'ALL' && w.status !== statusFilter) return false;
      if (siteFilter !== 'ALL' && w.siteId !== siteFilter) return false;
      if (areaFilter !== 'ALL' && w.area !== areaFilter) return false;

      if (alertsOnly) {
        const isAlerted = workersWithAlerts.some(aw => aw.id === w.id);
        if (!isAlerted) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = `${w.firstName} ${w.lastName}`.toLowerCase();
        const doc = w.docNumber.toLowerCase();
        const pos = w.position.toLowerCase();
        const area = w.area.toLowerCase();
        if (!fullName.includes(q) && !doc.includes(q) && !pos.includes(q) && !area.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [workers, statusFilter, siteFilter, areaFilter, alertsOnly, searchQuery, workersWithAlerts]);

  const handleExportCsv = () => {
    const headers = ['Nombres', 'Apellidos', 'Tipo Doc', 'Documento', 'Cargo', 'Area', 'Sede', 'Estado', 'Fecha Ingreso', 'Email', 'Telefono'];
    const rows = filteredWorkers.map(w => [
      `"${w.firstName}"`,
      `"${w.lastName}"`,
      `"${w.docType}"`,
      `"${w.docNumber}"`,
      `"${w.position}"`,
      `"${w.area}"`,
      `"${w.siteName}"`,
      `"${w.status}"`,
      `"${w.hireDate}"`,
      `"${w.email}"`,
      `"${w.phone}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Directorio_Trabajadores_AGAE_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Directorio de la Base Maestra exportado exitosamente en formato CSV');
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal Transversal */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-slate-50 border border-emerald-200 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-emerald-100/70 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200 tracking-wider">
                Motor Central Transversal
              </span>
              <span className="text-xs text-slate-600">
                Fuente Única de Información • AGAE SOLUTIONS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Users className="w-6 h-6 text-emerald-700" />
              <span>Base Maestra de Trabajadores & Expediente Digital 360°</span>
            </h1>
            <p className="text-xs text-slate-700 max-w-3xl leading-relaxed">
              Registra a cada trabajador <strong>una sola vez</strong>. Cada proceso de la plataforma
              (SG-SST Res. 0312, Capacitaciones, EPP, Exámenes Ocupacionales, COPASST, Seguridad Vial PESV,
              Gestión Ambiental y ACPM) alimenta automáticamente su expediente digital sin doble digitación.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition-colors shadow-sm"
              title="Descargar listado en Excel / CSV"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Directorio</span>
            </button>

            <button
              onClick={() => {
                setEditingWorker(null);
                setIsFormModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-900/5 hover:shadow-slate-900/5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Trabajador</span>
            </button>
          </div>
        </div>

        {/* Principios clave */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>UN TRABAJADOR = UN PERFIL ÚNICO</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>UN DATO → MÚLTIPLES USOS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>EXPEDIENTE DIGITAL VINCULADO A RES. 0312</span>
          </div>
        </div>
      </div>

      {/* Tarjetas KPIs Ejecutivos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-600 uppercase font-semibold">Total Activos</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{activeWorkersCount}</div>
            <span className="text-[10px] text-slate-600">De {workers.length} registrados</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-600 uppercase font-semibold">Alertas Documentales</span>
            <div className={`text-2xl font-black mt-0.5 ${workersWithAlerts.length > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {workersWithAlerts.length}
            </div>
            <span className="text-[10px] text-slate-600">Próximos a vencer / vencidos</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-600 uppercase font-semibold">Capacitaciones Aprobadas</span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">{totalTrainingsDone}</div>
            <span className="text-[10px] text-slate-600">En expedientes digitales</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-600 uppercase font-semibold">Entregas de EPP</span>
            <div className="text-2xl font-black text-orange-700 mt-0.5">{totalEppDeliveriesDone}</div>
            <span className="text-[10px] text-slate-600">Dotaciones certificadas</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700">
            <HardHat className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-600" />
            <input
              type="text"
              placeholder="Buscar trabajador por nombre, cédula, cargo o área..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Quick toggle views */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => setAlertsOnly(!alertsOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                alertsOnly
                  ? 'bg-amber-100 text-amber-700 border-amber-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Solo con Alertas ({workersWithAlerts.length})</span>
            </button>

            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('GRID')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'GRID' ? 'bg-slate-100 text-emerald-700' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vista en Tarjetas 360°"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'TABLE' ? 'bg-slate-100 text-emerald-700' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vista en Tabla"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdowns de filtro */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-200 text-xs">
          <div>
            <label className="block text-[10px] text-slate-600 font-semibold mb-1">Estado</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="ACTIVO">Activos</option>
              <option value="INACTIVO">Inactivos</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-600 font-semibold mb-1">Sede / Centro</label>
            <select
              value={siteFilter}
              onChange={e => setSiteFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Todas las Sedes</option>
              {organization.sites.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-600 font-semibold mb-1">Área</label>
            <select
              value={areaFilter}
              onChange={e => setAreaFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Todas las Áreas</option>
              {areas.map(a => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setSiteFilter('ALL');
                setAreaFilter('ALL');
                setAlertsOnly(false);
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors text-center"
            >
              Restablecer Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Resultados de la búsqueda */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <span>Mostrando <strong>{filteredWorkers.length}</strong> trabajador(es) de la Base Maestra</span>
      </div>

      {/* VISTA CUADRÍCULA 360° */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkers.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No se encontraron trabajadores con esos filtros.</p>
              <p className="text-xs text-slate-600">Prueba ajustando los términos de búsqueda o los criterios de filtrado.</p>
            </div>
          ) : (
            filteredWorkers.map(w => {
              const hasAlert = workersWithAlerts.some(aw => aw.id === w.id);

              return (
                <div
                  key={w.id}
                  onClick={() => setSelectedDossierWorkerId(w.id)}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-50 border border-slate-200 hover:border-emerald-200 transition-all cursor-pointer group flex flex-col justify-between shadow-md hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <div className="space-y-3">
                    {/* Top Row: Avatar & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {w.photoUrl ? (
                          <img
                            src={w.photoUrl}
                            alt={w.firstName}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-300 group-hover:border-emerald-200 shrink-0 transition-colors"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-emerald-700 shrink-0">
                            {w.firstName[0]}
                            {w.lastName[0]}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                            {w.firstName} {w.lastName}
                          </h3>
                          <span className="text-[11px] text-slate-600 font-mono">
                            {w.docType} {w.docNumber}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            w.status === 'ACTIVO'
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-300'
                          }`}
                        >
                          {w.status}
                        </span>
                        {hasAlert && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold flex items-center gap-1">
                            <span>🔔</span> Alerta
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Position & Area */}
                    <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200 space-y-1">
                      <div className="text-xs font-semibold text-emerald-700 truncate">
                        {w.position}
                      </div>
                      <div className="text-[11px] text-slate-600 truncate flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-600" />
                        <span>{w.area} • {w.siteName.split(' ')[0]}</span>
                      </div>
                    </div>

                    {/* Mini badges */}
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      {w.licenses.some(l => l.type === 'LICENCIA_SST') && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                          Licencia SST
                        </span>
                      )}
                      {w.certifications.some(c => c.title.includes('Alturas')) && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                          Alturas
                        </span>
                      )}
                      {w.committeeParticipations.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                          Comité / COPASST
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        📁 {w.digitalDocuments.length} docs
                      </span>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 group-hover:text-emerald-700 transition-colors">
                    <span className="font-semibold text-[11px]">Ver Expediente 360°</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* VISTA TABLA DETALLADA */
        <div className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Trabajador</th>
                  <th className="p-3.5">Documento</th>
                  <th className="p-3.5">Cargo Actual</th>
                  <th className="p-3.5">Área / Proceso</th>
                  <th className="p-3.5">Sede</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5">Documentos</th>
                  <th className="p-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredWorkers.map(w => (
                  <tr
                    key={w.id}
                    onClick={() => setSelectedDossierWorkerId(w.id)}
                    className="hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        {w.photoUrl ? (
                          <img
                            src={w.photoUrl}
                            alt={w.firstName}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-[10px] shrink-0">
                            {w.firstName[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{w.firstName} {w.lastName}</div>
                          <div className="text-[10px] text-slate-600">{w.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-700">
                      {w.docType} {w.docNumber}
                    </td>
                    <td className="p-3.5 font-semibold text-emerald-700">{w.position}</td>
                    <td className="p-3.5 text-slate-700">{w.area}</td>
                    <td className="p-3.5 text-slate-600">{w.siteName.split(' ')[0]}</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          w.status === 'ACTIVO'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {w.digitalDocuments.length} docs
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedDossierWorkerId(w.id);
                        }}
                        className="p-1 text-slate-600 hover:text-emerald-700 transition-colors"
                        title="Ver Expediente Digital"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Formulario de Creación / Edición */}
      <WorkerFormModal
        isOpen={isFormModalOpen}
        worker={editingWorker}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingWorker(null);
        }}
      />

      {/* MODAL: Expediente Digital 360° */}
      <WorkerDigitalDossierModal
        isOpen={!!selectedDossierWorkerId}
        workerId={selectedDossierWorkerId}
        onClose={() => setSelectedDossierWorkerId(null)}
        onEditWorker={w => {
          setEditingWorker(w);
          setIsFormModalOpen(true);
        }}
      />
    </div>
  );
};
