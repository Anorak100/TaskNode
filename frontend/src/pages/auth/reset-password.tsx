import { useState } from "react"
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, Mail } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { resetPassword } from "@/lib/auth"

export function ResetPasswordPage() {
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email ?? "")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsSubmitting(true)
    try {
      await resetPassword(email, code, password)
      setIsComplete(true)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to reset your password")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/forgot-password" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Request another code
        </Link>
        <Card className="border-border/70 shadow-lg shadow-primary/5">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Choose a new password</CardTitle>
            <CardDescription>Enter the six-digit code and a new password. Codes expire after 10 minutes.</CardDescription>
          </CardHeader>
          <CardContent>
            {isComplete ? (
              <div className="space-y-5 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
                <p className="text-sm text-muted-foreground">Your password has been reset successfully.</p>
                <Button asChild className="w-full rounded-xl" size="lg"><Link to="/login">Back to sign in</Link></Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="reset-account-email" className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input id="reset-account-email" type="email" className="pl-9" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="reset-code" className="text-sm font-medium text-muted-foreground">Reset code</label>
                  <div className="relative"><KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input id="reset-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} placeholder="123456" className="pl-9 tracking-[0.35em]" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} required /></div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium text-muted-foreground">New password</label>
                  <div className="relative"><LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input id="new-password" type={showPassword ? "text" : "password"} className="pl-9 pr-10" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword((current) => !current)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium text-muted-foreground">Confirm new password</label>
                  <Input id="confirm-password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required />
                </div>
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                <Button className="w-full rounded-xl" size="lg" type="submit" disabled={isSubmitting}>{isSubmitting ? "Resetting password..." : "Reset password"}</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
