import { EnsembleWeight, FeatureImportance, ModelPerformance } from './types';

// Derived from Table 1 in the PDF
export const MODEL_PERFORMANCE: ModelPerformance[] = [
  { name: 'Lasso', rmsle: 0.1099, type: 'Linear', description: 'High Bias / Low Variance (Best Single Model)' },
  { name: 'KRR', rmsle: 0.1153, type: 'Kernel', description: 'Medium Bias / Medium Variance' },
  { name: 'XGBoost', rmsle: 0.1162, type: 'Tree', description: 'Low Bias / High Variance' },
  { name: 'Random Forest', rmsle: 0.1385, type: 'Tree', description: 'Low Bias / Low Variance (Bagging)' },
];

// Derived from Figure 1 in the PDF (Raw Correlations)
export const TOP_FEATURES: FeatureImportance[] = [
  { feature: 'OverallQual', correlation: 0.79, category: 'Quality' },
  { feature: 'GrLivArea', correlation: 0.71, category: 'Space' },
  { feature: 'GarageCars', correlation: 0.64, category: 'Space' },
  { feature: 'TotalBsmtSF', correlation: 0.61, category: 'Space' },
  { feature: 'FullBath', correlation: 0.56, category: 'Quality' },
  { feature: 'YearBuilt', correlation: 0.52, category: 'History' },
  { feature: 'MasVnrArea', correlation: 0.47, category: 'Quality' },
  { feature: 'Fireplaces', correlation: 0.46, category: 'Quality' },
];

// New Data: Derived from the Lasso Coefficients Image provided by user
export const POSITIVE_COEFFICIENTS = [
  { name: 'GrLivArea', value: 0.1113 },
  { name: 'TotalSF', value: 0.1110 },
  { name: 'OverallQual', value: 0.1031 },
  { name: 'Neighborhood_Crawfor', value: 0.0977 },
  { name: 'YearBuilt', value: 0.0867 },
  { name: 'Neighborhood_StoneBr', value: 0.0724 },
  { name: 'Functional_Typ', value: 0.0714 },
  { name: 'Exterior1st_BrkFace', value: 0.0580 },
  { name: 'KitchenQual_Ex', value: 0.0564 },
  { name: 'BsmtFinSF1', value: 0.0501 },
];

export const NEGATIVE_COEFFICIENTS = [
  { name: 'MSZoning_C (all)', value: -0.2709 },
  { name: 'SaleCondition_Abnorml', value: -0.0479 },
  { name: 'CentralAir_N', value: -0.0447 },
  { name: 'MSZoning_RM', value: -0.0401 },
  { name: 'BldgType_Duplex', value: -0.0305 },
  { name: 'KitchenAbvGr', value: -0.0289 },
  { name: 'Neighborhood_Edwards', value: -0.0281 },
  { name: 'SaleType_WD', value: -0.0253 },
  { name: 'Condition1_Artery', value: -0.0199 },
  { name: 'Neighborhood_Mitchel', value: -0.0198 },
];

// Derived from Table 2 in the PDF
export const ENSEMBLE_WEIGHTS: EnsembleWeight[] = [
  { model: 'Lasso', weight: 0.33, role: 'Base Model (Linear)', color: '#3b82f6' },
  { model: 'XGBoost', weight: 0.22, role: 'Non-linear Interactions', color: '#10b981' },
  { model: 'LightGBM', weight: 0.15, role: 'Diversity (Histogram)', color: '#f59e0b' },
  { model: 'GBR', weight: 0.15, role: 'Gradient Boosting', color: '#ef4444' },
  { model: 'ElasticNet', weight: 0.10, role: 'Regularization Stability', color: '#6366f1' },
  { model: 'KRR', weight: 0.05, role: 'Kernel Mapping', color: '#8b5cf6' },
];

// Simplified Logic for "Neighborhood Ranking" (Section 1.4.1)
export const NEIGHBORHOOD_TIERS = [
  { id: 1, name: '第一梯队 (MeadowV / IDOTRR)', priceMod: 0.8 },
  { id: 2, name: '第二梯队 (Mitchel / OldTown)', priceMod: 0.9 },
  { id: 3, name: '第三梯队 (NAmes / Gilbert)', priceMod: 1.0 },
  { id: 4, name: '第四梯队 (CollgCr / Crawford)', priceMod: 1.15 },
  { id: 5, name: '第五梯队 (NoRidge / StoneBr)', priceMod: 1.4 },
];