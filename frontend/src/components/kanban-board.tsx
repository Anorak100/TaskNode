import React, { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanColumn } from './kanban-column'
import { type Task, TaskCard } from './task-card'

const DUMMY_TASKS: Task[] = [
  { id: '1', title: 'Design the new landing page', status: 'todo' },
  { id: '2', title: 'Set up database schema', status: 'todo' },
  { id: '3', title: 'Build the frontend Kanban board', status: 'in-progress' },
  { id: '4', title: 'Create project repository', status: 'done' },
  { id: '5', title: 'Configure Tailwind CSS', status: 'done' },
]

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.type === 'Task') {
      setActiveTask(active.data.current.task)
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveTask = active.data.current?.type === 'Task'
    const isOverTask = over.data.current?.type === 'Task'
    const isOverColumn = over.data.current?.type === 'Column'

    if (!isActiveTask) return

    // Dropping a task over another task
    if (isActiveTask && isOverTask) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((t) => t.id === activeId)
        const overIndex = prevTasks.findIndex((t) => t.id === overId)

        const newTasks = [...prevTasks]
        const activeTask = { ...newTasks[activeIndex] }

        if (activeTask.status !== newTasks[overIndex].status) {
          activeTask.status = newTasks[overIndex].status
          newTasks[activeIndex] = activeTask
          return arrayMove(newTasks, activeIndex, overIndex)
        }

        return arrayMove(newTasks, activeIndex, overIndex)
      })
    }

    // Dropping a task in an empty column
    if (isActiveTask && isOverColumn) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((t) => t.id === activeId)
        const newTasks = [...prevTasks]
        const activeTask = { ...newTasks[activeIndex] }
        activeTask.status = over.data.current?.status
        newTasks[activeIndex] = activeTask
        return arrayMove(newTasks, activeIndex, activeIndex)
      })
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
  }

  const todoTasks = tasks.filter((t) => t.status === 'todo')
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress')
  const doneTasks = tasks.filter((t) => t.status === 'done')

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto h-full pb-4">
        <KanbanColumn title="To Do" status="todo" tasks={todoTasks} />
        <KanbanColumn title="In Progress" status="in-progress" tasks={inProgressTasks} />
        <KanbanColumn title="Done" status="done" tasks={doneTasks} />
      </div>
      
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
