import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { AlertTriangle, CheckCircle, HeartHandshake, RefreshCw, Sparkles, Check, Search, ChevronDown } from 'lucide-react';
import Avatar from '../components/Avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Primary, Surface, Success, Warning, Danger, Static } from '../theme';

export default function MatcherPage() {
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
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownScrollRef = useRef<HTMLDivElement>(null);
  
  // Infinite scroll state
  const [displayCount, setDisplayCount] = useState(15); // Initially load 15 candidates
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const BATCH_SIZE = 15; // Load 15 more candidates each time

  const primaryCandidate = profiles.find(p => p.id === matcherPrimaryProfileId);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset display count when dropdown opens or search changes
  useEffect(() => {
    setDisplayCount(BATCH_SIZE);
  }, [isDropdownOpen, searchTerm]);

  // Filter candidates based on selected gender and search term
  const genderCandidates = profiles.filter(p => p.gender === matcherGender && p.approvedByAdmin);
  
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

  // Paginated candidates to display
  const displayedCandidates = filteredCandidates.slice(0, displayCount);
  const hasMoreCandidates = displayCount < filteredCandidates.length;

  // Handle scroll event for infinite loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrolledToBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 50;
    
    if (scrolledToBottom && hasMoreCandidates && !isLoadingMore) {
      setIsLoadingMore(true);
      
      // Simulate loading delay for smooth UX
      setTimeout(() => {
        setDisplayCount(prev => Math.min(prev + BATCH_SIZE, filteredCandidates.length));
        setIsLoadingMore(false);
      }, 300);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">

      <div className={`border-b ${Surface.border[200]} pb-4`}>
        <h2 className={`text-xl md:text-2xl font-bold ${Surface.text[900]} tracking-tight`}>Tamil Ten Porutham Astrological Matcher</h2>
        <p className={`text-xs ${Surface.text[500]} mt-1`}>Select a primary candidate and see their compatibility matches calculated directly from the backend astrology engine.</p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${Static.white} p-6 rounded-2xl border ${Surface.opacity.bd_200_80} shadow-xs`}>
        {/* Step 1: Select Gender */}
        <div className="space-y-2">
          <label className={`text-[10px] uppercase tracking-wider font-extrabold ${Surface.text[500]}`}>1. Select Primary Candidate Gender</label>
          <div className={`flex items-center space-x-3 ${Surface[50]} p-3.5 rounded-xl border ${Surface.border[200]}`}>
            <div className="flex-grow min-w-0">
              <Select value={matcherGender} onValueChange={(val: any) => { if (val) { setMatcherGender(val); setAiAnalysisText(''); setSearchTerm(''); } }}>
                <SelectTrigger className={`w-full ${Static.transparent} border-none p-0 h-auto font-bold ${Surface.text[800]} text-xs focus:ring-0 focus:outline-none shadow-none`}>
                  <SelectValue placeholder="Select Gender..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male (ஆண்)</SelectItem>
                  <SelectItem value="Female">Female (பெண்)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Step 2: Choose Candidate (Searchable Custom Combobox) */}
        <div className="space-y-2">
          <label className={`text-[10px] uppercase tracking-wider font-extrabold ${Surface.text[500]}`}>2. Choose {matcherGender} Candidate (Searchable)</label>
          
          <div ref={dropdownRef} className="relative">
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center justify-between space-x-3 ${Surface[50]} p-3.5 rounded-xl border ${Surface.border[200]} cursor-pointer`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="shrink-0">
                  {primaryCandidate ? <Avatar type={primaryCandidate.avatarUrl} className="h-10 w-10" /> : <div className={`h-10 w-10 rounded-xl ${Surface[200]}`} />}
                </div>
                <div className="min-w-0">
                  <p className={`font-bold ${Surface.text[800]} text-xs`}>
                    {primaryCandidate ? primaryCandidate.name : "Select Candidate"}
                  </p>
                  {primaryCandidate && (
                    <p className={`text-[10px] ${Surface.text[500]} mt-0.5`}>
                      {primaryCandidate.registrationId || primaryCandidate.id} • {primaryCandidate.nakshatra} ({primaryCandidate.rasi})
                    </p>
                  )}
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 ${Surface.text[400]} transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
              <div 
                ref={dropdownScrollRef}
                onScroll={handleScroll}
                className={`absolute z-50 left-0 right-0 mt-2 p-2 ${Static.white} border ${Surface.border[200]} rounded-xl shadow-lg max-h-80 overflow-y-auto space-y-2`}
              >
                {/* Search input field */}
                <div className={`sticky top-0 z-10 bg-white pb-2`}>
                  <div className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border ${Surface.border[200]} ${Surface[50]}`}>
                    <Search className={`h-3.5 w-3.5 ${Surface.text[400]}`} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by Name, Reg ID, Star, Rasi, City..."
                      className={`w-full bg-transparent border-none p-0 text-xs focus:ring-0 focus:outline-none font-medium ${Surface.text[800]}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  {/* Results count */}
                  <div className={`text-[9px] ${Surface.text[400]} px-2.5 pt-1.5`}>
                    Showing {displayedCandidates.length} of {filteredCandidates.length} candidates
                  </div>
                </div>

                <div className="space-y-1">
                  {filteredCandidates.length === 0 ? (
                    <div className={`p-4 text-center text-[10px] ${Surface.text[400]}`}>
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
                            className={`p-2 rounded-lg cursor-pointer transition flex items-center justify-between ${
                              isSelected ? `${Primary[50]} text-${Primary[800]}` : `hover:${Surface[50]}`
                            }`}
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <Avatar type={p.avatarUrl} className="h-8 w-8 shrink-0" />
                              <div className="min-w-0">
                                <p className={`text-xs font-bold ${Surface.text[900]}`}>{p.name}</p>
                                <p className={`text-[10px] ${Surface.text[500]}`}>
                                  {p.registrationId || p.id} • Star: {p.nakshatra} ({p.rasi})
                                </p>
                                <p className={`text-[9px] ${Surface.text[400]}`}>
                                  {p.education} • {p.location}
                                </p>
                              </div>
                            </div>
                            {isSelected && <Check className={`h-4 w-4 ${Primary.text[500]} shrink-0`} />}
                          </div>
                        );
                      })}
                      
                      {/* Loading indicator */}
                      {isLoadingMore && (
                        <div className={`p-3 text-center`}>
                          <RefreshCw className={`h-4 w-4 animate-spin ${Primary.text[500]} mx-auto`} />
                          <p className={`text-[9px] ${Surface.text[400]} mt-1`}>Loading more candidates...</p>
                        </div>
                      )}
                      
                      {/* Show "scroll for more" hint */}
                      {!isLoadingMore && hasMoreCandidates && (
                        <div className={`p-2 text-center text-[9px] ${Surface.text[400]} italic`}>
                          ↓ Scroll down to load {Math.min(BATCH_SIZE, filteredCandidates.length - displayCount)} more candidates
                        </div>
                      )}
                      
                      {/* End of results */}
                      {!hasMoreCandidates && displayedCandidates.length > BATCH_SIZE && (
                        <div className={`p-2 text-center text-[9px] ${Surface.text[400]}`}>
                          — End of results —
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMatcherLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
          <RefreshCw className={`h-8 w-8 animate-spin ${Primary.text[500]}`} />
          <p className={`text-xs ${Surface.text[500]}`}>Calculating compatibility matching on backend...</p>
        </div>
      ) : matcherMatches.length === 0 ? (
        <div className={`${Static.white} border ${Surface.border[200]} p-12 rounded-2xl text-center ${Surface.text[400]} text-xs`}>
          No opposite gender candidate matches found for this candidate. Make sure there are registered, admin-approved candidates of the opposite gender.
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className={`text-xs font-extrabold uppercase tracking-wider ${Surface.text[500]}`}>
            3. Compatibility Matches ({matcherGender === 'Male' ? 'Females' : 'Males'}) — Click any card to inspect compatibility
          </h3>
          
          {/* Matches grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {matcherMatches.map((m) => {
              const score = m.matchResult.percentage;
              return (
                <div
                  key={m.profile.id}
                  onClick={() => { setMatcherSelectedMatch(m); setAiAnalysisText(''); setIsModalOpen(true); }}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${Static.white} border-${Surface.border[200]} ${Surface.hover.bg[50]} hover:shadow-md`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Avatar type={m.profile.avatarUrl} className="h-10 w-10 shrink-0" />
                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold ${Surface.text[900]} truncate`}>{m.profile.name}</h4>
                      <p className={`text-[10px] ${Surface.text[500]}`}>{m.profile.registrationId || m.profile.id} • {m.profile.age} yrs</p>
                      <p className={`text-[9px] ${Surface.text[400]} truncate`}>{m.profile.rasi} • {m.profile.nakshatra}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-sm font-extrabold ${score >= 70 ? `${Success.text[600]}` : score >= 50 ? `${Warning.text[600]}` : `${Danger.text[600]}`}`}>
                      {score}%
                    </div>
                    <div className={`text-[8px] font-bold uppercase tracking-wider ${Surface.text[400]}`}>
                      Match
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Porutham Compatibility Dialog Modal */}
      {matcherSelectedMatch && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="w-[95vw] md:max-w-5xl max-h-[92vh] overflow-y-auto p-6 md:p-8 bg-slate-50">
            <DialogHeader className="border-b pb-3 mb-2">
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <span>Astrological Compatibility Analysis</span>
                <span className={`text-xs px-3 py-1 rounded-full ${Primary[50]} ${Primary.text[700]} border ${Primary.border[200]}`}>
                  {matchingResult?.poruthamScores ? matchingResult.poruthamScores.filter((s: any) => s.status === 'Uthamam' || s.status === 'Madhyamam').length * 10 : 0}% Match Score
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              
              {/* Left Column: Overview Card */}
              <div className="space-y-4">
                {/* Visual Candidate Comparison */}
                <div className={`p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-around`}>
                  <div className="text-center space-y-1">
                    <Avatar type={primaryCandidate?.avatarUrl || ''} className="h-12 w-12 mx-auto ring-2 ring-indigo-100" />
                    <p className="text-xs font-bold text-slate-800 leading-tight">{primaryCandidate?.name}</p>
                    <p className="text-[9px] text-slate-500">{primaryCandidate?.nakshatra}</p>
                  </div>
                  <div className="text-slate-400 font-extrabold text-xs">VS</div>
                  <div className="text-center space-y-1">
                    <Avatar type={matcherSelectedMatch.profile.avatarUrl} className="h-12 w-12 mx-auto ring-2 ring-rose-100" />
                    <p className="text-xs font-bold text-slate-800 leading-tight">{matcherSelectedMatch.profile.name}</p>
                    <p className="text-[9px] text-slate-500">{matcherSelectedMatch.profile.nakshatra}</p>
                  </div>
                </div>

                {/* Score panel */}
                <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs text-center space-y-4">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Match Gauge</p>
                  
                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="46" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="56"
                        cy="56"
                        r="46"
                        stroke={matchingResult?.hasRajjuDosham ? "#ef4444" : "#4f46e5"}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 46}`}
                        strokeDashoffset={`${2 * Math.PI * 46 * (1 - (matchingResult?.percentage || 0) / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-black text-slate-800 leading-none">
                        {matchingResult?.poruthamScores ? matchingResult.poruthamScores.filter((s: any) => s.status === 'Uthamam' || s.status === 'Madhyamam').length : 0}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">out of 10</span>
                    </div>
                  </div>

                  <div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold ${
                      matchingResult?.rating === 'Excellent'
                        ? `${Success[50]} ${Success.text[700]} border ${Success.border[200]}`
                        : matchingResult?.rating === 'Good'
                        ? `${Primary[50]} ${Primary.text[700]} border ${Primary.border[200]}`
                        : matchingResult?.rating === 'Average'
                        ? `${Warning[50]} ${Warning.text[700]} border ${Warning.border[200]}`
                        : `${Danger[50]} ${Danger.text[700]} border ${Danger.border[200]}`
                    }`}>
                      {matchingResult?.rating} Compatibility
                    </span>
                  </div>
                </div>

                {/* Dosham Alerts */}
                <div className="space-y-2">
                  {matchingResult?.hasRajjuDosham && (
                    <div className={`p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-rose-900`}>
                      <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold leading-tight">Rajju Dosham (Friction Point)</p>
                        <p className="text-[9px] text-rose-700 mt-0.5 leading-normal">Both belong to the same Rajju group. Astrological adjustments are advised.</p>
                      </div>
                    </div>
                  )}

                  {matchingResult?.hasVedhaDosham && (
                    <div className={`p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2.5 text-amber-900`}>
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold leading-tight">Vedha Affliction Detected</p>
                        <p className="text-[9px] text-amber-700 mt-0.5 leading-normal">Mutual star clash. Indicates occasional stress or friction points.</p>
                      </div>
                    </div>
                  )}

                  {!matchingResult?.hasRajjuDosham && !matchingResult?.hasVedhaDosham && (
                    <div className={`p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start space-x-2.5 text-emerald-950`}>
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold leading-tight">Auspicious Astro Protection</p>
                        <p className="text-[9px] text-emerald-700 mt-0.5 leading-normal">No Rajju or Vedha doshams present. Core safety rules fully fulfilled.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Detailed 10-Poruthams scorecard (in a 2-column grid layout for high readability) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="font-bold text-xs text-slate-800 tracking-tight">Detailed 10-Porutham Analysis</h3>
                    <p className="text-[9px] text-slate-400 mt-0.5">Dynamically evaluated based on Tamil scriptures on the backend matching engine.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                    {matchingResult?.poruthamScores?.map((scoreCard: any, idx: number) => {
                      const isUthamam = scoreCard.status === 'Uthamam';
                      const isMadhyamam = scoreCard.status === 'Madhyamam';
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border flex flex-col justify-between space-y-2 ${
                            isUthamam
                              ? 'bg-emerald-50/40 border-emerald-100'
                              : isMadhyamam
                              ? 'bg-amber-50/40 border-amber-100'
                              : 'bg-rose-50/40 border-rose-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-slate-800 truncate">{scoreCard.label}</span>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${
                              isUthamam
                                ? 'bg-emerald-100 text-emerald-800'
                                : isMadhyamam
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {scoreCard.status} (+{scoreCard.score})
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-500 leading-normal line-clamp-3">{scoreCard.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {aiAnalysisText && (
                <div className={`col-span-full ${Primary.opacity.bg_40} border ${Primary.border[100]} p-5 rounded-2xl space-y-4`}>
                  <div className={`flex items-center space-x-2 border-b ${Primary.border[100]} pb-2`}>
                    <Sparkles className={`h-4 w-4 ${Primary.text[600]}`} />
                    <h4 className={`font-bold text-xs ${Surface.text[900]}`}>Gemini Professional Matrimonial Advice</h4>
                  </div>
                  <div className={`text-[10px] leading-relaxed ${Surface.text[700]} whitespace-pre-wrap font-medium`}>
                    {aiAnalysisText}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
