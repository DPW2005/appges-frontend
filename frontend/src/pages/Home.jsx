import { useNavigate } from 'react-router'
import { PATHS } from '@/router/paths'
import {
    Shield,
    User,
    GraduationCap,
    ArrowRight,
    HandCoins,
    Briefcase
} from 'lucide-react'

const portails = [
    {
        role: 'Super Administrateur',
        description: 'Supervision globale, gestion des comptes et consultation des journaux système.',
        path: PATHS.superAdmin.dashboard,
        icon: Shield,
        bg: 'bg-violet-600',
        hover: 'hover:border-violet-400',
        badge: 'bg-violet-100 text-violet-700',
        arrow: 'group-hover:bg-violet-600',
    },
    {
        role: 'Gestionnaire / Scolarité',
        description: 'Gestion des étudiants, enseignants, cours, factures, bulletins et plannings.',
        path: PATHS.gestionnaire.dashboard,
        icon: HandCoins,
        bg: 'bg-blue-600',
        hover: 'hover:border-blue-400',
        badge: 'bg-blue-100 text-blue-700',
        arrow: 'group-hover:bg-blue-600',
    },
    {
        role: 'Chef de Département',
        description: 'Consultation de la filière, des UE et des enseignants. Saisie des notes de sa filière.',
        path: PATHS.chefDept.dashboard,
        icon: Briefcase,
        bg: 'bg-cyan-600',
        hover: 'hover:border-cyan-400 hover:shadow-cyan-100',
        badge: 'bg-cyan-100 text-cyan-700',
        arrow: 'group-hover:bg-cyan-600',
    },
    {
        role: 'Enseignant',
        description: 'Consultation du planning, saisie des notes et suivi des séances validées.',
        path: PATHS.enseignant.dashboard,
        icon: User,
        bg: 'bg-emerald-600',
        hover: 'hover:border-emerald-400',
        badge: 'bg-emerald-100 text-emerald-700',
        arrow: 'group-hover:bg-emerald-600',
    },
    {
        role: 'Étudiant',
        description: 'Consultation des notes, du bulletin et des unités d\'enseignement inscrites.',
        path: PATHS.etudiant.dashboard,
        icon: GraduationCap,
        bg: 'bg-amber-500',
        hover: 'hover:border-amber-400',
        badge: 'bg-amber-100 text-amber-700',
        arrow: 'group-hover:bg-amber-500',
    },
]

export default function Home() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
                        <span className="text-xs font-bold text-white">AG</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">APPGES</p>
                        <p className="text-xs text-slate-400 leading-tight">Gestion des Enseignements</p>
                    </div>
                </div>
                <span className="text-xs text-slate-400 border border-slate-200 px-3 py-1 rounded-full">
                    v1.0 — Prototype
                </span>
            </header>

            {/* Contenu central */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">

                {/* Titre */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Bienvenue sur APPGES
                    </h1>
                    <p className="mt-3 text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
                        Sélectionnez votre espace de travail pour accéder aux fonctionnalités correspondant à votre rôle.
                    </p>
                </div>

                {/* Grille des 4 portails */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-5xl">
                    {portails.map(({ role, description, path, icon: Icon, bg, hover, badge, arrow }) => (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className={`group relative flex flex-col items-start text-left p-6 bg-white rounded-2xl border-2 border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${hover}`}
                        >
                            {/* Icône */}
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} mb-4 shadow-sm`}>
                                <Icon className="h-5 w-5 text-white" />
                            </div>

                            {/* Rôle */}
                            <p className="text-sm font-semibold text-slate-900 leading-snug mb-2">
                                {role}
                            </p>

                            {/* Description */}
                            <p className="text-xs text-slate-500 leading-relaxed flex-1">
                                {description}
                            </p>

                            {/* Badge + flèche */}
                            <div className="flex items-center justify-between w-full mt-5">
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge}`}>
                                    Accéder
                                </span>
                                <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 transition-all duration-200 ${arrow}`}>
                                    <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

            </div>

            {/* Footer */}
            <footer className="text-center py-5 text-xs text-slate-400 border-t border-slate-200">
                APPGES — Institut de formation · Juin 2026
            </footer>

        </div>
    )
}