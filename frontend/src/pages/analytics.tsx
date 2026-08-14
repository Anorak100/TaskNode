import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  AlertCircle,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getProjectIcon } from "@/lib/icons"
import {
  getAnalyticsData,
  PERIOD_LABELS,
  type AnalyticsData,
  type AnalyticsPeriod,
  type CompletionTrendPoint,
} from "@/lib/analytics-data"

function TrendBadge({ value, positiveIsGood = true, periodLabel }: { value: number; positiveIsGood?: boolean; periodLabel: string }) {
  const isPositive = value >= 0
  const isGood = positiveIsGood ? isPositive : !isPositive

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <span className={cn("flex items-center font-bold", isGood ? "text-primary" : "text-destructive")}>
        {isPositive ? <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" /> : <ArrowDownRight className="mr-0.5 h-3.5 w-3.5" />}
        {Math.abs(value)}%
      </span>
      <span>from previous {periodLabel.replace(/^Last /, "").toLowerCase()}</span>
    </div>
  )
}

function AnalyticsStatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  positiveIsGood = true,
  periodLabel,
}: {
  title: string
  value: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
  trend: number
  positiveIsGood?: boolean
  periodLabel: string
}) {
  return (
    <Card className="rounded-[1.25rem] shadow-sm">
      <CardContent className="flex items-start gap-4 p-6">
        <div className={cn("shrink-0 rounded-2xl p-3", iconBg)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          <TrendBadge value={trend} positiveIsGood={positiveIsGood} periodLabel={periodLabel} />
        </div>
      </CardContent>
    </Card>
  )
}

function CompletionTrendChart({ data, totalCompleted }: { data: CompletionTrendPoint[]; totalCompleted: number }) {
  const [hoveredPoint, setHoveredPoint] = useState<(CompletionTrendPoint & { x: number; y: number }) | null>(null)
  const width = 640
  const height = 220
  const padding = { top: 20, right: 16, bottom: 32, left: 36 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const rawMaxY = Math.max(...data.map((d) => d.count), 0)
  // A stable scale keeps the chart readable as the selected period changes.
  const maxY = Math.max(100, Math.ceil(rawMaxY / 20) * 20)
  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartW
    const y = padding.top + chartH - (d.count / maxY) * chartH
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? padding.left} ${padding.top + chartH} L ${points[0]?.x ?? padding.left} ${padding.top + chartH} Z`

  const yTicks = Array.from({ length: 6 }, (_, i) => Math.round((maxY / 5) * i))
  const xLabels = data.filter((_, i) => i === 0 || i === data.length - 1 || i % 5 === 0)

  return (
    <div className="w-full overflow-x-auto">
      <div className="relative min-w-[480px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full">
        <defs>
          <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1059f3" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1059f3" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = padding.top + chartH - (tick / maxY) * chartH
          return (
            <g key={tick}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="currentColor" strokeOpacity="0.08" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-muted-foreground text-[10px]">
                {tick}
              </text>
            </g>
          )
        })}

        <path d={areaPath} fill="url(#completionGradient)" />
        <path d={linePath} fill="none" stroke="#1059f3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p) => (
            <g key={p.date}>
              <circle
                cx={p.x}
                cy={p.y}
                r="8"
                fill="transparent"
                className="cursor-pointer"
                tabIndex={0}
                aria-label={`${p.label}: ${p.count} tasks completed`}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
                onFocus={() => setHoveredPoint(p)}
                onBlur={() => setHoveredPoint(null)}
              />
              <circle cx={p.x} cy={p.y} r="4" fill="#1059f3" stroke="white" strokeWidth="2" className="pointer-events-none" />
            </g>
          ))}

        {xLabels.map((d) => {
          const i = data.indexOf(d)
          const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartW
          return (
            <text key={d.date} x={x} y={height - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">
              {d.label}
            </text>
          )
        })}
        </svg>

        {hoveredPoint ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-white shadow-lg"
            style={{ left: `${(hoveredPoint.x / width) * 100}%`, top: `${(hoveredPoint.y / height) * 100}%` }}
          >
            <p className="font-semibold">{hoveredPoint.label}</p>
            <p className="mt-0.5 text-slate-300">
              {hoveredPoint.count} task{hoveredPoint.count === 1 ? "" : "s"} completed
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          Tasks completed
        </div>
        <span className="font-medium text-foreground">Total completed: {totalCompleted}</span>
      </div>
    </div>
  )
}

function TaskStatusChart({
  status,
  total,
}: {
  status: AnalyticsData["taskStatus"]
  total: number
}) {
  const segments = [
    { key: "completed", label: "Completed", value: status.completed, color: "#10b981" },
    { key: "inProgress", label: "In Progress", value: status.inProgress, color: "#f59e0b" },
    { key: "todo", label: "Todo", value: status.todo, color: "#1059f3" },
    { key: "overdue", label: "Overdue", value: status.overdue, color: "#ef4444" },
  ].filter((s) => s.value > 0)

  const radius = 54
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative shrink-0">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="16" />
          {segments.map((segment) => {
            const dash = (segment.value / Math.max(total, 1)) * circumference
            const circle = (
              <circle
                key={segment.key}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="16"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 80 80)"
                strokeLinecap="butt"
              />
            )
            offset += dash
            return circle
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-xs text-muted-foreground">Total Tasks</span>
        </div>
      </div>

      <div className="w-full space-y-3 sm:max-w-[200px]">
        {segments.map((segment) => (
          <div key={segment.key} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
              <span className="text-muted-foreground">{segment.label}</span>
            </div>
            <span className="font-semibold">
              {segment.value}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                ({total === 0 ? 0 : ((segment.value / total) * 100).toFixed(1)}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActivityHeatmap({ heatmap }: { heatmap: AnalyticsData["activityHeatmap"] }) {
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const level = (count: number) => {
    if (count === 0) return "bg-slate-100 dark:bg-slate-800"
    const ratio = count / heatmap.maxCount
    if (ratio <= 0.25) return "bg-primary/20"
    if (ratio <= 0.5) return "bg-primary/40"
    if (ratio <= 0.75) return "bg-primary/65"
    return "bg-primary"
  }

  return (
    <div>
      <div className="mb-2 flex gap-2 pl-8 text-[10px] text-muted-foreground">
        {heatmap.weeks.map((week, i) => (
          <span key={i} className="flex-1 min-w-[12px]">
            {week.label}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-[3px] pt-0.5 text-[10px] text-muted-foreground">
          {dayLabels.map((day, i) => (
            <span key={day} className={cn("h-3 leading-3", i % 2 === 1 ? "opacity-0 sm:opacity-100" : "")}>
              {day}
            </span>
          ))}
        </div>
        <div className="flex flex-1 gap-[3px] overflow-x-auto">
          {heatmap.weeks.map((week, wi) => (
            <div key={wi} className="flex flex-1 flex-col gap-[3px] min-w-[12px]">
              {week.days.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} tasks`}
                  className={cn("aspect-square w-full min-h-3 rounded-[3px]", level(day.count))}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          {["bg-slate-100 dark:bg-slate-800", "bg-primary/20", "bg-primary/40", "bg-primary/65", "bg-primary"].map((c) => (
            <div key={c} className={cn("h-3 w-3 rounded-[3px]", c)} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

const UPCOMING_ITEMS = [
  { key: "today" as const, label: "Today", iconBg: "bg-blue-100 dark:bg-blue-900/40", iconColor: "text-blue-600 dark:text-blue-400" },
  { key: "tomorrow" as const, label: "Tomorrow", iconBg: "bg-amber-100 dark:bg-amber-900/40", iconColor: "text-amber-600 dark:text-amber-400" },
  { key: "thisWeek" as const, label: "This week", iconBg: "bg-emerald-100 dark:bg-emerald-900/40", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { key: "overdue" as const, label: "Overdue", iconBg: "bg-red-100 dark:bg-red-900/40", iconColor: "text-red-600 dark:text-red-400", destructive: true },
]

export function AnalyticsPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<AnalyticsPeriod>(30)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getAnalyticsData(period)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [period])

  // Overdue is a cross-cutting flag (an overdue task can also be in progress
  // or todo), so the donut must use the actual task total as its denominator.
  const totalForChart = data?.summary.totalTasks ?? 0

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-muted-foreground">Understand your productivity and project progress.</p>
        </div>

        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value) as AnalyticsPeriod)}
            className="h-10 appearance-none rounded-xl border border-input bg-background pl-10 pr-10 text-sm font-medium outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            {(Object.entries(PERIOD_LABELS) as unknown as [AnalyticsPeriod, string][]).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>
      ) : null}

      {isLoading || !data ? (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-[1.25rem] bg-secondary/60" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-80 animate-pulse rounded-2xl bg-secondary/60 lg:col-span-2" />
            <div className="h-80 animate-pulse rounded-2xl bg-secondary/60" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <AnalyticsStatCard
              title="Total Tasks"
              value={data.summary.totalTasks}
              icon={ClipboardList}
              iconBg="bg-blue-100 dark:bg-blue-900/40"
              iconColor="text-blue-600 dark:text-blue-400"
              trend={data.summary.trends.totalTasks}
              periodLabel={PERIOD_LABELS[data.period]}
            />
            <AnalyticsStatCard
              title="Completed"
              value={data.summary.completed}
              icon={CheckCircle2}
              iconBg="bg-emerald-100 dark:bg-emerald-900/40"
              iconColor="text-emerald-600 dark:text-emerald-400"
              trend={data.summary.trends.completed}
              periodLabel={PERIOD_LABELS[data.period]}
            />
            <AnalyticsStatCard
              title="In Progress"
              value={data.summary.inProgress}
              icon={Clock}
              iconBg="bg-amber-100 dark:bg-amber-900/40"
              iconColor="text-amber-600 dark:text-amber-400"
              trend={data.summary.trends.inProgress}
              periodLabel={PERIOD_LABELS[data.period]}
            />
            <AnalyticsStatCard
              title="Overdue"
              value={data.summary.overdue}
              icon={AlertCircle}
              iconBg="bg-red-100 dark:bg-red-900/40"
              iconColor="text-red-600 dark:text-red-400"
              trend={data.summary.trends.overdue}
              positiveIsGood={false}
              periodLabel={PERIOD_LABELS[data.period]}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="rounded-[1.25rem] shadow-sm lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">Completion Trend</CardTitle>
                <span className="text-xs font-medium text-muted-foreground">{PERIOD_LABELS[data.period]}</span>
              </CardHeader>
              <CardContent>
                <CompletionTrendChart data={data.completionTrend} totalCompleted={data.summary.completed} />
              </CardContent>
            </Card>

            <Card className="rounded-[1.25rem] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Task Status</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskStatusChart status={data.taskStatus} total={totalForChart} />
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[1.25rem] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-bold">Project Performance</CardTitle>
              <Button variant="link" className="h-auto p-0 text-primary" onClick={() => navigate("/#projects-section")}>
                View all projects →
              </Button>
            </CardHeader>
            <CardContent className="px-6 pb-5 pt-0">
              {data.projectPerformance.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects yet. Create one to see performance here.</p>
              ) : (
                <div className="divide-y">
                  {data.projectPerformance.map((project) => {
                    const projectIcon = getProjectIcon(project.icon)
                    const IconComp = projectIcon.icon
                    return (
                      <div key={project.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0">
                        <div className="flex w-52 min-w-0 items-center gap-3">
                          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white", projectIcon.bg)}>
                            <IconComp className="h-4 w-4" />
                          </div>
                          <span className="truncate text-sm font-medium">{project.name}</span>
                        </div>
                        <Progress value={project.progress} className="h-2 flex-1 bg-secondary/60" indicatorColor="bg-primary" />
                        <span className="w-10 text-right text-sm font-semibold text-primary">{project.progress}%</span>
                        <span className="w-28 text-right text-xs text-muted-foreground">
                          {project.completedTasks} / {project.totalTasks} tasks
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="rounded-[1.25rem] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Upcoming Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {UPCOMING_ITEMS.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("rounded-xl p-2", item.iconBg)}>
                        <CalendarDays className={cn("h-4 w-4", item.iconColor)} />
                      </div>
                      <span className={cn("font-medium", item.destructive && data.upcoming[item.key] > 0 && "text-destructive")}>
                        {item.label}
                      </span>
                    </div>
                    <span className={cn("text-lg font-bold", item.destructive && data.upcoming[item.key] > 0 && "text-destructive")}>
                      {data.upcoming[item.key]}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[1.25rem] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Your Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityHeatmap heatmap={data.activityHeatmap} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
