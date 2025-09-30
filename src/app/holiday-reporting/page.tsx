//app/holiday-reporting/page.tsx
// 
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Navigation from "@/components/navigation";
import type { 
  Student, 
  HolidayReportWithRelations 
} from "../../../shared/schema";
import { 
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  FileText,
  Edit,
  Trash2,
  Plus,
  Filter
} from "lucide-react";

// Simple date formatting function to replace date-fns
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatDateTime = (date: Date | string | null) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

const holidayReportSchema = z.object({
  holidayType: z.string().min(1, "Holiday type is required"),
  priorityLevel: z.enum(["Normal", "Urgent", "Emergency"]),
  startDate: z.date(),
  expectedReturnDate: z.date(),
  destination: z.string().min(1, "Destination is required"),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
}).refine((data) => data.expectedReturnDate > data.startDate, {
  message: "Return date must be after start date",
  path: ["expectedReturnDate"],
});

type HolidayReportFormData = z.infer<typeof holidayReportSchema>;

const HOLIDAY_TYPES = [
  "Medical Leave",
  "Family Emergency",
  "Personal Holiday",
  "Academic Conference",
  "Internship",
  "Other"
];

const PRIORITY_COLORS = {
  Normal: "default" as const,
  Urgent: "secondary" as const,
  Emergency: "destructive" as const,
};

const STATUS_COLORS = {
  PENDING: "default" as const,
  APPROVED: "default" as const,
  REJECTED: "destructive" as const,
};

