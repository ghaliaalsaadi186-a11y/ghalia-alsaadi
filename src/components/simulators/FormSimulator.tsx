import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Eye, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Settings, 
  BarChart, 
  PieChart, 
  Star, 
  Sliders, 
  Type, 
  AlignLeft, 
  ShieldAlert, 
  ExternalLink,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FormQuestion {
  id: string;
  title: string;
  type: 'short-answer' | 'multiple-choice' | 'rating' | 'linear-scale' | 'paragraph';
  required: boolean;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  validation?: {
    enabled: boolean;
    type: 'number';
    condition: 'between';
    min: number;
    max: number;
    errorText: string;
  };
}

const INITIAL_QUESTIONS: FormQuestion[] = [
  {
    id: 'q1',
    title: 'الاسم',
    type: 'short-answer',
    required: true,
  },
  {
    id: 'q2',
    title: 'الصف',
    type: 'multiple-choice',
    required: true,
    options: ['الثامن 1', 'الثامن 2']
  },
  {
    id: 'q3',
    title: 'أنا على دراية بالمواد القابلة لإعادة التدوير',
    type: 'rating',
    required: true,
    scaleMax: 5
  },
  {
    id: 'q4',
    title: 'كم عدد الأيام التي تلتزم فيها بفرز المواد القابلة لإعادة التدوير في الأسبوع؟',
    type: 'linear-scale',
    required: true,
    scaleMin: 0,
    scaleMax: 7,
    scaleMinLabel: 'أبداً',
    scaleMaxLabel: 'دائماً'
  },
  {
    id: 'q5',
    title: 'في المتوسط، كم قطعة من البلاستيك تقوم بإعادة تدويرها أسبوعياً؟',
    type: 'short-answer',
    required: true,
    validation: {
      enabled: true,
      type: 'number',
      condition: 'between',
      min: 0,
      max: 70,
      errorText: 'رقم غير صالح (يرجى إدخال رقم بين 0 و 70)'
    }
  },
  {
    id: 'q6',
    title: 'ما الإجراءات التي يمكنك اتخاذها لتحسين عادات إعادة التدوير في المنزل أو المدرسة؟',
    type: 'paragraph',
    required: false
  }
];

