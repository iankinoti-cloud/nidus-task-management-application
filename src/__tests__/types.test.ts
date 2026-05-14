import { describe, it, expect } from 'vitest'
import { TASK_STATUSES, TASK_PRIORITIES, SPRINT_STATUSES } from '../types'

describe('TASK_STATUSES', () => {
  it('has 4 statuses', () => {
    expect(TASK_STATUSES).toHaveLength(4)
  })
  it('starts with backlog', () => {
    expect(TASK_STATUSES[0].value).toBe('backlog')
  })
  it('ends with done', () => {
    expect(TASK_STATUSES[3].value).toBe('done')
  })
  it('has label for each status', () => {
    TASK_STATUSES.forEach(({ label }) => {
      expect(typeof label).toBe('string')
      expect(label.length).toBeGreaterThan(0)
    })
  })
})

describe('TASK_PRIORITIES', () => {
  it('has 3 priorities', () => {
    expect(TASK_PRIORITIES).toHaveLength(3)
  })
  it('contains low, medium, high', () => {
    const values = TASK_PRIORITIES.map((p) => p.value)
    expect(values).toContain('low')
    expect(values).toContain('medium')
    expect(values).toContain('high')
  })
  it('each priority has a color class', () => {
    TASK_PRIORITIES.forEach(({ color }) => {
      expect(typeof color).toBe('string')
      expect(color.length).toBeGreaterThan(0)
    })
  })
})

describe('SPRINT_STATUSES', () => {
  it('has 3 statuses', () => {
    expect(SPRINT_STATUSES).toHaveLength(3)
  })
  it('contains planned, active, completed', () => {
    const values = SPRINT_STATUSES.map((s) => s.value)
    expect(values).toContain('planned')
    expect(values).toContain('active')
    expect(values).toContain('completed')
  })
})
