/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Cpu, 
  ShieldAlert, 
  CheckCircle, 
  AlertCircle,
  Clock,
  ArrowLeftRight,
  Filter,
  CheckCircle2,
  Lock,
  LockOpen,
  Paperclip,
  ArrowRight
} from 'lucide-react';
import { Conversation, ChatMessage, Brand } from '../types';

interface ConversationsModuleProps {
  conversations: Conversation[];
  brands: Brand[];
  selectedBrandId: string;
  onUpdateConversation: (conversation: Conversation) => void;
}

export default function ConversationsModule({
  conversations,
  brands,
  selectedBrandId,
  onUpdateConversation
}: ConversationsModuleProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active_ai' | 'handed_off' | 'closed'>('all');
  const [activeChatId, setActiveChatId] = useState<string | null>(conversations[0]?.id || null);
  
  // Custom message input state
  const [replyText, setReplyText] = useState('');

  // Scoped conversations
  const filteredChats = useMemo(() => {
    return conversations.filter(c => {
      const matchBrand = selectedBrandId === 'all' || c.brandId === selectedBrandId;
      const matchStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchBrand && matchStatus;
    });
  }, [conversations, selectedBrandId, filterStatus]);

  // Keep selected chat within available list if it changes
  const activeChat = useMemo(() => {
    return conversations.find(c => c.id === activeChatId) || filteredChats[0] || null;
  }, [conversations, activeChatId, filteredChats]);

  // Sync active chat id if current goes missing
  React.useEffect(() => {
    if (activeChat && activeChat.id !== activeChatId) {
      setActiveChatId(activeChat.id);
    }
  }, [activeChat, activeChatId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChat) return;

    const newMessage: ChatMessage = {
      id: `m_manual_${Date.now()}`,
      role: 'assistant',
      content: replyText,
      timestamp: new Date().toISOString()
    };

    onUpdateConversation({
      ...activeChat,
      latestMessage: replyText,
      latestTimestamp: newMessage.timestamp,
      messages: [...activeChat.messages, newMessage]
    });

    setReplyText('');
  };

  const handleHandoffToggle = () => {
    if (!activeChat) return;
    
    const isCurrentlyHandedOff = activeChat.status === 'handed_off';
    const newStatus = isCurrentlyHandedOff ? 'active_ai' : 'handed_off';
    
    const systemNotice: ChatMessage = {
      id: `m_sys_${Date.now()}`,
      role: 'system',
      content: isCurrentlyHandedOff 
        ? 'Automation released back to AI Assistant by human administrator.' 
        : 'Conversation locked by Administrator. AI automation suspended.',
      timestamp: new Date().toISOString()
    };

    onUpdateConversation({
      ...activeChat,
      status: newStatus,
      handoffReason: isCurrentlyHandedOff ? undefined : 'Manually intercepted by Administrator panel.',
      messages: [...activeChat.messages, systemNotice]
    });
  };

  const handleCloseChat = () => {
    if (!activeChat) return;
    const isCurrentlyClosed = activeChat.status === 'closed';
    const newStatus = isCurrentlyClosed ? 'active_ai' : 'closed';

    const systemNotice: ChatMessage = {
      id: `m_sys_close_${Date.now()}`,
      role: 'system',
      content: isCurrentlyClosed 
        ? 'Conversation reopened. AI Agent monitoring active.' 
        : 'Conversation marked as resolved. Session closed.',
      timestamp: new Date().toISOString()
    };

    onUpdateConversation({
      ...activeChat,
      status: newStatus,
      messages: [...activeChat.messages, systemNotice]
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 border border-gray-150 bg-white rounded-md overflow-hidden min-h-[620px]" id="conversations-module">
      
      {/* Left Column: Thread List */}
      <div className="border-r border-gray-150 flex flex-col justify-between h-full bg-slate-50/50">
        
        {/* Header Filter */}
        <div className="p-4 border-b border-gray-100 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-gray-700" />
              Active Channels
            </h3>
            <span className="text-[10px] font-bold bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
              {filteredChats.length} open
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 border border-gray-100 p-0.5 rounded-sm bg-gray-50 text-[10px] font-semibold text-gray-500">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`py-1 text-center rounded-xs transition-all ${filterStatus === 'all' ? 'bg-white text-gray-900 shadow-2xs border border-gray-150' : 'hover:text-gray-900'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus('active_ai')}
              className={`py-1 text-center rounded-xs transition-all ${filterStatus === 'active_ai' ? 'bg-white text-blue-600 shadow-2xs border border-gray-150' : 'hover:text-gray-900'}`}
            >
              AI Live
            </button>
            <button 
              onClick={() => setFilterStatus('handed_off')}
              className={`py-1 text-center rounded-xs transition-all ${filterStatus === 'handed_off' ? 'bg-white text-amber-600 shadow-2xs border border-gray-150' : 'hover:text-gray-900'}`}
            >
              Handoffs
            </button>
            <button 
              onClick={() => setFilterStatus('closed')}
              className={`py-1 text-center rounded-xs transition-all ${filterStatus === 'closed' ? 'bg-white text-gray-600 shadow-2xs border border-gray-150' : 'hover:text-gray-900'}`}
            >
              Closed
            </button>
          </div>
        </div>

        {/* Thread Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 max-h-[500px]">
          {filteredChats.length === 0 ? (
            <p className="text-xs text-gray-400 italic text-center py-12">No conversations match the selected parameters.</p>
          ) : (
            filteredChats.map(chat => {
              const brand = brands.find(b => b.id === chat.brandId);
              const isActive = activeChatId === chat.id;

              return (
                <div 
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`p-3.5 cursor-pointer text-left transition-colors space-y-1.5 ${isActive ? 'bg-white border-l-2 border-l-gray-950 font-medium' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-xs truncate max-w-[140px]">{chat.customerName}</span>
                    <span className="text-[10px] text-gray-400">{new Date(chat.latestTimestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>

                  <p className="text-[11px] text-gray-500 line-clamp-1 truncate max-w-[210px]">
                    {chat.latestMessage}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] bg-gray-100 border border-gray-200/50 px-1.5 py-0.5 rounded-sm text-gray-500 uppercase font-bold tracking-wide">
                      {brand?.name.split(' ')[0]}
                    </span>

                    {chat.status === 'handed_off' ? (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-150 px-1.5 py-0.2 rounded-xs flex items-center gap-0.5 uppercase tracking-wide">
                        <ShieldAlert className="w-2.5 h-2.5" /> Handoff
                      </span>
                    ) : chat.status === 'closed' ? (
                      <span className="text-[9px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.2 rounded-xs uppercase tracking-wide">
                        Closed
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-150 px-1.5 py-0.2 rounded-xs flex items-center gap-0.5 uppercase tracking-wide">
                        <Cpu className="w-2.5 h-2.5" /> AI active
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Center & Right Column: Message Console */}
      <div className="lg:col-span-2 flex flex-col justify-between h-full bg-white">
        
        {activeChat ? (
          <div className="flex flex-col justify-between h-full min-h-[620px]">
            
            {/* Active Thread Bar Header */}
            <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 text-xs">{activeChat.customerName}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    activeChat.status === 'handed_off' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                    activeChat.status === 'closed' ? 'bg-gray-100 border-gray-200 text-gray-500' :
                    'bg-green-50 border-green-200 text-green-700'
                  }`}>
                    {activeChat.status === 'handed_off' ? 'Pending Human Takeover' : 
                     activeChat.status === 'closed' ? 'Closed resolved' : 'Managed by Gemini AI'}
                  </span>
                </div>
                {activeChat.handoffReason && (
                  <p className="text-[10px] text-amber-700 font-medium">
                    Reason: {activeChat.handoffReason}
                  </p>
                )}
              </div>

              {/* Handoff/Close controls */}
              <div className="flex items-center gap-2">
                {/* Handoff Toggle Lock */}
                <button 
                  onClick={handleHandoffToggle}
                  className={`px-2.5 py-1.5 text-xs font-semibold border transition-colors rounded-sm flex items-center gap-1.5 ${
                    activeChat.status === 'handed_off' 
                      ? 'bg-amber-600 border-amber-600 text-white hover:bg-amber-700' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  title={activeChat.status === 'handed_off' ? 'Release conversation control back to AI bot' : 'Intercept chat and suspend AI bot'}
                >
                  {activeChat.status === 'handed_off' ? (
                    <>
                      <LockOpen className="w-3.5 h-3.5" />
                      Release back to AI
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      Handoff to Human
                    </>
                  )}
                </button>

                {/* Close/Resolve */}
                <button 
                  onClick={handleCloseChat}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${activeChat.status === 'closed' ? 'text-green-500' : 'text-gray-400'}`} />
                  {activeChat.status === 'closed' ? 'Reopen Session' : 'Mark Resolved'}
                </button>
              </div>
            </div>

            {/* Chats Bubbles Screen */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[420px] bg-slate-50/20">
              {activeChat.messages.map((msg, i) => {
                const isSystem = msg.role === 'system';
                const isAgent = msg.role === 'assistant';

                if (isSystem) {
                  return (
                    <div key={msg.id || i} className="flex justify-center my-2">
                      <div className="text-[10px] font-semibold text-gray-500 bg-gray-100/75 border border-gray-200/50 px-3 py-1 rounded-sm text-center max-w-sm italic flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={msg.id || i} 
                    className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[80%] space-y-1">
                      {/* Name tag */}
                      <span className={`text-[10px] font-bold text-gray-400 block px-1 ${isAgent ? 'text-right' : 'text-left'}`}>
                        {isAgent ? 'Gemini AI Agent' : activeChat.customerName}
                      </span>

                      {/* Bubble */}
                      <div className={`p-3 text-xs leading-relaxed border rounded-md shadow-2xs ${
                        isAgent 
                          ? 'bg-gray-950 border-gray-900 text-white font-sans' 
                          : 'bg-white border-gray-150 text-gray-800 font-sans'
                      }`}>
                        {msg.content}
                      </div>

                      {/* Timestamp */}
                      <span className={`text-[9px] text-gray-400 block px-1 ${isAgent ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Console Bar */}
            <div className="p-4 border-t border-gray-150 bg-white">
              {activeChat.status === 'closed' ? (
                <div className="bg-gray-50 border border-gray-100 p-3 rounded-sm text-center text-xs text-gray-400 italic">
                  This conversation is marked as resolved. Reopen the session above to send a reply.
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text"
                    placeholder={activeChat.status === 'handed_off' 
                      ? "Type reply to customer as human agent... AI is suspended." 
                      : "Type message to send... (Doing so will also hold the conversation)"}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                    className="flex-1 text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-sans"
                  />
                  <button 
                    type="submit"
                    className="bg-gray-950 hover:bg-gray-900 text-white px-4 py-2 rounded-sm transition-colors flex items-center justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center text-gray-400">
            <MessageSquare className="w-12 h-12 text-gray-200 mb-2" />
            <h4 className="font-semibold text-gray-700">No Channels Found</h4>
            <p className="text-xs text-gray-500 mt-1">Select a brand workspace or change filter parameters.</p>
          </div>
        )}

      </div>

    </div>
  );
}
