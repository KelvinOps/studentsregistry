'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check, Upload, IdCard, Award, FileText, User, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Local types
interface Department {
  id: string;
  name: string;
}

interface Session {
  id: string;
  name: string;
}

interface RegistrationData {
  studentName: string;
  birthDate: string;
  gender: string;
  nationality: string;
  phoneNumber: string;
  email: string;
  county: string;
  subCounty: string;
  birthCertNo: string;
  studentType: string;
  departmentId: string;
  programme: string;
  class: string;
  session: string;
  kcpeIndex?: string;
  kcseIndex?: string;
  previousInstitution?: string;
  documents?: Record<string, File>;
}

// Validation schemas with improved error handling
const personalInfoSchema = z.object({
  studentName: z.string().min(2, "Full name must be at least 2 characters"),
  birthDate: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female"]).refine(
    (val) => val !== undefined,
    "Please select a gender"
  ),
  nationality: z.string().min(1, "Nationality is required"),
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  county: z.string().min(1, "County is required"),
  subCounty: z.string().min(1, "Sub-county is required"),
  birthCertNo: z.string().min(1, "Birth certificate number is required"),
});

const academicInfoSchema = z.object({
  studentType: z.enum(["KUCCPS", "SELF_SPONSORED"]).refine(
    (val) => val !== undefined,
    "Please select a student type"
  ),
  departmentId: z.string().min(1, "Department is required"),
  programme: z.string().min(1, "Programme is required"),
  class: z.string().min(1, "Class is required"),
  session: z.string().min(1, "Academic session is required"),
  kcpeIndex: z.string().optional(),
  kcseIndex: z.string().optional(),
  previousInstitution: z.string().optional(),
});

// Fixed document schema with proper file validation
const documentSchema = z.object({
  birthCertificate: z.any().optional(),
  kcseCertificate: z.any().optional(),
  transcripts: z.any().optional(),
  passportPhoto: z.any().refine(
    (file) => file instanceof File,
    "Passport photo is required"
  ),
});

type PersonalInfo = z.infer<typeof personalInfoSchema>;
type AcademicInfo = z.infer<typeof academicInfoSchema>;
type DocumentInfo = z.infer<typeof documentSchema>;

