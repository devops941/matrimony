export interface ProfileExpectations {
  minAge: number;
  maxAge: number;
  acceptedCommunities: string[];
  acceptedJobTypes: string[];
  minAnnualIncomeLakhs: number;
  acceptedLocations: string[];
  goldExpectedSovereigns?: number;
  houseOwnedRequired?: boolean;
}

export interface Profile {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  height: string;
  location: string;
  community: string;
  nakshatra: string;
  rasi: string;
  education: string;
  jobType: string;
  annualIncomeLakhs: number;
  bio: string;
  avatarUrl: string;
  chevvaiDosham: 'Yes' | 'No' | 'Unknown';
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  expectations: ProfileExpectations;
  approvedByAdmin?: boolean; // Admin approval toggle
  confirmedMatchedWith?: string; // Target profile ID if matched and confirmed
}

export interface MatchRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  sentAt: string;
}

export interface CommunityInfo {
  id: string;
  name: string;
  franchiseCount: number;
  profileCount: number;
  region: string;
  code: string;
}

export interface EmployeePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  viewAttendance: boolean;
  editAttendance: boolean;
  deleteAttendance: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string; // Stored simply for this local demo auth
  role: 'Admin' | 'Employee';
  permissions: EmployeePermissions;
  avatarUrl?: string;
  designation: string;
  phone: string;
  joinedDate: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'On Leave' | 'Half Day';
  clockIn?: string; // HH:MM AM/PM
  clockOut?: string; // HH:MM AM/PM
  notes?: string;
}

export interface CompanyProfile {
  companyName: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  city: string;
  gstNumber: string;
  incorporationDetails: string;
  brochureImageUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  category: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  date: string;
  status: 'Approved' | 'Pending';
}

export interface Testimonial {
  id: string;
  coupleName: string;
  weddingDate: string;
  story: string;
  imageUrl: string;
  rating: number;
}


