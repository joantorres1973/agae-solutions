import React from 'react';
import { Scale } from 'lucide-react';

/** Texto oficial del alcance del software. Edítalo aquí y se actualiza en toda la plataforma. */
export const DISCLAIMER_SHORT =
  'AGAE Integral 360+ es una herramienta de apoyo a la gestión: no reemplaza al profesional responsable ni sustituye su licencia, firma o criterio técnico.';

export const DISCLAIMER_TITLE = 'La plataforma apoya al profesional, no lo reemplaza';

export const DISCLAIMER_FULL = [
  'AGAE Integral 360+ optimiza los procesos de gestión y almacena la información de forma conectada: lo que registras en un módulo alimenta automáticamente los demás (hallazgos, acciones, indicadores, evidencias y reportes). No es un simple repositorio de documentos.',
  'El software no reemplaza al profesional responsable de cada sistema (por ejemplo, el responsable del SG-SST con licencia en Seguridad y Salud en el Trabajo vigente), ni cubre ni sustituye su licencia, firma o criterio técnico. Las decisiones, la firma de documentos y el cumplimiento legal siguen siendo responsabilidad de la organización y de sus profesionales.',
];

type Variant = 'light' | 'dark' | 'compact';

export const ProfessionalDisclaimer: React.FC<{ variant?: Variant; className?: string }> = ({ variant = 'light', className = '' }) => {
  if (variant === 'compact') {
    return (
      <p className={`flex items-start gap-1.5 text-[11px] leading-snug ${className}`}>
        <Scale className="w-3.5 h-3.5 shrink-0 mt-px" />
        <span>{DISCLAIMER_SHORT}</span>
      </p>
    );
  }
  const dark = variant === 'dark';
  return (
    <div
      className={`rounded-xl border px-4 py-3 flex gap-3 ${
        dark ? 'bg-slate-900/70 border-slate-700 text-slate-300' : 'bg-sky-50/70 border-sky-200 text-[#1f3a6e]'
      } ${className}`}
    >
      <Scale className={`w-5 h-5 shrink-0 mt-0.5 ${dark ? 'text-sky-300' : 'text-sky-700'}`} />
      <div className="space-y-1 text-xs leading-relaxed">
        <p className={`font-bold ${dark ? 'text-white' : 'text-[#16245c]'}`}>{DISCLAIMER_TITLE}</p>
        {DISCLAIMER_FULL.map(t => <p key={t}>{t}</p>)}
      </div>
    </div>
  );
};
