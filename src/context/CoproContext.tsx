import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  Incident,
  IncidentStatus,
  Announcement,
  GeneralAssembly,
  DocumentItem,
  ResidentAccount,
  DirectMessage,
  ContractorContact,
} from '../types';
import {
  PROFILES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_INCIDENTS,
  INITIAL_AG,
  INITIAL_DOCUMENTS,
  INITIAL_ACCOUNT,
  INITIAL_MESSAGES,
  CONTRACTORS,
} from '../data/mockData';

interface CoproContextType {
  currentRole: UserRole;
  currentUser: UserProfile;
  setRole: (role: UserRole) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  incidents: Incident[];
  announcements: Announcement[];
  ag: GeneralAssembly;
  documents: DocumentItem[];
  residentAccount: ResidentAccount;
  messages: DirectMessage[];
  contractors: ContractorContact[];
  selectedIncident: Incident | null;
  setSelectedIncident: (inc: Incident | null) => void;
  isNewIncidentModalOpen: boolean;
  setIsNewIncidentModalOpen: (open: boolean) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  aiModalInitialContext?: string;
  openAiAssistant: (initialPrompt?: string) => void;
  // State Mutators
  addIncident: (newInc: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  addIncidentComment: (incidentId: string, content: string, isOfficialSyndicReply?: boolean) => void;
  assignContractor: (
    incidentId: string,
    contractor: {
      name: string;
      phone: string;
      specialty: string;
      interventionDate?: string;
      costEstimate?: number;
      quoteStatus?: 'soumis' | 'valide_conseil' | 'approuve';
    }
  ) => void;
  voteOnResolution: (resolutionId: string, vote: 'pour' | 'contre' | 'abstention') => void;
  sendMessage: (channelId: 'general' | 'conseil_syndic' | 'direct_syndic', content: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  resetAllData: () => void;
}

const CoproContext = createContext<CoproContextType | undefined>(undefined);

export const CoproProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const DATA_VERSION = 'v2_diarlabhar';

  // Version migration check
  if (typeof window !== 'undefined') {
    const currentVer = localStorage.getItem('coprolink_data_ver');
    if (currentVer !== DATA_VERSION) {
      localStorage.removeItem('coprolink_incidents');
      localStorage.removeItem('coprolink_announcements');
      localStorage.removeItem('coprolink_ag');
      localStorage.removeItem('coprolink_messages');
      localStorage.setItem('coprolink_data_ver', DATA_VERSION);
    }
  }

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('coprolink_role') as UserRole) || 'resident';
  });

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalInitialContext, setAiModalInitialContext] = useState<string | undefined>(undefined);

  // Stored state
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('coprolink_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('coprolink_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [ag, setAg] = useState<GeneralAssembly>(() => {
    const saved = localStorage.getItem('coprolink_ag');
    return saved ? JSON.parse(saved) : INITIAL_AG;
  });

  const [documents] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [residentAccount] = useState<ResidentAccount>(INITIAL_ACCOUNT);

  const [messages, setMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem('coprolink_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [contractors] = useState<ContractorContact[]>(CONTRACTORS);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('coprolink_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('coprolink_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('coprolink_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('coprolink_ag', JSON.stringify(ag));
  }, [ag]);

  useEffect(() => {
    localStorage.setItem('coprolink_messages', JSON.stringify(messages));
  }, [messages]);

  // Keep selected incident synchronized if list changes
  useEffect(() => {
    if (selectedIncident) {
      const refreshed = incidents.find((i) => i.id === selectedIncident.id);
      if (refreshed) {
        setSelectedIncident(refreshed);
      }
    }
  }, [incidents]);

  const currentUser = PROFILES[currentRole];

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const openAiAssistant = (initialPrompt?: string) => {
    setAiModalInitialContext(initialPrompt);
    setIsAiModalOpen(true);
  };

  const addIncident = (newInc: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const now = new Date().toISOString();
    const created: Incident = {
      ...newInc,
      id: `inc_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      comments: [
        {
          id: `c_${Date.now()}`,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorRole: currentUser.role,
          content: 'Signalement initial enregistré dans le registre de l\'immeuble.',
          createdAt: now,
        },
      ],
    };
    setIncidents((prev) => [created, ...prev]);
  };

  const updateIncidentStatus = (id: string, status: IncidentStatus) => {
    const now = new Date().toISOString();
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          const statusLabels: Record<IncidentStatus, string> = {
            nouveau: 'Nouveau',
            pris_en_charge: 'Pris en charge',
            devis_en_cours: 'Devis en cours',
            intervention_planifiee: 'Intervention planifiée',
            resolu: 'Résolu',
          };
          const systemComment = {
            id: `c_${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            content: `Changement de statut : ${statusLabels[status]} (par ${currentUser.name})`,
            createdAt: now,
            isOfficialSyndicReply: currentUser.role === 'syndic',
          };
          return {
            ...inc,
            status,
            updatedAt: now,
            comments: [...inc.comments, systemComment],
          };
        }
        return inc;
      })
    );
  };

  const addIncidentComment = (incidentId: string, content: string, isOfficialSyndicReply?: boolean) => {
    const now = new Date().toISOString();
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const newComment = {
            id: `c_${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            content,
            createdAt: now,
            isOfficialSyndicReply: isOfficialSyndicReply || currentUser.role === 'syndic',
          };
          return {
            ...inc,
            updatedAt: now,
            comments: [...inc.comments, newComment],
          };
        }
        return inc;
      })
    );
  };

  const assignContractor = (
    incidentId: string,
    contractor: {
      name: string;
      phone: string;
      specialty: string;
      interventionDate?: string;
      costEstimate?: number;
      quoteStatus?: 'soumis' | 'valide_conseil' | 'approuve';
    }
  ) => {
    const now = new Date().toISOString();
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const systemComment = {
            id: `c_${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            content: `Prestataire mandaté : ${contractor.name} (${contractor.specialty})${
              contractor.interventionDate ? ` - Intervention le ${contractor.interventionDate}` : ''
            }`,
            createdAt: now,
            isOfficialSyndicReply: true,
          };
          return {
            ...inc,
            status: contractor.interventionDate ? 'intervention_planifiee' : inc.status,
            contractor,
            updatedAt: now,
            comments: [...inc.comments, systemComment],
          };
        }
        return inc;
      })
    );
  };

  const voteOnResolution = (resolutionId: string, vote: 'pour' | 'contre' | 'abstention') => {
    setAg((prev) => {
      return {
        ...prev,
        resolutions: prev.resolutions.map((res) => {
          if (res.id === resolutionId) {
            const oldVote = res.userVote;
            const updatedVotes = { ...res.votes };

            // Remove old vote count if user changed vote
            if (oldVote && updatedVotes[oldVote] > 0) {
              updatedVotes[oldVote] -= 1;
            }

            // Add new vote count
            updatedVotes[vote] += 1;

            return {
              ...res,
              userVote: vote,
              votes: updatedVotes,
            };
          }
          return res;
        }),
      };
    });
  };

  const sendMessage = (channelId: 'general' | 'conseil_syndic' | 'direct_syndic', content: string) => {
    const newMsg: DirectMessage = {
      id: `m_${Date.now()}`,
      channelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const addAnnouncement = (newAnn: Omit<Announcement, 'id' | 'createdAt'>) => {
    const created: Announcement = {
      ...newAnn,
      id: `ann_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [created, ...prev]);
  };

  const resetAllData = () => {
    localStorage.removeItem('coprolink_incidents');
    localStorage.removeItem('coprolink_announcements');
    localStorage.removeItem('coprolink_ag');
    localStorage.removeItem('coprolink_messages');
    setIncidents(INITIAL_INCIDENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAg(INITIAL_AG);
    setMessages(INITIAL_MESSAGES);
    setSelectedIncident(null);
  };

  return (
    <CoproContext.Provider
      value={{
        currentRole,
        currentUser,
        setRole,
        activeView,
        setActiveView,
        incidents,
        announcements,
        ag,
        documents,
        residentAccount,
        messages,
        contractors,
        selectedIncident,
        setSelectedIncident,
        isNewIncidentModalOpen,
        setIsNewIncidentModalOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        aiModalInitialContext,
        openAiAssistant,
        addIncident,
        updateIncidentStatus,
        addIncidentComment,
        assignContractor,
        voteOnResolution,
        sendMessage,
        addAnnouncement,
        resetAllData,
      }}
    >
      {children}
    </CoproContext.Provider>
  );
};

export const useCopro = () => {
  const context = useContext(CoproContext);
  if (!context) {
    throw new Error('useCopro must be used within a CoproProvider');
  }
  return context;
};
