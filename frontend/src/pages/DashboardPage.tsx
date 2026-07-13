import { useApp } from '../store/AppContext';
import { Users, Heart, Clock, Layers, Settings, Info, UserPlus } from 'lucide-react';
import Avatar from '../components/Avatar';
import { Primary, Surface, Success, Warning, Danger, Gender, Static, Composites } from '../theme';

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

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-xl md:text-2xl font-bold ${Surface.text[900]} tracking-tight`}>Matrimonial Operations Dashboard</h2>
          <p className={`text-xs ${Surface.text[500]} mt-1`}>Real-time statistics across regional communities and matchings.</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className={`flex items-center justify-center space-x-1.5 ${Primary[600]} ${Primary.hover.bg[700]} ${Static.textWhite} text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all`}
        >
          <UserPlus className="h-4 w-4" />
          <span>Register New Profile</span>
        </button>
      </div>

      {/* Top Row Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${Static.white} p-5 rounded-2xl border ${Surface.opacity.bd_200_80} ${Surface.shadow.xs} flex items-center space-x-4`}>
          <div className={`p-3 ${Gender.male[50]} ${Gender.male.text[600]} rounded-xl`}>
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className={`text-[10px] uppercase tracking-wider font-extrabold ${Surface.text[400]}`}>Total Profiles</p>
            <p className={`text-2xl font-bold ${Surface.text[900]} mt-0.5`}>{totalProfiles}</p>
            <p className={`text-[10px] ${Surface.text[500]} mt-1`}>{maleCount} M / {femaleCount} F registered</p>
          </div>
        </div>

        <div className={`${Static.white} p-5 rounded-2xl border ${Surface.opacity.bd_200_80} ${Surface.shadow.xs} flex items-center space-x-4`}>
          <div className={`p-3 ${Danger[50]} ${Danger.text[600]} rounded-xl`}>
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <p className={`text-[10px] uppercase tracking-wider font-extrabold ${Surface.text[400]}`}>Successful matches</p>
            <p className={`text-2xl font-bold ${Surface.text[900]} mt-0.5`}>{acceptedRequestsCount}</p>
            <p className={`text-[10px] ${Success.text[600]} font-semibold mt-1`}>Connecting hearts daily</p>
          </div>
        </div>

        <div className={`${Static.white} p-5 rounded-2xl border ${Surface.opacity.bd_200_80} ${Surface.shadow.xs} flex items-center space-x-4`}>
          <div className={`p-3 ${Warning[50]} ${Warning.text[600]} rounded-xl`}>
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className={`text-[10px] uppercase tracking-wider font-extrabold ${Surface.text[400]}`}>Pending Requests</p>
            <p className={`text-2xl font-bold ${Surface.text[900]} mt-0.5`}>{pendingRequestsCount}</p>
            <p className={`text-[10px] ${Surface.text[500]} mt-1`}>Awaiting communication</p>
          </div>
        </div>

        <div className={`${Static.white} p-5 rounded-2xl border ${Surface.opacity.bd_200_80} ${Surface.shadow.xs} flex items-center space-x-4`}>
          <div className={`p-3 ${Primary[50]} ${Primary.text[600]} rounded-xl`}>
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className={`text-[10px] uppercase tracking-wider font-extrabold ${Surface.text[400]}`}>Active Communities</p>
            <p className={`text-2xl font-bold ${Surface.text[900]} mt-0.5`}>{communities.length}</p>
            <p className={`text-[10px] ${Surface.text[500]} mt-1`}>Multi-community ready</p>
          </div>
        </div>
      </div>

      {/* Middle Section: Regional stats & Matching matrix helper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Community Spread List */}
        <div className={`${Static.white} p-6 rounded-2xl border ${Surface.opacity.bd_200_80} ${Surface.shadow.sm} lg:col-span-2 flex flex-col justify-between`}>
          <div>
            <h3 className={`font-bold text-sm ${Surface.text[900]} tracking-tight`}>Active Communities & Associated Franchises</h3>
            <p className={`text-[11px] ${Surface.text[500]} mt-0.5`}>Summary reports of profiles loaded for each community group.</p>
          </div>

          <div className="mt-4 space-y-3">
            {communities.map(comm => {
              const count = profiles.filter(p => p.community === comm.name).length;
              const pct = totalProfiles > 0 ? Math.round((count / totalProfiles) * 100) : 0;
              return (
                <div key={comm.id} className={`p-3.5 ${Surface.opacity.bg_50_60} rounded-xl border ${Surface.border[100]} flex items-center justify-between`}>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold ${Surface.text[800]}`}>{comm.name}</p>
                    <p className={`text-[10px] ${Surface.text[500]} mt-0.5`}>{comm.region} • Franchise Code: <span className={`font-mono ${Surface[200]} px-1 py-0.2 rounded font-semibold text-[9px]`}>{comm.code}</span></p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-extrabold ${Surface.text[900]}`}>{count} profiles</p>
                    <div className={`w-16 ${Surface[200]} h-1 rounded-full mt-1.5 overflow-hidden`}>
                      <div className={`${Primary[600]} h-1 rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Astrological & Expectation weights helper */}
        <div className={`${Static.white} p-6 rounded-2xl border ${Surface.opacity.bd_200_80} ${Surface.shadow.sm} flex flex-col justify-between space-y-4`}>
          <div>
            <h3 className={`font-bold text-sm ${Surface.text[900]} tracking-tight flex items-center space-x-1.5`}>
              <Settings className={`h-4 w-4 ${Primary.text[500]}`} />
              <span>Algorithmic Matching Weights</span>
            </h3>
            <p className={`text-[11px] ${Surface.text[500]} mt-0.5`}>Tune composite match calculations for all clients.</p>
          </div>

          <div className="space-y-4 flex-grow">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Jothidam (Star Match)</span>
                <span>{Math.round(jothidamWeight * 100)}%</span>
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
                className={`w-full ${Primary.accent}`}
              />
              <p className={`text-[9px] ${Surface.text[400]} mt-1`}>Tamil Ten Porutham rules and Dosham checks weight.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Expectations Match</span>
                <span>{Math.round(expectationWeight * 100)}%</span>
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
                className={`w-full ${Primary.accent}`}
              />
              <p className={`text-[9px] ${Surface.text[400]} mt-1`}>Gold, job, income, and location matching compliance weight.</p>
            </div>
          </div>

          <div className={`p-3 ${Primary.opacity.bg_50} rounded-xl border ${Primary.border[100]} flex items-start space-x-2.5`}>
            <Info className={`h-4 w-4 ${Primary.text[600]} shrink-0 mt-0.5`} />
            <p className={`text-[10px] leading-relaxed ${Primary.text[900]}`}>
              Weights govern the <strong>AI Recommendations</strong> engine. Tuning allows the matchmaking agent to prioritize custom financial goals or traditional star compatibilities as requested by the client's family.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Pending Communication Requests */}
      <div className={`${Static.white} p-6 rounded-2xl border ${Surface.opacity.bd_200_80} ${Surface.shadow.sm}`}>
        <div className={`flex items-center justify-between pb-4 border-b ${Surface.border[100]}`}>
          <div>
            <h3 className={`font-bold text-sm ${Surface.text[900]} tracking-tight`}>Recent Communication Inquiries</h3>
            <p className={`text-[11px] ${Surface.text[500]} mt-0.5`}>Direct contact connections initiated by brides or grooms.</p>
          </div>
          <span className={`${Primary[50]} ${Primary.text[700]} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
            {requests.length} total cases
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          {requests.length === 0 ? (
            <p className={`text-xs ${Surface.text[400]} py-6 text-center`}>No active contact requests logged.</p>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`${Surface.text[400]} font-extrabold border-b ${Surface.border[100]}`}>
                  <th className="pb-2.5">Sender Candidate</th>
                  <th className="pb-2.5">Target Candidate</th>
                  <th className="pb-2.5">Compatibility Status</th>
                  <th className="pb-2.5">Sent Date</th>
                  <th className="pb-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-slate-100 font-medium`}>
                {requests.map(req => {
                  const sender = profiles.find(p => p.id === req.senderId);
                  const receiver = profiles.find(p => p.id === req.receiverId);
                  if (!sender || !receiver) return null;

                  const mathStat = getCompositeScore(
                    sender.gender === 'Female' ? sender : receiver,
                    sender.gender === 'Male' ? sender : receiver
                  );

                  return (
                    <tr key={req.id} className={`${Surface.text[700]} ${Surface.hover.bg[50]}`}>
                      <td className="py-3">
                        <div className="flex items-center space-x-2.5">
                          <Avatar type={sender.avatarUrl} className="h-7 w-7" />
                          <div>
                            <p className={`font-bold ${Surface.text[900]} text-xs`}>{sender.name}</p>
                            <p className={`text-[10px] ${Surface.text[500]}`}>{sender.community} • {sender.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center space-x-2.5">
                          <Avatar type={receiver.avatarUrl} className="h-7 w-7" />
                          <div>
                            <p className={`font-bold ${Surface.text[900]} text-xs`}>{receiver.name}</p>
                            <p className={`text-[10px] ${Surface.text[500]}`}>{receiver.community} • {receiver.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center space-x-1 font-semibold ${Surface.text[800]} text-[11px]`}>
                          <span className={`w-2 h-2 rounded-full ${mathStat.hasRajju ? Danger[500] : Success[500]}`} />
                          <span>{mathStat.percentage}% Match ({mathStat.rating})</span>
                        </span>
                      </td>
                      <td className={`py-3 ${Surface.text[500]} text-[11px]`}>
                        {new Date(req.sentAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 text-right">
                        {req.status === 'Pending' ? (
                          <div className="inline-flex space-x-1.5 justify-end">
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'Accepted')}
                              className={`${Success[600]} ${Success.hover.bg[700]} ${Static.textWhite} font-bold px-2.5 py-1 rounded-lg text-[10px] transition`}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'Declined')}
                              className={`${Surface[200]} ${Surface.hover.bg[300]} ${Surface.text[700]} font-bold px-2.5 py-1 rounded-lg text-[10px] transition`}
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            req.status === 'Accepted' ? `${Success[50]} ${Success.text[700]} border ${Success.border[200]}` : `${Danger[50]} ${Danger.text[700]} border ${Danger.border[200]}`
                          }`}>
                            {req.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
