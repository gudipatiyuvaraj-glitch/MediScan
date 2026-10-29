/**
 * MediScan ML Pipeline, Augmentation Playground & Code Artifacts
 * Features interactive Albumentations simulation, MLflow experiment tracking,
 * and executable PyTorch training scripts viewer.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Code2,
  Copy,
  Download,
  Check,
  Sparkles,
  Sliders,
  Database,
  Terminal,
} from 'lucide-react';
import {
  TRAINING_PIPELINE_CODE,
  GRAD_CAM_CODE,
  EVALUATION_REPORT_CODE,
  CodeArtifact,
} from '../data/codePipelines';
import { EXPERIMENT_RUNS } from '../data/benchmarkData';

export const MLPipelineStudio: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'train' | 'gradcam' | 'evaluate'>('train');
  const [copied, setCopied] = useState<boolean>(false);

  // Augmentation Playground Controls
  const [enableFlip, setEnableFlip] = useState<boolean>(true);
  const [rotationDeg, setRotationDeg] = useState<number>(10);
  const [brightness, setBrightness] = useState<number>(1.15);
  const [contrast, setContrast] = useState<number>(1.2);
  const [enableDropoutHoles, setEnableDropoutHoles] = useState<boolean>(true);

  const augCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const codeFiles: Record<'train' | 'gradcam' | 'evaluate', CodeArtifact> = {
    train: TRAINING_PIPELINE_CODE,
    gradcam: GRAD_CAM_CODE,
    evaluate: EVALUATION_REPORT_CODE,
  };

  const currentCode = codeFiles[activeCodeTab];

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download python file
  const handleDownloadCode = () => {
    const blob = new Blob([currentCode.content], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentCode.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Redraw Augmentation Playground Canvas
  useEffect(() => {
    const canvas = augCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/src/assets/images/chest_xray_pneumonia_1793274327599.jpg';

    img.onload = () => {
      canvas.width = 320;
      canvas.height = 320;
      ctx.clearRect(0, 0, 320, 320);

      ctx.save();
      // Center translation for rotation
      ctx.translate(160, 160);

      if (enableFlip) {
        ctx.scale(-1, 1);
      }

      ctx.rotate((rotationDeg * Math.PI) / 180);

      // Apply CSS filter for brightness and contrast
      ctx.filter = `brightness(${brightness}) contrast(${contrast})`;
      ctx.drawImage(img, -160, -160, 320, 320);

      ctx.filter = 'none';

      // CoarseDropout holes simulation
      if (enableDropoutHoles) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(-90, -40, 24, 24);
        ctx.fillRect(40, 20, 28, 28);
        ctx.fillRect(-20, 80, 20, 20);
      }

      ctx.restore();
    };
  }, [enableFlip, rotationDeg, brightness, contrast, enableDropoutHoles]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            ML Pipeline Engineering & Reproducibility
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Data augmentation pipeline, MLflow experiment tracking, and complete PyTorch deliverables.
          </p>
        </div>

        <button
          onClick={() => {
            // Sequential download of all deliverable scripts
            const deliverables = [
              { name: 'train_pipeline.py', content: TRAINING_PIPELINE_CODE.content },
              { name: 'grad_cam_engine.py', content: GRAD_CAM_CODE.content },
              { name: 'evaluate_metrics.py', content: EVALUATION_REPORT_CODE.content },
              {
                name: 'requirements.txt',
                content:
                  'torch>=2.2.0\ntorchvision>=0.17.0\nalbumentations>=1.4.0\nopencv-python-headless>=4.9.0\nscikit-learn>=1.4.0\nnumpy>=1.26.0\npillow>=10.2.0\nmlflow>=2.11.0\nstreamlit>=1.32.0\n',
              },
            ];

            deliverables.forEach((item, index) => {
              setTimeout(() => {
                const blob = new Blob([item.content], { type: 'text/plain;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = item.name;
                a.click();
                URL.revokeObjectURL(a.href);
              }, index * 250);
            });
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Complete Code Suite (4 Files)</span>
        </button>
      </div>

      {/* Interactive Data Augmentation Playground */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Albumentations Data Augmentation Simulator (Day 3 & 4)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate real-time stochastic transforms applied to training batches before tensor conversion.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            A.Compose Pipeline Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Canvas Preview (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative aspect-square w-64 rounded-lg overflow-hidden bg-black border border-slate-700 shadow-md">
              <canvas ref={augCanvasRef} className="w-full h-full object-contain" />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-slate-800 text-[10px] font-mono text-cyan-400">
                Rot: {rotationDeg}° · Bright: {Math.round(brightness * 100)}%
              </div>
            </div>
            <span className="text-[11px] text-slate-500 mt-2 font-mono">
              Batch input matrix: 224 × 224 × 3
            </span>
          </div>

          {/* Right Parameters (7 cols) */}
          <div className="md:col-span-7 space-y-3 text-xs">
            {/* Horizontal Flip */}
            <div className="flex items-center justify-between p-2.5 rounded bg-slate-850 border border-slate-800">
              <div>
                <span className="font-semibold text-slate-200">A.HorizontalFlip(p=0.5)</span>
                <p className="text-[11px] text-slate-400">Inverts left/right orientation</p>
              </div>
              <input
                type="checkbox"
                checked={enableFlip}
                onChange={(e) => setEnableFlip(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
              />
            </div>

            {/* Rotation Slider */}
            <div className="p-2.5 rounded bg-slate-850 border border-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-200">
                  A.ShiftScaleRotate(limit=15°)
                </span>
                <span className="font-mono text-cyan-400">{rotationDeg}°</span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="1"
                value={rotationDeg}
                onChange={(e) => setRotationDeg(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Color Jitter Brightness & Contrast */}
            <div className="p-2.5 rounded bg-slate-850 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-200">
                  A.ColorJitter(brightness, contrast)
                </span>
                <span className="font-mono text-cyan-400">
                  B: {Math.round(brightness * 100)}% | C: {Math.round(contrast * 100)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="range"
                  min="0.8"
                  max="1.3"
                  step="0.05"
                  value={brightness}
                  onChange={(e) => setBrightness(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.05"
                  value={contrast}
                  onChange={(e) => setContrast(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* CoarseDropout Holes */}
            <div className="flex items-center justify-between p-2.5 rounded bg-slate-850 border border-slate-800">
              <div>
                <span className="font-semibold text-slate-200">
                  A.CoarseDropout(holes=6, size=16px)
                </span>
                <p className="text-[11px] text-slate-400">Simulates ECG lead occlusions and localized artifacts</p>
              </div>
              <input
                type="checkbox"
                checked={enableDropoutHoles}
                onChange={(e) => setEnableDropoutHoles(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MLflow / Weights & Biases Experiment History Table */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                MLflow / W&B Experiment Tracking Logs (Day 8 & 13)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged hyperparameters, loss metrics, and validation runs across training iterations.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            6 Runs Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Run Name</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4 text-right">LR</th>
                <th className="py-3 px-4 text-right">Batch</th>
                <th className="py-3 px-4">Optimizer & Scheduler</th>
                <th className="py-3 px-4 text-right">Val Loss</th>
                <th className="py-3 px-4 text-right">Val Acc</th>
                <th className="py-3 px-4 text-right">ROC-AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300 font-mono">
              {EXPERIMENT_RUNS.map((run) => (
                <tr
                  key={run.id}
                  className={
                    run.isBest
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/15'
                      : 'hover:bg-slate-800/40'
                  }
                >
                  <td className="py-3 px-4 font-sans font-medium text-white flex items-center gap-2">
                    {run.isBest && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                    <span>{run.runName}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{run.architecture}</td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {run.hyperparameters.learningRate}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {run.hyperparameters.batchSize}
                  </td>
                  <td className="py-3 px-4 text-slate-400 truncate max-w-xs font-sans text-[11px]">
                    {run.hyperparameters.optimizer} · {run.hyperparameters.lrScheduler.split(' ')[0]}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {run.valLoss.toFixed(3)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums font-semibold text-white">
                    <span className={run.isBest ? 'text-cyan-400 font-bold' : ''}>
                      {(run.accuracy * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-emerald-400">
                    {run.rocAuc.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Deliverable Inspector & Exporter (Deliverable #1) */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Deliverable Code Artifacts (PyTorch + Torchvision + Albumentations)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* File Switcher */}
            <div className="flex items-center bg-slate-800 p-1 rounded-md text-xs">
              <button
                onClick={() => setActiveCodeTab('train')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeCodeTab === 'train'
                    ? 'bg-slate-700 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                train_pipeline.py
              </button>
              <button
                onClick={() => setActiveCodeTab('gradcam')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeCodeTab === 'gradcam'
                    ? 'bg-slate-700 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                grad_cam_engine.py
              </button>
              <button
                onClick={() => setActiveCodeTab('evaluate')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeCodeTab === 'evaluate'
                    ? 'bg-slate-700 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                evaluate_metrics.py
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
              title="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadCode}
              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors"
              title="Download Script"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
          <pre>{currentCode.content}</pre>
        </div>
      </div>
    </div>
  );
};
