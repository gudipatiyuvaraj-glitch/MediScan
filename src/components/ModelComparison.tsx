/**
 * MediScan Model Comparison Dashboard
 * Side-by-side empirical benchmark of ResNet-50 vs EfficientNet-B0,
 * epoch curves, 4x4 confusion matrix, and multi-class ROC-AUC curves.
 */

import React, { useState } from 'react';
import {
  RESNET50_SUMMARY,
  EFFICIENTNET_SUMMARY,
  RESNET_EPOCHS,
  EFFICIENTNET_EPOCHS,
  RESNET_CONFUSION_MATRIX,
  EFFICIENTNET_CONFUSION_MATRIX,
  RESNET_CXR_CLASS_METRICS,
  EFFICIENTNET_CXR_CLASS_METRICS,
} from '../data/benchmarkData';
import { ModelArchitecture } from '../types/medical';
import { BarChart3, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

export const ModelComparison: React.FC = () => {
  const [selectedArch, setSelectedArch] = useState<ModelArchitecture>('EfficientNet-B0');
  const [curveMode, setCurveMode] = useState<'loss' | 'accuracy'>('accuracy');
  const [cmDisplayMode, setCmDisplayMode] = useState<'counts' | 'percent'>('counts');

  const activeSummary = selectedArch === 'EfficientNet-B0' ? EFFICIENTNET_SUMMARY : RESNET50_SUMMARY;
  const activeEpochs = selectedArch === 'EfficientNet-B0' ? EFFICIENTNET_EPOCHS : RESNET_EPOCHS;
  const activeCM = selectedArch === 'EfficientNet-B0' ? EFFICIENTNET_CONFUSION_MATRIX : RESNET_CONFUSION_MATRIX;
  const activeClassMetrics = selectedArch === 'EfficientNet-B0' ? EFFICIENTNET_CXR_CLASS_METRICS : RESNET_CXR_CLASS_METRICS;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Architecture Benchmarking & Comparison
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical evaluation of ResNet-50 vs EfficientNet-B0 on independent test cohorts (1,200 scans).
          </p>
        </div>

        {/* Active Architecture Selector */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setSelectedArch('EfficientNet-B0')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedArch === 'EfficientNet-B0'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EfficientNet-B0 (Recommended)
          </button>
          <button
            onClick={() => setSelectedArch('ResNet-50')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedArch === 'ResNet-50'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ResNet-50 (Baseline)
          </button>
        </div>
      </div>

      {/* Side-by-Side Model Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* EfficientNet-B0 Card */}
        <div
          onClick={() => setSelectedArch('EfficientNet-B0')}
          className={`p-5 rounded-xl border transition-all cursor-pointer ${
            selectedArch === 'EfficientNet-B0'
              ? 'bg-slate-900/90 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">EfficientNet-B0</h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Top Accuracy
              </span>
            </div>
            <span className="text-2xl font-mono font-bold text-cyan-400">91.8%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compound scaled inverted residual bottleneck blocks (MBConv) with squeeze-and-excitation.
          </p>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Parameters</span>
              <span className="font-mono font-medium text-slate-200">5.29 M</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">FLOPs</span>
              <span className="font-mono font-medium text-slate-200">0.39 GFLOPs</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Inference (GPU)</span>
              <span className="font-mono font-medium text-cyan-400">9 ms</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Macro F1</span>
              <span className="font-mono font-medium text-slate-200">0.912</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Macro ROC-AUC</span>
              <span className="font-mono font-medium text-slate-200">0.974</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Size (.pt)</span>
              <span className="font-mono font-medium text-slate-200">21.4 MB</span>
            </div>
          </div>
        </div>

        {/* ResNet-50 Card */}
        <div
          onClick={() => setSelectedArch('ResNet-50')}
          className={`p-5 rounded-xl border transition-all cursor-pointer ${
            selectedArch === 'ResNet-50'
              ? 'bg-slate-900/90 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">ResNet-50</h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Baseline
              </span>
            </div>
            <span className="text-2xl font-mono font-bold text-slate-200">89.4%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deep residual network with bottleneck skip connections (Identity mapping).
          </p>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Parameters</span>
              <span className="font-mono font-medium text-slate-200">25.56 M</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">FLOPs</span>
              <span className="font-mono font-medium text-slate-200">4.12 GFLOPs</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Inference (GPU)</span>
              <span className="font-mono font-medium text-slate-300">24 ms</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Macro F1</span>
              <span className="font-mono font-medium text-slate-200">0.887</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Macro ROC-AUC</span>
              <span className="font-mono font-medium text-slate-200">0.958</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Size (.pt)</span>
              <span className="font-mono font-medium text-slate-200">97.8 MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Epoch Training Curves & Confusion Matrix Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 15-Epoch Loss & Accuracy Curves (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                15-Epoch Training Dynamics ({selectedArch})
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-md text-xs">
              <button
                onClick={() => setCurveMode('accuracy')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  curveMode === 'accuracy'
                    ? 'bg-slate-700 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Accuracy
              </button>
              <button
                onClick={() => setCurveMode('loss')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  curveMode === 'loss'
                    ? 'bg-slate-700 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Loss (CrossEntropy)
              </button>
            </div>
          </div>

          {/* SVG Epoch Curve Visualization */}
          <div className="relative h-64 w-full bg-slate-950/60 rounded-lg p-3 border border-slate-850">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
              {/* Horizontal Gridlines */}
              {[0, 50, 100, 150, 200].map((y) => (
                <line
                  key={y}
                  x1="30"
                  y1={y}
                  x2="480"
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Data Path Generation */}
              {(() => {
                const n = activeEpochs.length;
                const getCoords = (metricKey: 'trainLoss' | 'valLoss' | 'trainAcc' | 'valAcc') => {
                  return activeEpochs
                    .map((ep, i) => {
                      const x = 30 + (i / (n - 1)) * 450;
                      let y: number;
                      if (curveMode === 'accuracy') {
                        // Acc is 0.5 to 1.0
                        const val = ep[metricKey];
                        y = 190 - (val - 0.5) * 360;
                      } else {
                        // Loss is 0 to 1.4
                        const val = ep[metricKey];
                        y = 190 - (val / 1.4) * 170;
                      }
                      return `${x},${y}`;
                    })
                    .join(' ');
                };

                const trainCoords = getCoords(curveMode === 'accuracy' ? 'trainAcc' : 'trainLoss');
                const valCoords = getCoords(curveMode === 'accuracy' ? 'valAcc' : 'valLoss');

                return (
                  <>
                    {/* Training Line (Slate-400 dashed) */}
                    <polyline
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      points={trainCoords}
                    />
                    {/* Validation Line (Cyan-400 solid) */}
                    <polyline
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                      points={valCoords}
                    />

                    {/* Data Points on Validation Line */}
                    {activeEpochs.map((ep, i) => {
                      const x = 30 + (i / (n - 1)) * 450;
                      const val = curveMode === 'accuracy' ? ep.valAcc : ep.valLoss;
                      const y =
                        curveMode === 'accuracy'
                          ? 190 - (val - 0.5) * 360
                          : 190 - (val / 1.4) * 170;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="3"
                          fill="#0891b2"
                          stroke="#22d3ee"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {/* Legend & Current Values */}
            <div className="flex items-center justify-between text-xs pt-2 text-slate-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-slate-400 border-dashed" />
                  <span>Train Set</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-cyan-400" />
                  <span className="text-cyan-300 font-medium">Validation Set</span>
                </div>
              </div>

              <span className="font-mono text-[11px] text-slate-400">
                Final Val {curveMode === 'accuracy' ? 'Acc: ' : 'Loss: '}
                <strong className="text-cyan-300">
                  {curveMode === 'accuracy'
                    ? `${(activeEpochs[activeEpochs.length - 1].valAcc * 100).toFixed(1)}%`
                    : activeEpochs[activeEpochs.length - 1].valLoss.toFixed(3)}
                </strong>
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>CosineAnnealingLR scheduler applied across epochs 1–15</span>
            <span>Backbone unfreezing enabled at epoch 4</span>
          </div>
        </div>

        {/* Right: 4x4 Confusion Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Confusion Matrix</h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-md text-xs">
              <button
                onClick={() => setCmDisplayMode('counts')}
                className={`px-2 py-0.5 rounded transition-colors text-[11px] ${
                  cmDisplayMode === 'counts'
                    ? 'bg-slate-700 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Counts
              </button>
              <button
                onClick={() => setCmDisplayMode('percent')}
                className={`px-2 py-0.5 rounded transition-colors text-[11px] ${
                  cmDisplayMode === 'percent'
                    ? 'bg-slate-700 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                %
              </button>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="space-y-1">
            <div className="text-center text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              Predicted Class (Columns) →
            </div>

            <div className="grid grid-cols-5 gap-1 text-[11px]">
              {/* Header Corner */}
              <div className="text-slate-500 font-mono text-[10px] flex items-center justify-end pr-1">
                Actual ↓
              </div>
              {activeCM.labels.map((lbl) => (
                <div
                  key={lbl}
                  className="font-medium text-slate-400 text-center truncate text-[10px]"
                  title={lbl}
                >
                  {lbl.split(' ')[0]}
                </div>
              ))}

              {/* Matrix Rows */}
              {activeCM.matrix.map((row, rIdx) => (
                <React.Fragment key={rIdx}>
                  <div
                    className="font-medium text-slate-400 flex items-center justify-end pr-1 truncate text-[10px]"
                    title={activeCM.labels[rIdx]}
                  >
                    {activeCM.labels[rIdx].split(' ')[0]}
                  </div>
                  {row.map((val, cIdx) => {
                    const isDiagonal = rIdx === cIdx;
                    const rowSum = row.reduce((a, b) => a + b, 0);
                    const pct = Math.round((val / rowSum) * 100);

                    return (
                      <div
                        key={cIdx}
                        className={`h-11 rounded flex flex-col items-center justify-center font-mono text-xs font-semibold transition-all ${
                          isDiagonal
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                            : val > 0
                            ? 'bg-slate-800/80 text-slate-400 border border-slate-800'
                            : 'bg-slate-900 text-slate-600 border border-slate-850'
                        }`}
                        title={`True: ${activeCM.labels[rIdx]}, Pred: ${activeCM.labels[cIdx]}`}
                      >
                        <span>{cmDisplayMode === 'counts' ? val : `${pct}%`}</span>
                        <span className="text-[9px] text-slate-500 font-normal">
                          {isDiagonal ? 'TP' : val > 0 ? 'Err' : '-'}
                        </span>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Cohort: 1,200 Scans (300 / class)</span>
            <span className="text-emerald-400">
              Total Accuracy: {(activeSummary.accuracy * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Per-Class Detailed Performance Table */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              Per-Class Diagnostic Metrics ({selectedArch})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Precision, Recall (Sensitivity), Specificity, F1-Score, and ROC-AUC for all 4 classes.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            Macro AUC: {activeSummary.macroRocAuc.toFixed(3)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Diagnostic Class</th>
                <th className="py-3 px-4 text-right">Precision</th>
                <th className="py-3 px-4 text-right">Recall (Sens)</th>
                <th className="py-3 px-4 text-right">Specificity</th>
                <th className="py-3 px-4 text-right">F1-Score</th>
                <th className="py-3 px-4 text-right">ROC-AUC</th>
                <th className="py-3 px-4 text-right">Test Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300 font-mono">
              {activeClassMetrics.map((cm) => (
                <tr key={cm.className} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-sans font-medium text-white">
                    {cm.className}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {(cm.precision * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-cyan-400 font-semibold">
                    {(cm.recall * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {(cm.specificity * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-emerald-400 font-semibold">
                    {cm.f1.toFixed(3)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {cm.rocAuc.toFixed(3)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-400">
                    {cm.support}
                  </td>
                </tr>
              ))}
              {/* Macro Average Row */}
              <tr className="bg-slate-850/60 font-semibold text-white">
                <td className="py-3 px-4 font-sans">Macro Average</td>
                <td className="py-3 px-4 text-right">
                  {(activeSummary.macroPrecision * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-right text-cyan-400">
                  {(activeSummary.macroRecall * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-right">96.8%</td>
                <td className="py-3 px-4 text-right text-emerald-400">
                  {activeSummary.macroF1.toFixed(3)}
                </td>
                <td className="py-3 px-4 text-right">
                  {activeSummary.macroRocAuc.toFixed(3)}
                </td>
                <td className="py-3 px-4 text-right text-slate-400">1,200</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
