import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  UserPlus,
  Compass,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  Menu,
  X,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  HeartHandshake,
  BarChart3,
  Layers,
  FileDown,
  RefreshCw,
  Info,
  Shield,
  Lock,
  LogOut,
  Check,
  ClipboardList,
  Sliders,
  UserCheck,
  Building,
  Image,
  Star,
  MessageSquare,
  Award,
  ThumbsUp,
  Square,
  CheckSquare,
  Send
} from 'lucide-react';
import { 
  INITIAL_PROFILES, 
  INITIAL_COMMUNITIES, 
  INITIAL_REQUESTS, 
  INITIAL_EMPLOYEES, 
  INITIAL_ATTENDANCE,
  INITIAL_COMPANY_PROFILE,
  INITIAL_GALLERY,
  INITIAL_REVIEWS,
  INITIAL_TESTIMONIALS
} from './initialData';
import { useI18n } from './i18n.tsx';
import { 
  Profile, 
  CommunityInfo, 
  MatchRequest, 
  Employee, 
  AttendanceRecord, 
  EmployeePermissions,
  CompanyProfile,
  GalleryItem,
  CustomerReview,
  Testimonial
} from './types';
import { calculatePorutham, NAKSHATRAS, RASIS, RASI_LORDS, RASI_TAMIL, MatchingResult } from './porutham';
import Avatar from './components/Avatar';

