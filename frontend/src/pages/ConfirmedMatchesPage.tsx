import React from 'react';
import { useApp } from '../store/AppContext';
import { HeartHandshake, Undo2, ShieldCheck, MapPin, Briefcase } from 'lucide-react';
import Avatar from '../components/Avatar';
import { motion } from 'motion/react';
import { useI18n } from '../i18n';

export default function ConfirmedMatchesPage() {
  const { t } = useI18n();
  const { profiles, handleUndoMatch } = useApp();

  // Find all matched couples
  // To avoid duplicates, only pick where p.gender === 'Male' and p.confirmedMatchedWith exists
  const maleMatches = profiles.filter(p => p.gender === 'Male' && p.confirmedMatchedWith);

  const matchedCouples = maleMatches.map(male => {
    const female = profiles.find(p => p.id === male.confirmedMatchedWith);
    return { male, female };
  }).filter(couple => couple.female); // Ensure female exists

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto w-full min-h-screen bg-slate-50/50">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
        <div className="bg-emerald-100 p-2.5 rounded-xl border border-emerald-200">
          <HeartHandshake className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Confirmed Matches</h2>
          <p className="text-sm text-slate-500 font-medium">Couples whose marriages have been fixed and locked from the matcher.</p>
        </div>
      </div>

      {matchedCouples.length === 0 ? (
        <div className="bg-white border border-slate-200/60 p-16 rounded-3xl text-center shadow-sm">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <ShieldCheck className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-bold text-slate-500">No confirmed matches yet.</p>
          <p className="text-xs font-medium text-slate-400 mt-2">Use the Matcher to find compatibility and confirm a match.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {matchedCouples.map(({ male, female }, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={male.id} 
              className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm flex flex-col"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
                
                <div className="flex flex-col items-center gap-2 z-10 w-1/3">
                  <Avatar type={male.avatarUrl || "Male"} className="w-16 h-16 border-2 border-white shadow-md" />
                  <span className="text-white font-bold text-sm text-center truncate w-full">{male.name}</span>
                </div>

                <div className="z-10 flex flex-col items-center justify-center w-1/3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 shadow-inner">
                    <HeartHandshake className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 z-10 w-1/3">
                  <Avatar type={female!.avatarUrl || "Female"} className="w-16 h-16 border-2 border-white shadow-md" />
                  <span className="text-white font-bold text-sm text-center truncate w-full">{female!.name}</span>
                </div>
              </div>

              <div className="p-5 flex-grow space-y-4">
                <div className="flex justify-between items-start text-xs font-medium text-slate-500">
                  <div className="space-y-1 w-1/2 pr-2 border-r border-slate-100">
                    <p className="flex items-center gap-1.5 truncate"><Briefcase className="w-3 h-3 text-slate-400" /> {male.jobType}</p>
                    <p className="flex items-center gap-1.5 truncate"><MapPin className="w-3 h-3 text-slate-400" /> {male.location}</p>
                  </div>
                  <div className="space-y-1 w-1/2 pl-2">
                    <p className="flex items-center gap-1.5 truncate"><Briefcase className="w-3 h-3 text-slate-400" /> {female!.jobType}</p>
                    <p className="flex items-center gap-1.5 truncate"><MapPin className="w-3 h-3 text-slate-400" /> {female!.location}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-50 bg-slate-50/50">
                <button
                  onClick={() => handleUndoMatch(male.id, female!.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-50 transition-colors text-xs font-bold"
                >
                  <Undo2 className="w-4 h-4" />
                  Undo Match
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
