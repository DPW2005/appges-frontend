import { Routes, Route, Navigate } from 'react-router'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { PATHS } from './router/paths'

// Pages
import Home from './pages/Home'

// Layouts
import SuperAdminLayout from './pages/super-admin/SuperAdminLayout'
import GestionnaireLayout from './pages/gestionnaire/GestionnaireLayout'
import EnseignantLayout from './pages/enseignant/EnseignantLayout'
import EtudiantLayout from './pages/etudiant/EtudiantLayout'

import SuperAdminDashboard from './pages/super-admin/Dashboard'
import GestionnaireDashboard from './pages/gestionnaire/Dashboard'
import EnseignantDashboard from './pages/enseignant/Dashboard'
import EtudiantDashboard from './pages/etudiant/Dashboard'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Routes>

          {/* Page d'accueil */}
          <Route path={PATHS.home} element={<Home />} />

          {/* Super Admin */}
          <Route path={PATHS.superAdmin.root} element={<SuperAdminLayout />}>
            <Route index element={<Navigate to={PATHS.superAdmin.dashboard} replace />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
          </Route>

          {/* Gestionnaire */}
          <Route path={PATHS.gestionnaire.root} element={<GestionnaireLayout />}>
            <Route index element={<Navigate to={PATHS.gestionnaire.dashboard} replace />} />
            <Route path="dashboard" element={<GestionnaireDashboard />} />
          </Route>

          {/* Enseignant */}
          <Route path={PATHS.enseignant.root} element={<EnseignantLayout />}>
            <Route index element={<Navigate to={PATHS.enseignant.dashboard} replace />} />
            <Route path="dashboard" element={<EnseignantDashboard />} />
          </Route>

          {/* Étudiant */}
          <Route path={PATHS.etudiant.root} element={<EtudiantLayout />}>
            <Route index element={<Navigate to={PATHS.etudiant.dashboard} replace />} />
            <Route path="dashboard" element={<EtudiantDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={PATHS.home} replace />} />

        </Routes>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App