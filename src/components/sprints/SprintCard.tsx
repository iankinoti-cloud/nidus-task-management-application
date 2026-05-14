import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Target, Trash2, Edit2, ArrowRight } from 'lucide-react'
import type { Sprint, Task } from '../../types'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { Modal } from '../ui/Modal'
import { SprintForm } from './SprintForm'
import { formatDate, getSprintProgress, getSprintStatusColor } from '../../lib/utils'
import { useDeleteSprint } from '../../hooks/useSprints'
import { useAuth } from '../../contexts/AuthContext'

interface SprintCardProps {
  sprint: Sprint
  tasks?: Task[]
}

export function SprintCard({ sprint, tasks = [] }: SprintCardProps) {
  const { user } = useAuth()
  const deleteSprint = useDeleteSprint()
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const progress = getSprintProgress(tasks)
  const isOwner = user?.id === sprint.created_by

  function handleDelete() {
    deleteSprint.mutate(sprint.id, {
      onSuccess: () => setConfirmDelete(false),
    })
  }

  return (
    <>
      <div className="nidus-card p-5 hover:border-slate-700 transition-colors flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={getSprintStatusColor(sprint.status)}>
                {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
              </Badge>
              <span className="text-xs text-slate-500">{tasks.length} tasks</span>
            </div>
            <h3 className="text-base font-semibold text-white truncate">{sprint.title}</h3>
          </div>
          {isOwner && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setEditOpen(true)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                aria-label="Edit sprint"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                aria-label="Delete sprint"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Goal */}
        {sprint.goal && (
          <div className="flex items-start gap-2 text-sm text-slate-400">
            <Target size={13} className="mt-0.5 flex-shrink-0 text-violet-400" />
            <p className="line-clamp-2">{sprint.goal}</p>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar size={12} />
          <span>{formatDate(sprint.start_date)}</span>
          <span>→</span>
          <span>{formatDate(sprint.end_date)}</span>
        </div>

        {/* Progress */}
        <ProgressBar value={progress} showLabel />

        {/* CTA */}
        <Link
          to={`/sprints/${sprint.id}`}
          className="flex items-center justify-between text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors group"
        >
          <span>View board</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Sprint">
        <SprintForm
          defaultValues={sprint}
          onSuccess={() => setEditOpen(false)}
          submitLabel="Save changes"
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete Sprint"
        size="sm"
      >
        <p className="text-sm text-slate-400 mb-5">
          Are you sure you want to delete <strong className="text-white">{sprint.title}</strong>?
          This will also delete all tasks in this sprint. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setConfirmDelete(false)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteSprint.isPending}
            className="btn-danger"
          >
            {deleteSprint.isPending ? 'Deleting…' : 'Delete sprint'}
          </button>
        </div>
      </Modal>
    </>
  )
}
