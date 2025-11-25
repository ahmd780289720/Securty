
export enum UnderstandingLevel {
  NOT_SET = 'NOT_SET',
  UNDERSTOOD = 'UNDERSTOOD',
  PARTIAL = 'PARTIAL',
  NOT_UNDERSTOOD = 'NOT_UNDERSTOOD'
}

export enum QuestionType {
  MCQ = 'MCQ',
  TRUE_FALSE = 'TRUE_FALSE'
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string; // Basic explanation, AI will enhance this
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown/HTML string
  summary: string;
  xpReward: number;
  bookReference?: string; // Recommended book
  questions: Question[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  isLocked: boolean;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  courses: Course[];
  isLocked: boolean;
}

export interface DailyProgress {
  day: string; // "Sat", "Sun", etc.
  xp: number;
}

export interface UserState {
  xp: number;
  streak: number;
  level: number;
  hearts: number;
  lastHeartRegen: number; // Timestamp
  completedLessons: string[]; // IDs of completed lessons
  completedCourses: string[]; // IDs of completed courses
  unlockedLevels: number[];
  weeklyProgress: DailyProgress[]; // For the chart
  lastLoginDate: string;
}
