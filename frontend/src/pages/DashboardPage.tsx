import { useApp } from '../store/AppContext';
import { Users, Heart, Clock, Layers, Settings, Info, UserPlus, TrendingUp } from 'lucide-react';
import Avatar from '../components/Avatar';
import { Primary, Surface, Success, Warning, Danger, Gender, Static, Composites } from '../theme';
import { useI18n } from '../i18n';
import { motion } from 'motion/react';

interface DashboardPageProps {
  onNavigate?: (tab: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const {
    profiles,
    communities,
    requests,
    totalProfiles,
    maleCount,
    femaleCount,
    pendingRequestsCount,
    acceptedRequestsCount,
    handleOpenAddForm,
    handleUpdateStatus,
    getCompositeScore,
    jothidamWeight,
    setJothidamWeight,
    expectationWeight,
    setExpectationWeight,
  } = useApp();
  
  const { t } = useI18n();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full min-h-screen bg-slate-50/50">

      {/* Header & Quick Action */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight`}>{t('dashboardTitle')}</h2>
          <p className={`text-sm text-slate-500 mt-1.5 font-medium`}>{t('dashboardSubtitle')}</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className={`flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all`}
        >
          <UserPlus className="h-4 w-4" />
          <span>New Registration</span>
        </button>
      </motion.div>

      {/* Top Row Overview Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className={`p-3.5 bg-blue-50 text-blue-600 rounded-2xl`}>
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className={`text-xs font-semibold text-slate-400 uppercase tracking-wider`}>Total Profiles</p>
              <p className={`text-3xl font-bold text-slate-800 mt-1 tracking-tight`}>{totalProfiles}</p>
              <p className={`text-[11px] text-slate-500 mt-1 font-medium`}><span className="text-blue-600 font-semibold">{maleCount} M</span> / <span className="text-pink-600 font-semibold">{femaleCount} F</span></p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className={`p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl`}>
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <p className={`text-xs font-semibold text-slate-400 uppercase tracking-wider`}>Success Matches</p>
              <p className={`text-3xl font-bold text-slate-800 mt-1 tracking-tight`}>{acceptedRequestsCount}</p>
              <p className={`text-[11px] text-emerald-600 font-medium mt-1 flex items-center`}><TrendingUp className="w-3 h-3 mr-1"/> Connecting hearts</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className={`p-3.5 bg-amber-50 text-amber-600 rounded-2xl`}>
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className={`text-xs font-semibold text-slate-400 uppercase tracking-wider`}>Pending Requests</p>
              <p className={`text-3xl font-bold text-slate-800 mt-1 tracking-tight`}>{pendingRequestsCount}</p>
              <p className={`text-[11px] text-amber-600 font-medium mt-1`}>Awaiting responses</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className={`p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl`}>
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className={`text-xs font-semibold text-slate-400 uppercase tracking-wider`}>Communities</p>
              <p className={`text-3xl font-bold text-slate-800 mt-1 tracking-tight`}>{communities.length}</p>
              <p className={`text-[11px] text-indigo-600 font-medium mt-1`}>Active categories</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Middle Section: Regional stats & Matching matrix helper */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Community Spread List */}
        <motion.div variants={itemVariants} className={`bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2 flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className={`font-bold text-base text-slate-800 tracking-tight`}>Community Distribution</h3>
              <p className={`text-xs text-slate-500 mt-1`}>Profile breakdown by associated regional franchises.</p>
            </div>
          </div>

          <div className="space-y-4">
            {communities.map(comm => {
              const count = profiles.filter(p => p.community === comm.name).length;
              const pct = totalProfiles > 0 ? Math.round((count / totalProfiles) * 100) : 0;
              return (
                <div key={comm.id} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className={`text-sm font-bold text-slate-700`}>{comm.name}</p>
                      <p className={`text-[11px] text-slate-400 mt-0.5`}>{comm.region} • <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-600">{comm.code}</span></p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold text-slate-800`}>{count} <span className="text-slate-400 font-medium">profiles</span></p>
                      <p className="text-[10px] font-bold text-indigo-600">{pct}%</p>
                    </div>
                  </div>
                  <div className={`w-full bg-slate-100 h-2 rounded-full overflow-hidden`}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`bg-indigo-500 h-full rounded-full`} 
                    />
                  </div>
                </div>
              );
            })}
            {communities.length === 0 && (
              <div className="py-8 text-center text-sm text-slate-400 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                No active communities found.
              </div>
            )}
          </div>
        </motion.div>

        {/* Astrological & Expectation weights helper */}
        <motion.div variants={itemVariants} className={`bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col space-y-6`}>
          <div>
            <h3 className={`font-bold text-base text-slate-800 tracking-tight flex items-center space-x-2`}>
              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Settings className="h-4 w-4" /></div>
              <span>Match Engine Weights</span>
            </h3>
            <p className={`text-xs text-slate-500 mt-2 leading-relaxed`}>Fine-tune the AI matching algorithm balance across the platform.</p>
          </div>

          <div className="space-y-6 flex-grow">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-3">
                <span>Jothidam (Astrology)</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{Math.round(jothidamWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={jothidamWeight}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setJothidamWeight(val);
                  setExpectationWeight(1 - val);
                }}
                className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className={`text-[10px] text-slate-400 mt-2.5`}>Emphasizes Dasavida Porutham and Dosham checks.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-3">
                <span>Practical Expectations</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{Math.round(expectationWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={expectationWeight}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setExpectationWeight(val);
                  setJothidamWeight(1 - val);
                }}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className={`text-[10px] text-slate-400 mt-2.5`}>Emphasizes Education, Career, Income, and Location.</p>
            </div>
          </div>

          <div className={`p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start space-x-3`}>
            <Info className={`h-4 w-4 text-indigo-500 shrink-0 mt-0.5`} />
            <p className={`text-[11px] leading-relaxed text-indigo-900/80`}>
              <strong>Note:</strong> These global weights affect how compatibility scores are generated platform-wide. Individual users can still override these in their profile settings.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Row: Active Pending Communication Requests */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`bg-white p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-sm`}>
        <div className={`flex items-center justify-between pb-5 border-b border-slate-100`}>
          <div>
            <h3 className={`font-bold text-base text-slate-800 tracking-tight`}>Recent Connection Requests</h3>
            <p className={`text-xs text-slate-500 mt-1`}>Manage direct contact inquiries between candidates.</p>
          </div>
          <span className={`bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-slate-200`}>
            {requests.length} Total
          </span>
        </div>

