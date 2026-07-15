/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Building, 
  Sparkles, 
  BookOpen, 
  ShieldAlert, 
  BrainCircuit, 
  FileEdit, 
  Facebook, 
  Camera, 
  Users as UsersIcon, 
  DollarSign, 
  Activity, 
  Terminal, 
  ListRestart, 
  Shield, 
  Key, 
  History, 
  Settings as SettingsIcon,
  Menu,
  X,
  Bell,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Core State Imports
import { 
  initialBrands, 
  initialKnowledgeDocs, 
  initialRules, 
  initialConversations, 
  initialFacebookConfigs, 
  initialProductItems, 
  initialCustomers, 
  initialLogs, 
  initialTransactions, 
  initialHealth, 
  initialTrainingExamples, 
  initialStyleExamples, 
  initialPromptConfigs, 
  initialUsers, 
  initialSecrets, 
  initialAuditLogs, 
  initialJobs, 
  initialSettings 
} from './mockData';

import { 
  Brand, 
  KnowledgeDocument, 
  BrandRule, 
  Conversation, 
  FacebookConfig, 
  ProductItem, 
  Customer, 
  ServerLogEntry, 
  CashTransaction, 
  SystemHealthStatus, 
  TrainingExample, 
  StyleExample, 
  DashboardUser, 
  SecretKey, 
  AuditLogEntry, 
  BackgroundJob, 
  DashboardSettings,
  PromptConfig
} from './types';

// Component Imports
import DashboardOverview from './components/DashboardOverview';
import BrandsModule from './components/BrandsModule';
import KnowledgeBaseModule from './components/KnowledgeBaseModule';
import BrandRulesModule from './components/BrandRulesModule';
import PromptStudioModule from './components/PromptStudioModule';
import ConversationsModule from './components/ConversationsModule';
import FacebookAutomationModule from './components/FacebookAutomationModule';
import ProductRecognitionModule from './components/ProductRecognitionModule';
import CustomersModule from './components/CustomersModule';
import LogConsoleModule from './components/LogConsoleModule';
import CashFlowModule from './components/CashFlowModule';
import SystemHealthModule from './components/SystemHealthModule';
import { 
  ConversationTrainingModule, 
  StyleExamplesModule, 
  UsersModule, 
  SecretsModule, 
  AuditLogModule, 
  JobsModule, 
  SettingsModule 
} from './components/OtherModules';

type SidebarTab = 
  | 'dashboard'
  | 'conversations'
  | 'brands'
  | 'prompt'
  | 'knowledge'
  | 'rules'
  | 'training'
  | 'style'
  | 'facebook'
  | 'products'
  | 'customers'
  | 'cashflow'
  | 'health'
  | 'logs'
  | 'jobs'
  | 'users'
  | 'secrets'
  | 'audit'
  | 'settings';

