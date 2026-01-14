import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
  Label,
  Cell,
  LabelList
} from 'recharts';
import { TOP_FEATURES, POSITIVE_COEFFICIENTS, NEGATIVE_COEFFICIENTS } from '../constants';
import { Info } from 'lucide-react';

// Simulated scatter data representing Figure 3 (Area vs Price)
const SCATTER_DATA = Array.from({ length: 200 }, (_, i) => {
  const area = 500 + Math.random() * 3000;
  // Linear relationship with some noise, plus outliers
  let price = 10000 + area * 80 + (Math.random() - 0.5) * 50000;
  
  // Create Log-like distribution visually
  price = Math.exp(Math.log(price) + (Math.random() - 0.5) * 0.2);

  // Add the specific outliers mentioned in report (High area, low price)
  if (i === 0) return { area: 4500, price: 180000, type: 'Outlier' };
  if (i === 1) return { area: 5200, price: 185000, type: 'Outlier' };

  return { area, price, type: 'Normal' };
});

const CORRELATION_COLORS = [
  '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', 
  '#84cc16', '#eab308', '#f59e0b'
];

const EDAAnalysis: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Introduction Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-start">
         <div className="flex-1">
             <h3 className="text-lg font-bold text-slate-800 mb-2">数据探索与特征工程分析</h3>
             <p className="text-slate-600">
                 本部分展示了从原始数据相关性分析，到异常值剔除，再到最终 Lasso 模型特征选择的全过程。
             </p>
         </div>
         <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 max-w-lg">
             <div className="flex items-start gap-3">
                 <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                 <div className="text-sm text-blue-800">
                     <strong>图表解读指南：</strong> <br/>
                     <span className="font-semibold">相关性 (Correlation):</span> 展示单一特征与房价的原始线性关系。<br/>
                     <span className="font-semibold">系数权重 (Coefficients):</span> 展示 Lasso 模型在综合考虑所有特征后，认为最重要的特征。这是模型做出预测的真实依据。
                 </div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Correlation Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">原始特征相关性 (Pearson)</h3>
            <p className="text-sm text-slate-500 mb-6">
            单变量分析：OverallQual 和 GrLivArea 是最直观的强相关特征。
            </p>
            <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                layout="vertical"
                data={TOP_FEATURES}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
                <XAxis type="number" domain={[0, 1]} />
                <YAxis dataKey="feature" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f1f5f9'}}
                />
                <Bar dataKey="correlation" radius={[0, 4, 4, 0]} barSize={20}>
                    {TOP_FEATURES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORRELATION_COLORS[index % 8]} />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>

        {/* Outlier Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">居住面积与房价回归 (Outliers)</h3>
            <p className="text-sm text-slate-500 mb-6">
            物理剔除：右下角面积 > 4000 sq ft 但价格极低的样本被识别为异常点。
            </p>
            <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="area" name="GrLivArea" unit=" sq ft">
                    <Label value="居住面积 (sq ft)" offset={-10} position="insideBottom" />
                </XAxis>
                <YAxis type="number" dataKey="price" name="SalePrice" unit="$">
                    <Label value="房价 ($)" angle={-90} position="insideLeft" />
                </YAxis>
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <ReferenceLine x={4000} stroke="red" strokeDasharray="3 3" label="剔除阈值" />
                <Scatter name="Normal" data={SCATTER_DATA.filter(d => d.type === 'Normal')} fill="#8884d8" fillOpacity={0.6} />
                <Scatter name="Outlier" data={SCATTER_DATA.filter(d => d.type === 'Outlier')} fill="#ef4444" shape="cross" r={10} />
                </ScatterChart>
            </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Lasso Coefficients Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
                Lasso 模型特征权重 (Feature Coefficients)
                <span className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-normal">模型解释性核心</span>
            </h3>
            <p className="text-slate-500 mt-2">
                不同于简单的相关性，这里展示了 Lasso 模型通过正则化筛选出的、对房价预测真正起决定性作用的特征。
                模型不仅关注了面积和质量，还敏锐地捕捉到了特定街区（如 Crawford, StoneBr）的增值潜力和商业区（C (all)）的贬值风险。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Positive Coefficients */}
            <div>
                <h4 className="font-bold text-green-700 mb-4 flex items-center">
                    Top Positive Drivers (增值项)
                </h4>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={POSITIVE_COEFFICIENTS}
                            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={140} tick={{fontSize: 11}} interval={0} />
                            <Tooltip 
                                cursor={{fill: '#f0fdf4'}}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #bbf7d0' }}
                            />
                            <Bar dataKey="value" fill="#4ade80" radius={[0, 4, 4, 0]} barSize={24}>
                                <LabelList dataKey="value" position="right" fontSize={10} fill="#15803d" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Negative Coefficients */}
            <div>
                <h4 className="font-bold text-red-700 mb-4 flex items-center">
                    Top Negative Reducers (减值项)
                </h4>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={NEGATIVE_COEFFICIENTS}
                            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={140} tick={{fontSize: 11}} interval={0} />
                            <Tooltip 
                                cursor={{fill: '#fef2f2'}}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #fecaca' }}
                            />
                            {/* Negative bars usually go left, but for easy comparison visual we plot absolute magnitude or just list them. 
                                Recharts handles negative values correctly on the axis. */}
                            <Bar dataKey="value" fill="#f87171" radius={[4, 0, 0, 4]} barSize={24}>
                                <LabelList dataKey="value" position="left" fontSize={10} fill="#b91c1c" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

          </div>
      </div>

    </div>
  );
};

export default EDAAnalysis;