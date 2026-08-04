import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MoreVertical } from "lucide-react"

interface ProjectCardProps {
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
  progress: number
  tasksCount: number
  dueDate: string
  priority: "high" | "medium" | "low"
}

export function ProjectCard({
  icon,
  iconBg,
  title,
  description,
  progress,
  tasksCount,
  dueDate,
  priority
}: ProjectCardProps) {
  
  const priorityStyles = {
    high: { variant: "destructive" as const, label: "High" },
    medium: { variant: "warning" as const, label: "Medium" },
    low: { variant: "success" as const, label: "Low" }
  }

  const indicatorColors = {
    high: "bg-destructive",
    medium: "bg-warning",
    low: "bg-success"
  }

  return (
    <Card className="rounded-[1.25rem] shadow-none flex flex-col transition-all hover:shadow-md cursor-pointer border-border">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${iconBg}`}>
              {icon}
            </div>
            <h3 className="font-semibold text-lg leading-none tracking-tight">{title}</h3>
          </div>
          <button className="text-muted-foreground hover:bg-secondary rounded-md p-1 -mr-2">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-6 flex-1">
          {description}
        </p>

        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>{progress}% Complete</span>
          </div>
          <Progress 
            value={progress} 
            indicatorColor={progress === 100 ? "bg-primary" : indicatorColors[priority]} 
            className="bg-secondary/50 h-2.5" 
          />
        </div>

        <div className="flex items-center justify-between border-t pt-4 mt-auto">
          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
            <span>{tasksCount} Tasks</span>
            <span>Due {dueDate}</span>
          </div>
          <Badge variant={priorityStyles[priority].variant} className="rounded-md px-2 shadow-sm uppercase tracking-wider text-[10px]">
            {priorityStyles[priority].label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
