import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  Sparkles, 
  CheckCircle2, 
  Folder, 
  Calendar, 
  ListTodo, 
  Settings, 
  ArrowRight, 
  Plus, 
  Menu, 
  X, 
  Layers, 
  Clock, 
  BarChart3, 
  Bell,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Static tasks for hero dashboard illustration (non-clickable)
  const heroTasks = [
    { id: 1, text: "Design homepage", date: "Tomorrow", completed: false, dateColor: "text-red-500 bg-red-500/10" },
    { id: 2, text: "Create logo and branding", date: "Aug 1, 2024", completed: false, dateColor: "text-amber-600 bg-amber-500/10" },
    { id: 3, text: "Connect API", date: "Aug 8, 2024", completed: false, dateColor: "text-slate-500 bg-slate-500/10" },
    { id: 4, text: "Implement authentication", date: "Aug 12, 2024", completed: true, dateColor: "text-slate-500 bg-slate-500/10" },
    { id: 5, text: "Deploy to production", date: "Aug 20, 2024", completed: false, dateColor: "text-slate-500 bg-slate-500/10" },
  ]

  // Static projects and tasks for feature illustration
  const featureProjects = [
    { name: "Website Redesign", count: "19 / 25 tasks", active: true },
    { name: "Mobile App", count: "12 / 18 tasks", active: false },
    { name: "Marketing Campaign", count: "8 / 15 tasks", active: false },
    { name: "Study Plan", count: "6 / 12 tasks", active: false },
  ]

  const featureTasks = [
    { text: "Design homepage", status: "TODO" },
    { text: "Create logo and branding", status: "TODO" },
    { text: "Connect API", status: "IN PROGRESS" },
    { text: "Implement authentication", status: "DONE" },
    { text: "Deploy to production", status: "TODO" },
  ]

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. Header (Navbar) */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/70 transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/tasknode_3.png" alt="tasknode Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-slate-900 dark:text-white">task</span>
              <span className="text-blue-600">node</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection("features")} 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection("how-it-works")} 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection("about")} 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link 
              to="/login" 
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link to="/signup">
              <Button className="rounded-xl px-5 font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Log in
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden transition-all duration-200">
            <nav className="flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection("features")} 
                className="text-left text-base font-medium text-slate-600 dark:text-slate-300"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("how-it-works")} 
                className="text-left text-base font-medium text-slate-600 dark:text-slate-300"
              >
                How it works
              </button>
              <button 
                onClick={() => scrollToSection("about")} 
                className="text-left text-base font-medium text-slate-600 dark:text-slate-300"
              >
                About
              </button>
              <hr className="border-slate-100 dark:border-slate-800" />
              <Link to="/signup" className="w-full">
                <Button className="w-full rounded-xl bg-blue-600 text-white font-semibold">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column Text details */}
          <div className="space-y-6 lg:col-span-5">
            {/* Spark Chip */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Your work, organized your way</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              Manage tasks. <br />
              <span className="text-emerald-500">Stay organized.</span> <br />
              Get things done.
            </h1>

            {/* Subtext description */}
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
              tasknode helps you organize your work into projects, keep track of your tasks, and stay focused on what matters.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button className="w-full sm:w-auto h-12 rounded-xl px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 group">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="w-full sm:w-auto h-12 rounded-xl px-6 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-900">
                  Log In
                </Button>
              </Link>
            </div>

            {/* Social proof badge focusing on open source */}
            <div className="flex items-center gap-3 pt-4">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                <Check className="h-3 w-3" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                An open source project designed to help you reclaim focus and get things done in a world that craves attention.
              </p>
            </div>
          </div>

          {/* Right Column: Premium Static Dashboard Illustration */}
          <div className="lg:col-span-7 pointer-events-none select-none">
            <div className="relative rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl dark:border-slate-800/80 dark:bg-slate-900 transition-all duration-300">
              
              {/* Inner container mimicking app layout */}
              <div className="flex flex-col md:flex-row rounded-xl overflow-hidden bg-slate-50 border border-slate-200/50 dark:bg-slate-950 dark:border-slate-800/50 min-h-[460px]">
                
                {/* Dashboard Sidebar Illustration (Static) */}
                <div className="w-full md:w-48 bg-white dark:bg-slate-900 p-4 border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between">
                  <div className="space-y-5">
                    {/* Header Logo */}
                    <div className="flex items-center gap-2">
                      <img src="/tasknode_3.png" alt="tasknode logo" className="h-6 w-auto" />
                      <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">tasknode</span>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-1.5">
                      <div className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400">
                        <Layers className="h-3.5 w-3.5" />
                        <span>Dashboard</span>
                      </div>
                      <div className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Folder className="h-3.5 w-3.5" />
                        <span>Projects</span>
                      </div>
                      <div className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Calendar</span>
                      </div>
                      <div className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <ListTodo className="h-3.5 w-3.5" />
                        <span>My Tasks</span>
                      </div>
                      <div className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Settings className="h-3.5 w-3.5" />
                        <span>Settings</span>
                      </div>
                    </div>
                  </div>

                  {/* Dark Mode Switch & Profile */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {/* Switch Mode Button (Visual only) */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-400">Dark mode</span>
                      <div className="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-800">
                        <span className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:translate-x-4 translate-x-0" />
                      </div>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center gap-2">
                      <img
                        className="h-7 w-7 rounded-full object-cover"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                        alt="user profile avatar"
                      />
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-[10px] font-semibold truncate text-slate-800 dark:text-slate-200">user</span>
                        <span className="text-[9px] truncate text-slate-400">user@gmail.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Content Illustration (Static) */}
                <div className="flex-1 p-5 md:p-6 overflow-y-auto">
                  
                  {/* Top Bar / Greeting */}
                  <div className="mb-5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Welcome back, user 👋</h3>
                    <p className="text-[10px] text-slate-400">Here's what's happening with your work today.</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5 sm:grid-cols-4">
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-[9px] font-semibold text-slate-400 block">Total Projects</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">8</span>
                      <span className="text-[9px] font-medium text-emerald-500 flex items-center">↑ 20% <span className="text-[8px] text-slate-400 ml-0.5">last month</span></span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-[9px] font-semibold text-slate-400 block">Total Tasks</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">25</span>
                      <span className="text-[9px] font-medium text-emerald-500 flex items-center">↑ 15% <span className="text-[8px] text-slate-400 ml-0.5">last month</span></span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-[9px] font-semibold text-slate-400 block">Completed</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">11</span>
                      <span className="text-[9px] font-medium text-emerald-500 flex items-center">↑ 10% <span className="text-[8px] text-slate-400 ml-0.5">last month</span></span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-[9px] font-semibold text-slate-400 block">In Progress</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">6</span>
                      <span className="text-[9px] text-slate-400 block">-- from last month</span>
                    </div>
                  </div>

                  {/* Dual Grid: Recent Projects & Upcoming Tasks */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Column: Recent Projects */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Recent Projects</span>
                        <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400">View all</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: "Website Redesign", fraction: "19 / 25 tasks", percent: "w-[76%] bg-blue-600", active: true },
                          { name: "Mobile App", fraction: "12 / 18 tasks", percent: "w-[66%] bg-emerald-500", active: false },
                          { name: "Marketing Campaign", fraction: "8 / 15 tasks", percent: "w-[53%] bg-purple-500", active: false },
                          { name: "Study Plan", fraction: "6 / 12 tasks", percent: "w-[50%] bg-amber-500", active: false },
                          { name: "Personal Finance App", fraction: "4 / 10 tasks", percent: "w-[40%] bg-blue-400", active: false }
                        ].map((proj) => (
                          <div 
                            key={proj.name} 
                            className={`space-y-1 p-1.5 rounded-md ${proj.active ? 'bg-slate-50 dark:bg-slate-800/60' : ''}`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-semibold text-slate-700 dark:text-slate-300">{proj.name}</span>
                              <span className="text-[8px] text-slate-400">{proj.fraction}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${proj.percent}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Upcoming Tasks */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Upcoming Tasks</span>
                        <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400">View all</span>
                      </div>
                      <div className="space-y-2.5">
                        {heroTasks.map((task) => (
                          <div 
                            key={task.id} 
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`h-4 w-4 rounded-md border flex items-center justify-center ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-700'}`}>
                                {task.completed && <Check className="h-2.5 w-2.5 text-white" />}
                              </div>
                              <span className={`text-[9px] font-medium truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                {task.text}
                              </span>
                            </div>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full shrink-0 font-medium ${task.dateColor}`}>
                              {task.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="bg-slate-100/40 dark:bg-slate-900/20 py-20 sm:py-28 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-36">
          
          {/* Row 1: Project-First Organization */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left side text detail */}
            <div className="space-y-5 lg:col-span-5">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase block">Project-First Organization</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Everything in its place
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Organize your work by projects. Break things down into tasks. Keep everything structured and easy to find.
              </p>
              <ul className="space-y-3.5 pt-2">
                {[
                  "Create unlimited projects",
                  "Add tasks and set due dates",
                  "Track progress in real time",
                  "Stay focused and organized",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 shrink-0">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side static card illustration */}
            <div className="lg:col-span-7 pointer-events-none select-none">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-stretch">
                {/* Project List Column */}
                <div className="sm:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xl flex flex-col gap-3 justify-center min-h-[300px]">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Projects</div>
                  <div className="space-y-2">
                    {featureProjects.map((p) => (
                      <div
                        key={p.name}
                        className={`flex items-center gap-3 w-full rounded-xl p-2.5 text-xs font-semibold ${
                          p.active
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/15"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${p.active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                          <Folder className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate leading-none mb-1">{p.name}</div>
                          <div className={`text-[9px] ${p.active ? "text-blue-100" : "text-slate-400"}`}>{p.count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Project Detail Mock */}
                <div className="sm:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between min-h-[300px]">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 rounded-lg">
                        <Folder className="h-4 w-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Website Redesign</h4>
                    </div>

                    <div className="space-y-3">
                      {featureTasks.map((task, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 border-b border-slate-50 dark:border-slate-800/30 pb-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center shrink-0 ${task.status === "DONE" ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-700"}`}>
                              {task.status === "DONE" && <Check className="h-2.5 w-2.5" />}
                            </div>
                            <span className={`text-xs truncate font-medium ${task.status === "DONE" ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-300"}`}>
                              {task.text}
                            </span>
                          </div>
                          <span className={`text-[8px] px-2 py-0.5 rounded-full shrink-0 font-bold ${
                            task.status === "TODO" ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" :
                            task.status === "IN PROGRESS" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                            "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-500/80 mt-4">
                    <Plus className="h-3.5 w-3.5" /> Add Task
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Simple Task Management */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left column static illustration */}
            <div className="lg:col-span-7 order-last lg:order-first pointer-events-none select-none">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl max-w-lg mx-auto space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex gap-4 text-xs font-semibold text-slate-400">
                    <span className="text-blue-600 dark:text-blue-400 pb-3 border-b-2 border-blue-600 dark:border-blue-400">All (25)</span>
                    <span>To Do (11)</span>
                    <span>In Progress (6)</span>
                    <span>Completed (8)</span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {[
                    { text: "Design homepage", date: "Tomorrow", completed: false, dateColor: "text-red-500 bg-red-500/10" },
                    { text: "Create logo and branding", date: "Aug 1, 2024", completed: false, dateColor: "text-amber-600 bg-amber-500/10" },
                    { text: "Connect API", date: "Aug 8, 2024", completed: false, dateColor: "text-slate-500 bg-slate-100 dark:bg-slate-800" },
                    { text: "Implement authentication", date: "Aug 12, 2024", completed: true, dateColor: "text-slate-500 bg-slate-100 dark:bg-slate-800" },
                    { text: "Deploy to production", date: "Aug 20, 2024", completed: false, dateColor: "text-slate-500 bg-slate-100 dark:bg-slate-800" },
                  ].map((task, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 border-b border-slate-50 dark:border-slate-800/30 pb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center shrink-0 ${task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-700"}`}>
                          {task.completed && <Check className="h-2.5 w-2.5" />}
                        </div>
                        <span className={`text-xs font-semibold truncate ${task.completed ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-300"}`}>
                          {task.text}
                        </span>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold shrink-0 ${task.dateColor}`}>
                        {task.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column text detail */}
            <div className="space-y-5 lg:col-span-5">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase block">Simple Task Management</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Clear tasks. Clear progress.
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Add tasks, set due dates, and track progress with ease. Know exactly what to do and when.
              </p>
              
              {/* Feature Grid Icons */}
              <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center mb-2">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Todo, In Progress, Done</h4>
                  <p className="text-[10px] text-slate-500">Easily manage status lifecycle.</p>
                </div>

                <div className="space-y-1">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center mb-2">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Set due dates</h4>
                  <p className="text-[10px] text-slate-500">Stay on track with quick deadlines.</p>
                </div>

                <div className="space-y-1">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center mb-2">
                    <BarChart3 className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Track progress</h4>
                  <p className="text-[10px] text-slate-500">Visual percentage statistics updates.</p>
                </div>

                <div className="space-y-1">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center mb-2">
                    <Bell className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Focus on priorities</h4>
                  <p className="text-[10px] text-slate-500">Know exactly what to do first.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-28 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase block">How tasknode Works</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Get started in minutes
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400">
              Four simple steps to transform your productivity and organize your digital life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="text-center space-y-4 relative group">
              <div className="relative mx-auto h-16 w-16 rounded-2xl bg-blue-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-md">
                <Folder className="h-6 w-6" />
                <span className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create a project</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Start by creating a project for your work or individual task streams.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4 relative group">
              <div className="relative mx-auto h-16 w-16 rounded-2xl bg-green-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-md">
                <ListTodo className="h-6 w-6" />
                <span className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add your tasks</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Add tasks, write descriptions, specify deadlines, and assign indicators.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4 relative group">
              <div className="relative mx-auto h-16 w-16 rounded-2xl bg-purple-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-md">
                <BarChart3 className="h-6 w-6" />
                <span className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Track your progress</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Watch percentage trackers move as status lifecycles shift to completed.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center space-y-4 relative group">
              <div className="relative mx-auto h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-md">
                <CheckCircle2 className="h-6 w-6" />
                <span className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Get things done</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Close projects, check deadlines, and achieve your workflow milestones.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Footer CTA Card Section */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-blue-50 to-emerald-50/70 border border-blue-100/50 dark:from-slate-900 dark:to-emerald-950/20 dark:border-slate-800/80 rounded-[32px] p-8 sm:p-14 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          
          <div className="space-y-4 max-w-md relative z-10">
            <div className="flex items-center gap-2">
              <img src="/tasknode_3.png" alt="tasknode Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">tasknode</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Ready to get organized?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              An open source project to help people become more productive and track tasks in a world that craves attention.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-12 rounded-xl px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 group">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <button 
              onClick={() => scrollToSection("features")} 
              className="w-full sm:w-auto h-12 rounded-xl px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
            >
              Learn More
            </button>
          </div>

          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-blue-300/10 blur-3xl -z-0" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-emerald-300/10 blur-3xl -z-0" />
        </div>

        {/* Small copyrights footer */}
        <div className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100 dark:border-slate-900 pt-6">
          <p>© {new Date().getFullYear()} tasknode. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </section>

    </div>
  )
}
