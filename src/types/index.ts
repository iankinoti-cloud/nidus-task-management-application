export type SprintStatus = 'planned' | 'active' | 'completed'
export type TaskStatus = 'backlog' | 'in_progress' | 'in_review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export interface Sprint {
  id: string
  title: string
  goal: string | null
  start_date: string
  end_date: string
  status: SprintStatus
  created_by: string
  created_at: string
}

export interface Task {
  id: string
  sprint_id: string
  title: string
  description: string | null
  assignee_id: string | null
  priority: TaskPriority
  status: TaskStatus
  due_date: string | null
  created_by: string
  created_at: string
  assignee?: Profile | null
}

export interface SprintWithTasks extends Sprint {
  tasks: Task[]
}

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'done', label: 'Done' },
]

export const TASK_PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-emerald-400' },
  { value: 'medium', label: 'Medium', color: 'text-amber-400' },
  { value: 'high', label: 'High', color: 'text-red-400' },
]

export const SPRINT_STATUSES: { value: SprintStatus; label: string }[] = [
  { value: 'planned', label: 'Planned' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]
