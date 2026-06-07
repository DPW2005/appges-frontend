import { GraduationCap, Users, BookOpen, ClipboardList, CheckCircle, Clock } from 'lucide-react'

const stats = [
    { label: 'Étudiants — ma filière', value: 87, icon: GraduationCap, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    { label: 'Enseignants', value: 9, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'UE cette année', value: 14, icon: BookOpen, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    { label: 'Notes à saisir', value: 3, icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
]

const notesEnAttente = [
    { ue: 'Algorithmique avancée', filiere: 'Informatique L2', echeance: '15 juin 2026', urgent: true },
    { ue: 'Bases de données', filiere: 'Informatique L1', echeance: '20 juin 2026', urgent: false },
    { ue: 'Réseaux informatiques', filiere: 'Informatique L3', echeance: '25 juin 2026', urgent: false },
]

const seancesRecentes = [
    { enseignant: 'Dr. Paul Mbarga', ue: 'Algorithmique avancée', date: '05 juin', statut: 'validée' },
    { enseignant: 'Mme Claire Ateba', ue: 'Mathématiques L2', date: '04 juin', statut: 'validée' },
    { enseignant: 'M. Serge Nkomo', ue: 'Bases de données', date: '03 juin', statut: 'en attente' },
]

export default function ChefDeptDashboard() {
    return (
        <div className="p-6 space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
                <p className="text-sm text-slate-500 mt-1">Filière Informatique — Juin 2026</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Notes en attente */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                        <ClipboardList className="h-4 w-4 text-slate-400" />
                        <h2 className="text-sm font-semibold text-slate-700">Notes à saisir</h2>
                    </div>
                    <ul className="divide-y divide-slate-50">
                        {notesEnAttente.map((n, i) => (
                            <li key={i} className="px-5 py-3 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{n.ue}</p>
                                    <p className="text-xs text-slate-500">{n.filiere}</p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${n.urgent ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {n.echeance}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Séances récentes */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <h2 className="text-sm font-semibold text-slate-700">Séances récentes</h2>
                    </div>
                    <ul className="divide-y divide-slate-50">
                        {seancesRecentes.map((s, i) => (
                            <li key={i} className="px-5 py-3 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{s.enseignant}</p>
                                    <p className="text-xs text-slate-500">{s.ue} — {s.date}</p>
                                </div>
                                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${s.statut === 'validée'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {s.statut === 'validée' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                    {s.statut}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    )
}