import React, { useState } from 'react';
import { useCopro } from '../../context/CoproContext';
import {
  FileText,
  Search,
  Download,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { documents, openAiAssistant } = useCopro();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.description.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false;
    return true;
  });

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'reglement', label: 'Règlement de copropriété' },
    { id: 'pv_ag', label: 'Procès-Verbaux d\'AG' },
    { id: 'contrats', label: 'Contrats prestataires' },
    { id: 'diagnostics', label: 'Diagnostics & DPE' },
    { id: 'carnet_entretien', label: 'Carnet d\'entretien' },
    { id: 'comptabilite', label: 'Comptabilité & Budgets' },
  ];

  const handleDownload = (docTitle: string) => {
    alert(`Téléchargement sécurisé du document : "${docTitle}". (Génération du fichier PDF archivé)`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Bibliothèque & Documents de Copropriété
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Coffre-fort numérique officiel : règlements, diagnostics techniques, contrats et procès-verbaux
          </p>
        </div>

        <button
          onClick={() =>
            openAiAssistant(
              'Que dit le règlement de copropriété concernant les travaux privatifs et les nuisances sonores ?'
            )
          }
          className="px-3.5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Interroger le règlement avec l&apos;IA</span>
        </button>
      </div>

      {/* AI Bylaws explainer card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
              <BookOpen className="w-4 h-4" />
              <span>Questions fréquentes sur le Règlement d&apos;immeuble</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Vous avez un doute sur vos droits ? Climatisation, horaires de bricolage, barbecue, animaux, ou vélos dans les parties communes : l&apos;assistant juridique analyse le règlement pour vous.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => openAiAssistant('Quels sont les horaires autorisés pour percer des murs ou faire des travaux bruyants ?')}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 border border-slate-700 transition-colors"
            >
              Horaires travaux
            </button>
            <button
              onClick={() => openAiAssistant('Ai-je le droit de poser un climatiseur avec unité extérieure sur le balcon ou la façade ?')}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 border border-slate-700 transition-colors"
            >
              Climatiseur en façade
            </button>
            <button
              onClick={() => openAiAssistant('Qui prend en charge financièrement une fuite d\'eau avant le compteur individuel ?')}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 border border-slate-700 transition-colors"
            >
              Fuite avant compteur
            </button>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un document par nom ou sujet..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          <div className="text-xs text-slate-500">
            {filteredDocs.length} document{filteredDocs.length > 1 ? 's' : ''} disponible{filteredDocs.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                categoryFilter === c.id
                  ? 'bg-slate-900 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-700" />
                  <span className="font-semibold text-slate-800 tabular-nums">
                    Édition {doc.year}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{doc.fileSize}</span>
                </div>
                <span>Mise à jour : {doc.updatedAt}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {doc.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                Format PDF certifié
              </span>

              <button
                onClick={() => handleDownload(doc.title)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
