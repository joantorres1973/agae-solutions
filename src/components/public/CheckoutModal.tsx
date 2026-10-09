'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { DISCLAIMER_SHORT } from './ProfessionalDisclaimer';
import { chargeableModules, HUELLA_CARBONO_PRECIO_MES, huellaCarbonoEnPlan } from '@/lib/plan-rules';
import { ModuleType } from '@/types';
import { ActivationEmailData } from '@/types/characterization';
import {
  X,
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  Check
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    characterization,
    applicabilityProfile,
    sendActivationEmail
  } = useApp();

  const [billingCycle, setBillingCycle] = useState<'MENSUAL' | 'ANUAL'>('ANUAL');
  const [selectedModules, setSelectedModules] = useState<ModuleType[]>(() => {
    // Default to modules evaluated as NECESARIO or RECOMENDADO
    const recs = applicabilityProfile.evaluations
      .filter(e => e.tier === 'NECESARIO' || e.tier === 'RECOMENDADO')
      .map(e => e.module);
    return recs.length > 0 ? recs : ['SST', 'PESV'];
  });

  // Form states
  const [formData, setFormData] = useState({
    companyName: characterization.identification.razonSocial || 'Industrias Andinas S.A.S.',
    nit: characterization.identification.nit || '901.458.789-2',
    contactName: characterization.identification.representanteLegal || 'Carlos Andrés Mendoza',
    email: characterization.identification.emailContacto || 'direccion.hseq@andina.com.co',
    phone: characterization.identification.telefono || '+57 (601) 745-8900',
    city: characterization.identification.ciudad || 'Bogotá D.C.',
    address: characterization.sites[0]?.ubicacion || 'Calle 100 # 19-61, Oficina 802'
  });

  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'PSE' | 'INVOICE'>('CREDIT_CARD');
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4242',
    name: 'CARLOS A MENDOZA',
    expiry: '12/28',
    cvv: '•••'
  });
  const [pseBank, setPseBank] = useState('BANCOLOMBIA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptsScope, setAcceptsScope] = useState(false);

  if (!isCheckoutModalOpen) return null;

  // Price calculations
  // Carbon footprint calculator: free with Environmental + another module or ISO 14001; otherwise sold on its own.
  const huella = huellaCarbonoEnPlan(selectedModules);
  const huellaCostoMes = huella.habilitada && !huella.incluidaSinCosto ? HUELLA_CARBONO_PRECIO_MES : 0;
  const subtotalMonthly = chargeableModules(selectedModules).filter(m => m !== 'HUELLA_CARBONO').reduce((sum, mod) => {
    const evalData = applicabilityProfile.evaluations.find(e => e.module === mod);
    return sum + (evalData?.monthlyPriceCop || 180000);
  }, 0) + huellaCostoMes;

  // Multi-module discount (5% per extra module up to 15%)
  const multiModuleDiscountRate = selectedModules.length >= 3 ? 0.15 : selectedModules.length === 2 ? 0.10 : 0.05;
  const discountedMonthly = subtotalMonthly * (1 - multiModuleDiscountRate);

  // Annual discount: 20% discount if paying annually
  const annualDiscountRate = 0.20;
  const finalMonthlyRate = billingCycle === 'ANUAL' ? discountedMonthly * (1 - annualDiscountRate) : discountedMonthly;
  const totalToPay = billingCycle === 'ANUAL' ? Math.round(finalMonthlyRate * 12) : Math.round(finalMonthlyRate);

  const toggleModule = (mod: ModuleType) => {
    setSelectedModules(prev =>
      prev.includes(mod)
        ? prev.length > 1 ? prev.filter(m => m !== mod) : prev // keep at least 1
        : [...prev, mod]
    );
  };

  const handleSubmitPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Clean name for subdomain slug
      const slug = formData.companyName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 15) || 'miempresa';

      const cleanNit = formData.nit.replace(/[^0-9]/g, '').substring(0, 9) || '901234567';
      const randomPasswordCode = Math.floor(1000 + Math.random() * 9000);
      const randomTokenCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const emailData: ActivationEmailData = {
        companyName: formData.companyName,
        nit: formData.nit,
        contactName: formData.contactName,
        email: formData.email,
        planName: selectedModules.length >= 4 ? 'Plan Empresarial Full Suite' : 'Plan Especializado a Medida',
        billingCycle: billingCycle,
        totalCop: totalToPay,
        assignedSubdomain: `https://${slug}.agaesolutions.com`,
        accessUsername: `admin.${cleanNit}`,
        temporaryPassword: `Agae${new Date().getFullYear()}*${randomPasswordCode}`,
        activationToken: `AGAE-ACT-${new Date().getFullYear()}-${randomTokenCode}`,
        activeModules: selectedModules,
        sentAt: new Date().toISOString()
      };

      setIsCheckoutModalOpen(false);
      sendActivationEmail(emailData);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-white backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-50 border border-emerald-200 rounded-2xl shadow-2xl shadow-slate-900/5 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Contratación & Habilitación Inmediata de AGAE
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Activación Inmediata
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tu plataforma se autoconfigurará con los datos de tu caracterización. Recibirás las credenciales en tu correo.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmitPurchase} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Order Summary & Modules */}
            <div className="lg:col-span-7 space-y-5">
              {/* Billing Cycle Switcher */}
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="font-bold text-slate-700 block mb-2 text-xs">
                  Periodicidad de Facturación
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('MENSUAL')}
                    className={`py-2 px-3 rounded-lg font-bold text-xs flex flex-col items-center justify-center border transition-all ${
                      billingCycle === 'MENSUAL'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Pago Mensual</span>
                    <span className="text-[10px] font-normal text-slate-500">Sin compromiso de permanencia</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillingCycle('ANUAL')}
                    className={`py-2 px-3 rounded-lg font-bold text-xs flex flex-col items-center justify-center border transition-all relative ${
                      billingCycle === 'ANUAL'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[9px] font-black rounded-full uppercase">
                      Ahorra 20%
                    </span>
                    <span>Pago Anual Anticipado</span>
                    <span className="text-[10px] font-normal text-emerald-700">2 meses gratis incluidos</span>
                  </button>
                </div>
              </div>

              {/* Modules Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-700 text-xs">
                    Módulos a Activar en la Plataforma
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Calculados según tu caracterización
                  </span>
                </div>

                <div className="space-y-2">
                  {applicabilityProfile.evaluations.map(mod => {
                    const isSelected = selectedModules.includes(mod.module);
                    return (
                      <div
                        key={mod.module}
                        onClick={() => toggleModule(mod.module)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-white border-slate-200 opacity-60 hover:opacity-90'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                              isSelected
                                ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                                : 'border-slate-300 bg-slate-50 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">{mod.moduleName}</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                                {mod.tier}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 line-clamp-1">
                              {mod.legalBasis}
                            </span>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <span className="text-emerald-700 font-bold text-xs block">
                            ${mod.monthlyPriceCop.toLocaleString('es-CO')}
                          </span>
                          <span className="text-[9px] text-slate-500">COP/mes</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Company & Billing Info */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 text-xs block border-b border-slate-200 pb-2">
                  Datos de Facturación & Destino de Credenciales
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block text-[10px] mb-1">Razón Social *</label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block text-[10px] mb-1">NIT / Identificación Tributaria *</label>
                    <input
                      type="text"
                      required
                      value={formData.nit}
                      onChange={e => setFormData({ ...formData, nit: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block text-[10px] mb-1">Representante o Contacto HSEQ *</label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-emerald-700 font-bold block text-[10px] mb-1">
                      Correo Corporativo (Recibirá las credenciales) *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-emerald-50 border border-emerald-500 rounded-lg p-2 text-emerald-800 font-medium focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block text-[10px] mb-1">Teléfono Móvil / Fijo</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block text-[10px] mb-1">Ciudad Principal</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Payment & Price Summary */}
            <div className="lg:col-span-5 space-y-5">
              {/* Payment Method Selector */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 text-xs block border-b border-slate-200 pb-2">
                  Método de Pago Seguro
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                    className={`p-2 rounded-lg border text-center font-bold text-[11px] transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'CREDIT_CARD'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-500'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Tarjeta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PSE')}
                    className={`p-2 rounded-lg border text-center font-bold text-[11px] transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'PSE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-500'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>PSE Bancario</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('INVOICE')}
                    className={`p-2 rounded-lg border text-center font-bold text-[11px] transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'INVOICE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-500'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Factura 30D</span>
                  </button>
                </div>

                {paymentMethod === 'CREDIT_CARD' && (
                  <div className="space-y-2 pt-2 text-[11px]">
                    <div>
                      <label className="text-slate-500 block mb-1">Número de Tarjeta</label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={e => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-500 block mb-1">Vencimiento</label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'PSE' && (
                  <div className="space-y-2 pt-2 text-[11px]">
                    <label className="text-slate-500 block mb-1">Selecciona tu Entidad Financiera</label>
                    <select
                      value={pseBank}
                      onChange={e => setPseBank(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                    >
                      <option value="BANCOLOMBIA">Bancolombia</option>
                      <option value="BANCO_BOGOTA">Banco de Bogotá</option>
                      <option value="DAVIVIENDA">Davivienda</option>
                      <option value="BBVA">BBVA Colombia</option>
                      <option value="NEQUI">Nequi</option>
                      <option value="DAVIPLATA">DaviPlata</option>
                    </select>
                    <span className="text-[10px] text-slate-500 block">
                      Serás redirigido al portal oficial de PSE para autorizar la transacción.
                    </span>
                  </div>
                )}

                {paymentMethod === 'INVOICE' && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-1">
                    <p className="font-bold text-slate-900">Facturación Electrónica DIAN a 30 Días</p>
                    <p className="text-slate-500 text-[10px]">
                      Habilitamos la suite inmediatamente. Se remitirá la factura electrónica con XML y PDF a {formData.email}.
                    </p>
                  </div>
                )}
              </div>

              {/* Order Price Breakdown */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-white to-slate-50 border border-emerald-200 space-y-3">
                <span className="font-bold text-slate-900 text-xs block border-b border-slate-200 pb-2">
                  Resumen de la Inversión
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Módulos ({selectedModules.filter(m => m !== 'HUELLA_CARBONO').length}):</span>
                    <span className="font-mono text-slate-800">
                      ${(subtotalMonthly - huellaCostoMes).toLocaleString('es-CO')} COP/mes
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500">
                    <span>Huella de carbono:</span>
                    <span className="font-mono text-slate-800">
                      {huella.incluidaSinCosto ? 'Incluida sin costo' : huella.habilitada ? `$${huellaCostoMes.toLocaleString('es-CO')} COP/mes` : 'No incluida'}
                    </span>
                  </div>

                  <div className="flex justify-between text-emerald-700">
                    <span>Descuento Multimódulo ({(multiModuleDiscountRate * 100).toFixed(0)}%):</span>
                    <span className="font-mono">
                      -${Math.round(subtotalMonthly * multiModuleDiscountRate).toLocaleString('es-CO')} COP
                    </span>
                  </div>

                  {billingCycle === 'ANUAL' && (
                    <div className="flex justify-between text-teal-700">
                      <span>Descuento Pago Anual (20%):</span>
                      <span className="font-mono">
                        -${Math.round(discountedMonthly * annualDiscountRate * 12).toLocaleString('es-CO')} COP
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500">
                    <span>Configuración & Adaptación Inicial:</span>
                    <span className="font-mono text-emerald-700 font-bold">GRATIS ($0)</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">
                        Total {billingCycle === 'ANUAL' ? 'Facturado Anualmente' : 'Mensual'}:
                      </span>
                      <span className="text-[10px] text-emerald-700">IVA incluido (Factura DIAN)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-emerald-700 font-mono">
                        ${totalToPay.toLocaleString('es-CO')}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        COP {billingCycle === 'ANUAL' ? '/año' : '/mes'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scope acknowledgement (required) */}
                <label className="flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50 p-3 text-[11px] text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={acceptsScope}
                    onChange={(e) => setAcceptsScope(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-emerald-500 shrink-0"
                  />
                  <span>
                    Entiendo que {DISCLAIMER_SHORT} La plataforma optimiza los procesos de gestión y almacena la información de forma conectada.
                  </span>
                </label>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing || !acceptsScope}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Generando Credenciales & Activando Suite...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Comprar Solución & Enviar Credenciales</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  <span>Transacción cifrada 256-bit SSL • Garantía 30 días</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
