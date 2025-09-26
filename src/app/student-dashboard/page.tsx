'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Calendar,
  BookOpen,
  FileText,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Download,
  TrendingUp,
  Bell,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

// Types - Fixed interfaces
interface ExamRegistrationWithRelations {
  id: string;
  status: string | null;
  registeredAt: Date | string | null;
  exam?: {
    id: string;
    title: string;
    courseCode: string;
    examDate: Date | string;
    startTime: string;
    endTime: string;
    room: string | null;
    department?: {
      name: string;
    } | null;
    session?: {
      name: string;
    } | null;
  } | null;
}

interface HolidayReportWithRelations {
  id: string;
  holidayType: string;
  priorityLevel: string | null;
  startDate: Date | string;
  expectedReturnDate: Date | string;
  destination: string;
  reason: string;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  status: string | null;
  submittedAt: Date | string | null;
  reviewedAt: Date | string | null;
}

interface DashboardStats {
  myRegistrations: number;
  myHolidayReports: number;
  pendingActions: number;
  upcomingExams: Array<{
    id: string;
    title: string;
    examDate: Date;
    department: { name: string } | null;
    _count: { registrations: number };
  }>;
}

// Utility functions
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return 'Invalid Date';
  }
};

const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid Date';
  }
};

// Get display name from session
const getDisplayName = (session: any): string => {
  if (!session?.user) return 'Student';
  
  // Try different possible name fields
  const user = session.user;
  return user.firstName || user.name || user.email?.split('@')[0] || 'Student';
};

// Loading components
const StatCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader className="pb-2">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </CardHeader>
    <CardContent>
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    </CardContent>
  </Card>
);

const ContentSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
    ))}
  </div>
);

