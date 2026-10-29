/**
 * MediScan - Medical Image Classification & Explainability System
 * Code A Nova 15-Day Applied AI Internship Project (Approved by HR)
 * Author: Gudipati Yuvaraj
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { InferenceStudio } from './components/InferenceStudio';
import { BatchEvaluation } from './components/BatchEvaluation';
import { ModelComparison } from './components/ModelComparison';
import { MLPipelineStudio } from './components/MLPipelineStudio';
import { EdgeCasesAudit } from './components/EdgeCasesAudit';
import { ModelCardView } from './components/ModelCardView';
import { PresentationMode } from './components/PresentationMode';
import { PathologyAtlas } from './components/PathologyAtlas';
import { ShieldCheck, Cpu, GitBranch, HeartPulse } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('inference');
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Bar Contract Conforming Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'inference' && <InferenceStudio />}
        {activeTab === 'atlas' && (
          <PathologyAtlas
            onSelectConditionToTest={() => {
              setActiveTab('inference');
            }}
          />
        )}
        {activeTab === 'batch' && <BatchEvaluation />}
        {activeTab === 'comparison' && <ModelComparison />}
        {activeTab === 'pipeline' && <MLPipelineStudio />}
        {activeTab === 'edgecases' && <EdgeCasesAudit />}
        {activeTab === 'modelcard' && <ModelCardView />}
      </main>

      {/* 7-Minute Final Defense Presentation Deck Modal */}
      <PresentationMode
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        onLaunchLiveDemo={() => {
          setIsPresentationOpen(false);
          setActiveTab('inference');
        }}
      />

      {/* Clean Technical Clinical Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              <HeartPulse className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-slate-300">MediScan</span>
            </div>
            <span>·</span>
            <span>Code A Nova Internship 2026</span>
            <span>·</span>
            <span className="text-slate-400">Approved by HR</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>ResNet-50 & EfficientNet-B0</span>
            <span>·</span>
            <span>PyTorch & Grad-CAM</span>
            <span>·</span>
            <span className="text-slate-500">Investigational Use Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
