import React, { useState } from 'react';
import { useCopro } from '../../context/CoproContext';
import { IncidentCategory, UrgencyLevel } from '../../types';
import { X, Sparkles, Loader2, Check } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const NewIncidentModal: React.FC<Props> = ({ onClose }) => {
  const { currentUser, addIncident, setSelectedIncident } = useCopro();

  const [category, setCategory] = useState<IncidentCategory>('parties_communes');
  const [building, setBuilding] = useState<string>('Bâtiment A');
  const [floor, setFloor] = useState<string>('Rez-de-chaussée');
  const [location, setLocation] = useState<string>('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normale');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isAiStructuring, setIsAiStructuring] = useState<boolean>(false);

  const categories: { id: IncidentCategory; label: string }[] = [
    { id: 'ascenseur', label: 'Ascenseur' },
    { id: 'plomberie', label: 'Plomberie & Fuite' },
    { id: 'electricite', label: 'Électricité & Éclairage' },
    { id: 'chauffage', label: 'Chauffage & Eau chaude' },
    { id: 'securite_acces', label: 'Porte & Digicode' },
    { id: 'espaces_verts', label: 'Jardin & Cour' },
    { id: 'parties_communes', label: 'Parties communes' },
    { id: 'nuisances', label: 'Nuisances & Voisinage' },
  ];

  const handleAiAssistance = async () => {
    if (!description.trim() && !title.trim()) {
      alert('Veuillez saisir quelques mots décrivant le problème dans la description avant de lancer l\'aide IA.');
      return;
    }

    setIsAiStructuring(true);
    try {
      const res = await fetch('/api/ai/draft-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawDescription: description || title,
          category,
          location: `${building} - ${floor} ${location ? `(${location})` : ''}`,
          urgency,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.title) setTitle(data.title);
        if (data.description) setDescription(data.description);
        if (data.urgency) setUrgency(data.urgency);
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Offline fallback
      setTitle(`Anomalie constatée : ${category.replace('_', ' ')} au ${building}`);
      setDescription(
        `Signalement formel :\n${description}\n\nLocalisation précise : ${building}, ${floor} ${location ? `(${location})` : ''}.\nMerci de mandater l'artisan référent de l'immeuble.`
      );
    } finally {
      setIsAiStructuring(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addIncident({
      title: title.trim(),
      category,
      building,
      floor,
      location: location.trim() || `${building} - ${floor}`,
      description: description.trim(),
      urgency,
      status: 'nouveau',
      reportedBy: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        lot: currentUser.apartment,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Déclarer un nouvel incident ou une réparation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Transmis instantanément au syndic et aux représentants du conseil syndical
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Category selection */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Catégorie de l&apos;incident *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    category === cat.id
                      ? 'border-slate-900 bg-slate-900 text-white font-medium'
                      : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                  }`}
                >
                  <span className="block truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Building & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Bâtiment *
              </label>
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              >
                <option value="Bâtiment A">Bâtiment A (Piscine)</option>
                <option value="Bâtiment B">Bâtiment B (Jardin & Solarium)</option>
                <option value="Bâtiment C">Bâtiment C (Accès Plage)</option>
                <option value="Parties Communes">Piscine / Solarium / Parking</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Étage
              </label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="Ex: 3ème étage, Sous-sol -1"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Degré d&apos;urgence
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              >
                <option value="basse">Basse (Gêne minime)</option>
                <option value="normale">Normale (Défaut standard)</option>
                <option value="urgente">Urgente (Sécurité / Fuite)</option>
                <option value="critique">Critique (Danger immédiat)</option>
              </select>
            </div>
          </div>

          {/* Location precision */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Précision de localisation
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Palier gauche près de l'ascenseur, porte n°14..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          {/* AI Helper banner */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Décrivez le problème en quelques mots bruts, puis cliquez sur <strong>Structurer avec l&apos;IA</strong> pour obtenir une fiche claire et argumentée.
              </span>
            </div>
            <button
              type="button"
              onClick={handleAiAssistance}
              disabled={isAiStructuring}
              className="px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shrink-0 inline-flex items-center gap-1.5 shadow-xs"
            >
              {isAiStructuring ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Génération...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Structurer avec l&apos;IA</span>
                </>
              )}
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Objet / Titre du signalement *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Fuite d'eau continue sous l'évier du local poubelles"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
            />
          </div>

          {/* Detailed description */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Détails & Constatations factuelles *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expliquez la situation constatée, l'heure d'apparition, les conséquences éventuelles..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Déclaré par {currentUser.name} ({currentUser.apartment})
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !description.trim()}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs"
              >
                Publier le signalement
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
