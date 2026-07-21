import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { AlertTriangle, CheckCircle, HeartHandshake, RefreshCw, Sparkles, Check, Search, ChevronDown, User, Star, ShieldAlert } from 'lucide-react';
import Avatar from '../components/Avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';

export default function MatcherPage() {
  const { t } = useI18n();
  const {
    profiles,
    matcherGender,
    setMatcherGender,
    matcherPrimaryProfileId,
    setMatcherPrimaryProfileId,
    matcherMatches,
    matcherSelectedMatch,
    setMatcherSelectedMatch,
    isMatcherLoading,
    currentBride,
    currentGroom,
    matchingResult,
    aiAnalysisText,
    setAiAnalysisText,
    isAiAnalyzing,
    currentUser,
    handleSendRequest,
    handleAiAdvisory,
    handleUpdateProfileData,
    showToast,
    handleConfirmMatch,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownScrollRef = useRef<HTMLDivElement>(null);

  // Infinite scroll state
  const [displayCount, setDisplayCount] = useState(15);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const BATCH_SIZE = 15;

  const primaryCandidate = profiles.find(p => p.id === matcherPrimaryProfileId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setDisplayCount(BATCH_SIZE);
  }, [isDropdownOpen, searchTerm]);

  const genderCandidates = profiles.filter(p => p.gender === matcherGender && p.approvedByAdmin && !p.confirmedMatchedWith);

  const filteredCandidates = genderCandidates.filter(p => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.registrationId || '').toLowerCase().includes(term) ||
      p.nakshatra.toLowerCase().includes(term) ||
      p.rasi.toLowerCase().includes(term) ||
      p.location.toLowerCase().includes(term) ||
      p.education.toLowerCase().includes(term)
    );
  });

  const displayedCandidates = filteredCandidates.slice(0, displayCount);
  const hasMoreCandidates = displayCount < filteredCandidates.length;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrolledToBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 50;

    if (scrolledToBottom && hasMoreCandidates && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayCount(prev => Math.min(prev + BATCH_SIZE, filteredCandidates.length));
        setIsLoadingMore(false);
      }, 300);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full min-h-screen bg-slate-50/50">

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pb-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{t('matcherTitle')}</h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">{t('matcherSubtitle')}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm relative">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 rounded-l-3xl"></div>
        {/* Step 1: Select Gender */}
        <div className="space-y-3 z-10">
          <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 flex items-center gap-2">
            <span className="bg-slate-100 text-slate-600 w-5 h-5 rounded-full flex items-center justify-center">1</span>
            Select Primary Candidate Gender
          </label>
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all shadow-sm">
            <Select value={matcherGender} onValueChange={(val: any) => { if (val) { setMatcherGender(val); setAiAnalysisText(''); setSearchTerm(''); } }}>
              <SelectTrigger className="w-full bg-transparent border-none p-2 h-auto font-bold text-slate-800 text-sm focus:ring-0 focus:outline-none shadow-none">
                <SelectValue placeholder="Select Gender..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="Male" className="font-semibold text-sm py-2.5 focus:bg-indigo-50 focus:text-indigo-700 cursor-pointer">Male (ஆண்)</SelectItem>
                <SelectItem value="Female" className="font-semibold text-sm py-2.5 focus:bg-rose-50 focus:text-rose-700 cursor-pointer">Female (பெண்)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Step 2: Choose Candidate (Searchable Custom Combobox) */}
        <div className="space-y-3 z-10">
          <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 flex items-center gap-2">
            <span className="bg-slate-100 text-slate-600 w-5 h-5 rounded-full flex items-center justify-center">2</span>
            Choose {matcherGender} Candidate
          </label>

          <div ref={dropdownRef} className="relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 cursor-pointer hover:border-indigo-300 hover:bg-slate-50/80 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0 px-1">
                <div className="shrink-0">
                  {primaryCandidate ? <Avatar type={primaryCandidate.avatarUrl} className="h-10 w-10 ring-2 ring-white shadow-sm" /> : <div className="h-10 w-10 rounded-xl bg-slate-200/50 flex items-center justify-center"><User className="h-5 w-5 text-slate-400" /></div>}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">
                    {primaryCandidate ? primaryCandidate.name : "Search & Select Candidate"}
                  </p>
                  {primaryCandidate && (
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate">
                      {primaryCandidate.registrationId || primaryCandidate.id} • {primaryCandidate.nakshatra} ({primaryCandidate.rasi})
                    </p>
                  )}
                </div>
              </div>
              <div className={`p-1.5 rounded-lg ${isDropdownOpen ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200/50 text-slate-400'} transition-colors`}>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
              </div>
            </div>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  ref={dropdownScrollRef}
                  onScroll={handleScroll}
                  className="absolute z-50 left-0 right-0 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl max-h-[350px] overflow-y-auto space-y-2"
                >
                  {/* Search input field */}
                  <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl pb-2">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all">
                      <Search className="h-4 w-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Name, Reg ID, Star, City..."
                        className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none font-medium text-slate-800 placeholder-slate-400"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-3 flex justify-between">
                      <span>{displayedCandidates.length} of {filteredCandidates.length} results</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {filteredCandidates.length === 0 ? (
                      <div className="p-8 text-center text-sm font-medium text-slate-500">
                        No matching candidates found.
                      </div>
                    ) : (
                      <>
                        {displayedCandidates.map((p) => {
                          const isSelected = p.id === matcherPrimaryProfileId;
                          return (
                            <div
                              key={p.id}
                              onClick={() => {
                                setMatcherPrimaryProfileId(p.id);
                                setAiAnalysisText('');
                                setIsDropdownOpen(false);
                              }}
                              className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between ${isSelected ? 'bg-indigo-50/80 border border-indigo-100 shadow-sm' : 'hover:bg-slate-50 border border-transparent hover:border-slate-100'
                                }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <Avatar type={p.avatarUrl} className={`h-10 w-10 shrink-0 ${isSelected ? 'ring-2 ring-indigo-200' : ''}`} />
                                <div className="min-w-0">
                                  <p className={`text-sm font-bold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>{p.name}</p>
                                  <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">
                                    {p.registrationId || p.id.substring(0, 8)} • <span className="font-bold">{p.nakshatra}</span> ({p.rasi})
                                  </p>
                                  <p className="text-[9px] font-medium text-slate-400 truncate">
                                    {p.education} • {p.location}
                                  </p>
                                </div>
                              </div>
                              {isSelected && <div className="bg-indigo-100 p-1.5 rounded-full shrink-0"><Check className="h-3.5 w-3.5 text-indigo-600" /></div>}
                            </div>
                          );
                        })}

                        {isLoadingMore && (
                          <div className="p-4 text-center">
                            <RefreshCw className="h-5 w-5 animate-spin text-indigo-500 mx-auto" />
                            <p className="text-xs font-medium text-slate-400 mt-2">Loading more candidates...</p>
                          </div>
                        )}

                        {!isLoadingMore && hasMoreCandidates && (
                          <div className="p-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            ↓ Scroll to load more
                          </div>
                        )}

                        {!hasMoreCandidates && displayedCandidates.length > BATCH_SIZE && (
                          <div className="p-4 text-center text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                            — End of results —
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {isMatcherLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
            <div className="bg-indigo-50 p-4 rounded-full">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
            <p className="text-sm font-bold text-slate-600">Calculating compatibility scores on the backend...</p>
          </div>
        ) : matcherMatches.length === 0 ? (
          <div className="bg-white border border-slate-200/60 p-16 rounded-3xl text-center shadow-sm">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-500">No opposite gender candidate matches found.</p>
            <p className="text-xs font-medium text-slate-400 mt-2">Ensure there are registered, admin-verified candidates of the opposite gender.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 shadow-md">3</div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Compatibility Matches ({matcherGender === 'Male' ? 'Females' : 'Males'}) — Click any card to inspect
              </h3>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {matcherMatches.map((m) => {
                const score = m.matchResult.percentage;
                const isExcellent = score >= 70;
                const isGood = score >= 50 && score < 70;
                const colorTheme = isExcellent ? 'emerald' : isGood ? 'amber' : 'rose';

                return (
                  <motion.div
                    variants={itemVariants}
                    key={m.profile.id}
                    onClick={() => { setMatcherSelectedMatch(m); setAiAnalysisText(''); setIsModalOpen(true); }}
                    className="p-5 rounded-3xl border border-slate-200/60 bg-white hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar type={m.profile.avatarUrl} className={`h-12 w-12 shrink-0 ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all`} />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-700 transition-colors">{m.profile.name}</h4>
                        <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">{m.profile.age} yrs • {m.profile.registrationId || m.profile.id.substring(0, 6)}</p>
                        <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5">{m.profile.nakshatra}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end">
                      <div className={`text-lg font-black tracking-tight flex items-baseline gap-0.5 ${isExcellent ? 'text-emerald-600' : isGood ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                        {score}<span className="text-xs font-bold opacity-70">%</span>
                      </div>
                      <div className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">
                        Match
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Porutham Compatibility Dialog Modal */}
      <AnimatePresence>
        {matcherSelectedMatch && isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="min-w-[95vw] md:min-w-[80rem] max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-50/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-3xl">
              <DialogHeader className="px-8 pt-6 pb-4 border-b border-slate-200/60 bg-white flex-shrink-0">
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Star className="h-5 w-5 text-indigo-600 fill-indigo-100" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight text-slate-800">Astrological Compatibility Analysis</h2>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">In-depth matching evaluated against 10 vital Poruthams.</p>
                    </div>
                  </div>
                  <span className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm font-black shadow-sm">
                    {matchingResult?.poruthamScores ? matchingResult.poruthamScores.filter((s: any) => s.status === 'Uthamam' || s.status === 'Madhyamam').length * 10 : 0}% Match Score
                  </span>
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                  {/* Left Column: Overview Card */}
                  <div className="space-y-6">
                    {/* Visual Candidate Comparison */}
                    <div className="p-6 rounded-3xl border border-slate-200/60 bg-white shadow-sm flex items-center justify-between relative overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-transparent to-transparent"></div>

                      <div className="text-center space-y-2 z-10 w-2/5">
                        <Avatar type={primaryCandidate?.avatarUrl || ''} className="h-16 w-16 mx-auto ring-4 ring-indigo-50 shadow-md" />
                        <div>
                          <p className="text-sm font-extrabold text-slate-800 truncate px-2">{primaryCandidate?.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate">{primaryCandidate?.nakshatra}</p>
                        </div>
                      </div>

                      <div className="z-10 flex flex-col items-center justify-center shrink-0 w-1/5">
                        <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                          <span className="text-[10px] font-black text-slate-400">VS</span>
                        </div>
                      </div>

                      <div className="text-center space-y-2 z-10 w-2/5">
                        <Avatar type={matcherSelectedMatch.profile.avatarUrl} className="h-16 w-16 mx-auto ring-4 ring-rose-50 shadow-md" />
                        <div>
                          <p className="text-sm font-extrabold text-slate-800 truncate px-2">{matcherSelectedMatch.profile.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate">{matcherSelectedMatch.profile.nakshatra}</p>
                        </div>
                      </div>
                    </div>

                    {/* Score panel */}
                    <div className="p-8 rounded-3xl border border-slate-200/60 bg-white shadow-sm text-center space-y-6">
                      <p className="text-[11px] uppercase tracking-widest font-black text-slate-400">Match Gauge</p>

                      <div className="relative w-36 h-36 mx-auto flex items-center justify-center drop-shadow-md">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="72" cy="72" r="60" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                          <circle
                            cx="72"
                            cy="72"
                            r="60"
                            stroke={matchingResult?.hasRajjuDosham ? "#f43f5e" : "#6366f1"}
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 60}`}
                            strokeDashoffset={`${2 * Math.PI * 60 * (1 - (matchingResult?.percentage || 0) / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-4xl font-black text-slate-800 leading-none">
                            {matchingResult?.poruthamScores ? matchingResult.poruthamScores.filter((s: any) => s.status === 'Uthamam' || s.status === 'Madhyamam').length : 0}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">out of 10</span>
                        </div>
                      </div>

                      <div>
                        <span className={`inline-flex px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${matchingResult?.rating === 'Excellent'
                          ? `bg-emerald-50 text-emerald-600 border border-emerald-200`
                          : matchingResult?.rating === 'Good'
                            ? `bg-indigo-50 text-indigo-600 border border-indigo-200`
                            : matchingResult?.rating === 'Average'
                              ? `bg-amber-50 text-amber-600 border border-amber-200`
                              : `bg-rose-50 text-rose-600 border border-rose-200`
                          }`}>
                          {matchingResult?.rating} Compatibility
                        </span>
                      </div>
                      
                      <div className="pt-2">
                        <button 
                          onClick={async () => {
                            if (primaryCandidate && matcherSelectedMatch?.profile) {
                              await handleConfirmMatch(primaryCandidate.id, matcherSelectedMatch.profile.id);
                              setIsModalOpen(false);
                            }
                          }}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-3 px-4 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Confirm Match (திருமணம் முடிவானது)
                        </button>
                      </div>
                    </div>

                    {/* Dosham Alerts */}
                    <div className="space-y-3">
                      {matchingResult?.hasRajjuDosham && (
                        <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl flex items-start gap-3 shadow-sm">
                          <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-rose-900 leading-tight">Rajju Dosham (Friction Point)</p>
                            <p className="text-[11px] font-medium text-rose-700 mt-1 leading-relaxed">Both belong to the same Rajju group. Astrological adjustments are advised before proceeding.</p>
                          </div>
                        </div>
                      )}

                      {matchingResult?.hasVedhaDosham && (
                        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3 shadow-sm">
                          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-amber-900 leading-tight">Vedha Affliction Detected</p>
                            <p className="text-[11px] font-medium text-amber-700 mt-1 leading-relaxed">Mutual star clash. Indicates occasional stress or friction points according to the scriptures.</p>
                          </div>
                        </div>
                      )}

                      {!matchingResult?.hasRajjuDosham && !matchingResult?.hasVedhaDosham && (
                        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3 shadow-sm">
                          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-emerald-900 leading-tight">Auspicious Astro Protection</p>
                            <p className="text-[11px] font-medium text-emerald-700 mt-1 leading-relaxed">No Rajju or Vedha doshams present. Core safety rules are fully fulfilled.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Detailed 10-Poruthams scorecard */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 md:p-8 rounded-3xl border border-slate-200/60 bg-white shadow-sm space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">Detailed 10-Porutham Analysis</h3>
                        <p className="text-xs font-medium text-slate-500 mt-1">Dynamically evaluated based on Tamil scriptures by the backend matching engine.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {matchingResult?.poruthamScores?.map((scoreCard: any, idx: number) => {
                          const isUthamam = scoreCard.status === 'Uthamam';
                          const isMadhyamam = scoreCard.status === 'Madhyamam';
                          return (
                            <div
                              key={idx}
                              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-colors ${isUthamam
                                ? 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50'
                                : isMadhyamam
                                  ? 'bg-amber-50/50 border-amber-100 hover:bg-amber-50'
                                  : 'bg-rose-50/50 border-rose-100 hover:bg-rose-50'
                                }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-extrabold text-slate-800 truncate">{scoreCard.label}</span>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${isUthamam
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isMadhyamam
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                  }`}>
                                  {scoreCard.status} (+{scoreCard.score})
                                </span>
                              </div>
                              <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-3">{scoreCard.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {aiAnalysisText && (
                    <div className="col-span-full bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-3xl shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
                      </div>
                      <div className="relative z-10 space-y-5">
                        <div className="flex items-center gap-3 border-b border-indigo-800/50 pb-4">
                          <div className="bg-indigo-800/50 p-2 rounded-xl backdrop-blur-sm">
                            <Sparkles className="h-5 w-5 text-indigo-300" />
                          </div>
                          <h4 className="font-extrabold text-lg text-white">Gemini Professional Matrimonial Advice</h4>
                        </div>
                        <div className="text-sm leading-relaxed text-indigo-50/90 whitespace-pre-wrap font-medium">
                          {aiAnalysisText}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
