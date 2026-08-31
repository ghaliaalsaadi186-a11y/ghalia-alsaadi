import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, Filter, Check, RotateCw, Volume2, ArrowRight } from 'lucide-react';
import { GLOSSARY_ITEMS } from '../data/lessonsData';
import { GlossaryTerm } from '../types';

export const GlossaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<string>('all');
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const filteredTerms = GLOSSARY_ITEMS.filter(item => {
    const matchesSearch = 
      item.termAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.termEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLesson = selectedLesson === 'all' || item.lessonId === selectedLesson;
    return matchesSearch && matchesLesson;
  });

  const activeCard = filteredTerms[currentCardIdx] || filteredTerms[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-sky-200">
            📖
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              معجم المصطلحات والمفاهيم الرقمية
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              جميع المصطلحات العلمية باللغتين العربية والإنجليزية الواردة في كتاب الصف الثامن
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <button
          onClick={() => {
            setFlashcardMode(!flashcardMode);
            setIsFlipped(false);
            setCurrentCardIdx(0);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            flashcardMode 
              ? 'bg-sky-600 text-white shadow-xs' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{flashcardMode ? 'عرض كقائمة معجم' : 'وضع البطاقات التعليمية (Flashcards)'}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ابحثي عن مصطلح بالعربية أو بالإنجليزية (مثلاً: النموذج، Formula، IF...)"
            className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setSelectedLesson('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedLesson === 'all' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل ({GLOSSARY_ITEMS.length})
          </button>
          <button
            onClick={() => setSelectedLesson('lesson-1-1')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedLesson === 'lesson-1-1' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الدرس 1-1 (النماذج)
          </button>
          <button
            onClick={() => setSelectedLesson('lesson-1-2')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedLesson === 'lesson-1-2' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الدرس 1-2 (جداول البيانات)
          </button>
          <button
            onClick={() => setSelectedLesson('lesson-1-3')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedLesson === 'lesson-1-3' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الدرس 1-3 (التنبؤ)
          </button>
        </div>
      </div>

      {/* View Content: Flashcard or Term Cards List */}
      {flashcardMode ? (
        filteredTerms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 text-sm">لا توجد مصطلحات مطابقة لبحثكِ.</p>
          </div>
        ) : (
          /* Flashcard View */
          <div className="max-w-md mx-auto space-y-4">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 rounded-3xl shadow-lg border border-slate-800 min-h-[260px] flex flex-col justify-between cursor-pointer transition-transform duration-300 hover:scale-[1.01] text-center"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>بطاقة {currentCardIdx + 1} من {filteredTerms.length}</span>
                <span className="flex items-center gap-1 text-sky-400 font-bold">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>انقري للقلب</span>
                </span>
              </div>

              {!isFlipped ? (
                /* Front side: Term */
                <div className="space-y-2 py-4">
                  <h3 className="text-2xl sm:text-3xl font-black text-amber-300">
                    {activeCard.termAr}
                  </h3>
                  <p className="text-sm font-mono text-slate-300 tracking-wide">
                    {activeCard.termEn}
                  </p>
                </div>
              ) : (
                /* Back side: Definition & Example */
                <div className="space-y-3 py-2 text-right">
                  <p className="text-sm text-slate-100 leading-relaxed font-semibold">
                    {activeCard.definition}
                  </p>
                  {activeCard.example && (
                    <div className="bg-white/10 p-2.5 rounded-xl text-xs text-sky-300">
                      💡 <strong>مثال:</strong> {activeCard.example}
                    </div>
                  )}
                </div>
              )}

              <div className="text-[11px] text-slate-400">
                {isFlipped ? 'انقري للمصطلح' : 'انقري لمعرفة التعريف'}
              </div>
            </div>

            {/* Flashcard Next/Prev buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentCardIdx(prev => (prev > 0 ? prev - 1 : filteredTerms.length - 1));
                }}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                السابق
              </button>

              <span className="text-xs text-slate-500 font-mono">
                {currentCardIdx + 1} / {filteredTerms.length}
              </span>

              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentCardIdx(prev => (prev < filteredTerms.length - 1 ? prev + 1 : 0));
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-2xs hover:bg-sky-700"
              >
                التالي
              </button>
            </div>
          </div>
        )
      ) : (
        /* Regular List View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-sky-300 hover:shadow-xs transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">{item.termAr}</h4>
                  <span className="text-xs font-mono font-bold text-sky-700 block">{item.termEn}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {item.lessonId.replace('lesson-', 'الدرس ')}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.definition}
              </p>

              {item.example && (
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[11px] text-slate-700">
                  💡 <strong>مثال من الكتاب:</strong> {item.example}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
