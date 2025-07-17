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