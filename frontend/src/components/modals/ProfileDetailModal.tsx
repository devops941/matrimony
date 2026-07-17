import { useApp } from '../../store/AppContext';
import { Edit, Trash2, Check, Sparkles, Heart, User, Calendar, MapPin, Briefcase, GraduationCap, Phone, Mail, Users, Star, Home } from 'lucide-react';
import Avatar from '../Avatar';
import { RASI_LORDS } from '../../porutham';
import { Primary, Surface, Success, Static } from '../../theme';
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
      <SheetContent side="right" className="max-w-3xl w-full overflow-y-auto p-0" showCloseButton>
        {p && (
          <div className="h-full flex flex-col">
            {/* Header with Avatar */}
            <div className={`${Primary[600]} px-6 py-5 text-white relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full"></div>
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white rounded-full"></div>
              </div>
              <div className="relative flex items-start space-x-4">
                <Avatar type={p.avatarUrl} className="h-20 w-20 ring-4 ring-white/30 shadow-xl" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{p.name}</h2>
                  <p className="text-sm opacity-90 mb-2">
                    {p.age} years • {p.gender} • {p.community}
                  </p>
                  <div className="flex items-center space-x-3 text-xs opacity-80">
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{p.location}</span>
                    </span>
                    <span>•</span>
                    <span className="font-mono font-semibold">ID: {p.registrationId || p.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              
              {/* Bio Section */}
              <div className={`${Primary.opacity.bg_50_30} border-l-4 ${Primary.border[500]} p-4 rounded-r-lg`}>
                <h3 className={`font-bold ${Primary.text[700]} text-sm mb-2 flex items-center space-x-2`}>
                  <Heart className={`h-4 w-4 fill-current`} />
                  <span>About Me</span>
                </h3>
                <p className={`text-sm leading-relaxed ${Surface.text[700]} italic`}>
                  "{p.bio}"
                </p>
              </div>

              {/* Personal Details Grid */}
              <div>
                <h3 className={`font-bold ${Surface.text[800]} text-sm uppercase tracking-wider mb-3 flex items-center space-x-2`}>
                  <User className={`h-4 w-4 ${Primary.text[600]}`} />
                  <span>Personal Information</span>
                </h3>
                <div className={`grid grid-cols-2 gap-3 ${Surface[50]} p-4 rounded-lg border ${Surface.border[200]}`}>
                  <InfoItem label="Age" value={`${p.age} years`} />
                  <InfoItem label="Height" value={p.height} />
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
                <h3 className={`font-bold ${Surface.text[800]} text-sm uppercase tracking-wider mb-3 flex items-center space-x-2`}>
                  <Phone className={`h-4 w-4 ${Primary.text[600]}`} />
                  <span>Contact Information</span>
                </h3>
                <div className={`${Surface[50]} p-4 rounded-lg border ${Surface.border[200]} space-y-2`}>
                  <div className="flex items-center space-x-3">
                    <Phone className={`h-4 w-4 ${Surface.text[400]}`} />
                    <span className={`text-sm ${Surface.text[700]} font-medium`}>
                      {p.contactNumber || 'Not provided'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className={`h-4 w-4 ${Surface.text[400]}`} />
                    <span className={`text-sm ${Surface.text[700]} font-medium`}>
                      {p.email || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Horoscope Details */}
              <div>
                <h3 className={`font-bold ${Surface.text[800]} text-sm uppercase tracking-wider mb-3 flex items-center space-x-2`}>
                  <Star className={`h-4 w-4 ${Primary.text[600]}`} />
                  <span>Horoscope & Astrological Details</span>
                </h3>
                <div className={`${Primary.opacity.bg_50_20} p-4 rounded-lg border ${Primary.border[200]} space-y-3`}>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoItem label="Birth Date" value={p.birthDate} />
                    <InfoItem label="Birth Time" value={p.birthTime} />
                    <InfoItem label="Birth Place" value={p.birthPlace} className="col-span-2" />
                  </div>
                  <div className={`border-t ${Primary.border[200]} pt-3 grid grid-cols-2 gap-3`}>
                    <InfoItem label="Nakshatra (Birth Star)" value={p.nakshatra} />
                    <InfoItem label="Rasi (Moon Sign)" value={p.rasi} />
                    <InfoItem label="Rasi Lord" value={RASI_LORDS[p.rasi] || "N/A"} />
                    <InfoItem label="Chevvai Dosham" value={p.chevvaiDosham} />
                  </div>
                </div>
              </div>

              {/* Education & Career */}
              <div>
                <h3 className={`font-bold ${Surface.text[800]} text-sm uppercase tracking-wider mb-3 flex items-center space-x-2`}>
                  <GraduationCap className={`h-4 w-4 ${Primary.text[600]}`} />
                  <span>Education & Career</span>
                </h3>
                <div className={`${Success.opacity.bg_50_20} p-4 rounded-lg border ${Success.border[200]} space-y-2`}>
                  <InfoItem label="Education" value={p.education} />
                  <InfoItem label="Profession" value={p.jobType} />
                  <InfoItem 
                    label="Annual Income" 
                    value={`₹ ${p.annualIncomeLakhs} Lakhs`} 
                    valueClass={`font-bold ${Primary.text[700]}`}
                  />
                  <InfoItem label="Current Location" value={p.location} />
                </div>
              </div>

              {/* Family Details */}
              <div>
                <h3 className={`font-bold ${Surface.text[800]} text-sm uppercase tracking-wider mb-3 flex items-center space-x-2`}>
                  <Users className={`h-4 w-4 ${Primary.text[600]}`} />
                  <span>Family Background</span>
                </h3>
                <div className={`${Surface[50]} p-4 rounded-lg border ${Surface.border[200]} space-y-3`}>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoItem label="Father's Name" value={p.fatherName || 'N/A'} />
                    <InfoItem label="Father's Occupation" value={p.fatherOccupation || 'N/A'} />
                    <InfoItem label="Mother's Name" value={p.motherName || 'N/A'} />
                    <InfoItem label="Mother's Occupation" value={p.motherOccupation || 'N/A'} />
                    <InfoItem label="Number of Siblings" value={p.siblings?.toString() || '0'} />
                  </div>
                </div>
              </div>

              {/* Partner Expectations */}
              <div>
                <h3 className={`font-bold ${Surface.text[800]} text-sm uppercase tracking-wider mb-3 flex items-center space-x-2`}>
                  <Heart className={`h-4 w-4 ${Primary.text[600]}`} />
                  <span>Partner Expectations</span>
                </h3>
                <div className={`${Primary.opacity.bg_50_30} p-4 rounded-lg border ${Primary.border[300]} space-y-3`}>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoItem label="Age Range" value={`${p.expectations.minAge} - ${p.expectations.maxAge} years`} />
                    <InfoItem label="Minimum Income" value={`₹ ${p.expectations.minAnnualIncomeLakhs} Lakhs/yr`} />
                    <InfoItem label="Height Range" value={`${p.expectations.minHeight || 'Any'} - ${p.expectations.maxHeight || 'Any'}`} />
                    <InfoItem label="Preferred Education" value={p.expectations.preferredEducation || 'Any Graduate'} />
                  </div>
                  <div className={`border-t ${Primary.border[200]} pt-3 space-y-2`}>
                    <InfoItem 
                      label="Accepted Communities" 
                      value={p.expectations.acceptedCommunities.join(', ')} 
                      className="col-span-2"
                    />
                    <InfoItem 
                      label="Preferred Job Types" 
                      value={p.expectations.acceptedJobTypes.join(', ')} 
                      className="col-span-2"
                    />
                    <InfoItem 
                      label="Preferred Locations" 
                      value={p.expectations.acceptedLocations.join(', ')} 
                      className="col-span-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className={`border-t ${Surface.border[200]} px-6 py-4 ${Surface[50]} space-y-3`}>
              {/* Admin Approval */}
              <div className="flex items-center justify-center">
                {currentUser?.role === 'Admin' ? (
                  <label className={`flex items-center space-x-2 cursor-pointer select-none ${Success.opacity.bg_50_50} border ${Success.border[200]} ${Success.hover.bg[50]} px-4 py-2 rounded-lg transition`}>
                    <input
                      type="checkbox"
                      checked={!!p.approvedByAdmin}
                      onChange={(e) => {
                        handleUpdateProfileData(p.id, { approvedByAdmin: e.target.checked });
                        showToast(
                          e.target.checked 
                            ? `Successfully approved candidate: ${p.name}` 
                            : `Revoked approval for: ${p.name}`,
                          'info'
                        );
                      }}
                      className={`h-4 w-4 rounded ${Success.text[600]} ${Success.focus.ring} ${Surface.border[300]}`}
                    />
                    <span className={`text-sm font-bold ${Surface.text[700]}`}>Admin Approved</span>
                  </label>
                ) : (
                  p.approvedByAdmin && (
                    <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold ${Success[100]} ${Success.text[800]} border ${Success.border[200]}`}>
                      <Check className={`h-4 w-4 ${Success.text[700]}`} />
                      <span>Approved by Admin</span>
                    </span>
                  )
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEditForm(p)}
                  className="flex-1 min-w-[120px]"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  <span>Edit Profile</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteProfile(p.id)}
                  className="flex-1 min-w-[120px]"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span>Delete</span>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  size="sm"
                  variant="outline"
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
                  className="flex-1 min-w-[180px]"
                >
                  Load to Matcher
                </Button>

                <Button
                  size="sm"
                  className={`${Primary[600]} ${Primary.hover.bg[700]} ${Static.textWhite} flex-1 min-w-[180px]`}
                  onClick={() => {
                    setRecommendTargetId(p.id);
                    setSelectedProfileId(null);
                    setActiveTab('recommend');
                    showToast(`Showing recommendations for ${p.name}`, 'info');
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  <span>View Recommendations</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Helper Component for Info Items
function InfoItem({ 
  label, 
  value, 
  className = '', 
  valueClass = '' 
}: { 
  label: string; 
  value: string; 
  className?: string;
  valueClass?: string;
}) {
  return (
    <div className={`${className}`}>
      <p className={`text-xs ${Surface.text[500]} mb-0.5`}>{label}</p>
      <p className={`text-sm ${Surface.text[800]} font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}
