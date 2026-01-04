export interface StudentMarks {
  [studentName: string]: number[];
}

export interface Badge {
  id: string;
  label: string;
  icon: string; // Lucide icon name or emoji
  color: string;
  description: string;
}

export interface ProcessedStudent {
  name: string;
  marks: number[];
  total: number;
  average: number;
  rank: number;
  consistency: 'High' | 'Moderate' | 'Low';
  stdDev: number;
  strongest: { subject: string; mark: number; fullMark: number; percentage: number }[];
  weakest: { subject: string; mark: number; fullMark: number; percentage: number }[];
  badges: Badge[];
}

export interface SubjectStat {
  subject: string;
  average: number;
  averagePercentage: number;
  highest: number;
  highestPercentage: number;
  lowest: number;
  topper: string;
  fullMark: number;
}

export interface ChartDataPoint {
  subject: string;
  [studentName: string]: number | string;
  fullMark: number;
}

export interface SynergyPair {
  student1: ProcessedStudent;
  student2: ProcessedStudent;
  synergyScore: number; // Combined max potential average
  coveredSubjects: string[]; // Subjects where at least one has > 80%
}