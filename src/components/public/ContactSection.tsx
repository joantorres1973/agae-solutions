'use client';

import React, { useRef, useState } from 'react';
import { CheckCircle2, Loader2, Mail, MapPin, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { solutions } from '@/lib/solutions';
import { WhatsAppIcon, WHATSAPP_DISPLAY, whatsappLink } from './whatsapp-shared';

const SALES_EMAIL = 'ventas@agaesolutions.com';
const ENDPOINT = '/contacto.php';

const serviceOptions = [...solutions.map(s => s.title), 'AGAE Integral 360+', 'Otro / Consulta general'];

type Status = 'idle' | 'sending' | 'sent' | 'error';

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-[#16245c] placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100';

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode; className?: string }> = ({
  label, required, children, className = '',
}) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-sm font-medium text-[#16245c]">
      {label} {required && <span className="text-emerald-600">*</span>}
    </span>
    {children}
  </label>
);

export const ContactSection: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  // When the visitor starts filling the form; the server rejects instant (bot) submissions.
  const startedAt = useRef(0);
  const markStart = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus('sending');
    setError('');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, acepta: data.acepta === 'on', t: startedAt.current }),
      });
      // contacto.php always answers JSON; anything else means PHP isn't running (e.g. `next dev`).
      if (!res.headers.get('content-type')?.includes('application/json')) {
        throw new Error(
          process.env.NODE_ENV === 'development'
            ? 'Estás en la versión local: el envío de correos solo funciona en la web publicada en DonWeb, porque necesita PHP.'
            : 'El servicio de envío no respondió correctamente.',
        );
      }
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'No pudimos enviar tu mensaje en este momento.');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'No pudimos enviar tu mensaje en este momento.');
    }
  };

  return (
    <section id="contacto" className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-6">
        {/* Info panel */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0f3b6b] via-[#16788a] to-[#4c9a2a] p-8 sm:p-10 text-white shadow-[0_24px_60px_-24px_rgba(15,59,107,0.6)]">
          <div className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-lime-300/20 blur-3xl" />
          <div className="relative">
            <span className="text-xs font-semibold tracking-[0.3em] text-white/80">CONTACTO</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold leading-tight">Hablemos de tu empresa</h2>
            <p className="mt-4 text-white/85 leading-relaxed">
              Cuéntanos qué necesitas y un asesor de AGAE SOLUTIONS te contactará para acompañarte en la gestión de tus sistemas.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center"><Mail className="w-5 h-5" /></span>
                <span>
                  <span className="block text-xs text-white/70">Escríbenos</span>
                  <span className="font-medium">{SALES_EMAIL}</span>
                </span>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3"
                >
                  <span className="w-11 h-11 rounded-xl bg-[#25d366] flex items-center justify-center shadow-md"><WhatsAppIcon className="w-5 h-5" /></span>
                  <span>
                    <span className="block text-xs text-white/70">WhatsApp · habla con un asesor</span>
                    <span className="font-medium group-hover:underline">{WHATSAPP_DISPLAY}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center"><MapPin className="w-5 h-5" /></span>
                <span>
                  <span className="block text-xs text-white/70">Ubicación</span>
                  <span className="font-medium">Bogotá D.C., Colombia</span>
                </span>
              </li>
            </ul>

            <div className="mt-8 rounded-2xl bg-white/10 border border-white/15 p-4 flex gap-3 text-sm text-white/90">
              <Sparkles className="w-5 h-5 shrink-0 text-lime-200" />
              <span>¿Aún no sabes qué necesitas? Haz la caracterización gratuita y recibe una recomendación a la medida.</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_14px_50px_-20px_rgba(15,40,90,0.3)] p-6 sm:p-10">
          {status === 'sent' ? (
            <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-center">
              <span className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-11 h-11" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-[#16245c]">¡Mensaje enviado!</h3>
              <p className="mt-2 text-[#33435c] max-w-sm">
                Gracias por escribirnos. Un asesor de AGAE SOLUTIONS se pondrá en contacto contigo muy pronto.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 px-6 py-3 rounded-full border-2 border-[#0f3b5f] text-[#0f3b5f] font-semibold hover:bg-slate-50"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} onFocus={markStart} className="grid sm:grid-cols-2 gap-x-4 gap-y-5">
              <div className="sm:col-span-2">
                <h3 className="font-display text-2xl font-semibold text-[#16245c]">Solicita información</h3>
                <p className="mt-1 text-sm text-slate-500">Los campos marcados con * son obligatorios.</p>
              </div>

              <Field label="Nombre completo" required>
                <input name="nombre" required maxLength={120} autoComplete="name" className={inputCls} placeholder="Tu nombre" />
              </Field>
              <Field label="Empresa">
                <input name="empresa" maxLength={160} autoComplete="organization" className={inputCls} placeholder="Nombre de la empresa" />
              </Field>
              <Field label="Correo electrónico" required>
                <input name="correo" type="email" required maxLength={160} autoComplete="email" className={inputCls} placeholder="tucorreo@empresa.com" />
              </Field>
              <Field label="Teléfono / WhatsApp">
                <input name="telefono" type="tel" maxLength={40} autoComplete="tel" className={inputCls} placeholder="+57 300 000 0000" />
              </Field>
              <Field label="Ciudad">
                <input name="ciudad" maxLength={80} autoComplete="address-level2" className={inputCls} placeholder="Bogotá" />
              </Field>
              <Field label="Servicio de interés">
                <select name="servicio" defaultValue="" className={inputCls}>
                  <option value="" disabled>Selecciona una opción</option>
                  {serviceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </Field>
              <Field label="¿En qué podemos ayudarte?" required className="sm:col-span-2">
                <textarea
                  name="mensaje"
                  required
                  maxLength={4000}
                  rows={4}
                  className={`${inputCls} resize-y`}
                  placeholder="Cuéntanos sobre tu empresa y lo que necesitas"
                />
              </Field>

              {/* Honeypot: hidden from people, bots fill it in */}
              <input name="sitio_web" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              <label className="sm:col-span-2 flex items-start gap-3 text-sm text-[#33435c]">
                <input name="acepta" type="checkbox" required className="mt-0.5 w-4 h-4 accent-emerald-600" />
                <span>
                  Autorizo a AGAE SOLUTIONS S.A.S. el tratamiento de mis datos personales para atender mi solicitud, de acuerdo con la Ley 1581 de 2012. <span className="text-emerald-600">*</span>
                </span>
              </label>

              {status === 'error' && (
                <p className="sm:col-span-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                  {error} También puedes escribirnos directamente a <strong>{SALES_EMAIL}</strong>.
                </p>
              )}

              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Tus datos están protegidos.
                </span>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#7cb342] to-[#4caf50] hover:from-[#72a83a] hover:to-[#43a047] text-white font-semibold shadow-lg shadow-lime-600/25 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {status === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
