import { ThemeProvider } from '@/components/theme-provider'
import { AppLayout } from '@/components/layout/app-layout'
import { Dashboard } from '@/pages/dashboard'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="task-manager-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          {/* We can add more routes here later, e.g., /projects/:id */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
