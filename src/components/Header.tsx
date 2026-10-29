/**
 * MediScan Top Navigation Bar
 * Follows the strict 3-Zone Top Bar Contract:
 * Zone 1: Single text wordmark
 * Zone 2: 5 concise single-line nav tabs
 * Zone 3: 1 primary action button (Launch Presentation)
 */

import React from 'react';
import { Presentation, ShieldCheck } from 'lucide-react';

export type ActiveTab =
  | 'inference'
  | 'atlas'
  | 'batch'
  | 'comparison'
  | 'pipeline'
  | 'edgecases'
  | 'modelcard';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenPresentation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenPresentation,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element, no adjacent badges) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('inference')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
              MediScan
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line whitespace-nowrap text tabs) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => onSelectTab('inference')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'inference'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Diagnosis & Grad-CAM
          </button>

          <button
            onClick={() => onSelectTab('atlas')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'atlas'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Diagnostic Atlas
          </button>

          <button
            onClick={() => onSelectTab('batch')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'batch'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Batch Triage
          </button>

          <button
            onClick={() => onSelectTab('comparison')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Model Comparison
          </button>

          <button
            onClick={() => onSelectTab('pipeline')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'pipeline'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            ML Pipeline & Code
          </button>

          <button
            onClick={() => onSelectTab('edgecases')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'edgecases'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Edge Cases & Bias
          </button>

          <button
            onClick={() => onSelectTab('modelcard')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'modelcard'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Model Card
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenPresentation}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-all shadow-sm hover:shadow-cyan-500/20 whitespace-nowrap cursor-pointer"
          >
            <Presentation className="w-4 h-4" />
            <span>7-Min Defense Demo</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-800/80 gap-2 no-scrollbar">
        {(
          [
            ['inference', 'Diagnosis'],
            ['atlas', 'Atlas'],
            ['batch', 'Batch'],
            ['comparison', 'Models'],
            ['pipeline', 'Code & ML'],
            ['edgecases', 'Edge Cases'],
            ['modelcard', 'Model Card'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onSelectTab(key as ActiveTab)}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === key
                ? 'bg-slate-800 text-cyan-400 font-medium'
                : 'text-slate-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
};
