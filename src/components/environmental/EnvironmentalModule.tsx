'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Leaf,
  Flame,
  Trash2,
  Scale,
  FileCheck2,
  Plus,
  Calculator,
  Building,
  TrendingDown,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { GhgEmissionRecord, PgirsRecord } from '@/types';

export const EnvironmentalModule: React.FC = () => {
  const {
    organization,
    ghgRecords,
    addGhgRecord,
    pgirsRecords,
    addPgirsRecord,
    showNotification
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'CARBON' | 'PGIRS' | 'ASPECTS'>('CARBON');

  // Carbon calculator form
  const [scope, setScope] = useState<1 | 2 | 3>(1);
  const [sourceCategory, setSourceCategory] = useState('Combustibles Fósiles Flota Propia (Diesel B10)');
  const [period, setPeriod] = useState('2026-Q1');
  const [consumptionValue, setConsumptionValue] = useState<number>(1000);
  const [consumptionUnit, setConsumptionUnit] = useState('Galones');
  const [emissionFactor, setEmissionFactor] = useState<number>(10.21);
  const [factorSource, setFactorSource] = useState('UPME / FECOC 2024');
  const [factorUnit, setFactorUnit] = useState('kg CO2eq / Galón');
  const [siteName, setSiteName] = useState(organization.sites[0]?.name || 'Sede Principal');
  const [processName, setProcessName] = useState('Operaciones Logísticas');
  const [evidenceFile, setEvidenceFile] = useState('factura_consumo_combustible.pdf');

  // PGIRS form
  const [wasteName, setWasteName] = useState('');
  const [wasteType, setWasteType] = useState<PgirsRecord['wasteClassification']>('PELIGROSO_RESPEL');
  const [weightKg, setWeightKg] = useState<number>(150);
  const [gestor, setGestor] = useState('EcoProcesos Ambientales S.A.S.');
  const [gestorNit, setGestorNit] = useState('830.123.456-1');
  const [certNumber, setCertNumber] = useState('CERT-RESPEL-2026-');

  // Emission factor helper on scope change
  const handleScopeChange = (newScope: 1 | 2 | 3) => {
    setScope(newScope);
    if (newScope === 1) {
      setSourceCategory('Combustibles Fósiles Flota Propia (Diesel B10)');
      setConsumptionUnit('Galones');
      setEmissionFactor(10.21);
      setFactorSource('UPME Colombia / FECOC 2024');
      setFactorUnit('kg CO2eq / Galón');
    } else if (newScope === 2) {
      setSourceCategory('Energía Eléctrica Red Nacional SIN');
      setConsumptionUnit('kWh');
      setEmissionFactor(0.164);
      setFactorSource('XM Factor Emisión Red SIN 2024');
      setFactorUnit('kg CO2eq / kWh');
    } else {
      setSourceCategory('Disposición de Residuos Ordinarios');
      setConsumptionUnit('Kilogramos');
      setEmissionFactor(0.58);
      setFactorSource('DEFRA / EPA Waste Guidelines 2024');
      setFactorUnit('kg CO2eq / kg residuo');
    }
  };

  const handleAddEmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumptionValue || consumptionValue <= 0) return;

    addGhgRecord({
      scope,
      period,
      siteId: organization.sites[0]?.id || 'site-1',
      siteName,
      processName,
      sourceCategory,
      consumptionValue: Number(consumptionValue),
      consumptionUnit,
      emissionFactor: Number(emissionFactor),
      factorSource,
      factorYear: 2024,
      factorUnit,
      evidenceFileName: evidenceFile
    });
  };

  const handleAddPgirs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteName || weightKg <= 0) return;

    addPgirsRecord({
      date: new Date().toISOString().split('T')[0],
      wasteClassification: wasteType,
      wasteName,
      weightKg: Number(weightKg),
      generatorArea: 'Operaciones Fontibón',
      authorizedGestor: gestor,
      gestorNit,
      certificateNumber: certNumber + Math.floor(Math.random() * 900 + 100),
      disposalType: wasteType === 'PELIGROSO_RESPEL' ? 'INCINERACION_TERMICA' : wasteType === 'APROVECHABLE' ? 'RECICLAJE' : 'RELLENO_SANITARIO'
    });

    setWasteName('');
  };

  // Aggregated emission stats
  const totalKg = ghgRecords.reduce((a, b) => a + b.totalKgCO2eq, 0);
  const s1Kg = ghgRecords.filter(g => g.scope === 1).reduce((a, b) => a + b.totalKgCO2eq, 0);
  const s2Kg = ghgRecords.filter(g => g.scope === 2).reduce((a, b) => a + b.totalKgCO2eq, 0);
  const s3Kg = ghgRecords.filter(g => g.scope === 3).reduce((a, b) => a + b.totalKgCO2eq, 0);

  // PGIRS stats
  const totalWasteKg = pgirsRecords.reduce((a, b) => a + b.weightKg, 0);
  const respelKg = pgirsRecords.filter(p => p.wasteClassification === 'PELIGROSO_RESPEL').reduce((a, b) => a + b.weightKg, 0);
  const reciclaKg = pgirsRecords.filter(p => p.wasteClassification === 'APROVECHABLE').reduce((a, b) => a + b.weightKg, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Module Title Banner */}
      <div className="glass-card p-4 rounded-xl border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Leaf className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">
              Gestión Ambiental & Calculadora de Huella de Carbono
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestión Integral de Residuos (PGIRS), Aspectos/Impactos Ambientales y Cálculo de Emisiones GEI (Alcances 1, 2 y 3) según ISO 14064 y GHG Protocol.
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-900/90 p-0.5 border border-slate-700 shrink-0">
          <button
            onClick={() => setActiveSubTab('CARBON')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'CARBON' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Calculadora Huella GEI
          </button>
          <button
            onClick={() => setActiveSubTab('PGIRS')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'PGIRS' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            PGIRS & Residuos ({pgirsRecords.length})
          </button>
          <button
            onClick={() => setActiveSubTab('ASPECTS')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'ASPECTS' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Aspectos e Impactos
          </button>
        </div>
      </div>

      {/* SUBTAB 1: CALCULADORA DE HUELLA DE CARBONO */}
      {activeSubTab === 'CARBON' && (
        <div className="space-y-5">
          {/* Executive Carbon KPI Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-xl border border-slate-700/80 bg-slate-900/70">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Emisiones Totales Consolidadas
              </span>
              <div className="text-2xl font-black text-white mt-1">
                {(totalKg / 1000).toFixed(2)} <span className="text-xs text-emerald-400">Ton CO₂eq</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {totalKg.toLocaleString()} kg CO₂eq contabilizados
              </span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-rose-500/30 bg-slate-900/70">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                Alcance 1 (Directas)
              </span>
              <div className="text-xl font-black text-white mt-1">
                {(s1Kg / 1000).toFixed(2)} <span className="text-xs text-rose-400">Ton CO₂eq</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Combustibles flota propia y refrigerantes
              </span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-amber-500/30 bg-slate-900/70">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Alcance 2 (Energía Eléctrica)
              </span>
              <div className="text-xl font-black text-white mt-1">
                {(s2Kg / 1000).toFixed(2)} <span className="text-xs text-amber-400">Ton CO₂eq</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Consumo de la red nacional (SIN)
              </span>
            </div>

            <div className="glass-card p-4 rounded-xl border border-sky-500/30 bg-slate-900/70">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                Alcance 3 (Indirectas)
              </span>
              <div className="text-xl font-black text-white mt-1">
                {(s3Kg / 1000).toFixed(2)} <span className="text-xs text-sky-400">Ton CO₂eq</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Disposición de residuos ordinarios
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Formulario Calculadora con trazabilidad */}
            <div className="lg:col-span-5 glass-card rounded-xl p-5 border border-slate-700/80">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">Registrar Consumo y Calcular Emisiones</h2>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Trazabilidad inmutable: <strong>Consumo × Factor Metodológico = kg CO₂eq</strong>
              </p>

              <form onSubmit={handleAddEmission} className="space-y-3 text-xs">
                {/* Selector de Alcance */}
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Alcance GHG Protocol</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleScopeChange(1)}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        scope === 1
                          ? 'bg-rose-950 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      Alcance 1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScopeChange(2)}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        scope === 2
                          ? 'bg-amber-950 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      Alcance 2
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScopeChange(3)}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        scope === 3
                          ? 'bg-sky-950 border-sky-500 text-sky-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      Alcance 3
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Periodo</label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                    >
                      <option value="2026-Q1">2026 - Trimestre 1 (Ene-Mar)</option>
                      <option value="2026-Q2">2026 - Trimestre 2 (Abr-Jun)</option>
                      <option value="2026-Q3">2026 - Trimestre 3 (Jul-Sep)</option>
                      <option value="2026-Q4">2026 - Trimestre 4 (Oct-Dic)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Sede Asociada</label>
                    <select
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                    >
                      {organization.sites.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Fuente de Emisión</label>
                  <input
                    type="text"
                    required
                    value={sourceCategory}
                    onChange={(e) => setSourceCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Dato de Consumo</label>
                    <input
                      type="number"
                      required
                      min={0.01}
                      step="any"
                      value={consumptionValue}
                      onChange={(e) => setConsumptionValue(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Unidad</label>
                    <input
                      type="text"
                      required
                      value={consumptionUnit}
                      onChange={(e) => setConsumptionUnit(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                    />
                  </div>
                </div>

                {/* Factor de Emisión Oficial Auditable */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-300 uppercase">
                      Factor Oficial Metodológico:
                    </span>
                    <span className="text-[10px] text-slate-400">Administrable</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Factor numérico</span>
                      <input
                        type="number"
                        step="any"
                        value={emissionFactor}
                        onChange={(e) => setEmissionFactor(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Fuente Oficial</span>
                      <input
                        type="text"
                        value={factorSource}
                        onChange={(e) => setFactorSource(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    Resultado previsto: <strong>{(consumptionValue * emissionFactor).toLocaleString()} kg CO₂eq</strong>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Soporte / Factura Adjunta</label>
                  <input
                    type="text"
                    value={evidenceFile}
                    onChange={(e) => setEvidenceFile(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Calcular y Consolidar en Huella
                </button>
              </form>
            </div>

            {/* Listado de Registros con Trazabilidad */}
            <div className="lg:col-span-7 glass-card rounded-xl p-5 border border-slate-700/80">
              <h2 className="text-sm font-bold text-white mb-2">
                Libro Mayor de Emisiones GEI (Trazabilidad Auditable)
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Cada cálculo conserva el valor de consumo, factor de emisión, fuente metodológica y archivo de soporte.
              </p>

              <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
                {ghgRecords.map(record => (
                  <div key={record.id} className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          record.scope === 1 ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          record.scope === 2 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-sky-950 text-sky-300 border border-sky-800'
                        }`}>
                          Alcance {record.scope}
                        </span>
                        <span className="font-bold text-slate-100">{record.sourceCategory}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-black text-emerald-400">
                          {record.totalKgCO2eq.toLocaleString()} kg
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          ({(record.totalKgCO2eq / 1000).toFixed(2)} Ton CO₂eq)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded">
                      <div>
                        <span>Consumo: <strong className="text-slate-200">{record.consumptionValue.toLocaleString()} {record.consumptionUnit}</strong></span>
                      </div>
                      <div>
                        <span>Factor: <strong className="text-slate-200">{record.emissionFactor} {record.factorUnit}</strong></span>
                      </div>
                      <div className="col-span-2 text-[10px] text-slate-400 truncate">
                        Fuente Metodológica: {record.factorSource} ({record.factorYear})
                      </div>
                    </div>

                    {record.evidenceFileName && (
                      <div className="flex items-center justify-between text-[10px] text-cyan-400 pt-1">
                        <span>Evidencia: {record.evidenceFileName}</span>
                        <span className="text-slate-400">{record.siteName} • {record.period}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: GESTIÓN DE RESIDUOS PGIRS */}
      {activeSubTab === 'PGIRS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 glass-card rounded-xl p-5 border border-slate-700/80">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Trash2 className="w-4 h-4 text-emerald-400" />
              Registro de Generación y Pesaje de Residuos
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Control de generación conforme al PGIRS. Enlaza con gestores autorizados y certificados de disposición final.
            </p>

            <form onSubmit={handleAddPgirs} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Nombre del Residuo</label>
                <input
                  type="text"
                  required
                  value={wasteName}
                  onChange={(e) => setWasteName(e.target.value)}
                  placeholder="Ej: Lodos de lavado de vehículos o Chatarra metálica..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Clasificación</label>
                  <select
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="PELIGROSO_RESPEL">Peligroso (RESPEL)</option>
                    <option value="APROVECHABLE">Aprovechable (Reciclaje)</option>
                    <option value="ORGANICO">Orgánico</option>
                    <option value="NO_APROVECHABLE">No Aprovechable</option>
                    <option value="RAEE">RAEE (Electrónicos)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Peso en Kilogramos (kg)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Gestor Autorizado / Receptor</label>
                <input
                  type="text"
                  required
                  value={gestor}
                  onChange={(e) => setGestor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">NIT del Gestor</label>
                  <input
                    type="text"
                    value={gestorNit}
                    onChange={(e) => setGestorNit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">No. Certificado Disposición</label>
                  <input
                    type="text"
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Registrar Pesaje en PGIRS
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 glass-card rounded-xl p-5 border border-slate-700/80">
            <h2 className="text-sm font-bold text-white mb-2">
              Bitácora de Salida de Residuos & Certificaciones
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-semibold">Total Generado</span>
                <span className="text-lg font-bold text-white">{totalWasteKg.toLocaleString()} kg</span>
              </div>
              <div className="bg-rose-950/40 p-3 rounded-lg border border-rose-900/60 text-center">
                <span className="text-[10px] text-rose-300 block font-semibold">RESPEL</span>
                <span className="text-lg font-bold text-rose-400">{respelKg.toLocaleString()} kg</span>
              </div>
              <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-900/60 text-center">
                <span className="text-[10px] text-emerald-300 block font-semibold">Aprovechado</span>
                <span className="text-lg font-bold text-emerald-400">{reciclaKg.toLocaleString()} kg</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {pgirsRecords.map(item => (
                <div key={item.id} className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        item.wasteClassification === 'PELIGROSO_RESPEL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        item.wasteClassification === 'APROVECHABLE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {item.wasteClassification}
                      </span>
                      <span className="font-bold text-white">{item.wasteName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Gestor: <strong className="text-slate-200">{item.authorizedGestor}</strong> (NIT {item.gestorNit})
                    </div>
                    <div className="text-[10px] text-cyan-400 mt-0.5">
                      Certificado: {item.certificateNumber} • {item.disposalType}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-base font-bold text-white">{item.weightKg} kg</span>
                    <span className="text-[10px] text-slate-400 block">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ASPECTOS E IMPACTOS */}
      {activeSubTab === 'ASPECTS' && (
        <div className="glass-card rounded-xl p-5 border border-slate-700/80 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            Matriz de Aspectos e Impactos Ambientales (ISO 14001:2015)
          </h2>
          <p className="text-xs text-slate-400">
            Identificación de aspectos ambientales asociados a las actividades, valoración de significancia y controles operacionales.
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                  SIGNIFICATIVO (ALTO)
                </span>
                <h3 className="font-bold text-white text-xs mt-1">Operaciones de Transporte: Emisión de Gases de Combustión (GEI)</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Aspecto: Consumo de combustible fósil diesel • Impacto: Contribución al calentamiento global y deterioro de calidad del aire.
                </p>
                <div className="text-[11px] text-cyan-300 mt-1">
                  Control: Mantenimiento preventivo bimensual de inyección, conducción eficiente y cálculo de huella de carbono trimestral.
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-300">Vinculado a PGIRS & PESV</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                  MODERADO
                </span>
                <h3 className="font-bold text-white text-xs mt-1">Mantenimiento de Flota: Generación de Aceites Residuales (RESPEL)</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Aspecto: Generación de residuos peligrosos hidrocarburados • Impacto: Riesgo de contaminación de suelo y cuerpos de agua.
                </p>
                <div className="text-[11px] text-cyan-300 mt-1">
                  Control: Almacenamiento en dique de contención secundario y entrega a gestor certificado con manifiesto de carga.
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-300">Vinculado a ACPM-003</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
