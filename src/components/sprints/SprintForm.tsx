import { useState } from 'react'
import type { Sprint, SprintStatus } from '../../types'
import { useCreateSprint, useUpdateSprint } from '../../hooks/useSprints'

interface SprintFormProps {
  defaultValues?: Partial<Sprint>
  onSuccess: () => void
  submitLabel?: string
}

export function SprintForm({
  defaultValues,
  onSuccess,
  submitLabel = 'Create sprint',
}: SprintFormProps) {
  const isEdit = !!defaultValues?.id
  const create = useCreateSprint()
  const update = useUpdateSprint()

  const [title, setTitle] = useState(defaultValues?.title ?? '')
  const [goal, setGoal] = useState(defaultValues?.goal ?? '')
  const [startDate, setStartDate] = useState(defaultValues?.start_date ?? '')
  const [endDate, setEndDate] = useState(defaultValues?.end_date ?? '')
  const [status, setStatus] = useState<SprintStatus>(defaultValues?.status ?? 'planned')
  const [error, setError] = useState('')

  const isPending = create.isPending || update.isPending

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim()) return setError('Title is required.')
    if (!startDate) return setError('Start date is required.')
    if (!endDate) return setError('End date is required.')
    if (endDate < startDate) return setError('End date must be after start date.')

    const payload = {
      title: title.trim(),
      goal: goal.trim() || undefined,
      start_date: startDate,
      end_date: endDate,
      status,
    }

    try {
      if (isEdit && defaultValues.id) {
        await update.mutateAsync({ id: defaultValues.id, ...payload })
      } else {
        await create.mutateAsync(payload)
      }
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="sprint-title" className="nidus-label">
          Sprint title <span className="text-red-400">*</span>
        </label>
        <input
          id="sprint-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sprint 1 — Auth & Onboarding"
          className="nidus-input"
          required
        />
      </div>

      <div>
        <label htmlFor="sprint-goal" className="nidus-label">
          Sprint goal
        </label>
        <textarea
          id="sprint-goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="What do you want to achieve?"
          rows={2}
          className="nidus-input resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="sprint-start" className="nidus-label">
            Start date <span className="text-red-400">*</span>
          </label>
          <input
            id="sprint-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="nidus-input"
            required
          />
        </div>
        <div>
          <label htmlFor="sprint-end" className="nidus-label">
            End date <span className="text-red-400">*</span>
          </label>
          <input
            id="sprint-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="nidus-input"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="sprint-status" className="nidus-label">
          Status
        </label>
        <select
          id="sprint-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as SprintStatus)}
          className="nidus-input"
        >
          <option value="planned">Planned</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
