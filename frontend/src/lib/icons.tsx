import {
  LayoutTemplate,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  Plane,
  Monitor,
  Camera,
  Coffee,
  Globe,
  Heart,
  Lightbulb,
  Music,
  Star,
  Target,
  Zap
} from "lucide-react"

export const PROJECT_ICONS = [
  { id: "layout", icon: LayoutTemplate, bg: "bg-blue-500", color: "text-blue-500", hover: "hover:bg-blue-100" },
  { id: "book", icon: BookOpen, bg: "bg-emerald-500", color: "text-emerald-500", hover: "hover:bg-emerald-100" },
  { id: "briefcase", icon: Briefcase, bg: "bg-purple-500", color: "text-purple-500", hover: "hover:bg-purple-100" },
  { id: "check", icon: CheckCircle2, bg: "bg-amber-500", color: "text-amber-500", hover: "hover:bg-amber-100" },
  { id: "code", icon: Code2, bg: "bg-rose-500", color: "text-rose-500", hover: "hover:bg-rose-100" },
  { id: "plane", icon: Plane, bg: "bg-cyan-500", color: "text-cyan-500", hover: "hover:bg-cyan-100" },
  { id: "monitor", icon: Monitor, bg: "bg-indigo-500", color: "text-indigo-500", hover: "hover:bg-indigo-100" },
  { id: "camera", icon: Camera, bg: "bg-pink-500", color: "text-pink-500", hover: "hover:bg-pink-100" },
  { id: "coffee", icon: Coffee, bg: "bg-orange-500", color: "text-orange-500", hover: "hover:bg-orange-100" },
  { id: "globe", icon: Globe, bg: "bg-sky-500", color: "text-sky-500", hover: "hover:bg-sky-100" },
  { id: "heart", icon: Heart, bg: "bg-red-500", color: "text-red-500", hover: "hover:bg-red-100" },
  { id: "lightbulb", icon: Lightbulb, bg: "bg-yellow-500", color: "text-yellow-500", hover: "hover:bg-yellow-100" },
  { id: "music", icon: Music, bg: "bg-violet-500", color: "text-violet-500", hover: "hover:bg-violet-100" },
  { id: "star", icon: Star, bg: "bg-fuchsia-500", color: "text-fuchsia-500", hover: "hover:bg-fuchsia-100" },
  { id: "target", icon: Target, bg: "bg-lime-500", color: "text-lime-500", hover: "hover:bg-lime-100" },
  { id: "zap", icon: Zap, bg: "bg-teal-500", color: "text-teal-500", hover: "hover:bg-teal-100" },
]

export function getProjectIcon(id: string) {
  return PROJECT_ICONS.find((i) => i.id === id) || PROJECT_ICONS[0]
}
