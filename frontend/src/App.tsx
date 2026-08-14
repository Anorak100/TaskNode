import { ThemeProvider } from '@/components/theme-provider'
import { AppLayout } from '@/components/layout/app-layout'
import { Dashboard } from '@/pages/dashboard'
import { LoginPage } from '@/pages/auth/login'
import { SignupPage } from '@/pages/auth/signup'
import { NewProjectPage } from '@/pages/projects/new-project'
import { ProjectTasksPage } from '@/pages/projects/project-tasks'
import { CalendarPage } from '@/pages/calendar'
import { AnalyticsPage } from '@/pages/analytics'
import { isAuthenticated } from '@/lib/auth'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="task-manager-theme">
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated() ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={isAuthenticated() ? <Navigate to="/" replace /> : <SignupPage />}
          />
          <Route
            path="/"
            element={isAuthenticated() ? <AppLayout><Dashboard /></AppLayout> : <Navigate to="/login" replace />}
          />
          <Route
            path="/projects/new"
            element={isAuthenticated() ? <AppLayout><NewProjectPage /></AppLayout> : <Navigate to="/login" replace />}
          />
          <Route
            path="/projects/:projectId/tasks"
            element={isAuthenticated() ? <AppLayout><ProjectTasksPage /></AppLayout> : <Navigate to="/login" replace />}
          />
          <Route
            path="/calendar"
            element={isAuthenticated() ? <AppLayout><CalendarPage /></AppLayout> : <Navigate to="/login" replace />}
          />
          <Route
            path="/analytics"
            element={isAuthenticated() ? <AppLayout><AnalyticsPage /></AppLayout> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
