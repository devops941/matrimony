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
    userCreationSettings: 'User Creation & Settings',
    employeeAttendance: 'Employee & Attendance',
    manageProfiles: 'Manage Profiles (CRUD)',
    poruthamMatcher: 'Porutham Matcher',
    aiMatchesEngine: 'AI Matches Engine',
    mediaReview: 'Media & Review',
    confirmedMatches: 'Confirmed Matches',
    matchingRulesInfo: 'Matching Rules & Info',
    attendanceEntry: 'Attendance Entry',
    nakshatraPorutham: 'Nakshatra Porutham',
  },
  ta: {
    dashboard: 'முகப்பு',
    companyProfile: 'நிறுவன விவரக்குறிப்பு',
    adminConsole: 'நிர்வாக கன்சோல்',
    userCreationSettings: 'பயனர் உருவாக்கம் மற்றும் அமைப்புகள்',
    employeeAttendance: 'ஊழியர் மற்றும் வருகை',
    manageProfiles: 'சுயவிவரங்களை நிர்வகி (CRUD)',
    poruthamMatcher: 'பொருத்தம் பார்த்தல்',
    aiMatchesEngine: 'AI பொருத்தம் இயந்திரம்',
    mediaReview: 'ஊடகம் மற்றும் விமர்சனம்',
    confirmedMatches: 'உறுதிப்படுத்தப்பட்ட பொருத்தங்கள்',
    matchingRulesInfo: 'பொருத்த விதிகள் மற்றும் தகவல்',
    attendanceEntry: 'வருகை பதிவு',
    nakshatraPorutham: 'நட்சத்திர பொருத்தம்',
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
