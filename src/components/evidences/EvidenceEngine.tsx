'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  FileCheck2,
  UploadCloud,
  Search,
  Filter,
  FileText,
  Image,
  Award,
  Link2,
  Plus,
  Eye,
  Download,
  Calendar,
  User
} from 'lucide-react';
import { Evidence } from '@/types';

export const EvidenceEngine: React.FC = () => {
  const { evidences, addEvidence, showNotification } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New evidence form
  const [eTitle, setETitle] = useState('');
  const [eType, setEType] = useState<Evidence['fileType']>('IMAGE');
  const [eFileName, setEFileName] = useState('');
  const [eTags, setETags] = useState('');

  const filtered = evidences.filter(e => {
    if (filterType !== 'ALL' && e.fileType !== filterType) return false;
    if (searchTerm && !e.title.toLowerCase().includes(searchTerm.toLowerCase()) && !e.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eTitle || !eFileName) return;

    addEvidence({
      title: eTitle,
      fileType: eType,
      fileName: eFileName,
      fileSize: '1.8 MB',
      uploadedBy: 'Usuario Autorizado',
      url: '#',
      tags: eTags ? eTags.split(',').map(t => t.trim().toUpperCase()) : ['GENERAL']
    });

    setShowUploadModal(false);
    setETitle('');
    setEFileName('');
    setETags('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card p-4 rounded-xl border border-slate-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Motor Central de Evidencias Polimórfico
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Principio: <strong>Carga única, uso múltiple</strong>. Un archivo (foto, acta, certificado) se almacena una sola vez y se vincula simultáneamente a inspecciones, ACPM, auditorías y requisitos legales sin duplicar espacio.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all shrink-0"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          + Cargar Evidencia
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por título, tag o nombre de archivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1 text-xs"
          >
            <option value="ALL">Todos los Tipos</option>
            <option value="IMAGE">Fotografías</option>
            <option value="DOCUMENT">Documentos / Actas</option>
            <option value="CERTIFICATE">Certificados / Manifiestos</option>
          </select>
        </div>
      </div>

      {/* Evidences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(evidence => (
          <div key={evidence.id} className="glass-card rounded-xl p-4 border border-slate-300 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {evidence.fileType === 'IMAGE' ? <Image className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                  {evidence.fileType}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{evidence.fileSize}</span>
              </div>

              <h2 className="text-xs font-bold text-slate-800 line-clamp-2 mb-1">{evidence.title}</h2>
              <p className="text-[11px] text-slate-500 font-mono truncate">{evidence.fileName}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {evidence.tags.map(tag => (
                  <span key={tag} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-300 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
              <div>
                <span>{evidence.uploadedBy.split(' ')[0]}</span>
                <span className="block text-slate-500">{evidence.uploadedAt}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                <Link2 className="w-3 h-3" />
                <span>{evidence.linkedEntityCount} Vínculos Activos</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpload} className="bg-slate-50 border border-slate-300 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Cargar Nueva Evidencia Central</h2>
              <button type="button" onClick={() => setShowUploadModal(false)} className="text-slate-500 hover:text-slate-900">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Título Descriptivo *</label>
                <input
                  type="text"
                  required
                  value={eTitle}
                  onChange={(e) => setETitle(e.target.value)}
                  placeholder="Ej: Registro Fotográfico Cierre Extintor Bahía 2..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tipo de Archivo</label>
                  <select
                    value={eType}
                    onChange={(e) => setEType(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                  >
                    <option value="IMAGE">Fotografía (JPG / PNG)</option>
                    <option value="DOCUMENT">Documento / Acta (PDF)</option>
                    <option value="CERTIFICATE">Certificado Oficial (PDF)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nombre de Archivo *</label>
                  <input
                    type="text"
                    required
                    value={eFileName}
                    onChange={(e) => setEFileName(e.target.value)}
                    placeholder="Ej: evidencia_marzo_2026.pdf"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Etiquetas (Separadas por coma)</label>
                <input
                  type="text"
                  value={eTags}
                  onChange={(e) => setETags(e.target.value)}
                  placeholder="Ej: SST, INSPECCION, EXTINTORES, BAHIA2"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Guardar en Repositorio
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
