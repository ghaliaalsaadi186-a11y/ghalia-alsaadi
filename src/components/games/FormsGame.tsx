import React, { useState, useEffect } from 'react';
import { Gamepad2, Timer, Sparkles, Check, X, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CardItem {
  id: number;
  scenario: string;
  correctType: string;
  hint: string;
}

const GAME_CARDS: CardItem[] = [
  { id: 1, scenario: 'جمع أسماء الطالبات في الاستطلاع', correctType: 'إجابة قصيرة (Short answer)', hint: 'معلومة نصية مقتضبة وبسيطة' },
  { id: 2, scenario: 'اختيار شعبة واحدة من (الثامن 1 أو الثامن 2)', correctType: 'خيارات متعددة (Multiple choice)', hint: 'اختيار بديل واحد فقط من قائمة' },
  { id: 3, scenario: 'تقييم مدى الدراية بالمواد بـ 5 نجوم', correctType: 'تقييم (Rating)', hint: 'رموز نجوم لإظهار مستوى الرضا أو المعرفة' },
  { id: 4, scenario: 'تحديد عدد الأيام من (0 أبداً إلى 7 دائماً)', correctType: 'مقياس خطي (Linear scale)', hint: 'مقياس رقمي متدرج مع تسميات' },
  { id: 5, scenario: 'كتابة مقترحات تفصيلية لتحسين التدوير', correctType: 'فقرة (Paragraph)', hint: 'إجابات نصية مطولة' },
  { id: 6, scenario: 'إلزام الطالبة بإدخال أرقام بين 0 و 70 فقط', correctType: 'التحقق من صحة الرد (Validation)', hint: 'قاعدة Response validation لمنع الخطأ' }
];

const QUESTION_TYPES = [
  'إجابة قصيرة (Short answer)',
  'خيارات متعددة (Multiple choice)',
  'تقييم (Rating)',
  'مقياس خطي (Linear scale)',
  'فقرة (Paragraph)',
  'التحقق من صحة الرد (Validation)'
];

export const FormsGame: React.FC<{ onScoreUpdate?: (points: number) => void }> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  useEffect(() => {
    if (gameOver || timeLeft <= 0) {
      if (timeLeft <= 0) setGameOver(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  const handleChoice = (type: string) => {
    if (feedback || gameOver) return;

    setSelectedAnswer(type);
    const card = GAME_CARDS[currentIndex];
    const isCorrect = type === card.correctType;

    if (isCorrect) {
      const addedPoints = 20;
      setScore(s => s + addedPoints);
      setFeedback({ isCorrect: true, text: 'إجابة رائعة وصحيحة! (+20 نقطة)' });
      if (onScoreUpdate) onScoreUpdate(addedPoints);
    } else {
      setFeedback({ isCorrect: false, text: `إجابة غير دقيقة. النوع الأنسب هو: ${card.correctType}` });
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      if (currentIndex + 1 < GAME_CARDS.length) {
        setCurrentIndex(c => c + 1);
      } else {
        setGameOver(true);
        confetti({ particleCount: 70, spread: 70 });
      }
    }, 1200);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  const currentCard = GAME_CARDS[currentIndex];

  return (
    <div className="bg-white rounded-2xl border border-purple-200 shadow-sm p-6 max-w-xl mx-auto space-y-5">
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">
              لعبة: تحدي منشئة النماذج الذكية
            </h4>
            <span className="text-[11px] text-purple-600 font-semibold">
              طابقي الموقف بنوع السؤال الأنسب في Google Forms
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-mono font-bold bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-200">
            <Timer className="w-3.5 h-3.5" />
            <span>{timeLeft} ثانية</span>
          </div>
          <div className="text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 font-mono">
            {score} نقطة
          </div>
        </div>
      </div>

      {gameOver ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>
          <h3 className="text-xl font-black text-slate-800">
            انتهى التحدي! نتيجتك النهائية: {score} نقطة
          </h3>
          <p className="text-xs text-slate-600">
            {score >= 80 ? 'أداء باهر! لقد أتقنتِ أنواع الأسئلة وقواعد التحقق بامتياز.' : 'أحسنتِ المحاولة! يمكنكِ إعادة التحدي لتحقيق العلامة الكاملة.'}
          </p>
          <button
            onClick={handleRestart}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة اللعب</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Question Scenario Card */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50/40 p-5 rounded-2xl border border-purple-200 text-center space-y-2">
            <span className="text-[11px] font-bold text-purple-700 uppercase bg-purple-100/80 px-2 py-0.5 rounded-md">
              السؤال {currentIndex + 1} من {GAME_CARDS.length}
            </span>
            <h3 className="text-lg font-black text-slate-900 leading-snug">
              "{currentCard.scenario}"
            </h3>
            <p className="text-xs text-slate-500">
              💡 تلميح: {currentCard.hint}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {QUESTION_TYPES.map((type, idx) => {
              let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:border-purple-300';
              if (selectedAnswer === type) {
                btnStyle = feedback?.isCorrect 
                  ? 'bg-emerald-500 text-white border-emerald-600 font-bold' 
                  : 'bg-rose-500 text-white border-rose-600 font-bold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleChoice(type)}
                  disabled={feedback !== null}
                  className={`p-3 rounded-xl text-right text-xs font-bold border transition-all ${btnStyle}`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {/* Feedback popup */}
          {feedback && (
            <div className={`p-3 rounded-xl text-xs font-bold text-center border animate-fade-in ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {feedback.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
