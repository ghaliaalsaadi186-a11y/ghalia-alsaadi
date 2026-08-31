import React from 'react';
import { Sparkles, Trophy, BookOpen, Gamepad2, GraduationCap, FileCheck } from 'lucide-react';
import { StudentProfile, ViewState, ThemeMode, FontSize } from '../types';
import { AccessibilityControls } from './AccessibilityControls';

interface HeaderProps {
  student: StudentProfile;
  activeView: ViewState | string;
  onNavigate?: (view: ViewState) => void;
  setActiveView?: (view: ViewState) => void;
  onOpenProfileModal: () => void;
  theme: ThemeMode;
  fontSize: FontSize;
  onThemeChange: (theme: ThemeMode) => void;
  onFontSizeChange: (size: FontSize) => void;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  activeView,
  onNavigate,
  setActiveView,
  onOpenProfileModal,
  theme,
  fontSize,
  onThemeChange,
  onFontSizeChange,
}) => {
  const handleNav = (view: ViewState) => {
    if (onNavigate) onNavigate(view);
    else if (setActiveView) setActiveView(view);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b-4 border-indigo-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo & App Name */}
          <div 
            id="app-brand-button"
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-indigo-700 tracking-tight">
                  تقني 8
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-800 rounded-full border border-indigo-200">
                  الصف الثامن
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                تقنية المعلومات • الوحدة الأولى: تنظيم البيانات ومشاركتها عبر الإنترنت
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              id="nav-home"
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'home' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>الرئيسية والدروس</span>
            </button>

            <button
              id="nav-games"
              onClick={() => handleNav('games')}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'games' 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200' 
                  : 'text-slate-600 hover:text-purple-600 hover:bg-white'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>الألعاب</span>
            </button>

            <button
              id="nav-final-exam"
              onClick={() => handleNav('final-exam')}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'final-exam' 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200' 
                  : 'text-slate-600 hover:text-amber-600 hover:bg-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>الاختبارات</span>
            </button>

            <button
              id="nav-achievements"
              onClick={() => handleNav('achievements')}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'achievements' 
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-200' 
                  : 'text-slate-600 hover:text-pink-600 hover:bg-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>إنجازاتي</span>
            </button>

            <button
              id="nav-glossary"
              onClick={() => handleNav('glossary')}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'glossary' 
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-200' 
                  : 'text-slate-600 hover:text-sky-600 hover:bg-white'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>المصطلحات</span>
            </button>
          </nav>

          {/* Student Status Profile & Accessibility Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Accessibility & Font Size Dropdown */}
            <AccessibilityControls
              theme={theme}
              fontSize={fontSize}
              onThemeChange={onThemeChange}
              onFontSizeChange={onFontSizeChange}
            />

            {/* XP Points Pill */}
            <div 
              id="student-xp-pill"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-full bg-amber-100 border border-amber-200 text-amber-700 font-bold text-xs sm:text-sm shadow-xs"
              title="مجموع نقاط الخبرة المكتسبة"
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="font-mono font-black">{student.xp.toLocaleString()}</span>
              <span className="text-xs text-amber-700 font-medium hidden sm:inline">نقطة</span>
            </div>

            {/* Profile trigger */}
            <button
              id="student-profile-button"
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-2xl hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 transition-all text-right group cursor-pointer"
              title="تعديل اسم الطالبة والشعبة"
            >
              <div className="text-left hidden sm:block">
                <p className="text-[10px] text-slate-400 font-bold">المستوى {student.level}</p>
                <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-700 truncate max-w-[100px]">
                  {student.name || 'طالبتي المبدعة'}
                </p>
              </div>

              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full border-2 border-indigo-400 p-0.5">
                <div className="w-full h-full rounded-full bg-pink-100 flex items-center justify-center text-base sm:text-lg overflow-hidden">
                  {student.avatar || '👩‍🎓'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-1.5 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => handleNav('home')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeView === 'home' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            الرئيسية
          </button>
          <button
            onClick={() => handleNav('games')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeView === 'games' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            الألعاب
          </button>
          <button
            onClick={() => handleNav('final-exam')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeView === 'final-exam' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            الاختبارات
          </button>
          <button
            onClick={() => handleNav('achievements')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeView === 'achievements' ? 'bg-pink-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            إنجازاتي
          </button>
          <button
            onClick={() => handleNav('glossary')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeView === 'glossary' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            المصطلحات
          </button>
        </div>
      </div>
    </header>
  );
};

