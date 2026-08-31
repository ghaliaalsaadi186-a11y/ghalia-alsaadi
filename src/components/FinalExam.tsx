import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Timer, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  FileCheck, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  Trophy 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COMPREHENSIVE_FINAL_EXAM } from '../data/lessonsData';
import { StudentProfile } from '../types';

interface FinalExamProps {
  student: StudentProfile;
  onExamComplete: (score: number, total: number, percentage: number) => void;
  onGoToCertificate: () => void;
}

export const FinalExam: React.FC<FinalExamProps> = ({
  student,
  onExamComplete,
  onGoToCertificate
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes

  const questions = COMPREHENSIVE_FINAL_EXAM;
  const totalQuestions = questions.length;
  const q = questions[currentIdx];

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (opt: any) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [q.id]: opt }));
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    let score = 0;
    questions.forEach(item => {
      if (userAnswers[item.id] === item.correctAnswer) {
        score += item.points;
      }
    });
    const totalMax = questions.reduce((acc, curr) => acc + curr.points, 0);
    const percentage = Math.round((score / totalMax) * 100);

    if (percentage >= 70) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
    onExamComplete(score, totalMax, percentage);
  };

  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = questions.filter(item => userAnswers[item.id] === item.correctAnswer).length;
  const totalScore = questions.reduce((acc, curr) => (userAnswers[curr.id] === curr.correctAnswer ? acc + curr.points : acc), 0);
  const maxScore = questions.reduce((acc, curr) => acc + curr.points, 0);
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      
      {/* Top Exam Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-amber-200">
            🎓
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              الاختبار الشامل للوحدة الأولى
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              تنظيم البيانات ومشاركتها عبر الإنترنت (16 سؤالاً شاملاً لكافة الدروس)
            </p>
          </div>
        </div>

        {!isSubmitted ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-mono font-bold text-xs sm:text-sm">
              <Timer className="w-4 h-4 text-amber-600" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={handleSubmitExam}
              disabled={answeredCount === 0}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>تسليم الاختبار ({answeredCount}/{totalQuestions})</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setUserAnswers({});
                setCurrentIdx(0);
                setTimeLeft(20 * 60);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>
            {percentage >= 70 && (
              <button
                onClick={onGoToCertificate}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
              >
                <Trophy className="w-4 h-4" />
                <span>عرض شهادة الإتقان والتفوق</span>
              </button>
            )}
          </div>
        )}
      </div>

      {isSubmitted ? (
        /* Result & Detailed Review View */
        <div className="space-y-6">
          
          {/* Performance Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 rounded-3xl shadow-md text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto text-4xl">
              {percentage >= 85 ? '👑' : percentage >= 70 ? '🌟' : '📝'}
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              {percentage >= 85 ? 'مبارك! حصلتِ على وسام التفوق والريادة' : percentage >= 70 ? 'أداء ممتاز، اجتزتِ الاختبار بنجاح!' : 'جهد طيب، راجعي المفاهيم وحاولي ثانية'}
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              حصلتِ على درجة <strong>{totalScore}</strong> من <strong>{maxScore}</strong> بنسبة <strong>{percentage}%</strong> ({correctCount} إجابات صحيحة من {totalQuestions}).
            </p>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 text-base">
              مراجعة وتفسير جميع أسئلة الاختبار:
            </h4>

            {questions.map((item, idx) => {
              const isCorrect = userAnswers[item.id] === item.correctAnswer;
              return (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {idx + 1}. {item.question}
                    </span>
                    {isCorrect ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 shrink-0">
                        صحيحة ✓
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 shrink-0">
                        غير صحيحة ✕
                      </span>
                    )}
                  </div>

                  <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl">
                    <p className="text-slate-600">
                      <strong>إجابتك:</strong> {userAnswers[item.id] || 'لم تتم الإجابة'}
                    </p>
                    <p className="text-emerald-800 font-bold">
                      <strong>الإجابة النموذجية:</strong> {item.correctAnswer}
                    </p>
                    <p className="text-slate-500 pt-1 border-t border-slate-200">
                      💡 <strong>التفسير:</strong> {item.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active Question Taking View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Question Box: Left 8 cols */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200 font-mono">
                  السؤال {currentIdx + 1} من {totalQuestions}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {q.points} نقاط
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {q.options?.map((opt, oIdx) => {
                  const isSelected = userAnswers[q.id] === opt;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full p-4 rounded-2xl border text-right text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-500/20' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Next/Prev */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>

              <button
                onClick={() => setCurrentIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
                disabled={currentIdx === totalQuestions - 1}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-30 flex items-center gap-1"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Grid Navigator: Right 4 cols */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-800 text-sm">
                خريطة الأسئلة
              </h4>
              <span className="text-xs font-bold text-slate-500">
                {answeredCount} / {totalQuestions} مجاب
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {questions.map((item, idx) => {
                const isCurrent = idx === currentIdx;
                const isFilled = userAnswers[item.id] !== undefined;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-xl font-mono text-xs font-bold transition-all border ${
                      isCurrent 
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs' 
                        : isFilled 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500"></div>
                <span>السؤال النشط حالياً</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></div>
                <span>سؤال تمت الإجابة عليه</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></div>
                <span>سؤال لم يُجب بعد</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