export default function HolidayReporting() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Form setup
  const form = useForm<HolidayReportFormData>({
    resolver: zodResolver(holidayReportSchema),
    defaultValues: {
      holidayType: "",
      priorityLevel: "Normal",
      destination: "",
      reason: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
  });

  // Get current student
  const { data: student } = useQuery<Student | null>({
    queryKey: ["students", "me"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/students/me");
      if (!response.ok) throw new Error('Failed to fetch student data');
      return response.json();
    },
    enabled: !!user && isAuthenticated,
  });

  // Get holiday reports
  const { data: holidayReports = [], isLoading: reportsLoading } = useQuery<HolidayReportWithRelations[]>({
    queryKey: ["holiday-reports", "me", filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      
      const response = await apiRequest("GET", `/api/holiday-reports/me?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch holiday reports');
      return response.json();
    },
    enabled: !!student,
  });

  // Submit holiday report mutation
  const submitReportMutation = useMutation<unknown, Error, HolidayReportFormData>({
    mutationFn: async (data: HolidayReportFormData) => {
      const endpoint = editingReport 
        ? `/api/holiday-reports/${editingReport}` 
        : "/api/holiday-reports";
      
      const method = editingReport ? "PUT" : "POST";
      
      const response = await apiRequest(method, endpoint, {
        body: JSON.stringify({
          ...data,
          studentId: student?.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${editingReport ? 'update' : 'submit'} holiday report`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: editingReport ? "Report Updated" : "Report Submitted",
        description: editingReport 
          ? "Your holiday report has been updated successfully." 
          : "Your holiday report has been submitted for review.",
      });
      queryClient.invalidateQueries({ queryKey: ["holiday-reports"] });
      setIsFormOpen(false);
      setEditingReport(null);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => router.push("/api/login"), 500);
        return;
      }
      toast({
        title: "Submission Failed",
        description: "Failed to submit holiday report. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete report mutation
  const deleteReportMutation = useMutation({
    mutationFn: async (reportId: string) => {
      const response = await apiRequest("DELETE", `/api/holiday-reports/${reportId}`);
      if (!response.ok) throw new Error('Failed to delete holiday report');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Deleted",
        description: "Holiday report has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["holiday-reports"] });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete holiday report. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => router.push("/api/login"), 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast, router]);

  const handleEditReport = (report: HolidayReportWithRelations) => {
    if (report.status !== 'PENDING') {
      toast({
        title: "Cannot Edit",
        description: "You can only edit pending reports.",
        variant: "destructive",
      });
      return;
    }

    setEditingReport(report.id);
    form.setValue("holidayType", report.holidayType);
    form.setValue("priorityLevel", (report.priorityLevel as "Normal" | "Urgent" | "Emergency") || "Normal");
    form.setValue("startDate", new Date(report.startDate));
    form.setValue("expectedReturnDate", new Date(report.expectedReturnDate));
    form.setValue("destination", report.destination);
    form.setValue("reason", report.reason);
    form.setValue("emergencyContactName", report.emergencyContactName || "");
    form.setValue("emergencyContactPhone", report.emergencyContactPhone || "");
    setIsFormOpen(true);
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm("Are you sure you want to delete this holiday report?")) {
      deleteReportMutation.mutate(reportId);
    }
  };

  const onSubmit = (data: HolidayReportFormData) => {
    submitReportMutation.mutate(data);
  };

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

  const filteredReports = holidayReports.filter(report => 
    filterStatus === "all" || report.status === filterStatus.toUpperCase()
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Holiday Reporting</h1>
              <p className="text-muted-foreground mt-1">
                Submit and track your holiday reports and leave requests
              </p>
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Holiday Report
            </Button>
          </div>
        </div>

        {/* Holiday Report Form */}
        {isFormOpen && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {editingReport ? "Edit Holiday Report" : "Submit Holiday Report"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Holiday Type */}
                    <FormField
                      control={form.control}
                      name="holidayType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Holiday Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select holiday type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {HOLIDAY_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Priority Level */}
                    <FormField
                      control={form.control}
                      name="priorityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Normal">Normal</SelectItem>
                              <SelectItem value="Urgent">Urgent</SelectItem>
                              <SelectItem value="Emergency">Emergency</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Start Date */}
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full pl-3 text-left font-normal ${
                                    !field.value && "text-muted-foreground"
                                  }`}
                                >
                                  {field.value ? (
                                    formatDate(field.value)
                                  ) : (
                                    <span>Pick start date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date: Date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Expected Return Date */}
                    <FormField
                      control={form.control}
                      name="expectedReturnDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Expected Return Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full pl-3 text-left font-normal ${
                                    !field.value && "text-muted-foreground"
                                  }`}
                                >
                                  {field.value ? (
                                    formatDate(field.value)
                                  ) : (
                                    <span>Pick return date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date: Date) => date < (form.getValues("startDate") || new Date())}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Destination */}
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your destination" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Reason */}
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Holiday</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide detailed reason for your holiday request..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Emergency Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact person name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergencyContactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsFormOpen(false);
                        setEditingReport(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={submitReportMutation.isPending}
                    >
                      {submitReportMutation.isPending 
                        ? (editingReport ? "Updating..." : "Submitting...") 
                        : (editingReport ? "Update Report" : "Submit Report")
                      }
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Filter and Reports List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Holiday Reports
              </CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {reportsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading reports...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Holiday Reports</h3>
                <p className="text-muted-foreground mb-4">
                  {filterStatus === "all" 
                    ? "You haven't submitted any holiday reports yet."
                    : `No ${filterStatus} reports found.`
                  }
                </p>
                {filterStatus === "all" && (
                  <Button onClick={() => setIsFormOpen(true)}>
                    Submit Your First Report
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div 
                    key={report.id}
                    className="border rounded-lg p-6 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{report.holidayType}</h4>
                            <Badge variant={PRIORITY_COLORS[(report.priorityLevel as keyof typeof PRIORITY_COLORS) || "Normal"]}>
                              {report.priorityLevel}
                            </Badge>
                            <Badge variant={STATUS_COLORS[(report.status as keyof typeof STATUS_COLORS) || "PENDING"]}>
                              {report.status}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{formatDate(report.startDate)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Return: {formatDate(report.expectedReturnDate)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{report.destination}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {report.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditReport(report)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteReport(report.id)}
                              disabled={deleteReportMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Reason:</p>
                      <p className="text-sm">{report.reason}</p>
                    </div>

                    {/* Emergency Contact */}
                    {(report.emergencyContactName || report.emergencyContactPhone) && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Emergency Contact:</p>
                        <p className="text-sm">
                          {report.emergencyContactName} {report.emergencyContactPhone && `- ${report.emergencyContactPhone}`}
                        </p>
                      </div>
                    )}

                    {/* Review Information */}
                    {report.status !== 'PENDING' && (
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              {report.status === 'APPROVED' ? 'Approved' : 'Rejected'} on:{' '}
                            </span>
                            <span className="font-medium">
                              {report.reviewedAt 
                                ? formatDateTime(report.reviewedAt)
                                : 'N/A'
                              }
                            </span>
                          </div>
                          {report.reviewer && (
                            <span className="text-muted-foreground">
                              by {report.reviewer.firstName || ''} {report.reviewer.lastName || ''}
                            </span>
                          )}
                        </div>
                        {(report as { reviewNotes?: string }).reviewNotes && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground mb-1">Review Comments:</p>
                            <p className="text-sm italic">{(report as { reviewNotes?: string }).reviewNotes}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground mt-4 pt-2 border-t">
                      Submitted on {formatDateTime(report.submittedAt || new Date())}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}