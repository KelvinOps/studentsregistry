// components/layout/footer.tsx
import Link from 'next/link';
import { BookOpen, Mail, Phone, MapPin, Calendar, Users, FileText } from 'lucide-react';

const footerNavigation = {
  main: [
    { name: 'Student Registration', href: '/registration-form' },
    { name: 'Exam Registration', href: '/exam-registration' },
    { name: 'Holiday Reports', href: '/holiday-reporting' },
    { name: 'Student Dashboard', href: '/student-dashboard' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Support', href: '/contact' },
    { name: 'System Status', href: '/status' },
    { name: 'Documentation', href: '/docs' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
};

const stats = [
  { name: 'Active Students', value: '5,000+', icon: Users },
  { name: 'Registered Exams', value: '12,000+', icon: Calendar },
  { name: 'Holiday Reports', value: '8,500+', icon: FileText },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Stats Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.name} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            {/* Company Info */}
            <div className="space-y-4 xl:col-span-1">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">EduRegistry</span>
              </Link>
              
              <p className="text-sm text-gray-600 max-w-md">
                Streamlining academic registration processes for educational institutions. 
                Simple, secure, and efficient student management solutions.
              </p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Education Street, Academic City, AC 12345</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@eduregistry.edu</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                    Services
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {footerNavigation.main.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                    Support
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {footerNavigation.support.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="md:grid md:grid-cols-1">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                    Legal
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {footerNavigation.legal.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Office Hours */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                    Support Hours
                  </h3>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div>Monday - Friday: 8:00 AM - 6:00 PM</div>
                    <div>Saturday: 9:00 AM - 4:00 PM</div>
                    <div>Sunday: Closed</div>
                    <div className="pt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        System Available 24/7
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} EduRegistry. All rights reserved.
              </p>
              <div className="mt-4 flex space-x-6 md:mt-0">
                <span className="inline-flex items-center text-xs text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Version 2.1.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}