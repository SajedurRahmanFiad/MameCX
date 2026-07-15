/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Terminal, 
  Play, 
  Pause, 
  Trash2, 
  Search, 
  AlertTriangle, 
  Info, 
  XCircle,
  Database,
  ArrowDown
} from 'lucide-react';
import { ServerLogEntry } from '../types';

interface LogConsoleModuleProps {
  logs: ServerLogEntry[];
  onClearLogs: () => void;
  onAddLog: (log: Omit<ServerLogEntry, 'id' | 'timestamp'>) => void;
}

export default function LogConsoleModule({
  logs,
  onClearLogs,
  onAddLog
}: LogConsoleModuleProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'INFO' | 'WARNING' | 'ERROR'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (isPlaying && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPlaying]);

  // Background logging stream simulator
  useEffect(() => {
    if (!isPlaying) return;

    const mockLogs = [
      { level: 'INFO' as const, source: 'python-bot' as const, message: 'Gemini inference executed successfully in 1.12s. Output: "Sure, let me check..."' },
      { level: 'INFO' as const, source: 'webhook-fb' as const, message: 'Valid incoming signature payload parsed. Facebook Page webhook payload active.' },
      { level: 'WARNING' as const, source: 'rag-indexer' as const, message: 'Cosine score threshold matched minimally (0.71) on file kd2.' },
      { level: 'INFO' as const, source: 'scheduler' as const, message: 'Job [CUSTOMER_FACT_EXTRACTION] dispatched to background thread.' },
      { level: 'ERROR' as const, source: 'webhook-fb' as const, message: 'Facebook API connection rejected: invalid page access token on Solas Footwear.' },
      { level: 'INFO' as const, source: 'python-bot' as const, message: 'Appended fact "Purchased serum" to Customer memory profile.' }
    ];

    const timer = setInterval(() => {
      // Pick a random mock log
      const idx = Math.floor(Math.random() * mockLogs.length);
      onAddLog(mockLogs[idx]);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying, onAddLog]);

  // Filters
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchLevel = levelFilter === 'ALL' || log.level === levelFilter;
      const matchSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.source.toLowerCase().includes(searchTerm.toLowerCase());
      return matchLevel && matchSearch;
    });
  }, [logs, levelFilter, searchTerm]);

  return (
    <div className="space-y-6" id="log-console-module">
      {/* Top Controller */}
      <div className="bg-white border border-gray-150 p-5 rounded-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-gray-700" />
              Python AI Backend Log Streams
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Live stdout tail from our cloud worker clusters. Displays agent reasoning traces, Meta Graph requests, and indexing events.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            {/* Play/Pause */}
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all flex items-center gap-1.5 ${
                isPlaying 
                  ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' 
                  : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause Stream' : 'Play Live Stream'}
            </button>

            {/* Clear */}
            <button 
              onClick={onClearLogs}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all rounded-sm flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Console
            </button>
          </div>
        </div>

        {/* Inputs & Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <input 
              type="text" 
              placeholder="Filter by keyword (e.g. Gemini, webhook, user ID)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 text-xs border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
            />
          </div>

          {/* Severity selector */}
          <div>
            <select 
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="w-full p-1.5 py-1.5 text-xs border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white font-medium text-gray-700"
            >
              <option value="ALL">All Severity Levels</option>
              <option value="INFO">INFO only</option>
              <option value="WARNING">WARNING only</option>
              <option value="ERROR">ERROR only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dark Console Monitor */}
      <div className="bg-gray-950 text-slate-100 rounded-md border border-gray-800 shadow-lg overflow-hidden flex flex-col font-mono text-[11px] leading-relaxed select-text">
        {/* Terminal Header */}
        <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-850">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            <span className="text-[10px] text-gray-400 pl-2">root@ai-cloud-service:/tail/stdout -f</span>
          </div>
          <div className="flex items-center gap-2.5 text-[10px]">
            {isPlaying && (
              <span className="flex items-center gap-1.5 text-green-400 font-semibold animate-pulse">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> LIVE STREAMING
              </span>
            )}
            <span className="text-gray-500 font-bold">{filteredLogs.length} logs displayed</span>
          </div>
        </div>

        {/* Console Log Panel */}
        <div className="p-4 overflow-y-auto max-h-[380px] h-[380px] space-y-2 select-text scroll-smooth">
          {filteredLogs.length === 0 ? (
            <p className="text-gray-500 italic text-center py-12">No system stdout telemetry matched these parameters.</p>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} className="flex items-start gap-3.5 hover:bg-gray-900/50 p-1 rounded-sm select-text transition-all">
                {/* Timestamp */}
                <span className="text-gray-500 select-none shrink-0 font-mono text-[10px]">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>

                {/* Level Tag */}
                <span className={`shrink-0 font-bold font-mono text-[9px] uppercase tracking-wider text-center w-14 py-0.2 rounded-xs select-none ${
                  log.level === 'ERROR' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  log.level === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {log.level}
                </span>

                {/* Source thread */}
                <span className="text-slate-400 font-semibold select-none shrink-0">
                  [{log.source}]
                </span>

                {/* Body Message */}
                <span className="text-slate-200 select-text font-mono tracking-tight leading-relaxed select-text text-left">
                  {log.message}
                </span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Console Indicator */}
        <div className="bg-gray-900 border-t border-gray-850 px-4 py-2 flex items-center justify-between text-[10px] text-gray-500 select-none">
          <span>Encoding: UTF-8</span>
          <span className="flex items-center gap-1">
            Stdout Buffer <ArrowDown className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
