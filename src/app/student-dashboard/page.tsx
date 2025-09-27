// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Users, 
  BookOpen, 
  Calendar, 
  Shield, 
  FileText, 
  Clock,
  CheckCircle,
  Zap,
  Globe,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Student Registration",
    description: "Comprehensive multi-step registration with personal details, academic information, and document uploads",
    color: "bg-blue-500",
    href: "/registration-form"
  },
  {
    icon: BookOpen,
    title: "Exam Registration",
    description: "Bulk exam registration with real-time validation and session-based filtering",
    color: "bg-green-500",
    href: "/exam-registration"
  },
  {
    icon: Calendar,
    title: "Holiday Reporting",
    description: "Submit and track holiday reports with comprehensive form handling and status tracking",
    color: "bg-purple-500",
    href: "/holiday-reporting"
  },
  {
    icon: BarChart3,
    title: "Admin Dashboard",
    description: "Complete administrative panel for managing students, exams, and generating detailed reports",
    color: "bg-orange-500",
    href: "/admin-panel"
  }
];

const benefits = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with Next.js 15+ for optimal performance and user experience"
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Role-based authentication with PostgreSQL and type-safe operations"
  },
  {
    icon: Globe,
    title: "Always Accessible",
    description: "Responsive design works perfectly on desktop, tablet, and mobile devices"
  },
  {
    icon: CheckCircle,
    title: "Form Validation",
    description: "Comprehensive validation using React Hook Form with Zod schemas"
  }
];

const stats = [
  { label: "Students Registered", value: "5,000+", subtext: "Active users" },
  { label: "Exams Scheduled", value: "1,200+", subtext: "This semester" },
  { label: "Holiday Reports", value: "850+", subtext: "Processed monthly" },
  { label: "System Uptime", value: "99.9%", subtext: "Reliability" }
];

// Make this a client component to handle dynamic rendering
export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 via-white to-gray-50 py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Clock className="mr-1 h-3 w-3" />
              Available 24/7
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Streamlined Student
              <span className="text-blue-600"> Registration System</span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Complete academic management platform with exam registration, holiday reporting, 
              and comprehensive student data management. Built for modern educational institutions.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/registration-form">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                  Start Registration
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <Link href="/student-dashboard">
                <Button variant="outline" size="lg">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-gray-600">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need for Student Management
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive tools designed to streamline academic administration and student services
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color} mb-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4">
                      {feature.description}
                    </CardDescription>
                    <Link href={feature.href}>
                      <Button variant="ghost" size="sm" className="group-hover:bg-gray-100 p-0 h-auto font-medium">
                        Learn More
                        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose EduRegistry?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Built with modern technology and educational best practices in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-6">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* System Capabilities */}
      <section className="py-20 bg-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                Powerful Administrative Tools
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Multi-step Registration</h3>
                    <p className="text-gray-600">Comprehensive forms with personal details, academic info, and document uploads</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Advanced Search & Filtering</h3>
                    <p className="text-gray-600">Find students by ID, email, phone number with real-time results</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Data Export Capabilities</h3>
                    <p className="text-gray-600">Export student lists, exam registrations, and reports in CSV/PDF formats</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Role-based Access Control</h3>
                    <p className="text-gray-600">Student, Admin, and Staff roles with appropriate permission levels</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/admin-panel">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Explore Admin Features
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">System Overview</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Active Students</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">5,000+</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Exam Sessions</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">50+</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-900">Reports Generated</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">8,500+</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-gray-900">Uptime</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of students and administrators already using EduRegistry 
              to streamline their academic management processes.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registration-form">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                  Register as Student
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <Link href="/api/login">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Admin Login
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-blue-200">
              <p>Need help getting started? <Link href="/contact" className="underline hover:text-white">Contact our support team</Link></p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <p className="text-gray-600">Jump directly to the tools you need</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Link href="/registration-form" className="group">
              <Card className="text-center p-6 hover:shadow-md transition-all duration-200 group-hover:border-blue-300">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">New Registration</h3>
              </Card>
            </Link>
            
            <Link href="/exam-registration" className="group">
              <Card className="text-center p-6 hover:shadow-md transition-all duration-200 group-hover:border-green-300">
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 group-hover:text-green-600">Exam Registration</h3>
              </Card>
            </Link>
            
            <Link href="/holiday-reporting" className="group">
              <Card className="text-center p-6 hover:shadow-md transition-all duration-200 group-hover:border-purple-300">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 group-hover:text-purple-600">Holiday Reports</h3>
              </Card>
            </Link>
            
            <Link href="/student-dashboard" className="group">
              <Card className="text-center p-6 hover:shadow-md transition-all duration-200 group-hover:border-orange-300">
                <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 group-hover:text-orange-600">Dashboard</h3>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Built with Modern Technology</h2>
            <p className="text-gray-600">Reliable, scalable, and secure architecture</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Next.js 15+</h3>
              <p className="text-sm text-gray-600">Latest React framework with App Router for optimal performance</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">PostgreSQL + Prisma</h3>
              <p className="text-sm text-gray-600">Type-safe database operations with robust data integrity</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Form Validation</h3>
              <p className="text-sm text-gray-600">React Hook Form with Zod schemas for comprehensive validation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}