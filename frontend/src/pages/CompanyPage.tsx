import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../store/AppContext';
import { getCompanyProfile, createCompanyProfile, updateCompanyProfile } from '../api/company';
import type { CompanyProfile } from '../types';
import { Edit, Building2, Mail, Phone, MessageCircle, MapPin, FileText, Shield, Loader2, Save, X, Upload, CheckCircle2, Globe, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import PhoneInput from '@/components/ui/phone-input';
import LocationSelect from '@/components/ui/location-select';
import { Primary, Surface, Success, Static, Composites } from '../theme';
import { useI18n } from '../i18n';
import { motion } from 'motion/react';

const EMPTY: CompanyProfile = {
  companyName: '', address: '', phone: '', email: '',
  whatsappNumber: '', city: '', state: 'Tamil Nadu', country: 'India',
  gstNumber: '', incorporationDetails: '', companyLogoUrl: '',
};

const CompanyPage: React.FC = () => {
  const { currentUser, showToast } = useApp();
  const { t } = useI18n();
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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Background Banner */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-6 lg:px-8 -mt-24 relative z-10 pb-12">
        
        {/* Main Content Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
          
          {/* Header section with Logo & Actions */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              {/* Profile Avatar / Logo */}
              <div className="relative group">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center relative z-10">
                  {profile.companyLogoUrl && !isEditing ? (
                    <img src={profile.companyLogoUrl} alt="Company Logo" className="w-full h-full object-contain p-2 bg-slate-50" />
                  ) : draft.companyLogoUrl && isEditing ? (
                    <img src={draft.companyLogoUrl} alt="Draft Logo" className="w-full h-full object-contain p-2 bg-slate-50" />
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]); }} className="hidden" />
                      <Upload className="text-white w-8 h-8" />
                    </label>
                  )}
                </div>
              </div>
              
              <div className="pb-2">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {hasProfile ? profile.companyName : t('companyTitle')}
                </h1>
                <p className="text-sm text-slate-500 mt-1.5 font-medium">{hasProfile ? profile.city || profile.address : t('companySubtitle')}</p>
              </div>
            </div>

            {/* Action Buttons */}
            {currentUser?.role === 'Admin' && (
              <div className="flex justify-center pb-2">
                {isEditing ? (
                  <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <button onClick={() => { setDraft(profile); setIsEditing(false); }} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {hasProfile ? 'Save Changes' : 'Create Profile'}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl shadow-sm transition-all">
                    <Edit className="w-4 h-4 text-slate-500" /> 
                    {hasProfile ? 'Edit Profile' : 'Setup Profile'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Form or Display View */}
          <div className="p-6 md:p-8 bg-slate-50/30">
            {!hasProfile && !isEditing ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-indigo-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Your profile is empty</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">Add your business identity, contact details, and compliance information to display it across the platform.</p>
                {currentUser?.role === 'Admin' && (
                  <button onClick={() => setIsEditing(true)} className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all mx-auto">
                    <Edit className="w-4 h-4" /> Setup Profile Now
                  </button>
                )}
              </div>
            ) : !isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Contact Info Card */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoField icon={<Mail className="w-5 h-5 text-indigo-500" />} label="Email Address" value={profile.email} />
                    <InfoField icon={<Phone className="w-5 h-5 text-indigo-500" />} label="Phone Number" value={profile.phone} />
                    <InfoField icon={<MessageCircle className="w-5 h-5 text-emerald-500" />} label="WhatsApp Support" value={profile.whatsappNumber} accent />
                    <InfoField icon={<Globe className="w-5 h-5 text-indigo-500" />} label="Headquarters" value={profile.address} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 mt-8">Location Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <InfoField icon={<MapPin className="w-4 h-4 text-slate-400" />} label="City" value={profile.city} smallIcon />
                    <InfoField icon={<MapPin className="w-4 h-4 text-slate-400" />} label="State" value={profile.state || 'Not Set'} smallIcon />
                    <InfoField icon={<MapPin className="w-4 h-4 text-slate-400" />} label="Country" value={profile.country || 'Not Set'} smallIcon />
                  </div>
                </div>

                {/* Compliance / Registration Card */}
                <div className="col-span-1 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-500" /> Compliance
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Registration Details</p>
                      <p className="text-sm font-semibold text-slate-800">{profile.incorporationDetails || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">GST Number</p>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <p className="text-sm font-semibold text-slate-800 font-mono bg-white px-2 py-1 border border-slate-200 rounded">{profile.gstNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">Business Basics</h3>
                    <Field label="Company Name" value={draft.companyName} onChange={(v) => setDraft({ ...draft, companyName: v })} required />
                    <Field label="Email Address" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} type="email" required />
                    <PhoneInput label="Phone Number" value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} required />
                    <PhoneInput label="WhatsApp Support" value={draft.whatsappNumber} onChange={(v) => setDraft({ ...draft, whatsappNumber: v })} required />
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">Location</h3>
                    <Field label="Street Address" value={draft.address} onChange={(v) => setDraft({ ...draft, address: v })} required />
                    <LocationSelect
                      country={draft.country || ''}
                      state={draft.state || ''}
                      city={draft.city || ''}
                      onCountryChange={(name) => setDraft({ ...draft, country: name })}
                      onStateChange={(name) => setDraft({ ...draft, state: name })}
                      onCityChange={(name) => setDraft({ ...draft, city: name })}
                    />
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-8">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6">Compliance & Legal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="Incorporation Details" value={draft.incorporationDetails} onChange={(v) => setDraft({ ...draft, incorporationDetails: v })} required />
                    <Field label="GST Number" value={draft.gstNumber} onChange={(v) => setDraft({ ...draft, gstNumber: v })} required />
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

function InfoField({ icon, label, value, accent, smallIcon }: { icon: React.ReactNode; label: string; value: string; accent?: boolean; smallIcon?: boolean }) {
  return (
    <div className="space-y-1.5 flex items-start gap-3">
      <div className={`mt-0.5 ${smallIcon ? '' : 'p-2 bg-slate-50 rounded-lg border border-slate-100'}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-semibold ${accent ? 'text-emerald-600' : 'text-slate-800'}`}>{value || '—'}</p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="bg-slate-50/50 rounded-lg border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 py-2.5 text-sm font-medium shadow-sm transition-all" />
    </div>
  );
}

export default CompanyPage;
