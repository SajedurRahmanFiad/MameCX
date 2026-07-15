/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Cpu, 
  Upload, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Sparkles,
  Sliders
} from 'lucide-react';
import { ProductItem, Brand } from '../types';

interface ProductRecognitionModuleProps {
  products: ProductItem[];
  brands: Brand[];
  selectedBrandId: string;
  onAddProduct: (prod: Omit<ProductItem, 'id'>) => void;
  onUpdateProduct: (prod: ProductItem) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductRecognitionModule({
  products,
  brands,
  selectedBrandId,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}: ProductRecognitionModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newCat, setNewCat] = useState('');
  const [newThreshold, setNewThreshold] = useState(0.85);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Interactive Match Simulator State
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDemoImage, setSelectedDemoImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{
    sku: string;
    name: string;
    confidence: number;
    thresholdMatched: boolean;
    suggestedAction: string;
  } | null>(null);

  // Demo Upload Images for simulated scanner
  const demoImages = [
    {
      id: 'demo_drone_batt',
      title: 'Drone Charger photo (User uploaded)',
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=150&auto=format&fit=crop&q=60',
      predictedSku: 'CHG-30W-USBC',
      predictedName: '30W USB-C Dual Port Fast Charger',
      simulatedConfidence: 0.94,
      action: 'Load AeroGadget 30W charging / return policies into Gemini context.'
    },
    {
      id: 'demo_serum',
      title: 'Serum bottle close-up',
      imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=150&auto=format&fit=crop&q=60',
      predictedSku: 'LUM-SERUM-50',
      predictedName: 'Luminary Facial Glow Serum (50ml)',
      simulatedConfidence: 0.88,
      action: 'Inject Luminary skin sensitivity patch guide and allergy warnings.'
    },
    {
      id: 'demo_shoes',
      title: 'Sneakers in grass (User uploaded)',
      imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=150&auto=format&fit=crop&q=60',
      predictedSku: 'AD-GUARD-SET',
      predictedName: 'AeroGuard Propeller Shields',
      simulatedConfidence: 0.68, // Low confidence match
      action: 'Matches AeroGuard with weak confidence. Prompts customer with list of alternative models.'
    }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchBrand = selectedBrandId === 'all' || p.brandId === selectedBrandId || p.brandId === 'all';
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchBrand && matchSearch;
    });
  }, [products, selectedBrandId, searchTerm]);

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSku.trim()) return;

    onAddProduct({
      brandId: selectedBrandId === 'all' ? 'all' : selectedBrandId,
      name: newName,
      sku: newSku.toUpperCase(),
      category: newCat || 'General',
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150&auto=format&fit=crop&q=60',
      confidenceThreshold: newThreshold,
      isActive: true
    });

    // Reset Form
    setNewName('');
    setNewSku('');
    setNewCat('');
    setNewThreshold(0.85);
    setNewImageUrl('');
    setShowAddModal(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleToggleProductStatus = (prod: ProductItem) => {
    onUpdateProduct({
      ...prod,
      isActive: !prod.isActive
    });
  };

  // Run the visual model match simulator
  const handleRunScanner = (demoId: string) => {
    const selectedDemo = demoImages.find(d => d.id === demoId);
    if (!selectedDemo) return;

    setSelectedDemoImage(selectedDemo.id);
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      // Find matching threshold inside products list if possible
      const catalogItem = products.find(p => p.sku === selectedDemo.predictedSku) || { confidenceThreshold: 0.85 };
      const threshMatched = selectedDemo.simulatedConfidence >= catalogItem.confidenceThreshold;

      setScanResult({
        sku: selectedDemo.predictedSku,
        name: selectedDemo.predictedName,
        confidence: selectedDemo.simulatedConfidence,
        thresholdMatched: threshMatched,
        suggestedAction: threshMatched ? selectedDemo.action : 'Confidence score fell below threshold. Gemini chatbot will trigger generic visual prompt.'
      });
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="space-y-6" id="product-recognition-module">
      {/* Top Config layout */}
      <div className="bg-white border border-gray-150 p-5 rounded-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-gray-700" />
              AI Visual Product Recognition
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Train models to match pictures sent in Facebook messages directly to catalog SKUs and active RAG troubleshooting manuals.
            </p>
          </div>
          <button 
            onClick={() => {
              setShowAddModal(true);
            }}
            className="bg-gray-950 text-white hover:bg-gray-900 transition-colors px-3 py-2 text-xs font-semibold rounded-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Catalog Product
          </button>
        </div>

        {/* Filters */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search product name, SKU code, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Catalog (Left side: 2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Visual Catalog Records ({filteredProducts.length})
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="sm:col-span-2 bg-white border border-dashed border-gray-200 py-12 text-center rounded-md text-gray-400 text-xs">
                No products found in visual training dataset.
              </div>
            ) : (
              filteredProducts.map(prod => (
                <div key={prod.id} className="bg-white border border-gray-150 p-4 rounded-md flex gap-4 hover:border-gray-300 transition-all">
                  {/* Photo thumbnail */}
                  <img 
                    src={prod.imageUrl} 
                    alt={prod.name} 
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 bg-gray-50 object-cover border border-gray-100 rounded-sm shrink-0" 
                  />

                  {/* Body details */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate max-w-[80px]">{prod.category}</span>
                        <button 
                          onClick={() => handleToggleProductStatus(prod)}
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-xs border uppercase tracking-wider ${
                            prod.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'
                          }`}
                        >
                          {prod.isActive ? 'Live Match' : 'Suspended'}
                        </button>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-xs truncate" title={prod.name}>{prod.name}</h4>
                    </div>

                    <div className="flex items-center justify-between text-[11px] border-t border-gray-50 pt-1.5">
                      <span className="font-mono text-gray-500 font-semibold">{prod.sku}</span>
                      <span className="text-gray-400 flex items-center gap-1">
                        Thresh: <span className="font-mono font-bold text-gray-700">{(prod.confidenceThreshold * 100).toFixed(0)}%</span>
                      </span>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-2.5 pt-1 text-[11px] text-gray-400 border-t border-gray-50/50">
                      <button 
                        onClick={() => setEditingProduct(prod)}
                        className="hover:text-gray-900 transition-colors flex items-center gap-0.5"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button 
                        onClick={() => onDeleteProduct(prod.id)}
                        className="hover:text-red-700 text-red-500 transition-colors flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Visual Match Simulator Console (Right side) */}
        <div className="bg-white border border-gray-150 p-5 rounded-md h-fit space-y-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              Visual Match Sandbox
            </h3>
            <p className="text-xs text-gray-500 leading-normal">
              Test how customer picture uploads match back to your warehouse catalog SKUs. Click a demo photo below to run the model diagnostics.
            </p>
          </div>

          {/* Selector options */}
          <div className="grid grid-cols-3 gap-2">
            {demoImages.map(demo => (
              <button 
                key={demo.id}
                onClick={() => handleRunScanner(demo.id)}
                disabled={isScanning}
                className={`p-1.5 border hover:border-purple-300 transition-all rounded-sm bg-slate-50 flex flex-col items-center gap-1 shrink-0 ${
                  selectedDemoImage === demo.id ? 'ring-2 ring-purple-600 border-purple-600 bg-purple-50/20' : 'border-gray-200'
                }`}
              >
                <img 
                  src={demo.imageUrl} 
                  alt={demo.title} 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 object-cover rounded-xs border border-gray-100" 
                />
                <span className="text-[9px] text-gray-500 font-medium truncate max-w-full block">
                  {demo.predictedSku}
                </span>
              </button>
            ))}
          </div>

          {/* Scanner active visualizer */}
          {isScanning && (
            <div className="space-y-2.5 py-4 border-t border-b border-gray-50 flex flex-col items-center">
              <div className="relative w-12 h-12 bg-gray-50 rounded-md border flex items-center justify-center overflow-hidden">
                <Camera className="w-6 h-6 text-purple-500 animate-pulse" />
                {/* Simulated laser scan bar */}
                <div className="absolute left-0 right-0 h-0.5 bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.8)] animate-bounce" style={{ top: '30%' }}></div>
              </div>
              <span className="text-xs font-mono text-purple-700 font-semibold animate-pulse">Running Vision Match Model...</span>
            </div>
          )}

          {/* Scan result display */}
          {scanResult && !isScanning && (
            <div className="space-y-3.5 pt-3.5 border-t border-gray-100 animate-fade-in">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Inference Results
              </span>

              <div className="bg-slate-50 border border-gray-150 p-3 rounded-sm space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{scanResult.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase ${
                    scanResult.thresholdMatched ? 'bg-green-50 text-green-700 border border-green-150' : 'bg-red-50 text-red-700 border border-red-150'
                  }`}>
                    {scanResult.thresholdMatched ? 'MATCH SUCCESS' : 'BELOW THRESHOLD'}
                  </span>
                </div>

                <div className="grid grid-cols-2 text-[11px] border-t border-b border-gray-100 py-1.5 font-mono text-gray-500">
                  <span>Matched SKU: <strong className="text-gray-800">{scanResult.sku}</strong></span>
                  <span className="text-right">Confidence: <strong className={scanResult.thresholdMatched ? 'text-green-600' : 'text-red-600'}>{(scanResult.confidence * 100).toFixed(0)}%</strong></span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Suggested AI Prompt Inject</span>
                  <p className="text-[11px] text-gray-600 leading-relaxed italic">
                    "{scanResult.suggestedAction}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-gray-155 rounded-md max-w-lg w-full overflow-hidden shadow-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 text-sm">Add Product to Recognition Catalog</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 font-mono text-sm">✕</button>
            </div>
            <form onSubmit={handleSubmitAdd} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. AeroDrone Charger"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">SKU Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CHG-30W-USBC"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Category</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Charger, serum, sneakers"
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Confidence Threshold</label>
                  <select 
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white font-medium"
                  >
                    <option value="0.95">95% (Highly Strict)</option>
                    <option value="0.90">90%</option>
                    <option value="0.85">85% (Recommended)</option>
                    <option value="0.80">80%</option>
                    <option value="0.70">70% (Relaxed)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Product Image URL Reference</label>
                <input 
                  type="text" 
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono text-gray-500"
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
                  Create Product SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-gray-155 rounded-md max-w-lg w-full overflow-hidden shadow-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-gray-900 text-sm">Edit Product catalog metadata</h3>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600 font-mono text-sm">✕</button>
            </div>
            <form onSubmit={handleSubmitEdit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Product Name</label>
                <input 
                  type="text" 
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">SKU Code</label>
                  <input 
                    type="text" 
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value.toUpperCase() })}
                    required
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Category</label>
                  <input 
                    type="text" 
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Confidence Threshold</label>
                  <select 
                    value={editingProduct.confidenceThreshold}
                    onChange={(e) => setEditingProduct({ ...editingProduct, confidenceThreshold: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm bg-white"
                  >
                    <option value="0.95">95% (Highly Strict)</option>
                    <option value="0.90">90%</option>
                    <option value="0.85">85% (Recommended)</option>
                    <option value="0.80">80%</option>
                    <option value="0.70">70% (Relaxed)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-3 py-2 text-xs font-semibold bg-gray-950 text-white hover:bg-gray-900 rounded-sm"
                >
                  Save Catalog Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
