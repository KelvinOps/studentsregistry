// lib/types.ts - Type definitions based on your database schema

export type StudentType = 'KUCCPS' | 'SELF_SPONSORED';
export type Gender = 'Male' | 'Female';
export type ExamStatus = 'DRAFT' | 'PUBLISHED' | 'COMPLETED';
export type RegistrationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type HolidayStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type PriorityLevel = 'Normal' | 'Urgent' | 'Emergency';

export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Department {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date | null;
}

export interface AcademicSession {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean | null;
  createdAt: Date | null;
}

export interface Student {
  id: string;
  userId: string | null;
  studentNo: string;
  studentName: string;
  studentType: StudentType;
  birthCertNo: string;
  birthDate: Date;
  county: string;
  subCounty: string;
  gender: Gender;
  nationality: string;
  phoneNumber: string;
  email: string;
  class: string;
  session: string;
  programme: string;
  departmentId: string | null;
  kcpeIndex: string | null;
  kcseIndex: string | null;
  previousInstitution: string | null;
  documents: any | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Exam {
  id: string;
  title: string;
  courseCode: string;
  description: string | null;
  examType: string;
  departmentId: string | null;
  sessionId: string | null;
  examDate: Date;
  startTime: string;
  endTime: string;
  room: string | null;
  maxCapacity: number | null;
  registrationDeadline: Date;
  registrationFee: number | null;
  status: ExamStatus | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ExamRegistration {
  id: string;
  studentId: string | null;
  examId: string;
  status: RegistrationStatus | null;
  registeredAt: Date | null;
  paymentStatus: string | null;
}

export interface HolidayReport {
  id: string;
  studentId: string | null;
  holidayType: string;
  priorityLevel: PriorityLevel | null;
  startDate: Date;
  expectedReturnDate: Date;
  destination: string;
  reason: string;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  supportingDocuments: any | null;
  status: HolidayStatus | null;
  submittedAt: Date | null;
  reviewedAt: Date | null;
  reviewedBy: string | null;
}

// Insert types for forms
export interface InsertStudent {
  userId?: string;
  studentNo: string;
  studentName: string;
  studentType: StudentType;
  birthCertNo: string;
  birthDate: Date;
  county: string;
  subCounty: string;
  gender: Gender;
  nationality: string;
  phoneNumber: string;
  email: string;
  class: string;
  session: string;
  programme: string;
  departmentId?: string;
  kcpeIndex?: string;
  kcseIndex?: string;
  previousInstitution?: string;
  documents?: any;
}

export interface InsertDepartment {
  name: string;
  description?: string;
}

export interface InsertAcademicSession {
  name: string;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
}

export interface InsertExam {
  title: string;
  courseCode: string;
  description?: string;
  examType: string;
  departmentId?: string;
  sessionId?: string;
  examDate: Date;
  startTime: string;
  endTime: string;
  room?: string;
  maxCapacity?: number;
  registrationDeadline: Date;
  registrationFee?: number;
  status?: ExamStatus;
}

export interface InsertExamRegistration {
  studentId?: string;
  examId: string;
  status?: RegistrationStatus;
  paymentStatus?: string;
}

export interface InsertHolidayReport {
  studentId?: string;
  holidayType: string;
  priorityLevel?: PriorityLevel;
  startDate: Date;
  expectedReturnDate: Date;
  destination: string;
  reason: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  supportingDocuments?: any;
  status?: HolidayStatus;
  reviewedBy?: string;
}

// Extended types with relations
export interface StudentWithRelations extends Student {
  user?: User;
  department?: Department;
  examRegistrations?: ExamRegistration[];
  holidayReports?: HolidayReport[];
}

export interface ExamWithRelations extends Exam {
  department?: Department;
  session?: AcademicSession;
  registrations?: ExamRegistration[];
  registrationCount?: number;
}

export interface ExamRegistrationWithRelations extends ExamRegistration {
  student?: Student;
  exam?: Exam;
}

export interface HolidayReportWithRelations extends HolidayReport {
  student?: Student;
  reviewer?: User;
}