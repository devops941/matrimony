import { useApp } from '../store/AppContext';
import { Compass } from 'lucide-react';
import Avatar from '../components/Avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Primary, Surface, Success, Static, Composites } from '../theme';

export default function RecommendPage() {
  const {
    profiles,
    recommendTargetId,
    setRecommendTargetId,
    recommendedCandidates,
    handleSendRequest,
    setMatcherBrideId,
    setMatcherGroomId,
    setAiAnalysisText,
    setActiveTab,
  } = useApp();

  const targetProfile = profiles.find(p => p.id === recommendTargetId);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      <div className={`${Composites.pageHeader}`}>
        <h2 className={`text-xl md:text-2xl font-bold ${Surface.text[900]} tracking-tight`}>AI-Powered Match Recommendations</h2>
        <p className={`text-xs ${Surface.text[500]} mt-1`}>Select a single profile and run our advanced recommendation model to find the most compatible candidates instantly.</p>
      </div>

      <div className={`${Static.white} p-6 rounded-2xl border ${Surface.opacity.bd_200_80} ${Surface.shadow.xs} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div className="flex items-center space-x-4">
          <div className={`p-3 ${Primary[50]} ${Primary.text[600]} rounded-xl shrink-0`}>
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h3 className={`font-bold text-sm ${Surface.text[900]} tracking-tight`}>Select Reference Candidate</h3>
            <p className={`text-[11px] ${Surface.text[500]} mt-0.5`}>Recommendations will rank candidates of the opposite gender against this reference.</p>
          </div>
        </div>

        <div className="min-w-[240px]">
          <Select value={recommendTargetId} onValueChange={(val) => val !== null && setRecommendTargetId(val)}>
            <SelectTrigger className={`${Surface[50]} rounded-xl h-10`}>
              <SelectValue placeholder="Select Candidate..." />
            </SelectTrigger>
            <SelectContent>
              {profiles.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name} ({p.gender} • Star: {p.nakshatra})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(!targetProfile) ? (
        <div className={`${Static.white} border ${Surface.border[200]} p-12 rounded-2xl text-center ${Surface.text[400]} text-xs`}>
          No target profile selected to evaluate.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className={`font-extrabold text-[10px] uppercase tracking-widest ${Surface.text[400]}`}>
              Recommended matches for {targetProfile.name} ({targetProfile.gender})
            </h4>
            <span className={`text-xs font-semibold ${Surface.text[500]}`}>
              Found {recommendedCandidates.length} eligible opposite-gender profiles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommendedCandidates.length === 0 ? (
              <p className={`text-xs ${Surface.text[400]} col-span-full text-center py-8`}>No opposite gender profiles registered in database currently.</p>
            ) : (
              recommendedCandidates.map(({ profile: p, stats }) => (
                <div
                  key={p.id}
                  className={`${Static.white} rounded-2xl border ${Surface.opacity.bd_200_80} p-5 ${Surface.shadow.xs} hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5">
                      <Avatar type={p.avatarUrl} className="h-11 w-11" />
                      <div>
                        <h5 className={`font-bold ${Surface.text[900]} text-xs leading-none`}>{p.name}</h5>
                        <p className={`text-[10px] ${Surface.text[400]} mt-1`}>{p.age} yrs • {p.location} • Star: {p.nakshatra}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block text-base font-extrabold px-3 py-1 rounded-xl leading-none ${
                        stats.percentage >= 75
                          ? `${Success[50]} ${Success.text[700]} border ${Success.border[100]}`
                          : stats.percentage >= 50
                          ? `${Primary[50]} ${Primary.text[700]} border ${Primary.border[100]}`
                          : `${Surface[50]} ${Surface.text[600]} border ${Surface.border[200]}`
                      }`}>
                        {stats.percentage}% Match
                      </span>
                      <p className={`text-[8px] ${Surface.text[400]} uppercase tracking-widest font-extrabold mt-1`}>{stats.rating}</p>
                    </div>
                  </div>

                  <div className={`p-3 ${Surface[50]} rounded-xl border ${Surface.border[100]} grid grid-cols-2 gap-2 text-[10px] font-bold ${Surface.text[500]}`}>
                    <div>
                      <p className={`${Surface.text[400]} font-extrabold`}>Star Porutham</p>
                      <p className={`text-xs ${Surface.text[800]} font-extrabold mt-0.5`}>{stats.astroPct}% Compatibility</p>
                    </div>
                    <div>
                      <p className={`${Surface.text[400]} font-extrabold`}>Expectations compliance</p>
                      <p className={`text-xs ${Surface.text[800]} font-extrabold mt-0.5`}>Bride: {stats.expBridePct}% • Groom: {stats.expGroomPct}%</p>
                    </div>
                  </div>

                  <p className={`text-xs ${Surface.text[500]} line-clamp-2`}>
                    "{p.bio}"
                  </p>

                  <div className={`flex items-center justify-between border-t ${Surface.border[100]} pt-3`}>
                    <span className={`text-[10px] font-semibold ${Surface.text[400]}`}>
                      Education: <span className={`${Surface.text[700]} font-bold`}>{p.education}</span>
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                          if (targetProfile.gender === 'Female') {
                            setMatcherBrideId(targetProfile.id);
                            setMatcherGroomId(p.id);
                          } else {
                            setMatcherBrideId(p.id);
                            setMatcherGroomId(targetProfile.id);
                          }
                          setAiAnalysisText('');
                          setActiveTab('matcher');
                        }}
                      >
                        View Astrological Report
                      </Button>
                      <Button
                        size="xs"
                        onClick={() => handleSendRequest(targetProfile.id, p.id)}
                      >
                        Send Request
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
