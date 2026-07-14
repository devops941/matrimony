import { Profile } from './types';

export const INITIAL_PROFILES: Profile[] = [
  // MALES
  {
    id: "M1",
    name: "Karthik Subramanian",
    gender: "Male",
    age: 28,
    height: "5 ft 10 in",
    location: "Chennai",
    community: "Kongu Vellalar",
    nakshatra: "Ashwini",
    rasi: "Aries",
    education: "M.S. in Computer Science",
    jobType: "IT & Software",
    annualIncomeLakhs: 24,
    bio: "Passionate software engineer working for a leading multinational firm in Chennai. Avid reader, loves carnatic music, and practices yoga daily. Seeking a bride who values family traditions while pursuing her own professional ambitions.",
    avatarUrl: "male_1",
    chevvaiDosham: "No",
    birthDate: "1998-04-12",
    birthTime: "06:15 AM",
    birthPlace: "Coimbatore",
    expectations: {
      minAge: 23,
      maxAge: 27,
      acceptedCommunities: ["Kongu Vellalar", "Mudaliar", "Chettiar"],
      acceptedJobTypes: ["IT & Software", "Medical", "Finance", "Teacher / Professor"],
      minAnnualIncomeLakhs: 6,
      acceptedLocations: ["Chennai", "Coimbatore", "Bangalore"],
      goldExpectedSovereigns: 40,
      houseOwnedRequired: false
    }
  },
  {
    id: "M2",
    name: "Dr. Arvind Swaminathan",
    gender: "Male",
    age: 31,
    height: "5 ft 11 in",
    location: "Coimbatore",
    community: "Iyer",
    nakshatra: "Pushya",
    rasi: "Cancer",
    education: "M.D. Pediatrics",
    jobType: "Medical",
    annualIncomeLakhs: 18,
    bio: "Pediatrician practicing at a premier hospital in Coimbatore. Passionate about medical research and volunteering for rural child wellness programs. Belongs to a simple, traditional family. Seeking a life partner who is compassionate and warm.",
    avatarUrl: "male_2",
    chevvaiDosham: "Yes",
    birthDate: "1995-07-24",
    birthTime: "11:45 AM",
    birthPlace: "Madurai",
    expectations: {
      minAge: 25,
      maxAge: 30,
      acceptedCommunities: ["Iyer", "Iyengar"],
      acceptedJobTypes: ["Medical", "IT & Software", "Finance", "Teacher / Professor"],
      minAnnualIncomeLakhs: 8,
      acceptedLocations: ["Coimbatore", "Chennai", "Madurai", "Bangalore"],
      goldExpectedSovereigns: 50,
      houseOwnedRequired: false
    }
  },
  {
    id: "M3",
    name: "Vijay Ananth",
    gender: "Male",
    age: 30,
    height: "5 ft 9 in",
    location: "Bangalore",
    community: "Mudaliar",
    nakshatra: "Uttara Phalguni",
    rasi: "Virgo",
    education: "B.Tech + M.B.A. (IIM Bangalore)",
    jobType: "Business / Entrepreneur",
    annualIncomeLakhs: 35,
    bio: "Founder of an agri-tech startup based in Bangalore. Enthusiastic about travel, organic farming, and visual arts. Looking for a partner who is entrepreneurial-minded, positive, and ready to share life's adventures.",
    avatarUrl: "male_3",
    chevvaiDosham: "No",
    birthDate: "1996-09-15",
    birthTime: "04:30 PM",
    birthPlace: "Salem",
    expectations: {
      minAge: 24,
      maxAge: 29,
      acceptedCommunities: ["Mudaliar", "Kongu Vellalar", "Chettiar", "Any Community"],
      acceptedJobTypes: ["Business / Entrepreneur", "IT & Software", "Finance", "Medical"],
      minAnnualIncomeLakhs: 12,
      acceptedLocations: ["Bangalore", "Chennai", "Coimbatore"],
      goldExpectedSovereigns: 30,
      houseOwnedRequired: false
    }
  },
  {
    id: "M4",
    name: "Balaji Ramakrishnan",
    gender: "Male",
    age: 29,
    height: "5 ft 8 in",
    location: "Madurai",
    community: "Chettiar",
    nakshatra: "Hasta",
    rasi: "Virgo",
    education: "Chartered Accountant (ACA)",
    jobType: "Finance",
    annualIncomeLakhs: 20,
    bio: "Senior financial consultant at an international audit firm in Madurai. Belongs to a highly respected, large family. Love photography and heritage walks. Looking for a partner with strong ethical values, preferably with a finance or corporate background.",
    avatarUrl: "male_4",
    chevvaiDosham: "No",
    birthDate: "1997-05-18",
    birthTime: "08:12 AM",
    birthPlace: "Karaikudi",
    expectations: {
      minAge: 24,
      maxAge: 28,
      acceptedCommunities: ["Chettiar", "Iyer", "Mudaliar"],
      acceptedJobTypes: ["Finance", "IT & Software", "Teacher / Professor"],
      minAnnualIncomeLakhs: 6,
      acceptedLocations: ["Madurai", "Chennai", "Trichy"],
      goldExpectedSovereigns: 60,
      houseOwnedRequired: true
    }
  },
  {
    id: "M5",
    name: "Suresh Pandian",
    gender: "Male",
    age: 32,
    height: "5 ft 7 in",
    location: "Trichy",
    community: "Adidravidar",
    nakshatra: "Anuradha",
    rasi: "Scorpio",
    education: "M.Tech in Structural Engineering",
    jobType: "Government Service",
    annualIncomeLakhs: 15,
    bio: "Assistant Executive Engineer in the Public Works Department, Government of Tamil Nadu. Resides in Trichy in a well-built owned house. Highly responsible, family-oriented, and loves reading ancient historical literature. Seeking an educated, caring companion.",
    avatarUrl: "male_5",
    chevvaiDosham: "No",
    birthDate: "1994-11-20",
    birthTime: "02:40 AM",
    birthPlace: "Tanjore",
    expectations: {
      minAge: 24,
      maxAge: 30,
      acceptedCommunities: ["Adidravidar", "Any Community"],
      acceptedJobTypes: ["Government Service", "Teacher / Professor", "IT & Software", "Medical", "Finance"],
      minAnnualIncomeLakhs: 4,
      acceptedLocations: ["Trichy", "Tanjore", "Madurai", "Chennai"],
      goldExpectedSovereigns: 25,
      houseOwnedRequired: false
    }
  },

  // FEMALES
  {
    id: "F1",
    name: "Priya Balasubramaniam",
    gender: "Female",
    age: 26,
    height: "5 ft 5 in",
    location: "Chennai",
    community: "Kongu Vellalar",
    nakshatra: "Rohini",
    rasi: "Taurus",
    education: "M.Tech in Data Science",
    jobType: "IT & Software",
    annualIncomeLakhs: 16,
    bio: "Data Scientist working for a leading AI startup in Chennai. Energetic, optimistic, and enjoys painting and modern art. Family oriented with strong moral values. Seeking a well-qualified groom from a matching community with progressive views.",
    avatarUrl: "female_1",
    chevvaiDosham: "No",
    birthDate: "2000-05-15",
    birthTime: "09:30 AM",
    birthPlace: "Erode",
    expectations: {
      minAge: 27,
      maxAge: 31,
      acceptedCommunities: ["Kongu Vellalar", "Mudaliar"],
      acceptedJobTypes: ["IT & Software", "Business / Entrepreneur", "Finance", "Medical"],
      minAnnualIncomeLakhs: 15,
      acceptedLocations: ["Chennai", "Coimbatore", "Bangalore"],
      goldExpectedSovereigns: 40,
      houseOwnedRequired: false
    }
  },
  {
    id: "F2",
    name: "Deepa Ramaswamy",
    gender: "Female",
    age: 27,
    height: "5 ft 4 in",
    location: "Coimbatore",
    community: "Iyer",
    nakshatra: "Ardra",
    rasi: "Gemini",
    education: "M.S. in Biotechnology",
    jobType: "Medical",
    annualIncomeLakhs: 12,
    bio: "Research Scientist at an international pharmaceutical laboratory in Coimbatore. Trained Bharatanatyam dancer and food blogger. Seeking a well-settled groom, preferably a doctor or researcher, who respects independent choices and family harmony.",
    avatarUrl: "female_2",
    chevvaiDosham: "Yes",
    birthDate: "1999-06-22",
    birthTime: "03:10 PM",
    birthPlace: "Chennai",
    expectations: {
      minAge: 28,
      maxAge: 33,
      acceptedCommunities: ["Iyer", "Iyengar"],
      acceptedJobTypes: ["Medical", "IT & Software", "Business / Entrepreneur"],
      minAnnualIncomeLakhs: 15,
      acceptedLocations: ["Coimbatore", "Chennai", "Bangalore"],
      goldExpectedSovereigns: 50,
      houseOwnedRequired: false
    }
  },
  {
    id: "F3",
    name: "Meenakshi Sundaram",
    gender: "Female",
    age: 28,
    height: "5 ft 6 in",
    location: "Bangalore",
    community: "Chettiar",
    nakshatra: "Vishakha",
    rasi: "Scorpio",
    education: "M.B.A. in Finance",
    jobType: "Finance",
    annualIncomeLakhs: 18,
    bio: "Investment banker in Bangalore. Comes from a warm, traditional Chettiar background in Karaikudi. Enthusiastic about South Indian heritage architecture and trekking. Seeking an ambitious partner who is grounded and shares a love for travel.",
    avatarUrl: "female_3",
    chevvaiDosham: "No",
    birthDate: "1998-10-18",
    birthTime: "01:25 AM",
    birthPlace: "Karaikudi",
    expectations: {
      minAge: 28,
      maxAge: 32,
      acceptedCommunities: ["Chettiar", "Mudaliar", "Kongu Vellalar"],
      acceptedJobTypes: ["Finance", "Business / Entrepreneur", "IT & Software"],
      minAnnualIncomeLakhs: 18,
      acceptedLocations: ["Bangalore", "Chennai", "Coimbatore"],
      goldExpectedSovereigns: 60,
      houseOwnedRequired: true
    }
  },
  {
    id: "F4",
    name: "Soundarya Mudaliar",
    gender: "Female",
    age: 25,
    height: "5 ft 3 in",
    location: "Salem",
    community: "Mudaliar",
    nakshatra: "Swati",
    rasi: "Libra",
    education: "M.Sc. in Physics & B.Ed.",
    jobType: "Teacher / Professor",
    annualIncomeLakhs: 8,
    bio: "Physics lecturer at a highly rated junior college in Salem. Enjoys playing Veena and preparing traditional South Indian sweets. Family values are very important. Looking for a decent, well-settled life partner who has warm and loving perspectives.",
    avatarUrl: "female_4",
    chevvaiDosham: "No",
    birthDate: "2001-11-04",
    birthTime: "11:50 PM",
    birthPlace: "Salem",
    expectations: {
      minAge: 27,
      maxAge: 31,
      acceptedCommunities: ["Mudaliar", "Kongu Vellalar", "Chettiar"],
      acceptedJobTypes: ["Teacher / Professor", "Government Service", "IT & Software", "Finance", "Medical"],
      minAnnualIncomeLakhs: 10,
      acceptedLocations: ["Salem", "Coimbatore", "Bangalore", "Chennai"],
      goldExpectedSovereigns: 30,
      houseOwnedRequired: false
    }
  },
  {
    id: "F5",
    name: "Dr. Kausalya Devandran",
    gender: "Female",
    age: 29,
    height: "5 ft 5 in",
    location: "Trichy",
    community: "Adidravidar",
    nakshatra: "Revati",
    rasi: "Pisces",
    education: "M.B.B.S. & D.G.O. (Gynecologist)",
    jobType: "Medical",
    annualIncomeLakhs: 15,
    bio: "Consultant gynecologist at a private hospital in Trichy. Hardworking, patient, and family-oriented. Belongs to a highly educated academic family. Seeking a clean-habited, educated partner from a decent background.",
    avatarUrl: "female_5",
    chevvaiDosham: "No",
    birthDate: "1997-03-29",
    birthTime: "05:10 PM",
    birthPlace: "Tanjore",
    expectations: {
      minAge: 29,
      maxAge: 34,
      acceptedCommunities: ["Adidravidar", "Any Community"],
      acceptedJobTypes: ["Medical", "Government Service", "IT & Software", "Finance", "Business / Entrepreneur"],
      minAnnualIncomeLakhs: 12,
      acceptedLocations: ["Trichy", "Tanjore", "Madurai", "Chennai"],
      goldExpectedSovereigns: 25,
      houseOwnedRequired: false
    }
  }
];

