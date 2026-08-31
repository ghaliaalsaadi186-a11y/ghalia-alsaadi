import React, { useState } from 'react';
import { Gamepad2, Sparkles, Trophy, ArrowRight, Star, Award } from 'lucide-react';
import { FormsGame } from './FormsGame';
import { FormulasGame } from './FormulasGame';
import { ForecastingGame } from './ForecastingGame';

interface GamesArenaProps {
  onAwardXp: (amount: number) => void;
  onBackToHome: () => void;
}

export const GamesArena: React.FC<GamesArenaProps> = ({ onAwardXp, onBackToHome }) => {
  const [selectedGame, setSelectedGame] = useState<'forms' | 'formulas' | 'forecasting' | null>(null);

  const GAMES = [
    {
      id: 'forms' as const,
      title: 'تحدي خبيرة النماذج الذكية',
      subtitle: 'مطابقة أنواع الأسئلة وقواعد التحقق (Response Validation) تحت الضغط والوقت',
      icon: '⚡',
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      tag: 'الدرس 1-1',
      stars: 3
    },
    {
      id: 'formulas' as const,
      title: 'تحدي مهندسة الدوال والمعادلات',
      subtitle: 'تركيب صيغ SUM, AVERAGE, IF, AND, LEFT وحل ألغاز البيانات بدقة متناهية',
      icon: '🧩',
      color: 'from-sky-500 to-blue-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      tag: 'الدرس 1-2',
      stars: 3
    },
    {
      id: 'forecasting' as const,
      title: 'تحدي مستكشفة المستقبل والتنبؤ',
      subtitle: 'فرز استخدامات وقيود النماذج الحاسوبية وتوقع سيناريوهات النمو والمخططات',
      icon: '🔮',
      color: 'from-indigo-500 to-teal-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      tag: 'الدرس 1-3',
      stars: 3
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-purple-200">
            🎮
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              صالة الألعاب والتحديات التفاعلية (Arcade Arena)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              العبي وتحدّي نفسكِ في مهارات الوحدة الأولى واكسبي نقاط خبرة (XP) وأوسمة إتقان!
            </p>
          </div>
        </div>

        {selectedGame && (
          <button
            onClick={() => setSelectedGame(null)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة الألعاب</span>
          </button>
        )}
      </div>

      {/* Main Container */}
      {!selectedGame ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GAMES.map((g) => (
            <div
              key={g.id}
              className={`${g.bgColor} rounded-3xl border ${g.borderColor} p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl group-hover:scale-110 transition-transform inline-block">
                    {g.icon}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/80 text-slate-700 border border-slate-200">
                    {g.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                    {g.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {g.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(g.stars)].map((_, sIdx) => (
                    <Star key={sIdx} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-[11px] text-slate-500 font-bold mr-1">3 مستويات</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setSelectedGame(g.id)}
                  className={`w-full py-3 rounded-xl bg-gradient-to-r ${g.color} text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>ابدئي اللعبة واللعب</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {selectedGame === 'forms' && <FormsGame onScoreUpdate={onAwardXp} />}
          {selectedGame === 'formulas' && <FormulasGame onScoreUpdate={onAwardXp} />}
          {selectedGame === 'forecasting' && <ForecastingGame onScoreUpdate={onAwardXp} />}
        </div>
      )}
    </div>
  );
};
