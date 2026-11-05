import { ThemeProvider } from '@/components/theme-provider'
import { AppLayout } from '@/components/layout/app-layout'
import { Dashboard } from '@/pages/dashboard'
import { LoginPage } from '@/pages/auth/login'
import { SignupPage } from '@/pages/auth/signup'
import { ForgotPasswordPage } from '@/pages/auth/forgot-password'
import { ResetPasswordPage } from '@/pages/auth/reset-password'
import { NewProjectPage } from '@/pages/projects/new-project'
import { ProjectTasksPage } from '@/pages/projects/project-tasks'
import { CalendarPage } from '@/pages/calendar'
import { AnalyticsPage } from '@/pages/analytics'
import { SettingsPage } from '@/pages/settings'
import { LandingPage } from '@/pages/landing'
import { AdminLoginPage } from '@/pages/admin/admin-login'
import { AdminDashboardPage } from '@/pages/admin/admin-dashboard'
import { PrivacyPolicyPage, TermsOfServicePage } from '@/pages/legal'
import { AUTH_EXPIRED_EVENT, getStoredToken, isAuthenticated, logout } from '@/lib/auth'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function AuthExpiryRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkExpiredAuth = () => {
      if (getStoredToken() && !isAuthenticated()) {
        logout()
        navigate('/login', { replace: true })
      }
    }

    const handleExpiredAuth = () => navigate('/login', { replace: true })
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpiredAuth)
    window.addEventListener('focus', checkExpiredAuth)
    document.addEventListener('visibilitychange', checkExpiredAuth)
    checkExpiredAuth()
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpiredAuth)
      window.removeEventListener('focus', checkExpiredAuth)
      document.removeEventListener('visibilitychange', checkExpiredAuth)
    }
  }, [navigate])

  return null
}

function PageTitle() {
  const { pathname } = useLocation()
  const titles: Record<string, string> = {
    '/login': 'Sign in',
    '/signup': 'Create account',
    '/forgot-password': 'Reset password',
    '/reset-password': 'Choose a new password',
    '/admin/login': 'Administrator sign in',
    '/admin': 'Admin overview',
    '/privacy': 'Privacy Policy',
    '/terms': 'Terms of Service',
    '/projects/new': 'New Project',
    '/calendar': 'Calendar',
    '/analytics': 'Analytics',
    '/settings': 'Settings',
  }
  const pageTitle = titles[pathname] ?? (pathname.startsWith('/projects/') ? 'Project Tasks' : pathname === '/' && isAuthenticated() ? 'Dashboard' : '')

  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | TaskNode` : 'TaskNode | Organize your work'
  }, [pageTitle])

  return null
}

function App() {
  const hadStoredToken = Boolean(getStoredToken())
  const authenticated = isAuthenticated()
  const expiredSession = hadStoredToken && !authenticated

  return (
    <ThemeProvider defaultTheme="system" storageKey="task-manager-theme">
      <BrowserRouter>
        <AuthExpiryRedirect />
        <PageTitle />
        <Routes>
          <Route
            path="/admin/login"
            element={isAdminAuthenticated() ? <Navigate to="/admin" replace /> : <AdminLoginPage />}
          />
          <Route
            path="/admin"
            element={isAdminAuthenticated() ? <AdminDashboardPage /> : <Navigate to="/admin/login" replace />}
          />
          <Route
            path="/login"
            element={authenticated ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={authenticated ? <Navigate to="/" replace /> : <SignupPage />}
          />
          <Route path="/forgot-password" element={authenticated ? <Navigate to="/" replace /> : <ForgotPasswordPage />} />
          <Route path="/reset-password" element={authenticated ? <Navigate to="/" replace /> : <ResetPasswordPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route
            path="/"
            element={authenticated ? <AppLayout><Dashboard /></AppLayout> : expiredSession ? <Navigate to="/login" replace /> : <LandingPage />}
          />
          <Route
            path="/projects/new"
            element={authenticated ? <AppLayout><NewProjectPage /></AppLayout> : <Navigate to="/login" replace />}
          />
          <Route
            path="/projects/:projectId/tasks"
            element={authenticated ? <AppLayout><ProjectTasksPage /></AppLayout> : <Navigate to="/login" replace />}
          />
          <Route
            path="/calendar"
            element={authenticated ? <AppLayout><CalendarPage /></AppLayout> : <Navigate to="/login" replace />}
          />
          <Route
            path="/analytics"
            element={authenticated ? <AppLayout><AnalyticsPage /></AppLayout> : <Navigate to="/login" replace />}
          />
          <Route
            path="/settings"
            element={authenticated ? <AppLayout><SettingsPage /></AppLayout> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
