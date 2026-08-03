import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export type Task = {
  id: string
  title: string
  status: 'todo' | 'in-progress' | 'done'
}

type TaskCardProps = {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-card text-card-foreground shadow-sm rounded-md p-3 border opacity-50 cursor-grabbing"
      >
        <p className="text-sm invisible">{task.title}</p>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card text-card-foreground shadow-sm rounded-md p-3 border hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing touch-none"
    >
      <p className="text-sm">{task.title}</p>
    </div>
  )
}
