import { useApp } from '../store/AppContext';
import { AlertTriangle, CheckCircle, HeartHandshake, RefreshCw, Sparkles, Check } from 'lucide-react';
import Avatar from '../components/Avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Primary, Surface, Success, Warning, Danger, Static } from '../theme';

export default function MatcherPage() {
  const {
    profiles,
    matcherBrideId,
    setMatcherBrideId,
    matcherGroomId,
    setMatcherGroomId,
    currentBride,
    currentGroom,
    matchingResult,
    aiAnalysisText,
    setAiAnalysisText,
    isAiAnalyzing,
    currentUser,
    handleSendRequest,
    handleAiAdvisory,
    setProfiles,
    showToast,
    setActiveTab,
  } = useApp();

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">

      <div className={`border-b ${Surface.border[200]} pb-4`}>
        <h2 className={`text-xl md:text-2xl font-bold ${Surface.text[900]} tracking-tight`}>Tamil Ten Porutham Astrological Matcher</h2>
        <p className={`text-xs ${Surface.text[500]} mt-1`}>Select any bride and groom to instantly compile an authentic 10-point compatibility matching scorecard.</p>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${Static.white} p-6 rounded-2xl border ${Surface.opacity.bd_200_80} shadow-xs`}>

        {/* Select Bride (Female) */}
        <div className="space-y-2">
          <label className={`text-[10px] uppercase tracking-wider font-extrabold ${Surface.text[500]}`}>Select Bride (பெண்)</label>
          <div className={`flex items-center space-x-3 ${Surface[50]} p-3.5 rounded-xl border ${Surface.border[200]}`}>
            <div className="shrink-0">
              {currentBride ? <Avatar type={currentBride.avatarUrl} className="h-10 w-10" /> : <div className={`h-10 w-10 rounded-xl ${Surface[200]}`} />}
            </div>
            <div className="flex-grow min-w-0">
              <Select value={matcherBrideId} onValueChange={(val) => { if (val !== null) { setMatcherBrideId(val); setAiAnalysisText(''); } }}>
                <SelectTrigger className={`w-full ${Static.transparent} border-none p-0 h-auto font-bold ${Surface.text[800]} text-xs focus:ring-0 focus:outline-none shadow-none`}>
                  <SelectValue placeholder="Choose Bride..." />
                </SelectTrigger>
                <SelectContent>
                  {profiles.filter(p => p.gender === 'Female').map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} (Star: {p.nakshatra} - Rasi: {p.rasi})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentBride && (
                <p className={`text-[10px] ${Surface.text[500]} mt-0.5`}>
                  {currentBride.education} • {currentBride.community} • {currentBride.location}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Select Groom (ஆண்) */}
        <div className="space-y-2">
          <label className={`text-[10px] uppercase tracking-wider font-extrabold ${Surface.text[500]}`}>Select Groom (ஆண்)</label>
          <div className={`flex items-center space-x-3 ${Surface[50]} p-3.5 rounded-xl border ${Surface.border[200]}`}>
            <div className="shrink-0">
              {currentGroom ? <Avatar type={currentGroom.avatarUrl} className="h-10 w-10" /> : <div className={`h-10 w-10 rounded-xl ${Surface[200]}`} />}
            </div>
            <div className="flex-grow min-w-0">
              <Select value={matcherGroomId} onValueChange={(val) => { if (val !== null) { setMatcherGroomId(val); setAiAnalysisText(''); } }}>
                <SelectTrigger className={`w-full ${Static.transparent} border-none p-0 h-auto font-bold ${Surface.text[800]} text-xs focus:ring-0 focus:outline-none shadow-none`}>
                  <SelectValue placeholder="Choose Groom..." />
                </SelectTrigger>
                <SelectContent>
                  {profiles.filter(p => p.gender === 'Male').map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} (Star: {p.nakshatra} - Rasi: {p.rasi})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentGroom && (
                <p className={`text-[10px] ${Surface.text[500]} mt-0.5`}>
                  {currentGroom.education} • {currentGroom.community} • {currentGroom.location}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      {(!currentBride || !currentGroom || !matchingResult) ? (
        <div className={`${Static.white} border ${Surface.border[200]} p-12 rounded-2xl text-center ${Surface.text[400]} text-xs`}>
          Please select both a Bride and a Groom from the dropdown filters above to run match calculations.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Visual scorecard */}
          <div className={`${Static.white} p-6 rounded-2xl border ${Surface.opacity.bd_200_80} shadow-sm flex flex-col justify-between space-y-6`}>
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-wider font-extrabold ${Surface.text[400]}`}>Composite Compatibility Score</p>

              <div className="relative w-36 h-36 mx-auto mt-4 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-95">
                  <circle cx="72" cy="72" r="62" stroke="#e2e8f0" strokeWidth="12" fill="transparent" />
                  <circle
                    cx="72"
                    cy="72"
                    r="62"
                    stroke={matchingResult.hasRajjuDosham ? "#f43f5e" : "#6366f1"}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 62}`}
                    strokeDashoffset={`${2 * Math.PI * 62 * (1 - matchingResult.percentage / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-3xl font-extrabold ${Surface.text[900]} leading-none`}>{matchingResult.totalScore}</span>
                  <span className={`text-[10px] font-bold ${Surface.text[400]} uppercase tracking-widest mt-1`}>out of 10</span>
                </div>
              </div>

              <div className="mt-4">
                <span className={`inline-flex px-3.5 py-1 rounded-full text-xs font-bold ${
                  matchingResult.rating === 'Excellent'
                    ? `${Success[50]} ${Success.text[700]} border ${Success.border[200]}`
                    : matchingResult.rating === 'Good'
                    ? `${Primary[50]} ${Primary.text[700]} border ${Primary.border[200]}`
                    : matchingResult.rating === 'Average'
                    ? `${Warning[50]} ${Warning.text[700]} border ${Warning.border[200]}`
                    : `${Danger[50]} ${Danger.text[700]} border ${Danger.border[200]}`
                }`}>
                  {matchingResult.rating} Compatibility
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {matchingResult.hasRajjuDosham && (
                <div className={`p-3 ${Danger[50]} border ${Danger.border[200]} rounded-xl flex items-start space-x-2.5 ${Danger.text[900]}`}>
                  <AlertTriangle className={`h-4.5 w-4.5 ${Danger.text[500]} shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-xs font-bold leading-tight">Rajju Dosham Detected</p>
                    <p className={`text-[10px] ${Danger.text[700]} mt-1 leading-normal`}>Both belong to same Rajju group. Unfavorable for long-term health harmony according to tradition.</p>
                  </div>
                </div>
              )}

              {matchingResult.hasVedhaDosham && (
                <div className={`p-3 ${Warning[50]} border ${Warning.border[200]} rounded-xl flex items-start space-x-2.5 ${Warning.text[900]}`}>
                  <AlertTriangle className={`h-4.5 w-4.5 ${Warning.text[500]} shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-xs font-bold leading-tight">Vedha Affliction Detected</p>
                    <p className={`text-[10px] ${Warning.text[700]} mt-1 leading-normal`}>Mutual star clash. Indicates occasional stress or friction points in day-to-day decisions.</p>
                  </div>
                </div>
              )}

              {!matchingResult.hasRajjuDosham && !matchingResult.hasVedhaDosham && (
                <div className={`p-3 ${Success[50]} border ${Success.border[100]} rounded-xl flex items-start space-x-2.5 ${Success.text[900]}`}>
                  <CheckCircle className={`h-4.5 w-4.5 ${Success.text[500]} shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-xs font-bold leading-tight">Auspicious Astrological Protection</p>
                    <p className={`text-[10px] ${Success.text[700]} mt-0.5 leading-normal`}>No Rajju or Vedha doshams present. Core safety rules are successfully fulfilled.</p>
                  </div>
                </div>
              )}
            </div>

            <div className={`p-3.5 ${Surface[50]} border ${Surface.opacity.bd_200_80} rounded-xl`}>
              <p className={`text-[10px] uppercase tracking-wider font-extrabold ${Surface.text[400]}`}>Astrological Verdict</p>
              <p className={`text-xs ${Surface.text[700]} leading-relaxed font-semibold mt-1`}>
                {matchingResult.verdict}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {currentUser?.role === 'Admin' && (
                <Button
                  variant={currentBride.confirmedMatchedWith === currentGroom.id ? 'outline' : 'default'}
                  className={`w-full ${currentBride.confirmedMatchedWith === currentGroom.id ? `${Success[100]} ${Success.text[800]} ${Success.border[200]}` : `${Success[600]} ${Success.hover.bg[700]} ${Static.textWhite}`}`}
                  disabled={currentBride.confirmedMatchedWith === currentGroom.id}
                  onClick={() => {
                    const updated = profiles.map(p => {
                      if (p.id === currentBride.id) return { ...p, confirmedMatchedWith: currentGroom.id };
                      if (p.id === currentGroom.id) return { ...p, confirmedMatchedWith: currentBride.id };
                      return p;
                    });
                    setProfiles(updated);
                    showToast(`Match officially confirmed between ${currentBride.name} & ${currentGroom.name}!`, 'success');
                  }}
                >
                  <Check className="h-4 w-4" />
                  <span>{currentBride.confirmedMatchedWith === currentGroom.id ? 'Match Confirmed & Locked' : 'Confirm & Lock Marriage Match'}</span>
                </Button>
              )}

              <Button
                className="w-full"
                onClick={() => handleSendRequest(currentGroom.id, currentBride.id)}
              >
                <HeartHandshake className="h-4 w-4" />
                <span>Initiate Match Communication</span>
              </Button>

              <Button
                variant="secondary"
                className={`w-full ${Surface[900]} ${Surface.hover.bg[800]} ${Primary.text[300]}`}
                disabled={isAiAnalyzing}
                onClick={() => handleAiAdvisory(currentBride, currentGroom)}
              >
                {isAiAnalyzing ? (
                  <>
                    <RefreshCw className={`h-4 w-4 animate-spin ${Primary.text[400]}`} />
                    <span>AI Advising...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate AI Strategic Advisory</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Ten Porutham list */}
          <div className={`${Static.white} p-6 rounded-2xl border ${Surface.opacity.bd_200_80} shadow-sm lg:col-span-2 space-y-4`}>
            <div className={`flex justify-between items-center border-b ${Surface.border[100]} pb-3`}>
              <div>
                <h3 className={`font-bold text-sm ${Surface.text[900]} tracking-tight`}>Detailed 10-Porutham Analysis</h3>
                <p className={`text-[11px] ${Surface.text[500]} mt-0.5`}>Calculated based on standard Tamil Thirumana Porutham scriptures.</p>
              </div>
              <span className={`text-xs font-bold ${Surface.text[400]}`}>
                Matches: {matchingResult.poruthamScores.filter(s => s.score > 0).length} / 10
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[480px] pr-1">
              {matchingResult.poruthamScores.map((scoreCard, idx) => (
                <div
                  key={idx}
                  className={`p-3 ${Surface[50]} rounded-xl border ${Surface.opacity.bd_200_60} flex flex-col sm:flex-row sm:items-start justify-between gap-2`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        scoreCard.status === 'Uthamam' ? `${Success[500]}` : scoreCard.status === 'Madhyamam' ? `${Warning[500]}` : `${Danger[500]}`
                      }`} />
                      <p className={`text-xs font-bold ${Surface.text[900]} leading-none`}>{scoreCard.label}</p>
                    </div>
                    <p className={`text-[11px] ${Surface.text[500]} leading-normal pr-4`}>{scoreCard.description}</p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      scoreCard.status === 'Uthamam'
                        ? `${Success[100]} ${Success.text[800]}`
                        : scoreCard.status === 'Madhyamam'
                        ? `${Warning[100]} ${Warning.text[800]}`
                        : `${Danger[100]} ${Danger.text[800]}`
                    }`}>
                      {scoreCard.status} (+{scoreCard.score})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {aiAnalysisText && (
            <div className={`col-span-full ${Primary.opacity.bg_40} border ${Primary.border[100]} p-6 rounded-2xl space-y-4`}>
              <div className={`flex items-center space-x-2 border-b ${Primary.border[100]} pb-2`}>
                <Sparkles className={`h-5 w-5 ${Primary.text[600]}`} />
                <h4 className={`font-bold text-sm ${Surface.text[900]}`}>Gemini Professional Matrimonial Advice</h4>
              </div>
              <div className={`text-xs leading-relaxed ${Surface.text[700]} whitespace-pre-wrap font-medium`}>
                {aiAnalysisText}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
