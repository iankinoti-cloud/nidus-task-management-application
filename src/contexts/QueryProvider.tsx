import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'

/**
 * Tuned for resilience under high concurrent load:
 *
 *  • staleTime 5 min   – data is considered fresh for 5 minutes, so rapid
 *                         page switches do NOT fire redundant Supabase requests.
 *  • gcTime 10 min     – inactive cache entries live for 10 minutes, keeping
 *                         frequently-visited pages snappy on return.
 *  • retry 2           – transient network errors are retried twice before
 *                         surfacing as errors, with exponential back-off.
 *  • refetchOnWindowFocus false – avoids a burst of requests every time a user
 *                         alt-tabs back, which can spike Supabase concurrency.
 *  • refetchOnReconnect true    – but DO re-validate when connectivity is restored.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      gcTime:    1000 * 60 * 10,     // 10 minutes
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000), // exponential back-off
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
