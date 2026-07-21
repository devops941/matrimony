import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ta';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    companyProfile: 'Company Profile',
    adminConsole: 'Admin Console',
    userCreationSettings: 'Settings',
    employeeAttendance: 'Employee & Attendance',
    manageProfiles: 'Manage Profiles (CRUD)',
    poruthamMatcher: 'Porutham Matcher',
    aiMatchesEngine: 'AI Matches Engine',
    mediaReview: 'Media & Review',
    confirmedMatches: 'Confirmed Matches',
    matchingRulesInfo: 'Matching Rules & Info',
    attendanceEntry: 'Attendance Entry',
    nakshatraPorutham: 'Nakshatra Porutham',
    dashboardTitle: 'Dashboard Overview',
    dashboardSubtitle: "Here's what's happening with your matrimony operations today.",
    companyTitle: 'Company Profile Management',
    companySubtitle: 'Configure official details, logo, and integration settings for the franchise.',
    directoryTitle: 'Profiles Directory',
    directorySubtitle: 'Manage, filter, and organize candidate particulars.',
    matcherTitle: 'Tamil Ten Porutham Astrological Matcher',
    matcherSubtitle: 'Select a primary candidate and evaluate compatibility matches directly via the backend astrology engine.',
    nakshatraTitle: 'நட்சத்திர பொருத்தம் அட்டவணை (Master Astro Grid)',
    nakshatraSubtitle: 'Cross-reference 36 candidate nakshatra padas.',
    adminTitle: 'Administrative Settings',
    adminSubtitle: 'Manage master lists and global system configurations.',
    tabCommunities: 'Communities',
    tabBirthStars: 'Birth Stars',
    tabPoruthamSettings: 'Porutham Settings',
    tabJobCategories: 'Job Categories',
    cardTitleCommunities: 'Active Matrimony Franchises',
    cardSubCommunities: 'Each community is linked with a regional franchise center.',
    cardTitleNakshatras: 'Custom Birth Stars (Nakshatras)',
    cardSubNakshatras: 'Define custom astrological Nakshatras for candidate registration.',
    cardTitlePoruthams: 'Porutham Compatibility Checks',
    cardSubPoruthams: 'Enable or disable individual Porutham checks used in compatibility matching.',
    cardTitleJobCategories: 'Job Categories',
    cardSubJobCategories: 'Manage job categories available in candidate registration forms.',
    addCommunity: 'Add Community',
    addBirthStar: 'Add Birth Star',
    addJobCategory: 'Add Job Category',
    colCommunityName: 'COMMUNITY NAME',
    colStatus: 'STATUS',
    colActions: 'ACTIONS',
    colPorutham: 'PORUTHAM',
    colToggle: 'TOGGLE',
    colJobCategory: 'JOB CATEGORY',
  },
  ta: {
    dashboard: 'முகப்பு',
    companyProfile: 'நிறுவன விவரக்குறிப்பு',
    adminConsole: 'நிர்வாக கன்சோல்',
    userCreationSettings: 'அமைப்புகள்',
    employeeAttendance: 'ஊழியர் மற்றும் வருகை',
    manageProfiles: 'சுயவிவரங்களை நிர்வகி',
    poruthamMatcher: 'பொருத்தம் பார்த்தல்',
    aiMatchesEngine: 'AI பொருத்தம் இயந்திரம்',
    mediaReview: 'ஊடகம் மற்றும் விமர்சனம்',
    confirmedMatches: 'உறுதிப்படுத்தப்பட்ட பொருத்தங்கள்',
    matchingRulesInfo: 'பொருத்த விதிகள் மற்றும் தகவல்',
    attendanceEntry: 'வருகை பதிவு',
    nakshatraPorutham: 'நட்சத்திர பொருத்தம்',
    dashboardTitle: 'முகப்பு கண்ணோட்டம்',
    dashboardSubtitle: 'இன்று உங்கள் திருமண சேவைகளில் நடப்பவை இங்கே.',
    companyTitle: 'நிறுவன சுயவிவர மேலாண்மை',
    companySubtitle: 'அலுவலக விவரங்கள், லோகோ மற்றும் ஒருங்கிணைப்புகளை உள்ளமைக்கவும்.',
    directoryTitle: 'சுயவிவர கோப்பகம்',
    directorySubtitle: 'வேட்பாளர் விவரங்களை நிர்வகிக்கவும், வடிகட்டவும் மற்றும் ஒழுங்கமைக்கவும்.',
    matcherTitle: 'தமிழ் 10 பொருத்தம் ஜோதிட செயலி',
    matcherSubtitle: 'ஒரு வேட்பாளரைத் தேர்ந்தெடுத்து, ஜோதிட பொருத்தங்களை நேரடியாக மதிப்பிடவும்.',
    nakshatraTitle: 'நட்சத்திர பொருத்தம் அட்டவணை',
    nakshatraSubtitle: '36 நட்சத்திர பாதங்களை சரிபார்க்கவும்.',
    adminTitle: 'நிர்வாக அமைப்புகள்',
    adminSubtitle: 'முக்கிய பட்டியல்கள் மற்றும் உலகளாவிய கணினி அமைப்புகளை நிர்வகிக்கவும்.',
    tabCommunities: 'சமூகங்கள்',
    tabBirthStars: 'நட்சத்திரங்கள்',
    tabPoruthamSettings: 'பொருத்தம் அமைப்புகள்',
    tabJobCategories: 'பணி பிரிவுகள்',
    cardTitleCommunities: 'செயலில் உள்ள திருமண உரிமை மையங்கள்',
    cardSubCommunities: 'ஒவ்வொரு சமூகமும் ஒரு பிராந்திய உரிமையாளருடன் இணைக்கப்பட்டுள்ளது.',
    cardTitleNakshatras: 'தனிப்பயன் நட்சத்திரங்கள்',
    cardSubNakshatras: 'வேட்பாளர் பதிவுக்காக தனிப்பயன் ஜோதிட நட்சத்திரங்களை வரையறுக்கவும்.',
    cardTitlePoruthams: 'பொருத்தம் பொருந்தக்கூடிய சரிபார்ப்புகள்',
    cardSubPoruthams: 'பொருத்தம் சரிபார்ப்புகளை இயக்கவும் அல்லது முடக்கவும்.',
    cardTitleJobCategories: 'பணி பிரிவுகள்',
    cardSubJobCategories: 'வேட்பாளர் பதிவு படிவங்களில் உள்ள பணி பிரிவுகளை நிர்வகிக்கவும்.',
    addCommunity: 'சமூகத்தை சேர்',
    addBirthStar: 'நட்சத்திரத்தை சேர்',
    addJobCategory: 'பணி பிரிவை சேர்',
    colCommunityName: 'சமூகத்தின் பெயர்',
    colStatus: 'நிலை',
    colActions: 'செயல்கள்',
    colPorutham: 'பொருத்தம்',
    colToggle: 'மாற்று',
    colJobCategory: 'பணி பிரிவு',
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const t = (key: string) => translations[language][key] || key;
  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
