import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Sprint, SprintStatus } from '../types'
import { useAuth } from '../contexts/AuthContext'

const QUERY_KEY = 'sprints'

async function fetchSprints(): Promise<Sprint[]> {
  const { data, error } = await supabase
    .from('sprints')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Sprint[]
}

async function fetchSprintById(id: string): Promise<Sprint> {
  const { data, error } = await supabase
    .from('sprints')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Sprint
}

export interface CreateSprintPayload {
  title: string
  goal?: string
  start_date: string
  end_date: string
  status?: SprintStatus
}

export interface UpdateSprintPayload extends Partial<CreateSprintPayload> {
  id: string
}

export function useSprints() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: fetchSprints })
}

export function useSprint(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => fetchSprintById(id),
    enabled: !!id,
  })
}

export function useCreateSprint() {
  const qc = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (payload: CreateSprintPayload) => {
      const { data, error } = await supabase
        .from('sprints')
        .insert({ ...payload, created_by: user!.id })
        .select()
        .single()
      if (error) throw error
      return data as Sprint
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useUpdateSprint() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateSprintPayload) => {
      const { data, error } = await supabase
        .from('sprints')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Sprint
    },
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      qc.invalidateQueries({ queryKey: [QUERY_KEY, updated.id] })
    },
  })
}

export function useDeleteSprint() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sprints').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}
