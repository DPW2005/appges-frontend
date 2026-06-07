import { GraduationCap, Users, BookOpen, Receipt, FileText, Calendar, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router'
import { PATHS } from '@/router/paths'

const stats = [
    { label: 'Étudiants inscrits', value: 214, icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Enseignants', value: 18, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    { label: 'UE actives', value: 34, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Factures en attente', value: 6, icon: Receipt, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
]

const actions = [
    { label: 'Gérer les étudiants', icon: GraduationCap, path: PATHS.gestionnaire.etudiants, color: 'bg-blue-600' },
    { label: 'Gérer les enseignants', icon: Users, path: PATHS.gestionnaire.enseignants, color: 'bg-violet-600' },
    { label: 'Cours & UE', icon: BookOpen, path: PATHS.gestionnaire.cours, color: 'bg-emerald-600' },
    { label: 'Factures', icon: Receipt, path: PATHS.gestionnaire.factures, color: 'bg-amber-600' },
    { label: 'Bulletins', icon: FileText, path: PATHS.gestionnaire.bulletins, color: 'bg-rose-600' },
    { label: 'Planning', icon: Calendar, path: PATHS.gestionnaire.planning, color: 'bg-cyan-600' },
]

const alertes = [
    { texte: '3 séances non validées — Filière Informatique L2', niveau: 'warning' },
    { texte: '6 factures en attente de génération (Trimestre 2)', niveau: 'warning' },
    { texte: 'Bulletins T1 disponibles — 214 étudiants', niveau: 'success' },
]

const niveauColor = {
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
}

export default function GestionnaireDashboard() {
    const navigate = useNavigate()

    return (
        <div className="p-6 space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
                <p className="text-sm text-slate-500 mt-1">Gestion de la scolarité — Juin 2026</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
                    <div key={label} className={`rounded-xl border ${border} ${bg} p-4 flex items-center gap-4`}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                            <Icon className={`h-5 w-5 ${color}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{value}</p>
                            <p className="text-xs text-slate-500">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Alertes */}
            <div className="space-y-2">
                {alertes.map((a, i) => (
                    <div key={i} className={`rounded-lg border px-4 py-3 text-sm font-medium ${niveauColor[a.niveau]}`}>
                        {a.texte}
                    </div>
                ))}
            </div>

            {/* Actions rapides */}
            <div>
                <h2 className="text-sm font-semibold text-slate-600 mb-3">Accès rapides</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {actions.map(({ label, icon: Icon, path, color }) => (
                        <button
                            key={label}
                            onClick={() => navigate(path)}
                            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left group"
                        >
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}>
                                <Icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 ml-auto transition-colors" />
                        </button>
                    ))}
                </div>
            </div>

        </div>
    )
}