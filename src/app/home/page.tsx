// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, BookOpen, Calendar, Shield, FileText, BarChart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Student Registration</span>
                <span className="block text-blue-600 dark:text-blue-400">Made Simple</span>
              </h1>
              
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Streamline your academic journey with our comprehensive online registration system. 
                Register for exams, submit holiday reports, and manage your academic life all in one place.
              </p>
              
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-2xl lg:max-w-md">
                <div className="relative block w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 flex items-center justify-center">
                    <BookOpen className="h-24 w-24 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to manage your academic journey
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Comprehensive tools designed to simplify student registration and academic management
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg text-white mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Student Registration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Easy multi-step registration process with comprehensive personal and academic information management.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg text-white mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Exam Registration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Register for multiple exams with bulk registration capabilities and real-time validation.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group relative p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg text-white mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Holiday Reporting
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Submit and track holiday reports with comprehensive form handling and status tracking.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="group relative p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-lg text-white mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Secure Access
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Role-based authentication system ensuring data security and appropriate access control.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="group relative p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-600 rounded-lg text-white mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Document Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload, manage, and track all your academic documents in one secure location.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="group relative p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-600 rounded-lg text-white mb-4">
                <BarChart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Reports & Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive reporting system with data export capabilities for administrators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of students already using our platform to manage their academic journey.
            </p>
            
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Registration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">5000+</div>
              <div className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">Registered Students</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">50+</div>
              <div className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">Academic Programs</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">99.9%</div>
              <div className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">24/7</div>
              <div className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}