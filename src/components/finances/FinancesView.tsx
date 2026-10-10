import React from 'react';
import { useCopro } from '../../context/CoproContext';
import {
  Wallet,
  Receipt,
  Download,
  CheckCircle,
  Clock,
  PieChart,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

export const FinancesView: React.FC = () => {
  const { currentUser, residentAccount } = useCopro();

  const handleDownloadReceipt = (description: string) => {
    alert(`Téléchargement de la quittance / reçu : "${description}"`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Transparence Financière & Appels de Fonds
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi individuel des charges de copropriété et exécution du budget prévisionnel
          </p>
        </div>

        <button
          onClick={() => handleDownloadReceipt('Relevé général annuel 2026')}
          className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Télécharger mon relevé individuel</span>
        </button>
      </div>

      {/* Account Overview Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Solde de votre compte</span>
            <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {residentAccount.currentBalance.toFixed(2)} €
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Compte à jour (Aucun impayé)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Prochain appel de fonds</span>
            <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {residentAccount.nextCallAmount.toFixed(2)} €
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Échéance : <strong>{residentAccount.nextCallDate}</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Charges annuelles estimées</span>
            <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {residentAccount.annualChargesShare.toFixed(2)} €
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Base : <strong className="tabular-nums">245 / 10 000</strong> tantièmes
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Fonds de travaux (Loi ALUR)</span>
            <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {residentAccount.fundAlurShare.toFixed(2)} €
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Épargne sécurisée collective
          </div>
        </div>
      </div>

      {/* 2-Column Split: Transaction History & Global Budget Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Ledger History (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Historique des écritures comptables
            </h2>
            <span className="text-xs text-slate-500">
              Prélèvements SEPA et régularisations
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {residentAccount.history.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900">
                    {item.description}
                  </div>
                  <div className="text-slate-500">
                    Date valeur : {item.date}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`font-bold tabular-nums ${
                      item.amount > 0 ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {item.amount > 0 ? `+${item.amount.toFixed(2)}` : item.amount.toFixed(2)} €
                  </div>
                  <button
                    onClick={() => handleDownloadReceipt(item.description)}
                    className="text-[11px] text-slate-500 hover:text-slate-900 hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    <Download className="w-3 h-3" />
                    <span>Reçu</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Copro Budget Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Budget prévisionnel immeuble
              </h2>
              <span className="text-xs font-bold text-slate-900 tabular-nums">
                68 400 € / an
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Voté en AG Ordinaire - Répartition des postes de charges
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Chauffage collectif gaz & Eau chaude</span>
                  <span className="font-semibold tabular-nums">26 000 € (38%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: '38%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Maintenance, ascenseurs & réparations</span>
                  <span className="font-semibold tabular-nums">17 800 € (26%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-600 h-full rounded-full" style={{ width: '26%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Assurance multirisque & Honoraires syndic</span>
                  <span className="font-semibold tabular-nums">12 300 € (18%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Gardiennage, entretien ménager & espaces verts</span>
                  <span className="font-semibold tabular-nums">12 300 € (18%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed mt-4">
            <span className="font-semibold text-slate-900 block mb-1">
              Audit comptable du Conseil Syndical :
            </span>
            Les comptes sont vérifiés chaque trimestre par le président du Conseil Syndical (M. Vasseur) auprès du cabinet Colbert. Tous les justificatifs de factures sont à disposition.
          </div>
        </div>
      </div>
    </div>
  );
};
