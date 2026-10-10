export type UserRole = 'resident' | 'conseil_syndical' | 'syndic';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  apartment: string;
  building: string;
  floor: number;
  tantiemes: number;
  email: string;
  phone: string;
  avatar?: string;
  isOwner: boolean; // Copropriétaire vs Locataire
}

export type IncidentCategory =
  | 'ascenseur'
  | 'plomberie'
  | 'electricite'
  | 'chauffage'
  | 'securite_acces'
  | 'espaces_verts'
  | 'parties_communes'
  | 'nuisances'
  | 'toiture_facade';

export type IncidentStatus =
  | 'nouveau'
  | 'pris_en_charge'
  | 'devis_en_cours'
  | 'intervention_planifiee'
  | 'resolu';

export type UrgencyLevel = 'basse' | 'normale' | 'urgente' | 'critique';

export interface IncidentComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
  isOfficialSyndicReply?: boolean;
}

export interface Incident {
  id: string;
  title: string;
  category: IncidentCategory;
  location: string;
  building: string;
  floor?: string;
  description: string;
  urgency: UrgencyLevel;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  reportedBy: {
    id: string;
    name: string;
    role: UserRole;
    lot: string;
  };
  contractor?: {
    name: string;
    phone: string;
    specialty: string;
    interventionDate?: string;
    costEstimate?: number;
    quoteStatus?: 'soumis' | 'valide_conseil' | 'approuve';
  };
  photos?: string[];
  comments: IncidentComment[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'travaux' | 'coupure' | 'ag' | 'vie_immeuble' | 'urgent';
  createdAt: string;
  author: string;
  authorRole: string;
  pinned: boolean;
  eventDate?: string;
}

export interface AgResolution {
  id: string;
  number: number;
  title: string;
  description: string;
  type: 'majorite_simple' | 'majorite_absolue' | 'double_majorite';
  budgetEstimate?: number;
  votes: {
    pour: number;
    contre: number;
    abstention: number;
  };
  userVote?: 'pour' | 'contre' | 'abstention';
  conseilRecommendation: 'favorable' | 'defavorable' | 'reserve';
  conseilNote?: string;
}

export interface GeneralAssembly {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  quorumNeeded: number;
  currentQuorum: number;
  convocationDocUrl?: string;
  pvDocUrl?: string;
  resolutions: AgResolution[];
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'reglement' | 'pv_ag' | 'contrats' | 'diagnostics' | 'comptabilite' | 'carnet_entretien';
  year: number;
  fileSize: string;
  updatedAt: string;
  description: string;
}

export interface ResidentAccount {
  lot: string;
  building: string;
  currentBalance: number; // positive = crédit, negative = dû
  lastCallDate: string;
  nextCallDate: string;
  nextCallAmount: number;
  annualChargesShare: number;
  fundAlurShare: number;
  history: {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'appel_fonds' | 'paiement' | 'regularisation';
    paid: boolean;
  }[];
}

export interface DirectMessage {
  id: string;
  channelId: 'general' | 'conseil_syndic' | 'direct_syndic';
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
}

export interface ContractorContact {
  id: string;
  name: string;
  company: string;
  trade: string;
  phone: string;
  email: string;
  isEmergency247: boolean;
  contractActive: boolean;
  notes: string;
}
