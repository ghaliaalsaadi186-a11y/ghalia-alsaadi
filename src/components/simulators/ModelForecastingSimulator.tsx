import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  LineChart as LineChartIcon, 
  Layers, 
  Sparkles, 
  Trees, 
  Info, 
  Check, 
  RefreshCw, 
  Sliders, 
  ShieldCheck, 
  Scale 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ModelForecastingSimulator: React.FC<{ onCompleteTask?: () => void }> = ({ onCompleteTask }) => {
  const [activeModel, setActiveModel] = useState<'waste' | 'trees'>('waste');
  const [chartType, setChartType] = useState<'column' | 'line'>('column');
  
  // Waste Model dynamic parameters
  const [wasteGrowthRate, setWasteGrowthRate] = useState<number>(10);
  const initialWaste = 3971.97;

  // Calculate waste years dynamically
  const wasteYears = Array.from({ length: 10 }, (_, i) => {
    const year = 2024 + i;
    let initialVal = initialWaste;
    for (let k = 0; k < i; k++) {
      initialVal = initialVal * (1 + wasteGrowthRate / 100);
    }
    const finalVal = initialVal * (1 + wasteGrowthRate / 100);
    return {
      year,
      initial: initialVal,
      rate: wasteGrowthRate,
      final: finalVal
    };
  });

  // Trees Model dynamic parameters (From Textbook Practice 3, Page 69)
  const [treeGrowthRate, setTreeGrowthRate] = useState<number>(5);
  const initialTrees = 100;
  const treeYears = Array.from({ length: 15 }, (_, i) => {
    const year = i + 1;
    let treesCount = initialTrees;
    for (let k = 0; k < i; k++) {
      treesCount = treesCount * (1 + treeGrowthRate / 100);
    }
    return {
      year,
      count: Math.round(treesCount * 10) / 10
    };
  });

  const maxWaste = wasteYears[wasteYears.length - 1].final;
  const maxTrees = treeYears[treeYears.length - 1].count;

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Model Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            📈
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-base sm:text-lg">
              مختبر محاكاة النماذج الحاسوبية والتنبؤ (Computer Model Simulator)
            </h4>
            <p className="text-xs text-slate-500">
              تطبيق عملي مباشر لمحتوى الدرس 1-3 وتدريبات كتاب تقنية المعلومات للصف الثامن
            </p>
          </div>
        </div>

        {/* Model Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveModel('waste')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeModel === 'waste' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>نموذج إدارة النفايات (بيئة عُمان)</span>
          </button>
          
          <button
            onClick={() => setActiveModel('trees')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeModel === 'trees' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>نموذج محاكاة نمو الأشجار (تدريب 3)</span>
          </button>
        </div>
      </div>

      {/* Model 1: Waste Management Oman */}
      {activeModel === 'waste' && (
        <div className="space-y-6">
          
          {/* Formula Explanation Card */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide">
                  صيغة حساب النموذج الرياضي التراكمي
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="px-3 py-1 bg-white border border-indigo-300 rounded-lg text-indigo-950 font-mono font-bold text-sm">
                    =B3 * (1 + C3/100)
                  </code>
                  <span className="text-xs text-slate-600 font-semibold">
                    (نهاية العام = القيمة الابتدائية × (1 + نسبة الزيادة / 100))
                  </span>
                </div>
              </div>

              {/* Interactive Growth Rate Slider */}
              <div className="bg-white p-2.5 rounded-xl border border-indigo-200 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">معدل الزيادة السنوية:</span>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={wasteGrowthRate}
                  onChange={e => setWasteGrowthRate(Number(e.target.value))}
                  className="w-24 accent-indigo-600 cursor-pointer"
                />
                <span className="font-mono font-black text-indigo-700 text-sm">{wasteGrowthRate}%</span>
              </div>
            </div>

            {/* Crucial Book Note Callout */}
            <div className="bg-white p-3.5 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>سر الرقم (1) في المعادلة:</strong> الرقم (1) هو الذي يجعل الصيغة تفهم أننا نريد <strong>"القيمة الابتدائية + الزيادة"</strong> معاً. ثم في العام التالي نضع الصيغة <code>=D3</code> في الخلية B4 لربط بداية العام بنهاية العام السابق.
              </div>
            </div>
          </div>

          {/* Visualization & Table Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Table: Left 6 columns */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-300 shadow-xs overflow-hidden">
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>إدارة النفايات في سلطنة عُمان (2024 - 2033)</span>
                <span className="text-slate-400 font-mono">B3:D12</span>
              </div>

              <div className="overflow-x-auto max-h-[420px]">
                <table className="w-full text-xs text-right border-collapse select-none">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-center">
                      <th className="p-2 border-l border-slate-200 font-mono text-[10px]">A: السنة</th>
                      <th className="p-2 border-l border-slate-200 font-mono">B: الكمية الأولية (طن)</th>
                      <th className="p-2 border-l border-slate-200 font-mono">C: الزيادة %</th>
                      <th className="p-2 bg-indigo-50 text-indigo-950 font-mono">D: نهاية العام (طن)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wasteYears.map((item, idx) => (
                      <tr key={item.year} className="border-b border-slate-100 hover:bg-slate-50/80">
                        <td className="p-2 text-center font-bold text-slate-900 border-l border-slate-100 font-mono">
                          {item.year}
                        </td>
                        <td className="p-2 text-center font-mono text-slate-700 border-l border-slate-100">
                          {item.initial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-2 text-center font-mono text-indigo-600 border-l border-slate-100 font-bold">
                          {item.rate}%
                        </td>
                        <td className="p-2 text-center font-mono font-black text-indigo-900 bg-indigo-50/40">
                          {item.final.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Chart Canvas: Right 6 columns */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-extrabold text-slate-900 text-sm">
                    المخطط البياني للنموذج الحاسوبي (Chart)
                  </h5>
                  <p className="text-xs text-slate-500">
                    مقارنة مسار نمو النفايات المعاد تدويرها
                  </p>
                </div>

                {/* Switch Chart Type */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setChartType('column')}
                    className={`p-1.5 rounded-lg flex items-center gap-1 ${
                      chartType === 'column' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                    }`}
                    title="مخطط أعمدة (Column Chart)"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>أعمدة</span>
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`p-1.5 rounded-lg flex items-center gap-1 ${
                      chartType === 'line' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                    }`}
                    title="مخطط خطي (Line Chart)"
                  >
                    <LineChartIcon className="w-3.5 h-3.5" />
                    <span>خطي</span>
                  </button>
                </div>
              </div>

              {/* Chart Graphics */}
              <div className="h-64 flex items-end justify-between gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                {wasteYears.map(item => {
                  const heightPct = Math.round((item.final / maxWaste) * 100);
                  return (
                    <div key={item.year} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      <span className="text-[9px] font-mono text-indigo-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {Math.round(item.final)}
                      </span>
                      {chartType === 'column' ? (
                        <div
                          style={{ height: `${Math.max(15, heightPct)}%` }}
                          className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md group-hover:brightness-110 transition-all cursor-pointer shadow-xs"
                        />
                      ) : (
                        <div className="w-full flex flex-col items-center justify-end h-full">
                          <div 
                            style={{ marginBottom: `${heightPct * 1.8}px` }} 
                            className="w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100 group-hover:scale-125 transition-transform" 
                          />
                        </div>
                      )}
                      <span className="text-[10px] font-mono font-bold text-slate-600 truncate">
                        {item.year.toString().slice(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Takeaway Insight */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 flex items-center justify-between">
                <div>
                  <span className="font-bold block">التنبؤ بحلول عام 2033:</span>
                  <span>ستصل كمية النفايات المحولة إلى <strong>{Math.round(maxWaste).toLocaleString('en-US')} طن</strong> سنوياً.</span>
                </div>
                <button
                  onClick={() => {
                    confetti({ particleCount: 40, spread: 50 });
                    if (onCompleteTask) onCompleteTask();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs"
                >
                  تأكيد النموذج ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model 2: Tree Growth Simulator (Textbook Exercise 3 Page 69) */}
      {activeModel === 'trees' && (
        <div className="space-y-6">
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  تدريب 3 صفحة 69: محاكاة نمو الأشجار في مزرعة
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  مزرعة تبدأ بـ 100 شجرة ومعدل نمو 5% سنوياً
                </h3>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-emerald-200 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">معدل النمو السنوي:</span>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={treeGrowthRate}
                  onChange={e => setTreeGrowthRate(Number(e.target.value))}
                  className="w-24 accent-emerald-600 cursor-pointer"
                />
                <span className="font-mono font-black text-emerald-700 text-sm">{treeGrowthRate}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Tree Table */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-300 shadow-xs overflow-hidden">
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-xs font-bold text-slate-700">
                جدول محاكاة أعداد الأشجار عبر 15 سنة
              </div>
              <div className="overflow-y-auto max-h-[380px]">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-center">
                      <th className="p-2 border-l border-slate-200">السنة</th>
                      <th className="p-2 border-l border-slate-200">معدل النمو (%)</th>
                      <th className="p-2 bg-emerald-50 text-emerald-950">عدد الأشجار المتوقع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treeYears.map(item => (
                      <tr key={item.year} className={`border-b border-slate-100 ${item.year === 15 ? 'bg-emerald-100/70 font-black' : ''}`}>
                        <td className="p-2 text-center font-bold text-slate-900 border-l border-slate-100 font-mono">
                          السنة {item.year}
                        </td>
                        <td className="p-2 text-center text-slate-600 border-l border-slate-100 font-mono">
                          {treeGrowthRate}%
                        </td>
                        <td className="p-2 text-center font-mono font-bold text-emerald-800">
                          {item.count} شجرة
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tree Visual & Insight */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h5 className="font-extrabold text-slate-900 text-base mb-1">
                  تنبؤ بعدد الأشجار في السنة الخامسة عشرة:
                </h5>
                <p className="text-xs text-slate-500 mb-4">
                  وفق نموذج النمو التراكمي بمعدل {treeGrowthRate}% سنوياً.
                </p>

                {/* Tree Garden Graphic */}
                <div className="bg-gradient-to-b from-emerald-50 to-teal-100/60 p-6 rounded-2xl border border-emerald-200 text-center space-y-3">
                  <div className="text-5xl">🌳 🌲 🌴 🌳 🌲</div>
                  <div className="text-3xl font-black text-emerald-950 font-mono">
                    {treeYears[14].count} شجرة
                  </div>
                  <p className="text-xs text-emerald-800">
                    بدأت المزرعة بـ 100 شجرة وستتضاعف بحلول السنة الـ 15 لتصل إلى قرابة <strong>{Math.round(treeYears[14].count)} شجرة</strong>.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    confetti({ particleCount: 50, spread: 60 });
                    if (onCompleteTask) onCompleteTask();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>إتمام تدريب محاكاة الأشجار</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
