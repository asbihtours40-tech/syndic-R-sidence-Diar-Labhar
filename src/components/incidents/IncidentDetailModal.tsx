import React, { useState } from 'react';
import { useCopro } from '../../context/CoproContext';
import { Incident, IncidentStatus } from '../../types';
import {
  X,
  Calendar,
  Wrench,
  Send,
  Sparkles,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Building2,
  User,
  Shield,
  Loader2,
} from 'lucide-react';

interface Props {
  incident: Incident;
  onClose: () => void;
}

export const IncidentDetailModal: React.FC<Props> = ({ incident, onClose }) => {
  const {
    currentUser,
    updateIncidentStatus,
    addIncidentComment,
    assignContractor,
    contractors,
  } = useCopro();

  const [newComment, setNewComment] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showContractorAssign, setShowContractorAssign] = useState(false);

  // Contractor assignment form state
  const [selectedContractorName, setSelectedContractorName] = useState(
    incident.contractor?.name || contractors[0].name
  );
  const [interventionDate, setInterventionDate] = useState(
    incident.contractor?.interventionDate || ''
  );
  const [costEstimate, setCostEstimate] = useState<string>(
    incident.contractor?.costEstimate ? String(incident.contractor.costEstimate) : ''
  );

  const handleSendComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;

    addIncidentComment(
      incident.id,
      newComment.trim(),
      currentUser.role === 'syndic'
    );
    setNewComment('');
  };

  const handleAiDraftReply = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/syndic-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentTitle: incident.title,
          incidentDescription: incident.description,
          currentStatus: incident.status,
          contextNotes: `L'intervenant sous contrat est alerté. Répondre en tant que ${currentUser.name} (${currentUser.role}).`,
          role: currentUser.role === 'syndic' ? 'Syndic' : 'Conseil Syndical',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setNewComment(data.reply);
        }
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Graceful fallback
      setNewComment(
        `Bonjour,\n\nNous avons bien pris en compte ce signalement concernant "${incident.title}".\nLe dossier a été transmis à l'entreprise sous contrat pour programmation d'une intervention rapide. Nous vous tenons informés de l'avancement.\n\nBien cordialement,\n${currentUser.name}`
      );
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSaveContractor = () => {
    const chosen = contractors.find((c) => c.name === selectedContractorName);

    assignContractor(incident.id, {
      name: chosen ? chosen.name : selectedContractorName,
      phone: chosen ? chosen.phone : '01 42 68 90 00',
      specialty: chosen ? chosen.trade : 'Prestataire de maintenance',
      interventionDate: interventionDate.trim() || undefined,
      costEstimate: costEstimate ? parseFloat(costEstimate) : undefined,
      quoteStatus: costEstimate ? 'soumis' : undefined,
    });

    setShowContractorAssign(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-800 uppercase tracking-wider">
                Ticket #{incident.id.slice(-4)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{incident.category.replace('_', ' ')}</span>
              <span aria-hidden="true">·</span>
              <span>{incident.building} ({incident.floor || 'RDC'})</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">
              {incident.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Status & Urgency Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-slate-500 font-medium block">Statut du dossier :</span>
              <div className="flex items-center gap-2 mt-1">
                {(['nouveau', 'pris_en_charge', 'devis_en_cours', 'intervention_planifiee', 'resolu'] as IncidentStatus[]).map(
                  (st) => {
                    const isCurrent = incident.status === st;
                    const canChange = currentUser.role === 'syndic' || currentUser.role === 'conseil_syndical';

                    const labels: Record<IncidentStatus, string> = {
                      nouveau: 'Nouveau',
                      pris_en_charge: 'Pris en charge',
                      devis_en_cours: 'Devis',
                      intervention_planifiee: 'Planifié',
                      resolu: 'Résolu',
                    };

                    return (
                      <button
                        key={st}
                        disabled={!canChange}
                        onClick={() => updateIncidentStatus(incident.id, st)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                          isCurrent
                            ? 'bg-slate-900 text-white font-semibold'
                            : canChange
                            ? 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                            : 'bg-white/40 text-slate-400 border border-slate-100 cursor-default'
                        }`}
                      >
                        {labels[st]}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-slate-500 font-medium block">Niveau d&apos;urgence</span>
              <span
                className={`font-semibold capitalize ${
                  incident.urgency === 'urgente' || incident.urgency === 'critique'
                    ? 'text-rose-600'
                    : 'text-slate-700'
                }`}
              >
                {incident.urgency}
              </span>
            </div>
          </div>

          {/* Description & Initial Report */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Description de l&apos;anomalie
            </h3>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-slate-700 leading-relaxed whitespace-pre-line">
              {incident.description}
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-[11px] px-1">
              <User className="w-3.5 h-3.5" />
              <span>Signalé par {incident.reportedBy.name} ({incident.reportedBy.lot})</span>
              <span aria-hidden="true">·</span>
              <span>{new Date(incident.createdAt).toLocaleString('fr-FR')}</span>
            </div>
          </div>

          {/* Contractor & Work Order Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-xs">
                  Prestataire & Intervention technique
                </h3>
              </div>

              {(currentUser.role === 'syndic' || currentUser.role === 'conseil_syndical') && (
                <button
                  onClick={() => setShowContractorAssign(!showContractorAssign)}
                  className="text-xs font-semibold text-slate-900 hover:underline"
                >
                  {showContractorAssign ? 'Annuler' : incident.contractor ? 'Modifier' : 'Assigner un artisan'}
                </button>
              )}
            </div>

            {showContractorAssign ? (
              <div className="pt-2 border-t border-slate-200 space-y-3 bg-white p-3 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Artisan / Entreprise
                    </label>
                    <select
                      value={selectedContractorName}
                      onChange={(e) => setSelectedContractorName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md"
                    >
                      {contractors.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.trade})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Date prévue d&apos;intervention
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 14 Oct 2026 - 10h"
                      value={interventionDate}
                      onChange={(e) => setInterventionDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Montant devis estimé (€ TTC)
                    </label>
                    <input
                      type="number"
                      placeholder="0 si sous contrat"
                      value={costEstimate}
                      onChange={(e) => setCostEstimate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md tabular-nums"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveContractor}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
                  >
                    Valider l&apos;affectation
                  </button>
                </div>
              </div>
            ) : incident.contractor ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-slate-500 block">Entreprise mandatée</span>
                  <span className="font-semibold text-slate-900">{incident.contractor.name}</span>
                  <span className="text-slate-500 block text-[11px]">{incident.contractor.specialty}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date de passage</span>
                  <span className="font-semibold text-slate-900">
                    {incident.contractor.interventionDate || 'En attente de confirmation'}
                  </span>
                  <span className="text-slate-500 block text-[11px]">Contact : {incident.contractor.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Devis / Coût</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {incident.contractor.costEstimate !== undefined
                      ? incident.contractor.costEstimate === 0
                        ? 'Inclus au contrat'
                        : `${incident.contractor.costEstimate} € TTC`
                      : 'Non spécifié'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 italic text-[11px]">
                Aucun prestataire affecté pour l&apos;instant. Le syndic examine le signalement.
              </p>
            )}
          </div>

          {/* Chronological Discussion Thread */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Historique des échanges ({incident.comments.length})
            </h3>

            <div className="space-y-2.5">
              {incident.comments.map((c) => {
                const isSyndic = c.authorRole === 'syndic' || c.isOfficialSyndicReply;
                const isCS = c.authorRole === 'conseil_syndical';

                return (
                  <div
                    key={c.id}
                    className={`rounded-xl p-3.5 border ${
                      isSyndic
                        ? 'bg-blue-50/60 border-blue-200'
                        : isCS
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 font-medium text-slate-900">
                        {isSyndic && <Shield className="w-3.5 h-3.5 text-blue-700" />}
                        <span>{c.authorName}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-[11px] text-slate-500 font-normal">
                          {isSyndic
                            ? 'Syndic Officiel'
                            : isCS
                            ? 'Conseil Syndical'
                            : 'Résident'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="text-slate-700 whitespace-pre-line leading-relaxed text-xs">
                      {c.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendComment} className="pt-2 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 text-xs">
                Répondre dans le fil
              </label>

              <button
                type="button"
                onClick={handleAiDraftReply}
                disabled={isAiGenerating}
                className="text-[11px] font-semibold text-slate-800 hover:text-slate-950 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Rédaction IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Rédiger avec l&apos;aide IA</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Écrire en tant que ${currentUser.name}...`}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all resize-none"
            />

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer le message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
