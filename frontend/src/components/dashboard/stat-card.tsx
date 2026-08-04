import { Card, CardContent } from "@/components/ui/card"
import {type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconBgColor?: string
  iconColor?: string
  trend?: {
    value: string
    positive: boolean
    label: string
  }
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
  trend
}: StatCardProps) {
  return (
    <Card className="shadow-none rounded-[1.25rem]">
      <CardContent className="p-6 flex items-start gap-4">
        <div className={cn("p-3 rounded-2xl shrink-0", iconBgColor)}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
          </div>
          {trend && (
            <div className="flex items-center mt-1 gap-1.5 text-xs text-muted-foreground font-medium">
              <span className={cn("flex items-center font-bold", trend.positive ? "text-success" : "text-destructive")}>
                {trend.positive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                {trend.value}
              </span>
              <span>{trend.label}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
