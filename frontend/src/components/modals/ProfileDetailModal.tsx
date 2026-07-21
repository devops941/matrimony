import { useApp } from '../../store/AppContext';
import { Edit, Trash2, Check, Sparkles, Heart, User, Calendar, MapPin, Briefcase, GraduationCap, Phone, Mail, Users, Star, Home, FileText } from 'lucide-react';
import Avatar from '../Avatar';
import { RASI_LORDS } from '../../porutham';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function ProfileDetailModal() {
  const {
    profiles,
    selectedProfileId,
    setSelectedProfileId,
    currentUser,
    handleUpdateProfileData,
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
      <SheetContent side="right" className="max-w-md md:max-w-3xl w-full overflow-y-auto p-0 bg-slate-50 border-l border-slate-200/60 shadow-2xl" showCloseButton>
        {p && (
          <div className="h-full flex flex-col">
            {/* Header with Avatar */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 px-8 py-8 text-white relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-white rounded-full blur-2xl"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
              </div>
              <div className="relative flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar type={p.avatarUrl} className="h-28 w-28 ring-4 ring-white shadow-xl" />
                <div className="flex-1 pb-1">
                  <h2 className="text-3xl font-extrabold tracking-tight mb-1 drop-shadow-sm">{p.name}</h2>
                  <p className="text-sm text-indigo-100 font-medium mb-3">
                    {p.age} years • {p.gender} • {p.community}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-white/80">
                    <span className="flex items-center space-x-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{p.location}</span>
                    </span>
                    <span className="flex items-center space-x-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="font-mono">ID: {p.registrationId || p.id.substring(0,8)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8 space-y-8 bg-slate-50/50">
              
              {/* Bio Section */}
              <div className="bg-white border border-slate-200/60 shadow-sm p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-100" />
                  <span>About Me</span>
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 italic font-medium">
                  "{p.bio || "Hi, I am looking for a suitable match. Please review my profile for more details."}"
                </p>
              </div>

              {/* Personal Details Grid */}
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <User className="h-4 w-4 text-indigo-500" />
                  <span>Personal Information</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                  <InfoItem label="Age" value={`${p.age} years`} />
                  <InfoItem label="Height" value={p.height || 'N/A'} />
                  <InfoItem label="Weight" value={p.weight ? `${p.weight} kg` : 'N/A'} />
                  <InfoItem label="Blood Group" value={p.bloodGroup || 'N/A'} />
                  <InfoItem label="Marital Status" value={p.maritalStatus || 'Never Married'} />
                  <InfoItem label="Diet" value={p.diet || 'Vegetarian'} />
                  <InfoItem label="Mother Tongue" value={p.motherTongue || 'Tamil'} />
                  <InfoItem label="Community" value={p.community} />
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <Phone className="h-4 w-4 text-indigo-500" />
                  <span>Contact Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                  <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Phone className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                      <span className="text-sm text-slate-800 font-semibold">{p.contactNumber || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Mail className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                      <span className="text-sm text-slate-800 font-semibold">{p.email || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horoscope Details */}
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-100" />
                  <span>Horoscope & Astrological Details</span>
                </h3>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100/50 shadow-sm space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <InfoItem label="Birth Date" value={p.birthDate} />
                    <InfoItem label="Birth Time" value={p.birthTime} />
                    <InfoItem label="Birth Place" value={p.birthPlace} />
                  </div>
                  <div className="border-t border-amber-200/50 pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoItem label="Nakshatra (Birth Star)" value={p.nakshatra} />
                    <InfoItem label="Rasi (Moon Sign)" value={p.rasi} />
                    <InfoItem label="Rasi Lord" value={RASI_LORDS[p.rasi] || "N/A"} />
                    <InfoItem label="Chevvai Dosham" value={p.chevvaiDosham} valueClass={p.chevvaiDosham === 'Yes' ? 'text-rose-600' : ''} />
                  </div>
                </div>
              </div>

              {/* Education & Career */}
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <GraduationCap className="h-4 w-4 text-indigo-500" />
                  <span>Education & Career</span>
                </h3>
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 shadow-sm grid grid-cols-2 gap-4">
                  <InfoItem label="Education" value={p.education} />
                  <InfoItem label="Profession" value={p.jobType} />
                  <InfoItem 
                    label="Annual Income" 
                    value={`₹ ${p.annualIncomeLakhs} Lakhs/yr`} 
                    valueClass="font-extrabold text-emerald-700 text-base"
                  />
                  <InfoItem label="Current Location" value={p.location} />
                </div>
              </div>

              {/* Family Details */}
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span>Family Background</span>
                </h3>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm grid grid-cols-2 gap-4">
                  <InfoItem label="Father's Name" value={p.fatherName || 'N/A'} />
                  <InfoItem label="Father's Occupation" value={p.fatherOccupation || 'N/A'} />
                  <InfoItem label="Mother's Name" value={p.motherName || 'N/A'} />
                  <InfoItem label="Mother's Occupation" value={p.motherOccupation || 'N/A'} />
                  <InfoItem label="Number of Siblings" value={p.siblings?.toString() || '0'} />
                </div>
              </div>

              {/* Partner Expectations */}
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <Heart className="h-4 w-4 text-indigo-500" />
                  <span>Partner Expectations</span>
                </h3>
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 shadow-sm space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoItem label="Age Range" value={`${p.expectations.minAge} - ${p.expectations.maxAge} years`} />
                    <InfoItem label="Minimum Income" value={`₹ ${p.expectations.minAnnualIncomeLakhs} Lakhs/yr`} />
                    <InfoItem label="Height Range" value={`${p.expectations.minHeight || 'Any'} - ${p.expectations.maxHeight || 'Any'}`} />
                    <InfoItem label="Preferred Education" value={p.expectations.preferredEducation || 'Any Graduate'} />
                  </div>
                  <div className="border-t border-indigo-100 pt-4 space-y-3">
                    <InfoItem label="Accepted Communities" value={p.expectations.acceptedCommunities.join(', ')} />
                    <InfoItem label="Preferred Job Types" value={p.expectations.acceptedJobTypes.join(', ')} />
                    <InfoItem label="Preferred Locations" value={p.expectations.acceptedLocations.join(', ')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-slate-200 px-6 py-5 bg-white space-y-4 flex-shrink-0 z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
              {/* Admin Approval */}
              <div className="flex items-center justify-center mb-2">
                {currentUser?.role === 'Admin' ? (
                  <label className="flex items-center space-x-2 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition-all shadow-sm">
                    <input
                      type="checkbox"
                      checked={!!p.approvedByAdmin}
                      onChange={(e) => {
                        handleUpdateProfileData(p.id, { approvedByAdmin: e.target.checked });
                        showToast(
                          e.target.checked ? `Verified candidate: ${p.name}` : `Revoked verification for: ${p.name}`, 'info'
                        );
                      }}
                      className="h-4 w-4 rounded text-emerald-500 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Verify Profile</span>
                  </label>
                ) : (
                  p.approvedByAdmin && (
                    <span className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                      <Check className="h-4 w-4" />
                      <span>Verified Profile</span>
                    </span>
                  )
                )}
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" onClick={() => handleOpenEditForm(p)} className="flex-1 min-w-[140px] h-10 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Edit className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
                <Button variant="outline" onClick={() => handleDeleteProfile(p.id)} className="flex-1 min-w-[140px] h-10 rounded-xl font-bold border-rose-200 text-rose-600 hover:bg-rose-50">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (p.gender === 'Female') setMatcherBrideId(p.id);
                    else setMatcherGroomId(p.id);
                    setAiAnalysisText('');
                    setSelectedProfileId(null);
                    setActiveTab('matcher');
                    showToast(`Selected ${p.name} inside match workbench.`, 'info');
                  }}
                  className="flex-1 min-w-[180px] h-11 rounded-xl font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  Load to Matcher
                </Button>

                <Button
                  className="flex-1 min-w-[180px] h-11 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                  onClick={() => {
                    setRecommendTargetId(p.id);
                    setSelectedProfileId(null);
                    setActiveTab('recommend');
                    showToast(`Showing recommendations for ${p.name}`, 'info');
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" /> View Recommendations
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function InfoItem({ label, value, className = '', valueClass = '' }: { label: string; value: string; className?: string; valueClass?: string; }) {
  return (
    <div className={`${className}`}>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm text-slate-800 font-semibold ${valueClass}`}>{value || '—'}</p>
    </div>
  );
}
