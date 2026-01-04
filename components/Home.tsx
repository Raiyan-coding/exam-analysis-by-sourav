import React from 'react';
import { 
  Trophy, Swords, Radar, Target, Sparkles, 
  GraduationCap, BarChart2, ArrowRight,
  LayoutDashboard, Medal
} from 'lucide-react';

interface HomeProps {
  onNavigate: (sectionId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  // Features ordered by helpfulness/importance
  const features = [
    {
      id: 'leaderboard',
      title: 'Leaderboard & Reports',
      description: 'View class rankings and detailed individual performance cards.',
      icon: <Trophy className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-100 hover:border-indigo-300'
    },
    {
      id: 'overview',
      title: 'Class Overview',
      description: 'High-level metrics, easiest/hardest subjects, and class averages.',
      icon: <LayoutDashboard className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-100 hover:border-blue-300'
    },
    {
      id: 'subjects',
      title: 'Subject Toppers',
      description: 'Hall of fame for the highest scorers in every subject.',
      icon: <Medal className="w-6 h-6 text-amber-600" />,
      color: 'bg-amber-50 border-amber-100 hover:border-amber-300'
    },
    {
      id: 'subjects', // Using same ID as Toppers to go to Subjects page
      title: 'Subject Deep Dive',
      description: 'Granular grade distribution and difficulty ratings per subject.',
      icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300'
    },
    {
      id: 'comparison',
      title: 'Performance Radar',
      description: 'Compare student strengths against class averages visually.',
      icon: <Radar className="w-6 h-6 text-violet-600" />,
      color: 'bg-violet-50 border-violet-100 hover:border-violet-300'
    },
    {
      id: 'comparison',
      title: 'Battle Arena',
      description: 'Head-to-head student comparison with advantage graphs.',
      icon: <Swords className="w-6 h-6 text-rose-600" />,
      color: 'bg-rose-50 border-rose-100 hover:border-rose-300'
    },
    {
      id: 'synergy',
      title: 'AI Synergy Pods',
      description: 'Algorithmic study partner matching based on complementary skills.',
      icon: <Sparkles className="w-6 h-6 text-fuchsia-600" />,
      color: 'bg-fuchsia-50 border-fuchsia-100 hover:border-fuchsia-300'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Student Analytics</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-indigo-200">
            EduAnalytics Pro
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Advanced visualization and AI-powered insights for the modern classroom. Select a feature below to analyze data.
          </p>
        </div>
      </div>

      {/* Feature Index */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-slate-100 p-2 rounded-lg">
             <BarChart2 className="w-6 h-6 text-slate-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics Suite</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              onClick={() => onNavigate(feature.id)}
              className={`group p-6 rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${feature.color}`}
            >
              <div className="mb-4 p-3 bg-white rounded-xl inline-block shadow-sm group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center justify-between">
                {feature.title}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-slate-400" />
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-500 font-medium">© {new Date().getFullYear()} EduAnalytics Pro. Designed for performance.</p>
        </div>
      </div>
    </div>
  );
};