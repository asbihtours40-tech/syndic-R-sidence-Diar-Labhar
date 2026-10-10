import React from 'react';
import { useCopro } from '../../context/CoproContext';
import {
  PhoneCall,
  Mail,
  Shield,
  Building,
  Wrench,
  Clock,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

export const DirectoryView: React.FC = () => {
  const { contractors } = useCopro();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Annuaire des Intervenants & Numéros d&apos;Urgence
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Contacts directs du cabinet de syndic, du conseil syndical et des artisans sous contrat
        </p>
      </div>

      {/* Emergency 24/7 Red Alert Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-100 text-rose-800 rounded-lg shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-rose-950">
                Urgences & Poste de Sécurité Résidence Diar Labhar (24h/24 & 7j/7)
              </h2>
              <p className="text-xs text-rose-800 mt-0.5 leading-relaxed max-w-2xl">
                En cas d&apos;urgence nocturne, fuite sur colonne principale, panne de portail ou incident sécurité autour de la piscine :
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:+212661245580"
              className="px-3.5 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs tabular-nums"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Syndic IKRAM : +212 6 61 24 55 80</span>
            </a>
          </div>
        </div>
      </div>

      {/* Key Roles Grid: Syndic & Conseil Syndical */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Syndic Manager */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Building className="w-4 h-4 text-slate-700" />
            <span className="font-semibold text-slate-900 uppercase tracking-wider">
              Syndic Professionnel Mandaté
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900">
            Syndic - IKRAM -
          </h3>
          <p className="text-xs text-slate-600">
            Gestionnaire en charge : <strong>Mme Ikram</strong><br />
            Bureau du Syndic : <strong>Entrée principale de la Résidence Diar Labhar, Mansouria</strong>
          </p>

          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
              <span className="tabular-nums">+212 6 61 24 55 80 (Disponible pour les résidents)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>syndic.ikram.diarlabhar@gmail.com</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Permanence d&apos;accueil : Du Lundi au Samedi au bureau du syndic Diar Labhar
            </div>
          </div>
        </div>

        {/* Conseil Syndical */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-amber-700" />
            <span className="font-semibold text-slate-900 uppercase tracking-wider">
              Conseil Syndical (Membres Élus)
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900">
            Représentants des Copropriétaires
          </h3>
          <p className="text-xs text-slate-600">
            Président du CS : <strong>Mohamed Tazi</strong> (Appt A04, Bâtiment A)<br />
            Membres du bureau : <strong>Karim El Fassi</strong> (Lot B06), <strong>Fatima Zahra</strong> (Lot C02)
          </p>

          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>cs.diarlabhar@gmail.com</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Échanges réguliers avec le Syndic IKRAM pour le suivi des travaux et de la piscine.
            </div>
          </div>
        </div>
      </div>

      {/* Contracted Artisans List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Artisans & Entreprises de Maintenance Sous Contrat
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractors.map((ctr) => (
            <div
              key={ctr.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs mb-1">
                  <span className="font-semibold text-slate-900">{ctr.trade}</span>
                  {ctr.isEmergency247 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-rose-100 text-rose-800 font-bold uppercase tracking-wider">
                      24h / 7j
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold text-slate-900">{ctr.name}</div>
                <div className="text-xs text-slate-500">{ctr.company}</div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {ctr.notes}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={`tel:${ctr.phone.replace(/\s/g, '')}`}
                  className="font-semibold text-slate-900 hover:text-slate-700 inline-flex items-center gap-1.5 tabular-nums"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                  <span>{ctr.phone}</span>
                </a>

                <a
                  href={`mailto:${ctr.email}`}
                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                  title={ctr.email}
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
