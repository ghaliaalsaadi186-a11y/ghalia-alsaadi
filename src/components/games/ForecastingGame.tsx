import React, { useState } from 'react';
import { Gamepad2, Sparkles, Check, RotateCcw, HelpCircle, Layers, Scale } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SorterItem {
  id: number;
  text: string;
  category: 'use' | 'limit';
}

const ITEMS: SorterItem[] = [
  { id: 1, text: 'اختبار القرارات وسيناريوهات دون التعرض لأخطار واقعية', category: 'use' },
  { id: 2, text: 'توقع كمية النفايات أو النمو السكاني في السنوات القادمة', category: 'use' },
  { id: 3, text: 'توصيل الأفكار المعقدة عبر الرسوم والمخططات البيانية', category: 'use' },
  { id: 4, text: 'إذا كانت البيانات غير صحيحة فستكون التنبؤات غير موثوقة', category: 'limit' },
  { id: 5, text: 'تبسيط العمليات المعقدة قد يغفل تفاصيل مهمة في الحسابات', category: 'limit' },
  { id: 6, text: 'الاعتماد على افتراضات قد لا تتوافق دائماً مع سيناريوهات الواقع', category: 'limit' }
];

export const ForecastingGame: React.FC<{ onScoreUpdate?: (points: number) => void }> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentItem = ITEMS[currentIndex];

  const handleClassify = (chosenCat: 'use' | 'limit') => {
    if (feedback) return;
    const isCorrect = chosenCat === ITEMS[currentIndex].category;

    if (isCorrect) {
      const added = 20;
      setScore(s => s + added);
      setFeedback({ isCorrect: true, text: 'تصنيف دقيق وصحيح! (+20 نقطة)' });
      if (onScoreUpdate) onScoreUpdate(added);
    } else {
      setFeedback({
        isCorrect: false,
        text: `غير صحيح. هذه العبارة تندرج تحت: ${ITEMS[currentIndex].category === 'use' ? 'استخدامات النماذج الحاسوبية' : 'قيود النماذج الحاسوبية'}`
      });
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < ITEMS.length) {
        setCurrentIndex(c => c + 1);
      } else {
        setIsCompleted(true);
        confetti({ particleCount: 70, spread: 70 });
      }
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-6 max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔮</span>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">
              لعبة: مستكشفة المستقبل والتنبؤ
            </h4>
            <span className="text-[11px] text-indigo-600 font-semibold">
              فرز بطاقات "استخدامات النماذج الحاسوبية" مقابل "القيود"
            </span>
          </div>
        </div>
        <div className="text-xs font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-lg border border-amber-200 font-mono">
          {score} نقطة
        </div>
      </div>

      {isCompleted ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>
          <h3 className="text-xl font-black text-slate-800">
            أحسنتِ يا بطلة التنبؤ! حققتِ {score} نقطة
          </h3>
          <p className="text-xs text-slate-600">
            لديكِ فهم عميق لاستخدامات النماذج الحاسوبية وكيفية تجنب قيودها ومخاطرها.
          </p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setFeedback(null);
              setIsCompleted(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة اللعب</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          
          {/* Card to sort */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50/50 p-6 rounded-2xl border border-indigo-200 text-center space-y-2 min-h-[140px] flex flex-col justify-center">
            <span className="text-[10px] font-bold text-indigo-700 uppercase bg-indigo-100 px-2 py-0.5 rounded-md inline-block mx-auto">
              بطاقة {currentIndex + 1} من {ITEMS.length}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              "{ITEMS[currentIndex].text}"
            </h3>
          </div>

          {/* Action Choice Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleClassify('use')}
              disabled={feedback !== null}
              className="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm text-center transition-all shadow-2xs hover:scale-[1.02] active:scale-95"
            >
              <div className="text-2xl mb-1">✅</div>
              <span>استخدامات النماذج (Uses)</span>
              <span className="block text-[10px] text-emerald-700 font-normal mt-0.5">تنبؤ، اختبار قرارات، تحسين</span>
            </button>

            <button
              onClick={() => handleClassify('limit')}
              disabled={feedback !== null}
              className="p-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-950 font-bold text-xs sm:text-sm text-center transition-all shadow-2xs hover:scale-[1.02] active:scale-95"
            >
              <div className="text-2xl mb-1">⚠️</div>
              <span>قيود النماذج (Limitations)</span>
              <span className="block text-[10px] text-rose-700 font-normal mt-0.5">دقة بيانات، تبسيط، افتراضات</span>
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-3 rounded-xl text-xs font-bold text-center border ${
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
