import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { MODEL_PERFORMANCE, ENSEMBLE_WEIGHTS } from '../constants';

const ModelComparison: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      
      {/* Single Model Performance */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">单模型性能对比 (RMSLE)</h3>
        <p className="text-lg text-slate-500 mb-8 leading-relaxed">
          对应报告 Table 1。Lasso (0.1099) 意外击败了 XGBoost 和 KRR，表明特征线性程度高。
        </p>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MODEL_PERFORMANCE}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 14, fontWeight: 500}} />
              <YAxis domain={[0.10, 0.15]} tick={{fontSize: 14}} />
              <Tooltip 
                 contentStyle={{ borderRadius: '8px', fontSize: '16px', padding: '12px' }}
                 formatter={(value: number) => [value, 'RMSLE (Lower is Better)']}
              />
              <Bar dataKey="rmsle" fill="#64748b" radius={[4, 4, 0, 0]} barSize={60}>
                {
                  MODEL_PERFORMANCE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Lasso' ? '#3b82f6' : '#94a3b8'} />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 p-6 bg-slate-50 rounded-lg text-lg text-slate-600 leading-relaxed border border-slate-100">
          <strong>解释：</strong> 高维稀疏数据中，Lasso 的 L1 正则化能有效筛选特征，而树模型（RF/XGBoost）容易在只有 1460 条样本的情况下过拟合或无法外推。
        </div>
      </div>

      {/* Ensemble Weights */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">最终集成策略权重</h3>
        <p className="text-lg text-slate-500 mb-8 leading-relaxed">
          对应报告 Table 2。六模型异质混合方案，Lasso 占据主导地位 (0.33)。
        </p>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ENSEMBLE_WEIGHTS}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={5}
                dataKey="weight"
                nameKey="model"
              >
                {ENSEMBLE_WEIGHTS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ fontSize: '16px', padding: '10px', borderRadius: '8px' }}
                formatter={(value: number) => [`${(value * 100).toFixed(0)}%`, 'Weight']} 
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right" 
                wrapperStyle={{ fontSize: '16px', marginLeft: '20px' }}
                iconSize={16}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3">
            {ENSEMBLE_WEIGHTS.map((model) => (
                <div key={model.model} className="flex items-center text-base text-slate-600">
                    <span className="w-4 h-4 rounded-full mr-3 flex-shrink-0" style={{backgroundColor: model.color}}></span>
                    <span className="font-semibold w-28 text-slate-800">{model.model}</span>
                    <span className="text-slate-500">- {model.role}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;