export const INITIAL_REQUESTS = [
  { id: "req-1", senderId: "M1", receiverId: "F1", status: "Pending", sentAt: "2026-06-25T10:00:00.000Z" },
  { id: "req-2", senderId: "F2", receiverId: "M2", status: "Accepted", sentAt: "2026-06-24T14:30:00.000Z" },
  { id: "req-3", senderId: "M3", receiverId: "F3", status: "Pending", sentAt: "2026-06-26T18:15:00.000Z" }
];

export const INITIAL_EMPLOYEES = [
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
    joinedDate: "2024-01-15"
  },
  {
    id: "emp-2",
    name: "Priya Lakshmi",
    email: "priya@manappandal.com",
    username: "priya",
    password: "password",
    role: "Employee",
    permissions: { view: true, create: true, edit: true, delete: false },
    avatarUrl: "female_1",
    designation: "Senior Operations Executive",
    phone: "9876543211",
    joinedDate: "2024-06-01"
  },
  {
    id: "emp-3",
    name: "Rahul Kumar",
    email: "rahul@manappandal.com",
    username: "rahul",
    password: "password",
    role: "Employee",
    permissions: { view: true, create: false, edit: false, delete: false },
    avatarUrl: "male_2",
    designation: "Customer Care Executive",
    phone: "9876543212",
    joinedDate: "2025-02-10"
  },
  {
    id: "emp-4",
    name: "Anjali Devi",
    email: "anjali@manappandal.com",
    username: "anjali",
    password: "password",
    role: "Employee",
    permissions: { view: true, create: true, edit: false, delete: false },
    avatarUrl: "female_2",
    designation: "Data Entry Operator",
    phone: "9876543213",
    joinedDate: "2025-05-20"
  }
];

