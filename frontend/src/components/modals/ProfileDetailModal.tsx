import { useApp } from '../../store/AppContext';
import { Edit, Trash2, Check, Sparkles, Heart } from 'lucide-react';
import Avatar from '../Avatar';
import { RASI_LORDS } from '../../porutham';
import { Primary, Surface, Success } from '../../theme';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function ProfileDetailModal() {
  const {
    profiles,
    selectedProfileId,
    setSelectedProfileId,
    currentUser,
    setProfiles,
    showToast,
    handleOpenEditForm,
    handleDeleteProfile,
    setMatcherBrideId,
    setMatcherGroomId,
    setAiAnalysisText,
    setActiveTab,
    setRecommendTargetId,
  } = useApp();

  const p = profiles.find(item => item.id === selectedProfileId);
  const isOpen = !!selectedProfileId && !!p;

  const handleClose = () => setSelectedProfileId(null);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side="right" className="max-w-2xl w-full overflow-y-auto" showCloseButton>
        {p && (
          <>
            <SheetHeader>
              <div className="flex items-center space-x-3.5">
                <Avatar type={p.avatarUrl} className="h-12 w-12" />
                <div>
                  <SheetTitle>{p.name}</SheetTitle>
                  <SheetDescription>ID: {p.id} • Registered Matrimony Profile</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className={`px-4 space-y-6 text-xs ${Surface.text[600]} pb-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <div>
                    <h4 className={`font-bold ${Surface.text[800]} text-xs uppercase tracking-wider border-b ${Surface.border[100]} pb-1 mb-2`}>Personal Particulars</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between"><span>Age / Height:</span> <span className={`font-bold ${Surface.text[800]}`}>{p.age} yrs • {p.height}</span></li>
                      <li className="flex justify-between"><span>Community:</span> <span className={`font-bold ${Surface.text[800]}`}>{p.community}</span></li>
                      <li className="flex justify-between"><span>Current Location:</span> <span className={`font-bold ${Surface.text[800]}`}>{p.location}</span></li>
                      <li className="flex justify-between"><span>Education:</span> <span className={`font-bold ${Surface.text[800]}`}>{p.education}</span></li>
                      <li className="flex justify-between"><span>Profession:</span> <span className={`font-bold ${Surface.text[800]}`}>{p.jobType}</span></li>
                      <li className="flex justify-between"><span>Annual Income:</span> <span className={`font-bold ${Primary.text[600]}`}>Rs {p.annualIncomeLakhs} Lakhs</span></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`font-bold ${Surface.text[800]} text-xs uppercase tracking-wider border-b ${Surface.border[100]} pb-1 mb-2`}>Birth Horoscope (ஜோதிடம்)</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between"><span>Birth Star (Nakshatra):</span> <span className={`font-bold ${Surface.text[800]}`}>{p.nakshatra}</span></li>
                      <li className="flex justify-between"><span>Moon Sign (Rasi):</span> <span className={`font-bold ${Surface.text[800]}`}>{p.rasi}</span></li>
                      <li className="flex justify-between"><span>Rasi Lord:</span> <span className={`font-bold ${Surface.text[800]}`}>{RASI_LORDS[p.rasi] || "N/A"}</span></li>
                      <li className="flex justify-between"><span>Chevvai Dosham (Mars):</span> <span className={`font-bold ${Surface.text[800]}`}>{p.chevvaiDosham}</span></li>
                      <li className="flex justify-between"><span>Birth Details:</span> <span className={`font-bold ${Surface.text[800]}`}>{p.birthDate} @ {p.birthTime}</span></li>
                      <li className="flex justify-between"><span>Place of Birth:</span> <span className={`font-bold ${Surface.text[800]}`}>{p.birthPlace}</span></li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`${Surface[50]} p-3.5 rounded-xl border ${Surface.border[100]}`}>
                    <h4 className={`font-bold ${Surface.text[800]} text-xs mb-1.5 flex items-center space-x-1.5`}>
                      <Heart className={`h-4 w-4 ${Primary.text[500]} fill-indigo-500`} />
                      <span>Candidate Bio Introduction</span>
                    </h4>
                    <p className={`text-[11px] leading-relaxed ${Surface.text[600]} italic`}>
                      "{p.bio}"
                    </p>
                  </div>

                  <div>
                    <h4 className={`font-bold ${Surface.text[800]} text-xs uppercase tracking-wider border-b ${Surface.border[100]} pb-1 mb-2`}>Bride / Groom Expectations</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between"><span>Age Range:</span> <span className={`font-bold ${Surface.text[800]}`}>{p.expectations.minAge} to {p.expectations.maxAge} yrs</span></li>
                      <li className="flex justify-between"><span>Communities:</span> <span className={`font-bold ${Surface.text[800]} max-w-[140px] truncate block text-right`} title={p.expectations.acceptedCommunities.join(', ')}>{p.expectations.acceptedCommunities.join(', ')}</span></li>
                      <li className="flex justify-between"><span>Preferred Jobs:</span> <span className={`font-bold ${Surface.text[800]} max-w-[140px] truncate block text-right`} title={p.expectations.acceptedJobTypes.join(', ')}>{p.expectations.acceptedJobTypes.join(', ')}</span></li>
                      <li className="flex justify-between"><span>Minimum Partner Income:</span> <span className={`font-bold ${Surface.text[800]}`}>Rs {p.expectations.minAnnualIncomeLakhs} Lakhs/yr</span></li>
                      <li className="flex justify-between"><span>Locations:</span> <span className={`font-bold ${Surface.text[800]} max-w-[140px] truncate block text-right`} title={p.expectations.acceptedLocations.join(', ')}>{p.expectations.acceptedLocations.join(', ')}</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`border-t ${Surface.border[100]} pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}>
                <div className="flex space-x-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditForm(p)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProfile(p.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>

                <div className="flex items-center shrink-0">
                  {currentUser?.role === 'Admin' ? (
                    <label className={`flex items-center space-x-2 cursor-pointer select-none ${Success.opacity.bg_50_50} border ${Success.border[200]} ${Success.hover.bg[50]} px-3.5 py-1.5 rounded-xl transition`}>
                      <input
                        type="checkbox"
                        checked={!!p.approvedByAdmin}
                        onChange={(e) => {
                          const updated = profiles.map(profile => 
                            profile.id === p.id ? { ...profile, approvedByAdmin: e.target.checked } : profile
                          );
                          setProfiles(updated);
                          showToast(
                            e.target.checked 
                              ? `Successfully approved candidate: ${p.name}` 
                              : `Revoked approval for: ${p.name}`,
                            'info'
                          );
                        }}
                        className={`h-4 w-4 rounded ${Success.text[600]} ${Success.focus.ring} ${Surface.border[300]}`}
                      />
                      <span className={`text-xs font-bold ${Surface.text[700]}`}>Admin Approved</span>
                    </label>
                  ) : (
                    p.approvedByAdmin && (
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${Success[100]} ${Success.text[800]} border ${Success.border[200]}`}>
                        <Check className={`h-3.5 w-3.5 ${Success.text[700]}`} />
                        <span>Approved by Admin</span>
                      </span>
                    )
                  )}
                </div>

                <div className="flex space-x-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (p.gender === 'Female') {
                        setMatcherBrideId(p.id);
                      } else {
                        setMatcherGroomId(p.id);
                      }
                      setAiAnalysisText('');
                      setSelectedProfileId(null);
                      setActiveTab('matcher');
                      showToast(`Selected ${p.name} inside match workbench.`, 'info');
                    }}
                  >
                    Load to Matcher
                  </Button>

                  <Button
                    size="sm"
                    className={`${Primary[600]} ${Primary.hover.bg[700]}`}
                    onClick={() => {
                      setRecommendTargetId(p.id);
                      setSelectedProfileId(null);
                      setActiveTab('recommend');
                      showToast(`Showing recommendations for ${p.name}`, 'info');
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>View Recommendations</span>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