// Improved file upload component with better error handling
function FileUpload({ 
  onFileChange, 
  accept, 
  maxSize, 
  required = false,
  'data-testid': testId 
}: {
  onFileChange: (file: File | null) => void;
  accept: string;
  maxSize: number;
  required?: boolean;
  'data-testid'?: string;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    // Check file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return false;
    }
    
    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;
    
    const isValidType = allowedTypes.some(type => 
      type === fileExtension || 
      type === mimeType ||
      (type.startsWith('.') && fileExtension === type)
    );
    
    if (!isValidType) {
      setError(`File must be one of: ${allowedTypes.join(', ')}`);
      return false;
    }
    
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileName(null);
      onFileChange(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? 'border-blue-400 bg-blue-50' : 
          error ? 'border-red-300 bg-red-50' :
          fileName ? 'border-green-300 bg-green-50' :
          'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          data-testid={testId}
        />
        <div className="space-y-2">
          <Upload className={`h-8 w-8 mx-auto ${
            error ? 'text-red-400' : 
            fileName ? 'text-green-400' : 
            'text-gray-400'
          }`} />
          {fileName ? (
            <p className="text-sm font-medium text-green-600">{fileName}</p>
          ) : (
            <p className="text-sm text-gray-600">
              Drop file here or click to upload
            </p>
          )}
          <p className="text-xs text-gray-500">
            {accept.toUpperCase()} • Max {Math.round(maxSize / 1024 / 1024)}MB
            {required && <span className="text-red-500"> *</span>}
          </p>
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Multi-step form component with better navigation
function MultiStepForm({ 
  steps, 
  currentStep 
}: {
  steps: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    component: React.ReactNode;
  }>;
  currentStep: number;
}) {
  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                index <= currentStep 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 transition-colors ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600 mt-1">
            {steps[currentStep].description}
          </p>
        </div>
        {steps[currentStep].component}
      </div>
    </div>
  );
}

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  
  const [personalData, setPersonalData] = useState<PersonalInfo | null>(null);
  const [academicData, setAcademicData] = useState<AcademicInfo | null>(null);

  // Fetch departments and sessions
  const { data: departments = [], isLoading: departmentsLoading } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/departments');
        if (!response.ok) throw new Error('Failed to fetch departments');
        return response.json();
      } catch (error) {
        // Fallback to mock data
        console.warn('Using mock departments data:', error);
        return [
          { id: '1', name: 'Computer Science' },
          { id: '2', name: 'Information Technology' },
          { id: '3', name: 'Business Administration' },
          { id: '4', name: 'Engineering' },
          { id: '5', name: 'Mathematics' },
        ];
      }
    },
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/sessions');
        if (!response.ok) throw new Error('Failed to fetch sessions');
        return response.json();
      } catch (error) {
        // Fallback to mock data
        console.warn('Using mock sessions data:', error);
        return [
          { id: '1', name: '2024/2025' },
          { id: '2', name: '2025/2026' },
        ];
      }
    },
  });

  const personalForm = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onBlur',
  });

  const academicForm = useForm<AcademicInfo>({
    resolver: zodResolver(academicInfoSchema),
    mode: 'onBlur',
  });

  const documentForm = useForm<DocumentInfo>({
    resolver: zodResolver(documentSchema),
    mode: 'onBlur',
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: RegistrationData) => {
      const formData = new FormData();
      
      // Append basic data
      Object.keys(data).forEach(key => {
        if (key !== 'documents' && data[key as keyof RegistrationData] !== undefined) {
          const value = data[key as keyof RegistrationData];
          if (typeof value === 'string') {
            formData.append(key, value);
          }
        }
      });
      
      // Append documents
      if (data.documents) {
        Object.keys(data.documents).forEach(key => {
          if (data.documents![key] instanceof File) {
            formData.append(key, data.documents![key]);
          }
        });
      }

      const response = await fetch('/api/students/register', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      alert(`Registration successful! Your student number is: ${data.studentNo}`);
      router.push('/student-dashboard');
    },
    onError: (error: Error) => {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error.message}`);
    },
  });

  const handlePersonalSubmit = (data: PersonalInfo) => {
    setPersonalData(data);
    setCurrentStep(1);
  };

  const handleAcademicSubmit = (data: AcademicInfo) => {
    setAcademicData(data);
    setCurrentStep(2);
  };

  const handleFinalSubmit = (documentData: DocumentInfo) => {
    if (!personalData || !academicData) {
      alert('Please complete all previous steps');
      return;
    }

    const combinedData: RegistrationData = {
      ...personalData,
      ...academicData,
      birthDate: new Date(personalData.birthDate).toISOString(),
      documents: documentData,
    };

    createStudentMutation.mutate(combinedData);
  };

  const steps = [
    {
      title: "Personal Information",
      description: "Please provide your basic personal details",
      icon: <User className="h-5 w-5" />,
      component: (
        <form onSubmit={personalForm.handleSubmit(handlePersonalSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="studentName">Full Name *</Label>
              <Input 
                {...personalForm.register("studentName")}
                placeholder="Enter your full name"
                data-testid="input-student-name"
                className={personalForm.formState.errors.studentName ? "border-red-500" : ""}
              />
              {personalForm.formState.errors.studentName && (
                <p className="text-red-600 text-sm mt-1">
                  {personalForm.formState.errors.studentName.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="birthDate">Date of Birth *</Label>
              <Input 
                type="date"
                {...personalForm.register("birthDate")}
                data-testid="input-birth-date"
                className={personalForm.formState.errors.birthDate ? "border-red-500" : ""}
              />
              {personalForm.formState.errors.birthDate && (
                <p className="text-red-600 text-sm mt-1">
                  {personalForm.formState.errors.birthDate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select 
                onValueChange={(value) => personalForm.setValue("gender", value as "Male" | "Female")}
                data-testid="select-gender"
              >
                <SelectTrigger className={personalForm.formState.errors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
              {personalForm.formState.errors.gender && (
                <p className="text-red-600 text-sm mt-1">
                  {personalForm.formState.errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="nationality">Nationality *</Label>
              <Input 
                {...personalForm.register("nationality")}
                placeholder="e.g., Kenyan"
                data-testid="input-nationality"
                className={personalForm.formState.errors.nationality ? "border-red-500" : ""}
              />
              {personalForm.formState.errors.nationality && (
                <p className="text-red-600 text-sm mt-1">
                  {personalForm.formState.errors.nationality.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input 
                {...personalForm.register("phoneNumber")}
                placeholder="+254 700 000 000"
                data-testid="input-phone"
                className={personalForm.formState.errors.phoneNumber ? "border-red-500" : ""}
              />
              {personalForm.formState.errors.phoneNumber && (
                <p className="text-red-600 text-sm mt-1">
                  {personalForm.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input 
                type="email"
                {...personalForm.register("email")}
                placeholder="your.email@example.com"
                data-testid="input-email"
                className={personalForm.formState.errors.email ? "border-red-500" : ""}
              />
              {personalForm.formState.errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {personalForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="county">County *</Label>
              <Select 
                onValueChange={(value) => personalForm.setValue("county", value)}
                data-testid="select-county"
              >
                <SelectTrigger className={personalForm.formState.errors.county ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select County" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nairobi">Nairobi</SelectItem>
                  <SelectItem value="Mombasa">Mombasa</SelectItem>
                  <SelectItem value="Kiambu">Kiambu</SelectItem>
                  <SelectItem value="Nakuru">Nakuru</SelectItem>
                  <SelectItem value="Kisumu">Kisumu</SelectItem>
                  <SelectItem value="Uasin Gishu">Uasin Gishu</SelectItem>
                  <SelectItem value="Machakos">Machakos</SelectItem>
                </SelectContent>
              </Select>
              {personalForm.formState.errors.county && (
                <p className="text-red-600 text-sm mt-1">
                  {personalForm.formState.errors.county.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="subCounty">Sub-County *</Label>
              <Input 
                {...personalForm.register("subCounty")}
                placeholder="Enter sub-county"
                data-testid="input-subcounty"
                className={personalForm.formState.errors.subCounty ? "border-red-500" : ""}
              />
              {personalForm.formState.errors.subCounty && (
                <p className="text-red-600 text-sm mt-1">
                  {personalForm.formState.errors.subCounty.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="birthCertNo">Birth Certificate Number *</Label>
              <Input 
                {...personalForm.register("birthCertNo")}
                placeholder="Enter birth certificate number"
                data-testid="input-birth-cert"
                className={personalForm.formState.errors.birthCertNo ? "border-red-500" : ""}
              />
              {personalForm.formState.errors.birthCertNo && (
                <p className="text-red-600 text-sm mt-1">
                  {personalForm.formState.errors.birthCertNo.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button type="submit" data-testid="button-next-academic">
              Next: Academic Information <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      )
    },
    {
      title: "Academic Information",
      description: "Please provide your academic background and program details",
      icon: <Award className="h-5 w-5" />,
      component: (
        <form onSubmit={academicForm.handleSubmit(handleAcademicSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="studentType">Student Type *</Label>
              <Select 
                onValueChange={(value) => academicForm.setValue("studentType", value as "KUCCPS" | "SELF_SPONSORED")}
                data-testid="select-student-type"
              >
                <SelectTrigger className={academicForm.formState.errors.studentType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Student Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KUCCPS">KUCCPS</SelectItem>
                  <SelectItem value="SELF_SPONSORED">Self Sponsored</SelectItem>
                </SelectContent>
              </Select>
              {academicForm.formState.errors.studentType && (
                <p className="text-red-600 text-sm mt-1">
                  {academicForm.formState.errors.studentType.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="departmentId">Department *</Label>
              <Select 
                onValueChange={(value) => academicForm.setValue("departmentId", value)}
                data-testid="select-department"
                disabled={departmentsLoading}
              >
                <SelectTrigger className={academicForm.formState.errors.departmentId ? "border-red-500" : ""}>
                  <SelectValue placeholder={departmentsLoading ? "Loading..." : "Select Department"} />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {academicForm.formState.errors.departmentId && (
                <p className="text-red-600 text-sm mt-1">
                  {academicForm.formState.errors.departmentId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="programme">Programme *</Label>
              <Select 
                onValueChange={(value) => academicForm.setValue("programme", value)}
                data-testid="select-programme"
              >
                <SelectTrigger className={academicForm.formState.errors.programme ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bachelor of Computer Science">Bachelor of Computer Science</SelectItem>
                  <SelectItem value="Bachelor of Information Technology">Bachelor of Information Technology</SelectItem>
                  <SelectItem value="Bachelor of Business Administration">Bachelor of Business Administration</SelectItem>
                  <SelectItem value="Bachelor of Engineering">Bachelor of Engineering</SelectItem>
                  <SelectItem value="Master of Computer Science">Master of Computer Science</SelectItem>
                  <SelectItem value="Master of Business Administration">Master of Business Administration</SelectItem>
                </SelectContent>
              </Select>
              {academicForm.formState.errors.programme && (
                <p className="text-red-600 text-sm mt-1">
                  {academicForm.formState.errors.programme.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="class">Class/Year *</Label>
              <Select 
                onValueChange={(value) => academicForm.setValue("class", value)}
                data-testid="select-class"
              >
                <SelectTrigger className={academicForm.formState.errors.class ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Year 1">Year 1</SelectItem>
                  <SelectItem value="Year 2">Year 2</SelectItem>
                  <SelectItem value="Year 3">Year 3</SelectItem>
                  <SelectItem value="Year 4">Year 4</SelectItem>
                </SelectContent>
              </Select>
              {academicForm.formState.errors.class && (
                <p className="text-red-600 text-sm mt-1">
                  {academicForm.formState.errors.class.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="session">Academic Session *</Label>
              <Select 
                onValueChange={(value) => academicForm.setValue("session", value)}
                data-testid="select-session"
                disabled={sessionsLoading}
              >
                <SelectTrigger className={academicForm.formState.errors.session ? "border-red-500" : ""}>
                  <SelectValue placeholder={sessionsLoading ? "Loading..." : "Select Session"} />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.name}>
                      {session.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {academicForm.formState.errors.session && (
                <p className="text-red-600 text-sm mt-1">
                  {academicForm.formState.errors.session.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="kcpeIndex">KCPE Index Number</Label>
              <Input 
                {...academicForm.register("kcpeIndex")}
                placeholder="Enter KCPE index number"
                data-testid="input-kcpe"
              />
            </div>

            <div>
              <Label htmlFor="kcseIndex">KCSE Index Number</Label>
              <Input 
                {...academicForm.register("kcseIndex")}
                placeholder="Enter KCSE index number"
                data-testid="input-kcse"
              />
            </div>

            <div>
              <Label htmlFor="previousInstitution">Previous Institution</Label>
              <Input 
                {...academicForm.register("previousInstitution")}
                placeholder="Enter previous institution name"
                data-testid="input-previous-institution"
              />
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setCurrentStep(0)}
              data-testid="button-previous-personal"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button type="submit" data-testid="button-next-documents">
              Next: Upload Documents <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      )
    },
    {
      title: "Document Upload",
      description: "Please upload the required documents for verification",
      icon: <FileText className="h-5 w-5" />,
      component: (
        <form onSubmit={documentForm.handleSubmit(handleFinalSubmit)} className="space-y-6">
          <div className="space-y-6">
            {/* Birth Certificate */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Birth Certificate</h3>
                    <p className="text-sm text-gray-600">Upload your birth certificate (PDF, JPG, PNG - Max 5MB)</p>
                  </div>
                  <IdCard className="h-6 w-6 text-gray-400" />
                </div>
                <FileUpload 
                  onFileChange={(file) => documentForm.setValue("birthCertificate", file)}
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={5 * 1024 * 1024}
                  data-testid="upload-birth-cert"
                />
              </CardContent>
            </Card>

            {/* KCSE Certificate */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">KCSE Certificate</h3>
                    <p className="text-sm text-gray-600">Upload your KCSE certificate (PDF, JPG, PNG - Max 5MB)</p>
                  </div>
                  <Award className="h-6 w-6 text-gray-400" />
                </div>
                <FileUpload 
                  onFileChange={(file) => documentForm.setValue("kcseCertificate", file)}
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={5 * 1024 * 1024}
                  data-testid="upload-kcse-cert"
                />
              </CardContent>
            </Card>

            {/* Academic Transcripts */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Academic Transcripts</h3>
                    <p className="text-sm text-gray-600">Upload your latest academic transcripts (PDF - Max 10MB)</p>
                  </div>
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <FileUpload 
                  onFileChange={(file) => documentForm.setValue("transcripts", file)}
                  accept=".pdf"
                  maxSize={10 * 1024 * 1024}
                  data-testid="upload-transcripts"
                />
              </CardContent>
            </Card>

            {/* Passport Photo */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Passport Photo *</h3>
                    <p className="text-sm text-gray-600">Upload a recent passport-size photo (JPG, PNG - Max 2MB)</p>
                  </div>
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <FileUpload 
                  onFileChange={(file) => documentForm.setValue("passportPhoto", file)}
                  accept=".jpg,.jpeg,.png"
                  maxSize={2 * 1024 * 1024}
                  required={true}
                  data-testid="upload-passport-photo"
                />
                {documentForm.formState.errors.passportPhoto && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Passport photo is required
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setCurrentStep(1)}
              data-testid="button-previous-academic"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button 
              type="submit" 
              disabled={createStudentMutation.isPending}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
              data-testid="button-complete-registration"
            >
              {createStudentMutation.isPending ? (
                <>Processing...</>
              ) : (
                <>Complete Registration <Check className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </form>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/")}
                className="mr-4"
                data-testid="button-back-home"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-xl font-bold text-gray-900">Student Registration</span>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MultiStepForm 
          steps={steps}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
}