'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/lib/store';
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
import { CompanyProfileModal } from '@/components/company/CompanyProfileModal';

function MainAppContent() {
  const { activeTab } = useApp();
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExecutiveDashboard />;
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
    <div className="min-h-screen flex flex-col bg-[#0b1120]">
      {/* Top Navbar */}
      <Navbar onOpenCompanyModal={() => setIsCompanyModalOpen(true)} />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar onOpenCompanyModal={() => setIsCompanyModalOpen(true)} />

        {/* Dynamic Content Panel */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
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

export default function Page() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
