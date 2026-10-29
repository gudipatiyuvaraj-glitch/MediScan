/**
 * MediScan Clinical Pathology Atlas & Diagnostic Intelligence Component
 * Comprehensive medical knowledge base, radiological/dermoscopic signatures,
 * deep learning activation behavior, differential diagnosis, and clinical management.
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Activity,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { PATHOLOGY_ATLAS, PathologyProfile } from '../data/pathologyAtlas';
import { ModalityType } from '../types/medical';

interface PathologyAtlasProps {
  onSelectConditionToTest: (className: string, modality: ModalityType) => void;
}

export const PathologyAtlas: React.FC<PathologyAtlasProps> = ({
  onSelectConditionToTest,
}) => {
  const [selectedModality, setSelectedModality] = useState<ModalityType>('chest_xray');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('atlas-cxr-bacterial');

  const filteredProfiles = PATHOLOGY_ATLAS.filter(
    (p) => p.modality === selectedModality
  );

  const activeProfile =
    PATHOLOGY_ATLAS.find((p) => p.id === selectedProfileId) || filteredProfiles[0];

  const handleModalityChange = (modality: ModalityType) => {
    setSelectedModality(modality);
    const firstMatch = PATHOLOGY_ATLAS.find((p) => p.modality === modality);
    if (firstMatch) {
      setSelectedProfileId(firstMatch.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Modality Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Clinical Diagnostic Knowledge Base & Atlas
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Exhaustive pathology hallmarks, deep learning feature extraction signatures, differential matrices, and clinical management guidelines for all 8 conditions.
          </p>
        </div>

        {/* Modality Segmented Selector */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => handleModalityChange('chest_xray')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedModality === 'chest_xray'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Chest Radiography (4 Classes)
          </button>
          <button
            onClick={() => handleModalityChange('dermoscopy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedModality === 'dermoscopy'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dermoscopy (4 Classes)
          </button>
        </div>
      </div>

      {/* Condition Selector Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {filteredProfiles.map((profile) => {
          const isSelected = profile.id === activeProfile.id;
          return (
            <button
              key={profile.id}
              onClick={() => setSelectedProfileId(profile.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <span>{profile.className}</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                {profile.category.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Diagnostic Detail Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Clinical & Radiological Profile (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Header Banner */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
                {activeProfile.category}
              </span>
              <button
                onClick={() =>
                  onSelectConditionToTest(activeProfile.className, activeProfile.modality)
                }
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test in Diagnostic Studio</span>
              </button>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {activeProfile.commonName}
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {activeProfile.etiology}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Epidemiology: </span>
              <span>{activeProfile.epidemiology}</span>
            </div>
          </div>

          {/* Radiological / Dermoscopic Hallmarks */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Radiological & Visual Hallmarks
              </h3>
            </div>

            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs">
              <span className="text-cyan-300 font-semibold block text-[11px] uppercase tracking-wider font-mono">
                Classic Diagnostic Phenomenon:
              </span>
              <span className="text-white font-bold text-sm mt-0.5 block">
                {activeProfile.radiologicalHallmarks.classicPhenomenon}
              </span>
            </div>

            <div className="space-y-2 text-xs leading-relaxed">
              <div>
                <span className="font-semibold text-slate-300">Primary Imaging Sign:</span>
                <p className="text-slate-300 mt-0.5">
                  {activeProfile.radiologicalHallmarks.primarySign}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-300">Secondary Manifestations:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-400 mt-1 pl-1">
                  {activeProfile.radiologicalHallmarks.secondarySigns.map((sign, i) => (
                    <li key={i}>{sign}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Deep Learning & Convolutional Feature Attribution */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Deep Learning Feature Attribution & Grad-CAM Signatures
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[11px] block font-mono">
                  Target Hooked Layers:
                </span>
                <span className="font-mono text-cyan-300 font-semibold text-xs block">
                  {activeProfile.deepLearningFeatures.targetLayers}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[11px] block font-mono">
                  Density / Saliency Profile:
                </span>
                <span className="font-mono text-emerald-400 font-semibold text-xs block">
                  {activeProfile.deepLearningFeatures.simulatedHURange}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div>
                <span className="font-semibold text-slate-200">
                  Convolutional Activation Pattern:
                </span>
                <p className="text-slate-400 mt-0.5">
                  {activeProfile.deepLearningFeatures.activationPattern}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-200">
                  Typical Salient Epicenter:
                </span>
                <p className="text-cyan-300 mt-0.5 font-medium">
                  {activeProfile.deepLearningFeatures.salientHotspotLocation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Differential Matrix & Clinical Protocol (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Differential Diagnosis Matrix */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Differential Diagnosis Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Key radiological criteria distinguishing this condition from clinical mimics:
            </p>

            <div className="space-y-2.5 pt-1">
              {activeProfile.differentialDiagnosis.map((diff, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-850 border border-slate-800 text-xs space-y-1"
                >
                  <span className="font-semibold text-white block">
                    vs. {diff.condition}
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {diff.distinguishingFeatures}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Guidelines & Severity Scoring */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-3 text-xs leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Standardized Clinical Protocol</span>
            </div>

            <div className="p-2.5 rounded bg-slate-850 border border-slate-800">
              <span className="text-cyan-400 font-semibold block text-[11px] font-mono">
                {activeProfile.clinicalGuidelines.severityScoreName}
              </span>
              <p className="text-slate-300 text-[11px] mt-0.5">
                {activeProfile.clinicalGuidelines.severityCriteria}
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-300 block">
                Evidence-Based Management Plan:
              </span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {activeProfile.clinicalGuidelines.managementProtocol}
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-300 block">
                Mandatory Laboratory & Imaging Workup:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px] mt-1 pl-1">
                {activeProfile.clinicalGuidelines.recommendedDiagnostics.map((diag, i) => (
                  <li key={i}>{diag}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Diagnostic Traps & Pitfalls */}
          <div className="bg-amber-500/10 rounded-xl border border-amber-500/30 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Diagnostic Traps & AI Pitfalls</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-200/90 text-[11px]">
              {activeProfile.diagnosticPitfalls.map((pitfall, i) => (
                <li key={i}>{pitfall}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
