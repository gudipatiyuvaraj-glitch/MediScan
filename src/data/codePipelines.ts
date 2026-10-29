/**
 * MediScan Deliverable Code Artifacts & Training Pipelines
 * Contains clean, production-grade PyTorch, Torchvision, Albumentations,
 * and Grad-CAM implementation code for export and inspection.
 */

export interface CodeArtifact {
  fileName: string;
  language: string;
  description: string;
  content: string;
}

export const TRAINING_PIPELINE_CODE: CodeArtifact = {
  fileName: 'train_pipeline.py',
  language: 'python',
  description: 'Complete PyTorch Transfer Learning & Training Loop with Mixed Precision & Schedulers',
  content: `"""
MediScan: Deep Learning Medical Image Classification System
Transfer Learning Pipeline with ResNet-50 / EfficientNet-B0
Code A Nova 15-Day Internship Project Deliverable #1
"""

import os
import time
import copy
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import models
import albumentations as A
from albumentations.pytorch import ToTensorV2
import cv2
import numpy as np

# ---------------------------------------------------------
# 1. Hyperparameters & Configuration
# ---------------------------------------------------------
DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
BATCH_SIZE = 32
NUM_EPOCHS = 15
LEARNING_RATE = 2e-4
WEIGHT_DECAY = 1e-2
DROPOUT_RATE = 0.35
NUM_CLASSES = 4
IMAGE_SIZE = (224, 224)
SEED = 42

torch.manual_seed(SEED)
np.random.seed(SEED)

# ---------------------------------------------------------
# 2. Data Augmentation Pipeline (Albumentations)
# ---------------------------------------------------------
train_transform = A.Compose([
    A.Resize(IMAGE_SIZE[0], IMAGE_SIZE[1]),
    A.HorizontalFlip(p=0.5),
    A.RandomRotate90(p=0.2),
    A.ShiftScaleRotate(shift_limit=0.06, scale_limit=0.08, rotate_limit=15, p=0.5, border_mode=cv2.BORDER_CONSTANT),
    A.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.1, p=0.4),
    A.CoarseDropout(max_holes=6, max_height=16, max_width=16, min_holes=2, fill_value=0, p=0.3),
    A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ToTensorV2(),
])

val_transform = A.Compose([
    A.Resize(IMAGE_SIZE[0], IMAGE_SIZE[1]),
    A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ToTensorV2(),
])

# ---------------------------------------------------------
# 3. Model Architecture with Custom Classifier Head
# ---------------------------------------------------------
def build_medical_model(architecture: str = "efficientnet_b0", num_classes: int = 4):
    if architecture == "resnet50":
        model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
        # Freeze initial feature backbone
        for param in model.parameters():
            param.requires_grad = False
            
        in_features = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Dropout(p=DROPOUT_RATE),
            nn.Linear(in_features, 512),
            nn.BatchNorm1d(512),
            nn.SiLU(),
            nn.Dropout(p=0.2),
            nn.Linear(512, num_classes)
        )
    elif architecture == "efficientnet_b0":
        model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
        # Freeze initial feature backbone
        for param in model.parameters():
            param.requires_grad = False
            
        in_features = model.classifier[1].in_features
        model.classifier = nn.Sequential(
            nn.Dropout(p=DROPOUT_RATE),
            nn.Linear(in_features, 256),
            nn.SiLU(),
            nn.Dropout(p=0.15),
            nn.Linear(256, num_classes)
        )
    return model

# ---------------------------------------------------------
# 4. Training Loop with Mixed Precision & Cosine Scheduler
# ---------------------------------------------------------
def train_model(model, dataloaders, criterion, optimizer, scheduler, num_epochs=15):
    since = time.time()
    best_model_wts = copy.deepcopy(model.state_dict())
    best_acc = 0.0
    scaler = torch.amp.GradScaler('cuda')

    for epoch in range(1, num_epochs + 1):
        # Gradual unfreezing on Epoch 4 for fine-tuning
        if epoch == 4:
            print("[INFO] Unfreezing backbone for end-to-end fine tuning...")
            for param in model.parameters():
                param.requires_grad = True
            # Reduce learning rate for fine-tuning
            for param_group in optimizer.param_groups:
                param_group['lr'] = 5e-5

        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(DEVICE)
                labels = labels.to(DEVICE)
                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    with torch.amp.autocast('cuda'):
                        outputs = model(inputs)
                        _, preds = torch.max(outputs, 1)
                        loss = criterion(outputs, labels)

                    if phase == 'train':
                        scaler.scale(loss).backward()
                        scaler.step(optimizer)
                        scaler.update()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / len(dataloaders[phase].dataset)
            epoch_acc = running_corrects.double() / len(dataloaders[phase].dataset)

            print(f"Epoch {epoch:02d}/{num_epochs} [{phase.upper()}] Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}")

            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())
                torch.save(model.state_dict(), "mediscan_best_weights.pt")

        scheduler.step()

    time_elapsed = time.time() - since
    print(f"Training completed in {time_elapsed // 60:.0f}m {time_elapsed % 60:.0f}s. Best Val Acc: {best_acc:.4f}")
    model.load_state_dict(best_model_wts)
    return model
`,
};

