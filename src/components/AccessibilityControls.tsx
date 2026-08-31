import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Eye, 
  Type, 
  Sparkles, 
  Sun, 
  Moon, 
  Check, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { ThemeMode, FontSize } from '../types';

interface AccessibilityControlsProps {
  theme: ThemeMode;
  fontSize: FontSize;
  onThemeChange: (theme: ThemeMode) => void;
  onFontSizeChange: (size: FontSize) => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  theme,
  fontSize,
  onThemeChange,
  onFontSizeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const THEMES: { id: ThemeMode; name: string; icon: any; desc: string; previewBg: string }[] = [
    {
      id: 'vibrant',
      name: 'الوضع الحيوي 🎨',
      icon: Sparkles,
      desc: 'الألوان الأصلية المبهجة والواضحة',
      previewBg: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'eye-care',
      name: 'راحة العين 👓',
      icon: Eye,
      desc: 'نغمات كهرمانية دافئة تقلل إجهاد الشاشة',
      previewBg: 'from-amber-600 to-yellow-600',
    },
    {
      id: 'dark',
      name: 'الوضع الليلي 🌙',
      icon: Moon,
      desc: 'خلفية داكنة هادئة للقراءة الليلية',
      previewBg: 'from-slate-800 to-slate-900',
    },
  ];

  const SIZES: { id: FontSize; label: string; scaleLabel: string; sub: string }[] = [
    { id: 'normal', label: 'عادي', scaleLabel: 'A', sub: '100%' },
    { id: 'large', label: 'كبير', scaleLabel: 'A+', sub: '112%' },
    { id: 'xl', label: 'أكبر', scaleLabel: 'A++', sub: '125%' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        id="accessibility-settings-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs ${
          isOpen
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
            : theme === 'eye-care'
            ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
            : theme === 'dark'
            ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
            : 'bg-indigo-50/80 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
        }`}
        title="تخصيص العرض: حجم الخط ونمط راحة العين"
      >
        {theme === 'eye-care' ? (
          <Eye className="w-4 h-4 text-amber-800" />
        ) : theme === 'dark' ? (
          <Moon className="w-4 h-4 text-amber-300" />
        ) : (
          <SlidersHorizontal className="w-4 h-4" />
        )}
        <span className="hidden md:inline">
          {theme === 'eye-care' ? 'مريح للعين' : theme === 'dark' ? 'ليلي' : 'راحة العرض'}
        </span>
        <span className="text-[11px] font-mono opacity-80 px-1 py-0.5 rounded bg-black/10">
          {fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 sm:left-auto right-0 sm:right-0 mt-2 w-80 sm:w-88 p-5 bg-white rounded-3xl border-2 border-indigo-100 shadow-2xl z-50 space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">إمكانية الوصول وراحة العين</h4>
                  <p className="text-[11px] text-slate-500">تخصيص القراءة للدراسة المطولة</p>
                </div>
              </div>
            </div>

            {/* Font Size Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-indigo-600" />
                  <span>حجم الخط والنصوص:</span>
                </label>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {fontSize === 'normal' ? '100% قياسي' : fontSize === 'large' ? '112% كبير' : '125% مكبّر'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                {SIZES.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onFontSizeChange(s.id)}
                    className={`py-2 px-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center ${
                      fontSize === s.id
                        ? 'bg-white text-indigo-700 font-black shadow-xs ring-2 ring-indigo-500'
                        : 'text-slate-600 hover:text-slate-900 font-bold hover:bg-white/50'
                    }`}
                  >
                    <span className="text-base font-black font-mono">{s.scaleLabel}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Mode Section */}
            <div className="space-y-2.5">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>نمط الألوان وراحة البصر:</span>
              </label>

              <div className="space-y-2">
                {THEMES.map(t => {
                  const isSelected罕 = theme === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onThemeChange(t.id)}
                      className={`w-full p-3 rounded-2xl border-2 text-right transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected罕
                          ? 'bg-indigo-50/70 border-indigo-500 shadow-xs'
                          : 'bg-white border-slate-100 hover:border-indigo-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-tr ${t.previewBg} shadow-xs`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800">{t.name}</p>
                          <p className="text-[11px] text-slate-500 leading-tight">{t.desc}</p>
                        </div>
                      </div>

                      {isSelected罕 && (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Eye-Care Tip Notice */}
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-3 text-[11px] text-amber-950 flex items-start gap-2 leading-relaxed">
              <span className="text-base leading-none">💡</span>
              <p>
                <strong>نصيحة تقنية:</strong> يُنصح بتفعيل <strong>وضع راحة العين 👓</strong> أثناء حل الواجبات المسائية والمذاكرة لتقليل إجهاد النظر وتحسين التركيز.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
