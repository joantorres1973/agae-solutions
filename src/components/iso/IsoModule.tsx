'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Award,
  Layers,
  CheckCircle2,
  FileText,
  Shield,
  Target,
  Users,
  Compass,
  GitBranch,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { ModuleType } from '@/types';

export const IsoModule: React.FC = () => {
  const { organization, toggleModule } = useApp();

  const is9001 = organization.activeModules.includes('ISO_9001');
  const is14001 = organization.activeModules.includes('ISO_14001');
  const is45001 = organization.activeModules.includes('ISO_45001');

  const [activeChapter, setActiveChapter] = useState<number>(4);

  // High Level Structure (HLS) integrado
  const hlsChapters = [
    {
      num: 4,
      title: 'Contexto de la Organización',
      desc: 'Comprensión de la organización, partes interesadas (DOFA, PESTEL) y alcance del SGI.',
      iso9001: 'Requisitos de clientes y partes interesadas de la calidad.',
      iso14001: 'Condiciones ambientales externas e internas pertinentes.',
      iso45001: 'Necesidades y expectativas de los trabajadores y partes interesadas en SST.'
    },
    {
      num: 5,
      title: 'Liderazgo y Compromiso',
      desc: 'Política integrada HSEQ, roles, responsabilidades y consulta y participación de los trabajadores.',
      iso9001: 'Enfoque al cliente y liderazgo en calidad.',
      iso14001: 'Compromiso con la protección del medio ambiente y prevención de la contaminación.',
      iso45001: 'Compromiso con la prevención de lesiones y deterioro de la salud.'
    },
    {
      num: 6,
      title: 'Planificación del Sistema',
      desc: 'Acciones para abordar riesgos y oportunidades, objetivos integrados y planificación de cambios.',
      iso9001: 'Riesgos de proceso y satisfacción del cliente.',
      iso14001: 'Aspectos ambientales significativos y requisitos legales.',
      iso45001: 'Identificación de peligros y evaluación de riesgos SST (GTC 45).'
    },
    {
      num: 7,
      title: 'Apoyo y Recursos',
      desc: 'Competencia, toma de conciencia, comunicación interna/externa e información documentada.',
      iso9001: 'Recursos de seguimiento y medición calibrados.',
      iso14001: 'Competencia técnica en gestión de residuos y emergencias ambientales.',
      iso45001: 'Competencia en seguridad industrial y EPP.'
    },
    {
      num: 8,
      title: 'Operación y Control',
      desc: 'Planificación y control operacional unificado para eliminar redundancias.',
      iso9001: 'Requisitos para productos y servicios, diseño y control de salidas no conformes.',
      iso14001: 'Preparación y respuesta ante emergencias ambientales y PGIRS.',
      iso45001: 'Jerarquía de controles y respuesta ante emergencias locativas.'
    },
    {
      num: 9,
      title: 'Evaluación del Desempeño',
      desc: 'Seguimiento, medición, análisis, auditoría interna integrada y revisión por la dirección.',
      iso9001: 'Satisfacción del cliente e indicadores OTIF.',
      iso14001: 'Evaluación del cumplimiento legal ambiental y huella de carbono.',
      iso45001: 'Evaluación del cumplimiento legal SST y estándares mínimos.'
    },
    {
      num: 10,
      title: 'Mejora Continua',
      desc: 'No conformidad y acción correctiva unificada (Matriz ACPM compartida).',
      iso9001: 'Mejora continua en productos y procesos.',
      iso14001: 'Mejora continua en el desempeño ambiental.',
      iso45001: 'Mejora continua en las condiciones de trabajo seguras.'
    }
  ];

  const currentCh = hlsChapters.find(c => c.num === activeChapter) || hlsChapters[0];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Module Title Banner */}
      <div className="glass-card p-4 rounded-xl border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">
              Sistemas de Gestión ISO — Estructura HLS Integrada
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestión armónica sin silos. Los requisitos comunes de <strong>ISO 9001</strong>, <strong>ISO 14001</strong> e <strong>ISO 45001</strong> se administran una sola vez bajo la Estructura de Alto Nivel.
          </p>
        </div>

        {/* Modular Subscription Switches */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-lg border border-slate-700 text-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Normas Contratadas:</span>
          
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={is9001}
              onChange={() => toggleModule('ISO_9001')}
              className="accent-indigo-500"
            />
            <span className={is9001 ? 'text-indigo-300 font-bold' : 'text-slate-500'}>ISO 9001</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={is14001}
              onChange={() => toggleModule('ISO_14001')}
              className="accent-emerald-500"
            />
            <span className={is14001 ? 'text-emerald-300 font-bold' : 'text-slate-500'}>ISO 14001</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={is45001}
              onChange={() => toggleModule('ISO_45001')}
              className="accent-orange-500"
            />
            <span className={is45001 ? 'text-orange-300 font-bold' : 'text-slate-500'}>ISO 45001</span>
          </label>
        </div>
      </div>

      {/* Integration Philosophy Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/30 border border-indigo-500/30 text-xs flex items-center justify-between gap-4">
        <div>
          <span className="font-bold text-indigo-300 block mb-0.5">
            Principio: Integración Tri-Norma sin Duplicidad
          </span>
          <p className="text-slate-300 max-w-3xl leading-relaxed">
            Un solo proceso operativo como <strong>"{organization.processes[0]?.name}"</strong> da cumplimiento simultáneamente al Capítulo 8 de ISO 9001 (Calidad en entrega), ISO 14001 (Control de emisiones y residuos) e ISO 45001 (Seguridad en cargue).
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-cyan-400 font-mono text-[11px] font-bold shrink-0">
          <GitBranch className="w-3.5 h-3.5" /> 1 Registro → 3 Normas
        </div>
      </div>

      {/* HLS Chapter Tabs Navigation */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-2">
        {hlsChapters.map(ch => (
          <button
            key={ch.num}
            onClick={() => setActiveChapter(ch.num)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeChapter === ch.num
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Capítulo {ch.num}: {ch.title.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Current Chapter View with 3-norm comparison */}
      <div className="glass-card rounded-xl p-5 border border-slate-700/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              Estructura de Alto Nivel Integrada
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Capítulo {currentCh.num} — {currentCh.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{currentCh.desc}</p>
          </div>
        </div>

        {/* 3 Pillars of the Tri-Norm */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* ISO 9001 */}
          <div className={`p-4 rounded-xl border transition-all ${
            is9001 ? 'bg-slate-900/90 border-indigo-500/40' : 'bg-slate-900/30 border-slate-800 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-indigo-300">ISO 9001:2015 (Calidad)</span>
              {is9001 ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-400 font-bold border border-indigo-800">Activo</span>
              ) : (
                <span className="text-[10px] text-slate-500">Inactivo</span>
              )}
            </div>
            <p className="text-slate-300 leading-relaxed mt-2">{currentCh.iso9001}</p>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              Cumplimiento: <strong className="text-emerald-400">92.4%</strong>
            </div>
          </div>

          {/* ISO 14001 */}
          <div className={`p-4 rounded-xl border transition-all ${
            is14001 ? 'bg-slate-900/90 border-emerald-500/40' : 'bg-slate-900/30 border-slate-800 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-300">ISO 14001:2015 (Ambiental)</span>
              {is14001 ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">Activo</span>
              ) : (
                <span className="text-[10px] text-slate-500">Inactivo</span>
              )}
            </div>
            <p className="text-slate-300 leading-relaxed mt-2">{currentCh.iso14001}</p>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              Cumplimiento: <strong className="text-emerald-400">90.1%</strong>
            </div>
          </div>

          {/* ISO 45001 */}
          <div className={`p-4 rounded-xl border transition-all ${
            is45001 ? 'bg-slate-900/90 border-orange-500/40' : 'bg-slate-900/30 border-slate-800 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-orange-300">ISO 45001:2018 (SST)</span>
              {is45001 ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-950 text-orange-400 font-bold border border-orange-800">Activo</span>
              ) : (
                <span className="text-[10px] text-slate-500">Inactivo</span>
              )}
            </div>
            <p className="text-slate-300 leading-relaxed mt-2">{currentCh.iso45001}</p>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              Cumplimiento: <strong className="text-emerald-400">89.5%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
