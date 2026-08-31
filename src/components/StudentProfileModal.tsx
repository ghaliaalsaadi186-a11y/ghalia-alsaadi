import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Check, User, Sparkles } from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentProfileModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<StudentProfile>) => void;
}

const AVATARS = ['👩‍🎓', '👩‍💻', '🌟', '🌸', '🚀', '⚡', '💡', '🏆'];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(student.name);
  const [grade, setGrade] = useState(student.grade);
  const [avatar, setAvatar] = useState(student.avatar || '👩‍🎓');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, grade, avatar });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Animated Modal Dialog */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative z-10 bg-white rounded-3xl border-2 border-indigo-100 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    الملف الشخصي للطالبة
                  </h3>
                  <p className="text-xs text-slate-400">تخصيص البيانات والرمز التعبيري</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  اختاري الرمز التعبيري المفضل:
                </label>
                <div className="flex items-center gap-2.5 flex-wrap justify-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {AVATARS.map((av, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAvatar(av)}
                      className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center transition-all cursor-pointer ${
                        avatar === av 
                          ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-110 shadow-sm' 
                          : 'bg-white hover:bg-indigo-50/50 border border-slate-200/60'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  اسم الطالبة الثلاثي (ليظهر في الشهادة):
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="مثال: فاطمة بنت علي الزدجالية"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-semibold"
                />
              </div>

              {/* Grade / Section input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  الصف والشعبة:
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  placeholder="مثال: الصف الثامن / 1"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-semibold"
                />
              </div>

              {/* Save button */}
              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
