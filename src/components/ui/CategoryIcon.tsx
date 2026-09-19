import React from 'react'
import {
  Laptop,
  Camera,
  Music,
  Briefcase,
  Rocket,
  Dumbbell,
  Plane,
  Utensils,
  Gamepad2,
  Trophy,
  Sparkles,
  Palette,
  PenTool,
  BookOpen,
  TrendingUp,
  Film,
  Car,
  Trees,
  Heart,
  Users,
  Globe,
  Tv,
  HelpCircle,
  LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  // Common categories / interests
  technology: Laptop,
  tech: Laptop,
  photography: Camera,
  music: Music,
  business: Briefcase,
  entrepreneurship: Rocket,
  fitness: Dumbbell,
  travel: Plane,
  food: Utensils,
  gaming: Gamepad2,
  sports: Trophy,
  fashion: Sparkles,
  art: Palette,
  design: PenTool,
  education: BookOpen,
  finance: TrendingUp,
  film: Film,
  cars: Car,
  nature: Trees,
  books: BookOpen,
  wellness: Heart,
  networking: Users,
  community: Globe,
  entertainment: Tv,
  friends: Users,
  communities: Globe,
  events: Sparkles,
  professional: Briefcase,
  activities: Dumbbell,
  experiences: Sparkles,
  dating: Heart,
}

interface CategoryIconProps {
  name: string
  size?: number
  className?: string
}

export function getCategoryIconComponent(name: string): LucideIcon {
  const normalized = name.toLowerCase().trim()
  return ICON_MAP[normalized] || Globe
}

export function CategoryIcon({ name, size = 16, className = '' }: CategoryIconProps) {
  const Icon = getCategoryIconComponent(name)
  return <Icon size={size} className={className} />
}
