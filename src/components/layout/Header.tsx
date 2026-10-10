import React from 'react';
import { useCopro } from '../../context/CoproContext';
import { Plus } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeView, setActiveView, setIsNewIncidentModalOpen } = useCopro();

  const navLinks = [
    { id: 'dashboard', label: 'Tableau de bord' },
    { id: 'incidents', label: 'Signalements' },
    { id: 'messages', label: 'Échanges' },
    { id: 'ag_votes', label: 'Assemblées' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand wordmark (single text element) */}
          <button
            onClick={() => setActiveView('dashboard')}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-slate-800 transition-colors text-left"
          >
            CoproLink
          </button>

          {/* Zone 2: 4-5 concise single-line text nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveView(link.id)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                    isActive
                      ? 'text-slate-950 border-slate-900 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsNewIncidentModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouveau signalement</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
