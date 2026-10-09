'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Building2,
  X,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Car,
  HardHat,
  MapPin,
  GitBranch,
  Save,
  Sparkles
} from 'lucide-react';
import { PesvLevel, SstStandardCount } from '@/types';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({ isOpen, onClose }) => {
  const { organization, updateOrganization, updateCharacterization, setActiveTab } = useApp();

  const [name, setName] = useState(organization.name);
  const [nit, setNit] = useState(organization.nit);
  const [ciiu, setCiiu] = useState(organization.ciiu);
  const [economicActivity, setEconomicActivity] = useState(organization.economicActivity);
  const [riskLevelArl, setRiskLevelArl] = useState(organization.riskLevelArl);
  const [employeeCount, setEmployeeCount] = useState(organization.employeeCount);
  const [contractorCount, setContractorCount] = useState(organization.contractorCount);

  // Autocalculate Standards & PESV
  const calculateSstStandards = (workers: number, risk: number): SstStandardCount => {
    if (workers <= 10 && risk <= 3) return 7;
    if (workers <= 50 && risk <= 3) return 21;
    return 60;
  };

  const calculatePesvLevel = (workers: number): PesvLevel => {
    if (workers < 20) return 'BASICO';
    if (workers <= 50) return 'ESTANDAR';
    return 'AVANZADO';
  };

  const dynamicSstStandards = calculateSstStandards(employeeCount, riskLevelArl);
  const dynamicPesv = calculatePesvLevel(employeeCount);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganization({
      name,
      nit,
      ciiu,
      economicActivity,
      riskLevelArl: riskLevelArl as any,
      employeeCount,
      contractorCount,
      sstStandardCount: dynamicSstStandards,
      pesvLevel: dynamicPesv
    });
    updateCharacterization({
      identification: {
        razonSocial: name,
        nit,
        codigoCiiu: ciiu,
        actividadEconomicaPrincipal: economicActivity
      } as any,
      size: {
        totalTrabajadores: employeeCount + contractorCount,
        trabajadoresDirectos: employeeCount,
        contratistas: contractorCount
      } as any,
      sst: {
        claseRiesgoArl: riskLevelArl as any
      } as any
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-50 border border-slate-300 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Caracterización Empresarial & Parametrización
              </h2>
              <p className="text-[11px] text-slate-500">
                La plataforma parametriza automáticamente los estándares SST y nivel PESV aplicable.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner to launch complete Smart Characterization Wizard */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-50 via-white to-slate-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-teal-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              ¿Desea realizar el Diagnóstico Completo y Condicional?
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Acceda al Asistente Inteligente de 11 pasos: caracterización ambiental, operación vial, riesgos críticos y propuesta comercial.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              setActiveTab('characterization');
            }}
            className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold whitespace-nowrap text-xs shadow-md shadow-teal-600/30 flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <span>Lanzar Asistente Inteligente</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Automatic Classification Badges */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
              <span className="text-[10px] text-orange-700 font-bold uppercase block">
                SG-SST (Resolución 0312 de 2019)
              </span>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {dynamicSstStandards} Estándares Mínimos
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                (Basado en {employeeCount} trabajadores y Riesgo ARL {riskLevelArl})
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
              <span className="text-[10px] text-sky-700 font-bold uppercase block">
                PESV (Resolución 40595 de 2022)
              </span>
              <div className="text-sm font-bold text-slate-900 mt-1">
                Nivel {dynamicPesv} (24 Pasos)
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                (Autoclasificación por volumen de flota y trabajadores)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Razón Social *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">NIT *</label>
              <input
                type="text"
                required
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Código CIIU Principal *</label>
              <input
                type="text"
                required
                value={ciiu}
                onChange={(e) => setCiiu(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Clase de Riesgo ARL (1 a 5) *</label>
              <select
                value={riskLevelArl}
                onChange={(e) => setRiskLevelArl(Number(e.target.value) as any)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-teal-500"
              >
                <option value={1}>Clase I (Riesgo Mínimo)</option>
                <option value={2}>Clase II (Riesgo Bajo)</option>
                <option value={3}>Clase III (Riesgo Medio)</option>
                <option value={4}>Clase IV (Riesgo Alto - Transporte / Manufactura)</option>
                <option value={5}>Clase V (Riesgo Máximo - Minería / Construcción)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Actividad Económica Principal</label>
            <textarea
              rows={2}
              value={economicActivity}
              onChange={(e) => setEconomicActivity(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Número de Trabajadores Directos *</label>
              <input
                type="number"
                required
                min={1}
                value={employeeCount}
                onChange={(e) => setEmployeeCount(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 font-bold text-sm"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Contratistas / Temporales</label>
              <input
                type="number"
                min={0}
                value={contractorCount}
                onChange={(e) => setContractorCount(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 font-bold text-sm"
              />
            </div>
          </div>

          {/* Sedes Activas Preview */}
          <div>
            <span className="font-semibold text-slate-700 block mb-1.5">Sedes Operativas Configuradas ({organization.sites.length})</span>
            <div className="space-y-1.5">
              {organization.sites.map(site => (
                <div key={site.id} className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-800 font-semibold">{site.name}</span>
                  <span className="text-slate-500">{site.city} • {site.workerCount} trabajadores</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar y Recalcular Sistema
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
