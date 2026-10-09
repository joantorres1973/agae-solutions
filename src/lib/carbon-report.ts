import type { GhgEmissionRecord, Organization } from '@/types';

/**
 * Informe PDF del inventario de emisiones de GEI (huella de carbono).
 * Se genera en el navegador con jsPDF; las librerías se cargan solo al descargar.
 */

const SCOPE_INFO: Record<1 | 2 | 3, { name: string; description: string; color: [number, number, number] }> = {
  1: { name: 'Alcance 1', description: 'Emisiones directas: combustibles en fuentes propias (vehículos, plantas, calderas).', color: [14, 124, 143] },
  2: { name: 'Alcance 2', description: 'Emisiones indirectas por consumo de energía eléctrica comprada.', color: [76, 154, 42] },
  3: { name: 'Alcance 3', description: 'Otras emisiones indirectas de la cadena de valor (residuos, viajes, transporte contratado).', color: [224, 97, 42] },
};

const NAVY: [number, number, number] = [22, 36, 92];
const GRAY: [number, number, number] = [90, 100, 120];

const fmt = (n: number, decimals = 2) => n.toLocaleString('es-CO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

async function loadImage(src: string): Promise<{ data: string; ratio: number } | null> {
  try {
    const blob = await (await fetch(src)).blob();
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    // Downscale so the PDF stays light (the source logo is large).
    return await new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height || 1;
        const canvas = document.createElement('canvas');
        canvas.height = 120;
        canvas.width = Math.round(120 * ratio);
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({ data: canvas.toDataURL('image/png'), ratio });
      };
      img.onerror = () => resolve(null);
      img.src = data;
    });
  } catch {
    return null;
  }
}

