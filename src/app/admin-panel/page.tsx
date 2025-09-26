// app/admin-panel/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users,
  CalendarCheck,
  CalendarX,
  Building,
  UserPlus,
  Calendar as CalendarIcon,
  FileDown,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Clock,
  Upload
} from "lucide-react";

// Mock hook implementations - replace with actual implementations
const useAuth = () => ({
  user: { id: '1', role: 'ADMIN', firstName: 'Admin', lastName: 'User' },
  isAuthenticated: true,
  isLoading: false
});

const useToast = () => ({
  toast: ({ title, description, variant }: any) => {
    console.log(`Toast: ${title} - ${description}`);
  }
});

// Mock data - replace with actual API calls
const mockStats = {
  studentCount: 1245,
  activeExamCount: 15,
  pendingHolidayReportCount: 8,
  departmentCount: 12
};

const mockStudents = [
  {
    id: '1',
    studentName: 'John Doe',
    email: 'john@example.com',
    studentNo: 'STU001',
    departmentId: 'dept1',
    studentType: 'KUCCPS',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    email: 'jane@example.com',
    studentNo: 'STU002',
    departmentId: 'dept2',
    studentType: 'SELF_SPONSORED',
    createdAt: new Date().toISOString()
  }
];

const mockDepartments = [
  { id: 'dept1', name: 'Computer Science', description: 'CS Department' },
  { id: 'dept2', name: 'Engineering', description: 'Engineering Department' }
];

const mockHolidayReports = [
  {
    id: '1',
    studentId: '1',
    holidayType: 'Sick Leave',
    priorityLevel: 'Normal',
    startDate: new Date().toISOString(),
    expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    submittedAt: new Date().toISOString()
  }
];

export default function AdminPanel() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast, router]);

  // Redirect if not admin or staff
  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'STAFF') {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (isLoading || !user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
    return <div className="min-h-screen bg-background" />;
  }

  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );

  const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  );

  const Button = ({ 
    children, 
    variant = "default", 
    size = "default", 
    className = "",
    onClick,
    ...props 
  }: { 
    children: React.ReactNode; 
    variant?: string; 
    size?: string; 
    className?: string;
    onClick?: () => void;
    [key: string]: any;
  }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    
    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      link: "underline-offset-4 hover:underline text-primary"
    };
    
    const sizeClasses = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      lg: "h-11 px-8 rounded-md"
    };

    return (
      <button 
        className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default} ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  };

  const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: string }) => {
    const variantClasses = {
      default: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      outline: "text-foreground border border-input"
    };

    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default}`}>
        {children}
      </div>
    );
  };

  const Avatar = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>
      {children}
    </div>
  );

  const AvatarFallback = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`flex h-full w-full items-center justify-center rounded-full ${className}`}>
      {children}
    </div>
  );

  const DataTable = ({ 
    data, 
    columns, 
    searchPlaceholder,
    ...props 
  }: { 
    data: any[]; 
    columns: any[]; 
    searchPlaceholder: string;
    [key: string]: any;
  }) => (
    <div className="rounded-md border">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {columns.map((column) => (
              <th key={column.key} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((row, index) => (
            <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              {columns.map((column) => (
                <td key={column.key} className="p-4 align-middle">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const studentColumns = [
    {
      key: "avatar",
      label: "",
      render: (_: any, row: any) => (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-600 text-white text-xs">
            {row.studentName?.substring(0, 2)?.toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>
      )
    },
    {
      key: "studentName",
      label: "Student",
      sortable: true,
      render: (value: any, row: any) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{row.email}</p>
        </div>
      )
    },
    {
      key: "studentNo",
      label: "ID",
      sortable: true,
    },
    {
      key: "departmentId",
      label: "Department",
      render: (value: any) => {
        const dept = mockDepartments.find(d => d.id === value);
        return dept?.name || "Unknown";
      }
    },
    {
      key: "studentType",
      label: "Type",
      render: (value: any) => (
        <Badge variant={value === 'KUCCPS' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: "createdAt",
      label: "Registered",
      sortable: true,
      render: (value: any) => new Date(value).toLocaleDateString()
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const holidayReportColumns = [
    {
      key: "studentId",
      label: "Student",
      render: (value: any) => {
        const student = mockStudents.find(s => s.id === value);
        return student?.studentName || "Unknown";
      }
    },
    {
      key: "holidayType",
      label: "Type",
      sortable: true,
    },
    {
      key: "priorityLevel",
      label: "Priority",
      render: (value: any) => (
        <Badge variant={
          value === 'Emergency' ? 'destructive' : 
          value === 'Urgent' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: "startDate",
      label: "Start Date",
      sortable: true,
      render: (value: any) => new Date(value).toLocaleDateString()
    },
    {
      key: "expectedReturnDate",
      label: "Return Date",
      sortable: true,
      render: (value: any) => new Date(value).toLocaleDateString()
    },
    {
      key: "status",
      label: "Status",
      render: (value: any) => (
        <Badge variant={
          value === 'APPROVED' ? 'default' : 
          value === 'REJECTED' ? 'destructive' : 'secondary'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: "submittedAt",
      label: "Submitted",
      sortable: true,
      render: (value: any) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {mockStats.studentCount}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="text-blue-600 h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-green-600">+12%</span>
                <span className="text-gray-600 dark:text-gray-400"> from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Exams</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {mockStats.activeExamCount}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CalendarCheck className="text-green-600 h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-green-600">+5</span>
                <span className="text-gray-600 dark:text-gray-400"> this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Holiday Reports</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {mockHolidayReports.length}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <CalendarX className="text-orange-600 h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-orange-600">{mockStats.pendingHolidayReportCount} pending</span>
                <span className="text-gray-600 dark:text-gray-400"> approval</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Departments</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {mockDepartments.length}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Building className="text-purple-600 h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">All active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <UserPlus className="mr-3 text-blue-600" />
                  Add New Student
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <CalendarIcon className="mr-3 text-blue-600" />
                  Create New Exam
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileDown className="mr-3 text-blue-600" />
                  Export Student Data
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart3 className="mr-3 text-blue-600" />
                  Generate Reports
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-3 text-blue-600" />
                  System Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Activity</h3>
                  <Button variant="link" className="text-sm">
                    View All →
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <UserPlus className="text-green-600 mr-3 h-4 w-4" />
                    <span className="text-gray-600 dark:text-gray-400">
                      New student registration completed • 5 minutes ago
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="text-blue-600 mr-3 h-4 w-4" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Exam schedule updated • 15 minutes ago
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="text-orange-600 mr-3 h-4 w-4" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Holiday report submitted for review • 1 hour ago
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FileDown className="text-purple-600 mr-3 h-4 w-4" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Student data exported by admin • 2 hours ago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Students Management */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Management</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
              
              <DataTable
                data={mockStudents}
                columns={studentColumns}
                searchPlaceholder="Search students..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Holiday Reports Management */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Holiday Reports</h3>
                <Badge variant="secondary">
                  {mockStats.pendingHolidayReportCount} Pending Review
                </Badge>
              </div>
              
              <DataTable
                data={mockHolidayReports}
                columns={holidayReportColumns}
                searchPlaceholder="Search reports..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}