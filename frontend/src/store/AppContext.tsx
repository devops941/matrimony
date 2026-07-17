import React, { createContext, useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { toast as sonnerToast } from 'sonner';
import {
  Profile,
  CommunityInfo,
  MatchRequest,
  Employee,
  AttendanceRecord,
  EmployeePermissions,
  GalleryItem,
  CustomerReview,
  Testimonial
} from '../types';

import { calculatePorutham, NAKSHATRAS, RASI_LORDS, MatchingResult } from '../porutham';
import { getCommunities, createCommunity, updateCommunity, deleteCommunity } from '../api/community';
import { getCustomNakshatras, createCustomNakshatra, updateCustomNakshatra, deleteCustomNakshatra, CustomNakshatra } from '../api/nakshatra_api';
import { getPoruthams, updatePorutham, PoruthamConfig, getMatchCandidates } from '../api/porutham_api';
import { getJobCategories, createJobCategory, updateJobCategory, deleteJobCategory, JobCategory } from '../api/job_category_api';
import { getProfiles, createProfile, updateProfile, deleteProfile } from '../api/profile_api';


interface AppContextType {
  currentUser: Employee | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<Employee | null>>;
  loginUsername: string;
  setLoginUsername: React.Dispatch<React.SetStateAction<string>>;
  loginPassword: string;
  setLoginPassword: React.Dispatch<React.SetStateAction<string>>;
  loginError: string;
  setLoginError: React.Dispatch<React.SetStateAction<string>>;

  activeTab: 'dashboard' | 'directory' | 'matcher' | 'recommend' | 'employees' | 'admin' | 'help' | 'company' | 'social' | 'confirmed' | 'attendance' | 'nakshatra';
  setActiveTab: React.Dispatch<React.SetStateAction<'dashboard' | 'directory' | 'matcher' | 'recommend' | 'employees' | 'admin' | 'help' | 'company' | 'social' | 'confirmed' | 'attendance' | 'nakshatra'>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  socialSubTab: 'gallery' | 'reviews' | 'testimonials';
  setSocialSubTab: React.Dispatch<React.SetStateAction<'gallery' | 'reviews' | 'testimonials'>>;
  profiles: Profile[];
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
  communities: CommunityInfo[];
  setCommunities: React.Dispatch<React.SetStateAction<CommunityInfo[]>>;
  requests: MatchRequest[];
  setRequests: React.Dispatch<React.SetStateAction<MatchRequest[]>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  reviews: CustomerReview[];
  setReviews: React.Dispatch<React.SetStateAction<CustomerReview[]>>;
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;

  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;

  employeeSearch: string;
  setEmployeeSearch: React.Dispatch<React.SetStateAction<string>>;
  employeeSelectedDate: string;
  setEmployeeSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  isEmployeeFormOpen: boolean;
  setIsEmployeeFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  employeeFormMode: 'add' | 'edit';
  setEmployeeFormMode: React.Dispatch<React.SetStateAction<'add' | 'edit'>>;
  editingEmployeeId: string | null;
  setEditingEmployeeId: React.Dispatch<React.SetStateAction<string | null>>;

  formEmpName: string;
  setFormEmpName: React.Dispatch<React.SetStateAction<string>>;
  formEmpAvatarUrl: string;
  setFormEmpAvatarUrl: React.Dispatch<React.SetStateAction<string>>;
  formEmpEmail: string;
  setFormEmpEmail: React.Dispatch<React.SetStateAction<string>>;
  formEmpUsername: string;
  setFormEmpUsername: React.Dispatch<React.SetStateAction<string>>;
  formEmpPassword: string;
  setFormEmpPassword: React.Dispatch<React.SetStateAction<string>>;
  formEmpRole: 'Admin' | 'Employee';
  setFormEmpRole: React.Dispatch<React.SetStateAction<'Admin' | 'Employee'>>;
  formEmpDesignation: string;
  setFormEmpDesignation: React.Dispatch<React.SetStateAction<string>>;
  formEmpPhone: string;
  setFormEmpPhone: React.Dispatch<React.SetStateAction<string>>;
  formEmpPermissions: EmployeePermissions;
  setFormEmpPermissions: React.Dispatch<React.SetStateAction<EmployeePermissions>>;

  jothidamWeight: number;
  setJothidamWeight: React.Dispatch<React.SetStateAction<number>>;
  expectationWeight: number;
  setExpectationWeight: React.Dispatch<React.SetStateAction<number>>;

  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  genderFilter: 'All' | 'Male' | 'Female';
  setGenderFilter: React.Dispatch<React.SetStateAction<'All' | 'Male' | 'Female'>>;
  communityFilter: string;
  setCommunityFilter: React.Dispatch<React.SetStateAction<string>>;
  locationFilter: string;
  setLocationFilter: React.Dispatch<React.SetStateAction<string>>;
  starFilter: string;
  setStarFilter: React.Dispatch<React.SetStateAction<string>>;
  chevvaiFilter: string;
  setChevvaiFilter: React.Dispatch<React.SetStateAction<string>>;
  selectedProfileId: string | null;
  setSelectedProfileId: React.Dispatch<React.SetStateAction<string | null>>;

  matcherBrideId: string;
  setMatcherBrideId: (id: string) => void;
  matcherGroomId: string;
  setMatcherGroomId: (id: string) => void;
  aiAnalysisText: string;
  setAiAnalysisText: React.Dispatch<React.SetStateAction<string>>;
  isAiAnalyzing: boolean;
  setIsAiAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;

  matcherGender: 'Male' | 'Female';
  setMatcherGender: React.Dispatch<React.SetStateAction<'Male' | 'Female'>>;
  matcherPrimaryProfileId: string;
  setMatcherPrimaryProfileId: React.Dispatch<React.SetStateAction<string>>;
  matcherMatches: any[];
  setMatcherMatches: React.Dispatch<React.SetStateAction<any[]>>;
  matcherSelectedMatch: any | null;
  setMatcherSelectedMatch: React.Dispatch<React.SetStateAction<any | null>>;
  isMatcherLoading: boolean;

  recommendTargetId: string;
  setRecommendTargetId: React.Dispatch<React.SetStateAction<string>>;

  isFormOpen: boolean;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formMode: 'add' | 'edit';
  setFormMode: React.Dispatch<React.SetStateAction<'add' | 'edit'>>;
  editingProfileId: string | null;
  setEditingProfileId: React.Dispatch<React.SetStateAction<string | null>>;

  formName: string;
  setFormName: React.Dispatch<React.SetStateAction<string>>;
  formGender: 'Male' | 'Female';
  setFormGender: React.Dispatch<React.SetStateAction<'Male' | 'Female'>>;
  formAge: number;
  setFormAge: React.Dispatch<React.SetStateAction<number>>;
  formHeight: string;
  setFormHeight: React.Dispatch<React.SetStateAction<string>>;
  formLocation: string;
  setFormLocation: React.Dispatch<React.SetStateAction<string>>;
  formCommunity: string;
  setFormCommunity: React.Dispatch<React.SetStateAction<string>>;
  formNakshatra: string;
  setFormNakshatra: React.Dispatch<React.SetStateAction<string>>;
  formEducation: string;
  setFormEducation: React.Dispatch<React.SetStateAction<string>>;
  formJobType: string;
  setFormJobType: React.Dispatch<React.SetStateAction<string>>;
  formIncome: number;
  setFormIncome: React.Dispatch<React.SetStateAction<number>>;
  formBio: string;
  setFormBio: React.Dispatch<React.SetStateAction<string>>;
  formChevvai: 'Yes' | 'No' | 'Unknown';
  setFormChevvai: React.Dispatch<React.SetStateAction<'Yes' | 'No' | 'Unknown'>>;
  formBirthDate: string;
  setFormBirthDate: React.Dispatch<React.SetStateAction<string>>;
  formBirthTime: string;
  setFormBirthTime: React.Dispatch<React.SetStateAction<string>>;
  formBirthPlace: string;
  setFormBirthPlace: React.Dispatch<React.SetStateAction<string>>;
  formAvatarUrl: string;
  setFormAvatarUrl: React.Dispatch<React.SetStateAction<string>>;

  formExpMinAge: number;
  setFormExpMinAge: React.Dispatch<React.SetStateAction<number>>;
  formExpMaxAge: number;
  setFormExpMaxAge: React.Dispatch<React.SetStateAction<number>>;
  formExpCommunities: string[];
  setFormExpCommunities: React.Dispatch<React.SetStateAction<string[]>>;
  formExpJobTypes: string[];
  setFormExpJobTypes: React.Dispatch<React.SetStateAction<string[]>>;
  formExpMinIncome: number;
  setFormExpMinIncome: React.Dispatch<React.SetStateAction<number>>;
  formExpLocations: string[];
  setFormExpLocations: React.Dispatch<React.SetStateAction<string[]>>;
  formExpGold: number;
  setFormExpGold: React.Dispatch<React.SetStateAction<number>>;
  formExpHouse: boolean;
  setFormExpHouse: React.Dispatch<React.SetStateAction<boolean>>;

  isNewCommunityOpen: boolean;
  setIsNewCommunityOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newCommName: string;
  setNewCommName: React.Dispatch<React.SetStateAction<string>>;
  newCommRegion: string;
  setNewCommRegion: React.Dispatch<React.SetStateAction<string>>;
  newCommCode: string;
  setNewCommCode: React.Dispatch<React.SetStateAction<string>>;

  isPaymentPopupOpen: boolean;
  setIsPaymentPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pendingProfileData: Profile | null;
  setPendingProfileData: React.Dispatch<React.SetStateAction<Profile | null>>;
  whatsappConfirmations: { profileId: string; message: string; sent: boolean }[];
  setWhatsappConfirmations: React.Dispatch<React.SetStateAction<{ profileId: string; message: string; sent: boolean }[]>>;

  maleCount: number;
  femaleCount: number;
  totalProfiles: number;
  pendingRequestsCount: number;
  acceptedRequestsCount: number;
  filteredProfiles: Profile[];
  uniqueLocations: string[];
  uniqueCommunities: string[];
  uniqueStars: string[];
  currentBride: Profile | undefined;
  currentGroom: Profile | undefined;
  matchingResult: MatchingResult | null;
  getCompositeScore: (bride: Profile, groom: Profile) => {
    percentage: number;
    astroPct: number;
    expBridePct: number;
    expGroomPct: number;
    rating: 'Excellent' | 'Good' | 'Average' | 'Low';
    hasRajju: boolean;
  };
  calculateExpectationMatch: (profileA: Profile, profileB: Profile) => {
    score: number;
    maxScore: number;
    percentage: number;
  };
  recommendedCandidates: { profile: Profile; stats: { percentage: number; astroPct: number; expBridePct: number; expGroomPct: number; rating: 'Excellent' | 'Good' | 'Average' | 'Low'; hasRajju: boolean } }[];

  handlePhotoUpload: (file: File) => void;
  handleOpenAddForm: () => void;
  handleOpenEditForm: (profile: Profile, e?: React.MouseEvent) => void;
  handleSaveProfile: (e: React.FormEvent) => void;
  handleDeleteProfile: (id: string, e?: React.MouseEvent) => void;
  handlePaymentSuccess: () => void;
  handleSaveEmployee: (e: React.FormEvent) => void;
  handleOpenAddEmployee: () => void;
  handleOpenEditEmployee: (emp: Employee) => void;
  handleDeleteEmployee: (id: string) => void;
  handleMarkAttendance: (employeeId: string, status: 'Present' | 'Absent' | 'On Leave' | 'Half Day', notes?: string) => void;
  handleDeleteAttendance: (attendanceId: string) => void;
  handleClockInSelf: () => void;
  handleClockOutSelf: () => void;
  handleSendRequest: (senderId: string, receiverId: string) => void;
  handleUpdateStatus: (reqId: string, status: 'Accepted' | 'Declined') => void;
  handleCreateCommunity: (e: React.FormEvent) => void;
  handleUpdateCommunity: (id: string, payload: { name?: string; isActive?: boolean }) => Promise<void>;
  handleDeleteCommunity: (id: string) => Promise<void>;
  handleAiAdvisory: (bride: Profile, groom: Profile) => void;
  combinedNakshatras: any[];
  newNakshatraName: string;
  setNewNakshatraName: React.Dispatch<React.SetStateAction<string>>;
  isNewNakshatraOpen: boolean;
  setIsNewNakshatraOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateNakshatra: (e: React.FormEvent) => Promise<void>;
  handleUpdateNakshatra: (id: string, payload: { name?: string; isActive?: boolean }) => Promise<void>;
  handleDeleteNakshatra: (id: string) => Promise<void>;
  customNakshatras: CustomNakshatra[];
  poruthams: PoruthamConfig[];
  handleTogglePorutham: (id: string, isEnabled: boolean) => Promise<void>;
  jobCategories: JobCategory[];
  handleCreateJobCategory: (e: React.FormEvent) => Promise<void>;
  handleUpdateJobCategory: (id: string, payload: { name?: string; isActive?: boolean }) => Promise<void>;
  handleDeleteJobCategory: (id: string) => Promise<void>;
  newJobCategoryName: string;
  setNewJobCategoryName: React.Dispatch<React.SetStateAction<string>>;
  isNewJobCategoryOpen: boolean;
  setIsNewJobCategoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateProfileData: (id: string, payload: Partial<Profile>) => Promise<void>;
  isSavingProfile: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const saved = localStorage.getItem('matrimony_logged_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('matrimony_logged_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'directory' | 'matcher' | 'recommend' | 'employees' | 'admin' | 'help' | 'company' | 'social' | 'confirmed' | 'attendance' | 'nakshatra'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [socialSubTab, setSocialSubTab] = useState<'gallery' | 'reviews' | 'testimonials'>('gallery');

  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('matrimony_profiles');
    return saved ? JSON.parse(saved) : [];
  });

  const [communities, setCommunities] = useState<CommunityInfo[]>([]);
  const [customNakshatras, setCustomNakshatras] = useState<CustomNakshatra[]>([]);
  const [poruthams, setPoruthams] = useState<PoruthamConfig[]>([]);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [newJobCategoryName, setNewJobCategoryName] = useState('');
  const [isNewJobCategoryOpen, setIsNewJobCategoryOpen] = useState(false);

  useEffect(() => {
    async function fetchComms() {
      try {
        const data = await getCommunities();
        setCommunities(data);
      } catch (err) {
        console.error('Failed to load communities', err);
      }
    }
    async function fetchNakshatras() {
      try {
        const data = await getCustomNakshatras();
        setCustomNakshatras(data);
      } catch (err) {
        console.error('Failed to load custom Nakshatras', err);
      }
    }
    async function fetchPoruthams() {
      try {
        const data = await getPoruthams();
        setPoruthams(data);
      } catch (err) {
        console.error('Failed to load Poruthams', err);
      }
    }
    async function fetchJobCategories() {
      try {
        const data = await getJobCategories();
        setJobCategories(data);
      } catch (err) {
        console.error('Failed to load Job Categories', err);
      }
    }
    async function fetchProfiles() {
      try {
        const data = await getProfiles();
        setProfiles(data);
      } catch (err) {
        console.error('Failed to load profiles', err);
      }
    }
    fetchComms();
    fetchNakshatras();
    fetchPoruthams();
    fetchJobCategories();
    fetchProfiles();
  }, []);

  const combinedNakshatras = useMemo(() => {
    const customList = customNakshatras
      .filter(n => n.isActive !== false)
      .map((n, i) => ({
        index: NAKSHATRAS.length + i + 1,
        name: n.name,
        tamilName: n.name,
        gana: 'Deva' as const,
        defaultRasi: 'Aries'
      }));
    return [...NAKSHATRAS, ...customList];
  }, [customNakshatras]);




  const [requests, setRequests] = useState<MatchRequest[]>(() => {
    const saved = localStorage.getItem('matrimony_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('matrimony_employees');
    return saved ? JSON.parse(saved) : [
      {
        id: "emp-1",
        name: "Baskar",
        email: "baskar@manappandal.com",
        username: "admin",
        password: "password",
        role: "Admin",
        permissions: { view: true, create: true, edit: true, delete: true },
        avatarUrl: "male_1",
        designation: "General Manager",
        phone: "9876543210",
        joinedDate: "2024-01-01"
      }
    ];
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('matrimony_attendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('matrimony_gallery');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    const saved = localStorage.getItem('matrimony_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('matrimony_testimonials');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('matrimony_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('matrimony_attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('matrimony_profiles', JSON.stringify(profiles)); }, [profiles]);
  useEffect(() => { localStorage.setItem('matrimony_requests', JSON.stringify(requests)); }, [requests]);
  useEffect(() => { localStorage.setItem('matrimony_gallery', JSON.stringify(gallery)); }, [gallery]);
  useEffect(() => { localStorage.setItem('matrimony_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('matrimony_testimonials', JSON.stringify(testimonials)); }, [testimonials]);

  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeSelectedDate, setEmployeeSelectedDate] = useState('2026-06-28');
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [employeeFormMode, setEmployeeFormMode] = useState<'add' | 'edit'>('add');
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

  const [formEmpName, setFormEmpName] = useState('');
  const [formEmpAvatarUrl, setFormEmpAvatarUrl] = useState('');
  const [formEmpEmail, setFormEmpEmail] = useState('');
  const [formEmpUsername, setFormEmpUsername] = useState('');
  const [formEmpPassword, setFormEmpPassword] = useState('');
  const [formEmpRole, setFormEmpRole] = useState<'Admin' | 'Employee'>('Employee');
  const [formEmpDesignation, setFormEmpDesignation] = useState('');
  const [formEmpPhone, setFormEmpPhone] = useState('');
  const [formEmpPermissions, setFormEmpPermissions] = useState<EmployeePermissions>({
    view: true,
    create: true,
    edit: false,
    delete: false,
    viewAttendance: false,
    editAttendance: false,
    deleteAttendance: false
  });

  const [jothidamWeight, setJothidamWeight] = useState(0.7);
  const [expectationWeight, setExpectationWeight] = useState(0.3);

  // toast is handled by sonner — no local state needed

  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');
  const [communityFilter, setCommunityFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [starFilter, setStarFilter] = useState('All');
  const [chevvaiFilter, setChevvaiFilter] = useState('All');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const [matcherGender, setMatcherGender] = useState<'Male' | 'Female'>('Male');
  const [matcherPrimaryProfileId, setMatcherPrimaryProfileId] = useState<string>('');
  const [matcherMatches, setMatcherMatches] = useState<any[]>([]);
  const [matcherSelectedMatch, setMatcherSelectedMatch] = useState<any | null>(null);
  const [isMatcherLoading, setIsMatcherLoading] = useState<boolean>(false);

  const matcherBrideId = useMemo(() => {
    return matcherGender === 'Female' ? matcherPrimaryProfileId : (matcherSelectedMatch?.profile?.id || '');
  }, [matcherGender, matcherPrimaryProfileId, matcherSelectedMatch]);

  const matcherGroomId = useMemo(() => {
    return matcherGender === 'Male' ? matcherPrimaryProfileId : (matcherSelectedMatch?.profile?.id || '');
  }, [matcherGender, matcherPrimaryProfileId, matcherSelectedMatch]);

  const setMatcherBrideId = useCallback((id: string) => {
    setMatcherGender('Female');
    setMatcherPrimaryProfileId(id);
  }, []);

  const setMatcherGroomId = useCallback((id: string) => {
    setMatcherGender('Male');
    setMatcherPrimaryProfileId(id);
  }, []);

  const [aiAnalysisText, setAiAnalysisText] = useState<string>('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);

  const [recommendTargetId, setRecommendTargetId] = useState<string>('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formGender, setFormGender] = useState<'Male' | 'Female'>('Male');
  const [formAge, setFormAge] = useState(25);
  const [formHeight, setFormHeight] = useState('5 ft 6 in');
  const [formLocation, setFormLocation] = useState('Chennai');
  const [formCommunity, setFormCommunity] = useState('Kongu Vellalar');
  const [formNakshatra, setFormNakshatra] = useState('Ashwini');
  const [formEducation, setFormEducation] = useState('B.E. Computer Science');
  const [formJobType, setFormJobType] = useState('IT & Software');
  const [formIncome, setFormIncome] = useState(12);
  const [formBio, setFormBio] = useState('');
  const [formChevvai, setFormChevvai] = useState<'Yes' | 'No' | 'Unknown'>('No');
  const [formBirthDate, setFormBirthDate] = useState('1999-01-01');
  const [formBirthTime, setFormBirthTime] = useState('09:00 AM');
  const [formBirthPlace, setFormBirthPlace] = useState('Chennai');
  const [formAvatarUrl, setFormAvatarUrl] = useState('');

  const [formExpMinAge, setFormExpMinAge] = useState(22);
  const [formExpMaxAge, setFormExpMaxAge] = useState(30);
  const [formExpCommunities, setFormExpCommunities] = useState<string[]>(['Kongu Vellalar']);
  const [formExpJobTypes, setFormExpJobTypes] = useState<string[]>(['IT & Software']);
  const [formExpMinIncome, setFormExpMinIncome] = useState(6);
  const [formExpLocations, setFormExpLocations] = useState<string[]>(['Chennai']);
  const [formExpGold, setFormExpGold] = useState(30);
  const [formExpHouse, setFormExpHouse] = useState(false);

  useEffect(() => {
    if (!formBirthDate) return;
    const birthDate = new Date(formBirthDate);
    if (isNaN(birthDate.getTime())) return;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setFormAge(age);
  }, [formBirthDate]);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (type === 'success') sonnerToast.success(text);
    else if (type === 'error') sonnerToast.error(text);
    else sonnerToast.info(text);
  }, []);

  const [isNewCommunityOpen, setIsNewCommunityOpen] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommRegion, setNewCommRegion] = useState('');
  const [newCommCode, setNewCommCode] = useState('');

  const [newNakshatraName, setNewNakshatraName] = useState('');
  const [isNewNakshatraOpen, setIsNewNakshatraOpen] = useState(false);



  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [pendingProfileData, setPendingProfileData] = useState<Profile | null>(null);
  const [whatsappConfirmations, setWhatsappConfirmations] = useState<{ profileId: string; message: string; sent: boolean }[]>([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const fetchMatcherMatches = useCallback(async (profileId: string) => {
    if (!profileId) return;
    setIsMatcherLoading(true);
    try {
      const data = await getMatchCandidates(profileId);
      setMatcherMatches(data);
      if (data.length > 0) {
        setMatcherSelectedMatch(data[0]);
      } else {
        setMatcherSelectedMatch(null);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch matches from backend.', 'error');
    } finally {
      setIsMatcherLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (matcherPrimaryProfileId) {
      fetchMatcherMatches(matcherPrimaryProfileId);
    } else {
      setMatcherMatches([]);
      setMatcherSelectedMatch(null);
    }
  }, [matcherPrimaryProfileId, fetchMatcherMatches]);

  useEffect(() => {
    const list = profiles.filter(p => p.gender === matcherGender && p.approvedByAdmin);
    if (list.length > 0) {
      const currentIsValid = list.some(p => p.id === matcherPrimaryProfileId);
      if (!currentIsValid) {
        setMatcherPrimaryProfileId('');
      }
    } else {
      setMatcherPrimaryProfileId('');
    }
  }, [matcherGender, profiles]);

  useEffect(() => {
    if (profiles.length > 0 && !recommendTargetId) {
      setRecommendTargetId(profiles[0].id);
    }
  }, [profiles]);



  const handlePhotoUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size should be less than 2MB for compatibility.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormAvatarUrl(e.target.result as string);
        showToast('Photograph uploaded successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  }, [showToast]);

  const handleOpenAddForm = useCallback(() => {
    if (currentUser && !currentUser.permissions.create) {
      showToast('Access Denied: Your employee role does not have permission to create candidate profiles.', 'error');
      return;
    }
    const activeComms = communities.filter(c => c.isActive !== false);
    const activeJobs = jobCategories.filter(c => c.isActive);
    const firstComm = activeComms.length > 0 ? activeComms[0].name : '';
    const firstStar = combinedNakshatras.length > 0 ? combinedNakshatras[0].name : 'Ashwini';
    const firstJob = activeJobs.length > 0 ? activeJobs[0].name : '';

    setFormMode('add');
    setEditingProfileId(null);
    setFormName('');
    setFormGender('Male');
    setFormAge(26);
    setFormHeight('5 ft 8 in');
    setFormLocation('Chennai');
    setFormCommunity(firstComm);
    setFormNakshatra(firstStar);
    setFormEducation('B.E. Engineering');
    setFormJobType(firstJob);
    setFormIncome(12);
    setFormBio('');
    setFormChevvai('No');
    setFormBirthDate('1999-05-15');
    setFormBirthTime('10:00 AM');
    setFormBirthPlace('Chennai');
    setFormAvatarUrl('');
    setFormExpMinAge(21);
    setFormExpMaxAge(29);
    setFormExpCommunities(firstComm ? [firstComm] : []);
    setFormExpJobTypes(firstJob ? [firstJob] : []);
    setFormExpMinIncome(5);
    setFormExpLocations(['Chennai']);
    setFormExpGold(25);
    setFormExpHouse(false);
    setIsFormOpen(true);
  }, [currentUser, showToast, communities, combinedNakshatras, jobCategories]);

  const handleOpenEditForm = useCallback((profile: Profile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentUser && !currentUser.permissions.edit) {
      showToast('Access Denied: Your employee role does not have permission to edit candidate profiles.', 'error');
      return;
    }
    setFormMode('edit');
    setEditingProfileId(profile.id);
    setFormName(profile.name);
    setFormGender(profile.gender);
    setFormAge(profile.age);
    setFormHeight(profile.height);
    setFormLocation(profile.location);
    setFormCommunity(profile.community);
    setFormNakshatra(profile.nakshatra);
    setFormEducation(profile.education);
    setFormJobType(profile.jobType);
    setFormIncome(profile.annualIncomeLakhs);
    setFormBio(profile.bio);
    setFormChevvai(profile.chevvaiDosham);
    setFormBirthDate(profile.birthDate);
    setFormBirthTime(profile.birthTime);
    setFormBirthPlace(profile.birthPlace);
    setFormAvatarUrl(profile.avatarUrl || '');
    setFormExpMinAge(profile.expectations.minAge);
    setFormExpMaxAge(profile.expectations.maxAge);
    setFormExpCommunities(profile.expectations.acceptedCommunities);
    setFormExpJobTypes(profile.expectations.acceptedJobTypes);
    setFormExpMinIncome(profile.expectations.minAnnualIncomeLakhs);
    setFormExpLocations(profile.expectations.acceptedLocations);
    setFormExpGold(profile.expectations.goldExpectedSovereigns || 0);
    setFormExpHouse(profile.expectations.houseOwnedRequired || false);
    setIsFormOpen(true);
  }, [currentUser, showToast]);

  const handleUpdateProfileData = useCallback(async (id: string, payload: Partial<Profile>) => {
    try {
      const updated = await updateProfile(id, payload);
      setProfiles(prev => prev.map(p => p.id === id ? updated : p));
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    }
  }, [showToast]);

  const handleSaveProfile = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingProfile) return;
    if (!formName.trim()) {
      showToast('Profile name is required.', 'error');
      return;
    }

    const matchedNakshatra = NAKSHATRAS.find(n => n.name === formNakshatra);
    const calculatedRasi = matchedNakshatra ? matchedNakshatra.defaultRasi : 'Aries';

    const savedExpectations = {
      minAge: formExpMinAge,
      maxAge: formExpMaxAge,
      acceptedCommunities: formExpCommunities,
      acceptedJobTypes: formExpJobTypes,
      minAnnualIncomeLakhs: formExpMinIncome,
      acceptedLocations: formExpLocations,
      goldExpectedSovereigns: formExpGold,
      houseOwnedRequired: formExpHouse
    };

    if (formMode === 'add') {
      const newProfile: Omit<Profile, 'id'> = {
        name: formName.trim(),
        gender: formGender,
        age: formAge,
        height: formHeight,
        location: formLocation,
        community: formCommunity,
        nakshatra: formNakshatra,
        rasi: calculatedRasi,
        education: formEducation.trim(),
        jobType: formJobType,
        annualIncomeLakhs: formIncome,
        bio: formBio.trim() || `Professional ${formJobType} looking for an ideal life partner.`,
        avatarUrl: formAvatarUrl || (formGender === 'Male' ? `male_${Math.floor(Math.random() * 5) + 1}` : `female_${Math.floor(Math.random() * 5) + 1}`),
        chevvaiDosham: formChevvai,
        birthDate: formBirthDate,
        birthTime: formBirthTime,
        birthPlace: formBirthPlace,
        expectations: savedExpectations
      };
      setPendingProfileData(newProfile as Profile);
      setIsPaymentPopupOpen(true);
      return;
    } else {
      if (!editingProfileId) return;
      setIsSavingProfile(true);
      try {
        const updated = await updateProfile(editingProfileId, {
          name: formName.trim(),
          gender: formGender,
          age: formAge,
          height: formHeight,
          location: formLocation,
          community: formCommunity,
          nakshatra: formNakshatra,
          rasi: calculatedRasi,
          education: formEducation.trim(),
          jobType: formJobType,
          annualIncomeLakhs: formIncome,
          bio: formBio.trim(),
          avatarUrl: formAvatarUrl,
          chevvaiDosham: formChevvai,
          birthDate: formBirthDate,
          birthTime: formBirthTime,
          birthPlace: formBirthPlace,
          expectations: savedExpectations
        });
        setProfiles(prev => prev.map(p => p.id === editingProfileId ? updated : p));
        showToast('Successfully updated profile details!', 'success');
        setIsFormOpen(false);
      } catch (err: any) {
        showToast(err.message || 'Failed to update profile.', 'error');
      } finally {
        setIsSavingProfile(false);
      }
    }
  }, [
    formName, formGender, formAge, formHeight, formLocation, formCommunity,
    formNakshatra, formEducation, formJobType, formIncome, formBio,
    formChevvai, formBirthDate, formBirthTime, formBirthPlace, formAvatarUrl,
    formExpMinAge, formExpMaxAge, formExpCommunities, formExpJobTypes,
    formExpMinIncome, formExpLocations, formExpGold, formExpHouse,
    formMode, editingProfileId, showToast, isSavingProfile
  ]);

  const handleDeleteProfile = useCallback(async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentUser && !currentUser.permissions.delete) {
      showToast('Access Denied: Your employee role does not have permission to delete candidate profiles.', 'error');
      return;
    }
    if (confirm('Are you sure you want to permanently delete this profile?')) {
      try {
        await deleteProfile(id);
        setProfiles(prev => prev.filter(p => p.id !== id));
        setRequests(prev => prev.filter(r => r.senderId !== id && r.receiverId !== id));
        if (selectedProfileId === id) setSelectedProfileId(null);
        showToast('Profile deleted successfully.', 'info');
      } catch (err: any) {
        showToast(err.message || 'Failed to delete profile.', 'error');
      }
    }
  }, [currentUser, showToast, selectedProfileId]);

  const handlePaymentSuccess = useCallback(async () => {
    if (isSavingProfile || !pendingProfileData) return;
    setIsSavingProfile(true);
    try {
      const created = await createProfile(pendingProfileData);
      setProfiles(prev => [created, ...prev]);
      showToast(`Successfully registered: ${created.name}!`, 'success');

      const whatsappMsg = `Hi ${created.name}, welcome to our Matrimony! Your registration is complete. Your Login ID (Registration ID): ${created.registrationId}, Temporary Password: ${created.password}`;
      setWhatsappConfirmations(prev => [...prev, { profileId: created.id, message: whatsappMsg, sent: false }]);
      
      setPendingProfileData(null);
      setIsPaymentPopupOpen(false);
      setIsFormOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to register profile.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  }, [pendingProfileData, isSavingProfile, showToast]);

  const handleSaveEmployee = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (formEmpName.trim() === '' || formEmpEmail.trim() === '' || formEmpUsername.trim() === '') {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (employeeFormMode === 'add') {
      if (employees.some(emp => emp.username.toLowerCase() === formEmpUsername.trim().toLowerCase())) {
        showToast('Username already exists. Please choose a different one.', 'error');
        return;
      }

      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        name: formEmpName.trim(),
        email: formEmpEmail.trim(),
        username: formEmpUsername.trim().toLowerCase(),
        password: formEmpPassword || 'password',
        role: formEmpRole,
        permissions: formEmpPermissions,
        avatarUrl: formEmpAvatarUrl.trim() || (formEmpRole === 'Admin' ? `male_${Math.floor(Math.random() * 5) + 1}` : `female_${Math.floor(Math.random() * 5) + 1}`),
        designation: formEmpDesignation.trim() || (formEmpRole === 'Admin' ? 'Operations Manager' : 'Operations Associate'),
        phone: formEmpPhone.trim() || '9876543210',
        joinedDate: new Date().toISOString().split('T')[0]
      };

      setEmployees(prev => [...prev, newEmp]);
      showToast(`Employee ${newEmp.name} registered successfully!`, 'success');
    } else if (employeeFormMode === 'edit' && editingEmployeeId) {
      setEmployees(prev => prev.map(emp => {
        if (emp.id === editingEmployeeId) {
          const updatedEmp = {
            ...emp,
            name: formEmpName.trim(),
            email: formEmpEmail.trim(),
            username: formEmpUsername.trim().toLowerCase(),
            password: formEmpPassword || emp.password,
            role: formEmpRole,
            permissions: formEmpPermissions,
            designation: formEmpDesignation.trim(),
            avatarUrl: formEmpAvatarUrl.trim() || emp.avatarUrl,
            phone: formEmpPhone.trim()
          };
          if (currentUser && emp.id === currentUser.id) {
            setCurrentUser(updatedEmp);
            localStorage.setItem('matrimony_logged_user', JSON.stringify(updatedEmp));
          }
          return updatedEmp;
        }
        return emp;
      }));
      showToast('Employee details updated successfully!', 'success');
    }

    setIsEmployeeFormOpen(false);
  }, [
    formEmpName, formEmpEmail, formEmpUsername, formEmpPassword, formEmpRole,
    formEmpPermissions, formEmpAvatarUrl, formEmpDesignation, formEmpPhone,
    employeeFormMode, editingEmployeeId, employees, currentUser, showToast
  ]);

  const handleOpenAddEmployee = useCallback(() => {
    setEmployeeFormMode('add');
    setEditingEmployeeId(null);
    setFormEmpName('');
    setFormEmpAvatarUrl('');
    setFormEmpEmail('');
    setFormEmpUsername('');
    setFormEmpPassword('password');
    setFormEmpRole('Employee');
    setFormEmpDesignation('Operations Associate');
    setFormEmpPhone('');
    setFormEmpPermissions({
      view: true,
      create: true,
      edit: false,
      delete: false,
      viewAttendance: false,
      editAttendance: false,
      deleteAttendance: false
    });
    setIsEmployeeFormOpen(true);
  }, []);

  const handleOpenEditEmployee = useCallback((emp: Employee) => {
    setEmployeeFormMode('edit');
    setEditingEmployeeId(emp.id);
    setFormEmpName(emp.name);
    setFormEmpEmail(emp.email);
    setFormEmpUsername(emp.username);
    setFormEmpPassword(emp.password || 'password');
    setFormEmpRole(emp.role);
    setFormEmpDesignation(emp.designation);
    setFormEmpPhone(emp.phone);
    setFormEmpPermissions(emp.permissions);
    setFormEmpAvatarUrl(emp.avatarUrl || '');
    setIsEmployeeFormOpen(true);
  }, []);

  const handleDeleteEmployee = useCallback((id: string) => {
    if (currentUser && id === currentUser.id) {
      showToast('Cannot delete yourself!', 'error');
      return;
    }
    if (confirm('Are you sure you want to delete this employee? This will revoke all their access.')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      showToast('Employee deleted successfully.', 'info');
    }
  }, [currentUser, showToast]);

  const handleMarkAttendance = useCallback((employeeId: string, status: 'Present' | 'Absent' | 'On Leave' | 'Half Day', notes?: string) => {
    if (!currentUser?.permissions.editAttendance) {
      showToast('You do not have permission to edit attendance.', 'error');
      return;
    }
    const today = employeeSelectedDate;
    const existingIdx = attendance.findIndex(a => a.employeeId === employeeId && a.date === today);
    let updatedAttendance = [...attendance];

    if (existingIdx >= 0) {
      updatedAttendance[existingIdx] = {
        ...updatedAttendance[existingIdx],
        status,
        notes: notes || updatedAttendance[existingIdx].notes,
        clockIn: status === 'Present' || status === 'Half Day' ? (updatedAttendance[existingIdx].clockIn || '09:00 AM') : undefined,
        clockOut: status === 'Present' || status === 'Half Day' ? (updatedAttendance[existingIdx].clockOut || '05:30 PM') : undefined
      };
    } else {
      updatedAttendance.push({
        id: `att-${Date.now()}`,
        employeeId,
        date: today,
        status,
        notes: notes || 'Attendance marked',
        clockIn: status === 'Present' || status === 'Half Day' ? '09:00 AM' : undefined,
        clockOut: status === 'Present' || status === 'Half Day' ? '05:30 PM' : undefined
      });
    }

    setAttendance(updatedAttendance);
    showToast('Attendance recorded successfully!', 'success');
  }, [currentUser, attendance, employeeSelectedDate, showToast]);

  const handleDeleteAttendance = useCallback((attendanceId: string) => {
    if (!currentUser?.permissions.deleteAttendance) {
      showToast('You do not have permission to delete attendance records.', 'error');
      return;
    }
    setAttendance(prev => prev.filter(a => a.id !== attendanceId));
    showToast('Attendance record deleted successfully.', 'info');
  }, [currentUser, showToast]);

  const handleClockInSelf = useCallback(() => {
    if (!currentUser) return;
    const todayStr = employeeSelectedDate;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const existingIdx = attendance.findIndex(a => a.employeeId === currentUser.id && a.date === todayStr);
    let updatedAttendance = [...attendance];

    if (existingIdx >= 0) {
      updatedAttendance[existingIdx] = {
        ...updatedAttendance[existingIdx],
        status: 'Present',
        clockIn: nowTime
      };
    } else {
      updatedAttendance.push({
        id: `att-${Date.now()}`,
        employeeId: currentUser.id,
        date: todayStr,
        status: 'Present',
        clockIn: nowTime,
        notes: 'Self clock-in'
      });
    }

    setAttendance(updatedAttendance);
    showToast(`Clocked in successfully at ${nowTime}!`, 'success');
  }, [currentUser, attendance, employeeSelectedDate, showToast]);

  const handleClockOutSelf = useCallback(() => {
    if (!currentUser) return;
    const todayStr = employeeSelectedDate;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const existingIdx = attendance.findIndex(a => a.employeeId === currentUser.id && a.date === todayStr);
    let updatedAttendance = [...attendance];

    if (existingIdx >= 0) {
      updatedAttendance[existingIdx] = {
        ...updatedAttendance[existingIdx],
        clockOut: nowTime
      };
      setAttendance(updatedAttendance);
      showToast(`Clocked out successfully at ${nowTime}!`, 'success');
    } else {
      updatedAttendance.push({
        id: `att-${Date.now()}`,
        employeeId: currentUser.id,
        date: todayStr,
        status: 'Present',
        clockIn: '09:00 AM',
        clockOut: nowTime,
        notes: 'Self clock-out'
      });
      setAttendance(updatedAttendance);
      showToast(`Clocked out successfully at ${nowTime}!`, 'success');
    }
  }, [currentUser, attendance, employeeSelectedDate, showToast]);

  const handleSendRequest = useCallback((senderId: string, receiverId: string) => {
    const exists = requests.find(r => (r.senderId === senderId && r.receiverId === receiverId) || (r.senderId === receiverId && r.receiverId === senderId));
    if (exists) {
      showToast('A match request already exists between these profiles.', 'info');
      return;
    }

    const newReq: MatchRequest = {
      id: `req-${Date.now()}`,
      senderId,
      receiverId,
      status: 'Pending',
      sentAt: new Date().toISOString()
    };
    setRequests(prev => [newReq, ...prev]);
    showToast('Inquiry request successfully sent! Partner will be notified.', 'success');
  }, [requests, showToast]);

  const handleUpdateStatus = useCallback((reqId: string, status: 'Accepted' | 'Declined') => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r));
    showToast(`Request status updated to ${status}.`, 'success');
  }, [showToast]);

  const handleCreateCommunity = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommName.trim()) {
      showToast('Community Name is required.', 'error');
      return;
    }
    try {
      const payload = {
        name: newCommName.trim(),
      };
      const created = await createCommunity(payload);
      setCommunities(prev => [...prev, created]);
      setNewCommName('');
      setNewCommCode('');
      setNewCommRegion('');
      setIsNewCommunityOpen(false);
      showToast(`Created new community: ${created.name}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to create community.', 'error');
    }
  }, [newCommName, showToast]);

  const handleCreateNakshatra = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNakshatraName.trim()) {
      showToast('Nakshatra Name is required.', 'error');
      return;
    }
    try {
      const payload = {
        name: newNakshatraName.trim(),
      };
      const created = await createCustomNakshatra(payload);
      setCustomNakshatras(prev => [...prev, created]);
      setNewNakshatraName('');
      setIsNewNakshatraOpen(false);
      showToast(`Created new Birth Star: ${created.name}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to create Birth Star.', 'error');
    }
  }, [newNakshatraName, showToast]);

  const handleUpdateCommunity = useCallback(async (id: string, payload: { name?: string; isActive?: boolean }) => {
    try {
      const updated = await updateCommunity(id, payload);
      setCommunities(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
      showToast('Community updated.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update community.', 'error');
    }
  }, [showToast]);

  const handleDeleteCommunity = useCallback(async (id: string) => {
    try {
      await deleteCommunity(id);
      setCommunities(prev => prev.filter(c => c.id !== id));
      showToast('Community deleted.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete community.', 'error');
    }
  }, [showToast]);

  const handleUpdateNakshatra = useCallback(async (id: string, payload: { name?: string; isActive?: boolean }) => {
    try {
      const updated = await updateCustomNakshatra(id, payload);
      setCustomNakshatras(prev => prev.map(n => n.id === id ? { ...n, ...updated } : n));
      showToast('Birth Star updated.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update Birth Star.', 'error');
    }
  }, [showToast]);

  const handleDeleteNakshatra = useCallback(async (id: string) => {
    try {
      await deleteCustomNakshatra(id);
      setCustomNakshatras(prev => prev.filter(n => n.id !== id));
      showToast('Birth Star deleted.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete Birth Star.', 'error');
    }
  }, [showToast]);

  const handleTogglePorutham = useCallback(async (id: string, isEnabled: boolean) => {
    try {
      const updated = await updatePorutham(id, { isEnabled });
      setPoruthams(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
      showToast(`Porutham ${isEnabled ? 'enabled' : 'disabled'}.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update Porutham.', 'error');
    }
  }, [showToast]);

  const handleCreateJobCategory = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobCategoryName.trim()) {
      showToast('Job Category name is required.', 'error');
      return;
    }
    try {
      const created = await createJobCategory({ name: newJobCategoryName.trim() });
      setJobCategories(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewJobCategoryName('');
      setIsNewJobCategoryOpen(false);
      showToast(`Created job category: ${created.name}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to create job category.', 'error');
    }
  }, [newJobCategoryName, showToast]);

  const handleUpdateJobCategory = useCallback(async (id: string, payload: { name?: string; isActive?: boolean }) => {
    try {
      const updated = await updateJobCategory(id, payload);
      setJobCategories(prev => prev.map(j => j.id === id ? { ...j, ...updated } : j));
      showToast('Job category updated.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update job category.', 'error');
    }
  }, [showToast]);

  const handleDeleteJobCategory = useCallback(async (id: string) => {
    try {
      await deleteJobCategory(id);
      setJobCategories(prev => prev.filter(j => j.id !== id));
      showToast('Job category deleted.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete job category.', 'error');
    }
  }, [showToast]);


  const calculateExpectationMatch = useCallback((profileA: Profile, profileB: Profile) => {
    let score = 0;
    let maxScore = 5;

    if (profileB.age >= profileA.expectations.minAge && profileB.age <= profileA.expectations.maxAge) {
      score += 1;
    }

    if (
      profileA.expectations.acceptedCommunities.includes('Any Community') ||
      profileA.expectations.acceptedCommunities.includes(profileB.community)
    ) {
      score += 1;
    }

    if (profileA.expectations.acceptedJobTypes.includes(profileB.jobType)) {
      score += 1;
    }

    if (profileB.annualIncomeLakhs >= profileA.expectations.minAnnualIncomeLakhs) {
      score += 1;
    }

    if (profileA.expectations.acceptedLocations.includes(profileB.location)) {
      score += 1;
    }

    return {
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100)
    };
  }, []);

  const handleAiAdvisory = useCallback(async (bride: Profile, groom: Profile) => {
    setIsAiAnalyzing(true);
    setAiAnalysisText('');
    showToast('Generating compatibility analysis...', 'info');

    const matchedResult = calculatePorutham(bride.nakshatra, groom.nakshatra);
    const brideToGroomExp = calculateExpectationMatch(bride, groom);
    const groomToBrideExp = calculateExpectationMatch(groom, bride);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysis = `**Astrological Alignment Summary**

${bride.name} (${bride.nakshatra}, ${bride.rasi}) and ${groom.name} (${groom.nakshatra}, ${groom.rasi}) have achieved a ${matchedResult.totalScore}/10 compatibility score (${matchedResult.percentage}%). ${matchedResult.hasRajjuDosham ? 'However, Rajju Dosham is present, which may require additional ceremonies or consultations.' : 'No major doshams detected - this is an auspicious pairing.'} The couple shows ${matchedResult.rating.toLowerCase()} astrological alignment.

**Sociocultural & Lifestyle Synergy**

Both candidates bring complementary strengths to the relationship. ${bride.name} works in ${bride.jobType} with an annual income of ₹${bride.annualIncomeLakhs} lakhs, while ${groom.name} is in ${groom.jobType} earning ₹${groom.annualIncomeLakhs} lakhs per year. They are ${bride.location === groom.location ? 'from the same city (' + bride.location + '), making family coordination easier' : 'from different cities (' + bride.location + ' and ' + groom.location + '), which will require discussion about relocation'}. The expectation compatibility shows ${Math.round((brideToGroomExp.percentage + groomToBrideExp.percentage) / 2)}% overall alignment.

**Practical Advice & Conversation Starters**

1. Discuss career aspirations and work-life balance, especially regarding ${bride.location !== groom.location ? 'potential relocation and career transitions' : 'joint family traditions and living arrangements'}.
2. Talk about financial planning and family expectations, particularly regarding the ${groom.expectations.goldExpectedSovereigns} sovereigns of gold and property ownership expectations.

*Note: AI-powered advisory requires backend server integration. This is a basic compatibility summary based on profile data.*`;

    setAiAnalysisText(analysis);
    showToast('Compatibility analysis generated!', 'success');
    setIsAiAnalyzing(false);
  }, [showToast, calculateExpectationMatch]);

  const maleCount = useMemo(() => profiles.filter(p => p.gender === 'Male').length, [profiles]);
  const femaleCount = useMemo(() => profiles.filter(p => p.gender === 'Female').length, [profiles]);
  const totalProfiles = useMemo(() => profiles.length, [profiles]);
  const pendingRequestsCount = useMemo(() => requests.filter(r => r.status === 'Pending').length, [requests]);
  const acceptedRequestsCount = useMemo(() => requests.filter(r => r.status === 'Accepted').length, [requests]);

  const filteredProfiles = useMemo(() => profiles.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.education.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === 'All' ? true : p.gender === genderFilter;
    const matchesCommunity = communityFilter === 'All' ? true : p.community === communityFilter;
    const matchesLocation = locationFilter === 'All' ? true : p.location === locationFilter;
    const matchesStar = starFilter === 'All' ? true : p.nakshatra === starFilter;
    const matchesChevvai = chevvaiFilter === 'All' ? true : p.chevvaiDosham === chevvaiFilter;

    return matchesSearch && matchesGender && matchesCommunity && matchesLocation && matchesStar && matchesChevvai;
  }), [profiles, searchQuery, genderFilter, communityFilter, locationFilter, starFilter, chevvaiFilter]);

  const uniqueLocations = useMemo(() => Array.from(new Set(profiles.map(p => p.location))), [profiles]);
  const uniqueCommunities = useMemo(() => Array.from(new Set(profiles.map(p => p.community))), [profiles]);
  const uniqueStars = useMemo(() => Array.from(new Set(profiles.map(p => p.nakshatra))), [profiles]);

  const currentBride = useMemo(() => {
    if (matcherGender === 'Female') {
      return profiles.find(p => p.id === matcherPrimaryProfileId);
    } else {
      return matcherSelectedMatch?.profile;
    }
  }, [profiles, matcherGender, matcherPrimaryProfileId, matcherSelectedMatch]);

  const currentGroom = useMemo(() => {
    if (matcherGender === 'Male') {
      return profiles.find(p => p.id === matcherPrimaryProfileId);
    } else {
      return matcherSelectedMatch?.profile;
    }
  }, [profiles, matcherGender, matcherPrimaryProfileId, matcherSelectedMatch]);

  const matchingResult = useMemo(() => {
    return matcherSelectedMatch ? matcherSelectedMatch.matchResult : null;
  }, [matcherSelectedMatch]);

  const getCompositeScore = useCallback((bride: Profile, groom: Profile) => {
    const astroResult = calculatePorutham(bride.nakshatra, groom.nakshatra);
    const expBride = calculateExpectationMatch(bride, groom);
    const expGroom = calculateExpectationMatch(groom, bride);
    const avgExpMatch = (expBride.percentage + expGroom.percentage) / 2;

    const compositePct = Math.round((astroResult.percentage * jothidamWeight) + (avgExpMatch * expectationWeight));
    return {
      percentage: compositePct,
      astroPct: astroResult.percentage,
      expBridePct: expBride.percentage,
      expGroomPct: expGroom.percentage,
      rating: astroResult.rating,
      hasRajju: astroResult.hasRajjuDosham
    };
  }, [jothidamWeight, expectationWeight, calculateExpectationMatch]);

  const recommendedCandidates = useMemo(() => {
    const targetProfile = profiles.find(p => p.id === recommendTargetId);
    return targetProfile
      ? profiles
          .filter(p => p.gender !== targetProfile.gender)
          .map(candidate => {
            const bride = targetProfile.gender === 'Female' ? targetProfile : candidate;
            const groom = targetProfile.gender === 'Male' ? targetProfile : candidate;
            const matchStats = getCompositeScore(bride, groom);
            return {
              profile: candidate,
              stats: matchStats
            };
          })
          .sort((a, b) => b.stats.percentage - a.stats.percentage)
      : [];
  }, [profiles, recommendTargetId, getCompositeScore]);

  const value: AppContextType = {
    currentUser, setCurrentUser,
    loginUsername, setLoginUsername,
    loginPassword, setLoginPassword,
    loginError, setLoginError,

    activeTab, setActiveTab,
    mobileMenuOpen, setMobileMenuOpen,
    socialSubTab, setSocialSubTab,

    profiles, setProfiles,
    communities, setCommunities,
    requests, setRequests,
    employees, setEmployees,
    attendance, setAttendance,
    gallery, setGallery,
    reviews, setReviews,
    testimonials, setTestimonials,

    showToast,

    employeeSearch, setEmployeeSearch,
    employeeSelectedDate, setEmployeeSelectedDate,
    isEmployeeFormOpen, setIsEmployeeFormOpen,
    employeeFormMode, setEmployeeFormMode,
    editingEmployeeId, setEditingEmployeeId,

    formEmpName, setFormEmpName,
    formEmpAvatarUrl, setFormEmpAvatarUrl,
    formEmpEmail, setFormEmpEmail,
    formEmpUsername, setFormEmpUsername,
    formEmpPassword, setFormEmpPassword,
    formEmpRole, setFormEmpRole,
    formEmpDesignation, setFormEmpDesignation,
    formEmpPhone, setFormEmpPhone,
    formEmpPermissions, setFormEmpPermissions,

    jothidamWeight, setJothidamWeight,
    expectationWeight, setExpectationWeight,

    searchQuery, setSearchQuery,
    genderFilter, setGenderFilter,
    communityFilter, setCommunityFilter,
    locationFilter, setLocationFilter,
    starFilter, setStarFilter,
    chevvaiFilter, setChevvaiFilter,
    selectedProfileId, setSelectedProfileId,

    matcherBrideId, setMatcherBrideId,
    matcherGroomId, setMatcherGroomId,
    aiAnalysisText, setAiAnalysisText,
    isAiAnalyzing, setIsAiAnalyzing,
    matcherGender, setMatcherGender,
    matcherPrimaryProfileId, setMatcherPrimaryProfileId,
    matcherMatches, setMatcherMatches,
    matcherSelectedMatch, setMatcherSelectedMatch,
    isMatcherLoading,

    recommendTargetId, setRecommendTargetId,

    isFormOpen, setIsFormOpen,
    formMode, setFormMode,
    editingProfileId, setEditingProfileId,

    formName, setFormName,
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
    formExpHouse, setFormExpHouse,

    isNewCommunityOpen, setIsNewCommunityOpen,
    newCommName, setNewCommName,
    newCommRegion, setNewCommRegion,
    newCommCode, setNewCommCode,

    newNakshatraName, setNewNakshatraName,
    isNewNakshatraOpen, setIsNewNakshatraOpen,
    customNakshatras, combinedNakshatras,


    isPaymentPopupOpen, setIsPaymentPopupOpen,
    pendingProfileData, setPendingProfileData,
    whatsappConfirmations, setWhatsappConfirmations,

    maleCount, femaleCount, totalProfiles,
    pendingRequestsCount, acceptedRequestsCount,
    filteredProfiles,
    uniqueLocations, uniqueCommunities, uniqueStars,
    currentBride, currentGroom, matchingResult,
    getCompositeScore, calculateExpectationMatch,
    recommendedCandidates,

    handlePhotoUpload,
    handleOpenAddForm,
    handleOpenEditForm,
    handleSaveProfile,
    handleDeleteProfile,
    handleCreateNakshatra,
    handlePaymentSuccess,
    handleSaveEmployee,
    handleOpenAddEmployee,
    handleOpenEditEmployee,
    handleDeleteEmployee,
    handleMarkAttendance,
    handleDeleteAttendance,
    handleClockInSelf,
    handleClockOutSelf,
    handleSendRequest,
    handleUpdateStatus,
    handleCreateCommunity,
    handleUpdateCommunity,
    handleDeleteCommunity,
    handleUpdateNakshatra,
    handleDeleteNakshatra,
    poruthams,
    handleTogglePorutham,
    jobCategories,
    handleCreateJobCategory,
    handleUpdateJobCategory,
    handleDeleteJobCategory,
    newJobCategoryName, setNewJobCategoryName,
    isNewJobCategoryOpen, setIsNewJobCategoryOpen,
    handleUpdateProfileData,
    isSavingProfile,
    handleAiAdvisory
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export { AppContext };
