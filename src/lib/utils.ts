import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TaskPriority, TaskStatus, SprintStatus } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function isOverdue(dueDateStr: string | null | undefined): boolean {
  if (!dueDateStr) return false
  return new Date(dueDateStr) < new Date()
}

export function getInitials(name: string | null | undefined, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (email) return email.slice(0, 2).toUpperCase()
  return 'NA'
}

export function getSprintProgress(tasks: { status: TaskStatus }[]): number {
  if (tasks.length === 0) return 0
  const done = tasks.filter((t) => t.status === 'done').length
  return Math.round((done / tasks.length) * 100)
}

export function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case 'high':
      return 'bg-red-900/40 text-red-300 border-red-800'
    case 'medium':
      return 'bg-amber-900/40 text-amber-300 border-amber-800'
    case 'low':
      return 'bg-emerald-900/40 text-emerald-300 border-emerald-800'
  }
}

export function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'backlog':
      return 'bg-slate-800 text-slate-300 border-slate-700'
    case 'in_progress':
      return 'bg-blue-900/40 text-blue-300 border-blue-800'
    case 'in_review':
      return 'bg-violet-900/40 text-violet-300 border-violet-800'
    case 'done':
      return 'bg-emerald-900/40 text-emerald-300 border-emerald-800'
  }
}

export function getSprintStatusColor(status: SprintStatus): string {
  switch (status) {
    case 'planned':
      return 'bg-slate-800 text-slate-300 border-slate-700'
    case 'active':
      return 'bg-blue-900/40 text-blue-300 border-blue-800'
    case 'completed':
      return 'bg-emerald-900/40 text-emerald-300 border-emerald-800'
  }
}
