import { Users, ShieldCheck, ScrollText, Activity, GraduationCap, BookOpen, AlertTriangle } from 'lucide-react'

const stats = [
    { label: 'Comptes actifs', value: 47, icon: ShieldCheck, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    { label: 'Enseignants', value: 18, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Étudiants', value: 214, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Comptes suspendus', value: 3, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
]

const journaux = [
    { action: 'Compte créé', cible: 'Paul Mbarga (Enseignant)', heure: 'Il y a 12 min', type: 'success' },
    { action: 'Compte suspendu', cible: 'Alice Fouda (Gestionnaire)', heure: 'Il y a 1h', type: 'warning' },
    { action: 'Connexion', cible: 'Admin principal', heure: 'Il y a 2h', type: 'info' },
    { action: 'Export PDF', cible: 'Bulletins — Filière Informatique', heure: 'Il y a 3h', type: 'info' },
    { action: 'Mot de passe réinitialisé', cible: 'Jean Nkomo (Étudiant)', heure: 'Hier 16h30', type: 'warning' },
]

const typeColor = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
}

export default function SuperAdminDashboard() {
    return (
        <div className="p-6 space-y-6">

            {/* En-tête */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
                <p className="text-sm text-slate-500 mt-1">Vue globale du système — Juin 2026</p>
            </div>

            {/* Cartes stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
                    <div key={label} className={`rounded-xl border ${border} ${bg} p-4 flex items-center gap-4`}>
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm`}>
                            <Icon className={`h-5 w-5 ${color}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{value}</p>
                            <p className="text-xs text-slate-500">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Journaux récents */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                    <ScrollText className="h-4 w-4 text-slate-400" />
                    <h2 className="text-sm font-semibold text-slate-700">Activité récente</h2>
                </div>
                <ul className="divide-y divide-slate-50">
                    {journaux.map((j, i) => (
                        <li key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColor[j.type]}`}>
                                    {j.action}
                                </span>
                                <span className="text-sm text-slate-600">{j.cible}</span>
                            </div>
                            <span className="text-xs text-slate-400 shrink-0 ml-4">{j.heure}</span>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}