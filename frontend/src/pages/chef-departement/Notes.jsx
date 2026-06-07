import { useState } from 'react'
import { Check, Save, ChevronDown, AlertCircle, CheckCircle } from 'lucide-react'

const UES = [
    {
        id: 1, code: 'INFO301', intitule: 'Algorithmique avancée', niveau: 'L2', semestre: 'S2',
        etudiants: [
            { id: 1, nom: 'Jean-Pierre Nkomo', note: 15.5 },
            { id: 2, nom: 'Marie Ateba', note: 12.0 },
            { id: 3, nom: 'Carine Mballa', note: null },
            { id: 4, nom: 'Sandrine Foe', note: 9.5 },
            { id: 5, nom: 'Hervé Minkang', note: 17.0 },
        ]
    },
    {
        id: 2, code: 'INFO302', intitule: 'Bases de données', niveau: 'L1', semestre: 'S2',
        etudiants: [
            { id: 6, nom: 'Alain Biya', note: null },
            { id: 7, nom: 'Boris Nguema', note: 11.5 },
            { id: 8, nom: 'Nadège Essama', note: null },
            { id: 9, nom: 'Patrick Owona', note: 14.0 },
            { id: 10, nom: 'Eric Tamba', note: 8.0 },
        ]
    },
    {
        id: 3, code: 'INFO401', intitule: 'Réseaux informatiques', niveau: 'L3', semestre: 'S2',
        etudiants: [
            { id: 11, nom: 'Laure Ondoa', note: null },
            { id: 12, nom: 'Fatima Oumarou', note: 13.5 },
            { id: 13, nom: 'Sophie Mvondo', note: 16.0 },
            { id: 14, nom: 'Thierry Abena', note: null },
            { id: 15, nom: 'Diane Essomba', note: 10.5 },
        ]
    },
]

function Avatar({ nom }) {
    const initiales = nom.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    const colors = ['bg-cyan-500', 'bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500']
    const color = colors[nom.charCodeAt(0) % colors.length]
    return (
        <div className={`h-7 w-7 ${color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 select-none`}>
            {initiales}
        </div>
    )
}

function NoteInput({ value, onChange }) {
    return (
        <input
            type="number" min={0} max={20} step={0.5}
            value={value ?? ''}
            onChange={e => {
                const v = e.target.value === '' ? null : Math.min(20, Math.max(0, parseFloat(e.target.value)))
                onChange(v)
            }}
            placeholder="—"
            className="w-20 text-center text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100 placeholder:text-slate-300"
        />
    )
}

export default function ChefDeptNotes() {
    const [ues, setUes] = useState(UES)
    const [ueActive, setUeActive] = useState(UES[0].id)
    const [saved, setSaved] = useState(false)

    const ue = ues.find(u => u.id === ueActive)

    function handleNote(etudiantId, note) {
        setUes(prev => prev.map(u =>
            u.id !== ueActive ? u : {
                ...u,
                etudiants: u.etudiants.map(e => e.id === etudiantId ? { ...e, note } : e)
            }
        ))
    }

    function handleSave() {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    const nbSaisis = ue.etudiants.filter(e => e.note !== null).length
    const nbTotal = ue.etudiants.length
    const moyenne = nbSaisis > 0
        ? (ue.etudiants.filter(e => e.note !== null).reduce((s, e) => s + e.note, 0) / nbSaisis).toFixed(2)
        : '—'
    const complet = nbSaisis === nbTotal

    return (
        <div className="p-6 space-y-5">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Notes filière</h1>
                    <p className="text-sm text-slate-500 mt-1">Filière Informatique — Saisie des notes par UE</p>
                </div>
                <button onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium transition-colors">
                    <Save className="h-4 w-4" />
                    {saved ? 'Enregistré !' : 'Enregistrer'}
                </button>
            </div>

            {/* Sélecteur UE */}
            <div className="flex flex-wrap gap-2">
                {ues.map(u => {
                    const nb = u.etudiants.filter(e => e.note !== null).length
                    const tot = u.etudiants.length
                    const done = nb === tot
                    return (
                        <button key={u.id} onClick={() => setUeActive(u.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${ueActive === u.id
                                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-cyan-300'
                                }`}>
                            {done
                                ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                                : <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                            }
                            <span>{u.intitule}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${ueActive === u.id ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-500'
                                }`}>{nb}/{tot}</span>
                        </button>
                    )
                })}
            </div>

            {/* Infos UE active */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                        <p className="text-sm font-semibold text-slate-800">{ue.intitule}</p>
                        <p className="text-xs text-slate-400">{ue.code} · {ue.niveau} · Semestre {ue.semestre}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Saisis : <strong className="text-slate-800">{nbSaisis}/{nbTotal}</strong></span>
                        <span>Moyenne : <strong className={`${parseFloat(moyenne) >= 10 ? 'text-emerald-600' : 'text-rose-600'}`}>{moyenne}</strong></span>
                        {complet && (
                            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                <Check className="h-3.5 w-3.5" /> Complet
                            </span>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <th className="text-left px-5 py-3 font-semibold">Étudiant</th>
                                <th className="text-center px-4 py-3 font-semibold">Note /20</th>
                                <th className="text-center px-4 py-3 font-semibold">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {ue.etudiants.map(e => (
                                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar nom={e.nom} />
                                            <span className="font-medium text-slate-800">{e.nom}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center">
                                            <NoteInput value={e.note} onChange={note => handleNote(e.id, note)} />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {e.note === null ? (
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">en attente</span>
                                        ) : e.note >= 10 ? (
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">validée</span>
                                        ) : (
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">en difficulté</span>
                                        )}
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