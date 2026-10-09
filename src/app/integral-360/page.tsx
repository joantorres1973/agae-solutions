import type { Metadata } from 'next';
import { IntegralPage } from '@/components/public/IntegralPage';

export const metadata: Metadata = {
  title: 'AGAE Integral 360+ — La nueva forma de gestionar tus sistemas',
  description:
    'Plataforma integral que conecta SST, Ambiental, Vial, Auditorías y Sistemas ISO en un solo lugar, con tecnología e inteligencia artificial como aliado de la gestión.',
};

export default function Page() {
  return <IntegralPage />;
}
