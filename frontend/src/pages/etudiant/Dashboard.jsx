import { BookOpen, ClipboardList, FileText, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'

const stats = [
    { label: 'UE inscrites', value: 6, icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Moyenne générale', value: '13.4', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'UE validées', value: 4, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'UE en difficulté', value: 1, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
]

const notes = [
    { ue: 'Algorithmique avancée', coef: 3, note: 15.5, statut: 'validée' },
    { ue: 'Bases de données', coef: 2, note: 12.0, statut: 'validée' },
    { ue: 'Réseaux', coef: 2, note: 8.5, statut: 'en difficulté' },
    { ue: 'Mathématiques L2', coef: 3, note: 14.0, statut: 'validée' },
    { ue: 'Anglais technique', coef: 1, note: 16.0, statut: 'validée' },
    { ue: 'Projet tutoré', coef: 2, note: null, statut: 'en attente' },
]

export default function EtudiantDashboard() {
    return (
        <div className="p-6 space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
                <p className="text-sm text-slate-500 mt-1">Jean-Pierre Nkomo — Informatique L2 · Juin 2026</p>
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

            {/* Relevé de notes */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                    <ClipboardList className="h-4 w-4 text-slate-400" />
                    <h2 className="text-sm font-semibold text-slate-700">Mes notes — Trimestre 2</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                <th className="text-left px-5 py-3 font-semibold">Unité d'enseignement</th>
                                <th className="text-center px-4 py-3 font-semibold">Coeff.</th>
                                <th className="text-center px-4 py-3 font-semibold">Note /20</th>
                                <th className="text-center px-4 py-3 font-semibold">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {notes.map((n, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3 font-medium text-slate-800">{n.ue}</td>
                                    <td className="px-4 py-3 text-center text-slate-500">{n.coef}</td>
                                    <td className="px-4 py-3 text-center">
                                        {n.note !== null ? (
                                            <span className={`font-bold ${n.note >= 10 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {n.note.toFixed(1)}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${n.statut === 'validée' ? 'bg-emerald-100 text-emerald-700' :
                                                n.statut === 'en difficulté' ? 'bg-rose-100 text-rose-700' :
                                                    'bg-slate-100 text-slate-500'
                                            }`}>
                                            {n.statut}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}