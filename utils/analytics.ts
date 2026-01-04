import { SUBJECTS, RAW_MARKS, SUBJECT_FULL_MARKS } from '../constants';
import { ProcessedStudent, SubjectStat, ChartDataPoint, Badge, SynergyPair } from '../types';

// Helper to determine color based on PERCENTAGE
export const getPerformanceColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-emerald-600 bg-emerald-50';
  if (percentage >= 60) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
};

export const getBarColor = (percentage: number): string => {
  if (percentage >= 80) return '#10B981'; // Emerald
  if (percentage >= 60) return '#F59E0B'; // Amber
  return '#EF4444'; // Red
};

export const getGradeDistribution = (students: ProcessedStudent[], subjectIndex: number) => {
  let excellent = 0;
  let good = 0;
  let needsImprovement = 0;

  students.forEach(student => {
    const percentage = student.marks[subjectIndex] / SUBJECT_FULL_MARKS[SUBJECTS[subjectIndex]] * 100;
    if (percentage >= 80) excellent++;
    else if (percentage >= 60) good++;
    else needsImprovement++;
  });

  return [
    { name: 'Excellent (>80%)', value: excellent, fill: '#10B981' },
    { name: 'Good (60-79%)', value: good, fill: '#F59E0B' },
    { name: 'Needs Focus (<60%)', value: needsImprovement, fill: '#EF4444' },
  ];
};

