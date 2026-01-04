import React, { useState, useMemo } from 'react';
import { ProcessedStudent } from '../types';
import { SUBJECTS, SUBJECT_FULL_MARKS } from '../constants';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, BarChart, Bar, XAxis, YAxis, ReferenceLine, Cell } from 'recharts';
import { Swords, Trophy, Skull } from 'lucide-react';

interface BattleArenaProps {
  students: ProcessedStudent[];
}

export const BattleArena: React.FC<BattleArenaProps> = ({ students }) => {
  const [player1Id, setPlayer1Id] = useState<string>(students[0]?.name || '');
  const [player2Id, setPlayer2Id] = useState<string>(students[1]?.name || '');

  const p1 = students.find(s => s.name === player1Id);
  const p2 = students.find(s => s.name === player2Id);

  const radarData = useMemo(() => {
    if (!p1 || !p2) return [];
    return SUBJECTS.map((sub, idx) => ({
      subject: sub,
      [p1.name]: parseFloat(((p1.marks[idx] / SUBJECT_FULL_MARKS[sub]) * 100).toFixed(1)),
      [p2.name]: parseFloat(((p2.marks[idx] / SUBJECT_FULL_MARKS[sub]) * 100).toFixed(1)),
      fullMark: 100
    }));
  }, [p1, p2]);

  const diffData = useMemo(() => {
    if (!p1 || !p2) return [];
    return SUBJECTS.map((sub, idx) => {
      const pct1 = (p1.marks[idx] / SUBJECT_FULL_MARKS[sub]) * 100;
      const pct2 = (p2.marks[idx] / SUBJECT_FULL_MARKS[sub]) * 100;
      return {
        subject: sub,
        diff: parseFloat((pct1 - pct2).toFixed(1)), // Positive means P1 wins
        winner: pct1 > pct2 ? p1.name : p2.name
      };
    });
  }, [p1, p2]);

  const p1Wins = diffData.filter(d => d.diff > 0).length;
  const p2Wins = diffData.filter(d => d.diff < 0).length;

  if (!p1 || !p2) return null;

  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 overflow-hidden mb-8 print-break-inside-avoid">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-4 flex items-center justify-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <Swords className="w-6 h-6 text-yellow-400 animate-pulse" />
        <h2 className="text-xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">Battle Arena</h2>
        <Swords className="w-6 h-6 text-yellow-400 animate-pulse scale-x-[-1]" />
      </div>

      <div className="p-6">
        {/* Selectors */}
        <div className="flex justify-between items-center mb-8 gap-4">
          <select 
            value={player1Id} 
            onChange={(e) => setPlayer1Id(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white rounded-lg px-4 py-2 w-1/3 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {students.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          <div className="text-2xl font-black text-slate-500 italic">VS</div>
          <select 
            value={player2Id} 
            onChange={(e) => setPlayer2Id(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white rounded-lg px-4 py-2 w-1/3 focus:ring-2 focus:ring-pink-500 outline-none"
          >
            {students.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </div>

        {/* Stats Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Player 1 Stats */}
          <div className="space-y-4 text-center">
            <div className="bg-indigo-600/20 border border-indigo-500/50 p-4 rounded-xl">
              <div className="text-4xl font-bold text-indigo-400">{p1.average.toFixed(1)}%</div>
              <div className="text-xs text-indigo-200 uppercase tracking-wide">Avg Power Level</div>
            </div>
            <div className="flex justify-center gap-2">
               <div className="bg-slate-800 p-2 rounded w-full">
                 <div className="text-xl font-bold text-white">{p1Wins}</div>
                 <div className="text-[10px] text-slate-400 uppercase">Subjects Won</div>
               </div>
               <div className="bg-slate-800 p-2 rounded w-full">
                 <div className="text-xl font-bold text-white">#{p1.rank}</div>
                 <div className="text-[10px] text-slate-400 uppercase">Rank</div>
               </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name={p1.name} dataKey={p1.name} stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                <Radar name={p2.name} dataKey={p2.name} stroke="#f472b6" fill="#f472b6" fillOpacity={0.3} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Player 2 Stats */}
          <div className="space-y-4 text-center">
            <div className="bg-pink-600/20 border border-pink-500/50 p-4 rounded-xl">
              <div className="text-4xl font-bold text-pink-400">{p2.average.toFixed(1)}%</div>
              <div className="text-xs text-pink-200 uppercase tracking-wide">Avg Power Level</div>
            </div>
            <div className="flex justify-center gap-2">
               <div className="bg-slate-800 p-2 rounded w-full">
                 <div className="text-xl font-bold text-white">{p2Wins}</div>
                 <div className="text-[10px] text-slate-400 uppercase">Subjects Won</div>
               </div>
               <div className="bg-slate-800 p-2 rounded w-full">
                 <div className="text-xl font-bold text-white">#{p2.rank}</div>
                 <div className="text-[10px] text-slate-400 uppercase">Rank</div>
               </div>
            </div>
          </div>
        </div>
        
        {/* Difference Chart */}
        <div className="mt-8 h-40">
           <p className="text-center text-xs text-slate-400 uppercase mb-2">Advantage Graph (Up = {p1.name}, Down = {p2.name})</p>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={diffData} margin={{top: 10, bottom: 0}}>
               <XAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10}} interval={0} />
               <ReferenceLine y={0} stroke="#475569" />
               <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  content={({active, payload}) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-800 p-2 border border-slate-600 text-xs rounded text-white">
                          <span className="font-bold">{d.subject}</span>: {d.diff > 0 ? p1.name : p2.name} +{Math.abs(d.diff)}%
                        </div>
                      );
                    }
                    return null;
                  }}
               />
               <Bar dataKey="diff">
                  {diffData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.diff > 0 ? '#818cf8' : '#f472b6'} />
                  ))}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};