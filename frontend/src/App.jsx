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
import SuperAdminEtudiants from './pages/super-admin/Etudiants'
import GestionnaireEtudiants from './pages/gestionnaire/Etudiants'
import ChefDeptEtudiants from './pages/chef-departement/Etudiants'
import SuperAdminEnseignants from './pages/super-admin/Enseignants'
import GestionnaireEnseignants from './pages/gestionnaire/Enseignants'
import ChefDeptEnseignants from './pages/chef-departement/Enseignants'
import SuperAdminCours from './pages/super-admin/Cours'
import GestionnaireCours from './pages/gestionnaire/Cours'
import ChefDeptCours from './pages/chef-departement/Cours'
import ChefDeptNotes from './pages/chef-departement/Notes'
import EnseignantNotes from './pages/enseignant/Notes'
import EtudiantNotes from './pages/etudiant/Notes'
import GestionnairePlanning from './pages/gestionnaire/Planning'
import ChefDeptPlanning from './pages/chef-departement/Planning'
import EnseignantPlanning from './pages/enseignant/Planning'
import SuperAdminFactures from './pages/super-admin/Factures'
import GestionnaireFactures from './pages/gestionnaire/Factures'
import SuperAdminBulletins from './pages/super-admin/Bulletins'
import GestionnaireBulletins from './pages/gestionnaire/Bulletins'

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
            <Route path="etudiants" element={<SuperAdminEtudiants />} />
            <Route path="enseignants" element={<SuperAdminEnseignants />} />
            <Route path="cours" element={<SuperAdminCours />} />
            <Route path="factures" element={<SuperAdminFactures />} />
            <Route path="bulletins" element={<SuperAdminBulletins />} />
          </Route>

          {/* Gestionnaire */}
          <Route path={PATHS.gestionnaire.root} element={<GestionnaireLayout />}>
            <Route index element={<Navigate to={PATHS.gestionnaire.dashboard} replace />} />
            <Route path="dashboard" element={<GestionnaireDashboard />} />
            <Route path="profil" element={<GestionnaireProfil />} />
            <Route path="etudiants" element={<GestionnaireEtudiants />} />
            <Route path="enseignants" element={<GestionnaireEnseignants />} />
            <Route path="cours" element={<GestionnaireCours />} />
            <Route path="planning" element={<GestionnairePlanning />} />
            <Route path="factures" element={<GestionnaireFactures />} />
            <Route path="bulletins" element={<SuperAdminBulletins />} />
          </Route>

          {/* Chef de Département */}
          <Route path={PATHS.chefDept.root} element={<ChefDeptLayout />}>
            <Route index element={<Navigate to={PATHS.chefDept.dashboard} replace />} />
            <Route path="dashboard" element={<ChefDeptDashboard />} />
            <Route path="profil" element={<ChefDeptProfil />} />
            <Route path="etudiants" element={<ChefDeptEtudiants />} />
            <Route path="enseignants" element={<ChefDeptEnseignants />} />
            <Route path="cours" element={<ChefDeptCours />} />
            <Route path="notes" element={<ChefDeptNotes />} />
            <Route path="planning" element={<ChefDeptPlanning />} />
          </Route>

          {/* Enseignant */}
          <Route path={PATHS.enseignant.root} element={<EnseignantLayout />}>
            <Route index element={<Navigate to={PATHS.enseignant.dashboard} replace />} />
            <Route path="dashboard" element={<EnseignantDashboard />} />
            <Route path="profil" element={<EnseignantProfil />} />
            <Route path="notes" element={<EnseignantNotes />} />
            <Route path="planning" element={<EnseignantPlanning />} />
          </Route>

          {/* Étudiant */}
          <Route path={PATHS.etudiant.root} element={<EtudiantLayout />}>
            <Route index element={<Navigate to={PATHS.etudiant.dashboard} replace />} />
            <Route path="dashboard" element={<EtudiantDashboard />} />
            <Route path="profil" element={<EtudiantProfil />} />
            <Route path="notes" element={<EtudiantNotes />} />
          </Route>

          <Route path="*" element={<Navigate to={PATHS.home} replace />} />

        </Routes>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App