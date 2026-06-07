import { useState } from 'react'
import { BookOpen, TrendingUp } from 'lucide-react'

const TRIMESTRES = {
    T1: [
        { ue: 'Algorithmique avancée', code: 'INFO301', coef: 3, note: 14.0, semestre: 'S1' },
        { ue: 'Introduction à la prog.', code: 'INFO101', coef: 3, note: 16.5, semestre: 'S1' },
        { ue: 'Mathématiques L1', code: 'INFO102', coef: 3, note: 11.5, semestre: 'S1' },
        { ue: 'Anglais technique', code: 'INFO103', coef: 1, note: 15.0, semestre: 'S1' },
    ],
    T2: [
        { ue: 'Algorithmique avancée', code: 'INFO301', coef: 3, note: 15.5, semestre: 'S2' },
        { ue: 'Bases de données', code: 'INFO302', coef: 2, note: 12.0, semestre: 'S2' },
        { ue: 'Réseaux', code: 'INFO401', coef: 2, note: 8.5, semestre: 'S2' },
        { ue: 'Mathématiques L2', code: 'INFO102', coef: 3, note: 14.0, semestre: 'S2' },
        { ue: 'Anglais technique', code: 'INFO103', coef: 1, note: 16.0, semestre: 'S2' },
        { ue: 'Projet tutoré', code: 'INFO402', coef: 2, note: null, semestre: 'S2' },
    ],
}

function moyenne(notes) {
    const valides = notes.filter(n => n.note !== null)
    if (valides.length === 0) return null
    const totalCoef = valides.reduce((s, n) => s + n.coef, 0)
    const totalNote = valides.reduce((s, n) => s + n.note * n.coef, 0)
    return (totalNote / totalCoef).toFixed(2)
}

export default function EtudiantNotes() {
    const [trimestre, setTrimestre] = useState('T2')
    const notes = TRIMESTRES[trimestre]
    const moy = moyenne(notes)

    return (
        <div className="p-6 space-y-5">

            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mes notes</h1>
                <p className="text-sm text-slate-500 mt-1">Jean-Pierre Nkomo — Informatique L2</p>
            </div>

            {/* Sélecteur trimestre */}
            <div className="flex items-center gap-2">
                {Object.keys(TRIMESTRES).map(t => (
                    <button key={t} onClick={() => setTrimestre(t)}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all ${trimestre === t
                                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                            }`}>
                        Trimestre {t}
                    </button>
                ))}
            </div>

            {/* Résumé */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    {
                        label: 'Moyenne générale',
                        value: moy ?? '—',
                        color: moy && parseFloat(moy) >= 10 ? 'text-emerald-600' : 'text-rose-600',
                        bg: 'bg-emerald-50', border: 'border-emerald-200',
                        icon: TrendingUp,
                    },
                    {
                        label: 'UE validées',
                        value: notes.filter(n => n.note !== null && n.note >= 10).length,
                        color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
                        icon: BookOpen,
                    },
                    {
                        label: 'UE en difficulté',
                        value: notes.filter(n => n.note !== null && n.note < 10).length,
                        color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200',
                        icon: BookOpen,
                    },
                ].map(({ label, value, color, bg, border, icon: Icon }) => (
                    <div key={label} className={`rounded-xl border ${border} ${bg} p-4 flex items-center gap-3`}>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                            <Icon className={`h-4 w-4 ${color}`} />
                        </div>
                        <div>
                            <p className={`text-xl font-bold ${color}`}>{value}</p>
                            <p className="text-xs text-slate-500">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tableau notes */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <h2 className="text-sm font-semibold text-slate-700">Relevé de notes — Trimestre {trimestre}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <th className="text-left px-5 py-3 font-semibold">Unité d'enseignement</th>
                                <th className="text-left px-4 py-3 font-semibold">Code</th>
                                <th className="text-center px-4 py-3 font-semibold">Coeff.</th>
                                <th className="text-center px-4 py-3 font-semibold">Note /20</th>
                                <th className="text-center px-4 py-3 font-semibold">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {notes.map((n, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3 font-medium text-slate-800">{n.ue}</td>
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{n.code}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-slate-500">{n.coef}</td>
                                    <td className="px-4 py-3 text-center">
                                        {n.note !== null ? (
                                            <span className={`text-base font-bold ${n.note >= 10 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {n.note.toFixed(1)}
                                            </span>
                                        ) : (
                                            <span className="text-slate-300 font-semibold">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${n.note === null ? 'bg-slate-100 text-slate-400' :
                                                n.note >= 10 ? 'bg-emerald-100 text-emerald-700' :
                                                    'bg-rose-100 text-rose-700'
                                            }`}>
                                            {n.note === null ? 'en attente' : n.note >= 10 ? 'validée' : 'en difficulté'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-slate-50 border-t border-slate-200">
                                <td colSpan={3} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Moyenne pondérée
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`text-base font-bold ${moy && parseFloat(moy) >= 10 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {moy ?? '—'}
                                    </span>
                                </td>
                                <td />
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}