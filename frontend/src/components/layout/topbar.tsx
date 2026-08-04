import { Bell, Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-8 border-b">
      <div className="flex items-center gap-4 flex-1">
        {/* Can put a breadcrumb or title here if needed */}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search projects, tasks..." 
            className="w-full bg-secondary/50 pl-9 rounded-full h-9 border-transparent focus-visible:ring-primary focus-visible:bg-background" 
          />
        </div>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Button className="rounded-full h-9 px-4 gap-2 font-medium">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </header>
  )
}
