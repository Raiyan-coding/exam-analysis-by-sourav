import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { Trophy, Target, BrainCircuit, ArrowUpRight } from 'lucide-react';
import { ProcessedStudent, SubjectStat } from '../types';
import { COLORS } from '../constants';
import { ClassMatrix } from './ClassMatrix';

interface OverviewPageProps {
  students: ProcessedStudent[];
  subjectStats: SubjectStat[];
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ students, subjectStats }) => {
  const hardestSubject = [...subjectStats].sort((a, b) => a.averagePercentage - b.averagePercentage)[0];
  const easiestSubject = [...subjectStats].sort((a, b) => b.averagePercentage - a.averagePercentage)[0];

  return (
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
  );
};