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
  Menu, 
  X, 
  Layers, 
  Clock, 
  BarChart3, 
  Bell,
  Check,
  FileText,
  LayoutTemplate,
  CalendarClock,
  ArrowLeft,
  Code2,
  MessageCircle,
  Hand,
  Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Static tasks for feature illustrations
  const featureTasks = [
    { text: "Design homepage", desc: "Create modern UI wireframes and visual mockups.", status: "TODO", date: "Tomorrow", dateColor: "text-red-500 bg-red-500/10" },
    { text: "Create logo and branding", desc: "Export high-res SVGs for dark and light logo variants.", status: "TODO", date: "Aug 1, 2024", dateColor: "text-amber-600 bg-amber-500/10" },
    { text: "Connect API", desc: "Hook up REST controllers to client query endpoints.", status: "IN_PROGRESS", date: "Aug 8, 2024", dateColor: "text-blue-500 bg-blue-500/10" },
    { text: "Implement authentication", desc: "Integrate JWT sessions and protected routes.", status: "DONE", date: "Aug 12, 2024", dateColor: "text-slate-500 bg-slate-100 dark:bg-slate-800" },
    { text: "Deploy to production", desc: "Build bundle and deploy to staging host.", status: "TODO", date: "Aug 20, 2024", dateColor: "text-slate-500 bg-slate-100 dark:bg-slate-800" },
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
              <span className="text-slate-900 dark:text-white">Task</span>
              <span className="text-blue-600">Node</span>
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

          {/* Right Column: Premium Dashboard Illustration (Static, Matches dashboard.tsx) */}
          <div className="lg:col-span-7 pointer-events-none select-none">
            <div className="relative rounded-3xl border border-slate-200/80 bg-white p-2 shadow-2xl dark:border-slate-800/80 dark:bg-slate-900 transition-all duration-300">
              
              {/* Inner container mimicking app layout */}
              <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/50 dark:bg-slate-950 dark:border-slate-800/50 min-h-[500px]">
                
                {/* Dashboard Sidebar Illustration */}
                <div className="w-full md:w-48 md:shrink-0 bg-white dark:bg-slate-900 p-4 border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between">
                  <div className="space-y-5">
                    {/* Header Logo */}
                    <div className="flex items-center gap-2">
                      <img src="/tasknode_3.png" alt="tasknode logo" className="h-6 w-auto" />
                      <span className="text-sm font-semibold tracking-tight">
                        <span className="text-slate-900 dark:text-white">Task</span><span className="text-blue-600">Node</span>
                      </span>
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
                        <BarChart3 className="h-3.5 w-3.5" />
                        <span>Analytics</span>
                      </div>
                      <div className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Settings className="h-3.5 w-3.5" />
                        <span>Settings</span>
                      </div>
                    </div>
                  </div>

                  {/* Dark Mode Switch & Profile */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {/* Switch Mode Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-400">Dark mode</span>
                      <div className="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-800">
                        <span className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:translate-x-4 translate-x-0" />
                      </div>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center gap-2">
                      <img
                        className="h-7 w-7 shrink-0 rounded-full object-cover"
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

                {/* Dashboard Content Illustration (Matches dashboard.tsx) */}
                <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-5 md:p-6">
                  
                  {/* Top Bar / Greeting */}
                  <div className="mb-6">
                    <h3 className="flex items-center gap-1.5 text-base font-bold text-slate-900 dark:text-white">
                      Good afternoon, user <Hand className="h-4 w-4 text-amber-500" aria-label="Waving hand" />
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Here's what's happening with your projects today.</p>
                  </div>

                  {/* Stats Grid (StatCards layout) */}
                  <div className="mb-6 grid grid-cols-2 gap-3">
                    <div className="flex min-w-0 items-start gap-3 rounded-[1.25rem] border border-slate-200/50 bg-white p-3 dark:border-slate-800/50 dark:bg-slate-900">
                      <div className="shrink-0 rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className="truncate text-[9px] font-semibold text-slate-400">Total Projects</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">8</span>
                        <span className="text-[8px] text-emerald-500 font-semibold block">Live</span>
                      </div>
                    </div>
                    
                    <div className="flex min-w-0 items-start gap-3 rounded-[1.25rem] border border-slate-200/50 bg-white p-3 dark:border-slate-800/50 dark:bg-slate-900">
                      <div className="shrink-0 rounded-xl bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                        <LayoutTemplate className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className="truncate text-[9px] font-semibold text-slate-400">Total Tasks</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">25</span>
                        <span className="text-[8px] text-emerald-500 font-semibold block">Tracked</span>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-start gap-3 rounded-[1.25rem] border border-slate-200/50 bg-white p-3 dark:border-slate-800/50 dark:bg-slate-900">
                      <div className="shrink-0 rounded-xl bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                        <CalendarClock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className="truncate text-[9px] font-semibold text-slate-400">Due Today</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">1</span>
                        <span className="text-[8px] text-emerald-500 font-semibold block">Watchlist</span>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-start gap-3 rounded-[1.25rem] border border-slate-200/50 bg-white p-3 dark:border-slate-800/50 dark:bg-slate-900">
                      <div className="shrink-0 rounded-xl bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className="truncate text-[9px] font-semibold text-slate-400">Completed</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">44%</span>
                        <span className="text-[8px] text-emerald-500 font-semibold block">11 tasks</span>
                      </div>
                    </div>
                  </div>

                  {/* Projects list section header */}
                  <div className="flex items-center justify-between mb-4 pb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Projects</span>
                    <div className="flex gap-2 text-[9px] font-bold text-slate-400">
                      <span>All Projects ˅</span>
                      <span>Sort: Recent</span>
                    </div>
                  </div>

                  {/* Mock grid of ProjectCards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Website Redesign Card */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-[1.25rem] border border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                            <Layers className="w-4 h-4" />
                          </div>
                          <h4 className="font-semibold text-xs text-slate-850 dark:text-slate-100">Website Redesign</h4>
                        </div>
                        <p className="text-[10px] text-slate-450 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                          Redesign and rebuild the company website with new branding layouts.
                        </p>
                      </div>
                      <div className="space-y-3.5 mt-auto">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[9px] font-bold">
                            <span>76% Complete</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-blue-600 w-[76%]" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2 text-[9px] text-slate-400 font-semibold">
                          <span>25 Tasks</span>
                          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-bold uppercase tracking-wider text-[8px]">HIGH</span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile App Card */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-[1.25rem] border border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                            <LayoutTemplate className="w-4 h-4" />
                          </div>
                          <h4 className="font-semibold text-xs text-slate-850 dark:text-slate-100">Mobile App</h4>
                        </div>
                        <p className="text-[10px] text-slate-450 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                          Create a native mobile app for iOS and Android matching dashboard components.
                        </p>
                      </div>
                      <div className="space-y-3.5 mt-auto">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[9px] font-bold">
                            <span>66% Complete</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-warning w-[66%]" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2 text-[9px] text-slate-400 font-semibold">
                          <span>18 Tasks</span>
                          <span className="px-1.5 py-0.5 rounded bg-warning/20 text-warning font-bold uppercase tracking-wider text-[8px]">MEDIUM</span>
                        </div>
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
          
          {/* Row 1: Project-First Organization (Matches project-tasks.tsx) */}
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

            {/* Right side static project-tasks page mockup (Matches project-tasks.tsx) */}
            <div className="lg:col-span-7 pointer-events-none select-none">
              <div className="bg-slate-100/50 dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-4">
                
                {/* Back to Dashboard bar */}
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Dashboard</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  
                  {/* Left Column: Project details and task list */}
                  <div className="sm:col-span-7 space-y-3.5">
                    {/* Project Header summary */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                          <Layers className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs">Website Redesign</h4>
                          <p className="text-[9px] text-muted-foreground">Redesign and rebuild the company website.</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground">
                          <span>76% Complete</span>
                          <span>25 Tasks</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-blue-600 w-[76%]" />
                        </div>
                      </div>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-2">
                      <div className="rounded-full px-3 py-1 text-[9px] font-bold bg-blue-600 text-white">All (25)</div>
                      <div className="rounded-full px-3 py-1 text-[9px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-500">To Do (11)</div>
                      <div className="rounded-full px-3 py-1 text-[9px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-500">In Progress (6)</div>
                    </div>

                    {/* Task Table Mockup (Matches actual layout) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden text-[9px]">
                      <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-850">
                        <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 text-left font-bold">
                          <tr>
                            <th className="px-3.5 py-2.5">Task</th>
                            <th className="px-3.5 py-2.5">Status</th>
                            <th className="px-3.5 py-2.5">Due Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900">
                          {featureTasks.map((t, idx) => (
                            <tr key={idx} className={t.status === "IN_PROGRESS" ? "bg-slate-50 dark:bg-slate-800/50" : ""}>
                              <td className="px-3.5 py-2.5 font-semibold">
                                <div>{t.text}</div>
                                <div className="text-[8px] text-muted-foreground font-normal line-clamp-1">{t.desc}</div>
                              </td>
                              <td className="px-3.5 py-2.5">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                  t.status === "TODO" ? "bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400" :
                                  t.status === "IN_PROGRESS" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                                }`}>
                                  {t.status}
                                </span>
                              </td>
                              <td className="px-3.5 py-2.5 text-muted-foreground font-medium">{t.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: Task detail cards pane (Matches project-tasks.tsx) */}
                  <div className="sm:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 space-y-4">
                    <div>
                      <div className="text-[9px] font-bold text-muted-foreground mb-3">Task details</div>
                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="text-xs font-bold leading-tight">Connect API</h5>
                            <span className="px-1.5 py-0.5 rounded bg-warning/10 text-warning text-[8px] font-bold tracking-wider uppercase">IN_PROGRESS</span>
                          </div>
                          <p className="text-[9px] text-muted-foreground leading-relaxed">
                            Integrate the backend REST API endpoints with the frontend services.
                          </p>
                        </div>

                        {/* Metadata Box */}
                        <div className="rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 p-2.5 text-[9px] space-y-1.5 font-medium">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Project</span>
                            <span>Website Redesign</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Due Date</span>
                            <span>Aug 8, 2024</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status</span>
                            <span>IN_PROGRESS</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="space-y-2 pt-1.5">
                          <div className="w-full h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-[10px] font-bold">
                            Mark as done
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 h-7 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-[9px] font-bold">
                              Edit task
                            </div>
                            <div className="flex-1 h-7 border border-slate-200 dark:border-slate-800 text-red-500 rounded-lg flex items-center justify-center text-[9px] font-bold">
                              Delete
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* Row 2: Simple Task Management (Matches task list table layout) */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left column visual mock table */}
            <div className="lg:col-span-7 order-last lg:order-first pointer-events-none select-none">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl max-w-lg mx-auto space-y-4">
                
                {/* Header Filter tab selection */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex gap-4 text-xs font-semibold text-slate-400">
                    <span className="text-blue-600 dark:text-blue-400 pb-3 border-b-2 border-blue-600 dark:border-blue-400">All (25)</span>
                    <span>To Do (11)</span>
                    <span>In Progress (6)</span>
                    <span>Completed (8)</span>
                  </div>
                </div>

                {/* Search and Sort layout */}
                <div className="flex items-center justify-between gap-3 text-[10px]">
                  <div className="flex-1 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-muted-foreground flex items-center gap-2 bg-slate-50 dark:bg-slate-950">
                    <Check className="h-3 w-3 text-slate-400" />
                    <span>Search tasks...</span>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 font-bold flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Sort: Due date ↑</span>
                  </div>
                </div>

                {/* Table list format */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-850 text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold text-[10px]">
                      <tr>
                        <th className="px-4 py-2.5">Task</th>
                        <th className="px-4 py-2.5">Status</th>
                        <th className="px-4 py-2.5">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900 font-medium">
                      {featureTasks.map((task, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-850 dark:text-slate-200">{task.text}</div>
                            <div className="text-[9px] text-muted-foreground font-normal line-clamp-1">{task.desc}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                              task.status === "TODO" ? "bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400" :
                              task.status === "IN_PROGRESS" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                            }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-[10px]">{task.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TaskNode</span>
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
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 dark:border-slate-900 dark:text-slate-500 lg:flex-row lg:text-left">
          <p>© {new Date().getFullYear()} tasknode. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="https://github.com/Anorak100" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-700 dark:hover:text-slate-200" aria-label="Anorak's GitHub profile">
              <Code2 className="h-3.5 w-3.5" /> GitHub
            </a>
            <a href="https://wa.me/2348148920102" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400" aria-label="Message Anorak on WhatsApp">
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <a href="https://x.com/izzyCodes_" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-700 dark:hover:text-slate-200" aria-label="Follow izzyCodes on X">
              <XIcon className="h-3.5 w-3.5" /> X
            </a>
          </div>
          <p className="flex items-center gap-1">
            designed and built with <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" aria-label="Love" /> by <a href="https://github.com/Anorak100" target="_blank" rel="noreferrer" className="font-semibold text-slate-600 transition-colors hover:text-primary dark:text-slate-300">Anorak💫</a>
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
