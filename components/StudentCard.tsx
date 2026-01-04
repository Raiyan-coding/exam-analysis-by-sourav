import React from 'react';
import { ProcessedStudent, SubjectStat } from '../types';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Cell, ReferenceLine, CartesianGrid, Legend } from 'recharts';
import { getBarColor } from '../utils/analytics';
import { SUBJECTS, SUBJECT_FULL_MARKS } from '../constants';
import { Activity, Zap, Medal } from 'lucide-react';

interface StudentCardProps {
  student: ProcessedStudent;
  subjectStats: SubjectStat[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg z-50">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        <div className="space-y-1">
          <p className="text-sm text-gray-600 flex justify-between gap-4">
            <span>Student:</span>
            <span className="font-bold text-indigo-600">{data.mark}/{data.fullMark} ({data.percentage.toFixed(0)}%)</span>
          </p>
          <p className="text-sm text-gray-500 flex justify-between gap-4">
            <span>Class Avg:</span>
            <span className="font-medium text-amber-500">{data.classAvg.toFixed(1)}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const StudentCard: React.FC<StudentCardProps> = ({ student, subjectStats }) => {
  const chartData = SUBJECTS.map((sub, idx) => {
    const mark = student.marks[idx];
    const fullMark = SUBJECT_FULL_MARKS[sub];
    const classAvg = subjectStats[idx].averagePercentage;
    
    return {
      subject: sub,
      mark: mark,
      fullMark: fullMark,
      percentage: (mark / fullMark) * 100,
      classAvg: classAvg
    };
  });

  const getConsistencyColor = (c: string) => {
    switch(c) {
      case 'High': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Moderate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100 print-break-inside-avoid relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-1 opacity-50 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {student.name}
            <span className="text-sm font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              Rank #{student.rank}
            </span>
          </h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>Total: <b>{student.total}</b></span>
            <span>Avg: <b>{student.average.toFixed(1)}%</b></span>
          </div>
        </div>
        
        <div className="flex gap-2">
            {/* Consistency Badge */}
            <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${getConsistencyColor(student.consistency)}`}>
                <Activity className="w-4 h-4" />
                <div className="flex flex-col leading-tight">
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Consistency</span>
                    <span className="font-bold text-sm">{student.consistency}</span>
                </div>
            </div>
        </div>
      </div>
      
      {/* Badges Section */}
      {student.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
              {student.badges.map(badge => (
                  <div key={badge.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-transparent hover:border-black/5 transition-all cursor-help ${badge.color}`} title={badge.description}>
                      <span>{badge.icon}</span>
                      {badge.label}
                  </div>
              ))}
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
              <ReferenceLine y={60} stroke="#EF4444" strokeDasharray="3 3" />
              
              <Bar dataKey="percentage" name="Student %" radius={[4, 4, 0, 0]} barSize={30}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                ))}
              </Bar>
              <Line 
                type="monotone" 
                dataKey="classAvg" 
                name="Class Avg %" 
                stroke="#F59E0B" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
             <div className="flex items-center gap-2 mb-3 text-emerald-700">
                <Zap className="w-4 h-4" />
                <h4 className="text-sm font-bold uppercase tracking-wider">Super Strengths</h4>
             </div>
             <div className="space-y-2">
              {student.strongest.map((s, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">{s.subject}</span>
                  <span className="font-bold text-emerald-600">{s.percentage.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
             <div className="flex items-center gap-2 mb-3 text-red-700">
                <Activity className="w-4 h-4" />
                <h4 className="text-sm font-bold uppercase tracking-wider">Improvement Areas</h4>
             </div>
             <div className="space-y-2">
              {student.weakest.map((s, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">{s.subject}</span>
                  <span className="font-bold text-red-500">{s.percentage.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};