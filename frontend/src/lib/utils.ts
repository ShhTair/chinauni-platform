import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const LEAGUE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  'C9':           { label: 'C9',   color: '#fff', bg: '#7C3AED' },
  '985':          { label: '985',  color: '#fff', bg: '#1D4ED8' },
  '211':          { label: '211',  color: '#fff', bg: '#0369A1' },
  'HK-Affiliated':{ label: 'HK',   color: '#fff', bg: '#047857' },
  'US-Affiliated':{ label: 'US',   color: '#fff', bg: '#B45309' },
  'UK-Affiliated':{ label: 'UK',   color: '#fff', bg: '#9F1239' },
  'Private':      { label: 'Pvt',  color: '#fff', bg: '#374151' },
}

export const TIER_CONFIG: Record<string, { label: string; color: string }> = {
  'REACH':  { label: 'Reach',  color: '#C0392B' },
  'TARGET': { label: 'Target', color: '#B45309' },
  'LIKELY': { label: 'Likely', color: '#047857' },
}

export const DIPLOMA_CONFIG: Record<string, { label: string; flag: string }> = {
  'Chinese': { label: 'Chinese', flag: '🇨🇳' },
  'US':      { label: 'US Degree', flag: '🇺🇸' },
  'UK':      { label: 'UK Degree', flag: '🇬🇧' },
  'HK':      { label: 'HK Degree', flag: '🇭🇰' },
  'Dual':    { label: 'Dual', flag: '🎓' },
}

export function formatCNY(n?: number | null): string {
  if (!n) return '—'
  return `¥${n.toLocaleString()}/yr`
}

export function formatUSD(n?: number | null): string {
  if (n === undefined || n === null) return '—'
  if (n === 0) return 'Free'
  return `$${n}`
}

export function formatDate(d?: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function daysUntil(d?: string | null): number | null {
  if (!d) return null
  const diff = new Date(d).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