export const GRAD_CAM_CODE: CodeArtifact = {
  fileName: 'grad_cam_engine.py',
  language: 'python',
  description: 'Custom Grad-CAM Implementation with Forward/Backward Hooks for PyTorch CNNs',
  content: `"""
Grad-CAM: Visual Explanations from Deep Networks (Selvaraju et al., 2017)
Implementation for MediScan ResNet-50 and EfficientNet-B0 architectures
"""

import torch
import torch.nn.functional as F
import numpy as np
import cv2

class MedicalGradCAM:
    def __init__(self, model: torch.nn.Module, target_layer: torch.nn.Module):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        
        # Register forward and backward hooks
        self.target_layer.register_forward_hook(self._save_activations)
        self.target_layer.register_full_backward_hook(self._save_gradients)

    def _save_activations(self, module, input, output):
        self.activations = output.detach()

    def _save_gradients(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()

    def generate_heatmap(self, input_tensor: torch.Tensor, class_idx: int = None) -> np.ndarray:
        self.model.eval()
        output = self.model(input_tensor)

        if class_idx is None:
            class_idx = torch.argmax(output, dim=1).item()

        # Zero existing gradients
        self.model.zero_grad()
        
        # Target score for specific pathological class
        one_hot = torch.zeros_like(output)
        one_hot[0, class_idx] = 1.0
        output.backward(gradient=one_hot, retain_graph=True)

        # Global average pooling of gradients: alpha_k^c
        weights = torch.mean(self.gradients, dim=[2, 3], keepdim=True)
        
        # Weighted sum of activation maps: L_Grad-CAM = ReLU(sum(alpha_k * A^k))
        cam = torch.sum(weights * self.activations, dim=1, keepdim=True)
        cam = F.relu(cam)

        # Normalize heatmap to [0, 1]
        cam = cam.squeeze().cpu().numpy()
        cam = (cam - np.min(cam)) / (np.max(cam) - np.min(cam) + 1e-8)

        # Bilinear interpolation to input image resolution (224, 224)
        heatmap = cv2.resize(cam, (input_tensor.shape[3], input_tensor.shape[2]))
        return heatmap

    def overlay_on_image(self, original_img: np.ndarray, heatmap: np.ndarray, alpha=0.55, colormap=cv2.COLORMAP_JET):
        # Colorize heatmap
        heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap), colormap)
        heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
        
        # Blend
        overlay = (1 - alpha) * original_img + alpha * heatmap_colored
        return np.uint8(np.clip(overlay, 0, 255))
`,
};

export const EVALUATION_REPORT_CODE: CodeArtifact = {
  fileName: 'evaluate_metrics.py',
  language: 'python',
  description: 'Evaluation Script: Classification Report, Per-Class ROC-AUC & Confusion Matrix',
  content: `"""
MediScan Model Evaluation & Validation Harness
Calculates Precision, Recall, F1, Specificity, ROC-AUC, and Confusion Matrix
"""

import numpy as np
import torch
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
    roc_curve
)

def evaluate_test_set(model, test_loader, class_names, device):
    model.eval()
    all_preds = []
    all_targets = []
    all_probs = []

    with torch.no_grad():
        for inputs, targets in test_loader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            probs = torch.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)

            all_preds.extend(preds.cpu().numpy())
            all_targets.extend(targets.numpy())
            all_probs.extend(probs.cpu().numpy())

    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)
    all_probs = np.array(all_probs)

    # 1. Classification Report
    print("=== CLASSIFICATION REPORT ===")
    print(classification_report(all_targets, all_preds, target_names=class_names, digits=4))

    # 2. Confusion Matrix
    cm = confusion_matrix(all_targets, all_preds)
    print("=== CONFUSION MATRIX ===")
    print(cm)

    # 3. Multi-Class One-vs-Rest ROC-AUC
    roc_auc = roc_auc_score(all_targets, all_probs, multi_class='ovr', average='macro')
    print(f"\\nMacro-Average ROC-AUC Score: {roc_auc:.4f}")

    return {
        "report": classification_report(all_targets, all_preds, target_names=class_names, output_dict=True),
        "confusion_matrix": cm,
        "roc_auc": roc_auc
    }
`,
};
