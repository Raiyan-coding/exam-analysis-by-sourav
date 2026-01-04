import React, { useState } from 'react';
import { SubjectStat, ProcessedStudent } from '../types';
import { getGradeDistribution } from '../utils/analytics';
import { SUBJECTS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GraduationCap, BarChart, Scale } from 'lucide-react';

interface SubjectDeepDiveProps {
  students: ProcessedStudent[];
  subjectStats: SubjectStat[];
}

export const SubjectDeepDive: React.FC<SubjectDeepDiveProps> = ({ students, subjectStats }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(SUBJECTS[0]);
  const subjectIndex = SUBJECTS.indexOf(selectedSubject);
  
  const stats = subjectStats[subjectIndex];
  const distributionData = getGradeDistribution(students, subjectIndex);

  // Calculate difficulty rating (inverse of average)
  const difficultyRating = Math.min(10, Math.max(1, (100 - stats.averagePercentage) / 10)).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 print-break-inside-avoid">
       <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-800">Subject Deep Dive</h2>
       </div>

       {/* Tabs */}
       <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
         {SUBJECTS.map(sub => (
           <button
             key={sub}
             onClick={() => setSelectedSubject(sub)}
             className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
               selectedSubject === sub 
                 ? 'bg-indigo-600 text-white shadow-md' 
                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
             }`}
           >
             {sub}
           </button>
         ))}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Stats Column */}
          <div className="space-y-6">
             <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                <div>
                   <div className="text-sm text-gray-500">Highest Score</div>
                   <div className="text-2xl font-bold text-gray-800">{stats.highest}/{stats.fullMark}</div>
                   <div className="text-xs text-emerald-600 font-semibold">by {stats.topper}</div>
                </div>
                <div className="text-right">
                   <div className="text-sm text-gray-500">Average</div>
                   <div className="text-2xl font-bold text-gray-800">{stats.average.toFixed(1)}</div>
                   <div className="text-xs text-indigo-600 font-semibold">{stats.averagePercentage.toFixed(0)}%</div>
                </div>
             </div>

             <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Difficulty Rating</span>
                   </div>
                   <span className="text-lg font-bold text-gray-900">{difficultyRating}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                   <div 
                      className={`h-2 rounded-full ${Number(difficultyRating) > 7 ? 'bg-red-500' : Number(difficultyRating) > 4 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${Number(difficultyRating) * 10}%` }}
                   ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-right">Based on class average performance</p>
             </div>
          </div>

          {/* Chart Column */}
          <div className="h-64 relative">
             <h4 className="absolute top-0 left-0 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade Distribution</h4>
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={distributionData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {distributionData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.fill} />
                   ))}
                 </Pie>
                 <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
               </PieChart>
             </ResponsiveContainer>
             
             {/* Center Text */}
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-800">{students.length}</span>
                <span className="text-xs text-gray-500">Students</span>
             </div>

             {/* Legend */}
             <div className="flex justify-center gap-4 mt-2">
               {distributionData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }}></div>
                     <span className="text-[10px] text-gray-600">{d.name}</span>
                  </div>
               ))}
             </div>
          </div>
       </div>
    </div>
  );
};