'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { MasterWorker } from '@/types/worker';
import { Search, User, Check, X, Shield, AlertTriangle } from 'lucide-react';

interface WorkerSelectorProps {
  value?: string; // workerId
  onChange: (worker: MasterWorker | null) => void;
  placeholder?: string;
  filterStatus?: 'ACTIVO' | 'ALL';
  disabled?: boolean;
  className?: string;
  showDetailsBadge?: boolean;
}

export const WorkerSelector: React.FC<WorkerSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Buscar trabajador por nombre o cédula...',
  filterStatus = 'ACTIVO',
  disabled = false,
  className = '',
  showDetailsBadge = true
}) => {
  const { workers } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedWorker = useMemo(() => {
    if (!value) return null;
    return workers.find(w => w.id === value) || null;
  }, [value, workers]);

  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      if (filterStatus === 'ACTIVO' && w.status !== 'ACTIVO') return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      const fullName = `${w.firstName} ${w.lastName}`.toLowerCase();
      const doc = w.docNumber.toLowerCase();
      const pos = w.position.toLowerCase();
      const area = w.area.toLowerCase();
      return fullName.includes(q) || doc.includes(q) || pos.includes(q) || area.includes(q);
    });
  }, [workers, filterStatus, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {selectedWorker ? (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-emerald-500/40 text-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            {selectedWorker.photoUrl ? (
              <img
                src={selectedWorker.photoUrl}
                alt={selectedWorker.firstName}
                className="w-8 h-8 rounded-full object-cover border border-emerald-500/50 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300 shrink-0">
                {selectedWorker.firstName[0]}
                {selectedWorker.lastName[0]}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate flex items-center gap-2">
                <span>{selectedWorker.firstName} {selectedWorker.lastName}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedWorker.docType} {selectedWorker.docNumber}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {selectedWorker.position} • {selectedWorker.area}
              </div>
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setQuery('');
              }}
              className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors ml-2"
              title="Cambiar trabajador"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div>
          <div
            onClick={() => !disabled && setIsOpen(true)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 border ${
              isOpen ? 'border-emerald-500 ring-1 ring-emerald-500/40' : 'border-slate-700'
            } text-xs text-slate-400 cursor-pointer transition-all ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 text-slate-400">
              <Search className="w-4 h-4 text-slate-500" />
              <span>{placeholder}</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-800/40 font-semibold">
              Base Maestra ({workers.filter(w => w.status === 'ACTIVO').length})
            </span>
          </div>

          {isOpen && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden max-h-64 flex flex-col backdrop-blur-md">
              <div className="p-2 border-b border-slate-800">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Escribe nombre, cédula o cargo..."
                    autoFocus
                    className="w-full pl-8 pr-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="overflow-y-auto flex-1 divide-y divide-slate-800/60">
                {filteredWorkers.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No se encontraron trabajadores con ese criterio en la Base Maestra.
                  </div>
                ) : (
                  filteredWorkers.map(w => (
                    <button
                      type="button"
                      key={w.id}
                      onClick={() => {
                        onChange(w);
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className="w-full text-left p-2.5 hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {w.photoUrl ? (
                          <img
                            src={w.photoUrl}
                            alt={w.firstName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-300 shrink-0">
                            {w.firstName[0]}
                            {w.lastName[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-white group-hover:text-emerald-300 truncate">
                            {w.firstName} {w.lastName}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {w.docType} {w.docNumber} • {w.position}
                          </div>
                        </div>
                      </div>

                      {showDetailsBadge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-emerald-950 group-hover:text-emerald-300 border border-slate-700 shrink-0 ml-2">
                          {w.siteName.split(' ')[0]}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