export default function App() {
  const { t, language, setLanguage } = useI18n();
  // Auth state & Persistence
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const saved = localStorage.getItem('matrimony_logged_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // App navigation state - includes employee-desk, company, social, and confirmed tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'directory' | 'matcher' | 'recommend' | 'employees' | 'admin' | 'help' | 'company' | 'social' | 'confirmed'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [socialSubTab, setSocialSubTab] = useState<'gallery' | 'reviews' | 'testimonials'>('gallery');
  const [isSocialFormOpen, setIsSocialFormOpen] = useState(false);

  // Database states with persistent storage
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('matrimony_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  const [communities, setCommunities] = useState<CommunityInfo[]>(() => {
    const saved = localStorage.getItem('matrimony_communities');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITIES;
  });

  const [requests, setRequests] = useState<MatchRequest[]>(() => {
    const saved = localStorage.getItem('matrimony_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  // Employee & Attendance Database States
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('matrimony_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('matrimony_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  // New States for Company, Gallery, Reviews & Testimonials
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(() => {
    const saved = localStorage.getItem('matrimony_company_profile');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_PROFILE;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('matrimony_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    const saved = localStorage.getItem('matrimony_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('matrimony_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  // Save employees & attendance to localStorage on changes
  useEffect(() => {
    localStorage.setItem('matrimony_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('matrimony_attendance', JSON.stringify(attendance));
  }, [attendance]);

  // Save profile, community and request data to localStorage
  useEffect(() => {
    localStorage.setItem('matrimony_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('matrimony_communities', JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem('matrimony_requests', JSON.stringify(requests));
  }, [requests]);

  // Save Company, Gallery, Reviews & Testimonials to localStorage
  useEffect(() => {
    localStorage.setItem('matrimony_company_profile', JSON.stringify(companyProfile));
  }, [companyProfile]);

  useEffect(() => {
    localStorage.setItem('matrimony_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('matrimony_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('matrimony_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  // Employee Management UI States
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeSelectedDate, setEmployeeSelectedDate] = useState('2026-06-28');
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [employeeFormMode, setEmployeeFormMode] = useState<'add' | 'edit'>('add');
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

  // Employee form fields
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
    attendance: false
  });

  // Config weights for matching
  const [jothidamWeight, setJothidamWeight] = useState(0.7); // 70% Astrology, 30% Expectations
  const [expectationWeight, setExpectationWeight] = useState(0.3);

  // Sidebar notifications/toasts
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Search & Filter state for Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');
  const [communityFilter, setCommunityFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [starFilter, setStarFilter] = useState('All');
  const [chevvaiFilter, setChevvaiFilter] = useState('All');

  // Directory selected profile details view modal
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  // Porutham Matcher state
  const [matcherBrideId, setMatcherBrideId] = useState<string>('');
  const [matcherGroomId, setMatcherGroomId] = useState<string>('');
  const [aiAnalysisText, setAiAnalysisText] = useState<string>('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);

  // Recommendations state
  const [recommendTargetId, setRecommendTargetId] = useState<string>('');

  // CRUD Forms State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  // Core profile fields for the form
  const [formName, setFormName] = useState('');
  const [formGender, setFormGender] = useState<'Male' | 'Female'>('Male');
  const [formAge, setFormAge] = useState(25);
  const [formHeight, setFormHeight] = useState("5 ft 6 in");
  const [formLocation, setFormLocation] = useState('Chennai');
  const [formCommunity, setFormCommunity] = useState('Kongu Vellalar');
  const [formNakshatra, setFormNakshatra] = useState('Ashwini');

  const [formEducation, setFormEducation] = useState('B.E. Computer Science');
  const [formJobType, setFormJobType] = useState('IT & Software');
  const [formIncome, setFormIncome] = useState(12);
  const [formBio, setFormBio] = useState('');

  // New Registration Flow States
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [pendingProfileData, setPendingProfileData] = useState<any | null>(null);
  const [whatsappConfirmations, setWhatsappConfirmations] = useState<any[]>([]);
  const [formChevvai, setFormChevvai] = useState<'Yes' | 'No' | 'Unknown'>('No');
  const [formBirthDate, setFormBirthDate] = useState('1999-01-01');
  const [formBirthTime, setFormBirthTime] = useState('09:00 AM');
  const [formBirthPlace, setFormBirthPlace] = useState('Chennai');
  const [formAvatarUrl, setFormAvatarUrl] = useState('');

  // Expectations Form state
  const [formExpMinAge, setFormExpMinAge] = useState(22);
  const [formExpMaxAge, setFormExpMaxAge] = useState(30);
  const [formExpCommunities, setFormExpCommunities] = useState<string[]>(['Kongu Vellalar']);
  const [formExpJobTypes, setFormExpJobTypes] = useState<string[]>(['IT & Software']);
  const [formExpMinIncome, setFormExpMinIncome] = useState(6);
  const [formExpLocations, setFormExpLocations] = useState<string[]>(['Chennai']);
  const [formExpGold, setFormExpGold] = useState(30);
  const [formExpHouse, setFormExpHouse] = useState(false);

  // New community / franchise input state
  const [isNewCommunityOpen, setIsNewCommunityOpen] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommRegion, setNewCommRegion] = useState('');
  const [newCommCode, setNewCommCode] = useState('');

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('matrimony_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('matrimony_communities', JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem('matrimony_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Set default bride/groom selectors when profiles load
  useEffect(() => {
    const brides = profiles.filter(p => p.gender === 'Female');
    const grooms = profiles.filter(p => p.gender === 'Male');
    if (brides.length > 0 && !matcherBrideId) {
      setMatcherBrideId(brides[0].id);
    }
    if (grooms.length > 0 && !matcherGroomId) {
      setMatcherGroomId(grooms[0].id);
    }
    if (profiles.length > 0 && !recommendTargetId) {
      setRecommendTargetId(profiles[0].id);
    }
  }, [profiles]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ text, type });
  };

  const handlePhotoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
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
  };

  const handleBrochureUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      showToast('Image size should be less than 2MB for compatibility.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCompanyProfile({ ...companyProfile, brochureImageUrl: e.target.result as string });
        showToast('Brochure image uploaded successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Setup form fields for adding
  const handleOpenAddForm = () => {
    if (currentUser && !currentUser.permissions.create) {
      showToast('Access Denied: Your employee role does not have permission to create candidate profiles.', 'error');
      return;
    }
    setFormMode('add');
    setEditingProfileId(null);
    setFormName('');
    setFormGender('Male');
    setFormAge(26);
    setFormHeight("5 ft 8 in");
    setFormLocation('Chennai');
    setFormCommunity('Kongu Vellalar');
    setFormNakshatra('Ashwini');
    setFormEducation('B.E. Engineering');
    setFormJobType('IT & Software');
    setFormIncome(12);
    setFormBio('');
    setFormChevvai('No');
    setFormBirthDate('1999-05-15');
    setFormBirthTime('10:00 AM');
    setFormBirthPlace('Chennai');
    setFormAvatarUrl('');

    // Default expectations
    setFormExpMinAge(21);
    setFormExpMaxAge(29);
    setFormExpCommunities(['Kongu Vellalar']);
    setFormExpJobTypes(['IT & Software']);
    setFormExpMinIncome(5);
    setFormExpLocations(['Chennai']);
    setFormExpGold(25);
    setFormExpHouse(false);

    setIsFormOpen(true);
  };

  // Setup form fields for editing
  const handleOpenEditForm = (profile: Profile, e?: React.MouseEvent) => {
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

    // Expectations
    setFormExpMinAge(profile.expectations.minAge);
    setFormExpMaxAge(profile.expectations.maxAge);
    setFormExpCommunities(profile.expectations.acceptedCommunities);
    setFormExpJobTypes(profile.expectations.acceptedJobTypes);
    setFormExpMinIncome(profile.expectations.minAnnualIncomeLakhs);
    setFormExpLocations(profile.expectations.acceptedLocations);
    setFormExpGold(profile.expectations.goldExpectedSovereigns || 0);
    setFormExpHouse(profile.expectations.houseOwnedRequired || false);

    setIsFormOpen(true);
  };

  // Form Submit Action
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Profile name is required.', 'error');
      return;
    }

    // Determine Rasi automatically based on Nakshatra
    const matchedNakshatra = NAKSHATRAS.find(n => n.name === formNakshatra);
    const calculatedRasi = matchedNakshatra ? matchedNakshatra.defaultRasi : "Aries";

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
      const matchedNakshatra = NAKSHATRAS.find(n => n.name === formNakshatra);
      const calculatedRasi = matchedNakshatra ? matchedNakshatra.defaultRasi : "Aries";

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

      const newProfile: Profile = {
        id: `P-${Date.now()}`,
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
      setPendingProfileData(newProfile);
      setIsPaymentPopupOpen(true);
      return; 
    } else {
      // Edit mode
      setProfiles(prev =>
        prev.map(p =>
          p.id === editingProfileId
            ? {
                ...p,
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
                avatarUrl: formAvatarUrl || p.avatarUrl,
                chevvaiDosham: formChevvai,
                birthDate: formBirthDate,
                birthTime: formBirthTime,
                birthPlace: formBirthPlace,
                expectations: savedExpectations
              }
            : p
        )
      );
      showToast('Successfully updated profile details!', 'success');
    }

    setIsFormOpen(false);
  };

  // Delete Profile
  const handleDeleteProfile = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentUser && !currentUser.permissions.delete) {
      showToast('Access Denied: Your employee role does not have permission to delete candidate profiles.', 'error');
      return;
    }
    if (confirm("Are you sure you want to permanently delete this profile?")) {
      setProfiles(prev => prev.filter(p => p.id !== id));
      setRequests(prev => prev.filter(r => r.senderId !== id && r.receiverId !== id));
      if (selectedProfileId === id) setSelectedProfileId(null);
      showToast('Profile deleted successfully.', 'info');
    }
  };

  const handlePaymentSuccess = () => {
    if (pendingProfileData) {
      setProfiles(prev => [pendingProfileData, ...prev]);
      showToast('Successfully registered new matrimonial profile!', 'success');
      
      const whatsappMsg = `Hi ${pendingProfileData.name}, welcome to our Matrimony! Your registration is complete. Your Profile Code: ${pendingProfileData.id}`;
      setWhatsappConfirmations(prev => [...prev, { profileId: pendingProfileData.id, message: whatsappMsg, sent: false }]);
      
      setPendingProfileData(null);
      setIsPaymentPopupOpen(false);
      setIsFormOpen(false);
    }
  };

  // Employee Management CRUD Handlers
  const handleSaveEmployee = (e: React.FormEvent) => {
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
          // If we edited ourselves, update currentUser too
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
  };

  const handleOpenAddEmployee = () => {
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
      delete: false
    });
    setIsEmployeeFormOpen(true);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
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
  };

  const handleDeleteEmployee = (id: string) => {
    if (currentUser && id === currentUser.id) {
      showToast('Cannot delete yourself!', 'error');
      return;
    }
    if (confirm('Are you sure you want to delete this employee? This will revoke all their access.')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      showToast('Employee deleted successfully.', 'info');
    }
  };

  const handleMarkAttendance = (employeeId: string, status: 'Present' | 'Absent' | 'On Leave' | 'Half Day', notes?: string) => {
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
  };

  const handleDeleteAttendance = (attendanceId: string) => {
    if (!currentUser?.permissions.deleteAttendance) {
      showToast('You do not have permission to delete attendance records.', 'error');
      return;
    }
    setAttendance(prev => prev.filter(a => a.id !== attendanceId));
    showToast('Attendance record deleted successfully.', 'info');
  };

  const handleClockInSelf = () => {
    if (!currentUser) return;
    const todayStr = employeeSelectedDate; // synchronize with panel date for demonstration
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
  };

  const handleClockOutSelf = () => {
    if (!currentUser) return;
    const todayStr = employeeSelectedDate; // synchronize with panel date for demonstration
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
  };

  // Match Request creation
  const handleSendRequest = (senderId: string, receiverId: string) => {
    // Check if request already exists
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
  };

  const handleUpdateStatus = (reqId: string, status: 'Accepted' | 'Declined') => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r));
    showToast(`Request status updated to ${status}.`, 'success');
  };

  // Add custom community
  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommName.trim() || !newCommCode.trim()) {
      showToast('Community Name and Code are required.', 'error');
      return;
    }
    const newComm: CommunityInfo = {
      id: `c-${Date.now()}`,
      name: newCommName.trim(),
      franchiseCount: Math.floor(Math.random() * 5) + 1,
      profileCount: 0,
      region: newCommRegion.trim() || "All Tamil Nadu",
      code: newCommCode.toUpperCase().trim()
    };
    setCommunities(prev => [...prev, newComm]);
    setNewCommName('');
    setNewCommCode('');
    setNewCommRegion('');
    setIsNewCommunityOpen(false);
    showToast(`Created new community: ${newComm.name}`, 'success');
  };

  // Expectation matching algorithm helpers
  const calculateExpectationMatch = (profileA: Profile, profileB: Profile) => {
    let score = 0;
    let maxScore = 5;

    // 1. Age suitability
    if (profileB.age >= profileA.expectations.minAge && profileB.age <= profileA.expectations.maxAge) {
      score += 1;
    }

    // 2. Community suitability
    if (
      profileA.expectations.acceptedCommunities.includes('Any Community') ||
      profileA.expectations.acceptedCommunities.includes(profileB.community)
    ) {
      score += 1;
    }

    // 3. Job suitability
    if (profileA.expectations.acceptedJobTypes.includes(profileB.jobType)) {
      score += 1;
    }

    // 4. Annual Income compliance
    if (profileB.annualIncomeLakhs >= profileA.expectations.minAnnualIncomeLakhs) {
      score += 1;
    }

    // 5. Location suitability
    if (profileA.expectations.acceptedLocations.includes(profileB.location)) {
      score += 1;
    }

    return {
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100)
    };
  };

  // Generate AI Match Advisory (Disabled - No Backend)
  const handleAiAdvisory = async (bride: Profile, groom: Profile) => {
    setIsAiAnalyzing(true);
    setAiAnalysisText('');
    showToast('Generating compatibility analysis...', 'info');

    const matchedResult = calculatePorutham(bride.nakshatra, groom.nakshatra);
    const brideToGroomExp = calculateExpectationMatch(bride, groom);
    const groomToBrideExp = calculateExpectationMatch(groom, bride);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate basic analysis without AI
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
  };

  // Calculated variables for Dashboard
  const maleCount = profiles.filter(p => p.gender === 'Male').length;
  const femaleCount = profiles.filter(p => p.gender === 'Female').length;
  const totalProfiles = profiles.length;
  const pendingRequestsCount = requests.filter(r => r.status === 'Pending').length;
  const acceptedRequestsCount = requests.filter(r => r.status === 'Accepted').length;

  // Filtered profiles for Directory list
  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.education.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === 'All' ? true : p.gender === genderFilter;
    const matchesCommunity = communityFilter === 'All' ? true : p.community === communityFilter;
    const matchesLocation = locationFilter === 'All' ? true : p.location === locationFilter;
    const matchesStar = starFilter === 'All' ? true : p.nakshatra === starFilter;
    const matchesChevvai = chevvaiFilter === 'All' ? true : p.chevvaiDosham === chevvaiFilter;

    return matchesSearch && matchesGender && matchesCommunity && matchesLocation && matchesStar && matchesChevvai;
  });

  // Calculate unique options for filter dropdowns
  const uniqueLocations = Array.from(new Set(profiles.map(p => p.location)));
  const uniqueCommunities = Array.from(new Set(profiles.map(p => p.community)));
  const uniqueStars = Array.from(new Set(profiles.map(p => p.nakshatra)));

  // Setup current matched profiles for Porutham Match view
  const currentBride = profiles.find(p => p.id === matcherBrideId && p.gender === 'Female');
  const currentGroom = profiles.find(p => p.id === matcherGroomId && p.gender === 'Male');
  const matchingResult: MatchingResult | null = (currentBride && currentGroom)
    ? calculatePorutham(currentBride.nakshatra, currentGroom.nakshatra)
    : null;

  // Composite matching index
  const getCompositeScore = (bride: Profile, groom: Profile) => {
    const astroResult = calculatePorutham(bride.nakshatra, groom.nakshatra);
    const expBride = calculateExpectationMatch(bride, groom);
    const expGroom = calculateExpectationMatch(groom, bride);
    const avgExpMatch = (expBride.percentage + expGroom.percentage) / 2; // scale of 0-100

    // Jothidam score is 0-10, expectation average is 0-100
    const compositePct = Math.round((astroResult.percentage * jothidamWeight) + (avgExpMatch * expectationWeight));
    return {
      percentage: compositePct,
      astroPct: astroResult.percentage,
      expBridePct: expBride.percentage,
      expGroomPct: expGroom.percentage,
      rating: astroResult.rating,
      hasRajju: astroResult.hasRajjuDosham
    };
  };

  // Pre-calculate recommendations for active target profile
  const targetProfile = profiles.find(p => p.id === recommendTargetId);
  const recommendedCandidates = targetProfile
    ? profiles
        .filter(p => p.gender !== targetProfile.gender) // opposite gender
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

  if (!currentUser) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-900 font-sans antialiased relative px-4 overflow-y-auto py-12">
        {/* Decorative ambient blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="fixed top-4 right-4 z-50 max-w-sm pointer-events-auto"
            >
              <div className={`p-4 rounded-xl shadow-xl flex items-center space-x-3 text-xs font-semibold ${
                toast.type === 'success' ? 'bg-emerald-500 text-white' :
                toast.type === 'error' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-100'
              }`}>
                {toast.type === 'success' && <CheckCircle className="h-5 w-5 shrink-0" />}
                {toast.type === 'error' && <AlertTriangle className="h-5 w-5 shrink-0" />}
                {toast.type === 'info' && <Info className="h-5 w-5 shrink-0 text-indigo-400" />}
                <span>{toast.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-md bg-slate-950 border border-slate-800/80 rounded-3xl shadow-2xl p-8 relative z-10">
          
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="h-14 w-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-indigo-400 fill-indigo-400" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white font-display">Manappandal Matrimony Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Staff Operations & Franchise Manager</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const found = employees.find(emp => emp.username.toLowerCase() === loginUsername.trim().toLowerCase() && emp.password === loginPassword);
            if (found) {
              setCurrentUser(found);
              localStorage.setItem('matrimony_logged_user', JSON.stringify(found));
              setToast({ text: `Welcome back, ${found.name}!`, type: 'success' });
              // Clear inputs
              setLoginUsername('');
              setLoginPassword('');
              setLoginError('');
            } else {
              setLoginError('Invalid username or password. Please try again.');
            }
          }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Enter employee username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>

            {loginError && (
              <div className="flex items-center space-x-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-4 rounded-xl text-xs transition duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              <span>Authenticate & Enter Portal</span>
            </button>
          </form>

          {/* Test Credentials Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Demo Accounts (Role-Based Testing)</span>
              <span className="text-[9px] lowercase font-normal text-indigo-400 font-semibold animate-pulse">Click to autofill</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {employees.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => {
                    setLoginUsername(emp.username);
                    setLoginPassword('password');
                    setLoginError('');
                  }}
                  className="flex flex-col text-left p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 transition text-[10px] cursor-pointer"
                >
                  <span className="font-bold text-white truncate">{emp.name}</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-indigo-400 font-extrabold uppercase text-[8px]">{emp.role === 'Admin' ? 'Admin' : 'Employee'}</span>
                    <span className="text-slate-500 text-[8px] italic truncate max-w-[60px]">
                      {emp.permissions.delete ? 'Full' : emp.permissions.edit ? 'Edit/Create' : emp.permissions.create ? 'Create' : 'View'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Subtle page footer */}
        <p className="text-[10px] text-slate-500 mt-6 relative z-10">Manappandal Matrimony Operational Interface v2.5.0</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-4 right-4 z-50 max-w-sm pointer-events-auto"
          >
            <div
              className={`px-4 py-3 rounded-xl border shadow-xl flex items-center space-x-3 backdrop-blur-md ${
                toast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : toast.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-800'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
              ) : (
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
              )}
              <span className="text-xs font-semibold">{toast.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shadow-2xl shrink-0">
        
        {/* Brand Logo & Header */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/40">
          <Heart className="h-6 w-6 text-indigo-400 fill-indigo-400" />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-none">Manappandal Matrimony</h1>
            <p className="text-[10px] text-slate-400 mt-1">Porutham Match Software</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          <div className="flex justify-center p-2">
            <button onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')} className="text-xs bg-slate-800 text-white px-3 py-1 rounded">
               {language === 'en' ? 'தமிழ்' : 'English'}
            </button>
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30'
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
            id="nav-dashboard"
          >
            <BarChart3 className="h-4.5 w-4.5 shrink-0" />
            <span>{t('dashboard')}</span>
          </button>
          
          <div className="border-t border-slate-800 my-2" />

          <button
            onClick={() => setActiveTab('company')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'company'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30'
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
            id="nav-company"
          >
            <Building className="h-4.5 w-4.5 shrink-0" />
            <span>{t('companyProfile')}</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'directory'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30'
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
            
           id="nav-directory"
          >
            <Users className="h-4.5 w-4.5 shrink-0" />
            <span>{t('manageProfiles')}</span>
          </button>

          <button
            onClick={() => setActiveTab('matcher')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'matcher'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30'
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
            id="nav-matcher"
          >
            <Compass className="h-4.5 w-4.5 shrink-0" />
            <span>{t('poruthamMatcher')}</span>
          </button>

          <button
            onClick={() => setActiveTab('recommend')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'recommend'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30'
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
            id="nav-recommend"
          >
            <Sparkles className="h-4.5 w-4.5 shrink-0" />
            <span>{t('aiMatchesEngine')}</span>
          </button>

          {/* Employee & Attendance Tab (accessible to all authenticated staff, with Admin having write privileges) */}
          <button
            onClick={() => setActiveTab('employees')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'employees'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30'
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
           id="nav-employees"
          >
            <ClipboardList className="h-4.5 w-4.5 shrink-0" />
            <span>{t('employeeAttendance')}</span>
          </button>

          {currentUser?.permissions.attendance && (
            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'attendance'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30'
                  : 'hover:bg-slate-800 hover:text-slate-100'
              }`}
              id="nav-attendance"
            >
              <Calendar className="h-4.5 w-4.5 shrink-0" />
              <span>Attendance Entry</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('admin')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30'
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
            id="nav-admin"
          >
            <Settings className="h-4.5 w-4.5 shrink-0" />
            <span>{t('adminConsole')}</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'social'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30'
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
            id="nav-social"
          >
            <MessageSquare className="h-4.5 w-4.5 shrink-0" />
            <span>{t('mediaReview')}</span>
          </button>

          <button
            onClick={() => setActiveTab('confirmed')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'confirmed'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30'
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
            id="nav-confirmed"
          >
            <Heart className="h-4.5 w-4.5 shrink-0" />
            <span>{t('confirmedMatches')}</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'help'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30'
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
            id="nav-help"
          >
            <HelpCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{t('matchingRulesInfo')}</span>
          </button>
        </nav>

        {/* Dynamic Logged-in User Panel with Logout button */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex flex-col space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <Avatar type={currentUser.avatarUrl || (currentUser.role === 'Admin' ? 'male_1' : 'female_1')} className="h-8 w-8 rounded-full shrink-0 ring-2 ring-indigo-500/20" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white leading-none truncate">{currentUser.name}</p>
                <p className="text-[9px] text-slate-400 mt-1 truncate">{currentUser.designation}</p>
                <div className="flex items-center mt-1">
                  <span className="text-[8px] bg-indigo-500/10 text-indigo-300 font-extrabold uppercase px-1 rounded">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('matrimony_logged_user');
                setCurrentUser(null);
                setToast({ text: 'Successfully logged out.', type: 'info' });
              }}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800/40 rounded-lg transition shrink-0 cursor-pointer"
              title="Logout from portal"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER NAVIGATION */}
      <div className="md:hidden flex flex-col w-full h-full overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-indigo-400 fill-indigo-400" />
            <span className="font-bold text-sm tracking-tight">Manappandal Matrimony</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 shadow-2xl p-4 flex flex-col space-y-1">
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold ${
                activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="h-4.5 w-4.5" />
              <span>Dashboard Hub</span>
            </button>
            <button
              onClick={() => { setActiveTab('directory'); setMobileMenuOpen(false); }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold ${
                activeTab === 'directory' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Users className="h-4.5 w-4.5" />
              <span>Manage Profiles (CRUD)</span>
            </button>
            <button
              onClick={() => { setActiveTab('matcher'); setMobileMenuOpen(false); }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold ${
                activeTab === 'matcher' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Compass className="h-4.5 w-4.5" />
              <span>Porutham Matcher</span>
            </button>
            <button
              onClick={() => { setActiveTab('recommend'); setMobileMenuOpen(false); }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold ${
                activeTab === 'recommend' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="h-4.5 w-4.5" />
              <span>AI Matches Engine</span>
            </button>
            <button
              onClick={() => { setActiveTab('employees'); setMobileMenuOpen(false); }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold ${
                activeTab === 'employees' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ClipboardList className="h-4.5 w-4.5" />
              <span>Employee & Attendance</span>
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold ${
                activeTab === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Settings className="h-4.5 w-4.5" />
              <span>Admin Console</span>
            </button>
            <button
              onClick={() => { setActiveTab('company'); setMobileMenuOpen(false); }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold ${
                activeTab === 'company' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Building className="h-4.5 w-4.5" />
              <span>Company Profile</span>
            </button>
            <button
              onClick={() => { setActiveTab('social'); setMobileMenuOpen(false); }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold ${
                activeTab === 'social' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="h-4.5 w-4.5" />
              <span>Media & Reviews</span>
            </button>
            <button
              onClick={() => { setActiveTab('confirmed'); setMobileMenuOpen(false); }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold ${
                activeTab === 'confirmed' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Heart className="h-4.5 w-4.5" />
              <span>Confirmed Matches</span>
            </button>
            <button
              onClick={() => { setActiveTab('help'); setMobileMenuOpen(false); }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold ${
                activeTab === 'help' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="h-4.5 w-4.5" />
              <span>Matching Rules & Info</span>
            </button>

            {/* Mobile current active user & logout */}
            <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar type={currentUser.avatarUrl || 'male_1'} className="h-8 w-8 rounded-full" />
                <div>
                  <p className="text-[11px] font-bold text-white leading-none">{currentUser.name}</p>
                  <p className="text-[9px] text-indigo-400 mt-1 uppercase font-semibold">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('matrimony_logged_user');
                  setCurrentUser(null);
                  setMobileMenuOpen(false);
                  setToast({ text: 'Logged out successfully', type: 'info' });
                }}
                className="flex items-center space-x-1.5 text-xs text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-lg transition"
              >
                <LogOut className="h-3 w-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MAIN VIEWPORT INTERFACE */}
      <main className="flex-grow flex flex-col h-full overflow-y-auto bg-slate-50/50">
        
        {/* VIEW 1: DASHBOARD HUB */}
        {activeTab === 'dashboard' && (
          <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
            
            {/* Header & Quick Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Matrimonial Operations Dashboard</h2>
                <p className="text-xs text-slate-500 mt-1">Real-time statistics across regional communities and matchings.</p>
              </div>
              <button
                onClick={handleOpenAddForm}
                className="flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <UserPlus className="h-4 w-4" />
                <span>Register New Profile</span>
              </button>
            </div>

            {/* Top Row Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Total Profiles</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">{totalProfiles}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{maleCount} M / {femaleCount} F registered</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Successful matches</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">{acceptedRequestsCount}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">Connecting hearts daily</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Pending Requests</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">{pendingRequestsCount}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Awaiting communication</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Active Communities</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">{communities.length}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Multi-community ready</p>
                </div>
              </div>
            </div>

            {/* Middle Section: Regional stats & Matching matrix helper */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Community Spread List */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 tracking-tight">Active Communities & Associated Franchises</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Summary reports of profiles loaded for each community group.</p>
                </div>
                
                <div className="mt-4 space-y-3">
                  {communities.map(comm => {
                    const count = profiles.filter(p => p.community === comm.name).length;
                    const pct = totalProfiles > 0 ? Math.round((count / totalProfiles) * 100) : 0;
                    return (
                      <div key={comm.id} className="p-3.5 bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800">{comm.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{comm.region} • Franchise Code: <span className="font-mono bg-slate-200 px-1 py-0.2 rounded font-semibold text-[9px]">{comm.code}</span></p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-extrabold text-slate-900">{count} profiles</p>
                          <div className="w-16 bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-indigo-600 h-1 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Astrological & Expectation weights helper */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center space-x-1.5">
                    <Settings className="h-4 w-4 text-indigo-500" />
                    <span>Algorithmic Matching Weights</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tune composite match calculations for all clients.</p>
                </div>

                <div className="space-y-4 flex-grow">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Jothidam (Star Match)</span>
                      <span>{Math.round(jothidamWeight * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={jothidamWeight}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        setJothidamWeight(val);
                        setExpectationWeight(1 - val);
                      }}
                      className="w-full accent-indigo-600"
                    />
                    <p className="text-[9px] text-slate-400 mt-1">Tamil Ten Porutham rules and Dosham checks weight.</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Expectations Match</span>
                      <span>{Math.round(expectationWeight * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={expectationWeight}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        setExpectationWeight(val);
                        setJothidamWeight(1 - val);
                      }}
                      className="w-full accent-indigo-600"
                    />
                    <p className="text-[9px] text-slate-400 mt-1">Gold, job, income, and location matching compliance weight.</p>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start space-x-2.5">
                  <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed text-indigo-900">
                    Weights govern the <strong>AI Recommendations</strong> engine. Tuning allows the matchmaking agent to prioritize custom financial goals or traditional star compatibilities as requested by the client's family.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Active Pending Communication Requests */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 tracking-tight">Recent Communication Inquiries</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Direct contact connections initiated by brides or grooms.</p>
                </div>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {requests.length} total cases
                </span>
              </div>

              <div className="mt-4 overflow-x-auto">
                {requests.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No active contact requests logged.</p>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="text-slate-400 font-extrabold border-b border-slate-100">
                        <th className="pb-2.5">Sender Candidate</th>
                        <th className="pb-2.5">Target Candidate</th>
                        <th className="pb-2.5">Compatibility Status</th>
                        <th className="pb-2.5">Sent Date</th>
                        <th className="pb-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {requests.map(req => {
                        const sender = profiles.find(p => p.id === req.senderId);
                        const receiver = profiles.find(p => p.id === req.receiverId);
                        if (!sender || !receiver) return null;

                        const mathStat = getCompositeScore(
                          sender.gender === 'Female' ? sender : receiver,
                          sender.gender === 'Male' ? sender : receiver
                        );

                        return (
                          <tr key={req.id} className="text-slate-700 hover:bg-slate-50/50">
                            <td className="py-3">
                              <div className="flex items-center space-x-2.5">
                                <Avatar type={sender.avatarUrl} className="h-7 w-7" />
                                <div>
                                  <p className="font-bold text-slate-900 text-xs">{sender.name}</p>
                                  <p className="text-[10px] text-slate-500">{sender.community} • {sender.location}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center space-x-2.5">
                                <Avatar type={receiver.avatarUrl} className="h-7 w-7" />
                                <div>
                                  <p className="font-bold text-slate-900 text-xs">{receiver.name}</p>
                                  <p className="text-[10px] text-slate-500">{receiver.community} • {receiver.location}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className="inline-flex items-center space-x-1 font-semibold text-slate-800 text-[11px]">
                                <span className={`w-2 h-2 rounded-full ${mathStat.hasRajju ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                <span>{mathStat.percentage}% Match ({mathStat.rating})</span>
                              </span>
                            </td>
                            <td className="py-3 text-slate-500 text-[11px]">
                              {new Date(req.sentAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="py-3 text-right">
                              {req.status === 'Pending' ? (
                                <div className="inline-flex space-x-1.5 justify-end">
                                  <button
                                    onClick={() => handleUpdateStatus(req.id, 'Accepted')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] transition"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(req.id, 'Declined')}
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2.5 py-1 rounded-lg text-[10px] transition"
                                  >
                                    Decline
                                  </button>
                                </div>
                              ) : (
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                  req.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {req.status}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PROFILES DIRECTORY (CRUD + FILTER) */}
        {activeTab === 'directory' && (
          <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            
            {/* Header Title with quick register */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Matrimonial Database Directory</h2>
                <p className="text-xs text-slate-500 mt-1">Manage, filter, add, edit, or delete male and female client particulars.</p>
              </div>
              <button
                onClick={handleOpenAddForm}
                className="flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Candidate</span>
              </button>
            </div>

            {/* Filter controls panel */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, education, city, or profession..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-medium"
                />
              </div>

              {/* Categorical Filter Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Gender</label>
                  <select
                    value={genderFilter}
                    onChange={e => setGenderFilter(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Community</label>
                  <select
                    value={communityFilter}
                    onChange={e => setCommunityFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All Communities</option>
                    {uniqueCommunities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Location</label>
                  <select
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All Cities</option>
                    {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Star (Nakshatra)</label>
                  <select
                    value={starFilter}
                    onChange={e => setStarFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All Stars</option>
                    {uniqueStars.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Chevvai Dosham</label>
                  <select
                    value={chevvaiFilter}
                    onChange={e => setChevvaiFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Yes">Dosham Present</option>
                    <option value="No">No Dosham</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProfiles.length === 0 ? (
                <div className="col-span-full bg-white border border-slate-200 p-12 rounded-2xl text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-400">No profile matches found with the active filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setGenderFilter('All');
                      setCommunityFilter('All');
                      setLocationFilter('All');
                      setStarFilter('All');
                      setChevvaiFilter('All');
                    }}
                    className="text-xs text-indigo-600 font-bold underline"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                filteredProfiles.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProfileId(p.id)}
                    className={`rounded-2xl border p-5 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group relative ${
                      p.approvedByAdmin 
                        ? 'bg-emerald-50/60 border-emerald-300 shadow-sm shadow-emerald-100/20' 
                        : 'bg-white border-slate-200/80'
                    }`}
                  >
                    {/* Top Info with tag */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3.5">
                        <Avatar type={p.avatarUrl} className="h-12 w-12" />
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition text-sm">
                            {p.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{p.id} • {p.gender} • {p.age} yrs</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.gender === 'Male' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-pink-50 text-pink-700 border border-pink-100'
                        }`}>
                          {p.gender}
                        </span>
                        {p.confirmedMatchedWith && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 uppercase tracking-wide">
                            Married / Paired
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 italic">
                      "{p.bio}"
                    </p>

                    {/* Technical details grid */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-1.5 text-[11px] font-medium border-t border-b border-slate-100 py-3 text-slate-600">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{p.jobType}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{p.location}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 min-w-0 col-span-2">
                        <span className="font-semibold text-slate-400 uppercase tracking-wide text-[9px] mr-1">Rasi/Star:</span>
                        <span className="truncate text-slate-800">{p.rasi} • {p.nakshatra}</span>
                      </div>
                    </div>

                    {/* Lower button panel */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600">
                        Rs {p.annualIncomeLakhs} Lakhs / yr
                      </span>

                      {/* CRUD & Approval controls */}
                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        {currentUser?.role === 'Admin' ? (
                          <label className="flex items-center space-x-1.5 cursor-pointer select-none bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition mr-1.5" title="Toggle Admin Approval Check">
                            <input
                              type="checkbox"
                              checked={!!p.approvedByAdmin}
                              onChange={(e) => {
                                const updated = profiles.map(profile => 
                                  profile.id === p.id ? { ...profile, approvedByAdmin: e.target.checked } : profile
                                );
                                setProfiles(updated);
                                setToast({
                                  text: e.target.checked 
                                    ? `Successfully approved candidate: ${p.name}` 
                                    : `Revoked approval for: ${p.name}`,
                                  type: 'info'
                                });
                              }}
                              className="h-3.5 w-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                            />
                            <span className="text-[10px] font-extrabold text-slate-700">Approve</span>
                          </label>
                        ) : (
                          p.approvedByAdmin && (
                            <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mr-1.5">
                              <Check className="h-3.5 w-3.5" />
                              <span>Approved</span>
                            </span>
                          )
                        )}

                        <button
                          onClick={(e) => handleOpenEditForm(p, e)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
                          title="Edit candidate profile details"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteProfile(p.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition"
                          title="Delete profile from database"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: TAMIL TEN PORUTHAM MATCHER */}
        {activeTab === 'matcher' && (
          <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            
            {/* Header Description */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Tamil Ten Porutham Astrological Matcher</h2>
              <p className="text-xs text-slate-500 mt-1">Select any bride and groom to instantly compile an authentic 10-point compatibility matching scorecard.</p>
            </div>

            {/* Candidate Selector Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              
              {/* Select Bride (Female) */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Select Bride (பெண்)</label>
                <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="shrink-0">
                    {currentBride ? <Avatar type={currentBride.avatarUrl} className="h-10 w-10" /> : <div className="h-10 w-10 rounded-xl bg-slate-200" />}
                  </div>
                  <div className="flex-grow min-w-0">
                    <select
                      value={matcherBrideId}
                      onChange={e => {
                        setMatcherBrideId(e.target.value);
                        setAiAnalysisText('');
                      }}
                      className="w-full bg-transparent font-bold text-slate-800 text-xs border-none p-0 focus:outline-none focus:ring-0"
                    >
                      <option value="" disabled>Choose Bride...</option>
                      {profiles.filter(p => p.gender === 'Female').map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Star: {p.nakshatra} - Rasi: {p.rasi})</option>
                      ))}
                    </select>
                    {currentBride && (
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {currentBride.education} • {currentBride.community} • {currentBride.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Select Groom (ஆண்) */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Select Groom (ஆண்)</label>
                <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="shrink-0">
                    {currentGroom ? <Avatar type={currentGroom.avatarUrl} className="h-10 w-10" /> : <div className="h-10 w-10 rounded-xl bg-slate-200" />}
                  </div>
                  <div className="flex-grow min-w-0">
                    <select
                      value={matcherGroomId}
                      onChange={e => {
                        setMatcherGroomId(e.target.value);
                        setAiAnalysisText('');
                      }}
                      className="w-full bg-transparent font-bold text-slate-800 text-xs border-none p-0 focus:outline-none focus:ring-0"
                    >
                      <option value="" disabled>Choose Groom...</option>
                      {profiles.filter(p => p.gender === 'Male').map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Star: {p.nakshatra} - Rasi: {p.rasi})</option>
                      ))}
                    </select>
                    {currentGroom && (
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {currentGroom.education} • {currentGroom.community} • {currentGroom.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RESULTS GRAPHICS & TABLES */}
            {(!currentBride || !currentGroom || !matchingResult) ? (
              <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center text-slate-400 text-xs">
                Please select both a Bride and a Groom from the dropdown filters above to run match calculations.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual scorecard score circle panel */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Composite Compatibility Score</p>
                    
                    {/* Circle rating gauge */}
                    <div className="relative w-36 h-36 mx-auto mt-4 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-95">
                        <circle cx="72" cy="72" r="62" stroke="#e2e8f0" strokeWidth="12" fill="transparent" />
                        <circle
                          cx="72"
                          cy="72"
                          r="62"
                          stroke={matchingResult.hasRajjuDosham ? "#f43f5e" : "#6366f1"}
                          strokeWidth="12"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 62}`}
                          strokeDashoffset={`${2 * Math.PI * 62 * (1 - matchingResult.percentage / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-extrabold text-slate-900 leading-none">{matchingResult.totalScore}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">out of 10</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className={`inline-flex px-3.5 py-1 rounded-full text-xs font-bold ${
                        matchingResult.rating === 'Excellent'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : matchingResult.rating === 'Good'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : matchingResult.rating === 'Average'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {matchingResult.rating} Compatibility
                      </span>
                    </div>
                  </div>

                  {/* Dosham Alerters */}
                  <div className="space-y-2.5">
                    {matchingResult.hasRajjuDosham && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-rose-900">
                        <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold leading-tight">Rajju Dosham Detected</p>
                          <p className="text-[10px] text-rose-700 mt-1 leading-normal">Both belong to same Rajju group. Unfavorable for long-term health harmony according to tradition.</p>
                        </div>
                      </div>
                    )}

                    {matchingResult.hasVedhaDosham && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2.5 text-amber-900">
                        <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold leading-tight">Vedha Affliction Detected</p>
                          <p className="text-[10px] text-amber-700 mt-1 leading-normal">Mutual star clash. Indicates occasional stress or friction points in day-to-day decisions.</p>
                        </div>
                      </div>
                    )}

                    {!matchingResult.hasRajjuDosham && !matchingResult.hasVedhaDosham && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start space-x-2.5 text-emerald-900">
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold leading-tight">Auspicious Astrological Protection</p>
                          <p className="text-[10px] text-emerald-700 mt-0.5 leading-normal">No Rajju or Vedha doshams present. Core safety rules are successfully fulfilled.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Astrological verdict summary */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Astrological Verdict</p>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold mt-1">
                      {matchingResult.verdict}
                    </p>
                  </div>

                  {/* Action row to send inquiry or trigger advisor */}
                  <div className="space-y-2 pt-2">
                    {/* Admin Match Confirmation Option */}
                    {currentUser?.role === 'Admin' && (
                      <button
                        onClick={() => {
                          const updated = profiles.map(p => {
                            if (p.id === currentBride.id) {
                              return { ...p, confirmedMatchedWith: currentGroom.id };
                            }
                            if (p.id === currentGroom.id) {
                              return { ...p, confirmedMatchedWith: currentBride.id };
                            }
                            return p;
                          });
                          setProfiles(updated);
                          setToast({
                            text: `🎉 Match officially confirmed between ${currentBride.name} & ${currentGroom.name}! They are now registered in the Confirmed Matches gallery.`,
                            type: 'success'
                          });
                        }}
                        disabled={currentBride.confirmedMatchedWith === currentGroom.id}
                        className={`w-full flex items-center justify-center space-x-1.5 font-bold text-xs py-2.5 rounded-xl transition ${
                          currentBride.confirmedMatchedWith === currentGroom.id
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        <span>
                          {currentBride.confirmedMatchedWith === currentGroom.id
                            ? 'Match Confirmed & Locked'
                            : 'Confirm & Lock Marriage Match'}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => handleSendRequest(currentGroom.id, currentBride.id)}
                      className="w-full flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
                    >
                      <HeartHandshake className="h-4 w-4" />
                      <span>Initiate Match Communication</span>
                    </button>

                    <button
                      onClick={() => handleAiAdvisory(currentBride, currentGroom)}
                      disabled={isAiAnalyzing}
                      className="w-full flex items-center justify-center space-x-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-indigo-300 font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
                    >
                      {isAiAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
                          <span>AI Advising...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Generate AI Strategic Advisory</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Ten Porutham detailed list */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 tracking-tight">Detailed 10-Porutham Analysis</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Calculated based on standard Tamil Thirumana Porutham scriptures.</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      Matches: {matchingResult.poruthamScores.filter(s => s.score > 0).length} / 10
                    </span>
                  </div>

                  {/* Porutham Accordion style list */}
                  <div className="space-y-2.5 overflow-y-auto max-h-[480px] pr-1">
                    {matchingResult.poruthamScores.map((scoreCard, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${
                              scoreCard.status === 'Uthamam' ? 'bg-emerald-500' : scoreCard.status === 'Madhyamam' ? 'bg-amber-500' : 'bg-rose-500'
                            }`} />
                            <p className="text-xs font-bold text-slate-900 leading-none">{scoreCard.label}</p>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal pr-4">{scoreCard.description}</p>
                        </div>

                        <div className="text-left sm:text-right shrink-0">
                          <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            scoreCard.status === 'Uthamam'
                              ? 'bg-emerald-100 text-emerald-800'
                              : scoreCard.status === 'Madhyamam'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {scoreCard.status} (+{scoreCard.score})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Advisor advisory text panel */}
                {aiAnalysisText && (
                  <div className="col-span-full bg-indigo-50/40 border border-indigo-100 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center space-x-2 border-b border-indigo-100 pb-2">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      <h4 className="font-bold text-sm text-slate-900">Gemini Professional Matrimonial Advice</h4>
                    </div>
                    <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
                      {aiAnalysisText}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: AI MATCH RECOMMENDATIONS ENGINE */}
        {activeTab === 'recommend' && (
          <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            
            {/* Header Description */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">AI-Powered Match Recommendations</h2>
              <p className="text-xs text-slate-500 mt-1">Select a single profile and run our advanced recommendation model to find the most compatible candidates instantly.</p>
            </div>

            {/* Target Profile Selector */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                  <Compass className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 tracking-tight">Select Reference Candidate</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Recommendations will rank candidates of the opposite gender against this reference.</p>
                </div>
              </div>

              <div className="min-w-[240px]">
                <select
                  value={recommendTargetId}
                  onChange={e => setRecommendTargetId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="" disabled>Select Candidate...</option>
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.gender} • Star: {p.nakshatra})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Recommendations Grid lists */}
            {(!targetProfile) ? (
              <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center text-slate-400 text-xs">
                No target profile selected to evaluate.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-[10px] uppercase tracking-widest text-slate-400">
                    Recommended matches for {targetProfile.name} ({targetProfile.gender})
                  </h4>
                  <span className="text-xs font-semibold text-slate-500">
                    Found {recommendedCandidates.length} eligible opposite-gender profiles
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {recommendedCandidates.length === 0 ? (
                    <p className="text-xs text-slate-400 col-span-full text-center py-8">No opposite gender profiles registered in database currently.</p>
                  ) : (
                    recommendedCandidates.map(({ profile: p, stats }) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
                      >
                        {/* Header Info */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3.5">
                            <Avatar type={p.avatarUrl} className="h-11 w-11" />
                            <div>
                              <h5 className="font-bold text-slate-900 text-xs leading-none">{p.name}</h5>
                              <p className="text-[10px] text-slate-400 mt-1">{p.age} yrs • {p.location} • Star: {p.nakshatra}</p>
                            </div>
                          </div>

                          {/* Composite percentage badge */}
                          <div className="text-right">
                            <span className={`inline-block text-base font-extrabold px-3 py-1 rounded-xl leading-none ${
                              stats.percentage >= 75
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : stats.percentage >= 50
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                : 'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}>
                              {stats.percentage}% Match
                            </span>
                            <p className="text-[8px] text-slate-400 uppercase tracking-widest font-extrabold mt-1">{stats.rating}</p>
                          </div>
                        </div>

                        {/* Split values */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500">
                          <div>
                            <p className="text-slate-400 font-extrabold">Star Porutham</p>
                            <p className="text-xs text-slate-800 font-extrabold mt-0.5">{stats.astroPct}% Compatibility</p>
                          </div>
                          <div>
                            <p className="text-slate-400 font-extrabold">Expectations compliance</p>
                            <p className="text-xs text-slate-800 font-extrabold mt-0.5">Bride: {stats.expBridePct}% • Groom: {stats.expGroomPct}%</p>
                          </div>
                        </div>

                        {/* Small Bio */}
                        <p className="text-xs text-slate-500 line-clamp-2">
                          "{p.bio}"
                        </p>

                        {/* Bottom click actions */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                          <span className="text-[10px] font-semibold text-slate-400">
                            Education: <span className="text-slate-700 font-bold">{p.education}</span>
                          </span>

                          <div className="flex items-center space-x-1.5">
                            {/* Run matching report shortcut */}
                            <button
                              onClick={() => {
                                if (targetProfile.gender === 'Female') {
                                  setMatcherBrideId(targetProfile.id);
                                  setMatcherGroomId(p.id);
                                } else {
                                  setMatcherBrideId(p.id);
                                  setMatcherGroomId(targetProfile.id);
                                }
                                setAiAnalysisText('');
                                setActiveTab('matcher');
                              }}
                              className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[10px] transition"
                            >
                              View Astrological Report
                            </button>
                            <button
                              onClick={() => handleSendRequest(targetProfile.id, p.id)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition"
                            >
                              Send Request
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4.5: EMPLOYEE & ATTENDANCE DESK */}
        {activeTab === 'employees' && (
          <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            
            {/* Header with Date Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <ClipboardList className="h-6 w-6 text-indigo-600" />
                  <span>Employee & Attendance Desk</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">Manage staff credentials, customize operational permissions, track daily log-ins, and update attendance logs.</p>
              </div>

              {/* Date Selector & Self Clocking panel */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center space-x-2 text-xs text-slate-700 shadow-sm">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium">Duty Date:</span>
                  <input
                    type="date"
                    value={employeeSelectedDate}
                    onChange={(e) => setEmployeeSelectedDate(e.target.value)}
                    className="border-none bg-transparent focus:outline-none focus:ring-0 font-semibold text-slate-900 p-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Quick Shift Panel & Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Stat 1: Total Employees */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Franchise Staff</p>
                  <p className="text-xl font-bold text-slate-900 mt-0.5">{employees.length}</p>
                </div>
              </div>

              {/* Stat 2: Active Duty Count */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present on Duty</p>
                  <p className="text-xl font-bold text-slate-900 mt-0.5">
                    {employees.filter(emp => {
                      const rec = attendance.find(a => a.employeeId === emp.id && a.date === employeeSelectedDate);
                      return rec?.status === 'Present' || rec?.status === 'Half Day';
                    }).length} Active
                  </p>
                </div>
              </div>

              {/* Stat 3: On Leave */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Approved Leave</p>
                  <p className="text-xl font-bold text-slate-900 mt-0.5">
                    {employees.filter(emp => {
                      const rec = attendance.find(a => a.employeeId === emp.id && a.date === employeeSelectedDate);
                      return rec?.status === 'On Leave';
                    }).length} Staff
                  </p>
                </div>
              </div>

              {/* Stat 4: Interactive Self Duty Card */}
              <div className="bg-indigo-900 text-white p-4 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-2 opacity-10">
                  <Clock className="h-24 w-24" />
                </div>
                <div className="relative z-10">
                  <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">My Operational Shift</p>
                  {(() => {
                    const selfRecord = attendance.find(a => a.employeeId === currentUser?.id && a.date === employeeSelectedDate);
                    if (selfRecord) {
                      return (
                        <div className="mt-1">
                          <p className="text-xs font-semibold">
                            Status: <span className="bg-indigo-600 text-indigo-100 text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase">{selfRecord.status}</span>
                          </p>
                          <p className="text-[10px] text-indigo-300 mt-1">
                            In: {selfRecord.clockIn || '--'} | Out: {selfRecord.clockOut || 'Active'}
                          </p>
                        </div>
                      );
                    } else {
                      return (
                        <p className="text-xs text-indigo-200 mt-1 font-medium">Shift not started for today</p>
                      );
                    }
                  })()}
                </div>
                
                {/* Instant Actions */}
                <div className="flex items-center space-x-2 mt-3 relative z-10">
                  {(() => {
                    const selfRecord = attendance.find(a => a.employeeId === currentUser?.id && a.date === employeeSelectedDate);
                    if (!selfRecord || !selfRecord.clockIn) {
                      return (
                        <button
                          onClick={handleClockInSelf}
                          className="w-full bg-white text-indigo-900 font-bold text-[10px] py-1.5 px-3 rounded-lg hover:bg-indigo-50 transition shadow cursor-pointer text-center"
                        >
                          Clock In
                        </button>
                      );
                    } else if (!selfRecord.clockOut) {
                      return (
                        <button
                          onClick={handleClockOutSelf}
                          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg transition shadow border border-indigo-400 cursor-pointer text-center"
                        >
                          Clock Out
                        </button>
                      );
                    } else {
                      return (
                        <span className="text-[10px] font-bold text-emerald-300 italic flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5" /> Shift Completed
                        </span>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Panel 1 (Main): Daily Attendance Ledger */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 tracking-tight">Franchise Attendance Registry</h3>
                    <p className="text-[11px] text-slate-500">Log-ins and active duty status for {employeeSelectedDate}</p>
                  </div>
                  <div className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-lg">
                    {currentUser?.role === 'Admin' ? 'Admin Controller Active' : 'Self Service View'}
                  </div>
                </div>

                <div className="space-y-3">
                  {employees.map((emp) => {
                    const dutyRecord = attendance.find(a => a.employeeId === emp.id && a.date === employeeSelectedDate);
                    const isSelf = emp.id === currentUser?.id;
                    
                    return (
                      <div
                        key={emp.id}
                        className={`p-4 rounded-xl border transition-all duration-150 ${
                          isSelf ? 'bg-indigo-50/40 border-indigo-100 ring-1 ring-indigo-100' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          {/* Staff Info */}
                          <div className="flex items-center space-x-3">
                            <Avatar type={emp.avatarUrl || 'male_1'} className="h-10 w-10 rounded-full" />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-slate-900">{emp.name}</span>
                                {isSelf && <span className="bg-indigo-600 text-white text-[8px] font-extrabold uppercase px-1 rounded">You</span>}
                                <span className="text-[9px] bg-slate-200/60 text-slate-600 px-1.5 py-0.2 rounded">
                                  {emp.role}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5">{emp.designation}</p>
                              
                              {/* Timing logs if marked */}
                              {dutyRecord && (dutyRecord.status === 'Present' || dutyRecord.status === 'Half Day') && (
                                <p className="text-[9px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Shift log: {dutyRecord.clockIn || '--'} to {dutyRecord.clockOut || 'Active'}</span>
                                </p>
                              )}
                              
                              {dutyRecord?.notes && (
                                <p className="text-[9px] text-slate-400 italic mt-0.5">"{dutyRecord.notes}"</p>
                              )}
                            </div>
                          </div>

                          {/* Attendance Status Badge / Quick mark */}
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            {/* Static status display */}
                            <div className="flex items-center space-x-2">
                              <span className="text-[9px] text-slate-400 font-bold uppercase">Status:</span>
                              {(() => {
                                const stat = dutyRecord?.status;
                                if (stat === 'Present') return <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">Present</span>;
                                if (stat === 'Absent') return <span className="bg-rose-100 text-rose-800 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">Absent</span>;
                                if (stat === 'On Leave') return <span className="bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">On Leave</span>;
                                if (stat === 'Half Day') return <span className="bg-sky-100 text-sky-800 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">Half Day</span>;
                                return <span className="bg-slate-100 text-slate-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">Not Marked</span>;
                              })()}
                            </div>

                            {/* Admin Overrides & Controls */}
                            {currentUser?.role === 'Admin' ? (
                              <div className="flex items-center gap-1 mt-1">
                                <button
                                  onClick={() => handleMarkAttendance(emp.id, 'Present', 'Franchise duty marked')}
                                  className="text-[9px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-1.5 py-1 rounded transition cursor-pointer"
                                  title="Mark Present"
                                >
                                  Present
                                </button>
                                <button
                                  onClick={() => handleMarkAttendance(emp.id, 'Half Day', 'Half-day duty marked')}
                                  className="text-[9px] bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold px-1.5 py-1 rounded transition cursor-pointer"
                                  title="Mark Half Day"
                                >
                                  Half Day
                                </button>
                                <button
                                  onClick={() => handleMarkAttendance(emp.id, 'On Leave', 'Approved Leave')}
                                  className="text-[9px] bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-1.5 py-1 rounded transition cursor-pointer"
                                  title="Mark On Leave"
                                >
                                  Leave
                                </button>
                                <button
                                  onClick={() => handleMarkAttendance(emp.id, 'Absent', 'Duty Absent')}
                                  className="text-[9px] bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-1.5 py-1 rounded transition cursor-pointer"
                                  title="Mark Absent"
                                >
                                  Absent
                                </button>
                              </div>
                            ) : (
                              isSelf && !dutyRecord && (
                                <button
                                  onClick={handleClockInSelf}
                                  className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-lg transition shadow-sm cursor-pointer"
                                >
                                  Clock In Now
                                </button>
                              )
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Panel 2 (Right): Employee Directory List */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 tracking-tight">Franchise Staff Roster</h3>
                    <p className="text-[11px] text-slate-500">Employee credentials, security roles & permission lists</p>
                  </div>
                  {currentUser?.role === 'Admin' && (
                    <button
                      onClick={handleOpenAddEmployee}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg flex items-center space-x-1 transition shadow-sm cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Register Staff</span>
                    </button>
                  )}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search staff by name or designation..."
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Staff Cards List */}
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {employees
                    .filter(emp => emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) || emp.designation.toLowerCase().includes(employeeSearch.toLowerCase()) || emp.role.toLowerCase().includes(employeeSearch.toLowerCase()))
                    .map((emp) => (
                      <div key={emp.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 hover:border-slate-200 transition">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2.5">
                            <Avatar type={emp.avatarUrl || 'male_1'} className="h-8 w-8 rounded-full" />
                            <div>
                              <p className="text-xs font-bold text-slate-900 leading-tight">{emp.name}</p>
                              <p className="text-[10px] text-indigo-600 font-medium">{emp.designation}</p>
                            </div>
                          </div>

                          {/* Action Buttons (Admin Only) */}
                          {currentUser?.role === 'Admin' && (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleOpenEditEmployee(emp)}
                                className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition cursor-pointer"
                                title="Edit employee details"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              {emp.id !== currentUser?.id && (
                                <button
                                  onClick={() => handleDeleteEmployee(emp.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                                  title="Delete employee profile"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Contacts & Joined info */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-200/50 text-[9px] text-slate-500">
                          <div>
                            <span className="font-bold text-slate-400">Username:</span> {emp.username}
                          </div>
                          <div>
                            <span className="font-bold text-slate-400">Joined:</span> {emp.joinedDate}
                          </div>
                          <div className="col-span-2">
                            <span className="font-bold text-slate-400">Contact:</span> {emp.phone} | {emp.email}
                          </div>
                        </div>

                        {/* Permissions Grid */}
                        <div className="pt-1.5 border-t border-slate-200/50">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Operational Permissions Matrix</p>
                          <div className="flex flex-wrap gap-1">
                            <span className="bg-indigo-50 text-indigo-700 text-[8px] px-1 rounded font-bold flex items-center gap-0.5">
                              <Check className="h-2 w-2" /> View Profiles
                            </span>
                            {emp.permissions.create ? (
                              <span className="bg-emerald-50 text-emerald-700 text-[8px] px-1 rounded font-bold flex items-center gap-0.5">
                                <Check className="h-2 w-2" /> Add Candidate
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-400 text-[8px] px-1 rounded font-medium flex items-center gap-0.5 line-through">
                                Add Candidate
                              </span>
                            )}
                            {emp.permissions.edit ? (
                              <span className="bg-sky-50 text-sky-700 text-[8px] px-1 rounded font-bold flex items-center gap-0.5">
                                <Check className="h-2 w-2" /> Edit Candidate
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-400 text-[8px] px-1 rounded font-medium flex items-center gap-0.5 line-through">
                                Edit Candidate
                              </span>
                            )}
                            {emp.permissions.delete ? (
                              <span className="bg-rose-50 text-rose-700 text-[8px] px-1 rounded font-bold flex items-center gap-0.5">
                                <Check className="h-2 w-2" /> Delete Candidate
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-400 text-[8px] px-1 rounded font-medium flex items-center gap-0.5 line-through">
                                Delete Candidate
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            </div>

            {/* REGISTER / EDIT EMPLOYEE MODAL DIALOG (Admin Only) */}
            {isEmployeeFormOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white border border-slate-200 shadow-2xl rounded-3xl max-w-xl w-full overflow-hidden"
                >
                  <div className="bg-slate-950 p-6 text-white flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base tracking-tight">
                        {employeeFormMode === 'add' ? 'Register New Staff Member' : 'Update Staff Credentials'}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-1">Configure workspace parameters, roles, and candidate privileges</p>
                    </div>
                    <button
                      onClick={() => setIsEmployeeFormOpen(false)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEmployee} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formEmpName}
                          onChange={(e) => setFormEmpName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formEmpEmail}
                          onChange={(e) => setFormEmpEmail(e.target.value)}
                          placeholder="john@Manappandalmatrimony.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Username *</label>
                        <input
                          type="text"
                          required
                          value={formEmpUsername}
                          onChange={(e) => setFormEmpUsername(e.target.value)}
                          placeholder="johndoe"
                          disabled={employeeFormMode === 'edit'}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all disabled:opacity-50"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password *</label>
                        <input
                          type="password"
                          required
                          value={formEmpPassword}
                          onChange={(e) => setFormEmpPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Photograph *</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Designation Title</label>
                        <input
                          type="text"
                          value={formEmpDesignation}
                          onChange={(e) => setFormEmpDesignation(e.target.value)}
                          placeholder="Regional Supervisor"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                        <input
                          type="text"
                          value={formEmpPhone}
                          onChange={(e) => setFormEmpPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Security Role</label>
                      <div className="flex items-center space-x-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="empRole"
                            value="Employee"
                            checked={formEmpRole === 'Employee'}
                            onChange={() => {
                              setFormEmpRole('Employee');
                              setFormEmpPermissions({
                                view: true,
                                create: true,
                                edit: false,
                                delete: false,
                                viewAttendance: false,
                                editAttendance: false,
                                deleteAttendance: false
                              });
                            }}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="font-semibold">Operations Employee</span>
                        </label>
                        <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="empRole"
                            value="Admin"
                            checked={formEmpRole === 'Admin'}
                            onChange={() => {
                              setFormEmpRole('Admin');
                              setFormEmpPermissions({
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                                viewAttendance: true,
                                editAttendance: true,
                                deleteAttendance: true
                              });
                            }}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="font-semibold text-indigo-600">Franchise Administrator</span>
                        </label>
                      </div>
                    </div>

                    {/* Permission Matrices */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Candidate Operations Privileges</label>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                        
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formEmpPermissions.create}
                            onChange={(e) => setFormEmpPermissions(prev => ({ ...prev, create: e.target.checked }))}
                            className="text-indigo-600 rounded focus:ring-indigo-500 mt-0.5"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">Candidate Profile Creation</span>
                            <span className="text-[10px] text-slate-500">Allow staff member to register new matrimonial candidate profiles</span>
                          </div>
                        </label>

                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formEmpPermissions.edit}
                            onChange={(e) => setFormEmpPermissions(prev => ({ ...prev, edit: e.target.checked }))}
                            className="text-indigo-600 rounded focus:ring-indigo-500 mt-0.5"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">Candidate Profile Updates (Edit)</span>
                            <span className="text-[10px] text-slate-500">Allow staff member to update horoscope matching details, birth data & family background</span>
                          </div>
                        </label>

                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formEmpPermissions.delete}
                            onChange={(e) => setFormEmpPermissions(prev => ({ ...prev, delete: e.target.checked }))}
                            className="text-indigo-600 rounded focus:ring-indigo-500 mt-0.5"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">Candidate Profile Permanent Deletion</span>
                            <span className="text-[10px] text-slate-500 text-rose-600 font-semibold">Allow staff member to delete candidate profiles (High Risk)</span>
                          </div>
                        </label>
                        
                        <label className="flex items-start space-x-3 cursor-pointer mt-4 pt-4 border-t border-slate-200">
                          <input
                            type="checkbox"
                            checked={formEmpPermissions.viewAttendance}
                            onChange={(e) => setFormEmpPermissions(prev => ({ ...prev, viewAttendance: e.target.checked }))}
                            className="text-indigo-600 rounded focus:ring-indigo-500 mt-0.5"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">Attendance: View</span>
                            <span className="text-[10px] text-slate-500">Allow staff member to view attendance records</span>
                          </div>
                        </label>

                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formEmpPermissions.editAttendance}
                            onChange={(e) => setFormEmpPermissions(prev => ({ ...prev, editAttendance: e.target.checked }))}
                            className="text-indigo-600 rounded focus:ring-indigo-500 mt-0.5"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">Attendance: Edit/Mark</span>
                            <span className="text-[10px] text-slate-500">Allow staff member to mark or edit attendance records</span>
                          </div>
                        </label>

                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formEmpPermissions.deleteAttendance}
                            onChange={(e) => setFormEmpPermissions(prev => ({ ...prev, deleteAttendance: e.target.checked }))}
                            className="text-indigo-600 rounded focus:ring-indigo-500 mt-0.5"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">Attendance: Delete</span>
                            <span className="text-[10px] text-slate-500 text-rose-600 font-semibold">Allow staff member to delete attendance records</span>
                          </div>
                        </label>

                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsEmployeeFormOpen(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-md cursor-pointer"
                      >
                        Save Credentials & Access
                      </button>
                    </div>

                  </form>
                </motion.div>
              </div>
            )}

          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Attendance Entry</h2>
              <input 
                type="date" 
                value={employeeSelectedDate} 
                onChange={(e) => setEmployeeSelectedDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="grid grid-cols-6 gap-4 p-4 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
                <div className="col-span-2">Employee</div>
                <div>Status</div>
                <div className="col-span-2">Remarks</div>
                <div>Action</div>
              </div>
              {employees.map(emp => {
                const dutyRecord = attendance.find(a => a.employeeId === emp.id && a.date === employeeSelectedDate);
                return (
                <div key={emp.id} className="grid grid-cols-6 gap-4 p-4 border-b border-slate-100 items-center">
                  <div className="col-span-2 flex items-center space-x-3">
                     <Avatar type={emp.avatarUrl || 'male_1'} className="h-10 w-10 rounded-full" />
                     <span className="text-xs font-bold">{emp.name}</span>
                  </div>
                  <div>
                    <select 
                      disabled={!currentUser?.permissions.editAttendance}
                      className="text-xs border rounded-lg p-1 disabled:opacity-50" 
                      value={dutyRecord?.status || 'Present'} 
                      onChange={(e) => handleMarkAttendance(emp.id, e.target.value as any, dutyRecord?.notes || '')}
                    >
                      <option value="Present">Present</option>
                      <option value="Half Day">Half Day</option>
                      <option value="On Leave">Leave</option>
                      <option value="Absent">Absent</option>
                      <option value="Permission">Permission</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                     <input 
                      disabled={!currentUser?.permissions.editAttendance}
                      type="text" 
                      className="text-xs border rounded-lg p-1 w-full disabled:opacity-50" 
                      placeholder="Remarks..." 
                      value={dutyRecord?.notes || ''} 
                      onChange={(e) => handleMarkAttendance(emp.id, dutyRecord?.status as any || 'Present', e.target.value)} 
                    />
                  </div>
                  <div>
                    {currentUser?.permissions.deleteAttendance && dutyRecord && (
                      <button 
                        onClick={() => handleDeleteAttendance(dutyRecord.id)}
                        className="text-xs bg-rose-600 text-white px-3 py-1 rounded-lg"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}
        
        {/* VIEW 5: ADMIN CONSOLE & CONFIGS */}
        {activeTab === 'admin' && (
          <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            
            {/* Header */}
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Regional Franchise & Community Console</h2>
              <p className="text-xs text-slate-500 mt-1">Configure community-specific rules, manage franchise branches, and export system reports.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Franchise Listing & Add button */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 tracking-tight">Active Matrimony Franchises</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Each community is linked with a regional franchise center.</p>
                  </div>
                  
                  <button
                    onClick={() => setIsNewCommunityOpen(true)}
                    className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Community</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {communities.map(comm => (
                    <div key={comm.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{comm.name} ({comm.code})</p>
                        <p className="text-[10px] text-slate-500 mt-1">Region: {comm.region}</p>
                      </div>

                      <div className="text-right">
                        <span className="inline-block bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {comm.franchiseCount} branches
                        </span>
                        <p className="text-[9px] text-slate-400 mt-1">Active database client logs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Reports sidebar */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 tracking-tight">Operations Reporting Desk</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Compile the entire matrimonial database of profiles into printable documents or shareable operational records.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," 
                        + "ID,Name,Gender,Age,Community,Star,Rasi,Location,Education\n"
                        + profiles.map(p => `"${p.id}","${p.name}","${p.gender}",${p.age},"${p.community}","${p.nakshatra}","${p.rasi}","${p.location}","${p.education}"`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", "matrimonial_profiles_registry.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast('Successfully exported candidate database as CSV!', 'success');
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition"
                  >
                    <FileDown className="h-4 w-4 text-indigo-400" />
                    <span>Export Candidate Database (CSV)</span>
                  </button>

                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-slate-600" />
                    <span>Print System Status Report</span>
                  </button>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <p className="text-[10px] leading-relaxed text-indigo-900">
                    <strong>Note on future integrations:</strong> As the service expands, this operational admin desk will connect directly to AWS RDS PostgreSQL or Azure instances to scale multi-community matchmaking catalogs dynamically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: ASTRO RULES HELP / EXPLANATIONS */}
        {activeTab === 'help' && (
          <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
            
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Understanding Tamil Ten Porutham Astrological Rules</h2>
              <p className="text-xs text-slate-500 mt-1">An overview of the South Indian matrimonial matchmaking system, defining Dina to Vedha rules.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/40">
                  <h4 className="font-bold text-xs text-slate-900">1. Dina Porutham (தினப் பொருத்தம்)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Evaluates the birth stars distance of bride and groom. Favorable distance indicates strong physical health, deep immunity, longevity, and general well-being.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/40">
                  <h4 className="font-bold text-xs text-slate-900">2. Gana Porutham (கணப் பொருத்தம்)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Compares temperament. Stars are classed into Deva (Divine), Manusha (Human), and Rakshasa (Demon) Ganas. Matching ganas aligns perspectives and prevents verbal friction.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/40">
                  <h4 className="font-bold text-xs text-slate-900">3. Mahendra Porutham (மகேந்திர பொருத்தம்)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Fosters family lineage and ensures healthy children. A positive Mahendra parameter guarantees healthy descendants and robust growth of the family tree.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/40">
                  <h4 className="font-bold text-xs text-slate-900">4. Stree Deerga Porutham (ஸ்திரீதீர்க்க பொருத்தம்)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Guarantees prolonged prosperity and luxury for the bride. It measures the absolute distance from the bride's star to the groom's star (should be &gt;13).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/40">
                  <h4 className="font-bold text-xs text-slate-900">5. Yoni Porutham (யோனிப் பொருத்தம்)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Determines physical, instinctual, and sexual compatibility. It uses animal totems associated with each star to secure a mutually fulfilling intimate bond.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/40">
                  <h4 className="font-bold text-xs text-slate-900">6. Rasi Porutham (ராசிப் பொருத்தம்)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Secures zodiac sign alignment. Prevents heavy astrological frictions like "Shashtashtaga" (6-8 axis placement) which naturally invite sudden disputes.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/40">
                  <h4 className="font-bold text-xs text-slate-900">7. Rasi Athipathi Porutham (ராசி அதிபதி பொருத்தம்)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Friendship status between the planetary rulers of the bride and groom's moon signs. Aligns long-term familial warmth and mutual respect between in-laws.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/40">
                  <h4 className="font-bold text-xs text-slate-900">8. Vasya Porutham (வசியப் பொருத்தம்)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Vibrational attraction and romantic magnetism. Promotes deep affection, emotional compatibility, and protective feelings between the husband and wife.
                  </p>
                </div>

                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <h4 className="font-bold text-xs text-rose-900">9. Rajju Porutham (ரஜ்ஜுப் பொருத்தம்) — CRITICAL</h4>
                  <p className="text-[11px] text-rose-700 mt-1 leading-relaxed">
                    The single most vital check. Represents the marriage thread and safety. Same Rajju is inauspicious ("Rajju Dosham") and warns of high risk to marital stability.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <h4 className="font-bold text-xs text-amber-900">10. Vedha Porutham (வேதைப் பொருத்தம்) — CRITICAL</h4>
                  <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                    Affliction avoidance. Particular stars possess direct mutual hostile paths (Vedha). Fulfilling this ensures peaceful co-existence with minimal arguments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: COMPANY PROFILE SCREEN */}
        {activeTab === 'company' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Company Profile & Identity</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage administrative business details, GST configuration, and contact endpoints.</p>
              </div>
              {currentUser?.role === 'Admin' && (
                <button
                  onClick={() => setIsSocialFormOpen(!isSocialFormOpen)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm flex items-center space-x-1 cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>{isSocialFormOpen ? 'Cancel Editing' : 'Edit Company Details'}</span>
                </button>
              )}
            </div>

            {!isSocialFormOpen ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Brand & Identity Card */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-2xl text-white md:col-span-1 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest border border-indigo-500/30">
                      Matrimony HQ
                    </span>
                    <h3 className="text-xl font-extrabold mt-4 tracking-tight">{companyProfile.companyName}</h3>
                    <p className="text-xs text-indigo-200 mt-1 leading-relaxed">Official matrimonial engine servicing thousands of couples within our premium communities.</p>
                  </div>
                  {companyProfile.brochureImageUrl && (
                    <div className="pt-4 border-t border-indigo-500/20">
                      <span className="text-[10px] uppercase font-extrabold text-indigo-300 tracking-wider mb-2 block">Brochure First Page</span>
                      <img src={companyProfile.brochureImageUrl} alt="Company Brochure" className="w-full max-w-sm rounded-lg border border-indigo-500/20" />
                    </div>
                  )}
                  
                  <div className="space-y-3.5 text-xs text-indigo-100 border-t border-indigo-500/20 pt-4">
                    <div className="flex items-center space-x-2.5">
                      <Building className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span className="truncate">{companyProfile.incorporationNumber || 'INC-889281-Z'}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Sliders className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span>GST: {companyProfile.gstNumber || '33AAAAA1111A1Z1'}</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Parameters */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm md:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Contact Person</span>
                      <p className="text-sm font-bold text-slate-800">{companyProfile.contactPerson}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Official Email Address</span>
                      <p className="text-sm font-semibold text-slate-800">{companyProfile.email}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Phone Helpline</span>
                      <p className="text-sm font-bold text-slate-800">{companyProfile.phone}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">WhatsApp Portal</span>
                      <p className="text-sm font-bold text-emerald-600 flex items-center space-x-1">
                        <span>{companyProfile.whatsappNumber}</span>
                      </p>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Office Headquarters</span>
                      <p className="text-sm font-semibold text-slate-800 leading-relaxed">{companyProfile.address}, {companyProfile.city}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs text-slate-500">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span>This information is broadcasted on customer invoice templates and official client reports.</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Editing Company Profile Form */
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSocialFormOpen(false);
                  setToast({ text: 'Company details updated successfully!', type: 'success' });
                }}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
              >
                <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">Update Corporate Parameters</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyProfile.companyName}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, companyName: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={companyProfile.contactPerson}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, contactPerson: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Helpline Phone</label>
                    <input
                      type="text"
                      value={companyProfile.phone}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, phone: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">WhatsApp Business Number</label>
                    <input
                      type="text"
                      value={companyProfile.whatsappNumber}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, whatsappNumber: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Corporate Email</label>
                    <input
                      type="email"
                      value={companyProfile.email}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, email: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">City Headquarters</label>
                    <input
                      type="text"
                      value={companyProfile.city}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, city: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={companyProfile.address}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, address: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">GST Identification Number (GSTIN)</label>
                    <input
                      type="text"
                      value={companyProfile.gstNumber}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, gstNumber: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Brochure First Page Upload</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleBrochureUpload(e.target.files[0]);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    {companyProfile.brochureImageUrl && (
                      <p className="text-[10px] text-emerald-600 mt-1">Brochure image is currently set.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">Incorporation / Registration Code</label>
                    <input
                      type="text"
                      value={companyProfile.incorporationNumber}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, incorporationNumber: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsSocialFormOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* VIEW 8: MEDIA & REVIEWS HUB */}
        {activeTab === 'social' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header and Submenu */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Media, Reviews & Testimonial Hub</h2>
                <p className="text-xs text-slate-500 mt-0.5">Showcase success stories, collect community ratings, and view customer endorsement records.</p>
              </div>

              {/* Action for adding items based on current active subtab */}
              <button
                onClick={() => setIsSocialFormOpen(!isSocialFormOpen)}
                className="self-start sm:self-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1 shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>
                  {isSocialFormOpen 
                    ? 'Hide Form' 
                    : socialSubTab === 'gallery' ? 'Add Success Memory' 
                    : socialSubTab === 'reviews' ? 'Submit Client Review' 
                    : 'Add Endorsement'}
                </span>
              </button>
            </div>

            {/* Segmented controls for social sub-tabs */}
            <div className="bg-slate-100 p-1 rounded-xl flex space-x-1.5 max-w-md">
              <button
                onClick={() => { setSocialSubTab('gallery'); setIsSocialFormOpen(false); }}
                className={`flex-1 py-2 text-center font-bold text-xs rounded-lg transition-all cursor-pointer ${
                  socialSubTab === 'gallery'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Success Gallery ({gallery.length})
              </button>
              <button
                onClick={() => { setSocialSubTab('reviews'); setIsSocialFormOpen(false); }}
                className={`flex-1 py-2 text-center font-bold text-xs rounded-lg transition-all cursor-pointer ${
                  socialSubTab === 'reviews'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Customer Reviews ({reviews.length})
              </button>
              <button
                onClick={() => { setSocialSubTab('testimonials'); setIsSocialFormOpen(false); }}
                className={`flex-1 py-2 text-center font-bold text-xs rounded-lg transition-all cursor-pointer ${
                  socialSubTab === 'testimonials'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Testimonials ({testimonials.length})
              </button>
            </div>

            {/* Dynamic submission forms */}
            {isSocialFormOpen && (
              <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-md">
                {socialSubTab === 'gallery' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const title = (form.elements.namedItem('gTitle') as HTMLInputElement).value;
                      const date = (form.elements.namedItem('gDate') as HTMLInputElement).value;
                      const coupleName = (form.elements.namedItem('gCouple') as HTMLInputElement).value;
                      const story = (form.elements.namedItem('gStory') as HTMLTextAreaElement).value;
                      const imageType = (form.elements.namedItem('gImg') as HTMLSelectElement).value;

                      const newItem = {
                        id: `gal-${Date.now()}`,
                        coupleNames: coupleName,
                        title: title,
                        weddingDate: date,
                        imageUrl: imageType,
                        successStory: story
                      };
                      setGallery([newItem, ...gallery]);
                      setIsSocialFormOpen(false);
                      setToast({ text: 'Added success story photo successfully!', type: 'success' });
                    }}
                    className="space-y-4"
                  >
                    <h3 className="font-bold text-xs uppercase text-indigo-600 tracking-wider">Add New Matrimonial Success Story</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Couple Names</label>
                        <input name="gCouple" type="text" placeholder="e.g. Ramesh & Priya" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Wedding / Engagement Date</label>
                        <input name="gDate" type="date" required defaultValue="2026-06-20" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Title Phrase</label>
                        <input name="gTitle" type="text" placeholder="e.g. A match written in the stars" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Success Photo Mockup</label>
                        <select name="gImg" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                          <option value="male_1">Visual Couple Template 1</option>
                          <option value="female_1">Visual Couple Template 2</option>
                          <option value="male_2">Visual Couple Template 3</option>
                          <option value="female_2">Visual Couple Template 4</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Short Success Story Caption</label>
                        <textarea name="gStory" placeholder="Briefly describe their match journey..." required rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 border-t border-slate-100 pt-3">
                      <button type="button" onClick={() => setIsSocialFormOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer">Publish Photo Story</button>
                    </div>
                  </form>
                )}

                {socialSubTab === 'reviews' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const customerName = (form.elements.namedItem('rName') as HTMLInputElement).value;
                      const rating = parseInt((form.elements.namedItem('rRating') as HTMLSelectElement).value);
                      const reviewText = (form.elements.namedItem('rText') as HTMLTextAreaElement).value;

                      const newReview = {
                        id: `rev-${Date.now()}`,
                        customerName,
                        rating,
                        reviewText,
                        date: new Date().toISOString().split('T')[0],
                        verified: true
                      };
                      setReviews([newReview, ...reviews]);
                      setIsSocialFormOpen(false);
                      setToast({ text: 'Review published successfully!', type: 'success' });
                    }}
                    className="space-y-4"
                  >
                    <h3 className="font-bold text-xs uppercase text-indigo-600 tracking-wider">Submit Client Star Review</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Customer / Family Name</label>
                        <input name="rName" type="text" placeholder="e.g. Mr. & Mrs. Parthasarathy" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Satisfaction Score</label>
                        <select name="rRating" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                          <option value="5">⭐⭐⭐⭐⭐ Excellent (5 Stars)</option>
                          <option value="4">⭐⭐⭐⭐ Highly Satisfied (4 Stars)</option>
                          <option value="3">⭐⭐⭐ Average (3 Stars)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Review Statement</label>
                        <textarea name="rText" placeholder="Write feedback about the matchmaking experience..." required rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 border-t border-slate-100 pt-3">
                      <button type="button" onClick={() => setIsSocialFormOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer">Submit Review</button>
                    </div>
                  </form>
                )}

                {socialSubTab === 'testimonials' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const author = (form.elements.namedItem('tAuthor') as HTMLInputElement).value;
                      const role = (form.elements.namedItem('tRole') as HTMLInputElement).value;
                      const quote = (form.elements.namedItem('tQuote') as HTMLTextAreaElement).value;
                      const rating = parseInt((form.elements.namedItem('tRating') as HTMLSelectElement).value);

                      const newTestimonial = {
                        id: `test-${Date.now()}`,
                        author,
                        designationOrCity: role,
                        quote,
                        rating,
                        date: new Date().toISOString().split('T')[0]
                      };
                      setTestimonials([newTestimonial, ...testimonials]);
                      setIsSocialFormOpen(false);
                      setToast({ text: 'Added matrimonial testimonial endorsement!', type: 'success' });
                    }}
                    className="space-y-4"
                  >
                    <h3 className="font-bold text-xs uppercase text-indigo-600 tracking-wider">Add Client Testimonial Endorsement</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Author Name</label>
                        <input name="tAuthor" type="text" placeholder="e.g. Sridhar Ananthakrishnan" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">City or Relationship (e.g. Bride's Father, Chennai)</label>
                        <input name="tRole" type="text" placeholder="e.g. Groom's Brother, Madurai" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Rating Score</label>
                        <select name="tRating" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                          <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                          <option value="4">⭐⭐⭐⭐ Good (4/5)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Detailed Quote</label>
                        <textarea name="tQuote" placeholder="Provide full detailed story or endorsement..." required rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 border-t border-slate-100 pt-3">
                      <button type="button" onClick={() => setIsSocialFormOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer">Publish Testimonial</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Sub-tab views */}
            {socialSubTab === 'gallery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between group">
                    <div className="relative h-44 bg-slate-100 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                      <Avatar type={item.imageUrl as any} className="h-28 w-28 scale-110 group-hover:scale-120 transition-all duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent flex items-end p-4">
                        <div>
                          <h4 className="font-bold text-white text-sm tracking-tight">{item.coupleNames}</h4>
                          <p className="text-[10px] text-indigo-200 mt-0.5 font-medium flex items-center space-x-1">
                            <Calendar className="h-3 w-3 inline shrink-0" />
                            <span>Wedded on: {item.weddingDate}</span>
                          </p>
                        </div>
                      </div>
                      <span className="absolute top-3 right-3 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                        Pair Tied
                      </span>
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h5 className="font-bold text-xs text-slate-800 leading-snug">"{item.title}"</h5>
                        <p className="text-xs text-slate-500 leading-relaxed italic">
                          {item.successStory}
                        </p>
                      </div>
                      {currentUser?.role === 'Admin' && (
                        <div className="pt-3 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => {
                              setGallery(gallery.filter(g => g.id !== item.id));
                              setToast({ text: 'Removed gallery photo item.', type: 'info' });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                            title="Remove from success gallery"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {socialSubTab === 'reviews' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{item.customerName}</h4>
                          <span className="text-[10px] text-slate-400">{item.date}</span>
                        </div>
                        <div className="flex items-center space-x-0.5 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md text-[11px] font-extrabold text-amber-700">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                          <span>{item.rating}.0 / 5</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{item.reviewText}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mr-1" />
                        <span>Verified Family Endorsement</span>
                      </span>

                      {currentUser?.role === 'Admin' && (
                        <button
                          onClick={() => {
                            setReviews(reviews.filter(r => r.id !== item.id));
                            setToast({ text: 'Removed review.', type: 'info' });
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {socialSubTab === 'testimonials' && (
              <div className="space-y-4">
                {testimonials.map(item => (
                  <div key={item.id} className="bg-slate-50/60 p-6 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex items-center space-x-2">
                        <span className="text-indigo-600 font-extrabold text-xl leading-none">“</span>
                        <p className="text-xs font-semibold text-slate-700 leading-relaxed italic inline">
                          {item.quote}
                        </p>
                        <span className="text-indigo-600 font-extrabold text-xl leading-none">”</span>
                      </div>
                      <div className="flex items-center space-x-2.5 text-[11px] font-medium text-slate-500">
                        <span className="font-bold text-slate-800">{item.author}</span>
                        <span>•</span>
                        <span className="bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md font-bold text-[9px]">{item.designationOrCity}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="flex items-center space-x-0.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-indigo-100">
                        <Award className="h-4 w-4 text-indigo-500 shrink-0 mr-1" />
                        <span>{item.rating}/5 Score</span>
                      </div>

                      {currentUser?.role === 'Admin' && (
                        <button
                          onClick={() => {
                            setTestimonials(testimonials.filter(t => t.id !== item.id));
                            setToast({ text: 'Removed testimonial endorsement.', type: 'info' });
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                          title="Delete testimonial"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 9: CONFIRMED MATCHES */}
        {activeTab === 'confirmed' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Confirmed Married & Paired Couples</h2>
              <p className="text-xs text-slate-500 mt-0.5">Visual exhibition of happily confirmed couples paired via Astrological 10-Porutham assessment.</p>
            </div>

            {(() => {
              // Group couples by Groom id to prevent duplicate display of both sides of the same pair
              const groomsWithPairs = profiles.filter(p => p.gender === 'Male' && p.confirmedMatchedWith);
              
              if (groomsWithPairs.length === 0) {
                return (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
                    <Heart className="h-10 w-10 text-slate-300 mx-auto fill-slate-50 animate-pulse" />
                    <h3 className="font-bold text-slate-800 mt-4">No Confirmed Couples Registered</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      Go to the <strong>Porutham Matcher</strong>, load a bride and groom, and check compatibility. Admins can lock and confirm pairs from there!
                    </p>
                    <button
                      onClick={() => setActiveTab('matcher')}
                      className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Open Match Workbench
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {groomsWithPairs.map(groom => {
                    const bride = profiles.find(p => p.id === groom.confirmedMatchedWith);
                    if (!bride) return null;

                    // Calculate matching compatibility statistics
                    const matchStats = getCompositeScore(bride, groom);

                    return (
                      <div
                        key={groom.id}
                        className="bg-white rounded-2xl border border-pink-100 shadow-md shadow-pink-50/50 p-6 flex flex-col justify-between space-y-6 relative overflow-hidden"
                      >
                        {/* Decorative Top-Right Heart Watermark */}
                        <Heart className="absolute -top-6 -right-6 h-24 w-24 text-rose-50/40 fill-rose-50/20" />

                        {/* Married Pair Row */}
                        <div className="flex items-center justify-between relative z-10">
                          {/* Groom Side */}
                          <div className="flex flex-col items-center text-center space-y-2 w-[42%]">
                            <div className="relative">
                              <Avatar type={groom.avatarUrl} className="h-14 w-14 ring-4 ring-blue-100 rounded-full" />
                              <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
                                Groom
                              </span>
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-slate-800 truncate max-w-[120px]" title={groom.name}>
                                {groom.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">{groom.nakshatra} • {groom.age} yrs</p>
                            </div>
                          </div>

                          {/* Matching Heart Connection */}
                          <div className="flex flex-col items-center justify-center space-y-1.5 w-[16%]">
                            <div className="h-10 w-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center animate-bounce">
                              <Heart className="h-5 w-5 text-rose-500 fill-rose-400" />
                            </div>
                            <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                              {matchStats.percentage}%
                            </span>
                          </div>

                          {/* Bride Side */}
                          <div className="flex flex-col items-center text-center space-y-2 w-[42%]">
                            <div className="relative">
                              <Avatar type={bride.avatarUrl} className="h-14 w-14 ring-4 ring-pink-100 rounded-full" />
                              <span className="absolute -bottom-1 -right-1 bg-pink-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
                                Bride
                              </span>
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-slate-800 truncate max-w-[120px]" title={bride.name}>
                                {bride.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">{bride.nakshatra} • {bride.age} yrs</p>
                            </div>
                          </div>
                        </div>

                        {/* Compatibility Details */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] space-y-1.5 text-slate-600">
                          <div className="flex justify-between font-medium">
                            <span>Astrological Match:</span>
                            <span className="font-bold text-slate-800">{matchStats.astroPct}% ({matchStats.rating})</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Groom Nakshatra:</span>
                            <span className="font-bold text-blue-700">{groom.rasi} • {groom.nakshatra}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Bride Nakshatra:</span>
                            <span className="font-bold text-pink-700">{bride.rasi} • {bride.nakshatra}</span>
                          </div>
                        </div>

                        {/* Admin Action footer (Undo pairing) */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-2">
                          <span className="inline-flex items-center space-x-1.5 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Official Sealed Pair</span>
                          </span>

                          {currentUser?.role === 'Admin' && (
                            <button
                              onClick={() => {
                                const updated = profiles.map(p => {
                                  if (p.id === groom.id || p.id === bride.id) {
                                    return { ...p, confirmedMatchedWith: undefined };
                                  }
                                  return p;
                                });
                                setProfiles(updated);
                                setToast({
                                  text: `Success: Unlocked match pair of ${groom.name} & ${bride.name}`,
                                  type: 'info'
                                });
                              }}
                              className="text-[10px] font-bold text-slate-400 hover:text-rose-600 transition flex items-center space-x-1 hover:bg-rose-50 px-2.5 py-1 rounded-lg cursor-pointer"
                              title="Unlock Couple"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>Undo Match Registration</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </main>

      {/* MODAL 1: SELECTED PROFILE DETAILS INQUIRY MODAL */}
      <AnimatePresence>
        {selectedProfileId && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            {(() => {
              const p = profiles.find(item => item.id === selectedProfileId);
              if (!p) return null;
              return (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] space-y-6"
                >
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3.5">
                      <Avatar type={p.avatarUrl} className="h-12 w-12" />
                      <div>
                        <h3 className="font-bold text-base text-slate-900">{p.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">ID: {p.id} • Registered Matrimony Profile</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProfileId(null)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Profile contents broken into Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                    
                    {/* Column 1: Personal & Horoscope info */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-1 mb-2">Personal Particulars</h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between"><span>Age / Height:</span> <span className="font-bold text-slate-800">{p.age} yrs • {p.height}</span></li>
                          <li className="flex justify-between"><span>Community:</span> <span className="font-bold text-slate-800">{p.community}</span></li>
                          <li className="flex justify-between"><span>Current Location:</span> <span className="font-bold text-slate-800">{p.location}</span></li>
                          <li className="flex justify-between"><span>Education:</span> <span className="font-bold text-slate-800">{p.education}</span></li>
                          <li className="flex justify-between"><span>Profession:</span> <span className="font-bold text-slate-800">{p.jobType}</span></li>
                          <li className="flex justify-between"><span>Annual Income:</span> <span className="font-bold text-indigo-600">Rs {p.annualIncomeLakhs} Lakhs</span></li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-1 mb-2">Birth Horoscope (ஜோதிடம்)</h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between"><span>Birth Star (Nakshatra):</span> <span className="font-bold text-slate-800">{p.nakshatra}</span></li>
                          <li className="flex justify-between"><span>Moon Sign (Rasi):</span> <span className="font-bold text-slate-800">{p.rasi}</span></li>
                          <li className="flex justify-between"><span>Rasi Lord:</span> <span className="font-bold text-slate-800">{RASI_LORDS[p.rasi] || "N/A"}</span></li>
                          <li className="flex justify-between"><span>Chevvai Dosham (Mars):</span> <span className="font-bold text-slate-800">{p.chevvaiDosham}</span></li>
                          <li className="flex justify-between"><span>Birth Details:</span> <span className="font-bold text-slate-800">{p.birthDate} @ {p.birthTime}</span></li>
                          <li className="flex justify-between"><span>Place of Birth:</span> <span className="font-bold text-slate-800">{p.birthPlace}</span></li>
                        </ul>
                      </div>
                    </div>

                    {/* Column 2: Partner expectations & bio */}
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <h4 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center space-x-1.5">
                          <Heart className="h-4 w-4 text-indigo-500 fill-indigo-500" />
                          <span>Candidate Bio Introduction</span>
                        </h4>
                        <p className="text-[11px] leading-relaxed text-slate-600 italic">
                          "{p.bio}"
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-1 mb-2">Bride / Groom Expectations</h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between"><span>Age Range:</span> <span className="font-bold text-slate-800">{p.expectations.minAge} to {p.expectations.maxAge} yrs</span></li>
                          <li className="flex justify-between"><span>Communities:</span> <span className="font-bold text-slate-800 max-w-[140px] truncate block text-right" title={p.expectations.acceptedCommunities.join(', ')}>{p.expectations.acceptedCommunities.join(', ')}</span></li>
                          <li className="flex justify-between"><span>Preferred Jobs:</span> <span className="font-bold text-slate-800 max-w-[140px] truncate block text-right" title={p.expectations.acceptedJobTypes.join(', ')}>{p.expectations.acceptedJobTypes.join(', ')}</span></li>
                          <li className="flex justify-between"><span>Minimum Partner Income:</span> <span className="font-bold text-slate-800">Rs {p.expectations.minAnnualIncomeLakhs} Lakhs/yr</span></li>
                          <li className="flex justify-between"><span>Locations:</span> <span className="font-bold text-slate-800 max-w-[140px] truncate block text-right" title={p.expectations.acceptedLocations.join(', ')}>{p.expectations.acceptedLocations.join(', ')}</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Operational Footer action buttons */}
                  <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex space-x-2 shrink-0">
                      <button
                        onClick={() => handleOpenEditForm(p)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProfile(p.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    {/* Middle: Admin approval check */}
                    <div className="flex items-center shrink-0">
                      {currentUser?.role === 'Admin' ? (
                        <label className="flex items-center space-x-2 cursor-pointer select-none bg-emerald-50/50 border border-emerald-200 hover:bg-emerald-50 px-3.5 py-1.5 rounded-xl transition">
                          <input
                            type="checkbox"
                            checked={!!p.approvedByAdmin}
                            onChange={(e) => {
                              const updated = profiles.map(profile => 
                                profile.id === p.id ? { ...profile, approvedByAdmin: e.target.checked } : profile
                              );
                              setProfiles(updated);
                              setToast({
                                text: e.target.checked 
                                  ? `Successfully approved candidate: ${p.name}` 
                                  : `Revoked approval for: ${p.name}`,
                                type: 'info'
                              });
                            }}
                            className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                          />
                          <span className="text-xs font-bold text-slate-700">Admin Approved</span>
                        </label>
                      ) : (
                        p.approvedByAdmin && (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Check className="h-3.5 w-3.5 text-emerald-700" />
                            <span>Approved by Admin</span>
                          </span>
                        )
                      )}
                    </div>

                    <div className="flex space-x-2 shrink-0">
                      <button
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
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                      >
                        Load to Matcher
                      </button>

                      <button
                        onClick={() => {
                          setRecommendTargetId(p.id);
                          setSelectedProfileId(null);
                          setActiveTab('recommend');
                          showToast(`Showing recommendations for ${p.name}`, 'info');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>View Recommendations</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ADD / EDIT CANDIDATE COMPREHENSIVE FORM */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <UserPlus className="h-4.5 w-4.5 text-indigo-600" />
                  <span>{formMode === 'add' ? 'Register New Matrimonial Candidate' : 'Modify Candidate Particulars'}</span>
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6 text-xs text-slate-700">
                
                {/* 1. Personal & Zodiac inputs */}
                <div className="space-y-3.5">
                  <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">1. Personal & Astro Details</h4>
                  
                  {/* Photograph Upload Section */}
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative group shrink-0">
                      <Avatar type={formAvatarUrl || (formGender === 'Male' ? 'male_1' : 'female_1')} className="h-20 w-20 ring-4 ring-indigo-50/50" />
                      {formAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormAvatarUrl('');
                            showToast('Photograph removed.', 'info');
                          }}
                          className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-md transition"
                          title="Remove Photograph"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        {/* File upload button & Drag/drop */}
                        <label 
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (file) handlePhotoUpload(file);
                          }}
                          className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-200 hover:border-indigo-400 bg-white rounded-lg p-3 cursor-pointer transition text-center group"
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
                          <Plus className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition mb-1" />
                          <span className="font-semibold text-[11px] text-slate-700 group-hover:text-indigo-600">
                            Upload Photograph
                          </span>
                          <span className="text-[9px] text-slate-400">Drag & drop or click</span>
                        </label>

                        {/* Alternative: Image URL Input */}
                        <div className="flex-1 flex flex-col justify-between p-3 bg-white border border-slate-200 rounded-lg">
                          <label className="block font-bold text-slate-600 mb-1">Or Paste Image URL</label>
                          <input
                            type="text"
                            value={typeof formAvatarUrl === 'string' && !formAvatarUrl.startsWith('data:') ? formAvatarUrl : ''}
                            onChange={(e) => setFormAvatarUrl(e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:border-indigo-500 focus:outline-none text-[11px]"
                          />
                          <p className="text-[8px] text-slate-400 mt-1">Accepts any online image address.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        placeholder="e.g. Anand Kumar"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Gender</label>
                      <select
                        value={formGender}
                        onChange={e => setFormGender(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Male">Male (ஆண்)</option>
                        <option value="Female">Female (பெண்)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Date of Birth</label>
                      <input
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Age</label>
                      <input
                        type="number"
                        min="18"
                        max="60"
                        required
                        readOnly
                        value={formAge}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Height</label>
                      <input
                        type="text"
                        required
                        value={formHeight}
                        onChange={e => setFormHeight(e.target.value)}
                        placeholder="e.g. 5 ft 8 in"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Community</label>
                      <select
                        value={formCommunity}
                        onChange={e => setFormCommunity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      >
                        {communities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Current Location (City)</label>
                      <input
                        type="text"
                        required
                        value={formLocation}
                        onChange={e => setFormLocation(e.target.value)}
                        placeholder="e.g. Coimbatore"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Birth Star (Nakshatra)</label>
                      <select
                        value={formNakshatra}
                        onChange={e => setFormNakshatra(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none font-bold text-slate-800"
                      >
                        {NAKSHATRAS.map(n => <option key={n.index} value={n.name}>{n.name} ({n.tamilName})</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Chevvai Dosham</label>
                      <select
                        value={formChevvai}
                        onChange={e => setFormChevvai(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="No">No Chevvai Dosham</option>
                        <option value="Yes">Yes (Dosham Present)</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Education Degree</label>
                      <input
                        type="text"
                        required
                        value={formEducation}
                        onChange={e => setFormEducation(e.target.value)}
                        placeholder="e.g. M.B.A. Finance"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Job Category</label>
                      <select
                        value={formJobType}
                        onChange={e => setFormJobType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="IT & Software">IT & Software</option>
                        <option value="Medical">Medical / Doctor</option>
                        <option value="Business / Entrepreneur">Business / Entrepreneur</option>
                        <option value="Finance">Finance / CA</option>
                        <option value="Government Service">Government Service</option>
                        <option value="Teacher / Professor">Teacher / Professor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Annual Income (Lakhs Rs)</label>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        required
                        value={formIncome}
                        onChange={e => setFormIncome(parseInt(e.target.value) || 10)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none font-bold text-indigo-600"
                      />
                    </div>


                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Introduce Yourself (Bio)</label>
                    <textarea
                      value={formBio}
                      onChange={e => setFormBio(e.target.value)}
                      placeholder="Write a warm introduction explaining career goals and ideal partner expectations..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 h-16 resize-none focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2. Partner Expectations inputs */}
                <div className="space-y-3.5">
                  <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">2. Target Partner Expectations</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Min Age Expected</label>
                      <input
                        type="number"
                        min="18"
                        max="60"
                        required
                        value={formExpMinAge}
                        onChange={e => setFormExpMinAge(parseInt(e.target.value) || 21)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Max Age Expected</label>
                      <input
                        type="number"
                        min="18"
                        max="60"
                        required
                        value={formExpMaxAge}
                        onChange={e => setFormExpMaxAge(parseInt(e.target.value) || 30)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Minimum Income (Lakhs/yr)</label>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        required
                        value={formExpMinIncome}
                        onChange={e => setFormExpMinIncome(parseInt(e.target.value) || 5)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Preferred Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Chennai"
                        value={formExpLocations.join(', ')}
                        onChange={e => setFormExpLocations(e.target.value.split(',').map(s => s.trim()))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      />
                      <p className="text-[9px] text-slate-400 mt-1">Separate multiples with commas.</p>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Preferred Job Categories</label>
                      <input
                        type="text"
                        placeholder="IT & Software, Medical"
                        value={formExpJobTypes.join(', ')}
                        onChange={e => setFormExpJobTypes(e.target.value.split(',').map(s => s.trim()))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Expected Gold (Sovereigns)</label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={formExpGold}
                        onChange={e => setFormExpGold(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Save / Cancel */}
                <div className="border-t border-slate-100 pt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition"
                  >
                    {formMode === 'add' ? 'Register Candidate' : 'Save Modifications'}
                  </button>
                </div>
                
                {/* Whatsapp Confirmations */}
                {whatsappConfirmations.filter(w => !w.sent).length > 0 && (
                   <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <h4 className="font-bold text-emerald-800 text-xs mb-2">Pending WhatsApp Messages</h4>
                      {whatsappConfirmations.filter(w => !w.sent).map((w, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-2 rounded-lg text-[10px] mb-1">
                          <span>{w.message}</span>
                          <button onClick={() => setWhatsappConfirmations(prev => prev.map((item, idx) => idx === i ? {...item, sent: true} : item))} className="bg-emerald-600 text-white px-2 py-1 rounded">Send</button>
                        </div>
                      ))}
                   </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Payment Popup */}
      {isPaymentPopupOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-lg mb-4">Complete Payment</h3>
            <p className="text-xs text-slate-500 mb-6">Select a subscription plan to complete your registration.</p>
            <div className="space-y-3 mb-6">
              <button onClick={handlePaymentSuccess} className="w-full text-left p-3 border rounded-xl font-bold text-sm hover:border-indigo-500">Gold Plan - ₹999</button>
              <button onClick={handlePaymentSuccess} className="w-full text-left p-3 border rounded-xl font-bold text-sm hover:border-indigo-500">Premium Plan - ₹1499</button>
            </div>
            <button onClick={() => setIsPaymentPopupOpen(false)} className="w-full bg-slate-100 text-slate-600 font-bold py-2 rounded-xl">Cancel</button>
          </motion.div>
        </div>
      )}

      {/* MODAL 3: ADD NEW COMMUNITY CONFIG */}
      <AnimatePresence>
        {isNewCommunityOpen && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-bold text-sm text-slate-900">Add Astrological Community</h3>
                <button onClick={() => setIsNewCommunityOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCommunity} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Community Name</label>
                  <input
                    type="text"
                    required
                    value={newCommName}
                    onChange={e => setNewCommName(e.target.value)}
                    placeholder="e.g. Kongu Vellalar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">System Prefix Code</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={newCommCode}
                    onChange={e => setNewCommCode(e.target.value)}
                    placeholder="e.g. KVKN"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Associated Region</label>
                  <input
                    type="text"
                    value={newCommRegion}
                    onChange={e => setNewCommRegion(e.target.value)}
                    placeholder="e.g. Western districts"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewCommunityOpen(false)}
                    className="bg-slate-100 text-slate-700 font-bold px-3 py-2 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl transition"
                  >
                    Add Now
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
