import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  BookOpen, 
  FlaskConical, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Award,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LessonData, StudentProfile } from '../types';
import { InteractiveSlideDeck } from './InteractiveSlideDeck';
import { FormSimulator } from './simulators/FormSimulator';
import { SpreadsheetSimulator } from './simulators/SpreadsheetSimulator';
import { ModelForecastingSimulator } from './simulators/ModelForecastingSimulator';
import { ProjectSimulator } from './simulators/ProjectSimulator';
import { QuizComponent } from './QuizComponent';

interface LessonViewProps {
  lesson: LessonData;
  student: StudentProfile;
  onBackToHome: () => void;
  onLessonComplete: (lessonId: string, earnedXp: number) => void;
  onQuizComplete: (lessonId: string, score: number, total: number) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  student,
  onBackToHome,
  onLessonComplete,
  onQuizComplete
}) => {
  const [activeTab, setActiveTab] = useState<'slides' | 'simulator' | 'quiz'>('slides');
  const [simulatorCompleted, setSimulatorCompleted] = useState(false);

  const isLessonFinished = student.completedLessons.includes(lesson.id);

  const handleSimulatorTaskDone = () => {
    setSimulatorCompleted(true);
    if (!isLessonFinished) {
      onLessonComplete(lesson.id, 50);
    }
  };

  const lessonQuiz = lesson.quizQuestions || lesson.quiz || [];
  const lessonObjectives = lesson.learningObjectives || lesson.objectives || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      
      {/* Top Breadcrumb & Lesson Meta Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBackToHome}
            className="w-11 h-11 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title="العودة للرئيسية"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                الوحدة الأولى • {lesson.id.replace('lesson-', 'الدرس ')}
              </span>
              {isLessonFinished && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  مكتمل بنجاح
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              {lesson.title}
            </h2>
          </div>
        </div>

        {/* Tab Navigation within the Lesson */}
        <div className="flex items-center bg-slate-100/90 p-1.5 rounded-2xl text-xs sm:text-sm font-bold gap-1">
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'slides'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>الشرح والشرائح</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                : 'text-slate-600 hover:text-purple-600'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>المختبر التفاعلي</span>
          </button>

          {lessonQuiz.length > 0 && (
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>اختبار الدرس</span>
            </button>
          )}
        </div>
      </div>

      {/* Lesson Objectives Summary Box */}
      {lessonObjectives.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50/60 to-white p-4.5 rounded-3xl border border-indigo-200 text-xs text-indigo-950 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-black text-indigo-900">🎯 أهداف التعلم لهذا الدرس:</span>
            <div className="flex items-center gap-2 flex-wrap text-slate-700">
              {lessonObjectives.map((obj, i) => (
                <span key={i} className="bg-white px-3 py-1 rounded-xl border border-indigo-100 font-medium shadow-2xs">
                  • {obj}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Body Based on Tab */}
      <div className="pt-2">
        <AnimatePresence mode="wait">
          {activeTab === 'slides' && (
            <motion.div
              key="slides"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <InteractiveSlideDeck
                slides={lesson.slides}
                lessonTitle={lesson.title}
                onComplete={() => {
                  if (!isLessonFinished) onLessonComplete(lesson.id, 40);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'simulator' && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {lesson.id === 'lesson-1-1' && <FormSimulator onCompleteTask={handleSimulatorTaskDone} />}
              {lesson.id === 'lesson-1-2' && <SpreadsheetSimulator onCompleteTask={handleSimulatorTaskDone} />}
              {lesson.id === 'lesson-1-3' && <ModelForecastingSimulator onCompleteTask={handleSimulatorTaskDone} />}
              {lesson.id === 'lesson-1-4' && <ProjectSimulator onCompleteTask={handleSimulatorTaskDone} />}
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <QuizComponent
                questions={lessonQuiz}
                lessonTitle={lesson.title}
                lessonId={lesson.id}
                onQuizComplete={(score, total) => {
                  onQuizComplete(lesson.id, score, total);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
