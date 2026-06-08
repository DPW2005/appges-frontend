import { NavLink, Outlet, useNavigate } from 'react-router'
import { PATHS } from '@/router/paths'
import { LayoutDashboard, Users, GraduationCap, BookOpen, Receipt, FileText, User, BookCheck, ScrollText, ArrowLeft, Shield, HandCoins, TreePine } from 'lucide-react'

const navItems = [
    { to: PATHS.superAdmin.dashboard, label: 'Dashboard', icon: LayoutDashboard },
    { separator: true, label: 'Consultation' },
    { to: PATHS.superAdmin.superAdmin, label: 'Super Admin', icon: Shield },
    { to: PATHS.superAdmin.gestionnaires, label: 'Gestionnaires', icon: HandCoins },
    { separator: true, label: 'Gestion' },
    { to: PATHS.superAdmin.journaux, label: 'Journaux', icon: ScrollText },
    { to: PATHS.superAdmin.filiere, label: 'Filière', icon: TreePine },
    { to: PATHS.superAdmin.etudiants, label: 'Étudiants', icon: GraduationCap },
    { to: PATHS.superAdmin.enseignants, label: 'Enseignants', icon: BookCheck },
    { to: PATHS.superAdmin.cours, label: 'Cours / UE', icon: BookOpen },
    { to: PATHS.superAdmin.factures, label: 'Factures', icon: Receipt },
    { to: PATHS.superAdmin.bulletins, label: 'Bulletins', icon: FileText },
    { separator: true, label: 'Compte' },
    { to: PATHS.superAdmin.profil, label: 'Mon profil', icon: User },
]

export default function SuperAdminLayout() {
    const navigate = useNavigate()

    return (
        <div className="flex h-screen bg-slate-100">

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">

                {/* Header sidebar */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                        <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Super Admin</p>
                        <p className="text-xs text-slate-400">APPGES</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map((item, i) => {
                        if (item.separator) {
                            return (
                                <p key={i} className="px-3 pt-4 pb-1 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                                    {item.label}
                                </p>
                            )
                        }
                        const Icon = item.icon
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'bg-cyan-500 text-white'
                                        : 'text-cyan-200 hover:bg-cyan-800 hover:text-white'
                                    }`
                                }
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </NavLink>
                        )
                    })}
                </nav>

                {/* Retour accueil */}
                <div className="px-3 pb-4">
                    <button
                        onClick={() => navigate(PATHS.home)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Accueil
                    </button>
                </div>

            </aside>

            {/* Contenu principal */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>

        </div>
    )
}