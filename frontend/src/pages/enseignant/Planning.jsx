import { useState } from 'react'
import { PLANNING_DATA, JOURS, TRANCHES } from '@/data/PlanningData'
import { Clock, Check } from 'lucide-react'

const MON_NOM = 'Dr. Paul Mbarga'

function getMesSeances() {
    const result = []
    Object.entries(PLANNING_DATA).forEach(([filiere, classes]) => {
        Object.entries(classes).forEach(([classe, seances]) => {
            seances.forEach(s => {
                if (s.enseignant === MON_NOM) result.push({ ...s, filiere, classe })
            })
        })
    })
    return result
}

const STATUT_COLORS = {
    'planifiée': 'bg-blue-100 border-blue-300 text-blue-800',
    'validée': 'bg-emerald-100 border-emerald-300 text-emerald-800',
    'non validée': 'bg-rose-100 border-rose-300 text-rose-800',
}

export default function EnseignantPlanning() {
    const [seances, setSeances] = useState(getMesSeances)

    function handleValider(id) {
        setSeances(prev => prev.map(s => s.id === id ? { ...s, statut: 'validée' } : s))
    }

    function getSeance(jour, trancheId) {
        return seances.find(s => s.jour === jour && s.tranche === trancheId) ?? null
    }

    const aValider = seances.filter(s => s.statut === 'non validée').length

    return (
        <div className="p-6 space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mon planning</h1>
                <p className="text-sm text-slate-500 mt-1">{MON_NOM} — Toutes mes séances</p>
            </div>

            {aValider > 0 && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                    <p className="text-sm text-amber-700 font-medium">
                        {aValider} séance{aValider > 1 ? 's' : ''} à valider
                    </p>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] border-collapse">
                        <thead>
                            <tr className="bg-emerald-800 text-white">
                                <th className="w-36 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-left border-r border-emerald-700">
                                    Horaire
                                </th>
                                {JOURS.map(j => (
                                    <th key={j} className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-center border-r border-emerald-700 last:border-r-0">
                                        {j}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TRANCHES.map(tranche => (
                                <tr key={tranche.id} className="border-b border-slate-100">
                                    <td className={`px-4 py-3 border-r border-slate-200 align-middle ${tranche.pause ? 'bg-amber-50' : 'bg-slate-50'}`}>
                                        <p className={`text-xs font-bold whitespace-nowrap ${tranche.pause ? 'text-amber-600' : 'text-slate-600'}`}>
                                            {tranche.debut} – {tranche.fin}
                                        </p>
                                        {tranche.pause && <p className="text-xs text-amber-500 font-semibold mt-0.5">Pause déjeuner</p>}
                                    </td>
                                    {JOURS.map(jour => {
                                        const seance = tranche.pause ? null : getSeance(jour, tranche.id)
                                        return (
                                            <td key={jour} className={`px-2 py-2 border-r border-slate-100 last:border-r-0 align-top min-w-[130px] ${tranche.pause ? 'bg-amber-50/40' : ''}`}>
                                                {tranche.pause ? (
                                                    <div className="h-8 flex items-center justify-center">
                                                        <span className="text-xs text-amber-400 font-medium">—</span>
                                                    </div>
                                                ) : seance ? (
                                                    <div className={`rounded-lg border px-2.5 py-2 text-xs ${STATUT_COLORS[seance.statut]}`}>
                                                        <p className="font-semibold leading-tight line-clamp-2">{seance.ue}</p>
                                                        <p className="opacity-75 mt-1 truncate">{seance.filiere} {seance.classe}</p>
                                                        <p className="opacity-60 truncate">{seance.salle}</p>
                                                        <div className="flex items-center justify-between mt-2 gap-1">
                                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${seance.statut === 'validée' ? 'bg-emerald-200 text-emerald-800' :
                                                                    seance.statut === 'non validée' ? 'bg-rose-200 text-rose-800' :
                                                                        'bg-white/70 text-slate-600'
                                                                }`}>
                                                                {seance.statut === 'validée' ? '✓' : seance.statut === 'non validée' ? '✗' : '~'} {seance.statut}
                                                            </span>
                                                            {seance.statut === 'non validée' && (
                                                                <button onClick={() => handleValider(seance.id)}
                                                                    className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors">
                                                                    <Check className="h-3 w-3" /> Valider
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="min-h-[80px]" />
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Légende */}
            <div className="flex items-center gap-4 px-1">
                {[
                    { label: 'Planifiée', color: 'bg-blue-300' },
                    { label: 'Validée', color: 'bg-emerald-300' },
                    { label: 'Non validée', color: 'bg-rose-300' },
                ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <div className={`h-3 w-3 rounded-full ${color}`} />
                        <span className="text-xs text-slate-500">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}