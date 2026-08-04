import { StatCard } from "@/components/dashboard/stat-card"
import { ProjectCard } from "@/components/dashboard/project-card"
import { FileText, CheckCircle2, LayoutTemplate, Briefcase, CalendarClock, Plane, BookOpen, Code2 } from "lucide-react"

export function Dashboard() {
  return (
    <div className="max-w-6xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Good afternoon, Israel 👋</h1>
        <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Projects" 
          value={12} 
          icon={FileText}
          iconBgColor="bg-blue-100 dark:bg-blue-900/40"
          iconColor="text-blue-600 dark:text-blue-400"
          trend={{ value: "2", positive: true, label: "from last week" }}
        />
        <StatCard 
          title="Total Tasks" 
          value={48} 
          icon={LayoutTemplate}
          iconBgColor="bg-emerald-100 dark:bg-emerald-900/40"
          iconColor="text-emerald-600 dark:text-emerald-400"
          trend={{ value: "8", positive: true, label: "from last week" }}
        />
        <StatCard 
          title="Tasks Due Today" 
          value={7} 
          icon={CalendarClock}
          iconBgColor="bg-amber-100 dark:bg-amber-900/40"
          iconColor="text-amber-600 dark:text-amber-400"
          trend={{ value: "View due tasks", positive: true, label: "→" }}
        />
        <StatCard 
          title="Completed Tasks" 
          value="76%" 
          icon={CheckCircle2}
          iconBgColor="bg-purple-100 dark:bg-purple-900/40"
          iconColor="text-purple-600 dark:text-purple-400"
          trend={{ value: "12%", positive: true, label: "from last week" }}
        />
      </div>

      {/* Projects Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Projects</h2>
        <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
          <button className="hover:text-foreground transition-colors">All Projects ˅</button>
          <button className="hover:text-foreground transition-colors">Sort: Recent</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <ProjectCard
          title="Website Redesign"
          description="Redesign and rebuild the company website with new branding."
          icon={<LayoutTemplate className="w-5 h-5" />}
          iconBg="bg-blue-500"
          progress={80}
          tasksCount={15}
          dueDate="Aug 20"
          priority="high"
        />
        
        <ProjectCard
          title="Study Schedule"
          description="Organize my study plan and track progress."
          icon={<BookOpen className="w-5 h-5" />}
          iconBg="bg-emerald-500"
          progress={40}
          tasksCount={8}
          dueDate="Aug 12"
          priority="medium"
        />
        
        <ProjectCard
          title="Freelance Work"
          description="Manage client projects and deliverables."
          icon={<Briefcase className="w-5 h-5" />}
          iconBg="bg-purple-500"
          progress={60}
          tasksCount={21}
          dueDate="Sep 1"
          priority="high"
        />

        <ProjectCard
          title="Personal Tasks"
          description="Groceries, bills, workout and personal errands."
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-amber-500"
          progress={25}
          tasksCount={4}
          dueDate="Aug 15"
          priority="low"
        />

        <ProjectCard
          title="TaskNode App"
          description="Build the next generation Task Management app."
          icon={<Code2 className="w-5 h-5" />}
          iconBg="bg-rose-500"
          progress={65}
          tasksCount={32}
          dueDate="Sep 5"
          priority="high"
        />

        <ProjectCard
          title="Travel Plan"
          description="Plan my vacation and travel itinerary."
          icon={<Plane className="w-5 h-5" />}
          iconBg="bg-cyan-500"
          progress={10}
          tasksCount={3}
          dueDate="Aug 30"
          priority="low"
        />
      </div>
    </div>
  )
}
