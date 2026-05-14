import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Task, TaskStatus, TaskPriority } from '../types'
import { useAuth } from '../contexts/AuthContext'

const QUERY_KEY = 'tasks'

async function fetchTasksBySprintId(sprintId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, assignee:profiles!tasks_assignee_id_fkey(id, email, full_name, avatar_url)')
    .eq('sprint_id', sprintId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as Task[]
}

export interface CreateTaskPayload {
  sprint_id: string
  title: string
  description?: string
  assignee_id?: string | null
  priority?: TaskPriority
  status?: TaskStatus
  due_date?: string | null
}

export interface UpdateTaskPayload {
  id: string
  sprint_id?: string
  title?: string
  description?: string | null
  assignee_id?: string | null
  priority?: TaskPriority
  status?: TaskStatus
  due_date?: string | null
}

export function useTasks(sprintId: string) {
  return useQuery({
    queryKey: [QUERY_KEY, sprintId],
    queryFn: () => fetchTasksBySprintId(sprintId),
    enabled: !!sprintId,
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...payload, created_by: user!.id })
        .select('*, assignee:profiles!tasks_assignee_id_fkey(id, email, full_name, avatar_url)')
        .single()
      if (error) throw error
      return data as Task
    },
    onSuccess: (task) => qc.invalidateQueries({ queryKey: [QUERY_KEY, task.sprint_id] }),
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateTaskPayload) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(payload)
        .eq('id', id)
        .select('*, assignee:profiles!tasks_assignee_id_fkey(id, email, full_name, avatar_url)')
        .single()
      if (error) throw error
      return data as Task
    },
    onSuccess: (task) => qc.invalidateQueries({ queryKey: [QUERY_KEY, task.sprint_id] }),
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, sprintId }: { id: string; sprintId: string }) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
      return sprintId
    },
    onSuccess: (sprintId) => qc.invalidateQueries({ queryKey: [QUERY_KEY, sprintId] }),
  })
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id)
        .select('sprint_id')
        .single()
      if (error) throw error
      return data as { sprint_id: string }
    },
    onSuccess: ({ sprint_id }) => qc.invalidateQueries({ queryKey: [QUERY_KEY, sprint_id] }),
  })
}
