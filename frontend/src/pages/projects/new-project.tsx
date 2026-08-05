import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createProject } from "@/lib/projects"

export function NewProjectPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Project name is required")
      return
    }

    try {
      setIsSubmitting(true)
      await createProject(name.trim(), description)
      window.location.replace("/")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create project")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
      >
        <div className="mb-6">
          <p className="text-sm font-medium text-primary">New Project</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Create a project</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add the core details and send them to your workspace.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Project name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Roadmap redesign"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the goals and scope of this project"
              className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/", { replace: true })}>
            Back to Dashboard
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  )
}
