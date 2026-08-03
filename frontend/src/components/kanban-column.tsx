import { useMemo } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { TaskCard } from './task-card'
import type { Task } from './task-card'

type KanbanColumnProps = {
  title: string
  status: 'todo' | 'in-progress' | 'done'
  tasks: Task[]
}

export function KanbanColumn({ title, status, tasks }: KanbanColumnProps) {
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks])

  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status,
    },
  })

  return (
    <div className="flex-shrink-0 w-80 bg-secondary/50 rounded-lg p-3 flex flex-col gap-3 max-h-full overflow-y-auto">
      <h3 className="font-semibold px-1 sticky top-0 bg-secondary/50 backdrop-blur z-10 py-1">{title}</h3>
      <div ref={setNodeRef} className="flex flex-col gap-2 min-h-[150px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
