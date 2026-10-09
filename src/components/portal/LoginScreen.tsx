'use client';

import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, LogIn, PlayCircle, ShieldCheck, User, KeyRound } from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS, DEMO_ACTION_LIMIT } from '@/lib/auth';
import { ProfessionalDisclaimer } from '@/components/public/ProfessionalDisclaimer';

export const LoginScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { login } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [showClave, setShowClave] = useState(false);
  const [loading, setLoading] = useState<'cliente' | 'demo' | null>(null);
  const [error, setError] = useState('');

  const submit = async (u: string, c: string, kind: 'cliente' | 'demo') => {
    setLoading(kind);
    setError('');
    try {
      await login(u, c);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos iniciar sesión.');
      setLoading(null);
    }
  };

  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3.5 text-[15px] text-[#16245c] placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100';

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#04182b] via-[#082c4a] to-[#0b3d5c] p-12 text-white">
        <div className="pointer-events-none absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative">
          <div className="inline-flex rounded-2xl bg-white px-5 py-3 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/integral-360/agae-mark.webp" alt="AGAE" className="h-12 w-auto" />
          </div>
          <p className="mt-5 font-display text-4xl font-bold tracking-[0.12em]">
            INTEGRAL 360<span className="text-[#a3e635]">+</span>
          </p>
          <p className="mt-3 text-lg text-slate-300 max-w-md">La nueva forma de gestionar tus sistemas.</p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/integral-360/plataforma.webp" alt="" className="relative w-full max-w-xl mx-auto drop-shadow-2xl" />

        <p className="relative text-sm text-slate-400">
          SST · Ambiental · Seguridad Vial · Auditorías · Sistemas ISO — en un solo lugar.
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col px-6 sm:px-12 py-8">
        <button onClick={onBack} className="self-start flex items-center gap-2 text-sm text-slate-500 hover:text-[#16245c]">
          <ArrowLeft className="w-4 h-4" /> Volver a la página web
        </button>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md py-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-agae-light.png" alt="AGAE SOLUTIONS" className="lg:hidden h-14 w-auto mb-6" />
            <span className="text-xs font-semibold tracking-[0.3em] text-[#0e7c8f]">PORTAL CLIENTES</span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#16245c]">Bienvenido de nuevo</h1>
            <p className="mt-2 text-[#33435c]">Ingresa con el usuario y la contraseña que te entregó AGAE SOLUTIONS.</p>

            {/* Credenciales de Acceso Rápidas */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>Credenciales del Portal Clientes:</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Acceso Total
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setUsuario('cliente');
                    setClave('cliente360');
                  }}
                  className="p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-left transition-colors cursor-pointer group shadow-2xs"
                >
                  <div className="text-[10px] text-slate-500 font-medium group-hover:text-blue-600">👤 Perfil Cliente:</div>
                  <div className="font-mono text-slate-800 text-[11px] mt-0.5">
                    <span className="font-bold">cliente</span> / <span className="text-blue-600 font-semibold">cliente360</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUsuario('agae');
                    setClave('agae360');
                  }}
                  className="p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-left transition-colors cursor-pointer group shadow-2xs"
                >
                  <div className="text-[10px] text-slate-500 font-medium group-hover:text-blue-600">🛡️ Perfil Admin:</div>
                  <div className="font-mono text-slate-800 text-[11px] mt-0.5">
                    <span className="font-bold">agae</span> / <span className="text-blue-600 font-semibold">agae360</span>
                  </div>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                * Haz clic en cualquiera de las cajas para autorrellenar los datos de acceso.
              </p>
            </div>

            <form
              className="mt-6 space-y-4"
              onSubmit={e => {
                e.preventDefault();
                submit(usuario, clave, 'cliente');
              }}
            >
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#16245c]">Usuario</span>
                <span className="relative block">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={usuario}
                    onChange={e => setUsuario(e.target.value)}
                    required
                    autoComplete="username"
                    autoCapitalize="none"
                    className={inputCls}
                    placeholder="Tu usuario"
                  />
                </span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#16245c]">Contraseña</span>
                <span className="relative block">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showClave ? 'text' : 'password'}
                    value={clave}
                    onChange={e => setClave(e.target.value)}
                    required
                    autoComplete="current-password"
                    className={`${inputCls} pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowClave(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#16245c]"
                    aria-label={showClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showClave ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </span>
              </label>

              {error && (
                <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading !== null}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-[#0f3b5f] hover:bg-[#0c3150] text-white font-semibold shadow-lg shadow-[#0f3b5f]/25 transition-all disabled:opacity-70"
              >
                {loading === 'cliente' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                Ingresar
              </button>
            </form>

            <div className="my-7 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex-1 h-px bg-slate-200" /> ¿Aún no eres cliente? <span className="flex-1 h-px bg-slate-200" />
            </div>

            <button
              onClick={() => submit(DEMO_CREDENTIALS.usuario, DEMO_CREDENTIALS.clave, 'demo')}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-[#22d3ee] via-[#2dd4bf] to-[#a3e635] text-[#062033] font-bold shadow-[0_10px_30px_-10px_rgba(34,211,238,0.7)] transition-all hover:-translate-y-0.5 disabled:opacity-70"
            >
              {loading === 'demo' ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
              Explorar con el usuario demo
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">
              El demo incluye algunos módulos y {DEMO_ACTION_LIMIT} acciones de prueba.
            </p>

            <p className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Acceso exclusivo para clientes activos de AGAE SOLUTIONS
            </p>
            <ProfessionalDisclaimer variant="compact" className="mt-3 text-slate-400 justify-center text-center" />
          </div>
        </div>
      </div>
    </div>
  );
};
