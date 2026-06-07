import { Calendar, ClipboardList, CheckCircle, Clock, BookOpen, Users } from 'lucide-react'

const stats = [
    { label: 'UE enseignées', value: 4, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Étudiants au total', value: 156, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Séances ce mois', value: 12, icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    { label: 'Notes à saisir', value: 2, icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
]

const planning = [
    { ue: 'Algorithmique avancée', classe: 'Informatique L2', jour: 'Lundi', heure: '08h00 – 10h00', salle: 'Salle A12' },
    { ue: 'Structures de données', classe: 'Informatique L1', jour: 'Mardi', heure: '10h00 – 12h00', salle: 'Salle B04' },
    { ue: 'Algorithmique avancée', classe: 'Informatique L2', jour: 'Jeudi', heure: '14h00 – 16h00', salle: 'Salle A12' },
    { ue: 'Projet tutoré', classe: 'Informatique L3', jour: 'Vendredi', heure: '08h00 – 11h00', salle: 'Labo Info' },
]

const seances = [
    { ue: 'Algorithmique avancée', date: '03 juin', statut: 'validée' },
    { ue: 'Structures de données', date: '04 juin', statut: 'validée' },
    { ue: 'Projet tutoré', date: '05 juin', statut: 'en attente' },
]

export default function EnseignantDashboard() {
    return (
        <div className="p-6 space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
                <p className="text-sm text-slate-500 mt-1">Bienvenue, Dr. Paul Mbarga — Juin 2026</p>
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

                {/* Planning semaine */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <h2 className="text-sm font-semibold text-slate-700">Mon planning</h2>
                    </div>
                    <ul className="divide-y divide-slate-50">
                        {planning.map((p, i) => (
                            <li key={i} className="px-5 py-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-slate-800">{p.ue}</p>
                                    <span className="text-xs text-slate-500">{p.jour} · {p.heure}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">{p.classe} — {p.salle}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Séances récentes */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                        <CheckCircle className="h-4 w-4 text-slate-400" />
                        <h2 className="text-sm font-semibold text-slate-700">Validation des séances</h2>
                    </div>
                    <ul className="divide-y divide-slate-50">
                        {seances.map((s, i) => (
                            <li key={i} className="px-5 py-3 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{s.ue}</p>
                                    <p className="text-xs text-slate-500">{s.date}</p>
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