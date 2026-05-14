import { useState } from 'react'
import { Calendar, Pencil, Trash2, AlertCircle } from 'lucide-react'
import type { Task } from '../../types'
import { Badge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'
import { Modal } from '../ui/Modal'
import { TaskForm } from './TaskForm'
import { formatDate, getPriorityColor, isOverdue } from '../../lib/utils'
import { useDeleteTask } from '../../hooks/useTasks'
import { useAuth } from '../../contexts/AuthContext'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const { user } = useAuth()
  const deleteTask = useDeleteTask()
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isOwner = user?.id === task.created_by
  const overdue = isOverdue(task.due_date) && task.status !== 'done'

  function handleDelete() {
    deleteTask.mutate(
      { id: task.id, sprintId: task.sprint_id },
      { onSuccess: () => setConfirmDelete(false) }
    )
  }

  return (
    <>
      <div className="nidus-card p-3.5 hover:border-slate-700 transition-colors group">
        <div className="flex flex-col gap-2.5">
          {/* Priority badge + actions */}
          <div className="flex items-center justify-between">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            {isOwner && (
              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditOpen(true) }}
                  className="p-1 rounded text-slate-600 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                  aria-label="Edit task"
                >
                  <Pencil size={11} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
                  className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                  aria-label="Delete task"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <p className="text-sm font-medium text-slate-100 leading-snug">{task.title}</p>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-0.5">
            {task.due_date ? (
              <div
                className={`flex items-center gap-1 text-xs ${
                  overdue ? 'text-red-400' : 'text-slate-500'
                }`}
              >
                {overdue ? <AlertCircle size={11} /> : <Calendar size={11} />}
                {formatDate(task.due_date)}
              </div>
            ) : (
              <div />
            )}
            {task.assignee && (
              <Avatar
                name={task.assignee.full_name}
                email={task.assignee.email}
                avatarUrl={task.assignee.avatar_url}
                size="sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Task">
        <TaskForm
          sprintId={task.sprint_id}
          defaultValues={task}
          onSuccess={() => setEditOpen(false)}
          submitLabel="Save changes"
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete Task"
        size="sm"
      >
        <p className="text-sm text-slate-400 mb-5">
          Delete <strong className="text-white">{task.title}</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setConfirmDelete(false)} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleteTask.isPending} className="btn-danger">
            {deleteTask.isPending ? 'Deleting…' : 'Delete task'}
          </button>
        </div>
      </Modal>
    </>
  )
}
