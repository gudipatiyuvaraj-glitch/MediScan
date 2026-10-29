/**
 * MediScan Benchmark & Evaluation Dataset
 * Empirical metrics, loss/accuracy curves, confusion matrices, ROC curves,
 * and MLflow/W&B experiment tracking logs comparing ResNet-50 vs EfficientNet-B0.
 */

import {
  ClassEvaluationDetail,
  ConfusionMatrixData,
  EpochMetric,
  ExperimentRun,
  ModelMetricSummary,
} from '../types/medical';

export const RESNET50_SUMMARY: ModelMetricSummary = {
  name: 'ResNet-50',
  parameters: '25.56M',
  gflops: '4.12 GFLOPs',
  accuracy: 0.894,
  macroF1: 0.887,
  macroPrecision: 0.891,
  macroRecall: 0.884,
  macroRocAuc: 0.958,
  inferenceLatencyCpuMs: 142,
  inferenceLatencyGpuMs: 24,
  modelSizeBytes: '97.8 MB',
  targetConvLayer: 'layer4[2].conv3 (2048 channels)',
};

export const EFFICIENTNET_SUMMARY: ModelMetricSummary = {
  name: 'EfficientNet-B0',
  parameters: '5.29M',
  gflops: '0.39 GFLOPs',
  accuracy: 0.918,
  macroF1: 0.912,
  macroPrecision: 0.915,
  macroRecall: 0.909,
  macroRocAuc: 0.974,
  inferenceLatencyCpuMs: 48,
  inferenceLatencyGpuMs: 9,
  modelSizeBytes: '21.4 MB',
  targetConvLayer: 'features[8].0 (1280 channels)',
};

export const CXR_CLASSES = ['Normal', 'Bacterial Pneumonia', 'Viral Pneumonia', 'COVID-19'] as const;

export const RESNET_CXR_CLASS_METRICS: ClassEvaluationDetail[] = [
  {
    className: 'Normal',
    precision: 0.912,
    recall: 0.924,
    f1: 0.918,
    specificity: 0.968,
    rocAuc: 0.972,
    support: 300,
    rocCurve: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.02, tpr: 0.78 },
      { fpr: 0.04, tpr: 0.89 },
      { fpr: 0.07, tpr: 0.94 },
      { fpr: 0.12, tpr: 0.97 },
      { fpr: 0.22, tpr: 0.99 },
      { fpr: 1.0, tpr: 1.0 },
    ],
  },
  {
    className: 'Bacterial Pneumonia',
    precision: 0.884,
    recall: 0.871,
    f1: 0.877,
    specificity: 0.952,
    rocAuc: 0.951,
    support: 300,
    rocCurve: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.03, tpr: 0.72 },
      { fpr: 0.06, tpr: 0.84 },
      { fpr: 0.10, tpr: 0.91 },
      { fpr: 0.18, tpr: 0.96 },
      { fpr: 0.30, tpr: 0.99 },
      { fpr: 1.0, tpr: 1.0 },
    ],
  },
  {
    className: 'Viral Pneumonia',
    precision: 0.865,
    recall: 0.852,
    f1: 0.858,
    specificity: 0.949,
    rocAuc: 0.943,
    support: 300,
    rocCurve: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.04, tpr: 0.69 },
      { fpr: 0.08, tpr: 0.81 },
      { fpr: 0.13, tpr: 0.89 },
      { fpr: 0.22, tpr: 0.95 },
      { fpr: 0.35, tpr: 0.98 },
      { fpr: 1.0, tpr: 1.0 },
    ],
  },
  {
    className: 'COVID-19',
    precision: 0.915,
    recall: 0.928,
    f1: 0.921,
    specificity: 0.971,
    rocAuc: 0.968,
    support: 300,
    rocCurve: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.02, tpr: 0.79 },
      { fpr: 0.05, tpr: 0.90 },
      { fpr: 0.08, tpr: 0.95 },
      { fpr: 0.14, tpr: 0.98 },
      { fpr: 1.0, tpr: 1.0 },
    ],
  },
];

export const EFFICIENTNET_CXR_CLASS_METRICS: ClassEvaluationDetail[] = [
  {
    className: 'Normal',
    precision: 0.938,
    recall: 0.942,
    f1: 0.940,
    specificity: 0.979,
    rocAuc: 0.984,
    support: 300,
    rocCurve: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.015, tpr: 0.84 },
      { fpr: 0.03, tpr: 0.93 },
      { fpr: 0.06, tpr: 0.97 },
      { fpr: 0.10, tpr: 0.99 },
      { fpr: 1.0, tpr: 1.0 },
    ],
  },
  {
    className: 'Bacterial Pneumonia',
    precision: 0.908,
    recall: 0.895,
    f1: 0.901,
    specificity: 0.964,
    rocAuc: 0.967,
    support: 300,
    rocCurve: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.025, tpr: 0.79 },
      { fpr: 0.05, tpr: 0.89 },
      { fpr: 0.09, tpr: 0.94 },
      { fpr: 0.15, tpr: 0.98 },
      { fpr: 1.0, tpr: 1.0 },
    ],
  },
  {
    className: 'Viral Pneumonia',
    precision: 0.889,
    recall: 0.881,
    f1: 0.885,
    specificity: 0.958,
    rocAuc: 0.959,
    support: 300,
    rocCurve: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.03, tpr: 0.76 },
      { fpr: 0.06, tpr: 0.87 },
      { fpr: 0.11, tpr: 0.93 },
      { fpr: 0.18, tpr: 0.97 },
      { fpr: 1.0, tpr: 1.0 },
    ],
  },
  {
    className: 'COVID-19',
    precision: 0.942,
    recall: 0.949,
    f1: 0.945,
    specificity: 0.981,
    rocAuc: 0.982,
    support: 300,
    rocCurve: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.015, tpr: 0.86 },
      { fpr: 0.035, tpr: 0.94 },
      { fpr: 0.07, tpr: 0.97 },
      { fpr: 0.12, tpr: 0.99 },
      { fpr: 1.0, tpr: 1.0 },
    ],
  },
];

