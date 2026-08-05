import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light")
      return
    }

    setTheme("dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 transition-colors hover:bg-secondary"
      title={`Current theme: ${theme}`}
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  )
}
