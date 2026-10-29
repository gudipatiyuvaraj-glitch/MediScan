/**
 * MediScan Comprehensive Clinical Pathology Atlas & Diagnostic Reference
 * Exhaustive diagnostic profiles for all 8 medical conditions across
 * Chest Radiography (CXR) and Dermoscopy.
 */

import { MedicalClass, ModalityType } from '../types/medical';

export interface PathologyProfile {
  id: string;
  className: MedicalClass;
  modality: ModalityType;
  commonName: string;
  category: string;
  etiology: string;
  epidemiology: string;
  radiologicalHallmarks: {
    primarySign: string;
    secondarySigns: string[];
    classicPhenomenon: string; // e.g. Silhouette sign, Air bronchogram, ABCDE criteria
  };
  deepLearningFeatures: {
    targetLayers: string;
    activationPattern: string;
    salientHotspotLocation: string;
    simulatedHURange: string; // Hounsfield Unit or dermoscopic pigment range
  };
  differentialDiagnosis: {
    condition: string;
    distinguishingFeatures: string;
  }[];
  clinicalGuidelines: {
    severityScoreName: string; // e.g. CURB-65, CORADS, Breslow/Clark, ABCDE
    severityCriteria: string;
    managementProtocol: string;
    recommendedDiagnostics: string[];
  };
  diagnosticPitfalls: string[];
}

