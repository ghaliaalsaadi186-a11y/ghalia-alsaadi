import React, { useState } from 'react';
import { 
  FolderKanban, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Table, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Check, 
  Award,
  BarChart2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProjectSimulator: React.FC<{ onCompleteTask?: () => void }> = ({ onCompleteTask }) => {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  // Project Stage 2 Table data
  const projectStudents = [
    { name: 'فاطمة الزدجالية', sports: 12, science: 4, arts: 11, reading: 6, total: 33, creativity: 17, physical: 'يتمتع بصحة بدنية جيدة', cultural: 'نشط ثقافياً وفنياً' },
    { name: 'عائشة المعمرية', sports: 8, science: 6, arts: 14, reading: 4, total: 32, creativity: 18, physical: 'بحاجة إلى تحسين', cultural: 'أقل نشاطاً ثقافياً وفنياً' },
    { name: 'سارة البلوشية', sports: 14, science: 3, arts: 9, reading: 7, total: 33, creativity: 16, physical: 'يتمتع بصحة بدنية جيدة', cultural: 'أقل نشاطاً ثقافياً وفنياً' },
    { name: 'مريم الحارثية', sports: 11, science: 5, arts: 12, reading: 8, total: 36, creativity: 20, physical: 'يتمتع بصحة بدنية جيدة', cultural: 'نشط ثقافياً وفنياً' },
    { name: 'شهد الشبيبية', sports: 6, science: 7, arts: 5, reading: 3, total: 21, creativity: 8, physical: 'بحاجة إلى تحسين', cultural: 'أقل نشاطاً ثقافياً وفنياً' }
  ];

  // Project Stage 3 Population model
  const initialStudentPop = 854540;
  const growthRate = 15;
  const popYears = Array.from({ length: 6 }, (_, i) => {
    const yr = i + 1;
    let count = initialStudentPop;
    for (let k = 0; k < i; k++) {
      count = count * (1 + growthRate / 100);
    }
    return {
      year: `السنة ${yr}`,
      count: Math.round(count)
    };
  });

  const markStageDone = (stage: number) => {
    if (!completedStages.includes(stage)) {
      const next = [...completedStages, stage];
      setCompletedStages(next);
      confetti({ particleCount: 50, spread: 60 });
      if (next.length === 3 && onCompleteTask) {
        onCompleteTask();
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Project Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
            🏆
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
              المشروع الشامل للوحدة الأولى: يوم الأنشطة المدرسية المفضلة
            </h4>
            <p className="text-xs text-slate-500">
              تطبيق عملي متكامل يجمع النماذج، التحليل الرياضي والمنطقي، وبناء النموذج التنبؤي
            </p>
          </div>
        </div>

        {/* Stage Navigation Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
          <button
            onClick={() => setCurrentStage(1)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
              currentStage === 1 ? 'bg-white text-amber-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <span>1. الاستطلاع</span>
            {completedStages.includes(1) && <Check className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
          <button
            onClick={() => setCurrentStage(2)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
              currentStage === 2 ? 'bg-white text-amber-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <span>2. تنظيم وتحليل البيانات</span>
            {completedStages.includes(2) && <Check className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
          <button
            onClick={() => setCurrentStage(3)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
              currentStage === 3 ? 'bg-white text-amber-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <span>3. نموذج تعداد الطلبة</span>
            {completedStages.includes(3) && <Check className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* Stage 1: Google Forms creation */}
      {currentStage === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                المرحلة الأولى: Google Forms
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                إنشاء استطلاع "الأنشطة المدرسية المفضلة"
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                الوصف: "أجب عن الأسئلة للمساعدة في التخطيط ليوم الأنشطة المدرسية المفضلة"
              </p>
            </div>
            <button
              onClick={() => markStageDone(1)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                completedStages.includes(1)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{completedStages.includes(1) ? 'تم إنجاز المرحلة 1 ✓' : 'اعتماد وتصدير النموذج إلى Sheets'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {[
              { id: '1', q: 'ما اسمك؟', type: 'إجابة قصيرة (Short answer)', req: true },
              { id: '2', q: 'كم ساعة تقضيها في ممارسة الرياضة أسبوعياً؟', type: 'إجابة قصيرة (أرقام فقط)', req: true },
              { id: '3', q: 'كم ساعة تقضيها في الأنشطة العلمية أسبوعياً؟', type: 'إجابة قصيرة (أرقام فقط)', req: true },
              { id: '4', q: 'كم ساعة تقضيها في الفنون البصرية أسبوعياً؟', type: 'إجابة قصيرة (أرقام فقط)', req: true },
              { id: '5', q: 'كم ساعة تقضيها في قراءة الكتب أسبوعياً؟', type: 'إجابة قصيرة (أرقام فقط)', req: true }
            ].map(item => (
              <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block text-sm">{item.id}. {item.q}</span>
                  <span className="text-slate-500">{item.type}</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">مطلوب *</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                markStageDone(1);
                setCurrentStage(2);
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
            >
              <span>الانتقال للمرحلة 2: تنظيم وتحليل البيانات</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Stage 2: Data Analysis & Formulas */}
      {currentStage === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                المرحلة الثانية: Google Sheets
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                جدول "الأنشطة المدرسية المفضلة لطلبة الصف الثامن"
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                تطبيق دوال SUM, AVERAGE, IF للنشاط البدني، ودالتي IF+AND للتوجه الثقافي والإبداعي.
              </p>
            </div>
            <button
              onClick={() => markStageDone(2)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                completedStages.includes(2)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-sky-600 text-white hover:bg-sky-700 shadow-xs'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{completedStages.includes(2) ? 'تم اعتماد التحليل ✓' : 'اعتماد صحة الدوال والنتائج'}</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-300">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-center">
                  <th className="p-2 border-l border-slate-200">اسم الطالبة</th>
                  <th className="p-2 border-l border-slate-200">الرياضة</th>
                  <th className="p-2 border-l border-slate-200">العلوم</th>
                  <th className="p-2 border-l border-slate-200 bg-amber-50">الفنون</th>
                  <th className="p-2 border-l border-slate-200 bg-amber-50">القراءة</th>
                  <th className="p-2 border-l border-slate-200 bg-emerald-50">إجمالي الساعات (=SUM)</th>
                  <th className="p-2 border-l border-slate-200 bg-purple-50">ساعات الإبداع (خلايا غير متجاورة)</th>
                  <th className="p-2 border-l border-slate-200 bg-blue-50">النشاط البدني (=IF)</th>
                  <th className="p-2 bg-indigo-50">التوجه الثقافي (=IF+AND)</th>
                </tr>
              </thead>
              <tbody>
                {projectStudents.map((s, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-900 border-l border-slate-100">{s.name}</td>
                    <td className="p-2 text-center text-slate-700 border-l border-slate-100 font-mono">{s.sports} س</td>
                    <td className="p-2 text-center text-slate-700 border-l border-slate-100 font-mono">{s.science} س</td>
                    <td className="p-2 text-center text-amber-900 bg-amber-50/40 border-l border-slate-100 font-mono font-bold">{s.arts} س</td>
                    <td className="p-2 text-center text-amber-900 bg-amber-50/40 border-l border-slate-100 font-mono font-bold">{s.reading} س</td>
                    <td className="p-2 text-center text-emerald-800 bg-emerald-50/40 border-l border-slate-100 font-mono font-black">{s.total} س</td>
                    <td className="p-2 text-center text-purple-800 bg-purple-50/40 border-l border-slate-100 font-mono font-bold">{s.creativity} س</td>
                    <td className={`p-2 text-center font-bold border-l border-slate-100 ${s.physical.includes('جيدة') ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {s.physical}
                    </td>
                    <td className={`p-2 text-center font-bold ${s.cultural.includes('نشط') ? 'text-indigo-700' : 'text-slate-500'}`}>
                      {s.cultural}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                markStageDone(2);
                setCurrentStage(3);
              }}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
            >
              <span>الانتقال للمرحلة 3: النموذج التنبؤي لتعداد الطلبة</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Stage 3: Computer Model Population Forecast */}
      {currentStage === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                المرحلة الثالثة: النموذج الحاسوبي
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                تعداد الطلبة في سلطنة عُمان (نمو 15% سنوياً)
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                القيمة الأولية في السنة 1: 854,540 طالباً. التنبؤ بالأعداد للسنوات الخمس القادمة.
              </p>
            </div>
            <button
              onClick={() => markStageDone(3)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>إتمام واعتماد المشروع بالكامل</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-2.5 border-l border-slate-200">السنة</th>
                    <th className="p-2.5 border-l border-slate-200">معدل النمو</th>
                    <th className="p-2.5 bg-purple-50 text-purple-950 font-black">العدد المتوقع (طالباً)</th>
                  </tr>
                </thead>
                <tbody>
                  {popYears.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="p-2.5 font-bold text-slate-900 border-l border-slate-100">{item.year}</td>
                      <td className="p-2.5 text-slate-600 border-l border-slate-100 font-mono">15%</td>
                      <td className="p-2.5 font-mono font-black text-purple-900 bg-purple-50/30">
                        {item.count.toLocaleString('en-US')} طالب
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-purple-50 p-6 rounded-2xl border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase block mb-1">النتيجة التنبؤية للمشروع</span>
                <div className="text-3xl font-black text-purple-950 font-mono mb-2">
                  {popYears[5].count.toLocaleString('en-US')}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  بحلول السنة السادسة، يتوقع النموذج الحاسوبي وصول عدد الطلبة في سلطنة عُمان إلى أكثر من <strong>1.7 مليون طالب وطالبة</strong> بمعدل نمو سنوي مركب قدره 15%.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white/80 p-3 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>تهانينا! لقد طبقتِ جميع مهارات الوحدة الأولى بنجاح من جمع البيانات وتحليلها إلى بناء النماذج التنبؤية.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
