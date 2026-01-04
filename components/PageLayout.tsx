import React, { useState } from 'react';
import { 
  Layout, Trophy, Target, BarChart2, Sparkles, 
  Home as HomeIcon, Menu, X, ArrowLeft, Download, FileSpreadsheet, Monitor
} from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
  activePageId: string;
  title: string;
  onNavigate: (pageId: string) => void;
  onBackToHome: () => void;
  onDownloadCSV?: () => void;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  activePageId, 
  title, 
  onNavigate, 
  onBackToHome,
  onDownloadCSV
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <Layout className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5" /> },
    { id: 'subjects', label: 'Subjects', icon: <Target className="w-5 h-5" /> },
    { id: 'comparison', label: 'Compare', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'synergy', label: 'AI Insights', icon: <Sparkles className="w-5 h-5" /> },
  ];

  const handlePrint = () => {
    window.print();
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <BarChart2 className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">EduAnalytics</span>
      </div>
      
      <div className="flex-1 py-6 px-3 space-y-1">
        <div className="px-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              activePageId === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onBackToHome}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all font-medium text-sm border border-slate-700"
        >
          <HomeIcon className="w-5 h-5" />
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shadow-xl z-20 print:hidden">
        <NavContent />
      </div>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed inset-0 z-50 pointer-events-none flex flex-col print:hidden">
         {/* Top Bar */}
        <div className="pointer-events-auto bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2 font-bold">
             <BarChart2 className="w-5 h-5 text-indigo-400" /> EduAnalytics
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="pointer-events-auto absolute inset-0 top-[60px] bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="h-full w-64" onClick={e => e.stopPropagation()}>
               <NavContent />
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative pt-[60px] md:pt-0">
        
        {/* Top Action Bar */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 print:hidden">
          <div className="flex items-center gap-3">
             <button 
                onClick={onBackToHome}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
                title="Back to First Page"
             >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Back</span>
             </button>
             <h1 className="text-xl font-bold text-gray-800 capitalize pl-2 border-l border-gray-300">
                {title}
             </h1>
          </div>
          <div className="flex gap-2">
            {onDownloadCSV && (
              <button 
                onClick={onDownloadCSV}
                className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Download CSV"
              >
                <FileSpreadsheet className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Print Report"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
};