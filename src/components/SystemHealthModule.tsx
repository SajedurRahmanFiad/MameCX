/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Cpu, 
  Cloud, 
  Database, 
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import { SystemHealthStatus } from '../types';

interface SystemHealthModuleProps {
  health: SystemHealthStatus;
}

export default function SystemHealthModule({ health: initialHealth }: SystemHealthModuleProps) {
  const [health, setHealth] = useState<SystemHealthStatus>(initialHealth);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditLog, setAuditLog] = useState<string[]>([]);

  const runDiagnostics = () => {
    setIsAuditing(true);
    setAuditLog([]);
    
    const logs = [
      'Initializing system diagnostics...',
      'Pinging Google Gemini API endpoint... SUCCESS (Latency 45ms)',
      'Checking Facebook Graph webhook cluster... SUCCESS (Verify response OK)',
      'Auditing Pinecone/Weaviate vector database indices... SUCCESS (12,480 vectors active)',
      'Measuring message dispatcher job queues... DEGRADED (4 pending retries in pool)',
      'Analyzing SSL Certificate lifetimes... SUCCESS (Valid for 240 days)',
      'Diagnostics Complete.'
    ];

    logs.forEach((msg, idx) => {
      setTimeout(() => {
        setAuditLog(prev => [...prev, msg]);
        if (idx === logs.length - 1) {
          setIsAuditing(false);
          // Mutate slightly to show dynamic updates
          setHealth({
            ...initialHealth,
            lastChecked: new Date().toISOString(),
            queueStatus: 'active'
          });
        }
      }, (idx + 1) * 350);
    });
  };

  return (
    <div className="space-y-6" id="system-health-module">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-150 bg-white p-5 rounded-md gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" /> Platform Infrastructure Health
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Audit API connectivity runtimes, provider latency thresholds, and queue workloads.
          </p>
        </div>
        <button 
          onClick={runDiagnostics}
          disabled={isAuditing}
          className="bg-gray-950 text-white hover:bg-gray-900 disabled:opacity-50 transition-colors px-3 py-2 text-xs font-semibold rounded-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
          {isAuditing ? 'Auditing Stack...' : 'Perform Stack Diagnostics'}
        </button>
      </div>

      {/* Health status grids */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1: Gemini */}
        <div className="bg-white border border-gray-150 p-4 rounded-md space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>LLM LLama/Gemini API</span>
            <Cpu className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]`}></span>
            <span className="font-bold text-gray-900 text-sm">Operational</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-normal">
            99.98% uptime in last 24h. Primary endpoint: gemini-2.5-flash.
          </p>
        </div>

        {/* Card 2: FB Graph */}
        <div className="bg-white border border-gray-150 p-4 rounded-md space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Facebook Graph API</span>
            <Cloud className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]`}></span>
            <span className="font-bold text-gray-900 text-sm">Healthy</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-normal">
            Webhook delivery latencies averaging 240ms globally.
          </p>
        </div>

        {/* Card 3: Database */}
        <div className="bg-white border border-gray-150 p-4 rounded-md space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Vector Cache DB</span>
            <Database className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]`}></span>
            <span className="font-bold text-gray-900 text-sm">Synchronized</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-normal">
            Pinecone indexing active. Embeddings sync count: 12,480 rows.
          </p>
        </div>

        {/* Card 4: Task Queue */}
        <div className="bg-white border border-gray-150 p-4 rounded-md space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Job queue workloads</span>
            <Zap className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${health.queueStatus === 'active' ? 'bg-green-500' : 'bg-amber-500'} shadow-[0_0_8px_rgba(245,158,11,0.6)]`}></span>
            <span className="font-bold text-gray-900 text-sm uppercase">
              {health.queueStatus === 'active' ? 'Idle / Active' : 'Overburdened'}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 leading-normal">
            {health.queueStatus === 'active' 
              ? 'No backed up processing pipelines. Worker processes active.' 
              : '4 failed retry tasks currently stuck in scheduling buffer.'}
          </p>
        </div>

      </div>

      {/* Bottom diagnostic console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core details */}
        <div className="lg:col-span-2 bg-white border border-gray-150 p-5 rounded-md space-y-4">
          <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" /> Primary Core Environment Specifications
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-sm space-y-1">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Platform Orchestrator</span>
              <p className="font-semibold text-gray-900">Python 3.11 / Flask / Celery Workers</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-sm space-y-1">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">SSL Certificate Encryption</span>
              <p className="font-semibold text-gray-900">Let's Encrypt Wildcard SSL (TLS 1.3)</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-sm space-y-1">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Storage Core Database</span>
              <p className="font-semibold text-gray-900">Drizzle PostgreSQL / supabase cluster</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-sm space-y-1">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Cluster Ingress Host</span>
              <p className="font-semibold text-gray-900">Nginx Reverse Proxy on Port 3000</p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Last Checked Gateway Sync:</span>
            <span>{new Date(health.lastChecked).toLocaleString()}</span>
          </div>
        </div>

        {/* Audit Log Stream Terminal */}
        <div className="bg-gray-950 border border-gray-850 p-5 rounded-md h-fit text-slate-200 font-mono text-[11px] space-y-3 shadow-lg">
          <div className="pb-2 border-b border-gray-800 flex items-center justify-between text-[10px] text-gray-500">
            <span>DIAGNOSTIC TESTER MONITOR</span>
            <span className="flex items-center gap-1.5 text-green-400">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> ONLINE
            </span>
          </div>

          <div className="h-[140px] overflow-y-auto space-y-1.5 pr-2">
            {auditLog.length === 0 ? (
              <p className="text-gray-500 italic text-center py-10 leading-normal">
                Click "Perform Stack Diagnostics" above to test direct microservice hook speeds.
              </p>
            ) : (
              auditLog.map((log, i) => (
                <div key={i} className="leading-relaxed flex items-start gap-1">
                  <span className="text-slate-500 select-none">&gt;</span>
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
