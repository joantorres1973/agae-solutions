'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  X,
  Mail,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Lock,
  ArrowRight,
  Sparkles,
  Printer,
  Download,
  Building,
  Layers,
  KeyRound,
  UserCheck,
  CheckCircle2,
  Calendar,
  Zap
} from 'lucide-react';

export const WelcomeEmailModal: React.FC = () => {
  const {
    isEmailModalOpen,
    setIsEmailModalOpen,
    lastActivationEmail,
    applyCharacterizationToPlatform,
    setPortalView,
    characterization,
    showNotification
  } = useApp();

  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isEmailModalOpen || !lastActivationEmail) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showNotification(`Copiado al portapapeles: ${text}`, 'info');
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleEnterPlatform = () => {
    // 1. Configurar la plataforma con los módulos contratados y variables de la caracterización
    applyCharacterizationToPlatform(lastActivationEmail.activeModules);
    
    // 2. Cerrar el modal del correo
    setIsEmailModalOpen(false);

    // 3. Cambiar la vista del portal a la suite de trabajo interna
    setPortalView('app');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-white backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-50 border border-emerald-200 rounded-2xl shadow-2xl shadow-slate-900/5 flex flex-col max-h-[94vh] overflow-hidden my-auto">
        {/* Email Client Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-emerald-200 bg-white text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                Bandeja de Entrada Corporativa (Simulación en Vivo)
              </span>
              <span className="text-[10px] text-slate-500">
                Mensaje recibido de activaciones@agaesolutions.com
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px] px-2.5"
              title="Imprimir comprobante y credenciales"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              onClick={() => setIsEmailModalOpen(false)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Email Metadata Envelope Header */}
        <div className="px-6 py-4 bg-white/80 border-b border-emerald-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>[AGAE SOLUTIONS] Activación Exitosa de tu Plataforma - Credenciales Oficiales</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Entrega Inmediata
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
            <div>
              <span className="text-slate-500 font-medium">De: </span>
              <span className="text-slate-700 font-semibold">AGAE Cloud Infrastructure &lt;activaciones@agaesolutions.com&gt;</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Para: </span>
              <span className="text-emerald-700 font-semibold">{lastActivationEmail.contactName} &lt;{lastActivationEmail.email}&gt;</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Organización: </span>
              <span className="text-slate-700">{lastActivationEmail.companyName} (NIT: {lastActivationEmail.nit})</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Fecha: </span>
              <span className="text-slate-700">{new Date(lastActivationEmail.sentAt).toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>

        {/* Email Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs text-slate-700 bg-slate-50 leading-relaxed">
          {/* Email Branded Header */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-white via-white to-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 tracking-tight">AGAE SOLUTIONS</span>
                <span className="text-[10px] text-emerald-700 block font-bold uppercase tracking-wider">
                  Enterprise Cloud Onboarding System
                </span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {lastActivationEmail.planName}
              </span>
            </div>
          </div>

          {/* Letter text */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">
              Estimado(a) <span className="text-emerald-700 font-bold">{lastActivationEmail.contactName}</span>,
            </p>
            <p>
              ¡Felicitaciones! Tu suscripción a <strong className="text-slate-900">AGAE SOLUTIONS</strong> ha sido procesada exitosamente. Gracias a la información proporcionada en la <strong className="text-emerald-700">Caracterización Inteligente</strong>, tu plataforma ha sido desplegada en un entorno privado de nube y configurada automáticamente a la medida de tu organización.
            </p>
            <p>
              Todos los parámetros de <span className="text-slate-800 font-medium">sedes ({characterization.sites.length}), trabajadores ({characterization.size.totalTrabajadores}), estándares SST ({characterization.calculatedSstStandards})</span> y requerimientos sectoriales ya se encuentran integrados. No tendrás que volver a diligenciar ningún dato.
            </p>
          </div>

          {/* Access Credentials Box */}
          <div className="p-5 rounded-2xl bg-white border-2 border-emerald-200 shadow-xl shadow-slate-900/5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                  Credenciales Oficiales de Acceso
                </h4>
              </div>
              <span className="text-[10px] text-amber-700 font-semibold">
                🔒 Confidencial & Personal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* URL de Acceso */}
              <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">URL de Tu Entorno Cloud Exclusivo</span>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleEnterPlatform(); }}
                    className="text-emerald-700 font-mono font-bold text-xs hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <span>{lastActivationEmail.assignedSubdomain}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(lastActivationEmail.assignedSubdomain, 'url')}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] flex items-center gap-1"
                >
                  {copiedField === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'url' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              {/* Usuario */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">Usuario Administrador HSEQ</span>
                  <span className="text-slate-900 font-mono font-bold text-xs mt-0.5 block">
                    {lastActivationEmail.accessUsername}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(lastActivationEmail.accessUsername, 'user')}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] flex items-center gap-1"
                >
                  {copiedField === 'user' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'user' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              {/* Contraseña Temporal */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">Contraseña Temporal de Acceso</span>
                  <span className="text-emerald-700 font-mono font-bold text-xs mt-0.5 block">
                    {lastActivationEmail.temporaryPassword}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(lastActivationEmail.temporaryPassword, 'pass')}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] flex items-center gap-1"
                >
                  {copiedField === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'pass' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              {/* Token de Activación */}
              <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="text-slate-500 text-[10px] block">Token Criptográfico de Licencia:</span>
                    <span className="font-mono text-slate-700 font-semibold">{lastActivationEmail.activationToken}</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ACTIVA
                </span>
              </div>
            </div>
          </div>

          {/* Autoconfigured Modules Summary */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-xs block">
              Módulos Habilitados y Autoconfigurados en tu Tenant:
            </span>
            <div className="flex flex-wrap gap-2">
              {lastActivationEmail.activeModules.map(mod => (
                <span
                  key={mod}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>{mod}</span>
                </span>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              La matriz legal, el centro de tareas pendientes y los controles operacionales ya están cargados para tus sedes.
            </p>
          </div>

          {/* Big Direct Entrance CTA */}
          <div className="pt-2">
            <button
              onClick={handleEnterPlatform}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/40 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>Ingresar a la Plataforma AGAE Ahora Mismo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-2">
              Al hacer clic ingresarás directamente a tu entorno de trabajo completamente configurado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
