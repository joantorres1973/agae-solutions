'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { WhatsAppIcon, WHATSAPP_DISPLAY, whatsappLink } from './whatsapp-shared';

export { WhatsAppIcon, WHATSAPP_DISPLAY, whatsappLink };

/** Floating WhatsApp button with a small "talk to an advisor" card. */
export const WhatsAppButton: React.FC<{ message?: string }> = ({ message }) => {
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // A short invitation bubble appears once after a few seconds.
  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed z-[90] right-4 sm:right-6 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 flex flex-col items-end gap-3 font-sans">
      {open && (
        <div className="w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/25 border border-slate-100 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="relative bg-gradient-to-r from-[#075e54] to-[#128c7e] px-4 py-4 text-white">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/15"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <span className="relative shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/integral-360/agae-mark.webp" alt="AGAE" className="w-full h-auto" />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25d366] ring-2 ring-[#0b6b5e]" />
              </span>
              <div>
                <p className="font-bold leading-tight">AGAE SOLUTIONS</p>
                <p className="text-xs text-white/85">Asesoría en SST, Ambiental, Vial e ISO</p>
              </div>
            </div>
          </div>

          <div className="bg-[#efeae2] px-4 py-4">
            <div className="relative max-w-[90%] rounded-xl rounded-tl-none bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
              ¡Hola! 👋 Soy tu asesor de AGAE SOLUTIONS. ¿En qué te podemos ayudar con la gestión de tu empresa?
            </div>
          </div>

          <div className="px-4 py-3">
            <a
              href={whatsappLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#25d366] hover:bg-[#1ebe5b] text-white font-semibold shadow-md transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Iniciar conversación
            </a>
            <p className="mt-2 text-center text-[11px] text-slate-500">{WHATSAPP_DISPLAY} · Respuesta en horario laboral</p>
          </div>
        </div>
      )}

      {!open && showHint && (
        <button
          onClick={() => setOpen(true)}
          className="hidden sm:flex items-center gap-2 rounded-full bg-white pl-4 pr-3 py-2 text-sm font-medium text-[#16245c] shadow-lg shadow-slate-900/15 border border-slate-100 animate-in fade-in slide-in-from-right-2"
        >
          ¿Hablamos? Escríbele a un asesor
          <span
            role="button"
            aria-label="Ocultar"
            onClick={(e) => {
              e.stopPropagation();
              setShowHint(false);
            }}
            className="p-0.5 rounded-full text-slate-400 hover:bg-slate-100"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        </button>
      )}

      <button
        onClick={() => setOpen(v => !v)}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25d366] hover:bg-[#1ebe5b] text-white shadow-xl shadow-green-900/30 flex items-center justify-center transition-transform hover:scale-105"
        aria-label={open ? 'Cerrar chat de WhatsApp' : 'Hablar con un asesor por WhatsApp'}
      >
        {!open && <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-25" />}
        {open ? <X className="relative w-7 h-7" /> : <WhatsAppIcon className="relative w-8 h-8 sm:w-9 sm:h-9" />}
      </button>
    </div>
  );
};