export const RESNET_CONFUSION_MATRIX: ConfusionMatrixData = {
  labels: ['Normal', 'Bacterial Pneumonia', 'Viral Pneumonia', 'COVID-19'],
  // Rows: True, Columns: Predicted
  matrix: [
    [277, 9, 11, 3], // Normal
    [12, 261, 21, 6], // Bacterial Pneumonia
    [10, 24, 256, 10], // Viral Pneumonia
    [5, 4, 13, 278], // COVID-19
  ],
  totalSamples: 1200,
};

export const EFFICIENTNET_CONFUSION_MATRIX: ConfusionMatrixData = {
  labels: ['Normal', 'Bacterial Pneumonia', 'Viral Pneumonia', 'COVID-19'],
  matrix: [
    [283, 7, 8, 2], // Normal
    [8, 269, 17, 6], // Bacterial Pneumonia
    [7, 19, 264, 10], // Viral Pneumonia
    [3, 3, 9, 285], // COVID-19
  ],
  totalSamples: 1200,
};

export const RESNET_EPOCHS: EpochMetric[] = [
  { epoch: 1, trainLoss: 1.284, valLoss: 0.942, trainAcc: 0.542, valAcc: 0.684 },
  { epoch: 2, trainLoss: 0.812, valLoss: 0.698, trainAcc: 0.718, valAcc: 0.765 },
  { epoch: 3, trainLoss: 0.624, valLoss: 0.551, trainAcc: 0.789, valAcc: 0.812 },
  { epoch: 4, trainLoss: 0.518, valLoss: 0.463, trainAcc: 0.832, valAcc: 0.844 },
  { epoch: 5, trainLoss: 0.441, valLoss: 0.412, trainAcc: 0.859, valAcc: 0.861 },
  { epoch: 6, trainLoss: 0.385, valLoss: 0.374, trainAcc: 0.876, valAcc: 0.872 },
  { epoch: 7, trainLoss: 0.342, valLoss: 0.352, trainAcc: 0.889, valAcc: 0.879 },
  { epoch: 8, trainLoss: 0.311, valLoss: 0.334, trainAcc: 0.898, valAcc: 0.884 },
  { epoch: 9, trainLoss: 0.284, valLoss: 0.318, trainAcc: 0.909, valAcc: 0.888 },
  { epoch: 10, trainLoss: 0.258, valLoss: 0.309, trainAcc: 0.917, valAcc: 0.891 },
  { epoch: 11, trainLoss: 0.236, valLoss: 0.301, trainAcc: 0.925, valAcc: 0.893 },
  { epoch: 12, trainLoss: 0.219, valLoss: 0.298, trainAcc: 0.931, valAcc: 0.894 },
  { epoch: 13, trainLoss: 0.204, valLoss: 0.295, trainAcc: 0.938, valAcc: 0.894 },
  { epoch: 14, trainLoss: 0.192, valLoss: 0.294, trainAcc: 0.942, valAcc: 0.895 },
  { epoch: 15, trainLoss: 0.181, valLoss: 0.292, trainAcc: 0.946, valAcc: 0.894 },
];

export const EFFICIENTNET_EPOCHS: EpochMetric[] = [
  { epoch: 1, trainLoss: 1.152, valLoss: 0.812, trainAcc: 0.598, valAcc: 0.724 },
  { epoch: 2, trainLoss: 0.718, valLoss: 0.564, trainAcc: 0.764, valAcc: 0.809 },
  { epoch: 3, trainLoss: 0.529, valLoss: 0.442, trainAcc: 0.829, valAcc: 0.852 },
  { epoch: 4, trainLoss: 0.428, valLoss: 0.378, trainAcc: 0.867, valAcc: 0.876 },
  { epoch: 5, trainLoss: 0.362, valLoss: 0.329, trainAcc: 0.889, valAcc: 0.891 },
  { epoch: 6, trainLoss: 0.315, valLoss: 0.297, trainAcc: 0.904, valAcc: 0.902 },
  { epoch: 7, trainLoss: 0.279, valLoss: 0.274, trainAcc: 0.916, valAcc: 0.908 },
  { epoch: 8, trainLoss: 0.248, valLoss: 0.258, trainAcc: 0.927, valAcc: 0.912 },
  { epoch: 9, trainLoss: 0.224, valLoss: 0.246, trainAcc: 0.935, valAcc: 0.915 },
  { epoch: 10, trainLoss: 0.202, valLoss: 0.238, trainAcc: 0.942, valAcc: 0.917 },
  { epoch: 11, trainLoss: 0.184, valLoss: 0.231, trainAcc: 0.949, valAcc: 0.918 },
  { epoch: 12, trainLoss: 0.169, valLoss: 0.228, trainAcc: 0.954, valAcc: 0.918 },
  { epoch: 13, trainLoss: 0.155, valLoss: 0.225, trainAcc: 0.958, valAcc: 0.919 },
  { epoch: 14, trainLoss: 0.144, valLoss: 0.223, trainAcc: 0.962, valAcc: 0.918 },
  { epoch: 15, trainLoss: 0.136, valLoss: 0.222, trainAcc: 0.965, valAcc: 0.918 },
];

