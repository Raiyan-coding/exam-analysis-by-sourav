import React, { useMemo, useEffect, useState } from 'react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip 
} from 'recharts';
import { 
  Download, Trophy, Target, AlertCircle, BarChart2, FileSpreadsheet, 
  BrainCircuit, ArrowUpRight, Sparkles, Home as HomeIcon, Grid, Users, Layout, Menu, X, Layers, ArrowLeft, Medal
} from 'lucide-react';
import { processData, calculateSynergy } from '../utils/analytics';
import { COLORS, SUBJECTS } from '../constants';
import { CircularProgress } from './CircularProgress';
import { StudentCard } from './StudentCard';
import { BattleArena } from './BattleArena';
import { SynergyPod } from './SynergyPod';
import { PerformanceRadar } from './PerformanceRadar';
import { SubjectDeepDive } from './SubjectDeepDive';
import { ClassMatrix } from './ClassMatrix';

interface DashboardProps {
  initialSectionId?: string;
  onBack: () => void;
}

type ViewId = 'overview' | 'leaderboard' | 'subjects' | 'comparison' | 'synergy';

export const Dashboard: React.FC<DashboardProps> = ({ initialSectionId, onBack }) => {
  const { students, subjectStats, radarData } = useMemo(() => processData(), []);
  const synergyPairs = useMemo(() => calculateSynergy(students), [students]);
  
  const hardestSubject = [...subjectStats].sort((a, b) => a.averagePercentage - b.averagePercentage)[0];
  const easiestSubject = [...subjectStats].sort((a, b) => b.averagePercentage - a.averagePercentage)[0];

  const [activeView, setActiveView] = useState<ViewId>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle initial deep linking from Home page
  useEffect(() => {
    if (initialSectionId) {
      if (['toppers', 'deep-dive'].includes(initialSectionId)) setActiveView('subjects');
      else if (['radar', 'battle-arena'].includes(initialSectionId)) setActiveView('comparison');
      else if (['reports', 'leaderboard'].includes(initialSectionId)) setActiveView('leaderboard');
      else if (['synergy'].includes(initialSectionId)) setActiveView('synergy');
      else setActiveView('overview');
    }
  }, [initialSectionId]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <Layout className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5" /> },
    { id: 'subjects', label: 'Subjects', icon: <Target className="w-5 h-5" /> },
    { id: 'comparison', label: 'Compare', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'synergy', label: 'AI Insights', icon: <Sparkles className="w-5 h-5" /> },
  ];

  // Smart Back Navigation
  const handleBackClick = () => {
    if (activeView === 'overview') {
      onBack(); // Go to Landing Page
    } else {
      setActiveView('overview'); // Go up to Dashboard Overview
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const headers = ['Student Name', 'Rank', 'Total Marks', 'Average %', 'Consistency', ...SUBJECTS];
    const rows = students.map(s => {
      const marks = s.marks.join(',');
      return `${s.name},${s.rank},${s.total},${s.average.toFixed(2)},${s.consistency},${marks}`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_analytics_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveView(item.id as ViewId);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              activeView === item.id 
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
          onClick={onBack}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-medium text-sm"
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
      <div className="hidden md:block shadow-xl z-20">
        <NavContent />
      </div>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed inset-0 z-50 pointer-events-none flex flex-col">
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
                onClick={handleBackClick}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                title={activeView === 'overview' ? "Back to Home" : "Back to Overview"}
             >
                <ArrowLeft className="w-5 h-5" />
             </button>
             <h1 className="text-xl font-bold text-gray-800 capitalize">
                {navItems.find(n => n.id === activeView)?.label}
             </h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleDownloadCSV}
              className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Download CSV"
            >
              <FileSpreadsheet className="w-5 h-5" />
            </button>
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
          
          {/* VIEW: OVERVIEW */}
          {activeView === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full"><Trophy className="w-6 h-6 text-amber-600" /></div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Top Rank</p>
                        <p className="text-lg font-bold text-gray-900">{students[0].name}</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full"><Target className="w-6 h-6 text-blue-600" /></div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Class Average</p>
                        <p className="text-lg font-bold text-gray-900">
                          {(students.reduce((acc, s) => acc + s.average, 0) / students.length).toFixed(1)}%
                        </p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-full"><BrainCircuit className="w-6 h-6 text-red-600" /></div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Hardest Subject</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-sm font-bold text-gray-900">{hardestSubject.subject}</p>
                          <span className="text-xs text-red-500 font-medium">{hardestSubject.averagePercentage.toFixed(0)}%</span>
                        </div>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-full"><ArrowUpRight className="w-6 h-6 text-emerald-600" /></div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Easiest Subject</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-sm font-bold text-gray-900">{easiestSubject.subject}</p>
                          <span className="text-xs text-emerald-500 font-medium">{easiestSubject.averagePercentage.toFixed(0)}%</span>
                        </div>
                    </div>
                  </div>
              </div>

              <ClassMatrix students={students} />

              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                 <div className="flex items-center gap-2 mb-4">
                   <Target className="w-5 h-5 text-indigo-500" />
                   <h3 className="font-bold text-gray-800">Class Subject Averages</h3>
                 </div>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={subjectStats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="subject" tick={{fontSize: 10}} interval={0} />
                        <YAxis domain={[0, 100]} hide />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Average']}
                        />
                        <Line type="monotone" dataKey="averagePercentage" stroke={COLORS.primary} strokeWidth={3} dot={{r: 3}} />
                      </LineChart>
                    </ResponsiveContainer>
                 </div>
              </div>
            </div>
          )}

          {/* VIEW: LEADERBOARD (Formerly Reports) */}
          {activeView === 'leaderboard' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Ranking Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-slate-50">
                   <Trophy className="w-5 h-5 text-amber-500" />
                   <h2 className="font-bold text-gray-800">Class Standings</h2>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500">
                         <tr>
                            <th className="px-6 py-3 font-semibold">Rank</th>
                            <th className="px-6 py-3 font-semibold">Student</th>
                            <th className="px-6 py-3 font-semibold text-center">Total Marks</th>
                            <th className="px-6 py-3 font-semibold text-center">Average</th>
                            <th className="px-6 py-3 font-semibold">Consistency</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {students.map((student, idx) => (
                            <tr key={student.name} className={`hover:bg-slate-50 ${idx < 3 ? 'bg-amber-50/10' : ''}`}>
                               <td className="px-6 py-3">
                                  {idx === 0 ? <Medal className="w-5 h-5 text-amber-400" /> : 
                                   idx === 1 ? <Medal className="w-5 h-5 text-slate-400" /> :
                                   idx === 2 ? <Medal className="w-5 h-5 text-amber-700" /> :
                                   <span className="font-mono font-bold text-gray-400">#{student.rank}</span>}
                               </td>
                               <td className="px-6 py-3 font-medium text-gray-900">{student.name}</td>
                               <td className="px-6 py-3 text-center font-bold text-indigo-600">{student.total}</td>
                               <td className="px-6 py-3 text-center font-bold text-gray-700">{student.average.toFixed(1)}%</td>
                               <td className="px-6 py-3">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    student.consistency === 'High' ? 'bg-emerald-100 text-emerald-700' : 
                                    student.consistency === 'Moderate' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                  }`}>
                                     {student.consistency}
                                  </span>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>

              <div className="grid gap-6">
                 <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-slate-500" /> Detailed Report Cards
                 </h3>
                 {students.map((student) => (
                    <StudentCard key={student.name} student={student} subjectStats={subjectStats} />
                 ))}
              </div>
            </div>
          )}

          {/* VIEW: SUBJECTS */}
          {activeView === 'subjects' && (
            <div className="space-y-8 animate-fadeIn">
               <SubjectDeepDive students={students} subjectStats={subjectStats} />
               
               <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" /> Subject Hall of Fame
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {subjectStats.map((stat) => (
                      <CircularProgress 
                        key={stat.subject}
                        value={parseFloat(stat.highestPercentage.toFixed(0))}
                        label={stat.topper}
                        subLabel={`${stat.subject} (${stat.highest})`}
                        size={100}
                        strokeWidth={8}
                      />
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* VIEW: COMPARISON */}
          {activeView === 'comparison' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fadeIn">
               <div>
                 <BattleArena students={students} />
               </div>
               <div>
                 <PerformanceRadar radarData={radarData} students={students} />
               </div>
            </div>
          )}

          {/* VIEW: SYNERGY */}
          {activeView === 'synergy' && (
            <div className="animate-fadeIn">
               <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mb-8 text-center">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">AI Study Pods</h2>
                  <p className="text-purple-700 max-w-2xl mx-auto">
                    Our algorithm analyzes student strengths to create optimal study pairs. 
                    Students with >80% in a subject help those with lower scores, maximizing the class potential.
                  </p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {synergyPairs.map((pair, idx) => (
                    <SynergyPod key={idx} pair={pair} />
                  ))}
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};