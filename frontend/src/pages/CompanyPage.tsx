import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../store/AppContext';
import { getCompanyProfile, createCompanyProfile, updateCompanyProfile } from '../api/company';
import type { CompanyProfile } from '../types';
import { Edit, Building2, Mail, Phone, MessageCircle, MapPin, FileText, Shield, Loader2, Save, X, Upload, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import PhoneInput from '@/components/ui/phone-input';
import LocationSelect from '@/components/ui/location-select';
import { Primary, Surface, Success, Static, Composites } from '../theme';

const EMPTY: CompanyProfile = {
  companyName: '', address: '', phone: '', email: '',
  whatsappNumber: '', city: '', state: 'Tamil Nadu', country: 'India',
  gstNumber: '', incorporationDetails: '', companyLogoUrl: '',
};

const CompanyPage: React.FC = () => {
  const { currentUser, showToast } = useApp();
  const [profile, setProfile] = useState<CompanyProfile>(EMPTY);
  const [draft, setDraft] = useState<CompanyProfile>(EMPTY);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getCompanyProfile();
        if (!cancelled) {
          setProfile(data);
          setDraft(data);
          setHasProfile(true);
        }
      } catch {
        if (!cancelled) setHasProfile(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      let saved: CompanyProfile;
      if (hasProfile) {
        saved = await updateCompanyProfile(draft);
      } else {
        saved = await createCompanyProfile(draft);
      }
      setProfile(saved);
      setDraft(saved);
      setHasProfile(true);
      setIsEditing(false);
      showToast('Company profile saved successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  }, [draft, hasProfile, showToast]);

  const handleLogoUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) { showToast('Select a valid image.', 'error'); return; }
    if (file.size > 2 * 1024 * 1024) { showToast('Image must be under 2MB.', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setDraft(prev => ({ ...prev, companyLogoUrl: e.target!.result as string }));
        showToast('Company logo loaded.', 'success');
      }
    };
    reader.readAsDataURL(file);
  }, [showToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className={`h-8 w-8 animate-spin ${Primary.text[400]}`} />
      </div>
    );
  }

  return (
    <div className="min-w-7xl mx-auto space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold ${Surface.text[900]} tracking-tight`}>Company Profile</h2>
          <p className={`text-xs ${Surface.text[500]} mt-0.5`}>Business identity, contact endpoints, and compliance details.</p>
        </div>
        {currentUser?.role === 'Admin' && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => { setDraft(profile); setIsEditing(false); }}>
                  <X className="h-3.5 w-3.5" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  <span>{hasProfile ? 'Update' : 'Create'}</span>
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-3.5 w-3.5" /> <span>{hasProfile ? 'Edit Profile' : 'Setup Profile'}</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {!hasProfile && !isEditing ? (
        <div className={`${Composites.cardDark} flex flex-col items-center justify-center py-20 text-center`}>
          <div className={`p-4 rounded-full ${Primary.opacity.bg_10} mb-4`}>
            <Building2 className={`h-10 w-10 ${Primary.text[400]}`} />
          </div>
          <h3 className={`text-lg font-bold ${Surface.text[800]}`}>No Company Profile Found</h3>
          <p className={`text-sm ${Surface.text[500]} mt-1 max-w-sm`}>Set up your company profile to display business information across the platform.</p>
          {currentUser?.role === 'Admin' && (
            <Button className="mt-6" onClick={() => setIsEditing(true)}>
              <Edit className="h-3.5 w-3.5" /> Setup Profile
            </Button>
          )}
        </div>
      ) : !isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-2xl ${Static.textWhite} flex flex-col justify-between h-fit`}>
            
            {profile.companyLogoUrl ? (
              <div className="flex items-center justify-center bg-white rounded-lg p-8 mb-8">
                <img src={profile.companyLogoUrl} alt="Company Logo" className={`h-32 w-32 object-contain`} />
              </div>
            ) : (
              <div className="flex items-center justify-center bg-slate-800 rounded-lg p-8 mb-8">
                <Building2 className={`h-16 w-16 ${Primary.text[400]}`} />
              </div>
            )}
            
            <div className={`space-y-4 text-xs ${Primary.text[100]}`}>
              <div>
                <span className={`text-[9px] uppercase font-extrabold ${Primary.text[300]} tracking-wider mb-2 block`}>Company Details</span>
                <div className="flex items-start gap-2">
                  <Building2 className={`h-4 w-4 ${Primary.text[400]} shrink-0 mt-1`} />
                  <span className="text-sm">{profile.incorporationDetails || '—'}</span>
                </div>
              </div>
              <div>
                <span className={`text-[9px] uppercase font-extrabold ${Primary.text[300]} tracking-wider mb-2 block`}>GST</span>
                <div className="flex items-start gap-2">
                  <FileText className={`h-4 w-4 ${Primary.text[400]} shrink-0 mt-1`} />
                  <span className="text-sm">{profile.gstNumber || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${Composites.cardDark} lg:col-span-2 p-8 space-y-6`}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <CompanyInfoField icon={<Building2 className={`h-5 w-5 ${Primary.text[400]}`} />} label="COMPANY NAME" value={profile.companyName} />
                <CompanyInfoField icon={<Mail className={`h-5 w-5 ${Primary.text[400]}`} />} label="EMAIL ADDRESS" value={profile.email} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <CompanyInfoField icon={<Phone className={`h-5 w-5 ${Primary.text[400]}`} />} label="PHONE" value={profile.phone} />
                <CompanyInfoField icon={<MessageCircle className={`h-5 w-5 ${Success.text[500]}`} />} label="WHATSAPP" value={profile.whatsappNumber} accent />
              </div>
              <div className={`border-t ${Surface.border[100]}`} />
              <CompanyInfoField icon={<MapPin className={`h-5 w-5 ${Primary.text[400]}`} />} label="HEADQUARTERS" value={profile.address} full />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <CompanyInfoField icon={<MapPin className={`h-5 w-5 ${Primary.text[400]}`} />} label="CITY" value={profile.city || ''} />
                <CompanyInfoField icon={<MapPin className={`h-5 w-5 ${Primary.text[400]}`} />} label="STATE" value={profile.state || ''} />
                <CompanyInfoField icon={<MapPin className={`h-5 w-5 ${Primary.text[400]}`} />} label="COUNTRY" value={profile.country || ''} />
              </div>
            </div>
            
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className={`${Composites.cardDark} space-y-5`}>
          <h3 className={`font-bold text-sm ${Surface.text[900]} border-b ${Surface.border[100]} pb-2`}>
            {hasProfile ? 'Edit Company Details' : 'Create Company Profile'}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Company Name" value={draft.companyName} onChange={(v) => setDraft({ ...draft, companyName: v })} required />
              <Field label="Email" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} type="email" required />
              <PhoneInput label="Phone" value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} required />
            </div>
            <Field label="Address" value={draft.address} onChange={(v) => setDraft({ ...draft, address: v })} required />
            <LocationSelect
              country={draft.country || ''}
              state={draft.state || ''}
              city={draft.city || ''}
              onCountryChange={(name) => setDraft({ ...draft, country: name })}
              onStateChange={(name) => setDraft({ ...draft, state: name })}
              onCityChange={(name) => setDraft({ ...draft, city: name })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PhoneInput label="WhatsApp Number" value={draft.whatsappNumber} onChange={(v) => setDraft({ ...draft, whatsappNumber: v })} required />
              <Field label="GST Number" value={draft.gstNumber} onChange={(v) => setDraft({ ...draft, gstNumber: v })} required />
            </div>
            <Field label="Incorporation Details" value={draft.incorporationDetails} onChange={(v) => setDraft({ ...draft, incorporationDetails: v })} required />
            <div className="space-y-1">
              <Label className={Composites.filterLabel}>Company Logo</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]); }}
                    className="hidden" id="logo-upload" />
                  <label htmlFor="logo-upload" className={`flex items-center gap-2 ${Surface[50]} border ${Surface.border[200]} rounded-lg p-2 text-xs ${Surface.text[800]} font-semibold cursor-pointer hover:border-indigo-300 transition-colors`}>
                    <Upload className={`h-3.5 w-3.5 ${Surface.text[500]}`} />
                    <span>{draft.companyLogoUrl ? 'Change logo' : 'Upload logo'}</span>
                  </label>
                </div>
                {draft.companyLogoUrl && (
                  <div className="flex items-center gap-2">
                    <img src={draft.companyLogoUrl} alt="Logo preview" className="h-10 w-10 object-contain rounded border" />
                    <p className={`text-[10px] ${Success.text[600]} flex items-center gap-1`}><CheckCircle2 className="h-3 w-3" /> Logo set</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

function CompanyInfoField({ icon, label, value, accent, full }: { icon: React.ReactNode; label: string; value: string; accent?: boolean; full?: boolean }) {
  return (
    <div className={`space-y-2 ${full ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className={`text-xs font-bold uppercase tracking-wide ${Primary.text[400]}`}>{label}</span>
      </div>
      <p className={`text-base font-semibold ${accent ? Success.text[600] : Surface.text[800]}`}>{value || '—'}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div className="space-y-1">
      <Label className={Composites.filterLabel}>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className={`${Surface[50]} rounded-md border ${Surface.border[200]} bg-transparent px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300`} />
    </div>
  );
}

export default CompanyPage;
