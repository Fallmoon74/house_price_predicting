import React from 'react';
import { ArrowRight, Database, Filter, Layers, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-white p-10 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-4xl font-bold text-slate-800 mb-6">
          基于 Ames 数据集的房价预测模型训练
        </h1>
        <p className="text-slate-600 text-2xl leading-relaxed">
          本项目对原始的房价数据集进行了数据清洗和特征工程，从对单模型进行调优到实现多层堆叠泛化模型，最终构建了一个符合预期的房价预测模型，其利用了 Lasso 模型在处理高维稀疏数据时的卓越表现，辅以其它角度的boost模型，实现了优秀的预测效果。
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="px-6 py-3 bg-blue-50 text-blue-700 rounded-lg text-lg font-semibold border border-blue-100">
            Public Score: 0.12024
          </div>
          <div className="px-6 py-3 bg-green-50 text-green-700 rounded-lg text-lg font-semibold border border-green-100">
            Final RMSLE: 0.1099
          </div>
          <div className="px-6 py-3 bg-purple-50 text-purple-700 rounded-lg text-lg font-semibold border border-purple-100">
            6-Model Ensemble
          </div>
        </div>
      </div>

      {/* Pipeline Visualization (Based on Figure 5) */}
      <div className="bg-white p-10 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
          <Layers className="w-8 h-8 mr-3 text-indigo-500" />
          项目流程
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center w-full md:w-1/5 bg-slate-50 p-8 rounded-lg border border-slate-100 min-h-[220px]">
            <Database className="w-12 h-12 text-slate-400 mb-6" />
            <h3 className="text-2xl font-bold text-slate-700">原始数据</h3>
            <p className="text-lg text-center text-slate-600 mt-4 font-medium">1460 样本<br/>79 特征</p>
          </div>

          <ArrowRight className="text-slate-300 hidden md:block w-8 h-8" />

          {/* Step 2 */}
          <div className="flex flex-col items-center w-full md:w-1/5 bg-blue-50 p-8 rounded-lg border border-blue-100 relative group cursor-pointer hover:shadow-md transition-all min-h-[220px]">
            <Filter className="w-12 h-12 text-blue-500 mb-6" />
            <h3 className="text-2xl font-bold text-blue-700">数据清洗</h3>
            <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-base p-4 rounded -top-20 transition-opacity w-64 text-center pointer-events-none z-10 shadow-xl">
              剔除 GrLivArea > 4000<br/>缺失值中位数/None填充
            </div>
            <p className="text-lg text-center text-slate-600 mt-4 font-medium">离群点剔除<br/>缺失值分层填补</p>
          </div>

          <ArrowRight className="text-slate-300 hidden md:block w-8 h-8" />

          {/* Step 3 */}
          <div className="flex flex-col items-center w-full md:w-1/5 bg-indigo-50 p-8 rounded-lg border border-indigo-100 relative group cursor-pointer hover:shadow-md transition-all min-h-[220px]">
            <Zap className="w-12 h-12 text-indigo-500 mb-6" />
            <h3 className="text-2xl font-bold text-indigo-700">深度特征工程</h3>
             <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-base p-4 rounded -top-24 transition-opacity w-72 text-center pointer-events-none z-10 shadow-xl">
              Target: Log(1+x)<br/>Skewed Feats: Box-Cox<br/>Neighborhood Ranking 编码
            </div>
            <p className="text-lg text-center text-slate-600 mt-4 font-medium">分布变换 (Log/BoxCox)<br/>稀有标签降噪</p>
          </div>

          <ArrowRight className="text-slate-300 hidden md:block w-8 h-8" />

           {/* Step 4 */}
           <div className="flex flex-col items-center w-full md:w-1/5 bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-8 rounded-lg shadow-lg relative group cursor-pointer hover:scale-105 transition-transform min-h-[220px]">
            <Layers className="w-12 h-12 text-white mb-6" />
            <h3 className="text-2xl font-bold">集成模型</h3>
            <div className="absolute opacity-0 group-hover:opacity-100 bg-white text-gray-800 border border-gray-200 text-base p-4 rounded -top-20 transition-opacity w-64 text-center pointer-events-none shadow-xl z-10">
              Stacking + Blending<br/>权重分配优化
            </div>
            <p className="text-lg text-center text-purple-100 mt-4 font-medium">六模型异质混合<br/>(Weighted Blending)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;