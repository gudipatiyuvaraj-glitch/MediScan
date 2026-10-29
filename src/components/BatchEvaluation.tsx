/**
 * MediScan Batch Prediction & Triage Studio
 * Enables batch processing of medical imaging cohorts, status filtering,
 * latency profiling, and CSV export of diagnostic findings.
 */

import React, { useState } from 'react';
import {
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileSpreadsheet,
  Layers,
  Search,
} from 'lucide-react';
import { BatchItem, MedicalClass, ModalityType } from '../types/medical';

const MOCK_BATCH_DATA: BatchItem[] = [
  {
    id: 'batch-001',
    fileName: 'CXR_PA_089412.dcm',
    modality: 'chest_xray',
    imageUrl: '/src/assets/images/chest_xray_pneumonia_1793274327599.jpg',
    predictedClass: 'Bacterial Pneumonia',
    groundTruth: 'Bacterial Pneumonia',
    confidence: 0.948,
    latencyMs: 46,
    model: 'EfficientNet-B0',
    status: 'completed',
    topProbabilities: [
      { className: 'Bacterial Pneumonia', probability: 0.948 },
      { className: 'Viral Pneumonia', probability: 0.034 },
    ],
    gradCamHotspot: 'Right Lower Lobe Consolidation',
  },
  {
    id: 'batch-002',
    fileName: 'CXR_PA_045109.dcm',
    modality: 'chest_xray',
    imageUrl: '/src/assets/images/chest_xray_covid_1793274329142.jpg',
    predictedClass: 'COVID-19',
    groundTruth: 'COVID-19',
    confidence: 0.923,
    latencyMs: 49,
    model: 'EfficientNet-B0',
    status: 'completed',
    topProbabilities: [
      { className: 'COVID-19', probability: 0.923 },
      { className: 'Viral Pneumonia', probability: 0.052 },
    ],
    gradCamHotspot: 'Bilateral Peripheral Ground Glass',
  },
  {
    id: 'batch-003',
    fileName: 'CXR_PA_010382.dcm',
    modality: 'chest_xray',
    imageUrl: '/src/assets/images/chest_xray_normal_1793274327761.jpg',
    predictedClass: 'Normal',
    groundTruth: 'Normal',
    confidence: 0.965,
    latencyMs: 44,
    model: 'EfficientNet-B0',
    status: 'completed',
    topProbabilities: [
      { className: 'Normal', probability: 0.965 },
      { className: 'Bacterial Pneumonia', probability: 0.016 },
    ],
    gradCamHotspot: 'Diffuse Clear Parenchyma',
  },
  {
    id: 'batch-004',
    fileName: 'DERM_MACRO_072105.jpg',
    modality: 'dermoscopy',
    imageUrl: '/src/assets/images/skin_lesion_melanoma_1793274329261.jpg',
    predictedClass: 'Melanoma',
    groundTruth: 'Melanoma',
    confidence: 0.912,
    latencyMs: 51,
    model: 'EfficientNet-B0',
    status: 'completed',
    topProbabilities: [
      { className: 'Melanoma', probability: 0.912 },
      { className: 'Benign Nevus', probability: 0.051 },
    ],
    gradCamHotspot: 'Atypical Peripheral Pigment Network',
  },
  {
    id: 'batch-005',
    fileName: 'DERM_MACRO_031849.jpg',
    modality: 'dermoscopy',
    imageUrl: '/src/assets/images/skin_lesion_nevus_1793274329199.jpg',
    predictedClass: 'Benign Nevus',
    groundTruth: 'Benign Nevus',
    confidence: 0.954,
    latencyMs: 47,
    model: 'EfficientNet-B0',
    status: 'completed',
    topProbabilities: [
      { className: 'Benign Nevus', probability: 0.954 },
      { className: 'Melanoma', probability: 0.022 },
    ],
    gradCamHotspot: 'Homogeneous Symmetrical Reticular Mesh',
  },
  {
    id: 'batch-006',
    fileName: 'CXR_AP_PORTABLE_01923.dcm',
    modality: 'chest_xray',
    imageUrl: '/src/assets/images/chest_xray_pneumonia_1793274327599.jpg',
    predictedClass: 'Viral Pneumonia',
    groundTruth: 'Viral Pneumonia',
    confidence: 0.732,
    latencyMs: 48,
    model: 'EfficientNet-B0',
    status: 'flagged',
    flagReason: 'Low Confidence Threshold (< 75%)',
    topProbabilities: [
      { className: 'Viral Pneumonia', probability: 0.732 },
      { className: 'Bacterial Pneumonia', probability: 0.218 },
    ],
    gradCamHotspot: 'Patchy Interstitial Markings',
  },
  {
    id: 'batch-007',
    fileName: 'CXR_PA_066291.dcm',
    modality: 'chest_xray',
    imageUrl: '/src/assets/images/chest_xray_normal_1793274327761.jpg',
    predictedClass: 'Normal',
    groundTruth: 'Normal',
    confidence: 0.981,
    latencyMs: 45,
    model: 'EfficientNet-B0',
    status: 'completed',
    topProbabilities: [
      { className: 'Normal', probability: 0.981 },
      { className: 'COVID-19', probability: 0.009 },
    ],
    gradCamHotspot: 'Clear Costophrenic Angles',
  },
  {
    id: 'batch-008',
    fileName: 'CXR_PA_098711.dcm',
    modality: 'chest_xray',
    imageUrl: '/src/assets/images/chest_xray_covid_1793274329142.jpg',
    predictedClass: 'COVID-19',
    groundTruth: 'COVID-19',
    confidence: 0.939,
    latencyMs: 50,
    model: 'EfficientNet-B0',
    status: 'completed',
    topProbabilities: [
      { className: 'COVID-19', probability: 0.939 },
      { className: 'Viral Pneumonia', probability: 0.041 },
    ],
    gradCamHotspot: 'Subpleural Basilar Opacities',
  },
];