// Custom hook for dashboard data with better error handling
const useDashboardData = () => {
  const statsQuery = useQuery<{ data: DashboardStats }>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch stats: ${response.status} ${errorText}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const registrationsQuery = useQuery<{ data: ExamRegistrationWithRelations[] }>({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      const response = await fetch('/api/students/registrations');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch registrations: ${response.status} ${errorText}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const holidayReportsQuery = useQuery<{ data: HolidayReportWithRelations[] }>({
    queryKey: ['my-holiday-reports'],
    queryFn: async () => {
      const response = await fetch('/api/students/holiday-reports');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch holiday reports: ${response.status} ${errorText}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return {
    stats: statsQuery.data?.data,
    registrations: registrationsQuery.data?.data || [],
    holidayReports: holidayReportsQuery.data?.data || [],
    isLoading: statsQuery.isLoading || registrationsQuery.isLoading || holidayReportsQuery.isLoading,
    error: statsQuery.error || registrationsQuery.error || holidayReportsQuery.error,
    isError: statsQuery.isError || registrationsQuery.isError || holidayReportsQuery.isError,
    refetch: () => {
      statsQuery.refetch();
      registrationsQuery.refetch();
      holidayReportsQuery.refetch();
    },
  };
};

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const { stats, registrations, holidayReports, isLoading, error, isError, refetch } = useDashboardData();

  // Handle authentication loading
  if (status === 'loading') {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Handle authentication error
  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to access your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle data loading error
  if (isError && error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Dashboard</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Failed to load dashboard data: {error.message}</p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getStatusColor = (status: string | null): string => {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string | null): string => {
    if (!priority) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    switch (priority.toLowerCase()) {
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTabChange = (tabValue: string) => {
    const tabButton = document.querySelector(`[data-value="${tabValue}"]`) as HTMLButtonElement;
    tabButton?.click();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {getDisplayName(session)}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your exam registrations and holiday reports from here.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/exam-registration">
              <Plus className="h-4 w-4 mr-2" />
              Register for Exams
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/holiday-reporting">
              <FileText className="h-4 w-4 mr-2" />
              Submit Holiday Report
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Registrations</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.myRegistrations || 0}</div>
                <p className="text-xs text-muted-foreground">Exam registrations</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Holiday Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.myHolidayReports || 0}</div>
                <p className="text-xs text-muted-foreground">Submitted reports</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600" />
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.upcomingExams?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Available for registration</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600" />
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingActions || 0}</div>
                <p className="text-xs text-muted-foreground">Items need attention</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="registrations">My Registrations</TabsTrigger>
          <TabsTrigger value="reports">Holiday Reports</TabsTrigger>
          <TabsTrigger value="available">Available Exams</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Exam Registrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recent Registrations
                </CardTitle>
                <CardDescription>Your latest exam registrations</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ContentSkeleton />
                ) : registrations && registrations.length > 0 ? (
                  <div className="space-y-3">
                    {registrations.slice(0, 3).map((registration) => (
                      <div key={registration.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{registration.exam?.title || 'Unknown Exam'}</p>
                          <p className="text-xs text-gray-600">
                            {formatDate(registration.exam?.examDate)} • {registration.exam?.startTime || 'TBA'}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(registration.status)} text-xs`}>
                          {registration.status || 'PENDING'}
                        </Badge>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleTabChange('registrations')}
                    >
                      View All <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No exam registrations yet</p>
                    <Button asChild size="sm" className="mt-2">
                      <Link href="/exam-registration">Register Now</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Holiday Reports Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Holiday Reports
                </CardTitle>
                <CardDescription>Your holiday report submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ContentSkeleton />
                ) : holidayReports && holidayReports.length > 0 ? (
                  <div className="space-y-3">
                    {holidayReports.slice(0, 3).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{report.holidayType}</p>
                          <p className="text-xs text-gray-600">
                            {formatDate(report.startDate)} - {formatDate(report.expectedReturnDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getPriorityColor(report.priorityLevel)} text-xs`}>
                            {report.priorityLevel || 'Normal'}
                          </Badge>
                          <Badge className={`${getStatusColor(report.status)} text-xs`}>
                            {report.status || 'PENDING'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleTabChange('reports')}
                    >
                      View All <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No holiday reports submitted</p>
                    <Button asChild size="sm" className="mt-2">
                      <Link href="/holiday-reporting">Submit Report</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Activity Summary
              </CardTitle>
              <CardDescription>Your engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{registrations?.length || 0}</div>
                  <p className="text-sm text-gray-600">Total Registrations</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{holidayReports?.length || 0}</div>
                  <p className="text-sm text-gray-600">Reports Submitted</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {registrations?.filter(r => r.status?.toUpperCase() === 'CONFIRMED').length || 0}
                  </div>
                  <p className="text-sm text-gray-600">Confirmed Exams</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button asChild variant="outline" className="h-24 flex-col hover:bg-blue-50 transition-colors">
                  <Link href="/exam-registration">
                    <Calendar className="h-6 w-6 mb-2" />
                    <span>Register for Exams</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-24 flex-col hover:bg-green-50 transition-colors">
                  <Link href="/holiday-reporting">
                    <FileText className="h-6 w-6 mb-2" />
                    <span>Holiday Report</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-24 flex-col hover:bg-purple-50 transition-colors">
                  <Link href="/registration-form">
                    <User className="h-6 w-6 mb-2" />
                    <span>Update Profile</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-24 flex-col hover:bg-orange-50 transition-colors">
                  <Link href="/api/export/my-data">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Export Data</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Registrations Tab */}
        <TabsContent value="registrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Exam Registrations</CardTitle>
              <CardDescription>All your exam registrations and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <ContentSkeleton />
              ) : registrations && registrations.length > 0 ? (
                <div className="space-y-4">
                  {registrations.map((registration) => (
                    <div key={registration.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{registration.exam?.title || 'Unknown Exam'}</h3>
                          <p className="text-sm text-gray-600">{registration.exam?.courseCode}</p>
                        </div>
                        <Badge className={getStatusColor(registration.status)}>
                          {registration.status || 'PENDING'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Date:</strong> {formatDate(registration.exam?.examDate)}</p>
                        <p><strong>Time:</strong> {registration.exam?.startTime} - {registration.exam?.endTime}</p>
                        {registration.exam?.room && <p><strong>Room:</strong> {registration.exam.room}</p>}
                        <p><strong>Registered:</strong> {formatDateTime(registration.registeredAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Registrations Yet</h3>
                  <p className="mb-4">You haven't registered for any exams yet.</p>
                  <Button asChild>
                    <Link href="/exam-registration">Register for Exams</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holiday Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Holiday Reports</CardTitle>
              <CardDescription>All your holiday report submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <ContentSkeleton />
              ) : holidayReports && holidayReports.length > 0 ? (
                <div className="space-y-4">
                  {holidayReports.map((report) => (
                    <div key={report.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{report.holidayType}</h3>
                          <p className="text-sm text-gray-600">{report.destination}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(report.priorityLevel)}>
                            {report.priorityLevel || 'Normal'}
                          </Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status || 'PENDING'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Period:</strong> {formatDate(report.startDate)} - {formatDate(report.expectedReturnDate)}</p>
                        <p><strong>Reason:</strong> {report.reason}</p>
                        <p><strong>Submitted:</strong> {formatDateTime(report.submittedAt)}</p>
                        {report.reviewedAt && <p><strong>Reviewed:</strong> {formatDateTime(report.reviewedAt)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Reports Submitted</h3>
                  <p className="mb-4">You haven't submitted any holiday reports yet.</p>
                  <Button asChild>
                    <Link href="/holiday-reporting">Submit Holiday Report</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Available Exams Tab */}
        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Exams</CardTitle>
              <CardDescription>Exams available for registration</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <ContentSkeleton />
              ) : stats?.upcomingExams && stats.upcomingExams.length > 0 ? (
                <div className="space-y-4">
                  {stats.upcomingExams.map((exam) => (
                    <div key={exam.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{exam.title}</h3>
                          <p className="text-sm text-gray-600">{exam.department?.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            <strong>Date:</strong> {formatDate(exam.examDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-2">
                            {exam._count.registrations} registered
                          </p>
                          <Button asChild size="sm">
                            <Link href="/exam-registration">Register</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Exams Available</h3>
                  <p>There are currently no exams available for registration.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Important Notices */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Important Notice</AlertTitle>
        <AlertDescription className="text-amber-700">
          Make sure to register for your exams before the registration deadline. 
          Late registrations may not be accepted. Check your email regularly for updates.
        </AlertDescription>
      </Alert>
    </div>
  );
}