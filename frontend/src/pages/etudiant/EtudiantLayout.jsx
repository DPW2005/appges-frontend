import { NavLink, Outlet, useNavigate } from 'react-router'
import { PATHS } from '@/router/paths'
import { LayoutDashboard, ClipboardList, FileText, User, ArrowLeft, GraduationCap, Calendar } from 'lucide-react'

const navItems = [
    { to: PATHS.etudiant.dashboard, label: 'Dashboard', icon: LayoutDashboard },
    { separator: true, label: 'Consultation' },
    { to: PATHS.etudiant.notes, label: 'Mes notes', icon: ClipboardList },
    { separator: true, label: 'Compte' },
    { to: PATHS.etudiant.profil, label: 'Mon profil', icon: User },
]

export default function EtudiantLayout() {
    const navigate = useNavigate()

    return (
        <div className="flex h-screen bg-slate-100">

            <aside className="w-64 bg-amber-900 text-white flex flex-col">

                <div className="flex items-center gap-3 px-6 py-5 border-b border-amber-700">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
                        <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Étudiant</p>
                        <p className="text-xs text-amber-300">APPGES</p>
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
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-200 hover:bg-amber-800 hover:text-white transition-all"
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