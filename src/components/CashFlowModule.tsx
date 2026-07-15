/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  Filter
} from 'lucide-react';
import { CashTransaction, Brand } from '../types';

interface CashFlowModuleProps {
  transactions: CashTransaction[];
  brands: Brand[];
  selectedBrandId: string;
  onAddTransaction: (tx: Omit<CashTransaction, 'id'>) => void;
}

export default function CashFlowModule({
  transactions,
  brands,
  selectedBrandId,
  onAddTransaction
}: CashFlowModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'revenue' | 'cost'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Create Manual Tx States
  const [showAddModal, setShowAddModal] = useState(false);
  const [txType, setTxType] = useState<'revenue' | 'cost'>('revenue');
  const [txCat, setTxCat] = useState<'subscription' | 'api_usage' | 'server' | 'other'>('subscription');
  const [txAmt, setTxAmt] = useState('');
  const [txDesc, setTxDesc] = useState('');

  // Scoped lists
  const filteredTxs = useMemo(() => {
    return transactions.filter(t => {
      const matchBrand = selectedBrandId === 'all' || t.brandId === selectedBrandId || t.brandId === 'system' || t.brandId === 'all';
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      const matchCat = categoryFilter === 'all' || t.category === categoryFilter;
      const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.brandName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchBrand && matchType && matchCat && matchSearch;
    });
  }, [transactions, selectedBrandId, typeFilter, categoryFilter, searchTerm]);

  // Financial Summary stats
  const totals = useMemo(() => {
    let grossRev = 0;
    let netCost = 0;
    filteredTxs.forEach(t => {
      if (t.type === 'revenue') {
        grossRev += t.amount;
      } else {
        netCost += Math.abs(t.amount);
      }
    });
    return {
      grossRev,
      netCost,
      profit: grossRev - netCost,
      margin: grossRev > 0 ? ((grossRev - netCost) / grossRev) * 100 : 0
    };
  }, [filteredTxs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(txAmt);
    if (isNaN(amt) || amt <= 0) return;

    const targetBrandId = selectedBrandId === 'all' ? 'all' : selectedBrandId;
    const brandName = targetBrandId === 'all' ? 'Global Workspace' : (brands.find(b => b.id === targetBrandId)?.name || 'Tenant');

    onAddTransaction({
      date: new Date().toISOString().split('T')[0],
      brandId: targetBrandId,
      brandName,
      type: txType,
      category: txCat,
      amount: txType === 'cost' ? -Math.abs(amt) : Math.abs(amt),
      description: txDesc
    });

    // Reset Form
    setTxAmt('');
    setTxDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6" id="cash-flow-module">
      {/* Overview financial stat grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Rev */}
        <div className="bg-white border border-gray-100 p-5 rounded-md flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Gross platform Revenue</span>
            <div className="text-2xl font-bold text-blue-600">${totals.grossRev.toFixed(2)}</div>
            <p className="text-xs text-gray-400 mt-1">Subscriptions & usage metering</p>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-sm">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Cost */}
        <div className="bg-white border border-gray-100 p-5 rounded-md flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Operational Costs</span>
            <div className="text-2xl font-bold text-red-500">${totals.netCost.toFixed(2)}</div>
            <p className="text-xs text-gray-400 mt-1">Gemini & Facebook API routing costs</p>
          </div>
          <div className="p-2 bg-red-50 text-red-500 rounded-sm">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-white border border-gray-100 p-5 rounded-md flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Platform profit margin</span>
            <div className="text-2xl font-bold text-green-600">${totals.profit.toFixed(2)}</div>
            <p className="text-xs font-medium text-green-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {totals.margin.toFixed(0)}% Margin
            </p>
          </div>
          <div className="p-2 bg-green-50 text-green-600 rounded-sm">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Controls Header */}
      <div className="bg-white border border-gray-150 p-5 rounded-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gray-700" />
              Cash Ledger History
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Review transaction histories, filter payments, and audit operational cash flows.
            </p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gray-950 text-white hover:bg-gray-900 transition-colors px-3 py-2 text-xs font-semibold rounded-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Transaction
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          {/* Search bar */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search by brand name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
            />
          </div>

          {/* Type filter */}
          <div>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full p-2 py-2 text-xs border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white font-medium text-gray-700"
            >
              <option value="all">All Types</option>
              <option value="revenue">Revenue (+)</option>
              <option value="cost">Expenses (-)</option>
            </select>
          </div>

          {/* Cat filter */}
          <div>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 py-2 text-xs border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white font-medium text-gray-700"
            >
              <option value="all">All Categories</option>
              <option value="subscription">Subscriptions</option>
              <option value="api_usage">API Overages</option>
              <option value="server">Core Server cost</option>
              <option value="other">Other Fees</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white border border-gray-150 rounded-md overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-xs">
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Tenant / Node</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Description</th>
                <th className="py-3 px-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-gray-400 italic">No transactional entries match these constraints.</td>
                </tr>
              ) : (
                filteredTxs.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-all">
                    <td className="py-3 px-5 font-mono text-xs text-gray-400">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {tx.date}</span>
                    </td>
                    <td className="py-3 px-5 font-semibold text-gray-900">{tx.brandName}</td>
                    <td className="py-3 px-5">
                      <span className={`text-[10px] px-2 py-0.5 border rounded-sm font-semibold uppercase tracking-wide ${
                        tx.category === 'subscription' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                        tx.category === 'api_usage' ? 'bg-purple-50 border-purple-100 text-purple-700' :
                        tx.category === 'server' ? 'bg-red-50 border-red-100 text-red-700' :
                        'bg-gray-100 border-gray-200 text-gray-500'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-gray-500 max-w-sm truncate" title={tx.description}>{tx.description}</td>
                    <td className={`py-3 px-5 text-right font-semibold font-mono text-xs ${
                      tx.type === 'revenue' ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {tx.type === 'revenue' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-gray-150 rounded-md max-w-md w-full overflow-hidden shadow-lg animate-scale-up">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 text-sm">Add Financial Transaction</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 font-mono text-sm">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Transaction Type</label>
                  <select 
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
                  >
                    <option value="revenue">Revenue (+)</option>
                    <option value="cost">Cost / Expense (-)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Category</label>
                  <select 
                    value={txCat}
                    onChange={(e) => setTxCat(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
                  >
                    <option value="subscription">Subscription</option>
                    <option value="api_usage">API Metering</option>
                    <option value="server">Server Cost</option>
                    <option value="other">Other Charge</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Amount ($ USD)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="299.00"
                  value={txAmt}
                  onChange={(e) => setTxAmt(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Description</label>
                <input 
                  type="text" 
                  placeholder="Monthly Enterprise license fee..."
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  required
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
                  Post Ledger Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
