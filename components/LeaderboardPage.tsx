import React from 'react';
import { Trophy, Medal, FileSpreadsheet } from 'lucide-react';
import { ProcessedStudent, SubjectStat } from '../types';
import { StudentCard } from './StudentCard';

interface LeaderboardPageProps {
  students: ProcessedStudent[];
  subjectStats: SubjectStat[];
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ students, subjectStats }) => {
  return (
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
  );
};