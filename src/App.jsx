import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import OnboardingWelcome from './pages/OnboardingWelcome'
import OnboardingVerification from './pages/OnboardingVerification'
import OnboardingDefineGoals from './pages/OnboardingDefineGoals'
import OnboardingConnectCalendar from './pages/OnboardingConnectCalendar'
import DashboardWeeklyOverview from './pages/DashboardWeeklyOverview'
import AddShiftRosterUpload from './pages/AddShiftRosterUpload'
import AddShiftForm from './pages/AddShiftForm'
import ShiftCheckerStatusTrends from './pages/ShiftCheckerStatusTrends'
import ExamProtectionMode from './pages/ExamProtectionMode'
import CalendarPage from './pages/CalendarPage'
import WellbeingPage from './pages/WellbeingPage'
import FocusModePage from './pages/FocusModePage'
import SettingsPage from './pages/SettingsPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding-welcome" replace />} />
        <Route path="/onboarding-welcome" element={<OnboardingWelcome />} />
        <Route path="/onboarding-verification" element={<OnboardingVerification />} />
        <Route path="/onboarding-define-goals" element={<OnboardingDefineGoals />} />
        <Route path="/onboarding-connect-calendar" element={<OnboardingConnectCalendar />} />
        <Route path="/dashboard-weekly-overview" element={<DashboardWeeklyOverview />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/wellbeing" element={<WellbeingPage />} />
        <Route path="/focus-mode" element={<FocusModePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/add-shift-roster-upload" element={<AddShiftRosterUpload />} />
        <Route path="/add-shift-form" element={<AddShiftForm />} />
        <Route path="/shift-checker-status-trends" element={<ShiftCheckerStatusTrends />} />
        <Route path="/exam-protection-mode" element={<ExamProtectionMode />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