export const INITIAL_ATTENDANCE = [
  { id: "att-1", employeeId: "emp-1", date: "2026-06-27", status: "Present", clockIn: "09:00 AM", clockOut: "05:30 PM", notes: "Regular daily work" },
  { id: "att-2", employeeId: "emp-2", date: "2026-06-27", status: "Present", clockIn: "09:15 AM", clockOut: "05:45 PM", notes: "Completed profile validation" },
  { id: "att-3", employeeId: "emp-3", date: "2026-06-27", status: "Present", clockIn: "08:55 AM", clockOut: "05:10 PM", notes: "Addressed 12 client requests" },
  { id: "att-4", employeeId: "emp-4", date: "2026-06-27", status: "On Leave", notes: "Casual leave approved" },
  { id: "att-5", employeeId: "emp-1", date: "2026-06-28", status: "Present", clockIn: "08:45 AM", notes: "Morning briefing" },
  { id: "att-6", employeeId: "emp-2", date: "2026-06-28", status: "Present", clockIn: "09:05 AM", notes: "Working on matches" },
  { id: "att-7", employeeId: "emp-3", date: "2026-06-28", status: "Absent", notes: "Uninformed absence" }
];


export const INITIAL_GALLERY = [
  {
    id: "g1",
    title: "Franchise Launch Ceremony",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600",
    description: "Inauguration of the Kongu Region flagship branch with community elders and delegates.",
    category: "Events"
  },
  {
    id: "g2",
    title: "Annual Elite Bride & Groom Meet",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
    description: "Our community matchmaking meet, where families interact directly in a respectable ambience.",
    category: "Events"
  },
  {
    id: "g3",
    title: "Coimbatore Operations Desk",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
    description: "Our highly trained staff sorting physical horoscopes with verified community credentials.",
    category: "Franchise"
  },
  {
    id: "g4",
    title: "Horoscope Verification Center",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    description: "Rigorous manual background verification and Astrological alignment mapping desk.",
    category: "Franchise"
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    customerName: "Rangasamy Gowder",
    rating: 5,
    reviewText: "Highly professional service. They verified the horoscope matching thoroughly before recommending. My daughter's wedding got fixed through them.",
    date: "2026-06-15",
    status: "Approved"
  },
  {
    id: "rev-2",
    customerName: "Saraswathi Ammal",
    rating: 5,
    reviewText: "The franchise manager Priya was very patient. She guided us through Chevvai Dosham calculations and arranged 3 family meetings.",
    date: "2026-06-20",
    status: "Approved"
  },
  {
    id: "rev-3",
    customerName: "Balachandran CA",
    rating: 4,
    reviewText: "Smooth experience. Best portal for Kongu Vellalar and Iyer communities. Handled everything with extreme respect and confidentiality.",
    date: "2026-06-24",
    status: "Approved"
  }
];

export const INITIAL_TESTIMONIALS = [
  {
    id: "test-1",
    coupleName: "Karthik & Priya",
    weddingDate: "2025-11-23",
    story: "We met through Manappandal Matrimony. Karthik's Rasi and Priya's Nakshatra had 9 out of 10 Porutham match (Uthama Porutham). Our families clicked instantly in our first meet at Coimbatore Office. Today we are happily married!",
    imageUrl: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=600",
    rating: 5
  },
  {
    id: "test-2",
    coupleName: "Arvind & Sneha",
    weddingDate: "2026-01-18",
    story: "Finding a medical match with compatible horoscope alignments was very hard until we registered at this portal. The service is fast, trustworthy and their database is fully verified.",
    imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600",
    rating: 5
  }
];


