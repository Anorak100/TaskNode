import { useState } from "react"
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { registerUser } from "@/lib/auth"

export function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await registerUser(name, email, password)
      navigate("/login")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create account")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <img src="/tasknode_3.png" alt="TaskNode logo" className="h-10 w-auto" />
          <div className="flex items-center text-lg font-semibold tracking-tight">
            <span className="text-black dark:text-white">task</span>
            <span className="text-blue-600">node</span>
          </div>
        </div>

        <Card className="border-border/70 shadow-lg shadow-primary/5">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Start organizing work, projects, and deadlines in one place.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Full name</label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Israel Akoteyon"
                    className="pl-9"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
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

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button className="w-full gap-2 rounded-xl" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
