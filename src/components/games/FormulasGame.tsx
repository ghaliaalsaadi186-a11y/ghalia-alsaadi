import React, { useState } from 'react';
import { Gamepad2, Sparkles, Check, RotateCcw, HelpCircle, Delete, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FormulaPuzzle {
  id: number;
  mission: string;
  targetFormula: string;
  tokens: string[];
  explanation: string;
}

const PUZZLES: FormulaPuzzle[] = [
  {
    id: 1,
    mission: 'اجمعي الخلايا غير المتجاورة من E4:E9 ومن G4:G9 لحساب الورق والبلاستيك:',
    targetFormula: '=SUM(E4:E9,G4:G9)',
    tokens: ['=SUM(', 'E4:E9', ',', 'G4:G9', ')', 'AVERAGE(', ':', '+'],
    explanation: 'تُفصل النطاقات غير المتجاورة باستخدام الفاصلة `,` داخل دالة الجمع SUM.'
  },
  {
    id: 2,
    mission: 'صيغة دالة IF: إذا كان المجموع في L4 أكبر من 45 يعرض "عال" وإلا "يحتاج إلى تحسين":',
    targetFormula: '=IF(L4>45,"عال","يحتاج إلى تحسين")',
    tokens: ['=IF(', 'L4>45', ',', '"عال"', ',', '"يحتاج إلى تحسين"', ')', 'AND(', '<45'],
    explanation: 'دالة IF تفحص الشرط وتعيد قيمة الصواب ثم قيمة الخطأ بين علامتي تنصيص.'
  },
  {
    id: 3,
    mission: 'صيغة دالة LEFT لاستخراج أول 6 أحرف من الخلية B4:',
    targetFormula: '=LEFT(B4,6)',
    tokens: ['=LEFT(', 'B4', ',', '6', ')', 'RIGHT(', '4', ':'],
    explanation: 'دالة LEFT تأخذ مرجع الخلية B4 وعدد الأحرف 6.'
  },
  {
    id: 4,
    mission: 'صيغة حساب الزيادة السنوية في نموذج النفايات في الخلية D3:',
    targetFormula: '=B3*(1+C3/100)',
    tokens: ['=B3*(1+C3/100)', '=B3*C3', '=B3+10', '=D3'],
    explanation: 'المعادلة =B3*(1+C3/100) تضيف القيمة الأصلية للزيادة معاً.'
  }
];

export const FormulasGame: React.FC<{ onScoreUpdate?: (points: number) => void }> = ({ onScoreUpdate }) => {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [builtTokens, setBuiltTokens] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentPuzzle = PUZZLES[puzzleIndex];

  const handleAddToken = (tok: string) => {
    if (feedback) return;
    setBuiltTokens(prev => [...prev, tok]);
  };

  const handleRemoveToken = (index: number) => {
    if (feedback) return;
    setBuiltTokens(prev => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setBuiltTokens([]);
    setFeedback(null);
  };

  const handleCheck = () => {
    const constructed = builtTokens.join('');
    const isCorrect = constructed === currentPuzzle.targetFormula;

    if (isCorrect) {
      const addedPoints = 25;
      setScore(s => s + addedPoints);
      setFeedback({ isCorrect: true, text: 'أحسنتِ صنعاً! تم تركيب الصيغة بدقة واحتراف (+25 نقطة)' });
      if (onScoreUpdate) onScoreUpdate(addedPoints);

      setTimeout(() => {
        setFeedback(null);
        setBuiltTokens([]);
        if (puzzleIndex + 1 < PUZZLES.length) {
          setPuzzleIndex(p => p + 1);
        } else {
          setIsCompleted(true);
          confetti({ particleCount: 70, spread: 70 });
        }
      }, 1500);
    } else {
      setFeedback({ isCorrect: false, text: 'الصيغة غير مكتملة أو تحتوي على رمز غير صحيح. حاولي مجدداً.' });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-sky-200 shadow-sm p-6 max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧩</span>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">
              لعبة: مهندسة الدوال الذكية
            </h4>
            <span className="text-[11px] text-sky-600 font-semibold">
              ركبي أجزاء الصيغة الرياضية والمنطقية الصحيحة
            </span>
          </div>
        </div>
        <div className="text-xs font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-lg border border-amber-200 font-mono">
          {score} نقطة
        </div>
      </div>

      {isCompleted ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
            🌟
          </div>
          <h3 className="text-xl font-black text-slate-800">
            أنتِ مهندسة دوال خبيرة! حققتِ {score} نقطة
          </h3>
          <p className="text-xs text-slate-600">
            أتقنتِ تركيب كافة صيغ SUM, IF, LEFT ومعادلات النماذج الحاسوبية.
          </p>
          <button
            onClick={() => {
              setPuzzleIndex(0);
              setScore(0);
              setBuiltTokens([]);
              setFeedback(null);
              setIsCompleted(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة اللعب</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Mission Box */}
          <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200 space-y-1">
            <span className="text-[11px] font-bold text-sky-800 uppercase">
              اللغز {puzzleIndex + 1} من {PUZZLES.length}
            </span>
            <p className="text-sm font-bold text-slate-800">
              {currentPuzzle.mission}
            </p>
          </div>

          {/* Formula Construction Sandbox */}
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 min-h-[60px] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-400 font-mono font-bold text-sm">fx:</span>
              {builtTokens.length === 0 ? (
                <span className="text-slate-500 text-xs italic">انقري على الرموز في الأسفل لتركيب الصيغة...</span>
              ) : (
                builtTokens.map((tok, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRemoveToken(idx)}
                    className="px-2 py-1 bg-sky-500/20 hover:bg-rose-500/30 text-sky-300 hover:text-rose-300 font-mono text-xs font-bold rounded border border-sky-500/40 transition-colors"
                    title="انقري للحذف"
                  >
                    {tok}
                  </button>
                ))
              )}
            </div>

            {builtTokens.length > 0 && (
              <button
                onClick={handleClear}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                <Delete className="w-3.5 h-3.5" />
                مسح
              </button>
            )}
          </div>

          {/* Available Tokens Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600">الرموز والأدوات المتاحة:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {currentPuzzle.tokens.map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddToken(tok)}
                  className="px-3 py-2 bg-slate-100 hover:bg-sky-50 hover:border-sky-300 text-slate-800 font-mono text-xs font-bold rounded-xl border border-slate-200 transition-all shadow-2xs active:scale-95"
                >
                  {tok}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-3 rounded-xl text-xs font-bold text-center border ${
              feedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {feedback.text}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleCheck}
              disabled={builtTokens.length === 0}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>تحقق من صحة الصيغة</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
