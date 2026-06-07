import { NavLink, Outlet, useNavigate } from 'react-router'
import { PATHS } from '@/router/paths'
import { LayoutDashboard, Users, ScrollText, ArrowLeft, Shield } from 'lucide-react'

const navItems = [
    { to: PATHS.superAdmin.dashboard, label: 'Dashboard', icon: LayoutDashboard },
    { to: PATHS.superAdmin.comptes, label: 'Comptes', icon: Users },
    { to: PATHS.superAdmin.journaux, label: 'Journaux', icon: ScrollText },
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
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-violet-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </NavLink>
                    ))}
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