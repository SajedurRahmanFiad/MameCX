/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Plus, 
  Brain, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  BadgeAlert,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Customer, CustomerFact, Brand } from '../types';

interface CustomersModuleProps {
  customers: Customer[];
  brands: Brand[];
  selectedBrandId: string;
  onUpdateCustomer: (customer: Customer) => void;
}

export default function CustomersModule({
  customers,
  brands,
  selectedBrandId,
  onUpdateCustomer
}: CustomersModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(customers[0]?.id || null);

  // Manual Fact Creation State
  const [newFactText, setNewFactText] = useState('');
  const [newFactSource, setNewFactSource] = useState('Manual Entry');
  const [newFactConfidence, setNewFactConfidence] = useState(0.95);

  // Scoped lists
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchBrand = selectedBrandId === 'all' || c.brandId === selectedBrandId;
      const matchSearch = c.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.city.toLowerCase().includes(searchTerm.toLowerCase());
      return matchBrand && matchSearch;
    });
  }, [customers, selectedBrandId, searchTerm]);

  // Active customer row
  const activeCustomer = useMemo(() => {
    return customers.find(c => c.id === activeCustomerId) || filteredCustomers[0] || null;
  }, [customers, activeCustomerId, filteredCustomers]);

  React.useEffect(() => {
    if (activeCustomer && activeCustomer.id !== activeCustomerId) {
      setActiveCustomerId(activeCustomer.id);
    }
  }, [activeCustomer, activeCustomerId]);

  const handleAddFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactText.trim() || !activeCustomer) return;

    const newFact: CustomerFact = {
      id: `f_manual_${Date.now()}`,
      fact: newFactText,
      confidence: newFactConfidence,
      source: newFactSource,
      createdAt: new Date().toISOString()
    };

    onUpdateCustomer({
      ...activeCustomer,
      facts: [...activeCustomer.facts, newFact],
      updatedAt: new Date().toISOString()
    });

    setNewFactText('');
    setNewFactSource('Manual Entry');
    setNewFactConfidence(0.95);
  };

  const handleDeleteFact = (factId: string) => {
    if (!activeCustomer) return;

    onUpdateCustomer({
      ...activeCustomer,
      facts: activeCustomer.facts.filter(f => f.id !== factId),
      updatedAt: new Date().toISOString()
    });
  };

  const handleEditSummary = (summary: string) => {
    if (!activeCustomer) return;

    onUpdateCustomer({
      ...activeCustomer,
      summary,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 border border-gray-150 bg-white rounded-md overflow-hidden min-h-[580px]" id="customers-module">
      
      {/* Left Column: Customer Directory */}
      <div className="border-r border-gray-150 flex flex-col justify-between h-full bg-slate-50/30">
        
        {/* Search header */}
        <div className="p-4 border-b border-gray-100 bg-white space-y-3">
          <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-gray-700" />
            Customer Directory
          </h3>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <input 
              type="text" 
              placeholder="Search name, email, or region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
            />
          </div>
        </div>

        {/* Directory Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 max-h-[460px]">
          {filteredCustomers.length === 0 ? (
            <p className="text-xs text-gray-400 italic text-center py-12">No customer profiles match this search.</p>
          ) : (
            filteredCustomers.map(cust => {
              const b = brands.find(brand => brand.id === cust.brandId);
              const isActive = activeCustomerId === cust.id;

              return (
                <div 
                  key={cust.id}
                  onClick={() => setActiveCustomerId(cust.id)}
                  className={`p-3.5 cursor-pointer text-left transition-colors space-y-1 ${isActive ? 'bg-white border-l-2 border-l-gray-950' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-950 text-xs truncate max-w-[150px]">{cust.displayName}</span>
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1 py-0.5 border border-gray-200/50 rounded-sm uppercase tracking-wide">
                      {b?.name.split(' ')[0]}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 truncate max-w-[210px]">{cust.email}</p>
                  
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                    <MapPin className="w-3 h-3 text-gray-300" />
                    <span>{cust.city}</span>
                    <span>•</span>
                    <span className="font-semibold text-purple-700 flex items-center gap-0.5">
                      <Brain className="w-2.5 h-2.5" /> {cust.facts.length} memories
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Center & Right Column: Customer Details & Memory Matrix */}
      <div className="lg:col-span-2 flex flex-col h-full bg-white max-h-[580px] overflow-y-auto">
        
        {activeCustomer ? (
          <div className="p-5 space-y-5">
            
            {/* Profile Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-950 tracking-tight">{activeCustomer.displayName}</h3>
                <span className="text-xs text-gray-400 font-mono">Customer ID: {activeCustomer.id}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-500 font-medium bg-gray-50 border border-gray-100 p-2 rounded-sm shrink-0">
                <span className="font-semibold text-gray-700">Language: {activeCustomer.language}</span>
                <span>•</span>
                <span className="font-semibold text-gray-700">Region: {activeCustomer.city}</span>
              </div>
            </div>

            {/* Profile Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-150 p-3.5 rounded-md space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Contact Credentials</span>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{activeCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{activeCustomer.phone}</span>
                  </div>
                </div>
              </div>

              {/* Summary Editor */}
              <div className="border border-gray-150 p-3.5 rounded-md space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">AI Synapse Summary</span>
                <textarea 
                  rows={2}
                  value={activeCustomer.summary}
                  onChange={(e) => handleEditSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-2 text-xs rounded-sm focus:outline-hidden focus:border-gray-950 leading-relaxed font-sans"
                />
              </div>
            </div>

            {/* AI Memories Matrix Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
                  AI Sync Memory Vault ({activeCustomer.facts.length})
                </span>
                <span className="text-[10px] text-gray-400 italic">Extracted automatically from chat context</span>
              </div>

              {/* Manual fact adder */}
              <form onSubmit={handleAddFact} className="flex gap-2 p-3 bg-gray-50 border border-gray-150 rounded-sm">
                <input 
                  type="text"
                  placeholder="Insert custom customer memory rule, preference, or fact..."
                  value={newFactText}
                  onChange={(e) => setNewFactText(e.target.value)}
                  required
                  className="flex-1 text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
                />
                <button 
                  type="submit"
                  className="bg-gray-950 hover:bg-gray-900 text-white px-3 py-1.5 text-xs font-semibold rounded-sm shrink-0 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Memorize
                </button>
              </form>

              {/* Memory List */}
              <div className="space-y-2.5">
                {activeCustomer.facts.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-6 text-center">No remembered customer parameters detected.</p>
                ) : (
                  activeCustomer.facts.map(fact => (
                    <div key={fact.id} className="border border-gray-150 p-3 rounded-md flex items-start justify-between gap-4 bg-white hover:bg-slate-50/50 transition-all">
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 leading-relaxed break-words">{fact.fact}</p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <span className="font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded-xs border border-gray-150/50 uppercase tracking-wider text-[8px]">{fact.source}</span>
                          <span>•</span>
                          <span className="font-mono">Confidence: <strong className="text-purple-600 font-bold">{(fact.confidence * 100).toFixed(0)}%</strong></span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleDeleteFact(fact.id)}
                        className="text-gray-400 hover:text-red-700 transition-colors shrink-0"
                        title="Erase memory fact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center text-gray-400">
            <Users className="w-12 h-12 text-gray-200 mb-2" />
            <h4 className="font-semibold text-gray-700">No Customers Found</h4>
            <p className="text-xs text-gray-500 mt-1">Refine your search parameters or check filters.</p>
          </div>
        )}

      </div>

    </div>
  );
}
