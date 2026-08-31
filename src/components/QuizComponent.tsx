import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, HelpCircle, Award, RotateCcw, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';

interface QuizComponentProps {
  questions: QuizQuestion[];
  lessonTitle: string;
  lessonId: string;
  onQuizComplete: (score: number, total: number) => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  questions,
  lessonTitle,
  lessonId,
  onQuizComplete
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, any>>({});
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  const q = questions[currentIdx];
  const totalQuestions = questions.length;
  const isAnswered = selectedAnswers[q.id] !== undefined;
  const hasRevealed = showFeedback[q.id];

  const handleSelectOption = (opt: any) => {
    if (hasRevealed) return;
    setSelectedAnswers(prev => ({ ...prev, [q.id]: opt }));
  };

  const handleCheckAnswer = () => {
    if (!isAnswered) return;
    setShowFeedback(prev => ({ ...prev, [q.id]: true }));

    // If correct trigger subtle confetti
    if (selectedAnswers[q.id] === q.correctAnswer) {
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Finish Quiz
      setIsFinished(true);
      let calculatedScore = 0;
      questions.forEach(item => {
        if (selectedAnswers[item.id] === item.correctAnswer) {
          calculatedScore += item.points;
        }
      });
      const totalPossible = questions.reduce((acc, curr) => acc + curr.points, 0);
      confetti({ particleCount: 80, spread: 70 });
      onQuizComplete(calculatedScore, totalPossible);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setShowFeedback({});
    setCurrentIdx(0);
    setIsFinished(false);
  };

  // Score summary
  const correctCount = questions.filter(item => selectedAnswers[item.id] === item.correctAnswer).length;
  const totalScore = questions.reduce((acc, curr) => (selectedAnswers[curr.id] === curr.correctAnswer ? acc + curr.points : acc), 0);
  const maxScore = questions.reduce((acc, curr) => acc + curr.points, 0);
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
      
      {/* Quiz Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
            اختبار قصير تفاعلي
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
            {lessonTitle}
          </h3>
        </div>

        {!isFinished && (
          <div className="text-left font-mono">
            <span className="text-xs font-bold text-slate-400">سؤال</span>
            <div className="text-sm font-black text-emerald-700">
              {currentIdx + 1} / {totalQuestions}
            </div>
          </div>
        )}
      </div>

      {/* Finished Summary View */}
      {isFinished ? (
        <div className="text-center py-6 space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto text-4xl shadow-lg shadow-amber-200">
            🏆
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">
              {percentage >= 80 ? 'إنجاز رائع ومتميز!' : percentage >= 50 ? 'نتيجة جيدة، أحسنتِ!' : 'تحتاجين للمزيد من المراجعة'}
            </h3>
            <p className="text-sm text-slate-600">
              أجبتِ بشكل صحيح على <strong>{correctCount}</strong> من أصل <strong>{totalQuestions}</strong> أسئلة ({percentage}%).
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-900 font-bold text-sm border border-emerald-200 font-mono">
              مجموع النقاط المكتسبة: +{totalScore} XP
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {q.question}
            </h4>
          </div>

          {/* Answer Options */}
          <div className="space-y-2.5">
            {q.options?.map((opt, oIdx) => {
              const isSelected = selectedAnswers[q.id] === opt;
              const isCorrectOpt = opt === q.correctAnswer;
              
              let style = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50/50 hover:border-emerald-200';
              
              if (hasRevealed) {
                if (isCorrectOpt) {
                  style = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-2 ring-emerald-500/20';
                } else if (isSelected && !isCorrectOpt) {
                  style = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                } else {
                  style = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={hasRevealed}
                  className={`w-full p-3.5 rounded-2xl border text-right text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {hasRevealed && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {hasRevealed && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout once revealed */}
          {hasRevealed && (
            <div className={`p-4 rounded-2xl text-xs sm:text-sm border leading-relaxed animate-fade-in ${
              selectedAnswers[q.id] === q.correctAnswer
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-1">
                    {selectedAnswers[q.id] === q.correctAnswer ? 'إجابة صحيحة ومتقنة!' : 'توضيح وتفسير الإجابة الصحيحة:'}
                  </span>
                  <p>{q.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions Bottom Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
            >
              السابق
            </button>

            {!hasRevealed ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!isAnswered}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>تحقق من الإجابة</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>{currentIdx + 1 === totalQuestions ? 'عرض النتيجة النهائية' : 'السؤال التالي'}</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
