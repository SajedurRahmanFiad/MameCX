/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Key, 
  FileCheck, 
  Cpu, 
  Trash2, 
  Plus, 
  Settings, 
  Save, 
  HelpCircle, 
  ListRestart, 
  Sparkles,
  User,
  Shield,
  Clock,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  Search,
  Check
} from 'lucide-react';
import { 
  TrainingExample, 
  StyleExample, 
  DashboardUser, 
  SecretKey, 
  AuditLogEntry, 
  BackgroundJob, 
  DashboardSettings,
  Brand,
  ChatMessage
} from '../types';

// ==========================================
// 1. CONVERSATION TRAINING MODULE
// ==========================================
interface TrainingProps {
  examples: TrainingExample[];
  brands: Brand[];
  selectedBrandId: string;
  onAddExample: (ex: Omit<TrainingExample, 'id' | 'createdAt'>) => void;
  onDeleteExample: (id: string) => void;
}

export function ConversationTrainingModule({ examples, brands, selectedBrandId, onAddExample, onDeleteExample }: TrainingProps) {
  // New Training Entry Form States
  const [title, setTitle] = useState('');
  
  // Custom message constructor list
  const [constructedMessages, setConstructedMessages] = useState<Omit<ChatMessage, 'id' | 'timestamp'>[]>([
    { role: 'customer', content: '' },
    { role: 'assistant', content: '' }
  ]);

  const filteredExamples = useMemo(() => {
    return examples.filter(ex => selectedBrandId === 'all' || ex.brandId === selectedBrandId || ex.isGlobal || ex.brandId === 'all');
  }, [examples, selectedBrandId]);

  const handleAddMessageField = (role: 'customer' | 'assistant') => {
    setConstructedMessages([...constructedMessages, { role, content: '' }]);
  };

  const handleFieldChange = (index: number, val: string) => {
    const updated = [...constructedMessages];
    updated[index].content = val;
    setConstructedMessages(updated);
  };

  const handleDeleteField = (index: number) => {
    setConstructedMessages(constructedMessages.filter((_, idx) => idx !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || constructedMessages.some(m => !m.content.trim())) {
      alert('Please fill out the example title and all chat message contents.');
      return;
    }

    // Format for app state
    const formattedMessages: ChatMessage[] = constructedMessages.map((m, idx) => ({
      id: `m_train_${Date.now()}_${idx}`,
      role: m.role,
      content: m.content,
      timestamp: new Date().toISOString()
    }));

    onAddExample({
      brandId: selectedBrandId === 'all' ? 'all' : selectedBrandId,
      title,
      isGlobal: selectedBrandId === 'all',
      messages: formattedMessages
    });

    // Reset Form
    setTitle('');
    setConstructedMessages([
      { role: 'customer', content: '' },
      { role: 'assistant', content: '' }
    ]);
  };

  return (
    <div className="space-y-6" id="conversation-training">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">AI Training Examples (Few-Shot Prompting)</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Create exact chat conversations that are appended directly to the LLM system prompt context, teaching the chatbot by template example.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Create/Simulate Training Example */}
        <form onSubmit={handleSave} className="bg-white border border-gray-150 p-5 rounded-md space-y-4">
          <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              Example Training Builder
            </h3>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Example Title</label>
              <input 
                type="text" 
                placeholder="e.g. Dealing with shipping damages" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
              />
            </div>

            {/* Simulated Chat Constructor */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-600 block">Construct Dialog Sequence</span>
              
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {constructedMessages.map((msg, index) => (
                  <div key={index} className="flex gap-2.5 items-start bg-gray-50 border border-gray-150 p-2.5 rounded-sm">
                    <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-xs ${
                      msg.role === 'customer' ? 'bg-white border border-gray-200 text-gray-600' : 'bg-gray-950 text-white'
                    }`}>
                      {msg.role}
                    </span>
                    <textarea 
                      rows={1}
                      placeholder={msg.role === 'customer' ? 'Hi, I received my package broken...' : 'I am so sorry to hear that...'}
                      value={msg.content}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      className="flex-1 text-xs bg-transparent focus:outline-hidden resize-none py-0.5 leading-relaxed font-sans"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleDeleteField(index)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Add message fields triggers */}
              <div className="flex gap-2 text-xs">
                <button 
                  type="button" 
                  onClick={() => handleAddMessageField('customer')}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-1.5 rounded-sm font-medium"
                >
                  + Add Customer Message
                </button>
                <button 
                  type="button" 
                  onClick={() => handleAddMessageField('assistant')}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-1.5 rounded-sm font-medium"
                >
                  + Add AI Message
                </button>
              </div>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              className="w-full bg-gray-950 text-white hover:bg-gray-900 transition-colors py-2 text-xs font-semibold rounded-sm flex items-center justify-center gap-1.5"
            >
              Add Training Example
            </button>
          </div>
        </form>

        {/* Right Side: List existing examples */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Saved Training Scenarios ({filteredExamples.length})
          </span>

          <div className="space-y-4 max-h-[460px] overflow-y-auto">
            {filteredExamples.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 p-12 text-center rounded-md text-gray-400 text-xs">
                No custom scenarios saved in few-shot database.
              </div>
            ) : (
              filteredExamples.map(ex => (
                <div key={ex.id} className="bg-white border border-gray-150 p-4 rounded-md space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xs">{ex.title}</h4>
                      <span className="text-[10px] text-gray-400">Created: {new Date(ex.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button 
                      onClick={() => onDeleteExample(ex.id)}
                      className="text-gray-400 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Message Bubbles layout preview */}
                  <div className="space-y-1.5 bg-gray-50 p-3 rounded-sm text-[11px] font-sans border border-gray-100">
                    {ex.messages.map((m, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className={`font-bold shrink-0 ${m.role === 'customer' ? 'text-gray-500' : 'text-purple-700'}`}>
                          {m.role === 'customer' ? 'Cust:' : 'Agent:'}
                        </span>
                        <p className="text-gray-700 italic">"{m.content}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. STYLE EXAMPLES MODULE
// ==========================================
interface StyleProps {
  examples: StyleExample[];
  brands: Brand[];
  selectedBrandId: string;
  onAddStyle: (st: Omit<StyleExample, 'id'>) => void;
  onDeleteStyle: (id: string) => void;
}

export function StyleExamplesModule({ examples, brands, selectedBrandId, onAddStyle, onDeleteStyle }: StyleProps) {
  // New Style Rule Form
  const [title, setTitle] = useState('');
  const [trigger, setTrigger] = useState('');
  const [idealReply, setIdealReply] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<StyleExample['priority']>('Normal');

  const filteredStyle = useMemo(() => {
    return examples.filter(ex => selectedBrandId === 'all' || ex.brandId === selectedBrandId || ex.brandId === 'all');
  }, [examples, selectedBrandId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !trigger.trim() || !idealReply.trim()) return;

    onAddStyle({
      brandId: selectedBrandId === 'all' ? 'all' : selectedBrandId,
      title,
      triggerText: trigger,
      idealReply,
      notes,
      priority
    });

    setTitle('');
    setTrigger('');
    setIdealReply('');
    setNotes('');
  };

  return (
    <div className="space-y-6" id="style-presets">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Tone Style & Copywrite Guidelines</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Store perfect ideal answers to customer inquiries. Teach the AI specific tone and copywrite details for key brand subjects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creator panel */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-150 p-5 rounded-md space-y-4 h-fit col-span-1">
          <h3 className="font-semibold text-gray-900 text-sm">Create Style Preset</h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Preset Label</label>
            <input 
              type="text" 
              placeholder="e.g. Explaining hyaluronic acid" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full text-xs p-2 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Trigger Inquiry</label>
            <input 
              type="text" 
              placeholder="e.g. My face feels dry after application..." 
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              required
              className="w-full text-xs p-2 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Ideal Reply Template</label>
            <textarea 
              rows={3}
              placeholder="Write the perfect model answer..." 
              value={idealReply}
              onChange={(e) => setIdealReply(e.target.value)}
              required
              className="w-full text-xs p-2 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Editorial/Formatting Notes</label>
            <input 
              type="text" 
              placeholder="e.g. Keep sensory adjectives focused on hydration..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gray-950 text-white hover:bg-gray-900 py-2 text-xs font-semibold rounded-sm transition-colors"
          >
            Save Style Preset
          </button>
        </form>

        {/* Style Records list */}
        <div className="lg:col-span-2 space-y-3.5">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Active Style Guidelines ({filteredStyle.length})
          </span>

          <div className="space-y-4 max-h-[460px] overflow-y-auto">
            {filteredStyle.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 p-12 text-center rounded-md text-gray-400 text-xs">
                No style presets configured yet.
              </div>
            ) : (
              filteredStyle.map(st => (
                <div key={st.id} className="bg-white border border-gray-150 p-4 rounded-md space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-gray-900 text-xs">{st.title}</h4>
                      <button onClick={() => onDeleteStyle(st.id)} className="text-gray-400 hover:text-red-700 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs space-y-1.5">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Ideal reply formulation</span>
                      <p className="bg-gray-50 p-3 border border-gray-100 rounded-sm italic text-gray-700 leading-relaxed font-sans">
                        "{st.idealReply}"
                      </p>
                    </div>
                  </div>

                  {st.notes && (
                    <div className="text-[10px] text-gray-500 bg-slate-50 p-2 border border-slate-100 rounded-sm flex items-center gap-1.5">
                      <span className="font-bold text-gray-400">Notes:</span>
                      <span>{st.notes}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. USERS MODULE
// ==========================================
interface UsersProps {
  users: DashboardUser[];
  brands: Brand[];
  onToggleUser: (id: string) => void;
}

export function UsersModule({ users, brands, onToggleUser }: UsersProps) {
  return (
    <div className="space-y-6" id="dashboard-users">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Platform Operators Directory</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Review operator system privileges, dashboard access roles, and assign tenant scope privileges.
        </p>
      </div>

      <div className="bg-white border border-gray-150 rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <th className="py-3 px-5">Operator Name</th>
              <th className="py-3 px-5">System Role</th>
              <th className="py-3 px-5">Privileged Brands</th>
              <th className="py-3 px-5 text-right">Activity Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 border border-gray-200">
                      {u.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xs">{u.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5">
                  <span className={`text-[10px] px-2 py-0.5 border rounded-sm font-semibold uppercase tracking-wider ${
                    u.role === 'admin' ? 'bg-purple-50 border-purple-100 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-5 text-xs">
                  {u.assignedBrands[0] === '*' ? (
                    <span className="font-semibold text-gray-800">Global (All Tenants)</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {u.assignedBrands.map(bId => {
                        const bName = brands.find(b=>b.id===bId)?.name || bId;
                        return (
                          <span key={bId} className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-xs font-semibold text-[10px]">
                            {bName}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </td>
                <td className="py-3 px-5 text-right">
                  <button 
                    onClick={() => onToggleUser(u.id)}
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                      u.active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-400'
                    }`}
                  >
                    {u.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 4. SECRETS MODULE
// ==========================================
interface SecretsProps {
  secrets: SecretKey[];
  brands: Brand[];
}

export function SecretsModule({ secrets, brands }: SecretsProps) {
  const [viewId, setViewId] = useState<string | null>(null);
  const [copyId, setCopyId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopyId(id);
    setTimeout(() => setCopyId(null), 1500);
  };

  return (
    <div className="space-y-6" id="api-secrets">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">API Secrets & Keyring Management</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Securely manage external platform integration tokens and secrets. Never exposed inside frontend browser clients during chatbot runs.
        </p>
      </div>

      <div className="bg-white border border-gray-150 rounded-md overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <th className="py-3 px-5">Secret Name (Var)</th>
              <th className="py-3 px-5">Token Scope</th>
              <th className="py-3 px-5">Encrypted Secret value</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700 font-sans">
            {secrets.map(sec => {
              const brandName = sec.brandId ? (brands.find(b=>b.id===sec.brandId)?.name || sec.brandId) : 'Global central';
              return (
                <tr key={sec.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-5 font-mono text-xs font-bold text-gray-900">{sec.name}</td>
                  <td className="py-3 px-5">
                    <span className={`text-[10px] px-2 py-0.5 border rounded-sm font-semibold uppercase tracking-wider ${
                      sec.scope === 'global' ? 'bg-purple-50 border-purple-100 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}>
                      {sec.scope}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{brandName}</p>
                  </td>
                  <td className="py-3 px-5 font-mono text-xs text-slate-500">
                    {viewId === sec.id ? sec.keyMasked : '••••••••••••••••••••••••••••••••'}
                  </td>
                  <td className="py-3 px-5 text-right space-x-2">
                    <button 
                      onClick={() => setViewId(viewId === sec.id ? null : sec.id)}
                      className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {viewId === sec.id ? <EyeOff className="w-4 h-4 inline" /> : <Eye className="w-4 h-4 inline" />}
                    </button>
                    <button 
                      onClick={() => handleCopy(sec.id, sec.keyMasked)}
                      className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {copyId === sec.id ? <Check className="w-4 h-4 text-green-500 inline" /> : <Copy className="w-4 h-4 inline" />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 5. AUDIT LOG MODULE
// ==========================================
interface AuditProps {
  logs: AuditLogEntry[];
}

export function AuditLogModule({ logs }: AuditProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return logs.filter(l => 
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase())
    );
  }, [logs, search]);

  return (
    <div className="space-y-6" id="audit-logs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">System Security Audit Trails</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            trace configuration edits, chatbot prompt revisions, and webhook deactivations recorded across platform administrators.
          </p>
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          <input 
            type="text" 
            placeholder="Search action or operator..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-150 rounded-md overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <th className="py-3 px-5">Timestamp</th>
              <th className="py-3 px-5">Operator</th>
              <th className="py-3 px-5">Action ID</th>
              <th className="py-3 px-5">Description details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-xs text-gray-400 italic">No audit records found matching query.</td>
              </tr>
            ) : (
              filtered.map(l => (
                <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-5 font-mono text-xs text-gray-400">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(l.timestamp).toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-5 font-bold text-gray-900 text-xs">{l.user}</td>
                  <td className="py-3 px-5">
                    <span className="text-[10px] font-mono font-semibold bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded-sm">
                      {l.action}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-gray-500 text-xs leading-normal">{l.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 6. JOBS MODULE
// ==========================================
interface JobsProps {
  jobs: BackgroundJob[];
  onTriggerJob: (id: string) => void;
}

export function JobsModule({ jobs, onTriggerJob }: JobsProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all');

  const filtered = useMemo(() => {
    return jobs.filter(j => filter === 'all' || j.status === filter);
  }, [jobs, filter]);

  return (
    <div className="space-y-6" id="background-jobs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Asynchronous Background Job Queues</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Audit automatic re-indexing pipelines, Facebook retry loops, and customer profile synchronization queues.
          </p>
        </div>

        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="text-xs p-1.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white font-semibold text-gray-700"
        >
          <option value="all">All Queue Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="bg-white border border-gray-150 rounded-md overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <th className="py-3 px-5">Job ID</th>
              <th className="py-3 px-5">Task Kind</th>
              <th className="py-3 px-5">Attempts</th>
              <th className="py-3 px-5">Task Payload parameters</th>
              <th className="py-3 px-5 text-right">Job Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {filtered.map(job => (
              <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-5 font-mono text-xs text-gray-400">{job.id}</td>
                <td className="py-3 px-5 font-semibold text-gray-900 text-xs">{job.kind}</td>
                <td className="py-3 px-5 font-mono text-xs">{job.attempts} runs</td>
                <td className="py-3 px-5">
                  <span className="font-mono text-[10px] text-gray-500 bg-gray-50 border border-gray-150 px-2 py-1 rounded-sm block max-w-xs truncate" title={job.payload}>
                    {job.payload}
                  </span>
                  {job.error && <p className="text-[10px] text-red-500 mt-1 font-semibold">{job.error}</p>}
                </td>
                <td className="py-3 px-5 text-right">
                  {job.status === 'failed' ? (
                    <button 
                      onClick={() => onTriggerJob(job.id)}
                      className="px-2 py-0.5 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-sm flex items-center gap-1 inline-flex ml-auto"
                    >
                      <ListRestart className="w-3 h-3" /> Retry Task
                    </button>
                  ) : (
                    <span className={`text-[10px] px-2 py-0.5 border rounded-full font-bold uppercase tracking-wider ${
                      job.status === 'completed' ? 'bg-green-50 border-green-200 text-green-700' :
                      job.status === 'processing' ? 'bg-blue-50 border-blue-200 text-blue-700 animate-pulse' :
                      'bg-gray-100 border-gray-200 text-gray-500'
                    }`}>
                      {job.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 7. SETTINGS MODULE
// ==========================================
interface SettingsProps {
  settings: DashboardSettings;
  brands: Brand[];
  onSaveSettings: (settings: DashboardSettings) => void;
}

export function SettingsModule({ settings: initialSettings, brands, onSaveSettings }: SettingsProps) {
  const [appName, setAppName] = useState(initialSettings.appName);
  const [adminEmail, setAdminEmail] = useState(initialSettings.adminEmail);
  const [defaultBrandId, setDefaultBrandId] = useState(initialSettings.defaultBrandId);
  const [refreshInterval, setRefreshInterval] = useState(initialSettings.refreshIntervalSeconds);
  const [enableNotify, setEnableNotify] = useState(initialSettings.enableNotifications);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      appName,
      adminEmail,
      defaultBrandId,
      refreshIntervalSeconds: refreshInterval,
      enableNotifications: enableNotify
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="bg-white border border-gray-150 p-6 rounded-md space-y-6 max-w-xl" id="dashboard-settings">
      <div className="pb-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-700" />
          Dashboard Settings & Preferences
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Configure platform identification variables and polling refreshes.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Application Title Name</label>
          <input 
            type="text" 
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            required
            className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Primary Administrator Alert Email</label>
          <input 
            type="email" 
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
            className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Default Brand Workspace</label>
            <select 
              value={defaultBrandId}
              onChange={(e) => setDefaultBrandId(e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
            >
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Logs refresh interval (seconds)</label>
            <input 
              type="number" 
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              required
              className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input 
            type="checkbox" 
            id="notifyCheck" 
            checked={enableNotify}
            onChange={(e) => setEnableNotify(e.target.checked)}
            className="w-4 h-4 border-gray-300 rounded-sm"
          />
          <label htmlFor="notifyCheck" className="text-xs font-medium text-gray-600 cursor-pointer">
            Send immediate email alerts on critical human handoffs
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
        <button 
          type="submit"
          className="bg-gray-950 hover:bg-gray-900 text-white px-4 py-2 text-xs font-semibold rounded-sm transition-all flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          {saveSuccess ? 'Settings Saved!' : 'Save Preferences'}
        </button>
      </div>
    </form>
  );
}
