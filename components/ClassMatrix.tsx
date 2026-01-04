import React from 'react';
import { ProcessedStudent } from '../types';
import { SUBJECTS, SUBJECT_FULL_MARKS } from '../constants';
import { Grid } from 'lucide-react';
import { getPerformanceColor } from '../utils/analytics';

interface ClassMatrixProps {
  students: ProcessedStudent[];
}

export const ClassMatrix: React.FC<ClassMatrixProps> = ({ students }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden print-break-inside-avoid">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <Grid className="w-5 h-5 text-slate-500" />
        <h2 className="text-lg font-bold text-gray-800">Class Performance Matrix</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 sticky left-0 z-10">Student</th>
              {SUBJECTS.map(sub => (
                <th key={sub} className="p-3 bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 min-w-[60px]">
                  {sub}
                </th>
              ))}
              <th className="p-3 bg-slate-100 border-b border-slate-200 font-bold text-slate-700">Avg</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.name} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 text-left border-b border-slate-100 font-medium text-slate-900 sticky left-0 bg-white hover:bg-slate-50 border-r">
                  {student.name}
                </td>
                {student.marks.map((mark, idx) => {
                  const fullMark = SUBJECT_FULL_MARKS[SUBJECTS[idx]];
                  const pct = (mark / fullMark) * 100;
                  // Determine background intensity based on score
                  let bgClass = '';
                  let textClass = 'text-slate-700';
                  
                  if (pct >= 90) { bgClass = 'bg-emerald-100'; textClass = 'text-emerald-800 font-bold'; }
                  else if (pct >= 80) { bgClass = 'bg-emerald-50'; textClass = 'text-emerald-700'; }
                  else if (pct >= 60) { bgClass = 'bg-white'; textClass = 'text-slate-600'; }
                  else if (pct >= 40) { bgClass = 'bg-orange-50'; textClass = 'text-orange-700'; }
                  else { bgClass = 'bg-red-50'; textClass = 'text-red-700 font-bold'; }

                  return (
                    <td key={idx} className={`p-3 border-b border-slate-100 ${bgClass} ${textClass}`}>
                      {mark}
                    </td>
                  );
                })}
                <td className="p-3 border-b border-slate-100 font-bold bg-slate-50 text-slate-800 border-l">
                  {student.average.toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-slate-50 text-xs text-center text-slate-500 border-t border-slate-200">
         Cells color-coded by performance tier: <span className="text-emerald-600 font-bold">90%+</span>, <span className="text-emerald-600">80%+</span>, <span className="text-slate-500">60%+</span>, <span className="text-orange-600">40%+</span>, <span className="text-red-600">&lt;40%</span>.
      </div>
    </div>
  );
};