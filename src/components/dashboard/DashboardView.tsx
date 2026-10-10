import React from 'react';
import { useCopro } from '../../context/CoproContext';
import {
  AlertTriangle,
  Calendar,
  Wrench,
  CheckCircle2,
  FileText,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import facadeImg from '../../assets/images/diar_labhar_facade_1791673088534.jpg';
import poolImg from '../../assets/images/diar_labhar_pool_1791673098291.jpg';
import gardenImg from '../../assets/images/diar_labhar_garden_1791673108194.jpg';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    incidents,
    announcements,
    ag,
    setActiveView,
    setSelectedIncident,
    setIsNewIncidentModalOpen,
  } = useCopro();

  const activeIncidents = incidents.filter((i) => i.status !== 'resolu');
  const urgentIncidents = incidents.filter(
    (i) => i.status !== 'resolu' && (i.urgency === 'urgente' || i.urgency === 'critique')
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Role-adaptive welcome & key alerts */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Espace Connecté</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{currentUser.role.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.apartment}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Bonjour, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {currentUser.role === 'resident' &&
              'Bienvenue sur votre espace résident Diar Labhar. Votre compte copropriétaire est à jour.'}
            {currentUser.role === 'conseil_syndical' &&
              'Espace Conseil Syndical Diar Labhar. Suivi technique des installations et concertation avec le syndic IKRAM.'}
            {currentUser.role === 'syndic' &&
              'Espace de gestion Syndic - IKRAM -. Suivi en temps réel de la résidence Diar Labhar (Piscine, Espaces verts, Sécurité).'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsNewIncidentModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            Déclarer un problème
          </button>
          <button
            onClick={() => setActiveView('messages')}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Écrire à IKRAM
          </button>
        </div>
      </div>

      {/* Hero Showcase & Key Quantitative Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Residence Building Visual Anchor */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
            <img
              src={facadeImg}
              alt="Entrée de la Résidence Diar Labhar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5">
              <span className="text-xs font-medium text-amber-300 tracking-wide uppercase">
                Copropriété Mansouria
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Résidence Diar Labhar
              </h2>
              <p className="text-xs text-slate-200 mt-1 max-w-lg">
                Complexe résidentiel balnéaire à Mansouria avec grande piscine centrale, palmiers, allées paysagères, parking sécurisé et gardiennage permanent.
              </p>
            </div>
          </div>

          <div className="p-4 grid grid-cols-3 gap-3 bg-slate-50 border-t border-slate-200 text-xs">
            <div>
              <div className="text-slate-500 font-medium">Gestionnaire Référent</div>
              <div className="font-semibold text-slate-900 mt-0.5">Syndic - IKRAM -</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Gardiennage & Sécurité</div>
              <div className="font-semibold text-slate-900 mt-0.5">Poste Atlas Sécurité 24/7</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Contact Syndic</div>
              <div className="font-semibold text-slate-900 tabular-nums mt-0.5">+212 6 61 24 55 80</div>
            </div>
          </div>
        </div>

        {/* 4 Quantitative Rigor Cards */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">Signalements en cours</span>
              <div className="text-3xl font-bold text-slate-900 tabular-nums mt-2">
                {activeIncidents.length}
              </div>
            </div>
            <div className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span>Dont urgents :</span>
              <span className="font-semibold text-rose-600 tabular-nums">{urgentIncidents.length}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">Taux de résolution</span>
              <div className="text-3xl font-bold text-slate-900 tabular-nums mt-2">
                96%
              </div>
            </div>
            <div className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span>Intervention moyenne :</span>
              <span className="font-semibold text-slate-900 tabular-nums">24h-48h</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">Prochaine Assemblée</span>
              <div className="text-base font-bold text-slate-900 mt-2">
                21 Nov 2026
              </div>
            </div>
            <div className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span>Quorum atteint :</span>
              <span className="font-semibold text-emerald-700 tabular-nums">71.2%</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">Logements de la résidence</span>
              <div className="text-xl font-bold text-slate-900 tabular-nums mt-2">
                68 appartements
              </div>
            </div>
            <div className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span>Équipements :</span>
              <span className="font-semibold text-slate-900">Piscine & Jardin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Announcements vs Live Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column (7 cols): Official Announcements and Resident notices */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Annonces officielles & Avis d&apos;immeuble
              </h2>
              <p className="text-xs text-slate-500">
                Informations publiées par le Syndic de gestion et le Conseil Syndical
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                      <span className="font-medium text-slate-800">{ann.author}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {new Date(ann.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      {ann.eventDate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-700 font-medium">
                            Date clé : {ann.eventDate}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {ann.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                  {ann.category === 'travaux' && (
                    <div className="p-2 bg-amber-50 text-amber-700 rounded-lg shrink-0">
                      <Wrench className="w-4 h-4" />
                    </div>
                  )}
                  {ann.category === 'ag' && (
                    <div className="p-2 bg-slate-100 text-slate-800 rounded-lg shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                  )}
                  {ann.category === 'vie_immeuble' && (
                    <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Photos Showcase Strip (Pool & Gardens of Diar Labhar) */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <img
                src={poolImg}
                alt="Grande piscine de la Résidence Diar Labhar"
                referrerPolicy="no-referrer"
                className="w-full h-36 object-cover"
              />
              <div className="p-3 text-xs">
                <span className="font-semibold text-slate-900 block">Grande Piscine Centrale</span>
                <span className="text-slate-500">Bassin turquoise, solarium & palmiers</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <img
                src={gardenImg}
                alt="Jardins et palmiers de la copropriété"
                referrerPolicy="no-referrer"
                className="w-full h-36 object-cover"
              />
              <div className="p-3 text-xs">
                <span className="font-semibold text-slate-900 block">Jardins & Espaces Verts</span>
                <span className="text-slate-500">Allées paysagères & proximité plage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column (5 cols): Active Tickets & Quick Access */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Signalements récents
              </h2>
              <p className="text-xs text-slate-500">
                Suivi transparent des réparations en cours
              </p>
            </div>
            <button
              onClick={() => setActiveView('incidents')}
              className="text-xs font-semibold text-slate-900 hover:text-slate-700 inline-flex items-center gap-1"
            >
              <span>Voir tout ({incidents.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {incidents.slice(0, 4).map((inc) => {
              const statusLabels: Record<string, { text: string; color: string }> = {
                nouveau: { text: 'Nouveau', color: 'text-blue-700' },
                pris_en_charge: { text: 'Pris en charge', color: 'text-amber-700' },
                devis_en_cours: { text: 'Devis en cours', color: 'text-purple-700' },
                intervention_planifiee: { text: 'Intervention planifiée', color: 'text-emerald-700' },
                resolu: { text: 'Résolu', color: 'text-slate-600' },
              };
              const statusInfo = statusLabels[inc.status] || { text: inc.status, color: 'text-slate-600' };

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-400 hover:shadow-sm cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className="capitalize">{inc.category.replace('_', ' ')}</span>
                        <span aria-hidden="true">·</span>
                        <span>{inc.building}</span>
                        <span aria-hidden="true">·</span>
                        <span className={`font-semibold ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                        {inc.title}
                      </h3>
                      {inc.contractor?.interventionDate && (
                        <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md inline-flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span>Intervention : {inc.contractor.interventionDate}</span>
                        </div>
                      )}
                    </div>

                    {inc.urgency === 'urgente' || inc.urgency === 'critique' ? (
                      <span className="text-rose-600 shrink-0" title="Urgent">
                        <ShieldAlert className="w-4 h-4" />
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Signalé par {inc.reportedBy.name}</span>
                    <span className="font-medium text-slate-700">
                      {inc.comments.length} message{inc.comments.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Consultation Banner for AG */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Consultation en cours</span>
            </div>
            <h3 className="text-sm font-bold text-white leading-snug">
              {ag.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Exprimez vos intentions de vote avant la séance pour guider le Conseil Syndical sur les travaux de recharge électrique et d&apos;étanchéité.
            </p>
            <button
              onClick={() => setActiveView('ag_votes')}
              className="mt-4 px-3.5 py-2 text-xs font-semibold bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Consulter l&apos;ordre du jour et voter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
