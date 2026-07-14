import { useApp } from '../../store/AppContext';
import { UserPlus, Plus } from 'lucide-react';
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
  } = useApp();

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent className="min-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className={`h-4.5 w-4.5 ${Primary.text[600]}`} />
            <span>{formMode === 'add' ? 'Register New Matrimonial Candidate' : 'Modify Candidate Particulars'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSaveProfile} className={`space-y-6 text-xs ${Surface.text[700]}`}>

          <div className="space-y-3.5">
            <h4 className={`font-extrabold text-[10px] uppercase tracking-wider ${Surface.text[400]} border-b ${Surface.border[100]} pb-1`}>1. Personal & Astro Details</h4>

            <div className={`${Surface[50]} border border-dashed ${Surface.border[200]} rounded-xl p-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4`}>
              <div className="relative group shrink-0">
                <Avatar type={formAvatarUrl || (formGender === 'Male' ? 'male_1' : 'female_1')} className={`h-20 w-20 ring-4 ${Primary.opacity.ring_50}`} />
                {formAvatarUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormAvatarUrl('');
                      showToast('Photograph removed.', 'info');
                    }}
                    className={`absolute -top-1 -right-1 ${Danger[500]} ${Danger.hover.bg[600]} ${Static.textWhite} rounded-full p-1 shadow-md transition`}
                    title="Remove Photograph"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handlePhotoUpload(file);
                    }}
                    className={`flex-1 flex flex-col items-center justify-center border border-dashed ${Surface.border[200]} ${Primary.hover.border[400]} ${Static.white} rounded-lg p-3 cursor-pointer transition text-center group`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(file);
                      }}
                    />
                    <Plus className={`h-4 w-4 ${Surface.text[400]} group-hover:text-indigo-500 transition mb-1`} />
                    <span className={`font-semibold text-[11px] ${Surface.text[700]} group-hover:text-indigo-600`}>
                      Upload Photograph
                    </span>
                    <span className={`text-[9px] ${Surface.text[400]}`}>Drag & drop or click</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Full Name</Label>
                <Input
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Anand Kumar"
                  className={Surface[50]}
                />
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Gender</Label>
                <select
                  value={formGender}
                  onChange={e => setFormGender(e.target.value as any)}
                  className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-2 ${Primary.focus.border} focus:outline-none`}
                >
                  <option value="Male">Male (ஆண்)</option>
                  <option value="Female">Female (பெண்)</option>
                </select>
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Date of Birth</Label>
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
                  className={Surface[50]}
                />
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Age</Label>
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
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Height</Label>
                <Input
                  required
                  value={formHeight}
                  onChange={e => setFormHeight(e.target.value)}
                  placeholder="e.g. 5 ft 8 in"
                  className={Surface[50]}
                />
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Community</Label>
                <select
                  value={formCommunity}
                  onChange={e => setFormCommunity(e.target.value)}
                  className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-2 ${Primary.focus.border} focus:outline-none`}
                >
                  {communities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Current Location (City)</Label>
                <Input
                  required
                  value={formLocation}
                  onChange={e => setFormLocation(e.target.value)}
                  placeholder="e.g. Coimbatore"
                  className={Surface[50]}
                />
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Birth Star (Nakshatra)</Label>
                <select
                  value={formNakshatra}
                  onChange={e => setFormNakshatra(e.target.value)}
                  className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-2 ${Primary.focus.border} focus:outline-none font-bold ${Surface.text[800]}`}
                >
                  {combinedNakshatras.map(n => <option key={n.index} value={n.name}>{n.name} ({n.tamilName})</option>)}
                </select>
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Chevvai Dosham</Label>
                <select
                  value={formChevvai}
                  onChange={e => setFormChevvai(e.target.value as any)}
                  className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-2 ${Primary.focus.border} focus:outline-none`}
                >
                  <option value="No">No Chevvai Dosham</option>
                  <option value="Yes">Yes (Dosham Present)</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Education Degree</Label>
                <Input
                  required
                  value={formEducation}
                  onChange={e => setFormEducation(e.target.value)}
                  placeholder="e.g. M.B.A. Finance"
                  className={Surface[50]}
                />
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Job Category</Label>
                <select
                  value={formJobType}
                  onChange={e => setFormJobType(e.target.value)}
                  className={`w-full ${Surface[50]} border ${Surface.border[200]} rounded-lg p-2 ${Primary.focus.border} focus:outline-none`}
                >
                  {jobCategories.filter(c => c.isActive).map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Annual Income (Lakhs Rs)</Label>
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
            </div>

            <div>
              <Label className={`font-bold ${Surface.text[600]} mb-1`}>Introduce Yourself (Bio)</Label>
              <Textarea
                value={formBio}
                onChange={e => setFormBio(e.target.value)}
                placeholder="Write a warm introduction explaining career goals and ideal partner expectations..."
                className={`${Surface[50]} h-16 resize-none`}
              />
            </div>
          </div>

          <div className="space-y-3.5">
            <h4 className={`font-extrabold text-[10px] uppercase tracking-wider ${Surface.text[400]} border-b ${Surface.border[100]} pb-1`}>2. Target Partner Expectations</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Min Age Expected</Label>
                <Input
                  type="number"
                  min="18"
                  max="60"
                  required
                  value={formExpMinAge}
                  onChange={e => setFormExpMinAge(parseInt(e.target.value) || 21)}
                  className={Surface[50]}
                />
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Max Age Expected</Label>
                <Input
                  type="number"
                  min="18"
                  max="60"
                  required
                  value={formExpMaxAge}
                  onChange={e => setFormExpMaxAge(parseInt(e.target.value) || 30)}
                  className={Surface[50]}
                />
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Minimum Income (Lakhs/yr)</Label>
                <Input
                  type="number"
                  min="1"
                  max="200"
                  required
                  value={formExpMinIncome}
                  onChange={e => setFormExpMinIncome(parseInt(e.target.value) || 5)}
                  className={Surface[50]}
                />
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Preferred Location</Label>
                <Input
                  placeholder="e.g. Chennai"
                  value={formExpLocations.join(', ')}
                  onChange={e => setFormExpLocations(e.target.value.split(',').map(s => s.trim()))}
                  className={Surface[50]}
                />
                <p className={`text-[9px] ${Surface.text[400]} mt-1`}>Separate multiples with commas.</p>
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Preferred Job Categories</Label>
                <Input
                  placeholder="IT & Software, Medical"
                  value={formExpJobTypes.join(', ')}
                  onChange={e => setFormExpJobTypes(e.target.value.split(',').map(s => s.trim()))}
                  className={Surface[50]}
                />
              </div>

              <div>
                <Label className={`font-bold ${Surface.text[600]} mb-1`}>Expected Gold (Sovereigns)</Label>
                <Input
                  type="number"
                  min="0"
                  max="200"
                  value={formExpGold}
                  onChange={e => setFormExpGold(parseInt(e.target.value) || 0)}
                  className={Surface[50]}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {formMode === 'add' ? 'Register Candidate' : 'Save Modifications'}
            </Button>
          </DialogFooter>

          {whatsappConfirmations.filter(w => !w.sent).length > 0 && (
            <div className={`p-4 ${Success[50]} rounded-xl border ${Success.border[100]}`}>
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
      </DialogContent>
    </Dialog>
  );
}
