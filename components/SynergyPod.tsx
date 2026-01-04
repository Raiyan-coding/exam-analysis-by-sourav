import React from 'react';
import { SynergyPair } from '../types';
import { Atom, UserPlus, CheckCircle2 } from 'lucide-react';

interface SynergyPodProps {
  pair: SynergyPair;
}

export const SynergyPod: React.FC<SynergyPodProps> = ({ pair }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-5 relative overflow-hidden group hover:shadow-xl transition-shadow">
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-1 transition-transform group-hover:scale-110"></div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
           <Atom className="w-5 h-5 animate-spin-slow" />
        </div>
        <h3 className="font-bold text-gray-800">High Synergy Pair</h3>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
            <div className="font-bold text-gray-900">{pair.student1.name}</div>
            <div className="text-xs text-gray-500">Avg: {pair.student1.average.toFixed(1)}%</div>
        </div>
        <div className="text-purple-400 font-black text-xl">+</div>
        <div className="text-center">
            <div className="font-bold text-gray-900">{pair.student2.name}</div>
            <div className="text-xs text-gray-500">Avg: {pair.student2.average.toFixed(1)}%</div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-3 mb-3">
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Theoretical Potential</span>
            <span className="text-sm font-bold text-purple-600">{pair.synergyScore.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${pair.synergyScore}%` }}></div>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Combined Strengths</p>
        <div className="flex flex-wrap gap-1">
            {pair.coveredSubjects.slice(0, 5).map(sub => (
                <span key={sub} className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded text-[10px] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {sub}
                </span>
            ))}
            {pair.coveredSubjects.length > 5 && (
                <span className="px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-100 rounded text-[10px] font-medium">
                    +{pair.coveredSubjects.length - 5} more
                </span>
            )}
        </div>
      </div>
    </div>
  );
};