export const PATHOLOGY_ATLAS: PathologyProfile[] = [
  {
    id: 'atlas-cxr-bacterial',
    className: 'Bacterial Pneumonia',
    modality: 'chest_xray',
    commonName: 'Acute Bacterial Lobar Pneumonia',
    category: 'Lower Respiratory Tract Infection',
    etiology: 'Most frequently Streptococcus pneumoniae (pneumococcus), Haemophilus influenzae, Moraxella catarrhalis, or Klebsiella pneumoniae in hospitalized patients. Microorganisms colonize distal airways, inciting rapid intra-alveolar purulent neutrophilic exudation.',
    epidemiology: 'Leading infectious cause of adult hospitalization worldwide. Incidence increases sharply in extremes of age (<5 and >65 years), immunocompromised individuals, chronic pulmonary disease (COPD), and smokers.',
    radiologicalHallmarks: {
      primarySign: 'Dense, homogeneous non-segmental or lobar alveolar consolidation with sharp demarcation at interlobar fissures.',
      secondarySigns: [
        'Prominent air bronchograms (patent tubular lucencies coursing through consolidated alveoli)',
        'Positive Silhouette Sign (loss of anatomical margins abutting the consolidation, e.g. right heart border)',
        'Mild reactive parapneumonic pleural effusion in up to 40% of cases',
      ],
      classicPhenomenon: 'Air Bronchogram & Silhouette Sign',
    },
    deepLearningFeatures: {
      targetLayers: 'features[8] (EfficientNet-B0) / layer4[2].conv3 (ResNet-50)',
      activationPattern: 'Focal, high-gradient clustering directly overlying dense consolidated alveolar segments. Sharp gradient cutoff at anatomical fissures.',
      salientHotspotLocation: 'Unilateral inferior or middle pulmonary lobe',
      simulatedHURange: '+35 to +65 HU (Exudative fluid and consolidated soft tissue density)',
    },
    differentialDiagnosis: [
      {
        condition: 'Viral Pneumonia',
        distinguishingFeatures: 'Viral etiology produces diffuse, bilateral interstitial or peribronchial reticular haziness without dense lobar consolidation.',
      },
      {
        condition: 'Pulmonary Infarction / PE',
        distinguishingFeatures: 'Presents as Hampton Hump (wedge-shaped, pleural-based density) with abrupt arterial cutoff on contrast CTA.',
      },
      {
        condition: 'Bronchoalveolar Carcinoma',
        distinguishingFeatures: 'Chronic persistent consolidation unresponsive to antibiotic therapy; lack of acute leukocytosis.',
      },
    ],
    clinicalGuidelines: {
      severityScoreName: 'CURB-65 Pneumonia Severity Score',
      severityCriteria: 'Confusion, Urea > 7 mmol/L, Respiratory Rate ≥ 30/min, Blood Pressure (SBP < 90 or DBP ≤ 60), Age ≥ 65. Score 0-1: Outpatient; Score 2: Inpatient; Score 3-5: ICU admission.',
      managementProtocol: 'Empirical targeted beta-lactam + macrolide (e.g., Ceftriaxone + Azithromycin) or respiratory fluoroquinolone. Sputum culture, blood cultures, and urine antigen testing.',
      recommendedDiagnostics: [
        'Frontal and lateral chest radiography',
        'Serum Procalcitonin and C-reactive protein (CRP)',
        'Sputum Gram stain and culture',
        'Streptococcus pneumoniae urine antigen assay',
      ],
    },
    diagnosticPitfalls: [
      'Dehydrated patients may not mount initial radiographic consolidation ("pseudo-normal" film until rehydration).',
      'Overlying metallic monitoring leads and pacemakers can create spurious opacity artifacts if not screened.',
    ],
  },
  {
    id: 'atlas-cxr-viral',
    className: 'Viral Pneumonia',
    modality: 'chest_xray',
    commonName: 'Viral Interstitial Pneumonitis',
    category: 'Lower Respiratory Tract Infection',
    etiology: 'Influenza A/B, Respiratory Syncytial Virus (RSV), Adenovirus, Parainfluenza, or Metapneumovirus. Viral replication inside bronchial epithelial cells triggers peribronchial inflammatory infiltration and interstitial thickening.',
    epidemiology: 'High seasonal prevalence during autumn and winter. Commonly affects young children, elderly adults, and immunosuppressed hosts.',
    radiologicalHallmarks: {
      primarySign: 'Bilateral diffuse interstitial reticular opacities and bronchial cuffing/thickening radiating from the hila.',
      secondarySigns: [
        'Subtle patchy ground-glass densities without dense confluent lobar consolidations',
        'Hyperinflation with diaphragmatic flattening in pediatric RSV bronchiolitis',
        'Pleural effusions and lymphadenopathy are exceedingly rare in uncomplicated viral cases',
      ],
      classicPhenomenon: 'Peribronchial Cuffing & Reticular Interstitial Striations',
    },
    deepLearningFeatures: {
      targetLayers: 'features[4] to features[8] (Multi-scale feature extraction)',
      activationPattern: 'Diffuse, bilateral perihilar activations with lower peak intensity (0.65-0.80) dispersed across central vascular structures.',
      salientHotspotLocation: 'Bilateral perihilar and inner two-thirds of pulmonary fields',
      simulatedHURange: '-400 to -150 HU (Sub-consolidative interstitial density)',
    },
    differentialDiagnosis: [
      {
        condition: 'Bacterial Pneumonia',
        distinguishingFeatures: 'Bacterial pneumonia exhibits prominent focal lobar consolidation and dense air bronchograms.',
      },
      {
        condition: 'Mild Pulmonary Edema',
        distinguishingFeatures: 'Cardiogenic edema presents with cardiomegaly, Kerley B lines, and bilateral pleural blunting responding to diuretics.',
      },
      {
        condition: 'Mycoplasma Pneumonia',
        distinguishingFeatures: 'Produces a clinical-radiological mismatch ("walking pneumonia") with prominent reticulonodular opacities.',
      },
    ],
    clinicalGuidelines: {
      severityScoreName: 'PSI / PORT Score (Pneumonia Severity Index)',
      severityCriteria: 'Stratifies patient risk into Classes I–V based on 20 demographic and physiological parameters.',
      managementProtocol: 'Supportive care, hydration, and targeted antiviral therapy (e.g. Oseltamivir within 48h of Influenza onset). Avoid inappropriate antibiotic prescription unless bacterial superinfection is suspected.',
      recommendedDiagnostics: [
        'Multiplex respiratory viral PCR panel (Nasopharyngeal swab)',
        'Pulse oximetry and arterial blood gas (ABG) for hypoxic patients',
        'Baseline serial chest radiograph',
      ],
    },
    diagnosticPitfalls: [
      'Secondary bacterial superinfection (e.g., Staphylococcal pneumonia following influenza) can rapidly transform interstitial haziness into necrotizing cavitations.',
    ],
  },
  {
    id: 'atlas-cxr-covid',
    className: 'COVID-19',
    modality: 'chest_xray',
    commonName: 'SARS-CoV-2 Viral Pneumonia',
    category: 'Pandemic Viral Pneumonitis',
    etiology: 'Severe Acute Respiratory Syndrome Coronavirus 2 (SARS-CoV-2). Binds to pulmonary alveolar epithelial type II cells via ACE2 receptors, provoking severe cytokine-mediated alveolar damage and microvascular thromboses.',
    epidemiology: 'Global distribution with varied clinical presentations ranging from asymptomatic infection to acute respiratory distress syndrome (ARDS) and multi-organ failure.',
    radiologicalHallmarks: {
      primarySign: 'Bilateral, multifocal peripheral and subpleural ground-glass opacities (GGOs) predominantly affecting the lower lung zones.',
      secondarySigns: [
        'Patchy basilar airspace consolidations as disease progresses toward organizing phase',
        'Vascular enlargement/thickening within or surrounding areas of parenchymal opacification',
        'Paucity of pleural effusion, cavitation, or hilar lymphadenopathy',
      ],
      classicPhenomenon: 'Peripheral Subpleural Ground-Glass Distribution',
    },
    deepLearningFeatures: {
      targetLayers: 'features[8] (EfficientNet-B0) / layer4 (ResNet-50)',
      activationPattern: 'Characteristic dual-hemithorax peripheral rim activations tracing subpleural lung boundaries.',
      salientHotspotLocation: 'Bilateral posterior and peripheral lung bases',
      simulatedHURange: '-500 to -250 HU (Hazy ground-glass attenuated attenuation)',
    },
    differentialDiagnosis: [
      {
        condition: 'Bacterial Lobar Pneumonia',
        distinguishingFeatures: 'Bacterial causes are predominantly unilateral and lobar, lacking the multi-zone peripheral subpleural sparing pattern.',
      },
      {
        condition: 'Cryptogenic Organizing Pneumonia (COP)',
        distinguishingFeatures: 'Clinically subacute/chronic, responsive to systemic corticosteroids, lacking SARS-CoV-2 viral antigen positivity.',
      },
      {
        condition: 'Hypersensitivity Pneumonitis',
        distinguishingFeatures: 'Upper-to-mid lung predominance with known environmental antigen exposure (birds, molds).',
      },
    ],
    clinicalGuidelines: {
      severityScoreName: 'CORADS (COVID-19 Reporting and Data System) & WHO Clinical Staging',
      severityCriteria: 'CORADS 1 (Very Low) to CORADS 5 (Typical GGOs, high suspicion). Oxygen saturation < 94% on room air defines severe disease.',
      managementProtocol: 'Supplemental oxygen therapy, proning, systemic dexamethasone, Remdesivir, and prophylactic anticoagulation (Low Molecular Weight Heparin).',
      recommendedDiagnostics: [
        'Reverse Transcription Polymerase Chain Reaction (RT-PCR)',
        'Continuous pulse oximetry monitoring',
        'Serum D-dimer, Ferritin, and Fibrinogen to evaluate thrombo-inflammatory state',
        'High-Resolution Chest CT if radiograph is discordant with profound hypoxia',
      ],
    },
    diagnosticPitfalls: [
      'Early disease (Days 0–3 post symptom onset) frequently presents with a normal chest radiograph; normal CXR does not exclude acute COVID-19 infection.',
    ],
  },
  {
    id: 'atlas-cxr-normal',
    className: 'Normal',
    modality: 'chest_xray',
    commonName: 'Unremarkable Frontal Chest Radiograph',
    category: 'Healthy Baseline Examination',
    etiology: 'Absence of active cardiopulmonary, pleural, or thoracic skeletal pathology.',
    epidemiology: 'Represents the majority of routine pre-operative, employment, and acute care triage screening radiographs.',
    radiologicalHallmarks: {
      primarySign: 'Clear and well-expanded bilateral lung fields with smooth, tapering broncho-vascular arborization.',
      secondarySigns: [
        'Sharp, deep, and distinct bilateral costophrenic and cardiophrenic angles',
        'Normal cardiothoracic ratio (< 0.50 on standard posteroanterior projection)',
        'Symmetric thoracic cage without rib fractures, deformities, or osteolytic lesions',
      ],
      classicPhenomenon: 'Symmetrical Bronchovascular Tapering & Sharp Costophrenic Sulci',
    },
    deepLearningFeatures: {
      targetLayers: 'All convolutional stages',
      activationPattern: 'Diffuse, low-amplitude background activation (<0.40 intensity) without focal clustering or hotspot condensation.',
      salientHotspotLocation: 'Uniform parenchymal field',
      simulatedHURange: '-800 to -650 HU (Normal air-filled parenchymal attenuation)',
    },
    differentialDiagnosis: [
      {
        condition: 'Early Pulmonary Embolism',
        distinguishingFeatures: 'Normal CXR in the setting of severe dyspnea and tachycardia is classic for acute PE (requires Wells score & CTPA).',
      },
      {
        condition: 'Early Interstitial Lung Disease (ILD)',
        distinguishingFeatures: 'High-Resolution CT required to detect early sub-radiographic reticulation and micro-honeycombing.',
      },
    ],
    clinicalGuidelines: {
      severityScoreName: 'Radiological Clearance Certification',
      severityCriteria: 'No acute cardiopulmonary disease (ACPD).',
      managementProtocol: 'No therapeutic intervention required. Document baseline findings in medical records.',
      recommendedDiagnostics: [
        'Clinical correlation if patient exhibits respiratory symptoms despite normal radiograph',
      ],
    },
    diagnosticPitfalls: [
      'Poor inspiratory effort (<8 posterior ribs visualized) can create spurious basilar opacities mimicking pneumonia or atelectasis.',
    ],
  },
  {
    id: 'atlas-skin-melanoma',
    className: 'Melanoma',
    modality: 'dermoscopy',
    commonName: 'Malignant Cutaneous Melanoma',
    category: 'Malignant Melanocytic Neoplasm',
    etiology: 'Malignant proliferation of melanocytes driven by ultraviolet radiation-induced somatic mutations (BRAF V600E, NRAS, KIT, CDKN2A).',
    epidemiology: 'Responsible for >75% of skin cancer-related deaths despite accounting for only ~1% of skin cancers. Incidence strongly associated with intermittent blistering sunburns and fair skin types.',
    radiologicalHallmarks: {
      primarySign: 'Marked dermoscopic asymmetry in both 90° axes with atypical, broadened pigment network and abrupt peripheral cutoff.',
      secondarySigns: [
        'Blue-white veil (confluent bluish hue with ground-glass haze reflecting orthokeratosis and dermal melanin)',
        'Multiple colors (variegation of light brown, dark brown, black, slate-blue, gray, and depigmented white)',
        'Atypical vascular patterns (linear irregular vessels, polymorphous vessels)',
        'Peripheral irregular dots, globules, and pseudopods / radial streaming',
      ],
      classicPhenomenon: 'Dermoscopic ABCDE & Blue-White Veil',
    },
    deepLearningFeatures: {
      targetLayers: 'features[8] (EfficientNet-B0) / layer4 (ResNet-50)',
      activationPattern: 'Intense gradient concentration highlighting scalloped borders, asymmetric notches, and central blue-black melanin deposits.',
      salientHotspotLocation: 'Atypical peripheral margin and hyperpigmented core',
      simulatedHURange: 'Variegated dark chromatic luminance (high pigment contrast delta)',
    },
    differentialDiagnosis: [
      {
        condition: 'Dysplastic / Atypical Nevus',
        distinguishingFeatures: 'May share architectural asymmetry, but pigment network fades gently into surrounding normal skin and lacks blue-white veil.',
      },
      {
        condition: 'Pigmented Basal Cell Carcinoma',
        distinguishingFeatures: 'Exhibits arborizing telangiectatic vessels, blue-gray ovoid nests, and leaf-like structures rather than a pigment network.',
      },
      {
        condition: 'Seborrheic Keratosis',
        distinguishingFeatures: 'Reveals characteristic horn pseudocysts, comedo-like openings, and a verrucous "stuck-on" border.',
      },
    ],
    clinicalGuidelines: {
      severityScoreName: 'Breslow Depth & Clark Level Staging (AJCC 8th Edition)',
      severityCriteria: 'T1a: <0.8 mm without ulceration; T1b: 0.8–1.0 mm; T2: 1.01–2.0 mm; T3: 2.01–4.0 mm; T4: >4.0 mm.',
      managementProtocol: 'Immediate complete excisional biopsy with 1–2 mm margins (never shave or cauterize). Re-excision with 1–2 cm margins and Sentinel Lymph Node Biopsy (SLNB) based on Breslow depth.',
      recommendedDiagnostics: [
        'Dermoscopic photographic surveillance (Mole mapping)',
        'Histopathological examination with S100, Melan-A, and SOX10 immunohistochemistry',
        'BRAF V600 mutation molecular testing for advanced disease',
        'Staging PET-CT or Brain MRI for stage III/IV',
      ],
    },
    diagnosticPitfalls: [
      'Amelanotic melanoma lacks brown/black pigment and may mimic benign pyogenic granuloma or basal cell carcinoma.',
    ],
  },
  {
    id: 'atlas-skin-nevus',
    className: 'Benign Nevus',
    modality: 'dermoscopy',
    commonName: 'Benign Melanocytic Compound / Dermal Nevus',
    category: 'Benign Melanocytic Proliferation',
    etiology: 'Benign clonal proliferation of melanocytes situated at the dermo-epidermal junction (junctional), upper dermis (compound), or deep dermis (intradermal).',
    epidemiology: 'Extremely common; typical fair-skinned adults have between 15 and 40 benign nevi. Often emerge during childhood and adolescence.',
    radiologicalHallmarks: {
      primarySign: 'Strict bi-axial structural symmetry with regular, homogenous light-to-medium brown pigment distribution.',
      secondarySigns: [
        'Harmonious reticular network with evenly spaced mesh lines thinning gracefully toward the periphery',
        'Uniform peripheral globules indicating benign developmental stability',
        'Absence of atypical vascular structures, blue-white veil, or ulceration',
      ],
      classicPhenomenon: 'Homogeneous Symmetrical Reticular Mesh',
    },
    deepLearningFeatures: {
      targetLayers: 'features[4] to features[8]',
      activationPattern: 'Balanced circular or elliptical activation centered over the lesion core without focal eccentric hotspots.',
      salientHotspotLocation: 'Centroid of symmetric cutaneous macule',
      simulatedHURange: 'Uniform intermediate pigment intensity',
    },
    differentialDiagnosis: [
      {
        condition: 'Malignant Melanoma',
        distinguishingFeatures: 'Melanoma exhibits asymmetry, border notched cutoffs, and multi-hued color variegation.',
      },
      {
        condition: 'Lentigo Simplex',
        distinguishingFeatures: 'Flat, uniform hyperpigmentation with elongation of rete ridges but no discrete melanocytic nest clusters.',
      },
    ],
    clinicalGuidelines: {
      severityScoreName: 'Benign Melanocytic Stability Score',
      severityCriteria: 'Reassuring dermoscopic pattern without ABCDE criteria.',
      managementProtocol: 'No medical intervention required. Patient self-examination education regarding changing skin lesions.',
      recommendedDiagnostics: [
        'Routine annual full-body dermatologic examination',
      ],
    },
    diagnosticPitfalls: [
      'Traumatized or irritated nevi can display transient atypical inflammation resembling malignant change.',
    ],
  },
  {
    id: 'atlas-skin-bcc',
    className: 'Basal Cell Carcinoma',
    modality: 'dermoscopy',
    commonName: 'Basal Cell Carcinoma (BCC)',
    category: 'Non-Melanoma Malignant Neoplasm',
    etiology: 'Malignant cutaneous neoplasm arising from the basal cell layer of the epidermis and hair follicles. Mutations in the Hedgehog signaling pathway (PTCH1, SMO) triggered by cumulative UV exposure.',
    epidemiology: 'The most common cancer diagnosed in humans worldwide (>80% of all non-melanoma skin cancers). Highest frequency on sun-exposed head and neck areas in older adults.',
    radiologicalHallmarks: {
      primarySign: 'Sharp arborizing (tree-like) telangiectatic blood vessels with abrupt branching and tapering.',
      secondarySigns: [
        'Blue-gray ovoid nests and multiple blue-gray globules',
        'Leaf-like (maple leaf) structures along the lesion margin',
        'Spoke-wheel areas and shiny white crystalline structures (chrysalis / streaks)',
        'Ulceration with translucent, rolled "pearly" borders',
      ],
      classicPhenomenon: 'Arborizing Telangiectasias & Blue-Gray Ovoid Nests',
    },
    deepLearningFeatures: {
      targetLayers: 'features[8] (EfficientNet-B0)',
      activationPattern: 'High saliency targeting peripheral translucent rolled borders and focal arborizing vascular branches.',
      salientHotspotLocation: 'Peripheral rolled margin and central ulceration zone',
      simulatedHURange: 'Translucent pearly chromatic profile with red vascular branching',
    },
    differentialDiagnosis: [
      {
        condition: 'Malignant Melanoma',
        distinguishingFeatures: 'Melanoma displays a pigment network and blue-white veil; BCC lacks pigment networks and exhibits arborizing vessels.',
      },
      {
        condition: 'Seborrheic Keratosis',
        distinguishingFeatures: 'Seborrheic keratosis has comedo-like openings and a greasy, hyperkeratotic stuck-on surface.',
      },
    ],
    clinicalGuidelines: {
      severityScoreName: 'NCCN Basal Cell Carcinoma Risk Stratification',
      severityCriteria: 'Low Risk vs. High Risk (Area H: face/ears/genitalia > 6mm; Area M: cheeks/neck > 10mm; sclerosing/infiltrative histology).',
      managementProtocol: 'Mohs micrographic surgery for high-risk facial lesions; standard surgical excision with 4 mm margins for low-risk trunk lesions; topical 5-FU/Imiquimod for superficial BCC.',
      recommendedDiagnostics: [
        'Dermoscopic vascular pattern evaluation',
        'Diagnostic punch or shave biopsy',
      ],
    },
    diagnosticPitfalls: [
      'Superficial BCC can present as an erythematous, scaly patch frequently misdiagnosed as eczema or psoriasis.',
    ],
  },
  {
    id: 'atlas-skin-sebker',
    className: 'Seborrheic Keratosis',
    modality: 'dermoscopy',
    commonName: 'Seborrheic Keratosis (Barnacle of Aging)',
    category: 'Benign Epidermal Proliferation',
    etiology: 'Benign clonal proliferation of immature keratinocytes characterized by hyperkeratosis, acanthosis, and papillomatosis. Linked to FGFR3 and PIK3CA gene mutations.',
    epidemiology: 'Extremely prevalent in adults over 40 years of age ("barnacles of aging"). Benign with zero malignant transformation potential.',
    radiologicalHallmarks: {
      primarySign: 'Distinct "stuck-on" appearance with sharply demarcated borders and verrucous or dull surface texture.',
      secondarySigns: [
        'Multiple horn pseudocysts (small white or yellow circular pearl-like structures)',
        'Comedo-like openings (crypts filled with keratin plug debris appearing as dark brown spots)',
        'Milia-like cysts and fingerprint-like epidermal fissures (gyri and sulci cerebriform pattern)',
        'Moth-eaten border on flat early macular reticular lesions',
      ],
      classicPhenomenon: 'Comedo-Like Openings & Horn Pseudocysts ("Cerebriform Surface")',
    },
    deepLearningFeatures: {
      targetLayers: 'features[4] to features[8]',
      activationPattern: 'Diffuse high-frequency texture detection mapping to surface keratin fissures and comedo-like crypts.',
      salientHotspotLocation: 'Verrucous surface fissures and keratin plugs',
      simulatedHURange: 'Matte, non-vascular keratinaceous profile',
    },
    differentialDiagnosis: [
      {
        condition: 'Malignant Melanoma',
        distinguishingFeatures: 'Melanoma is asymmetric, invasive, and lacks horn pseudocysts or comedo openings.',
      },
      {
        condition: 'Pigmented Basal Cell Carcinoma',
        distinguishingFeatures: 'BCC lacks comedo openings and exhibits arborizing vessels and pearly translucency.',
      },
    ],
    clinicalGuidelines: {
      severityScoreName: 'Benignity Assurance Protocol',
      severityCriteria: 'Reassuring presence of multiple horn pseudocysts and sharply delimited borders.',
      managementProtocol: 'Reassurance. No treatment medically necessary. Liquid nitrogen cryotherapy, curettage, or electrodessication for symptomatic or cosmetically bothersome lesions.',
      recommendedDiagnostics: [
        'Dermoscopic confirmation',
        'Shave biopsy if atypia or bleeding is present to rule out melanoma',
      ],
    },
    diagnosticPitfalls: [
      'Irritated or traumatized seborrheic keratoses can bleed, darken, and inflame, requiring dermoscopic magnification to distinguish from nodular melanoma.',
    ],
  },
];
