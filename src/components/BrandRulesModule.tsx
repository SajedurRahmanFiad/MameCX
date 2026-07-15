/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Edit, 
  Check, 
  ToggleLeft, 
  ToggleRight, 
  ShieldAlert,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { BrandRule, Brand } from '../types';

interface BrandRulesModuleProps {
  rules: BrandRule[];
  brands: Brand[];
  selectedBrandId: string;
  onAddRule: (rule: Omit<BrandRule, 'id'>) => void;
  onUpdateRule: (rule: BrandRule) => void;
  onDeleteRule: (id: string) => void;
}

export default function BrandRulesModule({
  rules,
  brands,
  selectedBrandId,
  onAddRule,
  onUpdateRule,
  onDeleteRule
}: BrandRulesModuleProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRule, setEditingRule] = useState<BrandRule | null>(null);

  // Form State
  const [newRuleText, setNewRuleText] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Escalation');
  const [newPriority, setNewPriority] = useState<BrandRule['priority']>('High');
  const [newTriggerHandoff, setNewTriggerHandoff] = useState(false);

  const filteredRules = useMemo(() => {
    return rules.filter(r => selectedBrandId === 'all' || r.brandId === selectedBrandId || r.brandId === 'all');
  }, [rules, selectedBrandId]);

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;

    onAddRule({
      brandId: selectedBrandId === 'all' ? 'all' : selectedBrandId,
      category: newCategory,
      rule: newRuleText,
      description: newDesc,
      priority: newPriority,
      triggerHandoff: newTriggerHandoff,
      active: true
    });

    // Reset Form
    setNewRuleText('');
    setNewDesc('');
    setNewCategory('Escalation');
    setNewPriority('High');
    setNewTriggerHandoff(false);
    setShowAddModal(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    onUpdateRule(editingRule);
    setEditingRule(null);
  };

  const toggleRuleActive = (rule: BrandRule) => {
    onUpdateRule({
      ...rule,
      active: !rule.active
    });
  };

  return (
    <div className="space-y-6" id="brand-rules-module">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">AI Compliance & Guardrail Rules</h2>
          <p className="text-sm text-gray-500 mt-1">
            Impose hard business logic constraints, restrict promotion codes, and set trigger expressions that immediately disconnect AI to page humans.
          </p>
        </div>
        <button 
          onClick={() => {
            setShowAddModal(true);
          }}
          className="bg-gray-950 text-white hover:bg-gray-900 transition-colors px-3 py-2 text-xs font-semibold rounded-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Compliance Rule
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRules.length === 0 ? (
          <div className="md:col-span-2 bg-white border border-dashed border-gray-200 p-12 text-center rounded-md text-gray-400 text-xs">
            No guardrail rules configured for this brand yet.
          </div>
        ) : (
          filteredRules.map(rule => {
            const b = brands.find(brand => brand.id === rule.brandId);
            return (
              <div key={rule.id} className={`bg-white border p-5 rounded-md flex flex-col justify-between transition-all ${rule.active ? 'border-gray-150' : 'border-gray-100 opacity-60'}`}>
                <div className="space-y-3">
                  {/* Category and priority */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      {rule.category} {selectedBrandId === 'all' && b && `• ${b.name}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-sm font-semibold border ${
                        rule.priority === 'High' ? 'bg-red-50 border-red-100 text-red-600' :
                        rule.priority === 'Medium' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                        'bg-gray-50 border-gray-150 text-gray-500'
                      }`}>
                        {rule.priority} Priority
                      </span>
                    </div>
                  </div>

                  {/* Rule content */}
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{rule.rule}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>

                  {/* Badges/Indicators */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {rule.triggerHandoff && (
                      <span className="text-[10px] bg-red-50 border border-red-100 text-red-700 px-2 py-0.5 rounded-sm flex items-center gap-1 font-semibold">
                        <ShieldAlert className="w-3 h-3 text-red-500" /> Triggers Human Handoff
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-sm flex items-center gap-1 font-semibold border ${
                      rule.active ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-100 border-gray-150 text-gray-400'
                    }`}>
                      {rule.active ? 'Active Guardrail' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Foot actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-5">
                  <div className="flex items-center gap-1 text-xs">
                    <button 
                      onClick={() => toggleRuleActive(rule)}
                      className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium"
                    >
                      {rule.active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-gray-300" />}
                      {rule.active ? 'Disable' : 'Enable'}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <button 
                      onClick={() => setEditingRule(rule)}
                      className="text-gray-500 hover:text-gray-950 font-medium flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button 
                      onClick={() => onDeleteRule(rule.id)}
                      className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-gray-150 rounded-md max-w-lg w-full overflow-hidden shadow-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 text-sm">Add Compliance Guardrail Rule</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 font-mono text-sm">✕</button>
            </div>
            <form onSubmit={handleSubmitAdd} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Rule Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
                  >
                    <option value="Escalation">Escalation / Safety</option>
                    <option value="Product Advice">Product Advice</option>
                    <option value="Discounts & Pricing">Discounts & Pricing</option>
                    <option value="Medical Disclaimer">Medical Disclaimer</option>
                    <option value="Legal & GDPR">Legal & GDPR</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Priority Level</label>
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as BrandRule['priority'])}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white font-medium"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Rule Instruction Slogan</label>
                <input 
                  type="text" 
                  placeholder="e.g. Do not recommend flying in heavy precipitation."
                  value={newRuleText}
                  onChange={(e) => setNewRuleText(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-semibold text-gray-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Elaborated Guidelines</label>
                <textarea 
                  rows={3}
                  placeholder="Provide precise details, disclaimers, or steps that the model must inject into context when this rule triggers."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                />
              </div>

              <div className="bg-red-50 border border-red-100 p-3.5 rounded-sm flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  id="handoffCheck" 
                  checked={newTriggerHandoff}
                  onChange={(e) => setNewTriggerHandoff(e.target.checked)}
                  className="mt-0.5 w-4 h-4 border-gray-300 rounded-sm"
                />
                <div className="space-y-0.5">
                  <label htmlFor="handoffCheck" className="text-xs font-bold text-red-800 cursor-pointer">
                    Immediate Handoff Trigger
                  </label>
                  <p className="text-[11px] text-red-600">
                    Checking this forces the server to disconnect AI automation and alert human staff if the customer asks about or breaches this category.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-3 py-2 text-xs font-semibold bg-gray-950 text-white hover:bg-gray-900 rounded-sm"
                >
                  Add Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-gray-155 rounded-md max-w-lg w-full overflow-hidden shadow-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 text-sm">Edit Compliance Guardrail Rule</h3>
              <button onClick={() => setEditingRule(null)} className="text-gray-400 hover:text-gray-600 font-mono text-sm">✕</button>
            </div>
            <form onSubmit={handleSubmitEdit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Category</label>
                  <select 
                    value={editingRule.category}
                    onChange={(e) => setEditingRule({ ...editingRule, category: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
                  >
                    <option value="Escalation">Escalation / Safety</option>
                    <option value="Product Advice">Product Advice</option>
                    <option value="Discounts & Pricing">Discounts & Pricing</option>
                    <option value="Medical Disclaimer">Medical Disclaimer</option>
                    <option value="Legal & GDPR">Legal & GDPR</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Priority</label>
                  <select 
                    value={editingRule.priority}
                    onChange={(e) => setEditingRule({ ...editingRule, priority: e.target.value as BrandRule['priority'] })}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white font-medium"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Rule Instruction Slogan</label>
                <input 
                  type="text" 
                  value={editingRule.rule}
                  onChange={(e) => setEditingRule({ ...editingRule, rule: e.target.value })}
                  required
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Elaborated Guidelines</label>
                <textarea 
                  rows={3}
                  value={editingRule.description}
                  onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                />
              </div>

              <div className="bg-red-50 border border-red-100 p-3.5 rounded-sm flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  id="handoffCheckEdit" 
                  checked={editingRule.triggerHandoff}
                  onChange={(e) => setEditingRule({ ...editingRule, triggerHandoff: e.target.checked })}
                  className="mt-0.5 w-4 h-4 border-gray-300 rounded-sm"
                />
                <div className="space-y-0.5">
                  <label htmlFor="handoffCheckEdit" className="text-xs font-bold text-red-800 cursor-pointer">
                    Immediate Handoff Trigger
                  </label>
                  <p className="text-[11px] text-red-600">
                    Checking this forces the server to disconnect AI automation and alert human staff if the customer asks about or breaches this category.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-3 py-2 text-xs font-semibold bg-gray-950 text-white hover:bg-gray-900 rounded-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
