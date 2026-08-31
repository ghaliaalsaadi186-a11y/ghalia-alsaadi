import React, { useRef } from 'react';
import { 
  Trophy, 
  Award, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  Star, 
  Lock, 
  GraduationCap, 
  ClipboardCheck, 
  TableProperties, 
  TrendingUp, 
  Gamepad2, 
  Share2 
} from 'lucide-react';
import { StudentProfile } from '../types';
import { BADGES_LIST } from '../data/lessonsData';

interface AchievementsViewProps {
  student: StudentProfile;
  onOpenProfileModal: () => void;
}

const BADGE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  ClipboardCheck,
  TableProperties,
  TrendingUp,
  Award,
  Crown,
  Gamepad2
};

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  student,
  onOpenProfileModal
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrintCertificate = () => {
    window.print();
  };

  const unlockedCount = student.unlockedBadges.length;
  const totalBadges = BADGES_LIST.length;
  const passedLessonsCount = student.completedLessons.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-pink-200">
            🏆
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              لوحة إنجازاتي وأوسمة التميز
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              تابعي تقدمكِ في مادة تقنية المعلومات واحصلي على شهادة التفوق المعتمدة
            </p>
          </div>
        </div>

        <button
          onClick={onOpenProfileModal}
          className="px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-indigo-200"
        >
          <span>تعديل الاسم والشعبة</span>
        </button>
      </div>

      {/* Stats Summary Grid - Vibrant Palette */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-emerald-100 shadow-sm">
          <span className="text-xs font-bold text-emerald-800 block mb-1">الدروس المكتملة</span>
          <div className="text-3xl font-black text-emerald-600 font-mono">
            {passedLessonsCount} / 4
          </div>
          <span className="text-xs text-slate-500 font-medium">دروس الوحدة الأولى</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-amber-100 shadow-sm">
          <span className="text-xs font-bold text-amber-800 block mb-1">مجموع النقاط (XP)</span>
          <div className="text-3xl font-black text-amber-600 font-mono">
            {student.xp.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 font-medium">المستوى {student.level}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-purple-100 shadow-sm">
          <span className="text-xs font-bold text-purple-800 block mb-1">الأوسمة المكتسبة</span>
          <div className="text-3xl font-black text-purple-600 font-mono">
            {unlockedCount} / {totalBadges}
          </div>
          <span className="text-xs text-slate-500 font-medium">أوسمة إتقان</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-sky-100 shadow-sm">
          <span className="text-xs font-bold text-sky-800 block mb-1">الاختبار الشامل</span>
          <div className="text-3xl font-black text-sky-600 font-mono">
            {student.finalExamScore ? `${student.finalExamScore.percentage}%` : 'لم يُجر بعد'}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {student.finalExamScore && student.finalExamScore.percentage >= 85 ? 'درجة امتياز 👑' : '16 سؤال'}
          </span>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-indigo-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>خزانة الأوسمة والشارات المكتسبة</span>
          </h3>
          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {unlockedCount} من {totalBadges} شارة مفتوحة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES_LIST.map((badge, bIdx) => {
            const isUnlocked = student.unlockedBadges.includes(badge.id);
            const IconComp = BADGE_ICONS[badge.icon] || Award;
            const badgeBgColors = [
              'bg-pink-100 text-pink-700 border-pink-200',
              'bg-blue-100 text-blue-700 border-blue-200',
              'bg-emerald-100 text-emerald-700 border-emerald-200',
              'bg-purple-100 text-purple-700 border-purple-200',
              'bg-amber-100 text-amber-700 border-amber-200',
              'bg-indigo-100 text-indigo-700 border-indigo-200',
            ];
            const colorClass = badgeBgColors[bIdx % badgeBgColors.length];

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border-2 transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-white border-indigo-200 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border text-2xl ${
                    isUnlocked ? colorClass : 'bg-slate-200 text-slate-400 border-slate-300'
                  }`}
                >
                  {isUnlocked ? <IconComp className="w-7 h-7" /> : <Lock className="w-6 h-6" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm text-slate-900">{badge.title}</h4>
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{badge.description}</p>
                  <span className="text-[10px] text-indigo-700 font-bold block pt-1">
                    🎯 الشرط: {badge.conditionDescription}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Certificate of Mastery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>شهادة التفوق والإتقان المعتمدة</span>
            </h3>
            <p className="text-xs text-slate-500">
              تُمنح للطالبة عند إكمال مهارات الوحدة الأولى واجتياز الاختبار النهائي.
            </p>
          </div>

          <button
            onClick={handlePrintCertificate}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الشهادة</span>
          </button>
        </div>

        {/* The Printable Certificate Design */}
        <div 
          ref={certificateRef}
          id="official-student-certificate"
          className="bg-gradient-to-b from-amber-50/40 via-white to-amber-50/40 border-8 border-double border-amber-600/40 rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden text-center space-y-6"
        >
          {/* Watermark Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-9xl">
            📊
          </div>

          {/* Certificate Header */}
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest text-amber-800 uppercase block">
              سلطنة عُمان • وزارة التربية والتعليم
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif">
              شهادة تفوق وإتقان رقمي
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2" />
          </div>

          {/* Certificate Body */}
          <div className="space-y-3 max-w-xl mx-auto py-2">
            <p className="text-sm text-slate-600">
              يَسر منصة <strong>"رحلتي مع البيانات وExcel"</strong> أن تشهد بأن الطالبة المتميزة:
            </p>
            <div className="text-2xl sm:text-3xl font-black text-emerald-900 border-b-2 border-dashed border-amber-300 pb-2 inline-block px-8 font-serif">
              {student.name || 'طالبة الصف الثامن'}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
              من <strong>({student.grade || 'الصف الثامن'})</strong>، قد أتمت بنجاح واقتدار كافة متطلبات وتدريبات:
              <br />
              <strong className="text-slate-900 text-sm sm:text-base">الوحدة الأولى: تنظيم البيانات ومشاركتها عبر الإنترنت</strong>
              <br />
              (النماذج الإلكترونية Google Forms، دوال وتحليل جداول البيانات Sheets & Excel، وبناء النماذج الحاسوبية والتنبؤ).
            </p>
          </div>

          {/* Certificate Footer with Ribbon Seal & Date */}
          <div className="pt-6 border-t border-amber-200/80 flex items-center justify-between max-w-lg mx-auto text-xs text-slate-600">
            <div className="text-right">
              <span className="block text-[11px] text-slate-400">تاريخ الإصدار:</span>
              <span className="font-bold font-mono text-slate-800">{new Date().toLocaleDateString('ar-OM')}</span>
            </div>

            {/* Golden Seal */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-amber-950 flex flex-col items-center justify-center font-bold shadow-md ring-4 ring-amber-200">
              <Crown className="w-5 h-5 text-amber-950 mb-0.5" />
              <span className="text-[9px] font-black uppercase">معتمد</span>
            </div>

            <div className="text-left">
              <span className="block text-[11px] text-slate-400">مجموع النقاط:</span>
              <span className="font-bold font-mono text-emerald-700">{student.xp} XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
