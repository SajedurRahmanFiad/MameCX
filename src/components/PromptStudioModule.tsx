/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Save, 
  Play, 
  RefreshCw, 
  HelpCircle, 
  FileCode, 
  CheckCircle2, 
  Terminal,
  Cpu,
  BookOpen
} from 'lucide-react';
import { PromptConfig, Brand, KnowledgeDocument, BrandRule } from '../types';

interface PromptStudioModuleProps {
  configs: PromptConfig[];
  brands: Brand[];
  documents: KnowledgeDocument[];
  rules: BrandRule[];
  selectedBrandId: string;
  onUpdateConfig: (config: PromptConfig) => void;
}

export default function PromptStudioModule({
  configs,
  brands,
  documents,
  rules,
  selectedBrandId,
  onUpdateConfig
}: PromptStudioModuleProps) {
  // Sync selected brand id
  const [localBrandId, setLocalBrandId] = useState(brands[0]?.id || 'b1');
  const activeBrandId = selectedBrandId === 'all' ? localBrandId : selectedBrandId;

  // Active configuration
  const activeConfig = useMemo(() => {
    return configs.find(c => c.brandId === activeBrandId) || {
      id: 'pc_new',
      brandId: activeBrandId,
      systemPrompt: 'You are a helpful AI customer support agent...',
      toneInstructions: 'Professional and warm.',
      replyGuidelines: '1. Be polite\n2. Solve problems.',
      lastUpdated: new Date().toISOString()
    };
  }, [configs, activeBrandId]);

  // Editing state
  const [systemPrompt, setSystemPrompt] = useState(activeConfig.systemPrompt);
  const [toneInstructions, setToneInstructions] = useState(activeConfig.toneInstructions);
  const [replyGuidelines, setReplyGuidelines] = useState(activeConfig.replyGuidelines);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync edits if brand changes
  React.useEffect(() => {
    setSystemPrompt(activeConfig.systemPrompt);
    setToneInstructions(activeConfig.toneInstructions);
    setReplyGuidelines(activeConfig.replyGuidelines);
  }, [activeConfig]);

  // Sandbox testing simulator
  const [sandboxQuestion, setSandboxQuestion] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResponse, setSimResponse] = useState<string | null>(null);
  const [matchedDocs, setMatchedDocs] = useState<KnowledgeDocument[]>([]);
  const [triggeredRules, setTriggeredRules] = useState<BrandRule[]>([]);
  const [tokensUsed, setTokensUsed] = useState<{ prompt: number; output: number } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const activeBrandName = useMemo(() => {
    return brands.find(b => b.id === activeBrandId)?.name || 'Brand';
  }, [brands, activeBrandId]);

  const handleSave = () => {
    onUpdateConfig({
      ...activeConfig,
      systemPrompt,
      toneInstructions,
      replyGuidelines,
      lastUpdated: new Date().toISOString()
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxQuestion.trim()) return;

    setIsSimulating(true);
    setIsSearching(true);
    setSimResponse(null);

    // Run semantic simulation
    setTimeout(() => {
      // Find matching FAQs/docs
      const qLower = sandboxQuestion.toLowerCase();
      const scopeDocs = documents.filter(d => d.brandId === activeBrandId);
      const matches = scopeDocs.filter(d => 
        d.title.toLowerCase().split(/\s+/).some(word => word.length > 3 && qLower.includes(word)) ||
        d.content.toLowerCase().split(/\s+/).some(word => word.length > 3 && qLower.includes(word))
      );
      
      // Find matching rules
      const scopeRules = rules.filter(r => r.brandId === activeBrandId);
      const matchedRules = scopeRules.filter(r => 
        qLower.includes('refund') || qLower.includes('money') || qLower.includes('broken') || qLower.includes('allergy') || qLower.includes('sensitiv')
      );

      setMatchedDocs(matches.slice(0, 2));
      setTriggeredRules(matchedRules);

      // Formulate mock Gemini response based on retrieved facts
      let reply = `Thank you for reaching out to ${activeBrandName}! I'd be glad to help you. `;
      
      if (qLower.includes('refund') || qLower.includes('return')) {
        const returnDoc = matches.find(d => d.category === 'Return');
        if (returnDoc) {
          reply += `According to our Return & Refund Policy: ${returnDoc.content.slice(0, 150)}... If your package fits these guidelines, we can guide you on the return process.`;
        } else {
          reply += `I would be happy to check on our return options for you. Could you share your order number? Standard returns are accepted within 30 days of purchase in original packaging.`;
        }
      } else if (qLower.includes('battery') || qLower.includes('charge')) {
        const battDoc = matches.find(d => d.category === 'FAQ' && d.title.includes('Battery'));
        if (battDoc) {
          reply += `Let\'s troubleshoot your charging. First: 1. Ensure temperature is between 5°C and 40°C. 2. Verify you are using a 30W USB-C fast charger. 3. You can reset the battery by holding the power button for 15 seconds. Let me know if the status lights flash!`;
        } else {
          reply += `Please ensure you are using the official 30W charging adapter plugged into a standard wall outlet. Computer USB ports do not supply sufficient power to charge the drone battery pack.`;
        }
      } else if (qLower.includes('allergy') || qLower.includes('red') || qLower.includes('skin')) {
        const skinDoc = matches.find(d => d.category === 'Procedure' || d.category === 'Product');
        if (skinDoc) {
          reply += `Please immediately rinse the area with cool water. While our products are hypoallergenic and paraben-free, we always recommend conducting a patch test on your wrist and waiting 24 hours. If symptoms persist, we highly recommend speaking to a dermatologist!`;
        } else {
          reply += `I am so sorry if you are experiencing skin warmth! Please splash your cheeks with cool water immediately. Tell me, are you using other active serums in your skincare routine?`;
        }
      } else {
        reply += `I have checked our system memory and knowledge files, but I couldn't find a direct instruction regarding "${sandboxQuestion}". I will do my best to support you using our standard guidelines. Can you provide a bit more context?`;
      }

      // Append tone style guides
      if (activeBrandId === 'b2') {
        reply += ` 🌸 We want to make sure your skin barrier feels completely loved and hydrated! Let me know if you have any questions, gorgeous. ✨`;
      } else {
        reply += ` Please let me know if there is anything else I can clarify to get you back up and running!`;
      }

      setSimResponse(reply);
      setTokensUsed({
        prompt: 450 + matches.length * 200 + matchedRules.length * 80,
        output: reply.split(/\s+/).length + 20
      });
      setIsSearching(false);
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6" id="prompt-studio-module">
      {/* Header and Scoper */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-150 bg-white p-5 rounded-md gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" /> Prompt & Tone Studio
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Refine system personality instructions, format output guidelines, and test responses in real-time.
          </p>
        </div>
        {selectedBrandId === 'all' ? (
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-gray-400 font-medium">Configure Brand:</span>
            <select 
              value={localBrandId}
              onChange={(e) => setLocalBrandId(e.target.value)}
              className="text-xs p-1.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white font-semibold text-gray-700"
            >
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-sm text-gray-700 font-sans">
            Brand Workspace: {activeBrandName}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Prompt Editor Forms */}
        <div className="space-y-5 bg-white border border-gray-150 p-5 rounded-md">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-gray-500" /> Active System Prompt Block
            </h3>
            <span className="text-[10px] font-mono text-gray-400">
              Last saved: {new Date(activeConfig.lastUpdated).toLocaleDateString()}
            </span>
          </div>

          <div className="space-y-4">
            {/* System prompt instruction */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                Core System Persona Prompt
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-pointer" title="The master instructions loaded at the start of every LLM conversation." />
              </label>
              <textarea 
                rows={5}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono leading-relaxed"
                placeholder="Act as the chief customer assistant..."
              />
            </div>

            {/* Tone Guidelines */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                Brand Tone & Writing Modifiers
              </label>
              <textarea 
                rows={3}
                value={toneInstructions}
                onChange={(e) => setToneInstructions(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono leading-relaxed"
                placeholder="Use clear terminology, friendly greetings..."
              />
            </div>

            {/* Safe guidelines */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                Compliance & Formatting Restrictions
              </label>
              <textarea 
                rows={3}
                value={replyGuidelines}
                onChange={(e) => setReplyGuidelines(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono leading-relaxed"
                placeholder="1. Never quote prices\n2. Include disclaimers..."
              />
            </div>

            {/* Save Buttons */}
            <div className="flex items-center justify-end pt-3 border-t border-gray-100">
              <button 
                type="button"
                onClick={handleSave}
                className="bg-gray-950 text-white hover:bg-gray-900 transition-colors px-4 py-2 text-xs font-semibold rounded-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                {saveSuccess ? 'Changes Saved!' : 'Commit Prompt Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Sandbox Simulator */}
        <div className="bg-slate-50 border border-gray-150 p-5 rounded-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-purple-600" /> Support Sandbox Simulator
              </h3>
              <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-full font-bold">
                MOCK GEMINI INFERENCE
              </span>
            </div>

            <p className="text-xs text-gray-500 leading-normal">
              Simulate chat interactions. Type a customer question to test how your system prompt, current RAG knowledge base, and brand rules combine to formulate a response.
            </p>

            <form onSubmit={handleSimulate} className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 block">Test Customer Inquiry</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. Battery reset doesn't work, can I get a refund?"
                  value={sandboxQuestion}
                  onChange={(e) => setSandboxQuestion(e.target.value)}
                  className="flex-1 text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
                />
                <button 
                  type="submit"
                  disabled={isSimulating || !sandboxQuestion.trim()}
                  className="bg-purple-700 text-white hover:bg-purple-800 transition-colors px-4 py-2.5 text-xs font-semibold rounded-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isSimulating ? 'Inference...' : 'Simulate'}
                </button>
              </div>
            </form>

            {/* Simulation Results Output */}
            {simResponse && (
              <div className="space-y-4 pt-3 animate-fade-in">
                {/* Simulated Response */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Simulated AI Output Reply
                  </span>
                  <div className="bg-white border border-gray-200 p-3.5 rounded-sm text-xs text-gray-700 leading-relaxed font-sans shadow-2xs">
                    {simResponse}
                  </div>
                </div>

                {/* Metadata details */}
                <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-gray-200">
                  {/* Matching docs */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      RAG Retrieved Context
                    </span>
                    {matchedDocs.length === 0 ? (
                      <span className="text-[11px] text-gray-400 italic">No matching document chunks.</span>
                    ) : (
                      <div className="space-y-1.5">
                        {matchedDocs.map(doc => (
                          <div key={doc.id} className="text-[11px] text-gray-600 bg-gray-100/70 border border-gray-200 p-1.5 rounded-xs flex items-center gap-1.5">
                            <BookOpen className="w-3 h-3 text-blue-500 shrink-0" />
                            <span className="truncate font-semibold">{doc.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fired Rules */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Compliance Auditing
                    </span>
                    {triggeredRules.length === 0 ? (
                      <span className="text-[11px] text-gray-400 italic">No rule limits breached.</span>
                    ) : (
                      <div className="space-y-1.5">
                        {triggeredRules.map(rule => (
                          <div key={rule.id} className="text-[11px] text-red-700 bg-red-50 border border-red-100 p-1.5 rounded-xs flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3 h-3 text-red-500 shrink-0" />
                            <span className="truncate">{rule.rule}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sandbox Footer Metrics */}
          {tokensUsed && (
            <div className="pt-4 border-t border-gray-200 mt-6 flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <span>Token consumption estimate:</span>
              <div className="flex gap-3 text-gray-600 font-medium">
                <span>Prompt: {tokensUsed.prompt}</span>
                <span>Output: {tokensUsed.output}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
