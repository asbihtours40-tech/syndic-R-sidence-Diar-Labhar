import React, { useState } from 'react';
import { useCopro } from '../../context/CoproContext';
import {
  Users,
  ShieldCheck,
  Send,
  Building,
  User,
  Shield,
  HelpCircle,
  FileCheck,
  Key,
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { currentRole, currentUser, messages, sendMessage } = useCopro();

  const [activeChannel, setActiveChannel] = useState<'general' | 'conseil_syndic' | 'direct_syndic'>('general');
  const [content, setContent] = useState('');

  const channels: {
    id: 'general' | 'conseil_syndic' | 'direct_syndic';
    title: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
  }[] = [
    {
      id: 'general',
      title: 'Fil Général de la Résidence',
      description: 'Espace partagé pour tous les résidents, le gardien et le syndic',
      icon: Users,
    },
    {
      id: 'conseil_syndic',
      title: 'Canal Conseil Syndical & Syndic',
      description: 'Concertation technique et administrative avec les membres élus',
      icon: ShieldCheck,
      badge: 'Élus & Syndic',
    },
    {
      id: 'direct_syndic',
      title: 'Échanges Directs avec le Syndic',
      description: 'Questions personnelles, gestion de vos lots et badges d\'accès',
      icon: Building,
      badge: 'Confidentiel',
    },
  ];

  const filteredMessages = messages.filter((m) => m.channelId === activeChannel);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    sendMessage(activeChannel, content.trim());
    setContent('');
  };

  const handleQuickQuestion = (quickText: string) => {
    setContent(quickText);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Échanges & Messagerie de Copropriété
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Canaux dédiés pour des échanges structurés, réactifs et sans perte d&apos;information
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        {/* Left Column: Channels List */}
        <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/50 p-4 space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
            Canaux d&apos;échange
          </div>

          <div className="space-y-1">
            {channels.map((chan) => {
              const Icon = chan.icon;
              const isSelected = activeChannel === chan.id;

              return (
                <button
                  key={chan.id}
                  onClick={() => setActiveChannel(chan.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-white shadow-xs border border-slate-200/80 text-slate-900'
                      : 'hover:bg-slate-100/80 text-slate-600'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isSelected ? 'bg-slate-900 text-white' : 'bg-slate-200/60 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs truncate">
                        {chan.title}
                      </span>
                      {chan.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-200 text-slate-700 font-medium whitespace-nowrap">
                          {chan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {chan.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Shortcuts for Residents */}
          <div className="pt-4 mt-4 border-t border-slate-200 px-2 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Demandes fréquentes
            </span>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => {
                  setActiveChannel('direct_syndic');
                  handleQuickQuestion('Bonjour M. Laurent, je souhaite commander un badge Vigik supplémentaire pour mon logement. Quel est le délai ?');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2"
              >
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">Commander un badge Vigik</span>
              </button>
              <button
                onClick={() => {
                  setActiveChannel('direct_syndic');
                  handleQuickQuestion('Bonjour, pouvez-vous me faire parvenir mon relevé de charges individuel pour ma déclaration ?');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2"
              >
                <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">Attestation / Relevé de charges</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Messages Thread & Input */}
        <div className="md:col-span-8 flex flex-col justify-between h-full bg-white">
          {/* Channel Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {channels.find((c) => c.id === activeChannel)?.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {channels.find((c) => c.id === activeChannel)?.description}
              </p>
            </div>
            <div className="text-xs text-slate-500">
              {filteredMessages.length} message{filteredMessages.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Messages list */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1 max-h-[460px]">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                Aucun message sur ce fil pour l&apos;instant. Engagez la discussion ci-dessous.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                const isSyndic = msg.senderRole === 'syndic';
                const isCS = msg.senderRole === 'conseil_syndical';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1 px-1">
                      {isSyndic && <Shield className="w-3 h-3 text-blue-700" />}
                      <span className="font-semibold text-slate-800">{msg.senderName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">
                        {isSyndic ? 'Syndic' : isCS ? 'Conseil Syndical' : 'Résident'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div
                      className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-slate-900 text-white rounded-tr-xs'
                          : isSyndic
                          ? 'bg-blue-50 border border-blue-200 text-slate-900 rounded-tl-xs'
                          : isCS
                          ? 'bg-amber-50 border border-amber-200 text-slate-900 rounded-tl-xs'
                          : 'bg-slate-100 text-slate-900 rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message input */}
          <form
            onSubmit={handleSend}
            className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center gap-3"
          >
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Écrire un message en tant que ${currentUser.name}...`}
              className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-xs"
            />
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors inline-flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
