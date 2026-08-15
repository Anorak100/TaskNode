import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

type LegalPageProps = {
  title: string
  updated: string
  children: React.ReactNode
}

function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2" aria-label="tasknode home">
            <img src="/tasknode_3.png" alt="" className="h-7 w-auto" />
            <span className="text-lg font-semibold tracking-tight">task<span className="text-primary">node</span></span>
          </Link>
          <Link to="/signup" className="text-sm font-semibold text-primary hover:underline">Create account</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
          <p className="mb-3 text-sm font-semibold text-primary">tasknode legal</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
          <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
            {children}
          </div>
        </article>
      </main>
    </div>
  )
}

export function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="August 15, 2026">
      <section><h2>Overview</h2><p>This policy explains how tasknode collects, uses, and protects information when you use our task and project management service.</p></section>
      <section><h2>Information we collect</h2><p>We collect information you provide when creating an account, such as your name, email address, and password. We also store the projects, tasks, deadlines, and other content you add to tasknode.</p></section>
      <section><h2>How we use information</h2><p>We use your information to provide and improve tasknode, maintain your account, respond to support requests, protect the service, and communicate important service-related updates.</p></section>
      <section><h2>Sharing and retention</h2><p>We do not sell your personal information. We may share information with service providers that help operate tasknode, or when required by law. We keep information for as long as your account remains active or as needed to meet legal and operational obligations.</p></section>
      <section><h2>Security</h2><p>We use reasonable administrative, technical, and organizational safeguards to protect your information. No online service can guarantee complete security, so please use a strong, unique password and keep your account credentials private.</p></section>
      <section><h2>Your choices</h2><p>You may request access to, correction of, or deletion of your personal information, subject to applicable law and legitimate retention needs.</p></section>
      <section><h2>Changes to this policy</h2><p>We may update this policy from time to time. If we make material changes, we will update the date above and provide notice when appropriate.</p></section>
      <section><h2>Contact</h2><p>For privacy questions or requests, contact the tasknode team through the support channel provided in the application.</p></section>
    </LegalPage>
  )
}

export function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" updated="August 15, 2026">
      <section><h2>Acceptance of these terms</h2><p>By creating an account or using tasknode, you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use the service.</p></section>
      <section><h2>Using tasknode</h2><p>tasknode gives you a personal, limited right to use the service for lawful task and project management. You are responsible for the activity on your account and for keeping your login credentials confidential.</p></section>
      <section><h2>Acceptable use</h2><p>You must not misuse tasknode, interfere with its operation, attempt unauthorized access, upload malicious content, or use the service in violation of applicable law or another person’s rights.</p></section>
      <section><h2>Your content</h2><p>You retain ownership of the content you add to tasknode. You grant us permission to host, process, and display that content only as needed to provide, maintain, and improve the service.</p></section>
      <section><h2>Service availability</h2><p>We work to keep tasknode available and reliable, but the service may occasionally change, be interrupted, or be unavailable. We may modify or discontinue features when reasonably necessary.</p></section>
      <section><h2>Disclaimers and liability</h2><p>tasknode is provided on an “as is” and “as available” basis to the extent permitted by law. We are not liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the service.</p></section>
      <section><h2>Termination</h2><p>You may stop using tasknode at any time. We may suspend or terminate access if you violate these terms or if needed to protect the service, its users, or others.</p></section>
      <section><h2>Changes to these terms</h2><p>We may revise these terms from time to time. Continued use after an update means you accept the revised terms. The latest revision date appears above.</p></section>
      <section><h2>Contact</h2><p>For questions about these terms, contact the tasknode team through the support channel provided in the application.</p></section>
    </LegalPage>
  )
}
