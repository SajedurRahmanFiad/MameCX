/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Brand {
  id: string;
  name: string;
  slug: string;
  defaultLanguage: string;
  tone: string;
  handoffMessage: string;
  llmProvider: string;
  llmModel: string;
  apiKeySet: boolean;
  active: boolean;
  createdAt: string;
}

export interface KnowledgeDocument {
  id: string;
  brandId: string;
  title: string;
  content: string;
  category: 'FAQ' | 'Delivery' | 'Return' | 'Procedure' | 'Product' | 'Ad-specific';
  status: 'indexed' | 'pending' | 'failed';
  updatedAt: string;
}

export interface BrandRule {
  id: string;
  brandId: string;
  category: string;
  rule: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  triggerHandoff: boolean;
  active: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'customer' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: { name: string; url: string; type: string }[];
}

export interface TrainingExample {
  id: string;
  brandId: string;
  title: string;
  isGlobal: boolean;
  messages: ChatMessage[];
  createdAt: string;
}

export interface StyleExample {
  id: string;
  brandId: string;
  title: string;
  triggerText: string;
  idealReply: string;
  notes: string;
  priority: 'High' | 'Normal';
}

export interface PromptConfig {
  id: string;
  brandId: string;
  systemPrompt: string;
  toneInstructions: string;
  replyGuidelines: string;
  lastUpdated: string;
}

export interface FacebookConfig {
  id: string;
  brandId: string;
  pageId: string;
  pageName: string;
  appId: string;
  verifyToken: string;
  accessTokenMasked: string;
  isActive: boolean;
  replyToMessages: boolean;
  replyToComments: boolean;
  handoffOnUncertainty: boolean;
  businessHoursOnly: boolean;
  replyDelaySeconds: number;
  serverLabel: string;
}

export interface ProductItem {
  id: string;
  brandId: string;
  name: string;
  sku: string;
  category: string;
  imageUrl: string;
  confidenceThreshold: number;
  isActive: boolean;
}

export interface Conversation {
  id: string;
  brandId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  latestMessage: string;
  latestTimestamp: string;
  status: 'active_ai' | 'handed_off' | 'closed';
  handoffReason?: string;
  messages: ChatMessage[];
}

export interface CustomerFact {
  id: string;
  fact: string;
  confidence: number; // 0-1
  source: string; // e.g., 'Message history', 'Form'
  createdAt: string;
}

export interface Customer {
  id: string;
  brandId: string;
  displayName: string;
  email: string;
  phone: string;
  city: string;
  language: string;
  summary: string;
  facts: CustomerFact[];
  updatedAt: string;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  assignedBrands: string[]; // Brand IDs, or ["*"] for all
  active: boolean;
}

export interface CashTransaction {
  id: string;
  date: string;
  brandId: string;
  brandName: string;
  type: 'revenue' | 'cost';
  category: 'subscription' | 'api_usage' | 'server' | 'other';
  amount: number;
  description: string;
}

export interface SystemHealthStatus {
  llmProviderStatus: 'healthy' | 'degraded' | 'offline';
  facebookApiStatus: 'healthy' | 'degraded' | 'offline';
  speechProviderStatus: 'healthy' | 'degraded' | 'offline';
  databaseStatus: 'healthy' | 'degraded' | 'offline';
  queueStatus: 'active' | 'backed_up';
  overallHealth: 'healthy' | 'warning' | 'error';
  lastChecked: string;
}

export interface ServerLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  source: 'python-bot' | 'webhook-fb' | 'rag-indexer' | 'scheduler';
  message: string;
}

export interface SecretKey {
  id: string;
  name: string;
  keyMasked: string;
  scope: 'global' | 'brand';
  brandId?: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: string;
  resource: string;
  details: string;
}

export interface BackgroundJob {
  id: string;
  kind: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  payload: string;
  error?: string;
  updatedAt: string;
}

export interface DashboardSettings {
  appName: string;
  adminEmail: string;
  defaultBrandId: string;
  refreshIntervalSeconds: number;
  enableNotifications: boolean;
}
