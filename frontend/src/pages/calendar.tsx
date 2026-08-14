import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAllTasks, type TaskRecord } from "@/lib/tasks"

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState<(TaskRecord & { project?: { name: string } })[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getAllTasks()
      .then(data => {
        setTasks(data)
        setError(null)
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  const monthYearStr = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(currentDate)

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Filter tasks that are not done and have a dueDate
  const activeTasks = useMemo(() => {
    return tasks.filter(t => t.status !== "DONE" && t.dueDate)
  }, [tasks])

  // Map of YYYY-MM-DD -> task count
  const taskCountsByDate = useMemo(() => {
    const map = new Map<string, number>()
    activeTasks.forEach(t => {
      // Due dates from the backend are ISO strings like 2024-05-15T00:00:00.000Z
      const dateStr = t.dueDate!.substring(0, 10)
      map.set(dateStr, (map.get(dateStr) || 0) + 1)
    })
    return map
  }, [activeTasks])

  // Calendar logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const calendarDays = []
  
  // Padding for previous month
  const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i),
      isCurrentMonth: false,
    })
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
      isCurrentMonth: true,
    })
  }

  // Padding for next month (to fill 6 rows = 42 days)
  const remainingDays = 42 - calendarDays.length
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
      isCurrentMonth: false,
    })
  }

  // For correctly comparing today, we construct the local date string
  const todayDate = new Date()
  const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1">Track your upcoming task deadlines.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold min-w-[150px] text-center">{monthYearStr}</span>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>Today</Button>
        </div>
      </div>

      {error && <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}

      {isLoading && <p className="text-sm text-muted-foreground">Loading calendar…</p>}

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid grid-cols-7 gap-px rounded-t-xl bg-slate-200 dark:bg-slate-800">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="bg-white dark:bg-slate-950 p-3 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 border-x border-b rounded-b-xl overflow-hidden">
          {calendarDays.map((cDay, i) => {
            const year = cDay.date.getFullYear()
            const month = String(cDay.date.getMonth() + 1).padStart(2, '0')
            const day = String(cDay.date.getDate()).padStart(2, '0')
            const dateStr = `${year}-${month}-${day}`
            const taskCount = taskCountsByDate.get(dateStr) || 0
            const isToday = dateStr === todayStr

            return (
              <div 
                key={i} 
                className={`min-h-[120px] bg-white p-3 transition-colors hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 ${!cDay.isCurrentMonth ? 'opacity-40 bg-slate-50/50 dark:bg-slate-950/50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${isToday ? 'bg-blue-600 text-white' : ''}`}>
                    {cDay.date.getDate()}
                  </span>
                </div>
                {taskCount > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-1.5 text-xs font-medium text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-500"></div>
                      {taskCount} {taskCount === 1 ? 'task due' : 'tasks due'}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
