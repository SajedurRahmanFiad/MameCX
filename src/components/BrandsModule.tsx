/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  RotateCw, 
  Check, 
  Settings, 
  Globe, 
  Volume2, 
  Smartphone,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Brand } from '../types';

interface BrandsModuleProps {
  brands: Brand[];
  onAddBrand: (brand: Omit<Brand, 'id' | 'createdAt'>) => void;
  onUpdateBrand: (brand: Brand) => void;
  onSelectBrand: (brandId: string) => void;
}

export default function BrandsModule({
  brands,
  onAddBrand,
  onUpdateBrand,
  onSelectBrand
}: BrandsModuleProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  
  // New Brand Form State
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandSlug, setNewBrandSlug] = useState('');
  const [newBrandLang, setNewBrandLang] = useState('English');
  const [newBrandTone, setNewBrandTone] = useState('Friendly, professional');
  const [newBrandHandoff, setNewBrandHandoff] = useState('Hold on, transferring to our human team.');
  const [newBrandProvider, setNewBrandProvider] = useState('Google Gemini');
  const [newBrandModel, setNewBrandModel] = useState('gemini-2.5-flash');

  // API secret visual state helper
  const [viewApiKeyId, setViewApiKeyId] = useState<string | null>(null);

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim() || !newBrandSlug.trim()) return;
    
    onAddBrand({
      name: newBrandName,
      slug: newBrandSlug.toLowerCase().replace(/\s+/g, '-'),
      defaultLanguage: newBrandLang,
      tone: newBrandTone,
      handoffMessage: newBrandHandoff,
      llmProvider: newBrandProvider,
      llmModel: newBrandModel,
      apiKeySet: true,
      active: true
    });

    // Reset Form
    setNewBrandName('');
    setNewBrandSlug('');
    setNewBrandLang('English');
    setNewBrandTone('Friendly, professional');
    setNewBrandHandoff('Hold on, transferring to our human team.');
    setShowAddModal(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;
    onUpdateBrand(editingBrand);
    setEditingBrand(null);
  };

  const toggleBrandActive = (brand: Brand) => {
    onUpdateBrand({
      ...brand,
      active: !brand.active
    });
  };

  const simulateRotateKey = (brandId: string) => {
    alert(`Rotated API Gateway token for brand ${brandId}. Stored in system keychain.`);
  };

  return (
    <div className="space-y-6" id="brands-module">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Brand Tenants Workspace</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure standalone LLM credentials, default language tones, and handoff actions for individual tenants.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gray-950 text-white hover:bg-gray-900 transition-colors px-3 py-2 text-xs font-semibold rounded-sm flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Brand
        </button>
      </div>

      {/* Grid of existing brands */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {brands.map(brand => (
          <div key={brand.id} className="bg-white border border-gray-150 rounded-md flex flex-col justify-between p-5 hover:shadow-sm transition-all">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">{brand.name}</h3>
                  <span className="text-xs text-gray-400 font-mono">slug: /{brand.slug}</span>
                </div>
                <button 
                  onClick={() => toggleBrandActive(brand)}
                  className={`px-2 py-0.5 text-[11px] font-semibold border rounded-full ${brand.active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                >
                  {brand.active ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Specs */}
              <div className="space-y-2 border-t border-b border-gray-50 py-3.5 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Language</span>
                  <span className="font-medium text-gray-800">{brand.defaultLanguage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5" /> Core Tone</span>
                  <span className="font-medium text-gray-800 truncate max-w-[150px]" title={brand.tone}>{brand.tone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" /> Host Model</span>
                  <span className="font-mono text-[11px] text-gray-800 bg-gray-50 px-1.5 py-0.5 border border-gray-100 rounded-sm">{brand.llmModel}</span>
                </div>
              </div>

              {/* Config items */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Escalation Handoff Prompt</span>
                <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-sm line-clamp-2 italic leading-relaxed">
                  "{brand.handoffMessage}"
                </p>
              </div>

              {/* Secrets view */}
              <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-100 p-2 rounded-sm font-mono">
                <span className="text-gray-400">Tenant Gateway Secret</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-[11px]">
                    {viewApiKeyId === brand.id ? `sec_token_94f83_${brand.slug}` : '••••••••••••••••'}
                  </span>
                  <button 
                    onClick={() => setViewApiKeyId(viewApiKeyId === brand.id ? null : brand.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {viewApiKeyId === brand.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Action panel footer */}
            <div className="grid grid-cols-3 border-t border-gray-100 pt-4 mt-5 gap-2">
              <button 
                onClick={() => setEditingBrand(brand)}
                className="text-center py-1.5 text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors rounded-sm flex items-center justify-center gap-1"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
              <button 
                onClick={() => simulateRotateKey(brand.id)}
                className="text-center py-1.5 text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors rounded-sm flex items-center justify-center gap-1"
                title="Rotate Auth Token"
              >
                <RotateCw className="w-3 h-3" /> Reset
              </button>
              <button 
                onClick={() => onSelectBrand(brand.id)}
                className="text-center py-1.5 text-xs font-semibold bg-gray-950 text-white hover:bg-gray-900 transition-colors rounded-sm"
              >
                Open Workspace
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Brand Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-gray-150 rounded-md max-w-lg w-full overflow-hidden shadow-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 text-base">Provision New Support Tenant</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 font-mono text-sm">✕</button>
            </div>
            <form onSubmit={handleSubmitAdd} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Brand Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Acme Wearables" 
                    value={newBrandName}
                    onChange={(e) => {
                      setNewBrandName(e.target.value);
                      setNewBrandSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }}
                    required
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Slug ID (URL Route)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. acme-wearables" 
                    value={newBrandSlug}
                    onChange={(e) => setNewBrandSlug(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Core Language</label>
                  <select 
                    value={newBrandLang}
                    onChange={(e) => setNewBrandLang(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">LLM Provider</label>
                  <select 
                    value={newBrandProvider}
                    onChange={(e) => {
                      setNewBrandProvider(e.target.value);
                      setNewBrandModel(e.target.value === 'Google Gemini' ? 'gemini-2.5-flash' : 'gpt-4o-mini');
                    }}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
                  >
                    <option value="Google Gemini">Google Gemini</option>
                    <option value="OpenAI">OpenAI</option>
                    <option value="Anthropic">Anthropic</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">LLM Target Model</label>
                <input 
                  type="text" 
                  value={newBrandModel}
                  onChange={(e) => setNewBrandModel(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Tone Guidance Slogans</label>
                <input 
                  type="text" 
                  placeholder="e.g. Enthusiastic, helpful, safety-first" 
                  value={newBrandTone}
                  onChange={(e) => setNewBrandTone(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Fallback Handoff Message</label>
                <textarea 
                  rows={2}
                  placeholder="The message sent when human handoff triggers" 
                  value={newBrandHandoff}
                  onChange={(e) => setNewBrandHandoff(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                />
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
                  Provision Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {editingBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-gray-155 rounded-md max-w-lg w-full overflow-hidden shadow-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 text-base">Edit Tenant: {editingBrand.name}</h3>
              <button onClick={() => setEditingBrand(null)} className="text-gray-400 hover:text-gray-600 font-mono text-sm">✕</button>
            </div>
            <form onSubmit={handleSubmitEdit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Brand Name</label>
                <input 
                  type="text" 
                  value={editingBrand.name}
                  onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                  required
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Core Language</label>
                  <select 
                    value={editingBrand.defaultLanguage}
                    onChange={(e) => setEditingBrand({ ...editingBrand, defaultLanguage: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">LLM Provider</label>
                  <select 
                    value={editingBrand.llmProvider}
                    onChange={(e) => setEditingBrand({ ...editingBrand, llmProvider: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
                  >
                    <option value="Google Gemini">Google Gemini</option>
                    <option value="OpenAI">OpenAI</option>
                    <option value="Anthropic">Anthropic</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">LLM Model Target</label>
                <input 
                  type="text" 
                  value={editingBrand.llmModel}
                  onChange={(e) => setEditingBrand({ ...editingBrand, llmModel: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Tone Guidance</label>
                <input 
                  type="text" 
                  value={editingBrand.tone}
                  onChange={(e) => setEditingBrand({ ...editingBrand, tone: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Handoff Fallback Message</label>
                <textarea 
                  rows={2}
                  value={editingBrand.handoffMessage}
                  onChange={(e) => setEditingBrand({ ...editingBrand, handoffMessage: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setEditingBrand(null)}
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
