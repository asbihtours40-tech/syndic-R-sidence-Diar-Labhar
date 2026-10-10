import React from 'react';
import { CoproProvider, useCopro } from './context/CoproContext';
import { Header } from './components/layout/Header';
import { WorkspaceBar } from './components/layout/WorkspaceBar';
import { DashboardView } from './components/dashboard/DashboardView';
import { IncidentsView } from './components/incidents/IncidentsView';
import { MessagesView } from './components/messages/MessagesView';
import { AgVotesView } from './components/ag/AgVotesView';
import { DocumentsView } from './components/documents/DocumentsView';
import { FinancesView } from './components/finances/FinancesView';
import { DirectoryView } from './components/directory/DirectoryView';
import { IncidentDetailModal } from './components/incidents/IncidentDetailModal';
import { NewIncidentModal } from './components/incidents/NewIncidentModal';
import { AiAssistantModal } from './components/common/AiAssistantModal';

const AppContent: React.FC = () => {
  const {
    activeView,
    selectedIncident,
    setSelectedIncident,
    isNewIncidentModalOpen,
    setIsNewIncidentModalOpen,
  } = useCopro();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Bar (Zone 1 Wordmark, Zone 2 Nav, Zone 3 Primary Action) */}
      <Header />

      {/* Workspace Bar with Building info, Role switcher, Secondary tabs */}
      <WorkspaceBar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'incidents' && <IncidentsView />}
        {activeView === 'messages' && <MessagesView />}
        {activeView === 'ag_votes' && <AgVotesView />}
        {activeView === 'documents' && <DocumentsView />}
        {activeView === 'finances' && <FinancesView />}
        {activeView === 'directory' && <DirectoryView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">CoproLink</span>
            <span aria-hidden="true">·</span>
            <span>Résidence Diar Labhar · Mansouria</span>
            <span aria-hidden="true">·</span>
            <span>Syndic - IKRAM -</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Conforme Loi ALUR & Décret du 17 Mars 1967</span>
            <span aria-hidden="true">·</span>
            <span>Extranet Copropriété Sécurisé</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      {isNewIncidentModalOpen && (
        <NewIncidentModal onClose={() => setIsNewIncidentModalOpen(false)} />
      )}

      <AiAssistantModal />
    </div>
  );
};

export default function App() {
  return (
    <CoproProvider>
      <AppContent />
    </CoproProvider>
  );
}
