import { useApp } from '../store/AppContext';
import { Heart, CheckCircle, X } from 'lucide-react';
import Avatar from '../components/Avatar';
import { Surface, Primary, Danger, Success, Gender, Static } from '../theme';

export default function ConfirmedPage() {
  const {
    profiles,
    handleUpdateProfileData,
    currentUser,
    getCompositeScore,
    showToast,
    setActiveTab,
  } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className={`text-xl font-bold ${Surface.text[900]} tracking-tight`}>Confirmed Married & Paired Couples</h2>
        <p className={`text-xs ${Surface.text[500]} mt-0.5`}>Visual exhibition of happily confirmed couples paired via Astrological 10-Porutham assessment.</p>
      </div>

      {(() => {
        // Group couples by Groom id to prevent duplicate display of both sides of the same pair
        const groomsWithPairs = profiles.filter(p => p.gender === 'Male' && p.confirmedMatchedWith);
        
        if (groomsWithPairs.length === 0) {
          return (
            <div className={`${Surface[50]} border ${Surface.border[200]} rounded-2xl p-12 text-center max-w-md mx-auto`}>
              <Heart className={`h-10 w-10 ${Surface.text[300]} mx-auto fill-slate-50 animate-pulse`} />
              <h3 className={`font-bold ${Surface.text[800]} mt-4`}>No Confirmed Couples Registered</h3>
              <p className={`text-xs ${Surface.text[500]} mt-1.5 leading-relaxed`}>
                Go to the <strong>Porutham Matcher</strong>, load a bride and groom, and check compatibility. Admins can lock and confirm pairs from there!
              </p>
              <button
                onClick={() => setActiveTab('matcher')}
                className={`mt-5 ${Primary[600]} ${Primary.hover.bg[700]} text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer`}
              >
                Open Match Workbench
              </button>
            </div>
          );
        }

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {groomsWithPairs.map(groom => {
              const bride = profiles.find(p => p.id === groom.confirmedMatchedWith);
              if (!bride) return null;

              // Calculate matching compatibility statistics
              const matchStats = getCompositeScore(bride, groom);

              return (
                <div
                  key={groom.id}
                  className={`${Static.white} rounded-2xl border border-pink-100 shadow-md shadow-pink-50/50 p-6 flex flex-col justify-between space-y-6 relative overflow-hidden`}
                >
                  {/* Decorative Top-Right Heart Watermark */}
                  <Heart className={`absolute -top-6 -right-6 h-24 w-24 ${Danger.opacity.text_50_40} fill-rose-50/20`} />

                  {/* Married Pair Row */}
                  <div className="flex items-center justify-between relative z-10">
                    {/* Groom Side */}
                    <div className="flex flex-col items-center text-center space-y-2 w-[42%]">
                      <div className="relative">
                        <Avatar type={groom.avatarUrl} className="h-14 w-14 ring-4 ring-blue-100 rounded-full" />
                        <span className={`absolute -bottom-1 -right-1 ${Gender.male[600]} text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full`}>
                          Groom
                        </span>
                      </div>
                      <div>
                        <h4 className={`font-bold text-xs ${Surface.text[800]} truncate max-w-[120px]`} title={groom.name}>
                          {groom.name}
                        </h4>
                        <p className={`text-[10px] ${Surface.text[400]} mt-0.5`}>{groom.nakshatra} • {groom.age} yrs</p>
                      </div>
                    </div>

                    {/* Matching Heart Connection */}
                    <div className="flex flex-col items-center justify-center space-y-1.5 w-[16%]">
                      <div className={`h-10 w-10 rounded-full ${Danger[50]} border ${Danger.border[200]} flex items-center justify-center animate-bounce`}>
                        <Heart className={`h-5 w-5 ${Danger.text[500]} fill-rose-400`} />
                      </div>
                      <span className={`text-[10px] font-extrabold ${Danger.text[600]} ${Danger[50]} px-2 py-0.5 rounded-full border ${Danger.border[100]}`}>
                        {matchStats.percentage}%
                      </span>
                    </div>

                    {/* Bride Side */}
                    <div className="flex flex-col items-center text-center space-y-2 w-[42%]">
                      <div className="relative">
                        <Avatar type={bride.avatarUrl} className="h-14 w-14 ring-4 ring-pink-100 rounded-full" />
                        <span className={`absolute -bottom-1 -right-1 ${Gender.female[600]} text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full`}>
                          Bride
                        </span>
                      </div>
                      <div>
                        <h4 className={`font-bold text-xs ${Surface.text[800]} truncate max-w-[120px]`} title={bride.name}>
                          {bride.name}
                        </h4>
                        <p className={`text-[10px] ${Surface.text[400]} mt-0.5`}>{bride.nakshatra} • {bride.age} yrs</p>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Details */}
                  <div className={`${Surface[50]} border ${Surface.border[100]} rounded-xl p-3 text-[11px] space-y-1.5 ${Surface.text[600]}`}>
                    <div className="flex justify-between font-medium">
                      <span>Astrological Match:</span>
                      <span className={`font-bold ${Surface.text[800]}`}>{matchStats.astroPct}% ({matchStats.rating})</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Groom Nakshatra:</span>
                      <span className={`font-bold ${Gender.male.text[700]}`}>{groom.rasi} • {groom.nakshatra}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Bride Nakshatra:</span>
                      <span className={`font-bold ${Gender.female.text[700]}`}>{bride.rasi} • {bride.nakshatra}</span>
                    </div>
                  </div>

                  {/* Admin Action footer (Undo pairing) */}
                  <div className={`flex items-center justify-between border-t ${Surface.border[100]} pt-3.5 mt-2`}>
                    <span className={`inline-flex items-center space-x-1.5 text-[10px] font-extrabold ${Success.text[800]} ${Success[50]} px-2.5 py-1 rounded-full border ${Success.border[100]}`}>
                      <CheckCircle className={`h-3.5 w-3.5 ${Success.text[600]}`} />
                      <span>Official Sealed Pair</span>
                    </span>

                    {currentUser?.role === 'Admin' && (
                      <button
                        onClick={() => {
                          handleUpdateProfileData(groom.id, { confirmedMatchedWith: undefined });
                          handleUpdateProfileData(bride.id, { confirmedMatchedWith: undefined });
                          showToast(`Success: Unlocked match pair of ${groom.name} & ${bride.name}`, 'info');
                        }}
                        className={`text-[10px] font-bold ${Surface.text[400]} ${Danger.hover.text[600]} transition flex items-center space-x-1 ${Danger.hover.bg[50]} px-2.5 py-1 rounded-lg cursor-pointer`}
                        title="Unlock Couple"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Undo Match Registration</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
}
