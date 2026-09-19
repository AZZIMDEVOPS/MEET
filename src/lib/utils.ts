import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

export function formatEventDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatEventTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function generateInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function getAvatarFallback(profile: { full_name?: string; username?: string }): string {
  if (profile.full_name) return generateInitials(profile.full_name)
  if (profile.username) return profile.username.slice(0, 2).toUpperCase()
  return 'ME'
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const INTEREST_COLORS: Record<string, string> = {
  Technology: '#3B82F6',
  Photography: '#F59E0B',
  Music: '#8B5CF6',
  Business: '#10B981',
  Entrepreneurship: '#EF4444',
  Fitness: '#F97316',
  Travel: '#06B6D4',
  Food: '#84CC16',
  Gaming: '#A855F7',
  Sports: '#22C55E',
  Fashion: '#EC4899',
  Art: '#F43F5E',
  Design: '#6366F1',
  Education: '#0EA5E9',
  Finance: '#14B8A6',
  Film: '#EAB308',
  Cars: '#64748B',
  Nature: '#22D3EE',
  Books: '#8B5CF6',
  Wellness: '#34D399',
}

export const INTEREST_ICONS: Record<string, string> = {
  Technology: '',
  Photography: '',
  Music: '',
  Business: '',
  Entrepreneurship: '',
  Fitness: '',
  Travel: '',
  Food: '',
  Gaming: '',
  Sports: '',
  Fashion: '',
  Art: '',
  Design: '',
  Education: '',
  Finance: '',
  Film: '',
  Cars: '',
  Nature: '',
  Books: '',
  Wellness: '',
}
