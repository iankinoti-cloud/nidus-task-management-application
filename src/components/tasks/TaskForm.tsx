import { useState } from 'react'
import type { Task, TaskPriority, TaskStatus } from '../../types'
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks'
import { useProfiles } from '../../hooks/useProfiles'

interface TaskFormProps {
  sprintId: string
  defaultValues?: Partial<Task>
  onSuccess: () => void
  submitLabel?: string
}

export function TaskForm({
  sprintId,
  defaultValues,
  onSuccess,
  submitLabel = 'Create task',
}: TaskFormProps) {
  const isEdit = !!defaultValues?.id
  const create = useCreateTask()
  const update = useUpdateTask()
  const { data: profiles } = useProfiles()

  const [title, setTitle] = useState(defaultValues?.title ?? '')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [assigneeId, setAssigneeId] = useState<string>(defaultValues?.assignee_id ?? '')
  const [priority, setPriority] = useState<TaskPriority>(defaultValues?.priority ?? 'medium')
  const [status, setStatus] = useState<TaskStatus>(defaultValues?.status ?? 'backlog')
  const [dueDate, setDueDate] = useState(defaultValues?.due_date ?? '')
  const [error, setError] = useState('')

  const isPending = create.isPending || update.isPending

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!title.trim()) return setError('Title is required.')

    const payload = {
      sprint_id: sprintId,
      title: title.trim(),
      description: description.trim() || undefined,
      assignee_id: assigneeId || null,
      priority,
      status,
      due_date: dueDate || null,
    }

    try {
      if (isEdit && defaultValues?.id) {
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
        <label htmlFor="task-title" className="nidus-label">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Implement login page"
          className="nidus-input"
          required
          maxLength={200}
        />
      </div>

      <div>
        <label htmlFor="task-desc" className="nidus-label">
          Description
        </label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details…"
          rows={3}
          className="nidus-input resize-none"
          maxLength={2000}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="task-priority" className="nidus-label">
            Priority
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="nidus-input"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="task-status" className="nidus-label">
            Status
          </label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="nidus-input"
          >
            <option value="backlog">Backlog</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="task-assignee" className="nidus-label">
            Assignee
          </label>
          <select
            id="task-assignee"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="nidus-input"
          >
            <option value="">Unassigned</option>
            {profiles?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name ?? p.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="task-due" className="nidus-label">
            Due date
          </label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="nidus-input"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
