/**
 * MediScan - Medical Image Classification & Explainability System
 * Type definitions for clinical modalities, predictions, Grad-CAM, benchmarks, and experiments.
 */

export type ModalityType = 'chest_xray' | 'dermoscopy';

export type CXRClass = 'Normal' | 'Bacterial Pneumonia' | 'Viral Pneumonia' | 'COVID-19';
export type SkinClass = 'Benign Nevus' | 'Melanoma' | 'Basal Cell Carcinoma' | 'Seborrheic Keratosis';

export type MedicalClass = CXRClass | SkinClass;

export type ModelArchitecture = 'ResNet-50' | 'EfficientNet-B0';

export interface ClassProbability {
  className: MedicalClass;
  probability: number; // 0 to 1
  isTopPredicted?: boolean;
  isGroundTruth?: boolean;
}

export interface GradCamConfig {
  opacity: number; // 0 to 1
  colormap: 'jet' | 'viridis' | 'magma' | 'turbo';
  threshold: number; // 0 to 1
  showContours: boolean;
  targetLayer: string;
  layerDepth: 'deep' | 'mid' | 'early';
  intensityBoost: number;
}

export interface RobustnessConfig {
  gaussianNoise: number; // 0 to 1
  motionBlur: number; // 0 to 10
  contrastDegrade: number; // 0.5 to 1.5
  syntheticArtifact: 'none' | 'ecg_lead' | 'hair_strand' | 'marker_pen';
}

export interface DicomWindowPreset {
  name: string;
  windowWidth: number;
  windowLevel: number;
  description: string;
}

export interface ClinicalSampleCase {
  id: string;
  title: string;
  modality: ModalityType;
  patientId: string;
  age: number;
  gender: 'M' | 'F';
  groundTruth: MedicalClass;
  imagePath: string;
  description: string;
  clinicalHistory: string;
  anatomicalLocation: string;
  predictedClass: MedicalClass;
  confidence: number;
  model: ModelArchitecture;
  probabilities: ClassProbability[];
  gradCamRegion: {
    centerX: number; // normalized 0..1
    centerY: number; // normalized 0..1
    radiusX: number;
    radiusY: number;
    intensity: number;
    secondaryRegion?: {
      centerX: number;
      centerY: number;
      radiusX: number;
      radiusY: number;
      intensity: number;
    };
  };
  dicomMetadata?: {
    sopInstanceUid: string;
    modality: string;
    photometricInterpretation: string;
    kvp: number;
    exposureTime: number;
    pixelSpacing: string;
    sliceThickness?: string;
  };
  findings: string;
  radiologistImpression: string;
  differentialDiagnosis: string[];
}

export interface BatchItem {
  id: string;
  fileName: string;
  modality: ModalityType;
  imageUrl: string;
  predictedClass: MedicalClass;
  groundTruth?: MedicalClass;
  confidence: number;
  latencyMs: number;
  model: ModelArchitecture;
  status: 'completed' | 'processing' | 'flagged';
  flagReason?: string;
  topProbabilities: { className: MedicalClass; probability: number }[];
  gradCamHotspot: string;
}

export interface ExperimentRun {
  id: string;
  runName: string;
  architecture: ModelArchitecture;
  accuracy: number;
  valLoss: number;
  f1Score: number;
  rocAuc: number;
  hyperparameters: {
    learningRate: number;
    batchSize: number;
    optimizer: string;
    lrScheduler: string;
    dropout: number;
    weightDecay: number;
    augmentationLevel: 'Basic' | 'Albumentations Medium' | 'Albumentations Heavy';
    epochs: number;
  };
  date: string;
  durationMins: number;
  isBest?: boolean;
}

export interface ModelMetricSummary {
  name: ModelArchitecture;
  parameters: string;
  gflops: string;
  accuracy: number;
  macroF1: number;
  macroPrecision: number;
  macroRecall: number;
  macroRocAuc: number;
  inferenceLatencyCpuMs: number;
  inferenceLatencyGpuMs: number;
  modelSizeBytes: string;
  targetConvLayer: string;
}

export interface ConfusionMatrixData {
  labels: MedicalClass[];
  matrix: number[][]; // [true_idx][pred_idx]
  totalSamples: number;
}

export interface RocCurvePoint {
  fpr: number;
  tpr: number;
}

export interface ClassEvaluationDetail {
  className: MedicalClass;
  precision: number;
  recall: number;
  f1: number;
  specificity: number;
  rocAuc: number;
  support: number;
  rocCurve: RocCurvePoint[];
}

export interface EpochMetric {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  trainAcc: number;
  valAcc: number;
}
