import React, { useState } from 'react';
import { useCopro } from '../../context/CoproContext';
import { IncidentCategory, IncidentStatus } from '../../types';
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Wrench,
  AlertCircle,
  MessageSquare,
  Clock,
  Sparkles,
} from 'lucide-react';

export const IncidentsView: React.FC = () => {
  const {
    incidents,
    setSelectedIncident,
    setIsNewIncidentModalOpen,
    openAiAssistant,
  } = useCopro();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredIncidents = incidents.filter((inc) => {
    // Search query
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.reportedBy.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Status filter
    if (statusFilter === 'active' && inc.status === 'resolu') return false;
    if (statusFilter === 'devis' && inc.status !== 'devis_en_cours') return false;
    if (statusFilter === 'planifie' && inc.status !== 'intervention_planifiee') return false;
    if (statusFilter === 'resolu' && inc.status !== 'resolu') return false;

    // Category filter
    if (categoryFilter !== 'all' && inc.category !== categoryFilter) return false;

    return true;
  });

  const categories: { id: IncidentCategory; label: string }[] = [
    { id: 'ascenseur', label: 'Ascenseur' },
    { id: 'plomberie', label: 'Plomberie & Fuites' },
    { id: 'electricite', label: 'Électricité & Éclairage' },
    { id: 'chauffage', label: 'Chauffage & Eau chaude' },
    { id: 'securite_acces', label: 'Contrôle d\'accès & Portes' },
    { id: 'espaces_verts', label: 'Espaces verts & Cour' },
    { id: 'parties_communes', label: 'Parties communes' },
    { id: 'nuisances', label: 'Nuisances & Voisinage' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Registre des Signalements & Interventions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi collaboratif des réparations entre copropriétaires, conseil syndical et syndic
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openAiAssistant('Aide-moi à rédiger un signalement propre et précis')}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Aide IA</span>
          </button>

          <button
            onClick={() => setIsNewIncidentModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Déclarer un incident</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par mot-clé, lieu, intervenant..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'active', label: 'En cours' },
              { id: 'devis', label: 'Devis' },
              { id: 'planifie', label: 'Planifié' },
              { id: 'resolu', label: 'Résolu' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category horizontal filter tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
              categoryFilter === 'all'
                ? 'bg-slate-900 text-white font-medium'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Toutes catégories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                categoryFilter === cat.id
                  ? 'bg-slate-900 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">
              Aucun signalement ne correspond à vos filtres
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Modifiez vos mots-clés ou le filtre de catégorie pour afficher les résultats.
            </p>
          </div>
        ) : (
          filteredIncidents.map((inc) => {
            const statusConfig: Record<
              IncidentStatus,
              { label: string; color: string; border: string; bg: string }
            > = {
              nouveau: {
                label: 'Nouveau',
                color: 'text-sky-700',
                border: 'border-sky-200',
                bg: 'bg-sky-50',
              },
              pris_en_charge: {
                label: 'Pris en charge',
                color: 'text-amber-700',
                border: 'border-amber-200',
                bg: 'bg-amber-50',
              },
              devis_en_cours: {
                label: 'Devis en cours',
                color: 'text-purple-700',
                border: 'border-purple-200',
                bg: 'bg-purple-50',
              },
              intervention_planifiee: {
                label: 'Intervention planifiée',
                color: 'text-emerald-700',
                border: 'border-emerald-200',
                bg: 'bg-emerald-50',
              },
              resolu: {
                label: 'Résolu',
                color: 'text-slate-600',
                border: 'border-slate-200',
                bg: 'bg-slate-50',
              },
            };

            const cfg = statusConfig[inc.status];

            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-4 sm:p-5 shadow-xs transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  {/* Clean unboxed metadata (strictly zero static pills) */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="capitalize text-slate-800 font-medium">
                      {inc.category.replace('_', ' ')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{inc.building}</span>
                    {inc.floor && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{inc.floor}</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>
                      Signalé le{' '}
                      {new Date(inc.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    {inc.urgency === 'urgente' && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-rose-600 font-medium">Urgent</span>
                      </>
                    )}
                    {inc.urgency === 'critique' && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-rose-700 font-bold">Critique</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {inc.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl">
                    {inc.description}
                  </p>

                  {/* Contractor info if assigned */}
                  {inc.contractor && (
                    <div className="pt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-800">{inc.contractor.name}</span>
                      </div>
                      {inc.contractor.interventionDate && (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Passage : {inc.contractor.interventionDate}</span>
                        </div>
                      )}
                      {inc.contractor.costEstimate !== undefined && inc.contractor.costEstimate > 0 && (
                        <div className="tabular-nums font-medium text-slate-700">
                          Devis : {inc.contractor.costEstimate} € TTC
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Status Indicator & Conversation counter */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${cfg.bg} ${cfg.color} ${cfg.border} border`}
                  >
                    {cfg.label}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{inc.comments.length} message{inc.comments.length > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
