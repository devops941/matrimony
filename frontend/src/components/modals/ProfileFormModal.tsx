import { useApp } from '../../store/AppContext';
import { UserPlus, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Avatar from '../Avatar';
import { NAKSHATRAS } from '../../porutham';
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
import { motion, AnimatePresence } from 'motion/react';

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

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleModalClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) setCurrentStep(1);
  };

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

  const slideVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  const inputClass = "bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 rounded-xl h-11 text-sm font-medium transition-all shadow-sm";
  const selectClass = "w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 h-11 text-sm font-medium focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none transition-all shadow-sm";
  const labelClass = "text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block";

  return (
    <Dialog open={isFormOpen} onOpenChange={handleModalClose}>
      <DialogContent className="min-w-[90vw] md:min-w-[80rem] max-w-[95vw] h-[95vh] flex flex-col p-0 gap-0 overflow-hidden bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-3xl">
        <DialogHeader className="px-8 pt-6 pb-4 border-b border-slate-100 flex-shrink-0 bg-white">
          <DialogTitle className="flex items-center space-x-3 text-slate-800">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">{formMode === 'add' ? 'Register New Profile' : 'Edit Candidate Details'}</h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Please ensure all details are accurate before saving.</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Step Progress Indicator */}
        <div className="flex items-center justify-center py-5 px-8 bg-slate-50/50 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${currentStep === step
                      ? `bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-4 ring-indigo-50`
                      : currentStep > step
                        ? `bg-emerald-500 text-white`
                        : `bg-white border-2 border-slate-200 text-slate-400`
                    }`}
                >
                  {currentStep > step ? '✓' : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-1 mx-3 rounded-full transition-all duration-300 ${currentStep > step ? `bg-emerald-400` : `bg-slate-200`
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 bg-slate-50/30">
          <form onSubmit={handleSaveProfile} className="max-w-7xl mx-auto h-full relative">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                  <div className="mb-6">
                    <h4 className="font-extrabold text-sm uppercase tracking-wider text-indigo-700 mb-1">Step 1: Personal Details</h4>
                    <p className="text-sm text-slate-500 font-medium">Basic information about the candidate including physical attributes and contact details</p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center w-full md:w-48 shrink-0 shadow-sm">
                      <div className="relative group mb-4">
                        <Avatar type={formAvatarUrl || (formGender === 'Male' ? 'male_1' : 'female_1')} className="h-28 w-28 ring-4 ring-slate-50 shadow-sm" />
                        {formAvatarUrl && (
                          <button
                            type="button"
                            onClick={() => { setFormAvatarUrl(''); showToast('Photograph removed.', 'info'); }}
                            className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 shadow-lg transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <label className="cursor-pointer text-center w-full">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handlePhotoUpload(file); }} />
                        <div className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors">
                          Upload Photo
                        </div>
                      </label>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div><Label className={labelClass}>Full Name <span className="text-rose-500">*</span></Label><Input required value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Anand Kumar" className={inputClass} /></div>
                      <div><Label className={labelClass}>Gender <span className="text-rose-500">*</span></Label><select value={formGender} onChange={e => setFormGender(e.target.value as any)} className={selectClass}><option value="Male">Male</option><option value="Female">Female</option></select></div>
                      <div><Label className={labelClass}>Date of Birth <span className="text-rose-500">*</span></Label><Input type="date" required value={formBirthDate} onChange={e => { setFormBirthDate(e.target.value); const d = new Date(e.target.value); const t = new Date(); let age = t.getFullYear() - d.getFullYear(); const m = t.getMonth() - d.getMonth(); if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--; setFormAge(age); }} className={inputClass} /></div>
                      <div><Label className={labelClass}>Age</Label><Input type="number" min="18" max="60" required readOnly value={formAge} className={`${inputClass} bg-slate-100 text-slate-500 border-dashed`} /></div>
                      <div><Label className={labelClass}>Height</Label><Input required value={formHeight} onChange={e => setFormHeight(e.target.value)} placeholder="e.g. 5 ft 8 in" className={inputClass} /></div>
                      <div><Label className={labelClass}>Weight (kg)</Label><Input required value={formWeight} onChange={e => setFormWeight(e.target.value)} placeholder="e.g. 65" className={inputClass} /></div>
                      <div><Label className={labelClass}>Blood Group</Label><select value={formBloodGroup} onChange={e => setFormBloodGroup(e.target.value)} className={selectClass}><option value="">Select</option><option value="A+">A+</option><option value="O+">O+</option><option value="B+">B+</option><option value="AB+">AB+</option></select></div>
                      <div><Label className={labelClass}>Diet Preference</Label><select value={formDiet} onChange={e => setFormDiet(e.target.value)} className={selectClass}><option value="Vegetarian">Vegetarian</option><option value="Non-Vegetarian">Non-Vegetarian</option></select></div>
                      <div><Label className={labelClass}>Marital Status</Label><select value={formMaritalStatus} onChange={e => setFormMaritalStatus(e.target.value)} className={selectClass}><option value="Never Married">Never Married</option><option value="Divorced">Divorced</option><option value="Widowed">Widowed</option></select></div>
                      <div><Label className={labelClass}>Contact Number</Label><Input type="tel" required value={formContactNumber} onChange={e => setFormContactNumber(e.target.value)} placeholder="e.g. +91 98765 43210" className={inputClass} /></div>
                      <div><Label className={labelClass}>Email Address</Label><Input type="email" required value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="e.g. john@example.com" className={inputClass} /></div>
                      <div><Label className={labelClass}>Community</Label><select value={formCommunity} onChange={e => setFormCommunity(e.target.value)} className={selectClass}>{communities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
                      <div><Label className={labelClass}>Current Location</Label><Input required value={formLocation} onChange={e => setFormLocation(e.target.value)} placeholder="e.g. Coimbatore" className={inputClass} /></div>
                      
                      <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <Label className={labelClass}>Introduce Yourself (Bio)</Label>
                        <Textarea value={formBio} onChange={e => setFormBio(e.target.value)} placeholder="Write a warm introduction explaining career goals and ideal partner expectations..." className="bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 rounded-xl p-3 text-sm font-medium transition-all shadow-sm h-24 resize-none" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                  <div className="mb-6">
                    <h4 className="font-extrabold text-sm uppercase tracking-wider text-indigo-700 mb-1">Step 2: Horoscope Details</h4>
                    <p className="text-sm text-slate-500 font-medium">Birth details required for accurate horoscope matching</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div><Label className={labelClass}>Birth Place</Label><Input required value={formBirthPlace} onChange={e => setFormBirthPlace(e.target.value)} placeholder="e.g. Chennai" className={inputClass} /></div>
                    <div><Label className={labelClass}>Birth Star (Nakshatra)</Label><select value={formNakshatra} onChange={e => setFormNakshatra(e.target.value)} className={selectClass}>{combinedNakshatras.map(n => <option key={n.index} value={n.name}>{n.name} ({n.tamilName})</option>)}</select></div>
                    <div><Label className={labelClass}>Rasi (Zodiac Sign)</Label><select value={formRasi} onChange={e => setFormRasi(e.target.value)} className={selectClass}><option value="Mesham (மேஷம்)">Mesham (மேஷம்) - Aries</option><option value="Rishabam (ரிஷபம்)">Rishabam (ரிஷபம்) - Taurus</option><option value="Midhunam (மிதுனம்)">Midhunam (மிதுனம்) - Gemini</option><option value="Kadagam (கடகம்)">Kadagam (கடகம்) - Cancer</option><option value="Simmam (சிம்மம்)">Simmam (சிம்மம்) - Leo</option><option value="Kanni (கன்னி)">Kanni (கன்னி) - Virgo</option><option value="Thulam (துலாம்)">Thulam (துலாம்) - Libra</option><option value="Viruchigam (விருச்சிகம்)">Viruchigam (விருச்சிகம்) - Scorpio</option><option value="Dhanusu (தனுசு)">Dhanusu (தனுசு) - Sagittarius</option><option value="Magaram (மகரம்)">Magaram (மகரம்) - Capricorn</option><option value="Kumbam (கும்பம்)">Kumbam (கும்பம்) - Aquarius</option><option value="Meenam (மீனம்)">Meenam (மீனம்) - Pisces</option></select></div>
                    <div><Label className={labelClass}>Chevvai Dosham</Label><select value={formChevvai} onChange={e => setFormChevvai(e.target.value as any)} className={selectClass}><option value="No">No Dosham</option><option value="Yes">Yes (Dosham Present)</option><option value="Unknown">Unknown</option></select></div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                  <div className="mb-6">
                    <h4 className="font-extrabold text-sm uppercase tracking-wider text-indigo-700 mb-1">Step 3: Career & Family</h4>
                    <p className="text-sm text-slate-500 font-medium">Professional qualifications and comprehensive family background</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div><Label className={labelClass}>Education Degree</Label><Input required value={formEducation} onChange={e => setFormEducation(e.target.value)} placeholder="e.g. B.E. Engineering" className={inputClass} /></div>
                    <div><Label className={labelClass}>Job Category</Label><select value={formJobType} onChange={e => setFormJobType(e.target.value)} className={selectClass}>{jobCategories.filter(c => c.isActive).map(cat => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}</select></div>
                    <div><Label className={labelClass}>Annual Income (Lakhs Rs)</Label><Input type="number" min="1" max="200" required value={formIncome} onChange={e => setFormIncome(parseInt(e.target.value) || 10)} className={`${inputClass} text-indigo-700 font-bold`} /></div>
                    
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4">
                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6">
                        <h5 className="font-bold text-indigo-800 text-sm mb-4">Family Background</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div><Label className={labelClass}>Father's Name</Label><Input required value={formFatherName} onChange={e => setFormFatherName(e.target.value)} className={inputClass} /></div>
                          <div><Label className={labelClass}>Father's Occupation</Label><Input required value={formFatherOccupation} onChange={e => setFormFatherOccupation(e.target.value)} className={inputClass} /></div>
                          <div><Label className={labelClass}>Mother's Name</Label><Input required value={formMotherName} onChange={e => setFormMotherName(e.target.value)} className={inputClass} /></div>
                          <div><Label className={labelClass}>Mother's Occupation</Label><Input required value={formMotherOccupation} onChange={e => setFormMotherOccupation(e.target.value)} className={inputClass} /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div key="step4" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                  <div className="mb-6">
                    <h4 className="font-extrabold text-sm uppercase tracking-wider text-indigo-700 mb-1">Step 4: Partner Expectations</h4>
                    <p className="text-sm text-slate-500 font-medium">Describe your ideal life partner preferences and expectations</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div><Label className={labelClass}>Min Age Expected</Label><Input type="number" required value={formExpMinAge} onChange={e => setFormExpMinAge(parseInt(e.target.value) || 21)} className={inputClass} /></div>
                    <div><Label className={labelClass}>Max Age Expected</Label><Input type="number" required value={formExpMaxAge} onChange={e => setFormExpMaxAge(parseInt(e.target.value) || 30)} className={inputClass} /></div>
                    <div><Label className={labelClass}>Min Income (Lakhs/yr)</Label><Input type="number" required value={formExpMinIncome} onChange={e => setFormExpMinIncome(parseInt(e.target.value) || 5)} className={inputClass} /></div>
                    <div><Label className={labelClass}>Preferred Education</Label><Input placeholder="e.g. B.E., M.B.A." value={formExpEducation} onChange={e => setFormExpEducation(e.target.value)} className={inputClass} /></div>
                    <div><Label className={labelClass}>Preferred Location</Label><Input placeholder="e.g. Chennai" value={formExpLocations.join(', ')} onChange={e => setFormExpLocations(e.target.value.split(',').map(s => s.trim()))} className={inputClass} /></div>
                    <div><Label className={labelClass}>Preferred Job Categories</Label><Input placeholder="IT, Medical" value={formExpJobTypes.join(', ')} onChange={e => setFormExpJobTypes(e.target.value.split(',').map(s => s.trim()))} className={inputClass} /></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        <DialogFooter className="flex justify-between items-center px-8 py-5 border-t border-slate-100 bg-white flex-shrink-0 rounded-b-3xl">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={() => setCurrentStep(currentStep - 1)} disabled={isSavingProfile} className="h-11 px-5 rounded-xl text-sm font-bold border-slate-200 text-slate-600 hover:bg-slate-50">
                <ChevronLeft className="h-4 w-4 mr-1.5" /> Previous
              </Button>
            )}
          </div>
          <div className="flex space-x-3">
            <Button type="button" variant="ghost" onClick={() => { setIsFormOpen(false); setCurrentStep(1); }} disabled={isSavingProfile} className="h-11 px-5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100">
              Cancel
            </Button>
            {currentStep < totalSteps ? (
              <Button type="button" onClick={() => setCurrentStep(currentStep + 1)} className="h-11 px-7 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20">
                Next <ChevronRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button type="submit" onClick={handleSaveProfile} disabled={isSavingProfile} className="h-11 px-8 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20">
                {isSavingProfile ? 'Saving...' : (formMode === 'add' ? 'Register Profile' : 'Save Changes')}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
