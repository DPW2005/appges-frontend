import { NavLink, Outlet, useNavigate } from 'react-router'
import { PATHS } from '@/router/paths'
import {
    LayoutDashboard, GraduationCap, Users,
    BookOpen, ClipboardList, User, ArrowLeft, Briefcase,
    Calendar
} from 'lucide-react'

const navItems = [
    { to: PATHS.chefDept.dashboard, label: 'Dashboard', icon: LayoutDashboard },
    { separator: true, label: 'Consultation' },
    { to: PATHS.chefDept.etudiants, label: 'Étudiants', icon: GraduationCap },
    { to: PATHS.chefDept.enseignants, label: 'Enseignants', icon: Users },
    { to: PATHS.chefDept.cours, label: 'UE / Cours', icon: BookOpen },
    { to: PATHS.chefDept.planning, label: 'Planning', icon: Calendar },
    { separator: true, label: 'Saisie' },
    { to: PATHS.chefDept.notes, label: 'Notes filière', icon: ClipboardList },
    { separator: true, label: 'Compte' },
    { to: PATHS.chefDept.profil, label: 'Mon profil', icon: User },
]

export default function ChefDeptLayout() {
    const navigate = useNavigate()

    return (
        <div className="flex h-screen bg-slate-100">
            <aside className="w-64 bg-cyan-900 text-white flex flex-col">

                <div className="flex items-center gap-3 px-6 py-5 border-b border-cyan-700">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500">
                        <Briefcase className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Chef de Département</p>
                        <p className="text-xs text-cyan-300">APPGES</p>
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

                <div className="px-3 pb-4 border-t border-cyan-700 pt-3">
                    <button
                        onClick={() => navigate(PATHS.home)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cyan-200 hover:bg-cyan-800 hover:text-white transition-all"
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