import { useState } from 'react'
import { Plus, Zap } from 'lucide-react'
import { useSprints } from '../hooks/useSprints'
import { useTasks } from '../hooks/useTasks'
import { SprintCard } from '../components/sprints/SprintCard'
import { Modal } from '../components/ui/Modal'
import { SprintForm } from '../components/sprints/SprintForm'
import { Spinner } from '../components/ui/Spinner'
import { useAuth } from '../contexts/AuthContext'
import type { SprintStatus } from '../types'

const STATUS_TABS: { value: SprintStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'planned', label: 'Planned' },
  { value: 'completed', label: 'Completed' },
]

// Helper component to load tasks for a sprint and pass them to SprintCard
function SprintCardWithTasks({ sprint }: { sprint: import('../types').Sprint }) {
  const { data: tasks = [] } = useTasks(sprint.id)
  return <SprintCard sprint={sprint} tasks={tasks} />
}

export function Dashboard() {
  const { profile, user } = useAuth()
  const { data: sprints, isLoading, error } = useSprints()
  const [createOpen, setCreateOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<SprintStatus | 'all'>('all')

  const filteredSprints = (sprints ?? []).filter(
    (s) => statusFilter === 'all' || s.status === statusFilter
  )

  const displayName = profile?.full_name ?? user?.email ?? 'there'

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Hey, {displayName.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {sprints?.length ?? 0} sprint{sprints?.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="btn-primary self-start sm:self-auto"
          >
            <Plus size={15} />
            New sprint
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 border-b border-slate-800 -mb-4 overflow-x-auto scrollbar-hide">
          {STATUS_TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                statusFilter === value
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sprint grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-sm">Failed to load sprints. Please try again.</p>
          </div>
        ) : filteredSprints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-14 w-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Zap size={24} className="text-slate-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-300 mb-1">
              {statusFilter === 'all' ? 'No sprints yet' : `No ${statusFilter} sprints`}
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mb-6">
              {statusFilter === 'all'
                ? 'Create your first sprint to start tracking work for your team.'
                : `No sprints with "${statusFilter}" status found.`}
            </p>
            {statusFilter === 'all' && (
              <button onClick={() => setCreateOpen(true)} className="btn-primary">
                <Plus size={15} />
                Create your first sprint
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSprints.map((sprint) => (
              <SprintCardWithTasks key={sprint.id} sprint={sprint} />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create Sprint">
        <SprintForm onSuccess={() => setCreateOpen(false)} />
      </Modal>
    </>
  )
}
