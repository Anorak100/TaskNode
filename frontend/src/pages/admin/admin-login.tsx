import { useState } from "react"
import { ArrowRight, LockKeyhole, Mail } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { loginAdmin } from "@/lib/admin-auth"

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await loginAdmin(email, password)
      navigate("/admin", { replace: true })
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-3">
          <img src="/tasknode_3.png" alt="" className="h-9 w-auto" />
          <span className="text-lg font-semibold">TaskNode <span className="text-blue-400">Admin</span></span>
        </Link>
        <Card className="border-white/10 bg-slate-900 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Administrator sign in</CardTitle>
            <CardDescription className="text-slate-400">Use your configured administrator credentials.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="admin-email" className="text-sm font-medium text-slate-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="border-white/10 bg-slate-950 pl-9 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="admin-password" className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="border-white/10 bg-slate-950 pl-9 text-white" />
                </div>
              </div>
              {error ? <p role="alert" className="text-sm text-red-400">{error}</p> : null}
              <Button className="w-full gap-2" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-5 text-center text-xs text-slate-500">Administrator access is separate from regular TaskNode accounts.</p>
      </div>
    </main>
  )
}
