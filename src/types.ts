export type ViewState = 'home' | 'lesson' | 'games' | 'final-exam' | 'achievements' | 'glossary';

export type ThemeMode = 'vibrant' | 'eye-care' | 'dark';
export type FontSize = 'normal' | 'large' | 'xl';

export interface StudentProfile {
  name: string;
  grade: string; // e.g. "الصف الثامن / 1"
  avatar?: string;
  xp: number;
  level: number;
  completedLessons: string[]; // ['lesson-1-1', 'lesson-1-2', 'lesson-1-3', 'lesson-1-4']
  quizScores: Record<string, any>;
  unlockedBadges: string[];
  finalExamScore?: { score: number; total: number; percentage: number; date?: string };
  checklist?: Record<string, boolean>;
}

export interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'matching' | 'scenario';
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  points: number;
  hint?: string;
  tableData?: { headers: string[]; rows: (string | number)[][] };
}

export interface SlideItem {
  id: number;
  title: string;
  summary: string;
  bulletPoints: string[];
  example?: string;
  iconName: string;
  tip?: string;
  badgeText?: string;
}

export interface LessonData {
  id: string;
  number?: string;
  title: string;
  subtitle?: string;
  description?: string;
  duration?: string;
  icon?: string;
  color?: string;
  objectives?: string[];
  learningObjectives?: string[];
  skills?: string[];
  hookIntro?: {
    story: string;
    question: string;
    practicalLife: string;
  };
  explanationSections?: {
    id: string;
    title: string;
    content: string;
    keyPoints?: string[];
    techTip?: string;
    caution?: string;
  }[];
  slides: SlideItem[];
  quiz?: QuizQuestion[];
  quizQuestions?: QuizQuestion[];
  summary?: {
    concepts: string[];
    skills: string[];
    keyTakeaways: string[];
  };
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredXp?: number;
  conditionDescription: string;
}

export interface GlossaryTerm {
  id?: string;
  termAr: string;
  termEn: string;
  definition: string;
  lessonId: string;
  example?: string;
}

