import { describe, it, expect } from 'vitest'
import {
  cn,
  formatDate,
  isOverdue,
  getInitials,
  getSprintProgress,
  getPriorityColor,
  getStatusColor,
  getSprintStatusColor,
} from '../lib/utils'

describe('cn (class merger)', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })
  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })
  it('deduplicates tailwind conflicts', () => {
    const result = cn('p-2', 'p-4')
    expect(result).toBe('p-4')
  })
})

describe('formatDate', () => {
  it('returns em-dash for null', () => {
    expect(formatDate(null)).toBe('—')
  })
  it('returns em-dash for undefined', () => {
    expect(formatDate(undefined)).toBe('—')
  })
  it('formats a valid date string', () => {
    const result = formatDate('2025-01-15')
    expect(result).toMatch(/Jan/)
    expect(result).toMatch(/15/)
    expect(result).toMatch(/2025/)
  })
})

describe('isOverdue', () => {
  it('returns false for null', () => {
    expect(isOverdue(null)).toBe(false)
  })
  it('returns false for undefined', () => {
    expect(isOverdue(undefined)).toBe(false)
  })
  it('returns true for a past date', () => {
    expect(isOverdue('2000-01-01')).toBe(true)
  })
  it('returns false for a future date', () => {
    expect(isOverdue('2099-12-31')).toBe(false)
  })
})

describe('getInitials', () => {
  it('returns initials for a full name', () => {
    expect(getInitials('Alex Johnson')).toBe('AJ')
  })
  it('returns first two chars for single name', () => {
    expect(getInitials('Alex')).toBe('AL')
  })
  it('falls back to email', () => {
    expect(getInitials(null, 'user@example.com')).toBe('US')
  })
  it('returns NA when both are null', () => {
    expect(getInitials(null, null)).toBe('NA')
  })
  it('uppercases the result', () => {
    expect(getInitials('anna brown')).toBe('AB')
  })
})

describe('getSprintProgress', () => {
  it('returns 0 for empty tasks array', () => {
    expect(getSprintProgress([])).toBe(0)
  })
  it('returns 100 when all tasks are done', () => {
    const tasks = [
      { status: 'done' as const },
      { status: 'done' as const },
    ]
    expect(getSprintProgress(tasks)).toBe(100)
  })
  it('returns 50 when half tasks are done', () => {
    const tasks = [
      { status: 'done' as const },
      { status: 'backlog' as const },
    ]
    expect(getSprintProgress(tasks)).toBe(50)
  })
  it('returns 0 when no tasks are done', () => {
    const tasks = [
      { status: 'backlog' as const },
      { status: 'in_progress' as const },
    ]
    expect(getSprintProgress(tasks)).toBe(0)
  })
  it('rounds the result', () => {
    const tasks = [
      { status: 'done' as const },
      { status: 'backlog' as const },
      { status: 'backlog' as const },
    ]
    expect(getSprintProgress(tasks)).toBe(33)
  })
})

describe('getPriorityColor', () => {
  it('returns red classes for high priority', () => {
    expect(getPriorityColor('high')).toContain('red')
  })
  it('returns amber classes for medium priority', () => {
    expect(getPriorityColor('medium')).toContain('amber')
  })
  it('returns emerald classes for low priority', () => {
    expect(getPriorityColor('low')).toContain('emerald')
  })
})

describe('getStatusColor', () => {
  it('returns slate classes for backlog', () => {
    expect(getStatusColor('backlog')).toContain('slate')
  })
  it('returns blue classes for in_progress', () => {
    expect(getStatusColor('in_progress')).toContain('blue')
  })
  it('returns violet classes for in_review', () => {
    expect(getStatusColor('in_review')).toContain('violet')
  })
  it('returns emerald classes for done', () => {
    expect(getStatusColor('done')).toContain('emerald')
  })
})

describe('getSprintStatusColor', () => {
  it('returns slate classes for planned', () => {
    expect(getSprintStatusColor('planned')).toContain('slate')
  })
  it('returns blue classes for active', () => {
    expect(getSprintStatusColor('active')).toContain('blue')
  })
  it('returns emerald classes for completed', () => {
    expect(getSprintStatusColor('completed')).toContain('emerald')
  })
})
