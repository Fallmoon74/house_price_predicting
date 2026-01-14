import React, { useState } from 'react';
import { LayoutDashboard, BarChart2, GitMerge, Activity } from 'lucide-react';
import Dashboard from './components/Dashboard';
import EDAAnalysis from './components/EDAAnalysis';
import ModelComparison from './components/ModelComparison';
import PredictionSimulator from './components/PredictionSimulator';
import { TabView } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>(TabView.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case TabView.DASHBOARD:
        return <Dashboard />;
      case TabView.EDA:
        return <EDAAnalysis />;
      case TabView.MODELS:
        return <ModelComparison />;
      case TabView.SIMULATOR:
        return <PredictionSimulator />;
      default:
        return <Dashboard />;
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: TabView, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        activeTab === tab 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-white hover:text-blue-600'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-100 border-r border-slate-200 flex-shrink-0">
        <div className="p-6">
            <div className="flex items-center space-x-2 text-blue-700 font-bold text-xl mb-8">
                <Activity className="w-8 h-8 flex-shrink-0" />
                <span>房价预测模型</span>
            </div>
            
            <nav className="space-y-2">
                <NavButton tab={TabView.DASHBOARD} icon={LayoutDashboard} label="项目概览" />
                <NavButton tab={TabView.EDA} icon={BarChart2} label="EDA 探索" />
                <NavButton tab={TabView.MODELS} icon={GitMerge} label="模型演进" />
                <NavButton tab={TabView.SIMULATOR} icon={Activity} label="预测模拟器" />
            </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">
                    {activeTab === TabView.DASHBOARD && 'Dashboard & Pipeline'}
                    {activeTab === TabView.EDA && 'Exploratory Data Analysis'}
                    {activeTab === TabView.MODELS && 'Model Performance & Ensemble'}
                    {activeTab === TabView.SIMULATOR && 'Live Prediction Simulator'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">Interactive presentation for the Ames Housing final assignment.</p>
            </div>
        </header>
        
        {renderContent()}
      </main>

    </div>
  );
};

export default App;