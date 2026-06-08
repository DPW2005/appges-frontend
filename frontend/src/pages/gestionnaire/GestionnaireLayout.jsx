import { NavLink, Outlet, useNavigate } from 'react-router'
import { PATHS } from '@/router/paths'
import {
    LayoutDashboard, Users, User, GraduationCap, BookOpen,
    Receipt, FileText, Calendar, ArrowLeft, HandCoins, TreePine
} from 'lucide-react'

const navItems = [
    { to: PATHS.gestionnaire.dashboard, label: 'Dashboard', icon: LayoutDashboard },
    { separator: true, label: 'Gestion' },
    { to: PATHS.gestionnaire.etudiants, label: 'Étudiants', icon: GraduationCap },
    { to: PATHS.gestionnaire.enseignants, label: 'Enseignants', icon: Users },
    { to: PATHS.gestionnaire.planning, label: 'Planning', icon: Calendar },
    { separator: true, label: 'Consultation' },
    { to: PATHS.gestionnaire.filieres, label: 'Filières', icon: TreePine },
    { to: PATHS.gestionnaire.factures, label: 'Factures', icon: Receipt },
    { to: PATHS.gestionnaire.bulletins, label: 'Bulletins', icon: FileText },
    { to: PATHS.gestionnaire.cours, label: 'Cours / UE', icon: BookOpen },
    { separator: true, label: 'Compte' },
    { to: PATHS.gestionnaire.profil, label: 'Mon profil', icon: User },

]

export default function GestionnaireLayout() {
    const navigate = useNavigate()

    return (
        <div className="flex h-screen bg-slate-100">

            <aside className="w-64 bg-blue-950 text-white flex flex-col">

                <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-800">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                        <HandCoins className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Gestionnaire</p>
                        <p className="text-xs text-blue-300">Scolarité</p>
                    </div>
                </div>

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

                <div className="px-3 pb-4">
                    <button
                        onClick={() => navigate(PATHS.home)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-blue-900 hover:text-white transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Accueil
                    </button>
                </div>

            </aside>

            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>

        </div>
    )
}