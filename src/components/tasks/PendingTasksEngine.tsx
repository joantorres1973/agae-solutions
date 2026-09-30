'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Plus,
  Calendar,
  User,
  Building,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ModuleType, Task } from '@/types';

export const PendingTasksEngine: React.FC = () => {
  const { tasks, toggleTaskStatus, addTask, setActiveTab } = useApp();

  const [filterModule, setFilterModule] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('PENDIENTE');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // New task form state
  const [tTitle, setTTitle] = useState('');
  const [tModule, setTModule] = useState<ModuleType>('SST');
  const [tType, setTType] = useState<Task['type']>('INSPECCION');
  const [tDueDate, setTDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [tResponsible, setTResponsible] = useState('');
  const [tPriority, setTPriority] = useState<Task['priority']>('ALTA');

  const filteredTasks = tasks.filter(t => {
    if (filterModule !== 'ALL' && t.module !== filterModule) return false;
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitle || !tResponsible) return;

    addTask({
      title: tTitle,
      module: tModule,
      type: tType,
      dueDate: tDueDate,
      responsible: tResponsible,
      priority: tPriority,
      status: 'PENDIENTE',
      siteName: 'Sede Principal'
    });

    setShowNewTaskModal(false);
    setTTitle('');
    setTResponsible('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card p-4 rounded-xl border border-slate-700/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">
              ¿Qué tengo pendiente? — Centro Único de Tareas y Vencimientos
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Consolidación unificada de actividades, inspecciones, auditorías, acciones ACPM y vencimientos legales de todos los módulos.
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          + Nueva Actividad
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400 font-semibold">Filtrar por:</span>

          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs"
          >
            <option value="ALL">Todos los Módulos</option>
            <option value="SST">SG-SST</option>
            <option value="ENVIRONMENTAL">Gestión Ambiental</option>
            <option value="PESV">Seguridad Vial (PESV)</option>
            <option value="ISO_9001">Sistemas ISO</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="PENDIENTE">Pendientes ({tasks.filter(t => t.status === 'PENDIENTE').length})</option>
            <option value="COMPLETADA">Completadas ({tasks.filter(t => t.status === 'COMPLETADA').length})</option>
          </select>
        </div>

        <span className="text-slate-400 text-[11px]">
          Mostrando {filteredTasks.length} de {tasks.length} actividades programadas
        </span>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center text-slate-400 text-xs">
            No hay actividades pendientes con los filtros seleccionados.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'COMPLETADA';
            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-slate-900/40 border-slate-800 opacity-60'
                    : task.priority === 'CRITICA'
                    ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500'
                    : 'bg-slate-900/80 border-slate-700/70 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-slate-600 hover:border-cyan-400 bg-slate-950'
                    }`}
                  >
                    {isCompleted && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {task.module}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">
                        {task.type}
                      </span>
                      <span className={`px-2 py-0.2 text-[9px] font-bold rounded ${
                        task.priority === 'CRITICA' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        task.priority === 'ALTA' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        Prioridad {task.priority}
                      </span>
                    </div>

                    <h2 className={`text-xs font-bold leading-snug ${isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {task.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-cyan-400" />
                        {task.responsible}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        {task.siteName}
                      </span>
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Calendar className="w-3 h-3" />
                        Vence: {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {task.linkedId && (
                    <button
                      onClick={() => setActiveTab('acpm')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 flex items-center gap-1"
                    >
                      Ir a ACPM <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    {isCompleted ? 'Reabrir' : 'Completar'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal New Task */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateTask} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white">Programar Nueva Actividad / Tarea</h2>
              <button type="button" onClick={() => setShowNewTaskModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Título de la Actividad *</label>
                <input
                  type="text"
                  required
                  value={tTitle}
                  onChange={(e) => setTTitle(e.target.value)}
                  placeholder="Ej: Calibración anual de sonómetros y luxómetros..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Módulo</label>
                  <select
                    value={tModule}
                    onChange={(e) => setTModule(e.target.value as ModuleType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="SST">SG-SST</option>
                    <option value="ENVIRONMENTAL">Gestión Ambiental</option>
                    <option value="PESV">Seguridad Vial</option>
                    <option value="ISO_9001">ISO / Calidad</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tipo</label>
                  <select
                    value={tType}
                    onChange={(e) => setTType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="INSPECCION">Inspección</option>
                    <option value="AUDITORIA">Auditoría</option>
                    <option value="CAPACITACION">Capacitación</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="ACPM">Seguimiento ACPM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Responsable Asignado *</label>
                  <input
                    type="text"
                    required
                    value={tResponsible}
                    onChange={(e) => setTResponsible(e.target.value)}
                    placeholder="Ej: Ing. Marcela Rincón"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    value={tDueDate}
                    onChange={(e) => setTDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Prioridad</label>
                <select
                  value={tPriority}
                  onChange={(e) => setTPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                >
                  <option value="CRITICA">Crítica (Riesgo Inminente o Vencimiento Legal)</option>
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Media</option>
                  <option value="BAJA">Baja</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
              >
                Programar Actividad
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