export default function App() {
  // Navigation & Responsiveness
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Database States
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(initialKnowledgeDocs);
  const [brandRules, setBrandRules] = useState<BrandRule[]>(initialRules);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [facebookConfigs, setFacebookConfigs] = useState<FacebookConfig[]>(initialFacebookConfigs);
  const [products, setProducts] = useState<ProductItem[]>(initialProductItems);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [serverLogs, setServerLogs] = useState<ServerLogEntry[]>(initialLogs);
  const [transactions, setTransactions] = useState<CashTransaction[]>(initialTransactions);
  const [systemHealth, setSystemHealth] = useState<SystemHealthStatus>(initialHealth);
  const [trainingExamples, setTrainingExamples] = useState<TrainingExample[]>(initialTrainingExamples);
  const [styleExamples, setStyleExamples] = useState<StyleExample[]>(initialStyleExamples);
  const [promptConfigs, setPromptConfigs] = useState<PromptConfig[]>(initialPromptConfigs);
  const [users, setUsers] = useState<DashboardUser[]>(initialUsers);
  const [secrets, setSecrets] = useState<SecretKey[]>(initialSecrets);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [jobs, setJobs] = useState<BackgroundJob[]>(initialJobs);
  const [settings, setSettings] = useState<DashboardSettings>(initialSettings);

  // Handoff counters
  const handoffCount = conversations.filter(c => c.status === 'handoff_requested').length;

  // Logging Mutation Trigger
  const handleAddLog = React.useCallback((newLog: Omit<ServerLogEntry, 'id' | 'timestamp'>) => {
    const entry: ServerLogEntry = {
      ...newLog,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    };
    setServerLogs(prev => {
      // Cap log buffer size to 250 records for rendering speeds
      const truncated = prev.length > 250 ? prev.slice(prev.length - 200) : prev;
      return [...truncated, entry];
    });
  }, []);

  // System security auditing recorder
  const handleRecordAudit = React.useCallback((action: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Super Admin (System)',
      action,
      category: 'System',
      resource: 'Global Dashboard',
      details
    };
    setAuditLogs(prev => [entry, ...prev]);
  }, []);

  // ==========================================
  // MUTATORS / CALLERS
  // ==========================================

  // Brands
  const handleAddBrand = (brand: Omit<Brand, 'id' | 'createdAt'>) => {
    const newBrand: Brand = {
      ...brand,
      id: `b_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setBrands([...brands, newBrand]);
    handleRecordAudit('BRAND_CREATE', `Created brand tenant workspace "${brand.name}".`);
  };

  const handleUpdateBrand = (updated: Brand) => {
    setBrands(brands.map(b => b.id === updated.id ? updated : b));
    handleRecordAudit('BRAND_UPDATE', `Updated configuration variables for brand tenant "${updated.name}".`);
  };

  const handleDeleteBrand = (id: string) => {
    const bName = brands.find(b=>b.id===id)?.name || id;
    setBrands(brands.filter(b => b.id !== id));
    handleRecordAudit('BRAND_DELETE', `Deleted brand workspace tenant "${bName}".`);
  };

  // Knowledge base
  const handleAddDoc = (doc: Omit<KnowledgeDocument, 'id' | 'updatedAt'>) => {
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: `kd_${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    setKnowledgeDocs([newDoc, ...knowledgeDocs]);
    handleAddLog({ level: 'INFO', source: 'rag-indexer', message: `Indexed and vectorized RAG file: "${doc.title}".` });
    handleRecordAudit('DOC_INDEX', `Successfully parsed and vectorized document "${doc.title}".`);
  };

  const handleDeleteDoc = (id: string) => {
    const dTitle = knowledgeDocs.find(d=>d.id===id)?.title || id;
    setKnowledgeDocs(knowledgeDocs.filter(d => d.id !== id));
    handleRecordAudit('DOC_DELETE', `Deleted RAG document "${dTitle}" from retrieval index.`);
  };

  const handleUpdateDoc = (updated: KnowledgeDocument) => {
    setKnowledgeDocs(prev => prev.map(d => d.id === updated.id ? updated : d));
    handleRecordAudit('DOC_UPDATE', `Updated knowledge document "${updated.title}".`);
  };

  // Rules & Guardrails
  const handleAddRule = (rule: Omit<BrandRule, 'id'>) => {
    const newRule: BrandRule = {
      ...rule,
      id: `br_${Date.now()}`
    };
    setBrandRules([...brandRules, newRule]);
    handleRecordAudit('RULE_CREATE', `Configured matching tone guardrail "${rule.rule}".`);
  };

  const handleUpdateRule = (updated: BrandRule) => {
    setBrandRules(brandRules.map(r => r.id === updated.id ? updated : r));
  };

  const handleDeleteRule = (id: string) => {
    setBrandRules(brandRules.filter(r => r.id !== id));
  };

  // Conversations & Human Supervision
  const handleUpdateConversation = (updated: Conversation) => {
    setConversations(prev => prev.map(c => c.id === updated.id ? updated : c));
    handleRecordAudit('CONVO_SUPERVISE', `Updated chat thread ${updated.id} parameters.`);
  };

  // Facebook & Instagram Integration
  const handleUpdateFbConfig = (config: FacebookConfig) => {
    setFacebookConfigs(facebookConfigs.map(c => c.id === config.id ? config : c));
    handleRecordAudit('META_WEBHOOK', `Configured graph parameters for Page ID "${config.pageId}".`);
  };

  // Product Recognition
  const handleAddProduct = (prod: Omit<ProductItem, 'id'>) => {
    const newProd: ProductItem = {
      ...prod,
      id: `pr_${Date.now()}`
    };
    setProducts([newProd, ...products]);
    handleRecordAudit('PRODUCT_CATALOG', `Added catalog product SKU "${prod.sku}".`);
  };

  const handleUpdateProduct = (updated: ProductItem) => {
    setProducts(products.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Customer Profiles
  const handleUpdateCustomer = (cust: Customer) => {
    setCustomers(customers.map(c => c.id === cust.id ? cust : c));
  };

  // Cash Ledger Flow
  const handleAddTransaction = (tx: Omit<CashTransaction, 'id'>) => {
    const newTx: CashTransaction = {
      ...tx,
      id: `tx_${Date.now()}`
    };
    setTransactions([newTx, ...transactions]);
    handleRecordAudit('FINANCE_LEDGER', `Posted transaction fee record of $${Math.abs(tx.amount).toFixed(2)}.`);
  };

  // Conversation Training
  const handleAddTrainingExample = (ex: Omit<TrainingExample, 'id' | 'createdAt'>) => {
    const newEx: TrainingExample = {
      ...ex,
      id: `tx_train_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTrainingExamples([newEx, ...trainingExamples]);
    handleRecordAudit('TRAINING_EXAMPLES', `Created few-shot prompting scenario "${ex.title}".`);
  };

  const handleDeleteTrainingExample = (id: string) => {
    setTrainingExamples(trainingExamples.filter(ex => ex.id !== id));
  };

  // Style Guides Presets
  const handleAddStyle = (st: Omit<StyleExample, 'id'>) => {
    const newSt: StyleExample = {
      ...st,
      id: `st_${Date.now()}`
    };
    setStyleExamples([newSt, ...styleExamples]);
    handleRecordAudit('TONE_PRESETS', `Posted editorial tone preset "${st.title}".`);
  };

  const handleDeleteStyle = (id: string) => {
    setStyleExamples(styleExamples.filter(st => st.id !== id));
  };

  // Operators
  const handleToggleUser = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  // Scheduler Job triggering
  const handleTriggerJob = (id: string) => {
    setJobs(jobs.map(j => {
      if (j.id !== id) return j;
      return { ...j, status: 'processing', attempts: j.attempts + 1, error: undefined };
    }));
    handleAddLog({ level: 'INFO', source: 'scheduler', message: `Dispatched asynchronous background retry for task ${id}.` });
    
    setTimeout(() => {
      setJobs(prev => prev.map(j => {
        if (j.id !== id) return j;
        return { ...j, status: 'completed' };
      }));
      handleAddLog({ level: 'INFO', source: 'scheduler', message: `Task ${id} completed successfully in Celery queue.` });
    }, 2000);
  };

  // ==========================================
  // SIDEBAR NAVIGATION GROUPINGS
  // ==========================================
  const menuGroups = [
    {
      label: 'Platform Core',
      items: [
        { id: 'dashboard', label: 'Dashboard Snap', icon: LayoutDashboard },
        { id: 'conversations', label: 'Live Chats Support', icon: MessageSquare, badge: handoffCount > 0 ? handoffCount : undefined },
        { id: 'brands', label: 'Workspace Brands', icon: Building }
      ]
    },
    {
      label: 'AI Prompt Engine',
      items: [
        { id: 'prompt', label: 'System Prompts', icon: Sparkles },
        { id: 'knowledge', label: 'RAG Documents', icon: BookOpen },
        { id: 'rules', label: 'Compliance rules', icon: ShieldAlert },
        { id: 'training', label: 'Few-Shot Dialogs', icon: BrainCircuit },
        { id: 'style', label: 'Tone Preset Guides', icon: FileEdit }
      ]
    },
    {
      label: 'Meta integrations',
      items: [
        { id: 'facebook', label: 'Facebook Webhooks', icon: Facebook },
        { id: 'products', label: 'Product Recognition', icon: Camera }
      ]
    },
    {
      label: 'Administrative Operations',
      items: [
        { id: 'customers', label: 'Customer Memory', icon: UsersIcon },
        { id: 'cashflow', label: 'Financial Ledger', icon: DollarSign },
        { id: 'health', label: 'Telemetry Health', icon: Activity },
        { id: 'logs', label: 'Stdout Streams', icon: Terminal },
        { id: 'jobs', label: 'Celery Job Queue', icon: ListRestart },
        { id: 'users', label: 'Team Operators', icon: Shield },
        { id: 'secrets', label: 'Credentials Secrets', icon: Key },
        { id: 'audit', label: 'Security Audit', icon: History },
        { id: 'settings', label: 'Platform Settings', icon: SettingsIcon }
      ]
    }
  ];

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview 
            brands={brands}
            conversations={conversations}
            customers={customers}
            transactions={transactions}
            onSelectBrand={setSelectedBrandId}
            selectedBrandId={selectedBrandId}
          />
        );
      case 'brands':
        return (
          <BrandsModule 
            brands={brands}
            onAddBrand={handleAddBrand}
            onUpdateBrand={handleUpdateBrand}
            onSelectBrand={setSelectedBrandId}
          />
        );
      case 'knowledge':
        return (
          <KnowledgeBaseModule 
            documents={knowledgeDocs}
            brands={brands}
            selectedBrandId={selectedBrandId}
            onAddDoc={handleAddDoc}
            onUpdateDoc={handleUpdateDoc}
            onDeleteDoc={handleDeleteDoc}
          />
        );
      case 'rules':
        return (
          <BrandRulesModule 
            rules={brandRules}
            brands={brands}
            selectedBrandId={selectedBrandId}
            onAddRule={handleAddRule}
            onUpdateRule={handleUpdateRule}
            onDeleteRule={handleDeleteRule}
          />
        );
      case 'prompt':
        return (
          <PromptStudioModule 
            configs={promptConfigs}
            brands={brands}
            documents={knowledgeDocs}
            rules={brandRules}
            selectedBrandId={selectedBrandId}
            onUpdateConfig={(config) => {
              setPromptConfigs(prev => prev.map(c => c.brandId === config.brandId ? config : c));
              handleRecordAudit('PROMPT_UPDATE', `Updated system instructions & prompts for brand ${config.brandId}.`);
            }}
          />
        );
      case 'conversations':
        return (
          <ConversationsModule 
            conversations={conversations}
            brands={brands}
            selectedBrandId={selectedBrandId}
            onUpdateConversation={handleUpdateConversation}
          />
        );
      case 'facebook':
        return (
          <FacebookAutomationModule 
            configs={facebookConfigs}
            brands={brands}
            selectedBrandId={selectedBrandId}
            onUpdateConfig={handleUpdateFbConfig}
          />
        );
      case 'products':
        return (
          <ProductRecognitionModule 
            products={products}
            brands={brands}
            selectedBrandId={selectedBrandId}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'customers':
        return (
          <CustomersModule 
            customers={customers}
            brands={brands}
            selectedBrandId={selectedBrandId}
            onUpdateCustomer={handleUpdateCustomer}
          />
        );
      case 'logs':
        return (
          <LogConsoleModule 
            logs={serverLogs}
            onClearLogs={() => setServerLogs([])}
            onAddLog={handleAddLog}
          />
        );
      case 'cashflow':
        return (
          <CashFlowModule 
            transactions={transactions}
            brands={brands}
            selectedBrandId={selectedBrandId}
            onAddTransaction={handleAddTransaction}
          />
        );
      case 'health':
        return (
          <SystemHealthModule 
            health={systemHealth}
          />
        );
      case 'training':
        return (
          <ConversationTrainingModule 
            examples={trainingExamples}
            brands={brands}
            selectedBrandId={selectedBrandId}
            onAddExample={handleAddTrainingExample}
            onDeleteExample={handleDeleteTrainingExample}
          />
        );
      case 'style':
        return (
          <StyleExamplesModule 
            examples={styleExamples}
            brands={brands}
            selectedBrandId={selectedBrandId}
            onAddStyle={handleAddStyle}
            onDeleteStyle={handleDeleteStyle}
          />
        );
      case 'users':
        return (
          <UsersModule 
            users={users}
            brands={brands}
            onToggleUser={handleToggleUser}
          />
        );
      case 'secrets':
        return (
          <SecretsModule 
            secrets={secrets}
            brands={brands}
          />
        );
      case 'audit':
        return (
          <AuditLogModule 
            logs={auditLogs}
          />
        );
      case 'jobs':
        return (
          <JobsModule 
            jobs={jobs}
            onTriggerJob={handleTriggerJob}
          />
        );
      case 'settings':
        return (
          <SettingsModule 
            settings={settings}
            brands={brands}
            onSaveSettings={(s) => {
              setSettings(s);
              handleRecordAudit('SYSTEM_SETTINGS', 'Updated general system administration settings.');
            }}
          />
        );
      default:
        return <div>Module Under Construction.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg flex flex-col font-sans text-natural-text leading-normal antialiased">
      
      {/* 1. Global Platform Top Header */}
      <header className="bg-white border-b border-natural-border sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between shadow-sm">
        
        {/* Brand identifier */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-natural-accent hover:text-black p-1 md:hidden"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-natural-accent text-white flex items-center justify-center font-black rounded-md select-none">
              Ω
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-natural-text uppercase">{settings.appName}</h1>
              <p className="text-[10px] text-natural-muted font-bold tracking-wider uppercase">Multi-Tenant Admin Workspace</p>
            </div>
          </div>
        </div>

        {/* Global Context Selector Options */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-bold text-natural-muted uppercase tracking-widest">Tenant Scope:</span>
            <select 
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="text-xs p-1.5 px-3 border border-natural-border focus:outline-none focus:ring-1 focus:ring-natural-warm focus:border-natural-warm rounded-md bg-natural-sidebar font-medium text-natural-accent cursor-pointer shadow-xs transition-shadow"
            >
              <option value="all">Global Workspace (All Brands)</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Status Badge Notification Trigger */}
          <div className="flex items-center gap-3">
            {handoffCount > 0 ? (
              <div className="bg-red-50 border border-red-100 px-3 py-1 rounded-full text-[10px] font-bold text-red-700 flex items-center gap-1.5 shadow-xs">
                <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                <span>{handoffCount} HANDOFF REQS</span>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-700 flex items-center gap-1.5 select-none shadow-xs">
                <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>STATUS: OPERATIONAL</span>
              </div>
            )}
          </div>
        </div>

      </header>

      {/* 2. Main Workspace Grid split Layout */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Sidebar Container: Left Panel */}
        <aside className={`
          bg-natural-sidebar border-r border-natural-border w-64 shrink-0 select-none
          fixed inset-y-14 left-0 z-30 md:static md:translate-x-0 transition-transform duration-200 overflow-y-auto
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4 space-y-6">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-natural-muted block px-3">
                  {group.label}
                </span>
                <nav className="space-y-1">
                  {group.items.map(item => {
                    const isSelected = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                      <button 
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as SidebarTab);
                          setMobileMenuOpen(false);
                        }}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-all text-left
                          ${isSelected 
                            ? 'bg-white border border-natural-border text-natural-accent shadow-sm' 
                            : 'text-[#6B665E] hover:bg-natural-hover'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-natural-warm' : 'text-natural-muted'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                            isSelected ? 'bg-natural-accent text-white' : 'bg-red-500 text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </aside>

        {/* 3. Screen Container: Right Module Panel */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full overflow-hidden flex flex-col">
          {/* Tenant scoping header alert for non-dashboard filters */}
          {selectedBrandId !== 'all' && activeTab !== 'dashboard' && activeTab !== 'brands' && (
            <div className="bg-natural-sidebar border border-natural-border text-[11px] font-semibold text-natural-accent px-4 py-2.5 rounded-md mb-6 flex items-center justify-between shadow-sm animate-fade-in">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-natural-warm"></span>
                <span>Scoped Workspace Focus Filter: <strong className="text-black font-semibold">{brands.find(b=>b.id===selectedBrandId)?.name}</strong></span>
              </span>
              <button 
                onClick={() => setSelectedBrandId('all')}
                className="text-natural-warm hover:text-natural-accent underline font-semibold transition-colors"
              >
                Clear Scope Filter
              </button>
            </div>
          )}

          <div className="flex-1 flex flex-col gap-8">
            {renderActiveModule()}
          </div>
        </main>

      </div>

    </div>
  );
}
