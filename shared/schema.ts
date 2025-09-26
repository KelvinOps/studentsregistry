// shared/schema.ts - Fixed schema with proper Zod validation
import { z } from 'zod';

// Enums
export const StudentType = z.enum(['KUCCPS', 'SELF_SPONSORED']);
export const Gender = z.enum(['Male', 'Female']);
export const ExamStatus = z.enum(['DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED']);
export const RegistrationStatus = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'WAITLISTED']);
export const HolidayStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW']);
export const PriorityLevel = z.enum(['Normal', 'Urgent', 'Emergency']);
export const UserRole = z.enum(['STUDENT', 'ADMIN', 'STAFF', 'SUPER_ADMIN']);

// Base schemas with validation
export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email().nullable(),
  firstName: z.string().min(1, 'First name is required').nullable(),
  lastName: z.string().min(1, 'Last name is required').nullable(),
  profileImageUrl: z.string().url().nullable(),
  role: UserRole.nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const DepartmentSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, 'Department name is required'),
  description: z.string().nullable(),
  createdAt: z.date().nullable(),
});

export const AcademicSessionSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, 'Session name is required'),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean().nullable(),
  createdAt: z.date().nullable(),
});

export const StudentSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid().nullable(),
  studentNo: z.string().min(1, 'Student number is required'),
  studentName: z.string().min(1, 'Student name is required'),
  studentType: StudentType,
  birthCertNo: z.string().min(1, 'Birth certificate number is required'),
  birthDate: z.date(),
  county: z.string().min(1, 'County is required'),
  subCounty: z.string().min(1, 'Sub-county is required'),
  gender: Gender,
  nationality: z.string().min(1, 'Nationality is required'),
  phoneNumber: z.string().regex(/^[\+]?[0-9\-\(\)\s]+$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  class: z.string().min(1, 'Class is required'),
  session: z.string().min(1, 'Session is required'),
  programme: z.string().min(1, 'Programme is required'),
  departmentId: z.string().cuid().nullable(),
  kcpeIndex: z.string().nullable(),
  kcseIndex: z.string().nullable(),
  previousInstitution: z.string().nullable(),
  documents: z.any().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const ExamSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, 'Exam title is required'),
  courseCode: z.string().min(1, 'Course code is required'),
  description: z.string().nullable(),
  examType: z.string().min(1, 'Exam type is required'),
  departmentId: z.string().cuid().nullable(),
  sessionId: z.string().cuid().nullable(),
  examDate: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  room: z.string().nullable(),
  maxCapacity: z.number().positive().nullable(),
  registrationDeadline: z.date(),
  registrationFee: z.number().nonnegative().nullable(),
  status: ExamStatus.nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const ExamRegistrationSchema = z.object({
  id: z.string().cuid(),
  studentId: z.string().cuid().nullable(),
  examId: z.string().cuid(),
  status: RegistrationStatus.nullable(),
  registeredAt: z.date().nullable(),
  paymentStatus: z.string().nullable(),
  notes: z.string().nullable(),
});

// Fixed HolidayReportSchema - this is where the error was
export const HolidayReportSchema = z.object({
  id: z.string().cuid(),
  studentId: z.string().cuid().nullable(),
  holidayType: z.string().min(1, 'Holiday type is required'),
  priorityLevel: PriorityLevel.nullable(),
  startDate: z.date(),
  expectedReturnDate: z.date(),
  destination: z.string().min(1, 'Destination is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  emergencyContactName: z.string().nullable(),
  emergencyContactPhone: z.string().regex(/^[\+]?[0-9\-\(\)\s]+$/, 'Invalid phone number').nullable(),
  supportingDocuments: z.any().nullable(),
  status: HolidayStatus.nullable(),
  submittedAt: z.date().nullable(),
  reviewedAt: z.date().nullable(),
  reviewedBy: z.string().cuid().nullable(),
  reviewComments: z.string().nullable(), // Fixed: was reviewNotes, should be reviewComments
});

// Form validation schemas - THESE WERE THE PROBLEMATIC ONES
export const StudentRegistrationFormSchema = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  studentNo: z.string().min(1, 'Student number is required'),
  studentType: StudentType,
  birthCertNo: z.string().min(1, 'Birth certificate number is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  county: z.string().min(1, 'County is required'),
  subCounty: z.string().min(1, 'Sub-county is required'),
  gender: Gender,
  nationality: z.string().min(1, 'Nationality is required'),
  phoneNumber: z.string().regex(/^[\+]?[0-9\-\(\)\s]+$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  class: z.string().min(1, 'Class is required'),
  session: z.string().min(1, 'Session is required'),
  programme: z.string().min(1, 'Programme is required'),
  departmentId: z.string().min(1, 'Department is required'),
  kcpeIndex: z.string().optional(),
  kcseIndex: z.string().optional(),
  previousInstitution: z.string().optional(),
}).refine((data) => {
  const birthDate = new Date(data.birthDate);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age >= 16 && age <= 35;
}, {
  message: 'Age must be between 16 and 35 years',
  path: ['birthDate'],
});

export const ExamCreationFormSchema = z.object({
  title: z.string().min(1, 'Exam title is required'),
  courseCode: z.string().min(1, 'Course code is required'),
  description: z.string().optional(),
  examType: z.string().min(1, 'Exam type is required'),
  departmentId: z.string().min(1, 'Department is required'),
  sessionId: z.string().min(1, 'Session is required'),
  examDate: z.string().min(1, 'Exam date is required'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  room: z.string().optional(),
  maxCapacity: z.number().positive().optional(),
  registrationDeadline: z.string().min(1, 'Registration deadline is required'),
  registrationFee: z.number().nonnegative().optional(),
}).refine((data) => {
  const startTime = data.startTime;
  const endTime = data.endTime;
  return startTime < endTime;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
}).refine((data) => {
  const examDate = new Date(data.examDate);
  const deadline = new Date(data.registrationDeadline);
  return deadline < examDate;
}, {
  message: 'Registration deadline must be before exam date',
  path: ['registrationDeadline'],
});

// Fixed HolidayReportFormSchema - removed the problematic required_error usage
export const HolidayReportFormSchema = z.object({
  holidayType: z.string().min(1, 'Holiday type is required'),
  priorityLevel: PriorityLevel.default('Normal'),
  startDate: z.string().min(1, 'Start date is required'),
  expectedReturnDate: z.string().min(1, 'Expected return date is required'),
  destination: z.string().min(1, 'Destination is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().regex(/^[\+]?[0-9\-\(\)\s]+$/, 'Invalid phone number').optional(),
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.expectedReturnDate);
  return startDate < endDate;
}, {
  message: 'Expected return date must be after start date',
  path: ['expectedReturnDate'],
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const today = new Date();
  return startDate >= today;
}, {
  message: 'Start date cannot be in the past',
  path: ['startDate'],
});

// For INSERT operations - separate from the main schema
export const InsertHolidayReportSchema = z.object({
  studentId: z.string().cuid().optional(),
  holidayType: z.string().min(1, 'Holiday type is required'),
  priorityLevel: PriorityLevel.default('Normal'),
  startDate: z.date(),
  expectedReturnDate: z.date(),
  destination: z.string().min(1, 'Destination is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().regex(/^[\+]?[0-9\-\(\)\s]+$/, 'Invalid phone number').optional(),
}).refine((data) => {
  return data.expectedReturnDate > data.startDate;
}, {
  message: 'Expected return date must be after start date',
  path: ['expectedReturnDate'],
});

// API response schemas
export const ApiResponseSchema = z.object({
  data: z.any(),
  success: z.boolean(),
  message: z.string().optional(),
  errors: z.array(z.string()).optional(),
});

export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number().positive(),
    limit: z.number().positive(),
    total: z.number().nonnegative(),
    totalPages: z.number().nonnegative(),
  }),
});

