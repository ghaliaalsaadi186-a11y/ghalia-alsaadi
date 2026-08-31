import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { StudentProfile, ViewState, ThemeMode, FontSize } from './types';
import { LESSONS_DATA, BADGES_LIST } from './data/lessonsData';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { LessonView } from './components/LessonView';
import { GamesArena } from './components/games/GamesArena';
import { FinalExam } from './components/FinalExam';
import { AchievementsView } from './components/AchievementsView';
import { GlossaryView } from './components/GlossaryView';
import { StudentProfileModal } from './components/StudentProfileModal';

const INITIAL_PROFILE: StudentProfile = {
  name: 'طالبتي المبدعة',
  grade: 'الصف الثامن / 1',
  avatar: '👩‍🎓',
  xp: 0,
  level: 1,
  completedLessons: [],
  quizScores: {},
  unlockedBadges: []
};

export function App() {
  // Load saved state or default
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const savednest = localStorage.getItem('oman_g8_student_profile');
      if (savednest) {
        const parsed = JSON.parse(savednest);
        if (parsed.name === 'طالبة الصف الثامن' || !parsed.name) {
          parsed.name = 'طالبتي المبدعة';
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading student profile', e);
    }
    return INITIAL_PROFILE;
  });

  const [activeView, setActiveView] = useState<ViewState>('home');
  const [activeLessonId, setActiveLessonId] = useState<string | null>('lesson-1-1');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Accessibility States: Theme and Font Size
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem('oman_edu_theme') as ThemeMode;
      if (savedTheme && ['vibrant', 'eye-care', 'dark'].includes(savedTheme)) {
        return savedTheme;
      }
    } catch (e) {
      console.error(e);
    }
    return 'vibrant';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    try {
      const savedSize = localStorage.getItem('oman_edu_font_size') as FontSize;
      if (savedSize && ['normal', 'large', 'xl'].includes(savedSize)) {
        return savedSize;
      }
    } catch (e) {
      console.error(e);
    }
    return 'normal';
  });

  // Sync theme & font size
  useEffect(() => {
    try {
      localStorage.setItem('oman_edu_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('oman_edu_font_size', fontSize);
    } catch (e) {
      console.error(e);
    }
  }, [fontSize]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('oman_g8_student_profile', JSON.stringify(student));
    } catch (e) {
      console.error('Error saving student profile', e);
    }
  }, [student]);

  // Check and unlock badges whenever student state changes
  const checkBadgeUnlocks = (current: StudentProfile): string[] => {
    const unlocked = new Set(current.unlockedBadges);

    // Badge 1: Forms Specialist (Lesson 1-1 completed)
    if (current.completedLessons.includes('lesson-1-1')) {
      unlocked.add('badge-1');
    }

    // Badge 2: Spreadsheet Engineer (Lesson 1-2 completed)
    if (current.completedLessons.includes('lesson-1-2')) {
      unlocked.add('badge-2');
    }

    // Badge 3: Future Forecaster (Lesson 1-3 completed)
    if (current.completedLessons.includes('lesson-1-3')) {
      unlocked.add('badge-3');
    }

    // Badge 4: Comprehensive Project Master (Lesson 1-4 completed)
    if (current.completedLessons.includes('lesson-1-4')) {
      unlocked.add('badge-4');
    }

    // Badge 5: Golden Master (Final exam score >= 85%)
    if (current.finalExamScore && current.finalExamScore.percentage >= 85) {
      unlocked.add('badge-master');
    }

    // Badge 6: Games Star (XP >= 200)
    if (current.xp >= 200) {
      unlocked.add('badge-games');
    }

    return Array.from(unlocked);
  };

  const calculateLevel = (xp: number): number => {
    if (xp >= 700) return 5;
    if (xp >= 450) return 4;
    if (xp >= 250) return 3;
    if (xp >= 100) return 2;
    return 1;
  };

  // Add XP and handle leveling
  const handleAwardXp = (amount: number) => {
    setStudent(prev => {
      const nextXp = prev.xp + amount;
      const nextLevel = calculateLevel(nextXp);
      const updated: StudentProfile = {
        ...prev,
        xp: nextXp,
        level: nextLevel
      };
      updated.unlockedBadges = checkBadgeUnlocks(updated);
      return updated;
    });
  };

  // Complete a lesson
  const handleLessonComplete = (lessonId: string, earnedXp: number) => {
    setStudent(prev => {
      const completed = prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId];
      const nextXp = prev.xp + earnedXp;
      const nextLevel = calculateLevel(nextXp);
      const updated: StudentProfile = {
        ...prev,
        completedLessons: completed,
        xp: nextXp,
        level: nextLevel
      };
      updated.unlockedBadges = checkBadgeUnlocks(updated);
      return updated;
    });
  };

  // Record quiz score
  const handleQuizComplete = (lessonId: string, score: number, total: number) => {
    setStudent(prev => {
      const updatedScores = { ...prev.quizScores, [lessonId]: score };
      const nextXp = prev.xp + score;
      const nextLevel = calculateLevel(nextXp);
      const updated: StudentProfile = {
        ...prev,
        quizScores: updatedScores,
        xp: nextXp,
        level: nextLevel
      };
      updated.unlockedBadges = checkBadgeUnlocks(updated);
      return updated;
    });
  };

  // Record final exam
  const handleFinalExamComplete = (score: number, total: number, percentage: number) => {
    setStudent(prev => {
      const nextXp = prev.xp + score;
      const nextLevel = calculateLevel(nextXp);
      const updated: StudentProfile = {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        finalExamScore: { score, total, percentage }
      };
      updated.unlockedBadges = checkBadgeUnlocks(updated);
      return updated;
    });
  };

  // Navigation handler
  const handleNavigate = (view: ViewState, lessonId?: string) => {
    setActiveView(view);
    if (lessonId) {
      setActiveLessonId(lessonId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update profile
  const handleSaveProfile = (updated: Partial<StudentProfile>) => {
    setStudent(prev => ({
      ...prev,
      ...updated
    }));
  };

  // Find active lesson object
  const currentLesson = LESSONS_DATA.find(l => l.id === activeLessonId) || LESSONS_DATA[0];

  return (
    <div 
      className={`min-h-screen app-main-layout flex flex-col font-sans transition-colors duration-200 theme-${theme} font-size-${fontSize} ${
        theme === 'eye-care' 
          ? 'bg-[#f7f3e8] text-[#3b3323]' 
          : theme === 'dark' 
          ? 'bg-[#0b0f19] text-[#e2e8f0]' 
          : 'bg-sky-50 text-slate-800'
      }`} 
      dir="rtl"
    >
      
      {/* Top Main Navigation Header */}
      <Header
        activeView={activeView}
        onNavigate={(v) => handleNavigate(v)}
        student={student}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        theme={theme}
        fontSize={fontSize}
        onThemeChange={setTheme}
        onFontSizeChange={setFontSize}
      />

      {/* Main App Container View */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <HomeDashboard
                student={student}
                onNavigate={(v, id) => handleNavigate(v, id)}
              />
            </motion.div>
          )}

          {activeView === 'lesson' && (
            <motion.div
              key={`lesson-${activeLessonId}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <LessonView
                lesson={currentLesson}
                student={student}
                onBackToHome={() => handleNavigate('home')}
                onLessonComplete={handleLessonComplete}
                onQuizComplete={handleQuizComplete}
              />
            </motion.div>
          )}

          {activeView === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <GamesArena
                onAwardXp={handleAwardXp}
                onBackToHome={() => handleNavigate('home')}
              />
            </motion.div>
          )}

          {activeView === 'final-exam' && (
            <motion.div
              key="final-exam"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <FinalExam
                student={student}
                onExamComplete={handleFinalExamComplete}
                onGoToCertificate={() => handleNavigate('achievements')}
              />
            </motion.div>
          )}

          {activeView === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <AchievementsView
                student={student}
                onOpenProfileModal={() => setIsProfileModalOpen(true)}
              />
            </motion.div>
          )}

          {activeView === 'glossary' && (
            <motion.div
              key="glossary"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <GlossaryView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Student Profile Modal */}
      <StudentProfileModal
        student={student}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Footer */}
      <footer className="bg-indigo-50 border-t border-indigo-200/80 py-6 mt-12 text-center text-xs text-indigo-700/80">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🇴🇲</span>
            <span className="font-bold text-indigo-900">وزارة التربية والتعليم - الصف الثامن • تقنية المعلومات</span>
          </div>
          <div className="flex items-center gap-4 text-indigo-600 font-medium">
            <span>الوحدة الأولى: تنظيم البيانات ومشاركتها عبر الإنترنت</span>
            <span>•</span>
            <span>تطبيق تعليمي تفاعلي 2024-2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
