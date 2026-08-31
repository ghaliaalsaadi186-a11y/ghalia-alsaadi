import React, { useState } from 'react';
import { 
  Table, 
  Check, 
  HelpCircle, 
  Sparkles, 
  Calculator, 
  FunctionSquare, 
  Info, 
  AlertCircle, 
  ArrowRightLeft, 
  Scissors, 
  Percent, 
  ChevronDown, 
  Play,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SpreadsheetSimulator: React.FC<{ onCompleteTask?: () => void }> = ({ onCompleteTask }) => {
  const [selectedCell, setSelectedCell] = useState<string>('I4');
  const [formulaInput, setFormulaInput] = useState<string>('=SUM(E4:E9,G4:G9)');
  const [formulaResult, setFormulaResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [solvedExercises, setSolvedExercises] = useState<number[]>([]);

  // Textbook Student Data rows 4 to 9
  const [studentsData, setStudentsData] = useState([
    { id: 4, name: 'أحمد', grade: 'الثامن 1', c: 5, d: 4, plastic: 29, metals: 8, paper: 32, glass: 11, totalSum: 80, ifLevel: 'عال', ifAndAwareness: 'جيدة' },
    { id: 5, name: 'خالد', grade: 'الثامن 2', c: 4, d: 4, plastic: 16, metals: 6, paper: 17, glass: 3, totalSum: 42, ifLevel: 'يحتاج إلى تحسين', ifAndAwareness: 'جيدة' },
    { id: 6, name: 'فيصل', grade: 'الثامن 1', c: 2, d: 3, plastic: 14, metals: 3, paper: 13, glass: 2, totalSum: 32, ifLevel: 'يحتاج إلى تحسين', ifAndAwareness: 'تحتاج إلى تحسين' },
    { id: 7, name: 'سلطان', grade: 'الثامن 1', c: 4, d: 2, plastic: 27, metals: 7, paper: 28, glass: 6, totalSum: 68, ifLevel: 'عال', ifAndAwareness: 'جيدة' },
    { id: 8, name: 'علي', grade: 'الثامن 2', c: 2, d: 1, plastic: 12, metals: 1, paper: 15, glass: 2, totalSum: 30, ifLevel: 'يحتاج إلى تحسين', ifAndAwareness: 'تحتاج إلى تحسين' },
    { id: 9, name: 'هيثم', grade: 'الثامن 2', c: 3, d: 5, plastic: 24, metals: 6, paper: 31, glass: 7, totalSum: 68, ifLevel: 'عال', ifAndAwareness: 'جيدة' },
  ]);

  // Guided Exercises from the Textbook
  const EXERCISES = [
    {
      id: 0,
      title: 'حساب مجموع الخلايا غير المتجاورة (الورق والبلاستيك)',
      instruction: 'اكتبي صيغة دالة SUM لحساب إجمالي قطع البلاستيك والمنتجات الورقية في الخلية I4.',
      expectedFormula: '=SUM(E4:E9,G4:G9)',
      targetCell: 'I4',
      correctValue: '258',
      explanation: 'نستخدم الفاصلة `,` لجمع نطاقين متباعدين: نطاق البلاستيك (E4:E9) ونطاق الورق (G4:G9).'
    },
    {
      id: 1,
      title: 'حساب النسبة المئوية لإعادة تدوير البلاستيك',
      instruction: 'اكتبي صيغة حساب نسبة البلاستيك (E12) من الإجمالي الكلي (I12) في الخلية K4.',
      expectedFormula: '=E12/I12',
      targetCell: 'K4',
      correctValue: '38.13%',
      explanation: 'النسبة المئوية = قيمة الجزء مقسومة على الإجمالي الكلي (122 / 320 = 0.38125 أي 38.13%).'
    },
    {
      id: 2,
      title: 'دالة IF المنطقية: تحديد مستوى الإسهام البيئي',
      instruction: 'طبقي دالة IF في الخلية M4: إذا تجاوز الإسهام 45 يعرض "عال"، وإلا "يحتاج إلى تحسين".',
      expectedFormula: '=IF(L4>45,"عال","يحتاج إلى تحسين")',
      targetCell: 'M4',
      correctValue: 'عال',
      explanation: 'بما أن مجموع أحمد في L4 هو 80 وهو أكبر من 45، فإن النتيجة تكون "عال".'
    },
    {
      id: 3,
      title: 'دالة AND مع IF: تقييم حالة الوعي البيئي',
      instruction: 'طبقي دالة AND داخل IF في N4: إذا كان البلاستيك > 15 والمعادن > 5 يعرض "جيدة" وإلا "تحتاج إلى تحسين".',
      expectedFormula: '=IF(AND(E4>15,F4>5),"جيدة","تحتاج إلى تحسين")',
      targetCell: 'N4',
      correctValue: 'جيدة',
      explanation: 'للطالب أحمد: البلاستيك (29 > 15) صواب، والمعادن (8 > 5) صواب، إذن يتحقق كلا الشرطين وتظهر "جيدة".'
    },
    {
      id: 4,
      title: 'دالة LEFT النصية: استخراج اسم الصف دون رقم الشعبة',
      instruction: 'اكتبي دالة LEFT في الخلية C15 لاستخراج أول 6 أحرف من الخلية B4 ("الثامن 1").',
      expectedFormula: '=LEFT(B4,6)',
      targetCell: 'C15',
      correctValue: 'الثامن',
      explanation: 'الدالة `=LEFT(B4,6)` تقرأ أول 6 خانات من النص فتعطي كلمة "الثامن".'
    }
  ];

  const currentEx = EXERCISES[activeExerciseIndex];

  // Run or Evaluate Formula
  const handleExecuteFormula = () => {
    setErrorMsg(null);
    const clean = formulaInput.trim().toUpperCase().replace(/\s+/g, '');

    // Check for Arabic letters
    if (/[\u0600-\u06FF]/.test(formulaInput.split('"').filter((_, i) => i % 2 === 0).join(''))) {
      setErrorMsg('خطأ #NAME? - لا يقبل التطبيق أسماء الدوال بالعربية، يرجى كتابة الدوال بالإنجليزية (مثل SUM, IF, AND, LEFT).');
      return;
    }

    // Evaluate matching with current exercise
    const expectedClean = currentEx.expectedFormula.toUpperCase().replace(/\s+/g, '');
    
    if (clean === expectedClean || clean === expectedClean.replace(/=/g, '')) {
      setFormulaResult(currentEx.correctValue);
      if (!solvedExercises.includes(activeExerciseIndex)) {
        const nextSolved = [...solvedExercises, activeExerciseIndex];
        setSolvedExercises(nextSolved);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        if (nextSolved.length === EXERCISES.length && onCompleteTask) {
          onCompleteTask();
        }
      }
    } else {
      setErrorMsg(`الصيغة المدخلة غير مطابقة تماماً. المطلوب: ${currentEx.expectedFormula}`);
    }
  };

  const handleApplyPreset = (formula: string, cell: string) => {
    setFormulaInput(formula);
    setSelectedCell(cell);
    setErrorMsg(null);
    setFormulaResult(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Exercise Mission Selector Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-black text-sm">
              fx
            </span>
            <h4 className="font-extrabold text-slate-800 text-base sm:text-lg">
              مختبر تحليل البيانات وصياغة الدوال (Google Sheets & Excel Lab)
            </h4>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            تم إنجاز {solvedExercises.length} من {EXERCISES.length} تدريبات
          </span>
        </div>

        {/* Exercises pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-2">
          {EXERCISES.map((ex, idx) => (
            <button
              key={ex.id}
              onClick={() => {
                setActiveExerciseIndex(idx);
                handleApplyPreset(ex.expectedFormula, ex.targetCell);
              }}
              className={`p-2.5 rounded-xl text-right text-xs font-bold transition-all border flex items-center justify-between ${
                activeExerciseIndex === idx
                  ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-xs'
                  : solvedExercises.includes(idx)
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="truncate">
                <span className="block font-mono text-[10px] text-slate-400">مهمة {idx + 1}</span>
                <span className="truncate">{ex.title}</span>
              </div>
              {solvedExercises.includes(idx) && (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Current Active Mission Description */}
        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wide">
              المهمة {activeExerciseIndex + 1}: {currentEx.title}
            </span>
            <p className="text-sm font-semibold text-slate-800">
              {currentEx.instruction}
            </p>
            <p className="text-xs text-slate-600">
              💡 {currentEx.explanation}
            </p>
          </div>
          <button
            onClick={() => handleApplyPreset(currentEx.expectedFormula, currentEx.targetCell)}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 self-center"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>كتابة الصيغة النموذجية</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Formula Bar Interface */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-xs overflow-hidden">
        
        {/* Fake Sheets Toolbar Header */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600 select-none">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-800">معدلات إعادة التدوير في الصف الثامن</span>
            <span className="text-slate-400">|</span>
            <span className="hidden sm:inline">ملف • تعديل • عرض • إدراج • تنسيق • بيانات • أدوات</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
              حفظ سحابي في Drive
            </span>
          </div>
        </div>

        {/* Live Formula Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex items-center gap-2">
          <div className="w-14 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-center font-bold text-xs text-slate-700">
            {selectedCell}
          </div>
          <span className="font-serif italic font-bold text-slate-400 text-sm px-1">fx</span>
          <input
            type="text"
            value={formulaInput}
            onChange={e => setFormulaInput(e.target.value)}
            placeholder="اكتبي الصيغة هنا (مثال: =SUM(E4:E9,G4:G9))"
            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500"
          />
          <button
            onClick={handleExecuteFormula}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>تنفيذ (Enter)</span>
          </button>
        </div>

        {/* Status / Output / Error Notification */}
        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 flex items-center gap-2 text-rose-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {formulaResult && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex items-center justify-between text-emerald-800 text-xs font-bold">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>صيغة صحيحة! النتيجة المحسوبة في الخلية {selectedCell}: <strong>{formulaResult}</strong></span>
            </div>
            <span className="text-[11px] text-emerald-600">أحسنتِ! تم تطبيق القاعدة بنجاح.</span>
          </div>
        )}

        {/* Interactive Data Table from Textbook */}
        <div className="overflow-x-auto max-h-[480px]">
          <table className="w-full text-xs text-right border-collapse select-none">
            <thead>
              {/* Row 2: Merged Title */}
              <tr className="bg-slate-200 text-slate-800 font-bold border-b border-slate-300 text-center">
                <th className="p-1 bg-slate-300 border-l border-slate-400 w-8 font-mono text-[10px]">2</th>
                <th colSpan={14} className="p-2 bg-emerald-100 text-emerald-950 font-black text-sm">
                  معدلات إعادة التدوير في الصف الثامن
                </th>
              </tr>
              {/* Row 3: Column Headers */}
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-center">
                <th className="p-1 bg-slate-200 border-l border-slate-300 font-mono text-[10px]">3</th>
                <th className="p-2 border-l border-slate-300 font-mono">A: اسم الطالب</th>
                <th className="p-2 border-l border-slate-300 font-mono">B: الصف</th>
                <th className="p-2 border-l border-slate-300 font-mono">C: التزام 1</th>
                <th className="p-2 border-l border-slate-300 font-mono">D: التزام 2</th>
                <th className="p-2 border-l border-slate-300 bg-purple-50 text-purple-900 font-mono">E: البلاستيك</th>
                <th className="p-2 border-l border-slate-300 bg-amber-50 text-amber-900 font-mono">F: المعادن</th>
                <th className="p-2 border-l border-slate-300 bg-purple-50 text-purple-900 font-mono">G: الورق</th>
                <th className="p-2 border-l border-slate-300 bg-amber-50 text-amber-900 font-mono">H: الزجاج</th>
                <th className="p-2 border-l border-slate-300 bg-sky-100 text-sky-950 font-mono">I: إجمالي الورق والبلاستيك</th>
                <th className="p-2 border-l border-slate-300 bg-teal-100 text-teal-950 font-mono">J: إجمالي المعادن والزجاج</th>
                <th className="p-2 border-l border-slate-300 bg-indigo-100 text-indigo-950 font-mono">K: نسبة البلاستيك %</th>
                <th className="p-2 border-l border-slate-300 font-mono">L: إجمالي الإسهام</th>
                <th className="p-2 border-l border-slate-300 bg-emerald-100 text-emerald-950 font-mono">M: مستوى الإسهام (IF)</th>
                <th className="p-2 bg-blue-100 text-blue-950 font-mono">N: الوعي البيئي (AND+IF)</th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((s, idx) => {
                const rowNum = idx + 4;
                return (
                  <tr key={s.id} className="border-b border-slate-200 hover:bg-slate-50/80">
                    <td className="p-1.5 bg-slate-100 text-center font-mono text-[10px] text-slate-500 border-l border-slate-200">
                      {rowNum}
                    </td>
                    <td className="p-2 font-bold text-slate-800 border-l border-slate-200">{s.name}</td>
                    <td className="p-2 text-slate-600 border-l border-slate-200">{s.grade}</td>
                    <td className="p-2 text-center text-slate-500 border-l border-slate-200">{s.c}</td>
                    <td className="p-2 text-center text-slate-500 border-l border-slate-200">{s.d}</td>
                    <td className="p-2 text-center font-bold text-purple-700 bg-purple-50/30 border-l border-slate-200">{s.plastic}</td>
                    <td className="p-2 text-center font-bold text-amber-700 bg-amber-50/30 border-l border-slate-200">{s.metals}</td>
                    <td className="p-2 text-center font-bold text-purple-700 bg-purple-50/30 border-l border-slate-200">{s.paper}</td>
                    <td className="p-2 text-center font-bold text-amber-700 bg-amber-50/30 border-l border-slate-200">{s.glass}</td>
                    
                    {/* Merged Non-Contiguous Result I4:I9 */}
                    {idx === 0 ? (
                      <td 
                        rowSpan={6} 
                        onClick={() => handleApplyPreset(EXERCISES[0].expectedFormula, 'I4')}
                        className={`p-2 text-center font-black text-sm border-l border-slate-200 cursor-pointer transition-colors ${
                          selectedCell === 'I4' ? 'bg-sky-200 text-sky-900 ring-2 ring-sky-500' : 'bg-sky-50 text-sky-800'
                        }`}
                      >
                        258
                        <span className="block text-[9px] font-normal text-sky-600 font-mono">=SUM(E4:E9,G4:G9)</span>
                      </td>
                    ) : null}

                    {/* Merged Non-Contiguous Result J4:J9 */}
                    {idx === 0 ? (
                      <td 
                        rowSpan={6} 
                        className="p-2 text-center font-black text-sm bg-teal-50 text-teal-800 border-l border-slate-200"
                      >
                        62
                        <span className="block text-[9px] font-normal text-teal-600 font-mono">=SUM(F4:F9,H4:H9)</span>
                      </td>
                    ) : null}

                    {/* Merged Percentage K4:K9 */}
                    {idx === 0 ? (
                      <td 
                        rowSpan={6}
                        onClick={() => handleApplyPreset(EXERCISES[1].expectedFormula, 'K4')}
                        className={`p-2 text-center font-black text-sm border-l border-slate-200 cursor-pointer transition-colors ${
                          selectedCell === 'K4' ? 'bg-indigo-200 text-indigo-900 ring-2 ring-indigo-500' : 'bg-indigo-50 text-indigo-800'
                        }`}
                      >
                        38.13%
                        <span className="block text-[9px] font-normal text-indigo-600 font-mono">=E12/I12</span>
                      </td>
                    ) : null}

                    <td className="p-2 text-center font-bold text-slate-800 border-l border-slate-200">{s.totalSum}</td>
                    
                    {/* IF Column */}
                    <td 
                      onClick={() => handleApplyPreset(EXERCISES[2].expectedFormula, `M${rowNum}`)}
                      className={`p-2 text-center font-bold border-l border-slate-200 cursor-pointer ${
                        s.ifLevel === 'عال' ? 'text-emerald-700 bg-emerald-50/50' : 'text-amber-700 bg-amber-50/50'
                      }`}
                    >
                      {s.ifLevel}
                    </td>

                    {/* AND+IF Column */}
                    <td 
                      onClick={() => handleApplyPreset(EXERCISES[3].expectedFormula, `N${rowNum}`)}
                      className={`p-2 text-center font-bold cursor-pointer ${
                        s.ifAndAwareness === 'جيدة' ? 'text-blue-700 bg-blue-50/50' : 'text-slate-600 bg-slate-50'
                      }`}
                    >
                      {s.ifAndAwareness}
                    </td>
                  </tr>
                );
              })}

              {/* Row 12: SUM Totals */}
              <tr className="bg-amber-100/70 text-slate-900 font-bold border-t-2 border-slate-300">
                <td className="p-1.5 bg-amber-200 text-center font-mono text-[10px]">12</td>
                <td colSpan={4} className="p-2 text-center font-black text-amber-950 border-l border-slate-300">المجموع (SUM)</td>
                <td className="p-2 text-center font-black text-purple-900 border-l border-slate-300 font-mono">122</td>
                <td className="p-2 text-center font-black text-amber-900 border-l border-slate-300 font-mono">31</td>
                <td className="p-2 text-center font-black text-purple-900 border-l border-slate-300 font-mono">136</td>
                <td className="p-2 text-center font-black text-amber-900 border-l border-slate-300 font-mono">31</td>
                <td colSpan={3} className="p-2 text-center font-black text-emerald-950 font-mono border-l border-slate-300">
                  المجموع الكلي: 320
                </td>
                <td colSpan={3} className="p-2 text-center text-slate-400 font-mono">-</td>
              </tr>

              {/* Row 13: AVERAGE */}
              <tr className="bg-amber-50 text-slate-800 font-semibold border-b border-slate-300">
                <td className="p-1.5 bg-amber-100 text-center font-mono text-[10px]">13</td>
                <td colSpan={4} className="p-2 text-center font-bold text-amber-900 border-l border-slate-300">المتوسط (AVERAGE)</td>
                <td className="p-2 text-center font-bold text-purple-800 border-l border-slate-300 font-mono">20.3</td>
                <td className="p-2 text-center font-bold text-amber-800 border-l border-slate-300 font-mono">5.2</td>
                <td className="p-2 text-center font-bold text-purple-800 border-l border-slate-300 font-mono">22.7</td>
                <td className="p-2 text-center font-bold text-amber-800 border-l border-slate-300 font-mono">5.2</td>
                <td colSpan={6} className="p-2 text-center text-slate-400 font-mono">-</td>
              </tr>

              {/* Row 15: LEFT function demonstration */}
              <tr className="bg-teal-50/60 border-t border-slate-200">
                <td className="p-1.5 bg-slate-100 text-center font-mono text-[10px]">15</td>
                <td className="p-2 font-mono font-bold text-teal-800 border-l border-slate-200">LEFT</td>
                <td 
                  onClick={() => handleApplyPreset(EXERCISES[4].expectedFormula, 'C15')}
                  className="p-2 font-bold text-teal-900 border-l border-slate-200 bg-teal-100/70 cursor-pointer"
                >
                  الثامن
                  <span className="block text-[9px] font-normal text-teal-700 font-mono">=LEFT(B4,6)</span>
                </td>
                <td colSpan={12} className="p-2 text-xs text-teal-900">
                  تم استخدام دالة <strong>LEFT(B4,6)</strong> لاستخراج اسم الصف "الثامن" دون رقم الشعبة.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
