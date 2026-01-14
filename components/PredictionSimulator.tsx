import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw, DollarSign, TrendingUp } from 'lucide-react';
import { NEIGHBORHOOD_TIERS, ENSEMBLE_WEIGHTS } from '../constants';
import { PredictionInput } from '../types';

const PredictionSimulator: React.FC = () => {
  const [input, setInput] = useState<PredictionInput>({
    overallQual: 7,
    grLivArea: 1500,
    yearBuilt: 2003,
    neighborhoodRank: 3,
    garageCars: 2
  });

  const [predictions, setPredictions] = useState<{model: string, price: number, color: string}[]>([]);
  const [finalPrice, setFinalPrice] = useState<number>(0);

  // Simulation Logic: Approximating the trained models logic based on report insights
  useEffect(() => {
    // Base Calculation (Simplified Linear approximation)
    const baseSqFtPrice = 75; 
    const qualMultiplier = 15000;
    const yearMultiplier = 500;
    const garageMultiplier = 10000;
    
    const neighborhoodMod = NEIGHBORHOOD_TIERS.find(n => n.id === input.neighborhoodRank)?.priceMod || 1;

    // Calculate a "True" base value to perturb for different models
    const rawValue = 
        (input.grLivArea * baseSqFtPrice) + 
        ((input.overallQual - 5) * qualMultiplier) + 
        ((input.yearBuilt - 1970) * yearMultiplier) + 
        (input.garageCars * garageMultiplier) +
        30000; // Intercept
    
    const adjustedValue = rawValue * neighborhoodMod;

    // Simulate different models having different biases/variances as described in report
    const modelPreds = ENSEMBLE_WEIGHTS.map(m => {
        let prediction = adjustedValue;
        
        // Lasso: Good at linear, slightly conservative
        if (m.model === 'Lasso') prediction = adjustedValue * 1.0; 
        
        // XGBoost: High variance, might over-predict on high specs
        if (m.model === 'XGBoost') prediction = adjustedValue * (1 + (input.overallQual > 8 ? 0.1 : 0)); 
        
        // Random Forest / GBR: Low variance
        if (m.model === 'GBR') prediction = adjustedValue * 0.98;
        if (m.model === 'LightGBM') prediction = adjustedValue * 1.02;

        // KRR: Sensitive to scale
        if (m.model === 'KRR') prediction = adjustedValue * 0.95; 

        // ElasticNet
        if (m.model === 'ElasticNet') prediction = adjustedValue * 0.99;

        // Add random noise
        const noise = (Math.random() - 0.5) * 5000;
        return {
            model: m.model,
            color: m.color,
            price: Math.max(0, prediction + noise),
            weight: m.weight
        };
    });

    // Calculate Weighted Average
    let weightedSum = 0;
    modelPreds.forEach(p => {
        weightedSum += p.price * p.weight;
    });

    setPredictions(modelPreds);
    setFinalPrice(weightedSum);

  }, [input]);

  const handleChange = (field: keyof PredictionInput, value: number) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      
      {/* Control Panel */}
      <div className="col-span-1 bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-fit sticky top-6">
        <div className="flex items-center mb-8 text-slate-800">
          <Settings className="w-8 h-8 mr-3" />
          <h3 className="font-bold text-2xl">房屋参数设置</h3>
        </div>

        <div className="space-y-8">
          
          {/* Quality */}
          <div>
            <label className="block text-lg font-medium text-slate-700 mb-3">
              总体质量 (OverallQual): <span className="text-blue-600 font-bold">{input.overallQual}</span>
            </label>
            <input 
              type="range" min="1" max="10" step="1" 
              value={input.overallQual}
              onChange={(e) => handleChange('overallQual', parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-sm text-slate-500 mt-2 font-medium">
              <span>一般 (1)</span>
              <span>良好 (5)</span>
              <span>极佳 (10)</span>
            </div>
          </div>

          {/* Area */}
          <div>
            <label className="block text-lg font-medium text-slate-700 mb-3">
              居住面积 (GrLivArea): <span className="text-blue-600 font-bold">{input.grLivArea} sq ft</span>
            </label>
            <input 
              type="range" min="500" max="4000" step="50" 
              value={input.grLivArea}
              onChange={(e) => handleChange('grLivArea', parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Neighborhood */}
          <div>
            <label className="block text-lg font-medium text-slate-700 mb-3">
              地段评级 (Neighborhood Rank)
            </label>
            <select 
              value={input.neighborhoodRank}
              onChange={(e) => handleChange('neighborhoodRank', parseInt(e.target.value))}
              className="w-full p-3 border border-slate-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-900"
            >
              {NEIGHBORHOOD_TIERS.map(tier => (
                <option key={tier.id} value={tier.id}>{tier.name}</option>
              ))}
            </select>
            <p className="text-sm text-slate-500 mt-2">基于中位数房价排序 (Section 1.4.1)</p>
          </div>

          {/* Year Built */}
          <div>
            <label className="block text-lg font-medium text-slate-700 mb-3">
              建造年份 (YearBuilt): <span className="text-blue-600 font-bold">{input.yearBuilt}</span>
            </label>
            <input 
              type="range" min="1900" max="2010" step="1" 
              value={input.yearBuilt}
              onChange={(e) => handleChange('yearBuilt', parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

           {/* Garage */}
           <div>
            <label className="block text-lg font-medium text-slate-700 mb-3">
              车库容量 (Cars): <span className="text-blue-600 font-bold">{input.garageCars}</span>
            </label>
            <div className="flex gap-3">
                {[0, 1, 2, 3, 4].map(num => (
                    <button 
                        key={num}
                        onClick={() => handleChange('garageCars', num)}
                        className={`px-5 py-3 rounded-lg text-lg font-medium border transition-colors ${input.garageCars === num ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                    >
                        {num}
                    </button>
                ))}
            </div>
          </div>

        </div>
      </div>

      {/* Results Panel */}
      <div className="col-span-1 lg:col-span-2 space-y-8">
        
        {/* Final Price Card */}
        <div className="bg-white border-2 border-blue-100 rounded-xl shadow-xl p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
            <div className="relative z-10 w-full">
                <h2 className="text-slate-500 font-bold mb-2 uppercase tracking-wider text-lg">最终预测房价 (Weighted Ensemble)</h2>
                <div className="text-6xl md:text-7xl font-extrabold tracking-tight text-blue-700">
                    ${finalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-full relative z-10 border border-blue-100 mt-6 md:mt-0">
                <DollarSign className="w-12 h-12 text-blue-600" />
            </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center text-2xl">
                <TrendingUp className="w-6 h-6 mr-3 text-slate-500" />
                各模型预测详情 (Heterogeneous Mix)
            </h3>
            <div className="space-y-6">
                {predictions.map((pred) => (
                    <div key={pred.model} className="group">
                        <div className="flex justify-between text-lg mb-2">
                            <span className="font-bold text-slate-700">{pred.model}</span>
                            <span className="text-slate-600 font-medium">${pred.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                            <div 
                                className="h-4 rounded-full transition-all duration-500" 
                                style={{ 
                                    width: `${Math.min(100, (pred.price / 400000) * 100)}%`,
                                    backgroundColor: pred.color 
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 text-base text-slate-500">
                <p>注：此模拟器使用简化系数逼近真实模型行为。真实模型基于 Lasso (0.33), XGBoost (0.22) 等权重混合。</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default PredictionSimulator;