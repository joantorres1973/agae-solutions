import React from 'react';
import { ProfessionalDisclaimer } from './ProfessionalDisclaimer';
import { WhatsAppButton } from './WhatsAppButton';
import { WhatsAppIcon, WHATSAPP_DISPLAY, whatsappLink } from './whatsapp-shared';

export const PublicFooter: React.FC = () => (
  <>
  <footer className="mt-auto relative border-t border-emerald-100 bg-white/80 backdrop-blur px-4 lg:px-8 py-8 text-xs text-slate-500">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-agae-light.png" alt="AGAE SOLUTIONS" className="h-8 w-auto shrink-0" />
        <span className="font-bold text-slate-800">AGAE SOLUTIONS S.A.S.</span>
        <span>• Soluciones Inteligentes en Seguridad, Ambiente y Calidad</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
        <span>Bogotá D.C., Colombia</span>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-[#128c7e] hover:underline">
          <WhatsAppIcon className="w-3.5 h-3.5" /> {WHATSAPP_DISPLAY}
        </a>
        <span>contacto@agaesolutions.com</span>
        <span>Normativa Dec. 1072 / Res. 0312 / Res. 40595</span>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-5 pt-4 border-t border-emerald-100 text-slate-500 flex justify-center text-center">
      <ProfessionalDisclaimer variant="compact" className="max-w-3xl" />
    </div>
  </footer>

  {/* Floating WhatsApp button (all public pages). Kept outside the footer: its backdrop blur would trap position:fixed. */}
  <WhatsAppButton />
  </>
);