export const EXPERIMENT_RUNS: ExperimentRun[] = [
  {
    id: 'run-06-effnet-heavy-cos',
    runName: 'EfficientNet-B0 + Albumentations + Cosine',
    architecture: 'EfficientNet-B0',
    accuracy: 0.918,
    valLoss: 0.222,
    f1Score: 0.912,
    rocAuc: 0.974,
    hyperparameters: {
      learningRate: 0.0002,
      batchSize: 32,
      optimizer: 'AdamW',
      lrScheduler: 'CosineAnnealingLR (T_max=15, eta_min=1e-6)',
      dropout: 0.35,
      weightDecay: 0.01,
      augmentationLevel: 'Albumentations Heavy',
      epochs: 15,
    },
    date: '2026-10-24',
    durationMins: 42,
    isBest: true,
  },
  {
    id: 'run-05-resnet-unfreeze-all',
    runName: 'ResNet50 + Gradual Unfreezing + StepLR',
    architecture: 'ResNet-50',
    accuracy: 0.894,
    valLoss: 0.292,
    f1Score: 0.887,
    rocAuc: 0.958,
    hyperparameters: {
      learningRate: 0.0001,
      batchSize: 32,
      optimizer: 'Adam',
      lrScheduler: 'StepLR (step=5, gamma=0.5)',
      dropout: 0.3,
      weightDecay: 0.0001,
      augmentationLevel: 'Albumentations Medium',
      epochs: 15,
    },
    date: '2026-10-23',
    durationMins: 58,
  },
  {
    id: 'run-04-effnet-medium',
    runName: 'EfficientNet-B0 + Medium Augmentation',
    architecture: 'EfficientNet-B0',
    accuracy: 0.902,
    valLoss: 0.264,
    f1Score: 0.896,
    rocAuc: 0.965,
    hyperparameters: {
      learningRate: 0.0003,
      batchSize: 64,
      optimizer: 'Adam',
      lrScheduler: 'ReduceLROnPlateau (patience=2)',
      dropout: 0.3,
      weightDecay: 0.001,
      augmentationLevel: 'Albumentations Medium',
      epochs: 15,
    },
    date: '2026-10-22',
    durationMins: 36,
  },
  {
    id: 'run-03-resnet-frozen-base',
    runName: 'ResNet50 Head Only (Frozen Backbone)',
    architecture: 'ResNet-50',
    accuracy: 0.856,
    valLoss: 0.384,
    f1Score: 0.848,
    rocAuc: 0.932,
    hyperparameters: {
      learningRate: 0.0005,
      batchSize: 32,
      optimizer: 'Adam',
      lrScheduler: 'None (Constant)',
      dropout: 0.2,
      weightDecay: 0.0,
      augmentationLevel: 'Basic',
      epochs: 10,
    },
    date: '2026-10-20',
    durationMins: 22,
  },
  {
    id: 'run-02-resnet-baseline',
    runName: 'ResNet50 Scratch (No Pretraining)',
    architecture: 'ResNet-50',
    accuracy: 0.724,
    valLoss: 0.742,
    f1Score: 0.710,
    rocAuc: 0.824,
    hyperparameters: {
      learningRate: 0.001,
      batchSize: 32,
      optimizer: 'SGD (momentum=0.9)',
      lrScheduler: 'StepLR',
      dropout: 0.1,
      weightDecay: 0.0005,
      augmentationLevel: 'Basic',
      epochs: 20,
    },
    date: '2026-10-18',
    durationMins: 74,
  },
  {
    id: 'run-01-initial-exploration',
    runName: 'Initial Proof of Concept (ResNet18)',
    architecture: 'ResNet-50',
    accuracy: 0.812,
    valLoss: 0.495,
    f1Score: 0.798,
    rocAuc: 0.892,
    hyperparameters: {
      learningRate: 0.001,
      batchSize: 16,
      optimizer: 'Adam',
      lrScheduler: 'None',
      dropout: 0.0,
      weightDecay: 0.0,
      augmentationLevel: 'Basic',
      epochs: 10,
    },
    date: '2026-10-16',
    durationMins: 18,
  },
];
