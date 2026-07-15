/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  TrendingDown,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { Brand, Conversation, Customer, CashTransaction } from '../types';

interface DashboardOverviewProps {
  brands: Brand[];
  conversations: Conversation[];
  customers: Customer[];
  transactions: CashTransaction[];
  onSelectBrand: (brandId: string) => void;
  selectedBrandId: string;
}

export default function DashboardOverview({
  brands,
  conversations,
  customers,
  transactions,
  onSelectBrand,
  selectedBrandId
}: DashboardOverviewProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  // Filter transactions based on brand scope & date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchBrand = selectedBrandId === 'all' || t.brandId === selectedBrandId || t.brandId === 'system';
      // In real app, we would parse dates, but for mock, let's include all or do mild filtering
      return matchBrand;
    });
  }, [transactions, selectedBrandId]);

  const stats = useMemo(() => {
    const brandScopeCount = selectedBrandId === 'all' ? brands.length : 1;
    const activeConversations = conversations.filter(c => selectedBrandId === 'all' || c.brandId === selectedBrandId);
    const activeCustomers = customers.filter(c => selectedBrandId === 'all' || c.brandId === selectedBrandId);
    
    // Revenue vs Cost
    let revenue = 0;
    let cost = 0;
    filteredTransactions.forEach(t => {
      if (t.type === 'revenue') {
        revenue += t.amount;
      } else {
        cost += Math.abs(t.amount);
      }
    });

    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      brandsCount: brandScopeCount,
      conversationsCount: activeConversations.length,
      customersCount: activeCustomers.length,
      revenue,
      cost,
      profit,
      margin,
      handedOffCount: activeConversations.filter(c => c.status === 'handed_off').length,
      activeAiCount: activeConversations.filter(c => c.status === 'active_ai').length
    };
  }, [brands, conversations, customers, filteredTransactions, selectedBrandId]);

  // Chart data pre-calculation (pure SVG drawing)
  const chartPoints = useMemo(() => {
    // Generate some simple coordinates for our SVG area chart based on timeRange
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 15 : 10;
    const points: { label: string; revenue: number; cost: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() - i);
      const label = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      
      // Seed slightly different heights based on actual stats to make it feel real
      const seed = Math.sin(i * 0.8) * 40 + 80;
      const factor = stats.revenue > 0 ? stats.revenue / 500 : 1;
      points.push({
        label,
        revenue: Math.round((seed + i * 12) * factor),
        cost: Math.round((seed * 0.3 + i * 4) * factor)
      });
    }
    return points;
  }, [timeRange, stats.revenue]);

  // SVG dimensions
  const width = 600;
  const height = 180;
  const padding = 30;

  const svgCoordinates = useMemo(() => {
    if (chartPoints.length === 0) return { revenuePath: '', costPath: '', points: [] };
    
    const maxVal = Math.max(...chartPoints.map(p => Math.max(p.revenue, p.cost, 100))) * 1.1;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const revCoords = chartPoints.map((p, index) => {
      const x = padding + (index / (chartPoints.length - 1)) * chartWidth;
      const y = height - padding - (p.revenue / maxVal) * chartHeight;
      return { x, y, label: p.label, revenue: p.revenue, cost: p.cost };
    });

    const costCoords = chartPoints.map((p, index) => {
      const x = padding + (index / (chartPoints.length - 1)) * chartWidth;
      const y = height - padding - (p.cost / maxVal) * chartHeight;
      return { x, y };
    });

    const revenuePath = revCoords.length > 0 
      ? `M ${revCoords[0].x} ${revCoords[0].y} ` + revCoords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ')
      : '';

    const costPath = costCoords.length > 0 
      ? `M ${costCoords[0].x} ${costCoords[0].y} ` + costCoords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ')
      : '';

    // Area fill paths
    const revenueAreaPath = revCoords.length > 0
      ? `${revenuePath} L ${revCoords[revCoords.length - 1].x} ${height - padding} L ${revCoords[0].x} ${height - padding} Z`
      : '';

    const costAreaPath = costCoords.length > 0
      ? `${costPath} L ${costCoords[costCoords.length - 1].x} ${height - padding} L ${costCoords[0].x} ${height - padding} Z`
      : '';

    return { revenuePath, costPath, revenueAreaPath, costAreaPath, points: revCoords, maxVal };
  }, [chartPoints]);

  return (
    <div className="space-y-6" id="dashboard-overview">
      {/* Top Banner section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-100 bg-white p-5 rounded-md gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            {selectedBrandId === 'all' ? 'All Workspace Operations' : brands.find(b => b.id === selectedBrandId)?.name + ' Workspace'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time automated support analytics, platform finances, and LLM throughput telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 text-xs font-medium border transition-all rounded-sm ${timeRange === '7d' ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Last 7 Days
          </button>
          <button 
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 text-xs font-medium border transition-all rounded-sm ${timeRange === '30d' ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Last 30 Days
          </button>
          <button 
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 text-xs font-medium border transition-all rounded-sm ${timeRange === 'all' ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white border border-gray-100 p-5 rounded-md flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Scope Brands</span>
            <div className="text-2xl font-bold text-gray-900 font-sans">{stats.brandsCount}</div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              {brands.filter(b => b.active).length} active tenants
            </p>
          </div>
          <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-sm text-gray-500">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-gray-100 p-5 rounded-md flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Conversations</span>
            <div className="text-2xl font-bold text-gray-900">{stats.conversationsCount}</div>
            <div className="flex gap-2 text-xs text-gray-500 mt-1">
              <span className="text-blue-600 font-medium">{stats.activeAiCount} on AI</span>
              <span>•</span>
              <span className="text-amber-600 font-medium">{stats.handedOffCount} handed off</span>
            </div>
          </div>
          <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-sm text-gray-500">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-gray-100 p-5 rounded-md flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Customers</span>
            <div className="text-2xl font-bold text-gray-900">{stats.customersCount}</div>
            <p className="text-xs text-gray-500 mt-1">
              Profile memory active
            </p>
          </div>
          <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-sm text-gray-500">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white border border-gray-100 p-5 rounded-md flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Platform Net Profit</span>
            <div className="text-2xl font-bold text-gray-900">${stats.profit.toFixed(2)}</div>
            <div className="text-xs font-medium flex items-center gap-1 mt-1 text-green-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats.margin.toFixed(0)}% Profit Margin</span>
            </div>
          </div>
          <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-sm text-gray-500">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Graph & Sidebar info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-5 rounded-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Automation Cash Flow</h3>
              <p className="text-xs text-gray-500 mt-0.5">Comparing subscription / API revenue versus LLM usage fees</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-1.5 bg-blue-600 rounded-sm"></span>
                <span className="text-gray-600">Gross Revenue (${stats.revenue.toFixed(0)})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-1.5 bg-gray-400 rounded-sm"></span>
                <span className="text-gray-600">Operations Cost (${stats.cost.toFixed(0)})</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart Component */}
          <div className="relative w-full h-[200px] mt-2">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f3f4f6" strokeWidth={1} />
              <line x1={padding} y1={(height - padding * 2) / 2 + padding} x2={width - padding} y2={(height - padding * 2) / 2 + padding} stroke="#f3f4f6" strokeWidth={1} />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth={1} />

              {/* Chart Areas (Shading) */}
              {svgCoordinates.revenueAreaPath && (
                <path d={svgCoordinates.revenueAreaPath} fill="url(#revGrad)" opacity={0.08} />
              )}
              {svgCoordinates.costAreaPath && (
                <path d={svgCoordinates.costAreaPath} fill="url(#costGrad)" opacity={0.08} />
              )}

              {/* Chart Lines */}
              {svgCoordinates.revenuePath && (
                <path d={svgCoordinates.revenuePath} fill="none" stroke="#2563eb" strokeWidth={2.5} strokeLinecap="round" />
              )}
              {svgCoordinates.costPath && (
                <path d={svgCoordinates.costPath} fill="none" stroke="#9ca3af" strokeWidth={1.5} strokeLinecap="round" strokeDasharray="3 3" />
              )}

              {/* Data Interactive Dots & Text */}
              {svgCoordinates.points.map((pt, i) => {
                const isFirst = i === 0;
                const isLast = i === svgCoordinates.points.length - 1;
                const showLabel = isFirst || isLast || i === Math.floor(svgCoordinates.points.length / 2);
                
                return (
                  <g key={i}>
                    {/* Hover hotspot */}
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={4} 
                      fill="#2563eb" 
                      stroke="#ffffff" 
                      strokeWidth={1.5} 
                      className="cursor-pointer hover:r-6 transition-all"
                    />
                    {showLabel && (
                      <text 
                        x={pt.x} 
                        y={height - 10} 
                        fill="#9ca3af" 
                        fontSize={9} 
                        textAnchor="middle"
                        fontFamily="var(--font-sans)"
                      >
                        {pt.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Axis labels */}
              <text x={padding - 5} y={padding + 4} fill="#9ca3af" fontSize={8} textAnchor="end" fontFamily="var(--font-mono)">
                ${Math.round(svgCoordinates.maxVal)}
              </text>
              <text x={padding - 5} y={height - padding + 3} fill="#9ca3af" fontSize={8} textAnchor="end" fontFamily="var(--font-mono)">
                $0
              </text>

              {/* Definitions */}
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9ca3af" />
                  <stop offset="100%" stopColor="#9ca3af" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Quick status view */}
        <div className="bg-white border border-gray-100 p-5 rounded-md space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Operations Snapshot</h3>
            <p className="text-xs text-gray-500 mt-0.5">Quick platform parameters & workload distribution.</p>
          </div>

          <div className="space-y-3.5 my-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Autonomous Resolution Rate</span>
                <span className="font-semibold text-gray-900">82.4%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-sm overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '82.4%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Handoff Cutoff Escalations</span>
                <span className="font-semibold text-amber-600">17.6%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-sm overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: '17.6%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Knowledge Index Completeness</span>
                <span className="font-semibold text-gray-900">95.0%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-sm overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Global API Gateway</span>
            <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-sm flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" /> Operational
            </span>
          </div>
        </div>
      </div>

      {/* Brand Finances Snapshot Table */}
      <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Brand Portfolio Activity</h3>
            <p className="text-xs text-gray-500 mt-0.5">High-level activity statistics by individual business workspace</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="py-3.5 px-5">Brand Workspace</th>
                <th className="py-3.5 px-5">Language</th>
                <th className="py-3.5 px-5 text-center">Open Chats</th>
                <th className="py-3.5 px-5">AI Host Model</th>
                <th className="py-3.5 px-5">LLM Provider</th>
                <th className="py-3.5 px-5 text-right">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {brands.map(brand => {
                const openChats = conversations.filter(c => c.brandId === brand.id).length;
                return (
                  <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-gray-900">{brand.name}</td>
                    <td className="py-3.5 px-5">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-sm border border-gray-200/50">{brand.defaultLanguage}</span>
                    </td>
                    <td className="py-3.5 px-5 text-center font-mono font-medium">{openChats}</td>
                    <td className="py-3.5 px-5 font-mono text-xs">{brand.llmModel}</td>
                    <td className="py-3.5 px-5 text-xs text-gray-500">{brand.llmProvider}</td>
                    <td className="py-3.5 px-5 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${brand.active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${brand.active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {brand.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button 
                        onClick={() => onSelectBrand(brand.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all"
                      >
                        Open Workspace
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