export const FormSimulator: React.FC<{ onCompleteTask?: () => void }> = ({ onCompleteTask }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'responses'>('editor');
  const [questions, setQuestions] = useState<FormQuestion[]>(INITIAL_QUESTIONS);
  const [responseTab, setResponseTab] = useState<'summary' | 'question' | 'individual'>('summary');
  const [individualIndex, setIndividualIndex] = useState(0);
  const [formResponses, setFormResponses] = useState([
    { name: 'مريم الشحي', grade: 'الثامن 1', rating: 5, days: 6, plastic: 29, ideas: 'توفير حاويات فرز ملونة في كل ممر بالمدرسة' },
    { name: 'خالد المعمري', grade: 'الثامن 2', rating: 4, days: 4, plastic: 16, ideas: 'عمل مسابقات أسبوعية لأنظف فصل وأكثر تدوير' },
    { name: 'فيصل البلوشي', grade: 'الثامن 1', rating: 3, days: 3, plastic: 14, ideas: 'ورش توعية عن مخاطر حرق البلاستيك' },
    { name: 'سلطان الحوسني', grade: 'الثامن 1', rating: 4, days: 5, plastic: 27, ideas: 'إعادة استخدام العلب الفارغة في الفنون المدرسية' },
    { name: 'علي الريامي', grade: 'الثامن 2', rating: 2, days: 1, plastic: 12, ideas: 'وضع لوحات إرشادية واضحة بجانب الحاويات' },
    { name: 'هيثم اليعربي', grade: 'الثامن 2', rating: 5, days: 7, plastic: 24, ideas: 'جمع الأغطية البلاستيكية لصالح الجمعيات الخيرية' }
  ]);

  // Preview form input states
  const [previewData, setPreviewData] = useState<Record<string, any>>({
    q1: '',
    q2: 'الثامن 1',
    q3: 5,
    q4: 4,
    q5: '25',
    q6: ''
  });
  const [previewErrors, setPreviewErrors] = useState<Record<string, string>>({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isExportedToSheets, setIsExportedToSheets] = useState(false);

  // Handle preview form submission
  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    questions.forEach(q => {
      const val = previewData[q.id];
      if (q.required && (!val || val.toString().trim() === '')) {
        errors[q.id] = 'هذا السؤال مطلوب ويجب الإجابة عليه.';
      }

      if (q.validation && q.validation.enabled) {
        const num = Number(val);
        if (isNaN(num) || num < q.validation.min || num > q.validation.max) {
          errors[q.id] = q.validation.errorText;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setPreviewErrors(errors);
      return;
    }

    setPreviewErrors({});
    setSubmittedSuccess(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });

    // Add to simulated responses
    setFormResponses(prev => [
      ...prev,
      {
        name: previewData.q1 || 'طالبة مشاركة',
        grade: previewData.q2 || 'الثامن 1',
        rating: Number(previewData.q3) || 4,
        days: Number(previewData.q4) || 5,
        plastic: Number(previewData.q5) || 20,
        ideas: previewData.q6 || 'مبادرة ممتازة'
      }
    ]);

    if (onCompleteTask) onCompleteTask();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Mode Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            📝
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-base sm:text-lg">
              مختبر محاكاة نماذج جوجل (Google Forms Simulator)
            </h4>
            <p className="text-xs text-slate-500">
              تطبيق عملي مباشر لمحتوى الدرس 1-1 من كتاب تقنية المعلومات للصف الثامن
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold">
          <button
            onClick={() => { setActiveTab('editor'); setSubmittedSuccess(false); }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'editor' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>محرر الأسئلة والقواعد</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('preview'); setSubmittedSuccess(false); }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>معاينة وتجربة الإرسال (Preview)</span>
          </button>

          <button
            onClick={() => setActiveTab('responses')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'responses' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart className="w-3.5 h-3.5" />
            <span>الردود والتصدير ({formResponses.length})</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Editor */}
      {activeTab === 'editor' && (
        <div className="space-y-4">
          
          {/* Form Title & Header Card */}
          <div className="bg-purple-50/60 border-t-8 border-t-purple-600 border border-purple-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md">
                استطلاع يوم البيئة العُماني
              </span>
              <span className="text-xs text-slate-400">حفظ تلقائي في Google Drive</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
              متتبع أنشطة إعادة التدوير
            </h2>
            <p className="text-sm text-slate-600">
              استخدم هذا النموذج لتسجيل عاداتك في إعادة التدوير والنظر فيها.
            </p>
          </div>

          {/* Interactive Questions List */}
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div 
                key={q.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-800 text-sm sm:text-base">
                      {q.title}
                    </span>
                    {q.required && (
                      <span className="text-rose-500 font-bold" title="سؤال مطلوب">*</span>
                    )}
                  </div>

                  {/* Type Badge */}
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                    {q.type === 'short-answer' && <Type className="w-3 h-3 text-sky-600" />}
                    {q.type === 'multiple-choice' && <CheckCircle2 className="w-3 h-3 text-purple-600" />}
                    {q.type === 'rating' && <Star className="w-3 h-3 text-amber-500" />}
                    {q.type === 'linear-scale' && <Sliders className="w-3 h-3 text-emerald-600" />}
                    {q.type === 'paragraph' && <AlignLeft className="w-3 h-3 text-indigo-600" />}
                    <span>
                      {q.type === 'short-answer' && 'إجابة قصيرة (Short answer)'}
                      {q.type === 'multiple-choice' && 'خيارات متعددة (Multiple choice)'}
                      {q.type === 'rating' && 'تقييم (Rating)'}
                      {q.type === 'linear-scale' && 'مقياس خطي (Linear scale)'}
                      {q.type === 'paragraph' && 'فقرة (Paragraph)'}
                    </span>
                  </span>
                </div>

                {/* Sub-details / preview based on type */}
                {q.type === 'multiple-choice' && q.options && (
                  <div className="mr-8 space-y-1.5 text-xs text-slate-600">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {q.type === 'rating' && (
                  <div className="mr-8 flex items-center gap-2 text-amber-400 py-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs text-slate-500 mr-2">(مقياس 5 نجوم)</span>
                  </div>
                )}

                {q.type === 'linear-scale' && (
                  <div className="mr-8 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 inline-block">
                    <span>من <strong>{q.scaleMin}</strong> ({q.scaleMinLabel}) إلى <strong>{q.scaleMax}</strong> ({q.scaleMaxLabel})</span>
                  </div>
                )}

                {/* Response Validation Box Callout */}
                {q.validation && q.validation.enabled && (
                  <div className="mt-3 mr-8 bg-blue-50/80 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-900">
                    <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">قاعدة التحقق من صحة الرد (Response Validation):</span>
                      <p>
                        يشترط أن تكون القيمة رقماً محصوراً بين <strong>({q.validation.min} و {q.validation.max})</strong>، وعند إدخال رقم خارج النطاق تظهر رسالة: <span className="text-rose-600 font-semibold font-mono">"{q.validation.errorText}"</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setActiveTab('preview')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-sm flex items-center gap-2 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>انتقلي لمعاينة النموذج وتجربته</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Preview Mode */}
      {activeTab === 'preview' && (
        <div className="max-w-2xl mx-auto">
          {submittedSuccess ? (
            <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                تم تسجيل ردك بنجاح!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                شكراً لمشاركتك في استطلاع متتبع أنشطة إعادة التدوير لطلبة الصف الثامن. تم إرسال إجاباتك وتحديث إحصائيات النموذج تلقائياً.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                  إرسال رد آخر
                </button>
                <button
                  onClick={() => setActiveTab('responses')}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <BarChart className="w-4 h-4" />
                  <span>مشاهدة ملخص الردود والرسوم البيانية</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePreviewSubmit} className="space-y-4">
              <div className="bg-white border-t-8 border-t-purple-600 border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  متتبع أنشطة إعادة التدوير
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  استخدم هذا النموذج لتسجيل عاداتك في إعادة التدوير والنظر فيها.
                </p>
                <div className="text-xs text-rose-500 font-bold">
                  * يشير إلى سؤال مطلوب
                </div>
              </div>

              {/* Form Input Cards */}
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <label className="block font-bold text-slate-800 text-base">
                    {q.title} {q.required && <span className="text-rose-500">*</span>}
                  </label>

                  {/* Input based on type */}
                  {q.type === 'short-answer' && (
                    <div>
                      <input
                        type="text"
                        value={previewData[q.id] || ''}
                        onChange={e => setPreviewData({ ...previewData, [q.id]: e.target.value })}
                        placeholder={q.id === 'q5' ? 'أدخلي رقماً بين 0 و 70 (مثال: 25)' : 'إجابتك القصيرة...'}
                        className={`w-full max-w-md px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          previewErrors[q.id] 
                            ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-200' 
                            : 'border-slate-300 focus:ring-purple-200 focus:border-purple-500'
                        }`}
                      />
                    </div>
                  )}

                  {q.type === 'multiple-choice' && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => (
                        <label key={oIdx} className="flex items-center gap-3 cursor-pointer text-sm text-slate-700">
                          <input
                            type="radio"
                            name={q.id}
                            checked={previewData[q.id] === opt}
                            onChange={() => setPreviewData({ ...previewData, [q.id]: opt })}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'rating' && (
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setPreviewData({ ...previewData, [q.id]: num })}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star 
                            className={`w-7 h-7 ${
                              num <= (previewData[q.id] || 0)
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-slate-300'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === 'linear-scale' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-2">
                        <span>{q.scaleMinLabel} (0)</span>
                        <span>{q.scaleMaxLabel} (7)</span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map(num => (
                          <label key={num} className="flex flex-col items-center gap-1 cursor-pointer">
                            <span className="text-xs font-bold text-slate-600">{num}</span>
                            <input
                              type="radio"
                              name={q.id}
                              checked={Number(previewData[q.id]) === num}
                              onChange={() => setPreviewData({ ...previewData, [q.id]: num })}
                              className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {q.type === 'paragraph' && (
                    <textarea
                      rows={3}
                      value={previewData[q.id] || ''}
                      onChange={e => setPreviewData({ ...previewData, [q.id]: e.target.value })}
                      placeholder="اكتبي مقترحاتك هنا بالتفصيل..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                    />
                  )}

                  {/* Error display */}
                  {previewErrors[q.id] && (
                    <div className="flex items-center gap-2 text-rose-600 text-xs font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{previewErrors[q.id]}</span>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  العودة إلى التعديل
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال النموذج (Submit)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Mode 3: Responses & Export to Sheets */}
      {activeTab === 'responses' && (
        <div className="space-y-6">
          
          {/* Top Bar for Responses with Google Sheets Link */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-extrabold text-slate-900 text-lg">
                  {formResponses.length} ردود مستلمة
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  النموذج نشط ويستقبل الردود
                </span>
              </div>
              <p className="text-xs text-slate-500">
                يمكنك الاطلاع على الملخص الإحصائي، أو فرز كل سؤال، أو استعراض كل طالبة.
              </p>
            </div>

            {/* Link to Sheets Action */}
            <button
              onClick={() => {
                setIsExportedToSheets(true);
                confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                isExportedToSheets 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isExportedToSheets ? 'تم التصدير إلى Google Sheets' : 'الربط بـ "جداول بيانات Google" (Link to Sheets)'}</span>
            </button>
          </div>

          {/* Subtabs: Summary | Question | Individual */}
          <div className="flex gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setResponseTab('summary')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                responseTab === 'summary' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ملخص عام (Summary)
            </button>
            <button
              onClick={() => setResponseTab('individual')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                responseTab === 'individual' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              عرض فردي (Individual)
            </button>
          </div>

          {/* Tab 1: Summary Visualizations */}
          {responseTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pie Chart Representation for Class */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">توزيع الشعب الدراسية (الصف)</span>
                  <span className="text-xs text-slate-400 font-mono">6 responses</span>
                </div>
                
                {/* Visual Pie Representation */}
                <div className="h-44 flex items-center justify-center gap-6">
                  <div className="relative w-32 h-32 rounded-full border-8 border-purple-500 bg-teal-400 flex items-center justify-center text-white font-black text-xs">
                    <span className="drop-shadow">50% / 50%</span>
                  </div>
                  <div className="space-y-2 text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-purple-500"></div>
                      <span>الثامن 1 (50%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-teal-400"></div>
                      <span>الثامن 2 (50%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Bar Chart */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">الدراية بمواد إعادة التدوير (التقييم)</span>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    المتوسط: 3.8 / 5 ★
                  </span>
                </div>
                
                {/* Bar representation */}
                <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-4 bg-slate-50 rounded-xl border border-slate-100">
                  {[
                    { star: 1, count: 0, pct: 0 },
                    { star: 2, count: 1, pct: 25 },
                    { star: 3, count: 1, pct: 25 },
                    { star: 4, count: 2, pct: 50 },
                    { star: 5, count: 2, pct: 50 }
                  ].map(item => (
                    <div key={item.star} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-bold text-slate-500">{item.count}</span>
                      <div 
                        style={{ height: `${Math.max(10, item.pct * 1.5)}%` }}
                        className="w-full bg-purple-500 rounded-t-md hover:bg-purple-600 transition-all"
                      />
                      <span className="text-xs font-bold text-slate-700 flex items-center">
                        {item.star}★
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linear Scale: Days sorting */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">
                    متوسط عدد الأيام أسبوعياً للفرز: 4.3 أيام
                  </span>
                  <span className="text-xs text-slate-400">مقياس 0 إلى 7</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                    <span className="text-xs text-purple-700 block">أعلى التزام</span>
                    <span className="text-lg font-black text-purple-900">7 أيام (هيثم)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-xs text-emerald-700 block">متوسط البلاستيك</span>
                    <span className="text-lg font-black text-emerald-900">19.5 قطعة</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-xs text-amber-700 block">إجمالي الطالبات</span>
                    <span className="text-lg font-black text-amber-900">6 طالبات</span>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
                    <span className="text-xs text-teal-700 block">جودة البيانات</span>
                    <span className="text-lg font-black text-teal-900">100% صالحة</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Individual Inspector */}
          {responseTab === 'individual' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-800 text-sm">
                  استجابة الطالبة {individualIndex + 1} من {formResponses.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIndividualIndex(prev => Math.max(0, prev - 1))}
                    disabled={individualIndex === 0}
                    className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-30"
                  >
                    السابق
                  </button>
                  <button
                    onClick={() => setIndividualIndex(prev => Math.min(formResponses.length - 1, prev + 1))}
                    disabled={individualIndex === formResponses.length - 1}
                    className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-30"
                  >
                    التالي
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-500 block">اسم الطالب/الطالبة:</span>
                  <span className="font-extrabold text-slate-900">{formResponses[individualIndex].name}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-500 block">الصف / الشعبة:</span>
                  <span className="font-extrabold text-purple-700">{formResponses[individualIndex].grade}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-500 block">مستوى الدراية بالمواد:</span>
                  <span className="font-bold text-amber-600">{formResponses[individualIndex].rating} من 5 نجوم ★</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-500 block">أيام الالتزام بالفرز أسبوعياً:</span>
                  <span className="font-bold text-slate-800">{formResponses[individualIndex].days} أيام</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-500 block">عدد قطع البلاستيك المعاد تدويرها:</span>
                  <span className="font-bold text-emerald-700">{formResponses[individualIndex].plastic} قطعة</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-500 block">المقترحات والأفكار:</span>
                  <span className="text-slate-800">{formResponses[individualIndex].ideas}</span>
                </div>
              </div>
            </div>
          )}

          {/* Exported to Sheets Simulation View */}
          {isExportedToSheets && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-base">
                    تم إنشاء ملف جدول البيانات: "متتبع أنشطة إعادة التدوير (Responses)"
                  </h4>
                  <p className="text-xs text-emerald-800">
                    تم تخزين الملف بنجاح في Google Drive وجاهز للمرحلة القادمة (الدرس 1-2: تحليل البيانات).
                  </p>
                </div>
              </div>

              {/* Table preview */}
              <div className="overflow-x-auto bg-white rounded-xl border border-emerald-200 mt-3">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-emerald-100 text-emerald-950 font-bold border-b border-emerald-200">
                      <th className="p-2.5 border-l border-emerald-200">الطابع الزمني</th>
                      <th className="p-2.5 border-l border-emerald-200">الاسم</th>
                      <th className="p-2.5 border-l border-emerald-200">الصف</th>
                      <th className="p-2.5 border-l border-emerald-200">الدراية (★)</th>
                      <th className="p-2.5 border-l border-emerald-200">الأيام</th>
                      <th className="p-2.5">قطع البلاستيك</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formResponses.slice(0, 4).map((r, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-100 hover:bg-emerald-50/50">
                        <td className="p-2.5 font-mono text-slate-500 border-l border-slate-100">2026/03/0{rIdx+2}</td>
                        <td className="p-2.5 font-bold text-slate-800 border-l border-slate-100">{r.name}</td>
                        <td className="p-2.5 text-purple-700 border-l border-slate-100">{r.grade}</td>
                        <td className="p-2.5 text-amber-600 border-l border-slate-100">{r.rating}</td>
                        <td className="p-2.5 text-slate-700 border-l border-slate-100">{r.days}</td>
                        <td className="p-2.5 font-bold text-emerald-700">{r.plastic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
