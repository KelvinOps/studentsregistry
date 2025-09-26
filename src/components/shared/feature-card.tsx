// components/shared/feature-card.tsx
'use client'

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo'
  onClick?: () => void
  className?: string
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    hoverBg: 'group-hover:bg-blue-200',
    icon: 'text-blue-600',
    title: 'group-hover:text-blue-600'
  },
  green: {
    bg: 'bg-green-100',
    hoverBg: 'group-hover:bg-green-200',
    icon: 'text-green-600',
    title: 'group-hover:text-green-600'
  },
  purple: {
    bg: 'bg-purple-100',
    hoverBg: 'group-hover:bg-purple-200',
    icon: 'text-purple-600',
    title: 'group-hover:text-purple-600'
  },
  orange: {
    bg: 'bg-orange-100',
    hoverBg: 'group-hover:bg-orange-200',
    icon: 'text-orange-600',
    title: 'group-hover:text-orange-600'
  },
  red: {
    bg: 'bg-red-100',
    hoverBg: 'group-hover:bg-red-200',
    icon: 'text-red-600',
    title: 'group-hover:text-red-600'
  },
  indigo: {
    bg: 'bg-indigo-100',
    hoverBg: 'group-hover:bg-indigo-200',
    icon: 'text-indigo-600',
    title: 'group-hover:text-indigo-600'
  }
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  onClick,
  className = "" 
}: FeatureCardProps) {
  const colors = colorClasses[color]
  
  return (
    <Card 
      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer ${className}`}
      onClick={onClick}
    >
      <CardHeader>
        <div className={`h-12 w-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4 ${colors.hoverBg} transition-colors group-hover:scale-110 duration-300`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
        <CardTitle className={`${colors.title} transition-colors`}>
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

// Grid wrapper for feature cards
interface FeatureGridProps {
  children: ReactNode
  className?: string
}

export function FeatureGrid({ children, className = "" }: FeatureGridProps) {
  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {children}
    </div>
  )
}