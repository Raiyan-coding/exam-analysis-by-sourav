import React from 'react';
import { Trophy } from 'lucide-react';
import { ProcessedStudent, SubjectStat } from '../types';
import { SubjectDeepDive } from './SubjectDeepDive';
import { CircularProgress } from './CircularProgress';

interface SubjectsPageProps {
  students: ProcessedStudent[];
  subjectStats: SubjectStat[];
}

export const SubjectsPage: React.FC<SubjectsPageProps> = ({ students, subjectStats }) => {
  return (
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
  );
};