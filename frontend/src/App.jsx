import { Routes, Route, Navigate } from 'react-router'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { PATHS } from './router/paths'

// Pages
import Home from './pages/Home'
import SuperAdminProfil from './pages/super-admin/Profile'
import GestionnaireProfil from './pages/gestionnaire/Profile'
import ChefDeptProfil from './pages/chef-departement/Profile'
import EnseignantProfil from './pages/enseignant/Profile'
import EtudiantProfil from './pages/etudiant/Profile'

// Layouts
import SuperAdminLayout from './pages/super-admin/SuperAdminLayout'
import GestionnaireLayout from './pages/gestionnaire/GestionnaireLayout'
import EnseignantLayout from './pages/enseignant/EnseignantLayout'
import EtudiantLayout from './pages/etudiant/EtudiantLayout'
import ChefDeptLayout from './pages/chef-departement/ChefDeptLayout'

// Dashboards
import SuperAdminDashboard from './pages/super-admin/Dashboard'
import GestionnaireDashboard from './pages/gestionnaire/Dashboard'
import EnseignantDashboard from './pages/enseignant/Dashboard'
import EtudiantDashboard from './pages/etudiant/Dashboard'
import ChefDeptDashboard from './pages/chef-departement/Dashboard'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Routes>

          <Route path={PATHS.home} element={<Home />} />


          {/* Super Admin */}
          <Route path={PATHS.superAdmin.root} element={<SuperAdminLayout />}>
            <Route index element={<Navigate to={PATHS.superAdmin.dashboard} replace />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="profil" element={<SuperAdminProfil />} />
          </Route>

          {/* Gestionnaire */}
          <Route path={PATHS.gestionnaire.root} element={<GestionnaireLayout />}>
            <Route index element={<Navigate to={PATHS.gestionnaire.dashboard} replace />} />
            <Route path="dashboard" element={<GestionnaireDashboard />} />
            <Route path="profil" element={<GestionnaireProfil />} />
          </Route>

          {/* Chef de Département */}
          <Route path={PATHS.chefDept.root} element={<ChefDeptLayout />}>
            <Route index element={<Navigate to={PATHS.chefDept.dashboard} replace />} />
            <Route path="dashboard" element={<ChefDeptDashboard />} />
            <Route path="profil" element={<ChefDeptProfil />} />
          </Route>

          {/* Enseignant */}
          <Route path={PATHS.enseignant.root} element={<EnseignantLayout />}>
            <Route index element={<Navigate to={PATHS.enseignant.dashboard} replace />} />
            <Route path="dashboard" element={<EnseignantDashboard />} />
            <Route path="profil" element={<EnseignantProfil />} />
          </Route>

          {/* Étudiant */}
          <Route path={PATHS.etudiant.root} element={<EtudiantLayout />}>
            <Route index element={<Navigate to={PATHS.etudiant.dashboard} replace />} />
            <Route path="dashboard" element={<EtudiantDashboard />} />
            <Route path="profil" element={<EtudiantProfil />} />
          </Route>

          <Route path="*" element={<Navigate to={PATHS.home} replace />} />

        </Routes>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App