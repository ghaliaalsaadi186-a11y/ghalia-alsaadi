import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  FileText, 
  ListChecks, 
  ShieldCheck, 
  Share2, 
  LayoutGrid, 
  Percent, 
  Cpu, 
  Scissors, 
  Scale, 
  Binary, 
  BarChart3, 
  FileQuestion, 
  Calculator, 
  Users, 
  Maximize2, 
  RotateCcw 
} from 'lucide-react';
import { SlideItem } from '../types';

interface InteractiveSlideDeckProps {
  slides: SlideItem[];
  lessonTitle: string;
  lessonNumber: string;
  color?: string;
  onComplete?: () => void;
}

const ICONS_MAP: Record<string, React.FC<{ className?: string }>> = {
  FileText,
  ListChecks,
  ShieldCheck,
  Share2,
  LayoutGrid,
  Percent,
  Cpu,
  Scissors,
  Sparkles,
  Scale,
  Binary,
  BarChart3,
  FileQuestion,
  Calculator,
  Users
};

export const InteractiveSlideDeck: React.FC<InteractiveSlideDeckProps> = ({
  slides,
  lessonTitle,
  lessonNumber,
  color = 'emerald',
  onComplete
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slide = slides[currentSlideIndex];
  const totalSlides = slides.length;
  const isFirst = currentSlideIndex === 0;
  const isLast = currentSlideIndex === totalSlides - 1;

  const handleNext = () => {
    if (!isLast) {
      setCurrentSlideIndex(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const IconComponent = (slide && ICONS_MAP[slide.iconName]) || Sparkles;

  return (
    <div id="interactive-slide-deck" className="bg-white rounded-3xl border-2 border-indigo-100 shadow-sm overflow-hidden flex flex-col">
      
      {/* Top Slide Header Bar */}
      <div className="bg-indigo-950 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-amber-300 font-mono text-xs font-black border border-indigo-400/40">
            شريحة {currentSlideIndex + 1} من {totalSlides}
          </span>
          <span className="text-xs sm:text-sm font-bold text-indigo-100 truncate max-w-xs sm:max-w-md">
            {lessonTitle}
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlideIndex 
                  ? 'w-7 bg-amber-400 shadow-xs' 
                  : 'w-2.5 bg-indigo-800 hover:bg-indigo-600'
              }`}
              title={`الانتقال إلى الشريحة ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Slide Body Canvas */}
      <div className="p-6 sm:p-10 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between bg-gradient-to-b from-slate-50/50 to-white overflow-hidden">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Badge & Icon Title */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs border border-indigo-200 text-2xl shrink-0">
                  <IconComponent className="w-6 h-6 text-indigo-700" />
                </div>
                <div>
                  {slide.badgeText && (
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 mb-1 inline-block">
                      {slide.badgeText}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    {slide.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Concise Summary Paragraph */}
            <div className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed mb-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              {slide.summary}
            </div>

            {/* Key Bullet Points */}
            <div className="space-y-3 mb-6">
              {slide.bulletPoints.map((point, pIdx) => (
                <div key={pIdx} className="flex items-start gap-3 text-slate-800 text-sm sm:text-base font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Textbook Example Box */}
            {slide.example && (
              <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-2xl p-4 flex items-start gap-3 text-indigo-950 text-xs sm:text-sm">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-indigo-900 block mb-0.5">مثال من محتوى كتاب الطالب:</span>
                  <p className="text-indigo-800 leading-relaxed">{slide.example}</p>
                </div>
              </div>
            )}

            {/* Pro Tip if any */}
            {slide.tip && (
              <div className="mt-3.5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-2.5 text-amber-950 text-xs sm:text-sm">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong className="text-amber-900 font-bold">إضاءة ذكية:</strong> {slide.tip}</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Bottom Controls */}
        <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
          <button
            id="slide-prev-btn"
            onClick={handlePrev}
            disabled={isFirst}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isFirst 
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' 
                : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>الشريحة السابقة</span>
          </button>

          <span className="text-xs font-black text-slate-400 font-mono bg-slate-100 px-3 py-1 rounded-full">
            {currentSlideIndex + 1} / {totalSlides}
          </span>

          <button
            id="slide-next-btn"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl text-sm font-black flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 active:scale-95 transition-all cursor-pointer"
          >
            <span>{isLast ? 'إتمام العرض التقديمي' : 'الشريحة التالية'}</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
