import React from 'react';
import { ProcessedStudent, ChartDataPoint } from '../types';
import { BattleArena } from './BattleArena';
import { PerformanceRadar } from './PerformanceRadar';

interface ComparisonPageProps {
  students: ProcessedStudent[];
  radarData: ChartDataPoint[];
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({ students, radarData }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fadeIn">
       <div>
         <BattleArena students={students} />
       </div>
       <div>
         <PerformanceRadar radarData={radarData} students={students} />
       </div>
    </div>
  );
};