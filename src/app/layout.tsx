// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'EduRegistry - Student Registration System',
    template: '%s | EduRegistry'
  },
  description: 'Streamlined online exam registration and holiday reporting system for educational institutions. Manage student registrations, exam schedules, and academic reports efficiently.',
  keywords: [
    'student registration', 
    'exam registration', 
    'holiday reporting', 
    'educational management system', 
    'academic portal',
    'student management',
    'online registration'
  ],
  authors: [{ name: 'EduRegistry Team' }],
  creator: 'EduRegistry',
  publisher: 'Educational Institution',
  openGraph: {
    title: 'EduRegistry - Student Registration System',
    description: 'Streamlined online exam registration and holiday reporting system',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduRegistry - Student Registration System',
    description: 'Streamlined online exam registration and holiday reporting system',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">
              {children}
            </main> 
          </div>
        </Providers>
      </body>
    </html>
  )
}