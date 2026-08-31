import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ChevronLeft, 
  Rocket, 
  Gamepad2, 
  GraduationCap, 
  FileCheck, 
  Trophy 
} from 'lucide-react';
import { StudentProfile, ViewState } from '../types';
import { LESSONS_DATA } from '../data/lessonsData';

interface HomeDashboardProps {
  student: StudentProfile;
  onNavigate: (view: ViewState, lessonId?: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ student, onNavigate }) => {
  const completedCount = student.completedLessons.length;
  const totalLessons = LESSONS_DATA.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  // Find next unfinished lesson or first lesson
  const nextLesson = LESSONS_DATA.find(l => !student.completedLessons.includes(l.id)) || LESSONS_DATA[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      
      {/* Welcome & Progress Hero Card - Vibrant Palette */}
      <div className="bg-gradient-to-l from-indigo-600 via-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200/50">
        {/* Decorative Background Emojis/Graphics */}
        <div className="absolute -left-6 -bottom-6 text-[150px] opacity-15 select-none pointer-events-none">
          📊
        </div>
        <div className="absolute left-1/3 -top-10 text-[100px] opacity-10 select-none pointer-events-none">
          ✨
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-xs">
              <span>🇴🇲 سلطنة عُمان • تقنية المعلومات</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              مرحباً بكِ يا <span className="text-amber-300 underline decoration-amber-300/60 decoration-wavy">{student.name}</span> في رحلة البيانات وExcel! 👋
            </h1>

            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed opacity-95">
              سنتعلم معاً كيف نحول البيانات إلى نماذج ذكية ورسوم بيانية ممتعة باستخدام Google Forms وExcel، من خلال <strong>الوحدة الأولى: تنظيم البيانات ومشاركتها</strong>.
            </p>

            {/* Quick action button & status in Hero */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('lesson', nextLesson.id)}
                className="px-7 py-3 bg-white text-indigo-700 rounded-2xl font-black text-sm shadow-lg shadow-indigo-900/20 hover:scale-105 hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Rocket className="w-4 h-4 text-indigo-600 fill-indigo-500" />
                <span>{completedCount === totalLessons ? 'مراجعة الدروس' : 'استكمال الوحدة الأولى 🚀'}</span>
              </button>

              <div className="flex items-center gap-3 text-xs bg-indigo-900/30 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-mono text-sm">{student.xp}</span>
                  <span className="text-white/80 font-normal">XP</span>
                </div>
                <div className="h-3 w-px bg-white/30" />
                <div className="flex items-center gap-1 text-white font-bold">
                  <span>المستوى {student.level}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Circular/Linear Card */}
          <div className="bg-white/15 backdrop-blur-md border border-white/25 p-6 rounded-3xl shrink-0 text-center space-y-3 min-w-[210px] shadow-lg">
            <span className="text-xs text-indigo-100 font-bold block">التقدم الإجمالي بالوحدة</span>
            <div className="text-4xl font-black font-mono text-white tracking-tight">
              {progressPercent}%
            </div>
            
            <div className="w-full bg-indigo-950/40 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-xs text-indigo-100 font-medium block">
              {completedCount} من {totalLessons} دروس مكتملة
            </span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Action Grid - Vibrant Palette */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('games')}
          className="p-5 rounded-3xl bg-white border-2 border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-right group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-3 shadow-xs group-hover:scale-110 transition-transform">
            🎮
          </div>
          <h4 className="font-black text-slate-800 text-base group-hover:text-purple-700 transition-colors">صالة الألعاب</h4>
          <p className="text-xs text-slate-500 mt-0.5">3 تحديات تفاعلية</p>
        </button>

        <button
          onClick={() => onNavigate('final-exam')}
          className="p-5 rounded-3xl bg-white border-2 border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-right group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-3 shadow-xs group-hover:scale-110 transition-transform">
            🎓
          </div>
          <h4 className="font-black text-slate-800 text-base group-hover:text-amber-700 transition-colors">الاختبار الشامل</h4>
          <p className="text-xs text-slate-500 mt-0.5">16 سؤالاً مع التصحيح</p>
        </button>

        <button
          onClick={() => onNavigate('glossary')}
          className="p-5 rounded-3xl bg-white border-2 border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-right group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl mb-3 shadow-xs group-hover:scale-110 transition-transform">
            📖
          </div>
          <h4 className="font-black text-slate-800 text-base group-hover:text-sky-700 transition-colors">معجم المصطلحات</h4>
          <p className="text-xs text-slate-500 mt-0.5">بطاقات ومفاهيم الكتاب</p>
        </button>

        <button
          onClick={() => onNavigate('achievements')}
          className="p-5 rounded-3xl bg-white border-2 border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-right group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center text-2xl mb-3 shadow-xs group-hover:scale-110 transition-transform">
            🏆
          </div>
          <h4 className="font-black text-slate-800 text-base group-hover:text-pink-700 transition-colors">الشهادة والأوسمة</h4>
          <p className="text-xs text-slate-500 mt-0.5">طباعة شهادة الإتقان</p>
        </button>
      </div>

      {/* Unit Lessons Roadmap */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-800">
              خريطة دروس الوحدة الأولى (Unit Curriculum)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              تنظيم البيانات ومشاركتها عبر الإنترنت من خلال النماذج وExcel
            </p>
          </div>
          <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            البيانات في الإنترنت وExcel
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {LESSONS_DATA.map((lesson, idx) => {
            const isCompleted = student.completedLessons.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className={`bg-white rounded-3xl border-2 transition-all p-6 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 ${
                  isCompleted 
                    ? 'border-emerald-200 bg-gradient-to-b from-emerald-50/30 to-white' 
                    : 'border-slate-100 hover:border-indigo-200'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      الدرس {idx + 1}
                    </span>

                    {isCompleted ? (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>مكتمل بنجاح</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 font-mono">
                        +75 XP
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {lesson.subtitle || lesson.description || ''}
                    </p>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 block">أبرز المحاور والمهارات:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(lesson.learningObjectives || lesson.objectives || []).slice(0, 2).map((obj, oIdx) => (
                        <span key={oIdx} className="text-[11px] bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg">
                          ✓ {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {lesson.duration || '45 دقيقة'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      {lesson.slides.length} محاور
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate('lesson', lesson.id)}
                    className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                    }`}
                  >
                    <span>{isCompleted ? 'مراجعة الدرس' : 'ابدئي الدرس'}</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
