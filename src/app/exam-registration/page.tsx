//app/exam-registration/page.tsx
// 
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import type { Student, Exam, Department, AcademicSession, ExamRegistration } from "../../../shared/schema";
import { 
  Calendar,
  MapPin,
  Users,
  Search,
  Check,
  AlertCircle
} from "lucide-react";

// Extended exam type with registration count
type ExamWithCount = Exam & {
  registrationCount?: number;
};

export default function ExamRegistration() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    session: "",
    examType: ""
  });

  const { data: student } = useQuery<Student | null>({
    queryKey: ["students", "me"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/students/me");
      if (!response.ok) {
        throw new Error('Failed to fetch student data');
      }
      return response.json();
    },
    enabled: !!user && isAuthenticated,
  });

  const { data: exams = [] } = useQuery<ExamWithCount[]>({
    queryKey: ["exams", { q: searchQuery, ...filters }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (searchQuery) searchParams.append('q', searchQuery);
      if (filters.department) searchParams.append('department', filters.department);
      if (filters.session) searchParams.append('session', filters.session);
      if (filters.examType) searchParams.append('examType', filters.examType);
      
      const response = await apiRequest("GET", `/api/exams?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch exams');
      }
      return response.json();
    },
    enabled: !!student,
  });

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/departments");
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      return response.json();
    },
  });

  const { data: sessions = [] } = useQuery<AcademicSession[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/sessions");
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      return response.json();
    },
  });

  const { data: registrations = [] } = useQuery<ExamRegistration[]>({
    queryKey: ["exam-registrations", "me"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/exam-registrations/me");
      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }
      return response.json();
    },
    enabled: !!student,
  });

  const registerMutation = useMutation({
    mutationFn: async (examId: string) => {
      const response = await apiRequest("POST", "/api/exam-registrations", {
        body: JSON.stringify({ examId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to register for exam');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "You have been registered for the exam.",
      });
      queryClient.invalidateQueries({ queryKey: ["exam-registrations", "me"] });
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          router.push("/login");
        }, 500);
        return;
      }
      toast({
        title: "Registration Failed",
        description: "Failed to register for exam. Please try again.",
        variant: "destructive",
      });
    },
  });

  const bulkRegisterMutation = useMutation({
    mutationFn: async (examIds: string[]) => {
      const promises = examIds.map(examId => 
        apiRequest("POST", "/api/exam-registrations", {
          body: JSON.stringify({ examId }),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Failed to register for exam ${examId}`);
          }
          return response.json();
        })
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      toast({
        title: "Bulk Registration Successful",
        description: `Successfully registered for ${selectedExams.length} exams.`,
      });
      setSelectedExams([]);
      queryClient.invalidateQueries({ queryKey: ["exam-registrations", "me"] });
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          router.push("/api/login");
        }, 500);
        return;
      }
      toast({
        title: "Bulk Registration Failed",
        description: "Some registrations may have failed. Please check and try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        router.push("/api/login");
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast, router]);

  if (isLoading || !student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Get registered exam IDs - handle both string and object examId
  const registeredExamIds = registrations.map(reg => 
    typeof reg.examId === 'string' ? reg.examId : reg.examId!
  ).filter(Boolean);

  // Filter available exams
  const availableExams = exams.filter(exam => 
    exam.status === 'PUBLISHED' && 
    new Date(exam.registrationDeadline) > new Date() &&
    !registeredExamIds.includes(exam.id)
  );

  const getRegistrationStatus = (exam: ExamWithCount) => {
    const registrationCount = exam.registrationCount || 0;
    const maxCapacity = exam.maxCapacity || 50;
    
    if (registrationCount >= maxCapacity) {
      return { label: "Registration Closed", variant: "destructive" as const };
    }
    if (new Date(exam.registrationDeadline) <= new Date()) {
      return { label: "Deadline Passed", variant: "secondary" as const };
    }
    return { label: "Open for Registration", variant: "default" as const };
  };

  const handleExamToggle = (examId: string) => {
    setSelectedExams(prev => 
      prev.includes(examId) 
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  const handleBulkRegister = () => {
    if (selectedExams.length > 0) {
      bulkRegisterMutation.mutate(selectedExams);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Exam Registration</h1>
            <div className="text-sm text-muted-foreground">
              Registration Deadline: <span className="text-destructive font-medium">Dec 10, 2024</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Filter Exams</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="department-filter">Department</Label>
                <Select 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
                  data-testid="select-department-filter"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="session-filter">Session</Label>
                <Select 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, session: value }))}
                  data-testid="select-session-filter"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sessions</SelectItem>
                    {sessions.map((session) => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="exam-type-filter">Exam Type</Label>
                <Select 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, examType: value }))}
                  data-testid="select-exam-type-filter"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="Final">Final Exam</SelectItem>
                    <SelectItem value="Mid-term">Mid-term</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="search-exams">Search</Label>
                <div className="relative">
                  <Input 
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-exams"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Exams */}
        <Card>
          <CardContent className="p-6">
            <div className="border-b border-border pb-6 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Available Exams</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground" data-testid="text-available-count">
                    {availableExams.length} exams available
                  </span>
                  {selectedExams.length > 0 && (
                    <Button 
                      onClick={handleBulkRegister}
                      disabled={bulkRegisterMutation.isPending}
                      data-testid="button-register-selected"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Register Selected ({selectedExams.length})
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {availableExams.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Available Exams</h3>
                <p className="text-muted-foreground">
                  {exams.length === 0 
                    ? "No exams match your search criteria."
                    : "You are already registered for all available exams or registration has closed."
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {availableExams.map((exam) => {
                  const status = getRegistrationStatus(exam);
                  const isSelected = selectedExams.includes(exam.id);
                  const canRegister = status.label === "Open for Registration";
                  
                  return (
                    <div 
                      key={exam.id} 
                      className={`p-6 hover:bg-accent/50 transition-colors ${!canRegister ? 'opacity-60' : ''}`}
                      data-testid={`exam-card-${exam.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={() => handleExamToggle(exam.id)}
                            disabled={!canRegister}
                            data-testid={`checkbox-exam-${exam.id}`}
                          />
                          <div>
                            <h4 className="font-semibold text-foreground text-lg">{exam.title}</h4>
                            <p className="text-muted-foreground">{exam.courseCode} • {exam.description}</p>
                            <div className="flex items-center space-x-6 mt-3 text-sm">
                              <div className="flex items-center">
                                <Calendar className="text-primary mr-2 h-4 w-4" />
                                <span className="text-muted-foreground">
                                  {new Date(exam.examDate).toLocaleDateString()} • {exam.startTime} - {exam.endTime}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="text-primary mr-2 h-4 w-4" />
                                <span className="text-muted-foreground">Room: {exam.room || 'TBA'}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="text-primary mr-2 h-4 w-4" />
                                <span className="text-muted-foreground">
                                  {exam.registrationCount || 0}/{exam.maxCapacity || 50} registered
                                </span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Badge variant={status.variant}>{status.label}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-2">Registration Fee</p>
                          <p className="text-xl font-bold text-foreground">KSH {exam.registrationFee || 500}</p>
                          <Button 
                            className="mt-2"
                            disabled={!canRegister || registerMutation.isPending}
                            onClick={() => registerMutation.mutate(exam.id)}
                            data-testid={`button-register-${exam.id}`}
                          >
                            {canRegister ? "Register Now" : "Unavailable"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {availableExams.length > 0 && (
              <div className="text-center pt-6 border-t border-border mt-6">
                <Button variant="link" data-testid="link-load-more">
                  Load more exams ↓
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}