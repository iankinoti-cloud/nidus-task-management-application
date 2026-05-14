import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types'

async function fetchProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    // Only fetch the columns needed by the UI; avoids over-fetching sensitive fields
    .select('id, email, full_name, avatar_url')
    .order('full_name', { ascending: true })
  if (error) throw error
  return data as Profile[]
}

export function useProfiles() {
  return useQuery({ queryKey: ['profiles'], queryFn: fetchProfiles })
}
