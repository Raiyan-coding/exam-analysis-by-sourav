import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import { ProcessedStudent, ChartDataPoint } from '../types';
import { STUDENT_COLORS } from '../constants';
import { Filter, Layers, CheckCircle2 } from 'lucide-react';

interface PerformanceRadarProps {
  radarData: ChartDataPoint[];
  students: ProcessedStudent[];
}

export const PerformanceRadar: React.FC<PerformanceRadarProps> = ({ radarData, students }) => {
  // State for toggling students
  const [selectedStudents, setSelectedStudents] = useState<string[]>(students.map(s => s.name));
  const [showAverage, setShowAverage] = useState(true);

  const toggleStudent = (name: string) => {
    if (selectedStudents.includes(name)) {
      setSelectedStudents(selectedStudents.filter(s => s !== name));
    } else {
      setSelectedStudents([...selectedStudents, name]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 print-break-inside-avoid">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
           <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-800">Performance Radar</h2>
           </div>
           <p className="text-sm text-gray-500">Compare strengths across subjects.</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {students.map((student, idx) => (
            <button
              key={student.name}
              onClick={() => toggleStudent(student.name)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                selectedStudents.includes(student.name)
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                  : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STUDENT_COLORS[idx % STUDENT_COLORS.length] }}></span>
              {student.name}
            </button>
          ))}
          <button
             onClick={() => setShowAverage(!showAverage)}
             className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all border ${
               showAverage ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
             }`}
          >
             <Layers className="w-3 h-3" /> Class Avg
          </button>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
            
            {/* Render Selected Students */}
            {students.map((student, idx) => (
              selectedStudents.includes(student.name) && (
                <Radar
                  key={student.name}
                  name={student.name}
                  dataKey={student.name}
                  stroke={STUDENT_COLORS[idx % STUDENT_COLORS.length]}
                  fill={STUDENT_COLORS[idx % STUDENT_COLORS.length]}
                  fillOpacity={0.1}
                />
              )
            ))}

            {/* Render Class Average */}
            {showAverage && (
              <Radar
                name="Class Average"
                dataKey="Class Average"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.15}
                strokeDasharray="4 4"
              />
            )}

            <Legend />
            <Tooltip formatter={(value: number) => [`${value}%`, 'Score']} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};