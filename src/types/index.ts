export interface Application {
  id?: string;
  fullName: string;
  age: number;
  phone: string;
  email?: string;
  wilaya: string;
  education: string;
  course: string;
  experience?: string;
  comments?: string;
  registrationType: 'Basic' | 'Full';
  submissionDate: Date;
  paymentMethod?: string;
  agreedToContract?: boolean;
  signature?: string;
  paymentProofUrl?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
}

export interface CourseOption {
  id: string;
  name: string;
  arabicName: string;
  category: 'professional' | 'language';
}

export interface WilayaOption {
  code: string;
  name: string;
}

export interface Workshop {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // in minutes
  instructor: string;
  maxParticipants: number;
  currentParticipants: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
}

export interface WorkshopApplication {
  id?: string;
  workshopId: string;
  workshopTitle: string;
  fullName: string;
  age: number;
  phone: string;
  email?: string;
  wilaya: string;
  education: string;
  experience?: string;
  expectations?: string;
  applicationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Club {
  id?: string;
  name: string;
  arabicName: string;
  description: string;
  imageUrl: string;
  departments: ClubDepartment[];
  isActive: boolean;
  createdAt: Date;
}

export interface ClubDepartment {
  id: string;
  name: string;
  arabicName: string;
  description: string;
}

export interface ClubApplication {
  id?: string;
  clubId: string;
  clubName: string;
  departmentId: string;
  departmentName: string;
  fullName: string;
  age: number;
  phone: string;
  email?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  skills?: string;
  address: string;
  languageLevel: string;
  healthProblems?: string;
  signature: string;
  agreedToContract: boolean;
  applicationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface JobApplication {
  id?: string;
  fullName: string;
  age: number;
  phone: string;
  email: string;
  wilaya: string;
  education: string;
  position: string;
  experience: string;
  skills: string;
  motivation: string;
  cvUrl?: string;
  applicationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface InternApplication {
  id?: string;
  fullName: string;
  age: number;
  phone: string;
  email: string;
  wilaya: string;
  university: string;
  major: string;
  year: string;
  gpa?: string;
  department: string;
  duration: string;
  startDate: string;
  skills: string;
  projects?: string;
  motivation: string;
  availability: string;
  applicationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}