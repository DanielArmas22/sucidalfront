import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Hace un momento'
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} minutos`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Hace ${diffInHours} horas`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `Hace ${diffInDays} días`
  
  return formatDate(date)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const

export type RiskLevel = typeof RISK_LEVELS[keyof typeof RISK_LEVELS]

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case RISK_LEVELS.LOW:
      return 'text-green-600 bg-green-50'
    case RISK_LEVELS.MEDIUM:
      return 'text-yellow-600 bg-yellow-50'
    case RISK_LEVELS.HIGH:
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case RISK_LEVELS.LOW:
      return 'Bajo'
    case RISK_LEVELS.MEDIUM:
      return 'Medio'
    case RISK_LEVELS.HIGH:
      return 'Alto'
    default:
      return 'Desconocido'
  }
}
