import { NavLink, Outlet, useNavigate } from 'react-router'
import { PATHS } from '@/router/paths'
import { LayoutDashboard, Calendar, ClipboardList, User, ArrowLeft } from 'lucide-react'

const navItems = [
    { to: PATHS.enseignant.dashboard, label: 'Dashboard', icon: LayoutDashboard },
    { to: PATHS.enseignant.planning, label: 'Planning', icon: Calendar },
    { to: PATHS.enseignant.notes, label: 'Notes', icon: ClipboardList },
    { to: PATHS.enseignant.profil, label: 'Mon profil', icon: User },
]

export default function EnseignantLayout() {
    const navigate = useNavigate()

    return (
        <div className="flex h-screen bg-slate-100">

            <aside className="w-64 bg-emerald-900 text-white flex flex-col">

                <div className="flex items-center gap-3 px-6 py-5 border-b border-emerald-700">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Enseignant</p>
                        <p className="text-xs text-emerald-300">APPGES</p>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'
                                }`
                            }
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-3 pb-4">
                    <button
                        onClick={() => navigate(PATHS.home)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-200 hover:bg-emerald-800 hover:text-white transition-all"
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