        <div className="mt-5 overflow-x-auto">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 text-slate-300" />
              </div>
              <p className={`text-sm font-medium text-slate-600`}>No active requests</p>
              <p className="text-xs text-slate-400 mt-1">When candidates show interest, their requests will appear here.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className={`text-slate-400 font-bold border-b border-slate-100 text-xs tracking-wide uppercase`}>
                  <th className="pb-3 font-semibold">Initiator</th>
                  <th className="pb-3 font-semibold">Recipient</th>
                  <th className="pb-3 font-semibold">Compatibility</th>
                  <th className="pb-3 font-semibold text-right">Action / Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-slate-50 font-medium`}>
                {requests.map(req => {
                  const sender = profiles.find(p => p.id === req.senderId);
                  const receiver = profiles.find(p => p.id === req.receiverId);
                  if (!sender || !receiver) return null;

                  const mathStat = getCompositeScore(
                    sender.gender === 'Female' ? sender : receiver,
                    sender.gender === 'Male' ? sender : receiver
                  );

                  return (
                    <tr key={req.id} className={`text-slate-700 hover:bg-slate-50/50 transition-colors`}>
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar type={sender.avatarUrl} className="h-9 w-9 border border-slate-200 shadow-sm" />
                          <div>
                            <p className={`font-bold text-slate-800 text-sm`}>{sender.name}</p>
                            <p className={`text-xs text-slate-500 font-medium`}>{sender.community}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar type={receiver.avatarUrl} className="h-9 w-9 border border-slate-200 shadow-sm" />
                          <div>
                            <p className={`font-bold text-slate-800 text-sm`}>{receiver.name}</p>
                            <p className={`text-xs text-slate-500 font-medium`}>{receiver.community}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className={`inline-flex items-center space-x-1.5 font-bold ${mathStat.hasRajju ? 'text-rose-600' : 'text-emerald-600'} text-sm`}>
                            <span>{mathStat.percentage}% Match</span>
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5">{mathStat.rating} • {mathStat.hasRajju ? 'Rajju Dosham' : 'No Dosham'}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        {req.status === 'Pending' ? (
                          <div className="inline-flex space-x-2 justify-end">
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'Accepted')}
                              className={`bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors`}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'Declined')}
                              className={`bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors`}
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                            req.status === 'Accepted' ? `bg-emerald-50 text-emerald-700 border border-emerald-200` : `bg-rose-50 text-rose-700 border border-rose-200`
                          }`}>
                            {req.status}
                          </span>
                        )}
                        <div className="text-[10px] text-slate-400 mt-1.5">
                           Sent {new Date(req.sentAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
