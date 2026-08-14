import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Filter, Plus, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  createTask,
  deleteTask,
  getProject,
  getProjectTasks,
  updateTask,
  type ProjectRecord,
  type TaskRecord,
  type TaskStatus,
} from "@/lib/tasks"

const statusTabs = ["All", "To Do", "In Progress", "Completed"] as const
const statusOrder: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"]

const statusMeta: Record<TaskStatus, { label: string; badgeVariant: string }> = {
  TODO: { label: "TODO", badgeVariant: "secondary" },
  IN_PROGRESS: { label: "IN_PROGRESS", badgeVariant: "warning" },
  DONE: { label: "DONE", badgeVariant: "success" },
}

function formatDueDate(value: string | null) {
  if (!value) return "No due date"
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value))
}

export function ProjectTasksPage() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const [project, setProject] = useState<ProjectRecord | null>(null)
  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null)
  const [activeTab, setActiveTab] = useState<(typeof statusTabs)[number]>("All")
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<"dueDate" | "title">("dueDate")
  const [error, setError] = useState<string | null>(null)
  const [showNewTask, setShowNewTask] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", status: "TODO" as TaskStatus, dueDate: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskRecord | null>(null)
  const [editForm, setEditForm] = useState({ title: "", description: "", status: "TODO" as TaskStatus, dueDate: "" })

  const loadData = async () => {
    if (!projectId) return

    try {
      const [projectData, taskData] = await Promise.all([getProject(projectId), getProjectTasks(projectId)])
      setProject(projectData)
      setTasks(taskData)
      setSelectedTask((current) => {
        if (current && taskData.some((task) => task.id === current.id)) return current
        return taskData[0] ?? null
      })
      setError(null)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load project tasks")
    }
  }

  useEffect(() => {
    void loadData()
  }, [projectId])

  const completedCount = useMemo(() => tasks.filter((task) => task.status === "DONE").length, [tasks])
  const totalCount = tasks.length
  const completedPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (activeTab === "To Do" && task.status !== "TODO") return false
        if (activeTab === "In Progress" && task.status !== "IN_PROGRESS") return false
        if (activeTab === "Completed" && task.status !== "DONE") return false
        return task.title.toLowerCase().includes(search.toLowerCase()) || (task.description ?? "").toLowerCase().includes(search.toLowerCase())
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title)
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        
      })
  }, [tasks, activeTab, search, sortBy])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!projectId || !form.title.trim()) return

    try {
      setIsSubmitting(true)
      await createTask(projectId, {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        status: form.status,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      })
      setForm({ title: "", description: "", status: "TODO", dueDate: "" })
      setShowNewTask(false)
      await loadData()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingTask || !editForm.title.trim()) return

    try {
      setIsSubmitting(true)
      await updateTask(editingTask.id, {
        title: editForm.title.trim(),
        description: editForm.description.trim() || null,
        status: editForm.status,
        dueDate: editForm.dueDate ? new Date(editForm.dueDate).toISOString() : null,
      })
      setEditingTask(null)
      await loadData()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleStatus = async (task: TaskRecord) => {
    const nextStatus: TaskStatus = task.status === "DONE" ? "TODO" : "DONE"
    try {
      await updateTask(task.id, { status: nextStatus })
      await loadData()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update task")
    }
  }

  const removeTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      await loadData()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete task")
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="gap-2 pl-0 text-blue-600 hover:text-blue-700 hover:bg-transparent dark:text-blue-400 dark:hover:text-blue-300" 
          onClick={() => navigate("/", { replace: true })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.8fr_320px] 2xl:grid-cols-[1.8fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold">{project?.name ?? "Loading project..."}</h1>
                    <p className="text-sm text-muted-foreground">{project?.description || "Redesign and rebuild the company website with new branding."}</p>
                  </div>
                </div>
              </div>

              <Button onClick={() => setShowNewTask(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-6">
                  <div>{completedPercent}% Complete</div>
                  <div>{totalCount} Tasks</div>
                </div>
                <div className="text-sm text-muted-foreground">{completedCount} completed</div>
              </div>
              <div className="overflow-hidden rounded-full bg-slate-100 h-3 dark:bg-slate-800">
                <div className="h-3 rounded-full bg-blue-600" style={{ width: `${completedPercent}%` }} />
              </div>
            </div>
            
            <hr className="my-6 border-slate-200 dark:border-slate-800" />

            <div className="flex flex-wrap items-center justify-between gap-3 pb-5">
              <div className="flex flex-wrap gap-3">
                {statusTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                  >
                    {tab} {tab !== "All" ? `(${tasks.filter((task) => (tab === "To Do" ? task.status === "TODO" : tab === "In Progress" ? task.status === "IN_PROGRESS" : task.status === "DONE")).length})` : `(${totalCount})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {showNewTask ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between gap-3 pb-4">
                      <div>
                        <p className="text-sm font-semibold">Add new task</p>
                        <p className="text-sm text-muted-foreground">Create a task for this project.</p>
                      </div>
                      <Button variant="ghost" onClick={() => setShowNewTask(false)}>
                        Close
                      </Button>
                    </div>
                    <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Task title</label>
                        <Input
                          autoComplete="off"
                          value={form.title}
                          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                          placeholder="Design homepage"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                          autoComplete="off"
                          value={form.description}
                          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                          placeholder="Design the new homepage for the website with modern UI and improved UX."
                          className="min-h-28 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Status</label>
                          <select
                            value={form.status}
                            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TaskStatus }))}
                            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {statusOrder.map((status) => (
                              <option key={status} value={status}>
                                {statusMeta[status].label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Due date</label>
                          <div className="relative">
                            <Input
                              type="date"
                              autoComplete="off"
                              value={form.dueDate}
                              min={new Date().toISOString().split("T")[0]}
                              className={!form.dueDate ? "text-transparent" : ""}
                              onClick={(e) => {
                                try {
                                  (e.currentTarget as any).showPicker?.()
                                } catch (err) {}
                              }}
                              onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
                            />
                            {!form.dueDate && (
                              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                Select a date
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {error ? <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p> : null}
                      <div className="flex items-center gap-3">
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                          {isSubmitting ? "Creating..." : "Create task"}
                        </Button>
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNewTask(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : null}

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search tasks..."
                        className="pl-11"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" /> Filter
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => setSortBy(sortBy === "dueDate" ? "title" : "dueDate")}> 
                        <SlidersHorizontal className="h-4 w-4" /> Sort: {sortBy === "dueDate" ? "Due date" : "Title"}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                      <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                        <tr>
                          <th className="w-full px-5 py-4">Task</th>
                          <th className="whitespace-nowrap px-5 py-4">Status</th>
                          <th className="whitespace-nowrap px-5 py-4">Due Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
                        {filteredTasks.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">
                              No tasks found.
                            </td>
                          </tr>
                        ) : (
                          filteredTasks.map((task) => (
                            <tr
                              key={task.id}
                              className={`cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 ${selectedTask?.id === task.id ? "bg-slate-100 dark:bg-slate-900" : ""}`}
                              onClick={() => { setSelectedTask(task); setEditingTask(null); }}
                            >
                              <td className="px-5 py-4">
                                <div className="font-medium">{task.title}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1">{task.description || "No description"}</div>
                              </td>
                              <td className="px-5 py-4">
                                <Badge variant={statusMeta[task.status].badgeVariant as any} className="uppercase tracking-[0.15em] text-[10px]">
                                  {statusMeta[task.status].label}
                                </Badge>
                              </td>
                              <td className="px-5 py-4 text-muted-foreground">{task.dueDate ? formatDueDate(task.dueDate) : "—"}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <div className="h-full">
          <Card className="h-full border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Task details</CardTitle>
            </CardHeader>
            <CardContent>
              {editingTask ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Edit Task</h2>
                    <Button type="button" variant="ghost" onClick={() => setEditingTask(null)}>Cancel</Button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Task title</label>
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm((c) => ({ ...c, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm((c) => ({ ...c, description: e.target.value }))}
                      className="min-h-28 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm((c) => ({ ...c, status: e.target.value as TaskStatus }))}
                        className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {statusOrder.map((status) => (
                          <option key={status} value={status}>
                            {statusMeta[status].label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Due date</label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={editForm.dueDate}
                          min={new Date().toISOString().split("T")[0]}
                          className={!editForm.dueDate ? "text-transparent" : ""}
                          onClick={(e) => {
                            try {
                              (e.currentTarget as any).showPicker?.()
                            } catch (err) {}
                          }}
                          onChange={(e) => setEditForm((c) => ({ ...c, dueDate: e.target.value }))}
                        />
                        {!editForm.dueDate && (
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            Select a date
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </Button>
                </form>
              ) : selectedTask ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-xl font-semibold">{selectedTask.title}</h2>
                      <Badge variant={statusMeta[selectedTask.status].badgeVariant as any} className="uppercase tracking-[0.15em] text-[10px]">
                        {statusMeta[selectedTask.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedTask.description || "No description added yet."}</p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Project</span>
                        <span>{project?.name ?? "—"}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Due Date</span>
                        <span>{selectedTask.dueDate ? formatDueDate(selectedTask.dueDate) : "No due date"}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Status</span>
                        <span>{statusMeta[selectedTask.status].label}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Created</span>
                        <span>{new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(selectedTask.createdAt))}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <Button className="w-full" onClick={() => toggleStatus(selectedTask)}>
                      {selectedTask.status === "DONE" ? "Mark as pending" : "Mark as done"}
                    </Button>
                    <div className="flex gap-3">
                      <Button variant="outline" className="w-full" onClick={() => {
                        setEditingTask(selectedTask)
                        setEditForm({
                          title: selectedTask.title,
                          description: selectedTask.description || "",
                          status: selectedTask.status,
                          dueDate: selectedTask.dueDate ? selectedTask.dueDate.substring(0, 10) : "",
                        })
                      }}>
                        Edit task
                      </Button>
                      <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => removeTask(selectedTask.id)}>
                        Delete task
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select a task to view details.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
