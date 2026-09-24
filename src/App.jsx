import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Preloader from './components/Preloader.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Patients from './pages/Patients.jsx'
import PatientDetail from './pages/PatientDetail.jsx'
import ClinicalAssessment from './pages/ClinicalAssessment.jsx'
import Laboratory from './pages/Laboratory.jsx'
import Medication from './pages/Medication.jsx'
import Appointments from './pages/Appointments.jsx'
import Reports from './pages/Reports.jsx'
import UserManagement from './pages/UserManagement.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1300)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Preloader visible={loading} />
      <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="clinical" element={<ClinicalAssessment />} />
        <Route path="laboratory" element={<Laboratory />} />
        <Route path="medication" element={<Medication />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      <Route path="*" element={<Landing />} />
      </Routes>
    </>
  )
}
