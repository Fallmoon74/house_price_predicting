export interface PredictionInput {
  overallQual: number;
  grLivArea: number;
  yearBuilt: number;
  neighborhoodRank: number; // 1-5 scale based on report logic
  garageCars: number;
}

export interface ModelPerformance {
  name: string;
  rmsle: number;
  type: 'Linear' | 'Tree' | 'Kernel';
  description: string;
  [key: string]: any;
}

export interface FeatureImportance {
  feature: string;
  correlation: number;
  category: 'Space' | 'Quality' | 'History' | 'Location';
  [key: string]: any;
}

export interface EnsembleWeight {
  model: string;
  weight: number;
  role: string;
  color: string;
  [key: string]: any;
}

export enum TabView {
  DASHBOARD = 'dashboard',
  EDA = 'eda',
  MODELS = 'models',
  SIMULATOR = 'simulator'
}