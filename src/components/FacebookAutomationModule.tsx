/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Facebook, 
  Settings, 
  Save, 
  HelpCircle, 
  Key, 
  ToggleRight, 
  ToggleLeft, 
  BellRing,
  Link,
  ShieldCheck,
  CheckCircle,
  Clock
} from 'lucide-react';
import { FacebookConfig, Brand } from '../types';

interface FacebookAutomationModuleProps {
  configs: FacebookConfig[];
  brands: Brand[];
  selectedBrandId: string;
  onUpdateConfig: (config: FacebookConfig) => void;
}

export default function FacebookAutomationModule({
  configs,
  brands,
  selectedBrandId,
  onUpdateConfig
}: FacebookAutomationModuleProps) {
  const activeBrandId = selectedBrandId === 'all' ? 'all' : selectedBrandId;

  // Active integration details
  const activeConfig = useMemo(() => {
    return configs.find(c => c.brandId === activeBrandId) || {
      id: 'fc_new',
      brandId: activeBrandId,
      pageId: 'Pending Page Link',
      pageName: selectedBrandId === 'all' ? 'Global Fallback Page' : 'Unlinked Brand Page',
      appId: '',
      verifyToken: 'generate_a_secure_token',
      accessTokenMasked: 'No Token Configured',
      isActive: false,
      replyToMessages: true,
      replyToComments: false,
      handoffOnUncertainty: true,
      businessHoursOnly: false,
      replyDelaySeconds: 3,
      serverLabel: 'edge-cluster-main'
    };
  }, [configs, activeBrandId, selectedBrandId]);

  // Working States
  const [pageId, setPageId] = useState(activeConfig.pageId);
  const [pageName, setPageName] = useState(activeConfig.pageName);
  const [appId, setAppId] = useState(activeConfig.appId);
  const [verifyToken, setVerifyToken] = useState(activeConfig.verifyToken);
  const [replyDelay, setReplyDelay] = useState(activeConfig.replyDelaySeconds);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync edits on brand toggle
  React.useEffect(() => {
    setPageId(activeConfig.pageId);
    setPageName(activeConfig.pageName);
    setAppId(activeConfig.appId);
    setVerifyToken(activeConfig.verifyToken);
    setReplyDelay(activeConfig.replyDelaySeconds);
  }, [activeConfig]);

  const activeBrandName = useMemo(() => {
    return activeBrandId === 'all' ? 'Global Workspace' : (brands.find(b => b.id === activeBrandId)?.name || 'Brand');
  }, [brands, activeBrandId]);

  const handleSave = () => {
    onUpdateConfig({
      ...activeConfig,
      pageId,
      pageName,
      appId,
      verifyToken,
      replyDelaySeconds: replyDelay,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const toggleStatus = (key: keyof FacebookConfig) => {
    onUpdateConfig({
      ...activeConfig,
      [key]: !activeConfig[key]
    });
  };

  return (
    <div className="space-y-6" id="facebook-automation-module">
      {/* Upper branding */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-150 bg-white p-5 rounded-md gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <Facebook className="w-5 h-5 text-blue-600" /> Facebook & Instagram Messenger Webhooks
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Synchronize Meta Graph webhooks, verify webhook tokens, and toggle automation capabilities.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-sm text-gray-700 font-sans">
          Brand Workspace: {activeBrandName}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Parameters (Grid Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Credentials Container */}
          <div className="bg-white border border-gray-150 p-5 rounded-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Key className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900 text-sm">Meta Application Configuration</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Connected Facebook Page Name</label>
                <input 
                  type="text" 
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Page ID (Graph API Node)</label>
                <input 
                  type="text" 
                  value={pageId}
                  onChange={(e) => setPageId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Meta App Client ID (App ID)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 4882910048220"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Webhook Verify Token (VERIFY_TOKEN)</label>
                <input 
                  type="text" 
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:outline-hidden focus:border-gray-950 rounded-sm font-mono"
                />
              </div>
            </div>

            {/* Permanent Credentials notice */}
            <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-sm flex items-start gap-2 text-xs text-blue-800">
              <Link className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Permanent Webhook URL Endpoint:</span>
                <p className="font-mono bg-white border border-blue-150 p-1 rounded-xs mt-1.5 select-all overflow-x-auto text-[11px]">
                  https://ais-dev-pasj7...run.app/api/webhooks/facebook
                </p>
                <p className="text-[11px] text-blue-600 mt-1">
                  Copy this URL and paste it into the Meta App Settings under the Webhooks section, utilizing the Verify Token declared above.
                </p>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex items-center justify-end pt-3 border-t border-gray-100">
              <button 
                type="button"
                onClick={handleSave}
                className="bg-gray-950 text-white hover:bg-gray-900 transition-colors px-4 py-2 text-xs font-semibold rounded-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                {saveSuccess ? 'Credentials Saved!' : 'Save Meta Configuration'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Switches Panel (Grid col 1) */}
        <div className="bg-white border border-gray-150 p-5 rounded-md h-fit space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Settings className="w-4 h-4 text-gray-500" />
            <h3 className="font-semibold text-gray-900 text-sm">Automation Switches</h3>
          </div>

          <div className="space-y-4">
            {/* Switch 1: General Webhook Active */}
            <div className="flex items-start justify-between">
              <div className="space-y-0.5 pr-4">
                <span className="text-xs font-semibold text-gray-900 block">General Page Webhook Status</span>
                <p className="text-[11px] text-gray-500">Enable or freeze message automated delivery loops.</p>
              </div>
              <button 
                onClick={() => toggleStatus('isActive')}
                className="text-gray-400 hover:text-gray-800 transition-colors"
              >
                {activeConfig.isActive ? <ToggleRight className="w-10 h-6 text-green-500" /> : <ToggleLeft className="w-10 h-6 text-gray-300" />}
              </button>
            </div>

            {/* Switch 2: Inbox messages */}
            <div className="flex items-start justify-between">
              <div className="space-y-0.5 pr-4">
                <span className="text-xs font-semibold text-gray-900 block">Reply to Direct Messages</span>
                <p className="text-[11px] text-gray-500">Monitor and reply directly inside the customer Messenger inbox.</p>
              </div>
              <button 
                onClick={() => toggleStatus('replyToMessages')}
                className="text-gray-400 hover:text-gray-800 transition-colors"
              >
                {activeConfig.replyToMessages ? <ToggleRight className="w-10 h-6 text-green-500" /> : <ToggleLeft className="w-10 h-6 text-gray-300" />}
              </button>
            </div>

            {/* Switch 3: Page comments */}
            <div className="flex items-start justify-between">
              <div className="space-y-0.5 pr-4">
                <span className="text-xs font-semibold text-gray-900 block">Reply to Public Comments</span>
                <p className="text-[11px] text-gray-500">Scan and reply directly to public comments left on page posts.</p>
              </div>
              <button 
                onClick={() => toggleStatus('replyToComments')}
                className="text-gray-400 hover:text-gray-800 transition-colors"
              >
                {activeConfig.replyToComments ? <ToggleRight className="w-10 h-6 text-green-500" /> : <ToggleLeft className="w-10 h-6 text-gray-300" />}
              </button>
            </div>

            {/* Switch 4: Business hours */}
            <div className="flex items-start justify-between">
              <div className="space-y-0.5 pr-4">
                <span className="text-xs font-semibold text-gray-900 block">Out-of-Hours Automation Only</span>
                <p className="text-[11px] text-gray-500">Only trigger bot replies during closed commercial hours.</p>
              </div>
              <button 
                onClick={() => toggleStatus('businessHoursOnly')}
                className="text-gray-400 hover:text-gray-800 transition-colors"
              >
                {activeConfig.businessHoursOnly ? <ToggleRight className="w-10 h-6 text-green-500" /> : <ToggleLeft className="w-10 h-6 text-gray-300" />}
              </button>
            </div>

            {/* Reply Delay Range */}
            <div className="space-y-1.5 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-900">Automation Reply Delay</span>
                <span className="font-mono text-[11px] font-bold text-gray-600 bg-gray-50 border border-gray-200 px-1.5 rounded-sm">{replyDelay} seconds</span>
              </div>
              <input 
                type="range" 
                min={0}
                max={15}
                value={replyDelay}
                onChange={(e) => setReplyDelay(Number(e.target.value))}
                className="w-full accent-gray-900 h-1.5 bg-gray-100 rounded-sm"
              />
              <p className="text-[10px] text-gray-400 leading-normal">
                Artificial delay introduces a more organic, human-feeling speed to bot typing responses, reducing customer frustration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