export async function downloadCarbonReport(records: GhgEmissionRecord[], organization: Organization, periodLabel: string) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  const lastY = () => (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  // --- Header ---
  const logo = await loadImage('/logo-agae-light.png');
  if (logo) doc.addImage(logo.data, 'PNG', margin, 12, 16 * logo.ratio, 16);
  doc.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...GRAY);
  doc.text('AGAE Integral 360+', pageW - margin, 16, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, pageW - margin, 21, { align: 'right' });

  doc.setDrawColor(14, 124, 143).setLineWidth(0.8).line(margin, 32, pageW - margin, 32);
  doc.setFont('helvetica', 'bold').setFontSize(17).setTextColor(...NAVY);
  doc.text('Informe de Huella de Carbono', margin, 42);
  doc.setFont('helvetica', 'normal').setFontSize(10.5).setTextColor(...GRAY);
  doc.text('Inventario de emisiones de gases de efecto invernadero (GEI)', margin, 48);

  doc.setFontSize(10).setTextColor(40, 40, 40);
  doc.text(`Organización: ${organization.name}`, margin, 58);
  doc.text(`NIT: ${organization.nit}`, margin, 64);
  doc.text(`Periodo reportado: ${periodLabel}`, margin, 70);
  doc.text(`Registros de actividad: ${records.length}`, margin, 76);

  // --- Summary ---
  const total = records.reduce((a, r) => a + r.totalKgCO2eq, 0);
  const byScope = ([1, 2, 3] as const).map(scope => {
    const kg = records.filter(r => r.scope === scope).reduce((a, r) => a + r.totalKgCO2eq, 0);
    return { scope, kg, pct: total > 0 ? (kg / total) * 100 : 0 };
  });

  doc.setFillColor(236, 248, 241).roundedRect(margin, 82, pageW - margin * 2, 22, 3, 3, 'F');
  doc.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...GRAY);
  doc.text('EMISIONES TOTALES', margin + 5, 89);
  doc.setFontSize(18).setTextColor(...NAVY);
  doc.text(`${fmt(total / 1000)} t CO2e`, margin + 5, 99);
  doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...GRAY);
  doc.text(`(${fmt(total, 0)} kg CO2e)`, margin + 62, 99);

  autoTable(doc, {
    startY: 110,
    margin: { left: margin, right: margin },
    head: [['Alcance', 'Descripción', 't CO2e', '% del total']],
    body: byScope.map(s => [SCOPE_INFO[s.scope].name, SCOPE_INFO[s.scope].description, fmt(s.kg / 1000), `${fmt(s.pct, 1)} %`]),
    foot: [['Total', '', fmt(total / 1000), total > 0 ? '100,0 %' : '0,0 %']],
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 2.2 },
    headStyles: { fillColor: NAVY, textColor: 255 },
    footStyles: { fillColor: [236, 248, 241], textColor: NAVY, fontStyle: 'bold' },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 24 }, 2: { halign: 'right', cellWidth: 24 }, 3: { halign: 'right', cellWidth: 24 } },
    didParseCell: data => {
      if (data.section === 'body' && data.column.index === 0) data.cell.styles.textColor = SCOPE_INFO[(data.row.index + 1) as 1 | 2 | 3].color;
    },
  });

  // --- Emissions by site ---
  const sites = new Map<string, number>();
  records.forEach(r => sites.set(r.siteName, (sites.get(r.siteName) ?? 0) + r.totalKgCO2eq));
  doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(...NAVY);
  doc.text('Emisiones por sede', margin, lastY() + 10);
  autoTable(doc, {
    startY: lastY() + 13,
    margin: { left: margin, right: margin },
    head: [['Sede', 't CO2e', '% del total']],
    body: [...sites.entries()].sort((a, b) => b[1] - a[1]).map(([site, kg]) => [site, fmt(kg / 1000), `${fmt(total > 0 ? (kg / total) * 100 : 0, 1)} %`]),
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 2.2 },
    headStyles: { fillColor: NAVY, textColor: 255 },
    columnStyles: { 1: { halign: 'right', cellWidth: 28 }, 2: { halign: 'right', cellWidth: 28 } },
  });

  // --- Detail ---
  doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(...NAVY);
  doc.text('Detalle de fuentes de emisión', margin, lastY() + 10);
  autoTable(doc, {
    startY: lastY() + 13,
    margin: { left: margin, right: margin },
    head: [['Alc.', 'Periodo', 'Sede / Proceso', 'Fuente', 'Dato de actividad', 'Factor de emisión', 'kg CO2e']],
    body: [...records]
      .sort((a, b) => a.scope - b.scope || a.period.localeCompare(b.period))
      .map(r => [
        String(r.scope),
        r.period,
        `${r.siteName}\n${r.processName}`,
        r.sourceCategory,
        `${fmt(r.consumptionValue)} ${r.consumptionUnit}`,
        `${fmt(r.emissionFactor, 4)} ${r.factorUnit}\n${r.factorSource} (${r.factorYear})`,
        fmt(r.totalKgCO2eq),
      ]),
    theme: 'striped',
    styles: { fontSize: 7.2, cellPadding: 1.8, valign: 'middle' },
    headStyles: { fillColor: NAVY, textColor: 255 },
    columnStyles: { 0: { halign: 'center', cellWidth: 9 }, 1: { cellWidth: 16 }, 6: { halign: 'right', cellWidth: 20, fontStyle: 'bold' } },
  });

  // --- Methodology ---
  let y = lastY() + 10;
  if (y > doc.internal.pageSize.getHeight() - 50) {
    doc.addPage();
    y = 20;
  }
  doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(...NAVY);
  doc.text('Metodología', margin, y);
  doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(60, 60, 60);
  const methodology = [
    'Las emisiones se calculan como: dato de actividad × factor de emisión, expresadas en kilogramos de CO2 equivalente (kg CO2e).',
    'El inventario sigue el enfoque del GHG Protocol (Estándar Corporativo) y la norma ISO 14064-1:2018, clasificando las emisiones en los alcances 1, 2 y 3.',
    'Los factores de emisión corresponden a la fuente indicada en cada registro (p. ej. FECOC / UPME para Colombia).',
    'Este informe es un reporte de cálculo generado a partir de la información registrada por la organización en la plataforma; no constituye una verificación de tercera parte.',
  ];
  doc.text(methodology.map(t => `• ${t}`), margin, y + 6, { maxWidth: pageW - margin * 2, lineHeightFactor: 1.45 });

  // --- Footer on every page ---
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal').setFontSize(7.5).setTextColor(...GRAY);
    const h = doc.internal.pageSize.getHeight();
    doc.text(`AGAE SOLUTIONS S.A.S. · ${organization.name}`, margin, h - 8);
    doc.text(`Página ${i} de ${pages}`, pageW - margin, h - 8, { align: 'right' });
  }

  const safeName = organization.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  doc.save(`Huella-de-Carbono_${safeName}_${periodLabel.replace(/\s+/g, '-')}.pdf`);
}
