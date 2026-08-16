import { useEffect, useState } from "react"
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { loginUser } from "@/lib/auth"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSignOutNotice, setShowSignOutNotice] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("tasknode-sign-out-notice") !== "true") return

    sessionStorage.removeItem("tasknode-sign-out-notice")
    setShowSignOutNotice(true)
  }, [])

  useEffect(() => {
    if (!showSignOutNotice) return

    const timeout = window.setTimeout(() => setShowSignOutNotice(false), 4000)
    return () => window.clearTimeout(timeout)
  }, [showSignOutNotice])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await loginUser(email, password)
      window.location.replace("/")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      {showSignOutNotice ? (
        <div role="status" aria-live="polite" className="fixed right-4 top-4 z-50 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-400">
          You&apos;ve been signed out.
        </div>
      ) : null}
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <img src="/tasknode_3.png" alt="TaskNode logo" className="h-10 w-auto" />
          <div className="flex items-center text-lg font-semibold tracking-tight">
            <span className="text-black dark:text-white">Task</span>
            <span className="text-blue-600">Node</span>
          </div>
        </div>

        <Card className="border-border/70 shadow-lg shadow-primary/5">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to continue managing your projects and tasks.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="you@example.com"
                    className="pl-9"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="••••••••"
                    className="pl-9 pr-10"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-2.5 text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="h-4 w-4 rounded border-input" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button className="w-full gap-2 rounded-xl" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don’t have an account?{" "}
                <Link to="/signup" className="font-semibold text-primary hover:underline">
                  Create one
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
