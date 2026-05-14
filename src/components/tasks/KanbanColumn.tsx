import { useState } from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import type { Task, TaskStatus } from '../../types'
import { TaskCard } from './TaskCard'
import { Modal } from '../ui/Modal'
import { TaskForm } from './TaskForm'
import { cn } from '../../lib/utils'

interface KanbanColumnProps {
  status: TaskStatus
  label: string
  tasks: Task[]
  sprintId: string
  accentColor: string
}

export function KanbanColumn({ status, label, tasks, sprintId, accentColor }: KanbanColumnProps) {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col min-w-[280px] w-[280px] shrink-0">
        {/* Column header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className={cn('h-2 w-2 rounded-full', accentColor)} />
            <h3 className="text-sm font-semibold text-slate-200">{label}</h3>
            <span className="text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-full">
              {tasks.length}
            </span>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="p-1 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-slate-800 transition-colors"
            aria-label={`Add task to ${label}`}
          >
            <Plus size={15} />
          </button>
        </div>

        {/* Drop zone */}
        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                'flex flex-col gap-2.5 min-h-[200px] p-2 rounded-xl transition-colors duration-200',
                snapshot.isDraggingOver
                  ? 'bg-slate-800/60 border border-dashed border-slate-600'
                  : 'bg-slate-900/30'
              )}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      className="group"
                    >
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {tasks.length === 0 && !snapshot.isDraggingOver && (
                <div className="flex-1 flex items-center justify-center py-8">
                  <p className="text-xs text-slate-600 italic">No tasks yet</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title={`Add task to ${label}`}>
        <TaskForm
          sprintId={sprintId}
          defaultValues={{ status }}
          onSuccess={() => setAddOpen(false)}
        />
      </Modal>
    </>
  )
}