export const processData = (): { students: ProcessedStudent[]; subjectStats: SubjectStat[]; radarData: ChartDataPoint[] } => {
  const studentNames = Object.keys(RAW_MARKS);
  
  // 1. Process Individual Student Metrics
  const students: ProcessedStudent[] = studentNames.map((name) => {
    const marks = RAW_MARKS[name];
    let totalObtained = 0;
    let totalMax = 0;

    // Map subjects to marks and percentages
    const subjectPerformance = marks.map((mark, i) => {
      const subject = SUBJECTS[i];
      const fullMark = SUBJECT_FULL_MARKS[subject];
      totalObtained += mark;
      totalMax += fullMark;
      
      return {
        subject,
        mark,
        fullMark,
        percentage: (mark / fullMark) * 100
      };
    });

    const average = (totalObtained / totalMax) * 100; // Overall Percentage
    
    // Sort for strong/weak based on PERCENTAGE, not raw marks
    const sortedProps = [...subjectPerformance].sort((a, b) => b.percentage - a.percentage);
    const strongest = sortedProps.slice(0, 3);
    const weakest = sortedProps.slice(-3).reverse(); // Weakest first

    // Calculate Consistency (Standard Deviation of Percentages)
    const percentages = subjectPerformance.map(p => p.percentage);
    const meanPct = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const variance = percentages.reduce((a, b) => a + Math.pow(b - meanPct, 2), 0) / percentages.length;
    const stdDev = Math.sqrt(variance);

    let consistency: 'High' | 'Moderate' | 'Low' = 'Moderate';
    if (stdDev < 8) consistency = 'High'; // Very consistent marks
    else if (stdDev > 15) consistency = 'Low'; // Highly variable performance

    return {
      name,
      marks,
      total: totalObtained,
      average,
      rank: 0, // Calculated later
      consistency,
      stdDev,
      strongest,
      weakest,
      badges: [] // Populated after rank calculation
    };
  });

  // 2. Calculate Rank & Assign Badges
  students.sort((a, b) => b.total - a.total);
  students.forEach((s, index) => {
    s.rank = index + 1;
    
    // Logic for Badges
    const badges: Badge[] = [];
    
    // Rank 1 Badge
    if (s.rank === 1) badges.push({ id: 'top_1', label: 'Grandmaster', icon: '👑', color: 'bg-yellow-100 text-yellow-800', description: 'Rank 1 in Class' });
    
    // Consistency Badge
    if (s.consistency === 'High') badges.push({ id: 'consist', label: 'Metronome', icon: '⚖️', color: 'bg-blue-100 text-blue-800', description: 'Extremely consistent performance' });
    
    // Full Marks Badge (or very high marks)
    if (s.strongest[0].percentage >= 95) badges.push({ id: 'sniper', label: 'Sniper', icon: '🎯', color: 'bg-red-100 text-red-800', description: 'Scored 95%+ in a subject' });
    
    // No Failures Badge (All > 60%)
    const lowest = Math.min(...s.marks.map((m, i) => (m / SUBJECT_FULL_MARKS[SUBJECTS[i]]) * 100));
    if (lowest >= 60) badges.push({ id: 'shield', label: 'Iron Shield', icon: '🛡️', color: 'bg-slate-100 text-slate-800', description: 'No subject below 60%' });

    // Math Whiz
    const mathIdx = SUBJECTS.indexOf("Math");
    if (mathIdx !== -1 && (s.marks[mathIdx] / SUBJECT_FULL_MARKS["Math"]) * 100 >= 90) {
      badges.push({ id: 'math_whiz', label: 'Math Whiz', icon: '🧮', color: 'bg-indigo-100 text-indigo-800', description: 'Scored 90%+ in Math' });
    }

    s.badges = badges;
  });

  // 3. Process Subject Stats (Comparison)
  const subjectStats: SubjectStat[] = SUBJECTS.map((subject, index) => {
    const fullMark = SUBJECT_FULL_MARKS[subject];
    const marksForSubject = students.map(s => s.marks[index]);
    
    const maxMark = Math.max(...marksForSubject);
    const minMark = Math.min(...marksForSubject);
    const avgMark = marksForSubject.reduce((sum, m) => sum + m, 0) / marksForSubject.length;
    
    // Find topper(s)
    const topStudent = students.find(s => s.marks[index] === maxMark);

    return {
      subject,
      average: avgMark,
      averagePercentage: (avgMark / fullMark) * 100,
      highest: maxMark,
      highestPercentage: (maxMark / fullMark) * 100,
      lowest: minMark,
      topper: topStudent ? topStudent.name : 'N/A',
      fullMark
    };
  });

  // 4. Prepare Radar Chart Data (Normalized to percentages)
  const radarData: ChartDataPoint[] = SUBJECTS.map((subject, index) => {
    const fullMark = SUBJECT_FULL_MARKS[subject];
    const entry: ChartDataPoint = { subject, fullMark };
    students.forEach(s => {
      // Normalize to 0-100 scale for visual comparison
      entry[s.name] = parseFloat(((s.marks[index] / fullMark) * 100).toFixed(1));
    });
    // Add Class Average to Radar Data
    entry['Class Average'] = parseFloat(subjectStats[index].averagePercentage.toFixed(1));
    return entry;
  });

  return { students, subjectStats, radarData };
};

// Advanced: Synergy Calculation (Dream Team)
export const calculateSynergy = (students: ProcessedStudent[]): SynergyPair[] => {
  const pairs: SynergyPair[] = [];
  
  for (let i = 0; i < students.length; i++) {
    for (let j = i + 1; j < students.length; j++) {
      const s1 = students[i];
      const s2 = students[j];
      
      let combinedPotentialTotal = 0;
      let maxTotal = 0;
      const coveredSubjects: string[] = [];

      SUBJECTS.forEach((sub, idx) => {
        const fullMark = SUBJECT_FULL_MARKS[sub];
        const p1 = (s1.marks[idx] / fullMark) * 100;
        const p2 = (s2.marks[idx] / fullMark) * 100;
        
        // Take the better of the two
        const bestPct = Math.max(p1, p2);
        combinedPotentialTotal += bestPct;
        maxTotal += 100;

        if (bestPct >= 80) {
          coveredSubjects.push(sub);
        }
      });

      const synergyScore = (combinedPotentialTotal / maxTotal) * 100;

      pairs.push({
        student1: s1,
        student2: s2,
        synergyScore,
        coveredSubjects
      });
    }
  }

  // Sort by highest synergy score
  return pairs.sort((a, b) => b.synergyScore - a.synergyScore).slice(0, 3);
};