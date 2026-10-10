import React from 'react';
import { useCopro } from '../../context/CoproContext';
import { UserRole } from '../../types';
import { Sparkles, Wallet, PhoneCall, RotateCcw } from 'lucide-react';

export const WorkspaceBar: React.FC = () => {
  const { currentRole, setRole, activeView, setActiveView, openAiAssistant, resetAllData } = useCopro();

  const roleOptions: { role: UserRole; label: string; desc: string }[] = [
    {
      role: 'resident',
      label: 'Résident',
      desc: 'Driss El Amrani (Lot B12)',
    },
    {
      role: 'conseil_syndical',
      label: 'Conseil Syndical',
      desc: 'Mohamed Tazi (Président CS)',
    },
    {
      role: 'syndic',
      label: 'Syndic - IKRAM -',
      desc: 'Mme Ikram (Gestionnaire Diar Labhar)',
    },
  ];

  return (
    <div className="bg-slate-100/80 border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Left: Building identification & location */}
        <div className="flex items-center gap-2 text-slate-600">
          <span className="font-semibold text-slate-900">Résidence Diar Labhar</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Mansouria · Bord de Mer</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="tabular-nums">68 appartements</span>
        </div>

        {/* Right: Functional secondary tools and Interactive Role Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Secondary views navigation */}
          <div className="flex items-center gap-1 sm:gap-2 mr-1">
            <button
              onClick={() => setActiveView('finances')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
                activeView === 'finances'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-slate-500" />
              <span>Charges</span>
            </button>
            <button
              onClick={() => setActiveView('directory')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
                activeView === 'directory'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
              <span>Urgences & Artisans</span>
            </button>
            <button
              onClick={() => openAiAssistant()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Assistant Copro</span>
            </button>
          </div>

          {/* Interactive Role Switcher */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-lg">
            <span className="px-2 text-[11px] font-medium text-slate-500 hidden xl:inline">
              Rôle actif :
            </span>
            {roleOptions.map((opt) => {
              const isSelected = currentRole === opt.role;
              return (
                <button
                  key={opt.role}
                  onClick={() => setRole(opt.role)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                  title={opt.desc}
                >
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Reset Demo Data button */}
          <button
            onClick={() => {
              if (window.confirm('Réinitialiser les données de démonstration de la copropriété ?')) {
                resetAllData();
              }
            }}
            title="Réinitialiser les données de démonstration"
            className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
