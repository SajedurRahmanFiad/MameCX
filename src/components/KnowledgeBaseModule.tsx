/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  FileText, 
  Trash2, 
  Edit2, 
  BookOpen, 
  Database,
  ArrowRight,
  Filter,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { KnowledgeDocument, Brand } from '../types';

interface KnowledgeBaseModuleProps {
  documents: KnowledgeDocument[];
  brands: Brand[];
  selectedBrandId: string;
  onAddDoc: (doc: Omit<KnowledgeDocument, 'id' | 'updatedAt'>) => void;
  onUpdateDoc: (doc: KnowledgeDocument) => void;
  onDeleteDoc: (id: string) => void;
}

export default function KnowledgeBaseModule({
  documents,
  brands,
  selectedBrandId,
  onAddDoc,
  onUpdateDoc,
  onDeleteDoc
}: KnowledgeBaseModuleProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');

  // Modal control
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<KnowledgeDocument | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeDocument['category']>('FAQ');

  // Interactive retrieval tester state
  const [testQuery, setTestQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [retrievedDocs, setRetrievedDocs] = useState<{ doc: KnowledgeDocument; score: number; preview: string }[]>([]);

  const categories: KnowledgeDocument['category'][] = ['FAQ', 'Delivery', 'Return', 'Procedure', 'Product', 'Ad-specific'];

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchBrand = selectedBrandId === 'all' || doc.brandId === selectedBrandId || doc.brandId === 'all';
      const matchCat = catFilter === 'all' || doc.category === catFilter;
      const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchBrand && matchCat && matchSearch;
    });
  }, [documents, selectedBrandId, catFilter, searchTerm]);

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddDoc({
      brandId: selectedBrandId === 'all' ? 'all' : selectedBrandId,
      title: newTitle,
      content: newContent,
      category: newCategory,
      status: 'indexed'
    });

    // Reset Form
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;
    onUpdateDoc(editingDoc);
    setEditingDoc(null);
  };

  // RAG retrieval search test simulator
  const handleTestRetrieval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate API search query delay
    setTimeout(() => {
      const queryWords = testQuery.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      
      const searchScope = documents.filter(d => selectedBrandId === 'all' || d.brandId === selectedBrandId || d.brandId === 'all');
      
      const results = searchScope.map(doc => {
        let matches = 0;
        queryWords.forEach(word => {
          if (doc.title.toLowerCase().includes(word)) matches += 3;
          if (doc.content.toLowerCase().includes(word)) matches += 1;
        });

        // Basic score simulation
        let score = 0.15;
        if (matches > 0) {
          score = Math.min(0.98, 0.4 + (matches * 0.08) + Math.random() * 0.05);
        } else if (doc.title.toLowerCase().includes(testQuery.toLowerCase()) || doc.content.toLowerCase().includes(testQuery.toLowerCase())) {
          score = 0.94;
        }

        // Highlight matching snippet
        let preview = doc.content.slice(0, 140) + '...';
        if (queryWords.length > 0) {
          const firstWord = queryWords[0];
          const idx = doc.content.toLowerCase().indexOf(firstWord);
          if (idx !== -1) {
            const start = Math.max(0, idx - 40);
            const end = Math.min(doc.content.length, idx + 100);
            preview = (start > 0 ? '...' : '') + doc.content.slice(start, end) + (end < doc.content.length ? '...' : '');
          }
        }

        return { doc, score, preview };
      })
      .filter(item => item.score > 0.25 || testQuery.length > 10)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // top 3 matching chunks

      setRetrievedDocs(results);
      setIsSearching(false);
    }, 700);
  };

  return (
    <div className="space-y-6" id="knowledge-base-module">
      {/* Search Header panel */}
      <div className="bg-white border border-gray-150 p-5 rounded-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-gray-700" />
              RAG Knowledge Corpus
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage facts, procedures, guides and policy files referenced by Gemini.
            </p>
          </div>
          <button 
            onClick={() => {
              setShowAddModal(true);
            }}
            className="bg-gray-950 text-white hover:bg-gray-900 transition-colors px-3 py-2 text-xs font-semibold rounded-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Document
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Search bar */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search title, guidelines, or content body..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
            />
          </div>

          {/* Category selection */}
          <div className="sm:col-span-1">
            <select 
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="w-full p-2 py-2 text-xs border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Split List and RAG Test Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Knowledge Documents ({filteredDocs.length})
            </span>
            <span className="text-xs text-gray-400">
              Double-click to expand or click Edit to modify.
            </span>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 py-12 text-center rounded-md text-gray-400 text-xs">
              No matching knowledge source documents found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocs.map(doc => {
                const docBrand = brands.find(b => b.id === doc.brandId);
                return (
                  <div key={doc.id} className="bg-white border border-gray-150 p-4 rounded-md space-y-3 hover:border-gray-300 transition-all">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{doc.title}</h4>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-xs font-semibold tracking-wide uppercase ${
                            doc.category === 'Return' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            doc.category === 'Delivery' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            doc.category === 'FAQ' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                            'bg-gray-50 text-gray-700 border border-gray-150'
                          }`}>
                            {doc.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          {selectedBrandId === 'all' && docBrand && (
                            <span className="font-semibold text-gray-600">Brand: {docBrand.name}</span>
                          )}
                          {selectedBrandId === 'all' && docBrand && <span>•</span>}
                          <span>Last Sync: {new Date(doc.updatedAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border ${
                        doc.status === 'indexed' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}>
                        {doc.status === 'indexed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {doc.status === 'indexed' ? 'Indexed' : 'Pending'}
                      </span>
                    </div>

                    {/* Content text */}
                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-sm leading-relaxed border border-gray-100 font-sans">
                      {doc.content}
                    </p>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-1 border-t border-gray-50 text-xs">
                      <button 
                        onClick={() => setEditingDoc(doc)}
                        className="text-gray-500 hover:text-gray-900 font-medium flex items-center gap-1 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button 
                        onClick={() => onDeleteDoc(doc.id)}
                        className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RAG Tester Console (Right col) */}
        <div className="bg-white border border-gray-150 p-5 rounded-md h-fit space-y-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              RAG Retrieval Tester
            </h3>
            <p className="text-xs text-gray-500 leading-normal">
              Test semantic embedding lookup behavior. Simulates search queries on your live vector database.
            </p>
          </div>

          <form onSubmit={handleTestRetrieval} className="space-y-2.5">
            <textarea 
              rows={3}
              placeholder="e.g. Can I return my AeroDrone if the propellers are broken?"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              required
              className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="w-full bg-gray-950 text-white py-2 text-xs font-semibold rounded-sm hover:bg-gray-900 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isSearching ? 'Querying vector DB...' : 'Test Retrieval Vector Lookup'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Results list */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Query Search Matches
            </span>

            {retrievedDocs.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-4">
                Enter a query to test which document chunks would match the user's inquiry.
              </p>
            ) : (
              <div className="space-y-3">
                {retrievedDocs.map(({ doc, score, preview }) => (
                  <div key={doc.id} className="p-3 bg-gray-50 border border-gray-150 rounded-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-900 truncate max-w-[140px]" title={doc.title}>
                        {doc.title}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded-sm">
                        Score: {score.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 italic leading-relaxed font-sans">
                      "{preview}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Doc Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-gray-150 rounded-md max-w-lg w-full overflow-hidden shadow-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 text-sm">Add New Knowledge Document</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 font-mono text-sm">✕</button>
            </div>
            <form onSubmit={handleSubmitAdd} className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-medium text-gray-500">Document Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Return Policy on batteries"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as KnowledgeDocument['category'])}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white font-medium"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Factual Content (Used for RAG Context Injection)</label>
                <textarea 
                  rows={6}
                  placeholder="Provide precise factual content, names, policies, or procedures that the chatbot should extract and read to users."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-sans"
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
                  Create and Index Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Doc Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-gray-155 rounded-md max-w-lg w-full overflow-hidden shadow-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 text-sm">Edit Knowledge Document</h3>
              <button onClick={() => setEditingDoc(null)} className="text-gray-400 hover:text-gray-600 font-mono text-sm">✕</button>
            </div>
            <form onSubmit={handleSubmitEdit} className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-medium text-gray-500">Document Title</label>
                  <input 
                    type="text" 
                    value={editingDoc.title}
                    onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                    required
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Category</label>
                  <select 
                    value={editingDoc.category}
                    onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value as KnowledgeDocument['category'] })}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Factual Content</label>
                <textarea 
                  rows={6}
                  value={editingDoc.content}
                  onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                  required
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-sans"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-3 py-2 text-xs font-semibold bg-gray-950 text-white hover:bg-gray-900 rounded-sm"
                >
                  Update & Re-Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
