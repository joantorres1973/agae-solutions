'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AppProvider, useApp } from '@/lib/store';
import { AuthProvider, useAuth } from '@/lib/auth';
import { LoginScreen } from '@/components/portal/LoginScreen';
import { ProfessionalDisclaimer } from '@/components/public/ProfessionalDisclaimer';
import { DemoBanner, DemoUpsellModal, PlanPreviewBanner } from '@/components/portal/DemoUpsell';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';
import { AcpmEngine } from '@/components/acpm/AcpmEngine';
import { SmartAuditEngine } from '@/components/audits/SmartAuditEngine';
import { SstModule } from '@/components/sst/SstModule';
import { EnvironmentalModule } from '@/components/environmental/EnvironmentalModule';
import { PesvModule } from '@/components/pesv/PesvModule';
import { IsoModule } from '@/components/iso/IsoModule';
import { PendingTasksEngine } from '@/components/tasks/PendingTasksEngine';
import { EvidenceEngine } from '@/components/evidences/EvidenceEngine';
import { SharedAssetsEngine } from '@/components/assets/SharedAssetsEngine';
import { WorkersMasterModule } from '@/components/workers/WorkersMasterModule';
import { CompanyProfileModal } from '@/components/company/CompanyProfileModal';
import { ApplicabilityProfileView } from '@/components/characterization/ApplicabilityProfileView';
import { SmartCharacterizationWizard } from '@/components/characterization/SmartCharacterizationWizard';
import { LandingPage } from '@/components/public/LandingPage';
import { InteractiveDemoPreview } from '@/components/public/InteractiveDemoPreview';
import { CheckoutModal } from '@/components/public/CheckoutModal';
import { WelcomeEmailModal } from '@/components/public/WelcomeEmailModal';
import { PublicCoursePlayer } from '@/components/sst/training/PublicCoursePlayer';

function WorkspaceContent() {
  const { activeTab } = useApp();
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'characterization':
        return <ApplicabilityProfileView />;
      case 'workers':
        return <WorkersMasterModule />;
      case 'acpm':
        return <AcpmEngine />;
      case 'audits':
        return <SmartAuditEngine />;
      case 'sst':
        return <SstModule />;
      case 'environmental':
        return <EnvironmentalModule />;
      case 'pesv':
        return <PesvModule />;
      case 'iso':
        return <IsoModule />;
      case 'tasks':
        return <PendingTasksEngine />;
      case 'evidences':
        return <EvidenceEngine />;
      case 'assets':
        return <SharedAssetsEngine />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,#ffffff_0%,#f2faf5_45%,#ecf8f1_100%)]">
      <div className="print:hidden">
        <DemoBanner />
      </div>

      {/* Top Navbar */}
      <div className="print:hidden">
        <Navbar onOpenCompanyModal={() => setIsCompanyModalOpen(true)} />
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="print:hidden">
          <Sidebar onOpenCompanyModal={() => setIsCompanyModalOpen(true)} />
        </div>

        {/* Dynamic Content Panel */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 print:p-0 print:overflow-visible">
          <div className="max-w-7xl mx-auto print:max-w-full">
            <div className="print:hidden">
              <PlanPreviewBanner />
            </div>
            {renderActiveView()}
            <div className="print:hidden">
              <ProfessionalDisclaimer variant="compact" className="mt-10 pt-4 border-t border-slate-200 text-slate-600" />
            </div>
          </div>
        </main>
      </div>

      {/* Company Profile Configuration Modal */}
      <CompanyProfileModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />
    </div>
  );
}

/** Portal Clientes: login first; demo users get a limited workspace. */
function ClientPortal() {
  const { status } = useAuth();
  const { setPortalView } = useApp();

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-[#0e7c8f] animate-spin" />
      </div>
    );
  }
  if (status === 'anon') return <LoginScreen onBack={() => setPortalView('landing')} />;
  return (
    <>
      <WorkspaceContent />
      <DemoUpsellModal />
    </>
  );
}

function PortalRouter() {
  const { portalView, setPortalView } = useApp();
  const [publicCourseCode, setPublicCourseCode] = useState<string | null>(null);

  // Links from other pages or external workers:
  // 1. ?aula=CUR-BIO-001 or ?curso=CUR-BIO-001 opens public worker course player without login!
  // 2. /?vista=wizard|demo|app
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const aula = params.get('aula') || params.get('curso');
    if (aula) {
      setPublicCourseCode(aula);
      return;
    }

    const target = params.get('vista');
    if (target !== 'wizard' && target !== 'demo' && target !== 'app') return;
    setPortalView(target);
    window.history.replaceState(null, '', '/');
  }, [setPortalView]);

  // Si se abre mediante un enlace público de capacitación para colaboradores
  if (publicCourseCode) {
    return (
      <PublicCoursePlayer
        courseCode={publicCourseCode}
        onClose={() => {
          setPublicCourseCode(null);
          window.history.replaceState(null, '', '/');
        }}
      />
    );
  }

  return (
    <>
      {portalView === 'landing' && <LandingPage />}

      {portalView === 'wizard' && (
        <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f2faf5_45%,#ffffff_100%)] text-slate-800 p-3 sm:p-5 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <SmartCharacterizationWizard
              onClose={() => setPortalView('landing')}
              onFinish={() => setPortalView('demo')}
            />
          </div>
        </div>
      )}

      {portalView === 'demo' && <InteractiveDemoPreview />}

      {portalView === 'app' && <ClientPortal />}

      {/* Global Purchase & Credential Modals */}
      <CheckoutModal />
      <WelcomeEmailModal />
    </>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <AppProvider>
        <PortalRouter />
      </AppProvider>
    </AuthProvider>
  );
}
