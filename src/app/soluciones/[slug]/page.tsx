import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSolution, solutions } from '@/lib/solutions';
import { SolutionPage } from '@/components/public/SolutionPage';

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const solution = getSolution((await params).slug);
  if (!solution) return {};
  return {
    title: `${solution.title} — AGAE SOLUTIONS`,
    description: solution.intro,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const solution = getSolution((await params).slug);
  if (!solution) notFound();
  return <SolutionPage solution={solution} />;
}
