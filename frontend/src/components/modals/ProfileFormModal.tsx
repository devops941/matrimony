import { useApp } from '../../store/AppContext';
import { UserPlus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Avatar from '../Avatar';
import { NAKSHATRAS } from '../../porutham';
import { Primary, Surface, Success, Danger, Static } from '../../theme';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function ProfileFormModal() {
  const {
    isFormOpen, setIsFormOpen,
    formMode, formName, setFormName,
    formGender, setFormGender,
    formAge, setFormAge,
    formHeight, setFormHeight,
    formLocation, setFormLocation,
    formCommunity, setFormCommunity,
    formNakshatra, setFormNakshatra,
    formEducation, setFormEducation,
    formJobType, setFormJobType,
    formIncome, setFormIncome,
    formBio, setFormBio,
    formChevvai, setFormChevvai,
    formBirthDate, setFormBirthDate,
    formBirthTime, setFormBirthTime,
    formBirthPlace, setFormBirthPlace,
    formAvatarUrl, setFormAvatarUrl,
    formExpMinAge, setFormExpMinAge,
    formExpMaxAge, setFormExpMaxAge,
    formExpCommunities, setFormExpCommunities,
    formExpJobTypes, setFormExpJobTypes,
    formExpMinIncome, setFormExpMinIncome,
    formExpLocations, setFormExpLocations,
    formExpGold, setFormExpGold,
    communities,
    combinedNakshatras,
    jobCategories,
    handleSaveProfile,
    handlePhotoUpload,
    showToast,
    whatsappConfirmations, setWhatsappConfirmations,
    isSavingProfile,
  } = useApp();

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Reset to step 1 when modal closes
  const handleModalClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setCurrentStep(1);
    }
  };

  // Additional form fields (local state for now, will need to add to context)
  const [formBloodGroup, setFormBloodGroup] = useState('');
  const [formMaritalStatus, setFormMaritalStatus] = useState('Never Married');
  const [formWeight, setFormWeight] = useState('');
  const [formComplexion, setFormComplexion] = useState('Fair');
  const [formDiet, setFormDiet] = useState('Vegetarian');
  const [formMotherTongue, setFormMotherTongue] = useState('Tamil');
  const [formFatherName, setFormFatherName] = useState('');
  const [formFatherOccupation, setFormFatherOccupation] = useState('');
  const [formMotherName, setFormMotherName] = useState('');
  const [formMotherOccupation, setFormMotherOccupation] = useState('');
  const [formSiblings, setFormSiblings] = useState(0);
  const [formFamilyType, setFormFamilyType] = useState('Nuclear');
  const [formFamilyStatus, setFormFamilyStatus] = useState('Middle Class');
  const [formContactNumber, setFormContactNumber] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhysicalDisability, setFormPhysicalDisability] = useState('None');
  const [formRasi, setFormRasi] = useState('Mesham (மேஷம்)');
  const [formExpEducation, setFormExpEducation] = useState('');
  const [formExpMinHeight, setFormExpMinHeight] = useState('');
  const [formExpMaxHeight, setFormExpMaxHeight] = useState('');

  return (
    <Dialog open={isFormOpen} onOpenChange={handleModalClose}>
      <DialogContent className="min-w-[80rem] max-w-[90vw] h-[92vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-4 pb-3 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className={`h-5 w-5 ${Primary.text[600]}`} />
            <span className="text-base font-semibold">{formMode === 'add' ? 'Register New Matrimonial Candidate' : 'Modify Candidate Particulars'}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Step Progress Indicator */}
        <div className="flex items-center justify-center py-3 px-8 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${currentStep === step
                      ? `${Primary[600]} ${Static.textWhite} shadow-md`
                      : currentStep > step
                        ? `${Success[500]} ${Static.textWhite}`
                        : `${Surface[200]} ${Surface.text[400]}`
                    }`}
                >
                  {currentStep > step ? '✓' : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-all ${currentStep > step ? `${Success[500]}` : `${Surface.border[200]}`
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSaveProfile} className={`space-y-4 text-sm ${Surface.text[700]} max-w-7xl mx-auto`}>

            {/* Step 1: Personal & Physical Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h4 className={`font-extrabold text-sm uppercase tracking-wider ${Primary.text[700]} mb-1`}>Step 1: Personal & Physical Details</h4>
                  <p className={`text-xs ${Surface.text[500]}`}>Basic information about the candidate including physical attributes and contact details</p>
                </div>

                {/* Photo Upload - Compact Side Layout */}
                <div className="flex gap-4 items-start">
                  <div className={`${Surface[50]} border border-dashed ${Surface.border[200]} rounded-lg p-3 flex flex-col items-center justify-center w-32 shrink-0`}>
                    <div className="relative group">
                      <Avatar type={formAvatarUrl || (formGender === 'Male' ? 'male_1' : 'female_1')} className={`h-20 w-20 ring-2 ${Primary.opacity.ring_50}`} />
                      {formAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormAvatarUrl('');
                            showToast('Photograph removed.', 'info');
                          }}
                          className={`absolute -top-1 -right-1 ${Danger[500]} ${Danger.hover.bg[600]} ${Static.textWhite} rounded-full p-0.5 text-xs shadow-md transition`}
                          title="Remove Photograph"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <label className="cursor-pointer mt-2 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(file);
                        }}
                      />
                      <span className={`text-xs font-medium ${Primary.text[600]} hover:${Primary.text[700]}`}>
                        Upload Photo
                      </span>
                    </label>
                  </div>

                  {/* Form Fields Grid */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Full Name <span className="text-red-500">*</span></Label>
                        <Input
                          required
                          value={formName}
                          onChange={e => setFormName(e.target.value)}
                          placeholder="e.g. Anand Kumar"
                          className={`${Surface[50]} h-8 text-xs`}
                        />
                      </div>

                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Gender <span className="text-red-500">*</span></Label>
                        <select
                          value={formGender}
                          onChange={e => setFormGender(e.target.value as any)}
                          className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-1.5 h-8 text-xs ${Primary.focus.border} focus:outline-none`}
                        >
                          <option value="Male">Male (ஆண்)</option>
                          <option value="Female">Female (பெண்)</option>
                        </select>
                      </div>

                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Date of Birth <span className="text-red-500">*</span></Label>
                        <Input
                          type="date"
                          required
                          value={formBirthDate}
                          onChange={e => {
                            setFormBirthDate(e.target.value);
                            const birthDate = new Date(e.target.value);
                            const today = new Date();
                            let age = today.getFullYear() - birthDate.getFullYear();
                            const m = today.getMonth() - birthDate.getMonth();
                            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                              age--;
                            }
                            setFormAge(age);
                          }}
                          className={`${Surface[50]} h-8 text-xs`}
                        />
                      </div>

                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Age</Label>
                        <Input
                          type="number"
                          min="18"
                          max="60"
                          required
                          readOnly
                          value={formAge}
                          className={`${Surface[50]} ${Surface.text[400]}`}
                        />
                      </div>

                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Height</Label>
                        <Input
                          required
                          value={formHeight}
                          onChange={e => setFormHeight(e.target.value)}
                          placeholder="e.g. 5 ft 8 in"
                          className={`${Surface[50]} h-8 text-xs`}
                        />
                      </div>

                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Weight (kg)</Label>
                        <Input
                          required
                          value={formWeight}
                          onChange={e => setFormWeight(e.target.value)}
                          placeholder="e.g. 65"
                          className={`${Surface[50]} h-8 text-xs`}
                        />
                      </div>

                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Blood Group</Label>
                        <select
                          value={formBloodGroup}
                          onChange={e => setFormBloodGroup(e.target.value)}
                          className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-1.5 h-8 text-xs ${Primary.focus.border} focus:outline-none`}
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>

                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Diet Preference</Label>
                        <select
                          value={formDiet}
                          onChange={e => setFormDiet(e.target.value)}
                          className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-1.5 h-8 text-xs ${Primary.focus.border} focus:outline-none`}
                        >
                          <option value="Vegetarian">Vegetarian</option>
                          <option value="Non-Vegetarian">Non-Vegetarian</option>
                          <option value="Eggetarian">Eggetarian</option>
                        </select>
                      </div>

                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Marital Status</Label>
                        <select
                          value={formMaritalStatus}
                          onChange={e => setFormMaritalStatus(e.target.value)}
                          className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-1.5 h-8 text-xs ${Primary.focus.border} focus:outline-none`}
                        >
                          <option value="Never Married">Never Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Separated">Separated</option>
                        </select>
                      </div>

                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Mother Tongue</Label>
                        <select
                          value={formMotherTongue}
                          onChange={e => setFormMotherTongue(e.target.value)}
                          className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-1.5 h-8 text-xs ${Primary.focus.border} focus:outline-none`}
                        >
                          <option value="Tamil">Tamil</option>
                          <option value="Telugu">Telugu</option>
                          <option value="Kannada">Kannada</option>
                          <option value="Malayalam">Malayalam</option>
                          <option value="Hindi">Hindi</option>
                          <option value="English">English</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Contact Number</Label>
                        <Input
                          type="tel"
                          required
                          value={formContactNumber}
                          onChange={e => setFormContactNumber(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className={`${Surface[50]} h-8 text-xs`}
                        />
                      </div>

                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Email Address</Label>
                        <Input
                          type="email"
                          required
                          value={formEmail}
                          onChange={e => setFormEmail(e.target.value)}
                          placeholder="e.g. john@example.com"
                          className={`${Surface[50]} h-8 text-xs`}
                        />
                      </div>

                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Community</Label>
                        <select
                          value={formCommunity}
                          onChange={e => setFormCommunity(e.target.value)}
                          className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-1.5 h-8 text-xs ${Primary.focus.border} focus:outline-none`}
                        >
                          {communities.filter(c => c.isActive !== false).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Current Location (City)</Label>
                        <Input
                          required
                          value={formLocation}
                          onChange={e => setFormLocation(e.target.value)}
                          placeholder="e.g. Coimbatore"
                          className={`${Surface[50]} h-8 text-xs`}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Introduce Yourself (Bio)</Label>
                      <Textarea
                        value={formBio}
                        onChange={e => setFormBio(e.target.value)}
                        placeholder="Write a warm introduction explaining career goals and ideal partner expectations..."
                        className={`${Surface[50]} h-16 text-xs resize-none`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Horoscope & Astrological Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h4 className={`font-extrabold text-sm uppercase tracking-wider ${Primary.text[700]} mb-1`}>Step 2: Horoscope & Astrological Details</h4>
                  <p className={`text-xs ${Surface.text[500]}`}>Birth details required for accurate horoscope matching and compatibility analysis</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Date of Birth</Label>
                    <Input
                      type="date"
                      required
                      value={formBirthDate}
                      onChange={e => {
                        setFormBirthDate(e.target.value);
                        const birthDate = new Date(e.target.value);
                        const today = new Date();
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const m = today.getMonth() - birthDate.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                          age--;
                        }
                        setFormAge(age);
                      }}
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Birth Time <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2">
                      <select
                        required
                        value={formBirthTime.replace(/\s*(AM|PM)/i, '').trim().split(':')[0] || '09'}
                        onChange={e => {
                          const hour = e.target.value;
                          const minute = formBirthTime.match(/:(\d{2})/)?.[1] || '00';
                          const period = formBirthTime.match(/(AM|PM)/i)?.[0] || 'AM';
                          setFormBirthTime(`${hour}:${minute} ${period}`);
                        }}
                        className={`w-20 ${Surface[50]} border ${Surface.border[200]} rounded-lg p-1.5 h-8 text-xs ${Primary.focus.border} focus:outline-none`}
                      >
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="04">04</option>
                        <option value="05">05</option>
                        <option value="06">06</option>
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                      <span className="flex items-center text-lg font-bold text-gray-400">:</span>
                      <select
                        required
                        value={formBirthTime.match(/:(\d{2})/)?.[1] || '00'}
                        onChange={e => {
                          const hour = formBirthTime.replace(/\s*(AM|PM)/i, '').trim().split(':')[0] || '09';
                          const minute = e.target.value;
                          const period = formBirthTime.match(/(AM|PM)/i)?.[0] || 'AM';
                          setFormBirthTime(`${hour}:${minute} ${period}`);
                        }}
                        className={`w-20 ${Surface[50]} border ${Surface.border[200]} rounded-lg p-1.5 h-8 text-xs ${Primary.focus.border} focus:outline-none`}
                      >
                        {Array.from({ length: 60 }, (_, i) => {
                          const min = i.toString().padStart(2, '0');
                          return <option key={min} value={min}>{min}</option>;
                        })}
                      </select>
                      <select
                        value={formBirthTime.match(/(AM|PM)/i)?.[0] || 'AM'}
                        onChange={e => {
                          const hour = formBirthTime.replace(/\s*(AM|PM)/i, '').trim().split(':')[0] || '09';
                          const minute = formBirthTime.match(/:(\d{2})/)?.[1] || '00';
                          setFormBirthTime(`${hour}:${minute} ${e.target.value}`);
                        }}
                        className={`w-16 ${Surface[50]} border ${Surface.border[200]} rounded-lg p-1.5 h-8 text-xs ${Primary.focus.border} focus:outline-none font-semibold`}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    <p className={`text-xs ${Surface.text[400]} mt-1.5`}>Required for accurate horoscope matching</p>
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Birth Place</Label>
                    <Input
                      required
                      value={formBirthPlace}
                      onChange={e => setFormBirthPlace(e.target.value)}
                      placeholder="e.g. Chennai, Tamil Nadu"
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Birth Star (Nakshatra)</Label>
                    <select
                      value={formNakshatra}
                      onChange={e => setFormNakshatra(e.target.value)}
                      className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-2 ${Primary.focus.border} focus:outline-none font-bold ${Surface.text[800]}`}
                    >
                      {combinedNakshatras.map(n => <option key={n.index} value={n.name}>{n.name} ({n.tamilName})</option>)}
                    </select>
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Rasi (Zodiac Sign)</Label>
                    <select
                      value={formRasi}
                      onChange={e => setFormRasi(e.target.value)}
                      className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-2 ${Primary.focus.border} focus:outline-none font-bold ${Surface.text[800]}`}
                    >
                      <option value="Mesham (மேஷம்)">Mesham (மேஷம்) - Aries</option>
                      <option value="Rishabam (ரிஷபம்)">Rishabam (ரிஷபம்) - Taurus</option>
                      <option value="Midhunam (மிதுனம்)">Midhunam (மிதுனம்) - Gemini</option>
                      <option value="Kadagam (கடகம்)">Kadagam (கடகம்) - Cancer</option>
                      <option value="Simmam (சிம்மம்)">Simmam (சிம்மம்) - Leo</option>
                      <option value="Kanni (கன்னி)">Kanni (கன்னி) - Virgo</option>
                      <option value="Thulam (துலாம்)">Thulam (துலாம்) - Libra</option>
                      <option value="Viruchigam (விருச்சிகம்)">Viruchigam (விருச்சிகம்) - Scorpio</option>
                      <option value="Dhanusu (தனுசு)">Dhanusu (தனுசு) - Sagittarius</option>
                      <option value="Magaram (மகரம்)">Magaram (மகரம்) - Capricorn</option>
                      <option value="Kumbam (கும்பம்)">Kumbam (கும்பம்) - Aquarius</option>
                      <option value="Meenam (மீனம்)">Meenam (மீனம்) - Pisces</option>
                    </select>
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Chevvai Dosham (Manglik)</Label>
                    <select
                      value={formChevvai}
                      onChange={e => setFormChevvai(e.target.value as any)}
                      className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-1.5 h-8 text-xs ${Primary.focus.border} focus:outline-none`}
                    >
                      <option value="No">No Chevvai Dosham</option>
                      <option value="Yes">Yes (Dosham Present)</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Education, Career & Family Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h4 className={`font-extrabold text-sm uppercase tracking-wider ${Primary.text[700]} mb-1`}>Step 3: Education, Career & Family Details</h4>
                  <p className={`text-xs ${Surface.text[500]}`}>Professional qualifications, career information, and comprehensive family background</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Education Degree</Label>
                    <Input
                      required
                      value={formEducation}
                      onChange={e => setFormEducation(e.target.value)}
                      placeholder="e.g. B.E. Engineering"
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Job Category</Label>
                    <select
                      value={formJobType}
                      onChange={e => setFormJobType(e.target.value)}
                      className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-1.5 h-8 text-xs ${Primary.focus.border} focus:outline-none`}
                    >
                      {jobCategories.filter(c => c.isActive).map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Annual Income (Lakhs Rs)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="200"
                      required
                      value={formIncome}
                      onChange={e => setFormIncome(parseInt(e.target.value) || 10)}
                      className={`${Surface[50]} font-bold ${Primary.text[600]}`}
                    />
                  </div>

                  <div className="col-span-4 lg:col-span-4">
                    <div className={`${Primary[50]} border-l-4 ${Primary.border[500]} rounded-r-lg pl-4 py-2 my-3`}>
                      <h5 className={`font-bold ${Primary.text[700]} text-xs flex items-center`}>
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        Family Background Details
                      </h5>
                    </div>
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Father's Name</Label>
                    <Input
                      required
                      value={formFatherName}
                      onChange={e => setFormFatherName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Father's Occupation</Label>
                    <Input
                      required
                      value={formFatherOccupation}
                      onChange={e => setFormFatherOccupation(e.target.value)}
                      placeholder="e.g. Business Owner"
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Mother's Name</Label>
                    <Input
                      required
                      value={formMotherName}
                      onChange={e => setFormMotherName(e.target.value)}
                      placeholder="e.g. Lakshmi Devi"
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Mother's Occupation</Label>
                    <Input
                      required
                      value={formMotherOccupation}
                      onChange={e => setFormMotherOccupation(e.target.value)}
                      placeholder="e.g. Homemaker"
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Number of Siblings</Label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={formSiblings}
                      onChange={e => setFormSiblings(parseInt(e.target.value) || 0)}
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Partner Expectations */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h4 className={`font-extrabold text-sm uppercase tracking-wider ${Primary.text[700]} mb-1`}>Step 4: Partner Expectations & Preferences</h4>
                  <p className={`text-xs ${Surface.text[500]}`}>Describe your ideal life partner preferences and expectations</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Min Age Expected</Label>
                    <Input
                      type="number"
                      min="18"
                      max="60"
                      required
                      value={formExpMinAge}
                      onChange={e => setFormExpMinAge(parseInt(e.target.value) || 21)}
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Max Age Expected</Label>
                    <Input
                      type="number"
                      min="18"
                      max="60"
                      required
                      value={formExpMaxAge}
                      onChange={e => setFormExpMaxAge(parseInt(e.target.value) || 30)}
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Minimum Income (Lakhs/yr)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="200"
                      required
                      value={formExpMinIncome}
                      onChange={e => setFormExpMinIncome(parseInt(e.target.value) || 5)}
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Minimum Height Expected</Label>
                    <Input
                      placeholder="e.g. 5 ft 2 in"
                      value={formExpMinHeight}
                      onChange={e => setFormExpMinHeight(e.target.value)}
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Maximum Height Expected</Label>
                    <Input
                      placeholder="e.g. 6 ft 0 in"
                      value={formExpMaxHeight}
                      onChange={e => setFormExpMaxHeight(e.target.value)}
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Preferred Education</Label>
                    <Input
                      placeholder="e.g. B.E., M.B.A."
                      value={formExpEducation}
                      onChange={e => setFormExpEducation(e.target.value)}
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Preferred Location</Label>
                    <Input
                      placeholder="e.g. Chennai"
                      value={formExpLocations.join(', ')}
                      onChange={e => setFormExpLocations(e.target.value.split(',').map(s => s.trim()))}
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                    <p className={`text-xs ${Surface.text[400]} mt-1.5`}>Separate multiples with commas.</p>
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Preferred Job Categories</Label>
                    <Input
                      placeholder="IT & Software, Medical"
                      value={formExpJobTypes.join(', ')}
                      onChange={e => setFormExpJobTypes(e.target.value.split(',').map(s => s.trim()))}
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>

                  <div>
                    <Label className={`text-xs font-semibold ${Surface.text[700]} mb-1 block`}>Expected Gold (Sovereigns)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="200"
                      value={formExpGold}
                      onChange={e => setFormExpGold(parseInt(e.target.value) || 0)}
                      className={`${Surface[50]} h-8 text-xs`}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex justify-between items-center px-6 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex space-x-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={isSavingProfile}
                    className="flex items-center h-8 px-4 text-xs"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsFormOpen(false);
                  setCurrentStep(1); // Reset to step 1 when closing
                }} disabled={isSavingProfile} className="h-8 px-4 text-xs">
                  Cancel
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="flex items-center h-8 px-4 text-xs"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSavingProfile} className={`${Primary[600]} ${Static.textWhite} h-8 px-6 text-xs font-semibold`}>
                    {isSavingProfile ? 'Saving...' : (formMode === 'add' ? 'Register Candidate' : 'Save Modifications')}
                  </Button>
                )}
              </div>
            </DialogFooter>

            {whatsappConfirmations.filter(w => !w.sent).length > 0 && (
              <div className={`mx-6 mb-4 p-4 ${Success[50]} rounded-xl border ${Success.border[100]}`}>
                <h4 className={`font-bold ${Success.text[800]} text-xs mb-2`}>Pending WhatsApp Messages</h4>
                {whatsappConfirmations.filter(w => !w.sent).map((w, i) => (
                  <div key={i} className={`flex items-center justify-between ${Static.white} p-2 rounded-lg text-[10px] mb-1`}>
                    <span>{w.message}</span>
                    <Button size="sm" variant="outline" onClick={() => setWhatsappConfirmations(prev => prev.map((item, idx) => idx === i ? { ...item, sent: true } : item))} className={`${Success[600]} ${Static.textWhite} px-2 py-1 text-[10px] h-auto`}>Send</Button>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
