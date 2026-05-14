import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Target, Edit2, Plus } from 'lucide-react'
import { useSprint } from '../hooks/useSprints'
import { useTasks } from '../hooks/useTasks'
import { KanbanBoard } from '../components/tasks/KanbanBoard'
import { Spinner } from '../components/ui/Spinner'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Modal } from '../components/ui/Modal'
import { SprintForm } from '../components/sprints/SprintForm'
import { TaskForm } from '../components/tasks/TaskForm'
import { formatDate, getSprintProgress, getSprintStatusColor } from '../lib/utils'
import { useAuth } from '../contexts/AuthContext'

export function SprintDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { data: sprint, isLoading: sprintLoading } = useSprint(id!)
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(id!)

  const [editSprintOpen, setEditSprintOpen] = useState(false)
  const [addTaskOpen, setAddTaskOpen] = useState(false)

  const isOwner = sprint?.created_by === user?.id
  const progress = getSprintProgress(tasks)

  if (sprintLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!sprint) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-400 mb-4">Sprint not found.</p>
        <Link to="/dashboard" className="btn-secondary">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Back link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={15} />
          Dashboard
        </Link>

        {/* Sprint header */}
        <div className="nidus-card p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-2">
                <Badge className={getSprintStatusColor(sprint.status)}>
                  {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
                </Badge>
                <span className="text-xs text-slate-500">{tasks.length} tasks</span>
              </div>
              <h1 className="text-xl font-bold text-white mb-3">{sprint.title}</h1>

              {sprint.goal && (
                <div className="flex items-start gap-2 text-sm text-slate-400 mb-4">
                  <Target size={13} className="mt-0.5 flex-shrink-0 text-violet-400" />
                  <p>{sprint.goal}</p>
                </div>
              )}

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar size={12} />
                  <span>{formatDate(sprint.start_date)} → {formatDate(sprint.end_date)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setAddTaskOpen(true)}
                className="btn-primary"
              >
                <Plus size={14} />
                Add task
              </button>
              {isOwner && (
                <button
                  onClick={() => setEditSprintOpen(true)}
                  className="btn-secondary"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-800">
            <ProgressBar value={progress} showLabel />
          </div>
        </div>

        {/* Kanban board */}
        {tasksLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <KanbanBoard tasks={tasks} sprintId={sprint.id} />
        )}
      </div>

      {/* Edit Sprint Modal */}
      <Modal isOpen={editSprintOpen} onClose={() => setEditSprintOpen(false)} title="Edit Sprint">
        <SprintForm
          defaultValues={sprint}
          onSuccess={() => setEditSprintOpen(false)}
          submitLabel="Save changes"
        />
      </Modal>

      {/* Add Task Modal */}
      <Modal isOpen={addTaskOpen} onClose={() => setAddTaskOpen(false)} title="Add Task">
        <TaskForm
          sprintId={sprint.id}
          onSuccess={() => setAddTaskOpen(false)}
        />
      </Modal>
    </>
  )
}
