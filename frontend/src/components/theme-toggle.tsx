import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light")
    else if (theme === "light") setTheme("system")
    else setTheme("dark") // from system to dark
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-secondary transition-colors"
      title={`Current theme: ${theme}`}
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : theme === "light" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <span className="relative flex h-5 w-5 items-center justify-center">
          <Sun className="absolute h-5 w-5 scale-0 transition-all dark:scale-100" />
          <Moon className="h-5 w-5 scale-100 transition-all dark:scale-0" />
        </span>
      )}
    </button>
  )
}