export const BatchEvaluation: React.FC = () => {
  const [items] = useState<BatchItem[]>(MOCK_BATCH_DATA);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPreview, setSelectedPreview] = useState<BatchItem | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'flagged' && item.status === 'flagged') ||
      (filterStatus === 'completed' && item.status === 'completed');
    const matchesSearch =
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.predictedClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gradCamHotspot.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate cohort KPIs
  const totalScans = items.length;
  const highConfidenceCount = items.filter((i) => i.confidence >= 0.9).length;
  const flaggedCount = items.filter((i) => i.status === 'flagged').length;
  const avgLatency = Math.round(
    items.reduce((acc, curr) => acc + curr.latencyMs, 0) / items.length
  );

  // CSV Export functionality
  const handleExportCSV = () => {
    const headers = [
      'File Name',
      'Modality',
      'Predicted Pathology',
      'Confidence Score (%)',
      'Ground Truth',
      'Latency (ms)',
      'Model Architecture',
      'Grad-CAM Hotspot Region',
      'Triage Status',
    ];

    const rows = items.map((i) => [
      i.fileName,
      i.modality,
      i.predictedClass,
      (i.confidence * 100).toFixed(1),
      i.groundTruth || 'N/A',
      i.latencyMs,
      i.model,
      `"${i.gradCamHotspot}"`,
      i.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mediscan_batch_triage_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Batch Diagnostic Triage Cohort
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            High-throughput automated classification queue with latency tracking and CSV export.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {/* Cohort KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
            Total Cohort Scans
          </span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {totalScans}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">100% Processed</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
            High Confidence (&gt;90%)
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {highConfidenceCount} / {totalScans}
          </div>
          <span className="text-[11px] text-emerald-500/80 mt-0.5 block">
            {Math.round((highConfidenceCount / totalScans) * 100)}% Auto-cleared
          </span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
            Flagged for Human Review
          </span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {flaggedCount}
          </div>
          <span className="text-[11px] text-amber-500/80 mt-0.5 block">
            Confidence &lt; 75% or Discordance
          </span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
            Mean Inference Latency
          </span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {avgLatency} ms
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Target &lt; 3000 ms (Passed)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search scans, classes, or anatomy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 text-xs text-slate-200 pl-9 pr-3 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              filterStatus === 'all'
                ? 'bg-slate-800 text-cyan-400 font-medium border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Scans ({items.length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              filterStatus === 'completed'
                ? 'bg-slate-800 text-cyan-400 font-medium border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Auto-Cleared ({items.filter((i) => i.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilterStatus('flagged')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              filterStatus === 'flagged'
                ? 'bg-slate-800 text-amber-400 font-medium border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Review Required ({flaggedCount})
          </button>
        </div>
      </div>

      {/* Batch Data Table */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Scan</th>
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">Predicted Condition</th>
                <th className="py-3 px-4 text-right">Confidence</th>
                <th className="py-3 px-4">Grad-CAM Salient Epicenter</th>
                <th className="py-3 px-4 text-right">Latency</th>
                <th className="py-3 px-4 text-center">Triage Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredItems.map((item) => {
                const isFlagged = item.status === 'flagged';
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedPreview(item)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <img
                        src={item.imageUrl}
                        alt={item.fileName}
                        className="w-10 h-10 object-cover rounded bg-black border border-slate-700 shrink-0"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-200">
                      {item.fileName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white">
                        {item.predictedClass}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <span
                        className={
                          item.confidence >= 0.9
                            ? 'text-emerald-400 font-bold'
                            : item.confidence < 0.75
                            ? 'text-amber-400 font-bold'
                            : 'text-slate-300'
                        }
                      >
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {item.gradCamHotspot}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-cyan-400">
                      {item.latencyMs} ms
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isFlagged ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Review</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm">
                  {selectedPreview.fileName}
                </h3>
                <p className="text-xs text-slate-400">
                  Model: {selectedPreview.model} · Latency: {selectedPreview.latencyMs} ms
                </p>
              </div>
              <button
                onClick={() => setSelectedPreview(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="aspect-square w-full rounded-lg overflow-hidden bg-black border border-slate-800">
              <img
                src={selectedPreview.imageUrl}
                alt={selectedPreview.fileName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Predicted Diagnosis:</span>
                <span className="font-bold text-white">
                  {selectedPreview.predictedClass}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confidence:</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {(selectedPreview.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Grad-CAM Salient Target:</span>
                <span className="text-slate-300 font-medium">
                  {selectedPreview.gradCamHotspot}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPreview(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium transition-colors"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
