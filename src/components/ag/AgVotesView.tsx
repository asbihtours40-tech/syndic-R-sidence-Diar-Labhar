import React from 'react';
import { useCopro } from '../../context/CoproContext';
import {
  Calendar,
  CheckCircle,
  XCircle,
  HelpCircle,
  Download,
  FileText,
  Clock,
  MapPin,
  Vote,
  Sparkles,
} from 'lucide-react';

export const AgVotesView: React.FC = () => {
  const { ag, voteOnResolution, currentUser, openAiAssistant } = useCopro();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Assemblées Générales & Consultations des Résidents
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Préparez vos votes, examinez les devis et donnez vos orientations au Conseil Syndical
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              openAiAssistant(
                'Résume-moi les points clés de l\'ordre du jour de la prochaine AG et les impacts financiers pour mon lot.'
              )
            }
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Synthèse IA de l&apos;AG</span>
          </button>
        </div>
      </div>

      {/* Next AG Hero Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">Prochaine séance</span>
              <span aria-hidden="true">·</span>
              <span>Année d&apos;exercice 2026</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {ag.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{ag.date} · {ag.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{ag.location}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl min-w-[240px] text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Quorum estimé :</span>
              <span className="font-bold text-emerald-700 tabular-nums">
                {(ag.currentQuorum / 100).toFixed(1)}% ({ag.currentQuorum} / 10 000 tantièmes)
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${(ag.currentQuorum / 10000) * 100}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500">
              Quorum légal requis (50.01%) d&apos;ores et déjà atteint.
            </div>
          </div>
        </div>
      </div>

      {/* Resolutions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Résolutions soumises à la consultation ({ag.resolutions.length})
          </h3>
          <span className="text-xs text-slate-500">
            Votes consultatifs enregistrés pour le compte de : {currentUser.name}
          </span>
        </div>

        {ag.resolutions.map((res) => {
          const totalVotes = res.votes.pour + res.votes.contre + res.votes.abstention;
          const pourPercent = totalVotes > 0 ? Math.round((res.votes.pour / totalVotes) * 100) : 0;

          return (
            <div
              key={res.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-slate-900 tabular-nums">
                      Résolution n°{res.number}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">
                      {res.type === 'majorite_simple'
                        ? 'Article 24 (Majorité simple)'
                        : 'Article 25 (Majorité absolue)'}
                    </span>
                    {res.budgetEstimate !== undefined && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums font-semibold text-slate-800">
                          {res.budgetEstimate === 0
                            ? '0 € (Subventionné)'
                            : `${res.budgetEstimate.toLocaleString('fr-FR')} € TTC`}
                        </span>
                      </>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {res.title}
                  </h4>
                </div>

                {/* Vote Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 p-1 border border-slate-200 rounded-lg">
                  <button
                    onClick={() => voteOnResolution(res.id, 'pour')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      res.userVote === 'pour'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Pour</span>
                  </button>

                  <button
                    onClick={() => voteOnResolution(res.id, 'contre')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      res.userVote === 'contre'
                        ? 'bg-rose-700 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Contre</span>
                  </button>

                  <button
                    onClick={() => voteOnResolution(res.id, 'abstention')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      res.userVote === 'abstention'
                        ? 'bg-slate-700 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Abstention</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {res.description}
              </p>

              {/* Conseil Syndical Recommendation Note */}
              {res.conseilNote && (
                <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-3 text-xs text-amber-950">
                  <span className="font-semibold block mb-0.5">
                    Avis du Conseil Syndical ({res.conseilRecommendation}) :
                  </span>
                  <span>{res.conseilNote}</span>
                </div>
              )}

              {/* Live Tally Bar */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span>
                    Pour : <strong className="text-slate-900 tabular-nums">{res.votes.pour}</strong>
                  </span>
                  <span>
                    Contre : <strong className="text-slate-900 tabular-nums">{res.votes.contre}</strong>
                  </span>
                  <span>
                    Abstentions : <strong className="text-slate-900 tabular-nums">{res.votes.abstention}</strong>
                  </span>
                </div>

                <div className="text-[11px]">
                  Tendance :{' '}
                  <span className="font-semibold text-emerald-700 tabular-nums">
                    {pourPercent}% d&apos;approbation
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
