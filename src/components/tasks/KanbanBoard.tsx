import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import type { Task, TaskStatus } from '../../types'
import { TASK_STATUSES } from '../../types'
import { KanbanColumn } from './KanbanColumn'
import { useUpdateTaskStatus } from '../../hooks/useTasks'

const COLUMN_ACCENTS: Record<TaskStatus, string> = {
  backlog: 'bg-slate-500',
  in_progress: 'bg-blue-500',
  in_review: 'bg-violet-500',
  done: 'bg-emerald-500',
}

interface KanbanBoardProps {
  tasks: Task[]
  sprintId: string
}

export function KanbanBoard({ tasks, sprintId }: KanbanBoardProps) {
  const updateStatus = useUpdateTaskStatus()

  // Build an allowlist of valid status values from the canonical TASK_STATUSES array
  const VALID_STATUSES = new Set(TASK_STATUSES.map((s) => s.value))

  function onDragEnd(result: DropResult) {
    const { destination, draggableId } = result
    if (!destination) return

    const newStatus = destination.droppableId as TaskStatus

    // Guard: reject any droppableId that isn't a real TaskStatus
    if (!VALID_STATUSES.has(newStatus)) return

    const task = tasks.find((t) => t.id === draggableId)
    if (!task || task.status === newStatus) return

    updateStatus.mutate({ id: draggableId, status: newStatus })
  }

  const tasksByStatus = TASK_STATUSES.reduce<Record<TaskStatus, Task[]>>(
    (acc, { value }) => {
      acc[value] = tasks.filter((t) => t.status === value)
      return acc
    },
    { backlog: [], in_progress: [], in_review: [], done: [] }
  )

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
        {TASK_STATUSES.map(({ value, label }) => (
          <KanbanColumn
            key={value}
            status={value}
            label={label}
            tasks={tasksByStatus[value]}
            sprintId={sprintId}
            accentColor={COLUMN_ACCENTS[value]}
          />
        ))}
      </div>
    </DragDropContext>
  )
}
