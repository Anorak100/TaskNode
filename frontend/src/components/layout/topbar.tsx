import { useEffect, useRef, useState } from "react"
import { Menu, Search, Plus, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NotificationsDropdown } from "@/components/layout/notifications-dropdown"
import { cn } from "@/lib/utils"
import { getProjectIcon } from "@/lib/icons"
import { searchWorkspace, type SearchResults } from "@/lib/search"
import { Badge } from "@/components/ui/badge"

const STATUS_META = {
  TODO: { label: "To Do", variant: "secondary" as const },
  IN_PROGRESS: { label: "In Progress", variant: "warning" as const },
  DONE: { label: "Done", variant: "success" as const },
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounced search logic
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        const data = await searchWorkspace(trimmed)
        setResults(data)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Failed to search")
      } finally {
        setIsLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const handleProjectClick = (projectId: string) => {
    setOpen(false)
    setQuery("")
    navigate(`/projects/${projectId}/tasks`)
  }

  const handleTaskClick = (projectId: string, taskId: string) => {
    setOpen(false)
    setQuery("")
    navigate(`/projects/${projectId}/tasks?task=${taskId}`)
  }

  const hasResults = results && (results.projects.length > 0 || results.tasks.length > 0)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6 md:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
          {/* Can put a breadcrumb or title here if needed */}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div ref={containerRef} className="relative w-full max-w-[12rem] sm:max-w-[14rem] md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search..."
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            className="h-9 w-full rounded-full border-transparent bg-secondary/50 pl-9 focus-visible:bg-background focus-visible:ring-primary text-sm"
          />

          {open && (query.trim() || isLoading) ? (
            <div className="absolute right-0 top-full z-50 mt-2 w-[320px] sm:w-[380px] overflow-hidden rounded-2xl border bg-card/95 p-2 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-card/85 animate-in fade-in slide-in-from-top-2 duration-200">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Searching...</span>
                </div>
              ) : error ? (
                <div className="px-4 py-6 text-center text-sm text-destructive">{error}</div>
              ) : !hasResults ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No projects or tasks found matching "{query}"
                </div>
              ) : (
                <div className="max-h-[320px] overflow-y-auto space-y-4 p-1">
                  {results.projects.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Projects
                      </div>
                      <div className="space-y-0.5">
                        {results.projects.map((project) => {
                          const projectIcon = getProjectIcon(project.icon)
                          const ProjectIconComp = projectIcon.icon
                          return (
                            <button
                              key={project.id}
                              onClick={() => handleProjectClick(project.id)}
                              className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-colors hover:bg-secondary/70 focus-visible:bg-secondary/70 outline-none cursor-pointer"
                            >
                              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white", projectIcon.bg)}>
                                <ProjectIconComp className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold truncate">{project.name}</div>
                                {project.description && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {project.description}
                                  </div>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {results.tasks.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Tasks
                      </div>
                      <div className="space-y-0.5">
                        {results.tasks.map((task) => {
                          const status = STATUS_META[task.status] || STATUS_META.TODO
                          return (
                            <button
                              key={task.id}
                              onClick={() => handleTaskClick(task.projectId, task.id)}
                              className="flex w-full flex-col gap-1 rounded-xl px-2.5 py-2 text-left text-sm transition-colors hover:bg-secondary/70 focus-visible:bg-secondary/70 outline-none cursor-pointer"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="font-semibold truncate">{task.title}</div>
                                <Badge variant={status.variant} className="shrink-0 text-[9px] uppercase tracking-wider py-0 px-1.5">
                                  {status.label}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="truncate">in {task.project?.name || "project"}</span>
                                {task.dueDate && (
                                  <span className="shrink-0">
                                    Due {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(task.dueDate))}
                                  </span>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <NotificationsDropdown />

        <Button
          className="hidden h-9 gap-2 rounded-full px-4 font-medium sm:inline-flex cursor-pointer"
          onClick={() => navigate("/projects/new")}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">New Project</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full sm:hidden"
          aria-label="Create new project"
          onClick={() => navigate("/projects/new")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