// Filter schemas
export const ExamFiltersSchema = z.object({
  department: z.string().optional(),
  session: z.string().optional(),
  examType: z.string().optional(),
  q: z.string().optional(),
  status: ExamStatus.optional(),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
});

export const StudentFiltersSchema = z.object({
  department: z.string().optional(),
  class: z.string().optional(),
  session: z.string().optional(),
  studentType: StudentType.optional(),
  q: z.string().optional(),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
});

export const HolidayReportFiltersSchema = z.object({
  status: HolidayStatus.optional(),
  priorityLevel: PriorityLevel.optional(),
  holidayType: z.string().optional(),
  studentId: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
});

// Type exports (inferred from schemas)
export type User = z.infer<typeof UserSchema>;
export type Department = z.infer<typeof DepartmentSchema>;
export type AcademicSession = z.infer<typeof AcademicSessionSchema>;
export type Student = z.infer<typeof StudentSchema>;
export type Exam = z.infer<typeof ExamSchema>;
export type ExamRegistration = z.infer<typeof ExamRegistrationSchema>;
export type HolidayReport = z.infer<typeof HolidayReportSchema>;
export type InsertHolidayReport = z.infer<typeof InsertHolidayReportSchema>;

// Form types
export type StudentRegistrationForm = z.infer<typeof StudentRegistrationFormSchema>;
export type ExamCreationForm = z.infer<typeof ExamCreationFormSchema>;
export type HolidayReportForm = z.infer<typeof HolidayReportFormSchema>;

// Extended types with relations
export interface StudentWithRelations extends Student {
  user?: User | null;
  department?: Department | null;
  examRegistrations?: ExamRegistrationWithRelations[];
  holidayReports?: HolidayReportWithRelations[];
  _count?: {
    examRegistrations: number;
    holidayReports: number;
  };
}

export interface ExamWithRelations extends Exam {
  department?: Department | null;
  session?: AcademicSession | null;
  registrations?: ExamRegistrationWithRelations[];
  _count?: {
    registrations: number;
  };
}

export interface ExamRegistrationWithRelations extends ExamRegistration {
  student?: StudentWithRelations | null;
  exam?: ExamWithRelations | null;
}

export interface HolidayReportWithRelations extends HolidayReport {
  student?: StudentWithRelations | null;
  reviewer?: User | null;
}

// Filter types
export type ExamFilters = z.infer<typeof ExamFiltersSchema>;
export type StudentFilters = z.infer<typeof StudentFiltersSchema>;
export type HolidayReportFilters = z.infer<typeof HolidayReportFiltersSchema>;

// API Response types
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Utility type for handling database operations
export type DatabaseResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Constants for UI
export const STUDENT_TYPES = [
  { value: 'KUCCPS', label: 'KUCCPS' },
  { value: 'SELF_SPONSORED', label: 'Self Sponsored' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
] as const;

export const PRIORITY_LEVELS = [
  { value: 'Normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
  { value: 'Urgent', label: 'Urgent', color: 'bg-orange-100 text-orange-800' },
  { value: 'Emergency', label: 'Emergency', color: 'bg-red-100 text-red-800' },
] as const;

export const HOLIDAY_TYPES = [
  'Medical Leave',
  'Family Emergency',
  'Personal Leave',
  'Academic Break',
  'Religious Holiday',
  'Other',
] as const;

export const EXAM_TYPES = [
  'Final Exam',
  'Mid-term Exam',
  'Quiz',
  'Practical Exam',
  'Oral Exam',
  'Project Defense',
] as const;