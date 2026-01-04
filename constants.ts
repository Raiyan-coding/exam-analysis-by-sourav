import { StudentMarks } from './types';

export const SUBJECTS = ["Math", "B1", "B2", "Rel", "Phy", "E1", "E2", "ICT", "BGS", "HM", "Che", "Bio"];

export const SUBJECT_FULL_MARKS: Record<string, number> = {
  "Math": 100, "B1": 100, "B2": 100, "Rel": 100, "Phy": 100, "E1": 100, 
  "E2": 100, "ICT": 50, "BGS": 100, "HM": 100, "Che": 100, "Bio": 100
};

export const RAW_MARKS: StudentMarks = {
  Medha:  [80, 89, 81, 89, 70, 89, 94, 50, 92, 84, 64, 94],
  Raiyan: [81, 76, 80, 88, 91, 91, 94, 48, 92, 87, 84, 97],
  Sourav: [87, 70, 79, 75, 89, 85, 87, 48, 91, 94, 87, 89]
};

export const COLORS = {
  primary: "#4F46E5",   // Indigo
  secondary: "#06B6D4", // Cyan
  tertiary: "#8B5CF6",  // Violet
  danger: "#EF4444",    // Red
  warning: "#F59E0B",   // Amber
  success: "#10B981",   // Emerald
  background: "#F8FAFC"
};

export const STUDENT_COLORS = [COLORS.primary, COLORS.secondary, COLORS.tertiary];